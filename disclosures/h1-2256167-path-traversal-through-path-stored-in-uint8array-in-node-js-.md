---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/path-traversal
  - env/web
  - stack/node
  - vuln/path-traversal
substate: "resolved"
weakness: "Path Traversal"
enriched: true
body: true
date: 2024-01-20
submitted: 2023-11-17T17:45:17.441Z
bounty_usd: 3495
votes: 44
cve: "CVE-2023-39332"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "tniessen"
source: "https://hackerone.com/reports/2256167"
title: "Path traversal through path stored in Uint8Array in Node.js 20"
---
# Path traversal through path stored in Uint8Array in Node.js 20

> **Severity:** High | **Bounty:** 3,495 USD | **Votes:** 44 | **Program:** Internet Bug Bounty | **Disclosed:** 2024-01-20

- Report: [https://hackerone.com/reports/2256167](https://hackerone.com/reports/2256167)
- CWE: Path Traversal | CVE: CVE-2023-39332
- Submitted: 2023-11-17T17:45:17.441Z

## Report summary

Path traversal through path stored in Uint8Array (High) - (CVE-2023-39332)

Full Security Advisory: https://nodejs.org/en/blog/vulnerability/october-2023-security-releases

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Various `node:fs` functions allow specifying paths as either strings or `Uint8Array` objects. In Node.js environments, the `Buffer` class extends the `Uint8Array` class. Node.js prevents path traversal through strings (see CVE-2023-30584) and `Buffer` objects (see CVE-2023-32004), but not through non-`Buffer` `Uint8Array` objects.

This is distinct from CVE-2023-32004 ([report 2038134](https://hackerone.com/reports/2038134)), which only referred to `Buffer` objects. However, the vulnerability follows the same pattern using `Uint8Array` instead of `Buffer`.

## Steps To Reproduce:

The following Node.js command prints the contents of `/etc/passwd` despite having been granted access to `/tmp` only. This relies on the fact that `TextDecoder` produces `Uint8Array` objects that are not `Buffer` objects.

```
$ node --experimental-permission \
        --allow-fs-read=/tmp/ \
        -p 'fs.readFileSync(new TextEncoder().encode("/tmp/../etc/passwd"))'
<Buffer 72 6f 6f 74 3a 78 3a 30 3a 30 3a 3a 2f 72 6f 6f 74 3a 2f 62 69 6e 2f 62 61 73 68 0a 6e 6f 62 6f 64 79 3a 78 3a 36 35 35 33 34 3a 36 35 35 33 34 3a 4e ... 2103 more bytes>
```

## Supporting Material/References:

* CVE-2023-30584 ([report 1952978](https://hackerone.com/reports/1952978))
* Commit [205f1e6](https://github.com/nodejs/node/commit/205f1e643e25648173239b2de885fec430268492) prevents CVE-2023-30584 but ignores non-string inputs.
* CVE-2023-32004 ([report 2038134](https://hackerone.com/reports/2038134))
* Commit [1f64147](https://github.com/nodejs/node/commit/1f64147eb607f82060e08884f993597774c69280) prevents CVE-2023-32004 but ignores non-`Buffer` objects.

## Patch

I provided a patch, which was merged into Node.js 20 as [commit fa5dae1944](https://github.com/nodejs/node/commit/fa5dae1944).

## Impact

Equivalent to CVE-2023-30584 ([report 1952978](https://hackerone.com/reports/1952978)) and CVE-2023-32004 ([report 2038134](https://hackerone.com/reports/2038134)).

## Timeline

- **Report Filed**
- **Report Triaged**
- **Cve Id Added**
- **2023-11-29** @kunderkoffler: Reached out to the project for modifier validation.
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **2023-12-21** @tniessen: Thank you very much @kunderkoffler, I appreciate it!

> Node.js does have modifiers in place on their IBB submissions, so in this case this submission was awarded at 75% of the standard reward amount.

As in my previous report, I am a bit unsure about the modifier that applied here - the only 25% modifier, according to the [project page](https://hackerone.com/nodejs), applies if "a proposed patch was not provided for the issue", but as mentioned and referenced in the description above, I wrote a patch which was released as part of a Node.js security release. I'd appreciate clarification since I've now repeatedly run into uncertainty w.r.t. IBB modifiers.
- **2024-01-13** @tniessen: ping @kunderkoffler :)
- **Report Became Public**
