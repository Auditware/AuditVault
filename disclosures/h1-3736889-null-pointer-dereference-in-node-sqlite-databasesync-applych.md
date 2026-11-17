---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/null-pointer-dereference
  - env/web
  - stack/node
substate: "informative"
weakness: "NULL Pointer Dereference"
enriched: true
date: 2026-05-23
submitted: 2026-05-15T02:27:21.335Z
bounty_usd: null
votes: 44
cve: []
program: "[[programs/nodejs|Node.js]]"
reporter: "junius"
source: "https://hackerone.com/reports/3736889"
title: "NULL pointer dereference in node:sqlite DatabaseSync#applyChangeset() via malformed SQLite changeset"
---
# NULL pointer dereference in node:sqlite DatabaseSync#applyChangeset() via malformed SQLite changeset

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 44 | **Program:** Node.js | **Disclosed:** 2026-05-23

- Report: [https://hackerone.com/reports/3736889](https://hackerone.com/reports/3736889)
- CWE: NULL Pointer Dereference
- Submitted: 2026-05-15T02:27:21.335Z

## Timeline

- **Report Filed**
- **Report Informative**
- **Report Reopened**
- **2026-05-20** @junius: Hi Node.js security team,

I wanted to share an upstream update.

SQLite has fixed the underlying Session Extension NULL pointer dereference on trunk and branch-3.53:
https://sqlite.org/src/info/e807d4e3798efd53

The root cause is in SQLite, but the Node.js impact remains practical: affected official Node.js release binaries expose this crash path through the documented `DatabaseSync#applyChangeset()` API, and malformed caller-supplied changeset bytes can terminate the Node.js process with SIGSEGV.

This remains true for affected Node.js releases until the bundled SQLite copy includes the upstream fix, whether through a future SQLite release or another approved dependency update path.

Could you please re-evaluate this as a security-impacting bundled dependency issue?

Thanks.
- **2026-05-23** @aduh95: Thanks for the report! The consensus among the team is that this is a bug, not a vulnerability; under the current Node threat model, this likely falls under application-level exposure of a dangerous low-level API to untrusted input rather than a Node.js vulnerability.

Given that the change landed upstream, we can cherry-pick the fix on the public repository so it can be included in the next regular releases.
- **Report Informative**
- **2026-05-23** @junius: Thank you for the update. I understand this is being handled as a bug fix rather than a security advisory.

If it fits the project's process, I would appreciate a mention as the reporter of this issue in the relevant commit or release notes.
Either way, I’m glad the issue is being addressed, and I hope to make more meaningful security contributions to Node.js in the future.

Thank you again:)
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2026-05-23** @junius: Thank you for the clarification and for proceeding with the disclosure. I appreciate it, and I’ll look into the upstream fix and the backport PR.
