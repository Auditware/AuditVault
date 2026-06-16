---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/staking
protocol: "[[Kiln]]"
auditors:
  - "[[Albert Heinle]]"
report: "https://certificate.quantstamp.com/full/kiln-minitel/934225af-0b19-4193-aac1-239a95d0ed17/index.html"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[dos-resistance]]"
---
# Unrestricted Input Size in Text Fields and Url Parameters

- id: 64125
- impact: HIGH
- protocol: [[Kiln]] - Minitel
- reporter: Albert Heinle (Quantstamp)
- source: https://certificate.quantstamp.com/full/kiln-minitel/934225af-0b19-4193-aac1-239a95d0ed17/index.html

## Summary


This bug report highlights an issue with an application where there are no limits on the size of text field inputs or URL parameters. This means that users can submit very large amounts of data, which can cause problems such as the application crashing or behaving unexpectedly. To fix this, the report recommends enforcing size limits for text inputs and restricting the overall length of URLs and individual query parameters. It also suggests validating input size both on the client and server side to ensure a better user experience and prevent security issues. 

## Details

**Description:** The application does not enforce limits on the size of text field inputs or URL parameters. This lack of restriction allows excessively large payloads to be submitted, which could lead to denial-of-service (DoS) conditions, memory exhaustion, or unexpected application behavior.

**Recommendation:** Enforce Input Size Limits: Impose reasonable maximum lengths for all text inputs.

Restrict the total URL length and individual query parameter sizes to prevent abuse.

Validate and Reject Early: Validate input size on both the client side (for user experience) and server side (for security enforcement).
