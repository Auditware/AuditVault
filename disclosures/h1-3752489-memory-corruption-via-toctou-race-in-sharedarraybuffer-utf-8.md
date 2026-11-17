---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/time-of-check-time-of-use-toctou-race-condition
  - env/web
  - stack/node
substate: "informative"
weakness: "Time-of-check Time-of-use (TOCTOU) Race Condition"
enriched: true
date: 2026-05-23
submitted: 2026-05-21T06:31:23.619Z
bounty_usd: null
votes: 32
cve: []
program: "[[programs/nodejs|Node.js]]"
reporter: "v1ct0rv0nd00m"
source: "https://hackerone.com/reports/3752489"
title: "Memory Corruption via TOCTOU Race in SharedArrayBuffer UTF-8 Decode (`StringBytes::Encode`)"
---
# Memory Corruption via TOCTOU Race in SharedArrayBuffer UTF-8 Decode (`StringBytes::Encode`)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 32 | **Program:** Node.js | **Disclosed:** 2026-05-23

- Report: [https://hackerone.com/reports/3752489](https://hackerone.com/reports/3752489)
- CWE: Time-of-check Time-of-use (TOCTOU) Race Condition
- Submitted: 2026-05-21T06:31:23.619Z

## Timeline

- **Report Filed**
- **2026-05-22** @aduh95: Thanks for the report, I agree that sounds like a bug we'd like to fix, but I don't think this qualifies as a vulnerability. If the code in both threads is trusted (which it is, according to our threat model), no one can exploit this.

I suggest we close this as informative, disclose this and fix it in public. wdyt?
- **2026-05-23** @v1ct0rv0nd00m: Thanks @aduh95 for the quick assessment. I appreciate the transparency about the threat model reasoning.
  
  I'd like to offer a few points for consideration before we close this:

  ## Memory safety violations in native code deserve a higher bar than "trusted code"

The corruption occurs in C++ (`StringBytes::Encode`), not in JavaScript. Even if both threads run "trusted" JS, the result is undefined behavior in the runtime itself — out-of-bounds reads, heap corruption, potential code execution. This crosses from a logic bug into a memory safety primitive. Trusted code shouldn't be able to corrupt the process's native heap through a standard API.
                                                                 
  ## Realistic attack surfaces exist within the threat model

  - **Supply chain attacks**: A malicious npm dependency (trusted by inclusion) running in a Worker could race
  against the main thread's `Buffer.from(sab)` calls to corrupt memory and escalate beyond what normal JS allows —
   bypass the `--permission` model, corrupt internal state, leak adjacent heap data.
  - **The --permission model**: Node.js does have a permission/policy system that assumes JS code may be
  semi-trusted. Memory corruption in native code bypasses these controls entirely.
  - **Electron/embedded contexts**: Applications embedding Node.js often run code at different privilege levels
  sharing SharedArrayBuffers.

  ## 3. Severity vs. fixability

  I understand if this doesn't meet the bar for a CVE or bounty payout, but I'd argue it sits above "informative" - it's a concrete memory safety issue with a clear fix (copy-on-access or snapshot the SAB region before length
  calculation). Other runtimes (Deno, Bun) have treated similar SAB races as security-relevant.
  
  ## My suggestion

  If you still feel it's below the vulnerability bar, I'm fine with "informative" + public disclosure. I'd appreciate:
- Credit/acknowledgment in the fix commit or changelog
 - Permission to publish a writeup referencing the issue after the fix lands

  Happy to help with the patch if useful. Thanks again for engaging on this.
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
