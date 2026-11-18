---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-access-control-generic
  - env/web
  - vuln/file-upload
  - trigger/unauthenticated
  - trigger/social-engineering
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2020-05-11
submitted: 2019-08-27T14:51:39.563Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "javilarx8"
source: "https://hackerone.com/reports/683024"
title: "Unrestricted File Upload"
---
# Unrestricted File Upload

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2020-05-11

- Report: [https://hackerone.com/reports/683024](https://hackerone.com/reports/683024)
- CWE: Improper Access Control - Generic
- Submitted: 2019-08-27T14:51:39.563Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The endpoint at https://███████/ui/core/index.html required authentication, but navigating to https://█████/ui/core/index.html?mode=public#expl-tabl./SHARED/rpchllmd/CSAT allow for read/write access.

**Description:**
The endpoint at https://████/ui/core/index.html?mode=public#expl-tabl./SHARED/rpchllmd/CSAT allowed for read as well as write access. It was possible to create directories and upload images as well as .exe files such as putty.exe. 

## Impact
An attacker can attempt to use the site to host malware, or perform social engineering attacks since the domain URL will be a .mil address.

## Step-by-step Reproduction Instructions

1. Navigate to:
https://████/ui/core/index.html?mode=public#expl-tabl./SHARED/rpchllmd/CSAT
2. Create sub-directory 
3. Upload test files
4. Files are then uploaded and hosted on a .mil website without authenticating to the application.

## Product, Version, and Configuration (If applicable)
FileCloud software
https://www.getfilecloud.com/
## Suggested Mitigation/Remediation Actions
Enforce authentication on endpoints of the application, restrict file uploads to only necessary business requirements. If possible restrict uploads to .jpg .pfd .docx. Don't allowed upload of executable files

## Impact

An attacker can attempt to use the site to host malware, or perform social engineering attacks since the domain URL will be a .mil address.

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2019-09-04** @javilarx8: Hello,

Can you provide an update on this vulnerability. I noticed some of the links no longer work.

Thanks
- **2019-09-06** @agent-0g: @javilarx8 We're noticing the same. The system owner is saying that they are unable to reproduce your POC so, I tested myself and I'm unable to as well.  Keep messing with it and see if you're able to do anything with it.
- **2019-09-06** @javilarx8: It would help to know from the system owner if there unable to replicate the POC before they made a fix or after they made the fix because clearly something change after it was reported. Can you verify.
- **2019-09-06** @agent-0g: @javilarx8 According to them, they've made no change.
- **2019-09-06** @javilarx8: Force browsing to a directory is still possible for example see attachments.
https://██████████/ui/core/index.html?mode=public#expl-tabl./SHARED/rpchlbmb/uc1ZUx8WHckdWdAv

File uploads are now failing due to back-end validation, as you can see the folder "HackerOne BB Program" was created previously. 

At a minimum read access still remains, request should be directed to an authentication page.
- **2019-09-18** @javilarx8: Hello any update from my last response.

Thanks
- **2019-10-21** @javilarx8: Hello can this finding be closed, looks like there is no more responses based on my last few comments?
- **2019-10-21** @agent-0g: @javilarx8 We will keep the report open until it is addressed by the system owner. Until it is, we have to keep it open. There was no response to your last comment simply because there was no update to give you. There still is no upadate to provide but, as soon as there is, we will let you know.
- **2019-10-21** @javilarx8: Okay understood thanks for the update.
- **Report Resolved**
- **2020-01-09** @javilarx8: Great to hear, can I do a public disclosure on this finding?
- **2020-01-09** @agent-r5: We can add it to the queue if you would like. Please mark it in hackerone that you are requesting disclosure so we can track it.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
