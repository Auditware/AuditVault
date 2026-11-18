---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-request-forgery-csrf
  - env/web
  - vuln/csrf
substate: "resolved"
weakness: "Cross-Site Request Forgery (CSRF)"
enriched: true
body: true
date: 2019-03-26
submitted: 2018-03-09T19:33:21.827Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/pingidentity|Ping Identity]]"
reporter: "rijalrojan"
source: "https://hackerone.com/reports/323975"
title: "CSRF in Inviting users"
---
# CSRF in Inviting users

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Ping Identity | **Disclosed:** 2019-03-26

- Report: [https://hackerone.com/reports/323975](https://hackerone.com/reports/323975)
- CWE: Cross-Site Request Forgery (CSRF)
- Submitted: 2018-03-09T19:33:21.827Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the [square] sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to triage and respond quickly, so be sure to take your time filling out the report!

**Summary:** [add summary of the vulnerability]
When a user is invited, a GET request is made. This can be used with a CSRF attack. 

**Description:** [add more details about this vulnerability]
User invitations usually should be done through a POST request. In this case the app uses a GET request. For example: https://ort-admin.pingone.com/web-portal/ajax/user/directory/inviteuser/?alternate_email=rojan@netsecurity.tech&email=rojan@securifyinc.com
Which allows inviting another user easily. 

## Steps To Reproduce:

(Add details for how we can reproduce the issue)

  1. Download the attached html. 
  2. Open it in a logged in browser. 
  3. It should invite my email to the website. 
## Supporting Material/References:

  * List any additional material (e.g. screenshots, logs, etc.)

## Impact

Adding other users easily. Gives internal access.

The hacker selected the **Cross-Site Request Forgery (CSRF)** weakness. This vulnerability type requires contextual information from the hacker. They provided the following answers:

**URL**
https://ort-admin.pingone.com/web-portal/usermanagement#/

**Verified**
Yes

**Can a victim be forced to perform a sensitive state-change operation unknowningly?**
Yes

**What state-change operation can be performed?**
Adding users.

## Timeline

- **Report Filed**
- **2018-03-10** @bagofchips: Hey @uranium238,

Thanks for the report. We'll be looking into it and get back to you shortly.

Regards,
@bagofchips
- **Report Triaged**
- **2018-03-10** @rijalrojan: Sounds good. Thanks @bagofchips
- **2018-03-12** @rijalrojan: By the way, I forgot to give reasoning on why it was marked Critical:

When a user is added, they can use the SSO platform to easily login to any internal application of a company. This can be exploited easily and has a major impact on company's integrity so the CVSS reflects that.
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
