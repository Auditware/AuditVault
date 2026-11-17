---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/privilege-escalation
  - env/web
  - stack/node
substate: "resolved"
weakness: "Privilege Escalation"
enriched: true
date: 2023-03-19
submitted: 2022-10-24T11:29:58.157Z
bounty_usd: null
votes: 7
cve: "CVE-2023-23918"
program: "[[programs/nodejs|Node.js]]"
reporter: "goums"
source: "https://hackerone.com/reports/1747642"
title: "Permissions policies can be bypassed via process.mainModule"
---
# Permissions policies can be bypassed via process.mainModule

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** Node.js | **Disclosed:** 2023-03-19

- Report: [https://hackerone.com/reports/1747642](https://hackerone.com/reports/1747642)
- CWE: Privilege Escalation | CVE: CVE-2023-23918
- Submitted: 2022-10-24T11:29:58.157Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2022-10-26** @jasnell: Also note, closely related to this, the following also works when it shouldn't

```
// policy.json
{
  "onerror": "exit",
  "scopes": {
    "file:": {
      "integrity": true,
      "dependencies": {
        "module": true
      }
    }
  }
}
```

```
// escape.js

const mod = require('module');

console.log(mod.createRequire(__filename)('os').cpus())
```
- **2023-01-31** @mhdawson: @goums would you like to be credited when we do a security release and if so what should we use for "Thank you, to YYYY for reporting this vulnerability" ?
- **Report Severity Updated**
- **2023-01-31** @goums: hey @mhdawson 
Thanks, that would be appreciated indeed.
You can mention me with "Goums" or if you tag github users, my github profile is `@goums`: https://github.com/goums
- **Cve Id Added**
- **2023-02-17** @mhdawson: In security release - https://nodejs.org/en/blog/vulnerability/february-2023-security-releases/
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
