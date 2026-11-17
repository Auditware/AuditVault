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
date: 2023-10-30
submitted: 2023-07-20T23:46:09.074Z
bounty_usd: 1337
votes: 108
cve: []
program: "[[programs/8x8-bounty|8x8]]"
reporter: "pentestor"
source: "https://hackerone.com/reports/2078490"
title: "Stored xss at https://█.8x8.com/api/█/ID"
---
# Stored xss at https://█.8x8.com/api/█/ID

> **Severity:** High | **Bounty:** 1,337 USD | **Votes:** 108 | **Program:** 8x8 | **Disclosed:** 2023-10-30

- Report: [https://hackerone.com/reports/2078490](https://hackerone.com/reports/2078490)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2023-07-20T23:46:09.074Z

## Report summary

@pentestor reported to us an issue where already submitted data could have been modified and malicious JavaScript been introduced in selected fields. Payment receipts are identified using a 32 characters randomly generated hash, hence this was an isolated issue.

Example:
```json
POST /api/patchPaymentMethod/ID HTTP/2
…

{
  "ipAddress": "<svg on onload=(alert)(document.domain)>",
  "callBackURL": "dssdsd"
}
```

Our team put additional Access Control checks & user input sanitisation in place, which resolved the issue.

## Timeline

- **Report Filed**
- **2023-07-21** @42x42: Hey @pentestor,
Thanks for your submission. Your report is currently being reviewed and the triage team will get back to you once there is additional information to share.
- **2023-07-21** @42x42: Hey @pentestor,
That's quite nice hack, congratz! You are really hitting harder here! 😃😃

█████
- **Report Triaged**
- **2023-07-21** @42x42: Hey @pentestor,
Are you able to overwrite anything else from this ████████ment? Or only the `ipAddress`?
- **2023-07-21** @pentestor: hey @42x42 , thanks , i am trying to changing other filed , i  come back soon.
- **2023-07-21** @pentestor: hey @42x42 , 

about you question , answer is yes . 

attacker can manipulate `isPrimary` and `savePaymentMethod` filed value , i seen a improper access control,  are you agree ?   

before : 
███████

after : 
████████
----
█████████
- **2023-07-21** @42x42: Hey @pentestor,
Thank you so much for the kind confirmation! 

Btw… That's officially our 1337th report to `8x8-bounty`! Congratulations! 🥳🎉👏🏻👏🏻🥂

{F2525369}{F2525371}
- **2023-07-21** @pentestor: hey @42x42 , 
thanks mate , interesting!  
{F2525564}
- **Bounty Awarded**
- **Report Resolved**
- **2023-08-21** @pentestor: hey @1x1 , 
its not resolved yet , i can reproduce this report ! 
`https://███.8x8.com/api/█████████mentInfoById/█████`
████████
- **2023-08-21** @1x1: It's currently in QA and should reach production by tomorrow.
- **2023-08-22** @42x42: Hey @pentestor,
Should be live now!
- **2023-08-22** @pentestor: hey @42x42 and @1x1  ,
ipaddress paarameter  inst editable more , and fix well , if 8x8 want to more test `█████.8x8.com` app  give me a incomplete ██████████ment requestid to more test application functions
- **2023-08-22** @42x42: Hey @pentestor,
Thank you very much for the kind confirmation!

The fix to address this security issue has been deployed to production and we consider this report `Resolved` now.
Thank you once again for your effort and contribution to the security posture of 8x8.
- **Agreed On Going Public**
- **Report Title Updated**
- **Report Title Updated**
- **Agreed On Going Public**
- **Report Became Public**
