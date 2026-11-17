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
date: 2025-07-09
submitted: 2025-07-09T03:04:29.559Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/curl|curl]]"
reporter: "brobagazzzx"
source: "https://hackerone.com/reports/3242005"
title: "Use-After-Free in OpenSSL Keylog Callback via SSL_get_ex_data() in libcurl"
---
# Use-After-Free in OpenSSL Keylog Callback via SSL_get_ex_data() in libcurl

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** curl | **Disclosed:** 2025-07-09

- Report: [https://hackerone.com/reports/3242005](https://hackerone.com/reports/3242005)
- CWE: Use After Free
- Submitted: 2025-07-09T03:04:29.559Z

## Timeline

- **Report Filed**
- **2025-07-09** @dfandrich: Your proof of concept program doesn't use libcurl at all. Are you reporting a problem in libcurl or in OpenSSL?
- **2025-07-09** @jimfuller2024: Did you forget to include a curl.h example ? IF the author omits information or speaks 'in riddles' we really cannot consider their submission valid ... not a (curl) security issue that I can see.
- **2025-07-09** @bagder: How did you "find" this? I presume an AI was involved?

> The callback may be invoked after the associated SSL object has been freed via SSL_free(), 

A two second look at the callback code in curl shows that we don't access "the associated SSL object" in the callback at all. So how is this a problem again?

> leading to access to a dangling pointer and potential crash or information leak via  SSL_get_ex_data().

There is exactly *zero* uses of SSL_get_ex_data() in libcurl code.
- **Report Not Applicable**
- **Agreed On Going Public**
- **2025-07-09** @brobagazzzx: Got it, thanks for the clarification. You're right — this doesn't impact libcurl directly. I appreciate the review and the transparency.
- **Manually Disclosed**
