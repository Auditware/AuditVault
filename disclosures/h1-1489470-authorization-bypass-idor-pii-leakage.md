---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2022-04-07
submitted: 2022-02-23T10:43:07.102Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "lubak"
source: "https://hackerone.com/reports/1489470"
title: "Authorization bypass -> IDOR -> PII Leakage"
---
# Authorization bypass -> IDOR -> PII Leakage

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-04-07

- Report: [https://hackerone.com/reports/1489470](https://hackerone.com/reports/1489470)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2022-02-23T10:43:07.102Z

## Timeline

- **Report Filed**
- **2022-02-23** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2022-02-23** @lubak: Dear team,
Please if possible reconsider report severity, I am referencing some disclosed by DoD reports which are related to DoD personnel PII leaks, and all of them are rated High severity:

https://hackerone.com/reports/905679
https://hackerone.com/reports/409237
https://hackerone.com/reports/905688

I'm asking you about this, because this is my first valid, non-duplicate report on HackerOne and higher severity will result in better ranking of my profile. This is extremely important for me because this will increase my chances of being invited to work on private programs.

Thank you in advance and have a great day!
Best regards,
lubak
- **2022-02-23** @agent-0g: @lubak Thank you for your submissions and for your participation in the DoD Vulnerability Disclosure Program however, we cannot and will not change the severity of reports submitted because they help your profile ranking. I'd consider that to be unethical, at best.  If you are able to expound on your POC to show that you are able to do things that would warrant a higher severity rating, we would gladly change it.
- **2022-02-23** @agent-0g: @lubak After team discussion and reconsideration, we agree that the severity of this report should be increased.
- **Report Severity Updated**
- **2022-02-23** @lubak: Hi agent-0g,
Thank you so much for your decision!
English is not my primary language so please excuse me if my first message sounded like begging for doing something unethical. It was not what I meant.

Thank you once again!
Best regards,
lubak
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
