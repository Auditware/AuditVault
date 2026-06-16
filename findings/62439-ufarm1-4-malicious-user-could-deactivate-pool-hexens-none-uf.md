---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[Ufarm]]"
auditors:
  - Hexens
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-06-10-Ufarm.md"
genome:
  - "[[dos-resistance]]"
  - "[[dos/griefing]]"
  - "[[dos/selective]]"
  - "[[known-pattern]]"
  - "[[single-tx]]"
  - "[[add-check]]"
  - "[[precondition/always]]"
  - "[[blast-radius/single-pool]]"
---
# [UFARM1-4] Malicious User Could Deactivate Pool

- id: 62439
- impact: HIGH
- protocol: Ufarm
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-06-10-Ufarm.md

## Summary


The report discusses a bug in the `UFarmPool:withdraw` function where a request hash is not deleted in certain scenarios. This can be exploited by a malicious user to force the pool into a "deactivating" state. The suggested solution is to delete the request even when 0 shares are removed. The bug has been fixed.

## Details

**Severity:** High

**Description:** In the `UFarmPool:withdraw` function, the contract records a withdrawal request by storing the current block timestamp:
```
if (pendingWithdrawalsRequests[withdrawalRequestHash] == 0) {
    // Set the withdrawal request timestamp
    pendingWithdrawalsRequests[withdrawalRequestHash] = block.timestamp;
    emit WithdrawRequestReceived(investor, withdrawalRequestHash, block.timestamp);
} else {
```
Later, when the callback is executed, the contract  removes the request hash in two scenarios:

1. User has insufficient shares:
```
if (sharesToBurn > availableToWithdraw) {
    delete pendingWithdrawalsRequests[withdrawalRequestHash];

    withdrawQueue.pop();
    requestsLength = withdrawQueue.length;
    continue;
}
```
2. User withdraws a non-zero amount:
```
if (investor != ufarmFund && amountToWithdraw != 0) {
    // Mark the request as used
    __usedWithdrawalsRequests[withdrawalRequestHash] = true;

    // Delete the request from the pending withdrawals
    delete pendingWithdrawalsRequests[withdrawalRequestHash];
}
```
The issue arises when `amountToWithdraw` = 0, their `withdrawalRequestHash` is not deleted. This creates a problem:

A malicious user can call the withdraw function again after the lockup period, using the same request hash, which forces the pool into a "deactivating" state.
```
if (config.withdrawalLockupPeriod > 0) {
    if (pendingWithdrawalsRequests[withdrawalRequestHash] == 0) {
        // Set the withdrawal request timestamp
        pendingWithdrawalsRequests[withdrawalRequestHash] = block.timestamp;
        emit WithdrawRequestReceived(investor, withdrawalRequestHash, block.timestamp);
    } else {
        // Check if the lockup period has passed
        uint256 unlockTime = pendingWithdrawalsRequests[withdrawalRequestHash] +
            config.withdrawalLockupPeriod;
        if (block.timestamp < unlockTime) {
            // Safe because of the check above
            revert LockupPeriodNotPassed(unlockTime);
        } else {
 @====>        _changeStatus(PoolStatus.Deactivating);
        }
    }
    return;
}
```

**Remediation:**  Consider deleting the request even when 0 shares are removed.
```
-- if (investor != ufarmFund && amountToWithdraw != 0) {
++ if (investor != ufarmFund) {
    // Mark the request as used
    __usedWithdrawalsRequests[withdrawalRequestHash] = true;

    // Delete the request from the pending withdrawals
    delete pendingWithdrawalsRequests[withdrawalRequestHash];
}
```

**Status:**  Fixed


- - -
