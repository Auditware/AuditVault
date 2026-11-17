---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/null-pointer-dereference
  - env/web
substate: "resolved"
weakness: "NULL Pointer Dereference"
enriched: true
date: 2026-08-05
submitted: 2026-04-24T16:08:57.050Z
bounty_usd: null
votes: 44
cve: []
program: "[[programs/monero|Monero]]"
reporter: "bebensap"
source: "https://hackerone.com/reports/3693636"
title: "wallet-rpc crash via malformed /gettransactions response (empty txs → vector::front() in check_tx_key / check_tx_proof)"
---
# wallet-rpc crash via malformed /gettransactions response (empty txs → vector::front() in check_tx_key / check_tx_proof)

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 44 | **Program:** Monero | **Disclosed:** 2026-08-05

- Report: [https://hackerone.com/reports/3693636](https://hackerone.com/reports/3693636)
- CWE: NULL Pointer Dereference
- Submitted: 2026-04-24T16:08:57.050Z

## Timeline

- **Report Filed**
- **Report Title Updated**
- **Report Triaged**
- **2026-04-24** @bebensap: Yes — this patch fixes the reported crash/undefined behavior by requiring res.txs.size() == 1 before using res.txs.front() in check_tx_key (via check_tx_key_helper), get_tx_proof, and the txid-based check_tx_proof path, so the malicious shape txs: [] with a valid blob only in txs_as_hex no longer reaches an empty-vector front().

It achieves that by dropping the previous dual-path parsing (txs vs txs_as_hex); as a result, legacy txs_as_hex-only responses are no longer accepted on those code paths, which should be confirmed against current daemon behaviour and any supported compatibility expectations.

The cold get_tx_key path is still inconsistent with the stricter sites: it continues to depend on top-level txs_as_hex and does not add a structured-res.txs[0] fallback when that array is populated but txs_as_hex is empty (so it avoids the old UB there by failing closed, but is not as complete as it could be). Separately, the added bc_height > res.txs.front().block_height guard in check_tx_proof addresses confirmation underflow and is unrelated to the empty-txs front() issue.
- **2026-04-24** @selsta: https://github.com/monero-project/monero/pull/10454

I removed all references to txs_as_hex as every single node supports regular txs. Also yes, the underflow check is unrelated but it was missing and I was already changing those functions anyway.
- **2026-04-24** @bebensap: Sounds good. Dropping txs_as_hex is fine if everything still talks the structured txs shape. Thanks for the underflow fix too.
- **2026-04-24** @bebensap: Hi, I wanted to follow up on one point from the fix.

In my confirmation comment, I noted that the bc_height > res.txs.front().block_height guard addresses a confirmation underflow issue — and you acknowledged it was unrelated to the empty-txs front() crash I originally reported.

Since this is a distinct bug (integer underflow in confirmations calculation vs. UB from empty vector access), I'd like to ask: will it be considered for a separate additional bounty reward, or will the entire report be treated as a single payout?

Happy to open a dedicated report for it if that would help with triage. Thanks again for the quick turnaround on the fix.
- **2026-04-24** @selsta: The underflow issue isn't something that was pointed out in your original report and it's also not something that would be eligible for a bounty anyway since from what I can tell it can't cause a crash.
- **2026-04-24** @bebensap: Understood, thanks for the clarification!
- **2026-05-08** @luigi1111w: Sent 0.5 XMR: 0a0dbd87437dd8ab044e481813a2eacece487bc38cd273c9bce76cd1317aa8a0
- **Swag Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
