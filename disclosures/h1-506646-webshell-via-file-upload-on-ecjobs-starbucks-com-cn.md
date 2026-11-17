---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/os-command-injection
  - env/web
substate: "resolved"
weakness: "OS Command Injection"
enriched: true
date: 2019-11-13
submitted: 2019-03-08T06:45:11.342Z
bounty_usd: null
votes: 688
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "johnstone"
source: "https://hackerone.com/reports/506646"
title: "Webshell via File Upload on ecjobs.starbucks.com.cn"
---
# Webshell via File Upload on ecjobs.starbucks.com.cn

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 688 | **Program:** Starbucks | **Disclosed:** 2019-11-13

- Report: [https://hackerone.com/reports/506646](https://hackerone.com/reports/506646)
- CWE: OS Command Injection
- Submitted: 2019-03-08T06:45:11.342Z

## Report summary

johnstone discovered An arbitrary file upload via the resume functionality at https://ecjobs.starbucks.com.cn which led to arbitrary code execution by uploading a webshell.
@johnstone   — thank for reporting this vulnerability, your patience while we followed up on the issue internally and for your additional effort to confirm the resolution.

## Timeline

- **Report Filed**
- **2019-03-08** @h1_analyst_decimo: Thank you for reporting this potential issue, 

Your report is currently being examined by the HackerOne triage team. You will receive further details, or questions, as soon as technically possible. Thanks for your patience.

Cheers,
@still
- **Report Severity Updated**
- **2019-03-08** @h1_analyst_decimo: Hi @johnstone, thank you for your report.

This appears to be reproducible, but please note that your submission is not currently in scope, and the product team will rule whether this is an issue they intend to reward.

Thanks for your patience,
@still
- **2019-03-08** @johnstone: Thks@still
Kind regards
john stone
- **2019-03-08** @johnstone: hi,@still, thank you so much to remind me,but in starbucks policy section of In Scope,they write 	
```Significant information disclosures such as internal source code, PII, credentials (excluding those identified in other/prior public breaches).```
Disclosures internal source code is eligibled for bounty,i hope my report is eligible for bounty and starbucks team can intend to reward.
Regardless of the results, the process of finding vulnerabilities is what every hackerone pursues.isn't it? :)
By the way,thks again! @still 
Kind regards
john stone
- **2019-03-10** @johnstone: is there any update here?
- **Report Triaged**
- **2019-03-11** @johnstone: thank you @coldbr3w
- **2019-03-11** @johnstone: I found the webshell was deleted
- **2019-03-13** @coldbr3w: Hi @johnstone,

The team is reporting back to us that this issue has been resolved. Can you please re-test and confirm that the issue has been fixed?
- **2019-03-14** @johnstone: Hi @coldbr3w ,I'm so happy that the vulnerability was fixed,but there have some potential risk on ```/recruitjob/hxpublic_v6/hxdynamicpage6.aspx?_hxpage=hxsm_v6/hxsm_file_upload_process.hxpage.xhtml&max_file_size_kb=1024&allow_file_type_list=jpg;gif;png;``` endpoint,
I found delete the ```allow_file_type_list``` parameter when i try to bypass upload limite that can be uploaded the docx/xls/csv files,the ```hxsm_file_upload_process.hxpage.xhtml``` endpoit did't checked if it is a picture.the docx/xls/csv can also cause the server to receive an attack via XXE.

**Recommendations for fix**
1. Change the upload files to base64
2. Transcode the base64 data on the server to picture
3. Check if it is a picture files

Thank you @coldbr3w
Kind regards
john stone
- **2019-03-15** @johnstone: hi @coldbr3w .After a few days of testing, I found that the vulnerability seems to have been fixed.
- **2019-03-16** @johnstone: Hi @coldbr3w.Can you change the reports statue to resolved?(XXE report and this one to Starbucks)thks
Kind regards
John stone
- **2019-03-18** @johnstone: Any update in this report?
- **Report Resolved**
- **2019-03-20** @johnstone: Thank you @coldbr3w :)
- **Report Title Updated**
- **2019-03-29** @johnstone: Hi,@coldbr3w,May i disclourse the report?
is today the day to pay the bounty to me? :) My lucky day？
- **Agreed On Going Public**
- **Bounty Awarded**
- **Cancelled Disclosure Request**
- **2019-04-04** @johnstone: Thank you @shadegrown ,I was so glad for eligible bounty that  gave me a lot of confidence,In the meantime，I also appreciate the attitude of the Starbucks Security Team in handling reports.So look forward to working with Starbucks again in the future.
Thanks!
@johnstone
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Report Collaborator Invited**
