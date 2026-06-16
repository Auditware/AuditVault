---
tags:
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
protocol: "[[Colbfinance]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/ColbFinance-Web2-Security-Review.md"
genome:
  - "[[missing-auth]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# [H-01] Unauthenticated Access Token Issuance in `SumSub` API

- id: 64057
- impact: HIGH
- protocol: [[Colbfinance]] Web2
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/ColbFinance-Web2-Security-Review.md

## Summary


The report explains a bug in the `/app/api/sumsub-access-token` endpoint, which is a part of the Sumsub API/SDK. This endpoint issues valid access tokens without requiring any authentication or authorization. This means that anyone can request a token for any user by providing their `userId` and `levelName`. This can potentially lead to impersonation and manipulation of user roles. The report includes a Proof of Concept (PoC) that confirms the issue and also highlights the impact of the bug, including integrity compromise and level name manipulation. The affected code location is also mentioned, along with the justification by OWASP for the severity of the bug. The report recommends implementing authentication and object-level authorization checks to prevent unauthorized access and potential privilege escalation attacks. The team has responded that the issue has been fixed.

## Details


## Severity

High Risk

## Description

The `/app/api/sumsub-access-token` endpoint issues valid Sumsub access tokens without requiring any authentication or authorization.
The endpoint accepts two query parameters:

- `userId` – the blockchain wallet address or unique identifier of the target account
- `levelName` – the KYC verification level (e.g., `BASIC`, `CORPORATE`)

An attacker can manipulate both parameters to:
Impersonate any user by providing their `userId`.
Potentially manipulate roles by changing `levelName` from BASIC to CORPORATE or other higher tiers.

This grants the attacker a valid JWT for the Sumsub API/SDK, which might be used in the flow for forged requests. The following PoC confirms the issue:

1. Request `BASIC` Level Access Token
   `curl -k "https://app.testnet.colb.io/app/api/sumsub-access-token?userId=0x6682490d38eb880bfbb5ef132be3b56fabc0832f&levelName=BASIC"`

2. Returns a valid Sumsub token for `BASIC` verification.

3. Go to `CORPORATE` Level
   `curl -k "https://app.testnet.colb.io/app/api/sumsub-access-token?userId=0x6682490d38eb880bfbb5ef132be3b56fabc0831f&levelName=CORPORATE"`

Response:

```json
{
  "token": "_act-sbx-jwt-eyJhbGciOiJub25lIn0.eyJqdGkiOiJfYWN0LXNieC0zMjhjZDFmZC01MWIxLTQ5MDAtOGFjYy00YzZiYTJhYTdjMmItdjIiLCJ1cmwiOiJodHRwczovL2FwaS5zdW1zdWIuY29tIn0.-v2"
}
```

<img width="1321" height="192" alt="Image" src="https://github.com/user-attachments/assets/49a9bd79-330f-4d86-97b5-15d77b8f00b4" />

## Impact

Integrity compromise: Ability to upload forged tokens and potentially pass fraudulent verification. Level Name manipulation: `BASIC`-level users can potentially obtain `CORPORATE`-level access tokens without approval.

## Location of Affected Code

Link: [/app/api/sumsub-access-token](https://app.testnet.colb.io/app/api/sumsub-access-token?userId=&levelName=BASIC)

### Justification by OWASP:

OWASP API Security Top 10 – API2:2023 – Broken Authentication
The endpoint grants valid Sumsub access tokens without requiring authentication. This violates the principle that sensitive API actions, such as initiating or continuing identity verification flows, must be protected by identity checks.

OWASP API Security Top 10 – API5:2023 – Broken Function-Level Authorization
There are no controls to verify that the user making the request has the right to request a Sumsub token for the specified `userId`, nor that the requested `levelName` is appropriate. This allows escalation of privileges and impersonation.

OWASP API Security Top 10 – API8:2023 – Security Misconfiguration
The fact that sensitive GET endpoints like this are exposed without access control reflects a misconfigured API environment. The system should follow the principle of least privilege and not allow open issuance of authentication tokens via GET requests.

_This finding highlights an important flaw in how GET requests are handled across the application. The `/sumsub-access-token` endpoint allows unauthenticated users to obtain valid tokens by simply guessing or supplying another user’s `userId` and `level`. This is part of a broader architectural issue where sensitive API operations (e.g., whitelist checks, transaction data, Sumsub integrations) are exposed via unprotected GET routes, effectively nullifying identity enforcement in the platform and enabling impersonation or potential privilege escalation attacks._

**Additionally, this flaw can be chained to tamper with the Whitelist process of a wallet, triggering a forged Profile verification successful in the UI.**

## Recommendation

Require authentication before issuing any KYC access token. Consider implementing object-level authorization checks to ensure that:

- The `userId` belongs to the authenticated user.
- The requested `levelName` matches the user’s permitted verification level.
- Reject any requests where `levelName` is manually supplied; derive it server-side from the account configuration.

## Team Response

Fixed.
