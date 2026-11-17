---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-certificate-validation
  - env/web
  - stack/node
substate: "resolved"
weakness: "Improper Certificate Validation"
enriched: true
date: 2020-02-06
submitted: 2019-11-26T16:10:02.298Z
bounty_usd: null
votes: 15
cve: "CVE-2019-15604"
program: "[[programs/nodejs|Node.js]]"
reporter: "rogierschouten"
source: "https://hackerone.com/reports/746733"
title: "Remotely trigger an assertion on a TLS server with a malformed certificate string"
---
# Remotely trigger an assertion on a TLS server with a malformed certificate string

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 15 | **Program:** Node.js | **Disclosed:** 2020-02-06

- Report: [https://hackerone.com/reports/746733](https://hackerone.com/reports/746733)
- CWE: Improper Certificate Validation | CVE: CVE-2019-15604
- Submitted: 2019-11-26T16:10:02.298Z

## Timeline

- **Report Filed**
- **Report Collaborator Invited**
- **Report Collaborator Joined**
- **Report Triaged**
- **Report Title Updated**
- **2020-01-16** @octetcloud: Can someone suggest the text to use for the CVE description? It must match this very specific format: `PROBLEM TYPE` in `PRODUCT/VERSION` causes `IMPACT` when `ATTACK`
- **2020-01-17** @mgroenhoff: What about  "Denial of service in Node.js vMINVERSION through vMAXVERSION causes an assertion and the process to abort when sending a crafted x509 certificate"? I am not sure about the versions though. We have tested this on only two specific versions but the range of effected versions is probably bigger.
- **2020-01-20** @octetcloud: In the post-release announcement, I can include a "Reported by Rogier Schouten." statement. Is that OK @rogierschouten , or would you prefer different text, or no credit at all?
- **2020-01-21** @rogierschouten: Can we do "Reported by Rogier Schouten and Melvin Groenhoff"?  Thank you!
- **2020-01-22** @octetcloud: cve requested: https://hackerone.com/nodejs/cve_requests/1402/edit
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
- **Bounty Awarded**
