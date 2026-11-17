---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2022-09-14
submitted: 2022-07-08T15:04:52.011Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "shreky"
source: "https://hackerone.com/reports/1631447"
title: "STORED XSS in █████████/nlc/login.aspx via 'edit' GET parameter through markdown editor [HtUS]"
---
# STORED XSS in █████████/nlc/login.aspx via "edit" GET parameter through markdown editor [HtUS]

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2022-09-14

- Report: [https://hackerone.com/reports/1631447](https://hackerone.com/reports/1631447)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2022-07-08T15:04:52.011Z

## Timeline

- **Report Filed**
- **Report Informative**
- **2022-07-08** @shreky: This is not true,if anyone were to access the markdown editor and input an XSS payload and Save it,it would execute on everyone that accesses the page normally,without having to input the payload themselves.
If you want,I can edit the page with the steps mentioned and then try to access the page,and see that it executes,let me know :)

Regards,

shreky
- **2022-07-08** @shreky: As a Proof of Concept,I added the XSS payload,so you should get a popup alert whenever you access the page now,let me know when to remove it.
https://████/nlc/login.aspx
- **Report Reopened**
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Pending Program Review**
- **2022-07-10** @shreky: A little update,I have discovered **4** more login pages on the same domain in which the same vulnerability applies:
https://███/sls/login.aspx
https://██████████/nlc/nss/login.aspx
https://████/aseps/login.aspx
https://██████████/asepa/Login.aspx

They all include the **?edit=false** parameter in their source code,and when accessed as **?edit=true** a similar hidden markdown editor appears if you click below the login form,and as PoC I've added an XSS payload (`<svg/onload=alert(document.domain)>`) on them,which will fire when anyone accesses the pages.
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
