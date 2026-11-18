---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/node
  - vuln/xss-stored
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2019-12-28
submitted: 2019-03-09T15:12:41.309Z
bounty_usd: null
votes: 11
cve: "CVE-2019-15602"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "johnssimon007"
source: "https://hackerone.com/reports/507159"
title: "[fileview] Inadequate Output Encoding and Escaping "
---
# [fileview] Inadequate Output Encoding and Escaping 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js third-party modules | **Disclosed:** 2019-12-28

- Report: [https://hackerone.com/reports/507159](https://hackerone.com/reports/507159)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2019-15602
- Submitted: 2019-03-09T15:12:41.309Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report stored xss in fileview module
It allows an attacker to embed malicious js code in filename there was no sanitization performed. 

# Module

**module name:**fileview
**version:** 0.1.6
**npm page:** https://www.npmjs.com/package/fileview

## Module Description
File browsers on web. It's easy to browser your local file.


# Vulnerability

## Vulnerability Description

since there was no sanitizations performed on filenames ,an attacker can include filenames with malicious js code which gets executed when browsed to the file  over the web browser

## Steps To Reproduce:
1.install fileview:
npm install fileview -g

2:now create a file with xss payload as follows:
"><img src=x onerror=alert("xss")>.jpg

3.running below command on terminal  will start a file server at port 8080

fileview -p /root/ -P 8080

4.now goto http://127.0.0.1:8080/

you will see the xss got executed



## Patch

> If you're able to provide a patch with the fix please post it in this section

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- [OPERATING SYSTEM VERSION] KALI LINUX
- [NODEJS VERSION] 11.8.0
- [NPM VERSION]  6.5.0

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

this could have allowed an attacker to embed malicious js code in filename and executes it when  victim browse to file over the web browser

## Timeline

- **Report Filed**
- **2019-03-09** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Triaged**
- **Report Title Updated**
- **2019-07-09** @ronperris: Opened an issue in the GitHub repo. https://github.com/itworkcenter/fileview/issues/1
- **2019-12-28** @johnssimon007: can we close this issue as resolved?
- **Report Severity Updated**
- **Changed Scope**
- **2019-12-28** @lirantal: @johnssimon007 apologies for the late reply here, I'm disclosing this report now.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
