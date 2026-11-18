---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "informative"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2021-12-04
submitted: 2021-12-04T09:27:44.939Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/paragonie|Paragon Initiative Enterprises]]"
reporter: "aif_lill"
source: "https://hackerone.com/reports/1416665"
title: "Recaptcha Secret key Leaked"
---
# Recaptcha Secret key Leaked

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Paragon Initiative Enterprises | **Disclosed:** 2021-12-04

- Report: [https://hackerone.com/reports/1416665](https://hackerone.com/reports/1416665)
- CWE: Information Disclosure
- Submitted: 2021-12-04T09:27:44.939Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Greeting from @kashifinfo90,

I hope **Paragonie Security Team** is doing great, Following **Secret Keys** are leaked:
> "secret-key": "6Ldy5BYTAAAAAPBh868BMm2nGZelOUyXJHTUE4no",
   "site-key": "6Ldy5BYTAAAAACk3Tj8wDUBLcVxSL2JXFBw-Dtj3"
  "secret-key": "6Ld27iETAAAAAF6tsd5SaoCgc5cFX-tkfHqx7FtX",
  "site-key": "6Ld27iETAAAAAI51EVcu0nBw2wkxQiZxg1zGv2uI"

##Steps To Reproduce:
To find the leak please [Click Here](https://github.com/paragonie/airship/commit/037c03db5621409103f45b2f6dc6da8ae8f12ee6#diff-2f87b6e210a2b88cc43a283065ab08a53ead3159288cb52b94a17509b7ece910)

## Impact

To avoid any legal issue i didn't try anything with these key, hence it up to you to fully investigate them and figure out if they have any security impact.
Note: If it is out of scope or your figure out that the security impact is un considerable please  allow me to selfclose it, It will prevent decrease in my current reputation points.

kind Regards,
@kashifinfo90.

## Timeline

- **Report Filed**
- **Report Informative**
- **Agreed On Going Public**
- **Manually Disclosed**
