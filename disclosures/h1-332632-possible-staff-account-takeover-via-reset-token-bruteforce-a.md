---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/weak-password-recovery-mechanism-for-forgotten-password
  - env/web
  - vuln/csrf
  - impact/account-takeover
  - impact/credential-theft
  - fix/authentication-hardening
substate: "resolved"
weakness: "Weak Password Recovery Mechanism for Forgotten Password"
enriched: true
body: true
date: 2018-09-19
submitted: 2018-04-03T15:53:55.674Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/bohemia|BOHEMIA INTERACTIVE a.s.]]"
reporter: "europa"
source: "https://hackerone.com/reports/332632"
title: "(Possible) staff account takeover via reset token bruteforce at helpdesk.bistudio.com"
---
# (Possible) staff account takeover via reset token bruteforce at helpdesk.bistudio.com

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 29 | **Program:** BOHEMIA INTERACTIVE a.s. | **Disclosed:** 2018-09-19

- Report: [https://hackerone.com/reports/332632](https://hackerone.com/reports/332632)
- CWE: Weak Password Recovery Mechanism for Forgotten Password
- Submitted: 2018-04-03T15:53:55.674Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

As stated in a brief exchange with @rvn in my other report ##312433, I might have found a logic flaw in the way https://helpdesk.bistudio.com handles the reset flow and tokens.
I've asked if it was possible to obtain a test account, but I fully understand that it's something that cannot be done; as such I'll submit a "blind" report based on my black-box analysis and wait for your team to verify it. Also note that this flaw seems to also be present in the "Set out of office email response" flow, albeit less critical.

### Flow
The **SYSTEM PASSWORD RESET** flow is a 3-steps process:

1. the staff member requests a SMS TOKEN using the first form
2. the 6-digits SMS TOKEN is used in the second form
3. the staff member can now set a new SYSTEM PASSWORD in the third form

### Analysis and logic
I was able to go through the process even after providing non-existing usernames and tokens by intercepting the **response** in BurpSuite and changing the status code from **400 Bad Request** to **200 OK** and the body from `"status":"error"` to `"status":"ok"`, allowing the AngularJS applet to follow through.
I then noticed that the API endpoint for verifying the SMS TOKEN and changing the password where open and free of rate-limiting measures, allowing for a quick bruteforce of the 000000-999999 space. 
It should be therefore possible to perform an account takeover on any staff member, provided the SMS TOKEN really is a 6-digits code

### Theoretical POC
1. adversary starts the SYSTEM PASSWORD RESET process for the target victim using a POST request to `/api/system/verification-codes` (ie: `{"username":"admin"}`). The backend generates a SMS TOKEN and sends it to the victim's phone. Meanwhile,
2. adversary obtains the **securityCode** value for the victim by bruteforcing `/api/system/verification-codes/[0-9]{6}` before the victim can cancel the flow (threat scenario places the attack durin night time)
3. adversary can now reset the SYSTEM PASSWORD by sending the complete POST request to `/api/system/email-account/password` (ie: `{"password":"<NEW PASSWORD>","code":"<BRUTEFORCED SMS TOKEN>","securityCode":"<RETRIEVED SECURITY CODE>"}`)

Step #1 offers a ReCAPTCHA anti-CSRF token but it's not used anywhere in the flow, making the attack possible

Step #2 is really a matter of resources. Being free of rate-limiting, the API endpoint will be quickly queried for all the possible token combinations in a matter of minutes using a multithreaded approach (ie: using BurpSuite's Intruder).

Albeit theoretical, the logic behind the threat scenario seems plausible. It might be worth investigating.

### Recommended actions
Properly implement the ReCAPTCHA and a strict ratelimiting on the API endpoints

## Impact

An adversary might be able to takeover staff accounts, or set their "out of office" email replies.

## Timeline

- **Report Filed**
- **2018-04-04** @rvn: Thanks for the report, we will check it out.
- **Report Triaged**
- **Bounty Awarded**
- **2018-04-04** @europa: Glad I was able to blindly help!
Thanks for the reward, I remain available for further testing
Cheers!
- **Report Resolved**
- **2018-04-05** @europa: First of all, thank you again for the highest reward!

I just tested and it's still "working":
* the ReCAPTCHA value isn't  checked in the flow, the X-XSRF-TOKEN header can be omitted and the flow will still go through
* the `/api/system/email-account/password` API endpoint isn't rate-limited, allowing me to send as many requests as I want (I tried with 1,000)
Has the fix been deployed in production already?
- **2018-04-05** @rvn: Captcha isn't that necessary anymore as now you have a fix amount of tries before the account gets locked. Sending further requests is possible but will not have any effect. There is a side issue related to this that is being fixed right now but overall it should be resolved
- **2018-04-05** @europa: Alrighty, should be good as long as it's not used to purposely lock staff accounts. Cheers!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
