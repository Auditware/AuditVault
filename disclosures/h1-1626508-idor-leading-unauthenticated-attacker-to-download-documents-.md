---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2024-06-27
submitted: 2022-07-05T14:44:29.678Z
bounty_usd: 500
votes: 77
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "berserker22"
source: "https://hackerone.com/reports/1626508"
title: "IDOR leading unauthenticated attacker to download documents discloses PII of users and soldiers via https://www.█████████/Download.aspx?id= [HtUS]"
---
# IDOR leading unauthenticated attacker to download documents discloses PII of users and soldiers via https://www.█████████/Download.aspx?id= [HtUS]

> **Severity:** High | **Bounty:** 500 USD | **Votes:** 77 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-06-27

- Report: [https://hackerone.com/reports/1626508](https://hackerone.com/reports/1626508)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2022-07-05T14:44:29.678Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hey team, I have found this API endpoint leads to leaking attachments and documents of users. The attachments leaked are banks taxes, contracts, PII such as full address and mobile number, emails, etc. The vulnerable URL is at [https://www.████████/Download.aspx?id=4675]

##Steps To Reproduce:
[add details for how we can reproduce the issue]

  1. Go to this URL [https://www.█████████/Download.aspx?id=4675]
  2. Add any desired id 
  3. then you will see a variety of sensitive files and contracts which contain PIIs and other classified documents

## Impact

An unauthenticated attacker is able to obtain PII of users and soldiers also an attacker is able to leak classified documents

## Timeline

- **Report Filed**
- **2022-07-06** @h1_analyst_indy: Hi @berserker1999,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@chapeau
- **Report Severity Updated**
- **Report Title Updated**
- **Report Triaged**
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
