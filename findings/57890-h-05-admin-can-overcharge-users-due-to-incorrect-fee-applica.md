---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Harmonixfinance Hyperliquid]]"
auditors:
  - Shieldify Security
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md"
genome:
  - "[[fee-accounting]]"
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# [H-05] Admin Can Overcharge Users Due to Incorrect Fee Application in `FundContract`

- id: 57890
- impact: HIGH
- protocol: Harmonixfinance Hyperliquid
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/HarmonixFinance-Hyperliquid-Security-Review.md

## Summary


The `FundContract` is charging users higher fees than intended during withdrawals due to incorrect calculations. This happens because the contract uses the management fee instead of the trading fee. This bug is located in the `_withdraw()` function and the `initiateWithdrawal()` function in the `vaults/hyperliquid/fundContract.sol` file. The impact of this bug is that users are paying fees at a rate nearly 30 times higher than expected, resulting in financial losses. To fix this issue, the team recommends storing the correct trading fee during withdrawal initiation and using it instead of the management fee in the `_withdraw()` function. The team has fixed this bug.

## Details

## Severity

High Risk

## Description

The `FundContract` incorrectly applies `management fees` instead of `trading fees` during withdrawals, leading to users being overcharged. The issue arises in the `_withdraw()` function, where the sharesTradingFee is incorrectly calculated as `(_shares * userWithdraw.managementFee) / userWithdraw.shares`, instead of using the trading fee stored in the user's withdrawal data.

Additionally, the trading fee is not properly set during withdrawal initiation (`initiateWithdrawal()`). While the management fee is calculated and stored in the `UserWithdraw.WithdrawData` struct, the trading fee remains unset, causing the contract to default to using the management fee again during withdrawals.

## Location of Affected Code

File: [vaults/hyperliquid/fundContract.sol](https://github.com/harmonixfi/core-contracts/blob/f02157aba919dcdd4a1133669361224108c5caef/contracts/vaults/hyperliquid/fundContract.sol)

```solidity
uint256 sharesTradingFee = (_shares * userWithdraw.managementFee) / userWithdraw.shares;
```

## Impact

Since the trading fee (0.035%) is significantly lower than the management fee (1%), users are charged substantially higher fees than intended. This results in financial losses for users withdrawing funds, as they pay fees at a rate nearly 30 times higher than expected.

## Recommendation

To mitigate this issue, consider applying the following changes:

- Store the correct trading fee during withdrawal initiation by modifying `initiateWithdrawal()` to include the trading fee in the `UserWithdraw.WithdrawData` struct.
- Use the stored trading fee instead of the management fee in the `_withdraw()` function when calculating `sharesTradingFee`.

## Team Response

Fixed.
