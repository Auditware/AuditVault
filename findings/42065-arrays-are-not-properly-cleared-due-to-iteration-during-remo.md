---
tags:
  - lang/solidity
  - platform/cantina
  - severity/high
  - sector/account
protocol: "[[Biconomy]]"
auditors:
  - "[[Chinmay Farkya]]"
report: "https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# Arrays are not properly cleared due to iteration during removal 

- id: 42065
- impact: HIGH
- protocol: [[Biconomy]]
- reporter: Chinmay Farkya (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_rhinestone_smartsessions_core_aug2024.pdf

## Summary


The bug report states that there is a problem with removing elements from an array in two different parts of the code. This is because the code tries to remove elements while iterating over the array, which causes the indices to shift and not all elements are removed. This issue can be fixed by changing the code to remove elements in reverse order. The bug has been fixed in a pull request and verified by Cantina Managed.

## Details

## Code Review Summary

## Context
(No context files were provided by the reviewer)

## Description
In two different parts of the codebase, an array is iterated over while its elements are simultaneously removed. Because each removal will shift the indices of the remaining elements, both locations of this behavior will fail to remove all elements that are intended to be removed.

For example, consider the `_removeAll()` function:

```solidity
function _removeAll(Set storage set, address account) internal {
    uint256 len = _length(set, account);
    for (uint256 i; i < len; i++) {
        _remove(set, account, _at(set, account, i));
    }
}
```

Since each call to `_remove()` will decrease the length of the set and will shuffle the elements inside of it, the second half of this loop will attempt to remove elements at indices that no longer exist.

The other location of this problem is in the `onUninstall()` function, which has the below implementation:

```solidity
function onUninstall(bytes calldata /*data*/ ) external override {
    uint256 configIdsCnt = $enabledSessions.length({ account: msg.sender });
    for (uint256 i; i < configIdsCnt; i++) {
        PermissionId configId = PermissionId.wrap($enabledSessions.at({ account: msg.sender, index: i }));
        removeSession(configId);
    }
}
```

In both cases, arrays are not fully cleared as expected, leaving permissions and other associated values active in storage despite the intent to remove them.

## Recommendation
To ensure that all elements are removed, consider changing the implementation of both functions to remove indices in reverse order. This approach would fix the issue, as each loop iteration would pop the last element, and no index shuffling would occur.

## Rhinestone
Fixed in PR 65.

## Cantina Managed
Verified. The `_removeAll()` function is fixed since it now removes elements in reverse order. The `onUninstall()` function is fixed since it now continuously removes the element at index 0.
