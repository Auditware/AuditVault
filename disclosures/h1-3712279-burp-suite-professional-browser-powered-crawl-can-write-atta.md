---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
date: 2026-06-14
submitted: 2026-05-04T13:17:29.727Z
bounty_usd: 5000
votes: 177
cve: []
program: "[[programs/portswigger|PortSwigger Web Security]]"
reporter: "kawakatz"
source: "https://hackerone.com/reports/3712279"
title: "Burp Suite Professional: browser-powered crawl can write attacker-controlled files through file input handling"
---
# Burp Suite Professional: browser-powered crawl can write attacker-controlled files through file input handling

> **Severity:** High | **Bounty:** 5,000 USD | **Votes:** 177 | **Program:** PortSwigger Web Security | **Disclosed:** 2026-06-14

- Report: [https://hackerone.com/reports/3712279](https://hackerone.com/reports/3712279)
- CWE: Path Traversal
- Submitted: 2026-05-04T13:17:29.727Z

## Timeline

- **Report Filed**
- **2026-05-04** @kawakatz: ████████
████████
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2026-05-07** @kawakatz: Thank you for the triage!
- **2026-05-07** @garethheyes: @kawakatz No worries, we realised this is a windows only issue that's why I couldn't reproduce it on mac.
- **2026-05-14** @albinowax: Hi @kawakatz, we've released 2026.4.3 with a patch for this vulnerability. Can you confirm it looks fixed from your side?
- **2026-05-14** @kawakatz: @albinowax Thank you for the fix.
The patch looks to be working on my end. The PoC no longer reproduces the issue.

████████
████████
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2026-05-15** @albinowax: Yes we're happy with disclosure. I'll wait for the 30 day timer to elapse to give our userbase time to patch.

You may want to review your attached videos or do limited disclosure to make sure you aren't leaking anything.
- **2026-05-15** @albinowax: Would you like to be credited in the release notes?
- **2026-05-15** @kawakatz: @albinowax Understood, thank you! Could you keep only fresh.mov visible and redact the other videos? And yes, I'd like to be credited in the release notes!
- **2026-05-15** @albinowax: Will do. How would you like to be credited?
- **2026-05-15** @kawakatz: @albinowax Please credit me as "Masahiro Kawada (@kawakatz)". Thank you!
- **Report Became Public**
