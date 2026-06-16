---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/nft
protocol: "[[Solady]]"
auditors:
  - "[[Kaden]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Solady-Coinbase-Spearbit-Security-Review-December-2024.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# Unsound assumption about structure of calldata arrays

- id: 45409
- impact: HIGH
- protocol: Coinbase [[Solady]]
- reporter: Kaden (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Solady-Coinbase-Spearbit-Security-Review-December-2024.pdf

## Summary


This bug report discusses a high-risk issue in a specific code (ERC1155.sol, LibTransient.sol, and Lifebuoy.sol) related to accessing calldata arrays in inline assembly. The report explains that when encoding an array, the offset given by the calldata pointer may not always point to the beginning of the array, which can lead to incorrect and potentially tampered data. The recommendation is to fix the code sections and ensure testing with randomly created calldata pointers. The bug has been fixed by Solady in PR 1237 and verified by Spearbit.

## Details

## Vulnerability Report

## Severity
**High Risk**

## Context
- `ERC1155.sol#L264`
- `ERC1155.sol#L370`
- `ERC1155.sol#L393`
- `ERC1155.sol#L397`
- `ERC1155.sol#L400`
- `LibTransient.sol#L641`
- `LibTransient.sol#L663`
- `Lifebuoy.sol#L214`

## Description
When accessing calldata arrays in inline assembly (e.g. `myArray`), it's essentially a struct with two fields: `myArray.offset` and `myArray.length`. The `.offset` property gives you the direct calldata offset of the first value in the array, while the `.length` gives you the length of the array.

When ABI encoding an array, it's encoded as `enc(array_len) ++ enc(tuple(array[0], array[1], ...))`, meaning that in this case, the offset given by the calldata pointer points to the word right after the array's length. This opens the path to some clever optimizations in the case where you need to re-encode an array in memory from calldata.

For example, in Solady's `Lifebuoy.sol`:

```solidity
// Copies the length and actual data of the `bytes calldata` into memory by starting the copy 32 bytes
// **before** the offset
calldatacopy(add(m, 0xc0), sub(data.offset, 0x20), add(0x20, data.length))
```

However, the critical flaw in this assumption is that unless these methods are marked `external`, you cannot guarantee that they have this structure. The two major exceptions are:

- **Slices**: When you take the slice of an array via `myArray[start:end]`, it creates a new calldata pointer where `.length = end - start` and `.offset = myArray.offset + start * itemSizeBytes`.
- **Manually created calldata objects**: Using inline assembly, you can manually manipulate calldata pointers and assign arbitrary offsets & lengths.

In both cases, you can reasonably create calldata pointers that no longer point to the beginning byte of the original array and can only reliably retrieve their length via the `.length` property. In such cases, the referenced code sections would incorrectly copy the word preceding the slice as the length for the encoded array. This could lead to truncation or extension of the array with other bytes, causing downstream code to receive incorrect and potentially tampered data.

## Recommendation
Fix the referenced code sections by directly writing the `pointer.length` to memory instead of attempting to copy it in one big chunk along with the actual data. Furthermore, ensure code is tested with randomly created calldata pointers.

## Acknowledgments
- **Solady**: Fixed in PR 1237.
- **Spearbit**: Verified.
