---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2021-02-18
submitted: 2021-01-24T08:01:48.742Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "nidens"
source: "https://hackerone.com/reports/1085782"
title: "█████████ IDOR leads to disclosure of PHI/PII"
---
# █████████ IDOR leads to disclosure of PHI/PII

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 30 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-02-18

- Report: [https://hackerone.com/reports/1085782](https://hackerone.com/reports/1085782)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2021-01-24T08:01:48.742Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
████ is designed in a way where there is a vulnerable endpoint that allows a non-medical user to view the ██████████ records of people who are not ████████s of the sponsor. 

**Description:**
I am currently an Active Duty Airman and this vulnerability does require CAC authentication. When browsing the ██████ website with a proxy I noticed that there is a function that allows sponsors (in this case me) to view their █████s shot records in PDF form. After viewing my ██████████'s shot records, I noticed this functionality lives on the following endpoint `https://████=[id]`.  If you increment or decrement the `██████` parameter by 1 the application will throw an HTTP Status Code 302 and redirect you back to the `██████████` endpoint which is a good security practice. The issue with this is, that with the 302 redirect the PDF of the incremented ID will be attached in the body of the 302 requests, you are able to extract this when using a proxy like Burp Suite. Obviously, this is concerning because this would allow a user to pull any shot record without being associated with medical. 

## Step-by-step Reproduction Instructions
### I have redacted the screenshots as best as possible. The screenshots are of my information, the example for validation.

1. Navigate to ████/█████ and login with CAC
2.  Once you are authenticated browse to this endpoint, https://███████=█████████ and you should be redirected to `█████` but the 302 redirect will have the PDF information of my daughter (no actual ██████████ information is loaded).
3. On the 302 redirects, you can utilize the function `Copy to File` in burp suite to save this request as a pdf and you will have a PDF version of my ██████ shot record. 

Please review the attached screenshot, I did not pull use my █████ information for this screenshot because I have authorized to view her information. This request shows me decrementing the `██████` by 1 and showing the PDF is attached to the 302 redirects. 
██████


## Suggested Mitigation/Remediation Actions
Enforce the same permissions that are used for the `██████████` and `████` functions of the application. 

I am more than willing to speak with the developers about this if they want to e-mail my NIPR email. I took care to not go any further than just validating that the vulnerability exists and immediately stopped and started to write this report.

## Impact

PHI/PII disclosure which includes, ████████

## Timeline

- **Report Filed**
- **2021-01-24** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

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
- **2021-01-25** @agent-0g: @nidens Thanks for the POC video. Thats exactly what we needed. Great find!
- **2021-01-26** @nidens: Good Evening, 

Just for personal clarification, is there a reason this isn't a critical vulnerability? I am guessing since this is post-Auth /w CAC is the rationale for the high vs critical distinction. In the end, as long as the criticality level sufficiently drives actions at the AO level I am cool with whatever level of triage the vulnerability is given.
- **Report Severity Updated**
- **2021-01-26** @agent-l8: @nidens we did go ahead and push to critical, you are right a little bit less of an issue w/CAC, but main issue still remains. Thanks!
- **2021-01-28** @agent-l8: @nidens- based on this report you have been selected as our researcher of the month. How would you like to be addressed and do you have a twitter handle you would like us to use in the twitter post?
- **2021-01-28** @nidens: Cool!!! Johnathan Miranda is fine and my twitter is @niden_sh
- **Report Needs More Info**
- **Report New**
- **Report Resolved**
- **2021-02-12** @nidens: How do we feel about disclosing this? I am cool with it, but I know there is a process.
- **Agreed On Going Public**
- **Manually Disclosed**
- **Comments Closed**
- **2021-08-02** @agent-bk1: As a previous winner of Researcher of the Month we'd like to ask some questions to give you a voice in the program. If you have time we'd love your input. Thank you.

1.      Are you happy with the current point system of DoD VDP (7 points for
triage, 2 points for duplicate)?
2.      Are there any recommendations or suggestions you have for the
Researcher of the Month tweet?
3.      Are there any items in our policy that should be better defined for
participants?
4.      As an award winner, would you like to be interviewed and tell the
story of how you got into Vulnerability Disclosures and Bug Bounties?
5.      Did you use this program to "practice" before moving on to another?
6.      Are you happy with the level of communication you get from the
validators?
7.      It's been communicated that the researchers would like educational
opportunities with regards to the program, what types of opportunities would
you implement?
8.      What is the one thing you like most about our program?
9.      What is the one thing you like least about our program?
