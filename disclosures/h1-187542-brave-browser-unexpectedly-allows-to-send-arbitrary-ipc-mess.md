---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/command-injection-generic
  - env/web
substate: "resolved"
weakness: "Command Injection - Generic"
enriched: true
date: 2018-09-18
submitted: 2016-12-02T00:41:45.053Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "masatokinugawa"
source: "https://hackerone.com/reports/187542"
title: "Brave Browser unexpectedly allows to send arbitrary IPC messages"
---
# Brave Browser unexpectedly allows to send arbitrary IPC messages

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Brave Software | **Disclosed:** 2018-09-18

- Report: [https://hackerone.com/reports/187542](https://hackerone.com/reports/187542)
- CWE: Command Injection - Generic
- Submitted: 2016-12-02T00:41:45.053Z

## Timeline

- **Report Filed**
- **2016-12-02** @diracdeltas: looking into it now
- **2016-12-02** @diracdeltas: @masatokinugawa it seems that this attack only works if the attacker code is running in the main renderer process, not the webview renderer process. The main renderer process is 'trusted' code (part of Brave browser itself), whereas webpages are loaded in webview processes.

do you have a PoC webpage that can do this attack when it is loaded in a Brave webview?

if not, then this is not a vulnerability by itself.
- **2016-12-02** @masatokinugawa: When you access the following page using Brave browser, your browser settings is changed. 
https://vulnerabledoma.in/brave/settings_change.html

This means that the attack is successful from Brave webview, right?
- **2016-12-02** @diracdeltas: @masatokinugawa thanks, looks like i was mistaken because i was trying out the PoC in an iframe
- **Report Triaged**
- **2016-12-02** @masatokinugawa: Also, you can test address bar spoofing PoC: https://vulnerabledoma.in/brave/spoofing.html
- **2016-12-02** @diracdeltas: @masatokinugawa link to Electron issue? or is it not public?
- **2016-12-02** @masatokinugawa: sorry, it's not public yet
- **2016-12-02** @diracdeltas: tentatively fixed by https://github.com/brave/electron/commit/03f05980afc480f29d3ea4bb3e7e0ebe0b62e428
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2018-09-18** @masatokinugawa: Hi, could you open this bug, #188561 and #188086?
Thanks!
- **Agreed On Going Public**
- **Report Became Public**
