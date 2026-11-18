---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2025-01-31
submitted: 2024-02-01T12:00:29.598Z
bounty_usd: null
votes: 88
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "aliyueka"
source: "https://hackerone.com/reports/2342461"
title: "Improper Access Controls(Admin Path)"
---
# Improper Access Controls(Admin Path)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 88 | **Program:** MTN Group | **Disclosed:** 2025-01-31

- Report: [https://hackerone.com/reports/2342461](https://hackerone.com/reports/2342461)
- CWE: Improper Access Control - Generic
- Submitted: 2024-02-01T12:00:29.598Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Go to https://nin.mtn.ng/ then click on "Check your NIN Link Status" then right click and click on "Inpect" and admin path is display at  web browser ../wp-admin/admin-ajax.html

## Steps To Reproduce:
STEP 1:
Go to https://nin.mtn.ng/
{F3021640}

STEP 2:
Click on "Check your NIN Link Status" 
{F3021641}

STEP 3:
Right click at the top of the page(On MTN Yellow Bar) and  then click on "Inspect"
{F3021642}
../wp-admin/admin-ajax.html
Admin Path

## Impact

1.) View Sensitive Information
2.) Steal Customers details
3.) Install backdoor
4.) Access different Components
5.) Alter System

## Timeline

- **Report Filed**
- **Report Triaged**
- **2024-02-08** @aliyueka: Hello Team, is there any updates because i was trying to check if the bug exist or not but it seems bug has been fixed by the team.
Please let me know, if there any updates
- **2024-02-19** @aliyueka: Any Update please
- **2024-03-09** @aliyueka: You're not responding!!!
- **2024-04-12** @aliyueka: Good Day, I have not received a respond from you.
- **2024-04-19** @slydingdong1: Admin Path has been removed from the web browser, please test
- **2024-04-20** @aliyueka: Yes, it has been solved.
- **Report Resolved**
- **2024-12-31** @aliyueka: Can you disclose this report?
- **Agreed On Going Public**
- **Report Became Public**
