---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/dex
  - sector/oracle
protocol: "[[Tribe3]]"
auditors:
  - "[[Ibrahim Abouzied]]"
report: "https://certificate.quantstamp.com/full/tribe-3/203ec510-cbff-4b18-8b61-8e18e21776dc/index.html"
genome:
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Repeg Check Might Not Be Within Budget

- id: 60809
- impact: HIGH
- protocol: [[Tribe3]]
- reporter: Ibrahim Abouzied (Quantstamp)
- source: https://certificate.quantstamp.com/full/tribe-3/203ec510-cbff-4b18-8b61-8e18e21776dc/index.html

## Summary


This bug report discusses an issue with the `Amm.sol` file where the `k` adjustment and budget calculations are not being properly handled in the `payFunding()` function. The `repegCheck()` function, which is responsible for determining whether a repeg should be performed, does not take into account the budget when adjusting the `k` value. This can result in the `k` adjustment not being enough to cover the costs of the repeg, leading to potential errors. The recommendation is to check the `k` adjustment and either perform a partial repeg within the budget or return `isAdjustable = false`.

## Details

**Update**
`k` adjustment and the relevant budget calculations are now all done in `payFunding()`. Additional changes were made such that the repegging mechanism is skipped if there are insufficient funds after the funding payment, and an `Amm` now shuts down if there are insufficient funds for performing both the funding payment and the repegging.

**File(s) affected:**`Amm.sol`

**Description:**`Amm.repegCheck()` checks whether the protocol should perform a repeg, and if so, returns the cost associated. If the cost exceeds the repeg budget, `k` will be reduced to cover costs by setting both the quote asset reserves and the base asset reserves to 99% of the new repegged values.

However, there is no guarantee that reducing to 99% will be enough to bring the repeg within the budget. Currently, the `k` adjustment is done once and assumed to be within the budget. The relevant code has been reproduced below:

```
function repegCheck(uint256 _budget, bool _adjustK)
        external
        override
        onlyOpen
        onlyCounterParty
        returns (
            bool isAdjustable,
            int256 cost,
            uint256 newQuoteAssetReserve,
            uint256 newBaseAssetReserve
        )
    {
        uint256 _repegFlag = repegFlag;
        (bool result, uint256 marketPrice, uint256 oraclePrice) = isOverSpreadLimit();
        if (result) {
            _repegFlag += 1;
        } else {
            _repegFlag = 0;
        }
        if (adjustable) {
            int256 _positionSize = getBaseAssetDelta();
            uint256 targetPrice;
            if (_positionSize == 0) {
                targetPrice = oraclePrice;
            } else if (open && _repegFlag >= MIN_NUM_REPEG_FLAG) {
                targetPrice = oraclePrice > marketPrice
                    ? oraclePrice.mulD(1 ether - repegPriceGapRatio)
                    : oraclePrice.mulD(1 ether + repegPriceGapRatio);
            }
            if (targetPrice != 0) {
                uint256 _quoteAssetReserve = quoteAssetReserve;
                uint256 _baseAssetReserve = baseAssetReserve;
                (newQuoteAssetReserve, newBaseAssetReserve) = AmmMath.calcReservesAfterRepeg(
                    _quoteAssetReserve,
                    _baseAssetReserve,
                    targetPrice,
                    _positionSize
                );
                cost = AmmMath.calcCostForAdjustReserves(
                    _quoteAssetReserve,
                    _baseAssetReserve,
                    _positionSize,
                    newQuoteAssetReserve,
                    newBaseAssetReserve
                );
                if (cost > 0 && uint256(cost) > _budget) {
                    // The cost exceeds the budget
                    if (_adjustK && canLowerK) {
                        // scale down K by 1% that returns a profit of clearing house
                        newQuoteAssetReserve = (_quoteAssetReserve * 99) / 100;
                        newBaseAssetReserve = (_baseAssetReserve * 99) / 100;
                        cost = AmmMath.calcCostForAdjustReserves( // K is adjusted one time without checking the new cost against the budget.
                            _quoteAssetReserve,
                            _baseAssetReserve,
                            _positionSize,
                            newQuoteAssetReserve,
                            newBaseAssetReserve
                        );
                        isAdjustable = true;
                    }
                } else {
                    isAdjustable = true;
                }
            }
        }
        repegFlag = uint8(_repegFlag);
    }
```

**Recommendation:** Check whether the `k` adjustment was enough to cover the costs of the repeg. If not, either:

1.   Perform whatever repegging is possible within the available budget.
2.   Return `isAdjustable = false`.
