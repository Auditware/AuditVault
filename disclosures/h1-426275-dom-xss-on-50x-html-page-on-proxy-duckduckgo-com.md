---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
body: true
date: 2018-11-07
submitted: 2018-10-20T20:41:31.759Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/duckduckgo|DuckDuckGo]]"
reporter: "smither"
source: "https://hackerone.com/reports/426275"
title: "DOM XSS on 50x.html page on proxy.duckduckgo.com"
---
# DOM XSS on 50x.html page on proxy.duckduckgo.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** DuckDuckGo | **Disclosed:** 2018-11-07

- Report: [https://hackerone.com/reports/426275](https://hackerone.com/reports/426275)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2018-10-20T20:41:31.759Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi,

I read the report about DOM XSS on 50x.html page (https://hackerone.com/reports/405191).
I decided to check some other subdomains to be sure.
This link still executes javascript:
https://proxy.duckduckgo.com/50x.html?e=&atb=test%22/%3E%3Cimg%20src=x%20onerror=alert(%27test%27);%3E

The following subdomains execute javascript as well:
proxy1.duckduckgo.com
proxy2.duckduckgo.com
proxy3.duckduckgo.com
proxy4.duckduckgo.com

@cujanovic: I'm sorry for stealing.

## Impact

The attacker can execute javascript code.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Duplicate**
- **2018-11-01** @smither: Hi,

In my report I tried to explain that the fix of #405191 doesn't seem to be implemented for the proxy subdomains.
Did you try the link in my report? If I open the link in a firefox browser it still executes XSS. Please ask if you need further information.
- **2018-11-01** @smither: @marcantonio I can't reopen the report myself. Could you do it if my last message is accurate?
- **2018-11-01** @marcantonio: I did try it. It didn't work in Chrome or Firefox (latest). What versions are you using? Is it possible that something is cached? Thanks.
- **2018-11-01** @smither: Hi @marcantonio,

That's weird. It still seems to work for me. Here are the browsers I tested:
firefox quantum 60.2.0esr (64-bit) kali distr - works, even after emptying cache.
firefox quantum 63.0 (64-bits) -works
firefox quantum 63.0.1 (64-bits) -works, even after emptying cache.
Internet explorer 11 version 11.345.17134.0 update version 11.0.90 - works, even after emptying cache.
microsoft edge 42.17134.1.0 -works, even after emptying cache.
Tor browser 8.0.3 (based on Mozilla Firefox 60.3.0esr) works, if you allow the site after xss warning.
I don't have any ideas at the moment why it doesn't execute if you try.

@chessmast3r, were you able to verify XSS execution?
- **2018-11-01** @smither: Here are some other payloads that work for me:
https://proxy.duckduckgo.com/50x.html?e=&atb=test%22/%3E%3Csvg%0Conload=alert(1)%3E
https://proxy.duckduckgo.com/50x.html?e=&atb=test%22/%3E%3Cdetails/open/ontoggle=%22alert`1`%22%3E
https://proxy.duckduckgo.com/50x.html?e=&atb=test%22/%3E%3Cvideo%3E%3Csource%20onerror=%22javascript:alert(1)%22%3E
- **Report Reopened**
- **2018-11-02** @marcantonio: Ah, our browser extensions were blocking this! Thanks, I see it now.
- **Report Triaged**
- **2018-11-02** @marcantonio: @smither thanks. This was actually the same issue as #405191 we just didn't deploy it fully.
- **Swag Awarded**
- **Report Resolved**
- **2018-11-02** @smither: Thank you. Much appreciated
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
