---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/file-manipulation
  - env/web
substate: "resolved"
weakness: "File Manipulation"
enriched: true
body: true
date: 2024-11-05
submitted: 2024-09-21T16:05:51.919Z
bounty_usd: null
votes: 55
cve: []
program: "[[programs/mod_supply_chain_vdp|MOD Supply Chain VDP]]"
reporter: "goedix"
source: "https://hackerone.com/reports/2733190"
title: "Overwrite any file of the web server"
---
# Overwrite any file of the web server

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 55 | **Program:** MOD Supply Chain VDP | **Disclosed:** 2024-11-05

- Report: [https://hackerone.com/reports/2733190](https://hackerone.com/reports/2733190)
- CWE: File Manipulation
- Submitted: 2024-09-21T16:05:51.919Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
With this vulnerability an attacker can override all the files from the server due to a vulnerable module used to generate █████████s

## Steps To Reproduce:

  1. Go to ██████████ to check the actual payload (*Save ███████ to:*) to do it (███████goedix.php -> This will create a file in /██████_h1goedix.php but this can be edited to index.php and replacing any php file in the server or outside the web server) █████
  1. Go to ███████ to start the job that creates the ███ in the target filepath
  1. Go to https://██████████_h1goedix.php or the targeted file and check that it returns an empty page! ██████████

> As note, if you want to do any action in /█████████ you must modify with burp the request from `/█████████/index.php` to `/██████████`, otherwises it won't  work!

## Impact

An attacker can replace all the server files with empty pages! (I was finding to achieve RCE but I was not able to do it (I did tests injecting php code into the php files but it returns 500 internal server error)

## Timeline

- **Report Filed**
- **2024-09-24** @goedix: Hi team!

Any update on this?

Kind regards,
@goedix
- **2024-09-24** @a-field: Hi @goedix ,

We have triaged your submission and are waiting to hear from the triage team.

Hope to hear back shortly.

Best,
MacTag
- **2024-09-24** @goedix: Hi @a-field!

Thanks for letting me know!
Can i know about the other report sent to you?

Thanks in advance team!

Kind regards,
@goedix
- **Report Needs More Info**
- **Report New**
- **Report Pending Program Review**
- **2024-10-02** @goedix: Hi team!

Any update about this report?

Kind regards,
@goedix
- **2024-10-17** @goedix: Hi team!

Any update about this report?

Kind regards,
@goedix
- **Report Resolved**
- **2024-10-21** @goedix: Thank you so much team!

Kind regards,
@goedix
- **Agreed On Going Public**
- **2024-10-24** @goedix: Can we disclose?
- **2024-10-31** @h1_analyst_leevi: #
- **Agreed On Going Public**
- **Report Became Public**
- **Reassigned To Team**
