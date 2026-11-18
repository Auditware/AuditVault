---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - vuln/xss-reflected
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2019-12-09
submitted: 2019-11-09T10:23:04.802Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/owox|OWOX, Inc.]]"
reporter: "imthehackerlor"
source: "https://hackerone.com/reports/733051"
title: "The URL in 'Choose a data source'' at 'https://bi.owox.com/ui/settings/connected-services/setup/' is not filtered => reflected XSS."
---
# The URL in "Choose a data source'' at "https://bi.owox.com/ui/settings/connected-services/setup/" is not filtered => reflected XSS.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** OWOX, Inc. | **Disclosed:** 2019-12-09

- Report: [https://hackerone.com/reports/733051](https://hackerone.com/reports/733051)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2019-11-09T10:23:04.802Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team,
This is another report with #732987. Because it is completely independent

Detail
--
In the process of selecting the data source at https://bi.owox.com/ui/settings/connected-services/setup/, I found a reflected XSS.
Specifically, when you click on ``Google Analytics``, a page will appear for you to enter ``Gmail``. After completing the steps, an error link will appear during the redirect (Screenshot)
███

Vulnerable area:
----
``/analytics/``
The URL will now be: https://bi.owox.com/ui/callbacks/google-supervisors/analytics%3Cimg%20src=xss%20onerror=prompt(1)%3E/?state=d159b8264eef78b11afdd016531b128c&code=4/tAFEdKitWAD6NCxUfXRT4NMTLMnzMwHeDlac-un9ecDEce9Ts2EZ6_pN-giK_3uzKVeRS9rYuAnbihIaXRFfkvE&scope=email%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/analytics%20https://www.googleapis.com/auth/analytics.edit%20https://www.googleapis.com/auth/analytics.readonlyopenid&authuser=3&session_state=c7730a7cbcf834250345c43eaa83103ec536e3a4..3ebd&prompt=consent

Tested browser
---
Firefox
Chrome

PoC
---
+ Note: I have shortened the URL to facilitate testing.

1, go to https://bi.owox.com/ui/callbacks/google-supervisors/analytics%3Cimg%20src=xss%20onerror=prompt(1)%3E/?state=d159b8264eef78b11afdd016531b128c
2, Log in and ``XSS`` will execute
██████

## Impact

>This vulnerability is aimed at all victims. Just paste this URL and login, XSS will automatically execute.
Therefore, it will have a ``high impact``, because before XSS is executed, the application will ask the user to login.
+ The attacker can execute JS code.

>Documents related to Impact
--
https://portswigger.net/web-security/cross-site-scripting/reflected
https://portswigger.net/web-security/cross-site-scripting/exploiting

Best regards,
@dat

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **2019-11-09** @imthehackerlor: Can we ``disclose`` this report in a limited way? and you can create a ``Summary`` about it.
- **Agreed On Going Public**
- **Report Became Public**
