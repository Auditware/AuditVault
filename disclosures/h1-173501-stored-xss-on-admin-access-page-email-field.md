---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
body: true
date: 2017-08-02
submitted: 2016-10-02T11:36:03.419Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/revive_adserver|Revive Adserver]]"
reporter: "pavanw3b"
source: "https://hackerone.com/reports/173501"
title: "Stored XSS on Admin Access Page - Email field"
---
# Stored XSS on Admin Access Page - Email field

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** Revive Adserver | **Disclosed:** 2017-08-02

- Report: [https://hackerone.com/reports/173501](https://hackerone.com/reports/173501)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2016-10-02T11:36:03.419Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

"Cricetinae" :)

###Short Description

The **Email** field is not sanitized on **Inventory > Admin Access** page resulting in to Stored Cross-Site Scripting vulnerability.

###Vulnerability Details

Cross-Site Scripting issue let's one to run a javascript of choice. It helps most of the client side risks including but not limited to phishing, temporary deface, browser key-logger and others. Exploitation frameworks like BeEF eases the offensive attack.

Stored XSS is more risky than the reflected ones because of the fact that the malicious script is persisted across. It can affect all the time and all the users who has the access to the page.

### Attack Vector
As this is a stored XSS, the attack vector lies in one user phishing other users. If there are multiple administrators, one admin can get a javascript backdoor on another admin's browser.

### Steps to Reproduce
To effectively illustrate one user affect another user, please create 2 admin accounts and follow the below instruction:
* Login as `admin1`. Navigate to **Preferences** *>* **Change E-mail**
* Enter the current password and `admin1@example.com<script>alert('xss');</script>` for *Email address* field. Save and logout
* Login as `admin2`. 
* Navigate to **Inventory** *>* **Admin Access** and notice the alert box.

Attached screenshot for a reference.

### Test Environment Details
Version: Latest as on Oct 2: revive-adserver-4.0.0 downloaded from the official source
Setup type: local
Browser: Firefox 47.0
OS: Mac OS X


Cheers,
Pavan

## Timeline

- **Report Filed**
- **Report Triaged**
- **Report Severity Updated**
- **2016-12-11** @pavanw3b: Hey @mbeccati any update about closing this report?
- **2016-12-28** @mbeccati: We're sorry for the delay. You will find the fix attached.

We're also happy to report that the release date for 4.0.1 has been set to January the 18th.
- **2016-12-28** @pavanw3b: Thanks for the update.
- **2017-01-29** @fornax: Release has been bumped to Jan 31st, but we complete most of the release testing this weekend, so we should be on track for a release in a couple of days now!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
