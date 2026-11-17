---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/information-exposure-through-directory-listing
  - env/web
  - stack/node
substate: "resolved"
weakness: "Information Exposure Through Directory Listing"
enriched: true
date: 2018-03-13
submitted: 2018-01-24T19:02:23.144Z
bounty_usd: null
votes: 15
cve: "CVE-2018-3718"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "0xchr00t"
source: "https://hackerone.com/reports/308721"
title: "[serve] Directory listing and File access even when they have been set to be ignored."
---
# [serve] Directory listing and File access even when they have been set to be ignored.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js third-party modules | **Disclosed:** 2018-03-13

- Report: [https://hackerone.com/reports/308721](https://hackerone.com/reports/308721)
- CWE: Information Exposure Through Directory Listing | CVE: CVE-2018-3718
- Submitted: 2018-01-24T19:02:23.144Z

## Timeline

- **Report Filed**
- **2018-01-24** @vdeturckheim: Hey @digitalwizard ,

Thanks a lot for reporting this to us, I will look at this issue shortly and keep you updated!
- **Report Triaged**
- **2018-01-24** @0xchr00t: Wow, that was a very swift response :)
And no, I did not contact Leo. I thought doing it through this program would be a better option and it'll keep all the discussion in one place.
- **2018-01-24** @vdeturckheim: @digitalwizard perfect, we always ask in order to know if we should contact the maintainers ourselves. I invited him a few minutes ago :)
- **Cve Id Added**
- **2018-02-13** @0xchr00t: Hi @vdeturckheim ,
Has there been an update on this?
- **2018-02-15** @vdeturckheim: @digitalwizard sadly no. I will ping him back.
- **2018-03-04** @vdeturckheim: I pinged Zeit team as @lirantal suggested.
- **External User Joined**
- **External User Joined**
- **2018-03-04** @matheus: Hi @digitalwizard and @vdeturckheim,

Thank you for reporting and for your patience.

I apologize for the misunderstanding – security is our topmost priority and this should have been handled as soon as we were first notified about it.

We can reproduce the issue and a fix will be out in the next 24h. Will keep you posted here.
- **2018-03-04** @vdeturckheim: Awesome, thanks @matheus
- **2018-03-04** @matheus: @digitalwizard,

@timn just submitted a fix and proper tests for this issue: https://github.com/zeit/serve/pull/341

We'd like you to review it before we release it. Thank you!
- **2018-03-05** @0xchr00t: Great job @matheus ,
The PR by @timn fixes the issue.
- **External User Joined**
- **2018-03-05** @notquiteleo: Thank you for reporting this, @digitalwizard!

The fix was just released with the latest update: https://github.com/zeit/serve/releases/tag/6.5.2
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Report Severity Updated**
