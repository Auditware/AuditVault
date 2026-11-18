---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-after-free
  - env/web
substate: "not-applicable"
weakness: "Use After Free"
enriched: true
body: true
date: 2025-07-31
submitted: 2025-07-31T14:56:24.068Z
bounty_usd: null
votes: 27
cve: []
program: "[[programs/curl|curl]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/3279804"
title: "Stack use-after-scope in HTTP/3 POST request processing via CURLOPT_POSTFIELDS"
---
# Stack use-after-scope in HTTP/3 POST request processing via CURLOPT_POSTFIELDS

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 27 | **Program:** curl | **Disclosed:** 2025-07-31

- Report: [https://hackerone.com/reports/3279804](https://hackerone.com/reports/3279804)
- CWE: Use After Free
- Submitted: 2025-07-31T14:56:24.068Z

## Report summary

**Audit every libcurl POST in your stack. Treat `CURLOPT_POSTFIELDS` like explosives.** Either switch to `CURLOPT_COPYPOSTFIELDS` or prove your pointer lives forever. No exceptions.

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

  A stack use-after-scope vulnerability exists in libcurl's HTTP/3 request processing when using `CURLOPT_POSTFIELDS` with stack-allocated buffers. libcurl retains a pointer to user-provided POST data but accesses it after the original stack frame has been destroyed, leading to memory corruption and potential denial of service.

  The vulnerability occurs in `Curl_pretransfer()` at `transfer.c:569` when libcurl calls `strlen()` on the previously stored POST data pointer that now points to invalid stack memory.

 ##  Steps to Reproduce / Proof of Concept

  ### Environment

  - libcurl version: 8.16.0-DEV (master branch)
  - Compiler: Clang 20.1.8 with AddressSanitizer
  - Platform: macOS (ARM64)
  - Configuration: HTTP/3 enabled with ngtcp2/nghttp3

###  Reproduction Steps

  1. Build libcurl with ASAN:
```bash
  export CC=clang
  export CFLAGS="-O1 -g -fsanitize=address,undefined"
  ./configure --with-openssl --with-nghttp2 --with-nghttp3 --with-ngtcp2
  make
```

  2. Compile the reproducer:
```
  // http3_crash_poc.c
  #include <curl/curl.h>
  #include <string.h>

  int main() {
      CURL *curl = curl_easy_init();

      // Stack-allocated buffer that goes out of scope
      {
          char body_data[257];
          memset(body_data, 'A', 256);
          body_data[256] = '\0';

          curl_easy_setopt(curl, CURLOPT_URL, "https://example.com/");
          curl_easy_setopt(curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_3);
          curl_easy_setopt(curl, CURLOPT_POST, 1L);
          curl_easy_setopt(curl, CURLOPT_POSTFIELDS, body_data); // Vulnerable call
          curl_easy_setopt(curl, CURLOPT_TIMEOUT_MS, 50L);
      } // body_data goes out of scope here

      // libcurl accesses invalid memory during transfer
      curl_easy_perform(curl);
      curl_easy_cleanup(curl);
      return 0;
  }
```

  3. Compile and run:
```bash
  clang -fsanitize=address http3_crash_poc.c -lcurl -o poc
  ./poc
```

###  Crash Output
```
  ==3720==ERROR: AddressSanitizer: stack-use-after-scope on address 0x00016fa21470
  READ of size 45 at 0x00016fa21470 thread T0
      #0 strlen
      #1 Curl_pretransfer transfer.c:569
      #2 multi_runsingle multi.c:2376
      #3 curl_multi_perform multi.c:2756
      #4 easy_transfer easy.c:705
      #5 easy_perform easy.c:813

  SUMMARY: AddressSanitizer: stack-use-after-scope transfer.c:569 in Curl_pretransfer
```
###  Fuzzer Discovery

  This vulnerability was discovered using a custom libFuzzer fuzzing harness.

 ##  Technical Analysis

###  Root Cause

  The vulnerability stems from libcurl's `CURLOPT_POSTFIELDS` behavior:
  1. libcurl stores the pointer but doesn't copy the data
  2. The application's stack buffer becomes invalid after scope exit
  3. libcurl later dereferences the invalid pointer in `Curl_pretransfer()`

 ### Affected Code Path

  curl_easy_setopt(CURLOPT_POSTFIELDS) → 
  curl_easy_perform() → 
  Curl_pretransfer() →
  strlen(invalid_pointer) → 
  CRASH

###  Recommended Fix

  1. Documentation: Clarify that `CURLOPT_POSTFIELDS` data must remain valid until transfer completion
  2. API Enhancement: Consider adding bounds checking or automatic copying for stack-detected pointers
  3. Alternative API: Promote `CURLOPT_COPYPOSTFIELDS` for safer usage patterns

## Impact

##  Security Impact

  1. Denial of Service: Guaranteed crash leading to application termination
  2. Memory Corruption: Use-after-scope can lead to unpredictable behavior
  3. Potential Code Execution: In specific circumstances, memory corruption could be leveraged for control flow hijacking

###  Affected Scenarios

  - Applications using libcurl for HTTP/3 requests with POST data
  - Any code pattern where CURLOPT_POSTFIELDS points to stack-allocated memory
  - Particularly affects:
    - HTTP/3 client applications
    - API clients using stack buffers for request bodies
    - Embedded systems with limited heap usage

###  Real-World Exposure

  - Language bindings: Many curl bindings may inadvertently create this pattern
  - Example applications: CLI tools, web scrapers, API clients
  - Severity: High due to HTTP/3 adoption growth and remote exploitability

## Timeline

- **Report Filed**
- **2025-07-31** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-07-31** @bagder: The documentation for CURLOPT_POSTFIELDS specially emphasizes this so I believe your recipe above is a user error and not a libcurl flaw:

> The data pointed to is NOT copied by the library: as a consequence, it must be
preserved by the calling application until the associated transfer finishes.
This behavior can be changed (so libcurl does copy the data) by instead using
the CURLOPT_COPYPOSTFIELDS(3) option.
- **2025-07-31** @geeknik: User error. Got it. Let's disclose this so other people can steer clear.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
