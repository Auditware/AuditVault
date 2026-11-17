---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-request-smuggling
  - env/web
substate: "resolved"
weakness: "HTTP Request Smuggling"
enriched: true
date: 2020-05-13
submitted: 2019-10-31T16:18:21.474Z
bounty_usd: 750
votes: 160
cve: []
program: "[[programs/gsa_bbp|GSA Bounty]]"
reporter: "puppykok"
source: "https://hackerone.com/reports/726773"
title: "HTTP Request Smuggling on https://labs.data.gov"
---
# HTTP Request Smuggling on https://labs.data.gov

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 160 | **Program:** GSA Bounty | **Disclosed:** 2020-05-13

- Report: [https://hackerone.com/reports/726773](https://hackerone.com/reports/726773)
- CWE: HTTP Request Smuggling
- Submitted: 2019-10-31T16:18:21.474Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2019-11-09** @gsa_adborden: Hello,

Thanks again for reporting this issue. We've deployed a [fix](https://github.com/GSA/datagov-deploy/pull/1095) for the Host injection and are working with our service provider to address the desync/HTTP Request Smuggling issue. We'll post updates as we make additional progress.
- **Bounty Awarded**
- **2019-11-14** @puppykok: Hello!

Thank you for the bounty! Looking forward to the fixes!
- **2020-01-30** @puppykok: Hi team,

Is this issue fixed?
- **2020-03-27** @puppykok: Hi all, I can confirm the site is not vulnerable to HTTP Request Smuggling anymore. Can we mark this issue as resolve? Thank you!
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
