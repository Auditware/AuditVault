---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2026-10-30
submitted: 2026-08-20T11:52:30.771Z
bounty_usd: null
votes: 50
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "rootaccessxvv"
source: "https://hackerone.com/reports/3955956"
title: "launchpad.37signals.com OAuth AS issues victim-bound credential to unverified attacker redirect → full CIA triad on Basecamp API "
---
# launchpad.37signals.com OAuth AS issues victim-bound credential to unverified attacker redirect → full CIA triad on Basecamp API 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 50 | **Program:** Basecamp | **Disclosed:** 2026-10-30

- Report: [https://hackerone.com/reports/3955956](https://hackerone.com/reports/3955956)
- CWE: Improper Authentication - Generic
- Submitted: 2026-08-20T11:52:30.771Z

## Timeline

- **Report Filed**
- **Report Informative**
- **2026-08-20** @rootaccessxvv: This is not a re-argument about unverified redirects. The closure rests on one premise — *"untrusted clients always show the consent screen"* — i.e. the user makes an informed decision about the client, so the issuance is legitimate. New reproduction shows the consent screen shown to the user does **not actually bind which client the resulting credential serves**. That materially changes the security finding and directly challenges the rationale for the Informative verdict. Reproduced twice, independently, on my own account (████████).

## Decisive finding — consent for client A, credential for client B

Two freshly registered researcher-owned OAuth clients. The consent screen visibly represented **client A**. I extracted that authorization transaction's `authenticity_token`, then submitted `POST /authorization` with **client B's** `client_id` and **B's** registered `redirect_uri`:

```http
GET  /authorization/new?client_id=A&redirect_uri=A_REDIRECT&type=user_agent    -> 200
     (consent screen for A; authenticity_token extracted)

POST /authorization
     authenticity_token = <A's consent token>
     client_id           = B
     redirect_uri        = <B's registered redirect>
     type                = user_agent
     commit              = Yes, I'll allow access

-> 302  <B's redirect>/cb#access_token=…
        inner JSON: {"client_id":"<B>","user_ids":[…],"version":1,"api_deadbolt":"…"}
```

The issued token's embedded `client_id` is **B's**; it is delivered to **B's** registered redirect host. The user authorized A; the credential serves B. This is reproduced on two independent client pairs:

| Run | Client A `client_id` (shown on consent) | Client B `client_id` (in issued token) | Result |
|-----|-----------------------------------------|---------------------------------------|--------|
| 1 | `9e8ea9e33863601f` | `2e79cd45bc73bca2` | 302 → B's host, inner `client_id`=B |
| 2 | `180ec4b3bf68cdf1` | `7bd6690c3fd627a2` | 302 → B's host, inner `client_id`=B |

The consent screen the closure relies on **did show** — but it showed client A, and the credential was still issued for client B. A victim who consents to a benign-looking client A is, under the hood, minting a usable credential for the attacker's real client B. "Untrusted clients always show the consent screen" is not a gate over which client receives the credential.

The V3 token is a live Bearer against the Basecamp API (`GET /authorization.json` → 200, `GET 3.basecampapi.com/████████/projects.json` → 200).

## Supporting (V1) — no consent transaction required at all

`POST /authorization` accepts a page-level `csrf-token` (the `<meta>` tag on any authed page, e.g. `/integrations`) as its `authenticity_token` — not a consent-form token. With no `GET /authorization/new` called and no consent screen rendered, the AS issues an implicit fragment token (len 390), reproduced twice:

```
Run 1: POST /authorization (token from /integrations meta, client A) -> 302 #access_token=…client_id":"9e8ea9e33863601f…
Run 2: POST /authorization (token from /integrations meta, client A) -> 302 #access_token=…client_id":"180ec4b3bf68cdf1…
```

## Supporting (V2) — consent does not bind the grant type

Consent stamped `type=web_server`; POST carried `type=user_agent`; AS issued an implicit fragment token. The consent decision does not constrain the grant either. Both runs identical.

```http
GET  /authorization/new?…&type=web_server     -> 200  stamped type="web_server"
POST /authorization   type=user_agent          -> 302  #access_token=… (implicit token)
```

## Honest mitigating observation

`POST /authorization` with a foreign `Origin: https://attacker.example` and no `Referer` was rejected (`302 → /signin`, no token) in both runs — Rails' origin check on the consent POST holds against a fully cross-origin drive. Findings therefore require a same-origin session `authenticity_token` source (any same-origin page/context; V1's meta token lives on every authed page). This defines the precondition; it does not repair the binding failure, which operates same-origin.

## Why this isn't "already on file"

The closure noted the legacy implicit grant + cleartext/custom-scheme redirects are tracked separately. F1/F2 are not those: neither is "the implicit grant exists" nor "a dangerous redirect is accepted." In all findings the redirect **is** matched (V1: A's redirect; V3: B's registered redirect), so "we enforce exact redirect matching at authorize time" does not rebut them — matched-redirect enforcement simply routes the wrongly-issued credential to the correct attacker host. The defect is upstream of redirect matching: **issuance is not bound to the consent transaction the authorizing user saw**.

## Scope of claim (precise)

Demonstrated: the AS issues a functional user-bound credential to an attacker-selected client without a corresponding consent transaction (V1), and a consent transaction for client A can be replaced with client B before credential issuance (V3). Both reproduced twice on the authorizing researcher's own account.

**Not claimed:** cross-account theft of an arbitrary victim's token — not demonstrated here. What is demonstrated is that the consent screen is neither required for (V1) nor bound to (V3) the credential issuance.

## Reproduction

1. Register two OAuth clients A (`redirect_uri=https://<host-A>/cb`) and B (`redirect_uri=https://<host-B>/cb`); note each `client_id`.
2. `GET /authorization/new?client_id=A&redirect_uri=https://<host-A>/cb&type=user_agent`, scrape the consent `authenticity_token`.
3. `POST /authorization` with that token but `client_id=B`, `redirect_uri=https://<host-B>/cb`, `type=user_agent`, `commit=Yes, I'll allow access` → `302 …<host-B>/cb#access_token=<…>`; decoded inner `client_id` = B's.
4. Use the token as `Authorization: █████████
5. Destroy both test clients.

All four test clients (27866, 27879, 27878, 27888) destroyed at end of their respective runs.

## Evidence (attached)

- `repro-2runs-summary.txt` — two-run reproduction summary (V1+V3 decisive, V2/V4 supporting)
- `_branchd_consentless.js` — harness (single-file Node.js)
- `_branchd_consentless.out` — run 1 full log
- `_branchd_consentless_run2.out` — run 2 full log
████████████████████████████████
- **Report Reopened**
- **Report Triaged**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2026-10-08** @jeremy: Happy to approve disclosure. The consent-binding fix and the removal of the implicit grant are both live in production.

Before it goes public we're making two changes:

- **Attachments will be marked internal.** Several carry credentials and client secrets from your test runs. The clients are deleted and the tokens have expired, but we'd rather not publish them, and some of the files go beyond this report's finding.
- **A few strings will be redacted:** the token payload values in the report body, and one sentence in our original closing comment that refers to other reports.

The report text and the thread otherwise stay as written, as a full disclosure.
- **2026-10-08** @rootaccessxvv: Thanks @jeremy, that works for me. I’m happy with the proposed redactions and keeping the attachments internal.

One additional request: would it be possible to **hide the bounty/reward amount from the public disclosure** as well? I’m mainly looking to have the vulnerability publicly disclosed so I can reference it for my Claude CVP application, but I’d prefer the bounty amount not to be shown publicly.

Everything else can remain as written. Thanks again for approving the disclosure!
- **Agreed On Going Public**
- **Report Became Public**
