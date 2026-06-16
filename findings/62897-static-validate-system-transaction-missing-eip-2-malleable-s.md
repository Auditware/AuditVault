---
tags:
  - lang/rust
  - platform/spearbit
  - has/github
  - severity/high
  - sector/governance
  - sector/infra
  - sector/staking
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# static_validate_system_transaction missing EIP-2 malleable signature validation

- id: 62897
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


This bug report discusses a security issue in a piece of code called `static_validate_system_transaction`. This code is responsible for validating certain transactions in a system. However, it has a vulnerability that could allow a malicious user to include an invalid transaction, which could break important functions. The report recommends adding a validation check to ensure that the transaction signature is in the lower half of the curve. This issue has been fixed in a recent commit. 

## Details

## Security Advisory

**Severity:** High Risk  

**Context:** (No context files were provided by the reviewer)  

**Description:**  
`static_validate_system_transaction` is missing malleable signature validation. The only validation for `static_validate_system_transaction` is present in the following code block:

```rust
fn static_validate_system_transaction(
    txn: &Recovered<TxEnvelope>,
) -> Result<(), SystemTransactionError> {
    if !Self::is_system_sender(txn.signer()) {
        return Err(SystemTransactionError::UnexpectedSenderAddress);
    }
    if !txn.tx().is_legacy() {
        return Err(SystemTransactionError::InvalidTxType);
    }
    if txn.tx().gas_price() != Some(0) {
        return Err(SystemTransactionError::NonZeroGasPrice);
    }
    if txn.tx().gas_limit() != 0 {
        return Err(SystemTransactionError::NonZeroGasLimit);
    }
    if !matches!(txn.tx().kind(), TxKind::Call(_)) {
        return Err(SystemTransactionError::InvalidTxKind);
    }
    Ok(())
}
```

This can allow a malicious block proposer to include an invalid system transaction by flipping the `s` value of the system transaction to the upper-half of the curve. This will fail during transaction validation in the execution layer, which can lead to failed epoch/snapshot changes, breaking validator set accounting.

Another relevant code snippet from `execute_system_transaction.cpp`:

```cpp
Result<Receipt> ExecuteSystemTransaction<rev>::operator()()
{
    // ...
    {
        Transaction tx = tx_;
        tx.gas_limit = 2/quotesingle.ts1000/quotesingle.ts1000; // required to pass intrinsic gas validation check
        BOOST_OUTCOME_TRY(static_validate_transaction<rev>(
            tx,
            std::nullopt /* 0 base fee to pass validation */ ,
            std::nullopt /* 0 blob fee to pass validation */ ,
            chain_.get_chain_id(),
            chain_.get_max_code_size(header_.number, header_.timestamp)));
    }
}
```

Validation in `validate_transaction.cpp`:

```cpp
// EIP-2
if (MONAD_UNLIKELY(!silkpre::is_valid_signature(
    tx.sc.r, tx.sc.s, rev >= EVMC_HOMESTEAD))) {
    return TransactionError::InvalidSignature;
}
```

**Recommendation:**  
Validate that the `s` value of the system transaction signature is in the lower-half of the curve. 

**Example:**  
Implementation in `validation.rs`:

```rust
fn eip_2(tx: &TxEnvelope) -> Result<(), TransactionError> {
    // verify that s is in the lower half of the curve
    if tx.signature().normalize_s().is_some() {
        return Err(TransactionError::UnsupportedTransactionType);
    }
    Ok(())
}
```

**Category:** Labs  
**Status:** Fixed in commit `aa71c71e`.  
**Spearbit:** Fix verified.
