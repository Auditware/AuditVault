---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2018-07-27
submitted: 2018-07-08T00:06:19.804Z
bounty_usd: null
votes: 17
cve: []
program: "[[programs/monero|Monero]]"
reporter: "phiren"
source: "https://hackerone.com/reports/379049"
title: "Attcker can trick monero wallet into reporting it recived twice as much with alternative tx_keypubs"
---
# Attcker can trick monero wallet into reporting it recived twice as much with alternative tx_keypubs

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 17 | **Program:** Monero | **Disclosed:** 2018-07-27

- Report: [https://hackerone.com/reports/379049](https://hackerone.com/reports/379049)
- CWE: Business Logic Errors
- Submitted: 2018-07-08T00:06:19.804Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** multiple identical  tx_pub_keys were patched, but you can still use alternative tx_pub_keys to get the same result.

**Description:** An attacker can craft an XMR transaction which causes the receiving wallet to report that it received twice as much XMR as the attacker actually sent.

The balance of the wallet isn't effected, so a personal user probably won't be ticked, however the doubled amount is reported over the get_transfers RPC call.

This is especially devastating for automated wallets, such as cryptocurrency exchanges that rely on RPC calls returning the correct result. 

This attack is a slight modification of the previous flaw that was patched in pull request 3985. That flaw allows unlimited multiplication of funds, instead of just a 2x multiplication that this attack allows.

This attack leverages the alternative tx_pub_keys feature introduced with subaddresses. extra data is arranged so it contains:

1. A dummy tx_pub_key
2. An array of alternative tx_pub_keys entries all containing the legitimate txkey for each output.
3. The legitimate tx_pub_key

The process_new_transaction function will:

1. Grab the dummy tx_pub_key
2. Grab the array of alternative tx_pub_keys
3. Scan all the outputs with both the dummy and alternative tx_pub_keys. Which will match on the legitimate tx_pub_keys.
4. Loop back to the start, grab the legitimate tx_pub_key
5. Since the alternative keys were not added into the public_keys_seen set, it scans all the outputs again.
6. Hacked.
 
## Releases Affected:

 * Monero master ebf2818ab5f42b10745cb99d07920f3197c3d914
 * Monero 0.12.3.0 release tag
 * Probably any Monero release since subaddresses were introduced

## Steps To Reproduce:

  1. On the attacking wallet, Patch cryptonote_tx_utils.cpp
```
    diff --git a/src/cryptonote_core/cryptonote_tx_utils.cpp b/src/cryptonote_core/cryptonote_tx_utils.cpp
    index 071ce591..3835690a 100644
    --- a/src/cryptonote_core/cryptonote_tx_utils.cpp
    +++ b/src/cryptonote_core/cryptonote_tx_utils.cpp
    @@ -351,9 +351,15 @@ namespace cryptonote
           txkey_pub = rct::rct2pk(hwdev.scalarmultBase(rct::sk2rct(tx_key)));
         }
         remove_field_from_tx_extra(tx.extra, typeid(tx_extra_pub_key));
    -    add_tx_pub_key_to_extra(tx, txkey_pub);
    +    crypto::public_key dummy_key;
    +    add_tx_pub_key_to_extra(tx, dummy_key);
    
         std::vector<crypto::public_key> additional_tx_public_keys;
    +    for (size_t i = 0; i < destinations.size(); i++)
    +      additional_tx_public_keys.push_back(txkey_pub); // One for each output.
    +
    +    add_additional_tx_pub_keys_to_extra(tx.extra, additional_tx_public_keys);
    +    add_tx_pub_key_to_extra(tx, txkey_pub);
    
         // we don't need to include additional tx keys if:
         //   - all the destinations are standard addresses
    @@ -421,9 +427,9 @@ namespace cryptonote
           output_index++;
           summary_outs_money += dst_entr.amount;
         }
    -    CHECK_AND_ASSERT_MES(additional_tx_public_keys.size() == additional_tx_keys.size(), false, "Internal error creating additional public keys");
    +    //CHECK_AND_ASSERT_MES(additional_tx_public_keys.size() == additional_tx_keys.size(), false, "Internal error creating additional public keys");
    
    -    remove_field_from_tx_extra(tx.extra, typeid(tx_extra_additional_pub_keys));
    +    //remove_field_from_tx_extra(tx.extra, typeid(tx_extra_additional_pub_keys));
    
         LOG_PRINT_L2("tx pubkey: " << txkey_pub);
         if (need_additional_txkeys)

  2\. Compile wallet
  3\. Do a regular transfer to an exchange wallet.
  4\. Profit.

## Impact

By depositing and withdrawing the same coins, doubling each time; The attacker could eventually steal all XMR from an exchange hotwallet.

## Timeline

- **Report Filed**
- **2018-07-08** @moneromooo: Hrm. This was supposed to be fixed by only using those on the first loop.
Thanks for the report, will fix now.
- **2018-07-08** @moneromooo: The following patch fixes the issue you reported. Thanks for the detailed report.
```
diff --git a/src/wallet/wallet2.cpp b/src/wallet/wallet2.cpp
index df7ea75..ccf764c 100644
--- a/src/wallet/wallet2.cpp
+++ b/src/wallet/wallet2.cpp
@@ -1238,7 +1238,7 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
 
     if (public_keys_seen.find(pub_key_field.pub_key) != public_keys_seen.end())
     {
-      MWARNING("The same transaction pubkey is present more than once, ignoring extra instance");
+      MWARNING("The same transaction pubkey is present more than once in " << txid << ", ignoring extra instance");
       continue;
     }
     public_keys_seen.insert(pub_key_field.pub_key);
@@ -1274,6 +1274,12 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
         {
           for (size_t i = 0; i < additional_tx_pub_keys.data.size(); ++i)
           {
+            if (public_keys_seen.find(additional_tx_pub_keys.data[i]) != public_keys_seen.end())
+            {
+              MWARNING("The same transaction extra pubkey is present more than once in " << txid << ", ignoring extra instance");
+              continue;
+            }
+            public_keys_seen.insert(additional_tx_pub_keys.data[i]);
             additional_derivations.push_back({});
             if (!hwdev.generate_key_derivation(additional_tx_pub_keys.data[i], keys.m_view_secret_key, additional_derivations.back()))
             {
@@ -1294,6 +1300,12 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
       {
         for (size_t n = 0; n < tx_cache_data.additional.size(); ++n)
         {
+          if (public_keys_seen.find(tx_cache_data.additional[n].pkey) != public_keys_seen.end())
+          {
+            MWARNING("The same transaction extra pubkey is present more than once in " << txid << ", ignoring extra instance");
+            continue;
+          }
+          public_keys_seen.insert(tx_cache_data.additional[n].pkey);
           additional_tx_pub_keys.data.push_back(tx_cache_data.additional[n].pkey);
           additional_derivations.push_back(tx_cache_data.additional[n].derivation);

```
- **2018-07-08** @phiren: That patch won't work if multiple outputs are sent to the same subaddress. Each public key lines up with an output and sending multiple outputs to the same address will require repeats in the additional array. 

I'm not sure if this happens in practice.
- **2018-07-08** @moneromooo: Better patch after discussion with the reporter:
```
commit 58f28cadf8318d7a0e0e8fd85f257acfef34f62e
Author: moneromooo-monero <moneromooo-monero@users.noreply.github.com>
Date:   Sun Jul 8 11:01:13 2018 +0100

    wallet2: ensure outputs are processed only once
    
    This should be proof against any way one might get to multiple
    processing, such as generating the same derivation from the
    same pubkey, etc

diff --git a/src/wallet/wallet2.cpp b/src/wallet/wallet2.cpp
index 4477b97..2de92a5 100644
--- a/src/wallet/wallet2.cpp
+++ b/src/wallet/wallet2.cpp
@@ -1030,6 +1030,16 @@ void wallet2::check_acc_out_precomp(const tx_out &o, const crypto::key_derivatio
   tx_scan_info.error = false;
 }
 //----------------------------------------------------------------------------------------------------
+void wallet2::check_acc_out_precomp_once(const tx_out &o, const crypto::key_derivation &derivation, const std::vector<crypto::key_derivation> &additional_derivations, size_t i, tx_scan_info_t &tx_scan_info, bool &already_seen) const
+{
+  tx_scan_info.received = boost::none;
+  if (already_seen)
+    return;
+  check_acc_out_precomp(o, derivation, additional_derivations, i, tx_scan_info);
+  if (tx_scan_info.received)
+    already_seen = true;
+}
+//----------------------------------------------------------------------------------------------------
 static uint64_t decodeRct(const rct::rctSig & rv, const crypto::key_derivation &derivation, unsigned int i, rct::key & mask, hw::device &hwdev)
 {
   crypto::secret_key scalar1;
@@ -1110,7 +1120,7 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
   // Don't try to extract tx public key if tx has no ouputs
   size_t pk_index = 0;
   std::vector<tx_scan_info_t> tx_scan_info(tx.vout.size());
-  std::unordered_set<crypto::public_key> public_keys_seen;
+  std::deque<bool> output_found(tx.vout.size(), false);
   while (!tx.vout.empty())
   {
     // if tx.vout is not empty, we loop through all tx pubkeys
@@ -1126,13 +1136,6 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
       break;
     }
 
-    if (public_keys_seen.find(pub_key_field.pub_key) != public_keys_seen.end())
-    {
-      MWARNING("The same transaction pubkey is present more than once, ignoring extra instance");
-      continue;
-    }
-    public_keys_seen.insert(pub_key_field.pub_key);
-
     int num_vouts_received = 0;
     tx_pub_key = pub_key_field.pub_key;
     tools::threadpool& tpool = tools::threadpool::getInstance();
@@ -1172,7 +1175,7 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
     }
     else if (miner_tx && m_refresh_type == RefreshOptimizeCoinbase)
     {
-      check_acc_out_precomp(tx.vout[0], derivation, additional_derivations, 0, tx_scan_info[0]);
+      check_acc_out_precomp_once(tx.vout[0], derivation, additional_derivations, 0, tx_scan_info[0], output_found[0]);
       THROW_WALLET_EXCEPTION_IF(tx_scan_info[0].error, error::acc_outs_lookup_error, tx, tx_pub_key, m_account.get_keys());
 
       // this assumes that the miner tx pays a single address
@@ -1182,8 +1185,8 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
         // the first one was already checked
         for (size_t i = 1; i < tx.vout.size(); ++i)
         {
-          tpool.submit(&waiter, boost::bind(&wallet2::check_acc_out_precomp, this, std::cref(tx.vout[i]), std::cref(derivation), std::cref(additional_derivations), i,
-            std::ref(tx_scan_info[i])));
+          tpool.submit(&waiter, boost::bind(&wallet2::check_acc_out_precomp_once, this, std::cref(tx.vout[i]), std::cref(derivation), std::cref(additional_derivations), i,
+            std::ref(tx_scan_info[i]), std::ref(output_found[i])));
         }
         waiter.wait();
         // then scan all outputs from 0
@@ -1205,8 +1208,8 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
     {
       for (size_t i = 0; i < tx.vout.size(); ++i)
       {
-        tpool.submit(&waiter, boost::bind(&wallet2::check_acc_out_precomp, this, std::cref(tx.vout[i]), std::cref(derivation), std::cref(additional_derivations), i,
-            std::ref(tx_scan_info[i])));
+        tpool.submit(&waiter, boost::bind(&wallet2::check_acc_out_precomp_once, this, std::cref(tx.vout[i]), std::cref(derivation), std::cref(additional_derivations), i,
+            std::ref(tx_scan_info[i]), std::ref(output_found[i])));
       }
       waiter.wait();
 
@@ -1227,7 +1230,7 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
     {
       for (size_t i = 0; i < tx.vout.size(); ++i)
       {
-        check_acc_out_precomp(tx.vout[i], derivation, additional_derivations, i, tx_scan_info[i]);
+        check_acc_out_precomp_once(tx.vout[i], derivation, additional_derivations, i, tx_scan_info[i], output_found[i]);
         THROW_WALLET_EXCEPTION_IF(tx_scan_info[i].error, error::acc_outs_lookup_error, tx, tx_pub_key, m_account.get_keys());
         if (tx_scan_info[i].received)
         {
diff --git a/src/wallet/wallet2.h b/src/wallet/wallet2.h
index 97a5df5..59b4500 100644
--- a/src/wallet/wallet2.h
+++ b/src/wallet/wallet2.h
@@ -1112,6 +1112,7 @@ namespace tools
     bool generate_chacha_key_from_secret_keys(crypto::chacha_key &key) const;
     crypto::hash get_payment_id(const pending_tx &ptx) const;
     void check_acc_out_precomp(const cryptonote::tx_out &o, const crypto::key_derivation &derivation, const std::vector<crypto::key_derivation> &additional_derivations, size_t i, tx_scan_info_t &tx_scan_info) const;
+    void check_acc_out_precomp_once(const cryptonote::tx_out &o, const crypto::key_derivation &derivation, const std::vector<crypto::key_derivation> &additional_derivations, size_t i, tx_scan_info_t &tx_scan_info, bool &already_seen) const;
     void parse_block_round(const cryptonote::blobdata &blob, cryptonote::block &bl, crypto::hash &bl_id, bool &error) const;
     uint64_t get_upper_transaction_size_limit() const;
     std::vector<uint64_t> get_unspent_amounts_vector() const;
```
- **Report Triaged**
- **2018-07-08** @phiren: That patch looks good to me.
- **Report Resolved**
- **Agreed On Going Public**
- **2018-07-27** @phiren: Thanks for fixing this promptly.

Bounty Address: 4AKkgCVxvsz3x2LSaYCP5NA6H1Va24EJZWxFb8aDU3amPydnqomy66dFUAQArcwQRtexW2cRB9r6M1G7F5EBAvaQJfUR3iz
- **Agreed On Going Public**
- **Report Became Public**
- **2018-08-01** @luigi1111w: Sent 35 XMR: <f119ce93d3ea78f0c48be09ce9f86a88ce2320e2317c94c213390322d3b3ebce>
- **Swag Awarded**
