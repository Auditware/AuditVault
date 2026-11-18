---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
substate: "not-applicable"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2019-03-22
submitted: 2019-03-21T12:23:11.399Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/phabricator|Phabricator]]"
reporter: "saidul_khan"
source: "https://hackerone.com/reports/513134"
title: "Issue:Form does not contain an anti-CSRF token"
---
# Issue:Form does not contain an anti-CSRF token

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Phabricator | **Disclosed:** 2019-03-22

- Report: [https://hackerone.com/reports/513134](https://hackerone.com/reports/513134)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2019-03-21T12:23:11.399Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

=============================
#Form does not contain an anti-CSRF token
=============================
--------------------------------------------------------------------------------------------------------------------
There are 15 instances of this issue ==>
/
/Z1336
/applications/
/auth/start/
/auth/start/
/book/phabricator/article/installation_guide/
/dashboard/
/dashboard/arrange/8/
/differential/
/diffusion/
/diffusion/commit/
/diffusion/commit/query/E1D1uHPOvfuP/
/feed/query/all/
/home/menu/view/245/
/maniphest/

--------------------------------------------------------------------------------------------------------------------
Issue Details ==>
Cross-site Request Forgery (CSRF) is an attack which forces an end user to execute unwanted actions on a web application to which he/she is currently authenticated. With a little help of social engineering (like sending a link via email / chat), an attacker may trick the users of a web application into executing actions of the attacker's choosing. A successful CSRF exploit can compromise end user data and may allow an attacker to perform an account hijack. If the targeted end user is the administrator account, this can compromise the entire web application.
--------------------------------------------------------------------------------------------------------------------
Issue remediation ==>
The application should implement anti-CSRF tokens into all requests that perform actions which change the application state or which add/modify/delete content. An anti-CSRF token should be a long randomly generated value unique to each user so that attackers cannot easily brute-force it.

It is important that anti-CSRF tokens are validated when user requests are handled by the application. The application should both verify that the token exists in the request, and also check that it matches the user's current token. If either of these checks fails, the application should reject the request. 
--------------------------------------------------------------------------------------------------------------------

## Impact

Cross-site Request Forgery (CSRF) is an attack which forces an end user to execute unwanted actions on a web application to which he/she is currently authenticated. With a little help of social engineering (like sending a link via email / chat), an attacker may trick the users of a web application into executing actions of the attacker's choosing. A successful CSRF exploit can compromise end user data and may allow an attacker to perform an account hijack. If the targeted end user is the administrator account, this can compromise the entire web application.

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **2019-03-21** @saidul_khan: Sorry.It was was a big mistake . Actually my first report in hackerone . So this is happened .
Sorry once again
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
