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
date: 2019-06-24
submitted: 2019-05-07T08:29:07.633Z
bounty_usd: null
votes: 8
cve: "CVE-2019-5444"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "toannc123"
source: "https://hackerone.com/reports/569966"
title: "[serve-here.js] List any file in the folder by using path traversal."
---
# [serve-here.js] List any file in the folder by using path traversal.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2019-06-24

- Report: [https://hackerone.com/reports/569966](https://hackerone.com/reports/569966)
- CWE: Path Traversal | CVE: CVE-2019-5444
- Submitted: 2019-05-07T08:29:07.633Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report Path Traversal in **serve-here.js**. It allows to list any file in another folder of web root.

# Module

**module name:** serve-here.js
**version:** 1.1.3
**npm page:** `https://www.npmjs.com/package/serve-here.js`

## Module Description

Serve static files over HTTP

# Vulnerability

## Vulnerability Description

serve-here.js is simply get the path name of url and add it to the web root. it means if you input ../, it will happy add it to web root and you can list the folder you choose. But the trick is web browser or curl are also to try rebuild the url containing ../. I used the burp to make a raw url and send it to server.

## Steps To Reproduce:

install `serve-here.js`
`$ npm install serve-here.js -g`

start program
`$ serve-here

start burpsuite and enter the url contain ../. you should see the files in the folder.
{F485810}

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



**Note:** This is the module `serve-here.js` not the module `serve-here`

## Impact

This vulnerability allows malicious user to list file in the folder. This might expose vectors to attack system with Remote Code Execution, reveals files with usernames and passwords and many other possibilities.

## Timeline

- **Report Filed**
- **2019-05-07** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2019-05-10** @beagle: Hi @toannc123,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@beagle
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Triaged**
- **External User Joined**
- **2019-06-18** @christopy: Hi, I'm working in a solution for this issue right now. Just making a few tests.
- **2019-06-18** @christopy: A fix has been published.
- **2019-06-18** @toannc123: Hi @christopy,
I confirm that it is fixed.

So can I request a CVE bro?

Thank you so much,
@toannc123
- **2019-06-18** @christopy: yes, @toannc123 

you can request a CVE

thanks,
Chris
- **2019-06-18** @toannc123: Hi @christopy,

So if you mind to help me to request the CVE ID, bro?

Thank you so much,
@toannc123
- **2019-06-18** @christopy: Hi, @toannc123 ,

I'd like to help but I don't know how to do this part
- **2019-06-18** @toannc123: Hi @christopy,

Thank you so much bro :D

@toannc123
- **2019-06-18** @toannc123: Hi @beagle,

Can you help me to request a CVE bro,

Thank you so much,
@toannc123
- **2019-06-20** @toannc123: Hi @christopy,

So now you can closed this report as Resolved bro.

Thank you so much,
@toannc123
- **2019-06-24** @marcinhoppe: Thanks @toannc123. I will request a disclosure.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **2019-06-24** @toannc123: Thank you so much @marcinhoppe
