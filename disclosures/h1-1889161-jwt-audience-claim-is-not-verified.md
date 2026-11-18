---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/missing-critical-step-in-authentication
  - env/web
substate: "resolved"
weakness: "Missing Critical Step in Authentication"
enriched: true
body: true
date: 2023-04-16
submitted: 2023-02-28T18:06:26.575Z
bounty_usd: null
votes: 97
cve: "CVE-2023-22482"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "farcaller"
source: "https://hackerone.com/reports/1889161"
title: "JWT audience claim is not verified"
---
# JWT audience claim is not verified

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 97 | **Program:** Internet Bug Bounty | **Disclosed:** 2023-04-16

- Report: [https://hackerone.com/reports/1889161](https://hackerone.com/reports/1889161)
- CWE: Missing Critical Step in Authentication | CVE: CVE-2023-22482
- Submitted: 2023-02-28T18:06:26.575Z

## Report summary

JWT audience claim is not verified 
Severity: Critical

Description
Impact
All versions of Argo CD starting with v1.8.2 are vulnerable to an improper authorization bug causing the API to accept certain invalid tokens.

OIDC providers include an aud (audience) claim in signed tokens. The value of that claim specifies the intended audience(s) of the token (i.e. the service or services which are meant to accept the token). Argo CD does validate that the token was signed by Argo CD's configured OIDC provider. But Argo CD does not validate the audience claim, so it will accept tokens that are not intended for Argo CD.

If Argo CD's configured OIDC provider also serves other audiences (for example, a file storage service), then Argo CD will accept a token intended for one of those other audiences. Argo CD will grant the user privileges based on the token's groups claim, even though those groups were not intended to be used by Argo CD.

This bug also increases the blast radius of a stolen token. If an attacker steals a valid token for a different audience, they can use it to access Argo CD.

Patches
A patch for this vulnerability has been released in the following Argo CD versions:

v2.6.0-rc5
v2.5.8
v2.4.20
v2.3.14

Credits
The Argo CD team would like to express their gratitude to Vladimir Pouzanov [@farcaller](https://github.com/farcaller) from Indeed, who discovered the issue, reported it confidentially according to our guidelines, and actively worked with the project to provide a remedy. Many thanks to Vladimir!

Full GHSA: https://github.com/argoproj/argo-cd/security/advisories/GHSA-q9hr-j4rf-8fjc

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

All versions of Argo CD starting with v1.8.2 are vulnerable to an improper authorization bug causing the API to accept certain invalid tokens.

OIDC providers include an aud (audience) claim in signed tokens. The value of that claim specifies the intended audience(s) of the token (i.e. the service or services which are meant to accept the token). Argo CD does validate that the token was signed by Argo CD's configured OIDC provider. But Argo CD does not validate the audience claim, so it will accept tokens that are not intended for Argo CD.

## Impact

If Argo CD's configured OIDC provider also serves other audiences (for example, a file storage service), then Argo CD will accept a token intended for one of those other audiences. Argo CD will grant the user privileges based on the token's groups claim, even though those groups were not intended to be used by Argo CD.

This bug also increases the blast radius of a stolen token. If an attacker steals a valid token for a different audience, they can use it to access Argo CD.

## Timeline

- **Report Filed**
- **2023-02-28** @farcaller: NB: I coped over the advisory text because I helped to word it out proper and I co-authored the fix (so it deemed reasonable to re-use the same description).
- **Report Triaged**
- **2023-03-10** @kunderkoffler: Thanks for your patience here, @farcaller. Just wanted to let you know I'm still making progress with the checks and will be circling back to wrap this up within the next week for sure.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Cve Id Added**
- **Report Became Public**
