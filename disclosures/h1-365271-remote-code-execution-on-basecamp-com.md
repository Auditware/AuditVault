---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2020-11-26
submitted: 2018-06-13T07:27:51.328Z
bounty_usd: 5000
votes: 417
cve: "CVE-2017-8291"
program: "[[programs/basecamp|Basecamp]]"
reporter: "gammarex"
source: "https://hackerone.com/reports/365271"
title: "Remote code execution on Basecamp.com"
---
# Remote code execution on Basecamp.com

> **Severity:** Critical | **Bounty:** 5,000 USD | **Votes:** 417 | **Program:** Basecamp | **Disclosed:** 2020-11-26

- Report: [https://hackerone.com/reports/365271](https://hackerone.com/reports/365271)
- CWE: Command Injection - Generic | CVE: CVE-2017-8291
- Submitted: 2018-06-13T07:27:51.328Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

A critical flaw in Basecamp's profile image upload function leads to remote command execution. Images are converted on the server side, but not only image files but also PostScript/EPS files are accepted (if renamed to .gif). This is probably due to ImageMagick / GraphicsMagick being used for image conversion, which calls a PostScript interpreter (Ghostscript) if the input file starts with '%!'. The used Ghostscript version however has a security bug (CVE-2017-8291) leading to remote command execution.

/Proof of concept/: Upload the attached rce.gif file as profile image (change the `ping -c1 attacker.com' to some other shell command).

/Mitigation/: Upgrade Ghostscript; also, before processing uploaded images make sure they are real image files (e.g. based on magic header)

## Impact

Gain a remote shell; from here start exploitation/privilege escalation

## Timeline

- **Report Filed**
- **Bounty Awarded**
- **Report Resolved**
- **2018-06-13** @gammarex: Thanks a lot for the bounty, appreciate it!
- **Bounty Awarded**
- **2018-06-13** @gammarex: Wow, thanks again -- really appreciate it!
- **Agreed On Going Public**
- **Report Became Public**
