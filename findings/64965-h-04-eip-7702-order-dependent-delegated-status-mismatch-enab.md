---
tags:
  - lang/rust
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/governance
  - sector/infra
  - sector/staking
protocol: "[[Monad]]"
auditors:
  - "[[oct0pwn]]"
report: "https://code4rena.com/reports/2025-09-monad"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[vote-delegation-loop]]"
---
# [H-04] EIP-7702 order dependent delegated-status mismatch enables persistent free chain DoS

- id: 64965
- impact: HIGH
- protocol: [[Monad]]
- reporter: oct0pwn (Code4rena)
- source: https://code4rena.com/reports/2025-09-monad

## Summary


The report highlights a bug in the code related to the handling of EIP-7702 authorities in the Monad project. The issue arises due to a mismatch in the timing and semantics of when an authority is marked as delegated. This allows a user to exploit the mismatch by submitting two transactions targeting the same authority, one with a high tip and the other with a slightly lower tip. This results in the block being rejected and the transactions remaining in the pool, causing repeated Denial of Service attacks. The recommended solution is to unify the delegation semantics across components and apply them at the consensus level.

## Details



* `bft/monad-eth-txpool/src/pool/tracked/sequencer.rs` [# L248-L253](https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-txpool/src/pool/tracked/sequencer.rs# L248-L253)
* `bft/monad-eth-block-policy/src/lib.rs` [# L1212-L1219](https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-block-policy/src/lib.rs# L1212-L1219)
* `bft/monad-eth-block-policy/src/lib.rs` [# L1347-L1354](https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-block-policy/src/lib.rs# L1347-L1354)

Txpool marks an authority as delegated in order dependent way - once it includes the EIP-7702-carrying transaction in the proposal (ordering-sensitive). However, block policy globally sets all recovered EIP-7702 authorities as delegated for the entire block before any per-transaction reserve checks (NOT-ordering-sensitive).

A user can exploit this mismatch by submitting:

* X: an EIP-1559 (≤30M gas) transaction tuned to pass the emptying path (balance ≥ `txn_max_gas`) but fail the non-emptying reserve-only path (`txn_max_gas` > `max_reserve_balance`), with a very high tip.
* Y: a valid-chain EIP-7702 transaction carrying an authorization for the same authority as X, with a slightly lower tip so it is included after X in the txpool’s ordering.

Txpool admits X first under emptying rules, then adds Y and flips delegation. When proposed, consensus peers treat the authority as delegated globally for the whole block, reclassify X as non-emptying, and reject the block for `InsufficientReserveBalance`. Because the block fails pre-execution, the attacker pays no gas; the transactions remain in the pool and are re-proposed, enabling repeated DoS.

### Impact

* Repeated, full, user-triggered DoS across leader slots; blocks built atop the invalid block are also rejected.
* Chain can stall nearly completely due to each proposer continually trying to build invalid blocks.
* Honest proposers/validators lose rewards/fees; attacker never pays gas (pre-execution rejection).
* Broken invariants:

  + “Chain finality: Speculative execution results of a previous block will be finalized within the designated system parameters if a supermajority of nodes are participating in consensus”. Finality is repeatedly prevented.
  + “Transactions: The total token deduction from a sender’s balance must be equal to the sum of value and the product of `gas_price` and `gas_limit`. A transaction’s max\_expenditure shall not exceed the sender’s available balance at the time of consensus.”

### Affected Code

* Txpool proposal sequencing (delegation flips only after a 7702 tx is included):

  + Marks `is_delegated = true` only after including a 7702-carrying tx (ordering-dependent):
  + <https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-txpool/src/pool/tracked/sequencer.rs# L248-L253>
* Block policy global pre-marking (ordering-insensitive):

  + Collects 7702 authorities up-front from all txs in the block (no ordering dependence here):
  + <https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-block-policy/src/lib.rs# L1212-L1219>
  + Pre-marks all collected authorities as delegated before per-tx reserve checks:
  + <https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-block-policy/src/lib.rs# L1347-L1354>

### Root cause

* Semantic and timing mismatch for when `is_delegated` is derived:

  + Txpool: delegated status is applied lazily during proposal assembly as Y is included.
  + Block policy: delegated status is applied at once to all authorities present anywhere in the block before checking any tx.
* This reclassifies X between components: txpool admits X as emptying; policy re-evaluates X as non-emptying and rejects it under reserve rules.

### Attack path

1. User submits two transactions targeting the same authority A:

   * X (EIP‑1559): ≤30M gas, very high tip so `gas_at_bid * gas_limit > max_reserve_balance`; `value = 0`.
   * Y (EIP‑7702): valid `chain_id`, contains an authorization signed by A, with a slightly lower tip so it is included after X in the txpool ordering.
2. Txpool proposal assembly selects X first (higher tip) while A is not yet marked delegated, admitting X under emptying rules (gas-only check).
3. Txpool then includes Y and marks A as delegated (ordering-dependent state flip) after Y’s inclusion.
4. Block policy coherency validation collects 7702 authorities from the whole block up-front and pre-marks A as delegated for the entire block.
5. The same X is re-evaluated under non-emptying rules and fails the reserve-only check with `InsufficientReserveBalance`.
6. The block is rejected pre-execution; proposer loses the slot. Transactions stay in the pool and will be re-proposed. By repeating across leaders (optionally rotating senders), the attacker achieves persistent DoS and liveness degradation.

### Recommended mitigation steps

Unify delegation semantics across components, apply the order-sensitive semantics at the consensus level.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-09-monad/submissions/F-768)

---
