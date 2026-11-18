---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/web
  - vuln/authentication-bypass
  - impact/account-takeover
substate: "informative"
weakness: "Improper Authentication - Generic"
enriched: true
body: true
date: 2020-09-29
submitted: 2020-09-20T07:25:16.648Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "xcracker420"
source: "https://hackerone.com/reports/986459"
title: "Recently change email but still login with old email"
---
# Recently change email but still login with old email

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Nextcloud | **Disclosed:** 2020-09-29

- Report: [https://hackerone.com/reports/986459](https://hackerone.com/reports/986459)
- CWE: Improper Authentication - Generic
- Submitted: 2020-09-20T07:25:16.648Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team, 
I have been found vulnerability on email verification which can be account takeover (Authentication bypass)
Recently I have been change my email ████ but still login with old email ██████
--https://efss.qloud.my/index.php/settings/user

## Impact

Impact
If victim's email account is still logged into his/her old gmail account . Then any external attacker can use the unused same email for account takeover
https://efss.qloud.my/index.php/settings/user

## Timeline

- **Report Filed**
- **2020-09-20** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2020-09-22** @xcracker420: Is there any update?
- **Changed Scope**
- **2020-09-22** @nickvergessen: Hi @dream_changer can you make a screenshot of the index.php/settings/user/sharing page?
It should show your cloud id, and I guess that contains your old email address?
- **2020-09-22** @xcracker420: No, recently I have to change my gmail I’d but it takes sign with old id.

But still now you have to show that still login with old I’d like that:)
- **2020-09-22** @nickvergessen: Please see  index.php/settings/user/sharing

This shows your user id, and it is not your email address, unless you registered with your email address before.
- **2020-09-22** @xcracker420: Yes I have seen,there is also a new gmail I’d on the ⭕️ circle denoted .But if you change your gmail I’d account you have to take new Gmail I’d to login.


But the new I’d is seen on the personal information on the account but still login with old gmail.
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
