---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/http-response-splitting
  - env/web
substate: "not-applicable"
weakness: "HTTP Response Splitting"
enriched: true
date: 2026-06-08
submitted: 2026-06-06T11:38:12.398Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/curl|curl]]"
reporter: "torkd1"
source: "https://hackerone.com/reports/3785919"
title: "libcurl: HTTP/1.x bare LF byte in response header value enables cookie jar pollution and POST body/credential exfiltration via redirect — RC=0, curl 8"
---
# libcurl: HTTP/1.x bare LF byte in response header value enables cookie jar pollution and POST body/credential exfiltration via redirect — RC=0, curl 8

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** curl | **Disclosed:** 2026-06-08

- Report: [https://hackerone.com/reports/3785919](https://hackerone.com/reports/3785919)
- CWE: HTTP Response Splitting
- Submitted: 2026-06-06T11:38:12.398Z

## Timeline

- **Report Filed**
- **2026-06-06** @bagder: Are these two separate problems you just put into a single report?
- **2026-06-06** @torkd1: Hi bagder,
Thanks for the feedback.
I put both vectors in one report because they share the exact same root cause in lib/http.c (LF handling inside quoted header values) and the same fix.
If you prefer them tracked separately, I'm happy to split the report right away. Just say the word.
- **2026-06-06** @bagder: I'm only looking at case A now since we deal with one issue per report. Please submit different reports for different issues.

I can't run the code you've submitted. It's python and it needs preserved indentation. You need to attach the files or make them proper markdown.

I don't understand the way you've described the problem so I cannot see the error. It drowned in all the text.
- **2026-06-06** @torkd1: {F6050313} Understood,  I'll submit Attack B as a separate report.

For Attack A, I'm attaching the Python file directly to preserve indentation. The core issue in one line:

memchr(buf, '\n', blen) in http_rw_headers() splits header lines without checking if the parser is inside a quoted-string value, allowing a bare LF inside a header value to inject synthetic header lines.

Reproduces on curl 8.20.0 (aarch64-android) with the attached script — RC=0, cookie jar polluted with attacker-controlled session token
- **2026-06-06** @bagder: The LF marks the end of a header. It cannot be "within" something in a header. It seems your "attack" is sending a cookie and curl handles it, as requested.
- **2026-06-06** @torkd1: The Set-Cookie line is not sent by the server as a separate header. 
The server sends exactly one header field:

  Authentication-Info: nextnonce="val\n[LF here]Set-Cookie: session=ATTACKER_INJECTED

The \n inside the value causes memchr() to split there, creating a 
synthetic Set-Cookie line. curl's own verbose output confirms this:

  < Authentication-Info: nextnonce="val
  * Added cookie session="ATTACKER_INJECTED" for domain 127.0.0.1
  < Set-Cookie: session=ATTACKER_INJECTED; Path=/

Three headers parsed from one server-sent line. The cookie is entirely 
synthetic — the server never sent a Set-Cookie header.
- **2026-06-06** @torkd1: Regarding Attack B, same root cause, different exploitation vector:

The same bare LF splitting in memchr() can be used to inject a synthetic Location header in a 307 response. With -L, curl follows the injected redirect and forwards the full POST body to the attacker's server. With --location-trusted, the Authorization/Bearer token is also forwarded. RC=0, no warning.
{F6050542}
I'm unable to submit a separate report due to HackerOne's Signal requirement. Would it be acceptable to document Attack B here, or would you prefer I submit it through curl.se/dev/vuln-disclosure.html?

Attaching attack_b.py for reference
- **2026-06-06** @bagder: >   Authentication-Info: nextnonce="val\n[LF here]Set-Cookie: session=ATTACKER_INJECTED

The LF is the end of the header. What comes after the LF is the next header.
- **2026-06-06** @torkd1: Understood, thanks for the clarification. I'll close this one out. I may revisit and submit a cleaner report if I find a more concrete real-world vector.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2026-06-07** @torkd1: Nice
- **Manually Disclosed**
