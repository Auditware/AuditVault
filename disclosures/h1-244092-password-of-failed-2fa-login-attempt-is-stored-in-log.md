---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/plaintext-storage-of-a-password
  - env/web
substate: "resolved"
weakness: "Plaintext Storage of a Password"
enriched: true
body: true
date: 2020-03-01
submitted: 2017-06-28T19:13:38.872Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "maprambo"
source: "https://hackerone.com/reports/244092"
title: "Password of failed (2FA) login attempt is stored in log"
---
# Password of failed (2FA) login attempt is stored in log

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Nextcloud | **Disclosed:** 2020-03-01

- Report: [https://hackerone.com/reports/244092](https://hackerone.com/reports/244092)
- CWE: Plaintext Storage of a Password
- Submitted: 2017-06-28T19:13:38.872Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

If I try to log in on Webdav with my usual Nextcloud password, it doesn't work due to 2FA. I need an application password.

The password of a failed login attempt by any user is stored plain text in the log:
`[...]OCA\\\\DAV\\\\Connector\\\\Sabre\\\\Auth->validateUserPass('matthes', '***THE_PASSWORD***')[...]`

Even though the login attempt failed, the password is the right password. I am using two factor, but still, the password may not be leaked to anyone. It may also be used for other websites or services, like LDAP. And you can disable 2FA and still use the same password. The log is in some cases visible to multiple people, may it be admins (but who shouldn't have access to the user data) or if the file is just sent to someone else for debugging.

## Timeline

- **Report Filed**
- **2017-06-28** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2017-06-29** @nickvergessen: Patch at https://github.com/nextcloud/server/pull/5557

Thanks for your report.
- **Swag Awarded**
- **Report Triaged**
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Report Became Public**
