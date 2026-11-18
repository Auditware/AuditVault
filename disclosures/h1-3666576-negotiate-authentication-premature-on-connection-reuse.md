---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
substate: "duplicate"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2026-04-29
submitted: 2026-04-11T17:52:40.271Z
bounty_usd: null
votes: 39
cve: []
program: "[[programs/curl|curl]]"
reporter: "sdainard"
source: "https://hackerone.com/reports/3666576"
title: "Negotiate Authentication Premature on Connection Reuse"
---
# Negotiate Authentication Premature on Connection Reuse

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 39 | **Program:** curl | **Disclosed:** 2026-04-29

- Report: [https://hackerone.com/reports/3666576](https://hackerone.com/reports/3666576)
- CWE: Improper Authentication - Generic
- Submitted: 2026-04-11T17:52:40.271Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Curl 8.19.0+ inappropriately sends Negotiate authentication headers on reused keep-alive connections where authentication was already completed. Commit ab650379a8 (June 2025) moved negotiate auth context to on-demand metadata storage, but during connection reuse the metadata gets cleared while the connection-level state (`conn->http_negotiate_state = GSS_AUTHSUCC`) persists. When `Curl_auth_nego_get()` is called on the reused connection, it creates a fresh empty context, causing the code to treat it as a new auth attempt and inappropriately send auth headers containing credentials/tokens. This affects all Negotiate/SPNEGO (Kerberos) authentication with keep-alive connections.

## Affected version

- __Vulnerable__: curl 8.19.0 and later (released December 2025)
- __Last safe version__: < curl 8.19.0
- __Platform__: All platforms (Linux, Windows, macOS, etc.)
- __Breaking commit__: ab650379a8 "vauth: move auth structs to conn meta data" (June 9, 2025)
- __Tests failing__: test 2077, 2078 (masked by separate test server bug - see note below)

## Steps To Reproduce:

1. Build curl 8.19.0 or later with Negotiate/SPNEGO auth support enabled
2. Configure a server requiring Negotiate authentication with keep-alive connections enabled
3. Make first request with Negotiate auth: `curl --negotiate -u : http://server/resource1`
4. On same connection (keep-alive), make second request: `curl --negotiate -u : http://server/resource2`
5. __Expected__: Second request should NOT send Authorization header (auth already done)
6. __Actual__: Second request inappropriately sends "Authorization: Negotiate" header with credentials
7. Alternatively, run curl test suite: `make test` and observe tests 2077, 2078 fail

__Note__: Test failures are currently masked by a separate test server bug in `tests/server/sws.c` (line 2387: `req->connmon = FALSE;`) that prevents proper disconnect logging. This test server issue does not affect the security vulnerability itself, only its visibility in the test suite. Please see summary below.

## Technical Details:

Root cause in `lib/vauth/negotiate.c` - `Curl_auth_nego_get()` creates fresh empty context when metadata lookup fails on reused connections, breaking synchronization with `conn->http_negotiate_state`.  
Detailed analysis and proposed fix available in my  investigation notes.

## Discovery Timeline

a. While applying a CVE patch to curl 8.17.0, test 338 failed, revealing **Issue #2** (connection reuse regression in `lib/url.c`).
b. Investigating curl 8.19.0 revealed **Issue #2** was still present but tests were passing - this exposed **Issue #1** (test server masking the actual bug).
c. Before submitting Issues #1 and #2, performed additional verification to check for other potentially masked tests.
d. This verification revealed **Issue #3** (this report) - the Negotiate auth credential leakage on connection reuse. Now reporting Issue #3 while holding Issues #1 and #2 to prevent premature disclosure that could compromise security investigation.

## Related Issues Found During Investigation

**Issue #1 - Test Server Masking Bug:**
- **File**: `tests/server/sws.c`, line 2387
- **Problem**: Line `req->connmon = FALSE;` disables connection monitoring after first disconnect, preventing subsequent `[DISCONNECT]` markers with `--next` flag
- **Impact**: Masks real connection reuse bugs by making tests appear to pass when they should fail
- **Status**: Fix prepared, holding for coordinated disclosure with Issue #3

**Issue #2 - Connection Reuse Regression:**
- **File**: `lib/url.c`, function `ConnectionExists()`
- **Problem**: Missing Negotiate auth state validation in connection matching logic - connections incorrectly reused when auth states don't match
- **Impact**: Security vulnerability allowing connection reuse with mismatched authentication state
- **Status**: Pull request prepared with fix, holding for coordinated disclosure with Issue #3

Detailed analysis and patches available for both issues.

## AI Usage Disclosure

AI tools were used for code analysis verification, documentation formatting, and report preparation. Vulnerability discovery, root cause analysis, and technical investigation were performed through manual code review and testing.

## Impact

## Summary:

This vulnerability causes inappropriate disclosure of Negotiate authentication credentials on reused HTTP connections. When a curl client reuses a keep-alive connection where Negotiate/SPNEGO authentication was already completed, it incorrectly sends new Authorization headers containing Kerberos tickets/tokens. This can lead to:

1. __Credential leakage__: Authentication tokens sent when not required, potentially exposing them to network monitoring or man-in-the-middle attacks
2. __Cross-resource authentication bypass__: In connection reuse scenarios where connections are repurposed (though rare), auth credentials could be sent to unintended endpoints
3. __Protocol violations__: Violates HTTP authentication state machine by re-authenticating on connections where auth was already successful
4. __Enterprise security impact__: Particularly severe in corporate environments using Kerberos/Active Directory where Negotiate auth is the primary authentication mechanism

## Timeline

- **Report Filed**
- **2026-04-11** @bagder: This is a confirmed problem, but you are not the first to report this. We are already dealing with this issue in another report. To be published in sync with the next release.
- **2026-04-12** @bagder: As there is no reproducer in your report we cannot be 100% sure it is an exact duplicate (nor can we be sure your fix actually fixes your reported problem), but if it is, the issue is already fixed in master.

Can you reproduce the problem with curl's git master?
- **2026-04-12** @sdainard: My reproducer is test 2077, 2078; checking logs will show the issue despite tests passing,  removing the test masking line change in issue #1 will cause them to fail.  This was from my fork Saturday morning pacific time.

I have an appt this morning but will repull & recheck from master this afternoon.
- **2026-04-12** @bagder: What you call issue one is at worst a test problem. Not an issue we care about here.
- **2026-04-13** @sdainard: Apologies,
 I was trying to do too many things (not work on the wknd, taxes, head cold, be a good community member) and got tunnel vision.  Was checking one thing saw the other, assumed they were related.  
Sure enough did the pull and the commit titles' a pretty solid, "oh right there it is."

The issue with #2, (and it being masked by #1) still exists but it's a bug only & I'll put on issues as initially intended.
- **2026-04-13** @jimfuller2024: confirmed duplicate
- **Report Duplicate**
- **2026-04-14** @sdainard: I really am just getting over a rather unpleasant upper respiratory infection and the meds did make my head swim. 
I appreciate you are busy, I felt bad for having bothered you here unneeded and now I feel bad for posting in the wrong place (twice!) but I'm getting whiplash trying to help here.  (re below)
I accidently thought the header issue was related in my hurry but per my documentation #1 & 2 stand. 

I thought #1 might have security adjacent concerns as it might mask real issues, but now know better.
Best I can tell #2 appears to have no credential leak, no auth bypass, no privilege escalation. The worst outcome is an unnecessary second TCP connection, which is a performance/function regression. I clearly am not the expert here.

- My original issues #1 & 2 here as a new separate report here?
- Evaluate the re-open the github issue/pr?
- What ever else you'd like that I can do, done.

Genuinely, with humbleness, I promise  knowing tone can't be read;  please just tell me what you'd like, I'm new and just wanted to help.

re:
https://github.com/curl/curl/pull/21309
"bagder
commented
9 hours ago {UTC 7:50 AM Tuesday, April 14, 2026}
Security sensitive bugs and changes MUST be dealt with privately on our hackerone tracker, not be submitted in public."

https://github.com/curl/curl/issues/21307#issuecomment-4241616724
bagder
10 hours ago {UTC 8:50 AM Tuesday, April 14, 2026}
Member
Issues with a suspected security impact must be reported to https://hackerone.com/curl and not in public.
- **2026-04-15** @bagder: We ask that you just wait.

As I explained already, this exact issue has been reported by another user and is being handled as a security problem. The fix has already been merged.

The corresponding CVE will be published in sync with the pending curl release on April 29.

Since it is a SECURITY problem we do not discuss its details in public until after April 29.
- **Agreed On Going Public**
- **Manually Disclosed**
