---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2022-06-03
submitted: 2022-03-31T21:52:52.035Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/imgur|Imgur]]"
reporter: "mr_baka"
source: "https://hackerone.com/reports/1527405"
title: "8ybhy85kld9zp9xf84x6.imgur.com Subdomain Takeover"
---
# 8ybhy85kld9zp9xf84x6.imgur.com Subdomain Takeover

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Imgur | **Disclosed:** 2022-06-03

- Report: [https://hackerone.com/reports/1527405](https://hackerone.com/reports/1527405)
- CWE: N/A
- Submitted: 2022-03-31T21:52:52.035Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Gents,
+ While testing ** Imgur ** I found an unclaimed subdomain which is; “8ybhy85kld9zp9xf84x6.imgur.com”, and I was able to claim it!
+ But actually I didn't upload or host a simple file like `mr_baka.html`, because I need to upgrade the account to be able to use this custom domain!
+ Anyway, you can verify that I was able to claim this subdomain by visiting https://8ybhy85kld9zp9xf84x6.imgur.com and clicking [Manage domain settings here.](https://mrbaka.squarespace.com/config#/settings/domains), which should lead you to my account; https://mrbaka.squarespace.com" .

### Before claiming:
+ {F1675230}

### After:
+ {F1675231}

## Impact

Subdomain Takeover may lead to below consequences:

- Phishing / Spear Phishing
- Malware distribution
- XSS
- Authentication bypass and more
- Credential stealing

## Timeline

- **Report Filed**
- **2022-04-04** @mr_baka: any update !!!
- **2022-04-07** @mr_baka: Any update !!!
- **2022-04-10** @mr_baka: Any update Gents ?
- **2022-04-19** @mr_baka: Any update !!!
- **2022-04-26** @mr_baka: Any update ??!!
- **2022-05-03** @kodermike: Hi there! Sorry for the delay. Can you provide the actual steps you took between "trying random strings to find an unused subdomain" and getting it to resolve to your squarespace page?
- **2022-05-03** @mr_baka: Hi @kodermike ,
Thanks for your kind response!

### Steps that I took:
1. I used a subdomain scanner called [Subdomain-finder](https://subdomainfinder.c99.nl/).
2. I found this unclaimed subdomain: `8ybhy85kld9zp9xf84x6.imgur.com`.
3. I have created a new account at **Squarespace**.
4. Then go to Settings -> Domains -> Use Domain I Own -> Enter this unclaimed subdomain.
5. Now it is mine.

> Note: After the 14 days trial period, it will be unclaimed again!

### Proof of concept:
+ {F1715677}
- **2022-05-03** @kodermike: Ah, I see why this works and is not nearly as serious (just a single piece of bad housekeeping).
```
; <<>> DiG 9.10.6 <<>> 8ybhy85kld9zp9xf84x6.imgur.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 55986
;; flags: qr rd ra; QUERY: 1, ANSWER: 5, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;8ybhy85kld9zp9xf84x6.imgur.com.	IN	A

;; ANSWER SECTION:
8ybhy85kld9zp9xf84x6.imgur.com.	86400 IN CNAME	verify.squarespace.com.
verify.squarespace.com.	300	IN	A	198.185.159.177
verify.squarespace.com.	300	IN	A	198.185.159.176
verify.squarespace.com.	300	IN	A	198.49.23.176
verify.squarespace.com.	300	IN	A	198.49.23.177

;; Query time: 126 msec
;; SERVER: 2001:558:feed::1#53(2001:558:feed::1)
;; WHEN: Tue May 03 16:10:17 PDT 2022
;; MSG SIZE  rcvd: 156
```

The domain you found was used for squarespace verification. Looks like squarespace maps their verify address space to the same space they use for everything else. I'm apply a small token reward to this report for helping us locate the old DNS record. Thanks!
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
