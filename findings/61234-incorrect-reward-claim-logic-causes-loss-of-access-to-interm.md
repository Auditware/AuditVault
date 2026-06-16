---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Suzaku Core]]"
auditors:
  - 0kage
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
---
# Incorrect reward claim logic causes loss of access to intermediate epoch rewards

- id: 61234
- impact: HIGH
- protocol: Suzaku Core
- reporter: 0kage (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-07-07-cyfrin-suzaku-core-v2.0.md

## Summary


This bug report discusses an issue with the current implementation of `Rewards::distributeRewards` where users may lose access to their rewards if they make a claim for a past epoch. This is due to the `lastEpochClaimedOperator` being updated unconditionally to a specific epoch, which can prevent claims for intermediate epochs that were not yet distributed. The impact of this bug is a loss of funds for users. A proof of concept test case is provided to reproduce the issue and a recommended mitigation is suggested to update the logic for `claimOperatorFee` to only update `lastEpochClaimedOperator` to the maximum epoch for which the user has successfully claimed rewards. The bug has been fixed in the Suzaku commit [6a0cbb1](https://github.com/suzaku-network/suzaku-core/pull/155/commits/6a0cbb1faa796e8925decad1ce9860eb20f184e7) and verified by Cyfrin.

## Details

**Description:** In the current implementation of `Rewards::distributeRewards`, all shares are calculated for participants after a 3-epoch delay between the current epoch and the one being distributed. However, an issue arises in the **claim logic**.

When rewards are claimed for a past epoch, the `lastEpochClaimedOperator` is updated unconditionally to `currentEpoch - 1`. This can block claims for **intermediate epochs** that were not yet distributed at the time of the first claim.

**Problem Scenario**

Consider the following sequence:

1. **Epoch 4**: Rewards are distributed for **epoch 1**
2. **Epoch 5**: Operator1 claims rewards → `lastEpochClaimedOperator = 4`
3. **Epoch 5**: Rewards are now distributed for **epoch 2**
4. **Epoch 5**: Operator1 attempts to claim rewards for **epoch 2**, but it's **blocked** because `lastEpochClaimedOperator > 2`

As a result, the operator **loses access** to claimable rewards from epoch 2.

**Problematic Code**

```solidity
if (totalRewards == 0) revert NoRewardsToClaim(msg.sender);
IERC20(rewardsToken).safeTransfer(recipient, totalRewards);
lastEpochClaimedOperator[msg.sender] = currentEpoch - 1; // <-- Incorrectly skips intermediate epochs
```

**Impact:** **Loss of Funds** - Users (operators) are permanently prevented from claiming their legitimate rewards if intermediate epochs are distributed after a later claim has already advanced `lastEpochClaimedOperator`.

**Proof of Concept:** Add this test case to `RewardTest.t.sol` to reproduce the issue:

```solidity
function test_distributeRewards_claimFee(uint256 uptime) public {
    uint48 epoch = 1;
    uptime = bound(uptime, 0, 4 hours);

    _setupStakes(epoch, uptime);
    _setupStakes(epoch + 2, uptime);

    address[] memory operators = middleware.getAllOperators();
    uint256 batchSize = 3;
    uint256 remainingOperators = operators.length;

    vm.warp((epoch + 3) * middleware.EPOCH_DURATION());
    while (remainingOperators > 0) {
        vm.prank(REWARDS_DISTRIBUTOR_ROLE);
        rewards.distributeRewards(epoch, uint48(batchSize));
        remainingOperators = remainingOperators > batchSize ? remainingOperators - batchSize : 0;
    }

    vm.warp((epoch + 4) * middleware.EPOCH_DURATION());

    for (uint256 i = 0; i < operators.length; i++) {
        uint256 operatorShare = rewards.operatorShares(epoch, operators[i]);
        if (operatorShare > 0) {
            vm.prank(operators[i]);
            rewards.claimOperatorFee(address(rewardsToken), operators[i]);
            assertGt(rewardsToken.balanceOf(operators[i]), 0, "Operator should receive rewards ");
            vm.stopPrank();
            break;
        }
    }

    vm.warp((epoch + 5) * middleware.EPOCH_DURATION());
    remainingOperators = operators.length;
    while (remainingOperators > 0) {
        vm.prank(REWARDS_DISTRIBUTOR_ROLE);
        rewards.distributeRewards(epoch + 2, uint48(batchSize));
        remainingOperators = remainingOperators > batchSize ? remainingOperators - batchSize : 0;
    }

    vm.warp((epoch + 9) * middleware.EPOCH_DURATION());
    for (uint256 i = 0; i < operators.length; i++) {
        uint256 operatorShare = rewards.operatorShares(epoch + 2, operators[i]);
        if (operatorShare > 0) {
            vm.prank(operators[i]);
            rewards.claimOperatorFee(address(rewardsToken), operators[i]);
            vm.stopPrank();
            break;
        }
    }
}
```

**Recommended Mitigation:** Update the `claimOperatorFee` logic to **only update** `lastEpochClaimedOperator` to the **maximum epoch for which the user has successfully claimed rewards**, instead of always assigning `currentEpoch - 1`.

**Suzaku:**
Fixed in commit [6a0cbb1](https://github.com/suzaku-network/suzaku-core/pull/155/commits/6a0cbb1faa796e8925decad1ce9860eb20f184e7).

**Cyfrin:** Verified.
