---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/lending
protocol: "[[Timeswap]]"
auditors:
  - "[[0xcm]]"
report: "https://code4rena.com/reports/2023-01-timeswap"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
  - "[[reentrancy-guard]]"
---
# [H-03] The `collect()` function will always TRANSFER ZERO fees, losing _feesPositions without receiving fees!

- id: 24903
- impact: HIGH
- protocol: [[Timeswap]]
- reporter: 0xcm (Code4rena)
- source: https://code4rena.com/reports/2023-01-timeswap

## Summary


A bug was found in the `collect()` function of the TimeswapV2LiquidityToken contract. The function will always transfer zero fees, and non-zero `_feesPositions` will be burned. This leaves the contracts in an inconsistent state, as the user will burn `_feesPositions` without receiving the fees.

The bug was found in the following line:

    // transfer the fees amount to the recipient
    ITimeswapV2Pool(poolPair).transferFees(param.strike, param.maturity, param.to, long0Fees, long1Fees, shortFees);

The values of  `long0Fees`, `long1Fees`, `shortFees` have not been calculated yet, and will be equal to zero. Therefore, no fees will be transferred. 

The bug was fixed by moving the line  `ITimeswapV2Pool(poolPair).transferFees` after `long0Fees`, `long1Fees`, `shortFees` have been calculated first. This was done with the help of Remix tool, and the fix was confirmed and resolved by vhawk19 (Timeswap).

## Details


Detailed description of the impact of this finding.
The `collect()` function will always transfer ZERO fees. At the same time, non-zero `_feesPosition` will be burned.

    _feesPositions[id][msg.sender].burn(long0Fees, long1Fees, shortFees);

As a result, the contracts will be left in an inconsistent state. The user will burn `_feesPositions` without receiving the fees!

### Proof of Concept

Provide direct links to all referenced code in GitHub. Add screenshots, logs, or any other relevant proof that illustrates the concept.

The `collect()` function will always transfer ZERO fees   in the following line:

```
 // transfer the fees amount to the recipient
        ITimeswapV2Pool(poolPair).transferFees(param.strike, param.maturity, param.to, long0Fees, long1Fees, shortFees);

```

This is because, at this moment, the values of  `long0Fees`, `long1Fees`, `shortFees` have not been calculated yet, actually, they will be equal to zero. Therefore, no fees will be transferred. The values of  `long0Fees`, `long1Fees`, `shortFees` are calculated afterwards by the following line:

```
(long0Fees, long1Fees, shortFees) = _feesPositions[id][msg.sender].getFees(param.long0FeesDesired, param.long1FeesDesired, param.shortFeesDesired);

```

Therefore, `ITimeswapV2Pool(poolPair).transferFees` must be called after this line to be correct.

### Tools Used

Remix

### Recommended Mitigation Steps

We moved the line  `ITimeswapV2Pool(poolPair).transferFees` after `long0Fees`, `long1Fees`, `shortFees` have been calculated first.

    function collect(TimeswapV2LiquidityTokenCollectParam calldata param) external returns (uint256 long0Fees, uint256 long1Fees, uint256 shortFees, bytes memory data) {
            ParamLibrary.check(param);

            bytes32 key = TimeswapV2LiquidityTokenPosition({token0: param.token0, token1: param.token1, strike: param.strike, maturity: param.maturity}).toKey();

            // start the reentrancy guard
            raiseGuard(key);

            (, address poolPair) = PoolFactoryLibrary.getWithCheck(optionFactory, poolFactory, param.token0, param.token1);


            uint256 id = _timeswapV2LiquidityTokenPositionIds[key];

            _updateFeesPositions(msg.sender, address(0), id);

            (long0Fees, long1Fees, shortFees) = _feesPositions[id][msg.sender].getFees(param.long0FeesDesired, param.long1FeesDesired, param.shortFeesDesired);

            if (param.data.length != 0)
                data = ITimeswapV2LiquidityTokenCollectCallback(msg.sender).timeswapV2LiquidityTokenCollectCallback(
                    TimeswapV2LiquidityTokenCollectCallbackParam({
                        token0: param.token0,
                        token1: param.token1,
                        strike: param.strike,
                        maturity: param.maturity,
                        long0Fees: long0Fees,
                        long1Fees: long1Fees,
                        shortFees: shortFees,
                        data: param.data
                    })
                );

                    // transfer the fees amount to the recipient
            ITimeswapV2Pool(poolPair).transferFees(param.strike, param.maturity, param.to, long0Fees, long1Fees, shortFees);


            // burn the desired fees from the fees position
            _feesPositions[id][msg.sender].burn(long0Fees, long1Fees, shortFees);

            if (long0Fees != 0 || long1Fees != 0 || shortFees != 0) _removeTokenEnumeration(msg.sender, address(0), id, 0);

            // stop the reentrancy guard
            lowerGuard(key);
        }

**[vhawk19 (Timeswap) confirmed and resolved](https://github.com/code-423n4/2023-01-timeswap-findings/issues/121#issuecomment-1422586075):**
 > Fixed in [PR](https://github.com/Timeswap-Labs/Timeswap-V2-Monorepo/pull/256).


***
