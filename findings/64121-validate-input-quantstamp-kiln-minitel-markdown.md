---
tags:
  - lang/solidity
  - sector/staking
  - platform/quantstamp
  - severity/high
  - novelty/variant
protocol: "[[Kiln]]"
auditors:
  - "[[Albert Heinle]]"
report: "https://certificate.quantstamp.com/full/kiln-minitel/934225af-0b19-4193-aac1-239a95d0ed17/index.html"
genome:
  - "[[missing]]"
  - "[[role-bypass]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# Validate input

- id: 64121
- impact: HIGH
- protocol: [[Kiln]] - Minitel
- reporter: Albert Heinle (Quantstamp)
- source: https://certificate.quantstamp.com/full/kiln-minitel/934225af-0b19-4193-aac1-239a95d0ed17/index.html

## Summary


This bug report highlights a problem where the code does not properly check or clean up user input in various parts of the application. This can make the code vulnerable to attacks like injection or cross-site scripting. To fix this, the report suggests using a centralized input validation strategy and specific tools like schema validation libraries and parameterized queries. The report also recommends using automated testing and validation during development to catch any missed input checks.

## Details

**Description:** Multiple components in the codebase lack proper input validation and sanitization. In several files, including handlers that process data from URL parameters, request bodies, and query strings, input is directly consumed without sufficient checks or normalization. This increases the risk of injection attacks and other input-based vulnerabilities, especially when user-controlled data is passed into database queries, file operations, or external services.

Additionally, currently the URL accepts without an issue `tx=!@%23$%^*()%27"` and renders it into the text field. There is a limited set of characters used in transaction hashes, and the input should be sanitized against that before being used to display on a text field. This will limit the ability to craft XSS type attack for an attacker.

**Recommendation:** Implement a centralized input validation strategy across all application layers. In TypeScript, this should include using schema validation libraries such as Zod, Yup, or io-ts to enforce strong runtime validation of all incoming data. Define explicit types for request and response structures, and combine static type checking with runtime validation to ensure that no untrusted data bypasses validation logic. Additionally, use parameterized queries, output encoding, and linting rules (e.g., via ESLint plugins) to guard against injection and cross-site scripting risks. Finally, integrate automated testing and CI/CD validation pipelines to detect missing input checks early in development.
