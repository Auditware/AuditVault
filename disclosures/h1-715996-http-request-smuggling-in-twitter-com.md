---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
substate: "duplicate"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
date: 2020-11-18
submitted: 2019-10-16T23:54:00.683Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "protostar0"
source: "https://hackerone.com/reports/715996"
title: "http request smuggling in  twitter.com"
---
# http request smuggling in  twitter.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** X / xAI | **Disclosed:** 2020-11-18

- Report: [https://hackerone.com/reports/715996](https://hackerone.com/reports/715996)
- CWE: HTTP Request Smuggling
- Submitted: 2019-10-16T23:54:00.683Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
the same vulnerability reported in other domain , see this report [here](https://hackerone.com/reports/713285) 
**Description:** 
the Description of HTTP request smuggling attacks : [here](https://portswigger.net/web-security/request-smuggling)

##Detect HTTP request smuggling attack (subdomains vulnerable):
-to detect HTTP request smuggling attack with add header `Transfer-Encoding: chunked` 
and encode the body of request with chunked encode.
1. send request with a valid chunked encode and you will get response means that the **back-end server accept chunked encode**
2. send a large value in hex of chunked encode , if get ** delay of response**  means its vulnerable. 
resource: https://portswigger.net/web-security/request-smuggling/finding

## CONFIRMATION:

##POC:

in this POC i will use TWEET request as second request (payload) ,means that if the HTTP request smuggling attack success,
will get a new TWEET in my account 

F609847


## Steps To Reproduce:


ps : i use chrome browser,with burp
1- choose any valid POST request (or change GET to POST) from twitter.com and send it to repeater
2- delete this header (Connection: close  ,Accept-Encoding: gzip, deflate)
3- add this header <Transfer-Encoding: chunked>

4- add chunked encode    put a valid chunked code or   [ put just 0 with two CRLFs]
5-put the second request  [i use a TWEET request ]
6- send the attacker request

## Impact

impact of http request smuggling 
- https://portswigger.net/research/http-desync-attacks-request-smuggling-reborn
- https://portswigger.net/web-security/request-smuggling/exploiting

## Timeline

- **Report Filed**
- **2019-10-17** @bugtriage-sophia: Thank you for your report @protostar0,

We were able to reproduce the behavior you described and will get back to you when we have more information.

Thank you for thinking of Twitter security.
- **Report Duplicate**
- **2019-11-07** @protostar0: hi team;
please , don't forget to  examining the behaviour here.
- **2020-04-13** @protostar0: hi teams;
any news here please;

did you examinate the the behaviour here?.
i get bounty in the periscope for the same vulnerability #713285 ?
it's Eligible for bounty in twitter domain ?!

thanks
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
