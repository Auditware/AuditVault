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
date: 2020-01-29
submitted: 2019-03-14T15:06:55.721Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "johnssimon007"
source: "https://hackerone.com/reports/509697"
title: "[md-fileserver] Path Traversal"
---
# [md-fileserver] Path Traversal

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Node.js third-party modules | **Disclosed:** 2020-01-29

- Report: [https://hackerone.com/reports/509697](https://hackerone.com/reports/509697)
- CWE: Path Traversal
- Submitted: 2019-03-14T15:06:55.721Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report path traversal in md-fileserver modulee
It allows an attacker to read system files via path traversal through commandline


# Module

**module name:** md-fileserver
**version:** 1.3.2
**npm page:** `https://www.npmjs.com/package/md-fileserver`

## Module Description
Starts a local server to render "markdown" files within your browser:

# Vulnerability

## Vulnerability Description
Directory traversal through the url which doesn't verify the file is from the root directory path.

## Steps To Reproduce:
1.npm install -g md-fileserver

2.start the local server by typing below on commandline
$mdstart

3.now on terminal type
curl -v --path-as-is http://127.0.0.1:8080/etc/passwd

it will list all the credentials in passwd folder

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- [OPERATING SYSTEM VERSION] kali linux
- [NODEJS VERSION] 11.8.0
- [NPM VERSION] 6.5.0

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

This vulnerability allows malicious user to read content of any file on the server, which leads to data breach or other attacks.

## Timeline

- **Report Filed**
- **2019-03-14** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Title Updated**
- **Report Title Updated**
- **Report Triaged**
- **External User Joined**
- **2019-04-02** @commenthol: md-fileserver opens a local webserver in user space which is not 
accessible from outside. As being started in user space the server can
read any file the user is able to read.
If trying to access the server from an ip other than localhost or 
127.0.0.1 the request is being rejected.
The relevant lines are in lib/middlewares.js:25ff function forbiddenRemote ()
In my opinion the server can't be abused to serve content to other ips 
other than to the local user itself.
Please let me know if this statement is not true. Thanks.
- **2019-04-02** @ronperris: @commenthol 

Great point, the threat of a successful attack is very unlikely.  Someone could use a proxy to expose this functionality to clients beyond localhost.

The library does still contain a path traversal vulnerability, are you interested in fixing it?
- **2019-04-03** @johnssimon007: yah..i agree to the point of ronperris.still theres a chance of exploiting this using a proxy.its gud if you can fix it
- **2019-04-03** @commenthol: @ronperris
The path traversal is a feature of this package. It allows to use the server to build a markdown file from various included markdown files.
I will fix the things that way that per default only files under the users home directory can be obtained through the server.
- **2019-04-07** @commenthol: There is a new version 1.4.0 published, which should fix the problem described. I changed my mind and withdraw then initial approach of limiting to a users home dir. With this any other person having remote access would still be able to access the others users files.
The local server now uses a session token which is updated each day. The session token is 20 chars long and is granted only to the user having started the server. 
In my opinion this should prevent any remote access to local files either per proxy or other users with local access.
Please let me know your opinion. Thanks for rising this issue.
- **2019-05-03** @johnssimon007: Can we close this issue as resolved @ronperris
- **2019-05-13** @commenthol: @ronperris can this issue be closed? It is fixed since v1.4.0.
- **2019-12-29** @johnssimon007: can we close this as solved ,since its been a long time .
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
