---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/lending
  - sector/stable
protocol: "[[USSD]]"
auditors:
  - "[[0xRobocop]]"
  - "[[0xlmanini]]"
  - "[[Aymen0909]]"
  - "[[Bahurum]]"
  - "[[Bauer]]"
  - "[[Juntao]]"
  - "[[Nyx]]"
  - "[[Proxy]]"
  - "[[VAD37]]"
  - "[[Vagner]]"
  - "[[WATCHPUG]]"
  - "[[__141345__]]"
  - "[[auditsea]]"
  - "[[carrotsmuggler]]"
  - "[[immeas]]"
  - "[[innertia]]"
  - "[[kiki_dev]]"
  - "[[pengun]]"
  - "[[qpzm]]"
  - "[[saidam017]]"
  - "[[sakshamguruji]]"
  - "[[toshii]]"
  - "[[tvdung94]]"
report: "https://github.com/sherlock-audit/2023-05-USSD-judging"
genome:
  - "[[precision-loss]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-6: Wrong computation of the amountToSellUnit variable

- id: 19135
- impact: HIGH
- protocol: [[USSD]] - Autonomous Secure Dollar
- reporter: qpzm (Sherlock)
- source: N/A

## Summary


This bug report is about the incorrect computation of the `amountToSellUnits` variable in the `BuyUSSDSellCollateral()` function in the `USSDRebalancer.sol` contract. The `amountToSellUnits` variable is used to sell an amount of collateral during a peg-down recovery event which should be equivalent (in USD) to the ratio of `amountToBuyLeftUSD / collateralval`. However, the code is written incorrectly which will lead to an incorrect amount of collateral to be sold. The incorrect code is found at line 121 of the `USSDRebalancer.sol` contract. The bug was found by 0xRobocop, 0xlmanini, Aymen0909, Bahurum, Bauer, Juntao, Nyx, Proxy, VAD37, Vagner, WATCHPUG, \_\_141345\_\_, auditsea, carrotsmuggler, immeas, innertia, kiki\_dev, pengun, qpzm, saidam017, sakshamguruji, toshii, and tvdung94. The recommendation is to delete the last 1e18 factor.

## Details

Source: https://github.com/sherlock-audit/2023-05-USSD-judging/issues/535 

## Found by 
0xRobocop, 0xlmanini, Aymen0909, Bahurum, Bauer, Juntao, Nyx, Proxy, VAD37, Vagner, WATCHPUG, \_\_141345\_\_, auditsea, carrotsmuggler, immeas, innertia, kiki\_dev, pengun, qpzm, saidam017, sakshamguruji, toshii, tvdung94
## Summary

The variable `amountToSellUnits` is computed wrongly in the code which will lead to an incorrect amount of collateral to be sold.

## Vulnerability Detail

The `BuyUSSDSellCollateral()` function is used to sell collateral during a peg-down recovery event. The computation of the amount to sell is computed using the following formula:

```solidity
// @audit-issue Wrong computation
uint256 amountToSellUnits = IERC20Upgradeable(collateral[i].token).balanceOf(USSD) * ((amountToBuyLeftUSD * 1e18 / collateralval) / 1e18) / 1e18;
```

The idea is to sell an amount which is equivalent (in USD) to the ratio of `amountToBuyLeftUSD / collateralval`. Flattening the equation it ends up as:

```solidity
uint256 amountToSellUnits = (collateralBalance * amountToBuyLeftUSD * 1e18) / (collateralval * 1e18 * 1e18);

// Reducing the equation
uint256 amountToSellUnits = (collateralBalance * amountToBuyLeftUSD) / (collateralval * 1e18);
```

`amountToBuyLeftUSD` and `collateralval` already have 18 decimals so their decimals get cancelled together which will lead the last 1e18 factor as not necessary.

## Impact

The contract will sell an incorrect amount of collateral during a peg-down recovery event.

## Code Snippet

https://github.com/sherlock-audit/2023-05-USSD/blob/6d7a9fdfb1f1ed838632c25b6e1b01748d0bafda/ussd-contracts/contracts/USSDRebalancer.sol#L121

## Tool used

Manual Review

## Recommendation

Delete the last 1e18 factor
