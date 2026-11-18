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
date: 2020-09-24
submitted: 2019-05-13T20:17:40.604Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "lightangel1412"
source: "https://hackerone.com/reports/579517"
title: "[hnzserver] Path Traversal allowing to read any files on the server"
---
# [hnzserver] Path Traversal allowing to read any files on the server

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Node.js third-party modules | **Disclosed:** 2020-09-24

- Report: [https://hackerone.com/reports/579517](https://hackerone.com/reports/579517)
- CWE: Path Traversal
- Submitted: 2019-05-13T20:17:40.604Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report path traversal vulnerability in module "hnzserver"
It allows an attacker to read any files even system files via this path traversal vulnerability.

# Module

module name: hnzserver
version: 2.0.6
npm page: https://www.npmjs.com/package/hnzserver

## Module Description

静态服务器 means "Static server"

## Module Stats

[8] downloads in the last week
[40] downloads in the last month
[40] downloads in week 01-07 Apr

# Vulnerability

##Vulnerability Description
Path traversal attack (also known as directory traversal) aims to access files and directories that are stored outside the web root folder. By manipulating variables that reference files with “dot-dot-slash (../)” sequences and its variations or by using absolute file paths, it may be possible to access arbitrary files and directories stored on file system including application source code or configuration and critical system files.

##Steps To Reproduce:
- Install the module
```
npm install -g hnzserver
```

- Run 'hnzserver in "~/Desktop" directory :
```
root@kali:~/Desktop# hnzserver
server running is :http://localhost:8888
```
- Use cURL to access etc/passwd file:
```
$ curl --path-as-is --url 'http://127.0.0.1:8888/../../../../etc/passwd'
```
{F489679}

##Patch
User input should be properly sanitized and filtered to remove dot-dot-slash (../)” sequences and its variations in path. 

##Supporting Material/References:
- Linux kali 4.15.0-kali2-amd64
- node 10.15.3
- npm 6.9
- Firefox ESR 52.7.3 (64-bit)

##Wrap up
- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

## Impact

It could have enabled an attacker to view system files and leverage attacks like remote code execution and so on.

## Timeline

- **Report Filed**
- **2019-05-14** @h1_analyst_oceana: Hi @lightangel1412,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@magicmouse
- **Report Triaged**
- **Report Severity Updated**
- **2019-07-08** @lightangel1412: Hi @magicmouse 
It's 2 months already since i reported this vulnerability. Is there any update? 
Thank you.
- **2019-07-08** @h1_analyst_oceana: Hello @lightangel1412,

Thanks for your patience! This report has been assigned to the Node.js third-party modules team, and I will update you as soon as there is more information to share.

Regards,

@magicmouse
- **2019-12-11** @lightangel1412: Is there any update? Thank you.
- **2020-08-09** @bbe8482aecd24374d13c5de15a0a6: So far we got no response. I tried to ping the maintainer at https://github.com/allcky/u-response.css/issues/1

If there is no response after this, we'll take the next steps.
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
