---
tags:
  - lang/rust
  - sector/governance
  - platform/spearbit
  - has/github
  - severity/high
  - novelty/variant
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[proposal-state-check]]"
---
# Missing transaction validation of EIP-7623 data ﬂoor gas in consensus

- id: 62885
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


The report discusses a high risk bug in a code library called `monad-eth-block-policy`. This library is missing a validation for a feature called EIP-7623, which changes the pricing for transactions with large amounts of data. This means that a transaction that is considered valid by the consensus code will be rejected during execution, leading to errors and potential denial-of-service attacks. The recommendation is to fix this issue by adding the validation in the consensus code as well. The bug has been fixed in a pull request and verified by the team. 

## Details

## High Risk Severity Report

## Context
- `lib.rs#L76-L125`

## Description
The consensus code present in `monad-eth-block-policy` is missing transaction static validation of **EIP-7623: Data Floor Gas**, which changes calldata pricing for transactions with large calldata. This is a problem because the execution code does implement EIP-7623 as part of the Prague fork during static validation of the transaction.

### Relevant Code Snippet (`validate_transaction.cpp#L97-L102`)
```cpp
// EIP-7623
if constexpr (rev >= EVMC_PRAGUE) {
    if (MONAD_UNLIKELY(floor_data_gas(tx) > tx.gas_limit)) {
        return TransactionError::IntrinsicGasGreaterThanLimit;
    }
}
```

So a transaction that passes static validation in consensus will be rejected during static validation in execution. During execution, this transaction is considered an invalid transaction, which is different from a reverting transaction, and the function `execute` will return early and return an error via `BOOST_OUTCOME_TRY`.

### Relevant Code Snippet (`execute_transaction.cpp#L220-L232`)
```cpp
Result<ExecutionResult> execute(
    Chain const &chain, uint64_t const i, Transaction const &tx,
    Address const &sender, BlockHeader const &hdr,
    BlockHashBuffer const &block_hash_buffer, BlockState &block_state,
    BlockMetrics &block_metrics, boost::fibers::promise<void> &prev
) {
    // ...
    BOOST_OUTCOME_TRY(static_validate_transaction<rev>(
        tx,
        hdr.base_fee_per_gas,
        chain.get_chain_id(),
        chain.get_max_code_size(hdr.number, hdr.timestamp)
    ));
}
```

### Relevant Code Snippet (`execute_block.cpp#L213-L224`)
```cpp
for (unsigned i = 0; i < block.transactions.size(); ++i) {
    MONAD_ASSERT(results[i].has_value());
    if (MONAD_UNLIKELY(results[i].value().has_error())) {
        LOG_ERROR(
            "tx {} {} validation failed: {} ",
            i,
            block.transactions[i],
            results[i].value().assume_error().message().c_str()
        );
    }
    BOOST_OUTCOME_TRY(auto retval, std::move(results[i].value()));
    retvals.push_back(std::move(retval));
}
```

What makes this a problem is that the transaction is invalid (different from a revert), returns an error, but no gas is actually charged for it since `execute` will exit early. In Monad, nodes agree on the transactions to execute before actually executing them. This means that an attacker can set a transaction with a large gas limit but does not obey EIP-7623. This passes static validation in consensus code but fails static validation in execution code. As a result, this transaction can occupy space in a proposal without the attacker needing to pay any gas for it, leading to a reliable denial-of-service vector.

## Recommendation
Validate EIP-7623 in the consensus code in `monad-eth-block-policy` (`lib.rs#L77`) as well.

## Category
**Labs:** Fixed in PR 2139.

## Spearbit
**Fix verified.**
