---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-input-validation
  - env/web
  - stack/node
  - fix/input-validation
substate: "resolved"
weakness: "Improper Input Validation"
enriched: true
body: true
date: 2020-01-27
submitted: 2019-02-14T22:41:05.962Z
bounty_usd: null
votes: 6
cve: "CVE-2020-8124"
program: "[[programs/nodejs-ecosystem|Node.js third-party modules]]"
reporter: "ronperris"
source: "https://hackerone.com/reports/496293"
title: "[url-parse] Improper Validation and Sanitization"
---
# [url-parse] Improper Validation and Sanitization

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 6 | **Program:** Node.js third-party modules | **Disclosed:** 2020-01-27

- Report: [https://hackerone.com/reports/496293](https://hackerone.com/reports/496293)
- CWE: Improper Input Validation | CVE: CVE-2020-8124
- Submitted: 2019-02-14T22:41:05.962Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

> NOTE! Thanks for submitting a report! Please replace *all* the [square] sections below with the pertinent details. Remember, the more detail you provide, the easier it is for us to triage and respond quickly, so be sure to take your time filling out the report!

I would like to report Improper Validation and Sanitization in url-parse.

It allows attacker-controlled URL values to bypass validation and sanitization.

# Module

**module name:** url-parse
**version:** 1.4.4
**npm page:** `https://www.npmjs.com/package/url-parse`

## Module Description

The url-parse method exposes two different API interfaces. The url interface that you know from Node.js and the new URL interface that is available in the latest browsers.

## Module Stats

> Replace stats below with numbers from npm’s module page:

5,544,078 downloads in the last week

# Vulnerability

## Vulnerability Description

When using url-parse in the browser the protocol of the URL returned by the parser is not validated correctly. In the Node.js environment strings like, ` javascript:` return and empty string on the resulting URL object, but in the browser the current `document.location.protocol` is used when the provided URL doesn't match the validation expression `/^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i`.

## Steps To Reproduce:

Add the following `test to test/test.js` and run `npm run test-browser`.

 assume(parse.extractProtocol(' javscript:')).eql({
        slashes: false,
        protocol: '',
        rest: ''
      })

# Wrap up
Line 199 in index.js is setting the protocol to location.protocol, this is probably not the right move.

url protocol = extracted.protocol || location.protocol || '';

> Select Y or N for the following statements:

- I contacted the maintainer to let them know: [Y] 
- I opened an issue in the related repository: [N]

## Impact

Bypass input sanitization and validation.

## Timeline

- **Report Filed**
- **2019-02-14** @api_xmgchqhv69rw1zem6733xop0tz: Hello,
Thanks for reporting this to us. Someone will quickly look at this report and triage it.
- **Changed Scope**
- **Changed Scope**
- **Report Triaged**
- **Report Title Updated**
- **External User Joined**
- **2019-04-03** @3rdeden: I have a patch working for this, which basically just trims() all input before it's parsed but it's breaking one of the existing tests that explicity wants unicode whitespace at the end of the URL. An alternate fix would just do a trim left so the whitespace infront of the protocol would be trimmed creating the desired result again.
- **2019-04-03** @ronperris: @3rdeden That sounds good. That will patch the exploit path I reported.
- **2019-04-11** @3rdeden: Should be resolved in url-parse@1.4.5

- Referenced git commit: https://github.com/unshiftio/url-parse/commit/3ecd256f127c3ada36a84d9b8dd3ebd14316274b with the fix.
- **Report Severity Updated**
- **Report Severity Updated**
- **Report Vulnerability Types Updated**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
