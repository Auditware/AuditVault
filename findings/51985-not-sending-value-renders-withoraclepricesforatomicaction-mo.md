---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - sector/oracle
protocol: "[[RFX]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/rfx-exchange/v21"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[pyth-oracle-completeness]]"
---
# Not sending value renders withOraclePricesForAtomicAction modifier useless

- id: 51985
- impact: HIGH
- protocol: v2.1
- reporter: Halborn
- source: https://www.halborn.com/audits/rfx-exchange/v21

## Summary


This bug report is about a problem in the `OracleModule` contract where a call to `setPricesForAtomicAction` inside the `Oracle` contract is not sending any ETH to the Pyth provider for its services. This causes the Pyth endpoint to revert the transaction as no fee was provided. The report suggests sending the required fee alongside the call to the `oracle` to solve this issue. The Relative Finance team has already solved this problem by making the necessary changes in the code.

## Details

##### Description

Inside the `OracleModule` contract, `withOraclePricesForAtomicAction` modifier, there is a call to `setPricesForAtomicAction` inside the `Oracle` contract, which calls `_validatePrices` and so it sends a given fee to the Pyth provider for its services. However, no ETH is sent (without taking into account the previous issue around the `payable` keyword), so the Pyth endpoint will revert the transaction as no fee was provided.

##### Proof of Concept

Pretty visual:

<https://github.com/relative-finance/rfx-contracts/blob/53b871efdaa63437c8397aa7bae4f3cdb6364ae5/contracts/oracle/OracleModule.sol#L35C1-L41C6>

```
    modifier withOraclePricesForAtomicAction(
        OracleUtils.SetPricesParams memory params
    ) {
        oracle.setPricesForAtomicAction(params);
        _;
        oracle.clearAllPrices();
    }
```

As seen before, the call to `setPricesForAtomicAction` needs some ETH to be used as fees, but no ETH is sent, so any function with this modifier, namely `WithdrawalHandler::executeAtomicWithdrawal` renders useless.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:C/A:N/D:C/Y:N/R:N/S:C (10.0)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:C/A:N/D:C/Y:N/R:N/S:C)

##### Recommendation

It is recommended to send the required fee attached to the call to `oracle.setPricesForAtomicAction`, so that the ETH is sent through the contract to the Pyth endpoint.

### Remediation Plan

**SOLVED:** The **Relative Finance team** solved this issue by sending the required fee alongside the call to the `oracle`:

<https://github.com/relative-finance/rfx-contracts/pull/47/files#diff-ec9855fdb537cbb2d7605899ff9818f4988dbd02b59ccd34f148e721d5c0bc3c>

```
    modifier withOraclePricesForAtomicAction(
        OracleUtils.SetPricesParams memory params
    ) {
        oracle.setPricesForAtomicAction{value: msg.value}(params);
        _;
        oracle.clearAllPrices();
    }
```
