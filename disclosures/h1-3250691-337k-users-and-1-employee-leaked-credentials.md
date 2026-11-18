---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/secrets-leak
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2025-09-10
submitted: 2025-07-14T08:17:42.260Z
bounty_usd: null
votes: 87
cve: []
program: "[[programs/khanacademy|Khan Academy]]"
reporter: "meowsint"
source: "https://hackerone.com/reports/3250691"
title: "337k users and 1 employee leaked credentials"
---
# 337k users and 1 employee leaked credentials

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 87 | **Program:** Khan Academy | **Disclosed:** 2025-09-10

- Report: [https://hackerone.com/reports/3250691](https://hackerone.com/reports/3250691)
- CWE: Information Disclosure
- Submitted: 2025-07-14T08:17:42.260Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hey Khan Academy,

So there's this website called "https://leakradar.io" while surfing this site i came across your website "https://www.khanacademy.org/" i found out there was huge amount of accounts were leaked there, one of them was a employee account which is valid.

url: https://www.khanacademy.org/login
mail: ███████
pass: ███

These are the credentials you can try, other than this there was 337.7k users account and some were added today to that website.

Also we can request the website for removal so if you want i can request for you to that site to remove all Khan Academy credentials.

I would like to suggest a feature "New device/location otp" so even if there's a leaked credentials an attacker would need a additional otp it will safe customers from being hacked and they will know someone is trying to login into their account so they will immediately change their passwords.

Kind regards
███

## Impact

Users account are being leaked which can leak Khan Academy's customers sensitive information

## Timeline

- **Report Filed**
- **Report Triaged**
- **2025-07-14** @meowsint: Hey @samhays_ka ,

Thank you for your fast response, i really appreciate your efforts yes i would love to receive Hacker badge that's why i just created account on Khan academy with the username "████████" glad i joined khan academy <3
- **2025-07-14** @samhays_ka: Thanks, the badge should be added to your account today!
- **2025-07-14** @meowsint: Hey @samhays_ka 

Thank you for the badge, it's indeed showing in my account and it looks amazing <3
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
