---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/nft
  - sector/options
  - sector/token
  - sector/zk
protocol: "[[Linea]]"
auditors:
  - "[[Dacian]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-05-24-cyfrin-linea.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[bridge-stuck-asset]]"
---
# `TokenBridge::bridgeToken` allows 1-way `ERC721` bridging causing users to permanently lose their nfts

- id: 33298
- impact: HIGH
- protocol: [[Linea]]
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2024-05-24-cyfrin-linea.md

## Summary


This bug report is about an issue with the `TokenBridge` contract. The `TokenBridge::bridgeToken` function is supposed to only support `ERC20` tokens, but it also accepts `ERC721` tokens. This causes a problem when users try to bridge back to the L1, as it always reverts and the tokens are permanently stuck in the `TokenBridge` contract.

To demonstrate this issue, a new file called `contracts/tokenBridge/mocks/MockERC721.sol` was added and a test was added to the `test/tokenBridge/E2E.ts` file. This test shows that the `TokenBridge` contract accepts `ERC721` tokens and successfully bridges them to the L2, but when the user tries to bridge them back to the L1, it fails.

The recommended solution is to prevent the `TokenBridge` contract from accepting `ERC721` tokens. One way to do this is by changing the `TokenBridge::_safeDecimals` function to revert if the call fails, as `ERC20` tokens should always provide their decimals while `ERC721` tokens do not have decimals. Another option would be to use `ERC165` interface detection, but not all `ERC721` tokens support this.

The bug has been fixed in the Linea codebase and has been verified by Cyfrin. The fix can be found in the commit [35c7807](https://github.com/Consensys/zkevm-monorepo/commit/35c7807756ccac2756be7da472f5e6ce0fd9b16a#diff-e5dcf44cdbba69f5a1f8fc58700577ce57caac0c15a5d5fb63e0620aeced62d4L435-R446) merged in [PR3249](https://github.com/Consensys/zkevm-monorepo/pull/3249/files#diff-e5dcf44cdbba69f5a1f8fc58700577ce57caac0c15a5d5fb63e0620aeced62d4L435-R449).

## Details

**Description:** `TokenBridge::bridgeToken` is only intended to support `ERC20` tokens however it quite happily accepts `ERC721` tokens and is able to successfully bridge them over to the L2. But when users attempt to bridge back to the L1 this always reverts resulting in user nfts being permanently stuck inside the `TokenBridge` contract.

This was not introduced in the latest changes but is present in the current mainnet `TokenBridge` [code](https://github.com/Consensys/linea-contracts/blob/main/contracts/tokenBridge/TokenBridge.sol).

**Proof of Concept:** Add new file `contracts/tokenBridge/mocks/MockERC721.sol`:
```solidity
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721 {
  constructor(string memory _tokenName, string memory _tokenSymbol) ERC721(_tokenName, _tokenSymbol) {}

  function mint(address _account, uint256 _tokenId) public returns (bool) {
    _mint(_account, _tokenId);
    return true;
  }
}
```

Add this new test to `test/tokenBridge/E2E.ts` under the `Bridging` section:
```typescript
it("Can erroneously bridge ERC721 and can't bridge it back", async function () {
  const {
    user,
    l1TokenBridge,
    l2TokenBridge,
    tokens: { L1DAI },
    chainIds,
  } = await loadFixture(deployContractsFixture);

  // deploy ERC721 contract
  const ERC721 = await ethers.getContractFactory("MockERC721");
  let mockERC721 = await ERC721.deploy("MOCKERC721", "M721");
  await mockERC721.waitForDeployment();

  // mint user some NFTs
  const bridgedNft = 5;
  await mockERC721.mint(user.address, 1);
  await mockERC721.mint(user.address, 2);
  await mockERC721.mint(user.address, 3);
  await mockERC721.mint(user.address, 4);
  await mockERC721.mint(user.address, bridgedNft);

  const mockERC721Address = await mockERC721.getAddress();
  const l1TokenBridgeAddress = await l1TokenBridge.getAddress();
  const l2TokenBridgeAddress = await l2TokenBridge.getAddress();

  // user approves L1 token bridge to spend nft to be bridged
  await mockERC721.connect(user).approve(l1TokenBridgeAddress, bridgedNft);

  // user bridges their nft
  await l1TokenBridge.connect(user).bridgeToken(mockERC721Address, bridgedNft, user.address);

  // verify user has lost their nft which is now owned by L1 token bridge
  expect((await mockERC721.ownerOf(bridgedNft))).to.be.equal(l1TokenBridgeAddress);

  // verify user has received 1 token on the bridged erc20 version which
  // the token bridge created
  const l2TokenAddress = await l2TokenBridge.nativeToBridgedToken(chainIds[0], mockERC721Address);
  const bridgedToken = await ethers.getContractFactory("BridgedToken");
  const l2Token = bridgedToken.attach(l2TokenAddress) as BridgedToken;

  const l2ReceivedTokenAmount = 1;

  expect(await l2Token.balanceOf(user.address)).to.be.equal(l2ReceivedTokenAmount);
  expect(await l2Token.totalSupply()).to.be.equal(l2ReceivedTokenAmount);

  // now user attempts to bridge back which fails
  await l2Token.connect(user).approve(l2TokenBridgeAddress, l2ReceivedTokenAmount);
  await expectRevertWithReason(
    l2TokenBridge.connect(user).bridgeToken(l2TokenAddress, l2ReceivedTokenAmount, user.address),
    "SafeERC20: low-level call failed",
  );
});
```

Run the test with: `npx hardhat test --grep "Can erroneously bridge ERC721"`

**Recommended Mitigation:** `TokenBridge` should not allow users to bridge `ERC721` tokens. The reason it currently does is because the `ERC721` interface is very similar to the `ERC20` interface. One option for preventing this is to change `TokenBridge::_safeDecimals` to revert if the call fails as:
* `ERC20` tokens should always provide their decimals
* `ERC721` tokens don't have decimals

Another option would be using `ERC165` interface detection but not all nfts support this.

**Linea:**
Fixed in commit [35c7807](https://github.com/Consensys/zkevm-monorepo/commit/35c7807756ccac2756be7da472f5e6ce0fd9b16a#diff-e5dcf44cdbba69f5a1f8fc58700577ce57caac0c15a5d5fb63e0620aeced62d4L435-R446) merged in [PR3249](https://github.com/Consensys/zkevm-monorepo/pull/3249/files#diff-e5dcf44cdbba69f5a1f8fc58700577ce57caac0c15a5d5fb63e0620aeced62d4L435-R449).

**Cyfrin:** Verified.

\clearpage
