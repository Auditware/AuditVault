---
tags:
  - lang/solidity
  - sector/lending
  - platform/pashov
  - has/github
  - severity/high
  - vuln/access-control/proxy-storage-collision
  - novelty/variant
  - misassumption/proxy-is-initialized
  - fix/upgrade-dependency
protocol: "[[GainsNetwork]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-review-July.md"
genome:
  - "[[proxy-storage-collision]]"
  - "[[variant]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[access-roles]]"
  - "[[chainlink-round-completeness]]"
  - "[[upgrade-safety]]"
---
# [H-01] Storage slot collision

- id: 40194
- impact: HIGH
- protocol: GainsNetwork-July
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/GainsNetwork-security-review-July.md

## Summary


This bug report is about a miscalculation in the storage layout allocation for the `PriceAggregatorStorage` struct. This leads to a potential storage slot collision with `OtcStorage`, causing data corruption. The issue is with the `jobIds` field, which is incorrectly calculated to take up 64 bits instead of 64 bytes. This causes the `PriceAggregatorStorage` to occupy 52 slots instead of the intended 50 slots, overlapping with the first two slots of `OtcStorage`. To fix this, the recommendation is to reduce the size of the `__gap` array or change the starting slot for `OtcStorage` to ensure no overlap. 

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

There is a miscalculation in the storage layout allocation for the `PriceAggregatorStorage` struct, which leads to a potential storage slot collision with `OtcStorage`.

The key issue is with the bytes32[2] jobIds field. It's incorrectly calculated as taking up 64 bits, but in reality, it occupies 64 bytes (512 bits), spanning 2 full storage slots.

```solidity
    struct PriceAggregatorStorage {
        IChainlinkFeed linkUsdPriceFeed; // 160 bits
        uint24 twapInterval; // 24 bits
        uint8 minAnswers; // 8 bits
        bytes32[2] jobIds; // 64 bits @audit 64 bytes instead of 64 bits
        // ... other fields
        uint256[41] __gap;
    }
```

This miscalculation causes the `PriceAggregatorStorage` to actually occupy 52 slots instead of the intended 50 slots. The storage slots are allocated as follows:

```solidity
    uint256 internal constant GLOBAL_PRICE_AGGREGATOR_SLOT = 551;
    uint256 internal constant GLOBAL_OTC_SLOT = 601;
```

With PriceAggregatorStorage occupying 52 slots starting from slot 551, it will overlap with the first two slots of OtcStorage, which starts at slot 601. This overlap will cause data corruption, as the first two slots of OtcStorage will be overwritten by the last two slots of PriceAggregatorStorage.

## Recommendations

Reduce the \_\_gap array size to 39 in `PriceAggregatorStorage` or change `GLOBAL_OTC_SLOT` to start from slot 603 to ensure no overlap.
