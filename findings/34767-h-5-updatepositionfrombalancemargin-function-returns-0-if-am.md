---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/lending
  - sector/perpetuals
protocol: "[[Elfi]]"
auditors:
  - "[[jennifer37]]"
report: "https://github.com/sherlock-audit/2024-05-elfi-protocol-judging"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-5: `updatePositionFromBalanceMargin` function returns "0" if amount to be updated is negative

- id: 34767
- impact: HIGH
- protocol: [[Elfi]]
- reporter: jennifer37 (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with the `updatePositionFromBalanceMargin` function in the ELFi protocol. The function is supposed to decrease the "fromBalance" values of other cross positions when one position is closed in a loss. However, if the amount to be updated is negative, the function returns "0" and does not properly update the values. This can result in inaccurate "fromBalance" values and allow for more borrowing than intended. The bug has been identified by several individuals and the protocol team has already fixed it in a recent commit. The report includes a code snippet and a recommendation to change the order of lines in the function to fix the issue. 

## Details

Source: https://github.com/sherlock-audit/2024-05-elfi-protocol-judging/issues/36 

## Found by 
KrisRenZo, KupiaSec, chaduke, jennifer37, mstpr-brainbot, nikhil840096, whitehair0330
## Summary
When a cross position is closed all the other cross positions "fromBalance"s updated. If the amount to be updated is negative then the other positions "fromBalance" should be decreased to lower down their cross available value. However, the function logic always returns "0" prior to storage update before the return statement.
## Vulnerability Detail
Say Bob has 3 positions as follows:
WBTC SHORT (margin: 100, marginFromBalance: 100, initialMarginInUsd: 100, initialMarginInUsdFromBalance: 100)
SOL SHORT (margin: 100, marginFromBalance: 50, initialMarginInUsd: 100, initialMarginInUsdFromBalance: 50)
WETH SHORT (margin: 100, marginFromBalance 90, initialMarginInUsd: 100, initialMarginInUsdFromBalance: 90) 

Say the WBTC position is closed in loss such that there is a negative `settledMargin`. The `changeToken` will also be negative. Say the value for `changeToken` is -110.

Below lines will be executed in PositionMarginProcess::updatePositionFromBalanceMargin() function since the `changeToken` is negative. For SOL the `addBorrowMarginInUsd` will be 110 * 100 / 100 = 110.  Since this value is higher than `position.initialMarginInUsdFromBalance` the first if check will be executed and `position.initialMarginInUsdFromBalance` will be "0". Then, the actual changeAmount will be calculated right after, normally this value should be the 50 * 100 / 100 = 50 token. However, because the "position" is a storage pointer and its value is set to "0" before the `changeAmount` calculation, `changeAmount` calculation will also be "0". That means that when the loop goes to the WETH position, instead of only decreasing 60 tokens (110-50) it will also reset the entire `position.initialMarginInUsdFromBalance` for the WETH position. 
```solidity
else {
            uint256 addBorrowMarginInUsd = (-amount).toUint256().mul(position.initialMarginInUsd).div(
                position.initialMargin
            );
            if (position.initialMarginInUsdFromBalance <= addBorrowMarginInUsd) {
                position.initialMarginInUsdFromBalance = 0;
                changeAmount = position.initialMarginInUsdFromBalance.mul(position.initialMargin).div(
                    position.initialMarginInUsd
                );
            } else {
                position.initialMarginInUsdFromBalance -= addBorrowMarginInUsd;
                changeAmount = (-amount).toUint256();
            }
        }
```
## Impact
Entire "from balance" will be off. Account will have a lower "from balance" which means that the account can borrow more although it shouldn't be. 
No coded poc here because the issue is clear from text and easy to spot.  
## Code Snippet
https://github.com/sherlock-audit/2024-05-elfi-protocol/blob/8a1a01804a7de7f73a04d794bf6b8104528681ad/elfi-perp-contracts/contracts/process/PositionMarginProcess.sol#L274-L338
## Tool used

Manual Review

## Recommendation
Change the order of these lines to this:
```solidity
changeAmount = position.initialMarginInUsdFromBalance.mul(position.initialMargin).div(position.initialMarginInUsd);
position.initialMarginInUsdFromBalance = 0;
```



## Discussion

**0xELFi**

The same as: https://github.com/sherlock-audit/2024-05-elfi-protocol-judging/issues/3

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/0xCedar/elfi-perp-contracts/pull/15
