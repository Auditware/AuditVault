---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/dos/frozen-funds
  - fix/use-reentrancy-guard
  - novelty/variant
protocol: "[[Ajna Protocol]]"
auditors:
  - "[[hyh]]"
report: "https://code4rena.com/reports/2023-05-ajna"
genome:
  - "[[frozen-funds]]"
  - "[[use-reentrancy-guard]]"
  - "[[variant]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[reentrancy-guard]]"
---
# [H-01] PositionManager's `moveLiquidity` can freeze funds by removing destination index even when the move was partial

- id: 20069
- impact: HIGH
- protocol: [[Ajna Protocol]]
- reporter: hyh (Code4rena)
- source: https://code4rena.com/reports/2023-05-ajna

## Summary


A bug has been identified in the PositionManager smart contract of Ajna that can cause a permanent freeze of funds for the remaining position of the Liquidity Provider (LP) beneficiary. It occurs when the `IPool(params_.pool).moveQuoteToken(...)` call does not clear the position due to available liquidity constraints. The `positionIndex.remove(params_.fromIndex)` operation is triggered even when it is only a partial removal of funds, resulting in the freeze.

The bug is caused by the `_lpToQuoteToken(...)` function, which is used to retrieve the maximum amount of quote funds that can be moved based on the exchange rate. If the quote amount requested is greater than the amount available, the liquidity constraint will be binding, and the remaining funds will be frozen.

The recommended mitigation steps are to revert when there is a remainder, i.e. when `fromPosition.lps > dust_threshold`. This has been confirmed by ith-harvey (Ajna).

## Details


`positionIndex.remove(params_.fromIndex)`removes the PositionManager entry even when it is only partial removal as a result of `IPool(params_.pool).moveQuoteToken(...)` call.

I.e. it is correct to do `fromPosition.lps -= vars.lpbAmountFrom`, but the resulting amount might not be zero, moveQuoteToken() are not guaranteed to clear the position as it has available liquidity constraint. In the case of partial quote funds removal `positionIndex.remove(params_.fromIndex)` operation will freeze the remaining position.

### Impact

Permanent fund freeze for the remaining position of LP beneficiary.

### Proof of Concept

While `positions[params_.tokenId][params_.fromIndex]` LP shares are correctly reduced by the amount returned by pool's moveQuoteToken(), the position itself is unconditionally removed from the `positionIndexes[params_.tokenId]`, making any remaining funds unavailable:

<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L262-L323>

```solidity
    function moveLiquidity(
        MoveLiquidityParams calldata params_
    ) external override mayInteract(params_.pool, params_.tokenId) nonReentrant {
        Position storage fromPosition = positions[params_.tokenId][params_.fromIndex];

        MoveLiquidityLocalVars memory vars;
        vars.depositTime = fromPosition.depositTime;

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
>>      if (!positionIndex.remove(params_.fromIndex)) revert RemovePositionFailed();

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
>>      fromPosition.lps -= vars.lpbAmountFrom;
        toPosition.lps   += vars.lpbAmountTo;
        // update position deposit time to the from bucket deposit time
        toPosition.depositTime = vars.depositTime;
```

Bucket can contain a mix of quote and collateral tokens, but moveLiquidity() aims to retrieve `vars.maxQuote = _lpToQuoteToken(...)` quote funds per current exchange rate:

<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/libraries/helpers/PoolHelper.sol#L222-L236>

```solidity
    function _lpToQuoteToken(
        uint256 bucketLP_,
        uint256 bucketCollateral_,
        uint256 deposit_,
        uint256 lenderLPBalance_,
        uint256 maxQuoteToken_,
        uint256 bucketPrice_
    ) pure returns (uint256 quoteTokenAmount_) {
        uint256 rate = Buckets.getExchangeRate(bucketCollateral_, bucketLP_, deposit_, bucketPrice_);

        quoteTokenAmount_ = Maths.wmul(lenderLPBalance_, rate);

        if (quoteTokenAmount_ > deposit_)       quoteTokenAmount_ = deposit_;
        if (quoteTokenAmount_ > maxQuoteToken_) quoteTokenAmount_ = maxQuoteToken_;
    }
```

There might be not enough quote deposit funds available to redeem the whole quote amount requested, which is controlled by the corresponding liquidity constraint:

<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/libraries/external/LenderActions.sol#L711-L719>

```solidity
        uint256 scaledLpConstraint = Maths.wmul(params_.lpConstraint, exchangeRate);
        if (
>>          params_.depositConstraint < scaledDepositAvailable &&
            params_.depositConstraint < scaledLpConstraint
        ) {
            // depositConstraint is binding constraint
            removedAmount_ = params_.depositConstraint;
>>          redeemedLP_    = Maths.wdiv(removedAmount_, exchangeRate);
        }
```

### Recommended Mitigation Steps

As a most straightforward solution consider reverting when there is a remainder, i.e. when `fromPosition.lps > dust_threshold`:

<https://github.com/code-423n4/2023-05-ajna/blob/276942bc2f97488d07b887c8edceaaab7a5c3964/ajna-core/src/PositionManager.sol#L262-L323>

```diff
    function moveLiquidity(
        MoveLiquidityParams calldata params_
    ) external override mayInteract(params_.pool, params_.tokenId) nonReentrant {
        Position storage fromPosition = positions[params_.tokenId][params_.fromIndex];

        MoveLiquidityLocalVars memory vars;
        vars.depositTime = fromPosition.depositTime;

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
>>      fromPosition.lps -= vars.lpbAmountFrom;
        toPosition.lps   += vars.lpbAmountTo;
        // update position deposit time to the from bucket deposit time
        toPosition.depositTime = vars.depositTime;
```

**[ith-harvey (Ajna) confirmed](https://github.com/code-423n4/2023-05-ajna-findings/issues/503#issuecomment-1554797037)**



***
