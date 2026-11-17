---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/stack-overflow
  - env/web
substate: "spam"
weakness: "Stack Overflow"
enriched: true
date: 2025-06-30
submitted: 2025-06-30T14:41:01.515Z
bounty_usd: null
votes: 14
cve: []
program: "[[programs/curl|curl]]"
reporter: "0xagent0"
source: "https://hackerone.com/reports/3230082"
title: "Stack-based Buffer Overflow in TELNET NEW_ENV Option Handling"
---
# Stack-based Buffer Overflow in TELNET NEW_ENV Option Handling

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 14 | **Program:** curl | **Disclosed:** 2025-06-30

- Report: [https://hackerone.com/reports/3230082](https://hackerone.com/reports/3230082)
- CWE: Stack Overflow
- Submitted: 2025-06-30T14:41:01.515Z

## Timeline

- **Draft Started**
- **Report Filed**
- **2025-06-30** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.
- **2025-06-30** @bagder: I run this POC code against this server and I get no crash. Can you elaborate on exactly which line of code the crash (buffer overflow) happens?
- **2025-06-30** @icing: I don't see it. The loop checks if `tmplen`, the strlen(v->data) + 6 bytes still fits into the buffer. If not, no copy is done.

If the var+6 fits and `v->data` contains a `,`, the part before `,` is added, a separator and the `v->data` after the `,`. Thus the amount added is the same as used in the check. Even with room left for the final addition after the loop.
- **2025-06-30** @bagder: @agent_0 I presume you used an AI to help you create this report?
- **2025-06-30** @jimfuller2024: which version of curl ? latest master branch ?
- **2025-06-30** @0xagent0: I used the latest master branch. The one from the github repository provided (https://github.com/curl/curl
) and tested it as shown in the provided in the screenshots I added. I ran  tests and confirmed the crashes, even now when I do so , its the same outcome. suboption() function within curl/lib/telnet.c. When the client receives a request from the server to send its environment variables (as specified by the user via the CURLOPT_TELNETOPTIONS setting), it attempts to build a response packet on the stack.
The function allocates a 2048-byte buffer named temp on the stack
- **2025-06-30** @0xagent0: The flaw lays  in how the variable is written to the buffer inside this if block. If the variable contains a comma (the format for NEW_ENV is VAR,VALUE), it is processed by the following msnprintf call:

len += msnprintf((char *)&temp[len], sizeof(temp) - len,
                 "%c%.*s%c%s", CURL_NEW_ENV_VAR,
                 (int)vlen, v->data, CURL_NEW_ENV_VALUE, ++s);
The length check only accounts for tmplen (the original string length), but this msnprintf call expands the string by adding two control characters (CURL_NEW_ENV_VAR and CURL_NEW_ENV_VALUE). This discrepancy allows an attacker to bypass the length check. By providing a series of carefully sized NEW_ENV options, an attacker can cause msnprintf to write far beyond the 2048-byte boundary of the temp buffer, corrupting the stack.... hey chat, give this in a nice way so I reply on hackerone with this comment
- **2025-06-30** @bagder: > The length check only accounts for tmplen

No. It specifically checks if len + tmplen  is less than sizeof (temp) - 6, but more than that: it then uses msnprintf() to add the data to the buffer and I can't spot a problem with how that is used.

You still have not told us on which source code line the buffer overflow occurs.

> hey chat, give this in a nice way so I reply on hackerone with this comment

This looks like you accidentally pasted a part of your AI chat conversation into this issue, even though you have not disclosed that you're using an AI even after having been asked multiple times.

That's just another indication this is AI slop.
- **Report Spam**
- **Agreed On Going Public**
- **Manually Disclosed**
