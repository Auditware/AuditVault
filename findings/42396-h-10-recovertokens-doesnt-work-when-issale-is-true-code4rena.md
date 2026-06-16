---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/token
protocol: "[[Streaming Protocol]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2021-11-streaming"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[cross-contract-state-consistency]]"
---
# [H-10] recoverTokens doesn't work when isSale is true

- id: 42396
- impact: HIGH
- protocol: [[Streaming Protocol]]
- reporter: Code4rena (Code4rena)
- source: https://code4rena.com/reports/2021-11-streaming

## Summary


The bug report discusses an issue with the `recoverTokens` function in the `Locke.sol` contract of the Streaming Protocol. This function is responsible for calculating the excess number of deposit tokens in the contract, but it breaks in the case where the `creatorClaimSoldTokens` function has been used to claim sold tokens. This is because the `redeemedDepositTokens` variable is not updated, causing the excess calculation to be incorrect. As a result, any attempts to recover deposit tokens from the contract would either fail or send less tokens than expected. The report recommends setting `redeemedDepositTokens` to be equal to `depositTokenAmount` in the `creatorClaimSoldTokens` function to fix this issue. The report also mentions that this bug has been found by multiple people and recommends upgrading the severity level to High as assets could be lost in this scenario. 

## Details

_Submitted by harleythedog, also found by kenzo, pedroais, hyh, and pauliax_

#### Impact

In `recoverTokens`, the logic to calculate the excess number of deposit tokens in the contract is:

    uint256 excess = ERC20(token).balanceOf(address(this)) - (depositTokenAmount - redeemedDepositTokens);

This breaks in the case where isSale is true and the deposit tokens have already been claimed through the use of `creatorClaimSoldTokens`. In this case, `redemeedDepositTokens` will be zero, and `depositTokenAmount` will still be at its original value when the streaming ended. As a result, any attempts to recover deposit tokens from the contract would either revert or send less tokens than should be sent, since the logic above would still think that there are the full amount of deposit tokens in the contract. This breaks the functionality of the function completely in this case.

#### Proof of Concept

See the excess calculation here: <https://github.com/code-423n4/2021-11-streaming/blob/56d81204a00fc949d29ddd277169690318b36821/Streaming/src/Locke.sol#L654>

See `creatorClaimSoldTokens` here: <https://github.com/code-423n4/2021-11-streaming/blob/56d81204a00fc949d29ddd277169690318b36821/Streaming/src/Locke.sol#L583>

Notice that `creatorClaimSoldTokens` does not change `depositTokenAmount` or `redeemedDepositTokens`, so the excess calculation will be incorrect in the case of sales.

#### Tools Used

Inspection

#### Recommended Mitigation Steps

I would recommend setting `redeemedDepositTokens` to be `depositTokenAmount` in the function `creatorClaimSoldTokens`, since claiming the sold tokens is like "redeeming" them in a sense. This would fix the logic issue in `recoverTokens`.

**[brockelmore (Streaming Protocol) commented](https://github.com/code-423n4/2021-11-streaming-findings/issues/121#issuecomment-989284471)**

**[0xean (judge) commented](https://github.com/code-423n4/2021-11-streaming-findings/issues/121#issuecomment-1013574494):**
 > upgrading to High as assets would be lost in the case outlined by the warden
> 
> `
> 3 - High: Assets can be stolen/lost/compromised directly (or indirectly if there is a valid attack path that does not have hand-wavy hypotheticals).
> `
