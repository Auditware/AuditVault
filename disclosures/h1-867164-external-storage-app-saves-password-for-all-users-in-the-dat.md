---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/storing-passwords-in-a-recoverable-format
  - env/web
substate: "resolved"
weakness: "Storing Passwords in a Recoverable Format"
enriched: true
date: 2021-03-01
submitted: 2020-05-06T13:13:40.888Z
bounty_usd: null
votes: 3
cve: "CVE-2020-8296"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "alacn1"
source: "https://hackerone.com/reports/867164"
title: "External storage app saves password for all users in the database"
---
# External storage app saves password for all users in the database

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Nextcloud | **Disclosed:** 2021-03-01

- Report: [https://hackerone.com/reports/867164](https://hackerone.com/reports/867164)
- CWE: Storing Passwords in a Recoverable Format | CVE: CVE-2020-8296
- Submitted: 2020-05-06T13:13:40.888Z

## Timeline

- **Report Filed**
- **2020-05-06** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2020-05-06** @alacn1: the password is saved by:
apps/files_external/lib/Lib/Auth/Password/LoginCredentials.php:
OCA\Files_External\Lib\Auth\Password\LoginCredentials::authenticate()

there is no check if the user has any mount with "Log-in credentials, save in database" option.
- **2020-05-07** @nickvergessen: I forwarded your report to the correct people.
- **2020-05-08** @icewind1991: Hello,

you are correct that the credentials should only be saved when a relevant mount is configured.

One issue I can see is that this means that a newly configured storage wont be usable in background jobs/cli for the applicable users until they are active again. Which can lead to unexpected behaviour if an admin tries to do something like running the filescanner for a newly configured mount.

I'll look into the best way to fix this issue and come back once I have some code
- **Report Triaged**
- **2020-05-27** @nickvergessen: Pull request: https://github.com/nextcloud/server/pull/21037
- **Not Eligible For Bounty**
- **Report Resolved**
- **2021-02-02** @alacn1: Name: Anderson Luiz Alves
Email: alacn1@gmail.com
- **Report Title Updated**
- **2021-02-10** @nickvergessen: Pending SA: https://nextcloud.com/security/advisory/?id=NC-SA-2021-006
Pending CVE: CVE-2020-8296
Scheduled date: 22nd Feb
- **Agreed On Going Public**
- **Manually Disclosed**
