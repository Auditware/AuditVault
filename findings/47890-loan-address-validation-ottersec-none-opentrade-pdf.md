---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/ottersec
  - has/poc
  - severity/high
  - trigger/low-liquidity
  - novelty/variant
protocol: "[[OpenTrade]]"
auditors:
  - "[[Nicholas R. Putra]]"
report: "https://www.open-trade.io/"
genome:
  - "[[wrong-condition]]"
  - "[[trigger/low-liquidity]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Loan Address Validation

- id: 47890
- impact: HIGH
- protocol: [[OpenTrade]]
- reporter: Nicholas R. Putra (OtterSec)
- source: https://www.open-trade.io/

## Summary


This bug report discusses a vulnerability in the code for initiating a rollover process for loans in a liquidity pool. The issue is caused by a lack of validation in the code, which allows a malicious PoolAdmin to manipulate the priorLoan contract and return incorrect values during the rollover calculation. This can result in an inaccurate distribution of assets and shares, favoring the PoolAdmin's interests. The report provides a proof of concept and suggests a remediation strategy to include validation checks for the priorLoan contract. This vulnerability has been fixed in the latest version of the code.

## Details

## Vulnerability in initiateRollover Method

The `initiateRollover` method within the pool is responsible for initiating the rollover process for a loan within the liquidity pool. As showcased in the code below, this method internally calls `PoolLib::calculateRollover`, which takes in `priorLoan` to calculate the `assetsFromPriorToNextLoan` value, representing the assets that must be transferred from the prior loan to the new one.

```solidity
// contracts/Pool.sol
function initiateRollover(
    address loan,
    address priorLoan
) external onlyNotPaused onlyPoolController {
    uint256 _outstandingLoanPrincipals;
    uint256 assetsFromPool;
    uint256 assetsFromPriorToNextLoan;
    uint256 totalSupply;
    uint256 assetToAReturnToPool;
    
    (
        _outstandingLoanPrincipals,
        assetsFromPool,
        assetsFromPriorToNextLoan,
        totalSupply,
        assetToAReturnToPool
    ) = PoolLib.calculateRollover(
        priorLoan,
        address(_liquidityAsset),
        address(this),
        _accountings.outstandingLoanPrincipals
    );
    [...]
}
```

## Vulnerability Description

The vulnerability arises due to `initiateRollover` not performing validation to confirm whether the `priorLoan` address corresponds to a valid Loan contract. Consequently, this oversight may result in a scenario where a malicious `PoolAdmin` manipulates the `priorLoan` contract, returning incorrect values while calculating the rollover parameters.

Thus, the malicious `PoolAdmin` may provide their own address as the `priorLoan` contract, possessing custom behavior that is intentionally crafted to manipulate the values returned during the rollover calculation. This subsequently results in an inaccurate distribution of assets and shares between the old and new loans, ultimately favoring the admin’s interests.

## Proof of Concept

1. A malicious `PoolAdmin` calls `initiateRollover` with `priorLoan` set to an address which points to a custom contract made by them.
2. This address for `priorLoan` is passed to `PoolLib::calculateRollover` alongside other required parameters.
3. In `PoolLib::calculateRollover`, while calculating `assetsFromPriorToNextLoan`, it receives the values for principal and interest from the `priorLoan` contract.
4. The `priorLoan` contract returns incorrect values of principal and interest, resulting in `assetsFromPriorToNextLoan` being significantly higher than expected, ultimately benefiting the `PoolAdmin`.

## Remediation

Ensure `initiateRollover` includes adequate validation checks to confirm that the `priorLoan` address points to a valid Loan contract with the expected behavior.

```solidity
// contracts/Pool.sol
function initiateRollover(
    address loan,
    address priorLoan
) external onlyNotPaused onlyPoolController {
    require(loan == requestedLoan && priorLoan == activeLoan, "Pool: invalid loan");
    
    uint256 _outstandingLoanPrincipals;
    uint256 assetsFromPool;
    uint256 assetsFromPriorToNextLoan;
    uint256 totalSupply;
    uint256 assetToAReturnToPool;
    
    (
        _outstandingLoanPrincipals,
        assetsFromPool,
        assetsFromPriorToNextLoan,
        totalSupply,
        assetToAReturnToPool
    ) = PoolLib.calculateRollover(
        priorLoan,
        address(_liquidityAsset),
        address(this),
        _accountings.outstandingLoanPrincipals
    );
    [...]
}
```

## Patch

Fixed in commit `e20b41a`.
