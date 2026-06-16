---
tags:
  - lang/solidity
  - sector/lending
  - platform/trailofbits
  - has/github
  - severity/high
  - vuln/dos/frozen-funds
  - vuln/logic/liquidation-logic
  - impact/loss-of-funds/locked-funds
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[EVAA Finance]]"
auditors:
  - "[[Kevin Valerio Trail of Bits PUBLIC]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2025-08-evaafinance-securityreview.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[liquidation-logic]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[liquidation-underwater]]"
---
# Insufficient fee validation leading to user contract state lock

- id: 62252
- impact: HIGH
- protocol: [[EVAA Finance]]
- reporter: Kevin Valerio Trail of Bits PUBLIC (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2025-08-evaafinance-securityreview.pdf

## Summary


This bug report highlights a high difficulty data validation issue in the liquidation fee logic. It allows attackers to lock user funds permanently by triggering incomplete liquidation processes. The current implementation does not validate the additional TON reserve amount required for successful transaction completion, which creates a window for exploitation. When a liquidation request is processed, the user contract increments its state counter, which acts as a critical lock mechanism to prevent withdrawals. An attacker can exploit this by sending a transaction with a specific amount of TON, causing the liquidation process to fail and leaving the user contract permanently locked. To prevent this, the fee validation logic should be updated to include the TON reserve amount requirement, and long-term solutions such as comprehensive gas estimation should be implemented.

## Details

## High Difficulty Data Validation Issue

## Description

The liquidation fee validation logic contains a flaw that allows attackers to permanently lock user funds by triggering incomplete liquidation processes. The current implementation validates only that `msg_value` is enough to cover `enough_fee` without accounting for the additional `TON_reserve_amount` required for successful transaction completion.

```solidity
if ((min_collateral_amount > max_allowed_liquidation) | (msg_value < enough_fee)) {
    [...]
    ;; Refund asset
    immediate_asset_refund(
        [...]
    );
    ;; Note that we don't break execution:
    ;; We update asset_dynamics_collection with new s/b-rates regardless
} else {
    raw_reserve(TON_reserve_amount, reserve::AT_MOST + 2);
    send_message_to_evaa_user_sc(
        BLANK_CODE(), user_version, user_code, borrower_address, ;; <- the meaning is of
        owner_address
        liquidate_user_message,
        sendmode::CARRY_ALL_BALANCE,
        subaccount_id
    );
}
```

*Figure 7.1: Insufficient fee validation in `contracts_internal/contracts/core/master-liquidate.fc#L54–L87`*

The actual gas requirement for successful completion is `enough_fee + TON_reserve_amount`. This creates an exploitable window where transactions can pass validation but fail during execution, leaving user contracts in a locked state.

When a liquidation request is processed, the user contract increments its state counter to track ongoing operations:

```solidity
user::storage::save(
    code_version,
    master_address, owner_address,
    user_principals,
    state + 1, ;; Increase ongoing liquidation count
    user_rewards, backup_cell_1, backup_cell_2
);
```

*Figure 7.2: State increment during liquidation in `contracts_internal/contracts/core/user-liquidate.fc#L323–L329`*

This state variable acts as a critical lock mechanism that prevents withdrawals when it is incremented:

```solidity
if (state != user_state::free) {
    reserve_and_send_rest(
        fee::min_tons_for_storage,
        master_address,
        pack_supply_withdraw_unsatisfied_message(
            query_id, owner_address,
            supply_asset_id, supply_amount,
            ton_amount_for_repay_remainings, custom_response_payload, subaccount_id
        )
    );
    return ();
}
```

*Figure 7.3: Withdrawal prevention logic in `contracts_internal/contracts/core/user-supply-withdrawal.fc#L21–L32`*

An attacker can exploit this by sending liquidation requests with `TON_reserve_amount < msg_value < enough_fee + TON_reserve_amount`. The transaction passes the initial fee check and increments the user’s state, but the liquidation process fails to complete due to insufficient gas. This leaves the user contract permanently locked with `state > 0`, blocking all future withdrawal attempts indefinitely.

## Exploit Scenario

Bob wants to attack Alice’s account and lock her funds permanently. He identifies that Alice has a liquidatable position and crafts a malicious liquidation request.

Bob sends a transaction with `msg_value = 0.51 TON`, which covers the `TON_reserve_amount` (0.5 TON) but falls short of the total requirement of `enough_fee + TON_reserve_amount` (0.52 TON). The master contract’s fee validation passes since `0.51 TON > enough_fee (0.02 TON)`, and the liquidation process begins.

Alice’s user contract receives the liquidation message and increments its state counter from 0 to 1 to track the ongoing operation. However, when the master contract attempts to complete the liquidation process, it runs out of gas due to insufficient funds. The liquidation fails to complete, but Alice’s user contract never receives the completion message to decrement the state back to 0. As a result, Alice’s account remains permanently locked with `state = 1`, indefinitely preventing her from withdrawing any of her supplied funds.

## Recommendations

- **Short term**: Update the fee validation logic to include the TON reserve amount requirement.
- **Long term**: Implement comprehensive gas estimation to prevent partial execution scenarios that could leave contracts in inconsistent states.
