---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/csrf
  - impact/sensitive-data
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2020-11-18
submitted: 2020-08-04T22:54:00.128Z
bounty_usd: null
votes: 32
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "bugra"
source: "https://hackerone.com/reports/951292"
title: "Site-wide CSRF at Atavist "
---
# Site-wide CSRF at Atavist 

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 32 | **Program:** Automattic | **Disclosed:** 2020-11-18

- Report: [https://hackerone.com/reports/951292](https://hackerone.com/reports/951292)
- CWE: N/A
- Submitted: 2020-08-04T22:54:00.128Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hi team,
I have a Atavist Magazine account. And there are no CSRF tokens on account settings.

For example ;
- When changing email (there is a user ID but they are sequential) : {F936597}

- Deleting credit card : {F936618}

- Cancelling subscription : https://magazine.atavist.com/cms/ajax/cancel_subscription.php?product_id=com.theatavist.atavist.subscription.membership - this endpoint sends an email with `We'll Miss You` title, but it doesn't cancel the subscription. (this is not related to CSRF, there is a CSRF but the endpoint is weird :-D)

I didn't want to create report for each endpoint, because this is a site-wide issue. I think you can add a header for root fix.

## Impact

Site-wide CSRF 

Thanks,
Bugra

## Timeline

- **Report Filed**
- **2020-08-04** @bugra: I selected `High` severity because this can lead to account takeover too (changing email), feel free to set severity.
- **2020-08-05** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **2020-09-30** @bugra: @xknown We passed 2 months. Did you investigate the report?
- **2020-11-05** @xknown: Hi @bugra, we are still working on this issue. I'll ping the Atavist team again, and I'll let you know once I have a more information to share.
- **Report Resolved**
- **Bounty Awarded**
- **2020-11-16** @bugra: Thanks!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
