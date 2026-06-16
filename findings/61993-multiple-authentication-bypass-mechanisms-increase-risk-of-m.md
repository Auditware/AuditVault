---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/dex
protocol: "[[SaucerSwap]]"
auditors:
  - "[[Albert Heinle]]"
report: "https://certificate.quantstamp.com/full/saucer-swap-wallet/d30efab8-8abd-46b1-bba5-6360b87e3aa3/index.html"
genome:
  - "[[centralization]]"
  - "[[ownership-takeover]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
---
# Multiple Authentication Bypass Mechanisms Increase Risk of Misconfiguration

- id: 61993
- impact: HIGH
- protocol: [[SaucerSwap]] Wallet
- reporter: Albert Heinle (Quantstamp)
- source: https://certificate.quantstamp.com/full/saucer-swap-wallet/d30efab8-8abd-46b1-bba5-6360b87e3aa3/index.html

## Summary


The client has marked a bug as "Fixed" and provided an explanation for the fix. The bug was related to the authentication system and involved two different ways to bypass the login process. This created a potential security risk and made it difficult to audit for compliance. The client recommends unifying the bypass logic behind a single flag or configuration file and restricting it to development environments only. They also suggest adding a warning if both bypass mechanisms are set inconsistently and using build time tools to fail builds with the bypass enabled in production. 

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `6bb6183c1cfaac59c98b31cebd1113836449d702`. Additional fix in: `f63cc429f04754d9adc1d2613388cee5cc67861a`.

The client provided the following explanation:

> Removed skipAuth parameter from wallet creation and import functions Improved dev authentication bypass to use **DEV** instead of env variable

**File(s) affected:**`wallet/index.ts`

**Description:** The authentication system includes two distinct mechanisms to bypass login logic:

*   A runtime parameter: `skipAuth`
*   An environment variable: `process.env.EXPO_PUBLIC_SKIP_AUTH`

This dual mechanism increases the surface area for accidental or unauthorized bypass of authentication. If either is misconfigured, authentication may silently be disabled - especially dangerous in production environments where environment variables can be overwritten, injected, or left in debug mode.

Moreover, without a unified control or mutual exclusivity, this creates inconsistent logic flow and makes auditing for security compliance more difficult. Developers may also incorrectly assume one disables auth without realizing another pathway is still active.

**Recommendation:**

*   Unify auth bypass logic behind a single, centralized flag or configuration file.

*   Restrict any bypass functionality (e.g., via `process.env.SKIP_AUTH`) to development environments only using explicit environment checks

*   If both `skipAuth` and `EXPO_PUBLIC_SKIP_AUTH` are kept:

    *   Introduce a warning if both are set inconsistently.
    *   Add a runtime assertion to prevent bypass in production builds.

Consider using build time tools (like Expo’s config plugins or CI checks) to fail builds that have `SKIP_AUTH` enabled in production.
