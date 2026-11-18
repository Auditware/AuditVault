---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
  - trigger/low-priv-user
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
body: true
date: 2021-03-01
submitted: 2020-12-18T12:53:55.658Z
bounty_usd: null
votes: 8
cve: "CVE-2021-22877"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "alexanderhofstaetter"
source: "https://hackerone.com/reports/1061591"
title: "Acting under any different user via DB-stored credentials"
---
# Acting under any different user via DB-stored credentials

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Nextcloud | **Disclosed:** 2021-03-01

- Report: [https://hackerone.com/reports/1061591](https://hackerone.com/reports/1061591)
- CWE: Improper Access Control - Generic | CVE: CVE-2021-22877
- Submitted: 2020-12-18T12:53:55.658Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The issue is related to all Nextcloud versions. It is not patched yet. All versions (18-20) seems to be vulnerable. The issue came up in the following environment:

- nextcloud docker image (20.0.2 and 20.0.3)
- LDAP authentication
- external SMB shares via DB stored credentials

The problem came up after several users could not access their mounted SMB shares. When I checked, what was going on, it seems that DB credentials are getting stored from the session (table `oc_storages_credentials`) to the DB. The problem is, that there is no check if the current user in the session is the same as the user for whom the credentials get stored.

It seems that the credentials saved in the corresponding table (`oc_storages_credentials`) are wrong and therefore all SMB shares are showing errors.

When I initially add the external storage SMB mounts in the settings and then a user logs in the first time, the SMB shares work (with the correct login) which gets correctly saved in the DB.

Afterwards I can find one single entry on the `oc_storages_credentials`-table

However, when I (as an admin) navigate to: `https://cloud.example.org/settings/users` the table `oc_storages_credentials` gets (pre)populated with all the users (and some random credentials) - this also includes all users who weren´t logged-in yet. When the user logs in afterwards the credentials entry is already there and does not get updated.

### Steps to reproduce
1. Add external SMB mount with option "credentials saved in database"
2. Manually check the MYSQL table `oc_storages_credentials` - it should be empty
3. As an admin: navigate to (`/settings/users`) 
4. Recheck the MYSQL table `oc_storages_credentials` - there is an entry for every user now
5. The stored credentials in the DB are now the admin credentials
6. user can act as the admin user (their LDAP / AD password is stored in `oc_storages_credentials` for every user

### Expected behaviour
1. Do not populate the table `oc_storages_credentials` on "user list settings page"
2. If the current user credentials does not match the ones in the DB -> update it

### Actual behaviour
- `password::logincredentials/credentials` entries are getting deployed initially from the admin user ...

### Bugfix / Patch

There should be two files affected:
- `/apps/files_external/lib/Lib/Auth/Password/LoginCredentials.php`
- `/apps/files_external/lib/Listener/StorePasswordListener.php`


It looks like there is a form of wrong impersonation going on here. -> The git-Diff for a security conform bugfix is attached.

### Server configuration

I am using this docker image (no modifications): https://github.com/nextcloud/docker/tree/master/.examples/dockerfiles/full/fpm-alpine

**Operating system:** Docker on Ubuntu 20.04.1 LTS
**Web server:** nginx with php-fpm
**Database:** mariadb 10.5 as docker container
**PHP version:** 7php .4
**Nextcloud version:** 20.0.2
**Updated from an older Nextcloud/ownCloud or fresh install:** updated from nextcloud 18.0.11 -> 19.0 -> 20.0.3
**Where did you install Nextcloud from:**

## Impact

- Acting as a different user (as admin credentials are stored for every user in the DB)
- get a normal user account and accessing SMB shares on the network with higher privileges as himself
- getting access to internal ressources via external shared links

## Timeline

- **Report Filed**
- **2020-12-18** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **2020-12-18** @nickvergessen: Public report from https://github.com/nextcloud/server/issues/24600
- **2021-01-15** @nickvergessen: Hi, our current patch is the attached one. Do you want to verify it?
- **2021-01-18** @alexanderhofstaetter: Hello! I tested the patch and it seems to work.
- **Bounty Awarded**
- **Report Resolved**
- **2021-02-01** @alexanderhofstaetter: thank you!

Name / Pseudonym: Alexander Hofstätter
Website (optional): https://hofstaetter.io
Company (optional): Hofstätter IT GmbH
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **2021-02-10** @nickvergessen: Pending CVE: CVE-2021-22877
Pending SA: https://nextcloud.com/security/advisory/?id=NC-SA-2021-004

Scheduled date is: 22nd februrary (4 weeks after the 20.0.6 release)
- **Agreed On Going Public**
- **Manually Disclosed**
