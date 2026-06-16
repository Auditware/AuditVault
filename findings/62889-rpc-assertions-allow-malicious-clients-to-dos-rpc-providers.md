---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - has/poc
  - severity/high
  - novelty/known-pattern
  - sector/infra
protocol: "[[Monad]]"
auditors:
  - "[[Haxatron]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf"
genome:
  - "[[underflow]]"
  - "[[temporary]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
---
# RPC Assertions allow malicious clients to DoS RPC providers

- id: 62889
- impact: HIGH
- protocol: [[Monad]]
- reporter: Haxatron (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Monad-Spearbit-Security-Review-September-2025.pdf

## Summary


The report describes a security vulnerability in a code that can be used to disrupt RPC service. The code has an assertion check that can be triggered by a specific request, causing an exception to be thrown and leading to RPC service disruption. A proof of concept is provided to demonstrate how the attack can be executed. The impact of the vulnerability is disruption of RPC service. The report recommends implementing overflow validation in the code to prevent this vulnerability. The issue has been fixed in a PR and verified by Spearbit.

## Details

## Security Vulnerability Report

## Severity
**High Risk**

## Context
(No context files were provided by the reviewer)

## Description
An RPC-based DoS vulnerability exists where malicious `eth_call` requests can trigger exception-based failures in balance overflow checks. The vulnerability occurs in `/monad/category/execution/ethereum/state3/state.hpp:365-369` where balance overflow protection uses assertions that can disrupt RPC service availability.

### Affected Code
```cpp
// state.hpp:365-369 - Balance overflow check
MONAD_ASSERT_THROW(
    std::numeric_limits<uint256_t>::max() - delta >= account.value().balance,
    "balance overflow ");
// THROWS EXCEPTION if: delta + account.balance > UINT256_MAX
account.value().balance += delta;

// rpc/eth_call.cpp - RPC balance manipulation
if (balance > intx::be::load<uint256_t>(state.get_balance(address))) {
    state.add_to_balance(
        address,
        balance - intx::be::load<uint256_t>(state.get_balance(address)));
}
```
The assertion triggers when `delta + account.balance > UINT256_MAX` during RPC call simulation, causing `MonadException` to be thrown, potentially disrupting RPC service.

## Proof of Concept
### RPC DoS Attack Scenario
```json
// Malicious eth_call request with state override
eth_call({
    "to": "0x742D35CC6AF93F4D2E1EDC04e1C77FD2FDbc4C09",
    "data": "0x...", // Any contract call
    "stateOverrides": {
        "0x742D35CC6AF93F4D2E1EDC04e1C77FD2FDbc4C09": {
            "balance": "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE" // Balance set to UINT256_MAX - 1
        }
    }
})
```

### Attack Execution
1. Attacker crafts `eth_call` with state override setting target account balance to near `UINT256_MAX`.
2. RPC handler processes the call and applies balance changes via `add_to_balance()`.
3. Any delta > 1 triggers the overflow condition: `delta + (UINT256_MAX-1) > UINT256_MAX`.
4. `MONAD_ASSERT_THROW` fires, throwing `MonadException`.
5. RPC call causes assertion to trigger and node crashes.

## Impact
RPC service disruption.

## Recommendation
Implement overflow validation in RPC state override processing to prevent exception-based DoS:

```cpp
// Safe balance override validation for RPC calls
if (state_delta.balance.has_value()) {
    auto const requested_balance = intx::be::unsafe::load<uint256_t>(
        state_delta.balance.value().data());
    // Validate balance is within reasonable limits for simulation
    if (requested_balance > std::numeric_limits<uint256_t>::max() / 2) {
        // Return error for unrealistic balance values instead of processing
        return Error("Balance override value too large for simulation ");
    }
    auto const current_balance = intx::be::load<uint256_t>(state.get_balance(address));
    if (requested_balance > current_balance) {
        auto const delta = requested_balance - current_balance;
        // Check if addition would overflow before calling add_to_balance
        if (delta > std::numeric_limits<uint256_t>::max() - current_balance) {
            return Error("Balance overflow in state override ");
        }
        state.add_to_balance(address, delta);
    } else {
        state.subtract_from_balance(address, current_balance - requested_balance);
    }
}
```

### Alternative
Add input validation to reject state overrides with unrealistic balance values before they reach the balance manipulation code.

## Category Labs
Fixed in PR 1534.

## Spearbit
Fix verified.
