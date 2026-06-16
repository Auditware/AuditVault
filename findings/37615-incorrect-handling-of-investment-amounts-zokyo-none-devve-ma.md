---
tags:
  - lang/solidity
  - sector/dex
  - platform/zokyo
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Devve]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md"
genome:
  - "[[wrong-condition]]"
  - "[[variant]]"
  - "[[locked-funds]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fot-slippage]]"
---
# Incorrect Handling of Investment Amounts

- id: 37615
- impact: HIGH
- protocol: [[Devve]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-30-Devve.md

## Summary


The `investInProjects()` function in Treasury.sol has a bug where it does not check if the amount of money sent by the user matches the amount specified. This can lead to incorrect recording of investments and can result in overpayment or underpayment to the project owner. To fix this, the function should be updated to validate that the sent amount matches the specified amount. Additionally, in the `settleProjectOwnerFunds` function, the transferred amount should be based on `investorInvestedAmountPerProjectInETH` instead of `users.amount`. 

## Details

**Severity**: High

**Status**: Resolved 

**Description**

The `investInProjects()` function in Treasury.sol does not validate that `msg.value` matches `users.amount`. Instead, it adds `msg.value` to `investorInvestedAmountPerProjectInETH`. 

The following attack vectors may happen:

1. Users can send a different `msg.value` than specified in `users.amount`, leading to incorrect recording of investments. 

2. In the `settleProjectOwnerFunds` function, the transferred amount is based on `users.amount`, not `investorInvestedAmountPerProjectInETH`. This can result in either overpayment or underpayment to the project owner, depending on the actual `msg.value` sent during the investment.

```solidity
File: treasury.sol
1178:     function settleProjectOwnerFunds(Whitelist memory users) external  {
..
1191:             else {
1192:                 fundsWithdrawn[users.projectId][users.inETH] += _amountToWithdraw;
1193:                 uint deducedAmount = projectTotalCollectedInETH[users.projectId] - (projectTotalCollectedInETH[users.projectId] *(users.platformFee))/100;
1194:                 require (deducedAmount >= fundsWithdrawn[users.projectId][users.inETH],"check deducedAmount");
1195:                 payable(users.userAddress).transfer(_amountToWithdraw); //@audit this should be investorInvestedAmountPerProjectInETH
1196:                 projectTotalCollectedInETH[users.projectId]-=_amountToWithdraw;
1197:             }
```


**Recommendation**: 

Validate that `msg.value` equals `users.amount` in the `investInProjects` function to ensure the recorded investment amount matches the actual amount sent and in `settleProjectOwnerFunds` the transferred amount should be based on `investorInvestedAmountPerProjectInETH`.
