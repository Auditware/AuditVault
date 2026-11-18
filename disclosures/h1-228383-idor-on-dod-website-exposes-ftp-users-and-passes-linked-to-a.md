---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2019-10-04
submitted: 2017-05-14T21:23:33.371Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "cdl"
source: "https://hackerone.com/reports/228383"
title: "IDOR on DoD Website exposes FTP users and passes linked to all accounts!"
---
# IDOR on DoD Website exposes FTP users and passes linked to all accounts!

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 20 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2019-10-04

- Report: [https://hackerone.com/reports/228383](https://hackerone.com/reports/228383)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2017-05-14T21:23:33.371Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Description:**
https://████/██████/ is vulnerable to Insecure Direct Object Reference. The application does not validate whether or not who a Push Server belongs to thus allowing an attacker to view the credentials of any FTP / sFTP server linked to any user's account. 

## Impact
An attacker can view anybody's FTP server information, thus **compromising** the user's FTP servers. This also allows an attacker to **update** or **edit** the Push Server in the ██████████ CMS.

## Step-by-step Reproduction Instructions
1. Log into or create an account on `https://██████████/██████████`
2. Now visit `https://████████/█████/filepush/ftp/303/` 

You will be able to see my ftp server details and you will be able to update or delete it!

An attacker can bruteforce the id to see if the server gives back a valid response. The attacker can then log into the person's FTP servers with the credentials stolen using this vulnerability, giving them full access to private / confidential information!

Example: `https://██████████/█████████/filepush/ftp/1/`

Hostname: ██████
Username: ██████
Password: █████
Path: /from_pub/cr/████████

`https://█████████/████/filepush/ftp/<ID>/`

## Suggested Mitigation/Remediation Actions
Check whether or the user's account should have access to the specified Push Server

## Timeline

- **Report Filed**
- **2017-05-14** @U.S. Dept Of Defense: Greetings from the Department of Defense (DoD),

Thank you for supporting the DoD Vulnerability Disclosure Program (VDP).

By submitting this report, you acknowledge understanding of, and agreement to, the DoD Vulnerability Disclosure Policy as detailed at @DeptofDefense.

The VDP Team will review your report to ensure compliance with the DoD Vulnerability Disclosure Policy.  If your report is determined to be out-of-scope, it will be closed without action.

We will attempt to validate in-scope vulnerability reports and may request additional information from you if necessary. We will forward reports with validated vulnerabilities to DoD system owners for their action.

Our goal is to provide you with status updates not less than every two weeks until the reported vulnerability is resolved.

Regards,

The VDP Team
- **Report Severity Updated**
- **Report Triaged**
- **2017-05-24** @bwluebberthill: Greetings @cdl,

We have been advised that the vulnerability you reported has been resolved. Before we close this report, we would appreciate it if you could confirm that the vulnerability no longer exists.

If we do not receive a response within two weeks, we will send you a second request. If we do not receive a response from you within two weeks of the second notice, we will close this report as resolved.

If you do not believe this vulnerability has been effectively resolved or if you have any questions, please let us know.

Thank you for your time and effort to improve the security of the DoD information network.

Regards,

The VDP Team
- **2017-05-24** @cdl: I can confirm this is fixed! Thanks!
- **Report Resolved**
- **Agreed On Going Public**
- **2017-05-28** @cdl: Am I allowed to write about this on my blog if I redact some of the information such as the domain and change other info such as the path?
- **2017-05-31** @cdl: Hey there, could you check my above requests? I would like permission to do a write up about this vulnerability (I will redact some of the information such as the domain & change other info such as path)
- **Report Reopened**
- **2017-05-31** @amanion: Requesting disclosure, please wait for someone from the Publishing team to comment.
- **2017-05-31** @cdl: Ok! Thanks @amanion!!
- **2017-06-06** @cdl: Sorry if I sound impatient, but any updates? This is definitely a fun report that I think deserves to be disclosed ;) Thank you!
- **2017-06-22** @cdl: Any updates...?
- **2017-07-03** @cdl: Hey there, any updates? It's been a month!!
- **2017-07-05** @cdl: @amanion Can we get someone from the publishing team to comment? Much appreciated!
- **2017-07-11** @cdl: Anybody there?
- **2017-07-13** @cdl: ?
- **2017-07-29** @cdl: Hello, Can we get this resolved please?? This issue is patched already...
- **Report Resolved**
- **2017-09-27** @cdl: Hello? Can we get partial disclosure? Thanks
- **Agreed On Going Public**
- **2018-04-19** @cdl: Could we get this partially disclosed? Thanks.
- **2018-04-19** @agent-0g: @cdl Unfortunately, not yet. We are in the final steps to standardize the disclosure process and working through the researchers requests, including your report.  Thanks again for your patience.
- **2018-04-19** @cdl: No problem @ag3nt-s21, saw some friend's reports disclosed so was just curious! Thanks for the quick response, I appreciate it!
- **2019-01-11** @cdl: Hey @ag3nt-s21 / @ag3nt-z3,

Could this be disclosed?

Thanks.
- **2019-01-11** @agent-0g: @cdl Not yet but, it's in queue to be reviewed.
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
