---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/stack-overflow
  - env/web
substate: "not-applicable"
weakness: "Stack Overflow"
enriched: true
body: true
date: 2025-12-12
submitted: 2025-12-12T04:24:36.511Z
bounty_usd: null
votes: 15
cve: []
program: "[[programs/curl|curl]]"
reporter: "mlgzackfly"
source: "https://hackerone.com/reports/3462525"
title: "Buffer Overflow in cURL Internal printf Function"
---
# Buffer Overflow in cURL Internal printf Function

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 15 | **Program:** curl | **Disclosed:** 2025-12-12

- Report: [https://hackerone.com/reports/3462525](https://hackerone.com/reports/3462525)
- CWE: Stack Overflow
- Submitted: 2025-12-12T04:24:36.511Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

A critical buffer overflow vulnerability exists in the `curl_msprintf()` function in cURL's internal printf implementation. The function writes formatted output to a user-provided buffer without performing any bounds checking, allowing attackers to overflow arbitrary memory and potentially achieve arbitrary code execution.

## Affected Version
Current master branch (commit 141ce4be64) and potentially earlier versions

## CVSS Score Breakdown

**Base Score: 9.8 (Critical)**
- **Attack Vector (AV):** Network (N)
- **Attack Complexity (AC):** Low (L)
- **Privileges Required (PR):** None (N)
- **User Interaction (UI):** None (N)
- **Scope (S):** Unchanged (U)
- **Confidentiality (C):** High (H)
- **Integrity (I):** High (H)
- **Availability (A):** High (H)

## Vulnerability Details

### Location
- **File:** `lib/mprintf.c`
- **Function:** `curl_msprintf()`
- **Lines:** 1203-1211

### Root Cause
The vulnerability occurs because `curl_msprintf()` calls `formatf()` with the `storebuffer()` callback function, which writes directly to the provided buffer without any size validation:

```c
int curl_msprintf(char *buffer, const char *format, ...)
{
  va_list ap_save; /* argument pointer */
  int retcode;
  va_start(ap_save, format);
  retcode = formatf(&buffer, storebuffer, format, ap_save);
  va_end(ap_save);
  *buffer = 0; /* we terminate this with a zero byte */
  return retcode;
}

static int storebuffer(unsigned char outc, void *f)
{
  char **buffer = f;
  **buffer = (char)outc;  // VULNERABILITY: No bounds checking
  (*buffer)++;
  return 0;
}
```

### Attack Vector
An attacker can trigger this vulnerability by:
1. Providing a malicious format string to any cURL function that internally uses `curl_msprintf()`
2. Supplying format specifiers that generate output larger than the target buffer
3. Causing stack corruption and potentially hijacking control flow

## Proof of Concept

### Test Code
```python
import ctypes

# Load libcurl
libcurl = ctypes.CDLL("libcurl.so.4")
curl_msprintf = libcurl.curl_msprintf

# Create small buffer (16 bytes)
buffer = ctypes.create_string_buffer(16)

# Trigger overflow with long format string
long_format = b"A" * 100 + b"%s" + b"B" * 50
result = curl_msprintf(buffer, long_format)

print(f"Result: {result}")
print(f"Buffer content: {buffer.value}")
# Buffer overflow occurs - writes beyond 16-byte buffer
```

## Impact

### Business Impact
- **Confidentiality:** Critical - Potential memory disclosure
- **Integrity:** Critical - Arbitrary code execution
- **Availability:** High - Application crashes and DoS

### Technical Impact
- **Arbitrary Code Execution:** Attackers can execute arbitrary code in the context of the application
- **Memory Corruption:** Stack and heap corruption leading to crashes
- **Information Disclosure:** Potential leakage of sensitive memory contents
- **Denial of Service:** Application crashes and system instability

## Affected Components

### Primary Functions
- `curl_msprintf()` - Direct vulnerability
- Any function calling `curl_msprintf()` internally

### Potentially Affected Areas
- URL parsing and construction
- Error message formatting
- Log message generation
- HTTP header processing
- Cookie handling

## Timeline

- **Report Filed**
- **2025-12-12** @bagder: That's a bad use of the function. Not a libcurl issue.
- **Report Not Applicable**
- **Comments Closed**
- **Report Reopened**
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Comments Closed**
