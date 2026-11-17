---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-authentication-generic
  - env/cloud
  - stack/kubernetes
  - stack/aws
substate: "resolved"
weakness: "Improper Authentication - Generic"
enriched: true
date: 2023-05-25
submitted: 2022-05-24T19:37:58.077Z
bounty_usd: 2500
votes: 68
cve: []
program: "[[programs/kubernetes|Kubernetes]]"
reporter: "0ria"
source: "https://hackerone.com/reports/1580493"
title: "Bypass validation parts in AWS IAM Authenticator for Kubernetes"
---
# Bypass validation parts in AWS IAM Authenticator for Kubernetes

> **Severity:** High | **Bounty:** 2,500 USD | **Votes:** 68 | **Program:** Kubernetes | **Disclosed:** 2023-05-25

- Report: [https://hackerone.com/reports/1580493](https://hackerone.com/reports/1580493)
- CWE: Improper Authentication - Generic
- Submitted: 2022-05-24T19:37:58.077Z

## Timeline

- **Report Filed**
- **2022-05-30** @h1_analyst_amey: Hi @gaffy,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@forest_dweller
- **2022-05-30** @h1_analyst_amey: Hi @gaffy,

We would like to inform you that we are going to take longer than usual to triage this report owing to setup required for the issue. We will let you know as soon as we have an update for you.

Please bear with us in the meantime. Thank you for your patience.

Cheers,
@forest_dweller
- **2022-06-01** @h1_analyst_amey: Hi @gaffy,

Just letting you know that we are still in the process of validating your report. Thank you for your patience.

Cheers,
@forest_dweller
- **2022-06-01** @0ria: Hi @forest_dweller, 

Thank you for the updates.
- **2022-06-03** @0ria: Vulnerability was validated by AWS.
Following their request for CVE details: Gafnit Amiga from Lightspin.

Have a great weekend!
- **Report Severity Updated**
- **2022-06-13** @mhausler: Hi Gafnit,

We're treating this as an [Tier 2](https://hackerone.com/kubernetes?type=team) [High](https://www.first.org/cvss/calculator/3.1#CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N). I need to allocate a 2022 block of CVE IDs for Kubernetes and then I'll reserve one and let you know the ID for this issue.

AWS is rolling out the fix you validated, and this will go through the rest of the month. As we get closer to the fix being deployed, I'll be in touch about a disclosure date, but it'll likely be early July.

Thank you!
- **2022-06-14** @0ria: Hi Micah, thank you for the update and severity correction.
- **2022-07-11** @mhausler: Hi Gafnit, we've allocated CVE-2022-2385 for this issue
- **Bounty Awarded**
- **2022-11-22** @0ria: Thank you for the reward!
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
