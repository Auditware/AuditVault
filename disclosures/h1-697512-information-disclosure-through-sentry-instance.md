---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-debug-information
  - env/web
substate: "resolved"
weakness: "Information Exposure Through Debug Information"
enriched: true
body: true
date: 2019-09-19
submitted: 2019-09-18T21:54:35.038Z
bounty_usd: 750
votes: 179
cve: []
program: "[[programs/eternal|Eternal]]"
reporter: "chajer"
source: "https://hackerone.com/reports/697512"
title: "Information Disclosure through Sentry Instance ███████"
---
# Information Disclosure through Sentry Instance ███████

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 179 | **Program:** Eternal | **Disclosed:** 2019-09-19

- Report: [https://hackerone.com/reports/697512](https://hackerone.com/reports/697512)
- CWE: Information Exposure Through Debug Information
- Submitted: 2019-09-18T21:54:35.038Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello team 


I found a bug (sensitive information ) can be used from attackers to perfom attack in youre server 
I don't know if this in scope so i'm sorry if i'm wrrong 

withou spending youre time 
 here the steps how i found this bug :

1-Please use burp suite to reproduce the same result 
2-i notice you have as tool for track errors (sentry) 
3- i send the request to ███ via /api/20/store█████████

4-change request from get to post 
Request:
==
POST /api/20/store██████ HTTP/1.1
Host: ███
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
██████
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3
Sec-Fetch-Site: none
Accept-Encoding: gzip, deflate
Accept-Language: fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7
Content-Type: application/x-www-form-urlencoded
Content-Length: 0
5-go to response and click in the [Render ] to view disclosure UI 
6- i get alot of information disclosure ███(see my screenns) i think the server behind this is [███] with ███

## Impact

Please see the screens for more information 
best regards 
let me know if you need more information.

## Timeline

- **Report Filed**
- **2019-09-18** @chajer: server affected :[█████] please see the poc
- **2019-09-19** @biryani-is-lob: Hi @chajer, 

Thanks for the submission, we are looking into this. 

@ehsahil-zomato
- **2019-09-19** @biryani-is-lob: Hi @chajer, 

Thank you for the submission, ███. Can you please confirm from your end? 

Thanks 
@ehsahil-zomato
- **Report Severity Updated**
- **Report Resolved**
- **Bounty Awarded**
- **Report Title Updated**
- **Agreed On Going Public**
- **2019-09-19** @chajer: Thank you for the bounty 
Yes I confirm bug is fixed now
- **Agreed On Going Public**
- **Report Became Public**
