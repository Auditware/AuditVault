---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2019-10-30
submitted: 2019-08-28T18:42:12.237Z
bounty_usd: null
votes: 12
cve: "CVE-2019-15893"
program: "[[programs/central-security-project|Central Security Project]]"
reporter: "hland"
source: "https://hackerone.com/reports/683965"
title: "Unrestricted File Upload Leading to Remote Code Execution"
---
# Unrestricted File Upload Leading to Remote Code Execution

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Central Security Project | **Disclosed:** 2019-10-30

- Report: [https://hackerone.com/reports/683965](https://hackerone.com/reports/683965)
- CWE: Business Logic Errors | CVE: CVE-2019-15893
- Submitted: 2019-08-28T18:42:12.237Z

## Report summary

https://support.sonatype.com/hc/en-us/articles/360035055794-CVE-2019-15893-Nexus-Repository-Manager-2-Remote-Code-Execution-2019-09-03

## Timeline

- **Report Filed**
- **2019-08-28** @hland: Adding screenshots of attack.
- **2019-08-28** @acazzolla: Hi @hland , thank you for your submission.  We are looking into and confirming the vulnerability now.  We will reply back soon with a confirmation.
- **Report Title Updated**
- **2019-08-30** @acazzolla: @hland Thank you again for your submission.  There are two parts to the attack you describe, the file upload leading to Remote Code Execution and the fact that the Windows service runs as SYSTEM leading to Privilege Escalation.  For the former, we consider this a vulnerability and are working on a fix.  For the latter, this is more a case of not adhering to a best practice and is not a vulnerability on its own.  While running as SYSTEM is not considered a vulnerability, we are still investigating on how we can best address this issue.

Also, how would you like to be credited for the discovery of this vulnerability?
- **2019-08-31** @hland: Hi, thank you for the fast response. I agree with your assessment. I'm thinking that making it easier to run the software without SYSTEM privileges and being very explicit about the inherent dangers of running as SYSTEM would help.

If you could credit me using my name and company that would be greatly appreciated :) 
Name: Christian Håland
Company: Binary Security 
Website: https://www.binarysecurity.no
- **Report Triaged**
- **2019-10-02** @hland: Hi, just checking in to see if there's any status updates on this issue? Thanks in advance. 
/Christian
- **Cve Id Added**
- **2019-10-28** @acazzolla: This vulnerability has been fixed and disclosed at https://support.sonatype.com/hc/en-us/articles/360035055794-CVE-2019-15893-Nexus-Repository-Manager-2-Remote-Code-Execution-2019-09-03
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
