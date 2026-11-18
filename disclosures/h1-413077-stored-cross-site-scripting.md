---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - vuln/xss-stored
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2020-07-21
submitted: 2018-09-23T12:23:24.011Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/8x8-bounty|8x8]]"
reporter: "sakhauathr99"
source: "https://hackerone.com/reports/413077"
title: "Stored Cross Site Scripting."
---
# Stored Cross Site Scripting.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 20 | **Program:** 8x8 | **Disclosed:** 2020-07-21

- Report: [https://hackerone.com/reports/413077](https://hackerone.com/reports/413077)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2018-09-23T12:23:24.011Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hellow team 
I got Stored based XSS on your web :D

Here Is Step :

1. Go to https://www.easycontactnow.com/
2. Click "Try For Free" (Sign Up)
3. It will told you "Enter your details to get started". 
   So Enter your full name like : "><script>alert(1)</script>
   Then put all the other details.
4. Then Confirm your id and login.
5. Then Click dashboard and other thing :) 
6. Tada script executed done :D

POC : https://www.youtube.com/watch?v=gYyCAxaB6w0

Sorry for my bad english. 

Thanks :)

## Impact

Stored attacks are those where the injected script is permanently stored on the target servers, such as in a database, in a message forum, visitor log, comment field, etc. The victim then retrieves the malicious script from the server when it requests the stored information. Stored XSS is also sometimes referred to as Persistent or Type-I XSS.

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **2018-09-25** @sakhauathr99: Hi there
how much time it will take to resolve ?

Thanks :)
- **2018-09-25** @1x1: I'm not sure we can estimate resolution at this time. The developer has said this is among the top of his priorities, but the application is already slated for retirement and may require creative means for remediation.
- **2018-09-26** @sakhauathr99: Hi there
Is this paid program ? Sorry to say that because i didn't saw anything in your disclosure about payment :) Thats why i'm confused :)

Thanks :)
- **2018-09-26** @1x1: Apologies, but we're just starting out and kudos only at the moment. We plan on expanding to incentivized programs in the future.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Reassigned To Team**
- **Not Eligible For Bounty**
