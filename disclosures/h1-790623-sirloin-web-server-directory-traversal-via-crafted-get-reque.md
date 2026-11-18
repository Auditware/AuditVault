---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2020-08-30
submitted: 2020-02-07T16:34:25.707Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "bp0lr"
source: "https://hackerone.com/reports/790623"
title: "[sirloin] Web Server Directory Traversal via Crafted GET Request"
---
# [sirloin] Web Server Directory Traversal via Crafted GET Request

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-30

- Report: [https://hackerone.com/reports/790623](https://hackerone.com/reports/790623)
- CWE: Path Traversal
- Submitted: 2020-02-07T16:34:25.707Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report path traversal in Sirloin module.
It allows an attacker to read system files via path traversal local/remote

# Module

**module name:** Sirloin
**version:** 0.15.0 (latest release build)
**npm page:** `https://www.npmjs.com/package/sirloin`

## Module Description

This high performance, extremely easy to use web server.

## Module Stats

downloads in the last year 4,129

# Vulnerability

## Vulnerability Description

Directory traversal through the url which doesn't verify the file is from the root directory path.

## Steps To Reproduce:

1 npm install sirloin
2 start the local server by typing `nodejs node_modules/sirloin/bin/sirloin.js`
3 `curl "http://localhost:3006/%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd"`

it will list the content of /etc/passwd

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

An attacker can leverage this vulnerability to request arbitrary files from the target host, which may include application source code or system files.
The package by default listen to 0.0.0.0 enabling external access.

## Timeline

- **Report Filed**
- **2020-02-08** @nochnoidozor: Hi @bp0lr,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Needs More Info**
- **Report Triaged**
- **2020-03-03** @bp0lr: Hi!, any update on this one?

thanks!
- **2020-03-07** @nochnoidozor: Hi @bp0lr,

Thank you for reaching out. Unfortunately we do not yet have an update to share. We will provide an update as soon as are able. Appreciate your continued patience.

@nochnoidozor
- **2020-06-12** @bp0lr: Hello team!
I'm doing my 3 months follow up.

any response from the maintainer?

thanks
- **2020-08-28** @bp0lr: Hello team!
I'm doing my 3 months follow up.

any response from the maintainer?

I saw other reports been closed like resolved because of no response from the maintainer and low impact in terms of downloads. Maybe we can do the same here?

thanks
- **2020-08-29** @bbe8482aecd24374d13c5de15a0a6: Hi @bp0lr,

I've contacted the maintainer via email and invited them about a month ago. So far we received no feedback. So I think we can close this report and disclose it.

It seems there was some activity very recently. Can you check if one of the new releases fixes this?
https://www.npmjs.com/package/sirloin
- **External User Joined**
- **2020-08-30** @eldoy: I fixed the problem, thanks for reporting it!
- **Report Resolved**
- **Agreed On Going Public**
- **2020-08-30** @bp0lr: ey @eldoy, thanks for your work!, 
I did some test and looks like fixed to me.
- **Agreed On Going Public**
- **Report Became Public**
