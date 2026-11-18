---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/wordpress
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
body: true
date: 2021-02-17
submitted: 2020-12-09T02:09:07.615Z
bounty_usd: null
votes: 48
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "ucuping"
source: "https://hackerone.com/reports/1054526"
title: "Stored XSS in wordpress.com"
---
# Stored XSS in wordpress.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 48 | **Program:** Automattic | **Disclosed:** 2021-02-17

- Report: [https://hackerone.com/reports/1054526](https://hackerone.com/reports/1054526)
- CWE: Cross-site Scripting (XSS) - Stored
- Submitted: 2020-12-09T02:09:07.615Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello Team,
I found the Stored XSS vulnerability in the Custom Style section, this vulnerability can result in an attacker to execute arbitrary JavaScript in the context of the attacked website and the attacked user. This can be abused to steal session cookies, performing requests in the name of the victim or for phishing attacks, by inviting the victim to become part of the manager or administrator.

## Platform(s) Affected:
wordpress.com

## Steps To Reproduce:
1. As an attacker, go to the feedback section, then go to the Polling section.
2. Add a new post or edit an existing post.
3. Scroll down, click All Styles.
4. Add a new Style.
5. Named the temporary style, click Save Style.
6. Change the Style Name with <noscript><p title= "</noscript><img src=x onerror=alert(document.cookie)>">, check the checkbox next to Save Style, click Save Style.
7. Script will be run.
8. Invite the victim in a way, go to manage then users.
9. Click invite, enter username or email, and send.
10. As a Victim, accept the attacker's invitation.
11. Go to the Feedback section.
12. Then go to the Polling section.
13. Add a new post or edit an existing post.
14. Scroll down, click All Styles.
15. Enter the Style that has been created by the previous Attacker.
16. Script will be run.

## Supporting Material/References:
F1109567
F1109568
F1109569

## Impact

this vulnerability can result in an attacker to execute arbitrary JavaScript in the context of the attacked website and the attacked user. This can be abused to steal session cookies, performing requests in the name of the victim or for phishing attacks, by inviting the victim to become part of the manager or administrator.

## Timeline

- **2020-12-09** @ucuping: In addition, the attacker must first register his account with crowdsignal, then connect wordpress to crowdsignal by entering feedback then entering the polling settings section, and entering the attacker's account to connect wordpress with crowdsignal and also checking the Allow the other users of your section. blog to use your Crowdsignal account. Only Authors, Editor or Admin users can access this data. Then click Link Account, then Activate Multi User Access, once activated, the victim will be able to see the Custom Style made by the attacker that has been entered in the script.
- **Report Filed**
- **2020-12-09** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **Report Triaged**
- **2020-12-09** @ucuping: Thanks for the acknowledgement.
- **2020-12-10** @ucuping: Hi,
Is there update?
- **2020-12-13** @ucuping: Any update?
- **2020-12-15** @ucuping: @xknown
- **Bounty Awarded**
- **2020-12-16** @ucuping: Thank you for the bounty
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
