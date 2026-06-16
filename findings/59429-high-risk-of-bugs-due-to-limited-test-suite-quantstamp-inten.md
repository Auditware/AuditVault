---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/farm
  - sector/staking
  - sector/streaming
protocol: "[[IntentX]]"
auditors:
  - "[[Mustafa Hasan]]"
report: "https://certificate.quantstamp.com/full/intent-x/a195e62f-30b6-4219-b9e5-42af8a9e2fd5/index.html"
genome:
  - "[[access-roles]]"
---
# High Risk of Bugs Due to Limited Test Suite

- id: 59429
- impact: HIGH
- protocol: [[IntentX]]
- reporter: Mustafa Hasan (Quantstamp)
- source: https://certificate.quantstamp.com/full/intent-x/a195e62f-30b6-4219-b9e5-42af8a9e2fd5/index.html

## Summary


The client has acknowledged an issue with the code for public sale and vesting contracts. The current test suite has very low coverage, with some contracts having 0% coverage. This puts the protocol at risk for serious bugs. The report recommends creating a test suite with at least 90% branch coverage, including a variety of test cases and assertions to verify state changes and invariants.

## Details

**Update**
Marked as "Acknowledged" by the client. The client provided the following explanation:

> for public sale and vesting contracts, code is very simple and audited. for Xintx, the complex part of the code have been heavily audited and test in other project and have been adapted.

**Description:** The current test suite provides very low coverage of the code branches, with 0% branch coverage for the `VestingXINTX` and `PublicSaleINTX` contracts and 50% coverage for `IntxUpgradeable` while `StakedINTX` has a coverage of 14.77%.

Contracts not extensively tested are at high risk of serious bugs impacting the protocol's proper functioning and security. While audits can help developers to find bugs, they are not a substitute for thorough unit and integration testing.

**Recommendation:** A test suite should be created, which:

*   Has at least `90%` branch coverage
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
