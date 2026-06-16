---
tags:
  - lang/solidity
  - sector/lending
  - platform/hexens
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Tokemak]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-07-22-Tokemak.md"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
---
# [TOKE-14] Incorrect Streaming Fee Share Calculation

- id: 53524
- impact: HIGH
- protocol: [[Tokemak]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2024-07-22-Tokemak.md

## Summary


This report discusses a bug in a code that calculates the streaming fee for a financial system. The bug is located in the function `AutoPoolFees._mintStreamingFee()` in the file `AutoPoolFees.sol` at lines 238-240. The issue is that the calculation of the fee shares is based on the total assets input, rather than the actual profit generated during the rebalancing and debt reporting process. This results in an excessive amount of fee shares being calculated, leading to losses for other users. The suggested fix is to modify the code at lines 238-239 to use a different calculation method. The bug has been fixed. 

## Details

**Severity:** High

**Path:** src/vault/libs/AutoPoolFees.sol#L238-L240

**Description:**

The streaming fee is intended to be applied to the profit generated during the rebalancing and debt reporting process. However, in the current implementation of the function `AutoPoolFees._mintStreamingFee()`, the minted streamingFeeShares are calculated using the function `_calculateSharesToMintFeeCollection`, which bases its calculations on the input `totalAssets` without considering the actual profit.

This oversight results in the calculation of an excessive amount of fee shares, leading to losses for other LPs.

```
uint256 streamingFeeShares =
    _calculateSharesToMintFeeCollection(streamingFeeBps, totalAssets, currentTotalSupply);
tokenData.mint(sink, streamingFeeShares);
```

**Remediation:**  Consider modifying lines 238 - 239 of the contract `AutoPoolFees.sol` to: 

```
uint256 streamingFeeShares 
  = Math.mulDiv(
        fees, 
        currentTotalSupply, 
        (totalAssets * FEE_DIVISOR) - (fees), 
        Math.Rounding.Up
    );
```

**Status:**   Fixed


- - -
