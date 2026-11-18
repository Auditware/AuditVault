---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2020-08-06
submitted: 2020-05-31T20:27:39.209Z
bounty_usd: null
votes: 6
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "vrechson"
source: "https://hackerone.com/reports/888030"
title: "[wappalyzer] ReDoS allows an attacker to completely break Wappalyzer"
---
# [wappalyzer] ReDoS allows an attacker to completely break Wappalyzer

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-06

- Report: [https://hackerone.com/reports/888030](https://hackerone.com/reports/888030)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2020-05-31T20:27:39.209Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Hello folks!

please note that I'm reporting two different problematic regexes.

**module name:** `Wappalyzer`
**version:** `6.0.2`
**npm page:** `https://www.npmjs.com/package/wappalyzer`

## Module Description

> Wappalyzer identifies technologies on websites.

## Module Stats

> Weekly downloads: `1,290`
> `88` open issues
> `16` open pull requests
> last publish: `3 days ago`

# Vulnerability

ReDoS  (Catastrophic backtracking)

## Vulnerability Description
> An attacker can make wappalyzer (all drivers, like browser extension and cli) stop working due to ReDoS in one of it's services regex . 

## Steps To Reproduce:

1. Create a web page with the following tag:
`<meta name="GENERATOR" content="IMPERIA 46197946197946197946197946197946197946197946197946197946197946197946197946197946197946197946197946197966228761662296:"/>`
2. Now open this page using wappalyzer extension in browser or it's cli
3. Wappalyzer will stop answering and it's CPU percentage will start to  increase to high levels

## Patch

 In order to test this issue, you can see that the problem resides in this line `https://github.com/AliasIO/wappalyzer/blob/master/src/apps.json#L13207` of wappalyzer application. When this regex test the input shown, it takes process the application indefinitely, making it stop working. Running it in browser extension completely crash the extension in all tabs, and in cli/node version the execution takes forever.

To patch this issue, the current regex must be changed to a more restrict one in this piece: `([0-9.]{2,})+`

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- OS: Archlinux -  Linux 5.6.13-arch1-1 #1 SMP PREEMPT Thu, 14 May 2020 06:52:53 +0000 x86_64 GNU/Linux
- Node version: v12.16.3
- NPM version: 6.14.5
- Firefox: 76.0.1 (64-bit) - Mozilla Firefox for Arch Linux - archlinux - 1.0
- ReScuE was used to test for ReDoS (https://github.com/2bdenny/ReScue)

# Wrap up

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: N
- I opened an issue in the related repository: N

Hope I'm helping making node app more safe. thank you!

## Impact

An attacker can make wappalyzer stop working in it's pages, or pages in which he has injection and make user CPU starts to throttle

## Timeline

- **Report Filed**
- **2020-05-31** @vrechson: please, also add @caioluders to this report
- **2020-05-31** @bbe8482aecd24374d13c5de15a0a6: Hi @abrasax, I have invited him as participant as requested.
- **2020-05-31** @nochnoidozor: Hi @abrasax,

Thank you for your submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share.

Kind regards,
@nochnoidozor
- **Report Triaged**
- **External User Joined**
- **External User Joined**
- **2020-06-02** @aliasio: Thank you. This issue has been fixed by changing the pattern from `([0-9.]{2,})+$` to `([0-9.]{2,3})`.

https://github.com/AliasIO/wappalyzer/blob/master/src/apps.json#L13207
- **2020-06-04** @bbe8482aecd24374d13c5de15a0a6: @caioluders @nochnoidozor can you both confirm, that this resolves the reported issue?
- **2020-06-04** @vrechson: I can confirm this solved the issue
- **2020-06-04** @bbe8482aecd24374d13c5de15a0a6: Thanks for the feedback @abrasax (sorry, I forgot to mention you).
- **2020-06-04** @vrechson: no problem :p
- **2020-08-06** @caioluders: Hey,

as this was already fixed, can you guys close and disclose ?
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
