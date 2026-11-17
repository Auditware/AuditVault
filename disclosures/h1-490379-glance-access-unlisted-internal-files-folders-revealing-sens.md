---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-exposure-through-directory-listing
  - env/web
  - stack/node
substate: "resolved"
weakness: "Information Exposure Through Directory Listing"
enriched: true
date: 2019-02-28
submitted: 2019-02-02T15:32:02.524Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "skyn3t"
source: "https://hackerone.com/reports/490379"
title: "[glance] Access unlisted internal files/folders revealing sensitive information"
---
# [glance] Access unlisted internal files/folders revealing sensitive information

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** Node.js third-party modules | **Disclosed:** 2019-02-28

- Report: [https://hackerone.com/reports/490379](https://hackerone.com/reports/490379)
- CWE: Information Exposure Through Directory Listing
- Submitted: 2019-02-02T15:32:02.524Z

## Timeline

- **Report Filed**
- **2019-02-02** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2019-02-04** @skyn3t: Agreed! Thanks for the correction.
- **External User Joined**
- **2019-02-09** @skyn3t: Hi,
Is there anything else I can help with?
- **2019-02-17** @jarofghosts: Thanks for the report, sorry it took a while to get around to this! I have published glance@3.0.7 that includes a fix for this vulnerability, as well as dependency upgrades to resolve known vulnerabilities.
- **2019-02-17** @jarofghosts: I have also marked all versions prior to 3.0.7 as deprecated on npm
- **2019-02-18** @skyn3t: I was able to verify the fix works!
- **2019-02-20** @skyn3t: @marcinhoppe looks like this can be resolved and disclosed now.
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
