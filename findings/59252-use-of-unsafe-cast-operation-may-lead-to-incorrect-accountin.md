---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/dex
protocol: "[[Sperax Farms]]"
auditors:
  - "[[Gereon Mendler]]"
report: "https://certificate.quantstamp.com/full/sperax-farms/e6f8e3b1-d55d-4c05-91da-30d4a4bb7633/index.html"
genome:
  - "[[arithmetic/rounding]]"
  - "[[indirect-loss]]"
  - "[[integer-bounds]]"
---
# Use of Unsafe Cast Operation May Lead to Incorrect Accounting

- id: 59252
- impact: HIGH
- protocol: Sperax - Farms
- reporter: Gereon Mendler (Quantstamp)
- source: https://certificate.quantstamp.com/full/sperax-farms/e6f8e3b1-d55d-4c05-91da-30d4a4bb7633/index.html

## Summary


The client has reported a bug that has been marked as "fixed". The issue was found in three files: `TokenUtils.sol`, `CamelotV3Farm.sol`, and `UniV3Farm.sol`. The function `getUniV3TokenAmounts()` was downcasting a `uint256` value to `uint128` using an unsafe operation, which could lead to incorrect calculations if the value was larger than `2**128-1`. The same issue was found in three other functions and it is recommended to use a safe cast alternative, such as OpenZeppelin's SafeCast, to prevent unexpected errors.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `401c7378c197642e7eda8f75eb3b9da11ccc250b`. The client provided the following explanation:

> We have implemented OpenZeppelin SafeCast in all instances where we previously performed uint256 to uint128 typecasting.

**File(s) affected:**`TokenUtils.sol`, `CamelotV3Farm.sol`, `UniV3Farm.sol`

**Description:** Function `getUniV3TokenAmounts()` downcasts parameter `_liquidity` from `uint256` down to `uint128` using the unsafe cast operation `uint128(...)`, which will truncate values bigger than `2**128-1` and thereby lead to incorrect accounting in all follow up operations.

The same applies to functions:

1.   `TokenUtils.getCamelotV3TokenAmounts()`.
2.   `CamelotV3Farm.decreaseDeposit()`.
3.   `UniV3Farm.decreaseDeposit()`.

**Recommendation:** We recommend using a safe cast alternative, i.e. [OpenZeppelins SafeCast](https://docs.openzeppelin.com/contracts/5.x/api/utils#SafeCast), which reverts for values that would truncate, preventing unexpected follow up computations or otherwise ensuring that `_liquidity` may never exceed a value higher than `2**128-1`.
