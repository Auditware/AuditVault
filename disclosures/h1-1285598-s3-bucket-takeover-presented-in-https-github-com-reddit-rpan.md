---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/cloud
  - stack/aws
  - os/macos
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2021-10-21
submitted: 2021-07-31T17:51:58.825Z
bounty_usd: null
votes: 96
cve: []
program: "[[programs/reddit|Reddit]]"
reporter: "gaurav-bhatia"
source: "https://hackerone.com/reports/1285598"
title: "s3 bucket takeover presented in https://github.com/reddit/rpan-studio/blob/e1782332c75ecb2f774343258ff509788feab7ce/CI/full-build-macos.sh"
---
# s3 bucket takeover presented in https://github.com/reddit/rpan-studio/blob/e1782332c75ecb2f774343258ff509788feab7ce/CI/full-build-macos.sh

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 96 | **Program:** Reddit | **Disclosed:** 2021-10-21

- Report: [https://hackerone.com/reports/1285598](https://hackerone.com/reports/1285598)
- CWE: Business Logic Errors
- Submitted: 2021-07-31T17:51:58.825Z

## Timeline

- **Report Filed**
- **2021-08-02** @h1_analyst_robert: Hi @bhatiagaurav1211 - I'm discussing this submission internally with the Reddit team. You will be updated as soon as there is additional information to share. Thanks for your patience!
- **2021-08-03** @reddit_h2: We are currently investigating this issue. We will update you when we get a response from the appropriate internal team.
- **2021-08-05** @gaurav-bhatia: Hey team,

Is there any new update?

Regards,
Gaurav Bhatia
- **2021-08-08** @gaurav-bhatia: Hey @reddit_h2,

If you have any problem in exploiting and resolving the issue let me know so that i can help you in any possible way. 

Regards,
Gaurav Bhatia
- **Report Severity Updated**
- **Bounty Awarded**
- **2021-08-09** @gaurav-bhatia: Hey @Reddit,

It should be considered in critical because i have added 2 bash files which contains unclaimed bucket 1st one is 
https://github.com/reddit/rpan-studio/blob/e1782332c75ecb2f774343258ff509788feab7ce/CI/install-dependencies-osx.sh and the 2nd one is https://github.com/reddit/rpan-studio/blob/e1782332c75ecb2f774343258ff509788feab7ce/CI/full-build-macos.sh and in the first one there is installation of dependencies which installs the file from the unclaimed bucket and posses the critical risk. I request you to please look in the criticality of the issue.

Regards,
Gaurav bhatia
- **Report Severity Updated**
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **2021-08-12** @gaurav-bhatia: hey team,

Can we disclose this report ? So, that many researchers can refer this report so that they can be successfull.

Regards,
Gaurav Bhatia
- **Agreed On Going Public**
- **Report Became Public**
