---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/stable
protocol: "[[USSD]]"
auditors:
  - "[[0xHati]]"
  - "[[0xlmanini]]"
  - "[[0xyPhilic]]"
  - "[[Angry_Mustache_Man]]"
  - "[[Bahurum]]"
  - "[[J4de]]"
  - "[[Vagner]]"
  - "[[WATCHPUG]]"
  - "[[ast3ros]]"
  - "[[auditsea]]"
  - "[[carrotsmuggler]]"
  - "[[curiousapple]]"
  - "[[innertia]]"
  - "[[nobody2018]]"
  - "[[qpzm]]"
  - "[[saidam017]]"
  - "[[sashik_eth]]"
  - "[[simon135]]"
  - "[[smiling_heretic]]"
  - "[[toshii]]"
report: "https://github.com/sherlock-audit/2023-05-USSD-judging"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-2: `USSDRebalancer.sol#SellUSSDBuyCollateral` the check of whether collateral is DAI is wrong

- id: 19131
- impact: HIGH
- protocol: [[USSD]] - Autonomous Secure Dollar
- reporter: curiousapple (Sherlock)
- source: N/A

## Summary


This bug report is about a vulnerability in the `SellUSSDBuyCollateral` function of the USSDRebalancer.sol. The issue was discovered by 0xHati, 0xlmanini, 0xyPhilic, Angry\_Mustache\_Man, Bahurum, J4de, Vagner, WATCHPUG, ast3ros, auditsea, carrotsmuggler, curiousapple, innertia, nobody2018, qpzm, saidam017, sashik\_eth, simon135, smiling\_heretic, toshii. The issue is that the `SellUSSDBuyCollateral` function uses `||` instead of `&&` to check whether the collateral is DAI. This is wrong and may cause the `SellUSSDBuyCollateral` function to revert and make USSD unstable. The code snippet can be found at https://github.com/USSDofficial/ussd-contracts/blob/f44c726371f3152634bcf0a3e630802e39dec49c/contracts/USSDRebalancer.sol#L199. The recommendation is to replace the `||` with `&&` in the code snippet.

## Details

Source: https://github.com/sherlock-audit/2023-05-USSD-judging/issues/193 

## Found by 
0xHati, 0xlmanini, 0xyPhilic, Angry\_Mustache\_Man, Bahurum, J4de, Vagner, WATCHPUG, ast3ros, auditsea, carrotsmuggler, curiousapple, innertia, nobody2018, qpzm, saidam017, sashik\_eth, simon135, smiling\_heretic, toshii
## Summary

The `SellUSSDBuyCollateral` function use `||` instand of `&&` to check whether the collateral is DAI. It is wrong and may cause `SellUSSDBuyCollateral` function revert.

## Vulnerability Detail

```solidity
196       for (uint256 i = 0; i < collateral.length; i++) {
197         uint256 collateralval = IERC20Upgradeable(collateral[i].token).balanceOf(USSD) * 1e18 / (10**IERC20MetadataUpgradeable(collateral[i].token).decimals()) * collateral[i].oracle.getPriceUSD() / 1e18;
198         if (collateralval * 1e18 / ownval < collateral[i].ratios[flutter]) {
199 >>        if (collateral[i].token != uniPool.token0() || collateral[i].token != uniPool.token1()) {
200             // don't touch DAI if it's needed to be bought (it's already bought)
201             IUSSD(USSD).UniV3SwapInput(collateral[i].pathbuy, daibought/portions);
202           }
203         }
204       }
```

Line 199 should use `&&` instand of `||` to ensure that the token is not DAI. If the token is DAI, the `UniV3SwapInput` function will revert because that DAI's `pathbuy` is empty.

## Impact

The `SellUSSDBuyCollateral` will revert and USSD will become unstable.

## Code Snippet

https://github.com/USSDofficial/ussd-contracts/blob/f44c726371f3152634bcf0a3e630802e39dec49c/contracts/USSDRebalancer.sol#L199

## Tool used

Manual Review

## Recommendation

```diff
      for (uint256 i = 0; i < collateral.length; i++) {
        uint256 collateralval = IERC20Upgradeable(collateral[i].token).balanceOf(USSD) * 1e18 / (10**IERC20MetadataUpgradeable(collateral[i].token).decimals()) * collateral[i].oracle.getPriceUSD() / 1e18;
        if (collateralval * 1e18 / ownval < collateral[i].ratios[flutter]) {
-         if (collateral[i].token != uniPool.token0() || collateral[i].token != uniPool.token1()) {
+         if (collateral[i].token != uniPool.token0() && collateral[i].token != uniPool.token1()) {
            // don't touch DAI if it's needed to be bought (it's already bought)
            IUSSD(USSD).UniV3SwapInput(collateral[i].pathbuy, daibought/portions);
          }
        }
      }
```
