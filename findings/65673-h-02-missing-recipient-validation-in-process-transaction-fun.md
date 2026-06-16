---
tags:
  - lang/rust
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/stable
  - sector/token
  - sector/uncollat-lending
  - platform/pashov
  - has/github
  - severity/high
  - precondition/specific-token-type
  - novelty/variant
protocol: "[[Spicenet]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Spicenet-security-review_2026-04-06.md"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[specific-token-type]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H-02] Missing recipient validation in `process_transaction` function

- id: 65673
- impact: HIGH
- protocol: Spicenet_2026-04-06
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Spicenet]]-security-review_2026-04-06.md

## Summary


The bug report describes a problem in the code where a deposit is credited to a user without checking if the tokens were actually sent to the correct escrow contract. This can lead to a situation where a user can receive more tokens than they deposited, causing a deficit in the escrow and affecting other users. The report also suggests a solution to fix the issue by validating the recipient address against the registered escrow address. The fix has been implemented by registering expected escrow contract addresses and validating them in the code.

## Details


_Resolved_

## Severity

**Impact:** High

**Likelihood:** Medium


## Description

In `process_transaction`, when processing an `ERC20::Transfer` event log, the `to` field is destructured but explicitly discarded (`to: _`). The code credits a deposit to the `from` address based solely on the `Transfer` event's `value`, without confirming that the tokens were actually sent to the rollup's escrow contract.

The `process_transaction` call path is restricted to the admin via `CallMessage::ProcessTransaction`, which limits direct exploitability. However, the absence of recipient validation removes a critical defense-in-depth layer. If the admin submits an incorrect L1 transaction proof, whether through operational error, replaying the wrong transaction hash, or key compromise, any `ERC20::Transfer` event on the target token contract will be interpreted as a valid deposit. A routine transfer between two unrelated parties (e.g., Alice transferring USDC to Bob on L1) would cause the rollup to mint a corresponding balance for Alice without any tokens entering escrow.

Because the settlement module provides no mechanism to reverse or unwind a processed deposit, an erroneously credited phantom deposit is permanent. The resulting balance is fully spendable on L2, and if the credited user withdraws, real tokens are drained from the escrow, creating a deficit that socializes the loss across all other depositors.

An additional attack vector arises with fee-on-transfer tokens (e.g., USDT when its fee mechanism is active): a single `transfer()` call emits two `Transfer` events - one for the principal amount delivered to the escrow and one for the fee routed to a fee collector. Without `to` validation against the registered escrow address, both events are processed as deposits, minting more receipt tokens than the escrow actually received and creating an insolvency condition that compounds with every deposit.

## Attack Flow Example

**Scenario - Batched L1 transaction with multiple Transfer events (user-exploitable via honest admin):**

1. A user crafts an L1 transaction that batches two actions atomically: (a) a legitimate deposit of 100 USDC to the escrow contract, and (b) a transfer of 50,000 USDC to a user-controlled address (e.g., via a multicall or smart contract wallet).
2. This single L1 transaction emits two `Transfer` events from the USDC contract:
   - `Transfer(User, Escrow, 100)` - the real deposit.
   - `Transfer(User, UserControlledAddr, 50,000)` - unrelated transfer in the same transaction.
3. The admin submits this L1 transaction to `process_transaction`. Since the first transfer is a legitimate escrow deposit, the admin has no reason to suspect the transaction is problematic.
4. `process_transaction` iterates **all** logs. Both transfer events match `ERC20::Transfer::SIGNATURE_HASH`. Both are processed as deposits:
   - First: `process_deposit(from=User, value=100)` - mints 100 receipt tokens. Correct.
   - Second: `process_deposit(from=User, value=50,000)` - mints 50,000 receipt tokens. **No tokens entered escrow for this one.**
5. The user now holds 50,100 receipt tokens on L2 but only deposited 100 USDC into escrow. The user withdraws the full 50,100, draining the escrow of other depositors' funds.
6. There is no administrative function to reverse the phantom deposit. The escrow is now undercollateralized by 50,000 USDC.

This attack passes through an honest admin because the transaction genuinely contains a valid escrow deposit; the admin has no mechanism to selectively process only certain Transfer events from the transaction.

## Recommendation

Register escrow addresses per chain at the module level and validate that the `to` field of every `ERC20::Transfer` event matches the expected escrow address:

```rust
ERC20::Transfer::SIGNATURE_HASH => {
    let ERC20::Transfer { from, to, value } =
        ERC20::Transfer::decode_raw_log(topics, log.data.as_ref())?;

    let expected_escrow = self.get_escrow_address(chain_hash.chain_id, state)?;
    if to != expected_escrow {
        continue;  // skip non-escrow transfers
    }

    let e = self.process_deposit(
        S::Address::try_from(from.as_ref())?,
        ChainAddress::try_from_chain_id_and_data_bytes(
            chain_hash.chain_id,
            log.address.as_ref(),
        )?,
        value.try_into()?,
        state,
    )?;
    // ...
}
```

Additionally, the transaction-level `from` and `to` fields in `TxVerificationData::Evm` are currently discarded (`from: _, to: _`). Once per-chain escrow address registration is implemented, cross-checking `tx_data.to` against the registered escrow address provides an additional defense-in-depth layer beyond the log-level `Transfer.to` check.

## Fix Implemented

The fix registers expected escrow contract addresses per chain in the config, then validates `log.address` against those registered addresses in `process_transaction` - `Transfer` events from addresses not in `chain_config.escrow_contracts` are now skipped, preventing phantom deposits from arbitrary ERC-20 emitters.
