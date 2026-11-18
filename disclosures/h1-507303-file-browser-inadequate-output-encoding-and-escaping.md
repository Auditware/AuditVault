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
date: 2020-01-29
submitted: 2019-03-10T04:04:35.878Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "johnssimon007"
source: "https://hackerone.com/reports/507303"
title: "[file-browser] Inadequate Output Encoding and Escaping "
---
# [file-browser] Inadequate Output Encoding and Escaping 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Node.js third-party modules | **Disclosed:** 2020-01-29

- Report: [https://hackerone.com/reports/507303](https://hackerone.com/reports/507303)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2019-03-10T04:04:35.878Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report stored xss in file-browser module
It allows an attacker to embed malicious js code as filenames,which get executed once browsed to the file over the web browser

# Module

**module name:** file-browser
**version:** 0.0.5
**npm page:** https://www.npmjs.com/package/file-browser

## Module Description
file-browser is a utility to browse files on your file system using your browser. Its equivalent of creating a file share that can be accessed over http. Using this you can share files between different machines, and across different operating systems.


## Vulnerability Description

due to improper output encoding and escaping ,it was possible for an attacker to embed malicious js code as filenames,which get executed once browsed to the file over the web browser
## Steps To Reproduce:
1.  npm -g install file-browser

2.now running below command will start a file server on the specified port:
  file-browser

3.now create a file with xss payload as filename in current dir

touch '"><img src=x onerror=alert("xss")>.jpg'

4.now goto url at which the file server is running

http://127.0.0.1:8088/lib/template.html

now xss will popup

## Supporting Material/References:

- [OPERATING SYSTEM VERSION] Kali linux
- [NODEJS VERSION] 11.8.0
- [NPM VERSION] 6.5.0

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

this could have enabled an attacker to execute malicous js code which might lead to session stealing,hooking up browser with frameworks like beef and so on

## Timeline

- **Report Filed**
- **2019-03-10** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Title Updated**
- **Report Triaged**
- **2019-05-03** @johnssimon007: Theres seems to be no response from package manager @ronperris .what should we do now?.disclose and close this issue as resolved?
- **2019-12-30** @johnssimon007: Can we just close this as resolved
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
