---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/node
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2018-07-18
submitted: 2018-05-08T19:20:45.876Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "misterch0c"
source: "https://hackerone.com/reports/349146"
title: "Stored XSS in Node-Red"
---
# Stored XSS in Node-Red

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js third-party modules | **Disclosed:** 2018-07-18

- Report: [https://hackerone.com/reports/349146](https://hackerone.com/reports/349146)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-05-08T19:20:45.876Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a stored XSS in node-red
It allows to execute javascript in the user's browser

# Module

**module name:** node-red
**version:** v0.18.4
**npm page:** `https://www.npmjs.com/package/node-red`

## Module Description

> A visual tool for wiring the Internet of Things.

## Module Stats

1,758 downloads in the last day
10,601 downloads in the last week
40,000+ downloads in the last month

# Vulnerability
## Steps To Reproduce:

* Install the module

`sudo npm install -g --unsafe-perm node-red`

* Run it
`node-red`
then access it in http://localhost:1880

* Exploit
The same payload can be applied in different locations.
Payload: `<script>alert('xss')</script>`
Places where you can put the payload:
Drag & drop any item from the left menu to the center then put the payload in the `name` field. After clicking "done", the xss is triggered. At this point it's only triggered in your browser.
Click the "deploy" button, now any user that will browse to  http://localhost:1880 will have the javascript executed.
Second one:
Click the "+" button on the top right to create a new "flaw". Put the payload in the name field. Again you need to press "deploy". After that double clicking on the "flaw" will execute the javascript.

## Supporting Material/References:

- Archlinux
- NodeJS 9.4.0
- NPM 5.6.0
- Firefox 57.0.4 & Chromium 64.0.3282.119
- node-red v0.18.4

# Wrap up

- I contacted the maintainer to let them know: N 
- I opened an issue in the related repository: N

¯\_(ツ)_/¯

## Impact

It allows executing malicious javascript code in the user's browser

The hacker selected the **Cross-site Scripting (XSS) - Stored** weakness. This vulnerability type requires contextual information from the hacker. They provided the following answers:

**URL**
http://localhost:1880

**Verified**
Yes

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **2018-05-11** @knolleary: Thanks for the issue report. I have just pushed a fix for this issue: https://github.com/node-red/node-red/commit/d49c7a3adb19b6f9a834135741572331702f23a8 - and also identified a couple of other places where a similar behaviour was exposed.

Whilst there, I have gone through and removed all unnecessary uses of jquery's `.html()` function where the safer `.text()` will do. Almost all of those were benign, but best to be sure.

The fix will be available in the next maintenance release.
- **2018-05-11** @misterch0c: That was fast @knolleary (:
Thank you
- **2018-05-11** @marcinhoppe: Thanks @knolleary! When do you expect to have the maintenance release?

@misterch0c @knolleary Do you both agree we can disclose this vulnerability right after the release with the fix is out?
- **2018-05-12** @knolleary: We'll do a release in the next week - we only just published one on Thursday. Happy for you to disclose we we've published.
- **2018-05-12** @misterch0c: Ok for me too. 

Cheers
- **2018-05-12** @marcinhoppe: Great! We will disclose this when the patch has been released.
- **2018-05-28** @marcinhoppe: @knolleary Can you confirm that 0.18.7 contains fixes the issues mentioned in this report?
- **2018-05-31** @knolleary: Apologies for the delay in responding - the 0.18.6 release, published on May 18th, addressed this issue.
- **2018-07-04** @marcinhoppe: @knolleary @misterch0c Thanks! Do you both agree we are good to disclose this vulnerability now?
- **2018-07-06** @misterch0c: Yes
- **2018-07-18** @marcinhoppe: @misterch0c Thanks! I will proceed with the disclosure now.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
