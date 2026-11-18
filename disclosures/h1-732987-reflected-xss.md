---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2019-12-09
submitted: 2019-11-09T07:09:03.393Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/owox|OWOX, Inc.]]"
reporter: "imthehackerlor"
source: "https://hackerone.com/reports/732987"
title: "Reflected XSS "
---
# Reflected XSS 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 20 | **Program:** OWOX, Inc. | **Disclosed:** 2019-12-09

- Report: [https://hackerone.com/reports/732987](https://hackerone.com/reports/732987)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2019-11-09T07:09:03.393Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team,

I have found an XSS at https://bi.owox.com/ui/6177527534dc114eb07fa829e4ce4d28/dashboard/?trial=activated
Because the input is not properly filtered, resulting in XSS being executed
Vulnerable area: 
-----
``6177527534dc114eb07fa829e4ce4d28``
The URL will now be: https://bi.owox.com/ui/6177527534dc114eb07fa829e4ce4d28%3Cimg%20src=xss%20onerror=prompt('XSS')%3E/dashboard/?trial=activated

PoC
---
1, go to https://bi.owox.com/ui/6177527534dc114eb07fa829e4ce4d28%3Cimg%20src=xss%20onerror=prompt('XSS')%3E/dashboard/?trial=activated
2, Log in and ``XSS`` will execute
██████████

Tested browser
---
Firefox 
Chrome

## Impact

This vulnerability is aimed at all victims and they do not need to be involved in the ``Project``. Just paste this URL and login, XSS will automatically execute.
Therefore, it will have a ``high impact``, because before XSS is executed, the application will ask the user to login.
+ The attacker can execute JS code.
████████
████████

Documents related to ``Impact``
---
https://portswigger.net/web-security/cross-site-scripting/reflected
https://portswigger.net/web-security/cross-site-scripting/exploiting

Recommendation
----
+ Revisit the entire application and validate the user input at server side.
+ Sanitize the data collected from input fields before further processing.
+ Filter out special and meta-characters from user input.

Best regards,
@dat

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **2019-11-09** @imthehackerlor: Tomorrow is my birthday 
This is probably a report of great significance to me :D

Thank you and regards
- **Agreed On Going Public**
- **2019-11-09** @imthehackerlor: Can we ``disclose`` this report in a limited way? and you can create a ``Summary`` about it.
- **Report Became Public**
