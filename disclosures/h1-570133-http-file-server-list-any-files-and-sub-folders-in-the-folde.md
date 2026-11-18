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
date: 2019-07-10
submitted: 2019-05-07T10:47:20.981Z
bounty_usd: null
votes: 7
cve: "CVE-2019-5447"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "toannc123"
source: "https://hackerone.com/reports/570133"
title: "[http-file-server] List any files and sub folders in the folder by using path traversal."
---
# [http-file-server] List any files and sub folders in the folder by using path traversal.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2019-07-10

- Report: [https://hackerone.com/reports/570133](https://hackerone.com/reports/570133)
- CWE: Path Traversal | CVE: CVE-2019-5447
- Submitted: 2019-05-07T10:47:20.981Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Path Traversal in http-file-server. It allows to list any files and sub folders in another folder of web root.

# Module

**module name:** http-file-server
**version:** 0.2.6
**npm page:** https://www.npmjs.com/package/http-file-server

# Vulnerability

## Vulnerability Description

http-file-server is simply get the path name of url and add it to the web root. it means if you input ../, it will happy add it to web root and you can list the folder you choose. But the trick is web browser or curl are also to try rebuild the url containing ../. I used the burp to make a raw url and send it to server.

## Steps To Reproduce:

install `http-file-server`
`$ npm install -g http-file-server`

start program: go to the folder of the module and run the file
`$ ./http-file-server.js --path=/tmp/ --host=* --port=1234`

start burpsuite and enter the url contain ../. you should see the files in the folder.
{F485870}

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

This vulnerability allows malicious user to list file in the folder. This might expose vectors to attack system with Remote Code Execution, reveals files with usernames and passwords and many other possibilities.

## Timeline

- **Report Filed**
- **2019-05-07** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Severity Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-07-09** @toannc123: Hi @marcinhoppe,

Thank you so much for your response.
So can I have a CVE bro? If yes, can you help me to request a CVE?
@toannc123
- **Manually Disclosed**
- **2019-07-10** @marcinhoppe: @toannc123 I completed public disclosure and requested a CVE.
- **2019-07-10** @toannc123: Hi @marcinhoppe ,

So you requested a CVE for me, or you just disclosed the report and I will do my job, bro?

Thank you so much,
@toannc123
- **2019-07-10** @marcinhoppe: @toannc123 I did both, no action is required from you at the moment.
- **2019-07-10** @toannc123: @marcinhoppe,

Thank you so much bro,

@toannc123
