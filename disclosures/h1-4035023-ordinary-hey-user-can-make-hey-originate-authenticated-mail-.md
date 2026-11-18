---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - trigger/social-engineering
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

  An ordinary HEY user can add an attacker-selected `@hey.com` identity as an external sender using
  unrelated, attacker-controlled SMTP credentials.

  If the temporary external-account object is deleted immediately after enqueue, HEY delivers the
  queued message through its first-party infrastructure while retaining the claimed identity.

  With Basecamp security/triage authorization, I reproduced this as:

  `The HEY Team <support@hey.com>`

  The message was sent only to my owned Gmail and iCloud accounts. I did not authenticate to, access,
  or contact the actual support mailbox.

  ## Proof of concept

  This is the exact command used:

  ```bash
  python3 poc.py \
    --attacker 5669.9127.8238@hey.com \
    --attacker-password="$(gopass show -o com.hey.app.ios/5669.9127.8238@hey.com)" \
    --spoof support@hey.com \
    --sender-contact-name "The HEY Team" \
    --subject "The HEY Team authorized PoC" \
    --message "Authorized inert PoC for HEY sender authorization; no action requested." \
    --recipient alneihzen@gmail.com \
    --recipient gachikuku@icloud.com \
    --smtp-host mail.kamil.gr \
    --smtp-user test@kamil.gr \
    --smtp-password="$(gopass show -o mail/kamil.gr/test)" \
    --authorization-reference BASECAMP-RETEST-001 \
    --confirm-authorized-scope
  ```

  The PoC:

  1. Authenticates as the ordinary attacker HEY account.
  2. Creates a temporary external account claiming `support@hey.com` using the unrelated
  `test@kamil.gr` SMTP credentials.
  3. Enqueues one inert message using `support@hey.com` as the acting sender.
  4. Deletes the temporary external account before asynchronous dispatch.
  5. Confirms cleanup and revokes the temporary session.

  No `support@hey.com` password or mailbox access is used.

  ## Observed result

  Both owned recipients received the message in Inbox displaying:

  - From: `The HEY Team <support@hey.com>`
  - Subject: `The HEY Team authorized PoC`
  - Body: `Authorized inert PoC for HEY sender authorization; no action requested.`

  The server-side evidence recorded:

  - Temporary external-account object: `286484`
  - Existing protected support sender/contact: `217762979`
  - Accepted message request: `e0d53752-61a8-420d-b6c4-a383aa32f9a9`
  - One message submission and one deletion
  - Deletion approximately `0.797` seconds after submission
  - Confirmed removal of the temporary external account
  - Zero writes or deletions against HEY's protected support Contact

  A separate raw-EML reproduction using my owned `hackerone.control.c@hey.com` account confirmed the
  same delivery path produced:

  - Exact claimed address in `From` and `Return-Path`
  - No `Sender` or `Reply-To`
  - HEY DKIM signature `d=hey.com; s=heymail`
  - SPF, DKIM, and DMARC pass
  - Gmail and iCloud Inbox placement

  Keeping the external-account object caused delivery through the configured relay. Deleting it before
  dispatch caused HEY first-party delivery while retaining the claimed HEY identity.

  ## Expected result

  HEY should reject any attempt to configure an `@hey.com` sender that does not belong to the
  authenticated account.

  If sender authorization disappears after enqueue, delivery should be cancelled rather than fall back
  to HEY's infrastructure while retaining and signing the unauthorized identity.

  ## Impact

  This allows an ordinary HEY user to impersonate another HEY user or a trusted service identity such
  as:

  `The HEY Team <support@hey.com>`

  The attacker needs no password, session, or mailbox access for the impersonated identity. Because
  HEY itself delivers the message, recipient systems can treat the unauthorized identity as
  authenticated `hey.com` mail.

  This breaks HEY's per-user sender-authorization boundary and enables highly credible phishing using
  HEY's own support identity.

*Email spoofing is in scope for HEY based on [Program guidelines](https://hackerone.com/basecamp?type=team)*

### PoC attachments

  - Standalone PoC script: ████████
  - Video demonstration: ████████

  ████████

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
