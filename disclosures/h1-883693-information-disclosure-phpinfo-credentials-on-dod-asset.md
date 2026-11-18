---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2021-03-11
submitted: 2020-05-27T14:45:20.010Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "atbabers"
source: "https://hackerone.com/reports/883693"
title: "Information Disclosure(PHPINFO/Credentials) on DoD Asset"
---
# Information Disclosure(PHPINFO/Credentials) on DoD Asset

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 6 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-03-11

- Report: [https://hackerone.com/reports/883693](https://hackerone.com/reports/883693)
- CWE: Information Disclosure
- Submitted: 2020-05-27T14:45:20.010Z

## Report summary

A Department of Defense(DoD) asset leaked the systems' PHPInfo page which contained sensitive information such as Active Directory credentials. This may have led to System Compromise. The DoD Representatives were responsive and thorough when handling my report.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
A DoD leaks credentials on a phpinfo() page.

**Description:**
https://███ publicly displays a phpinfo() page that leaks system information and credentials.

## Impact
The impact is medium not only due to information leakage of numerous different details such as system information but also the leakage of domain credentials.
USERDOMAIN	███████
USERNAME	██████
█████████PASSWORD']	████████

## Step-by-step Reproduction Instructions

1. Visit: https://████/████
2. Information Disclosed

## Suggested Mitigation/Remediation Actions
████████ BAT  suggests removing the ███ page or requiring authentication before making it accessible.

## Impact

The impact is medium not only due to information leakage of numerous different details such as system information but also the leakage of domain credentials.

## Timeline

- **Report Filed**
- **2020-05-27** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-05-27** @atbabers: I would like to apologize on the severity and "weakness" selected when reporting. Unfortunately, I had another report written and removed the writeup to present this one instead per request of my lead. I'll be sure to be more careful in the future.
- **Report Vulnerability Types Updated**
- **2020-05-27** @agent-l8: @atbabers no worries, I just put it to regular information disclosure. Thanks!
- **2020-06-18** @atbabers: This seems to be resolved! Can we disclose this with just my Hacker Summary?
- **2020-06-18** @agentt2: @atbabers   
Once we receive confirmation from the system owners and perform our revalidation, we will resolve your report.  VDP will also coordinate to determine if this report will be disclosed. Thanks

VDP
- **2020-06-18** @atbabers: Thank you for the quick and detailed response! Have a blessed day.
- **2020-06-18** @agentt2: @atbabers 

No problem.  Just be sure you request the full disclosure on your end once you received notification that your report has been resloved.  Thanks 

VDP
- **2020-08-26** @atbabers: Any updates to this report?
- **2020-08-26** @agent-l8: @atbabers apologies, but we cannot resolve until the system owner confirms all fixes. Sometimes this involves more than just the immediate fix at hand which is the time difference. As soon as they let us know, we will resolve and you can disclose. Appreciate the patience!
- **2021-02-26** @atbabers: Any update to this being marked as resolved?
- **2021-02-26** @agent-j5: We still have not heard back from the system owner.  As soon as we do we will update the ticket.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
