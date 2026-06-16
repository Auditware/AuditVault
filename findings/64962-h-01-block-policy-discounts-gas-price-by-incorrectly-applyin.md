---
tags:
  - lang/rust
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - novelty/known-pattern
  - sector/insurance
protocol: "[[Monad]]"
auditors:
  - "[[RadiantLabs]]"
report: "https://code4rena.com/reports/2025-09-monad"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[fee-accounting]]"
  - "[[integer-bounds]]"
---
# [H-01] Block policy discounts gas price by incorrectly applying EIP-1559 to legacy transactions

- id: 64962
- impact: HIGH
- protocol: [[Monad]]
- reporter: RadiantLabs (Code4rena)
- source: https://code4rena.com/reports/2025-09-monad

## Summary


The report discusses a bug in the block policy of the Monad project, which is used for tracking account balances and nonce updates in transactions. The bug occurs in the calculation of the "worst case balance" for legacy transactions, where the gas cost is underestimated. This can lead to invalid transactions being included in a block, which can cause a denial of service attack and allow malicious actors to circumvent gas fees. The recommended solution is to fix the block policy to calculate the gas cost for legacy transactions in the same way as the execution layer. A detailed proof of concept is also provided for further understanding. 

## Details



`bft/monad-eth-block-policy/src/lib.rs` [# L77](https://github.com/code-423n4/2025-09-monad/blob/5eb99e1c365d61b34a637db6c0a9b476bbaed5ee/bft/monad-eth-block-policy/src/lib.rs# L77)

Block policy implements static tracking of account balances and nonce updates to allow consensus to lead execution by `k` blocks, by allowing *only valid* transactions to be included in a block.

How it does it is by tracking the “worst case balance” and “nonce” of each account sending transactions and signing EIP-7702 authorizations.

In the case of the “worst case balance” calculation, there is a miscalculation in the `compute_txn_max_gas_cost` function, where the `base_fee` ceiling is applied to transactions that are not EIP-1559 (aka legacy transactions):
```

File: bft/monad-eth-block-policy/src/lib.rs
77: pub fn compute_txn_max_gas_cost(txn: &TxEnvelope, base_fee: u64) -> U256 {
78:     let gas_limit = U256::from(txn.gas_limit());
79:     let max_fee = U256::from(txn.max_fee_per_gas());
80:     let priority_fee = U256::from(txn.max_priority_fee_per_gas().unwrap_or(0));
81:     let base_fee = U256::from(base_fee);
82:     let gas_bid = max_fee.min(base_fee.saturating_add(priority_fee));
83:     gas_limit.checked_mul(gas_bid).expect("no overflow")
84: }
```

This contrasts with the execution layer which instead excludes legacy transactions from the EIP-1559 gas ceiling:
```

File: bft/monad-cxx/monad-execution/category/execution/ethereum/transaction_gas.cpp
144: inline constexpr uint256_t priority_fee_per_gas(
145:     Transaction const &tx, uint256_t const &base_fee_per_gas) noexcept
146: {
147:     MONAD_ASSERT(tx.max_fee_per_gas >= base_fee_per_gas);
148:     auto const max_priority_fee_per_gas = tx.max_fee_per_gas - base_fee_per_gas;
149:
150:     if (tx.type == TransactionType::eip1559 ||
151:         tx.type == TransactionType::eip4844 ||
152:         tx.type == TransactionType::eip7702) {
153:         return std::min(tx.max_priority_fee_per_gas, max_priority_fee_per_gas);
154:     }
155:     // EIP-1559: "Legacy Ethereum transactions will still work and
156:     // be included in blocks, but they will not benefit directly from
157:     // the new pricing system. This is due to the fact that upgrading
158:     // from legacy transactions to new transactions results in the
159:     // legacy transaction’s gas_price entirely being consumed either
160:     // by the base_fee_per_gas and the priority_fee_per_gas."
161:     return max_priority_fee_per_gas;
162: }
```

As a result of the bug in the consensus logic, the gas cost of a transaction can be underestimated, allowing transactions to be included in a block when the sender’s balance is not sufficient to guarantee cover for the gas fees.

When these transactions reach execution, the C++ logic will mark them invalid, eventually invalidating the whole block (because transactions that revert are acceptable in a valid block but invalid transactions aren’t).

Apart from the DoS scenario of invalid transactions poisoning blocks, this vulnerability also opens up a scenario where malicious actors can have consensus and include an arbitrarily high number of transactions without paying any fees, thus circumventing the economic barrier of gas that protects the Monad nodes’ infrastructure from abuse.

### Recommended mitigation steps

Fix block policy to calculate legacy transaction gas cost as `gas_limit * gas_price` like done in execution.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-09-monad/submissions/F-81)

---
