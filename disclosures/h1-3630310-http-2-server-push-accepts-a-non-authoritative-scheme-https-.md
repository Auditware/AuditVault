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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
I found that libcurl 8.19.0 accepts an HTTP/2 pushed stream on a cleartext h2c connection even when the server sends `:scheme=https` in `PUSH_PROMISE`. In `lib/http2.c`, `set_transfer_url()` builds the pushed handle URL from the server-supplied `:scheme`, `:authority`, and `:path`, but `PUSH_PROMISE` validation only checks `:authority` and does not reject a non-authoritative pushed `https` origin. The accepted pushed handle is then exposed to the application and processed on the existing connection, and `CURLINFO_EFFECTIVE_URL` later returns the pushed URL from `data->state.url`. As a result, a cleartext h2c server can cause a pushed transfer to appear as `https://...` to the application even though the bytes arrived over cleartext HTTP/2. In the attached cache PoC, a libcurl-based application that opts into push stores attacker-controlled cleartext content under a trusted HTTPS cache key and later serves it from cache without a network fetch.

## Affected version
Official `curl 8.19.0` source release on Linux/Kali, built locally with HTTP/2 enabled.

`curl 8.19.0 (Linux) libcurl/8.19.0 OpenSSL/3.5.5 zlib/1.3.1 brotli/1.2.0 zstd/1.5.7 libidn2/2.3.8 libpsl/0.21.2 libssh2/1.11.1 nghttp2/1.64.0 OpenLDAP/2.6.10`
`Release-Date: 2026-03-11`

Relevant source locations in the official 8.19.0 source tree:
- `lib/http2.c:716` `set_transfer_url()` starts building the pushed URL
- `lib/http2.c:728` `:scheme` is copied into the pushed URL
- `lib/http2.c:1424` `PUSH_PROMISE` validation checks only `:authority`
- `lib/http2.c:819` the pushed handle is exposed to the application callback
- `lib/http2.c:839` the accepted pushed handle is added for processing
- `lib/multi.c:1676` the pushed handle is attached to the existing connection
- `lib/multi.c:934` `data->conn = conn`
- `lib/getinfo.c:91` `CURLINFO_EFFECTIVE_URL` returns `data->state.url`

## Steps To Reproduce:
1. Attach and extract the provided PoC bundle.
2. Run the cache-poisoning server:
   `python3 h2_push_cache_server.py 18080`
3. Run the cache-poisoning client:
   `./h2_push_cache_client_8190 http://trusted.example:18080/ trusted.example:18080:127.0.0.1`
4. Observe that the main request is cleartext HTTP/2 to `http://trusted.example:18080/`, but the push callback reports:
   `effective_url=https://trusted.example:18080/pushed`
5. Observe the cache evidence:
   `https://trusted.example:18080/pushed => ATTACKER-CONTROLLED-CLEARTEXT-PUSH`
6. Observe the final poisoned-cache reuse:
   `POISONED CACHE HIT for trusted HTTPS key https://trusted.example:18080/pushed`
   and
   `TRUSTED PROCESSING of cached body: ATTACKER-CONTROLLED-CLEARTEXT-PUSH`

The attached bundle also contains a simpler PoC that demonstrates the same primitive without the cache layer.

## Impact

## Summary:
By accepting a non-authoritative pushed HTTPS origin over cleartext h2c and surfacing it as an effective HTTPS URL, libcurl enables applications that opt into HTTP/2 push and cache pushed responses by `CURLINFO_EFFECTIVE_URL` to store attacker-controlled cleartext content under a trusted HTTPS cache key and later serve it without a network fetch. This is a concrete integrity impact, not just cosmetic metadata confusion. Server push is opt-in, but once enabled libcurl should enforce the HTTP/2 authority/origin boundary before exposing the pushed transfer to the application. I am requesting High severity because the attached PoC demonstrates concrete cache poisoning of a trusted HTTPS cache key, although I understand a more conservative Medium assessment.

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
