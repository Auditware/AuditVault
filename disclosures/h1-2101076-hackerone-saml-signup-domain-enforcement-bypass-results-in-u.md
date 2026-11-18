---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-null-termination
  - env/web
  - trigger/one-click
  - trigger/victim-interaction
substate: "resolved"
weakness: "Improper Null Termination"
enriched: true
body: true
date: 2024-02-04
submitted: 2023-08-08T12:05:55.858Z
bounty_usd: null
votes: 228
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "0xacb"
source: "https://hackerone.com/reports/2101076"
title: "HackerOne SAML signup domain enforcement bypass results in unauthorized access to HackerOne PullRequest organization"
---
# HackerOne SAML signup domain enforcement bypass results in unauthorized access to HackerOne PullRequest organization

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 228 | **Program:** HackerOne | **Disclosed:** 2024-02-04

- Report: [https://hackerone.com/reports/2101076](https://hackerone.com/reports/2101076)
- CWE: Improper Null Termination
- Submitted: 2023-08-08T12:05:55.858Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**

SAML signup domain enforcement for new signups that belong to a SAML-enabled organization can be bypassed with trailing control characters. While the described issue affects all organizations with this feature enabled, it's possible to leverage it to access the PullRequest HackerOne organization, giving a real attacker access to HackerOne source code in Pull Requests.

**Description:**

When signing up on hackerone.com, email domains enforced by HackerOne SSO are not allowed for regular registration. The request to `/POST users` returns a redirect to the SSO provider:

```
POST /users HTTP/1.1
Host: hackerone.com
...

user%5Bname%5D=[NAME]&user%5Busername%5D=[USERNAME]&user%5Bemail%5D=email%40example.com&user%5Bpassword%5D=[PASSWORD]&user%5Bpassword_confirmation%5D=[PASSWORD]
```

```json
{"redirect_path":"/users/saml/sign_in?email=email%40example.com"}
```

However, adding a `%0d%0a` in the end of the email param will make the request go through:

```
POST /users HTTP/1.1
Host: hackerone.com
...

user%5Bname%5D=[NAME]&user%5Busername%5D=[USERNAME]&user%5Bemail%5D=email%40example.com%0d%0a&user%5Bpassword%5D=[PASSWORD]&user%5Bpassword_confirmation%5D=[PASSWORD]
```

```json
{"redirect_path":"/users/sign_in","errors":{}}
```

Then, logging in with the actual email `email@example.com` will work, but email verification is then enforced. Accessing the account will work if the email owner clicks on the HackerOne standard verification email sometime in the future.

Since hackerone.com is a domain part of a SAML-enabled organization itself, if an attacker creates multiple accounts that will send legitimate verification emails to `@hackerone.com` users and one clicks it, accessing PullRequest via `Sign in with HackerOne` on https://app.pullrequest.com/login, will then allow source code access.

The following steps were followed along with @jobert to create a `j@hackerone.com` account that will then allow access to PullRequest:

{F2581722}

### Steps To Reproduce

1. Go to https://hackerone.com 
2. Signup as the attacker with a `@hackerone.com` email you control, e.g. `x@hackerone.com` or `x+test@hackerone.com`, notice that this will redirect you to the SSO login
3. Try to signup again and intercept the request to `POST /users` and add the `%0d%0a` in the end of the email parameter
4. As the victim, click the confirmation email in a separate session
5. As the attacker on the original session, log in with the password you chose for the account
6. Go to https://app.pullrequest.com/login and click `Sign in with HackerOne`
7. You'll have access to all pull requests of HackerOne infrastructure codebase, including source code access

## Impact

An attacker can bypass the signup SAML enforcement for any organization on HackerOne, including HackerOne organization itself which leads to source code access. Verifying the email is the only interaction step, but an actual attack could be feasible.

On the other hand, when SAML accounts are provisioned for any organization, the previous sessions are revoked, but not API keys. So an attacker who can pre-stage an account on HackerOne and generate API keys will keep backdoor access to the account until the API keys are rotated explicitly by the victim, which could mean forever for specific accounts that will never rotate the API keys.

## Suggested mitigations

- Correctly strip and normalize the email address that is being processed in the signup endpoint to check if SAML is enforced
- Don't give access to anyone with an `@hackerone.com` email address to PullRequest without manual approval or account flags

## Notes:

- No source code was stored locally while performing this testing
- The accounts created while testing were `j@hackerone.com` and `0xacb@hackerone.com`
- The `0xacb@hackerone.com` was created around 18 months ago - I didn't realize any impact until now after showing this behavior to @jobert during h1-702-2023

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Severity Updated**
- **Report Triaged**
- **Report Retesting**
- **User Completed Retest**
- **Report Retest Approved**
- **Report Resolved**
- **Bounty Awarded**
- **2023-09-04** @0xacb: That's absolutely fair! Thank you @jobert, loved to work on this report.

Wanted to let you know that the `j@hackerone.com` account still works, please delete it!
- **2023-09-27** @zerotea: I made an internal support ticket to get this account deleted so this comment is not forgotten. :) Thank you for flagging that!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2024-02-04** @quantum_love: Boa ideia, fiz o pedido de disclosure!
- **Bounty Awarded**
- **Bounty Awarded**
- **2024-05-10** @0xacb: It's amazing how HackerOne keeps surprising hackers.
Thank you so much for doing this!
