---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "informative"
weakness: "Path Traversal"
enriched: true
date: 2026-09-26
submitted: 2026-09-24T21:11:41.917Z
bounty_usd: null
votes: 54
cve: []
program: "[[programs/curl|curl]]"
reporter: "mrtomato"
source: "https://hackerone.com/reports/4057637"
title: "[HIGH] CWE-22 — Path Traversal in FTP Wildcard Download via Unencoded `.` in Escaped Filenames"
---
# [HIGH] CWE-22 — Path Traversal in FTP Wildcard Download via Unencoded `.` in Escaped Filenames

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 54 | **Program:** curl | **Disclosed:** 2026-09-26

- Report: [https://hackerone.com/reports/4057637](https://hackerone.com/reports/4057637)
- CWE: Path Traversal
- Submitted: 2026-09-24T21:11:41.917Z

## Timeline

- **Report Filed**
- **2026-09-24** @bagder: Thank you for your report!

The curl security team will now take some time and investigate your report and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.

If your report did not already mention how to reproduce this vulnerability, please consider providing this information to us.

Beware that there are **no** monetary rewards for curl vulnerabilities, no matter which severity.
- **2026-09-24** @bagder: @mrtomato I believe this problem does not exist in any curl release, does it?
- **2026-09-24** @bagder: Also: a malicious server that can return bad file names can already serve anything it wants, it doesn't need to trick the client into asking for it.
- **Report Informative**
- **Agreed On Going Public**
- **2026-09-24** @mrtomato: Thanks for taking the time to review this, and for merging a fix and sorry for not diffing against a release tag before writing the original report. The mechanism I originally described (the curl_easy_escape()/Curl_urldecode() round-trip) only exists on main.

For the record, since that specific question was raised: I went back and re-traced the underlying gap (unfiltered LIST filenames reaching CWD/MKD with no escaping) against curl-8_22_0 specifically, and it's present there too via a simpler path, the filename is concatenated straight into the FTP path, no round-trip needed. That's the same gap #23089 closes, so this isn't reopening the classification, just closing the loop on whether it applied to a release.

And I think your call is right, a malicious/MITM'd server that can hand back a bad filename can already serve whatever it wants on the path the client requested, so redirecting it to a different path first doesn't grant any new capability. Appreciate you explaining that, and for the fix.
- **Manually Disclosed**
