---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
date: 2024-12-18
submitted: 2024-08-12T16:16:05.666Z
bounty_usd: null
votes: 47
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "prakhar0x01"
source: "https://hackerone.com/reports/2652603"
title: "CSRF Attack on changing security questions leads to full Account TakeOver"
---
# CSRF Attack on changing security questions leads to full Account TakeOver

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 47 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-12-18

- Report: [https://hackerone.com/reports/2652603](https://hackerone.com/reports/2652603)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2024-08-12T16:16:05.666Z

## Timeline

- **Report Filed**
- **2024-08-12** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **2024-08-13** @prakhar0x01: Hi @agent-p1 

Thanks for verifying & triaging this report.

I'm little uncertain about the severity because the vulnerability leads to a full account takeover.It should be Critical.

Reports with the same issue have been submitted to the DoD in the past, and they were marked as **Critical**.

> **Eg. https://hackerone.com/reports/1018270**

Could you please clarify about the severity?
- **2024-08-13** @agent-p1: Greetings,

Based on the CVSS calculation the vulnerability came out to a High severity. The past report that was referenced was triaged in 2020 and may not have used the CVSS calculator to provide the severity. for this reason we stand by our decision of this being maintained at High. 

CVSS:3.0/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H/CR:X/IR:X/AR:X

Regards,
The VDP Team
- **2024-08-13** @prakhar0x01: @agent-p1 

Alright, thanks for the clarification. Agreed.

Regards,
@prakhar0x01
- **2024-08-29** @prakhar0x01: Hii @agent-p1,

- I reproduced the issue and it seems to be fixed now.

**They've implemented the CSRF token on the `Changing Security Question` feature.**

### SECURED REQUEST

```
POST /member/updatesecurityquestions HTTP/2
Host: www.█████
Cookie: {SESSION}
Content-Length: 214
...snip...
Accept-Language: en-US,en;q=0.9

csrf_token=e2509a6dcf64d5a24ef2c2e8204377b8&security_questions1=1&security_question_answer1=test&security_questions2=1&security_question_answer2=test&security_questions3=1&security_question_answer3=test&submit=Save
```

> **I am unable to replicate the vulnerability anymore. You can close this report as Resolved.** 

███████

Regards,
@prakhar0x01
- **Report Resolved**
- **Agreed On Going Public**
- **2024-10-27** @prakhar0x01: Hii @agent-p1 

Are there any updates on disclosure?

Thanks,
@prakhar0x01
- **2024-12-18** @ag3nt-kp1: @prakhar0x01 We are completing the disclosure today.  We try to do these monthly, so our apologies for the delay. 

Thank you, 
VPD Team
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
