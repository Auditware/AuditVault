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
date: 2023-03-25
submitted: 2022-12-15T13:18:55.408Z
bounty_usd: null
votes: 44
cve: []
program: "[[programs/us-department-of-state|U.S. Department of State]]"
reporter: "qualw1n"
source: "https://hackerone.com/reports/1806387"
title: "Accessing unauthorized administration pages and seeing admin password - speakerkit.state.gov"
---
# Accessing unauthorized administration pages and seeing admin password - speakerkit.state.gov

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 44 | **Program:** U.S. Department of State | **Disclosed:** 2023-03-25

- Report: [https://hackerone.com/reports/1806387](https://hackerone.com/reports/1806387)
- CWE: Improper Access Control - Generic
- Submitted: 2022-12-15T13:18:55.408Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
- I discovered an issue referred to as no-redirect in a subdomain on state.gov.
When you enter the page, it directs you directly to the entrance. When I examined it via burp suite, it gave 302 found, but the homepage data was showing below.
When I tried it as admin, it still gave 302 found, but this time we could see the content of the admin page.
this way i was able to see admin user and normal user's info.
I was also able to perform many transactions.
uploading files, adding categories and many more.

## Steps To Reproduce:
1- Login to https://speakerkit.state.gov/
- and it will throw you to the page named "spklogin". Using the find and replace feature on burpsuite, I told it to change all requests that gave 302 found to 200 Ok, and I easily performed my operations.
You will be able to do it when you watch the video.

## Supporting Material/References:
https://hackerone.com/reports/1026146
https://hackerone.com/reports/95441

  * [attachment / reference]

{F2078131}
{F2078132}
{F2078133}

* [ poc / video]
████████

## Impact

access the admin page. unauthorized.

## Timeline

- **Report Filed**
- **2022-12-15** @h1_analyst_charlie: Hi @qualwin3001,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_charlie
- **2022-12-15** @qualw1n: any update?
- **Report Severity Updated**
- **Report Title Updated**
- **2022-12-15** @h1_analyst_charlie: Hello @qualwin3001,

Thank you for your submission! We were able to validate your report, and have submitted it to the appropriate remediation team for review. They will let us know the final ruling on this report, and when/if a fix will be implemented. Please note that the status and severity are subject to change.

Thanks,
@h1_analyst_charlie
- **Report Triaged**
- **2022-12-15** @qualw1n: Thanks
- **2023-01-26** @qualw1n: Update?
- **Report Retesting**
- **2023-02-09** @qualw1n: Update?
- **User Completed Retest**
- **2023-02-11** @qualw1n: Update?
- **2023-02-12** @qualw1n: Update?
- **Report Retest Approved**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
