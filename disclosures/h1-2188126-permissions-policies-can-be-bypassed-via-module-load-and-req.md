---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2023-11-30
submitted: 2023-09-30T19:26:08.886Z
bounty_usd: 1165
votes: 29
cve: "CVE-2023-32002"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "mattaustin"
source: "https://hackerone.com/reports/2188126"
title: "Permissions policies can be bypassed via Module._load and require.extensions (High) (CVE-2023-30587)"
---
# Permissions policies can be bypassed via Module._load and require.extensions (High) (CVE-2023-30587)

> **Severity:** High | **Bounty:** 1,165 USD | **Votes:** 29 | **Program:** Internet Bug Bounty | **Disclosed:** 2023-11-30

- Report: [https://hackerone.com/reports/2188126](https://hackerone.com/reports/2188126)
- CWE: Improper Access Control - Generic | CVE: CVE-2023-32002
- Submitted: 2023-09-30T19:26:08.886Z

## Report summary

Permissions policies can be bypassed via Module._load (HIGH)(CVE-2023-32002)
The use of Module._load() can bypass the policy mechanism and require modules outside of the policy.json definition for a given module.

Please note that at the time this CVE was issued, the policy mechanism is an experimental feature of Node.js.

Impacts:
This vulnerability affects all users using the experimental policy mechanism in all active release lines: 16.x, 18.x and, 20.x.

Thank you, to mattaustin for reporting this vulnerability and thank you Rafael Gonzaga and Bradley Farias for fixing it.

Full Security Advisory: https://nodejs.org/en/blog/vulnerability/august-2023-security-releases

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

[https://hackerone.com/reports/1960870](https://hackerone.com/reports/1960870)

The use of `Module._load()` and `require.extensions[".js"]` can bypass the policy mechanism and require modules outside of the policy.json definition for a given module.
This vulnerability affects all users using the experimental policy mechanism in all active release lines: 16.x, 18.x and, 20.x.

## Impact

Permission policies limit a project to a specific set of authorized node js built-in modules. For example a project could attempt to limit the use of child_process which could be bypassed leading to remote code execution.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Cve Id Added**
- **2023-10-27** @kunderkoffler: Hey, @mattaustin! Thank you for your patience with this submission. We are gathering modifier validation from the project team and will have this fully resolved by next week.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
