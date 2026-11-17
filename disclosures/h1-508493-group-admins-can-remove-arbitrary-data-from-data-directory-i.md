---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2019-08-12
submitted: 2019-03-12T15:48:46.756Z
bounty_usd: null
votes: 32
cve: "CVE-2019-15624"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "leonklingele"
source: "https://hackerone.com/reports/508493"
title: "Group admins can remove arbitrary data from 'data' directory (including admin data)"
---
# Group admins can remove arbitrary data from "data" directory (including admin data)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 32 | **Program:** Nextcloud | **Disclosed:** 2019-08-12

- Report: [https://hackerone.com/reports/508493](https://hackerone.com/reports/508493)
- CWE: Privilege Escalation | CVE: CVE-2019-15624
- Submitted: 2019-03-12T15:48:46.756Z

## Timeline

- **Report Filed**
- **2019-03-12** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **2019-03-31** @leonklingele: Please note that – as explained in https://hackerone.com/reports/508491 – if Apache is used, the `.htaccess` file can be removed and therefore files inside the `data/` directory can be accessed. Even worse, arbitrary PHP code can be executed with permissions of the webserver user (e.g. `www-data`) by accessing `.php` files in a user directory.
This now qualifies for a "Gaining remote code execution on the server as a non-admin user. (i.e. RCE)" bounty.

The fix has not been released yet. Please do so. Thanks!
- **2019-04-11** @leonklingele: What's the rationale for not including the fix in v15.0.7 (most recent stable) and v14.0.10 (most recent oldstable)? What kind of patches _do_ qualify for that if this one doesn't?
- **2019-04-11** @rullzer: Backports are pending. That totally slipped
- **2019-06-14** @leonklingele: Now that the fix is included in a release of every supported version, can this ticket be disclosed?
- **Report Resolved**
- **2019-06-21** @nickvergessen: Yes, sorry we are running low on capacity atm.
I will clarify the reward next week in our contributor week and we will then proceed normally with our procedure.
- **2019-07-07** @leonklingele: Hey – nice! And sure, here's my data:

Name: Leon Klingele
Email address: █████████
- **Agreed On Going Public**
- **Report Became Public**
- **2019-09-29** @leonklingele: Another three months have passed, any news on this?
- **Report Severity Updated**
- **Bounty Awarded**
- **2019-11-27** @leonklingele: Thanks! This report still looks far more severe than classified / awarded.

### The obvious

It allows group admins to read, delete and modify arbitrary user data (see below), even those of admins and other group admins. This was partly illustrated in the initial report.

### The not-so-obvious

It also allows for a privilege escalation to the webserver user (e.g. `www-data`) by all admins and group admins under Apache, even if set up following the official install instructions[0]. Please see my previous comment @ https://hackerone.com/reports/508493#activity-4429406 in that regard.

This can be abused in countless ways, for example:

- log/steal user passwords (Nextcloud login, mail — if configured, etc.)
- abuse the server for mail spam, phishing, cryptocurrency miners, etc.

Please confirm that you were aware of the this privilege escalation when assessing the issue.

[0]: https://docs.nextcloud.com/server/17/admin_manual/installation/source_installation.html#apache-web-server-configuration
- **2019-11-27** @nickvergessen: Hi Leon,

I am totally aware of the not-so-obvious part. However admins have Remote-Code-Execution by default as they can install any malicious source code as an app from the appstore with just one click.
With this they can run any code as www-data independent whether the data directory is moved outside of the webroot or not, whether apache or nginx is used, etc.

So from my understanding it boils down to be able to break the instance by accident rather then intend.
- **2019-11-27** @leonklingele: Hi Joas and thank you for your response.

>However admins have Remote-Code-Execution by default as they can install any malicious source code as an app from the appstore with just one click.

While this is true you didn't mention _group_ admins. It's clearly a privilege escalation for them, no? What makes them any different than regular administrators?
