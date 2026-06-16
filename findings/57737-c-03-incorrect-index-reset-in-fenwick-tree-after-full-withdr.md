---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/oracle
protocol: "[[Hyperhyper]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[first-deposit]]"
  - "[[variant]]"
---
# [C-03] Incorrect index reset in `Fenwick tree` after full withdrawal

- id: 57737
- impact: HIGH
- protocol: Hyperhyper_2025-03-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Hyperhyper-security-review_2025-03-30.md

## Summary


This bug report highlights an issue where the system does not reset all indices in the Fenwick tree after a full withdrawal, leading to incorrect data being added to new deposits. This can result in users being able to withdraw more funds than they originally deposited, potentially even withdrawing funds from other users. The report recommends that all indices in the Fenwick tree should be reset after a full withdrawal to prevent this issue.

## Details

## Severity

**Impact:** High

**Likelihood:** High

## Description

When a user adds liquidity to the pool, the system triggers the `_updateLockData` function, which in turn calls the `Fenwicks._deposit` function to record the deposit amount and its associated lock duration (e.g., 7 days). The `Fenwicks._deposit` function updates a data structure known as the Fenwick tree to manage and lock the deposit amounts over time.

For a user's first deposit (`isDirty=true`), the system resets the tree values to avoid incorrect data affecting subsequent deposits:

```solidity
function _fenwicksUpdate(FenwicksData storage self, uint256 maxDepositEntries, uint256 treeIndex, uint256 value)
    internal
{
    // when registering new values after full withdrawal, we need to overwrite dirty values
    bool isDirty = self.sortedKeys.length == 1;
    while (treeIndex <= maxDepositEntries) {
        // when dirty overwrite, otherwise add
@1>      isDirty ? self.fenwicksTree[treeIndex] = value : self.fenwicksTree[treeIndex] += value;
@2>      uint256 nextIndex = treeIndex + (treeIndex & (~treeIndex + 1));
        if (nextIndex > maxDepositEntries) break; // Stop if next update would exceed maxDepositEntries
        treeIndex = nextIndex;
    }
}
```

The problem occurs because it only reset specific indices such as 1, 2, 4, 8, etc. and **does not reset other indices like 3, 5, 6, etc.**
After a full withdrawal, if the user previously had deposits at indices 3 and 5, they remain untouched. As a result, the old values from these indices are mistakenly added to new deposit amounts. Users can unlock more amounts and in fact, get (`removeLiquidity`) the funds of other users in the pool.

**Example Scenario:**

1. Initial Deposit:
   User deposits at indices 1, 2, and 3 updating the Fenwick tree accordingly.
2. Full Withdrawal:
   The user withdraws all funds (after the unlock period).
3. First Deposit After Withdrawal:
   The user deposits again, with isDirty=true. Indices 1, 2, 4, 8, 16, etc., are updated with the new values (resetted).
4. Second Deposit:
   The user deposits again, updating index 2 with the new value.
5. Third Deposit:
   The user deposits again, and index 3 is updated. However, because the old value from the initial deposit (step 1) remains in index 3, a new deposit value will be added to the old value.

Result:

Because the old value from the first deposits is incorrectly retained in index 3, the user ends up unlocking more funds than they actually deposited. This could allow the user to withdraw assets that they did not originally contribute, and potentially withdraw funds belonging to other users.

## Recommendations

Ensure that the system resets all indices in the Fenwick tree after a full withdrawal, not just specific indices like 1, 2, 4, 8, 16, etc.
