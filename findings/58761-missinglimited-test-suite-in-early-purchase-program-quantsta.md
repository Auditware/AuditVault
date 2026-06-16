---
tags:
  - severity/high
  - sector/staking
  - sector/liquid-staking
  - sector/farm
  - platform/quantstamp
protocol: "[[Exceed Finance Liquid Staking & Early Purchase]]"
auditors:
  - István Böhm
report: "https://certificate.quantstamp.com/full/exceed-finance-liquid-staking-early-purchase/cde4c9ed-dfc2-460f-bc2c-780ce622fff7/index.html"
genome:
  - "[[upgrade-safety]]"
  - "[[data/uninitialized]]"
  - "[[data-corruption/state-manipulation]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/protocol-wide]]"
---
# Missing/limited Test Suite in Early Purchase Program

- id: 58761
- impact: HIGH
- protocol: Exceed Finance Liquid Staking & Early Purchase
- reporter: István Böhm (Quantstamp)
- source: https://certificate.quantstamp.com/full/exceed-finance-liquid-staking-early-purchase/cde4c9ed-dfc2-460f-bc2c-780ce622fff7/index.html

## Summary


The client has marked a bug as "Fixed" in the Early Purchase program, but there are still some tests failing. The program currently does not have a test suite, which puts it at risk for serious bugs. It is recommended that a test suite be created with unit tests, integration tests, and a variety of test cases to ensure proper functioning and security. The test suite should also verify state changes, invariants, and event emissions, and may include fuzz testing. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `20183672aa44758c6c31e9d858cfac22f5e67d75`. The client provided the following explanation:

> I've added a test suite for the Early Purchase program.

**NOTE**: Some tests are failing - see test run at end of this report.

**Description:** The Early Purchase program appears to be completly missing a test suite. Contracts that are not extensively tested are at high risk of serious bugs that can impact the protocol's proper functioning and security. While audits can help developers to find bugs, they are not a substitute for thorough unit and integration testing.

**Recommendation:** A test suite should be created, which:

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
