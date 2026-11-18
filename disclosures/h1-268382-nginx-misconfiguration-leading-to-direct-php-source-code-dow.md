---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - stack/nginx
  - stack/php
  - vuln/misconfiguration
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2019-07-29
submitted: 2017-09-14T15:44:38.882Z
bounty_usd: null
votes: 145
cve: []
program: "[[programs/gsa_bbp|GSA Bounty]]"
reporter: "tolo7010"
source: "https://hackerone.com/reports/268382"
title: "Nginx misconfiguration leading to direct PHP source code download"
---
# Nginx misconfiguration leading to direct PHP source code download

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 145 | **Program:** GSA Bounty | **Disclosed:** 2019-07-29

- Report: [https://hackerone.com/reports/268382](https://hackerone.com/reports/268382)
- CWE: Information Disclosure
- Submitted: 2017-09-14T15:44:38.882Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Poc:
https://www.data.gov/app/plugins/saml-20-single-sign-on/saml/config/config.php

## Timeline

- **Report Filed**
- **2017-09-14** @joystick: Hi,

Thank you for your submission. We are investigating your report, and will let you know if we have any questions. We appreciate your assistance and cooperation. 

Regards.
- **2017-09-14** @tolo7010: Description:
========
data.gov uses nginx as the web server. Due to the server misconfiguration, instead of processing the file, the .php source code is send to the client requesting from the direct url.

Impact:
=====
attacker can download any .php file on the web leading to huge information about the server. data.gov implement saml (open-source), the config.php file in the saml config folder can be downloaded by the direct url request, it contains sensitive information such as: auth.adminpassword, tecnical contact email, and (possibly) database password.

Problem Analysis:
===========
- all the .php files with no closing tag ?> are affected.

Recommendation:
============
- review nginx configuration
- **Report Triaged**
- **2017-09-14** @jj-tts-tech-portfolio: Thank you for your report, the Data.gov is actively investigating. We hope to provide an updated status as soon as we can.
- **2017-09-14** @jj-tts-tech-portfolio: @tolo7010 thank you for your valid report! Can you verify a fix in https://github.com/GSA/datagov-deploy/pull/236 ? Thanks again
- **2017-09-14** @tolo7010: @jjediny the reproduction doesn't work anymore, fixed confirmed.

Regards,
Tolo
- **2017-09-14** @jj-tts-tech-portfolio: The data.gov team managing triage is separate from bounty team, that said we'd agree with that
- **2017-09-20** @kvuppala: Nginx misconfiguration was affecting only files within https://www.data.gov/app/plugins/saml-20-single-sign-on/ WordPress plugin.
The only place that `auth.adminpassword` could be used is web panel https://www.data.gov/app/plugins/saml-20-single-sign-on/saml/www/ which was never available due to same misconfiguration. After the fix it's returning `403 Access Denied`. All the configuration is done on WordPress Admin side so that `saml/www/` panel is not used at all
- **Bounty Awarded**
- **Report Resolved**
- **2017-09-20** @tolo7010: Thanks for my first bounty rewarded! it encourages me alot.

Regards.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
