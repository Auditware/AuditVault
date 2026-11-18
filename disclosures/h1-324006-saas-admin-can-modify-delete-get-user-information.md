---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
body: true
date: 2019-03-26
submitted: 2018-03-09T22:01:02.670Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/pingidentity|Ping Identity]]"
reporter: "rijalrojan"
source: "https://hackerone.com/reports/324006"
title: "SaaS admin can modify/delete/get user information."
---
# SaaS admin can modify/delete/get user information.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Ping Identity | **Disclosed:** 2019-03-26

- Report: [https://hackerone.com/reports/324006](https://hackerone.com/reports/324006)
- CWE: Privilege Escalation
- Submitted: 2018-03-09T22:01:02.670Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the [square] sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to triage and respond quickly, so be sure to take your time filling out the report!

**Summary:** [add summary of the vulnerability]
Based on what is seen, SaaS admin should not have access to users info from this page: https://ort-admin.pingone.com/web-portal/usermanagement#/ however, it is still able to get the info on that page. 

**Description:** [add more details about this vulnerability]
When we go to https://ort-admin.pingone.com/web-portal/usermanagement#/, it returns an error that says: `You are not authorized to view that page.`. This means it is blocking certain user permissions like SaaS admin. 

But the Ajax link that retrieves user info on that page does not check for the permission and gives out detail info of the users. 


## Steps To Reproduce:

(Add details for how we can reproduce the issue)

  1. Make sure you are the SaaS administrator on that page and not a Global Admin. If you do not have a SaaS admin account, you can create one at: https://ort-admin.pingone.com/web-portal/account/administratorsng
  2. Go to https://ort-admin.pingone.com/web-portal/ajax/user/directory/users/?advancedSearch=false&ascendingSort=true&count=100&searchString=&sortField=name.familyName&startIndex=1&statusFilter=

## Supporting Material/References:

  * List any additional material (e.g. screenshots, logs, etc.)

## Impact

Leaking user information for under privileged user.

## Timeline

- **Report Filed**
- **2018-03-09** @rijalrojan: We might want to change the CVSS for that. Based on what I saw now, because that endpoint also results in leak of uniqueid, we can change the info of those users like removing them: https://ort-admin.pingone.com/web-portal/ajax/user/directory/deleteuser/?userId=<userid>
- **Report Title Updated**
- **2018-03-10** @bagofchips: Hey @uranium238,

Thanks for the report. We'll be looking into it and get back to you shortly.

Regards,
@bagofchips
- **Report Triaged**
- **2018-03-10** @rijalrojan: Sounds good. Thanks @bagofchips
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
