---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/restaking
  - sector/staking
protocol: "[[Rio Network]]"
auditors:
  - "[[ComposableSecurity]]"
  - "[[g]]"
  - "[[mstpr-brainbot]]"
report: "https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[cross-contract-state-consistency]]"
  - "[[reward-accounting]]"
---
# H-7: `reportOutOfOrderValidatorExits` does not updates the heap order

- id: 30902
- impact: HIGH
- protocol: [[Rio Network]]
- reporter: mstpr-brainbot (Sherlock)
- source: N/A

## Summary


This bug report describes an issue with the `reportOutOfOrderValidatorExits` function in the `RioLRTOperatorRegistry` smart contract. This function is used to increase the `exited` portion of an operator's validators when they exit without a withdrawal request. However, this action does not update the heap, which can lead to incorrect marking of validators as exited during subsequent allocation or deallocation processes. The bug was found by the ComposableSecurity, g, and mstpr-brainbot teams and can cause withdrawals and deposits to fail. The code snippet and impact are labeled as high and the recommendation is to update the utilization in the `reportOutOfOrderValidatorExits` function. The protocol team has fixed this issue in a recent update.

## Details

Source: https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging/issues/131 

## Found by 
ComposableSecurity, g, mstpr-brainbot
## Summary
When an operator's validator exits without a withdrawal request, the owner can invoke the `reportOutOfOrderValidatorExits` function to increase the `exited` portion of the operator validators. However, this action does not update the heap. Consequently, during subsequent allocation or deallocation processes, the heap may incorrectly mark validators as exited.
## Vulnerability Detail
First, let's see how the utilization is determined for native ETH deposits for operators which is calculated as:
`operatorShares.allocation.divWad(operatorShares.cap)` where as the allocation is the total `deposited` validators and the `cap` is predetermined value by the owner of the registry.

When the heap is retrieved from the storage, here how it is fetched:
```solidity
function getOperatorUtilizationHeapForETH(RioLRTOperatorRegistryStorageV1.StorageV1 storage s)
        internal
        view
        returns (OperatorUtilizationHeap.Data memory heap)
    {
        uint8 numActiveOperators = s.activeOperatorCount;
        if (numActiveOperators == 0) return OperatorUtilizationHeap.Data(new OperatorUtilizationHeap.Operator[](0), 0);

        heap = OperatorUtilizationHeap.initialize(MAX_ACTIVE_OPERATOR_COUNT);

        uint256 activeDeposits;
        IRioLRTOperatorRegistry.OperatorValidatorDetails memory validators;
        unchecked {
            uint8 i;
            for (i = 0; i < numActiveOperators; ++i) {
                uint8 operatorId = s.activeOperatorsByETHDepositUtilization.get(i);

                // Non-existent operator ID. We've reached the end of the heap.
                if (operatorId == 0) break;

                validators = s.operatorDetails[operatorId].validatorDetails;
                activeDeposits = validators.deposited - validators.exited;
                heap.operators[i + 1] = OperatorUtilizationHeap.Operator({
                    id: operatorId,
                    utilization: activeDeposits.divWad(validators.cap)
                });
            }
            heap.count = i;
        }
    }
```
as we can see, the heap is always assumed to be order in the storage when the registry fetches it initially. There are no ordering of the heap when requesting the heap initially.

When, say the deallocation happens via an user withdrawal request, the queue can exit early if the operator in the heap has "0" room:
```solidity
 function deallocateETHDeposits(uint256 depositsToDeallocate) external onlyCoordinator returns (uint256 depositsDeallocated, OperatorETHDeallocation[] memory deallocations) {
        deallocations = new OperatorETHDeallocation[](s.activeOperatorCount);


        OperatorUtilizationHeap.Data memory heap = s.getOperatorUtilizationHeapForETH();
        if (heap.isEmpty()) revert NO_AVAILABLE_OPERATORS_FOR_DEALLOCATION();


        uint256 deallocationIndex;
        uint256 remainingDeposits = depositsToDeallocate;


        bytes memory pubKeyBatch;
        while (remainingDeposits > 0) {
            uint8 operatorId = heap.getMax().id;


            OperatorDetails storage operator = s.operatorDetails[operatorId];
            OperatorValidatorDetails memory validators = operator.validatorDetails;
            -> uint256 activeDeposits = validators.deposited - validators.exited;


            // Exit early if the operator with the highest utilization rate has no active deposits,
            // as no further deallocations can be made.
            -> if (activeDeposits == 0) break;
             .
        }
        .
    }
```

`reportOutOfOrderValidatorExits` increases the "exited" part of the operators validator:
```solidity
function reportOutOfOrderValidatorExits(uint8 operatorId, uint256 fromIndex, uint256 validatorCount) external {
       .
       .
        // Swap the position of the validators starting from the `fromIndex` with the validators that were next in line to be exited.
        VALIDATOR_DETAILS_POSITION.swapValidatorDetails(operatorId, fromIndex, validators.exited, validatorCount);
        -> operator.validatorDetails.exited += uint40(validatorCount);

        emit OperatorOutOfOrderValidatorExitsReported(operatorId, validatorCount);
    }
```

Now, knowing all these above, let's do an example where calling `reportOutOfOrderValidatorExits` can make the heap work wrongly and exit prematurely.

Assume there are 3 operators which has native ETH deposits. 
operatorId 1 -> utilization 5%
operatorId 2 -> utilization 10%
operatorId 3 -> utilization 15%

such operators would be ordered in the heap as:
heap.operators[1] -> operatorId: 1, utilization: 5
heap.operators[2] -> operatorId: 2, utilization: 10
heap.operators[3] -> operatorId: 3, utilization: 15
heap.getMin() -> operatorId: 1, utilization: 5
heap.getMax() -> operatorId:3, utilization 15

now, let's say the "cap" is 100 for all of the operators which means that:
operatorId 1 -> validator.deposits = 5, validator.exit = 0
operatorId 2 -> validator.deposits = 10, validator.exit = 0
operatorId 3 -> validator.deposits = 15, validator.exit = 0

Let's assume that the operator 3 exits 15 validator from beacon chain without prior to a user request, which is a reason for owner to call `reportOutOfOrderValidatorExits` to increase the exited validators. 

When the owner calls `reportOutOfOrderValidatorExits` for the operatorId 3, the exited will be 15 for the operatorId 3. 
After the call the operators validator balances will be:
operatorId 1 -> validator.deposits = 5, validator.exit = 0
operatorId 2 -> validator.deposits = 10, validator.exit = 8
operatorId 3 -> validator.deposits = 15, validator.exit = 15

hence, the utilizations will be:
operatorId 1 -> utilization 5%
operatorId 2 -> utilization 10%
operatorId 3 -> utilization 0%

which means now the operatorId 3 has the lowest utilization and should be the first to get deposits and last to unwind deposits from. However, the heap is not re-ordered meaning that the minimum in the heap is  still opeartorId 1 and the maximum is still operatorId 3!

Now, when a user tries to withdraw, the first deallocation target will be the operatorId 3 because the heap thinks that it is the most utilized still. 

However, since the active utilization for operatorId 3 is "0" the loop will exit early hence, the withdrawals will not go through
https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/4f01e065c1ed346875cf5b05d2b43e0bcdb4c849/rio-sherlock-audit/contracts/restaking/RioLRTOperatorRegistry.sol#L556-L560

Hence, the user will not be able to request the withdrawal! 

**Coded PoC:**
```solidity
// forge test --match-contract OperatorUtilizationHeapTest --match-test test_RemovingValidatorMessesTheHeap -vv
    function test_RemovingValidatorMessesTheHeap() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(5);

        // @review initialize and order 3 operators 
        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 5}));
        heap.store(heapStore);

        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 10}));
        heap.store(heapStore);

        heap.insert(OperatorUtilizationHeap.Operator({id: 3, utilization: 15}));
        heap.store(heapStore);

        // @review mimick how the heap can be fetched from the storage initially
        uint8 numActiveOperators = 3;
        OperatorUtilizationHeap.Data memory newHeap = OperatorUtilizationHeap.initialize(64);
        uint8 i;
        for (i = 0; i < numActiveOperators; ++i) {
            uint8 operatorId = heapStore.get(i);
            if (operatorId == 0) break;

            newHeap.operators[i+1] = OperatorUtilizationHeap.Operator({
                   id: operatorId,
                   utilization: heap.operators[operatorId].utilization
            });
        }
        newHeap.count = i;

        // @review assume the reportValidatorAndExits called, and now the utilization is "0"
        heap.updateUtilizationByID(3, 0);
        // @review this should be done, but the heap is not stored! 
        // heap.store(heapStore);

        console.log("1st", heap.operators[1].id);
        console.log("2nd", heap.operators[2].id);
        console.log("3rd", heap.operators[3].id);
        console.log("origin heaps min", heap.getMin().id);
        console.log("origin heaps max", heap.getMax().id);

        console.log("1st", newHeap.operators[1].id);
        console.log("2nd", newHeap.operators[2].id);
        console.log("3rd", newHeap.operators[3].id);
        console.log("new heaps min", newHeap.getMin().id);
        console.log("new heaps max", newHeap.getMax().id);

        // @review mins and maxs are mixed
        assertEq(newHeap.getMin().id, 1);
        assertEq(heap.getMin().id, 3);
        assertEq(heap.getMax().id, 2);
        assertEq(newHeap.getMax().id, 3);
    }
```
## Impact
Heap can be mixed, withdrawals and deposits can fail, hence I will label this as high. 
## Code Snippet
https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/4f01e065c1ed346875cf5b05d2b43e0bcdb4c849/rio-sherlock-audit/contracts/utils/OperatorRegistryV1Admin.sol#L357C5-L386C6

https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/4f01e065c1ed346875cf5b05d2b43e0bcdb4c849/rio-sherlock-audit/contracts/restaking/RioLRTOperatorRegistry.sol#L541-L594

https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/4f01e065c1ed346875cf5b05d2b43e0bcdb4c849/rio-sherlock-audit/contracts/restaking/RioLRTOperatorRegistry.sol#L310-L336
## Tool used

Manual Review

## Recommendation
update the utilization in the reportOutOfOrderValidatorExits function 



## Discussion

**sherlock-admin4**

The protocol team fixed this issue in PR/commit https://github.com/rio-org/rio-sherlock-audit/pull/10.
