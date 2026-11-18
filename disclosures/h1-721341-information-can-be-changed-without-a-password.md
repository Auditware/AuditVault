---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/unverified-password-change
  - env/web
substate: "resolved"
weakness: "Unverified Password Change"
enriched: true
body: true
date: 2020-03-14
submitted: 2019-10-23T20:11:46.579Z
bounty_usd: null
votes: 25
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "jamesconnor"
source: "https://hackerone.com/reports/721341"
title: "Information can be changed without a password"
---
# Information can be changed without a password

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 25 | **Program:** Khan Academy | **Disclosed:** 2020-03-14

- Report: [https://hackerone.com/reports/721341](https://hackerone.com/reports/721341)
- CWE: Unverified Password Change
- Submitted: 2019-10-23T20:11:46.579Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

If a user has access to a logged in session on Khan Academy, they are able to conduct a full account takeover. This is due to the fact that a new email address can be added to an account without a method of re-authentication. Once this email address has been added, the attacker can simply logout and follow the "Forgot Password" dialogue on the login page to send a password reset email to the email address they added. This allows them to change the password and completely take over the account. While this could arguably be the user's fault for not logging out, Khan Academy specifically targets an audience of students and educators, many of whom may use their accounts on shared computers in school. As a result, it's necessary to require re-authentication before allowing modifications to certain user settings, such as the account's email addresses.

**Steps to reproduce**

1. Open a browser in which a user has previously logged into an account, but hasn't logged out.
2. Go to https://www.khanacademy.com/settings (the user settings)
3. Scroll down to "Connect an email", click the button, and type in any email address that you control. This simulates the attacker's email address. Finally, click "Send a Confirmation Email". 
4. Open the attacker's inbox and follow the instructions to reset the password. Change the password to whatever you want.
5. Click "Reset and Log In". The account has now been successfully taken over.

## Impact

An attacker can take over an account and lock a user out by resetting the password.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-10-24** @jamesconnor: No problem, happy to help. My username's @JamesEConnor. Thank you very much, I'm glad I was able to help resolve this issue!
- **2019-11-01** @drosile: Hi @jamesconnor,

I added the badge to your account! I'm working on the solution for this with the team; we want to make sure we cover all the use cases and get it right before rushing something out. Hopefully it won't be too much longer.

Thanks again!

Dave
- **2019-11-03** @jamesconnor: Thank you very much, glad to hear that a solution's in the works! I totally understand the desire to cover all use cases and I appreciate the work you're putting into it. Thanks again!

James
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
