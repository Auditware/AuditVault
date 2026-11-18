---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/integer-overflow
  - env/web
  - vuln/code-injection
  - vuln/dos
substate: "resolved"
weakness: "Integer Overflow"
enriched: true
body: true
date: 2019-09-25
submitted: 2018-10-15T23:30:09.941Z
bounty_usd: 1000
votes: 52
cve: "CVE-2018-18311"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "jkrshnmenon"
source: "https://hackerone.com/reports/424447"
title: "Integer overflow leading to buffer overflow"
---
# Integer overflow leading to buffer overflow

> **Severity:** Critical | **Bounty:** 1,000 USD | **Votes:** 52 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-09-25

- Report: [https://hackerone.com/reports/424447](https://hackerone.com/reports/424447)
- CWE: Integer Overflow | CVE: CVE-2018-18311
- Submitted: 2018-10-15T23:30:09.941Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

There exists an integer overflow in Perl_my_setenv @ util.c : 2070

2070: void Perl_my_setenv(pTHX_ const char *nam, const char *val) {
...
2166:         const int nlen = strlen(nam);
...
2171:         vlen = strlen(val);
2172:         new_env = (char*)safesysmalloc((nlen + vlen + 2) * sizeof(char));

Here in a 64 bit version of Perl, since the arguments `nam` and `val` are user controlled, the 32 bit integers `nlen` and `vlen` are also under the control of the attacker. Therefore, if `nam` and `val` are two very long strings (for example, 2147483647 bytes long), the addition at line 2172 would result in an integer overflow.

The `new_env` would therefore be a chunk of a size which is smaller than the sum of the lengths of the two input strings.

This `new_env` is subsequently used in a call to `memcpy` to copy `nlen` bytes from `nam` followed by `vlen` bytes from `val`.

This results in a buffer overflow on the heap with attacker controlled input.

Please find attached a PoC which demonstrates the buffer overflow. Please note that the attached PoC consumes large amounts of memory and results in a segmentation fault on a 64 bit Ubuntu 16.04 system running a 64 bit version of perl.
This segmentation fault occurs due to the fact that the `memcpy` tries to write outside the initial heap boundary.

This vulnerability has been recognised as a serious security issue and has been assigned the identifier CVE-2018-18311 by the developers.

## Impact

Memory corruption with attacker controlled input which can lead to arbitrary code execution

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Needs More Info**
- **Report Inactive**
- **2018-12-04** @jkrshnmenon: Hi @reed, I'm not sure why it took this long, but the report is publicly available. [0]

[0] https://security-tracker.debian.org/tracker/CVE-2018-18311
- **2018-12-06** @jkrshnmenon: Will this issue be re-opened or should I open another one with this same report ?
- **Report Reopened**
- **2019-03-07** @jkrshnmenon: Hi everyone, it has been nearly 2 months since this issue was re-opened and I wanted to know what the current situation is regarding this issue.
- **Cve Id Added**
- **Report Severity Updated**
- **Report Triaged**
- **2019-07-19** @jkrshnmenon: Hi @tuxedo, may I know approximately how long the review might take?
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
