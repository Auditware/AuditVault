---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-11-18
submitted: 2020-09-03T18:53:46.589Z
bounty_usd: null
votes: 78
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "ali"
source: "https://hackerone.com/reports/974271"
title: "Stored XSS on https://app.crowdsignal.com/surveys/[Survey-Id]/question - Bypass"
---
# Stored XSS on https://app.crowdsignal.com/surveys/[Survey-Id]/question - Bypass

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 78 | **Program:** Automattic | **Disclosed:** 2020-11-18

- Report: [https://hackerone.com/reports/974271](https://hackerone.com/reports/974271)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-09-03T18:53:46.589Z

## Report summary

If you want to follow me, here is my linkedin & twitter accounts:
https://twitter.com/alicanact60
https://tr.linkedin.com/in/alicanact60

@mygf

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello there,
I hope all is well!

I found a stored xss on https://app.crowdsignal.com/

Steps:
* Go to `https://app.crowdsignal.com/dashboard`
* Create a survey.
* Go to `https://app.crowdsignal.com/quizzes/{survey-id}/question`
* Add `Multiple Choice`
* Click `Add media` button.
* Select `Embed Media`
* Paste this: `[dailymotion id=x8oma9]`
* Insert it.
* Open Burp Suite and click `Save` button.
* Return to burp suite and paste xss payload to `media[11111111]` parameter: `[dailymotion id=x8oma9"><svg/onload=prompt(document.domain)>]`
* Forward the request and refresh the page. You will see xss alert.

This isn't self xss because I saw users who Team plan can invite other users to their dashboards. So attacker can steal victim's cookies.

Also I recorded a poc video for you:   
{F975177}

## Impact

Stealing cookies.

Best Regards,
@mygf

## Timeline

- **Report Filed**
- **2020-09-04** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **2020-09-04** @jgcaruso: Thanks for the submission! I've verified the issue and have deployed a fix.

Please retest and let us know how it performs.
- **2020-09-04** @ali: Hey @jgcaruso,
It was very fast! I am retesting it.

Best Regards,
@mygf
- **2020-09-04** @ali: Hello @jgcaruso,
I think it has been fixed.   
{F976301}

Best Regards,
@mygf
- **2020-09-07** @ali: Hello @jgcaruso @xknown,
Is there any update?

Best Regards,
@mygf
- **Report Triaged**
- **2020-09-07** @ali: Heelo @donncha,
Thank you! Also this is fixed. It should be Resolved.

Best Regards,
@mygf
- **Report Resolved**
- **2020-09-07** @ali: Thank you @donncha,
Can I ask is there any update about reward? Also I have 2 more reports.

Best Regards,
@mygf
- **2020-09-08** @ali: Hello @donncha,
Is there any update about bounty? You awarded me after `Resolved` before that's why I asked.

Best Regards,
@mygf
- **Bounty Awarded**
- **2020-11-18** @ali: Hey, @xknown @donncha @jgcaruso,
I hope all is well!

Can you disclose this report?

Best Regards,
@mygf
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
