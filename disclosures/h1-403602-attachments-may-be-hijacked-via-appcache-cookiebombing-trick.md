---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2020-11-26
submitted: 2018-08-31T18:58:43.094Z
bounty_usd: null
votes: 57
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "hudmi"
source: "https://hackerone.com/reports/403602"
title: "Attachments may be hijacked via AppCache+CookieBombing trick (bc3_production_blobs bucket)"
---
# Attachments may be hijacked via AppCache+CookieBombing trick (bc3_production_blobs bucket)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 57 | **Program:** Basecamp | **Disclosed:** 2020-11-26

- Report: [https://hackerone.com/reports/403602](https://hackerone.com/reports/403602)
- CWE: Business Logic Errors
- Submitted: 2018-08-31T18:58:43.094Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **2018-09-01** @rosa: Thanks for this report, @hudmi! We'll have a look on Monday and will let you know.
- **Report Triaged**
- **2018-09-02** @hudmi: ok
- **Bounty Awarded**
- **2018-09-07** @hudmi: Thanks!
- **2018-10-12** @rosa: Hi @hudmi!

Sorry for the wait while we worked on this, and thanks for your patience. In the end, this was significantly more laborious than we thought, mainly due to how Google Cloud Storage works and our implementation. Fortunately, we believe we have now mitigated this. Could you please verify whether you can still reproduce this kind of attack?

Thank you!
- **2018-10-13** @hudmi: Confirmed
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
