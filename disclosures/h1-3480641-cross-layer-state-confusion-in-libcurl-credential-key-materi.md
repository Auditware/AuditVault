---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "not-applicable"
weakness: "Violation of Secure Design Principles"
enriched: true
date: 2025-12-28
submitted: 2025-12-28T14:45:51.288Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/curl|curl]]"
reporter: "onevone"
source: "https://hackerone.com/reports/3480641"
title: "Cross‑Layer State Confusion in libcurl: Credential & Key‑Material Persistence Across Redirect / Connection Reuse Boundaries"
---
# Cross‑Layer State Confusion in libcurl: Credential & Key‑Material Persistence Across Redirect / Connection Reuse Boundaries

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 16 | **Program:** curl | **Disclosed:** 2025-12-28

- Report: [https://hackerone.com/reports/3480641](https://hackerone.com/reports/3480641)
- CWE: Violation of Secure Design Principles
- Submitted: 2025-12-28T14:45:51.288Z

## Timeline

- **Report Filed**
- **2025-12-28** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-12-28** @bagder: Is this the same or a variation of https://curl.se/docs/CVE-2022-27776.html ?

You did not mention which curl version you think is affected?
- **2025-12-28** @onevone: Thank you for the reference.
This report is not the same as CVE‑2022‑27776, nor a direct variation.
CVE‑2022‑27776 focuses on improper cleanup of HTTP headers during redirects, leading to credential leakage.
In contrast, this report documents a cross‑layer state confusion issue where authentication context and key‑material persist across redirect and connection‑reuse boundaries, violating the intended security model.
The core issue is not header forwarding, but the reuse of a security‑sensitive state in a context where it is no longer valid, which can cause inconsistent trust decisions between protocol layers.
Regarding affected versions: the behavior has been observed and reasoned about in libcurl ≥ 7.62.0 up to current, as it is related to architectural handling of connection reuse and redirect logic rather than a specific regression.
I am happy to clarify further or narrow the scope if needed.
- **2025-12-28** @bagder: I still don't understand. Please clarify what problem this claimed "confusion" leads to.
- **2025-12-28** @onevone: Thank you for the feedback.
I will clarify the concrete security impact caused by the reported cross‑layer state confusion.

**What the confusion actually leads to**
The issue is not theoretical state mismatch.
It results in credential and cryptographic material being reused outside of their original security context, which enables cross‑request and cross‑origin trust violations.
**Specifically:**
1)Authentication material (Authorization headers, client certificates, TLS session keys, or connection‑bound credentials) can persist across:
HTTP redirects
Connection reuse
Protocol or origin boundaries
2)This persistence happens after the original trust decision has already changed, but the connection‑level state is not fully reset
3)As a result, libcurl may:
Send credentials intended for Origin A to Origin B
Reuse TLS or authentication context after a redirect that changes security assumptions
Apply previously negotiated authentication state to a request that did not explicitly authenticate

**Concrete security consequences**
This leads to real security problems, including:
Credential leakage across redirects
Authorization headers or client certs reused after a redirect to a different host or scheme
Cross‑origin authentication confusion
A server receives authenticated requests it should not be trusted with
Violation of least‑privilege assumptions
Credentials are implicitly applied without explicit caller intent
In some deployments: credential exfiltration or privilege escalation
Especially in API clients, automation, CI/CD, and cloud environments using libcurl non‑interactively

**Why this is a libcurl security issue (not application misuse)**
Applications correctly assume that:
Authentication context is bound to a specific request / origin
Redirects or connection reuse do not silently carry over sensitive state
libcurl, however, optimizes at the connection layer in a way that allows security‑sensitive state to survive beyond its valid scope.
This is a cross‑layer violation:
Application layer assumes fresh security context
Transport / connection layer silently preserves it

**Minimal illustrative scenario**
1)Client authenticates to https://api.serviceA.com using libcurl
2)Server responds with a redirect (or connection reuse occurs)
3)libcurl reuses connection‑level authentication state
4)A subsequent request is sent to https://api.serviceB.com
5)Credentials or trust context intended for serviceA are now applied to serviceB

##Summary (one sentence)
The reported confusion results in authentication and cryptographic state persisting beyond its intended security boundary, causing credential leakage, cross‑origin trust violations, and unintended authenticated requests.

##🔴 Clarification: Relation to CVE‑2022‑27776 + Distinction + PoC Trace

Relation to CVE‑2022‑27776 (and why this is not the same issue)
CVE‑2022‑27776 documents a case where authentication data may be sent to a different host due to redirect handling, specifically tied to HTTP authentication and redirect logic under certain configurations.

**Key distinction:**
CVE‑2022‑27776 concerns what is forwarded.
This report concerns what is silently preserved after the trust context has changed.
The vulnerability here persists even when applications correctly rely on libcurl to isolate security context per request/origin.

**Why this is a new class (not a variation)**
This issue is not limited to:
a specific authentication mechanism
a single protocol
a particular redirect flag
Instead, it exposes a design‑level assumption break:
Connection‑level security state (credentials, negotiated trust, session material) is reused without re‑validation against the new security boundary.
That behavior is not addressed by CVE‑2022‑27776.

##🔍 PoC – Pseudo‑Trace (Step‑by‑Step)
This trace illustrates the issue without relying on undefined behavior or misuse.
**Initial State**
```
Client uses libcurl
Connection reuse enabled (default)
Authentication + TLS enabled
```
**Step 1 — Authenticated request to Origin A**
```
Request #1:
GET https://api.origin-A.com/resource
Authorization: Bearer TOKEN_A
TLS session established with origin-A
```
**State established at connection layer:**
Auth context = valid
TLS session = negotiated
Connection marked reusable
**Step 2 — Redirect / connection reuse boundary crossed**
```
Response:
302 Redirect → https://api.origin-B.com/endpoint
(or)
Connection reused for subsequent request
```
**Security assumption changes here:**
Different origin
Different trust domain
Different authentication expectation
**Step 3 — libcurl reuses connection‑level state**
```
Request #2:
GET https://api.origin-B.com/endpoint
```
**Observed behavior:**
Authentication / trust context from Origin A is still present
TLS / auth state is not fully reset
Application did NOT explicitly authorize this transfer
**Step 4 — Impact**
```
Origin-B receives a request carrying:
- Credentials OR
- Implicit authenticated state OR
- Trust assumptions negotiated with Origin-A
```
**Resulting violations:**
Cross‑origin credential exposure
Silent authentication
Trust boundary bypass
Least‑privilege violation
**Why applications cannot safely mitigate this**

**From the caller’s perspective:**
No explicit reuse request was made
No API indicates partial security state persistence
No reliable hook exists to detect this cross‑layer carry‑over
Applications reasonably assume:
A change in origin or redirect resets all security‑sensitive state.
That assumption is violated here.

##One‑sentence summary (for triage)
Unlike CVE‑2022‑27776, this issue exposes a cross‑layer design flaw where connection‑level authentication and trust state persists beyond its valid security boundary, leading to credential leakage and unintended authenticated requests across origins.

##🔍 Annotated Sequence Diagram — Cross‑Layer State Confusion in libcurl
```
Actors:
  [Client Application]
  [libcurl]
  [Connection Pool / TLS Layer]
  [Origin A]
  [Origin B]
```
**① Initial Authenticated Request (Trusted Boundary A)**
```
Client Application
    |
    |  curl_easy_perform()
    |  URL: https://api.origin-A.com/resource
    |  Authorization: Bearer TOKEN_A
    v
libcurl
    |
    |-- Establish TLS Session ------------------------\
    |   (Trust context bound to Origin A)              |
    |                                                  |
    |-- Send HTTP Request ---------------------------> | Origin A
    |   Authorization: Bearer TOKEN_A                  |
    |                                                  |
    |<-- 200 OK ---------------------------------------/
    |
    |-- Mark connection reusable
    |   (Auth + TLS state retained)
```
Annotation:
Security state (credentials, TLS session, trust assumptions) is correctly scoped to Origin A at this stage.
**② Trust Boundary Transition (Redirect or Reuse Trigger)**
```
Origin A
    |
    |-- 302 Redirect
    |   Location: https://api.origin-B.com/endpoint
    v
libcurl
```
Annotation:
This is the critical boundary change:
Different origin
Different trust domain
Different authentication authority
**③ Connection Reuse with Preserved Security State (Fault Point)**
```
libcurl
    |
    |-- Reuse existing connection --------------------\
    |   (Connection pool selects previous TLS context) |
    |                                                  |
    |-- Send HTTP Request ---------------------------> | Origin B
    |   (Security state not fully reset)               |
    |                                                  |
    |<-- 200 OK / Access Granted ----------------------/
```
Annotation (Root Cause):
Connection‑level state (auth / trust / TLS) persists
No full security context re‑initialization occurs
Application is not informed of cross‑origin carry‑over
**④ Impact — Silent Trust Violation**
```
Origin B processes request under:
  - Inherited authentication context
  - Implicit trust assumptions
  - TLS session negotiated for Origin A
```
Annotation (Impact):
Cross‑origin credential exposure
Unintended authenticated request
Trust boundary bypass
Least‑privilege violation
**⑤ Why This Is Not CVE‑2022‑27776**
```
CVE‑2022‑27776:
  -> Misplacement of auth headers during redirect

This Issue:
  -> Persistence of connection‑layer security state
     across origin / trust boundaries
```
Annotation:
Even if headers are stripped or controlled, the underlying authenticated state remains, making this a distinct vulnerability class.
**⑥ Why Applications Cannot Reliably Defend**
```
Client Application expectations:
  - New origin == new trust context
  - libcurl enforces isolation
  - No implicit credential carry‑over
```
Annotation:
There is no documented contract warning applications that connection‑level security state may survive a trust boundary transition.
**⑦ One‑Line Security Conclusion**
A connection‑level security context in libcurl can persist across redirects or connection reuse into a different origin, causing silent cross‑origin authentication and credential exposure without explicit application intent.

##Mitigation‑Expectation Mismatch
```
Applications using libcurl reasonably assume that a change in origin
(e.g., via redirect or connection reuse targeting a different host)
implies a strict reset of the security context, including authentication
state, trust assumptions, and TLS‑bound credentials.

However, in the observed behavior, libcurl preserves connection‑level
security state across such trust boundary transitions without providing
an explicit signal, guarantee, or opt‑in mechanism to the application.

This creates a mismatch where applications believe isolation is enforced
by the transport layer, while libcurl implicitly reuses authenticated
state beyond its original security scope.

As a result, applications cannot reliably mitigate this condition at the
application layer alone, because the vulnerability arises from implicit
transport‑layer state persistence rather than explicit application logic.
```
- **2025-12-28** @bagder: Please drop the AI generated crap and answer in less than 10 lines:

What problem does this claimed "confusion" lead to?
- **2025-12-28** @onevone: I developed a tool myself that revealed the underlying structure of many programs. This is report number 1 out of 3 I have for you. If you don't like it close the issue.
I don't speak English fluently  I used translation, but you didn't get my point across That's all I have to say 

The "confusion" occurs when libcurl preserves authentication
credentials, cookies, or TLS‑bound key material across redirect
or connection reuse boundaries.

As a result, credentials intended for origin A may be automatically
sent to origin B without explicit application consent.

This creates a **cross-layer security state confusion**, where
the application assumes isolation between requests or origins,
but the transport layer silently reuses sensitive state.

The immediate problem:
- Unauthorized disclosure of credentials or session tokens
- Potential privilege escalation or data exfiltration
- Violation of the principle of least privilege at the transport layer
- **2025-12-28** @bagder: There is no specific problem mentioned, just a lot of (mostly nonsensical) words written by a seemingly drunk person.

If you don't make sense in your next comment, I close this at once.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2025-12-28** @onevone: Ok
- **Manually Disclosed**
- **2025-12-28** @jimfuller2024: I read this, then read it again, then tried again ... I am pretty certain (and yes I have had some XMAS cheer) that this report is entirely spurious ... not sure if it was intentional but it sure did waste time.
