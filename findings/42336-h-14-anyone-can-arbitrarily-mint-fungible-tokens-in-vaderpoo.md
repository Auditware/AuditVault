---
tags:
  - lang/solidity
  - sector/dex
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
protocol: "[[Vader Protocol]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2021-11-vader"
genome:
  - "[[fake-account-substitution]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# [H-14] Anyone Can Arbitrarily Mint Fungible Tokens In `VaderPoolV2.mintFungible()`

- id: 42336
- impact: HIGH
- protocol: [[Vader Protocol]]
- reporter: Code4rena (Code4rena)
- source: https://code4rena.com/reports/2021-11-vader

## Summary


The `mintFungible()` function in the VaderPoolV2.sol contract allows any user to mint liquidity pool fungible tokens without first being approved as a spender. This can be exploited by a malicious user who can frontrun the transaction and transfer funds to their own address instead of the intended recipient. This bug was discovered through manual code review and discussions with the developer. To fix this issue, it is recommended to remove the `from` argument in `mintFungible()` and update the `safeTransferFrom()` calls to transfer from `msg.sender` instead. The developer initially disputed the issue, stating that the pool contracts are not meant to be interacted with directly, but later confirmed that the functions related to minting are indeed vulnerable.

## Details

_Submitted by leastwood_

#### Impact

The `mintFungible()` function is callable by any user that wishes to mint liquidity pool fungible tokens. The protocol expects a user to first approve the contract as a spender before calling `mintFungible()`. However, any arbitrary user could monitor the blockchain for contract approvals that match `VaderPoolV2.sol` and effectively frontrun their call to `mintFungible()` by setting the `to` argument to their own address. As a result, the `nativeDeposit` and `foreignDeposit` amounts are transferred from the victim, and LP tokens are minted and finally transferred to the malicious user who is represented by the `to` address.

#### Proof of Concept

<https://github.com/code-423n4/2021-11-vader/blob/main/contracts/dex-v2/pool/VaderPoolV2.sol#L284-L335>

#### Tools Used

Manual code review.
Discussions with dev.

#### Recommended Mitigation Steps

Consider removing the `from` argument in `mintFungible()` and update the `safeTransferFrom()` calls to instead transfer from `msg.sender`.

**[SamSteinGG (Vader) disputed](https://github.com/code-423n4/2021-11-vader-findings/issues/147#issuecomment-979165275):**
 > The pool contracts, similarly to Uniswap V2, are never meant to be interacted with directly.

**[alcueca (judge) commented](https://github.com/code-423n4/2021-11-vader-findings/issues/147#issuecomment-991477978):**
 > You need to enforce that somehow.

**[SamSteinGG (Vader) confirmed](https://github.com/code-423n4/2021-11-vader-findings/issues/147#issuecomment-995730174):**
 > Upon second consideration, the functions relating to the minting of synths and wrapped tokens should have had the onlyRouter modifier and thus are indeed vulnerable. Issue accepted.
>
