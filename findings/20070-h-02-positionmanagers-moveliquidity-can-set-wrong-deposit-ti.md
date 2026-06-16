---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Ajna Protocol]]"
auditors:
  - "[[hyh]]"
report: "https://code4rena.com/reports/2023-05-ajna"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[reentrancy-guard]]"
---
# [H-02] PositionManager's `moveLiquidity` can set wrong deposit time and permanently freeze LP funds moved

- id: 20070
- impact: HIGH
- protocol: [[Ajna Protocol]]
- reporter: hyh (Code4rena)
- source: https://code4rena.com/reports/2023-05-ajna

## Summary


A bug has been identified in the `moveLiquidity()` function of the Ajna codebase. Currently, the function sets the deposit time of the destination index LP entry to be equal to the source index deposit time, while the destination bucket may have defaulted after that time. This means that healthy LP shares can be marked as defaulted due to an incorrect deposit time, and the owner will permanently lose access to their funds. This is a severe issue as it can lead to fund loss without any material prerequisites. 

The bug is caused by the lack of a check for the `params_.toIndex` bucket situation, where the time is just copied. In contrast, the LenderActions codebase does have checking logic which checks for the `toBucket` bankruptcy and sets the time accordingly. 

To mitigate this issue, it is recommended to consider using the resulting time of the destination position. This time value will be influenced by the other PositionManager positions in the `params_.toIndex` bucket, but the surface described will be closed as it will be controlled against `params_.toIndex` bucket bankruptcy time. This mitigation step has been confirmed by ith-harvey (Ajna).

## Details


`moveLiquidity()` set new destination index LP entry deposit time to be equal to the source index deposit time, while destination bucket might have defaulted after that time.

This is generally not correct as source bucket bankruptcy is controlled (i.e. LP shares that are moved are healthy), while the destination bucket's bankruptcy time, being arbitrary, can be higher than source index deposit time, and in this case the funds will become inaccessible after such a move (i.e. healthy shares will be marked as defaulted due to incorrect deposit time used).

In other words the funds are moved from healthy non-default zone to an arbitrary point, which can be either healthy or not. In the latter case this constitutes a loss for an owner as `toIndex` bucket bankruptcy time exceeding deposit time means that all other retrieval operations will be blocked.

### Impact

Owner will permanently lose access to the LP shares whenever `positions[params_.tokenId][params_.toIndex]` bucket bankruptcy time is greater than `positions[params_.tokenId][params_.fromIndex].depositTime`.

`moveLiquidity()` is a common operation, while source and destination bucket bankruptcy times can be related in an arbitrary manner, and the net impact is permanent fund freeze, so this is a fund loss without material prerequisites, setting the severity to be high.

### Proof of Concept

`moveLiquidity()` sets `toPosition` deposit time to be `fromPosition.depositTime`:

<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L262-L323>

```solidity
    function moveLiquidity(
        MoveLiquidityParams calldata params_
    ) external override mayInteract(params_.pool, params_.tokenId) nonReentrant {
        Position storage fromPosition = positions[params_.tokenId][params_.fromIndex];

        MoveLiquidityLocalVars memory vars;
>>      vars.depositTime = fromPosition.depositTime;

        // handle the case where owner attempts to move liquidity after they've already done so
        if (vars.depositTime == 0) revert RemovePositionFailed();

        // ensure bucketDeposit accounts for accrued interest
        IPool(params_.pool).updateInterest();

        // retrieve info of bucket from which liquidity is moved  
        (
            vars.bucketLP,
            vars.bucketCollateral,
            vars.bankruptcyTime,
            vars.bucketDeposit,
        ) = IPool(params_.pool).bucketInfo(params_.fromIndex);

        // check that bucket hasn't gone bankrupt since memorialization
        if (vars.depositTime <= vars.bankruptcyTime) revert BucketBankrupt();

        // calculate the max amount of quote tokens that can be moved, given the tracked LP
        vars.maxQuote = _lpToQuoteToken(
            vars.bucketLP,
            vars.bucketCollateral,
            vars.bucketDeposit,
            fromPosition.lps,
            vars.bucketDeposit,
            _priceAt(params_.fromIndex)
        );

        EnumerableSet.UintSet storage positionIndex = positionIndexes[params_.tokenId];

        // remove bucket index from which liquidity is moved from tracked positions
        if (!positionIndex.remove(params_.fromIndex)) revert RemovePositionFailed();

        // update bucket set at which a position has liquidity
        // slither-disable-next-line unused-return
        positionIndex.add(params_.toIndex);

        // move quote tokens in pool
        (
            vars.lpbAmountFrom,
            vars.lpbAmountTo,
        ) = IPool(params_.pool).moveQuoteToken(
            vars.maxQuote,
            params_.fromIndex,
            params_.toIndex,
            params_.expiry
        );

        Position storage toPosition = positions[params_.tokenId][params_.toIndex];

        // update position LP state
        fromPosition.lps -= vars.lpbAmountFrom;
        toPosition.lps   += vars.lpbAmountTo;
        // update position deposit time to the from bucket deposit time
>>      toPosition.depositTime = vars.depositTime;
```

I.e. there is no check for `params_.toIndex` bucket situation, the time is just copied.

While there is checking logic in LenderActions, which checks for `toBucket` bankruptcy and sets the time accordingly:

<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/libraries/external/LenderActions.sol#L315-L327>

```solidity
        vars.toBucketDepositTime = toBucketLender.depositTime;
        if (vars.toBucketBankruptcyTime >= vars.toBucketDepositTime) {
            // bucket is bankrupt and deposit was done before bankruptcy time, reset lender lp amount
            toBucketLender.lps = toBucketLP_;

            // set deposit time of the lender's to bucket as bucket's last bankruptcy timestamp + 1 so deposit won't get invalidated
            vars.toBucketDepositTime = vars.toBucketBankruptcyTime + 1;
        } else {
            toBucketLender.lps += toBucketLP_;
        }

        // set deposit time to the greater of the lender's from bucket and the target bucket
        toBucketLender.depositTime = Maths.max(vars.fromBucketDepositTime, vars.toBucketDepositTime);
```

This way, while bucket structure deposit time will be controlled and updated, PositionManager's structure will have the deposit time copied over.

In the case when `positions[params_.tokenId][params_.fromIndex].depositTime` was less than `params_.toIndex` `bankruptcyTime`, this will freeze these LP funds as further attempts to use them will be blocked:

<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L262-L285>

```solidity
    function moveLiquidity(
        MoveLiquidityParams calldata params_
    ) external override mayInteract(params_.pool, params_.tokenId) nonReentrant {
        Position storage fromPosition = positions[params_.tokenId][params_.fromIndex];

        MoveLiquidityLocalVars memory vars;
>>      vars.depositTime = fromPosition.depositTime;

        // handle the case where owner attempts to move liquidity after they've already done so
        if (vars.depositTime == 0) revert RemovePositionFailed();

        // ensure bucketDeposit accounts for accrued interest
        IPool(params_.pool).updateInterest();

        // retrieve info of bucket from which liquidity is moved  
        (
            vars.bucketLP,
            vars.bucketCollateral,
>>          vars.bankruptcyTime,
            vars.bucketDeposit,
        ) = IPool(params_.pool).bucketInfo();

        // check that bucket hasn't gone bankrupt since memorialization
>>      if (vars.depositTime <= vars.bankruptcyTime) revert BucketBankrupt();
```

<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L352-L372>

```solidity
    function reedemPositions(
        RedeemPositionsParams calldata params_
    ) external override mayInteract(params_.pool, params_.tokenId) {
        EnumerableSet.UintSet storage positionIndex = positionIndexes[params_.tokenId];

        ...

        for (uint256 i = 0; i < indexesLength; ) {
            index = params_.indexes[i];

            Position memory position = positions[params_.tokenId][index];

            if (position.depositTime == 0 || position.lps == 0) revert RemovePositionFailed();

            // check that bucket didn't go bankrupt after memorialization
>>          if (_bucketBankruptAfterDeposit(pool, index, position.depositTime)) revert BucketBankrupt();
```

<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L436-L443>

```solidity
    function _bucketBankruptAfterDeposit(
        IPool pool_,
        uint256 index_,
        uint256 depositTime_
    ) internal view returns (bool) {
        (, , uint256 bankruptcyTime, , ) = pool_.bucketInfo(index_);
>>      return depositTime_ <= bankruptcyTime;
    }
```

### Recommended Mitigation Steps

Consider using the resulting time of the destination position, for example:

<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L262-L323>

```diff
    function moveLiquidity(
        MoveLiquidityParams calldata params_
    ) external override mayInteract(params_.pool, params_.tokenId) nonReentrant {
        Position storage fromPosition = positions[params_.tokenId][params_.fromIndex];

        MoveLiquidityLocalVars memory vars;
        vars.depositTime = fromPosition.depositTime;

        ...

        Position storage toPosition = positions[params_.tokenId][params_.toIndex];

        // update position LP state
        fromPosition.lps -= vars.lpbAmountFrom;
        toPosition.lps   += vars.lpbAmountTo;
-       // update position deposit time to the from bucket deposit time
+       // update position deposit time with the renewed to bucket deposit time
+       (, vars.depositTime) = pool.lenderInfo(params_.toIndex, address(this));
        toPosition.depositTime = vars.depositTime;
```

Notice, that this time value will be influenced by the other PositionManager positions in the `params_.toIndex` bucket, but the surface described will be closed as it will be controlled against `params_.toIndex` bucket bankruptcy time.

**[ith-harvey (Ajna) confirmed](https://github.com/code-423n4/2023-05-ajna-findings/issues/494#issuecomment-1554797890)**



***
