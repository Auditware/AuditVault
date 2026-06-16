---
tags:
  - lang/solidity
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Subsquid]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md"
genome:
  - "[[dos-resistance]]"
  - "[[unbounded-loop]]"
  - "[[known-pattern]]"
---
# [H-03] Workers could withdraw without deregister and waiting for the lock period

- id: 58247
- impact: HIGH
- protocol: Subsquid
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Subsquid-security-review.md

## Summary


This bug report discusses a problem with the withdrawal process for workers in a decentralized network. The report states that the current flow for withdrawing a worker's bond is to first deregister their unique ID and then wait for a certain amount of time before triggering the withdrawal. However, it has been found that if the worker is not yet active, they can bypass this flow and withdraw their bond immediately without deregistering. This violates the intended withdrawal process and could potentially lead to an unbounded loop attack. The report suggests adding an extra check to prevent this from happening.

## Details

## Severity

**Impact:** High, this bypass the designed deregister flow and doesn't delete worker from active workers list.

**Likelihood:** Medium, as long as not currently active, worker can directly withdraw without deregister as a worker.

## Description

The designed flow and expected worker's behavior for withdrawing their bond is to first deregister the registered `peerId`. After that, they have to wait for the lock period before they can trigger the `withdraw`, as it can be seen from `withdraw` functions expected flow.

```solidity
  /**
   * @dev Withdraws the bond of a worker.
   * @param peerId The unique peer ID of the worker.
   * @notice Worker must be inactive
   * @notice Worker must be registered by the caller
   * @notice Worker must be deregistered for at least lockPeriod // @audit - prerequisite for withdraw
   */
  function withdraw(bytes calldata peerId) external whenNotPaused {
    uint256 workerId = workerIds[peerId];
    require(workerId != 0, "Worker not registered");
    Worker storage worker = workers[workerId];
    require(!isWorkerActive(worker), "Worker is active");
    require(worker.creator == msg.sender, "Not worker creator");
    require(block.number >= worker.deregisteredAt + lockPeriod(), "Worker is locked");

    uint256 bond = worker.bond;
    delete workers[workerId];

    tSQD.transfer(msg.sender, bond);

    emit WorkerWithdrawn(workerId, msg.sender);
  }
```

However, as long as the worker is not yet active (the current block has not yet reached the `registeredAt`), it can directly withdraw without calling `deregister` and waiting for the lock period. While this does not impact the TVL calculation, it violates the designed withdrawal flow and does not remove the worker from the `activeWorkerIds` array which will enable the unbounded loop attack vector.

Added POC to `WorkerRegistration.withdraw.t.sol`.

```solidity
  function testImmediatelyWithdraw() public {
    vm.roll(176329477);
    workerRegistration.register(workerId);
    workerRegistration.withdraw(workerId);
  }
```

## Recommendations

Consider to add extra check when `withdraw` is performed :

```diff
  function withdraw(bytes calldata peerId) external whenNotPaused {
    uint256 workerId = workerIds[peerId];
    require(workerId != 0, "Worker not registered");
    Worker storage worker = workers[workerId];
    require(!isWorkerActive(worker), "Worker is active");
    require(worker.creator == msg.sender, "Not worker creator");
-    require(block.number >= worker.deregisteredAt + lockPeriod(), "Worker is locked");
+    require(block.number >= worker.deregisteredAt + lockPeriod() && worker.deregisteredAt != 0, "Worker is locked");

    uint256 bond = worker.bond;
    delete workers[workerId];

    tSQD.transfer(msg.sender, bond);

    emit WorkerWithdrawn(workerId, msg.sender);
  }
```
