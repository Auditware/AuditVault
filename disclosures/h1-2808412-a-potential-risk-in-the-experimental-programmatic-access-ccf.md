---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/incorrect-privilege-assignment
  - env/cloud
  - stack/aws
  - vuln/broken-access-control
  - vuln/privilege-escalation
substate: "resolved"
weakness: "Incorrect Privilege Assignment"
enriched: true
body: true
date: 2024-11-06
submitted: 2024-10-29T05:49:06.184Z
bounty_usd: null
votes: 55
cve: []
program: "[[programs/aws_vdp|AWS VDP]]"
reporter: "zolaer9527"
source: "https://hackerone.com/reports/2808412"
title: "A potential risk in the experimental-programmatic-access-ccft which can be used to privilege escalation."
---
# A potential risk in the experimental-programmatic-access-ccft which can be used to privilege escalation.

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 55 | **Program:** AWS VDP | **Disclosed:** 2024-11-06

- Report: [https://hackerone.com/reports/2808412](https://hackerone.com/reports/2808412)
- CWE: Incorrect Privilege Assignment
- Submitted: 2024-10-29T05:49:06.184Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**  I found a potential risk in the experimental-programmatic-access-ccft when I deployed it in the AWS Serverless Application Repository. A malicious can leverage the "sts:AssumeRole" permissions for "*" resources to escalate permission.

**Description:**  The experimental-programmatic-access-ccft application creates a function named ExtractCarbonEmissionsFunction, and the associated role is assigned policies with permissions such as "sts:AssumeRole " for  "*"  resources. A malicious user can leverage the "sts:AssumeRole" permissions to assume into any AWS Account in the AWS Organization, resulting in privilege escalation. This poses a significant security risk to the account used to deploy the application.



## Remediation Instructions
1. Use finer-grained authorization policies to replace the AWS-managed policies. And use the specific resource names to replace the "*".
2. The permissions for STS resources should be removed if they do not affect normal functionality.
3. Add a permissions boundary to restrict the permission.

## Supporting Material/References:

* Indicate the Amazon service or product that this vulnerability occurs on: (AWS S3, Amazon Lambda, etc): Amazon Lambda

## Impact

## Summary:
A malicious user could leverage these permissions to escalate his/her privilege.

## Timeline

- **Report Filed**
- **2024-10-30** @h1_analyst_parveen: Hi @███,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@h1_analyst_parveen
- **Report Needs More Info**
- **2024-10-30** @samjab: This ticket will be linked to an existing report from the security inbox. Please forward to the AWS VDP program.
- **Report Pending Program Review**
- **Report Resolved**
- **Agreed On Going Public**
- **2024-10-31** @zolaer9527: Thank you for your support and effort in solving the problem!
- **Agreed On Going Public**
- **Report Became Public**
