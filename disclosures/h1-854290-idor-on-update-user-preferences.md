---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
date: 2020-05-13
submitted: 2020-04-20T14:37:10.118Z
bounty_usd: null
votes: 21
cve: []
program: "[[programs/palo_alto_software|Palo Alto Software]]"
reporter: "macasun"
source: "https://hackerone.com/reports/854290"
title: "IDOR on update user preferences"
---
# IDOR on update user preferences

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 21 | **Program:** Palo Alto Software | **Disclosed:** 2020-05-13

- Report: [https://hackerone.com/reports/854290](https://hackerone.com/reports/854290)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2020-04-20T14:37:10.118Z

## Timeline

- **Report Filed**
- **2020-04-20** @kad3nce: @alexandermac05, thanks for the report! Can you clarify steps 5 and 6?

In step 5, were you able to harvest user1's cookie and make authenticated requests with it?

In step 6, are you saying that if you are already logged in as user1, and enter user2's email in the forgot password form, that user2 will get an email to reset user1's password?

Thanks again for hacking on our systems.
- **2020-04-20** @macasun: @kad3nce thanks for the response.

> In step 5, were you able to harvest user1's cookie and make authenticated requests with it?

No, this is impossible. Your app stores `auth` cookie on the different domain - `.appcues.com`, so this is impossible to get them using provided XSS, but I guess this possible with another technique, maybe injected iFrame. 

> In step 6, are you saying that if you are already logged in as user1, and enter user2's email in the forgot password form, that user2 will get an email to reset user1's password?

Sorry, for inaccurate explanation, in steps 4 and 6 you should use email address that is controlled by user2, but that is **not** email used for registration on outpost.co. For example, if he used user2@mail.com for registration, on steps 4 and 6 he can use user2222@mail.com.

Best regards,
Alex.
- **Report Triaged**
- **2020-04-21** @macasun: @kad3nce ok, thanks for the update.
- **Report Resolved**
- **2020-05-13** @macasun: @kad3nce thanks for the good feedback. I confirm that issue is fixed, do you agree to disclosure the report?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
