---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
  - vuln/privilege-escalation
  - trigger/admin-required
substate: "resolved"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
body: true
date: 2020-01-31
submitted: 2018-04-20T12:29:20.072Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "shawalkhan"
source: "https://hackerone.com/reports/341074"
title: "Bruteforce in admin panel"
---
# Bruteforce in admin panel

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Nextcloud | **Disclosed:** 2020-01-31

- Report: [https://hackerone.com/reports/341074](https://hackerone.com/reports/341074)
- CWE: Improper Restriction of Authentication Attempts
- Submitted: 2018-04-20T12:29:20.072Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello there,
Admin panel of your website (https://nextcloud.com/wp-login.php) is vulnerable to bruteforce attacks as their is no rate-limiting.

## Impact

Can gain access to admin panel.
To fix this, Just add rate limiting.

## Timeline

- **Report Filed**
- **2018-04-20** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **2018-05-03** @shawalkhan: Thanks for update.
Basically there are two ways to get the username, one is username enumeration at "https://nextcloud.com/wp-login.php?action=lostpassword". Bruteforcing the username like If you enter wrong username It'll appear Wrong username, It should be like, If the username or email exists, Confirmation link will be sent and other is getting it through scanning wp. 
I've got it and the username is "frank". 
So an attacker can easily get to the admin credentials by bruteforcing.
- **2018-05-05** @shawalkhan: Any update?
- **2018-05-09** @shawalkhan: Update?
- **2018-05-28** @shawalkhan: Its been a month sir? Any update?
- **2018-05-28** @bf6b121f3665ea0042e7dde: Hi @shawalkhan,

thanks for the report - we are already looking into ways how to avoid brute force problems on our website. Just a little heads up: the website is not covered by the bug bounty program, because the program only covers the software itself and not any hosted service by the Nextcloud GmbH.

Thus we recommend to check for security problems within our software itself.

Thanks for you work nevertheless.

Morris
- **Not Eligible For Bounty**
- **2018-07-25** @shawalkhan: [Vulnerable URL](https://nextcloud.com/wp-login.php?action=lostpassword)
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
