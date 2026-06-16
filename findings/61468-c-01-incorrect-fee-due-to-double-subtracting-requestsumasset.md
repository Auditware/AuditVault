---
tags:
  - blockchain/evm
  - blockchain/evm/optimism
  - lang/solidity
  - sector/lending
  - platform/pashov
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/logic/fee-calculation
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-03-26.md"
genome:
  - "[[underflow]]"
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[known-pattern]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
  - "[[timestamp-dependence]]"
---
# [C-01] Incorrect fee due to double subtracting `requestSum.assets`

- id: 61468
- impact: HIGH
- protocol: Blueberry_2025-03-26
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-03-26.md

## Summary


The report states that there is a bug in the `_calculateFee` function of the `HyperEvmVault` contract. This bug leads to incorrect fee calculations, which can have a high impact and likelihood. The function incorrectly subtracts a value, `$.requestSum.assets`, from another value, `grossAssets`, even though this subtraction has already been performed in another function. This results in an underestimation of a variable called `eligibleForFeeTake`, which is used in fee calculations. The report recommends updating the `_calculateFee` function to fix this bug.

## Details


## Severity

**Impact:** High

**Likelihood:** High

## Description

The `_calculateFee` function in the `HyperEvmVault` contract incorrectly subtracts `$.requestSum.assets` from `grossAssets`, even though this subtraction has already been performed upstream in `_totalEscrowValue`. This results in an underestimation of `eligibleForFeeTake`, leading to incorrect fee calculations.
```solidity
    function _calculateFee(V1Storage storage $, uint256 grossAssets) internal view returns (uint256 feeAmount_) {
        if (grossAssets == 0 || block.timestamp <= $.lastFeeCollectionTimestamp) {
            return 0;
        }

        // Calculate time elapsed since last fee collection
        uint256 timeElapsed = block.timestamp - $.lastFeeCollectionTimestamp;

        // We subtract the pending redemption requests from the total asset value to avoid taking more fees than needed from
        //    users who do not have any pending redemption requests
@>        uint256 eligibleForFeeTake = grossAssets - $.requestSum.assets;
        // Calculate the pro-rated management fee based on time elapsed
        feeAmount_ = eligibleForFeeTake * $.managementFeeBps * timeElapsed / BPS_DENOMINATOR / ONE_YEAR;

        return feeAmount_;
    }
```
However, `grossAssets` is passed directly from `_totalEscrowValue`, which already does the substraction:
```solidity
    function _totalEscrowValue(V1Storage storage $) internal view returns (uint256 assets_) {
        uint256 escrowLength = $.escrows.length;
        for (uint256 i = 0; i < escrowLength; ++i) {
            VaultEscrow escrow = VaultEscrow($.escrows[i]);
            assets_ += escrow.tvl();
        }

        if ($.lastL1Block == l1Block()) {
            assets_ += $.currentBlockDeposits;
        }

@>        return assets_ - $.requestSum.assets;
    }
```
So, subtracting `$.requestSum.assets` again, results in fees being calculated on a doubly reduced value, or even underflow and revert can happen.

## Recommendations

Consider updating `_calculateFee` and not subtract `$.requestSum.assets` again.
