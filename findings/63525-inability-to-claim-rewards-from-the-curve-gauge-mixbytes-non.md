---
tags:
  - lang/solidity
  - lang/vyper
  - sector/dex
  - sector/vault
  - sector/yield-aggregator
  - platform/mixbytes
  - has/github
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Notional Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Notional%20Finance/Notional%20v4/README.md#1-inability-to-claim-rewards-from-the-curve-gauge"
genome:
  - "[[missing-check]]"
  - "[[reward-theft]]"
  - "[[use-reentrancy-guard]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
---
# Inability to Claim Rewards From the Curve Gauge

- id: 63525
- impact: HIGH
- protocol: [[Notional Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Notional%20Finance/Notional%20v4/README.md#1-inability-to-claim-rewards-from-the-curve-gauge

## Summary


The report highlights a bug in the CurveConvex2Token._unstakeLpTokens() function, where users are not able to claim rewards when withdrawing from the Curve gauge. This is because the function does not include the _claim_rewards flag, which is needed to claim rewards during the withdraw call. This results in users losing accrued rewards and reduces the effective yield. The recommendation is to create a reward manager for the Curve gauge to handle rewards claiming and distributing CRV through the standard reward distribution mechanism. The issue has been fixed in a recent pull request.

## Details

##### Description
The `CurveConvex2Token._unstakeLpTokens()` function calls `ICurveGauge(CURVE_GAUGE).withdraw(poolClaim)`, which takes only the `poolClaim` parameter. However, the Curve gauge `withdraw()` function supports an optional `_claim_rewards` flag, which allows claiming rewards during the withdraw call:

```python
@external
@nonreentrant('lock')
def withdraw(_value: uint256, _claim_rewards: bool = False):
```

As implemented, the strategy does not claim rewards when withdrawing from the gauge, so users do not automatically receive accrued rewards when exiting positions.

```solidity
function _unstakeLpTokens(uint256 poolClaim) internal {
    if (CONVEX_REWARD_POOL != address(0)) {
        bool success = IConvexRewardPool(CONVEX_REWARD_POOL).
            withdrawAndUnwrap(poolClaim, false);
        require(success);
    } else {
        ICurveGauge(CURVE_GAUGE).withdraw(poolClaim);
    }
}
```

Although `withdrawAndUnwrap()` also does not claim rewards on unstakes for Convex, Convex strategies are wired to the `ConvexRewardManager` contract that later claims and distributes rewards to users. In contrast, pure Curve gauge strategies do not have such a manager configured, therefore, users cannot claim gauge rewards and lose a material portion of APR.

This issue is classified as **High** severity because users lose accrued rewards and effective yield is reduced.

##### Recommendation
We recommend creating a reward manager for the Curve gauge that handles rewards claiming and distributing CRV via the standard reward distribution mechanism.

> **Client's Commentary:**
> Fixed in this PR: https://github.com/notional-finance/notional-v4/pull/28

---
