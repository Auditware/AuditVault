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
# Missing payable keyword renders some functions useless

- id: 51984
- impact: HIGH
- protocol: v2.1
- reporter: Halborn
- source: https://www.halborn.com/audits/rfx-exchange/v21

## Summary


Summary: The bug report states that the functions `validatePrices` and `setPricesForAtomicAction` do not have the `payable` keyword, which is needed to send ETH to the Pyth provider. This renders these functions unusable. The recommendation is to add the `payable` keyword to these functions to solve the issue. The Relative Finance team has already solved the issue by adding the `payable` keyword to the affected functions. The remediation hash is provided for reference.

## Details

##### Description

Every call to `_validatePrices` should come from a `payable` function as it sends a fee to the Pyth provider **BUT** the functions `validatePrices` and `setPricesForAtomicAction` do not have such a keyword, as oposed to `setPrices`, so they render unusable. The place where ETH is needed is [here](https://github.com/relative-finance/rfx-contracts/blob/0466b4a880d7d5b87ff75b639358fbe53db3b313/contracts/oracle/Oracle.sol#L294).

##### Proof of Concept

The affected functions are:

<https://github.com/relative-finance/rfx-contracts/blob/0466b4a880d7d5b87ff75b639358fbe53db3b313/contracts/oracle/Oracle.sol#L179C1-L184C6>

```
    function validatePrices(
        OracleUtils.SetPricesParams memory params,
        bool forAtomicAction
    ) external onlyController returns (OracleUtils.ValidatedPrice[] memory) {
        return _validatePrices(params, forAtomicAction);
    }
```

<https://github.com/relative-finance/rfx-contracts/blob/0466b4a880d7d5b87ff75b639358fbe53db3b313/contracts/oracle/Oracle.sol#L119C1-L125C6>

```
    function setPricesForAtomicAction(
        OracleUtils.SetPricesParams memory params
    ) external onlyController {
        OracleUtils.ValidatedPrice[] memory prices = _validatePrices(params, true);

        _setPrices(prices);
    }
```

it can be seen they do **NOT** have the `payable` keyword, so calls to these functions can **NOT** carry ETH. However, they both call `_validatePrices`, which eventually calls:

<https://github.com/relative-finance/rfx-contracts/blob/0466b4a880d7d5b87ff75b639358fbe53db3b313/contracts/oracle/Oracle.sol#L294>

```
            OracleUtils.ValidatedPrice memory validatedPrice = IOracleProviderPayable(provider).getOraclePrice{value: fee}(
                token,
                data
            );
```

but no ETH can be attached, so no fee can be sent to the Pyth provider, which reverts the transaction in those situation, rendering this core functionality useless.

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:C/A:N/D:C/Y:N/R:N/S:C (10.0)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:C/A:N/D:C/Y:N/R:N/S:C)

##### Recommendation

It is recommended to add the `payable` keyword to those functions that deal with `msg.value`, so that sending them ETH does not revert and can behave correctly.

### Remediation Plan

**SOLVED:** The **Relative Finance team** solved this issue by adding the `payable` keyword in the affected functions:

<https://github.com/relative-finance/rfx-contracts/blob/53b871efdaa63437c8397aa7bae4f3cdb6364ae5/contracts/oracle/Oracle.sol#L179C1-L184C6>

```
    function validatePrices(
        OracleUtils.SetPricesParams memory params,
        bool forAtomicAction
    ) external payable onlyController returns (OracleUtils.ValidatedPrice[] memory) {
        return _validatePrices(params, forAtomicAction);
    }
```

<https://github.com/relative-finance/rfx-contracts/blob/53b871efdaa63437c8397aa7bae4f3cdb6364ae5/contracts/oracle/Oracle.sol#L119C1-L125C6>

```
    function setPricesForAtomicAction(
        OracleUtils.SetPricesParams memory params
    ) external payable onlyController {
        OracleUtils.ValidatedPrice[] memory prices = _validatePrices(params, true);

        _setPrices(prices);
    }
```

##### Remediation Hash

<https://github.com/relative-finance/rfx-contracts/commit/53b871efdaa63437c8397aa7bae4f3cdb6364ae5>
