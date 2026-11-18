---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-03-01
submitted: 2017-05-16T13:42:57.976Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "icewind1991"
source: "https://hackerone.com/reports/228825"
title: "(Authenticated) RCE by bypassing of the .htaccess blacklist"
---
# (Authenticated) RCE by bypassing of the .htaccess blacklist

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Nextcloud | **Disclosed:** 2020-03-01

- Report: [https://hackerone.com/reports/228825](https://hackerone.com/reports/228825)
- CWE: Code Injection
- Submitted: 2017-05-16T13:42:57.976Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

`Storage::copyFromStorage` doesn't check the content of a folder it copies against the list of blacklisted files.
Meaning that if a user has access to an external storage (inc. fed. shares) that contains a .htaccess file, he can move the .htaccess file to the local data directory.

The attack works on any nextcloud/owncloud since federated sharing was introduced that uses apache and has the data directory inside the webroot (as is default)

Steps to reproduce:
- Setup an evil instance (nc1) that has the file blacklist disabled (Filesystem.php line 616)
- create a folder 'sharefolder/attack' in nc1 with the following files
  - .htaccess configured to "allow from all"
  - attack.php with the desired attack
- Setup a non-evil instance (nc2) (or pick an existing nc instance that you want to attack)
- Federated share 'sharefolder' from nc1 to nc2
- In nc2, move 'sharefolder/attack' to 'attack' (outside the share)
- navigate to http://nc2/data/userid/files/attack/attack.php

## Timeline

- **Report Filed**
- **2017-05-16** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Severity Updated**
- **Report Triaged**
- **Not Eligible For Bounty**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
