---
tags:
  - lang/solidity
  - sector/dex
  - sector/stable
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/reward-theft
  - novelty/variant
protocol: "[[Super DCA]]"
auditors:
  - "[[0xB4nkz]]"
  - "[[0xBoraichoT]]"
  - "[[0xDaniel_eth]]"
  - "[[8olidity]]"
  - "[[Aamirusmani1552]]"
  - "[[BADROBINX]]"
  - "[[BengalCatBalu]]"
  - "[[JeRRy0422]]"
  - "[[Kirkeelee]]"
  - "[[Ollam]]"
  - "[[PolarizedLight]]"
  - "[[francoHacker]]"
  - "[[harry]]"
  - "[[illoy_sci]]"
  - "[[ivanalexandur]]"
  - "[[jayjoshix]]"
  - "[[lucky-gru]]"
  - "[[maigadoh]]"
  - "[[nganhg]]"
  - "[[silver_eth]]"
  - "[[techOptimizor]]"
  - "[[v10g1]]"
  - "[[vinica_boy]]"
  - "[[y4y]]"
report: "https://github.com/sherlock-audit/2025-09-super-dca-judging"
genome:
  - "[[missing-check]]"
  - "[[reward-theft]]"
  - "[[variant]]"
  - "[[reward-accounting]]"
---
# H-2: Attackers will steal rewards from legitimate pools by making duplicate pools for listed token.

- id: 63420
- impact: HIGH
- protocol: [[Super DCA]] Liquidity Network
- reporter: illoy\_sci (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the SuperDCAGauge.sol contract, where the per-token reward accrual function can be exploited by attackers to steal rewards from legitimate pools. This is due to the lack of validation for pool legitimacy, allowing attackers to create unlisted pools and divert rewards meant for listed pools. The attack path involves identifying a listed token with an existing legitimate pool, creating a new malicious pool for the same pair, adding minimal liquidity, and repeatedly adding and removing liquidity to maximize reward theft. The impact of this bug is a complete loss of community rewards for legitimate pools, potentially leading to reduced incentives and loss of trust. To mitigate this issue, the protocol team has fixed it in the SuperDCAGauge.sol contract and suggests adding pool-specific validation or minimum liquidity checks in the future. 

## Details


Source: https://github.com/sherlock-audit/2025-09-super-dca-judging/issues/662 

## Found by 
0xB4nkz, 0xBoraichoT, 0xDaniel\_eth, 8olidity, Aamirusmani1552, BADROBINX, BengalCatBalu, JeRRy0422, Kirkeelee, Ollam, PolarizedLight, francoHacker, harry, illoy\_sci, ivanalexandur, jayjoshix, lucky-gru, maigadoh, nganhg, silver\_eth, techOptimizor, v10g1, vinica\_boy, y4y

### Summary

The per-token reward accrual without pool validation will cause reward theft for legitimate pools as attackers will create malicious pools and trigger reward distribution.



### Root Cause

In SuperDCAGauge.sol, the `_handleDistributionAndSettlement `function accrues rewards globally per token via `staking.accrueReward(otherToken)` without validating if the specific pool is legitimately listed. Since Uniswap V4 allows multiple pools for the same token pair (e.g., USDC/SuperDCA with different fees or configurations), and the listing contract (SuperDCAListing.sol) only permits one listing per non-SuperDCA token, attackers can create unlisted pools using the same hook to siphon rewards meant for listed pools.

https://github.com/sherlock-audit/2025-09-super-dca/blob/main/super-dca-gauge/src/SuperDCAGauge.sol#L323-L367



### Internal Pre-conditions

- At least one token (e.g., USDC) must be listed via the SuperDCAListing contract for a legitimate pool.
- The SuperDCAGauge hook must be deployed and configured with staking and listing contracts.
- The staking contract must have accrued rewards for the listed token.

### External Pre-conditions

- No minimum liquidity checks in the hook's _handleDistributionAndSettlement (only enforced during listing).

### Attack Path

1. Attacker identifies a listed token (e.g., USDC) with an existing legitimate pool (e.g., USDC/SuperDCA with dynamic fee).
2. Attacker creates a new malicious pool for the same pair (USDC/SuperDCA) using the same SuperDCAGauge hook, with minimal or zero liquidity (bypassing listing requirements).
3. Attacker adds minimal liquidity to the malicious pool, triggering `_beforeAddLiquidity `which calls `_handleDistributionAndSettlement`.
4. In `_handleDistributionAndSettlement`, rewards are accrued for the token (USDC) globally, and the community share is donated to the malicious pool (since it has liquidity).
5. Attacker removes liquidity from the malicious pool, triggering `_beforeRemoveLiquidity `again, potentially accruing more rewards.
6. Attacker repeats add/remove operations to maximize reward theft, then withdraws the donated rewards from the malicious pool.

### Impact

Legitimate pools suffer a complete loss of community rewards, as rewards are diverted to the attacker's malicious pool. The protocol's reward distribution mechanism is undermined, potentially leading to reduced incentives for legitimate liquidity providers and loss of trust.



### PoC

_No response_

### Mitigation

Add pool-specific validation in `_handleDistributionAndSettlement `to check if the pool is listed before accruing rewards. For example, query the listing contract per pool key/ID or enforce that only listed pools can trigger reward distribution. Alternatively, modify the staking contract to accrue rewards per-pool instead of per-token, or add minimum liquidity checks in the hook. Ensure the listing contract tracks pools by key/ID rather than just tokens.



## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/Super-DCA-Tech/super-dca-gauge/pull/37
