---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "not-applicable"
weakness: "Path Traversal"
enriched: true
date: 2025-06-30
submitted: 2025-05-01T06:30:43.406Z
bounty_usd: null
votes: 7
cve: "CVE-2020-8284"
program: "[[programs/curl|curl]]"
reporter: "oicus"
source: "https://hackerone.com/reports/3120987"
title: "[High] Arbitrary File Write via Path Traversal in cURL CLI (`-o`, `--output`) (CWE-22: Improper Limitation of a Pathname to a Restricted Directory)"
---
# [High] Arbitrary File Write via Path Traversal in cURL CLI (`-o`, `--output`) (CWE-22: Improper Limitation of a Pathname to a Restricted Directory)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** curl | **Disclosed:** 2025-06-30

- Report: [https://hackerone.com/reports/3120987](https://hackerone.com/reports/3120987)
- CWE: Path Traversal | CVE: CVE-2020-8284
- Submitted: 2025-05-01T06:30:43.406Z

## Timeline

- **Report Filed**
- **2025-05-01** @dfandrich: This is by design. curl will write a file to whatever path the user provides. If the user wants to write to ~/.bashrc curl will happily do it. After all, the user is the boss. What do you propose curl do instead?

This report sounds suspiciously like https://hackerone.com/reports/3100073  Are you also using an AI to generate it?
- **Report Not Applicable**
- **2025-05-02** @jimfuller2024: agree my colleagues comments - in addition - if you have a vulnerability report that includes '>sudo curl' - not only is the 'user boss' then this particular user is root which lets you do all sorts of bad things.
- **Agreed On Going Public**
- **Manually Disclosed**
