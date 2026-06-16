---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/dex
  - sector/privacy
protocol: "[[SaucerSwap]]"
auditors:
  - "[[Albert Heinle]]"
report: "https://certificate.quantstamp.com/full/saucer-swap-wallet/d30efab8-8abd-46b1-bba5-6360b87e3aa3/index.html"
genome:
  - "[[access-roles]]"
---
# Insecure Logging: Use of `console.error` with Potentially Sensitive Data

- id: 61992
- impact: HIGH
- protocol: [[SaucerSwap]] Wallet
- reporter: Albert Heinle (Quantstamp)
- source: https://certificate.quantstamp.com/full/saucer-swap-wallet/d30efab8-8abd-46b1-bba5-6360b87e3aa3/index.html

## Summary


The client has marked a bug as "Fixed" in the codebase, specifically in the file `utils/cryptoUtils.ts`. The bug was related to the use of `console.error` for error reporting, which can pose security and privacy risks in production environments. The client recommends replacing `console.error` with a structured logging library that supports redaction and level-based logging, such as `winston`. They also suggest implementing log sanitization and masking mechanisms to prevent sensitive data from being exposed in logs. It is important to handle logging carefully to avoid potential issues with data leakage or secure infrastructure.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `225513ddfe96a7dfff7ed3e40d56f4cd92b136b9`. The client provided the following explanation:

> Added comprehensive logging system with security redaction and performance optimization Implemented structured logging with react-native-logs integration Added security measures to prevent sensitive data exposure in logs Added tests

**File(s) affected:**`utils/cryptoUtils.ts`

**Description:** The codebase contains extensive use of `console.error` for error reporting, including instances where sensitive or user-derived data is passed directly into logs. This practice poses significant security and privacy risks, particularly in production environments or shared debugging contexts.

Use of `console.error` in production code:

*   Lacks built-in masking, redaction, or output-level control.
*   Often writes to stdout/stderr, which may be captured in logs, crash reports, or external services (e.g., cloud providers, CI logs).
*   Offers no structure or categorization, making it difficult to filter out sensitive fields (e.g., passwords, tokens, emails, IDs).
*   Cannot enforce log rotation, persistence levels, or compliance controls.

As a result, logging raw objects or messages using `console.error` can lead to:

*   Leakage of PII, credentials, session tokens, or internal system details.
*   Difficulty in scaling or securing logging infrastructure.

**Recommendation:** Replace `console.error` usage with a structured logging library that supports redaction and level-based logging, such as `winston`.

Implement log sanitization and masking mechanisms:

*   Define a list of sensitive fields (e.g., password, token, authorization, email) and redact them automatically before logging.
*   Avoid logging entire request/response bodies or large user objects.
*   Ensure different log levels (info, warn, error, debug) are used appropriately and can be filtered based on the environment.
*   Configure log transport and storage securely, ensuring logs are encrypted, access controlled, and rotated regularly.
*   In production, disable or severely restrict raw console logging to prevent accidental leakage.

Logging is a powerful tool for observability but must be handled with care.
