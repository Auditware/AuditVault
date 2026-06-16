---
tags:
  - lang/solidity
  - sector/dex
  - sector/staking
  - platform/sherlock
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - novelty/variant
protocol: "[[Rio Network]]"
auditors:
  - "[[0xkaden]]"
  - "[[Stiglitz]]"
  - "[[hash]]"
report: "https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging"
genome:
  - "[[frozen-funds]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[vote-delegation-loop]]"
---
# H-5: swapValidatorDetails incorrectly writes keys to memory, resulting in permanently locked beacon chain deposits

- id: 30900
- impact: HIGH
- protocol: [[Rio Network]]
- reporter: 0xkaden (Sherlock)
- source: N/A

## Summary


The bug report discusses an issue with the Rio Network Core Protocol that results in permanently locked deposits in the beacon chain. The problem occurs when loading BLS public keys from storage to memory, as the keys are partly overwritten with zero bytes. This is caused by a mistake in the code, where the second mstore shifts the key 128 bits to the right, resulting in the leftmost 128 bits being zeroed. This ultimately leads to broken public keys and permanently locked deposits. The bug can be fixed by simply changing the order of the mstores in the code. The protocol team has already fixed the issue in their code. 

## Details

Source: https://github.com/sherlock-audit/2024-02-rio-network-core-protocol-judging/issues/84 

## Found by 
0xkaden, Stiglitz, hash
## Summary

When loading BLS public keys from storage to memory, the keys are partly overwritten with zero bytes. This ultimately causes allocations of these malformed public keys to permanently lock deposited ETH in the beacon chain deposit contract.

## Vulnerability Detail

ValidatorDetails.swapValidatorDetails is used by RioLRTOperatorRegistry.reportOutOfOrderValidatorExits to swap the details in storage of validators which have been exited out of order:

```solidity
// Swap the position of the validators starting from the `fromIndex` with the validators that were next in line to be exited.
VALIDATOR_DETAILS_POSITION.swapValidatorDetails(operatorId, fromIndex, validators.exited, validatorCount);
```

In swapValidatorDetails, for each swap to occur, we load two keys into memory from storage:

```solidity
keyOffset1 = position.computeStorageKeyOffset(operatorId, startIndex1);
keyOffset2 = position.computeStorageKeyOffset(operatorId, startIndex2);
assembly {
    // Load key1 into memory
    let _part1 := sload(keyOffset1) // Load bytes 0..31
    let _part2 := sload(add(keyOffset1, 1)) // Load bytes 32..47
    mstore(add(key1, 0x20), _part1) // Store bytes 0..31
    mstore(add(key1, 0x30), shr(128, _part2)) // Store bytes 16..47

    isEmpty := iszero(or(_part1, _part2)) // Store if key1 is empty

    // Load key2 into memory
    _part1 := sload(keyOffset2) // Load bytes 0..31
    _part2 := sload(add(keyOffset2, 1)) // Load bytes 32..47
    mstore(add(key2, 0x20), _part1) // Store bytes 0..31
    mstore(add(key2, 0x30), shr(128, _part2)) // Store bytes 16..47

    isEmpty := or(isEmpty, iszero(or(_part1, _part2))) // Store if key1 or key2 is empty
}
```

The problem here is that when we store the keys in memory, they don't end up as intended. Let's look at how it works to see where it goes wrong.

The keys used here are BLS public keys, with a length of 48 bytes, e.g.: `0x95cfcb859956953f9834f8b14cdaa939e472a2b5d0471addbe490b97ed99c6eb8af94bc3ba4d4bfa93d087d522e4b78d`. As such, previously to entering this for loop, we initialize key1 and key2 in memory as 48 byte arrays:

```solidity
bytes memory key1 = new bytes(48);
bytes memory key2 = new bytes(48);
```

Since they're longer than 32 bytes, they have to be stored in two separate storage slots, thus we do two sloads per key to retrieve `_part1` and `_part2`, containing the first 32 bytes and the last 16 bytes respectively.

The following lines are used with the intention of storing the key in two separate memory slots, similarly to how they're stored in storage:

```solidity
mstore(add(key1, 0x20), _part1) // Store bytes 0..31
mstore(add(key1, 0x30), shr(128, _part2)) // Store bytes 16..47
```

The problem however is that the second mstore shifts `_part2` 128 bits to the right, causing the leftmost 128 bits to zeroed. Since this mstore is applied only 16 (0x10) bytes after the first mstore, we overwrite bytes 16..31 with zero bytes. We can test this in chisel to prove it:

Using this example key: `0x95cfcb859956953f9834f8b14cdaa939e472a2b5d0471addbe490b97ed99c6eb8af94bc3ba4d4bfa93d087d522e4b78d`

We assign the first 32 bytes to `_part1`: 
```solidity
bytes32 _part1 = 0x95cfcb859956953f9834f8b14cdaa939e472a2b5d0471addbe490b97ed99c6eb
```

We assign the last 16 bytes to `_part2`: 
```solidity
bytes32 _part2 = bytes32(bytes16(0x8af94bc3ba4d4bfa93d087d522e4b78d))
```

We assign 48 bytes in memory for `key1`:
```solidity
bytes memory key1 = new bytes(48);
```

And we run the following snippet from swapValidatorDetails in chisel: 
```solidity
assembly {
  mstore(add(key1, 0x20), _part1) // Store bytes 0..31
  mstore(add(key1, 0x30), shr(128, _part2)) // Store bytes 16..47
}
```

Now we can check the resulting memory using `!memdump`, which outputs the following:

```solidity
➜ !memdump
[0x00:0x20]: 0x0000000000000000000000000000000000000000000000000000000000000000
[0x20:0x40]: 0x0000000000000000000000000000000000000000000000000000000000000000
[0x40:0x60]: 0x00000000000000000000000000000000000000000000000000000000000000e0
[0x60:0x80]: 0x0000000000000000000000000000000000000000000000000000000000000000
[0x80:0xa0]: 0x0000000000000000000000000000000000000000000000000000000000000030
[0xa0:0xc0]: 0x95cfcb859956953f9834f8b14cdaa93900000000000000000000000000000000
[0xc0:0xe0]: 0x8af94bc3ba4d4bfa93d087d522e4b78d00000000000000000000000000000000
```

We can see from the memory that at the free memory pointer, the length of key1 is defined 48 bytes (0x30), and following it is the resulting key with 16 bytes zeroed in the middle of the key.

## Impact

Whenever we swapValidatorDetails using reportOutOfOrderValidatorExits, both sets of validators will have broken public keys and when allocated to will cause ETH to be permanently locked in the beacon deposit contract. 

We can see how this manifests in allocateETHDeposits where we retrieve the public keys for allocations:

```solidity
// Load the allocated validator details from storage and update the deposited validator count.
(pubKeyBatch, signatureBatch) = ValidatorDetails.allocateMemory(newDepositAllocation);
VALIDATOR_DETAILS_POSITION.loadValidatorDetails(
    operatorId, validators.deposited, newDepositAllocation, pubKeyBatch, signatureBatch, 0
);
...
allocations[allocationIndex] = OperatorETHAllocation(operator.delegator, newDepositAllocation, pubKeyBatch, signatureBatch);
```

We then use the public keys to stakeETH:

```solidity
(uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) = operatorRegistry.allocateETHDeposits(
    depositCount
);
depositAmount = depositsAllocated * ETH_DEPOSIT_SIZE;

for (uint256 i = 0; i < allocations.length; ++i) {
    uint256 deposits = allocations[i].deposits;

    IRioLRTOperatorDelegator(allocations[i].delegator).stakeETH{value: deposits * ETH_DEPOSIT_SIZE}(
        deposits, allocations[i].pubKeyBatch, allocations[i].signatureBatch
    );
}
```

Ultimately for each allocation, the public key is passed to the beacon DepositContract.deposit where it deposits to a public key for which we don't have the associated private key and thus can never withdraw.

## Code Snippet

- https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/main/rio-sherlock-audit/contracts/utils/ValidatorDetails.sol#L151
- https://github.com/sherlock-audit/2024-02-rio-network-core-protocol/blob/main/rio-sherlock-audit/contracts/utils/ValidatorDetails.sol#L159

## Tool used

Manual Review

## Recommendation

We can solve this by simply mstoring `_part2` prior to mstoring `_part1`, allowing the mstore of `_part1` to overwrite the zero bytes from `_part2`:

```solidity
mstore(add(key1, 0x30), shr(128, _part2)) // Store bytes 16..47
mstore(add(key1, 0x20), _part1) // Store bytes 0..31
```

Note that the above change must be made for both keys.



## Discussion

**sherlock-admin4**

The protocol team fixed this issue in PR/commit https://github.com/rio-org/rio-sherlock-audit/pull/2.
