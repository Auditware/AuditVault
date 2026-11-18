---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/classic-buffer-overflow
  - env/web
  - vuln/dos
substate: "not-applicable"
weakness: "Classic Buffer Overflow"
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
It was observed that application is using strcpy() function which may cause buffer overflow attacks.

#Affected Code
https://github.com/curl/curl

# Affected Lines
1. Line 195 of curl-master\tests\libtest\stub_gssapi.c
2. Line 204,212,216 curl-master\tests\server\socksd.c

## Steps To Reproduce:
Lets first discuss what is the issue with strcpy function. basically it takes 2 arguments 1 dst 2 source. the issue is if the dst size is small and the source size is more without a null terminating value so it will overwrite the memory. so in these case 1 got the several lines about strcpy function. but i'm discussing 1 with you rest with remain the same.

        else if(!strcmp(key, "backend")) {
          strcpy(config.addr, value);

        else if(!strcmp(key, "password")) {
          strcpy(config.password, value);

  char addr[32]; /* backend IPv4 numerical */
  char user[256];
  char password[256];

here it is copying the value into config.addr and the size of addr is 32 and same goes for password is  256. now let suppose the value of value is more than 32 in case of add and in case of password it is more than 256. than it can be buffer overflow attack here. so here it will be secure if you use the functions like snprintf , strlcpy. or dynamically assign the size to the array.

## Supporting Material/References:
https://cwe.mitre.org/data/definitions/676.html
https://www.geeksforgeeks.org/why-strcpy-and-strncpy-are-not-safe-to-use/

# Recommendation:
It is recommended to use below mentioned functions to avoid buffer overflow attacks
1. snprintf
2. strlcpy

  * [attachment / reference]
Please find the attached screenshots for your reference.

## Impact

The strcpy() function does not specify the size of the destination array, so buffer overrun is often a risk. Using strcpy() function to copy a large character array into a smaller one is dangerous, but if the string will fit, then it will not be worth the risk. If the destination string is not large enough to store the source string then the behavior of strcpy() is unspecified or undefined.

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
