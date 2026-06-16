---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/oracle
  - sector/staking
  - sector/token
protocol: "[[Notional]]"
auditors:
  - "[[0xPhantom2]]"
  - "[[Bluedragon]]"
  - "[[Schnilch]]"
  - "[[albahaca0000]]"
  - "[[boredpukar]]"
  - "[[jasonxiale]]"
  - "[[sergei2340]]"
  - "[[touristS]]"
  - "[[xiaoming90]]"
  - "[[yoooo]]"
  - "[[zhuying]]"
report: "https://github.com/sherlock-audit/2025-06-notional-exponent-judging"
genome:
  - "[[slippage]]"
  - "[[indirect-loss]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
---
# H-11: Missing Slippage Protection in Expired PT Redemption Causes User Fund Loss

- id: 62492
- impact: HIGH
- protocol: [[Notional]] Exponent
- reporter: sergei2340 (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in the `_redeemPT` function of the PendlePTLib.sol contract. When PT tokens expire, the function calls `redeemExpiredPT` which performs `sy.redeem` with `minTokenOut: 0`, leaving users vulnerable to slippage losses. This affects both instant redemption and withdraw initiation flows. The impact is amplified because users have no control over the redemption rate and cannot protect themselves against adverse market conditions or MEV attacks. A proof of concept scenario is provided and a recommended mitigation is suggested, which involves modifying the `redeemExpiredPT` function to accept a `minTokenOut` parameter and updating the calling functions to provide appropriate slippage protection. 

## Details


Source: https://github.com/sherlock-audit/2025-06-notional-exponent-judging/issues/874 

## Found by 
0xPhantom2, Bluedragon, Schnilch, albahaca0000, boredpukar, jasonxiale, sergei2340, touristS, xiaoming90, yoooo, zhuying

## Summary:

When PT tokens are expired, the `_redeemPT` function calls `redeemExpiredPT` which performs `sy.redeem` with `minTokenOut: 0`, allowing SY contracts that perform external DEX swaps to cause slippage losses without protection in both instant redemption and withdraw initiation flows.

## Vulnerability Details:

The vulnerability occurs in the `_redeemPT` function which handles both expired and non-expired PT redemption. When `PT.isExpired()` returns true, it calls `PendlePTLib.redeemExpiredPT`.

The [`redeemExpiredPT`](https://github.com/sherlock-audit/2025-06-notional-exponent/blob/82c87105f6b32bb362d7523356f235b5b07509f9/notional-v4/src/staking/PendlePTLib.sol#L87) function performs the redemption by calling `sy.redeem` with `minTokenOut: 0`. This means there's no slippage protection when the SY contract performs external DEX swaps or trades to convert the redeemed tokens to the target `tokenOutSy`.

**Code Snippet:**

```solidity
function redeemExpiredPT(
        IPPrincipalToken pt,
        IPYieldToken yt,
        IStandardizedYield sy,
        address tokenOutSy,
        uint256 netPtIn
    ) external returns (uint256 netTokenOut) {
        // PT Tokens are known to be ERC20 compliant
        pt.transfer(address(yt), netPtIn);
        uint256 netSyOut = yt.redeemPY(address(sy));
@->     netTokenOut = sy.redeem(address(this), netSyOut, tokenOutSy, 0, true); // AUDIT: no slippage protection
    }
```

This affects two critical flows:

1. **Instant Redemption**: Called via `_executeInstantRedemption`.
2. **Withdraw Initiation**: Called via `_initiateWithdraw`.

## Impact

Users suffer direct fund loss when SY contracts perform unfavorable external DEX swaps during expired PT redemption, as the zero slippage protection allows maximum extractable value attacks and natural slippage losses.

The impact is amplified because users have no control over the redemption rate and cannot protect themselves against adverse market conditions or MEV attacks during the SY redemption process.

## Proof of Concept (Scenario step by step):

1. PT tokens expire and user initiates exit position
2. `_redeemPT` is called and detects `PT.isExpired() == true`
3. `PendlePTLib.redeemExpiredPT` is called with the expired PT amount
4. PT tokens are transferred to YT contract and `yt.redeemPY` is called
5. `sy.redeem` is called with `minTokenOut: 0`
6. SY contract performs external DEX swap with unfavorable rates due to market conditions or MEV attacks
7. User receives significantly fewer `sUSDe` tokens than expected with no recourse
8. Loss propagates through either instant redemption or withdraw request flows

## Recommended Mitigation:

Modify the `redeemExpiredPT` function to accept a `minTokenOut` parameter and pass it through to `sy.redeem`. Update both calling functions to calculate and provide appropriate slippage protection based on expected redemption rates.

```solidity
function redeemExpiredPT(
    IPPrincipalToken pt,
    IPYieldToken yt,
    IStandardizedYield sy,
    address tokenOutSy,
    uint256 netPtIn,
    uint256 minTokenOut  // Add slippage protection parameter
) external returns (uint256 netTokenOut) {
    pt.transfer(address(yt), netPtIn);
    uint256 netSyOut = yt.redeemPY(address(sy));
    netTokenOut = sy.redeem(address(this), netSyOut, tokenOutSy, minTokenOut, true);
}
```
