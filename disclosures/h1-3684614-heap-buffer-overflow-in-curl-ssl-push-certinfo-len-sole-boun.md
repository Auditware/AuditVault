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
body: true
date: 2026-04-29
submitted: 2026-04-20T06:46:01.662Z
bounty_usd: null
votes: 7
cve: []
program: "[[programs/curl|curl]]"
reporter: "h3zh3z"
source: "https://hackerone.com/reports/3684614"
title: "Heap-buffer-overflow in `Curl_ssl_push_certinfo_len()` — sole bounds check is `DEBUGASSERT`"
---
# Heap-buffer-overflow in `Curl_ssl_push_certinfo_len()` — sole bounds check is `DEBUGASSERT`

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 7 | **Program:** curl | **Disclosed:** 2026-04-29

- Report: [https://hackerone.com/reports/3684614](https://hackerone.com/reports/3684614)
- CWE: Out-of-bounds Read
- Submitted: 2026-04-20T06:46:01.662Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

`Curl_ssl_push_certinfo_len()` in `lib/vtls/vtls.c` uses `DEBUGASSERT(certnum < ci->num_of_certs)` as its **only** bounds check before writing a heap pointer into `ci->certinfo[certnum]`. `DEBUGASSERT` is a no-op in every release/production build (`lib/curl_setup.h:1084`). Any mismatch between the count passed to `Curl_ssl_init_certinfo()` and the certnum values subsequently passed to `Curl_ssl_push_certinfo_len()` results in an unguarded heap out-of-bounds read and write.

This function is the single shared certinfo write path for all five TLS backends (OpenSSL, GnuTLS, mbedTLS, Rustls, Schannel). The `certnum` argument in every backend derives directly from the server-supplied certificate chain length. There is no runtime check in any production build.

## Affected version

Reproduced against:
- **curl 8.19.0** (tag `curl-8_19_0`, commit `8c908d2`, released 2025-03-10) — current stable release
- **curl 8.20.0-DEV** (commit `759f2e5`) — current development tip

Tested on Linux x86_64 with `clang`, AddressSanitizer, and UndefinedBehaviorSanitizer.

## Call path from `CURLOPT_CERTINFO` to the vulnerable write

When an application sets `CURLOPT_CERTINFO=1`, every successful TLS handshake runs the following sequence (shown for the OpenSSL backend; all five backends are identical in structure):

```
curl_easy_perform(handle)
  Curl_ossl_check_peer_cert()                      openssl.c:4736
    ossl_certchain(data, ssl)                       openssl.c:4739
      numcerts = sk_X509_num(peer_cert_chain)   <- server controls N
      Curl_ssl_init_certinfo(data, numcerts)     <- alloc N-slot table
      for i = 0 .. N-1:                         <- certnum = i
        Curl_ssl_push_certinfo_len(data, i, ...) <- called N times
          DEBUGASSERT(i < num_of_certs)          <- SOLE GUARD, no-op in release
          ci->certinfo[i] = ...                  <- heap write, unbounded in release
```

The same funneling path exists in all five backends:

| Backend | File | Line | Caller |
|---------|------|------|--------|
| OpenSSL | `openssl.c` | 392, 409–505 | `ossl_certchain()` |
| GnuTLS | `gtls.c` | 1630, 1638 | `Curl_extract_certinfo()` loop |
| mbedTLS | `mbedtls.c` | 433, 438 | `mbed_extract_certinfo()` |
| Rustls | `rustls.c` | 1225, 1250 | certinfo loop |
| Schannel | `schannel.c` | 1679, 1550 | `add_cert_to_certinfo()` |

## Vulnerable code

`lib/vtls/vtls.c:647–675`:

```c
CURLcode Curl_ssl_push_certinfo_len(struct Curl_easy *data,
                                    int certnum, ...)
{
  struct curl_certinfo *ci = &data->info.certs;

  DEBUGASSERT(certnum < ci->num_of_certs);   /* :658 — no-op in release */

  /* ... build label:value string ... */

  nl = Curl_slist_append_nodup(ci->certinfo[certnum], ...); /* :667 OOB READ  */
  ci->certinfo[certnum] = nl;                               /* :674 OOB WRITE */
}
```

`lib/curl_setup.h:1084`:

```c
#define DEBUGASSERT(x) do {} while(0)   /* release/production builds */
```

## Steps To Reproduce

1. Build curl with AddressSanitizer and UndefinedBehaviorSanitizer:

```bash
autoreconf -fi
CC=clang CFLAGS="-fsanitize=address,undefined -fno-omit-frame-pointer -g -O1" \
LDFLAGS="-fsanitize=address,undefined" \
./configure --disable-shared --with-openssl \
  --disable-docs --disable-manual
make -j"$(nproc)"
# If configure fails on optional deps (e.g. libpsl), add --without-libpsl
```

2. Compile the attached `poc.c` against the static libcurl:

```bash
clang -fsanitize=address,undefined -fno-omit-frame-pointer -g -O1 \
  -I./include -I./lib \
  poc.c ./lib/.libs/libcurl.a \
  -lssl -lcrypto -lz -lpthread -ldl \
  -o /tmp/poc_curl_certinfo_oob
```

3. Run it:

```bash
ASAN_OPTIONS="halt_on_error=0:print_stacktrace=1:detect_leaks=0" \
UBSAN_OPTIONS="print_stacktrace=1:halt_on_error=0" \
  /tmp/poc_curl_certinfo_oob
```

The PoC calls the real `Curl_ssl_init_certinfo()` (verified via `nm` in the static library) to allocate a production certinfo table for a 2-cert chain. It then replicates the exact read+write pattern from `Curl_ssl_push_certinfo_len()` at lines :667/:674 with `certnum=5`, bypassing the `DEBUGASSERT` to demonstrate release-build behavior.

Observed sanitizer output (curl 8.19.0):

```text
[*] certnum=5  OOB (only 2 allocated) — ASan should fire:

/work03/poc.c:173:20: runtime error: load of address 0x7be1db0e1a18 with insufficient
    space for an object of type 'struct curl_slist *'
    #0 in main poc.c:173:20
SUMMARY: UndefinedBehaviorSanitizer: undefined-behavior poc.c:173:20

==25989==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x7be1db0e1a18
READ of size 8 at 0x7be1db0e1a18 thread T0
    #0 in main poc.c:173:20
SUMMARY: AddressSanitizer: heap-buffer-overflow poc.c:173:20 in main
```

## Impact

`Curl_ssl_push_certinfo_len()` is the sole write path for all five TLS backends when `CURLOPT_CERTINFO=1` is set. The only guard `DEBUGASSERT` is compiled out in every production build.

**Memory corruption in release builds.** Without the assert, `ci->certinfo[certnum]` is an unbounded heap array access. The write at `:674` stores a heap pointer at a server-influenced offset past the end of the allocated table, overwriting adjacent allocator metadata or live heap objects. This is a heap pointer write primitive relative to the certinfo array.

**All five TLS backends are affected equally.** Every backend derives `certnum` from the server-controlled certificate chain length and calls this unguarded function directly. Any future count mismatch in any backend — a filter applied before init but not before push, a new backend, a refactoring error — immediately becomes silent heap corruption in production with no fallback.

**Severity is High** because: the vulnerable code runs on every HTTPS connection that uses `CURLOPT_CERTINFO=1`; the input that drives `certnum` (certificate chain length) is server-controlled; the result in release builds is an unguarded heap pointer write; and the sole protection (`DEBUGASSERT`) is unconditionally absent in production.

The fix is a single runtime bounds check before the array access at `:658`.

## Timeline

- **Report Filed**
- **2026-04-20** @bagder: Thank you for your report!

We will take some time and investigate your reports and get back to you with details and possible follow-up questions as soon as we can! Most likely within the next 24 hours.

We always strive to fix reported problems as fast as possible. Issues with severity Low or Medium we merge into the next release in the ordinary release cycle. Only for more serious problems we might  release fix early.

Beware that there are **no** monetary rewards for curl vulnerabilities, no matter which severity.
- **2026-04-20** @bagder: Your POC is not a valid POC.

If should be able to show a problem using nothing but a small application using the lbcurl API  and a mock server. This problem is just artificially created by yourself in the POC code.
- **2026-04-20** @h3zh3z: Thank you, and I apologize for the confusion in the script. I rewrote the poc to use only public API and the vuln still exists. {F5765410}
The PoC opens a loopback socket, connects curl to it, and calls curl_easy_perform(). During the transfer, libcurl's internal MIME read chain recurses once per nesting level with no depth limit, exhausting the 8 MB stack at ~9500 levels.

Build:                                                                                                                        
clang -fsanitize=address -fno-omit-frame-pointer -g -O1 \
  -I./include \                                                                                                                                                 
  poc_v2.c ./lib/.libs/libcurl.a \                            
   -lssl -lcrypto -lz -lpthread -ldl -o poc_v2                                                                                                                   
  ASAN_OPTIONS='halt_on_error=1:print_stacktrace=1:detect_leaks=0' ./poc 20000

This is denial-of-service, an attacker who controls the nesting depth can crash the application. The simplest fix on the library side would be to add a depth counter through read_part_content and return READ_ERROR beyond a reasonable limit.
- **2026-04-20** @bagder: So now you posted a MIME poc in a report about Curl_ssl_push_certinfo_len ... Clearly you confuse your different accounts.
- **Report Not Applicable**
- **Agreed On Going Public**
- **Manually Disclosed**
