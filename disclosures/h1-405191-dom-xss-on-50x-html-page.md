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
date: 2018-10-16
submitted: 2018-09-04T13:00:34.756Z
bounty_usd: null
votes: 16
cve: []
program: "[[programs/duckduckgo|DuckDuckGo]]"
reporter: "cujanovic"
source: "https://hackerone.com/reports/405191"
title: "DOM XSS on 50x.html page"
---
# DOM XSS on 50x.html page

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** DuckDuckGo | **Disclosed:** 2018-10-16

- Report: [https://hackerone.com/reports/405191](https://hackerone.com/reports/405191)
- CWE: Cross-site Scripting (XSS) - DOM
- Submitted: 2018-09-04T13:00:34.756Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello,

The is a DOM XSS vulnerability on https://duckduckgo.com/50x.html, it seems like the sink is DIV.innerHTML and the source is location.search.
The PoC url is: https://duckduckgo.com/50x.html?e=&atb=test%22/%3E%3Cimg%20src=x%20onerror=alert(document.domain);%3E

The code that is causing this XSS is located in:
https://duckduckgo.com/lib/l110.js
Line 26, Column 60903

Below is the part of the vulnerable code:
`b5.createElement("div"));
cg = (m.exec(b7) || ["", ""])[1].toLowerCase();
b4 = R[cg] || R._default;
ce.innerHTML =  b4[1]  + b7.replace(aB, "<$1></$2>") + b4[2];
cb = b4[0];
while (cb--) {
	ce=ce.lastChild
}
if(!bI.support.leadingWhitespace&&b2.test(b7))`

Screenshot:
{F342240}

## Impact

The attacker can execute JS code.

## Timeline

- **Report Filed**
- **2018-09-06** @lollipup: Hi @cujanovic,

Thanks for your submission. We are currently reviewing your report and will get back to you once we have additional information to share.

Kind regards,
@lollipup
- **Report Duplicate**
- **2018-09-06** @cujanovic: hey, get I get invited to https://hackerone.com/reports/394837 ?
Thanks.
- **Report Reopened**
- **2018-09-19** @cujanovic: @joystick any updates? Thanks.
- **Report Triaged**
- **2018-10-16** @marcantonio: @cujanovic is not a duplicate report. We've released a fix. Can you please verify?
- **2018-10-16** @cujanovic: @marcantonio yep, it is fixed!
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
