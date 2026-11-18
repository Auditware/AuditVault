---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "informative"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2020-10-05
submitted: 2020-05-04T14:12:42.165Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "lawsoul"
source: "https://hackerone.com/reports/865777"
title: "Bypass hide download Nextcloud Share"
---
# Bypass hide download Nextcloud Share

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Nextcloud | **Disclosed:** 2020-10-05

- Report: [https://hackerone.com/reports/865777](https://hackerone.com/reports/865777)
- CWE: Business Logic Errors
- Submitted: 2020-05-04T14:12:42.165Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
Hello everyone, accidentally browsing through nextcloud, I have found a small vulnerability on nextcloud server. This vulnerability allow download the file when the download function has been hidden
Here is the error details.
If anything is wrong please respond to me. Thanks you.
## Description
I sharing folder for another ( download not hide)
{F814529}
{F814531}
Of course, the download function is still enabled, I will have the download request as below
{F814536}
I then disabled download on the entire file folder  
{F814542}
{F814546}
But the download link created on the server does not change or change the permissions, I can completely download the file to continue
{F814548}
{F814549}
{F814552}

## Platform(s) Affected:
Nextcloud Server

## Impact

Sensitive documents after sharing that do not allow downloading will be reloaded even if disabled, for anyone

## Timeline

- **Report Filed**
- **2020-05-04** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Informative**
- **2020-05-05** @lawsoul: This not only works with images or videos as you think, it works with all types of file formats, I have tested this, such as .zip, .rar ..etc
As for photos and videos, it might be normal, but what about other files?
- **Agreed On Going Public**
- **Manually Disclosed**
