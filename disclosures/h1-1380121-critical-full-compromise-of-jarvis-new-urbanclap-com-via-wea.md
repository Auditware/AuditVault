---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-authentication-generic
  - env/web
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2022-01-30
submitted: 2021-10-25T11:50:21.616Z
bounty_usd: 1500
votes: 123
cve: []
program: "[[programs/urbancompany|Urban Company]]"
reporter: "ian"
source: "https://hackerone.com/reports/1380121"
title: "Critical full compromise of jarvis-new.urbanclap.com via weak session signing"
---
# Critical full compromise of jarvis-new.urbanclap.com via weak session signing

> **Severity:** Critical | **Bounty:** 1,500 USD | **Votes:** 123 | **Program:** Urban Company | **Disclosed:** 2022-01-30

- Report: [https://hackerone.com/reports/1380121](https://hackerone.com/reports/1380121)
- CWE: Improper Authentication - Generic
- Submitted: 2021-10-25T11:50:21.616Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
Hi there, I discovered that jarvis-new.urbanclap.com uses a weak Flask session key. Because Flask sessions are signed with a static secret, if this secret is known to an attacker then they can modify the session state. In this case, we can modify the Redash `user_id` for the session and log in as any user. **This results in a full compromise of the instance.** I have attached a screenshot showing that I logged into `█████████@urbancompany.com` and have full admin permissions:

██████████
████
██████████
███████

## How to fix
Change the `REDASH_COOKIE_SECRET` and `REDASH_SECRET_KEY` to a random value immediately.

## PoC
For simplicity, it is easiest to forge a password reset link for Redash. We can do this with a bit of Python. To get the reset link for user ID 1, we simply run:
```
>>> from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
>>> serializer = URLSafeTimedSerializer("███")
>>> serializer.dumps(str("1"))
'███'
```

Then, we can browse to `https://jarvis-new.urbanclap.com/reset/█████` and choose a new password for user ID 1. This then logs us into their account.

## Impact

Since this is connected to all of your databases, this is likely a significant leak of PII and other sensitive information. This is easily a critical issue.

## Timeline

- **Report Filed**
- **2021-10-25** @ian: Seems the site is already offline which is impressive (not sure if intentional)! Regardless however this does also impact `jarvis.urbanclap.com` as well, i.e. you can just try `https://jarvis.urbanclap.com/reset/████████` to login as user ID 1 yet again.

███

Also I do want to note that while I noticed this might be out of scope, my automation found this issue without my involvement and thus my choices were either to know about it and not tell you or to tell you -- I hope we agree this was the right path!
- **Report Triaged**
- **Report Resolved**
- **Bounty Awarded**
- **2021-10-26** @ian: Thank you for the max bounty @karan_bansal_uc! Appreciate it.

I do not want to disclose this at the moment (as other companies also seem to be impacted), but would you be open to disclose this report in the future?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
