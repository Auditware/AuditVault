---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/improper-input-validation
  - env/web
  - vuln/code-injection
  - impact/rce
  - trigger/file-upload
substate: "resolved"
weakness: "Improper Input Validation"
enriched: true
body: true
date: 2022-09-01
submitted: 2021-04-13T20:39:14.582Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "aliyugombe"
source: "https://hackerone.com/reports/1164452"
title: "Remote code execution due to unvalidated file upload"
---
# Remote code execution due to unvalidated file upload

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 12 | **Program:** MTN Group | **Disclosed:** 2022-09-01

- Report: [https://hackerone.com/reports/1164452](https://hackerone.com/reports/1164452)
- CWE: Improper Input Validation
- Submitted: 2021-04-13T20:39:14.582Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Hello 
I found a critical vunerability in one of your site, where user can upload any file type as a profile picture (including php file)


## Steps To Reproduce:
1. Visit https://careers.mtn.cm and register as a user.
2. After successful registration, login and update your data.
3. When uploading profile photo, select any file type.
 4. When its updated, view the source code of the page, you will see your file with complete path.
5. Copy the file path and paste into your browser.
6. Boom your file will be executed



## Supporting Material/References:
Here i upload non-harmful file as a poc 
```
<?php
echo "proof of concept (PoC) by aliyugombe@wearehackerone.com";
?>
```
https://careers.mtn.cm/en/user/images/users/-13-04-2021-20-15-16-payload.php

## Impact

Attacker can upload malicious file and inject to your server or deface the entire website since its possible to upload php file and gain access to direct file path.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-05-24** @aliyugombe: Any update?
- **2021-07-17** @aliyugombe: any update?
the bug is critical, it need to be fix as fast as possible because, the impact of the bug is not limited to the subdokmain https://careers.mtn.cm
- **2022-04-30** @aliyugombe: Any update?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
