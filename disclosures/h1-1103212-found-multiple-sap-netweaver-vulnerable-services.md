---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "duplicate"
weakness: null
enriched: true
body: true
date: 2021-02-16
submitted: 2021-02-14T14:49:11.664Z
bounty_usd: null
votes: 2
cve: "CVE-2020-6286", "CVE-2020-6287"
program: "[[programs/acronis|Acronis]]"
reporter: "ganofins"
source: "https://hackerone.com/reports/1103212"
title: "Found multiple SAP NetWeaver vulnerable services"
---
# Found multiple SAP NetWeaver vulnerable services

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Acronis | **Disclosed:** 2021-02-16

- Report: [https://hackerone.com/reports/1103212](https://hackerone.com/reports/1103212)
- CWE: N/A | CVE: CVE-2020-6286, CVE-2020-6287
- Submitted: 2021-02-14T14:49:11.664Z

## Report summary

The report is not applicable since redapi.acronis.com and redapi2.acronis.com are internally developed systems not related to SAP NetWeaver.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Summary:
Hello Team,
I found two (**redapi.acronis.com** and **redapi2.acronis.com**) sap Netweaver vulnerable services. They do not perform an authentication check which allows an attacker without prior authentication to execute configuration tasks to perform critical actions against the SAP Java system, including the ability to create an administrative user, and therefore compromising Confidentiality, Integrity, and Availability of the system, leading to Missing Authentication Check.

# Steps To Reproduce:
  1. Run the script {F1195428}
  2. You will see random user created

# POC:
Just for the POC, I have created a random user with creds
sapRpoc9049:Secure!PwD6751 (at redapi.acronis.com)
{F1195413}

# References:
https://github.com/chipik/SAP_RECON
https://nvd.nist.gov/vuln/detail/CVE-2020-6286
https://nvd.nist.gov/vuln/detail/CVE-2020-6287
https://launchpad.support.sap.com/#/notes/2934135
https://launchpad.support.sap.com/#/notes/2939665

**Please lemme know if you need any additional information reagarding this**

## Impact

# Impact:
This version of SAP netweaver does not perform an authentication check which allows an attacker without prior authentication to execute configuration tasks to perform critical actions against the SAP Java system, including the ability to create an administrative user, and therefore compromising Confidentiality, Integrity, and Availability of the system, leading to Missing Authentication Check.

## Timeline

- **Report Filed**
- **2021-02-14** @security-bot: Hi @ganofins

Thanks for participating in Acronis bug bounty program!
Our security team usually replies within 1-2 business days.

Meanwhile, I'd recommend you to check out our [policy](https://hackerone.com/acronis).
- **Report Duplicate**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
