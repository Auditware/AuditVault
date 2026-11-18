---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
  - vuln/command-injection
  - vuln/file-upload
  - impact/rce
  - impact/unauthorized-write
  - fix/patch-upstream
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2018-08-12
submitted: 2018-06-05T16:01:18.154Z
bounty_usd: null
votes: 5
cve: "CVE-2018-1002203"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "danny_grander"
source: "https://hackerone.com/reports/362119"
title: "Arbitrary File Write through archive extraction"
---
# Arbitrary File Write through archive extraction

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2018-08-12

- Report: [https://hackerone.com/reports/362119](https://hackerone.com/reports/362119)
- CWE: Path Traversal | CVE: CVE-2018-1002203
- Submitted: 2018-06-05T16:01:18.154Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report arbitrary file write vulnerability in adm-zip module
It allows attackers to write arbitrary files when a malicious archive is extracted.
More info here: 
https://snyk.io/research/zip-slip-vulnerability
https://github.com/snyk/zip-slip-vulnerability#affected-libraries


# Module

**module name:** unzipper
**version:** <0.8.13
**npm page:** `https://www.npmjs.com/package/unzipper`

## Module Description
This is a fork of node-unzip which has not been maintained in a while. This fork addresses the following issues:
* finish/close events are not always triggered, particular when the input stream is slower than the receivers
* Any files are buffered into memory before passing on to entry


## Module Stats

80k downloads in the last week

# Vulnerability

## Vulnerability Description
The vulnerability is a form of directory traversal that can be exploited by extracting files from an archive. The premise of the directory traversal vulnerability is that an attacker can gain access to parts of the file system outside of the target folder in which they should reside. The attacker can then overwrite executable files and either invoke them remotely or wait for the system or user to call them, thus achieving remote command execution on the victim’s machine. The vulnerability can also cause damage by overwriting configuration files or other sensitive resources, and can be exploited on both client (user) machines and servers.

More info here: 
https://snyk.io/research/zip-slip-vulnerability
https://github.com/snyk/zip-slip-vulnerability


## Steps To Reproduce:

Sample files can be found here: https://github.com/snyk/zip-slip-vulnerability/tree/master/archives


## Patch

Vulnerability is already fixed in ver 0.8.13
We opened a fix PR on 16th of April, https://github.com/ZJONSSON/node-unzipper/pull/59

CVE id for the vuln was assigned: CVE-2018-1002203

## Supporting Material/References:

There are multiple libraries affected, across different ecosystems. 
Full list here: https://github.com/snyk/zip-slip-vulnerability#affected-libraries

https://snyk.io/research/zip-slip-vulnerability
https://github.com/snyk/zip-slip-vulnerability

# Wrap up

- I contacted the maintainer to let them know: Y, and helped fix the issue
- I opened an issue in the related repository: N

## Impact

Arbitrary file write

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-07-02** @vdeturckheim: Will PR to our DB.
Thanks a lot @danny_grander
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
