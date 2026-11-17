---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
substate: "not-applicable"
weakness: "Classic Buffer Overflow"
enriched: true
date: 2022-03-09
submitted: 2022-02-18T18:51:47.568Z
bounty_usd: null
votes: 1
cve: []
program: "[[programs/curl|curl]]"
reporter: "shobhit2401200"
source: "https://hackerone.com/reports/1485379"
title: "Use of Unsafe function || Strcpy"
---
# Use of Unsafe function || Strcpy

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 1 | **Program:** curl | **Disclosed:** 2022-03-09

- Report: [https://hackerone.com/reports/1485379](https://hackerone.com/reports/1485379)
- CWE: Classic Buffer Overflow
- Submitted: 2022-02-18T18:51:47.568Z

## Timeline

- **Report Filed**
- **2022-02-18** @dgustafsson: First of all, these two occurrences are in test code and thus neither part of curl or libcurl, and not executed outside of building curl or in CI.

But, for the sake of it, let's look at these:

* `tests/libtest/stub_gssapi.c`
The `creds` member in the `gss_ctx_id_t` struct is defined as `char creds[MAX_CREDS_LENGTH];`. `const char *creds;` which is later copied into this member is populated by reading the `CURL_STUB_GSS_CREDS` environment variable. Before copying, the environment string (it is not our allocation to free etc) pointed to is inspected with the following conditional; `if(!creds || strlen(creds) >= MAX_CREDS_LENGTH)`. So, if the environment variable would overflow the `creds` struct member we would exit early and not even try to copy the string. There is thus no bug, and therefore no security vulnerability.

* `tests/server/socksd.c`
Depending on the scanned config key,  the contents of the `value` buffer is copied into `config.addr`, `config.user` or `config.password`. `value` is defined as `char value[32]` which is (as you've already copy/pasted above) equal to or much smaller than the destination buffers. So, no bug exists and thus no security vulnerability.

This is not code which is part of curl or libcurl, and there are no issues with the reported callsites. I will leave this open for a bit for the other security team members to see and will then proceed to close unless there are objections.
- **Report Not Applicable**
- **2022-02-19** @shobhit2401200: Thanks for the update. however i'm highly disappointed with your language that you guys are using to update a researcher. no issues thanks for the update.
- **Agreed On Going Public**
- **Manually Disclosed**
