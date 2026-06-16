---
tags:
  - lang/circom
  - sector/farm
  - sector/zk
  - platform/quantstamp
  - severity/high
  - vuln/reentrancy/single-function
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Hinkal Protocol]]"
auditors:
  - "[[Shih-Hung Wang]]"
report: "https://certificate.quantstamp.com/full/hinkal-protocol/66b9b783-8b42-4a4e-89ed-3ef2a2df5958/index.html"
genome:
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
---
# Missing/Limited Test Suite

- id: 60151
- impact: HIGH
- protocol: [[Hinkal Protocol]]
- reporter: Shih-Hung Wang (Quantstamp)
- source: https://certificate.quantstamp.com/full/hinkal-protocol/66b9b783-8b42-4a4e-89ed-3ef2a2df5958/index.html

## Summary


This bug report is about a recent update that was marked as "Fixed" by the client. The update included new checks and tests for the protocol, but when the test suite was run, it did not work. Upon further investigation, it was found that many of the contracts were using outdated constructors and important tests for the protocol's core functionality were being skipped. The recommendation is to create a test suite with at least 90% branch coverage, including a mainnet fork, and a variety of test cases to cover all scenarios and verify state changes, invariants, and event emissions. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `196b5c612d2b3dd677e7bf844e921d793ee6ed1d`, `43d759425b217dab45f055595c7b6f82a0b12fc4`. The client provided the following explanation:

> The following types of checks/tests were added:
> 
> 
> 1.   Happy path scenarios.
> 2.   tests regarding reverts.
> 3.   tests regarding edge cases.
> 4.   tests that check role permissions.
> 5.   test that check events emissions.
> 6.   Reentrancy related tests. integration tests were added for minting access tokens, deposits and withdrawals. all contracts in the scope of the audit have 90% branch coverage or more. For Integration Tests:
> 7.   run makefile in circom folder to copy circuits to hardhat folder
> 8.   run "yarn test-integration"

**Description:** We were unable to run the test suite with the instructions provided. A deeper look into the test files revealed further concerns. Many of the contracts were being initialized with outdated constructors. The tests for the protocol's core functionality, the merkle tree and Hinkal transactions and swaps, were being skipped entirely.

**Recommendation:** We would like to emphasize that an audit is not a replacement for strong unit/integration testing. A test suite should be created, which:

*   Has at least 90% branch coverage
*   Includes unit tests and integration tests with a mainnet fork
*   Includes a variety of test cases, including:
    *   All "happy path" scenarios
    *   Negative test cases
    *   Unexpected or edge cases
    *   All role permissions and access control for protected functions.

*   Verifies the following through assertions:
    *   All state changes
    *   Invariants
    *   Emission of events

*   May include fuzz testing
