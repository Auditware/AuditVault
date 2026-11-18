---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2025-06-03
submitted: 2025-05-20T15:52:48.865Z
bounty_usd: null
votes: 244
cve: []
program: "[[programs/mozilla|Mozilla]]"
reporter: "z3phyrus"
source: "https://hackerone.com/reports/3154983"
title: "IDOR: Account Deletion via Session Misbinding – Attacker Can Delete Victim Account"
---
# IDOR: Account Deletion via Session Misbinding – Attacker Can Delete Victim Account

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 244 | **Program:** Mozilla | **Disclosed:** 2025-06-03

- Report: [https://hackerone.com/reports/3154983](https://hackerone.com/reports/3154983)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2025-05-20T15:52:48.865Z

## Report summary

An IDOR vulnerability was identified in the Firefox Accounts API endpoint `https://api.accounts.firefox.com/v1/account/destroy` that allows an authenticated attacker using SSO (i.e Google login) to delete a user's account using their email address if they are also registered using SSO. The server fails to verify that the session making the deletion request belongs to the account being deleted.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
A critical vulnerability in the Firefox Accounts API allows an authenticated attacker to permanently delete any user's account by sending a `POST /v1/account/destroy` request using attacker session, but including the victim’s `email` and `authPW` (password hash) in the JSON payload. The server fails to verify that the session making the request belongs to the account being deleted.

## Steps To Reproduce:
1. Login to the victim's account.
{F4367852}

2. Use Burp Suite to intercept a request to the endpoint https://api.accounts.firefox.com/v1/account/destroy when deleting the account. Capture the JSON body, for example:
```
{
"email": "victims344@gmail.com",
"authPW": "42b4c2940fe2efecce851a2d8e9754d0f1cb1d37e3ccaabb060f9ac21900caff"
}
```
███████

3. Then cancel the request (don't let it reach the server).

4. Login to the attacker's account.
████████

5. Again, use Burp Suite to intercept a request to the same endpoint https://api.accounts.firefox.com/v1/account/destroy when deleting the account. Send it to the Repeater and cancel the request.
██████

6. In the attacker's request, replace the JSON body with the victim's harvested data:
```
{
"email": "victims344@gmail.com",
"authPW": "42b4c2940fe2efecce851a2d8e9754d0f1cb1d37e3ccaabb060f9ac21900caff"
}
```
Send the request.
{F4367860}

7. The server accepts the request and deletes the victim's account, even if it was from the attacker's session.
{F4367861}

## Impact

**==Allows attackers to delete victim accounts without permission.==**

## Timeline

- **Report Filed**
- **2025-05-21** @h1_analyst_mayuresh: Hello @z3phyrus,

Thank you for your submission! 

Your report has passed the preliminary analyst review and is now being assessed in depth. Our team is working to validate and reproduce the issue, evaluating its accuracy and security impact. 

Please note that this does not confirm validation - the status may change after further review. 

We’ll keep you updated as the process moves forward. Have a great day!
Thanks,
@h1_analyst_mayuresh
- **Report Informative**
- **Report Reopened**
- **Report Pending Program Review**
- **Report Severity Updated**
- **2025-05-23** @z3phyrus: Hi Team,

I now want to update my new findings about this vulnerability.

So, If the Victim user login using SSO without changing his password. Attacker can delete the victim account that login with SSO without setting a password by creating an account that login with SSO without setting a password.

##POC

Prepare:
1. Attacker account that login using SSO without setting a password
2. Victim account that login using SSO without setting a password.

1. Attacker Login using SSO
2. Use Burpsuite intercept to intercept the request then try to delete the account to get a request on the endpoint https://api.accounts.firefox.com/v1/account/destroy. Send to the repeater and cancel the request.
██████

3. go to the repeater and change the email parameter to the victim's email (victims344@gmail.com).
{F4377991}

4. send the request and see if the attacker can delete the victim account that login using SSO without knowing the credentials.
{F4377995}

**The conclusion of my new finding is that Attacker can delete fellow users who login using SSO without resetting password just through user email without access to victim credentials.**
- **2025-05-23** @z3phyrus: This is my POC recording
███████
- **2025-05-23** @z3phyrus: With my new finding. can I get an update for the severity level ? 

because I think this is not a low vulnerability
- **2025-05-23** @frida-k: in this step:
>Victim account that login using SSO without setting a password.

the attacker would need access to the victim's gmail account, to be able to generate the authPW parameter.

We will assess the final severity after the issue is accepted in the bug bounty panel.
- **2025-05-23** @z3phyrus: no attacker does not need access to victim's gmail. attacker only needs victim's gmail name not access to victim's gmail
- **2025-05-23** @frida-k: Ok I can see what you mean now, yes I agree that this would increase the severity of the issue. Thanks.
- **Report Triaged**
- **2025-05-24** @z3phyrus: ## 🛡️ CVSS Scoring Justification (Request for Severity Update)

Based on CVSS v3.1, I would like to request a severity update for this finding. Below is the scoring analysis:

CVSS:3.0/AV:N/AC:L/PR:L/UI:N/S:C/C:N/I:H/A:L
Base Score: 9.3 (Critical)

### Key Points:
- **Attack Vector (AV:N):** Exploitable remotely via API call.
- **Attack Complexity (AC:L):** Requires no special conditions.
- **Privileges Required (PR:L):** Attacker only needs a normal SSO account.
- **User Interaction (UI:N):** No user interaction is required.
- **Scope (S:C):** Account deletion affects multiple systems sharing SSO.
- **Integrity (I:H) & Availability (A:L):** Victim's account is permanently deleted, affecting service access.

Given the cross-domain impact via SSO and the ability to delete other users' accounts without credentials, this should be rated as **Critical severity (9.3)**.

I kindly request a review and severity adjustment based on this analysis. Thank you!
- **2025-05-26** @z3phyrus: Hello team, how are you? I hope you are all well. So, the Critical 9.3 severity request that I made is based on my findings that can delete users who only log in using SSO. I hope the severity of my new findings can be updated as soon as possible. Thank you
- **Report Severity Updated**
- **Bounty Awarded**
- **2025-05-27** @z3phyrus: Wow, thank you very much for the bounty. This is my first time getting a bounty this big :)
- **Report Resolved**
- **Agreed On Going Public**
- **2025-06-02** @frida-k: Hello @z3phyrus , the team do not have concerns for disclosing the report. We are working on establishing a disclosure cadence on the first and third Tuesday of every month, so I will work on disclosing the report tomorrow. Thanks.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
