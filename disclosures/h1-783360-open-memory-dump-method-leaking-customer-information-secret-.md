---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/exposed-dangerous-method-or-function
  - env/web
substate: "resolved"
weakness: "Exposed Dangerous Method or Function"
enriched: true
date: 2020-01-31
submitted: 2020-01-25T21:57:38.304Z
bounty_usd: null
votes: 158
cve: []
program: "[[programs/stripo|Stripo Inc]]"
reporter: "secyour-org"
source: "https://hackerone.com/reports/783360"
title: "Open memory dump method leaking customer information ,secret keys , password , source code & admin accounts"
---
# Open memory dump method leaking customer information ,secret keys , password , source code & admin accounts

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 158 | **Program:** Stripo Inc | **Disclosed:** 2020-01-31

- Report: [https://hackerone.com/reports/783360](https://hackerone.com/reports/783360)
- CWE: Exposed Dangerous Method or Function
- Submitted: 2020-01-25T21:57:38.304Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Triaged**
- **2020-01-28** @secyour-org: @artem_nefedov,

Please let me know if the app team needs any help with any recommendations , I can help in that 

Thanks
- **2020-01-29** @artem_nefedov: @homains the team and DevOps updated secret key and changed passwords. What else would you recommend as the best mitigation?
- **2020-01-29** @secyour-org: @artem_nefedov , 
That's right , and also you need to disable all the Actuator endpoints.
- **Report Resolved**
- **Agreed On Going Public**
- **2020-01-30** @secyour-org: @artem_nefedov ,
np at all , would you please allow me to disclose the report ?

Thanks
@Homains
- **Agreed On Going Public**
- **Report Became Public**
