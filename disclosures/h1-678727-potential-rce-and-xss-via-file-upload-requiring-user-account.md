---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/code-injection
  - env/web
  - vuln/xss
  - vuln/code-injection
  - impact/rce
substate: "resolved"
weakness: "Code Injection"
enriched: true
body: true
date: 2020-04-01
submitted: 2019-08-21T19:18:14.807Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "rcejules"
source: "https://hackerone.com/reports/678727"
title: "potential RCE and XSS via file upload requiring user account and default settings"
---
# potential RCE and XSS via file upload requiring user account and default settings

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Nextcloud | **Disclosed:** 2020-04-01

- Report: [https://hackerone.com/reports/678727](https://hackerone.com/reports/678727)
- CWE: Code Injection
- Submitted: 2019-08-21T19:18:14.807Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#potential RCE and XSS via file upload requiring user account and default settings

##Requirements
1. User account that can upload files (NO admin)
2. User account name on creation (usually the same as on creation/displayed name)
3. data directory inside of nextcloud server folder (suggested by /var/www/nextcloud/config/config.sample.php)

##Tested on
current release
Version 16.0.4.1
stable
Build: '2019-08-14T18:57:27+00:00 a1a245e88202d834f08f4c2e4451dcbe9baee3aa'

##Basic idea
On nextcloud php files can be uploaded, but when clicked they are only shown in a text editor. If the URL to our skript is known, we get code execution. 
A RCE will work if the server has set it's data directory inside the nextcloud server folder and the username is known. 

##config example
The following is located in /var/www/nextcloud/config/config.sample.php:
[https://github.com/nextcloud/server/blob/master/config/config.sample.php]
~~~~
 *
 * Default to ``data/`` in the Nextcloud directory.
 */
'datadirectory' => '/var/www/nextcloud/data',
~~~~
If this config is used, RCE is possible.

##Attack scenario: 
Short video attached.
(To reproduce use a nextcloud instance and setup a user named attacker. Use any php script called shell.php, and set the datadirectory to /var/www/nextcloud/data)

1. Login to obtained user account (assume his name is "attacker")
2. upload malicious php script. (assume it is called "shell.php")
3. navigate to https://www.ournextclouddomain.com/data/attacker/files/shell.php
4. see some shells poppin

This is possible since we know the direct path to our php script.

Note: This can also be used for XSS since we can upload any html file!

##Prevention
1. user accounts could extend a seed on their foldername like attacker-19320143158015
2. usage of a custom seed inside the data directory.
3. different config than on the example

## Impact

RCE, extract ser data or modify config file (if no special permissions are set), take over the server, also XSS is possible

## Timeline

- **Report Filed**
- **2019-08-21** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Needs More Info**
- **Report New**
- **2019-08-23** @rcejules: example Conf File
- **2019-08-23** @nickvergessen: Right, thanks for the pointer, we will fix this as a hardening with https://github.com/nextcloud/server/pull/16846
- **Report Triaged**
- **Swag Awarded**
- **Not Eligible For Bounty**
- **Report Resolved**
- **Agreed On Going Public**
- **2019-11-27** @rcejules: Thanks Nick for the quick fix. I am a big fan of Nextcloud. Since there was no bounty, I assume it was not eligible is that correct?
- **2019-11-27** @nickvergessen: Yeah, sorry. See the message from Aug 23rd
> Nextcloud has decided that this report is not eligible for a bounty.
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **Agreed On Going Public**
- **Report Became Public**
