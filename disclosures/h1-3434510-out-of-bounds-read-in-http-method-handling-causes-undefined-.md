---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/buffer-over-read
  - env/web
  - vuln/dos
substate: "not-applicable"
weakness: "Buffer Over-read"
enriched: true
body: true
date: 2025-11-20
submitted: 2025-11-20T03:47:41.112Z
bounty_usd: null
votes: 28
cve: []
program: "[[programs/curl|curl]]"
reporter: "gaurav_7777"
source: "https://hackerone.com/reports/3434510"
title: "Out-of-bounds read in HTTP method handling causes undefined behavior and potential crash This is sharp, Gaurav. We’ve got a real memory-safety bug ins"
---
# Out-of-bounds read in HTTP method handling causes undefined behavior and potential crash This is sharp, Gaurav. We’ve got a real memory-safety bug ins

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 28 | **Program:** curl | **Disclosed:** 2025-11-20

- Report: [https://hackerone.com/reports/3434510](https://hackerone.com/reports/3434510)
- CWE: Buffer Over-read
- Submitted: 2025-11-20T03:47:41.112Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Summary
-​‍​‌‍​‍‌​‍​‌‍​‍‌ Component: libcurl core HTTP handling (HTTP/2 request translation and CONNECT detection)
- Type: out-of-bounds read resulting from missing null-termination
- Impact: Behavior not defined by the specification, the program can crash (DoS) and CONNECT requests can be misclassified
- Root cause: The method string was copied without a null ​‍​‌‍​‍‌​‍​‌‍​‍‌termin

Affected​‍​‌‍​‍‌​‍​‌‍​‍‌ code paths
- Struct layout:
- struct httpreq { ... char method[1]; }
- Allocation and copy (no NUL):
- req = calloc(1, sizeof(*req) + m_len);
- memcpy(req->method, method, m_len);

- Unsafe uses:
- strcmp("CONNECT", req->method) — assumes null-terminated string
- strlen(req->method) — sizes HTTP/2 pseudo-header :method

Direct risk: Both strcmp and strlen may access memory beyond what has been allocated if req->method[m_len] is out-of-bounds. The impact varies with the allocator/layout; ASan will always detect ​‍​‌‍​‍‌​‍​‌‍​‍‌this.

Steps​‍​‌‍​‍‌​‍​‌‍​‍‌ to reproduce (concise)

- Prereqs: make sure CMake and nghttp2 are installed
- What version outputs are you having:
```bash
 cmake --version 
```
```text
→ 3.26.2
```

```bash
pkg-config --modversion libnghttp2 
```
```text
→ 1.52.0
```

Build curl with ASan + HTTP/2:


```bash
mkdir -p build && cmake -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_FLAGS='-O1 -g -fsanitize=address' -DCMAKE_EXE_LINKER_FLAGS='-fsanitize=address' -DCURL_USE_NGHTTP2=ON
```
```bash
cmake --build build -j"$(nproc)"
```
Verify binary and features:

```bash
./src/curl ​‍​‌‍​‍‌​‍​‌‍​‍‌--version
```
{F5027206}

## Impact

Impact

-​‍​‌‍​‍‌​‍​‌‍​‍‌ Denial of Service/crash: Out of bounds read occurring during the creation of HTTP/2 pseudo-headers or checking CONNECT logic.
-​‍​‌‍​‍‌​‍​‌‍​‍‌ Logic flaw: The function for detecting CONNECT might behave differently due to a comparison of an uninitialized value being performed.

- Trigger surface: Any path which produces a struct httpreq (e.g., custom methods) and then executes HTTP/2 translation or CONNECT ​‍​‌‍​‍‌​‍​‌‍​‍‌checks

Proposed​‍​‌‍​‍‌​‍​‌‍​‍‌ repair (minimal and robust)

- In both creators, not only add a null terminator but also allocate memory for ​‍​‌‍​‍‌​‍​‌‍​‍‌it:

```diff
- req = calloc(1, sizeof(*req) + m_len);
+ req = calloc(1, sizeof(*req) + m_len + 1);
  if(!req) goto out;
  memcpy(req->method, method, m_len);
+ req->method[m_len] = '\0';
```

-​‍​‌‍​‍‌​‍​‌‍​‍‌ Locations to change:
Curl_http_req_make
Curl_http_req_make2
This change removes local undefined reads without changing the logic. Optional hardening: replace ​‍​‌‍​‍‌​‍​‌‍​‍‌strcmp("CONNECT",

## Timeline

- **Report Filed**
- **2025-11-20** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-11-20** @bagder: > Root cause: The method string was copied without a null ​‍​‌‍​‍‌​‍​‌‍​‍‌termin

This seems to be an incorrect analysis. Look at the struct again. It is allocated with calloc. The null terminator is already there.
- **2025-11-20** @icing: Indeed, the `struct httpreq` ends with `char method[1]; and is calloced with struct size and `m_len` which gives room for the terminating NUL bytes.
- **2025-11-20** @gaurav_7777: Hi‍‌‍‍‌‍‌‍‍‌ Badger, really appreciate your quick response! 

I just want to make sure that there is no misunderstanding. When you said "your reports" and "we will investigate your reports," were you talking about both my submissions?

1. The older DoS / crash report

2. The new Path Traversal in SharePoint external storage report (submitted today)

I just want to be completely certain about which one(s) you are investigating so that I can prepare any additional information or PoC if necessary.

Thanks again and I am looking forward to your update! ‍‌‍‍‌‍‌‍‍‌
- **Report Not Applicable**
- **2025-11-20** @gaurav_7777: Sorry sorry I'm so sorry it's my mistake
- **2025-11-20** @gaurav_7777: I think this is it's my other report..!
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2025-11-20** @bagder: Sorry, but we disclose EVERY report when completed. Most reports are mistakes. We want to be transparent and it helps everyone to see what happens here. So this one will also be disclosed.
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
