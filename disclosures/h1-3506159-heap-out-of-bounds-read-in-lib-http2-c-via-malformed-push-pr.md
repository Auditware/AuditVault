---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/out-of-bounds-read
  - env/web
substate: "not-applicable"
weakness: "Out-of-bounds Read"
enriched: true
date: 2026-01-10
submitted: 2026-01-10T19:22:26.142Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/curl|curl]]"
reporter: "darksql"
source: "https://hackerone.com/reports/3506159"
title: "Heap Out-of-Bounds Read in lib/http2.c via Malformed PUSH_PROMISE Headers"
---
# Heap Out-of-Bounds Read in lib/http2.c via Malformed PUSH_PROMISE Headers

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** curl | **Disclosed:** 2026-01-10

- Report: [https://hackerone.com/reports/3506159](https://hackerone.com/reports/3506159)
- CWE: Out-of-bounds Read
- Submitted: 2026-01-10T19:22:26.142Z

## Timeline

- **Report Filed**
- **2026-01-10** @bagder: They are null terminated. How else would this ever work? Also, look at the source code.

This is a rubbish report.
- **2026-01-10** @darksql: Daniel,

You are correct regarding the typo in the suggested patch. The format specifier should be %.*s, not %.s. I apologize for the noise in the diff.

However, regarding the null-termination: While the current implementation of nghttp2 might implicitly null-terminate these buffers, the API contract explicitly states otherwise. According to nghttp2_on_header_callback documentation:

"The 'name' and 'value' pointers are NOT guaranteed to be null-terminated. [...] Applications MUST use the provided length parameters."

Relying on undocumented implementation details violates the API contract and creates a fragility if nghttp2 internal memory handling changes.

Furthermore, the attached ASAN (AddressSanitizer) log is not theoretical. It explicitly caught a heap-buffer-overflow (Read of size 11) originating from strlen inside curl_maprintf. This proves that under specific conditions (demonstrated in the reproduction script), the pointer provided is indeed causing an out-of-bounds read.

Corrected Patch:

h = curl_maprintf("%.*s:%.*s", (int)namelen, name, (int)valuelen, value);
Please review the ASAN trace F5210707: asan_output.txt.

Regards.
- **2026-01-10** @bagder: > Relying on undocumented implementation details violates the API contract

Perhaps, but that's not a vulnerability. That's just a potential *future* problem.
- **2026-01-10** @bagder: None of this shows an ASAN or valgrind report identifying a problem in libcurl. Do they? If so, please tell.
- **2026-01-10** @bagder: I think this exact problem was also already as wrongly reported in https://hackerone.com/reports/3480078
- **2026-01-10** @bagder: @darksql how did you find this (non-) issue?
- **2026-01-10** @darksql: You're absolutely right—that ASAN log was from the standalone reproduction code I wrote to isolate and verify the logic, not from a full libcurl build. Sorry if that was misleading, I just wanted to demonstrate the mechanism.

However, the bug in lib/http2.c is definitely real. It’s a direct API contract violation. The nghttp2 docs explicitly state that header pointers are not null-terminated and we must rely on the length parameters.

The problem is that curl_maprintf at line ~1642 is using %s. This forces an internal strlen() on those raw pointers, which will inevitably read past the buffer bounds until it hits a random null byte in memory. Even if it doesn't always crash (depending on heap layout), it's reading uninitialized memory every time.

The fix is straightforward: we just need to use the precision specifier %.*s with the provided lengths (namelen, valuelen) instead of relying on implicit null termination.
- **Report Not Applicable**
- **2026-01-10** @bagder: The [documentation](https://nghttp2.org/documentation/types.html#c.nghttp2_on_header_callback) for the callback says:

> Both name and value are guaranteed to be NULL-terminated

I rest my case.
- **Agreed On Going Public**
- **2026-01-10** @darksql: Thank you for clarifying that detail. I appreciate your time.
- **2026-01-10** @bagder: So how on earth did you find this? Everything was wrong or fake.
- **2026-01-10** @darksql: I was digging through the nghttp2 docs and noticed the explicit warning that header pointers aren't null-terminated. I checked the curl source, saw the %s format specifier in http2.c, and assumed the raw pointers were being passed directly.
The log was from a standalone test case I wrote to verify that specific interaction locally, rather than a full libcurl crash.
- **2026-01-10** @bagder: I quoted the actual nghttp2 docs above. It explicitly says they *are* NULL terminated. Your quote was fake, it was not from the documentation for this callback.
- **2026-01-10** @darksql: I am not a native English speaker, so I use AI tools to translate and summarize technical documentation. It appears the tool hallucinated that specific quote during the translation process and completely flipped the meaning. I should have verified the original source text manually.
- **2026-01-10** @bagder: I think you downplay what you used the AI for and yes it lied to you, like AIs do and now you are banned from our program.
- **Manually Disclosed**
- **Comments Closed**
