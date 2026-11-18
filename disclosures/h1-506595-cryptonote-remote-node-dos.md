---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/uncontrolled-resource-consumption
  - env/web
  - vuln/dos
substate: "resolved"
weakness: "Uncontrolled Resource Consumption"
enriched: true
body: true
date: 2019-07-03
submitted: 2019-03-08T03:01:48.309Z
bounty_usd: null
votes: 30
cve: []
program: "[[programs/monero|Monero]]"
reporter: "anonimal"
source: "https://hackerone.com/reports/506595"
title: "CryptoNote: remote node DoS"
---
# CryptoNote: remote node DoS

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 30 | **Program:** Monero | **Disclosed:** 2019-07-03

- Report: [https://hackerone.com/reports/506595](https://hackerone.com/reports/506595)
- CWE: Uncontrolled Resource Consumption
- Submitted: 2019-03-08T03:01:48.309Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary:

Remote node DoS. See patch below.

## Releases Affected:

All Monero versions, including the recent v0.14.0.2. Possibly all CryptoNote implementations that aren't Zano.

## Steps To Reproduce:

Since this is *currently* a theoretical attack, non-code PoC detailed in the patch below.

## Supporting Material/References:

Based against current `master` `49afbd0c53d29656689f319c7d3543204ead4e59`:

```diff
commit 6620d099800d8935596f59834ce389868b2851f0 (HEAD -> cryptonote)
gpg: Signature made Fri 08 Mar 2019 02:57:58 AM UTC
gpg:                using RSA key 12186272CD48E2539E2DD29B66A76ECF914409F1
gpg: using pgp trust model
gpg: Good signature from "anonimal <anonimal@getmonero.org>" [ultimate]
gpg:                 aka "anonimal <anonimal@kovri.io>" [ultimate]
gpg:                 aka "anonimal <anonimal@sekreta.org>" [ultimate]
gpg: binary signature, digest algorithm SHA256, key algorithm rsa4096
Author: anonimal <anonimal@getmonero.org>
Date:   Fri Mar 8 02:21:38 2019 +0000

    cryptonote_protocol_handler: prevent potential DoS
    
    Essentially, one can send such a large amount of IDs that core exhausts
    all free memory. This issue can theoretically be exploited using very
    large CN blockchains, such as Monero.
    
    Credit given to CryptoNote author 'cryptozoidberg' for the fix.

diff --git a/src/cryptonote_protocol/cryptonote_protocol_handler.h b/src/cryptonote_protocol/cryptonote_protocol_handler.h
index efd986b53..c9e35d2d9 100644
--- a/src/cryptonote_protocol/cryptonote_protocol_handler.h
+++ b/src/cryptonote_protocol/cryptonote_protocol_handler.h
@@ -52,6 +52,7 @@ PUSH_WARNINGS
 DISABLE_VS_WARNINGS(4355)
 
 #define LOCALHOST_INT 2130706433
+#define CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT 500
 
 namespace cryptonote
 {
diff --git a/src/cryptonote_protocol/cryptonote_protocol_handler.inl b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
index c8b43fb91..023d1b457 100644
--- a/src/cryptonote_protocol/cryptonote_protocol_handler.inl
+++ b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
@@ -889,6 +889,16 @@ namespace cryptonote
   int t_cryptonote_protocol_handler<t_core>::handle_request_get_objects(int command, NOTIFY_REQUEST_GET_OBJECTS::request& arg, cryptonote_connection_context& context)
   {
     MLOG_P2P_MESSAGE("Received NOTIFY_REQUEST_GET_OBJECTS (" << arg.blocks.size() << " blocks, " << arg.txs.size() << " txes)");
+
+    if (arg.blocks.size() > CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT)
+      {
+        LOG_ERROR_CCONTEXT(
+            "Requested objects count is too big ("
+            << arg.blocks.size() << ") expected not more then "
+            << CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT);
+        drop_connection(context, false, false);
+      }
+
     NOTIFY_RESPONSE_GET_OBJECTS::request rsp;
     if(!m_core.handle_get_objects(arg, rsp, context))
     {
```

This is essentially from https://github.com/hyle-team/zano/blob/master/src/currency_protocol/currency_protocol_handler.inl#L364 and confirmation will be needed that Monero doesn't already mitigate this elsewhere.

I have the above patch in my branch ready for PR but if you want to create your own patch, please give credit to cryptozoidberg and myself (anonimal). Thank you.

## Impact

Remote node DoS.

## Timeline

- **Report Filed**
- **2019-03-08** @moneromooo: I think this check is only done for RPC at the moment. You should also add a check for number of txes. I don't think anyone go through it all to remove large amount DoSes yet, so there'll be a lot of others. This patch seems fine as a sanity check.
- **2019-03-08** @moneromooo: I've just applied it, and btw your patch drops the connection but still causes the DoS to happen.
- **2019-03-08** @moneromooo: BTW, since this is K/V stuff, it's possible to send complex tree-like K/V data, which will be parsed, inlcuding plenty of irrelevant stuff. Then, once parsed successfully, the "correct" keys are looked up. So I believe you can DoS this in a large number of ways if you really want to, by sending something which will cause a lot of memory to be allocated (IIRC the vector sanity check is one byte at least per element, which means you can claim a lot of memory beforehand). It might take some non trivial amount of work to make this really DoS resistant.
- **2019-03-08** @anonimal: >btw your patch drops the connection but still causes the DoS to happen.

The patch causes the DoS? Or the DoS is not mitigated? How and why?

>It might take some non trivial amount of work to make this really DoS resistant.

Understood.
- **Report Triaged**
- **2019-03-08** @moneromooo: I mean, you call drop_connection, but don't return;, so the core call still gets done.
- **2019-03-08** @anonimal: Oops, an obvious blunder. I had assumed there was a hidden throw somewhere down the line (I barely looked at this, was mostly just relaying the message). I'll make the change. Outside of the RPC-only check and adding a check for number of transactions, is anything else needed for this report?
- **2019-03-08** @moneromooo: No, the report is clear, thanks.
- **2019-03-08** @anonimal: I started making the changes but, after speaking with @moneromooo, he said he'd handle it. Could you upload the diff here then, before PR, please?
- **2019-03-09** @moneromooo: What I have now is (including your patch). I'll look again tomorrow when less tired, and post if I change anything.

```
commit 08e8275e96f42e99579ac5e94706012ee80d749e (HEAD -> crash)
Author: moneromooo-monero <moneromooo-monero@users.noreply.github.com>
Date:   Fri Mar 8 19:17:20 2019 +0000

    cryptonote_protocol: expand basic DoS protection
    
    Count txes as well, and actually return before executing the DoS

diff --git a/src/cryptonote_protocol/cryptonote_protocol_handler.h b/src/cryptonote_protocol/cryptonote_protocol_handler.h
index 59a361ee0..1c10ced55 100644
--- a/src/cryptonote_protocol/cryptonote_protocol_handler.h
+++ b/src/cryptonote_protocol/cryptonote_protocol_handler.h
@@ -52,7 +52,7 @@ PUSH_WARNINGS
 DISABLE_VS_WARNINGS(4355)
 
 #define LOCALHOST_INT 2130706433
-#define CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT 500
+#define CURRENCY_PROTOCOL_MAX_OBJECT_REQUEST_COUNT 500
 
 namespace cryptonote
 {
diff --git a/src/cryptonote_protocol/cryptonote_protocol_handler.inl b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
index 316b6a1c4..811fab77c 100644
--- a/src/cryptonote_protocol/cryptonote_protocol_handler.inl
+++ b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
@@ -893,13 +893,14 @@ namespace cryptonote
   {
     MLOG_P2P_MESSAGE("Received NOTIFY_REQUEST_GET_OBJECTS (" << arg.blocks.size() << " blocks, " << arg.txs.size() << " txes)");
 
-    if (arg.blocks.size() > CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT)
+    if (arg.blocks.size() + arg.txs.size() > CURRENCY_PROTOCOL_MAX_OBJECT_REQUEST_COUNT)
       {
         LOG_ERROR_CCONTEXT(
             "Requested objects count is too big ("
-            << arg.blocks.size() << ") expected not more then "
-            << CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT);
+            << arg.blocks.size() + arg.txs.size() << ") expected not more then "
+            << CURRENCY_PROTOCOL_MAX_OBJECT_REQUEST_COUNT);
         drop_connection(context, false, false);
+        return 1;
       }
 
     NOTIFY_RESPONSE_GET_OBJECTS::request rsp;

commit 86c9c3613ec99762b56fc76939bd22a42c50cf74
Author: anonimal <anonimal@getmonero.org>
Date:   Fri Mar 8 18:56:26 2019 +0000

    cryptonote_protocol_handler: prevent potential DoS
    
    Essentially, one can send such a large amount of IDs that core exhausts
    all free memory. This issue can theoretically be exploited using very
    large CN blockchains, such as Monero.
    
    Credit given to CryptoNote author 'cryptozoidberg' for the fix.

diff --git a/src/cryptonote_protocol/cryptonote_protocol_handler.h b/src/cryptonote_protocol/cryptonote_protocol_handler.h
index de5593dc5..59a361ee0 100644
--- a/src/cryptonote_protocol/cryptonote_protocol_handler.h
+++ b/src/cryptonote_protocol/cryptonote_protocol_handler.h
@@ -52,6 +52,7 @@ PUSH_WARNINGS
 DISABLE_VS_WARNINGS(4355)
 
 #define LOCALHOST_INT 2130706433
+#define CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT 500
 
 namespace cryptonote
 {
diff --git a/src/cryptonote_protocol/cryptonote_protocol_handler.inl b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
index f2297eeba..316b6a1c4 100644
--- a/src/cryptonote_protocol/cryptonote_protocol_handler.inl
+++ b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
@@ -892,6 +892,16 @@ namespace cryptonote
   int t_cryptonote_protocol_handler<t_core>::handle_request_get_objects(int command, NOTIFY_REQUEST_GET_OBJECTS::request& arg, cryptonote_connection_context& context)
   {
     MLOG_P2P_MESSAGE("Received NOTIFY_REQUEST_GET_OBJECTS (" << arg.blocks.size() << " blocks, " << arg.txs.size() << " txes)");
+
+    if (arg.blocks.size() > CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT)
+      {
+        LOG_ERROR_CCONTEXT(
+            "Requested objects count is too big ("
+            << arg.blocks.size() << ") expected not more then "
+            << CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT);
+        drop_connection(context, false, false);
+      }
+
     NOTIFY_RESPONSE_GET_OBJECTS::request rsp;
     if(!m_core.handle_get_objects(arg, rsp, context))
     {

```
- **2019-03-09** @moneromooo: Sure, I'll use that one.
- **2019-03-09** @moneromooo: I had a look, and the memory usage is not bad actually. There's an insert which probably doubles usage, but nowhere as bad the RPC used to be. I also patched the fluffy block missing tx handler where you could ask for the same tx N times. So we end up with:

```
commit 0096c2f136cf4efecdfe2e69ecfafabc874e926b (HEAD -> crash)
Author: moneromooo-monero <moneromooo-monero@users.noreply.github.com>
Date:   Sat Mar 9 09:08:53 2019 +0000

    cryptonote_protocol: fix another potential P2P DoS
    
    When asking for txes in a fluffy transaction, one might ask
    for the same (large) tx many times

diff --git a/src/cryptonote_protocol/cryptonote_protocol_handler.inl b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
index 811fab77c..c7e27ee61 100644
--- a/src/cryptonote_protocol/cryptonote_protocol_handler.inl
+++ b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
@@ -790,12 +790,27 @@ namespace cryptonote
     NOTIFY_NEW_FLUFFY_BLOCK::request fluffy_response;
     fluffy_response.b.block = t_serializable_object_to_blob(b);
     fluffy_response.current_blockchain_height = arg.current_blockchain_height;
+    std::vector<bool> seen(b.tx_hashes.size(), false);
     for(auto& tx_idx: arg.missing_tx_indices)
     {
       if(tx_idx < b.tx_hashes.size())
       {
         MDEBUG("  tx " << b.tx_hashes[tx_idx]);
+        if (seen[tx_idx])
+        {
+          LOG_ERROR_CCONTEXT
+          (
+            "Failed to handle request NOTIFY_REQUEST_FLUFFY_MISSING_TX"
+            << ", request is asking for duplicate tx "
+            << ", tx index = " << tx_idx << ", block tx count " << b.tx_hashes.size()
+            << ", block_height = " << arg.current_blockchain_height
+            << ", dropping connection"
+          );
+          drop_connection(context, true, false);
+          return 1;
+        }
         txids.push_back(b.tx_hashes[tx_idx]);
+        seen[tx_idx] = true;
       }
       else
       {

commit 0d0e76af6e89a3ce2dbfcc6be0315ccd4c5b620a
Author: moneromooo-monero <moneromooo-monero@users.noreply.github.com>
Date:   Fri Mar 8 19:17:20 2019 +0000

    cryptonote_protocol: expand basic DoS protection
    
    Count transactions as well

diff --git a/src/cryptonote_protocol/cryptonote_protocol_handler.h b/src/cryptonote_protocol/cryptonote_protocol_handler.h
index 59a361ee0..1c10ced55 100644
--- a/src/cryptonote_protocol/cryptonote_protocol_handler.h
+++ b/src/cryptonote_protocol/cryptonote_protocol_handler.h
@@ -52,7 +52,7 @@ PUSH_WARNINGS
 DISABLE_VS_WARNINGS(4355)
 
 #define LOCALHOST_INT 2130706433
-#define CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT 500
+#define CURRENCY_PROTOCOL_MAX_OBJECT_REQUEST_COUNT 500
 
 namespace cryptonote
 {
diff --git a/src/cryptonote_protocol/cryptonote_protocol_handler.inl b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
index 5a67ff8b0..811fab77c 100644
--- a/src/cryptonote_protocol/cryptonote_protocol_handler.inl
+++ b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
@@ -893,12 +893,12 @@ namespace cryptonote
   {
     MLOG_P2P_MESSAGE("Received NOTIFY_REQUEST_GET_OBJECTS (" << arg.blocks.size() << " blocks, " << arg.txs.size() << " txes)");
 
-    if (arg.blocks.size() > CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT)
+    if (arg.blocks.size() + arg.txs.size() > CURRENCY_PROTOCOL_MAX_OBJECT_REQUEST_COUNT)
       {
         LOG_ERROR_CCONTEXT(
             "Requested objects count is too big ("
-            << arg.blocks.size() << ") expected not more then "
-            << CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT);
+            << arg.blocks.size() + arg.txs.size() << ") expected not more then "
+            << CURRENCY_PROTOCOL_MAX_OBJECT_REQUEST_COUNT);
         drop_connection(context, false, false);
         return 1;
       }

commit e0530c809c3775ce4e392a1dc3f61eaf53988763
Author: anonimal <anonimal@getmonero.org>
Date:   Sat Mar 9 09:11:44 2019 +0000

    cryptonote_protocol_handler: prevent potential DoS
    
    Essentially, one can send such a large amount of IDs that core exhausts
    all free memory. This issue can theoretically be exploited using very
    large CN blockchains, such as Monero.
    
    This is a partial fix. Thanks and credit given to CryptoNote author
    'cryptozoidberg' for collaboration and the fix. Also thanks to
    'moneromooo'. Referencing HackerOne report #506595.

diff --git a/src/cryptonote_protocol/cryptonote_protocol_handler.h b/src/cryptonote_protocol/cryptonote_protocol_handler.h
index de5593dc5..59a361ee0 100644
--- a/src/cryptonote_protocol/cryptonote_protocol_handler.h
+++ b/src/cryptonote_protocol/cryptonote_protocol_handler.h
@@ -52,6 +52,7 @@ PUSH_WARNINGS
 DISABLE_VS_WARNINGS(4355)
 
 #define LOCALHOST_INT 2130706433
+#define CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT 500
 
 namespace cryptonote
 {
diff --git a/src/cryptonote_protocol/cryptonote_protocol_handler.inl b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
index f2297eeba..5a67ff8b0 100644
--- a/src/cryptonote_protocol/cryptonote_protocol_handler.inl
+++ b/src/cryptonote_protocol/cryptonote_protocol_handler.inl
@@ -892,6 +892,17 @@ namespace cryptonote
   int t_cryptonote_protocol_handler<t_core>::handle_request_get_objects(int command, NOTIFY_REQUEST_GET_OBJECTS::request& arg, cryptonote_connection_context& context)
   {
     MLOG_P2P_MESSAGE("Received NOTIFY_REQUEST_GET_OBJECTS (" << arg.blocks.size() << " blocks, " << arg.txs.size() << " txes)");
+
+    if (arg.blocks.size() > CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT)
+      {
+        LOG_ERROR_CCONTEXT(
+            "Requested objects count is too big ("
+            << arg.blocks.size() << ") expected not more then "
+            << CURRENCY_PROTOCOL_MAX_BLOCKS_REQUEST_COUNT);
+        drop_connection(context, false, false);
+        return 1;
+      }
+
     NOTIFY_RESPONSE_GET_OBJECTS::request rsp;
     if(!m_core.handle_get_objects(arg, rsp, context))
     {

```
- **Report Title Updated**
- **2019-07-02** @anonimal: Resolved in https://github.com/monero-project/monero/commit/1d5e8f461de0a04891e5e18b0f50e9cf2cf534e1 and in the latest 0.14.1.0 release.  Thank you @moneromooo.

I am declining any bounty payout for this report.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
