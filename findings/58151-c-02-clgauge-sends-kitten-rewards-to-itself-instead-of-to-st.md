---
tags:
  - lang/solidity
  - sector/staking
  - has/github
  - severity/high
protocol: "[[KittenSwap]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md"
genome:
  - "[[reward-accounting]]"
  - "[[reward-calculation]]"
  - "[[ownership-transfer]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [C-02] CLGauge sends KITTEN rewards to itself instead of to stakers

- id: 58151
- impact: HIGH
- protocol: KittenSwap_2025-05-07
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/KittenSwap-security-review_2025-05-07.md

## Summary


This bug report is about a problem in a system where users can stake their NFP tokens and earn rewards. The bug causes the rewards to be sent to the wrong person, which is the contract itself instead of the original staker. This means that all the rewards are lost and cannot be recovered. The recommendation is to modify the code so that the rewards are sent to the correct staker's address instead of the contract's address.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

When users stake their NFP tokens, ownership of these NFTs is transferred to the CLGauge contract itself. When a staker claims their KITTEN rewards, the `_getReward` function incorrectly sends these rewards to the current owner of the NFP (which is the CLGauge contract) rather than to the original staker who is entitled to these rewards.

In the `_getReward` function below, we can see that the rewards are being sent to the NFP owner, which after staking is the CLGauge contract itself:

```solidity
    function _getReward(uint256 nfpTokenId) internal {
        (, , , , , int24 _tickLower, int24 _tickUpper, , , , , ) = nfp
            .positions(nfpTokenId);

        _updateRewardForNfp(nfpTokenId, _tickLower, _tickUpper);

        uint256 reward = rewards[nfpTokenId];
        address owner = nfp.ownerOf(nfpTokenId); // @audit owner is CLGauge contract

        if (reward > 0) {
            delete rewards[nfpTokenId];
            _safeApprove(kitten, address(this), reward);
            _safeTransferFrom(kitten, address(this), owner, reward);
            emit ClaimRewards(owner, reward);
        }
    }
```

It leads to 100% of staked users' rewards are lost and the rewards are not recoverable once sent to the gauge contract.

## Recommendations

Modify the `_getReward` function to accept the actual staker's address as a parameter rather than deriving it from NFP ownership:

```diff
-    function _getReward(uint256 nfpTokenId) internal {
+    function _getReward(uint256 nfpTokenId, address owner) internal {
        ...
-       address owner = nfp.ownerOf(nfpTokenId);

        if (reward > 0) {
            delete rewards[nfpTokenId];
-            _safeApprove(kitten, address(this), reward);
-            _safeTransferFrom(kitten, address(this), owner, reward);
-            emit ClaimRewards(owner, reward);
+            _safeTransfer(kitten, owner, reward);
+            emit ClaimRewards(owner, reward);
        }
    }
```
