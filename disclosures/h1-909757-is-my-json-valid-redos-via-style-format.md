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
date: 2020-07-31
submitted: 2020-06-27T15:07:22.309Z
bounty_usd: null
votes: 2
cve: []
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/909757"
title: "[is-my-json-valid] ReDoS via 'style' format"
---
# [is-my-json-valid] ReDoS via 'style' format

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 2 | **Program:** Node.js third-party modules | **Disclosed:** 2020-07-31

- Report: [https://hackerone.com/reports/909757](https://hackerone.com/reports/909757)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2020-06-27T15:07:22.309Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

I would like to report a ReDoS in `is-my-json-valid`
It allows cause a denial of service if schema uses the built-in `style` format.

# Module

**module name:** `is-my-json-valid`
**version:** 2.20.1
**npm page:** `https://www.npmjs.com/package/is-my-json-valid`

## Module Description

> A JSONSchema validator that uses code generation to be extremely fast.

## Module Stats

1 250 253 weekly downloads

# Vulnerability

## Vulnerability Description

Classic ReDoS, polynomial time.

Note that https://www.npmjs.com/package/safe-regex is not free from false positives/negatives (as noted in its Readme) and does not catch this and other polynomial regexps (e.g. `/a*a*b/`).

## Steps To Reproduce:

```js
const imjv = require('is-my-json-valid')
const validate = imjv({ maxLength: 100, format: 'style' })
console.log(validate(' '.repeat(1e4)))
```

# Wrap up

- I contacted the maintainer to let them know: N 
- I opened an issue in the related repository: N

## Impact

DoS if schema uses the `style` format.

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **2020-06-29** @mafintosh: fixed in 2.20.2 with https://github.com/mafintosh/is-my-json-valid/commit/c3fc04fc455d40e9b29537f8e2c73a28ce106edb
- **2020-06-29** @chalker: I would also suggest to replace the regex to not include a ReDoS.
`/\s*(.+?):\s*([^;]+);?/g` should be equivalent to `/.:\s*[^;]/g` if I'm not mistaken, as it doesn't match for `^` or `$`.

If the intent was to include `^` and `$` and those were missed due to an unrelated mistake, I can probably propose another safe regex for that.

WDYT?
- **2020-06-29** @mafintosh: Ya all for simpler "defaults". Feel free to PR that :)
- **2020-06-29** @chalker: I already removed `style` format whatsoever in a fork, but I can surely file a PR with that regex to `is-my-json-valid`.
Here: https://github.com/mafintosh/is-my-json-valid/pull/180
- **2020-06-29** @chalker: That PR landed.

This issue looks fixed now.
- **Report Resolved**
- **2020-07-01** @mcollina: Should I request a CVE for this? I think it should be for version 2.20.4, correct?
- **Agreed On Going Public**
- **Report Became Public**
