---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/desktop
  - os/windows
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2026-08-20
submitted: 2026-03-21T06:24:46.890Z
bounty_usd: null
votes: 40
cve: []
program: "[[programs/monero|Monero]]"
reporter: "qttps"
source: "https://hackerone.com/reports/3619409"
title: "Windows installer grants low-privileged users write access to executable P2Pool directory, enabling local code execution"
---
# Windows installer grants low-privileged users write access to executable P2Pool directory, enabling local code execution

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 40 | **Program:** Monero | **Disclosed:** 2026-08-20

- Report: [https://hackerone.com/reports/3619409](https://hackerone.com/reports/3619409)
- CWE: Improper Access Control - Generic
- Submitted: 2026-03-21T06:24:46.890Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2026-03-22** @qttps: Yes. I checked out PR #4575 locally and, based on source review, it appears to fix the issue I reported for Windows installer installs.

The original issue was that the installer created `{app}\p2pool` with overly broad write permissions, and the GUI later executed `p2pool.exe` from that directory.

PR #4575 appears to address that root cause by:
- removing the writable `{app}\p2pool` installer permission entry
- moving installed Windows P2Pool storage/execution to `%LocalAppData%` instead of the machine-wide install directory
- cleaning up the old installed `{app}\p2pool` path

So, for the installer-based Windows code path covered by my report, this appears to resolve the issue.

I have not rerun a full Windows runtime PoC against a built installer from this PR, so this confirmation is based on source review of the checked-out patch.
- **2026-04-06** @selsta: Do you want a bounty for this? If yes, you need to provide an address.
- **2026-04-13** @qttps: 479Zu6GkFNTfRcNkesCtHNJg37KE72PAG5VLFC1bQNBjLEi2ZqhUByff67M1KsHVpsEs5CBP6YgNwgrJTZRPmbRZUSVvtM6

Thanks!
- **2026-04-20** @luigi1111w: Sent 0.5 XMR: 86d31b2413525ccbe1858860bbac12caa323f0efc482bfb656e94fa1c8c4b201
- **Swag Awarded**
- **2026-04-21** @qttps: Thanks so much!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
