---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/crlf-injection
  - env/network
substate: "resolved"
weakness: "CRLF Injection"
enriched: true
date: 2022-11-08
submitted: 2021-05-18T07:33:54.133Z
bounty_usd: 5000
votes: 72
cve: []
program: "[[programs/aiven_ltd|Aiven Ltd]]"
reporter: "jarij"
source: "https://hackerone.com/reports/1200647"
title: "Grafana RCE via SMTP server parameter injection"
---
# Grafana RCE via SMTP server parameter injection

> **Severity:** Critical | **Bounty:** 5,000 USD | **Votes:** 72 | **Program:** Aiven Ltd | **Disclosed:** 2022-11-08

- Report: [https://hackerone.com/reports/1200647](https://hackerone.com/reports/1200647)
- CWE: CRLF Injection
- Submitted: 2021-05-18T07:33:54.133Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-05-20** @staaldraad_aiven: Hi @lugtag 

Thank you for another good submission :)

We are going to make an exception and treat this as a newly reported bug, even though we had already identified this and several other parameters as vulnerable shortly after fixing the previously reported issue.

For what it is worth, the `username` and `from_name` parameters are also vulnerable (although with the username you need to use a shorter payload).

We are currently working on a larger fix that will address not only these individual parameters, but also provide stronger validation by default. This work is ongoing and we definitely look forward to you testing the fix to see if you can find a bypass :)

I'll post updates to this report as they become available.

Again, great find and thanks again for reporting!
- **2021-05-20** @jarij: Hey, @staaldraad_aiven

Glad to hear! Sure, I will continue testing for these types of bugs when the fix is deployed.

BR,
@jarij
- **Bounty Awarded**
- **2021-05-24** @staaldraad_aiven: Hey @jarij 

Just a quick update, along with the bounty, we have a first line fix waiting to deploy. We are still working on further defence in depth measures, but with this fix we believe the issue should be fixed soon.

Best,
Etienne
team Aiven
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
