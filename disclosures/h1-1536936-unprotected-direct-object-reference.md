---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/insecure-direct-object-reference-idor
  - env/web
  - vuln/idor
substate: "resolved"
weakness: "Insecure Direct Object Reference (IDOR)"
enriched: true
body: true
date: 2022-12-01
submitted: 2022-04-11T00:18:26.846Z
bounty_usd: null
votes: 13
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "coyemerald"
source: "https://hackerone.com/reports/1536936"
title: "Unprotected Direct Object Reference"
---
# Unprotected Direct Object Reference

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 13 | **Program:** MTN Group | **Disclosed:** 2022-12-01

- Report: [https://hackerone.com/reports/1536936](https://hackerone.com/reports/1536936)
- CWE: Insecure Direct Object Reference (IDOR)
- Submitted: 2022-04-11T00:18:26.846Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello MTN Security Team,
During my hunting,
I discovered that there's an Insecure Direct Object Reference  on https://nin.mtnonline.com 
Vulnerable Path:  https://nin.mtnonline.com/nin/success?message=1

Steps To Reproduce:
You may not even require to submit any NIN before accessing this unprotected page,
Just visit https://nin.mtnonline.com/nin/success?message=1 

I discovered that, to  see other user's NIN, it only require 2 difference , example
https://nin.mtnonline.com/nin/success?message=3
https://nin.mtnonline.com/nin/success?message=5
https://nin.mtnonline.com/nin/success?message=7
https://nin.mtnonline.com/nin/success?message=9
https://nin.mtnonline.com/nin/success?message=11
https://nin.mtnonline.com/nin/success?message=1901
https://nin.mtnonline.com/nin/success?message=1903
https://nin.mtnonline.com/nin/success?message=8001

## Impact

This bug exposed all the submitted Nigerians National Identity Number (NIN) .which can be abused in other way else if found out by a malicious person

## Timeline

- **Report Filed**
- **2022-05-04** @incognito4: Hi @coyemerald please see attached what I get instead and advise
- **2022-05-04** @coyemerald: First, I can't assume correctly the reason why you don't respond to the reports on time! this takes longer than usual. 

And also, can you please consider rewarding the researcher even if it'll be based on verifiable discovery or that you'd consider rewarding the researcher that reports bugs with CRITICAL security impact. 

MTN is not a small org, and it is worth millions of dollars, please, and on behalf of other researchers, consider giving paying bounties...


And back to this,  IDOR report on NIN, do you still care for the bug information?
- **2022-05-04** @coyemerald: Kindly let me know when/if you are active here...................
- **2022-06-02** @incognito4: Hi, I'm active now is this still an issue?
- **2022-06-03** @coyemerald: Yes, it is still an issue.  but kindly reply to my concern too
- **2022-08-17** @incognito4: We're working on the backlog on the reports, and expect to attend to reports as soon as they come in in the next week or so.
- **Report Triaged**
- **2022-09-05** @coyemerald: Okay, thanks.  kindly let me know if you consider giving a bounty. 
& as I said n'joni, MTN is worth multi-millions of dollars, and not giving bounties is discouraging  

Please, whatever the decision you make, let me know then I will decide if I can share this or not.. 

Regards, 
Coy Emerald
- **Report Resolved**
- **Agreed On Going Public**
- **2022-11-25** @coyemerald: Hi team, was the disclosure request made by another researcher? kindly clarify this, thanks.
- **Report Became Public**
