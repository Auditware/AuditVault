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
body: true
date: 2026-04-29
submitted: 2026-04-18T23:22:33.485Z
bounty_usd: null
votes: 8
cve: []
program: "[[programs/curl|curl]]"
reporter: "m1llie"
source: "https://hackerone.com/reports/3682666"
title: "Use-after-free in `curl_easy_ssls_export()` during callback re-entrancy"
---
# Use-after-free in `curl_easy_ssls_export()` during callback re-entrancy

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 8 | **Program:** curl | **Disclosed:** 2026-04-29

- Report: [https://hackerone.com/reports/3682666](https://hackerone.com/reports/3682666)
- CWE: Use After Free
- Submitted: 2026-04-18T23:22:33.485Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
`curl_easy_ssls_export()` iterates the SSL session list and invokes a caller-provided callback for each entry. If that callback calls `curl_easy_ssls_import()` on the same easy handle, the import path can evict and free the current session node while the export loop still holds it. The subsequent `Curl_node_next(n)` dereferences freed memory and triggers AddressSanitizer as a heap-use-after-free. I reproduced this on curl GitHub HEAD `54ded66618a2388e88e715c5eb4477d1083582ef`. The relevant code path is `lib/vtls/vtls_scache.c`, primarily `Curl_ssl_session_export()` around line 1214 with the related eviction path in `cf_scache_peer_add_session()` around line 781.

## Affected version
Reproduced on libcurl built from curl GitHub HEAD `54ded66618a2388e88e715c5eb4477d1083582ef` on Linux x86_64. The build used the OpenSSL backend with `clang`, AddressSanitizer, UndefinedBehaviorSanitizer, and configure options `--disable-shared --enable-ssls-export --with-openssl`.

## Steps To Reproduce:
1. Build the tested curl source with OpenSSL and `--enable-ssls-export`, for example:

```bash
autoreconf -fi
CC=clang CFLAGS="-fsanitize=address,undefined -fno-omit-frame-pointer -g -O1" \
LDFLAGS="-fsanitize=address,undefined" \
./configure --disable-shared --enable-ssls-export --with-openssl
make -j"$(nproc)"
```

2. Compile the attached `poc.c` against the freshly built static libcurl:

```bash
clang -fsanitize=address,undefined -fno-omit-frame-pointer -g -O1 \
  -I./include -I./lib \
  poc.c ./lib/.libs/libcurl.a \
  -lssl -lcrypto -lz -lpthread -ldl \
  -o /tmp/poc_curl_ssls_export_uaf
```

3. Run the PoC:

```bash
ASAN_OPTIONS="halt_on_error=0:print_stacktrace=1:detect_leaks=0" \
UBSAN_OPTIONS="print_stacktrace=1:halt_on_error=0" \
  /tmp/poc_curl_ssls_export_uaf
```

4. The PoC imports TLS session entries for the same peer and then calls `curl_easy_ssls_export()`. During the export callback it re-enters `curl_easy_ssls_import()` on the same easy handle, mutating the session list while the export code still holds the current node.

Observed sanitizer output:

```text
ERROR: AddressSanitizer: heap-use-after-free
#0 Curl_node_next /src/curl/lib/llist.c:246
#1 Curl_ssl_session_export /src/curl/lib/vtls/vtls_scache.c:1214
```

## Impact

An application using the SSL session export/import API can trigger a heap use-after-free in libcurl. In the tested build this is a reliable crash. In non-instrumented builds, dereferencing a freed list node may also lead to memory corruption, depending on allocator state and surrounding heap layout.

## Timeline

- **Draft Started**
- **Report Filed**
- **2026-04-19** @jimfuller2024: thx for the report - please review https://curl.se/dev/vuln-disclosure.html ... unless I missed something this seems like api misuse (it is relatively easy to make ASan scream if one wants to) ... will dig in a bit more.
- **2026-04-19** @jimfuller2024: maybe a bug at worst - will wait for others to comment.
- **2026-04-19** @bagder: Considered not to be a security issue. This functionality is labeled experimental and is explicitly not for production use.

We should probably make the function return error when called from within a callback.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
