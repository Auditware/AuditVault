---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/authentication-bypass-using-an-alternate-path-or-channel
  - env/web
  - vuln/authentication-bypass
  - vuln/misconfiguration
  - trigger/brute-force
substate: "resolved"
weakness: "Authentication Bypass Using an Alternate Path or Channel"
enriched: true
body: true
date: 2022-12-02
submitted: 2022-10-23T14:47:41.349Z
bounty_usd: null
votes: 23
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "roland_hack"
source: "https://hackerone.com/reports/1747146"
title: "Authentication bypass in ████████"
---
# Authentication bypass in ████████

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 23 | **Program:** MTN Group | **Disclosed:** 2022-12-02

- Report: [https://hackerone.com/reports/1747146](https://hackerone.com/reports/1747146)
- CWE: Authentication Bypass Using an Alternate Path or Channel
- Submitted: 2022-10-23T14:47:41.349Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
In a nutshell, an authentication bypass exploits weak authentication mechanisms to allow a hacker to access your systems and data.In a nutshell, an authentication bypass exploits weak authentication mechanisms to allow a hacker to access your systems and data

## Steps To Reproduce:

  1.I was going to the site: █████ and on the home page I clicked on personal and the site redirected me to another site which is: ██████████ and on this site on which I was redirected I saw "link your NIN" and I went to this site and after listing I found an impressive thing which is the Tiny filemanager and to authenticate myself I bypass it with default credentials to access it.
The default credentials are: Login Details: ████/████ | user/12345
and I had access to the panel and I had privileges like modify, upload, delete
## Supporting Material/References:
[list any additional material (e.g. screenshots, logs, etc.)]

  * [attachment / reference]

## Impact

The impact of authentication vulnerabilities can be very severe. Once an attacker has either bypassed authentication or has brute-forced their way into another user's account, they have access to all the data and functionality that the compromised account has.

## Timeline

- **Report Filed**
- **2022-10-25** @incognito4: Hi ██████  may you please provide the recommended actions to mitigate this risk.
- **2022-10-25** @roland_hack: Hello ██████████ 
I advise you to regenerate a new password and change the default one for this manager, this can be useful for you to create a new password: ███
and the hash generated, you will put it in the source code and delete the default one or, if necessary, you must restrict access to this file manager to users, this is what I have to advise you if you have other questions I am at your disposal
- **Report Triaged**
- **2022-10-25** @roland_hack: please, it's my pleasure to help the MTN network
- **2022-10-26** @roland_hack: I saw that the file manager was deleted there I guess the bug is patched please close it
- **Hacker Requested Mediation**
- **2022-10-28** @roland_hack: ██████████ 
 I saw that the bug has been patched you can put it as solved and I would also like you to disclose the report
- **2022-11-01** @roland_hack: please dear triagers since I have not had a follow-up to the critical bug that I submitted recently or the bug has already been patched, please close the bug as solved
- **Report Resolved**
- **2022-11-02** @roland_hack: Please Can WE disclose it?
- **Agreed On Going Public**
- **2022-11-04** @roland_hack: █████████  please disclose it
- **Report Became Public**
