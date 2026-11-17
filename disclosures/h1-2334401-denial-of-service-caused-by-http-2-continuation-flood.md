---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
date: 2024-04-22
submitted: 2024-01-25T12:51:51.084Z
bounty_usd: 4860
votes: 42
cve: "CVE-2024-24549"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "bart"
source: "https://hackerone.com/reports/2334401"
title: "Denial of Service caused by HTTP/2 CONTINUATION Flood"
---
# Denial of Service caused by HTTP/2 CONTINUATION Flood

> **Severity:** High | **Bounty:** 4,860 USD | **Votes:** 42 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-04-22

- Report: [https://hackerone.com/reports/2334401](https://hackerone.com/reports/2334401)
- CWE: Uncontrolled Resource Consumption | CVE: CVE-2024-24549
- Submitted: 2024-01-25T12:51:51.084Z

## Report summary

CVE-2024-24549 Apache Tomcat - Denial of Service
Severity: Important

Vendor: The Apache Software Foundation

Versions Affected:
Apache Tomcat 11.0.0-M1 to 11.0.0-M16
Apache Tomcat 10.1.0-M1 to 10.1.18
Apache Tomcat 9.0.0-M1 to 9.0.85
Apache Tomcat 8.5.0 to 8.5.98

Description:
When processing an HTTP/2 request, if the request exceeded any of the
configured limits for headers, the associated HTTP/2 stream was not
reset until after all of the headers had been processed.

Mitigation:
Users of the affected versions should apply one of the following
mitigations:
- Upgrade to Apache Tomcat 11.0.0-M17 or later
- Upgrade to Apache Tomcat 10.1.19 or later
- Upgrade to Apache Tomcat 9.0.86 or later
- Upgrade to Apache Tomcat 8.5.99 or later

Credit:
This vulnerability was reported responsibly to the Tomcat security team
by Bartek Nowotarski (https://nowotarski.info/).

Full Security Advisory: https://lists.apache.org/thread/4c50rmomhbbsdgfjsgwlb51xdwfjdcvg

## Timeline

- **Report Filed**
- **Report Triaged**
- **2024-01-26** @bart: Thanks for quick response. All I know is response from Tomcat team below. It was confirmed yesterday.

> We have reviewed your report and we agree that there is a DoS
vulnerability here.
>
>We have allocated CVE-2024-24549.
>
>We are evaluating a fix and expect to include the fix in the February
release round.
- **2024-01-26** @kunderkoffler: Got it! Thank you for the additional notes. This will be eligible for payout when the team releases the CVE details and a security advisory! To keep us on top of things, please attach the security advisory to the report when the team releases it.

Looking forward to getting this rewarded for you.
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Nmi Reminder Comment**
- **Nmi Reminder Comment**
- **Report New**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
