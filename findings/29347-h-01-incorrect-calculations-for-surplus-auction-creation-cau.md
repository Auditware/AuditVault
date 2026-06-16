---
tags:
  - lang/solidity
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Open Dollar]]"
auditors:
  - "[[tnquanghuy0512]]"
report: "https://code4rena.com/reports/2023-10-opendollar"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Incorrect calculations for Surplus Auction creation cause massive surplus imbalances

- id: 29347
- impact: HIGH
- protocol: [[Open Dollar]]
- reporter: tnquanghuy0512 (Code4rena)
- source: https://code4rena.com/reports/2023-10-opendollar

## Summary


This bug report is about two issues in the `AccountingEngine.sol::auctionSurplus()` function when calculating values for the creating a Surplus Auction. The first issue is the `if` statement at Line 213 which incorrectly checks if `_params.surplusTransferPercentage` is less than `ONE_HUNDRED_WAD` when it should check if it is less than `WAD`. This means that when `_params.surplusTransferPercentage` is `100%`, a ghost surplus Auction will be created and the entire `surplusAmount` amount will also be sent to the `extraSurplusReceiver` essentially double-counting a large amount of the surplus. This double accounting can destabilize the system and lead to underflows elsewhere. The second issue is the use of `ONE_HUNDRED_WAD` to calculate `_amountToSell` at Line 215 which results in a hugely inflated figure in the newly created surplus auction. This has the potential to cause massive price imbalances and crash the protocol. 

The proof of concept combines both issues into one to show the worst case scenario. Given the following values and assuming the initial all checks pass in function before reaching Line 213 `AccountingEngine.sol::auctionSurplus()`: WAD = 1e18, surplusTransferPercentage = 1e18 (representative of 100%), surplusAmount = 3e18, ONE_HUNDRED_WAD = 100e18, the following condition at Line 213 will always return TRUE, so an auction will be created with `_amountToSell` 100 times higher than it should be.

The recommended mitigation step to resolve this issue is to update the function on the two affected lines to use `WAD` instead of `ONE_HUNDRED_WAD`. This bug report was found with the Foundry tool and was confirmed by the OpenDollar team. The warden demonstrated how due to the incorrect use of `ONE_HUNDRED_WAD` instead of `WAD` when calculating percentages, surplus auctions will be created with massively inflated values, breaking the accounting of the protocol. The bug report was resolved with a pull request.

## Details


There are two big issues in `AccountingEngine.sol::auctionSurplus()` when calculating values for the creating a Surplus Auction; specifically in [Lines 213 - 217](https://github.com/open-dollar/od-contracts/blob/dev/src/contracts/AccountingEngine.sol#L213-L217).

1.  The first issue is the `if` statement at [line 213](https://github.com/open-dollar/od-contracts/blob/dev/src/contracts/AccountingEngine.sol#L213-L217) which incorrectly checks if `_params.surplusTransferPercentage` is less than `ONE_HUNDRED_WAD` when it should check if it is less than `WAD`.

```

        if (_params.surplusTransferPercentage < ONE_HUNDRED_WAD) {
```

The maximum value for `_params.surplusTransferPercentage`, as checked by the function at [line 199](https://github.com/open-dollar/od-contracts/blob/dev/src/contracts/AccountingEngine.sol#L199), is `1e18` so the check at [line 213](https://github.com/open-dollar/od-contracts/blob/dev/src/contracts/AccountingEngine.sol#L213-L217) will always return `TRUE`.

However, the check should return `FALSE` when `_params.surplusTransferPercentage` is `1e18` or `100%` because in that case an auction shouldn't be created; rather the full `surplusAmount` should be transferred to `extraSurplusReceiver` in the next code block.

2.  The second issue is the use of `ONE_HUNDRED_WAD` to calculate `_amountToSell` at [Line 215](https://github.com/open-dollar/od-contracts/blob/dev/src/contracts/AccountingEngine.sol#L213-L217) which results in a hugely inflated figure in the newly created surplus auction.

The use of `ONE_HUNDRED_WAD` causes the calculated figure to be `100 times` greater than it should be.

        _amountToSell: _params.surplusAmount.wmul(ONE_HUNDRED_WAD - _params.surplusTransferPercentage)

### Impact

Issue 1. For the first issue; when `_params.surplusTransferPercentage` is `100%`, a ghost surplus Auction will be created and the entire `surplusAmount` amount will also be sent to the `extraSurplusReceiver` essentially double-counting a large amount of the surplus. This double accounting can destabilise the system and lead to underflows elsewhere.

Issue 2. Surplus auctions are created with massively inflated figures for `_amountToSell`. This has the potential to cause massive price imbalances and crash the protocol. There is potential here for a malicious actor to leverage the vulnerability to their advantage by creating lots of false surplus in system coins which they purchase cheaply.

### Proof of Concept

The following combines both issues into one PoC to show the worst case scenario.

Given the following values and assuming the initial all checks pass in function before reaching Line 213 `AccountingEngine.sol::auctionSurplus()`:

    WAD = 1e18
    surplusTransferPercentage = 1e18 (representative of 100%)
    surplusAmount = 3e18
    ONE_HUNDRED_WAD = 100e18

The following condition at Line 213 will always return TRUE:

    if (_params.surplusTransferPercentage < ONE_HUNDRED_WAD)

So an auction will be created with `_amountToSell` 100 times higher than it should be:

        _amountToSell: _params.surplusAmount.wmul(ONE_HUNDRED_WAD - _params.surplusTransferPercentage),

    Returns 297e18; where coin surplusAmount is only 3e18:
    _amountToSell = 3e18 * (100e18 - 1e18) / 1e18
                  = 3e18 * 99e18 / 1e18
                  = 297e18
                  = 297 WAD

Following this, a coin amount of `surplusAmount` is also sent to the `extraSurplusReceiver` calculated in [Lines 224-231](https://github.com/open-dollar/od-contracts/blob/dev/src/contracts/AccountingEngine.sol#L224-L231) which is actually the intended behaviour.

### Tools Used

Foundry

### Recommended Mitigation Steps

Update the function on the two affected lines to use `WAD` instead of `ONE_HUNDRED_WAD` as:

<details>

```diff
  function auctionSurplus() external returns (uint256 _id) {
    if(_params.surplusTransferPercentage > WAD) revert AccEng_surplusTransferPercentOverLimit();
    if (_params.surplusAmount == 0) revert AccEng_NullAmount();
    if (extraSurplusReceiver == address(0)) revert AccEng_NullSurplusReceiver();
    if (block.timestamp < lastSurplusTime + _params.surplusDelay) revert AccEng_SurplusCooldown();

    uint256 _coinBalance = safeEngine.coinBalance(address(this));
    uint256 _debtBalance = safeEngine.debtBalance(address(this));
    (_coinBalance, _debtBalance) = _settleDebt(_coinBalance, _debtBalance, _unqueuedUnauctionedDebt(_debtBalance));

    if (_coinBalance < _debtBalance + _params.surplusAmount + _params.surplusBuffer) {
      revert AccEng_InsufficientSurplus();
    }

    // auction surplus percentage
-   if (_params.surplusTransferPercentage < ONE_HUNDRED_WAD) {
+   if (_params.surplusTransferPercentage < WAD) {
      _id = surplusAuctionHouse.startAuction({
-        _amountToSell: _params.surplusAmount.wmul(ONE_HUNDRED_WAD - _params.surplusTransferPercentage),
+        _amountToSell: _params.surplusAmount.wmul(WAD - _params.surplusTransferPercentage),
        _initialBid: 0
      });

      lastSurplusTime = block.timestamp;
      emit AuctionSurplus(_id, 0, _params.surplusAmount.wmul(ONE_HUNDRED_WAD - _params.surplusTransferPercentage));
    }

    // transfer surplus percentage
    if (_params.surplusTransferPercentage > 0) {
      if (extraSurplusReceiver == address(0)) revert AccEng_NullSurplusReceiver();

      safeEngine.transferInternalCoins({
        _source: address(this),
        _destination: extraSurplusReceiver,
        _rad: _params.surplusAmount.wmul(_params.surplusTransferPercentage)
      });

      lastSurplusTime = block.timestamp;
      emit TransferSurplus(extraSurplusReceiver, _params.surplusAmount.wmul(_params.surplusTransferPercentage));
    }
  }
```
</details>

**[RaymondFam (Lookout) commented](https://github.com/code-423n4/2023-10-opendollar-findings/issues/26#issuecomment-1780191087):**
 > `_amountToSell` is indeed very close to 100 times (99% plus).

**[pi0neerpat (OpenDollar) confirmed](https://github.com/code-423n4/2023-10-opendollar-findings/issues/26#issuecomment-1783550386)**

**[MiloTruck (Judge) commented](https://github.com/code-423n4/2023-10-opendollar-findings/issues/26#issuecomment-1792490617):**
 > The warden has demonstrated how due to the incorrect use of `ONE_HUNDRED_WAD` instead of `WAD` when calculating percentages, surplus auctions will be created with massively inflated values, breaking the accounting of the protocol. As such, I agree with high severity.
> 
> Selected this report for best as it outlines the issues, impacts and recommended mitigation really well despite the lack of a coded PoC.

**[pi0neerpat (OpenDollar) commented](https://github.com/code-423n4/2023-10-opendollar-findings/issues/26#issuecomment-1861161709)**
 >Resolved [here](https://github.com/open-dollar/od-contracts/pull/254).

***
