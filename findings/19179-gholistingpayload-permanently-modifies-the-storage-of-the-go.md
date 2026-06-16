---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - sector/algo-stable
  - sector/governance
  - sector/lending
  - sector/staking
protocol: "[[Aave]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/aave/aave-gho-aip/review.pdf"
genome:
  - "[[flash-loan-voting]]"
  - "[[permanent]]"
  - "[[vote-delegation-loop]]"
---
# GhoListingPayload permanently modifies the storage of the governance executor contract

- id: 19179
- impact: HIGH
- protocol: [[Aave]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/aave/aave-gho-aip/review.pdf

## Summary


The bug report is about the storage of the governance executor contract being affected when executing the GhoListingPayload payload. GhoListingPayload contains two state variables, GHO_TOKEN and GHO_FLASHMINTER, which are modified by the execute() function. When execute() is called in a standard CALL, these values would be stored in the storage of GhoListingPayload itself. However, when executed by DELEGATECALL, the function would modify the storage of the Executor contract, causing unexpected results when the next payload is executed.

The development team's recommendation was to not declare GHO_TOKEN and GHO_FLASHMINTER as state variables, but instead as immutable variables within the constructor. This would allow the values to be calculated at construction time. This recommendation was implemented at 957b050.

## Details

## Description

Executing the `GhoListingPayload` payload will change the storage of the governance executor contract, which could affect future payloads. Most of the variables in `GhoListingPayload` are either constant or immutable, which do not affect the contract’s storage.

However, `GhoListingPayload` does contain two state variables: `GHO_TOKEN` and `GHO_FLASHMINTER`. The `execute()` function modifies both of these variables. If `execute()` is called in a standard `CALL`, these values would be stored in the storage of `GhoListingPayload` itself. As it is intended to be called by `DELEGATECALL` when executed, it means that the function would modify the storage of the Executor contract.

This will not prevent `execute()` from functioning properly; however, it will store the values of `GHO_TOKEN` and `GHO_FLASHMINTER` in the first two storage slots of the Executor contract. This creates a permanent hazard. When the next payload is executed and accesses the storage slots of the Executor contract, then it would have unexpected values in those slots, which would produce unexpected results.

## Recommendations

Do not declare `GHO_TOKEN` and `GHO_FLASHMINTER` as state variables. Instead, consider declaring them as immutable variables within the constructor. The values are deterministic and can be calculated at construction time.

## Resolution

The development team implemented the recommendation at commit `957b050`.
