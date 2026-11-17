---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/resource-injection
  - env/web
substate: "resolved"
weakness: "Resource Injection"
enriched: true
date: 2019-07-03
submitted: 2019-02-25T20:14:12.249Z
bounty_usd: null
votes: 9
cve: []
program: "[[programs/monero|Monero]]"
reporter: "cutcoin"
source: "https://hackerone.com/reports/501585"
title: "Zero-amount miner TX + RingCT allows monero wallet to receive arbitrary amount of monero"
---
# Zero-amount miner TX + RingCT allows monero wallet to receive arbitrary amount of monero

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 9 | **Program:** Monero | **Disclosed:** 2019-07-03

- Report: [https://hackerone.com/reports/501585](https://hackerone.com/reports/501585)
- CWE: Resource Injection
- Submitted: 2019-02-25T20:14:12.249Z

## Timeline

- **Report Filed**
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2019-02-28** @moneromooo: Thanks for the report, I will check.
- **2019-02-28** @moneromooo: AFAICT, what happens is that a commitment is generated for 0. With your exploit code, I get a tx rejection when mined:

2019-02-28 16:03:42.870	[miner 0]	WARN 	blockchain.db.lmdb	src/blockchain_db/lmdb/db_lmdb.cpp:76	RCT output without commitment
2019-02-28 16:03:42.875	[miner 0]	ERROR	blockchain	src/cryptonote_core/blockchain.cpp:3585	Error adding block with hash: <d2de6cfe73ec489b3f186329b729d0ed1f017d69fb707fca4a377b0379f8daa0> to blockchain, what = RCT output without commitment

Do you not get this ?

Anyway, can you pop into IRC so we can talk ?
- **2019-02-28** @moneromooo: Oh, nevermind, I start off a new testnet, that does not have rct just yet :)
- **2019-02-28** @moneromooo: OK, reproduced. Thanks for the repro case.
- **2019-02-28** @moneromooo: This should fix it on daemon and wallet. Your PoC code does not cause the daemon to accept those txes anymore. The wallet side changes should prevent exploitation from a malicious remote node (it now gets an output of 0). This was tested on monero-wallet-cli only so far, I'll check monero-wallet-rpc now just in case.
Very good exploit, thanks.

```
diff --git a/src/cryptonote_core/blockchain.cpp b/src/cryptonote_core/blockchain.cpp
index a903aa74f..de5a408e5 100644
--- a/src/cryptonote_core/blockchain.cpp
+++ b/src/cryptonote_core/blockchain.cpp
@@ -1142,6 +1142,12 @@ bool Blockchain::prevalidate_miner_transaction(const block& b, uint64_t height)
   MDEBUG("Miner tx hash: " << get_transaction_hash(b.miner_tx));
   CHECK_AND_ASSERT_MES(b.miner_tx.unlock_time == height + CRYPTONOTE_MINED_MONEY_UNLOCK_WINDOW, false, "coinbase transaction transaction has the wrong unlock time=" << b.miner_tx.unlock_time << ", expected " << height + CRYPTONOTE_MINED_MONEY_UNLOCK_WINDOW);
 
+  // for v2 txes (ringct), we only accept empty rct signatures for miner transactions,
+  if (b.miner_tx.version == 2)
+  {
+    CHECK_AND_ASSERT_MES(b.miner_tx.rct_signatures.type == rct::RCTTypeNull, false, "RingCT signatures not allowed in coinbase transactions");
+  }
+
   //check outs overflow
   //NOTE: not entirely sure this is necessary, given that this function is
   //      designed simply to make sure the total amount for a transaction
diff --git a/src/wallet/wallet2.h b/src/wallet/wallet2.h
index 2114e0eff..3bbe8eced 100644
--- a/src/wallet/wallet2.h
+++ b/src/wallet/wallet2.h
@@ -1239,7 +1239,7 @@ namespace tools
     crypto::public_key get_tx_pub_key_from_received_outs(const tools::wallet2::transfer_details &td) const;
     bool should_pick_a_second_output(bool use_rct, size_t n_transfers, const std::vector<size_t> &unused_transfers_indices, const std::vector<size_t> &unused_dust_indices) const;
     std::vector<size_t> get_only_rct(const std::vector<size_t> &unused_dust_indices, const std::vector<size_t> &unused_transfers_indices) const;
-    void scan_output(const cryptonote::transaction &tx, const crypto::public_key &tx_pub_key, size_t i, tx_scan_info_t &tx_scan_info, int &num_vouts_received, std::unordered_map<cryptonote::subaddress_index, uint64_t> &tx_money_got_in_outs, std::vector<size_t> &outs);
+    void scan_output(const cryptonote::transaction &tx, bool miner_tx, const crypto::public_key &tx_pub_key, size_t i, tx_scan_info_t &tx_scan_info, int &num_vouts_received, std::unordered_map<cryptonote::subaddress_index, uint64_t> &tx_money_got_in_outs, std::vector<size_t> &outs);
     void trim_hashchain();
     crypto::key_image get_multisig_composite_key_image(size_t n) const;
     rct::multisig_kLRki get_multisig_composite_kLRki(size_t n, const crypto::public_key &ignore, std::unordered_set<rct::key> &used_L, std::unordered_set<rct::key> &new_used_L) const;
diff --git a/src/wallet/wallet2.cpp b/src/wallet/wallet2.cpp
index 0a3b49e65..c0e334318 100644
--- a/src/wallet/wallet2.cpp
+++ b/src/wallet/wallet2.cpp
@@ -1296,7 +1296,7 @@ static uint64_t decodeRct(const rct::rctSig & rv, const crypto::key_derivation &
   }
 }
 //----------------------------------------------------------------------------------------------------
-void wallet2::scan_output(const cryptonote::transaction &tx, const crypto::public_key &tx_pub_key, size_t i, tx_scan_info_t &tx_scan_info, int &num_vouts_received, std::unordered_map<cryptonote::subaddress_index, uint64_t> &tx_money_got_in_outs, std::vector<size_t> &outs)
+void wallet2::scan_output(const cryptonote::transaction &tx, bool miner_tx, const crypto::public_key &tx_pub_key, size_t i, tx_scan_info_t &tx_scan_info, int &num_vouts_received, std::unordered_map<cryptonote::subaddress_index, uint64_t> &tx_money_got_in_outs, std::vector<size_t> &outs)
 {
   THROW_WALLET_EXCEPTION_IF(i >= tx.vout.size(), error::wallet_internal_error, "Invalid vout index");
 
@@ -1330,7 +1330,7 @@ void wallet2::scan_output(const cryptonote::transaction &tx, const crypto::publi
   }
 
   outs.push_back(i);
-  if (tx_scan_info.money_transfered == 0)
+  if (tx_scan_info.money_transfered == 0 && !miner_tx)
   {
     tx_scan_info.money_transfered = tools::decodeRct(tx.rct_signatures, tx_scan_info.received->derivation, i, tx_scan_info.mask, m_account.get_device());
   }
@@ -1512,7 +1512,7 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
           if (tx_scan_info[i].received)
           {
             hwdev.conceal_derivation(tx_scan_info[i].received->derivation, tx_pub_key, additional_tx_pub_keys.data, derivation, additional_derivations);
-            scan_output(tx, tx_pub_key, i, tx_scan_info[i], num_vouts_received, tx_money_got_in_outs, outs);
+            scan_output(tx, miner_tx, tx_pub_key, i, tx_scan_info[i], num_vouts_received, tx_money_got_in_outs, outs);
           }
         }
       }
@@ -1535,7 +1535,7 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
         if (tx_scan_info[i].received)
         {
           hwdev.conceal_derivation(tx_scan_info[i].received->derivation, tx_pub_key, additional_tx_pub_keys.data, derivation, additional_derivations);
-          scan_output(tx, tx_pub_key, i, tx_scan_info[i], num_vouts_received, tx_money_got_in_outs, outs);
+          scan_output(tx, miner_tx, tx_pub_key, i, tx_scan_info[i], num_vouts_received, tx_money_got_in_outs, outs);
         }
       }
     }
@@ -1551,7 +1551,7 @@ void wallet2::process_new_transaction(const crypto::hash &txid, const cryptonote
           boost::unique_lock<hw::device> hwdev_lock (hwdev);
           hwdev.set_mode(hw::device::NONE);
           hwdev.conceal_derivation(tx_scan_info[i].received->derivation, tx_pub_key, additional_tx_pub_keys.data, derivation, additional_derivations);
-          scan_output(tx, tx_pub_key, i, tx_scan_info[i], num_vouts_received, tx_money_got_in_outs, outs);
+          scan_output(tx, miner_tx, tx_pub_key, i, tx_scan_info[i], num_vouts_received, tx_money_got_in_outs, outs);
         }
       }
     }
@@ -10697,6 +10697,7 @@ uint64_t wallet2::import_key_images(const std::vector<std::pair<crypto::key_imag
         THROW_WALLET_EXCEPTION_IF(!r, error::wallet_internal_error, "Failed to generate key derivation");
       }
       size_t output_index = 0;
+      bool miner_tx = cryptonote::is_coinbase(spent_tx);
       for (const cryptonote::tx_out& out : spent_tx.vout)
       {
         tx_scan_info_t tx_scan_info;
@@ -10704,7 +10705,7 @@ uint64_t wallet2::import_key_images(const std::vector<std::pair<crypto::key_imag
         THROW_WALLET_EXCEPTION_IF(tx_scan_info.error, error::wallet_internal_error, "check_acc_out_precomp failed");
         if (tx_scan_info.received)
         {
-          if (tx_scan_info.money_transfered == 0)
+          if (tx_scan_info.money_transfered == 0 && !miner_tx)
           {
             rct::key mask;
             tx_scan_info.money_transfered = tools::decodeRct(spent_tx.rct_signatures, tx_scan_info.received->derivation, output_index, mask, hwdev);

```
- **2019-02-28** @moneromooo: All seems OK with monero-wallet-rpc too.
- **2019-02-28** @cutcoin: moneromooo, sorry for not reacting faster. You seem to have everything figured out.

Fixing in both daemon and wallet seems like the best idea. You probably know this better than me, but before adding this check to the miner_tx unconditionally and pushing it you may want to double check that there are in fact no such transactions in the chain. Let's hope not.

By the way I didn't test this one, but by just looking around I saw no code that prevents generation of blocks with miner_tx.version=1. I don't see anything bad even if it is the case, just saying.
- **2019-02-28** @moneromooo: Yes, fair point about checking history. I think v1 miner txes are still allowed AFAIK. Maybe they should be forbidden indeed. You did not react slowly, after all I only checked this site 3 days after your report :)
- **2019-03-03** @moneromooo: Patches are in PRs 5216 and 5217. Those are only the wallet side. The consensus change will be made later for the next fork since it's now too close and we'd likely end up with a fork.
- **2019-03-06** @moneromooo: This will be disclosed after the fork.
Please post a monero address if you want to receive a bounty.
- **2019-03-08** @cutcoin: This is the Monero address, thank you: 42DxczZbZxLTHnaLiHVEUCRtN5ktLvHy68jm9yWbSiV1KX772AEJf9qUs5tocUWFFs9QLysMBmHM4AbCAkxtHvQbVYowaXu

Did you guys warn any other coins about this issue? If not would you mind if we shoot a short email with link to pull request here and there even before the fork?
- **2019-03-08** @moneromooo: I don't think this was done. Feel free to tell anyone else about it since the patch is now public. Please leave out the PoC code out for now :)
- **2019-03-11** @luigi1111w: Sent 45 XMR: <ac78d12676e4dc04674610cadbbb1fcf00ecab9c40bc8450b2ad4b7408186ef4>
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
- **Report Title Updated**
