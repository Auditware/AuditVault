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
date: 2026-09-16
submitted: 2026-03-22T19:11:56.524Z
bounty_usd: null
votes: 32
cve: []
program: "[[programs/monero|Monero]]"
reporter: "usagirabbit"
source: "https://hackerone.com/reports/3621588"
title: "Authenticated `unsigned_txset` change spoof lets a malicious hot wallet steal cold-signer change"
---
# Authenticated `unsigned_txset` change spoof lets a malicious hot wallet steal cold-signer change

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 32 | **Program:** Monero | **Disclosed:** 2026-09-16

- Report: [https://hackerone.com/reports/3621588](https://hackerone.com/reports/3621588)
- CWE: Business Logic Errors
- Submitted: 2026-03-22T19:11:56.524Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **External User Joined**
- **2026-03-27** @usagirabbit: Any updates?
- **2026-03-27** @selsta: It is being worked on.
- **2026-03-27** @usagirabbit: 👍
- **2026-03-30** @usagirabbit: Any updates?
- **2026-04-05** @usagirabbit: Any updates?
- **2026-04-05** @selsta: I will add a comment once I have an update, it will be resolved before the next release.
- **2026-04-05** @usagirabbit: got it
- **2026-04-08** @jeffro256: I have a patch which should fix the issue, at least on the cold, non-HW display side. I believe that it's sort of distracting from how one would go about actually exploiting this (i.e. mangling hot/cold unsigned tx set messages):

```
diff --git a/src/cryptonote_core/cryptonote_tx_utils.cpp b/src/cryptonote_core/cryptonote_tx_utils.cpp
index e9a66ac50..e54253b89 100644
--- a/src/cryptonote_core/cryptonote_tx_utils.cpp
+++ b/src/cryptonote_core/cryptonote_tx_utils.cpp
@@ -46,6 +46,32 @@ using namespace epee;
 
 using namespace crypto;
 
+
+namespace
+{
+//---------------------------------------------------------------
+  bool sanity_check_change_address(
+    const cryptonote::account_public_address& change_addr,
+    const std::unordered_map<crypto::public_key, cryptonote::subaddress_index>& subaddresses,
+    const cryptonote::account_keys &keys
+  )
+  {
+    // if spend pubkey not in subaddress table, then fail
+    const auto subaddr_it = subaddresses.find(change_addr.m_spend_public_key);
+    if (subaddr_it == subaddresses.cend())
+      return false;
+
+    // if device does not return same address given index, then fail
+    hw::device &hwdev = keys.get_device();
+    const auto recomputed_addr = hwdev.get_subaddress(keys, subaddr_it->second);
+    if (change_addr != recomputed_addr)
+      return false;
+
+    return true;
+  }
+//---------------------------------------------------------------
+} //anonymous namespace
+
 namespace cryptonote
 {
   //---------------------------------------------------------------
@@ -213,6 +239,16 @@ namespace cryptonote
       return false;
     }
 
+    if (change_addr)
+    {
+      const account_public_address &change_addr_ = *change_addr;
+      if (!sanity_check_change_address(change_addr_, subaddresses, sender_account_keys))
+      {
+        LOG_ERROR("Provided change address (" << change_addr_.m_spend_public_key << ", "
+          << change_addr_.m_view_public_key << " does not seem to belong to sender");
+        return false;
+    }
+
     std::vector<rct::key> amount_keys;
     tx.set_null();
     amount_keys.clear();

```

I was planning on releasing the PR which a commit message something along the lines of "prevents silly mistakes from downstream devs using lower level transaction construction routines" until the vuln is publicly disclosed.
- **2026-04-08** @jeffro256: What's nice for disclosure is that none of the code is cold wallet specific. Please let me know if you have better ideas for hiding the fix.
- **2026-04-08** @jeffro256: Note: the CARROT construction code will not suffer from this issue because the the construction code is passed a subaddress index, not the address pubkeys.
- **2026-04-08** @usagirabbit: sorry @jeffro256 will rewrite it later
- **2026-04-09** @jeffro256: What do you want changed about it?
- **2026-04-09** @usagirabbit: oh I thought you wanted better ideas for hiding the fix, sorry!
- **External User Joined**
- **2026-04-14** @j-berman: The vuln looks valid to me, and fix looks good as well. Commit message looks solid @jeffro256.
- **2026-04-18** @jeffro256: Trezor is safe from this vulnerability AFAICT. Ledger is not. I wrote up a report detailing this vulnerability with code pointers, ideas for solutions, and a working PoC to bounty@ledger.fr. Will report back when they respond.
- **2026-04-18** @usagirabbit: will i get the ledger bounty as well?
- **2026-04-18** @usagirabbit: sorry i was genuinely freaking out about what i found. more professional me here:
i wanted to confirm, since this vulnerability was originally discovered and reported by me, will i be credited and compensated by Ledger's bounty program, or will Monero's team coordinate that on my behalf?
- **2026-04-18** @selsta: The Ledger-related issue was inspired by your report but is technically a separate finding identified by the Monero team.

Any credit or bounty from Ledger would be awarded based on our submission, and we'll determine internally how to handle attribution or any potential allocation. We'll follow up with you once the Ledger disclosure process is complete.
- **2026-04-23** @usagirabbit: Did ledger ever get back to you @jeffro256?
- **2026-04-23** @selsta: As far as I know there has been no update from Ledger. We will put out the release without waiting for them.
- **2026-04-27** @usagirabbit: Any updates?
- **2026-04-29** @usagirabbit: just checking in!
- **2026-04-29** @selsta: There is no update beyond what I wrote in my last message. If there's an update I'll add it here.
- **2026-05-08** @luigi1111w: Sent 6 XMR: 60cacfbc0f929ebd216bc547d84cb8b4383203605c5725f0b7af74b07f302674
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
