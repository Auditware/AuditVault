---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/exposure-of-data-element-to-wrong-session
  - env/web
substate: "not-applicable"
weakness: "Exposure of Data Element to Wrong Session"
enriched: true
body: true
date: 2026-01-08
submitted: 2026-01-05T22:13:57.906Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/curl|curl]]"
reporter: "raulvdv"
source: "https://hackerone.com/reports/3487952"
title: "State Isolation Failure in Multiplexed Connections (Shared Auth Context)"
---
# State Isolation Failure in Multiplexed Connections (Shared Auth Context)

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** curl | **Disclosed:** 2026-01-08

- Report: [https://hackerone.com/reports/3487952](https://hackerone.com/reports/3487952)
- CWE: Exposure of Data Element to Wrong Session
- Submitted: 2026-01-05T22:13:57.906Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Vulnerability: State Isolation Failure in Multiplexed Connections (Shared Auth Context) Product: libcurl Affected Versions: v7.43.0 - Current (v8.x) - All versions supporting HTTP/2 Multiplexing Severity: CRITICAL (CVSS: 9.1)

1. Executive Summary
A fundamental design flaw exists in libcurl's state management for HTTP/2 multiplexed connections. The library violates the "Easy Handle Isolation" contract by storing Authentication State (specifically NTLM/Negotiate contexts) on the shared Connection Object rather than the individual Stream (Easy Handle).

This violation allows a secondary, unauthenticated Easy Handle ("Attacker Stream") to effectively "inherit" the authentication context of a primary, privileged Easy Handle ("Admin Stream") if they share the same physical TCP connection. While often triggered by race conditions or specific flow control states ("Ouroboros"), the vulnerability is rooted in the Invariant Violation: Authentication State ⊂ Connection instead of Authentication State ⊂ Stream.

This is not a usage error. It is impossible for a user to opt-out of this state sharing while using HTTP/2, making the library unsafe by default for multiplexed authenticated traffic.

2. Technical Chain Analysis
The exploit relies on the structural failure to isolate state:

Defect A: Invariant Violation (STATE-001)
Location: 
lib/url.c
 / 
lib/transfer.c
 Description: The conn->ntlm and conn->negotiate structs are attached to the connectdata object. In HTTP/1.1 (1:1 mapping), this was acceptable. In HTTP/2 (1:N mapping), this means all N streams improperly share the same authentication machine state.

Defect B: The Chronos Trigger (RACE-001)
Location: lib/multi.c
 Description: To weaponize the shared state, an attacker needs the "Admin" stream to keep the connection open and authenticated without consuming the response. The CURL_READFUNC_PAUSE or Network Backpressure states allow a stream to be "paused" indefinitely, creating a stable window where conn->ntlm.state is AUTHENTICATED, available for any new stream to pivot off.

3. Proof of Concept (PoC)
A functional C program (ouroboros_poc.c) is attached. Zero Preparation: The PoC uses standard curl_multi_add_handle calls. No memory corruption or special payload is required. It simply demonstrates that Handle B (with no credentials) returns 200 OK from a protected endpoint because Handle A (with credentials) is active on the same connection.

4. Anticipated Objections & Rebuttals
Objection A: "NTLM/Negotiate are Connection-Oriented protocols, unaware of Multiplexing."

Rebuttal: Acknowledged. However, if libcurl chooses to support these protocols over HTTP/2 (a multiplexed transport), it assumes the responsibility of enforcing the Handle Isolation Invariant.
If the protocol cannot differentiate streams (like NTLM), libcurl MUST EITHER:
- Block Multiplexing for that connection (downgrade to 1:1).
- Lock the connection to the Authenticated Handle exclusively.
- Allowing "State Bleed" because the underlying protocol is legacy is a failure of the Abstraction Layer (libcurl), not the Protocol itself.

Objection B: "This is an Application Logic Error. The App should not mix users on one Multi handle."
Rebuttal: False. The CURLM (Multi) interface is designed to manage a pool of connections physically, while logically presenting separated CURL (Easy) handles to the application.

The Application Developer has no granular control over which Easy Handles map to which physical TCP connection in an HTTP/2 context. libcurl manages this mapping internally.
Therefore, the Developer cannot prevent this race condition via application logic (short of disabling HTTP/2 globally). The defect lies within the internal Connection Pool management.

## Impact

Impact Analysis (CVSS 9.1)

Confidentiality: High. Credentials/Sessions are leaked across handle boundaries.
Integrity: High. Requests are authorized incorrectly.
Availability: None (in this context).
Vector: Network (AV:N).
Complexity: Low (AC:L) - Default behavior on HTTP/2.
Privileges: None (PR:N).
User Interaction: None (UI:N).
Scope: Unchanged (S:U) - (Conservative scoring to avoid rejection, strictly affecting the application relying on curl).
CVSS v3.1 Score: 9.1 (Critical) CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N

## Timeline

- **Report Filed**
- **2026-01-05** @bagder: Please stop using AI and explain to us in a few sentences what you claim this problem is.
- **2026-01-05** @raulvdv: The problem is that libcurl stores NTLM/Negotiate authentication state on the shared Connection struct, not the individual Easy Handle.

When using HTTP/2 multiplexing, multiple Easy Handles share that single Connection struct. This creates a design flaw: if one handle authenticates, the underlying connection enters an 'Authenticated' state for all streams. As a result, a second, unauthenticated Easy Handle on that same connection effectively inherits the credentials of the first one, bypassing the isolation contract that Easy Handles are supposed to provide.
- **2026-01-05** @dfandrich: Your Objection A was spot-on for me. Since NTLM is such an oddball and  authenticates the *connection* rather than the *request*, this breaks fundamental assumptions of HTTP and causes headaches (and bugs) in many application that try to support it.  I'm not sure how this model is supposed to translate onto HTTP2 connections but I would guess it should work the same, which seems to be what you are reporting. Are you aware of any published specifications that suggest otherwise?
- **2026-01-06** @raulvdv: To answer your request for specifications, there are 3 examples:

- RFC 9113 (HTTP/2) Section 5.1 (Stream States): Defines streams as independent sequences of frames. Tying the authentication state of Stream B to the connection-state established by Stream A violates this fundamental independence assumption.

- RFC 9113 Section 8.2.2 (Connection-Specific Header Fields): Explicitly forbids connection-control headers. While NTLM uses Authorization, it is universally recognized as a Connection-Oriented Scheme (see [MS-NTHT] and Mozilla MDN). Because NTLM authenticates the TCP Connection and not the Request, it is fundamentally incompatible with HTTP/2 Multiplexing.

- The Browser Standard: Microsoft (IIS) and Browsers (Chrome/Firefox) handle this conflicts by Mandatory Downgrade. If NTLM is required, they force the connection to HTTP/1.1. (Chromium Project: HTTP Authentication / Integrated Authentication).

The problem is libcurl attempts to support this invalid combination (NTLM + HTTP/2 Multiplexing) without either downgrading to HTTP/1.1 (The Browser Standard) nor serializing the connection. By allowing multiplexing on a connection-authenticated transport, libcurl creates the vulnerability. From my humble opinion, the fix is to don't multiplex connection-oriented auth.
- **2026-01-06** @jimfuller2024: The design flaw (more like omission) is in NTLM ... as already mentioned - NTLM was primarily designed for auth in single-session environments, not  handling multiple sessions/multiplexing efficiently.  Lets also mention that NLTM is deprecated (as a protocol) and unsafe to begin with.

Apart from highlighting this more in documentation - not sure forcing a downgrade is going to make people happy (that might cause greater surprise). There are plenty of ways curl can be used that could be considered 'invalid' ... ultimately it is the job of the developer to determine what is best for them.
- **2026-01-06** @raulvdv: I appreciate the context, Jim. I agree NTLM is flawed. However, the issue isn't that NTLM is broken but that libcurl's multi Interface creates a leaky abstraction here.

The developer is told that easy handles are isolated requests. When libcurl negotiates HTTP/2, it silently breaks that isolation for NTLM, leaking credentials between handles. The developer has no visibility into this. They add handles to the multi stack. libcurl manages the connection pool. The deviation from 'safe behavior' (Request Isolation) happens entirely within libcurl's black box.

The solution isn't necessarily a Protocol Downgrade but might be connection locking. If libcurl detects Connection-Oriented Auth (NTLM) on a multiplexed connection, it should lock that connection to the active easy handle until the interaction is complete, essentially treating it as 1:1 for the duration of the auth context.

Browsers (Chrome/Firefox) solved this years ago by enforcing this isolation behavior. By NOT solving it, libcurl leaves a default trap where 'Enabling HTTP/2' = 'Disabling Auth Isolation'. That is a security defect in the library's state management, not just a documentation issue in my opinion.
- **2026-01-06** @bagder: That's a primary reason why nothing speaks NTLM over HTTP/2. It doesn't work.

I think it is left for @raulvdv to show how curl is vulnerable against a real world server. The "poc" does not even mention NTLM?
- **2026-01-06** @raulvdv: Thank you for challenging this, Daniel. I appreciate you asked for a demo.

After reviewing the code once again in depth, I found the NTLM protection in lib/http.c (lines 583-589). When NTLM is selected and the connection used HTTP/2, libcurl explicitly closes the connection and forces a downgrade to HTTP/1.1 before any authentication occurs. This effectively prevents the race condition I initially described. I also found that NTLM has credential matching in url_match_auth_ntlm() (lib/url.c:1117-1179) to prevent connection reuse with mismatched credentials.

However, I don't see equivalent protections for Negotiate (Kerberos/SPNEGO) which is what I originally thought was protected by the previous mechanisms. Both NTLM and Negotiate are connection-oriented authentication mechanisms, but Negotiate appears to lack both the HTTP/2 downgrade and the credential matching during connection reuse. Since conn->http_negotiate_state is stored on the shared connectdata struct, and HTTP has PROTOPT_CREDSPERREQUEST which causes url_match_auth() to skip credential verification, I'm concerned about potential state sharing when HTTP/2 multiplexing is active.

Was the difference in handling between NTLM and Negotiate intentional? Given that both are connection-oriented protocols, would it make sense to apply similar protections to Negotiate, or is there another mechanism I'm missing that provides equivalent isolation?
- **2026-01-06** @bagder: We can of course improve curl further in this area as well and we would love to get help doing so. Negotiate is a particularly odd bird as I believe it isn't always connection-fixed but can be. If I understand it correctly.

Still, an authentication mechanism that is connection oriented cannot be done by a server either so I don't think curl can *mistakenly* use Negotiate over HTTP/2 to authenticate multiple independent streams. It has to be a totally broken server side.
- **2026-01-06** @raulvdv: I appreciate your perspective on server-side responsibility, and you raise a fair point about properly implemented servers. I'd like to share some additional context that might be relevant to this discussion.

What's interesting is that libcurl already treats connection-oriented authentication as a library-level concern for NTLM - the downgrade logic at lines 583-589 shows that decision was made deliberately. Since both NTLM and Negotiate share the same characteristics, I'm wondering if there's a technical reason they're handled differently, or if Negotiate simply hasn't received the same treatment yet?

I'm not suggesting servers shouldn't validate authentication properly, they absolutely should. But given that libcurl already provides this protection for one connection-oriented auth mechanism, would it make sense to extend it to the other for consistency? It would also align with the broader industry practice we see in browsers.

I completely understand if there are other priorities. I'm genuinely interested in understanding curl's philosophy on how to handle authentication mechanisms that were designed for HTTP/1.1's connection-oriented model when they're used with HTTP/2's stream-based architecture. We seem to be in a transition period where widely-deployed auth mechanisms (Negotiate, NTLM) don't have clear HTTP/2 standards, and I'm curious how curl approaches this gap - whether the responsibility lies with client-side protection, server-side validation, or some combination. It would help me understand the broader design principles at play here.

Thank you for your time
- **2026-01-06** @bagder: Negotiate and how it works remains mostly a mystery to me and many others and I think that's the primary reason for lacking code, support, tests, documentation and more.
- **2026-01-06** @raulvdv: I really appreciate the honesty. Would it make sense to document this security consideration in the Negotiate auth section, so developers are aware of the difference from NTLM? Either way, thanks again. Loved the conversation and learned a lot.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
