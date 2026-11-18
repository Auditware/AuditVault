---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-dom
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - DOM"
enriched: true
body: true
date: 2018-09-19
submitted: 2018-07-24T18:02:24.808Z
bounty_usd: null
votes: 43
cve: []
program: "[[programs/chaturbate|Chaturbate]]"
reporter: "nahamsec"
source: "https://hackerone.com/reports/386334"
title: "CSS Injection on /embed/ via bgcolor parameter leaks user's CSRF token and allows for XSS "
---
# CSS Injection on /embed/ via bgcolor parameter leaks user's CSRF token and allows for XSS 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 43 | **Program:** Chaturbate | **Disclosed:** 2018-09-19

- Report: [https://hackerone.com/reports/386334](https://hackerone.com/reports/386334)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2018-07-24T18:02:24.808Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi there,

There's a CSS injection here: https://chaturbate.com/embed/admin/?bgcolor=%7D*%7Bbackground:red&tour=nvfS&disable_sound=0&campaign=iNSGX 

```
  body, div#main, div.content, div.block, div.section {margin: 0px; padding: 0px;}
  body {min-width:800px;}
  div.content {width: 100%;}
  
  body {background: }*{background:red;}

```

This allows an attacker to enumerate the CSRF token. Once the CSRF token is enumerated, we can 

#POC 
1. Go to `http://d0nut.pythonanywhere.com/demo/token_stealing/7GTt5qD1LD273WYkJyaR/reset`
2. Now go to `http://d0nut.pythonanywhere.com/demo/token_stealing/7GTt5qD1LD273WYkJyaR` and let it do it's magic :) 

{F324052}

There are numerous endpoints like `POST /choose_broadcaster_chat_color` where it returns `Content-Type: text/html; charset=utf-8` that could potentially allow a hacker to combine the two for XSS (I haven't gotten that far yet)


 **Do you mind asking your HackerOne contact to allow collaboration on your program, so I can invite another researcher that helped me exploit this fully?**

Thanks,
Ben

## Impact

#

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-07-24** @nahamsec: @thefrog - You aren't able to invite a collaborator, only an external member. Collaborator allows hackers to split the bounty on platform, as external members are only able to comment/view.
- **Report Collaborator Invited**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Report Collaborator Joined**
- **Bounty Awarded**
- **Bounty Awarded**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
