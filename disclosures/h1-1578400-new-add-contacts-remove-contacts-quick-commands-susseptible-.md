---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-stored
  - env/web
  - stack/gitlab
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Stored"
enriched: true
date: 2022-11-16
submitted: 2022-05-22T19:55:10.820Z
bounty_usd: 13950
votes: 93
cve: "CVE-2022-1948"
program: "[[programs/gitlab|GitLab]]"
reporter: "cryptopone"
source: "https://hackerone.com/reports/1578400"
title: "New /add_contacts /remove_contacts quick commands susseptible to XSS from Customer Contact firstname/lastname fields"
---
# New /add_contacts /remove_contacts quick commands susseptible to XSS from Customer Contact firstname/lastname fields

> **Severity:** High | **Bounty:** 13,950 USD | **Votes:** 93 | **Program:** GitLab | **Disclosed:** 2022-11-16

- Report: [https://hackerone.com/reports/1578400](https://hackerone.com/reports/1578400)
- CWE: Cross-site Scripting (XSS) - Stored | CVE: CVE-2022-1948
- Submitted: 2022-05-22T19:55:10.820Z

## Timeline

- **Report Filed**
- **2022-05-22** @cryptopone: I hit submit a bit too early and needed to edit a couple of items from the report:

### Examples
In addition to the examples above I created a group and project for this issue on GitLab.com - https://gitlab.com/customergroup/customerproject/-/issues/1

It should be possible to trigger this XSS by attempting to use /add_contacts or /remove_contacts in the comment field for this issue.

### What is the current *bug* behavior?
The HTML special characters are not escaped, allowing code to be executed when GitLab attempts to display a list of contacts to the user.

### What is the expected *correct* behavior?

The HTML special characters would be escaped and the popup would not run code from the first name or last name fields.
- **Report Needs More Info**
- **Report New**
- **Report Severity Updated**
- **Report Triaged**
- **Bounty Awarded**
- **2022-05-25** @gitlab-securitybot: ETA for fix:

Hi @cryptopone,

The issue you reported is currently scheduled to be fixed by 2022-06-30.

Thank you again for contacting us!

Best regards,
GitLab Security Team
- **Cve Id Added**
- **Report Resolved**
- **Bounty Awarded**
- **2022-06-20** @cryptopone: Thank you for the generous bounty! I can no longer reproduce the issue after the applied fix.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
