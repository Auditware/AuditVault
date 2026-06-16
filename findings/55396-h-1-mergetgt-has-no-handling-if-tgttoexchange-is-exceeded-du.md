---
tags:
  - lang/solidity
  - sector/bridge
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
protocol: "[[THORWallet]]"
auditors:
  - Striking\_Lions
report: "https://code4rena.com/reports/2025-02-thorwallet"
genome:
  - "[[integer-bounds]]"
  - "[[known-pattern]]"
---
# [H-1] MergeTgt has no handling if TGT*TO*EXCHANGE is exceeded during the exchange period

- id: 55396
- impact: HIGH
- protocol: THORWallet
- reporter: Striking\_Lions (Code4rena)
- source: https://code4rena.com/reports/2025-02-thorwallet

## Summary


The MergeTgt contract has hardcoded amounts of TGT and TITN, which are used for rate calculation and depositing TITN to be claimed. However, there is no limit on the deposited TGT, which means if the amount exceeds a certain value, users will not be able to claim or retrieve their TGT back. This also causes an overflow issue in the withdrawRemainingTitn function. The likelihood of this happening is medium and the impact is high as it can result in loss of user funds and break the contract logic. A proof of concept test has been provided to demonstrate the issue. The recommended mitigation steps include limiting the total deposits to TGT or TITN values. The issue has been confirmed and commented by the THORWallet team and has been mitigated in their code. The status of the mitigation has been confirmed by multiple reviewers.

## Details



<https://github.com/code-423n4/2025-02-thorwallet/blob/98d7e936518ebd80e2029d782ffe763a3732a792/contracts/MergeTgt.sol# L81>

### Finding description and impact

MergeTgt has hardcoded amounts of TGT*TO*EXCHANGE and TITN*ARB. Their ratio is used for rate calculation and TITN*ARB amount of TITN is deposited to be claimed.

The contract has no actual logic which would limit the deposited Tgt to MergeTgt. This means if this amount is crossed, any last claimers will not be able to do so or retrieve their Tgt back.

This same vulnerability also introduces an overflow in `withdrawRemainingTitn`. Since TGT is allowed to exceed the hardcoded value, the claimable TINT exceeds the actual mergeTgt contract TITN balance.

And this line overflows, as `remainingTitnAfter1Year` becomes less than the `initialTotalClaimable`.
```

uint256 unclaimedTitn = remainingTitnAfter1Year - initialTotalClaimable;
```

Likelihood: Medium - The total Tgt of all users has to exceed TGT*TO*EXCHANGE. According to blockchain explorers, ARB has 447,034,102 and ETH has 897,791,792, which is more than double the TGT*TO*EXCHANGE of 579,000,000, so quite likely.

Impact: High - loss of user funds and breaking contract logic (revert on claim).

### Proof of Concept

A modified MNrgeTgt.test.ts. Main modifications:

* TGT total supply is increased above 579*000*000
* All user total TGT deposit to mergeTGT is above 579*000*000

Steps in tests:

* User1 deposits 100 TGT
* User2 deposits 578999999 TGT
* User1 claims successfully
* User2 claim fails due to mergeTgt not having enough TITN.
```

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { time } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { Contract, ContractFactory } from 'ethers'
import { deployments, ethers } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'

describe('Audit MergeTgt tests', function () {
    // Constant representing a mock Endpoint ID for testing purposes
    const eidA = 1
    const eidB = 2
    // Other variables to be used in the test suite
    let Titn: ContractFactory
    let MergeTgt: ContractFactory
    let Tgt: ContractFactory
    let EndpointV2Mock: ContractFactory
    let ownerA: SignerWithAddress
    let ownerB: SignerWithAddress
    let endpointOwner: SignerWithAddress
    let user1: SignerWithAddress
    let user2: SignerWithAddress
    let user3: SignerWithAddress
    let baseTITN: Contract
    let arbTITN: Contract
    let mergeTgt: Contract
    let tgt: Contract
    let mockEndpointV2A: Contract
    let mockEndpointV2B: Contract
    // Before hook for setup that runs once before all tests in the block
    before(async function () {
        // Contract factory for our tested contract
        Titn = await ethers.getContractFactory('Titn')
        MergeTgt = await ethers.getContractFactory('MergeTgt')
        Tgt = await ethers.getContractFactory('Tgt')
        // Fetching the first three signers (accounts) from Hardhat's local Ethereum network
        const signers = await ethers.getSigners()
        ;[ownerA, ownerB, endpointOwner, user1, user2, user3] = signers
        // The EndpointV2Mock contract comes from @layerzerolabs/test-devtools-evm-hardhat package
        // and its artifacts are connected as external artifacts to this project
        const EndpointV2MockArtifact = await deployments.getArtifact('EndpointV2Mock')
        EndpointV2Mock = new ContractFactory(EndpointV2MockArtifact.abi, EndpointV2MockArtifact.bytecode, endpointOwner)
    })

    beforeEach(async function () {
        // Deploying a mock LZEndpoint with the given Endpoint ID
        mockEndpointV2A = await EndpointV2Mock.deploy(eidA)
        mockEndpointV2B = await EndpointV2Mock.deploy(eidB)
        // Deploying two instances of the TITN contract with different identifiers and linking them to the mock LZEndpoint
        baseTITN = await Titn.deploy(
            'baseTitn',
            'baseTITN',
            mockEndpointV2A.address,
            ownerA.address,
            ethers.utils.parseUnits('1000000000', 18)
        )
        arbTITN = await Titn.deploy(
            'arbTitn',
            'arbTITN',
            mockEndpointV2B.address,
            ownerB.address,
            ethers.utils.parseUnits('0', 18)
        )
        // Setting destination endpoints in the LZEndpoint mock for each TITN instance
        await mockEndpointV2A.setDestLzEndpoint(arbTITN.address, mockEndpointV2B.address)
        await mockEndpointV2B.setDestLzEndpoint(baseTITN.address, mockEndpointV2A.address)
        // Setting each TITN instance as a peer of the other in the mock LZEndpoint
        await baseTITN.connect(ownerA).setPeer(eidB, ethers.utils.zeroPad(arbTITN.address, 32))
        await arbTITN.connect(ownerB).setPeer(eidA, ethers.utils.zeroPad(baseTITN.address, 32))

        // Defining the amount of tokens to send and constructing the parameters for the send operation
        const tokensToSend = ethers.utils.parseEther('173700000')
        // Defining extra message execution options for the send operation
        const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()
        const sendParam = [
            eidB,
            ethers.utils.zeroPad(ownerB.address, 32),
            tokensToSend,
            tokensToSend,
            options,
            '0x',
            '0x',
        ]
        // Fetching the native fee for the token send operation
        const [nativeFee] = await baseTITN.quoteSend(sendParam, false)
        // Executing the send operation from TITN contract
        await baseTITN.send(sendParam, [nativeFee, 0], ownerA.address, { value: nativeFee })

        // Deply MockTGT contract
        // @audit increased total supply above mergeTGT hardcoded 579_000_000
        tgt = await Tgt.deploy('Tgt', 'TGT', ownerB.address, ethers.utils.parseUnits('100000000000', 18))

        // Deploy MergeTgt contract
        mergeTgt = await MergeTgt.deploy(tgt.address, arbTITN.address, ownerB.address)

        // Arbitrum setup
        await arbTITN.connect(ownerB).setTransferAllowedContract(mergeTgt.address)
        await mergeTgt.connect(ownerB).setLaunchTime()
        await mergeTgt.connect(ownerB).setLockedStatus(1)

        // now the admin should deposit all ARB.TITN into the mergeTGT contract
        await arbTITN.connect(ownerB).approve(mergeTgt.address, ethers.utils.parseUnits('173700000', 18))
        await mergeTgt.connect(ownerB).deposit(arbTITN.address, ethers.utils.parseUnits('173700000', 18))

        // let's send some TGT to user1 and user2
        // @audit send close to 579_000_000 TGT to user1 (just above the mergeTGT hardcoded value)
        await tgt.connect(ownerB).transfer(user1.address, ethers.utils.parseUnits('578999999', 18))
        await tgt.connect(ownerB).transfer(user2.address, ethers.utils.parseUnits('1000', 18))
        await tgt.connect(ownerB).transfer(user3.address, ethers.utils.parseUnits('1000', 18))
    })

    describe('General tests', function () {
        it('Users can\'t claim if more than TGT limit is deposited', async function () {
            // transfer TGT to the merge contract
            await tgt.connect(user1).approve(mergeTgt.address, ethers.utils.parseUnits('578999999', 18))
            await tgt.connect(user1).transferAndCall(mergeTgt.address, ethers.utils.parseUnits('578999999', 18), '0x')

            await tgt.connect(user2).approve(mergeTgt.address, ethers.utils.parseUnits('100', 18))
            await tgt.connect(user2).transferAndCall(mergeTgt.address, ethers.utils.parseUnits('100', 18), '0x')

            const claimableAmountUser2 = await mergeTgt.claimableTitnPerUser(user2.address)
            await mergeTgt.connect(user2).claimTitn(claimableAmountUser2)
            // claim TITN
            const claimableAmountUser1 = await mergeTgt.claimableTitnPerUser(user1.address)
            expect(claimableAmountUser1.toString()).to.be.equal('173699999700000000000000000')
            // @audit fails due to insufficient TITN in mergeTGT
            await mergeTgt.connect(user1).claimTitn(claimableAmountUser1)
        })
    })
})
```

Test final claim fails with:
```

 Error: VM Exception while processing transaction: reverted with custom error 'ERC20InsufficientBalance("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", 173699970000000000000000000, 173699999700000000000000000)'
```

### Recommended mitigation steps

Limit the total deposits to TGT*TO*EXCHANGE by tracking how much TGT has already been deposited.
MergeTgt.sol
```

uint256 public totalTgtDeposited;
...
function onTokenTransfer(address from, uint256 amount, bytes calldata extraData) external nonReentrant {
...
  if (totalTgtDeposited + amount > TGT_TO_EXCHANGE) {
    revert TGTExceeded();
  }
  totalTgtDeposited += amount;

}
```

Or

the same idea, but limit the `totalTitnClaimable` by TITN\_ARB value. This will likely be more efficient, as the rate tgt/titn is dynamic.

**[cacaomatt (THORWallet) confirmed and commented](https://code4rena.com/audits/2025-02-thorwallet/submissions/F-6?commentParent=WkFsWvrbfsy):**

> This is related to [S-88](https://code4rena.com/evaluate/2025-02-thorwallet/findings/S-88).
> The fix for both of them (same issue, different approach) can be found on the same PR [here](https://github.com/THORWallet/TGT-TITN-merge-contracts/pull/2).

**[THORWallet mitigated](https://github.com/code-423n4/2025-03-thorwallet-mitigation?tab=readme-ov-file# findings-being-mitigated):**.

> The PR [here](https://github.com/THORWallet/TGT-TITN-merge-contracts/tree/audit-2) fixes the issue when depositing more TGT and specified in the contract.

**Status:** Mitigation confirmed. Full details in reports from [shaflow2](https://code4rena.com/evaluate/2025-03-thorwallet-mitigation-review/submissions/S-3), [web3km](https://code4rena.com/evaluate/2025-03-thorwallet-mitigation-review/submissions/S-14), and [kn0t](https://code4rena.com/evaluate/2025-03-thorwallet-mitigation-review/submissions/S-12).

---


