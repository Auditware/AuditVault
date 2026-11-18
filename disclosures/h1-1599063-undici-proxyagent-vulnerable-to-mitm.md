---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-certificate-validation
  - env/web
substate: "resolved"
weakness: "Improper Certificate Validation"
enriched: true
body: true
date: 2022-07-13
submitted: 2022-06-13T15:07:42.127Z
bounty_usd: 1000
votes: 5
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "pimterry"
source: "https://hackerone.com/reports/1599063"
title: "Undici ProxyAgent vulnerable to MITM "
---
# Undici ProxyAgent vulnerable to MITM 

> **Severity:** High | **Bounty:** 1,000 USD | **Votes:** 5 | **Program:** Internet Bug Bounty | **Disclosed:** 2022-07-13

- Report: [https://hackerone.com/reports/1599063](https://hackerone.com/reports/1599063)
- CWE: Improper Certificate Validation
- Submitted: 2022-06-13T15:07:42.127Z

## Report summary

ProxyAgent vulnerable to MITM

Description
Undici.ProxyAgent never verifies the remote server's certificate, and always exposes all request & response data to the proxy. This unexpectedly means that proxies can MitM all HTTPS traffic, and if the proxy's URL is HTTP then it also means that nominally HTTPS requests are actually sent via plain-text HTTP between Undici and the proxy server.

Impact
This affects all use of HTTPS via HTTP proxy using Undici.ProxyAgent with Undici or Node's global fetch. In this case, it removes all HTTPS security from all requests sent using Undici's ProxyAgent, allowing trivial MitM attacks by anybody on the network path between the client and the target server (local network users, your ISP, the proxy, the target server's ISP, etc).
This less seriously affects HTTPS via HTTPS proxies. When you send HTTPS via a proxy to a remote server, the proxy can freely view or modify all HTTPS traffic unexpectedly (but only the proxy).

Patches
This issue was patched in Undici v5.5.1.

Workarounds
At the time of writing, the only workaround is to not use ProxyAgent as a dispatcher for TLS Connections.

GHSA Link: https://github.com/nodejs/undici/security/advisories/GHSA-pgw7-wx7w-2w33

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Full GitHub advisory summarizing the issue is here: https://github.com/nodejs/undici/security/advisories/GHSA-pgw7-wx7w-2w33
The original Node.js HackerOne report is here: https://hackerone.com/bugs?report_id=1583680

This was fixed & disclosed in Undici v5.5.1.

This primarily affects Undici, a subproject under the Node.js umbrella, which is experimentally included as part of recent Node.js releases. This issue doesn't immediately affect standalone Node.js usage today due to the limited APIs initially exposed, but it does affect all usage of Node.js's new Fetch API with HTTP proxies (since Undici was required for that) and @mcollina in https://hackerone.com/bugs?report_id=1583680 who processed the Node.js security report said this should be eligible for a Node.js bounty.

## Impact

See https://github.com/nodejs/undici/security/advisories/GHSA-pgw7-wx7w-2w33 for more details but in short: it allows for trivial MitM of all HTTPS traffic sent to a proxy with Undici's ProxyAgent API. In all cases the proxy can invisibly MitM 'secure' traffic, and in most cases everybody else on the network path can do so too.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2022-07-13** @pimterry: Great, thank you!
