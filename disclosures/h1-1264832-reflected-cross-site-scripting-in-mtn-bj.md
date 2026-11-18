---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2021-09-26
submitted: 2021-07-16T00:42:21.351Z
bounty_usd: null
votes: 33
cve: []
program: "[[programs/mtn_group|MTN Group]]"
reporter: "alimanshester"
source: "https://hackerone.com/reports/1264832"
title: "Reflected Cross-Site scripting in : mtn.bj"
---
# Reflected Cross-Site scripting in : mtn.bj

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 33 | **Program:** MTN Group | **Disclosed:** 2021-09-26

- Report: [https://hackerone.com/reports/1264832](https://hackerone.com/reports/1264832)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2021-07-16T00:42:21.351Z

## Report summary

Writeup : 
██████████

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello Team 
I have found a Reflected XSS vulnerability in mtn.jb by file name 


## Steps To Reproduce:
[add details for how we can reproduce the issue]

  1. go to : 
████
  2. enter any email and press  Suivant
  3. fill all the inputs by any data .
  4. in file upload upload any photo with payload file name : "><img src=x onerror=alert(document.cookie);.jpg

  5 . the payload executed in the page  


Supporting Material/References:
1 - video showing poc 
2 - screenshot

## Impact

An attacker can use XSS to send a malicious script to an unsuspecting user. The end user’s browser has no way to know that the script should not be trusted, and will execute the script. Because it thinks the script came from a trusted source, the malicious script can access any cookies, session tokens, or other sensitive information retained by the browser and used with that site. These scripts can even rewrite the content of the HTML page

## Timeline

- **Report Filed**
- **Report Triaged**
- **2021-08-25** @kdrmtn: Good day tester please assist with more info to reproduce this vulnerability 
Our team can't seem to rename a file with ; inclided
it doesn't accept that symbol
Are you able to send a picture that is already renamed that symbol
- **2021-08-25** @alimanshester: Hello team ; 
From windows os & Mac os 
you cant rename the file with this symbol 
You must use linux os to rename it with symbol 
Or you can download it from here :
█████
Thank you
- **2021-08-26** @kdrmtn: Good day thank you for your feedback please can you retest as the department believes they have remediated this vulnerability 

PLease test all directories and be sure the vulnerability is remediated 

Thank You
- **2021-08-26** @alimanshester: Hello team 
Good job , the payload dosent excuted that mean the vulnerability is fixed 
Now you can make this report as resolved 
Thank you
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
