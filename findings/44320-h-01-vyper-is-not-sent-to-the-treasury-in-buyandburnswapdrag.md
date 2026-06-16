---
tags:
  - lang/solidity
  - lang/vyper
  - platform/shieldify
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Vyper]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Vyper-Boost-Security-Review.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# [H-01] [[Vyper]] is Not Sent To The Treasury In `BuyAndBurn.swapDragonXToVyperAndBurn()` Function

- id: 44320
- impact: HIGH
- protocol: Vyper Boost
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Vyper-Boost-Security-Review.md

## Summary

This bug report discusses a high-risk issue in the `BuyAndBurn.swapDragonXToVyperAndBurn()` function. The code currently only sends 8% of the swapped DragonX tokens to the `LIQUIDITY_BONDING_ADDR` and the rest is burned. However, the code that transfers 50% of the tokens to the `vyper.treasury()` is commented out. This means that too many funds are being burned and the treasury will not receive any funds. The recommendation is to uncomment the code to allow transfers to the Vyper treasury. The team has responded that the issue has been fixed.

## Details

## Severity

High Risk

## Description

In the `BuyAndBurn.swapDragonXToVyperAndBurn()` function, once DragonX is swapped to Vyper, 8% goes to `LIQUIDITY_BONDING_ADDR` and the rest is burned. Note that the 50% fund transfer to `vyper.treasury()` is commented out.

## Location of Affected Code

File: [src/BuyAndBurn.sol#L116](https://github.com/De-centraX/vyper-boost-contracts/blob/005554b17b2337932cd473603562ef4d4b99606a/src/BuyAndBurn.sol#L116)

```solidity
function swapDragonXToVyperAndBurn(uint32 _deadline) external intervalUpdate notExpired(_deadline) {
    // code
    uint256 incentive = wmul(currInterval.amountAllocated, INCENTIVE_FEE);

    uint256 dragonXToSwapAndBurn = currInterval.amountAllocated - incentive;

    uint256 vyperAmount = swapExactInput(address(dragonX), address(vyper), dragonXToSwapAndBurn, 0, _deadline);

    {
        ///@note - Allocations
    @>  vyper.transfer(LIQUIDITY_BONDING_ADDR, wmul(vyperAmount, uint256(0.08e18)));
        // vyper.transfer(address(vyper.treasury()), wmul(vyperAmount, uint256(0.5e18)));
    @>  burnVyper();
    }

    dragonX.safeTransfer(msg.sender, incentive);
    // code
}
```

## Impact

Too many funds are burned, the treasury will not get the funds.

## Recommendation

Uncomment the code to allow transfers to the Vyper treasury as well.

## Team Response

Fixed.
