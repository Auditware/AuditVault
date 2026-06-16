---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/algo-stable
  - sector/lending
  - sector/stable
protocol: "[[Frax Finance]]"
auditors:
  - "[[Gustavo Grieco]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/FraxQ22022.pdf"
genome:
  - "[[stale-price]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[timestamp-dependence]]"
---
# leveragedPosition and repayAssetWithCollateral do not update the exchangeRate

- id: 17912
- impact: HIGH
- protocol: [[Frax Finance]]
- reporter: Gustavo Grieco (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/FraxQ22022.pdf

## Summary


This bug report is about the FraxLend platform, which allows users to borrow funds as long as they are solvent. The solvency check is implemented by the isSolvent modifier, which runs at the end of operations like leveragedPosition and repayAssetWithCollateral. However, the exchange rate changes over time, which can make previously solvent users insolvent. Therefore, it is important to force an update of the exchange rate during any operation that allows users to borrow funds. The leveragedPosition and repayAssetWithCollateral operations increase the debt of the caller but do not call updateExchangeRate, so they will perform the solvency check with old information. 

This can be exploited by a malicious user, who can call leveragedPosition or repayAssetWithCollateral to borrow more than the amount of shares/collateral they should be able to. To fix this, it is recommended to add a call to updateExchangeRate in every function that increases users’ debt. Additionally, it is recommended to document the invariants and preconditions for every function and use extensive smart contract fuzzing to test that system invariants cannot be broken.

## Details

## Vulnerability Report

## Diﬃculty 
**High**

## Type 
**Access Controls**

## Description
Some FraxLend functions do not update the exchange rate, allowing insolvent users to call them. The FraxLend platform oﬀers various operations, such as `leveragedPosition` and `repayAssetWithCollateral`, for users to borrow funds as long as they are solvent. The solvency check is implemented by the `isSolvent` modifier, which runs at the end of such operations:

```solidity
/// @notice Checks for solvency AFTER executing contract code
/// @param _borrower The borrower whose solvency we will check
modifier isSolvent(address _borrower) {
    _;
    require(_isSolvent(_borrower, exchangeRateInfo.exchangeRate), "FraxLendPair: user is insolvent");
}
```
*Figure 5.1: The `isSolvent` modifier in the FraxLendCore contract.*

However, this modifier is not enough to ensure solvency since the exchange rate changes over time, which can make previously solvent users insolvent. That is why it is important to force an update of the exchange rate during any operation that allows users to borrow funds:

```solidity
function updateExchangeRate() public returns (uint256 _exchangeRate) {
    ExchangeRateInfo memory _exchangeRateInfo = exchangeRateInfo;
    if (_exchangeRateInfo.lastTimestamp == block.timestamp) return _exchangeRate = _exchangeRateInfo.exchangeRate;
    …
    // write to storage
    _exchangeRateInfo.exchangeRate = uint224(_exchangeRate);
    _exchangeRateInfo.lastTimestamp = uint32(block.timestamp);
    exchangeRateInfo = _exchangeRateInfo;
    emit UpdateExchangeRate(_exchangeRate);
}
```
*Figure 5.2: Part of the `updateExchangeRate` function in the FraxLendCore contract.*

However, the `leveragedPosition` and `repayAssetWithCollateral` operations increase the debt of the caller but do not call `updateExchangeRate`; therefore, they will perform the solvency check with old information.

## Exploit Scenario
Eve, a malicious user, notices a drop in the collateral price. She calls `leveragedPosition` or `repayAssetWithCollateral` to borrow more than the amount of shares/collateral she should be able to.

## Recommendations
- **Short term**: Add a call to `updateExchangeRate` in every function that increases users’ debt.
- **Long term**: Document the invariants and preconditions for every function and use extensive smart contract fuzzing to test that system invariants cannot be broken.
