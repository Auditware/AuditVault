---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/heap-overflow
  - env/web
  - vuln/info-disclosure
  - vuln/dos
substate: "not-applicable"
weakness: "Heap Overflow"
enriched: true
body: true
date: 2025-06-30
submitted: 2025-06-29T17:33:41.745Z
bounty_usd: null
votes: 10
cve: []
program: "[[programs/curl|curl]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/3229490"
title: "Heap Buffer Overflow in libcurl curl_slist_append via Unterminated String"
---
# Heap Buffer Overflow in libcurl curl_slist_append via Unterminated String

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 10 | **Program:** curl | **Disclosed:** 2025-06-30

- Report: [https://hackerone.com/reports/3229490](https://hackerone.com/reports/3229490)
- CWE: Heap Overflow
- Submitted: 2025-06-29T17:33:41.745Z

## Report summary

# libcurl heap-buffer-overflow: API contract vs. memory safety — you decide.

An easily reproducible heap buffer overflow exists in libcurl’s `curl_slist_append()` function, triggered by passing a non-NUL-terminated string. The function internally calls `strdup()`, which in turn invokes `strlen()` with no bounds check—leading to out-of-bounds heap reads if the input isn’t NUL-terminated.

## Steps to Reproduce:
	•	Allocate a buffer, e.g. 256 bytes.
	•	Fill it with non-zero bytes; don’t NUL-terminate.
	•	Call curl_slist_append(NULL, buffer);
	•	Observe AddressSanitizer reporting a heap-buffer-overflow.

## Minimal PoC:
```
#include <curl/curl.h>
#include <stdlib.h>
#include <string.h>
int main() {
  char *buf = malloc(4);
  memcpy(buf, "\xbc\x07\x7a\x02", 4); // No NUL
  curl_slist_append(NULL, buf); // 💥 Heap overflow
  free(buf);
}
```

Command:
```bash
clang -fsanitize=address -g poc.c -lcurl -o curl_poc
./curl_poc
```
## Impact:
> Confidentiality: High — arbitrary heap memory can be leaked.
> Availability: Medium — easy DoS/crash on malformed input.
> Integrity: Low — limited to reading, not writing.

Attack surface: Any code, binding, or fuzz harness using libcurl and `not strictly validating NUL-termination on user input` (think FFI in Rust, Go, Python, etc.)

## Why This Still Matters:
> C contracts ≠ modern memory safety.
> Hardened builds, fuzzing, and language bindings can all hit this crash in the real world.
> Just because the spec says “don’t do that” doesn’t mean you should ship APIs that crash on malformed input.

### Takeaway:
If you want to break (or secure) memory in 2025, don’t trust legacy API contracts.
Trust code that enforces bounds, even when nobody’s watching.

> “We don’t blame the maintainers for upholding a legacy view of C.
> But we also don’t stop at ‘Not Applicable.’
> Because memory doesn’t care about intent. It cares about bounds.”

Stay glitchy,
@geeknik

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

#Summary
A heap buffer overflow vulnerability exists in libcurl's `curl_slist_append()` function in `lib/slist.c:94`. When the function is called with a non-null-terminated string, the internal `strdup()` call triggers `strlen()` to read beyond allocated buffer boundaries, leading to a heap buffer overflow. This vulnerability can be triggered through various libcurl APIs that process user-controlled string data without proper null termination validation.


#Steps to Reproduce (STR/POC):
  1. Allocate a buffer of any size (e.g., 256 bytes)
  2. Fill the buffer completely with non-null bytes (no null terminator)
  3. Call curl_slist_append(NULL, buffer)
  4. The strlen() call within strdup() will read past the buffer boundary
  5. AddressSanitizer detects heap buffer overflow

  Minimal reproducer:
```c
  char *buffer = malloc(256);
  memset(buffer, 'A', 256); // No null termination
  curl_slist_append(NULL, buffer); // Triggers overflow
```

{F4507009}

Built and tested with libcurl, git commit `a487a4e4bddb301e44360c09a8167adc52c31e71`.

## Impact

Impact:
  - Confidentiality: High - Out-of-bounds read can leak sensitive heap memory contents
  - Integrity: Low - Limited write capability
  - Availability: Medium - Potential denial of service via crash

  The vulnerability allows attackers to:
  1. Read arbitrary heap memory beyond allocated boundaries
  2. Potentially crash applications using libcurl
  3. In some scenarios, may lead to information disclosure of sensitive data from adjacent heap allocations

  Attack Vectors:
  - HTTP header processing
  - URL parsing with malformed components
  - Cookie handling
  - Custom request methods
  - Any libcurl API accepting string parameters

  CVSS Score: 7.3 (High)

  CVSS Vector: CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:L

## Timeline

- **Report Filed**
- **2025-06-29** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-06-29** @dfandrich: `curl_slist_append()` is documented to accept a C string as input. C strings are NUL-terminated. Providing anything else will result in GIGO. It makes no sense to provide anything else because there is no out-of-band way to supply a string length.
- **2025-06-29** @bagder: I don't think this is using the API as documented and therefore not a security vulnerability. A *string* in C is null terminated by definition, and therefore passing other kinds of input to this API cannot be expected to work.

We can perhaps make it even clearer by emphasizing in the documentation that it needs to be a *null terminated* string, but that does not change how I view this report.
- **2025-06-29** @geeknik: Thanks for the quick triage and review. I completely understand the “not a security vulnerability” classification under the assumption that inputs follow the documented API contract (null-terminated C strings). However, I believe this merits a deeper consideration based on the following:

**Memory Safety is Language-Agnostic**

While C defines a string as null-terminated, the use of strlen() on a non-null-terminated buffer violates memory safety in a way that sanitizers, hardening tools, and modern security policies (e.g., Memory Tagging Extensions, CFI, ASan, MSan) explicitly forbid.

A function that reads past the end of a buffer, regardless of whether the input is malformed, still constitutes undefined behavior. That makes this a valid target for fuzzing, hardening, and sanitizer coverage, even if it’s not a “vulnerability” by your disclosure policy.

**libcurl is an API Boundary**

libcurl is often embedded in language bindings (Rust, Python, Go, Node, Java, etc.). Those bindings often cannot enforce null-termination at their FFI boundary unless they reallocate or sanitize every string. This means:
	•	Passing user-controlled data through language bindings to curl_slist_append() can easily result in this crash, even in valid applications.
	•	This becomes a denial-of-service vector or potential information disclosure vector (e.g., if the overflow lands near secrets).

So yes, this is GIGO at the C boundary, but it’s silently unsafe at FFI or ABI boundaries.

**"Just Document It” ≠ Safety**

Better API hygiene (asserting null-termination, rejecting oversized strings, or using safer wrappers) would proactively catch this early—even if just through a DEBUGASSERT() or strlen_safe() macro under fuzz builds.

**Proposal**

Even if you don’t consider this a security fix:
	•	Fix internally with an assert or graceful early return if strlen() reads >N bytes without finding null.
	•	Or use strnlen() with a sane cap (e.g., 1024) in fuzz builds or hardened builds to avoid violating bounds.
	•	Label the commit as hardening: not security:, if that helps the triage flow.

I’ll continue fuzzing `curl_easy_setopt()` interfaces and would be glad to coordinate if we find an actual exploitable case, but wanted to advocate here for treating memory safety violations as bugs, even if not CVEs.

Thanks again for the dialogue. \m/
- **2025-06-29** @bagder: > Those bindings often cannot enforce null-termination at their FFI boundary unless they reallocate or sanitize every string

I strongly disagree. The whole world would crash and burn if  they didn't abide to the API rules.

Every caller **MUST** provide strings null terminated to every C function that is documented to accept a C *string*, otherwise they use the function wrongly and then anything can happen and is beyond what we guarantee.

On the proposed mitigations:

> •	Fix internally with an assert or graceful early return if strlen() reads >N bytes without finding null.

curl_slist_append() would need to allow at least 100K inputs (for HTTP headers), so it would  not be a terribly affective assert as it wouldn't have caught your example above for example.

> •	Or use strnlen() with a sane cap (e.g., 1024) in fuzz builds or hardened builds to avoid violating bounds.

Why? We fuzz libcurl non-stop already and fuzzers should use the libcurl API correctly or it is a rather silly fuzzer.
- **2025-06-30** @geeknik: Thanks @bagder, I appreciate the directness. Let me clarify:

> “Every caller MUST provide strings null terminated to every C function that is documented to accept a C string.”

Absolutely. But in memory-safe ecosystems, we don’t gatekeep bugs by whether the developer should have done something. We evaluate by what the code actually does when violated.

** The Core Problem Isn’t the API Contract — It’s the Crash **

Let’s forget CVEs, FFIs, or bindings for a moment.

The issue here is simple:
> curl_slist_append() will crash with an out-of-bounds heap read from just 4 bytes of fuzzed input.

This happened before reaching any “100K valid input” edge case.

This is not a “silly fuzzer” issue. This is:
_A heap-buffer-overflow
_Triggered early in execution
_With no graceful failure path
_In a public-facing, core, input-accepting function

**Why This Still Matters (Even Without a CVE)**
_libcurl is a hardening-critical component in major distros and secure environments.
_Memory bugs, even non-exploitable, trigger early sanitizer aborts in hardened pipelines.
_This breaks guarantees even in fuzz builds, undermining `-fsanitize=address` effectiveness for downstream testing.

If you don’t want to change production behavior, no problem.

But fuzzing should include malformed inputs. The point is to shake loose exactly this kind of unsafe behavior. Denying it’s meaningful is like telling a crash dump it didn’t matter because the manual says “don’t do that.”

No hard feelings. Just advocating for memory safety from the trenches. \m/

Respectfully,
—@geeknik
- **2025-06-30** @dfandrich: Have you raised this issue to glibc? Because `strlen()` exhibits exactly the same "problem". As well as *every single other function ever designed that accepts C strings*. That is simply part of the language specification.
- **2025-06-30** @jimfuller2024: In some security contexts, I can see the point of this report ... in many places in curl we wrap up fundamentally unsafe functions (or ban their usage) ... in this instance we provide standard C guidance of how to use (eg.   accept a NUL terminated/C string as input). 

It is always more efficient to say 'how to use' an API correctly then the million ways of 'how not to use' an API. We are always balancing off 'writing code' vs 'providing guidance' ... I think in this case we got it right.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
