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
date: 2018-08-30
submitted: 2018-05-24T17:10:48.144Z
bounty_usd: null
votes: 11
cve: "CVE-2018-3787"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "n0n4me"
source: "https://hackerone.com/reports/357109"
title: "[simplehttpserver] List any file in the folder by using path traversal."
---
# [simplehttpserver] List any file in the folder by using path traversal.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js third-party modules | **Disclosed:** 2018-08-30

- Report: [https://hackerone.com/reports/357109](https://hackerone.com/reports/357109)
- CWE: Path Traversal | CVE: CVE-2018-3787
- Submitted: 2018-05-24T17:10:48.144Z

## Report summary

Vulnerability was reported and the package maintainer fixed the issue.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Path Traversal in simplehttpserver. It allows to list any file in another folder of web root.

# Module

**module name:** simplehttpserver
**version:** 0.1.1
**npm page:** `https://www.npmjs.com/package/simplehttpserver`

## Module Description

'simpehttpserver' is an simple imitation of python's SimpleHTTPServer and is intended for testing, development and debugging purposes

## Module Stats

[444] downloads in the last week

# Vulnerability

## Vulnerability Description

simpehttpserver is simply get the path name of url and add it to the web root. it means if you input ../, it will happy add it to web root and you can list the folder you choose. But the trick is web browser or curl are also to try rebuild the url containing ../. I used the burp to make a raw url and send it to server.

## Steps To Reproduce:

install `simplehttpserver`
`$ npm install simplehttpserver -g`

start program
`$ simplehttpserver ./`

start burpsuite and enter the url contain ../. you should see the files in the folder.
{F301226}

## Patch

filter .. in the path name.

## Supporting Material/References:

Configuration I've used to find this vulnerability:

- kali linux 4.15.0
- nodejs v8.11.2
- npm 6.1.0
- Burpsuite community

# Wrap up

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

This vulnerability allows malicious user to list file in the folder. This might expose vectors to attack system with Remote Code Execution, reveals files with usernames and passwords and many other possibilites.

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2018-07-10** @n0n4me: any update ?
- **2018-07-11** @e_lexy: I have tried your Curl command and am able to reproduce. I will try to contact the author.
- **2018-08-11** @e_lexy: Opened this issue in the GH repo https://github.com/tikonen/blog/issues/4 since the author did not respond to my email.
- **2018-08-13** @e_lexy: Response received on GH issue!
- **2018-08-14** @n0n4me: Thanks for the update.
- **2018-08-14** @e_lexy: I invited the author of the module.
- **External User Joined**
- **2018-08-14** @tikonen: I'm the author of this module, I'll see if the fix is straightforward. The simplehttpserver is purposed for testing and development use and was never indented to be secure in any way. This case is however also a clear bug, http server should not behave this way even in the dev use.
- **2018-08-15** @tikonen: I've published version 0.2.1 that should cover the path traversal vulnerability issue
- **2018-08-15** @e_lexy: @tikonen thanks for the quick fix!
@n0n4me can you verify 0.2.1 fixes the issue?
- **2018-08-16** @n0n4me: hello @e_lexy @tikonen,

I confirm it is fixed.
- **Report Resolved**
- **Agreed On Going Public**
- **2018-08-29** @e_lexy: CVE ID requested
- **Agreed On Going Public**
- **Report Became Public**
