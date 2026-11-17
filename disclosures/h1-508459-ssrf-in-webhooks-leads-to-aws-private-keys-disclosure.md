---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/server-side-request-forgery-ssrf
  - env/cloud
  - stack/aws
substate: "resolved"
weakness: "Server-Side Request Forgery (SSRF)"
enriched: true
date: 2019-06-28
submitted: 2019-03-12T14:32:57.330Z
bounty_usd: null
votes: 214
cve: []
program: "[[programs/omise|Omise]]"
reporter: "honoki"
source: "https://hackerone.com/reports/508459"
title: "SSRF in webhooks leads to AWS private keys disclosure"
---
# SSRF in webhooks leads to AWS private keys disclosure

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 214 | **Program:** Omise | **Disclosed:** 2019-06-28

- Report: [https://hackerone.com/reports/508459](https://hackerone.com/reports/508459)
- CWE: Server-Side Request Forgery (SSRF)
- Submitted: 2019-03-12T14:32:57.330Z

## Timeline

- **Report Filed**
- **2019-03-13** @hardymansen: Hi,
Thanks for your report!
We are working to verify your findings and will update the report once completed. 

Thank you for your research!
Omise Security
- **Report Triaged**
- **Report Severity Updated**
- **2019-03-14** @honoki: Hi @dhawal - I'd be interested to hear the reasoning that leads to lowering the impact rating of this vulnerability. I would like to stress that having read access to the AWS metadata is usually considered as "critical" based on the fact that it provides access to a range of sensitive details, of which the demonstrated keys are only one example.

Please note that I stopped looking after providing a sample of the AWS private keys as I believed them to be a sufficient POC to demonstrate impact, but that there is likely a lot of other sensitive information that an attacker can read using this vulnerability.

Best regards,
Pieter
- **Bounty Awarded**
- **Report Resolved**
- **2019-03-15** @honoki: I can still reply. :) Thanks for the explanation - I think that reasoning makes sense.
- **Agreed On Going Public**
- **2019-06-28** @hardymansen: That is fine.
- **2019-06-28** @honoki: I believe you need to select Agree somewhere
- **Agreed On Going Public**
- **Report Became Public**
