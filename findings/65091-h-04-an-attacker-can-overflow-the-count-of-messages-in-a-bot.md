---
tags:
  - lang/solidity
  - sector/governance
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - novelty/known-pattern
protocol: "[[Recall]]"
auditors:
  - "[[sin1st3r__]]"
report: "https://code4rena.com/reports/2025-02-recall"
genome:
  - "[[underflow]]"
  - "[[permanent]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[quorum-supply-drift]]"
---
# [H-04] An attacker can overflow the count of messages in a bottom up message batch leading to bottom up checkpoint execution failure and halting

- id: 65091
- impact: HIGH
- protocol: [[Recall]]
- reporter: sin1st3r\_\_ (Code4rena)
- source: https://code4rena.com/reports/2025-02-recall

## Summary


This bug report discusses a vulnerability in the function `LibGateway::commitBottomUpMsg()` of the `LibGateway.sol` contract. This function is used to commit messages to be included in a bottom up message batch, which is then sent to a parent subnet. 

The vulnerability allows an attacker to overpopulate the bottom up message batch, causing it to exceed the maximum limit of messages allowed. This can be achieved by committing a total of 21 messages at the same time. This overpopulated batch will then cause the bottom up checkpoint to fail and prevent it from being executed in the parent subnet.

To exploit this vulnerability, the attacker can deploy a malicious IPC smart contract on the child subnet and use the function `sendContractXnetMessage()` to commit 21 messages. This will cause the bottom up batch to be overpopulated and halt the bottom up checkpoint.

To mitigate this issue, it is recommended to ensure that a single bottom up message batch cannot have more messages than the maximum limit allowed.

## Details



<https://github.com/code-423n4/2025-02-recall/blob/ab5f90b9b0322016ecce6dd71c528a935544bec5/contracts/contracts/lib/LibGateway.sol# L309>

### Overview of how `commitBottomUpMsg()` works

To understand the vulnerability, we need to first discuss how the function `LibGateway::commitBottomUpMsg()` which is used to commit bottom up msgs to be included in a bottom up msg batch. The created bottom up msg batch will then be included in a bottom up checkpoint to be sent to a parent subnet.
```

    function commitBottomUpMsg(IpcEnvelope memory crossMessage) internal {
        GatewayActorStorage storage s = LibGatewayActorStorage.appStorage();
        uint256 epoch = getNextEpoch(block.number, s.bottomUpCheckPeriod);

        .................

        // populate the batch for that epoch
        (bool exists, BottomUpMsgBatch storage batch) = LibGateway.getBottomUpMsgBatch(epoch);
        if (!exists) {
            batch.subnetID = s.networkName;
            batch.blockHeight = epoch;
            // we need to use push here to initialize the array.
            batch.msgs.push(crossMessage);
            emit QueuedBottomUpMessage({id: crossMessage.toTracingId()});
            return;
        }

        // if the maximum size was already achieved emit already the event
        // and re-assign the batch to the current epoch.
  ----> if (batch.msgs.length == s.maxMsgsPerBottomUpBatch) {
            // copy the batch with max messages into the new cut.
            uint256 epochCut = block.number;
            BottomUpMsgBatch memory newBatch = BottomUpMsgBatch({
                subnetID: s.networkName,
                blockHeight: epochCut,
                msgs: new IpcEnvelope[](batch.msgs.length)
            });

            uint256 msgLength = batch.msgs.length;
            for (uint256 i; i < msgLength; ) {
                newBatch.msgs[i] = batch.msgs[i];
                unchecked {
                    ++i;
                }
            }

            // emit event with the next batch ready to sign quorum over.
            emit NewBottomUpMsgBatch(epochCut);

            // Empty the messages of existing batch with epoch and start populating with the new message.
            delete batch.msgs;
            // need to push here to avoid a copy from memory to storage
            batch.msgs.push(crossMessage);

     -----> LibGateway.storeBottomUpMsgBatch(newBatch);
        } else {
            // we append the new message normally, and wait for the batch period
            // to trigger the cutting of the batch.
            batch.msgs.push(crossMessage);
        }

        emit QueuedBottomUpMessage({id: crossMessage.toTracingId()});
    }
```

How this function works is as follows:

It first retrieves the next epoch then it retrieves the currently stored bottom up message batch for that epoch. If a batch exists for the next epoch and it is full, a new bottom up msg batch will be created with a block height of the current epoch/block-number, and then the messages stored in the next epoch’s batch will be transferred to the newly created msg batch associated with the current block number.

The newly created bottom up msg batch will be stored by calling the function `storeBottomUpMsgBatch()`:
```

    /// @notice stores bottom-up batch
    function storeBottomUpMsgBatch(BottomUpMsgBatch memory batch) internal {
        GatewayActorStorage storage s = LibGatewayActorStorage.appStorage();
        BottomUpMsgBatch storage b = s.bottomUpMsgBatches[batch.blockHeight];
        b.subnetID = batch.subnetID;
        b.blockHeight = batch.blockHeight;

        uint256 msgLength = batch.msgs.length;
        for (uint256 i; i < msgLength; ) {
            // We need to push because initializing an array with a static
            // length will cause a copy from memory to storage, making
            // the compiler unhappy.
            b.msgs.push(batch.msgs[i]);
            unchecked {
                ++i;
            }
        }
    }
```

This function retrieves the batch associated with the block height of the supplied `batch`, which would be the current `block.number`, and regardless or not of its existence, it will push the messages to it.

### Finding description and impact

The vulnerability is that an attacker can overpopulate the newly created bottom up msg batch so that the batch has a number of messages which exceed the limit `maxMsgsPerBottomUpBatch` (which is a constant of `10`). That can be achieved by simply committing a total of `21` bottom up messages at the same time (or less depending on the count of stored messages in batch associated with the next epoch).

The rationale behind the number `21` is that it takes `10` messages to make the batch of the next epoch full (if its empty), which triggers the code branch below, and it takes another `10` messages to re-populate the batch of the next epoch again after it was cleared, and `1` more message to overpopulate the bottom up message with the block height `block.number` so that it will contain a total of `11` messages which exceed the `maxMsgsPerBottomUpBatch` limit enforced.
```

  ----> if (batch.msgs.length == s.maxMsgsPerBottomUpBatch) {
            // copy the batch with max messages into the new cut.
            uint256 epochCut = block.number;
    ----->  BottomUpMsgBatch memory newBatch = BottomUpMsgBatch({
                subnetID: s.networkName,
                blockHeight: epochCut,
                msgs: new IpcEnvelope[](batch.msgs.length)
            });

            uint256 msgLength = batch.msgs.length;
     -----> for (uint256 i; i < msgLength; ) {
     ----->     newBatch.msgs[i] = batch.msgs[i];
                unchecked {
                    ++i;
                }
            }
```

This is problematic because when an attacker overpopulates the batch with more messages than its supposed to hold, the bottom up checkpoint holding the bottom up msg batch will **always** fail and the checkpoint will never be executable in the parent.

A checkpoint is submitted by calling the function `SubnetActorCheckpointingFacet::submitCheckpoint()`:
```

    function submitCheckpoint(
        BottomUpCheckpoint calldata checkpoint,
        address[] calldata signatories,
        bytes[] calldata signatures
    ) external whenNotPaused {
 -----> ensureValidCheckpoint(checkpoint);

        .................................

        // Commit in gateway to distribute rewards
        IGateway(s.ipcGatewayAddr).commitCheckpoint(checkpoint);

        .................................
    }
```

Let’s take a look at the function `ensureValidCheckpoint()`:
```

    function ensureValidCheckpoint(BottomUpCheckpoint calldata checkpoint) internal view {
        uint64 maxMsgsPerBottomUpBatch = s.maxMsgsPerBottomUpBatch;
 -----> if (checkpoint.msgs.length > maxMsgsPerBottomUpBatch) {
            revert MaxMsgsPerBatchExceeded();
        }

        .........................
    }
```

As it can be observed, the `ensureValidCheckpoint` checks if the count of messages stored in the checkpoint is more than `maxMsgsPerBottomUpBatch` (`10`), If that’s the case, then revert.

### Exploit / PoC

1. Attacker will deploy a malicious IPC smart contract on child subnet, which if called by an attacker, will commit `21` bottom up messages by calling the function `sendContractXnetMessage()` 21 times and supplying an appropriate IPC envelope struct.
2. Bottom up batch will be overpopulated and now the checkpoint holding that batch will never be executed/committed leading to bottom up checkpoint halting.

### Recommended mitigation steps

I believe this can be mitigated by ensuring that a single bottom up msg batch can not have more count of messages than `maxMsgsPerBottomUpBatch`.

---
