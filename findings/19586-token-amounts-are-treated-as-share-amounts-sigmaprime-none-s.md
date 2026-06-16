---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/dex
  - sector/streaming
  - sector/token
protocol: "[[Sushi]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/sushi/auction-maker-furo/review.pdf"
genome:
  - "[[decimal-mismatch]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
---
# Token Amounts are Treated as Share Amounts

- id: 19586
- impact: HIGH
- protocol: [[Sushi]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/sushi/auction-maker-furo/review.pdf

## Summary


This bug report describes an issue with the BentoBox protocol, where inconsistencies in accounting occur from treating certain variables in units of the underlying ERC20 tokens rather than BentoBox shares. This causes recipients to be overpaid as shares in BentoBox are worth more than the underlying token amounts. The development team fixed the issue by changing the input parameters to include a total token amount and a percentage amount for the step size. The exact share values for cliff and steps are then calculated from these inputs using depositedShares. Where appropriate, variable names have also been changed to accurately reflect which variables are amounts and which are shares. This was done in multiple commits and pull requests, with the latest being 5f88ce2.

## Details

## Description

Inconsistencies in accounting occur from treating certain variables in units of the underlying ERC20 tokens rather than BentoBox shares, causing recipients to be overpaid. 

In the function `createVesting()` on line [65], `depositedShares` is returned from `_depositToken`, but is not made use of. Instead, the original token parameters of `cliffAmount` and `stepAmount` are stored in `vests[vestId]`. 

The function `_transferToken()` expects `amount` to be a value in shares rather than underlying tokens. As a result, `withdraw()` and `stopVesting()` will pay the recipient shares which are denominated in underlying token units. As shares in BentoBox are worth more than the underlying token amounts, the recipient will be overpaid at the expense of the protocol.

## Recommendations

In the struct `Vest`, rename `cliffAmount` and `stepAmount` to `cliffShares` and `stepShares`, and within `createVesting()`, calculate the appropriate share values to use in these variables from `depositedShares`.

## Resolution

The development team has fixed the issue by changing the input parameters to include a total token amount and a percentage amount for the step size. The exact share values for cliff and steps are then calculated from these inputs using `depositedShares`, the return value from `_depositToken`.

Where appropriate, variable names have also been changed to accurately reflect which variables are amounts and which are shares. This is shown in multiple commits and pull requests, with the latest being `5f88ce2`.
