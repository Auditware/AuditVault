---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/integer-overflow
  - env/network
substate: "informative"
weakness: "Integer Overflow"
enriched: true
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
