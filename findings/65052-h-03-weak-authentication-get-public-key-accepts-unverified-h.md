---
tags:
  - lang/solidity
  - sector/perpetuals
  - platform/shieldify
  - has/github
  - severity/high
  - precondition/insider
  - novelty/variant
protocol: "[[Hlos]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Hlos-Security-Review.md"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
  - "[[insider]]"
  - "[[variant]]"
---
# [H-03] Weak Authentication: `get_public_key()` Accepts Unverified Header

- id: 65052
- impact: HIGH
- protocol: [[Hlos]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Hlos-Security-Review.md

## Summary


The bug report describes a high-risk issue in a function called `get_public_key()` in two files, `perps/views.py` and `spot/views.py`. The function does not properly verify the "Authorization: PublicKey <value>" header, which means that anyone can pretend to be a verified user and perform actions on the platform. This is a serious issue that can lead to complete impersonation and unauthorized access. The team has fixed the issue and recommends implementing cryptographic challenge-response authentication or using OAuth2 or JWT authentication as a more secure alternative.

## Details


## Severity

High Risk

## Description

The `get_public_key()` function extracts the “Authorization: PublicKey <value>” header and treats it as an authenticated identity without verification.

Vulnerable code:

```python
def get_public_key(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("PublicKey "):
        return None
    return auth_header.split(" ")[1]
```

This refers to OWASP Mapping: A07:2021 – Identification and Authentication Failures, API2:2023 – Broken Authentication

**Vulnerable Scenario:**
Send arbitrary header:

```html
curl -X POST https://target/perps/open_market_order \ -H "Authorization:
PublicKey 0xFAKE" \ -d "name=BTC-USD&sz=0.1&is_buy=true"
```

The request is accepted and executed without ownership validation.

## Location of Affected Code

File: [perps/views.py](https://github.com/rePRICE-OS/backend/blob/56e9b7bfb7d1ecf14a66844f683218422aace350/perps/views.py)

File: [spot/views.py](https://github.com/rePRICE-OS/backend/blob/56e9b7bfb7d1ecf14a66844f683218422aace350/spot/views.py)

## Impact

Complete impersonation, any attacker can act as any wallet holder, performing trades or other privileged actions

## Recommendations

Implement cryptographic challenge–response authentication:

- Server issues a random nonce.
- Client signs it with its private key.
- Server verifies signature.

Alternatively, use OAuth2 or JWT authentication.

## Team Response

Fixed.
