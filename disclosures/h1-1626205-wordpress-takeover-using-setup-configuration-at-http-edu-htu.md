---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/misconfiguration
  - env/web
  - stack/wordpress
  - vuln/xss
  - vuln/code-injection
  - vuln/authentication-bypass
  - vuln/privilege-escalation
  - impact/rce
  - trigger/admin-required
  - trigger/social-engineering
substate: "resolved"
weakness: "Misconfiguration"
enriched: true
body: true
date: 2023-01-13
submitted: 2022-07-05T14:01:40.869Z
bounty_usd: 1000
votes: 102
cve: []
program: "[[programs/deptofdefense|U.S. Dept Of Defense]]"
reporter: "ghostkernalbbt"
source: "https://hackerone.com/reports/1626205"
title: "Wordpress Takeover using setup configuration at http://████.edu [HtUS]"
---
# Wordpress Takeover using setup configuration at http://████.edu [HtUS]

> **Severity:** Critical | **Bounty:** 1,000 USD | **Votes:** 102 | **Program:** U.S. Dept Of Defense | **Disclosed:** 2023-01-13

- Report: [https://hackerone.com/reports/1626205](https://hackerone.com/reports/1626205)
- CWE: Misconfiguration
- Submitted: 2022-07-05T14:01:40.869Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Description:

The WordPress 'setup-config.php' installation page allows users to install
WordPress in local or remote MySQL databases. This typically requires a user
to have valid MySQL credentials to complete.  However, a malicious user can
host their own MySQL database server and can successfully complete the
WordPress installation without having valid credentials on the target system.


Reproduce step by step:

I found this vulnerable url:
http://███.edu/old/wp-admin/setup-config.php

Then i configured db 
I used this site https://www.freemysqlhosting.net/

After configure I got wordpress admin access

proof:
http://██████████.edu/old/rce.txt


Admin credentials that I set after installing the config
username: ████████
password: ███

Login Panel: http://████████.edu/old/wp-login.php

Video POC has been attached as well.

## Impact

Impact
Remote Code Execution/Total system compromise.
Attacker can upload webshell into the server. I did not upload any shell for security violation.

Malware distribution
Phishing / Spear phishing
XSS
Authentication bypass

## Timeline

- **Report Filed**
- **2022-07-05** @h1_mediation_neal: Hi @berserkbd47,

Thank you for your submission. I hope you are well. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Have a great day! 

Kind regards,
@fuzzface
- **Report Triaged**
- **Report Title Updated**
- **Report Vulnerability Types Updated**
- **Bounty Awarded**
- **Report Resolved**
- **2022-12-18** @ghostkernalbbt: Hi! Can you disclose the report? Thanks.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Comments Closed**
