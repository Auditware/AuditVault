---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/command-injection-generic
  - env/web
  - vuln/command-injection
  - vuln/code-injection
substate: "duplicate"
weakness: "Command Injection - Generic"
enriched: true
body: true
date: 2017-08-10
submitted: 2016-12-03T20:49:12.765Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "paulos__"
source: "https://hackerone.com/reports/188078"
title: "Command Execution because of extension handling"
---
# Command Execution because of extension handling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Brave Software | **Disclosed:** 2017-08-10

- Report: [https://hackerone.com/reports/188078](https://hackerone.com/reports/188078)
- CWE: Command Injection - Generic
- Submitted: 2016-12-03T20:49:12.765Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Hello,

Using this bug an attacker can execute commands as the current user using brave & gain complete shell capabilities (and all possibilities associated) 

## Details:

The issue is in the way the application handles website TLDs. typically in windows, `.com` represents an application, much similar like `.exe` - when Brave saves a website (Ctrl+S) - it uses the name of the website.

For PoC purpose I used `.bat` TLDs because they are much easier to show a poc with instead of binary application garbage data. 

So Assume a user visits http://paulos.bat with the contents of:
```js
@echo off
calc
```

And saves the page, this will save the website as `paulos.bat` - which when executed - actually opens batch and executes calculator.

## Bypassing Mitigations

In Windows, Microsoft warns users when they execute applications that are downloaded, this can simply be bypassed by sending filenames with words like `Update` or `Setup`... yeah, I can't believe this works too.

So say a user visits `https://malicioussetup.com` and saves the site - note this site changed its contents from whatever it was to binary-garbage & microsoft will allow executing it - eventually causing code execution.

This is clearly a chain of low priority issues that cause command execution. :) (POC 

## Products affected: 

 * Tested in Latest Brave Windows (I suspect OSX, iOS & Android may also be affected)

## Recommended Fix:

 Add .html/htm to the index page (/index.html) to mitigate this easily

## Supporting Material/References:

  * POC image attached
  * POC video (Private): https://youtu.be/ret4pJArYSU

I think you should fix this ASAP! as anyone can register `.com` sites to abuse it.

Thanks,
Paulos

## Timeline

- **Report Filed**
- **2016-12-03** @paulos__: little correction on the recommended fix: other sites don't add `.html/htm` on to the page domain. I just tried it in Firefox/Chrome/Safari and they actually use the <title> of the page + .html - which completely mitigates this issue.
- **Report Duplicate**
- **2016-12-04** @paulos__: @asuka sure. I guess I am a bit late. can you add me to the report?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
