---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "not-applicable"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2025-12-23
submitted: 2025-12-22T19:14:51.333Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/curl|curl]]"
reporter: "anonymous_237"
source: "https://hackerone.com/reports/3475613"
title: "HAProxy Connection Reuse leads to IP Spoofing and mTLS Context Smuggling"
---
# HAProxy Connection Reuse leads to IP Spoofing and mTLS Context Smuggling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** curl | **Disclosed:** 2025-12-23

- Report: [https://hackerone.com/reports/3475613](https://hackerone.com/reports/3475613)
- CWE: Improper Access Control - Generic
- Submitted: 2025-12-22T19:14:51.333Z

## Timeline

- **Report Filed**
- **2025-12-22** @bagder: Please stop the AI use. It is tiresome.
- **2025-12-22** @bagder: > attributes the new request to the previous identity

Can you please refer to an application that uses the haproxy functionality this way? Claiming this is a **severity high** vulnerability seems to imply that there are (several) applications using this "identity switching" with the HAproxy protocol and for which this is a vital property.

Seeing their use of this will help us assess this issue and understand its implications better.
- **2025-12-22** @bagder: I don't think this is a security vulnerability. I think this is functionality working as intended.

I'm proposing we clarify this with an amendment to the documentation:

https://github.com/curl/curl/pull/20075
- **2025-12-23** @anonymous_237: 1. If USERNAME changes, libcurl rejects reuse ;  if SSL_CTX changes, libcurl rejects reuse ;   If  CURLOPT_HAPROXY_CLIENT_IP  , libcurl accept reuse     . Why does libcurl accept reuse when CURLOPT_HAPROXY_CLIENT_IP  changes?  Why this distinction?


2. CVE-2023-27535 caused Curl to reuse an existing connection even if the CURLOPT_FTP_ACCOUNT option changed, sending the wrong identity information. CURLOPT_HAPROXY_CLIENT_IP allows the source IP address to change. Curl reuses an existing connection even if this option changes, sending the wrong identity to the server.  https://curl.se/docs/CVE-2023-27535.html
I think these are two very similar reuse vulnerabilities .  Why is one fixed and the other documented?


3. The official documentation says this:   **"Using this option multiple times makes the last set string override the previous ones." **   
I think this is not true with the current code because if a connection is reused, even if you call the option 10 times with different IPs, it is always the first IP that is active on the network.  : https://curl.se/libcurl/c/CURLOPT_HAPROXY_CLIENT_IP.html


4. I think to fix this we can create a variable called `haproxy_client_ip` and copy it into the `connectdata` structure. During the connection, we can simply check if the variable has changed to avoid reuse.
- **2025-12-23** @bagder: This option is used to provide the actual local IP to the proxy. That IP remains the same during the connection. Users are unlikely to A) change the option at all and even more to B) change the option for different requests. The option is rarely, if ever, used to somehow *impersonate different identities*.

libcurl's behavior is adapted to the expected usage pattern.
- **2025-12-23** @anonymous_237: You say that: **"This option is used to provide the actual local IP to the proxy"**, but why not use `getsockname()`, which does indeed retrieve the real local IP address?      With this, libcurl wouldn't need the user to provide a string (character *), and this string would be retrieved in `data->set.str[STRING_HAPROXY_CLIENT_IP]` without checking if this IP corresponds to the real local IP. Therefore, the code is designed to accept any valid IP address.


I think that CURLOPT_INTERFACE is used to specify the local network interface (like an IP address), based on the documentation: https://curl.se/libcurl/c/CURLOPT_INTERFACE.html .
So if CURLOPT_HAPROXY_CLIENT_IP was only used to **"provide the real local IP address"**, then this option would be redundant and useless, because CURLOPT_INTERFACE already does that and has existed since version 7.3 unlike CURLOPT_HAPROXY_CLIENT_IP which was added in version 8.2.0.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2025-12-23** @anonymous_237: Okay, I'll start writing all my reports myself and no longer just take parts or ideas from AI, but use the documentation.

I think the report should be classified as informative and not applicable because it improves the documentation of `CURLOPT_HAPROXY_CLIENT_IP` by highlighting a previously undocumented behavior.

You can close it and make it public.
- **2025-12-23** @anonymous_237: Thanks for the advice.
- **Manually Disclosed**
