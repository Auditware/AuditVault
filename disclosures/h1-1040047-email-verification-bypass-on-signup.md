---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/violation-of-secure-design-principles
  - env/web
substate: "resolved"
weakness: "Violation of Secure Design Principles"
enriched: true
body: true
date: 2020-12-03
submitted: 2020-11-21T09:29:57.967Z
bounty_usd: null
votes: 127
cve: []
program: "[[programs/automattic|Automattic]]"
reporter: "farhan0x00"
source: "https://hackerone.com/reports/1040047"
title: "Email Verification bypass on signup"
---
# Email Verification bypass on signup

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 127 | **Program:** Automattic | **Disclosed:** 2020-12-03

- Report: [https://hackerone.com/reports/1040047](https://hackerone.com/reports/1040047)
- CWE: Violation of Secure Design Principles
- Submitted: 2020-11-21T09:29:57.967Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
This bug is related to wordpress.com. There is feature in wordpress.com which allow users to invite people. We have to enter email address to invite that particular person but the invite link and invite key is also available to the person who invited. This allow attackers to create the profile without having access to the email address and they can make account on behalf of any people who  is not already signed up in wordpress.com

## Platform(s) Affected:
wordpress.com
public-api.wordpress.com

## Steps To Reproduce:
This issue can be reproduced by following these easy steps: 
* Login to your account on wordpress.com
* Setup burpsuite proxy with browser.
* Select your site and navigate to manage>people
* Enter any email address which is not already registered in wordpress.com and invite
* Open this url in browser: https://wordpress.com/people/invites/yoursite.wordpress.com   [change yoursite.wordpress.com with your site]
* See the burp suite proxy tab and find the GET request to this endpoint [https://public-api.wordpress.com/rest/v1.1/sites/siteId_here/invites?http_envelope=1&status=all&number=100]     [there will be a number instead of siteId_here]
* In response of this GET request you will see JSON which will be consisting of the details about the invitations sent and there you will find "invite_key" and "link".
* Copy the link and open this in another browser.
* You can create account on behalf of this email without having access to the email and email verification is bypassed :)

**See the attached video for POC**

## Mitigation:
This is the pure violation of secure design principles, this can be mitigated by just removing the [invite_key] and [link] from the response in [https://public-api.wordpress.com/rest/v1.1/sites/siteId_here/invites?http_envelope=1&status=all&number=100]. Because this invite key and link is the property of the person being invited, showing these creds to other people will result this type of issue.

## Impact

This issue can be used to bypass email verification on signup. Attackers can create account on behalf on any person without having access to the email account. This issue is affecting integrity of the wordpress.com

## Timeline

- **2020-11-23** @farhan0x00: Hi,
Is this program really dead? or just pretending to be dead. Anyone out there?
- **Report Filed**
- **2020-11-23** @xknown: Thank you for your submission. Your report will be reviewed and we'll get back to you shortly.
- **Report Triaged**
- **2020-11-23** @farhan0x00: Thanks for the acknowledgement.
- **2020-11-25** @farhan0x00: any update?
- **2020-11-30** @xknown: Hi @haqsek2, this should be now fixed for new invitations. Can you please see if you are still able to reproduce this issue?
- **2020-11-30** @farhan0x00: Hi, I have tried to reproduce it and I confirm that this issue has been fixed.
Thanks
- **Report Resolved**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
