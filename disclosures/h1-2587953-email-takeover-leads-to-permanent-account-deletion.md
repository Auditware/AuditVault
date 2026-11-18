---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - impact/account-takeover
  - trigger/victim-interaction
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2024-07-19
submitted: 2024-07-06T12:38:35.355Z
bounty_usd: null
votes: 26
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "prakhar0x01"
source: "https://hackerone.com/reports/2587953"
title: "Email Takeover leads to permanent account deletion"
---
# Email Takeover leads to permanent account deletion

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 26 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2024-07-19

- Report: [https://hackerone.com/reports/2587953](https://hackerone.com/reports/2587953)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2024-07-06T12:38:35.355Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hii Triager,

**NOTE: Just to clarify, I reported a similar issue yesterday, but it was on a different endpoint. _In this report, the vulnerable domain is the same, but the endpoint is different._**

I found that an attacker can change their email address to the victim's(existing user) email, which then leads to permanent account deletion of the victim's account.

User-A: Attacker
User-B: Victim

Both User-A & User-B are registered user & have their separate accounts on `https://www.██████████/852585B6003EBA25/CreateAccount.html`

## Impact

- Possible Account Takeover (Probably)
- Permanent Account Deletion
- Improper Authentication on change email functionality.

## System Host(s)
www.█████████

## Affected Product(s) and Version(s)


## CVE Numbers


## Steps to Reproduce
1 - Login to Attacker's account, User-A (`attacker@email.com`)
2 - Login to Victim's Account, User-B (`victim@email.com`)
3 - In the Attacker's account, Navigate to the `Change Your Email Address` section.
4- Change the **Attacker's email** to **`victim@email.com`**. You can successfully take over the victim's email. (probably victim account)
5 - Now, Try to login as victim account(with victim email & password) , Application will Return Invalid Credentials

 - This is the indication of an **Email Takeover of the victim's account**

6 - Now, Navigate to the Attacker's account & change the email back to `attacker@email.com`
7 - Navigate to the Registration page, Enter the victim's email `victim@email.com` & click `Check Availability`. You'll see that the victim's email is deleted from the DB & available for a new account.

- This is the indication of **Permanent deletion of the Victim's account. **

## Video PoC

████

## Suggested Mitigation/Remediation Actions
- Set proper authentication on the Update Profile functionality.

## Timeline

- **Report Filed**
- **2024-07-06** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **2024-07-06** @prakhar0x01: Hii,

As DoD mentioned RateLimit/Bruteforcing is OOS. However, I found an **IDOR vulnerability that can be CHAINED with RATE-LIMIT** and leads to 0-Click Account Takeover, can I report it?

Regards,
@prakhar0x01
- **Report Needs More Info**
- **Report New**
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Triaged**
- **2024-07-08** @prakhar0x01: Hii @redwingreaper 

Can you please also look into #2587844

Thanks
@prakhar0x01
- **Report Severity Updated**
- **2024-07-08** @prakhar0x01: Hii @redwingreaper 

Could you please provide a specific reason for reducing the severity?

Regards,
@prakhar0x01
- **Report Severity Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
