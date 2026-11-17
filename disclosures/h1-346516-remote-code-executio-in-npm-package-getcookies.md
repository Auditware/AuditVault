---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/code-injection
  - env/web
  - stack/node
substate: "resolved"
weakness: "Code Injection"
enriched: true
date: 2019-04-03
submitted: 2018-05-02T14:13:11.333Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "tiblu"
source: "https://hackerone.com/reports/346516"
title: "Remote code executio in  NPM package getcookies"
---
# Remote code executio in  NPM package getcookies

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 8 | **Program:** Node.js third-party modules | **Disclosed:** 2019-04-03

- Report: [https://hackerone.com/reports/346516](https://hackerone.com/reports/346516)
- CWE: Code Injection
- Submitted: 2018-05-02T14:13:11.333Z

## Timeline

- **2018-05-02** @tiblu: By now it seems both of the affected modules have been removed from NPM:

* https://www.npmjs.com/package/getcookies
* https://www.npmjs.com/package/express-cookies
- **Report Filed**
- **2018-05-02** @vdeturckheim: @tiblu thanks for reporting this. As modules are no longer available, I will close this report.
- **Report Resolved**
- **2018-05-02** @tiblu: @vdeturckheim What about people who have systems running on local a copy and cached packages? They need to be informed somehow thus public CVE still seems to make sense?
- **2018-05-02** @vdeturckheim: (edit) please ignore this message, I have been through the numbers again and you're right, we probably should disclose this.
- **Report Reopened**
- **2018-05-02** @tiblu: @vdeturckheim Thanks. Seems most of the users use `getcookies` as indirect dependency from `express-cookies` - https://npm-stat.com/charts.html?package=express-cookies
- **Report Triaged**
- **2018-05-03** @tiblu: @vdeturckheim Thanks a lot!
- **2018-05-05** @vdeturckheim: @tiblu I'll mostly be away this week. I'll try to ping the npm sec team who wrote about this to see if there is anything to do with them to move forward :)
- **2018-05-05** @tiblu: WDYM by "move forward"? The packages have been removed, so we should be golden.
- **2018-05-15** @vdeturckheim: Sorry I was away last week. I want to check if they already have assigned a CVE for this.
- **Changed Scope**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
