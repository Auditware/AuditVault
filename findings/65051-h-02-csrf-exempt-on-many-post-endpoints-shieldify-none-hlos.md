---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/perpetuals
protocol: "[[Hlos]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Hlos-Security-Review.md"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# [H-02] `@csrf_exempt` on Many POST Endpoints

- id: 65051
- impact: HIGH
- protocol: [[Hlos]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Hlos-Security-Review.md

## Summary


The bug report discusses a potential security issue in two files, `perps/views.py` and `spot/views.py`, which are used in a software application. These files import and use `@csrf_exempt` on multiple endpoints. This can lead to a high-risk vulnerability known as Cross-Site Request Forgery (CSRF), where an attacker can manipulate a user's browser to perform unauthorized actions on their behalf. The report suggests that this can be prevented by enforcing alternate forms of authentication and ensuring that the endpoints are safe to call from other sources. The affected code and its location are also mentioned in the report. The impact of this vulnerability includes unauthorized actions such as placing or cancelling orders on behalf of users. The recommendation is to re-enable CSRF protection for endpoints used by browsers and to remove `@csrf_exempt` unless there is a compelling reason. The bug has been fixed by the team.

## Details


## Severity

High Risk

## Description

Both `perps/views.py` and spot/views.py import and use `@csrf_exempt` on multiple endpoints.

If the endpoint relies on cookie-based authentication (sessions), an attacker could craft a malicious page that causes a victim’s browser to POST to these endpoints and perform actions as the victim (Cross-Site Request Forgery). If token-based auth is not enforced, the CSRF exemption broadens the attack surface.

CSRF protections exist to prevent a third-party website from causing stateful actions in users’ browsers. Removing them requires you to enforce alternate robust authentication (e.g., bearer tokens in headers) and to ensure endpoints are safe to call cross-origin; the code does not show such compensating controls.

This refers to OWASP: A05 – Security Misconfiguration / A07 – Identification and Authentication Failures (CSRF and auth bypass risk).

**Vulnerable Scenario:**
Vulnerable code examples: (file shows multiple @csrf_exempt occurrences)

```python
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
@csrf_exempt
@csrf_exempt
```

## Location of Affected Code

File: [perps/views.py](https://github.com/rePRICE-OS/backend/blob/56e9b7bfb7d1ecf14a66844f683218422aace350/perps/views.py)

File: [spot/views.py](https://github.com/rePRICE-OS/backend/blob/56e9b7bfb7d1ecf14a66844f683218422aace350/spot/views.py)

## Impact

Unauthorized actions such as placing or cancelling orders on behalf of authenticated users, changing user data if endpoints permit.

## Recommendations

Re-enable CSRF protection for endpoints that are used by browsers. Remove `@csrf_exempt` **unless there is a compelling reason.**

## Team Response

Fixed.
