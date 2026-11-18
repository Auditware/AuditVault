---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/privilege-escalation
  - env/web
  - vuln/xss
  - vuln/subdomain-takeover
  - impact/account-takeover
  - trigger/social-engineering
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2021-09-09
submitted: 2020-06-06T11:28:54.726Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "simplyrishabh"
source: "https://hackerone.com/reports/892667"
title: "Subdomain takeover of ███"
---
# Subdomain takeover of ███

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 5 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2021-09-09

- Report: [https://hackerone.com/reports/892667](https://hackerone.com/reports/892667)
- CWE: Privilege Escalation
- Submitted: 2020-06-06T11:28:54.726Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Summary:
The subdomain ██████ had an CNAME record pointing to an unclaimed ███████ webservice. This is a high severity security issue because an attacker can register the subdomain on ███ and therefore can own the subdomain  █████████.



#Description:
The dangling CNAME record of █████████  is pointing to █████.███████ which was not claimed by you. I registered a service with this name and therefore was able to takeover the subdomain. Every attacker doing this has afterwards full control over the contents served on this subdomain.



#Subdomain Affected: 
██████████




#Proof Of Concept:
I have uploaded a simple subdomain takeover PoC on http://███████/████████





# Step-by-step Reproduction Instructions
1. Open ██████ and register for web app which is under market place. I have used ██████  (See: ████)

2. After registering, go to Custom Domains which will be available under settings. (See: ████)

3. In here, add custom domain i have used █████████ (See: █████)

4. After that upload any PoC you want to upload. I have used ████ which has my PoC. (See: ███████)





#Suggested Mitigation/Remediation Actions
1. Remove the dangling CNAME record for █████

2. Claim it back in ███████ portal after I release it

#Reference
Some hackerone reports #661751 #325336

#NOTE:
I have claimed the subdomain http://█████████ at the current moment to keep it safe from malicious users. Whenever you want i will release ██████.███. Afterwards you can claim it back.

## Impact

Subdomain takeover is abused for several purposes:

1.	Malware distribution
2.	Phishing / Spear phishing
3.	XSS

## Timeline

- **Report Filed**
- **2020-06-06** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2020-06-08** @agentt2: @simplyrishabh 

Please release the taken over domain so the system owner can resume ownership.
- **2020-06-08** @simplyrishabh: @agentt2
Hi, I have released the domain. You can claim it back now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
