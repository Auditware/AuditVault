---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
  - vuln/dos
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2020-02-28
submitted: 2020-02-25T17:51:30.156Z
bounty_usd: null
votes: 11
cve: "CVE-2020-8136"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "mcollina"
source: "https://hackerone.com/reports/804772"
title: "Prototype pollution in multipart parsing"
---
# Prototype pollution in multipart parsing

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 11 | **Program:** Node.js third-party modules | **Disclosed:** 2020-02-28

- Report: [https://hackerone.com/reports/804772](https://hackerone.com/reports/804772)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2020-8136
- Submitted: 2020-02-25T17:51:30.156Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a prototype pollution attack in fastify-multipart it allows to crash a remote server parsing multipart requests by sending a specially crafted request.

# Module

**module name:** fastify-multipart
**version:** all versions before < v1.0.5. v1.0.5 contains the fix. 
**npm page:** `https://www.npmjs.com/package/fastify-multipart`

## Module Description

[Fastify](https://www.fastify.io) plugin to parse the multipart content-type.

Under the hood it uses [busboy](http://npm.im/busboy).

## Module Stats

weekly downloads: 4900

# Vulnerability

## Vulnerability Description

Eran Hammer found this vulnerability for Hapi, he tested Fastify as well and found it vulnerable.
Here is the Hapi vulnerability report: https://www.npmjs.com/advisories/1479. 

## Steps To Reproduce:

> Detailed steps to reproduce with all required references/steps/commands. If there is any exploit code or reference to the package source code this is the place where it should be put.

## Patch

This was already released in https://github.com/fastify/fastify-multipart/pull/116 and version 1.0.5 issued.

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: Y
- I opened an issue in the related repository: N

I just need a CVE issued.

## Impact

It's a Denial of Service attack

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
