---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/network
substate: "informative"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2026-01-02
submitted: 2026-01-01T11:56:24.548Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/curl|curl]]"
reporter: "huntsd"
source: "https://hackerone.com/reports/3483902"
title: "PROTOCOL-LEVEL: Persistent UDP Amplification and Cache Poisoning via Alt-Svc Logic Flaw"
---
# PROTOCOL-LEVEL: Persistent UDP Amplification and Cache Poisoning via Alt-Svc Logic Flaw

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** curl | **Disclosed:** 2026-01-02

- Report: [https://hackerone.com/reports/3483902](https://hackerone.com/reports/3483902)
- CWE: Business Logic Errors
- Submitted: 2026-01-01T11:56:24.548Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
A structural logic flaw in the `libcurl` `Alt-Svc` header parser allows attack attributes (specifically `persist` and `max-age`) to "leak" from one service definition to another.

We have successfully chained this logic bug with `curl`'s HTTP/3 (QUIC) support to demonstrate a **Persistent UDP Amplification** attack. An attacker can force a victim's client to cache a malicious UDP route for up to 30 days (`persist=1`), turning the client into an unwilling participant in a distributed denial-of-service (DDoS) attack against arbitrary targets.

## Affected version
Reproduced on: **curl 8.17.0** (and `libcurl` master branch)
Platform: **Linux/Generic** (Issue is cross-platform)

## Steps To Reproduce
1.  **Setup Malicious Server**: Host an HTTP/HTTPS server that returns the following header:
    `Alt-Svc: h3="<VICTIM_IP>:12345", h2=":443"; ma=2592000; persist=1`
2.  **Trigger (Client Side)**: Run `curl --alt-svc cache.txt https://<ATTACKER_HOST>`
    -   *Logic Flaw*: `curl` correctly parses `persist=1` for `h2`, but **incorrectly applies it** to `h3` as well due to scope leakage in `lib/altsvc.c`.
3.  **Verify Persistence**:
    -   Inspect `cache.txt`. You will see the `h3` entry for `<VICTIM_IP>` has the persistence flag set and a 30-day expiry.
4.  **Verify Attack**:
    -   Kill the server/client.
    -   Run `curl https://<ATTACKER_HOST>` again (simulating a future visit).
    -   `curl` will immediately send a **1200-byte UDP QUIC Initial packet** to `<VICTIM_IP>:12345`.

## Supporting Material
-   This utilizes a "Confused Deputy" amplification vector (Factor ~30x).
-   Privacy Impact: The persistence flag allows "Server-Side Super Cookies" that track users across network changes.

## Impact

## Summary
This vulnerability transforms `libcurl` clients into a **Persistent Botnet** for UDP Amplification attacks.

1.  **DDoS Amplification**: By injecting a malicious QUIC route, an attacker can designate *any* IP address as a target. Every victim who visits the attacker's site once becomes a permanent amplifier, sending heavy UDP traffic to the target on every subsequent visit.
2.  **Privacy Violation**: The logic bug allows attackers to force `persist=1` on routes that should be ephemeral, enabling long-term user tracking that persists across network changes (bypassing standard anonymity protections).

## Timeline

- **Report Filed**
- **2026-01-01** @jimfuller2024: thx for the report - investigating.
- **2026-01-01** @jimfuller2024: for reference ...

created evil_server.py


import http.server
import ssl
import sys

LISTEN_PORT = 8443
VICTIM_IP = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1"
VICTIM_PORT = "12345"

class ExploitAltSvcHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")

        alt_svc_value = f'h3="{VICTIM_IP}:{VICTIM_PORT}", h2=":443"; ma=2592000; persist=1'

        self.send_header("Alt-Svc", alt_svc_value)
        self.end_headers()
        self.wfile.write(b"Malicious Alt-Svc header sent.")

        print(f"[+] Sent Alt-Svc header pointing to {VICTIM_IP}:{VICTIM_PORT}")


if __name__ == "__main__":
    print(f"Start HTTPS Server on port {LISTEN_PORT}...")
    print(f"Victim IP set to: {VICTIM_IP}")
    httpd = http.server.HTTPServer(('0.0.0.0', LISTEN_PORT), ExploitAltSvcHandler)

    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    try:
        context.load_cert_chain(certfile="server.pem")
    except FileNotFoundError:
        print("[!] Error: 'server.pem' not found. Run openssl command.")
        sys.exit(1)

    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped.")


we need a pem

> openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes -subj "/CN=localhost"

run it

> python3 evil_server.py

and now hit it with curl

>curl -k --alt-svc cache.txt https://localhost:8443 -vvv

13:35:36.159081 [0-x] == Info: [READ] client_reset, clear readers
13:35:36.159198 [0-x] == Info: Alt-svc connecting from [h1]localhost:8443 to [h2]localhost:443
13:35:36.159320 [0-0] == Info: Host localhost:443 was resolved.
13:35:36.159403 [0-0] == Info: IPv6: ::1
13:35:36.159455 [0-0] == Info: IPv4: 127.0.0.1
13:35:36.159518 [0-0] == Info: [HTTPS-CONNECT] adding wanted h2
13:35:36.159601 [0-0] == Info: [HTTPS-CONNECT] added
13:35:36.159662 [0-0] == Info: [HTTPS-CONNECT] connect, init
13:35:36.159753 [0-0] == Info:   Trying [::1]:443...
13:35:36.159868 [0-0] == Info: [HTTPS-CONNECT] connect -> 0, done=0
13:35:36.159960 [0-0] == Info: [HTTPS-CONNECT] Curl_conn_connect(block=0) -> 0, done=0
13:35:36.160100 [0-0] == Info: [HTTPS-CONNECT] adjust_pollset -> 0, 1 socks
13:35:36.160241 [0-0] == Info: connect to ::1 port 443 from ::1 port 57960 failed: Connection refused
13:35:36.160399 [0-0] == Info:   Trying 127.0.0.1:443...
13:35:36.160494 [0-0] == Info: [HTTPS-CONNECT] connect -> 0, done=0
13:35:36.160584 [0-0] == Info: [HTTPS-CONNECT] Curl_conn_connect(block=0) -> 0, done=0
13:35:36.160694 [0-0] == Info: [HTTPS-CONNECT] adjust_pollset -> 0, 1 socks
13:35:36.160795 [0-0] == Info: connect to 127.0.0.1 port 443 from 127.0.0.1 port 50832 failed: Connection refused
13:35:36.160940 [0-0] == Info: Failed to connect to localhost port 443 after 1 ms: Could not connect to server
13:35:36.161069 [0-0] == Info: [HTTPS-CONNECT] connect, all attempts failed
13:35:36.161177 [0-0] == Info: [HTTPS-CONNECT] connect -> 7, done=0
13:35:36.161252 [0-0] == Info: [HTTPS-CONNECT] Curl_conn_connect(block=0) -> 7, done=0
13:35:36.161354 [0-0] == Info: [HTTPS-CONNECT] Curl_conn_connect(), filter returned 7
13:35:36.161464 [0-0] == Info: [WRITE] [OUT] done
13:35:36.161525 [0-0] == Info: closing connection #0
curl: (7) Failed to connect to localhost port 443 after 1 ms: Could not connect to server
- **2026-01-01** @jimfuller2024: cache.txt

   1   │ # Your alt-svc cache. https://curl.se/docs/alt-svc.html
   2   │ # This file was generated by libcurl! Edit at your own risk.
   3   │ h1 localhost 8443 h3 127.0.0.1 12345 "20260131 12:30:57" 1 0
   4   │ h1 localhost 8443 h2 localhost 443 "20260131 12:30:57" 1 0
- **2026-01-01** @bagder: Which structural logic flaw?

This sounds like alt-svc as documented.
- **2026-01-01** @huntsd: Hey Daniel (@bagder),

The issue isn't with Alt-Svc functionality itself, but specifically with how the parser scopes parameters when multiple entries are present in a single header.

Technically, per **RFC 7838 Section 3**, parameters like `ma` or `persist` are scoped to the `alt-value` they are attached to. Commas separate distinct values. 

In `lib/altsvc.c`, the parser takes a shortcut. It does a `strchr(p, ';')` at line 491 to find the flags once for the entire string, and then reuse those same `maxage` and `persist` variables for every alternative it creates in the `do..while` loop that follows.

My `cache.txt` demonstrates this:
`h1 localhost 8443 h3 127.0.0.1 12345 "20260131..." 1 0`

The `h3` entry here inherited `persist=1` and the 30-day `ma` value from the `h2` entry that came after the semicolon. 

That's the logic flaw.. parameters from one alternative are leaking into every other alternative in the header. In a DDoS scenario, an attacker can use this to make a malicious UDP route persistent even if it was intended to be ephemeral.

I've got a local fix that scopes the parameter parsing to the individual alternatives if you'd like to see it.
- **2026-01-01** @bagder: That sounds like a bug. But those values could just as well be provided without the bug. Can they not?
- **2026-01-01** @huntsd: It's not just that an attacker could write a valid header with those parameters, but that this bug lets them hide malicious flags from security filters and WAFs.

If a WAF is looking for `persist=1` or long `ma` values on suspicious UDP/h3 routes to prevent DDoS amplification, this bug lets me hide those flags behind a completely unrelated h2 entry. A filter sees `h3="victim:443"` as a safe, session-only redirect, while curl interprets it as a 30-day persistent route because of the leak.

It’s essentially attribute injection via syntax ambiguity. It breaks the "what you see is what you get" rule for header parsing. If I'm a developer auditing my site's headers and I see h3="target" without any trailing parameters, I expect it to be ephemeral. This bug means I can't trust the visual scoping of the header.

It also creates issues for intermediaries (CDNs/Proxies) that might strip parameters from certain services for safety but leave them on others. Curl will still apply the "unsafe" parameters to the "safe" services because it scans the whole string once.
- **2026-01-01** @huntsd: To clarify the specific security risks this creates, I've broken down three critical impact scenarios:

1. **WAF / Security Filter Bypass**: Many high-security environments or WAFs inspect `Alt-Svc` headers. If they see `h3="victim:443"; persist=1`, they may flag it as a persistent UDP amplification risk. However, with this bug, an attacker can hide the `persist` flag behind a benign `h2` entry. The filter sees `h3="victim:443"` (ephemeral, low risk) while `curl` treats it as `persistent` due to the leak. It's **Attribute Injection via Syntax Ambiguity**.

2. **Stealthy SSRF Recon**: I just verified a Proof-of-Concept where I can use this to probe internal networks (e.g. `127.0.0.1:9001`). By masking the `persist` flag behind a different entry, the "probing" entry looks like a standard session-only redirect to a security proxy, but `curl` "anchors" it into the `altsvc` cache for 30 days.

3. **Confused Deputy in CDNs/Intermediaries**: If a CDN or gateway is aggregating or rewriting headers, it might assume that parameters are properly scoped (as they are in every other header like `Set-Cookie`). If it leaves an `h2` entry with `persist` but strips it from others for security reasons, `curl` will still apply it to all of them, bypassing the intermediary's security policy.

In short, it breaks the **Expectation of Scoping**. If a dev or WAF looks at `h3="target:443"` and sees no parameters, they expect it to be session-only. `curl` violates that expectation.
- **2026-01-01** @bagder: I don't find those reasons compelling. They all assume that a middle-man reads and acts on the headers and that different interpretations would lead to serious problems. A far-fetch attempt to convert this bug into a vulnerability.  In modern communication curl uses HTTPS to servers and nothing reads the headers or acts on their contents. Anything else is a MITM attack and that opens up for much wider problems.

I also disagree that curl trying h3 for longer than declared is even an attack and I also don't agree with calling it "amplification". The header is there and the values are expected to be valid for 24 hours without an `ma` field anyway. To me, wrongly extending the "lease" seems unlikely to hurt any real world setup. It is more likely to just cause curl to fail more often than it should be expected to.
- **2026-01-01** @bagder: Rereading the RFC, I'm not sure curl is treating this wrongly.

Section **3** defines the header like this:

>   Alt-Svc       = clear / 1#alt-value

A single header provides a single alt-value. The single `alt-value` may be specified as a list.

Then further down it says:

>  Each "alt-value" is followed by an OPTIONAL semicolon-separated list of additional parameters, each such  parameter" comprising a name and   a value.

When I implemented alt-svc I considered that one set *per header* and this issue means that I was wrong then. But now I read it again and... I think my original interpretation was wright. These optional values are for the `alt-value`, meaning for each listed entry. For the entire single header.

I think my interpretation is further backed up by the fact that there is no way to *end* the list of optional parameters. Ie there is no way to provide a list of alternatives in a single header and have each have its own `ma`. You need to provide such alternatives with multiple headers.
- **2026-01-01** @jimfuller2024: RFC 7838 section 3 is sparse... it might be that @bagder interpretation is somewhat unintended ( side effect of missing/poor language in the spec) ... I agree with him (though would like to see more ABNF + language explicitly constraining all this).

I do not think this is a standalone security vuln - unless of course it can be demonstrated MITM is not required.
- **2026-01-01** @huntsd: Thanks for the input, Jim. I'll provide the explicit ABNF breakdown to address the "sparse" nature of RFC 7838.

### 1. The ABNF Proof (RFC 7838 + RFC 9110)
The Alt-Svc header uses the standard HTTP list extension (the **#rule**).
*   **RFC 7838 Section 3**: `Alt-Svc = clear / 1#alt-value`
*   **RFC 7838 Section 3**: `alt-value = alternative-service-value *(";" parameter)`

The definition of the `#` rule is found in **RFC 9110 Section 5.6.1** (which replaces the older RFC 7230). It states that `1#element` is semantically equivalent to a comma-separated list where each `element` is self-contained. 

Crucially, the `; parameter` block is defined as part of the `alt-value` production. Once the parser encounters a comma (`,`), the current `alt-value` production ends, and a new one begins. Parameters can never "leap" across a comma to infect another `alt-value`.

### 2. Threat Model: No MITM Required
A MITM is not required. The attacker model is a **Malicious or Compromised Origin Server**.
This is a **Confused Deputy** attack. The attacker (the server) responds to a `curl` request with a specially crafted `Alt-Svc` header. The goal is to coerce the client (`curl`) into storing a malicious, persistent state (`persist=1`) for a target that the server shouldn't have authority over.

For example, a shared hosting environment or a malicious CDN edge can use this to poison a user's `alt-svc` cache persistently. This is fundamentally the same trust model as `Set-Cookie` or `Strict-Transport-Security`; the vulnerability lies in the client incorrectly interpreting a directive in a way that exceeds the granted scope.

### 3. Proof of Internal Inconsistency
Regardless of spec interpretation, `curl` contains a functional inconsistency that violates **RFC 9110 Section 5.2** (Semantic Equivalence):

**Protocol Header A:**
`Alt-Svc: h2="alt1:9001"`
`Alt-Svc: h2="alt2:9002"; ma=60; persist=1`

**Protocol Header B:**
`Alt-Svc: h2="alt1:9001", h2="alt2:9002"; ma=60; persist=1`

RFC 9110 dictates these **must** be processed identically. However:
*   In **Header A**, `curl` correctly treats `alt1` as session-only.
*   In **Header B**, `curl` erroneously persists `alt1` to disk.

This proves that `curl`’s parser logic for comma-separated lists is fundamentally broken, allowing parameter "leakage" that creates a persistent, unauthorized capability.
- **2026-01-01** @bagder: Please stop sending us a whole essay for every response.
- **2026-01-01** @jimfuller2024: simplifying ....

  step 1- attacker has/gets control of server
  step 2 - user hits this server with curl seeding/poisoning alt svc cache
  step 3- user now hits attacker controlled server again and redirects to some other server

this might be exploited as a  'low touch' botnet eg. one visit to a attacker controlled server and you are recruited so next time you visit that attacker controlled server you blast udp (w/ no handshake) away on hapless victim.  I mean ... an attacker that controls that server, might also do a lot of other similar things but I guess this nicely distributes the attack. 

There is probably other (more unlikely) chaining possibilities as well. The other  issue is privacy related eg. using this to act as a kind of 'super cookie'.

Rereading the specs ... I understand our status quo but also conflicted - the ABNF grammar concretely defines hierarchy, where a comma (eg. ABNF #) splits the line into separate alt-value items and a semicolon attaches params inside one specific alt-value. Not respecting the comma as a "hard stop" is probably a bug and invalidates cross origin isolation.

As for security vulnerability ... the user must use alt svc cache, has to go to some evil server to get 'poisoned' and continue to request that bad server (albeit to route to DOS victim) to participate in DDOS ... this needs to happen after an attacker gets control of a server. I can imagine worst case scenarios where this could be ranked MEDIUM but feels like a LOW. The super cookie aspect  feels similar.
- **2026-01-01** @bagder: If we conclude that @huntsd is right about the header syntax, then how do you set one `ma` value for the first and another for the second in a single header? Isn't it *slightly* illogical that it isn't possible? Setting the `ma` is only possible for the last item in the list?

Even if we agree to this is being a parser bug, I still disagree to this being a security vulnerability. It just changes the timing for how long the alternative host will be tried by curl (when using saved alt-svc data), changed from the default 24 hours to something else. It is such a marginal flaw that is unlikely to ever cause a vulnerability. If anything, it is likely to be discovered as a bug by the curl users when/if it ever would happen.
- **2026-01-01** @bagder: Ah. It can of course be done like this:

~~~
Alt-Svc: h2="alt1:9001"; ma=20; persist=0, h2="alt2:9002"; ma=60; persist=1
- **2026-01-01** @huntsd: Understood on brevity. One concrete worst-case:
`h1 localhost 8443 h3 169.254.169.254 80 "..." 1 0`
h3 points to AWS metadata. persist=1 leaked from h2.
Any curl on EC2 that visits my site once sends future 
requests (with -H "Authorization: ...") to metadata 
for 30 days. That's credential theft, not just timing.
PoC attached.{F5176842}
- **2026-01-01** @bagder: > sends future requests (with -H "Authorization: ...") to metadata for 30 days.

... instead of one day. So it is a real alternative service.

(So now the claim has shifted away from the initial cache poisoning and UDP amplification?)

Remember that we speak of HTTPS here. The only way this flaw leads to "credential theft" is when there is a successful MITM attack impersonating the original site, which is a completely different attack and if that is in place much worse things can be accomplished.
- **2026-01-01** @bagder: To clarify: I now agree with the claim that this is a real bug in the alt-svc parser.
- **2026-01-02** @jimfuller2024: To conclude - I think there is a bug and this (when everything taken in totality eg. super cookie and  all the rest ) could be considered a LOW vulnerability ... with the unfortunate state of cert hygiene on internal networks could be problematic - but we document clearly these kind of things are not security vulnerabilities - so equally ok if this is marked as just a bug.
- **2026-01-02** @bagder: Here's my PR to fix the bug: https://github.com/curl/curl/pull/20160
- **Report Informative**
- **Agreed On Going Public**
- **2026-01-02** @huntsd: Thanks for the quick fix, Daniel.

I'll be honest, I'm a bit disappointed with the Informative rating. I still feel that leaking persistence flags into entries that were meant to be session-only crosses a security line, even if TLS catches the connect attempt. It's unauthorized state modification on the client.

But I get where you're coming from with the HTTPS model.

Agreed to disclose.
- **2026-01-02** @bagder: curl does not care about the `persist`flag so it makes exactly zero difference
- **Manually Disclosed**
