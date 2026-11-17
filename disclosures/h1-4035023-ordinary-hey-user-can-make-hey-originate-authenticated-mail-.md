---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2026-10-20
submitted: 2026-09-17T00:29:22.354Z
bounty_usd: null
votes: 44
cve: []
program: "[[programs/basecamp|Basecamp]]"
reporter: "gachikuku"
source: "https://hackerone.com/reports/4035023"
title: "Ordinary HEY user can make HEY originate authenticated mail from attacker-selected @hey.com  addresses"
---
# Ordinary HEY user can make HEY originate authenticated mail from attacker-selected @hey.com  addresses

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 44 | **Program:** Basecamp | **Disclosed:** 2026-10-20

- Report: [https://hackerone.com/reports/4035023](https://hackerone.com/reports/4035023)
- CWE: Improper Access Control - Generic
- Submitted: 2026-09-17T00:29:22.354Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2026-09-17** @gachikuku: You can use test@kamil.gr to test further 

```
  Account type: Other / Custom IMAP
  Email: test@kamil.gr
  Username: test@kamil.gr
  Password: ████████
  Incoming mail:
  Protocol: IMAP
  Server: mail.kamil.gr
  Port: 993
  Security: SSL/TLS
  Authentication: Password
  IMAP path prefix: blank

  Outgoing mail:
  Protocol: SMTP
  Server: mail.kamil.gr
  Port: 465
  Security: SSL/TLS
  Authentication required: Yes
  Username: test@kamil.gr
  Password: ████████

  Fallback SMTP configuration:
  Port: 587
  Security: STARTTLS
```
- **Report Triaged**
- **Report Severity Updated**
- **Report Severity Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2026-09-18** @gachikuku: Thank you :)
- **Agreed On Going Public**
- **Report Became Public**
- **2026-10-31** @jeremy: Hi @gachikuku, a heads-up after disclosure: one of your comments and the attached `poc.py` contained what look like the passwords of your Basecamp test accounts. We've redacted the comment and made the attachments internal. Please change those passwords (or delete the test accounts) if you haven't already. Thanks!
