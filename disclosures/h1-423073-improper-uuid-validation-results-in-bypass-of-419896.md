---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-input-validation
  - env/web
substate: "resolved"
weakness: "Improper Input Validation"
enriched: true
body: true
date: 2018-10-25
submitted: 2018-10-12T19:18:06.645Z
bounty_usd: null
votes: 82
cve: []
program: "[[programs/security|HackerOne]]"
reporter: "popeax"
source: "https://hackerone.com/reports/423073"
title: "Improper UUID validation results in bypass of #419896"
---
# Improper UUID validation results in bypass of #419896

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 82 | **Program:** HackerOne | **Disclosed:** 2018-10-25

- Report: [https://hackerone.com/reports/423073](https://hackerone.com/reports/423073)
- CWE: Improper Input Validation
- Submitted: 2018-10-12T19:18:06.645Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

This was found while evaluating the vulnerability and patch identified in #419896.  I determined the deployed patch to be effective.  However, I noticed tracer values could be sent which didn't conform to the UUID specification as characters outside of the a-f and 0-9 ranges could be used.  For example, a value such as "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzzzz" was accepted by the server as valid.  Likely this indicates a problem with a regex filter that needs to be slightly changed.  

Steps
1. Navigate to a program which allows anonymous submissions.
2. Open the report submission form and add an attachment.
3. Observe the request sent to /attachments includes a client side generated UUID in the tracer field.
4. Replay the request from step 3.  Use an invalid UUID (e.g. "zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzzzz") for the tracer and observe the server accepts the value.

## Impact

The impact is unknown, but it is believed to have a cascading side effect.  I was asked to submit this by @jobert.

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Severity Updated**
- **Report Title Updated**
- **Report Resolved**
- **Report Vulnerability Types Updated**
- **Bounty Awarded**
- **Agreed On Going Public**
- **Manually Disclosed**
