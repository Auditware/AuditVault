---
tags:
  - lang/solidity
  - sector/lending
  - sector/options
  - sector/perpetuals
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Panoptic]]"
auditors:
  - "[[prk0]]"
report: "https://code4rena.com/reports/2025-12-panoptic-next-core"
genome:
  - "[[fee-calculation]]"
  - "[[fee-theft]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
---
# [H-03] Commission fees can always be bypassed

- id: 65027
- impact: HIGH
- protocol: [[Panoptic]]
- reporter: prk0 (Code4rena)
- source: https://code4rena.com/reports/2025-12-panoptic-next-core

## Summary


This bug report discusses an issue with the code in the `CollateralTracker.sol` and `PanopticPool.sol` contracts. The problem is that the `commissionFee` is always being computed to 0 in certain situations, and can be completely avoided by users. This means that users can avoid paying any commission fees by settling premium before burning. The report recommends removing a check and deriving the commission fee directly from the premium fee in these situations. A proof of concept is also provided to demonstrate how a user can avoid paying commission fees. The bug has been mitigated by the Panoptic team.

## Details



* `CollateralTracker.sol` [L1612-L1632](https://github.com/code-423n4/2025-12-panoptic/blob/main/contracts/CollateralTracker.sol# L1612-L1632)
* `PanopticPool.sol` [L1010-L1011](https://github.com/code-423n4/2025-12-panoptic/blob/main/contracts/PanopticPool.sol# L1010-L1011)

### Finding description

Original code block has been omitted. [View complete submission](https://code4rena.com/audits/2025-12-panoptic-next-core/submissions/S-350).

`CollateralTracker::settleBurn()` computes the `commissionFee` as the *minimum* between premium fee and notional fee.

`CollateralTracker::settleBurn()` is called in the following flows:

**Flow 1 - Force Exercise:**
`PanopticPool::dispatchFrom()`
→ `PanopticPool::_forceExercise()`
→ `PanopticPool::_burnOptions()`
→ `CollateralTracker::settleBurn()`

**Flow 2 - Burn:**
`PanopticPool::dispatch()`
→ `PanopticPool::_burnOptions()`
→ `CollateralTracker::settleBurn()`

**Flow 3 - Liquidate:**
`PanopticPool::dispatchFrom()`
→ `PanopticPool::_liquidate()`
→ `PanopticPool::_burnAllOptionsFrom()`
→ `PanopticPool::_burnOptions()`
→ `CollateralTracker::settleBurn()`

**Flow 4 - Settle Premium:**
`PanopticPool::dispatchFrom()`
→ `PanopticPool::_settlePremium()`
→ `PanopticPool::_settleOptions()`
→ `CollateralTracker::settleBurn()`

**Flow 5 - Settle Premium:**
`PanopticPool::dispatch()`
→ `PanopticPool::_settleOptions()`
→ `CollateralTracker::settleBurn()`
```

function _settleOptions(
    address owner,
    TokenId tokenId,
    uint128 positionSize,
    RiskParameters riskParameters,
    int24 currentTick
) internal {
    // call _updateSettlementPostBurn to settle the long premia or the short premia (only for self calling)
    LeftRightUnsigned[4] memory emptyCollectedByLegs;
    LeftRightSigned realizedPremia;
    unchecked {
        // cannot be miscast because currentTick is a int24
        (realizedPremia, ) = _updateSettlementPostBurn(
            owner, // owner
            tokenId, // tokenId
            emptyCollectedByLegs, // collectedByLeg
            positionSize, // positionSize
            riskParameters, // riskParameters
            LeftRightSigned.wrap(1).addToLeftSlot(1 + (int128(currentTick) << 2))
        );
    }
    // deduct the paid premium tokens from the owner's balance
>   collateralToken0().settleBurn(owner, 0, 0, 0, realizedPremia.rightSlot(), riskParameters); // @audit
>   collateralToken1().settleBurn(owner, 0, 0, 0, realizedPremia.leftSlot(), riskParameters); // @audit
}
```

In Flow 4 and Flow 5, `settleBurn()` is called from `_settleOptions()` - The supplied `longAmount`, `shortAmount`, and `ammDeltaAmount` parameters are all `0`. Therefore, we can expect the computed notional fee to also be `0`.

As mentioned above, the commission fee is taken from the *minimum* between notional fee and premium fee. As a result, the commission fee will always be computed to `0`, when `settleBurn()` is called from `_settleOptions()` (Flow 4 and Flow 5).
```

function settleBurn(
    address optionOwner,
    int128 longAmount,
    int128 shortAmount,
    int128 ammDeltaAmount,
    int128 realizedPremium,
    RiskParameters riskParameters
) external onlyPanopticPool returns (int128) {
    (, int128 tokenPaid, uint256 _totalAssets, uint256 _totalSupply) = _updateBalancesAndSettle(
        optionOwner,
        false, // isCreation = false
        longAmount,
        shortAmount,
        ammDeltaAmount,
        realizedPremium
    );

>   if (realizedPremium != 0) {
        // SNIP
    }

    return tokenPaid;
}
```

`CollateralTracker::settleBurn()` also skips the commission fee computation altogether when `realizedPremium = 0`. Therefore, a user can always avoid commission fees by settling premium first, then burning.

### Impact

Commission fees are always computed to 0 in flows that involve `_settleOptions()`. In addition, commission fees are skipped if `realizedPremium` is `0`. This results in commission fees being skipped in many flows.

Users can avoid commission fees completely by settling premium, then burning, on exit.

### Recommended mitigation steps

Consider removing the `realizedPremium != 0` check and consider deriving commission fee directly from premium fee, when `shortAmount` and `longAmount` are both `= 0`.
```

function settleBurn(
    address optionOwner,
    int128 longAmount,
    int128 shortAmount,
    int128 ammDeltaAmount,
    int128 realizedPremium,
    RiskParameters riskParameters
) external onlyPanopticPool returns (int128) {
    (, int128 tokenPaid, uint256 _totalAssets, uint256 _totalSupply) = _updateBalancesAndSettle(
        optionOwner,
        false, // isCreation = false
        longAmount,
        shortAmount,
        ammDeltaAmount,
        realizedPremium
    );

-   if (realizedPremium != 0) {
        uint128 commissionFee;
        // compute the minimum of the notionalFee and the premiumFee
        {
            uint128 commissionP;
            unchecked {
                commissionP = realizedPremium > 0
                    ? uint128(realizedPremium)
                    : uint128(-realizedPremium);
            }
            uint128 commissionFeeP = Math
                .mulDivRoundingUp(commissionP, riskParameters.premiumFee(), DECIMALS)
                .toUint128();
            uint128 commissionN = uint256(int256(shortAmount) + int256(longAmount)).toUint128();
            uint128 commissionFeeN;
            unchecked {
                commissionFeeN = Math
                    .mulDivRoundingUp(commissionN, 10 * riskParameters.notionalFee(), DECIMALS)
                    .toUint128();
            }

+           if (shortAmount == 0 && longAmount == 0) {
+               commissionFee = commissionFeeP;
+           } else {
                commissionFee = Math.min(commissionFeeP, commissionFeeN).toUint128();
+           }
        }

        // SNIP
-   }

    return tokenPaid;
}
```

### Proof of Concept

[View detailed Proof of Concept](https://code4rena.com/audits/2025-12-panoptic-next-core/submissions/S-350)
```

Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 1.75s (100.30ms CPU time)

Ran 1 test suite in 2.04s (1.75s CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

The trace output above displays the last two interactions with `PanopticPool`, where Charlie settles his own premium, then burns the position.

In the first interaction (settle premium), the commission fee is computed to 0 for both `CollateralTracker0` and `CollateralTracker1`. This can be observed via the `CommissionPaid` event.

In the second interaction (burn), the commission fee is skipped. This can be confirmed due to the absence of the `CommissionPaid` event.

As a result, Charlie avoided paying any commission fees for his position.

**[Panoptic mitigated](https://github.com/code-423n4/2026-02-panoptic-next-core-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> Prevent commission bypass.

**Status:** Mitigation confirmed. Full details in reports from [Valves](https://code4rena.com/audits/2026-02-panoptic-next-core-mitigation-review/submissions/S-1), [edoscoba](https://code4rena.com/audits/2026-02-panoptic-next-core-mitigation-review/submissions/S-16), and [Nyx](https://code4rena.com/audits/2026-02-panoptic-next-core-mitigation-review/submissions/S-43).

---
