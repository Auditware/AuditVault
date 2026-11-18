---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/network
  - stack/node
  - vuln/ssrf
  - fix/patch-upstream
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2026-10-23
submitted: 2026-09-17T20:33:06.032Z
bounty_usd: null
votes: 18
cve: "CVE-2026-105482"
program: "[[programs/nodejs|Node.js]]"
reporter: "hasanfleyah"
source: "https://hackerone.com/reports/4038342"
title: "dns.resolve truncates names containing NUL char"
---
# dns.resolve truncates names containing NUL char

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** Node.js | **Disclosed:** 2026-10-23

- Report: [https://hackerone.com/reports/4038342](https://hackerone.com/reports/4038342)
- CWE: Improper Access Control - Generic | CVE: CVE-2026-105482
- Submitted: 2026-09-17T20:33:06.032Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

I looked at the June 18 2026 fix for CVE-2026-48930 and found it is incomplete. The
fix rejects embedded NUL bytes at the entry points that feed libuv's `getaddrinfo`
(`dns.lookup`, `dns.promises.lookup`) and at `options.host` in `net`/`tls`. It does not
reject them at any of the `dns.resolve*` entry points, which feed the c-ares binding —
the binding the advisory title actually names.

On Node v26.9.0 I passed `attacker.test\x00.trusted.corp` to `dns.resolve4()`. The call
did not throw. I read the DNS packet off the wire and the QNAME was `attacker.test`.
The `.trusted.corp` portion was not in the packet at all. The call then returned an
address, successfully, with no error and no warning.

So the name a program validates in JavaScript and the name Node actually asks a DNS
server about can be two different names, on the current patched release.

## What I tested

I used two Node builds: the patched v26.9.0 from nodejs.org (verified by checksum) and
the system v26.3.0, which is pre-patch, as my positive control. Everything ran on
127.0.0.1 and 127.0.0.2. No real CA and no third-party host was contacted.

I wrote a small authoritative DNS server on loopback, pointed the runtime at it with
`dns.setServers()`, and read the question section of each packet directly so I could
compare the name I asked for in JavaScript against the name that left the process.

## What happened

I asked `dns.resolve4()` for `control.bound.test` first. The QNAME on the wire was
`control.bound.test`, 18 characters, matching exactly. That is my control and it shows
the harness reads QNAMEs correctly.

I then asked for `attacker.test\x00.trusted.corp`, 27 characters. The QNAME on the wire
was `attacker.test`, 13 characters. The raw question section was
`0861747461636b657204746573740000010001` — one label `attacker`, one label `test`, then
the terminator. The call returned an address normally.

I ran the same thing through `dns.lookup()`, which is the entry point the fix did cover.
It threw `ERR_INVALID_ARG_VALUE` and zero packets left the process. That is the negative
arm: the same name, correctly refused, in the same run.

On v26.3.0 the `dns.resolve4` arms are byte-identical, and the `dns.lookup` arm is *not*
refused. So the fix demonstrably landed on one path and demonstrably did not land on the
other.

I then built the ordinary shape this reaches: a guard that suffix-checks a hostname,
resolves it with `dns.promises.resolve4`, and connects to the address it gets back. With
`attacker.test` the guard refused and nothing was contacted. With
`attacker.test\x00.trusted.corp` the guard approved it, Node queried `attacker.test`, the
address returned was 127.0.0.2 instead of 127.0.0.1, and the service on 127.0.0.2
answered the connection.

## Impact

## Impact

Any code that validates a hostname string and then resolves it with `dns.resolve*` is
validating a different name from the one Node queries. The affected calls are
`resolveAny, resolve4, resolve6, resolveCaa, resolveCname, resolveMx, resolveNs,
resolveTlsa, resolveTxt, resolveSrv, resolvePtr, resolveNaptr, resolveSoa` and `reverse`,
in both the callback and promise APIs, on the default resolver and on any `new
dns.Resolver()`.

That covers SSRF allowlists, DNS-rebinding guards, and domain-verification lookups such as TXT-record checks. The lookup succeeds rather than failing, so nothing surfaces the substitution.

## Reproduction 



## Run this

```
cd C:/Users/Owner/Documents/mywork/nodejs-node/CVE-2026-48930
node proof/poc.js
```

One file, no arguments, no environment variables, no companion files. It locates the
patched runtime relative to its own `__dirname`, re-executes itself inside it, stands up a loopback authoritative UDP DNS server and two loopback TCP services, runs every arm, then repeats the same arms on the system `node` (v26.3.0) for the pre-patch contrast. Exit code 0 means the expected pattern held; non-zero means it did not.

{F6751460}

{F6751469}

{F6751472}

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Title Updated**
- **Report Resolved**
- **2026-10-22** @hasanfleyah: Hello, could you please credit me using my full legal name (Hasan Flayyih Abdullah)  instead of my username? Thank you
- **Cve Id Added**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
