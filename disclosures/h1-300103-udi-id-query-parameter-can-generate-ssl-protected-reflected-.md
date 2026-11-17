---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "duplicate"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
date: 2017-12-26
submitted: 2017-12-22T19:04:33.030Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/uber|Uber]]"
reporter: "gregoryvperry"
source: "https://hackerone.com/reports/300103"
title: "udi-id Query Parameter Can Generate SSL-protected Reflected XSS in https://m.uber.com/0-dfffb25d2cf6ceeb0a27.js Endpoint"
---
# udi-id Query Parameter Can Generate SSL-protected Reflected XSS in https://m.uber.com/0-dfffb25d2cf6ceeb0a27.js Endpoint

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Uber | **Disclosed:** 2017-12-26

- Report: [https://hackerone.com/reports/300103](https://hackerone.com/reports/300103)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2017-12-22T19:04:33.030Z

## Timeline

- **Report Filed**
- **2017-12-22** @lindsey-uber: @gregperry -- We're looking into this, but our preliminary investigation suggests that all of these behaviors are related. We ask that you put all the information into one report - our bounties are based on overall security impact, submitting multiples reports for the same issue will not lead to higher bounties.
- **2017-12-22** @gregoryvperry: Well. According to Rob Fletcher this is not even an in-scope vulnerability, despite the fact that it maps almost exactly to Uber's sample report:

```
 ## Summary
reflected XSS in partners.uber.com

## Security Impact
Since partners.uber.com has an authenticated experience, an XSS in this domain
means an attacker can forge authenticated requests on behalf of the victim.
Also, advanced phishing attacks and defacement are possible.

## Reproduction Steps
This is a reflected XSS in `partners.uber.com/ via the `lang` querystring
parameter via the route `/documents`.
```

So at this point this is blatant employment discrimination by Uber.
- **2017-12-22** @fletcher: We've not made any decision at this point -- the only thing I said was that if you cannot get Javascript execution, this will not be considered XSS. If HTML injection is possible, this will likely be in-scope for our Phishing security impact bucket. If this is only text injection, it will be out of scope per our program guidelines.

Please just be patient while we work through your reports and if they are valid they will be recognized at such.
- **2017-12-22** @gregoryvperry: Here is a login form. Not properly formatted, because I am not a web developer or professional phisher.

https://m.uber.com/0-dfffb25d2cf6ceeb0a27.js?udi-id%3D%22%7D%7D%3C%2Fscript%3E%3Cdiv%20class%3D%27_b%20_c%20_d%20_e%20_f%20_g%20_h%20_i%20_a3%20_a4%20_a5%20_a6%20_a7%20_a8%20_a9%20_aa%20_ab%20_ac%20_ad%20_ae%20_af%20_ag%20_ah%20_ai%20_aj%20_ak%20_al%20_am%20_an%20_ao%20_ap%20_aq%20_ar%20_as%20_at%20_au%20_av%20_aw%27%3E%3Ch2%3ELogin%20to%20your%20Uber%20account%3C%2Fh2%3E%3Cform%3E%3Cinput%20type%3D%27text%27%20title%3D%27username%27%20placeholder%3D%27username%27%20%2F%3E%3Cinput%20type%3D%27password%27%20title%3D%27username%27%20placeholder%3D%27password%27%20%2F%3E%3Cbutton%20type%3D%27submit%27%20class%3D%27btn%27%3ELogin%3C%2Fbutton%3E%3Ca%20class%3D%27forgot%27%20href%3D%27%23%27%3EForgot%20Your%20Uber%20Username%3F%3C%2Fa%3E%3C%2Fform%3E%3C%2Fdiv%3E
- **2017-12-22** @gregoryvperry: Most of this could probably be fixed by adding single quote escaping to your XSS filter or WAF.
- **2017-12-22** @fletcher: Perfect, thank you -- with this HTML injection, this would land in our Phishing security impact bucket:
```
Phishing: (almost all examples of Phishing end up out-of-scope) the ability to carry out targeted and convincing phishing on Uber users.

in-scope vulnerability class examples:
* HTML injection on www.uber.com allowing for convincing phishing.
...
```

We're going through our final validations and will follow-up soon.
- **2017-12-23** @gregoryvperry: As Lindsey has verified that javascript can be executed via the script-src whitelist and wildcard *.cloudfront.net host, it would appear that this is two separate issues: a javascript execution vulnerability for the XSS bucket as well as an HTML injection vulnerability for the advanced phishing bucket.

Hopefully I will not be penalized for having lumped these two issues into the same report?
- **Report Duplicate**
- **Comments Closed**
- **Agreed On Going Public**
- **Manually Disclosed**
