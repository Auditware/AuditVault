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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hey team,

## Summary:
 I have found that in the code of full-build-macos.sh in rpanstudio on github(https://github.com/reddit/rpan-studio/blob/e1782332c75ecb2f774343258ff509788feab7ce/CI/install-dependencies-osx.sh) contains a  s3 bucket which was unclaimed i.e (https://obs-nightly.s3-us-west-2.amazonaws.com)

## Steps To Reproduce:
1. Create a s3 bucket with name obs-nightly and us west 2 region
2. Upload files  with the name same as given in the code  (e.g. cef_binary_${1}_macosx64.tar.bz2)
3. Make the settings and change it as a static website 
4. You have successfully taken the s3 bucket and now when any user runs the code the url with s3 get executed and an attacker can spread dangerous malware.

## POC:

1. Link for the s3 bucket takenover :- https://obs-nightly.s3-us-west-2.amazonaws.com/index.html
{F1395337}

2. Github link that shows the s3 bucket :- https://github.com/reddit/rpan-studio/blob/e1782332c75ecb2f774343258ff509788feab7ce/CI/install-dependencies-osx.sh
{F1395340}
3. Github link that shows the s3 bucket :- https://github.com/reddit/rpan-studio/blob/e1782332c75ecb2f774343258ff509788feab7ce/CI/full-build-macos.sh
{F1395338}

##Remediaton
You should remove the unclaimed s3 bucket as soon as possible from both the codes as it possess a critical risk

## Impact

An attacker can takeover the s3 bucket and can host his malicious content with the name (cef_binary_${1}_macosx64.tar.bz2) as presented in the code and can spread ransomware and many malicious files. This bug has a critical impact because the code of the tool that many people uses, contains unclaimed s3 bucket.

Regards,
Gaurav Bhatia

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
