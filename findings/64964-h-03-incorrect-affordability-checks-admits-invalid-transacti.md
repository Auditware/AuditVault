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
  - "[[temporary]]"
  - "[[dos-resistance]]"
---
# [H-03] Incorrect affordability checks admits invalid transactions allowing txpool and block building DoS

- id: 64964
- impact: HIGH
- protocol: [[Monad]]
- reporter: oct0pwn (Code4rena)
- source: https://code4rena.com/reports/2025-09-monad

## Summary


This bug report describes a problem in the code related to how transactions are admitted into the transaction pool and how they are validated during the proposal process. The issue is that the code only uses the base fee to check if a transaction is affordable, but during proposal validation, the full EIP-1559 gas bid is used. This means that an attacker can fill the pool with transactions that pass the initial gate but cannot be included in a block, causing block building starvation and transaction admission denial. The root cause of this issue is the incorrect checking of gas bids and the failure to evict invalid transactions. The affected code can be found in the `bft/monad-eth-txpool/src/pool/mod.rs` and `bft/monad-eth-block-policy/src/lib.rs` files. The recommended mitigation steps include tightening the insert-time gate, evicting invalid transactions, and gating forwarding based on affordability.

## Details



* `bft/monad-eth-txpool/src/pool/mod.rs` [# L184-L197](https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-txpool/src/pool/mod.rs# L184-L197)
* `bft/monad-eth-block-policy/src/lib.rs` [# L77-L84](https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-block-policy/src/lib.rs# L77-L84)
* `bft/monad-eth-block-policy/src/lib.rs` [# L541-L556](https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-block-policy/src/lib.rs# L541-L556)

Transaction’s priority fee is ignored in txpool admission and only the base-fee is used to check affordability. However, proposal-time validation uses the full EIP-1559 gas bid. So an attacker can stuff the pool with transactions that pass the insert-time gate but are impossible to include.

During proposal, these fail `try_add_transaction(...)`; they remain in the txpool and will be selected again on subsequent proposals. The pool can be filled with similar high-tip transactions causing empty blocks due to no other transactions being admitted into it, causing transaction inclusion to stop completely once transactions are forwarded or submitted to all 200 leaders.

Important! This is a separate issue and root cause from my other txpool stuffing issue: this one is due to gas\_bid being checked incorrectly, the other is replacement-checks + nonce-gaps + eviction/promotion rules.

### Impact

When all 200 leaders are affected (either due to forwarding or direct submissions):

* Block building starvation: proposals contain no txs because tracked is stuffed by high-tip transactions from senders with insufficient balances.
* Txpool admission DoS: attacker transactions fill up both pools and can never be included (insufficient balance) which prevents admission of other transactions due to limited capacity.

### Root Cause

* Insert-time affordability check only uses base fee for balance check: `balance ≥ base_fee × gas_limit`.
* Proposal-time validation uses full EIP-1559 bid including max priority fee.
* Invalid transactions are returned to the tracked pool instead of being evicted to pending.
* No affordability-based pruning post-insert; eviction is time-based only, and easily bumped by replacement.

### Affected Code

* Insert-time affordability (base\_fee-only gate):

  + Balance vs base fee × gas limit in `insert_txs(...)`:
  + <https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-txpool/src/pool/mod.rs# L184-L197>
* Proposal-time affordability (full gas bid):

  + Gas bid computation `compute_txn_max_gas_cost(...)`:
  + <https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-block-policy/src/lib.rs# L77-L84>
  + `EthBlockPolicyBlockValidator::try_add_transaction(...)` enforces affordability at bid and reserve:
  + TFM-disabled path (max*fee × gas*limit): <https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-block-policy/src/lib.rs# L541-L556>
  + TFM-enabled emptying path (checks bid, value, reserve): <https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-block-policy/src/lib.rs# L574-L599>
* Sequencer sampling and skip-on-failure (no backfill):

  + Main proposal loop and selection:
  + loop and pop: <https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-txpool/src/pool/tracked/sequencer.rs# L175-L185>
  + add-to-proposal gate; returns false on validator error: <https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-txpool/src/pool/tracked/sequencer.rs# L287-L296>
* Forwarding gate ignores bid (base\_fee-only):

  + `ValidEthTransaction::get_if_forwardable(...)` checks `max_fee ≥ base_fee`:
  + <https://github.com/code-423n4/2025-09-monad/blob/main/bft/monad-eth-txpool/src/pool/transaction.rs# L260-L268>

**Preconditions**

While no fees are paid (transactions aren’t included), the attacker needs to fund addresses:

* They need one address per `MAX_ADDRESSES` for Tracking pool.
* So ~16k addresses with ~0.0021 MON each (21k min gas @ 100 gwei = 0.0021).
* Total~=34 MON. At 100B total supply and 20B valuation, this is roughly $7 in pre-funding.

**Attack path**

1. Submit one high-tip EIP-1559 tx for each funded address, for each leader, with `gas_bid = base_fee + high-tip`. Transactions will never be included, this costs no money.
2. `insert_txs(...)` admits them (base-fee-only check).
3. Sequencer samples up to `tx_limit` addresses.
4. `try_add_transaction(...)` rejects many on gas-bid affordability; those sampled addresses are skipped for this proposal, remain in the pool, and will be selected again.
5. Blocks are constructed empty, validators lose fees.

### Recommended mitigation steps

* Tighten insert-time gate: use full gas-bid affordability (`compute_txn_max_gas_cost`) for admission.
* Evict invalid transactions to pending when they fail static checks.
* Gate forwarding on affordability at current gas bid.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-09-monad/submissions/F-766)

---
