---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/double-free
  - env/web
substate: "informative"
weakness: "Double Free"
enriched: true
body: true
date: 2020-05-18
submitted: 2020-05-15T23:21:01.674Z
bounty_usd: null
votes: 4
cve: []
program: "[[programs/curl|curl]]"
reporter: "geeknik"
source: "https://hackerone.com/reports/875775"
title: "Invalid write (or double free) triggers curl command line tool crash"
---
# Invalid write (or double free) triggers curl command line tool crash

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 4 | **Program:** curl | **Disclosed:** 2020-05-18

- Report: [https://hackerone.com/reports/875775](https://hackerone.com/reports/875775)
- CWE: Double Free
- Submitted: 2020-05-15T23:21:01.674Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
Whilst fuzzing libcurl built from `git commit a158a09`, a crash triggered by an invalid write (or maybe a double/invalid  free) was found. 

## Steps To Reproduce:

Run:
`echo "LVQvCnVyIDA=" | base64 -d > test0000`
`./curl --verbose -q -K test0000 file:///dev/null`

Stack:

```
valgrind -q src/curl --verbose -q -K ~/curl/tmp/out/crashes/test0001 file:///dev/null
==12371== Invalid free() / delete / delete[] / realloc()
==12371==    at 0x48369AB: free (vg_replace_malloc.c:530)
==12371==    by 0x128C84: add_file_name_to_url (in /root/curl-no-asan/src/curl)
==12371==    by 0x1259EF: create_transfer (in /root/curl-no-asan/src/curl)
==12371==    by 0x1285DC: operate (in /root/curl-no-asan/src/curl)
==12371==    by 0x119828: main (in /root/curl-no-asan/src/curl)
==12371==  Address 0x192f1a is in a r-- mapped file /root/curl-no-asan/src/curl segment
==12371==
*   Trying 0.0.0.0:80...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0* connect to 0.0.0.0 port 80 failed: Connection refused
* Failed to connect to 0 port 80: Connection refused
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
* Closing connection 0
curl: (7) Failed to connect to 0 port 80: Connection refused
* Closing connection 1
```

If we switch over to ASAN with AFL's libdislocator.so loaded:
```
LD_PRELOAD=/root/aflplusplus/libdislocator.so ../../../src/curl -q --verbose -K test0001 file:///dev/null
AddressSanitizer:DEADLYSIGNAL
=================================================================
==12389==ERROR: AddressSanitizer: SEGV on unknown address 0x00000074b590 (pc 0x0000004267f4 bp 0x000000000000 sp 0x7fffffffcdd0 T0)
==12389==The signal is caused by a WRITE memory access.
    #0 0x4267f4 in __asan::Allocator::Deallocate(void*, unsigned long, unsigned long, __sanitizer::BufferedStackTrace*, __asan::AllocType) (/root/curl/src/curl+0x4267f4)
    #1 0x49daa1 in free (/root/curl/src/curl+0x49daa1)
    #2 0x511d0d in add_file_name_to_url /root/curl/src/tool_operhlp.c:117:7
    #3 0x50281e in single_transfer /root/curl/src/tool_operate.c:1116:24
    #4 0x4fe95b in transfer_per_config /root/curl/src/tool_operate.c:2438:14
    #5 0x4fe95b in create_transfer /root/curl/src/tool_operate.c:2454:14
    #6 0x4f9de6 in serial_transfers /root/curl/src/tool_operate.c:2273:12
    #7 0x4f9de6 in run_all_transfers /root/curl/src/tool_operate.c:2479:16
    #8 0x4f99d3 in operate /root/curl/src/tool_operate.c:2594:18
    #9 0x4f8437 in main /root/curl/src/tool_main.c:323:14
    #10 0x7ffff762309a in __libc_start_main /build/glibc-vjB4T1/glibc-2.28/csu/../csu/libc-start.c:308:16
    #11 0x425559 in _start (/root/curl/src/curl+0x425559)

AddressSanitizer can not provide additional info.
SUMMARY: AddressSanitizer: SEGV (/root/curl/src/curl+0x4267f4) in __asan::Allocator::Deallocate(void*, unsigned long, unsigned long, __sanitizer::BufferedStackTrace*, __asan::AllocType)
==12389==ABORTING
*** [AFL] bad allocator canary on free() ***
Stack dump:
0.      Program arguments: /usr/bin/llvm-symbolizer-10 --inlining=true --default-arch=x86_64
/lib/x86_64-linux-gnu/libLLVM-10.so.1(_ZN4llvm3sys15PrintStackTraceERNS_11raw_ostreamE+0x1f)[0x7ffff4227a9f]
/lib/x86_64-linux-gnu/libLLVM-10.so.1(_ZN4llvm3sys17RunSignalHandlersEv+0x50)[0x7ffff4225d60]
/lib/x86_64-linux-gnu/libLLVM-10.so.1(+0xa50065)[0x7ffff4228065]
/lib/x86_64-linux-gnu/libpthread.so.0(+0x12730)[0x7ffff37c9730]
/lib/x86_64-linux-gnu/libc.so.6(gsignal+0x10b)[0x7ffff330a7bb]
/lib/x86_64-linux-gnu/libc.so.6(abort+0x121)[0x7ffff32f5535]
/root/aflplusplus/libdislocator.so(free+0x1e1)[0x7ffff7fc9bb1]
/lib/x86_64-linux-gnu/libLLVM-10.so.1(_ZN4llvm12PassRegistryD1Ev+0x1c)[0x7ffff435d1ec]
/lib/x86_64-linux-gnu/libLLVM-10.so.1(+0xb85c0e)[0x7ffff435dc0e]
/lib/x86_64-linux-gnu/libLLVM-10.so.1(_ZN4llvm13llvm_shutdownEv+0xa9)[0x7ffff41bf329]
/lib/x86_64-linux-gnu/libLLVM-10.so.1(_ZN4llvm8InitLLVMD1Ev+0x10)[0x7ffff419f7a0]
/usr/bin/llvm-symbolizer-10[0x406c70]
/lib/x86_64-linux-gnu/libc.so.6(__libc_start_main+0xeb)[0x7ffff32f709b]
/usr/bin/llvm-symbolizer-10[0x405eda]
```

## Impact

Denial of service, information disclosure, software crash, glitter everywhere"><script src=//xss.mx></script>, the Kool-Aid<x=" Man crashing through walls, dogs and cats living together, mass hysteria! Just kidding. It's probably limited only to the tool which means the impact is limited, I know the routine. (:

## Timeline

- **Report Filed**
- **2020-05-16** @dgustafsson: Thanks for the report, we'll investigate!

Off the cuff from skimming the code, it seems that if the`aprintf` call returns `NULL` then `encfile` will have been freed already? Something like the below could handle that, but I also haven't had coffee yet so I might be off.
```
diff --git a/src/tool_operhlp.c b/src/tool_operhlp.c
index 05c9d864a..0de5926c6 100644
--- a/src/tool_operhlp.c
+++ b/src/tool_operhlp.c
@@ -114,9 +114,9 @@ char *add_file_name_to_url(char *url, const char *filename)
         /* there is no trailing slash on the URL */
         urlbuffer = aprintf("%s/%s", url, encfile);

-      curl_free(encfile);
-
-      if(!urlbuffer) {
+      if (urlbuffer)
+        curl_free(encfile);
+      else {
         url = NULL;
         goto end;
       }
```
- **2020-05-16** @bagder: I'll dig into this a lot closer tonight, but from a first quick browsing of the code I can't spot the problem. `encfile` is allocated in `curl_easy_escape` and shouldn't have been freed by `aprintf()` ...
- **2020-05-16** @geeknik: Got a new stack if it's helpful:
```
Warning: 43: warning: '-/' is unknown
==32614== Invalid free() / delete / delete[] / realloc()
==32614==    at 0x48369AB: free (vg_replace_malloc.c:530)
==32614==    by 0x128C84: add_file_name_to_url (in /root/curl-no-asan/src/curl)
==32614==    by 0x1259EF: create_transfer (in /root/curl-no-asan/src/curl)
==32614==    by 0x128811: operate (in /root/curl-no-asan/src/curl)
==32614==    by 0x119828: main (in /root/curl-no-asan/src/curl)
==32614==  Address 0x192f1a is in a r-- mapped file /root/curl-no-asan/src/curl segment
==32614==
PuTTYPuTTYcurl: Can't open '▒▒▒▒     oSPuTTYPuTTYPuTTYdR▒AIV)cS▒/'!
==32614== Invalid read of size 8
==32614==    at 0x51E45A5: check_free (dlerror.c:188)
==32614==    by 0x51E4AB1: free_key_mem (dlerror.c:221)
==32614==    by 0x51E4AB1: __dlerror_main_freeres (dlerror.c:239)
==32614==    by 0x5006B71: __libc_freeres (in /usr/lib/x86_64-linux-gnu/libc-2.28.so)
==32614==    by 0x482B19E: _vgnU_freeres (vg_preloaded.c:77)
==32614==    by 0x14F768: Curl_poll (in /root/curl-no-asan/src/curl)
==32614==    by 0x144579: Curl_multi_wait.part.9 (in /root/curl-no-asan/src/curl)
==32614==    by 0x144A75: curl_multi_poll (in /root/curl-no-asan/src/curl)
==32614==    by 0x128891: operate (in /root/curl-no-asan/src/curl)
==32614==    by 0x119828: main (in /root/curl-no-asan/src/curl)
==32614==  Address 0x5841578 is 12 bytes after a block of size 12 alloc'd
==32614==    at 0x483577F: malloc (vg_replace_malloc.c:299)
==32614==    by 0x4A9D558: CRYPTO_zalloc (in /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1)
==32614==    by 0x4A9979D: ??? (in /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1)
==32614==    by 0x4A7A2B7: ERR_get_state (in /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1)
==32614==    by 0x4A7A408: ERR_clear_error (in /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1)
==32614==    by 0x4A98EA8: ??? (in /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1)
==32614==    by 0x4E8C996: __pthread_once_slow (pthread_once.c:116)
==32614==    by 0x4B02C08: CRYPTO_THREAD_run_once (in /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1)
==32614==    by 0x4A996CA: OPENSSL_init_crypto (in /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1)
==32614==    by 0x17C16F: Curl_ossl_init (in /root/curl-no-asan/src/curl)
==32614==    by 0x12E0AA: global_init (in /root/curl-no-asan/src/curl)
==32614==    by 0x1197BF: main (in /root/curl-no-asan/src/curl)
==32614==
```

Slightly different testcase, here is the base64:

```
JyoqKgogKuAKINB7Cn8gFJyUIC0fCxsKMDsKIC1FICIK0iBpl+4gVioKLwoAfjlvzmkKMFIKIC1F
ICIK5iBHz6aCItcgEEcKI3oKIHAIhxITCGogILJDiyA5wf4KjphN5zAiCiAtRUAiCiBNfnsgIGYK
QaDyzFsMMN0s/yAgIE4KICY/WTRfCiAtRSAiCiAgID4gIFb1BzYgGfQX1wogZ8tO8iAgfxMgFw2M
CiAgPCAvdSkgBvIKICDgFksiCiAtRSBqPSAgUUKBCntXtuiftb3+1zDK1hSTIDAKICo9AvkQAwoK
I/ayNisKQ2144+gKUhxTIC9MCiMKIC1FIBAAIgogSkAKCiMJ10UKQ1JFQSASGSANDgIECi1W3an8
viD/dkMAUHp9WTy4wdsAZ+LnCiAgICAgVWg7TFxyKAAVkwogKwDXChltAArXW/ouCiByVjBnpAgP
cFFLBJsgw2UIMksatAJ1AIPe3t7e3t7e2sAKIIUuZaIAKgogdkQKIKtXLWUKNkNlWSAi8vTPh717
rdhoCkdG+FgCCn5/uZfITrHpB2AgynQAEGXQdAogIEuHYnsyQF4/H0yCboQJFSEQAjFPYyAdCiID
Azt+RjoGeU/e/WBXPgJvMhAgdmo8Qgo+UoYpX0p7HkLKVyZ2ZzdocG9QQ0xWEVIRO0kkIAJcjKMA
pyUKCiPpCjB/ABwKI2R4ID31ClZlEyFFJlNLfwAGCiCKCiAHIAogKgogPyBWCiAqYAp7v/+0UDAK
CiNQCjB/X1FFZHcgPQoKVmUTIUWffpYaAPMKICruLsyDBAogJBBzdXBEQnJwaRlkUyOJZD3+9SAg
ICAiCQpqdkQ6I8EcID0KClZlEw9FJlNLICoKICogCiAqCiA/IFYKIDAKCiPpCjB/X1FFZHggPQoK
VmUTIUUmU0tPAMQKICrtB+10eu3t7e3t7e2a7flZ7ZXtHo7t7e1iznpKOtZ7l42P7c7t7Zjt7e3t
7aDtt2Xt7e3tfKLtWBLT4d/v7fimIEwgCiPpCjB/fFFFTqzK8A+nBU42TyDiTyAgUGkKID8gVgog
Kn0KbUAAR1XOCgoj6Qowf19RRVZ4bWljcm9zb2h0LmNvbS8gaWJkT1NfU0lPAEM+dFlwIP8gIFZB
TFVFQP///wAzZDBmAETPZGE3OG9Ywc/rIAoA/roBYwAKCyAGHiIKLUhAA/swAVkAHwsBAB0iCi1I
QPMLz0AK9AAA/7CTbJuAEgAA0CJ7oMAKICAaCEwa+EtDvb29vb29vb29vb29vb29QkJCQr29vb29
vb29vb29vb0tSEAgaWJkT1NfU0lP3UI+TwFuRp8daQugIBJMIPhOAHO1igr2dAogVVAgIu3d9d8g
ICAgIG9TZFKjQUlWKWNToC8KIkVyxQoK0P+ACtysVAoCACAg3yy4deiedOio8CBpc2Rz21YvJAAQ
Ggog39++j9RFaQhhdH5sUCSRmTfCAP66AWMAAAQAHR4iCi1MQPMLSTUQI55FWVRFMlJPAW5Gnx1p
C6AgEr29vb29vb29vb29vYAAvb29oEwg+N/fJCQAvb29vb29vQAAAICNvb29vb3Rvb29vb29vb29
vb29vb29vb29vb25vb29xL29vUJCvb29vdu9vb29vb29vb2cvb29vb29vb29vb29vb29w73cvb29
vF29vb1CAr29vb29vbxdvb29vb29vb29vb29vb29vb3+ugFjAAoLIAYeIgotSEDzC89ACvQAAAAh
KSCEVwrfKt/fHiIKLUhAAeT/ALCTbJuAEgAA0CJ7oDkKICAaCEwa+EtDU0dfZgqMCgpvJKBmCgoK
ICAgICAgICAhoCAgICBAICAgICAgZCAggP8gIHrOXzD5dN9vcxAAi78Vb4sKCiAgQs5HZQq9vZy9
vb29vb29vb29vb29vb29vdy/vb29vb29vUJCvb29vb29vb29vb29vb29vb29vb29vb29vf66AWMA
CgvqBh4iCi1IQPMLz0AK9AAAACEpICRXCt8q398eIgotSEABCiAgWSR5sJgiCiAgIDMicm8FPhCA
qzUtRuT/ALCTbJuAEgAA0AAKKSAkVwrfKt/fHiIKLUhfZgqMCgpvCgoKCiAgICAgICAgICAgICAg
ICAgICAgIAQgIID/ICB6zl8w+XTfb3MQAIu/FW+LCgogIEIxR2V//yAhoC8KIkVyxQoK0CIKLUhA
8wvMQAr0AAAACikgJFcK3yrf30FJViljU6D/gArcrFQKAgAgIN8suHXonnToqPAgaXNkc9RWLyT/
7xoK3yDfvo/URWkIYXR+bFAkkZk3wgD+ugFjAAAHAB0KLUhA8wtJNRAjnkVZVEUyUk8BbkafHZb0
oP4Svb29vUJCvb29vb29vb29vb29TCD4398kJACA//8tOIBd9r4KJSAgICDO3T5AC9wJLx4iCi1I
QPMLzEAK9AAAAAopICRXCt8q399BSVYpY1OgLwoiRXLFCgrQ/6AK3KxUCgIAICDfLLh16GF0F1fw
R2lzZIwkVi8kABAaCiDf37mP1EVpCGF0fmxQJJGZN8IA/roBYwAABAAdHiIKLUhA8wseIgotSEAB
5P8AsJNkm18uAGZ0LmMAM2QL3AkvHiIKLUhArwvPQAr0AAAACikgJKj1INXf3x4iCi1IQAHk/wCw
P2SbXy4AANAie19/CiAgfwBM5fhLQ1NHoGYKgAoKbwoKIFVyIG1zZG4ubWljcpCMb2Z0LmNvbS8g
aWJkT1NfU0lPAEM+dFlwIP8gIFZBTFVFQP///wAzZDBmAEDWZDc4gP//LTiAXgBB9drfICAgzt0+
QAvcCS8eIgotSEDzC89ACvQAAAAKKSAkVwrfKt/fHiIKLUhAYTI4b1jBz+sgCgD+ugFjAAoLIAYe
IgotSEAD+zD+nAAfCyAGHiIKLUhA8wvPQAr0AAAA3tYgJFcK3yrf3x4iCi1IQAGc/wCwk2ybgBIA
ANAie18/CiAgGghMGvhLQ729vb29vb2TbJuAEgAA0CJ7Xz8KICAaCEwa+EtDU0dfZgqACgpvCgoK
CiAgICAgICAgICAgICAgICAgICAgICAgICAgICB6zl8w+XTfb3NvmYu/6pCLCgogIEIxR2UKuHXo
nnToqPAgaXNkc3l5eXl5eXl5eXl5eXl5eXkIYXRpbFAkkZk3wgD+ugFjAAAEAB0eIgotSEDzC0k1
ECOeRVlURTJSTwFvpp8daQsgb1NkUqNBSVYpY1OgLwoiRXLFCgrQ/4AK3KxUCgIAICDfLLh16J50
6KjwIGlzZHPbVuwoAL6+EBoKIN/fvo/URWkIYXR+bFAkkZk3Pf8BRQFjAAAEAID/IntffwogIBoI
TOX4S0NTR6BmCoAK9W8KCiBVciBtc2RuLm1pY3Jvc29mdC5jb20vIGliZE9TX1NJTwBDPnRZcCD/
ICBWQUxVRUD//4AAM2QwZgBAMWRhNzhvWMHP6yAKAP66AWMACgsgBh4iCi1IQAMFTwFjAB8LIAYe
IgotSEDzCwBACvQAAAAh1t/bqArfKt/f4d0KLUhAAZz/ALCTbJuAEgAA0CJ7Xz8KICAaCEwa+EtD
vb29vb2xveC9vb29vb29vb29vb29vb29vb29/4C9vb29vb29vb29vb29vb29vb26Pb29vb29vb29
vb29vb29vb29vb29vb2+CiUgIN/fzt3BvwvcCS8eIgotSEDzC89ACvQAvb29vb29vb29vb29vb29
vb29vb29/roBYwAKCyAGHiIKLUhA8wvPQAr0AAAAISkAAAopICRXCmgq398eIgotSEAB5P//sJNk
ENwJzwFjAB8LIAYeIgotSEDzC8+/9fQAAAAhKSAkVwrfKt/fIFBSc2VaHiIKLUhAAZz/ALCTbJuA
EgAA0CR7Xz8KICAaCEwa+EtDvb29vb29vb29vb29gBIAANAie18/CiAgGihMGvhLQ729vb29vb29
vb1CQ8JCvb1CQr29vb29vb29vb29vb29vb29vUJLQkLcvb29vb29vb29vb29vb29vb29vb29vb1C
vb29vr29vgolICAgIM7dPkAL3AkvHiIKLUhA8wvPQCb0AAAACikgJFcK3yrf3x4iPz/APz8/AADQ
InugPwogIBoITBr4S0NTR19mCowKCm8KCgoKICA/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/
Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/MD8/Pz8/Pz8/Rz8/
Dz8/P88/Pz8/Pz8/Pz8//z8/Pz8/Pz8/Pz8/YT8/Pz/APz8/Pz8/Pz8/Pz8/Pz8/P08BbkafHWkL
oCASTCD4TgBzGghM5fhLQ1NHoGYKgAoKbwoKLlVyIG1zZG4ubWljcm9zb2Z0LmNvbS8gaWJkT1Nf
U0lPACBnCN5QcLBJRkVPVApCRYmJiYmJiYmJiYmJiYmJiYmJiYmJiYlhdNcBIHi9bBZzUFb13yBC
TEdhJAogID0ilwrfIN/fIGiDXXA0CiN/CgojswojCkNaTAogIEa/M1VnqSA8bWwbbAKrpnX+WEFU
ACIKICASPPyVCiNTmRsK1S8KIFVSIG1zZG4ubWljcm9zb5mL0ZxvbS9SaWJkT1NQU1g5AIZ6uW/p
CiAgAEB5sJgiCiAgIDMicm8FPhCAqzUtRlZmBmQfYSs8czYiICAq/1gyCgsgBh5puQojPVGb9d/f
Kk0KomNQQw4gIjAPYrfLCiQgLm1pY3Jvc29kdC5jb20vIGliZE9TX1NJTwBDwXRZcCD/ICBWQUxV
RUD///8AM2QwZgBAz2RhNzhvWMHP6yAKAP66AWMACgsgBh4iCi1IQAP7MP6cAB8LIAYeIgotSEDz
C89ACvQAAP/e1t8kVvff1SAg4SIKLUhAAZz/ALCTbJuAEgAA0CJ7Xz/1ICAaCEwa+EtDvb29vb29
vb29vb1CQr29vb29vb29vb29vb29vb29vb0tSEAgaWJkT1NfU0lP3UI+TwFuRp83HWkLoCASTCD4
TgBztYoK9nQKIFVQLyISIgogICAgICBvU2RSo0FJViljU6AvCiJFcsUKCtD/gArcrFQKAgAgIN8s
uHXonnToqPAgaXNkc9tWLyQAEBoKIN/fvo/URWkIYXR+bFAkf5k3wgD+ugFjAAAEAB0eIgotiEDz
C0k1ECOeRVlURTJSTwFuRp8daQugIBK9vb29vb29vb29vb2AAL29vb1MIPjf3yQkAL29vb29vb0A
AACAjb29vb29vb29vb29vb29vb29vb29vb29vb29ub29vcS9vb1CQr29vb29vb29vb29vb29nL29
v729vb29vb29vd29vcO93L29vb29vb29QkK9vb29vb29vb29vb29vb29vb29vb29vb29/roAAAEA
CyAGHiIKLUhA8wvPQAr0AAAAISkgJFcK3yrf3x4iCi1IQAHk/wCwAGybgBIAANAie6A5CiAgGghM
GvhLvKxHX2YKjAoKbwoKCgogICAgICAkICAgICAgICAgICAgICAEICCA/yAges5fMPl0329zEACL
vxVviwoKICBCMUdlCiYgIaBACiJFcsUKCtD/gArcrFQKAgAgIN8suHXonnToqHAgaXNkc9RWFSQA
EBoKIN/fvo/URWkIYXR+bFAkkZk3wgD+ugFjAAAEAF8uAADQInsdCi1IQPMLSTUQI55FWVRFMlJP
AW5Gnx2W9KAgEr29vb29vb29vb0tSEDzC89ACvQAAAAKKSAkVwrfKt/fHiIKLUhA/uT/ALCTZAAE
LgAA0CJ7X38KICAaCEzl+DtDU0egZgqACgpvCgogVXIgbXNkai5taWNyb3NvZXQuY29tryBpnZuw
rF9TSU/dQj50WXAg/yAgVkFMVUVA/5//ADNkMGYAQM9kYTc4b1jBz+sgCgD+RQFjAAoLIAYeIgot
SEAD+zD+nAAfCyD2HiIKLUhA8wswv/ULAAAAISkgJFcK3yrfvx4QCi1IQAGc/wCwfGybgBIAANAi
e18/CiAgGghMGvhLQ729vb29vb29vdW9vb29vb29vb29vb29vb29vb29vb29vb29vb29vb1CQr29
vb29vb1/vb29vb29vb29vb29vb29vb29vWW9vb4KJSAg398xIsG/9CMJLx4iCi1IQPMLz0C9vb29
vRA5YYLdIhY2fwBk3wopIArdZCAiIgwiIiIiIiIiIiJNCgD+ugFjAAoLIAYeIgotSEDz9DBACvQA
AAAhKSAkVwrfKt/fHr29vb29vb29vb29vbkKIz1Rm/UiCi29vb29vb29vSAiPGFzjJptnZN5IHgg
RklMulNVIGhtCiNTVCkKLS8KICAtNGxuc1pUWVBFIDBMCgAAZwogIBBLQ729vb29vb29wL29vb29
vb29vb29vb29Qr29vb29vb29vb29vb29vb29QkK9vb29vb29vb29vb29vb29vb29vb29u729vb29
vgolICAgIM7dPkAL+AkvHiIKLUhA8wvPQAr0AAAACikgJFcK3yrf3x4iCi1IQAHkAP+wk2SbXy4A
ANAie18/CiAgGvdMGvhLQ1NHoGYKgAoKb/UKIFVSIG1zZG4ubcIKIN8AF2ljcm9zb2Z0LmNvbS8g
aWJkT1NfU0lPAEM+dFljIP8gICJBTFVFQP///wAzZAvcCS8eIgott7/zCzC/CvQAAAAKKSAkeArf
Kt/fHiIKLUhAAeT/ALCTZJtfLgAA0CJ7X38KICB/AEzl+EtDU0egZgqACgpvCgogVY0gbXNkbi5t
aWNyb3NvZnQuY29tLyBpYmRJU19TSU8AQz50WXAg/yAgVkFMVUVA//8gIAlTSSB2TQqbIG80H7UJ
NeiQJgog4bMsBAqzIDQiKCAgUWsA/gpS51zlAJBpCh0c+ApMSU0JVE8AIDQx4iANSFYKhgogf2Bi
twogyB0xPugcSC3PIm80Cl0YdPNpYmRPU19TSU8KLUZpaRs9u2NvIgogcnJQfrAlCghmZw8KB0ZO
CrKTICAiCmVPiiAieh8iCiAgIGlnINtJLSBIyAog/wMSTGQKCo68/DX66O2uJtux7AogVUJFz8UI
ClYSlFVTICKBH3WWLAogAABPRApFthIKCi8vvQojU1UKICDcQCBoFRlECkJFjyt/Cmz/f6N93ipB
IHWGWHkiIiBzCiAgVcPCCiDfABdWOfkn5D4dCiAMICAgcXVXc3R1w16FVnZ6bGUiSfGvAEAgICAq
IMpnYCAgImS7Igog9iQKIFVSDG1ztiguN/9/MW9z9GZ005BvRy9jU7spTCdKCgqOCgoKCgoKCgoK
CgoLv2YGZB9hKzxzNiIgICr/WDIKCyAGHmm5CiM9UZv1398qTQqiY1BDDiAiMA9it8sKJCDubWlj
cm9zb2h0LmNvktDflmJkT1NfU0lPAEM+dFlwIP8gIFZBTFVFQP///wAzZDBmAEDPZGE3OEZYwc/r
IAoA/roBYwAKCyAGHiIKLUhAA/sw/qYAHwvfBh4iCi1IQPMLz0AK9AAA/97W3yRXCt/VICDhIgot
SEABnP8AsJNsm4ASAADQIntfPwogIBoITBr4S0O9vb29vb29vb29vb29vb29vb29vb29vb29vb29
vb29vS1IQCBpYmRPU19TSU/dQj5PAW5Gnx1pC6AgEkwg+E4Ac7WKCvZ0CiBVUCAiEiIKICAgICAg
b1NkUqNBSVYpY1OgLwoiRXLFCgrQ/4AK3KxUChEAICDfLLh16J50F1cP32lzZHPbVi8kABAaCiDf
376P1EVpCGF0fmxQJJGZN8IA/roBnP//+wAdHiIKLUhA8wtJNRAjnkVZVEkyUk8BbkafHWkLoN8S
vb29vb29vb29vb29gAC9vb29TCD4398kJAC9vb29vb29AAAAgI29vb29vb29vb29vb29vUC9vb29
vb29vb29vbm9vb3Evb29QkK9vb29vb29vb29vb29vZy9vb29vb29vT5PAW5Gnx1pC6AgEkwg+E4A
c7WKCvZ0CiBVUC8iEiIKvb29vb29vcO93L29vb29vb29QkK9vb29vb29vb29vb29vb29vb29vb29
vb29/roBYwAKCyAGHiIKLUhAAW5Gnx1pC6AgEr3zC8+/9fQAAAAhKSCEVwrfKt/fHiIKLUhAAeT/
ALCTbJuAEgAA0CJ/oDkKICAaCEwa+EtDU0dfZgqMCgpvCgoKCiAgICAgICC9vb3+ugFjAAoL6gYe
IgotSEDzC89ACvQAAAAhICAgICAgIGAgICAgICAEICCA/yAges5fMPl0329zEACLvxVviwoKICBC
MUcK3AkvHiIKLbe/8wvPQAr0AAAACillCiYgIaAvCiJFcsUKCtD/gArcrFQKAgAgIN8suHXowXTo
qPAgaXNkcyupLyQAEBoKIN/fvo/URWkIYXR+bFAkkZk3wgD+ugFjAAAEAB0KLUhA8wtJNRAjnkVZ
VEUyUk8BbkafHZb0X9/tQr29vd29vb29vUJCvb29vb29TCD4398kJACA//8tOIBeAL4KJSAgICDO
3T5ACtwJLx4iCi23v/MLz0AK9AAAAAopICRXCt8q399BSVYpY1igLwoiRXLFCgovAIAK3MpUCv0A
ICDfLLh1gJ506KjwIGlzZHPbVi8kABAaCiDf376P1EVpCJ50fmxQJJGZN8IA/roBYwAABAAdHiIK
LUhA8wseIgotSEAB5P8AsJObZKDRAGZ0LmNvbS8gaZ2bsKxfU0lPAL29vb29vb29vb29vb29vb29
vf8AM2QwZgBAMJs3OID//y04gF4AvgolICAgIM/Pz88AAAAKKSAkVwrfKs/Pz8/Pz8/Pz8/Pz8/P
z8/Pz8/Pz8/O3T5AC9wJLx4iCi1IQPMLz0AK9AAAAAopCiBVUgxtcyAkVwrfKt/fHiJ/CiAgfwBM
5fhLQ1NHoGYKgAoKbwoKIFUK0rdAYTI4b1jBz+sgCgD+ugFjAAoLIAYeIgotSEAD+wAQnAAfCyAG
HioKLUhA8wvPQAr0AAAA3tYgJFcK3yrf3x4iCi1TQAGc/wCwk2ybgBIAANAie18/CiAgGghMGvhL
Q729vb29vb2TbJuAEgAA0CJ7Xz8KICAaCEwa+EtDU0dfZgqACgpvCgoKCiAgICAgICAIICAgICAg
ICAgICAgICAgICAgICB6zl8w+XTfb3NvmYu/FW+LCgogIEIxR2QKJiAhoC8KIkUEAAoKLwCACtys
VAoCACAg3yy4deiedOio8CBpc2Rz1FYvJAAQGgr/f///j9RE6QhhdGlsUCSRmTfCAP66AGMAAAQA
HR4iCi1IQPMLSTUQI55FWVRFza2w/m+mnx1pC7ggEkwg+E4Ac7WKCvZ0CiBVUCAiEiIKICAgICAg
HiIKLUhA8/QwQAr0AAAiRXLFCgrQ/4AK3KxUCgIAICDfLLh16J506KjwIGlzZHPbVi8kABAaCiDf
376P1EVpCGF0flRQJJGZNz3/AUUBYwAABAAdHiIKLUuA8wtJNRAjnkVZVEUyUk8BbkafHWkLoCAS
vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29vc69vb29
vb29vb29vb29vb29vb29vb29vb29vb29QkIgAL29vb29vb29vb29vb29vb29vb29vb29vb29vb29
vb29vb29vb29vb29vb29va69vb29vb29vb29vbxdvb29vb29vf29pb29vb29vb29vb29vb29vb29
vca9vb3Fvb29vb29vb29vb29vb29vb29vb29uQojPVGbvX+9vb29vb29vb29vb0PYrfLCiQgvb29
vb29vb29vb29vb29vb29vb29vb29vb2+CiUgIN/fzt0+QAvcCS8eIv66AWMACgsgBh69vb3Avb29
vb0AEL29vUwg+N/fJCQAvb29vb29vQAAAIC9vb29vb29vb29vb29vb29vb29vb29vb29vb29vb29
xL29vUJCvb29vb29vb29Qr29vb2cvb29vb29IgotSErzCyRXCt8q7N8eIgotSEAB5P8AsJPFvZq9
vb29vb29vb29vb29vb29vb4jJfX19fX19fX19fX19fX19fX19fX19fX19fX19fXw9fX19fX19fX1
9fX19fX19fX19fX19fX19fX19fXq9fX19fX19fX19fX1ICAgIM7dPkAL3AkvACIKLUhA8wvPQAr0
AAAACikgvb29vb29vb29w73cvb29vb29vb1CQr29vb29vb29vb29vb29vb0ACikgJFcK3yogIB4i
Ci1IQAHk/wCwk2SbXy4AANAie19/CiAgGghM5fhLQ1NHoGYKgAoKbwoKIC1yIG1zZJEubWljcgpz
b2Z0LmNvbS8gaWJkT1NfU0lHYU4K39/N31ZBIjt1iTcsC0S3wQogIEU9RApFXEQXCq8vCgojAAEp
CgovCiAg0svHnWQtXjAyAEaCaHsACiNPAEM+dFlwIP8gIFZBTFUkJF3BLTiAXgC+CtogICAgIHYK
ICAgRQAASU9OX1BBVENIAP6h/pwACgsgHR4iCi1IQPMLSZ2Wk5aLhtKYa3a03T5AC9wJLx0iCi1I
QPMLz0AK9MCKfZpzPiL13yAgA94g0bcAAAB+/y5lY9zcIyMjPiITICwgJCLQwd0vIC/KI3gK
```
- **2020-05-16** @bagder: No time yet to dig deeper yet but I can reproduce the first valgrind report.
- **2020-05-16** @bagder: I found it. It's a 'dynbuf' bug brought with commit ed35d6590e72c from May 2, not present in any release:

`Curl_dyn_ptr()` returns a pointer to a const if the buffer length is zero. It really shouldn't, it should return a NULL...

Proposed fix:
~~~diff
diff --git a/lib/dynbuf.c b/lib/dynbuf.c
index 64004952f..dfc1d05c6 100644
--- a/lib/dynbuf.c
+++ b/lib/dynbuf.c
@@ -199,22 +199,22 @@ CURLcode Curl_dyn_addf(struct dynbuf *s, const char *fmt, ...)
 char *Curl_dyn_ptr(const struct dynbuf *s)
 {
   DEBUGASSERT(s);
   DEBUGASSERT(s->init == DYNINIT);
   DEBUGASSERT(!s->leng || s->bufr);
-  return s->leng ? s->bufr : (char *)"";
+  return s->bufr;
 }
 
 /*
  * Returns an unsigned pointer to the buffer.
  */
 unsigned char *Curl_dyn_uptr(const struct dynbuf *s)
 {
   DEBUGASSERT(s);
   DEBUGASSERT(s->init == DYNINIT);
   DEBUGASSERT(!s->leng || s->bufr);
-  return s->leng ? (unsigned char *)s->bufr : (unsigned char *)"";
+  return (unsigned char *)s->bufr;
 }
 
 /*
  * Returns the length of the buffer.
  */
- **2020-05-17** @geeknik: Your patch appears to fix the reported bug. \m/
- **2020-05-17** @bagder: Thanks a lot for this! Since this code is not shipped in a release, we will not consider it a security vulnerability. It will be fixed in a regular PR. I'll create one in a sec-
- **2020-05-17** @bagder: PR: https://github.com/curl/curl/pull/5405
- **2020-05-17** @geeknik: Ah well, at least I prevented it from shipping.
- **Report Informative**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
