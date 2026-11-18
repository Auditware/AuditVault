---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2020-08-26
submitted: 2019-05-07T07:51:07.269Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "toannc123"
source: "https://hackerone.com/reports/569891"
title: "[min-http-server] List any file in the folder by using path traversal."
---
# [min-http-server] List any file in the folder by using path traversal.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-26

- Report: [https://hackerone.com/reports/569891](https://hackerone.com/reports/569891)
- CWE: Path Traversal
- Submitted: 2019-05-07T07:51:07.269Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Path Traversal in min-http-server. It allows to list any file in another folder of web root.

# Module

**module name:** min-http-server
**version:** 1.0.6
**npm page:** `https://www.npmjs.com/package/min-http-server`

## Module Description

'min-http-server' is a zero-configuration, lightweight http static resource server.

# Vulnerability

## Vulnerability Description

min-http-server is simply get the path name of url and add it to the web root. it means if you input ../, it will happy add it to web root and you can list the folder you choose. But the trick is web browser or curl are also to try rebuild the url containing ../. I used the burp to make a raw url and send it to server.

## Steps To Reproduce:

install `min-http-server`
`$ npm install min-http-server -g`

start program
`$ min-http-server`

start burpsuite and enter the url contain ../. you should see the files in the folder.
{F485794}

## Patch

filter .. in the path name.

## Supporting Material/References:

Configuration I've used to find this vulnerability:

- kali linux 4.15.0
- nodejs v8.9.3
- npm 6.4.1
- Burpsuite

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

This vulnerability allows malicious user to list file in the folder. This might expose vectors to attack system with Remote Code Execution, reveals files with usernames and passwords and many other possibilites.

## Timeline

- **Report Filed**
- **2019-05-07** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Severity Updated**
- **Report Triaged**
- **2019-10-28** @toannc123: Hi, Any update for the finding?
- **2020-08-09** @bbe8482aecd24374d13c5de15a0a6: So far we tried multiple times to contact the maintainer and got no response. I'll try to ping them again at https://github.com/zhanyuzhang/min-http-server/issues/1.
- **2020-08-09** @toannc123: Thank you for supporting triaging the report :D
- **2020-08-25** @bbe8482aecd24374d13c5de15a0a6: So far the maintainer did not accept the invitation to this report. Going to request disclosure.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
