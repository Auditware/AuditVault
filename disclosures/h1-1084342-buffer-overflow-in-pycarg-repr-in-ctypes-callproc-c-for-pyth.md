---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
  - stack/python
  - vuln/code-injection
  - vuln/dos
  - impact/rce
substate: "resolved"
weakness: "Classic Buffer Overflow"
enriched: true
body: true
date: 2021-08-25
submitted: 2021-01-22T09:48:45.890Z
bounty_usd: 1500
votes: 51
cve: "CVE-2021-3177"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "jordyzomer"
source: "https://hackerone.com/reports/1084342"
title: "Buffer overflow in PyCArg_repr in _ctypes/callproc.c for Python 3.x to 3.9.1"
---
# Buffer overflow in PyCArg_repr in _ctypes/callproc.c for Python 3.x to 3.9.1

> **Severity:** High | **Bounty:** 1,500 USD | **Votes:** 51 | **Program:** Internet Bug Bounty | **Disclosed:** 2021-08-25

- Report: [https://hackerone.com/reports/1084342](https://hackerone.com/reports/1084342)
- CWE: Classic Buffer Overflow | CVE: CVE-2021-3177
- Submitted: 2021-01-22T09:48:45.890Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**TL;DR Description**

Python 3.x through 3.9.1 has a buffer overflow in PyCArg_repr in _ctypes/callproc.c, which may lead to remote code execution in certain Python applications that accept floating-point numbers as untrusted input, as demonstrated by a 1e300 argument to c_double.from_param. This occurs because sprintf is used unsafely. The CVE number used for this vulnerability is CVE-2021-3177.

**Details**

There's a buffer overflow in the PyCArg_repr() function in _ctypes/callproc.c.

The buffer overflow happens due to not checking the length of th sprintf() function on line: 

    case 'd':
        sprintf(buffer, "<cparam '%c' (%f)>",
            self->tag, self->value.d);
        break;

Because we control self->value.d we could make it copy _extreme_ values. For example we could make it copy 1e300 which would be a 1 with 300 zero's  to overflow the buffer.

This could potentially cause RCE when a user allows untrusted input in these functions.

**Proof of Concept**

>>> from ctypes import *
>>> c_double.from_param(1e300)
*** buffer overflow detected ***: terminated
Aborted


**References**

    MISC:https://bugs.python.org/issue42938
    MISC:https://github.com/python/cpython/pull/24239
    MISC:https://python-security.readthedocs.io/vuln/ctypes-buffer-overflow-pycarg_repr.html

## Impact

**Availability**

Buffer overflows generally lead to crashes. Other attacks leading to lack of availability are possible, including putting the program into an infinite loop.


**Access Control**

Buffer overflows often can be used to execute arbitrary code, which is usually outside the scope of a program’s implicit security policy.

**Other**

 When the consequence is arbitrary code execution, this can often be used to subvert any other security service.

## Timeline

- **Report Filed**
- **2021-01-22** @antenna: Hi @jordyzomer,

Thanks for your submission! 
Your report is currently being reviewed and we'll get back to you once there's more to share.

Best regards,
@antenna
- **Report Title Updated**
- **Cve Id Added**
- **Report Triaged**
- **2021-01-22** @antenna: Hello @jordyzomer,

Thank you for your submission! We were able to validate your report, and have submitted it to the appropriate remediation team for review. They will let us know the final ruling on this report, and when/if a fix will be implemented. Please note that the status and severity are subject to change.

Regards,
@antenna
- **2021-04-22** @jordyzomer: Hi! I was wondering if there's any updates :)
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
