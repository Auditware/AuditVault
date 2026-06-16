---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/infra
  - sector/staking
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
---
# eth_call RPC DoS via state override on staking contract during precompile_withdraw

- id: 62893
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


This bug report describes a high-risk security issue in a commit with the hash `fc820c9ee9ab310c4fdd5e1888f72164c0b871c8`. The issue allows for a denial-of-service attack on RPC nodes using the `eth_call` function and a state override on the staking contract. This is due to a `MONAD_ASSERT` statement in the staking contract that checks the contract balance during a withdrawal request. By manipulating the contract balance or withdrawal amount, it is possible to trigger the `MONAD_ASSERT` and cause the RPC node to fail. The report recommends using `MONAD_ASSERT_THROW` instead of `MONAD_ASSERT` or reverting earlier in the process to prevent this attack. The bug has been fixed in PR 1606 and has been verified as fixed. 

## Details

## High Risk Security Issue

**Severity**: High Risk  
**Context**: (No context files were provided by the reviewer)  
**Description**: (Issue found in commit hash `fc820c9ee9ab310c4fdd5e1888f72164c0b871c8`).

It is possible to cause a denial-of-service to RPC nodes via `eth_call` by using a state override on the staking contract. The problem is that there exists a `MONAD_ASSERT` on the staking contract that checks if the current contract balance is `>=` the amount of the withdrawal request during `precompile_withdraw`.

```cpp
Result<byte_string> StakingContract::precompile_withdraw(
    byte_string_view const input, evmc_address const &msg_sender,
    evmc_uint256be const &)
{
    // ...
    auto withdrawal_request_storage =
        vars.withdrawal_request(val_id, msg_sender, withdrawal_id);
    auto withdrawal_request = withdrawal_request_storage.load_checked();
    if (MONAD_UNLIKELY(!withdrawal_request.has_value())) {
        return StakingError::UnknownWithdrawalId;
    }
    // ...
    auto const contract_balance =
        intx::be::load<uint256_t>(state_.get_balance(STAKING_CA));
    MONAD_ASSERT(contract_balance >= withdrawal_amount);
    send_tokens(msg_sender, withdrawal_amount);
    // ...
}
```

Hence, it is possible with the `eth_call` state override feature, to set the staking contract balance to 0, or set the `withdrawal_amount` stored in the `withdrawal_request` to be greater than the staking contract balance. This will cause the `MONAD_ASSERT` to fail, therefore causing a denial-of-service of the RPC node.

**Recommendation**: Either use `MONAD_ASSERT_THROW` that throws a program exception that is handled in `eth_call` instead of `MONAD_ASSERT` which will abort, or revert earlier if `withdrawal_amount > contract_balance`.

**Category**: Labs  
**Status**: Fixed in PR 1606  
**Spearbit**: Fix verified.
