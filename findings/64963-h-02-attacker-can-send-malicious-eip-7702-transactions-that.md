---
tags:
  - lang/rust
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Monad]]"
auditors:
  - "[[oct0pwn]]"
report: "https://code4rena.com/reports/2025-09-monad"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[bridge-sender-auth]]"
---
# [H-02] Attacker can send malicious EIP-7702 transactions that cause rounds to time out and halt the chain

- id: 64963
- impact: HIGH
- protocol: [[Monad]]
- reporter: oct0pwn (Code4rena)
- source: https://code4rena.com/reports/2025-09-monad

## Summary


This bug report describes a problem in the code of a blockchain project called Monad. The issue is related to the validation of transactions and blocks, and it can be exploited by attackers to halt the chain and resubmit invalid transactions indefinitely. The root cause of the problem is that the checks for the authorization and the chain ID are performed in different orders during transaction and block validation. The recommended solution is to change the order of these checks during transaction validation to prevent invalid transactions from being included in blocks. A detailed proof of concept is also provided for further understanding. 

## Details



* `bft/monad-eth-txpool/src/pool/transaction.rs` [# L112-L125](https://github.com/code-423n4/2025-09-monad/blob/26c5d9dccf4dd35d0943fe85ff2a89468f2e4fd7/bft/monad-eth-txpool/src/pool/transaction.rs# L112-L125)
* `bft/monad-eth-block-validator/src/lib.rs` [# L467-L475](https://github.com/code-423n4/2025-09-monad/blob/26c5d9dccf4dd35d0943fe85ff2a89468f2e4fd7/bft/monad-eth-block-validator/src/lib.rs# L467-L475)

The root cause is that during transaction validation in the mempool, the `chain_id` of an authorization is checked before verifying whether the authority is the `SYSTEM_SENDER_ETH_ADDRESS` (see first GitHub link). If the `chain_id is incorrect`, the transaction itself is still considered valid, but the authorization is not.

During block validation, however, the checks are performed in the opposite order: the `SYSTEM_SENDER_ETH_ADDRESS` check is done first, followed by the `chain_id` check (see second GitHub link). If the `SYSTEM_SENDER_ETH_ADDRESS` check fails, the whole transaction and therefore the block is invalid.

The problem arises when someone sends a transaction with the authority set to `SYSTEM_SENDER_ETH_ADDRESS` but with an invalid `chain_id`. In this case:

* Mempool validation: The transaction is accepted, because the `chain_id` check fails first, so the `SYSTEM_SENDER_ETH_ADDRESS` check is never performed.
* Block validation: The transaction causes an error, because the `SYSTEM_SENDER_ETH_ADDRESS` check runs first, and the block is therefore deemed invalid and not voted on: [see here](https://github.com/code-423n4/2025-09-monad/blob/26c5d9dccf4dd35d0943fe85ff2a89468f2e4fd7/bft/monad-consensus-state/src/lib.rs# L515-L517).
  This means the block is never added to the block tree and therefore [cannot be coherent](https://github.com/code-423n4/2025-09-monad/blob/26c5d9dccf4dd35d0943fe85ff2a89468f2e4fd7/bft/monad-consensus-state/src/lib.rs# L520-L521).
  Because `try_vote` would only be called in `try_add_and_commit_blocktree`, it will never vote on the block, and a [timeout will occur](https://github.com/code-423n4/2025-09-monad/blob/26c5d9dccf4dd35d0943fe85ff2a89468f2e4fd7/bft/monad-consensus-state/src/lib.rs# L1366C1-L1366C60).

If an attacker sends such a transaction to many nodes, each node may include it in a block, causing repeated timeouts. Because the leader schedule is known, the attacker could also always send their transactions to the next leaders. This means he does not have to send the transaction to all nodes. This process can be repeated indefinitely, effectively halting the chain because no blocks are successfully executed. Since the transaction is never executed, the attacker can resubmit it endlessly at no cost.

### Recommended mitigation steps

The `SYSTEM_SENDER_ETH_ADDRESS` check should also be performed first during transaction validation in the mempool. This way, invalid transactions would be rejected early and never included in a block, allowing the chain to continue operating normally.

[View detailed Proof of Concept](https://gist.github.com/TheSchnilch/8756f332607961b6f849e0b4c06b6628)

---
