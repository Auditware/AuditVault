---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/ui-redressing-clickjacking
  - env/web
substate: "resolved"
weakness: "UI Redressing (Clickjacking)"
enriched: true
body: true
date: 2022-05-20
submitted: 2022-05-18T01:43:11.809Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/lemlist|lemlist]]"
reporter: "scriptsavvy"
source: "https://hackerone.com/reports/1574017"
title: "Clickjacking at  app.lemlist.com"
---
# Clickjacking at  app.lemlist.com

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 13 | **Program:** lemlist | **Disclosed:** 2022-05-20

- Report: [https://hackerone.com/reports/1574017](https://hackerone.com/reports/1574017)
- CWE: UI Redressing (Clickjacking)
- Submitted: 2022-05-18T01:43:11.809Z

## Report summary

Clickjacking at app.lemlist.com
Account Takeover, Account Deletion and Password Change

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hi team,

While performing security testing of your website i have found the vulnerability called Clickjacking.
Many URLS are in scope and vulnerable to Clickjacking.

What is Clickjacking ?

Clickjacking (User Interface redress attack, UI redress attack, UI redressing) is a malicious technique of tricking a Web user into clicking on something different from what the user perceives they are clicking on, thus potentially revealing confidential information or taking control of their computer while clicking on seemingly innocuous web pages.

The server didn't return an X-Frame-Options header which means that this website could be at risk of a clickjacking attack. The X-Frame-Options HTTP response header can be used to indicate whether or not a browser should be allowed to render a page in a <frame> or <iframe>. Sites can use this to avoid clickjacking attacks, by ensuring that their content is not embedded into other sites.
This vulnerability affects Web Server.


Vulnerable Urls:
=============

https://app.lemlist.com

Put every above url one by one in the code of iframe, which is given below
```javascript
<html lang="tr-TR">
<kafa>
<meta karakter kümesi="UTF-8">
<title>Çerçeve Yapıyorum</title>
</head>
<body>
<h3>clickjacking güvenlik açığı</h3>
<iframe src="https://app.lemlist.com/teams/tea_sgYr5dZr478x4FQ9K/settings/user/usr_Z3GZ4DDHLLyLyZHj5/users" height="550px" width="700px"></iframe>
</body>
</html>
```

## Impact

Using a similar technique, keystrokes can also be hijacked. With a carefully crafted combination of stylesheets, iframes, and text boxes, a user can be led to believe they are typing in the password to their email or bank account, but are instead typing into an invisible frame controlled by the attacker.

## Timeline

- **2022-05-18** @scriptsavvy: Reproducible: My report contains clear, concise steps to reproduce the vulnerability.
Impact: My report describes exactly what outcome an attacker would reasonably achieve.
In Scope: I have carefully reviewed the lemlist security page
- **Report Filed**
- **Report Severity Updated**
- **Report Triaged**
- **Report Severity Updated**
- **2022-05-20** @alban75: X-Frame-Options was already set, see https://geekflare.com/tools/tests/bi5y7ifec
Issue is only valid for file:// path
Fix for file:// in progress
- **Report Resolved**
- **Agreed On Going Public**
- **2022-05-20** @scriptsavvy: not important :)
- **Agreed On Going Public**
- **Report Became Public**
- **2023-06-17** @scriptsavvy: Hi , can you hide sensitive information (undisclosed bounty amount) from the report ??
