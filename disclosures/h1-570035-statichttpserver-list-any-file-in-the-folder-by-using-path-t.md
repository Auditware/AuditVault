---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2019-08-25
submitted: 2019-05-07T08:52:48.264Z
bounty_usd: null
votes: 5
cve: "CVE-2019-5480"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "toannc123"
source: "https://hackerone.com/reports/570035"
title: "[statichttpserver] List any file in the folder by using path traversal."
---
# [statichttpserver] List any file in the folder by using path traversal.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Node.js third-party modules | **Disclosed:** 2019-08-25

- Report: [https://hackerone.com/reports/570035](https://hackerone.com/reports/570035)
- CWE: Path Traversal | CVE: CVE-2019-5480
- Submitted: 2019-05-07T08:52:48.264Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Path Traversal in statichttpserver. It allows to list any file in another folder of web root.

# Module

**module name:** statichttpserver
**version:** 0.9.7
**npm page:** https://www.npmjs.com/package/statichttpserver

## Module Description

'statichttpserver' is inspired by SimpleHTTPServer.py and is intended to be a fast and easy to use static file server.

# Vulnerability

## Vulnerability Description

statichttpserver is simply get the path name of url and add it to the web root. it means if you input ../, it will happy add it to web root and you can list the folder you choose. But the trick is web browser or curl are also to try rebuild the url containing ../. I used the burp to make a raw url and send it to server.

## Steps To Reproduce:

install `statichttpserver`
`$ npm install -g statichttpserver`

start program
`$ StaticHTTPServer --ip 192.168.220.132`

start burpsuite and enter the url contain ../. you should see the files in the folder.
{F485830}

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
- **Report Triaged**
- **External User Joined**
- **2019-07-02** @jwbenson: Sure, happy to look at not allowing parent directory traversal.  Note: I can only duplicate this bug as root or with elevated permissions.
- **2019-07-02** @toannc123: Hi @jwbenson,

With this bug you can go to parent folder of the web source code.
E.x: you are in the folder `http://abc.com/xxx/yyy/` and you can list all the files and folders in the folder `http://abc.com/xxx/`

Or you can go to some world wide folder of the sever such as `/tmp/`

With 2 of examples above, you do not need a highest permission, you only need the web service user permisson.
Thank you so much,
@toannc123
- **2019-07-04** @toannc123: Hi @jwbenson,

I can verify that I can be allowed to parent directory traversal.

1. First I run the server with the path `/var/www/html`
{F521780}

2. Then I access to the webpage, and it lists all the files in the folder `/var/www/html`
{F521779}

3. Then I escape to the folder `/etc` and list all the files and folders in the `/etc`
{F521781}

Thank you,
@toannc123
- **2019-07-16** @toannc123: Hi @jwbenson,

Do you have any update for the report?
- **2019-07-26** @marcinhoppe: @jwbenson I will proceed with the public disclosure of this with the standard grace period, this should leave time for releasing a fix if that is still the plan.
- **Report Resolved**
- **Agreed On Going Public**
- **2019-07-26** @toannc123: Hi @marcinhoppe,
Thank you so much for your response.
So can I have a CVE bro?
@toannc123
- **2019-07-26** @marcinhoppe: @toannc123 Yes, I will request it when the grace period elapses and the report goes public. Thanks for a good report!
- **2019-07-26** @toannc123: Thank you so much @marcinhoppe
- **Report Became Public**
- **2019-08-30** @toannc123: Hi @marcinhoppe,

How about the CVE request procedure, guy?

Thank you so much,
@toannc123
- **2019-08-30** @marcinhoppe: The report is now public and I will request a CVE.
- **2019-08-30** @toannc123: thank you @marcinhoppe
