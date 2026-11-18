---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - vuln/csrf
  - impact/account-takeover
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2019-05-17
submitted: 2019-04-15T19:54:17.948Z
bounty_usd: null
votes: 80
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "tomoh"
source: "https://hackerone.com/reports/538800"
title: "Account takeover by changing email"
---
# Account takeover by changing email

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 80 | **Program:** Khan Academy | **Disclosed:** 2019-05-17

- Report: [https://hackerone.com/reports/538800](https://hackerone.com/reports/538800)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2019-04-15T19:54:17.948Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The endpoint `/signup/email` allows users to change their email before they confirm their account email. This endpoint is not protected from CSRF. Thus, any account that is not yet "confirmed" is vulnerable to account takeover using the following steps:
1. Attacker obtains new email address not associated with a KA account.
2. Attacker then lures a new KA user to visit a URL linking to a page that sends a `POST` request to `/signup/email` with the POST body : `casing=camel&email=ATTACKER_EMAIL`.
3. The email change will go through and the attacker would then be able to take over the unconfirmed account using password reset.
4. The original user would not be able to reclaim account since the original email is now not associated with any KA account.

## Impact

Attackers would be able to takeover any unconfirmed account on Khan Academy. And since unconfirmed users can participate in most activities on the website, this could lead to leakage of personal info. Since this ATO does not require any knowledge of the user's email address or KAID, it would become possible to launch large scale attacks by posting malicious links on forums or other places on the internet that KA users would visit.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2019-04-16** @tomoh: Hi @drosile,
Thanks for the fast response! I found this endpoint when testing the "Invite student by email" functionality. There was an option to change the account email after the student signs up. It's not shown to all new accounts, but nonetheless works for all unconfirmed accounts.
- **Report Resolved**
- **2019-04-17** @tomoh: Yes, this is fixed!
- **Agreed On Going Public**
- **Report Became Public**
