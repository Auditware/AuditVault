---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-input-validation
  - env/web
substate: "informative"
weakness: "Improper Input Validation"
enriched: true
date: 2026-03-29
submitted: 2026-03-26T18:56:06.933Z
bounty_usd: null
votes: 26
cve: []
program: "[[programs/curl|curl]]"
reporter: "argareksapatii"
source: "https://hackerone.com/reports/3630310"
title: "HTTP/2 server push accepts a non-authoritative :scheme=https over cleartext h2c, enabling HTTPS cache-key poisoning"
---
# HTTP/2 server push accepts a non-authoritative :scheme=https over cleartext h2c, enabling HTTPS cache-key poisoning

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 26 | **Program:** curl | **Disclosed:** 2026-03-29

- Report: [https://hackerone.com/reports/3630310](https://hackerone.com/reports/3630310)
- CWE: Improper Input Validation
- Submitted: 2026-03-26T18:56:06.933Z

## Timeline

- **Report Filed**
- **2026-03-26** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.

Beware that there are **no** monetary rewards for curl vulnerabilities, no matter which severity.
- **2026-03-27** @bagder: For this flaw to become a problem it requires:

- HTTP/2 push, the feature that is basically unused in the wild.
- HTTP/2 done over clear-text, practically impossible to use over the Internet and also basically unused, a lot because of the quirky upgrade procedure
- *clear-text* communication with a malicious server, meaning that the server can send the client *anything it wants* and the client will accept it

Yet this malicious server uses this super power to send a push with a https scheme and the client who is talking over HTTP:// blindly accepts that this is HTTPS:// because that is what the curl API says (even though it speaks http://) and this bug will eventually pollute a content cache. A cache that the client apparently populates when communicating over clear-text so already vulnerable to an ocean of problems.

Far-fetched is an understatement.
- **2026-03-27** @icing: I believe we should handle this as a bug, not a security vulnerability.  The rationale for that being:

* the application uses cleartext against a malicious  server knowingly
* HTTP/2 push handling is only enabled by an application choosing this
* the application needs some kind of "security assumption" logic applied to "cached resources" for the bug to break something. If the application just stores resources somewhere, a PUSH using `http:` as scheme could do the same without violating anything.

I do not think we help anyone by assigning this a CVE.
- **2026-03-27** @argareksapatii: Thanks for the review. I agree this is not a broad/default-impact issue, and I am not arguing for Critical or a universal compromise.

My point is narrower: `http://` and `https://` are separate origins, and the current behavior allows a cleartext h2c server to make libcurl expose a pushed resource as `CURLINFO_EFFECTIVE_URL=https://...` even though no HTTPS authority was established for that pushed origin. The attached cache PoC was meant to show that this is not only cosmetic metadata: attacker-controlled cleartext content is stored under an HTTPS cache key and later served from cache without a network fetch. Caching `http://...` content from cleartext is expected; caching the same bytes under an `https://...` key is the distinction I wanted to highlight.

RFC 9113 says non-authoritative pushed responses must not be used or cached, so I still think libcurl should reject `:scheme=https` on h2c, or at minimum avoid surfacing the pushed transfer as an HTTPS effective URL. If you still consider this below curl's vulnerability bar, I understand that assessment.
- **2026-03-27** @icing: I agree that this is a bug and wrong behaviour. I propose to fix this via https://github.com/curl/curl/pull/21113. If you could assess that PR for fitness, we'd appreciate it. Thanks.
- **2026-03-27** @argareksapatii: @icing Verified on PR #21113.

Environment:
- branch: pr21113
- commit: f619ee894a
- local debug build with HTTP/2 enabled

I re-tested with the original cleartext h2c `:scheme=https` reproducer and with the cache-poisoning PoC.

Result:
- the pushed `https://...` resource is no longer accepted over cleartext h2c
- I no longer get a pushed handle with `CURLINFO_EFFECTIVE_URL=https://trusted.example:18080/pushed` in this scenario
- the HTTPS cache key is no longer populated, so the previous poisoned cache hit does not occur

On my side, PR #21113 appears to resolve the reported behavior. Thanks.
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
