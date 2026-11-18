---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
substate: "informative"
weakness: "Classic Buffer Overflow"
enriched: true
body: true
date: 2026-01-08
submitted: 2026-01-07T22:12:52.714Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/curl|curl]]"
reporter: "ankitsingh015"
source: "https://hackerone.com/reports/3493602"
title: "Stack Buffer Overflow in mprintf.c formatting function (fallback path)"
---
# Stack Buffer Overflow in mprintf.c formatting function (fallback path)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** curl | **Disclosed:** 2026-01-08

- Report: [https://hackerone.com/reports/3493602](https://hackerone.com/reports/3493602)
- CWE: Classic Buffer Overflow
- Submitted: 2026-01-07T22:12:52.714Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

### Summary
A stack-based buffer overflow exists in `mprintf.c` within the `out_double()` function. This vulnerability affects builds where `HAVE_SNPRINTF` is undefined, forcing the use of the legacy `sprintf` function.

The logic responsible for calculating the maximum safe precision (`maxprec`) for floating-point formatting fails to correctly handle negative numbers. Specifically, it does not properly account for the number of digits required by the integer portion of negative values. As a result, the buffer size calculation is incorrect, allowing a subsequent `sprintf` call to write more data than the fixed-size stack buffer can hold.


### Affected Component
- **File:** `lib/mprintf.c`
- **Function:** `out_double()`
- **Vulnerable Condition:** `HAVE_SNPRINTF` is not defined at compile time


### Technical Details
The function uses a local stack buffer (`work`) of size `BUFFSIZE` (326 bytes). To prevent overflow, the code attempts to estimate the number of digits required for the integer part of the floating-point value and reduce the allowable precision accordingly.

The relevant code is shown below (approx. line 675 in `master`):

```c
while(val >= 10.0) {
  val /= 10;
  maxprec--;
}
````

For negative values (e.g., `-1.0e100`), the condition `val >= 10.0` is false on entry, so the loop is skipped entirely. As a result, `maxprec` is not reduced, even though the integer portion of the formatted value will consume significant buffer space. The subsequent `sprintf` call writes the minus sign, the full integer portion, and the requested fractional precision, exceeding the 326-byte stack buffer.


## Steps To Reproduce

1. **Configure the Build**

   Compile `libcurl` with `HAVE_SNPRINTF` undefined to force the fallback `sprintf` path. One way to simulate this is by modifying `lib/mprintf.c`:

   ```c
   #if 0 /* Force fallback path for testing */
     (snprintf)(work, BUFFSIZE, formatbuf, dnum);
   #else
     (sprintf)(work, formatbuf, dnum); /* Vulnerable path */
   #endif
   ```

2. **Compile Reproduction Program**

   Compile the following C program against the modified `libcurl` build:

   ```c
   #include <stdio.h>
   #include <curl/curl.h>
   #include <string.h>

   int main(void) {
       // -1.0e100 requires ~102 characters for the integer part
       // Precision .300 requires 300 characters for the fractional part
       // Total output length ~402 characters
       // Stack buffer size in mprintf.c is 326 bytes
       double v = -1.0e100;

       char *output = curl_maprintf("%.300f", v);
       
       if (output) {
           printf("Output length: %lu bytes\n",
                  (unsigned long)strlen(output));
           curl_free(output);
       }
       return 0;
   }
   ```

3. **Run the Program**

4. **Observe**

   The output length exceeds the 326-byte buffer size. Depending on stack protections (stack canaries, ASLR), this results in a segmentation fault or stack smashing detection.


## Suggested Fix

Correct the integer digit calculation to account for negative values by operating on the absolute value (or equivalent logic):

```c
double absval = fabs(val);

while(absval >= 10.0) {
  absval /= 10.0;
  maxprec--;
}
```

Optionally, clamp `maxprec` to prevent underflow:

```c
if(maxprec < 0)
  maxprec = 0;
```

## Impact

This vulnerability results in a classic stack-based buffer overflow.

* **Availability:** Denial of Service (application crash)
* **Security Impact:** In scenarios where the floating-point value and format string are influenced by attacker-controlled input, this issue could potentially be leveraged for further memory corruption, including control-flow manipulation.
* **Scope:** The vulnerable code path is part of the legacy fallback implementation and is not used in default modern curl builds. It primarily affects legacy Unix systems, embedded platforms, or custom builds where `snprintf` is unavailable or explicitly disabled.

## Timeline

- **Report Filed**
- **2026-01-07** @bagder: @han_ank please mention a platform where this happens with unaltered source code
- **2026-01-08** @jimfuller2024: which platforms ... maybe really old linuxes (I remember some older bsd variants, of course System V!) ... maybe some embedded systems (TinyOS or FreeRTOS) ... there is virtually no 'surface area' here which might indicate we can deprecate this all together.
- **2026-01-08** @jimfuller2024: forgot to mention - but I am not even certain TinyOS can build curl ... maybe someone has done it with FreeRTOS
- **2026-01-08** @bagder: There were some systems in the 90s that lacked snprintf. Even really old Windows back in those days I believe might had lacked it.

In the last twenty or so years even embedded systems have been made with *proper* libc implementations that offer snprintf. I have not been able to find anything done in the last decades that do not offer snprintf.

snprintf() is mandated by the C99 standard, which as the name suggests, came around 1999. libc implementations intended to work with C99 then need to offer the function.

As we cannot find any system that is not a legacy end of life one, we cannot consider this a valid vulnerability - but a bug.

To completely avoid this discussion from happening again, we remove the sprintf() fallback from the code: https://github.com/curl/curl/pull/20218
- **2026-01-08** @ankitsingh015: Thanks for the clarification. I understand the classification as a bug rather than a security vulnerability given the lack of supported platforms without snprintf. I appreciate the decision to remove the fallback path entirely to avoid future issues.
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
