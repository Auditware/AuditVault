---
tags:
  - lang/solidity
  - sector/governance
  - sector/perpetuals
  - platform/quantstamp
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[XDAO]]"
auditors:
  - "[[István Böhm]]"
report: "https://certificate.quantstamp.com/full/xdao/2670863d-2e1c-42e6-a15c-5572dd4fef85/index.html"
genome:
  - "[[underflow]]"
  - "[[permanent]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[proposal-state-check]]"
  - "[[commitment-uniqueness]]"
---
# DAO Actions Fail Due to Insufficient Funds for `make_action()` Execution

- id: 61878
- impact: HIGH
- protocol: [[XDAO]]
- reporter: István Böhm (Quantstamp)
- source: https://certificate.quantstamp.com/full/xdao/2670863d-2e1c-42e6-a15c-5572dd4fef85/index.html

## Summary


The team has identified a bug in the governance system that causes all approved proposals to fail. This is due to a double-spending of the `service_fee` and a lack of sufficient funds to cover the gas costs of executing the proposal. This leads to a denial-of-service on governance and a breach of user trust. To address this, the team recommends implementing a two-part fee system for proposals, including a new `execution_fee` to cover gas costs. This requires modifications to the `master.fc` and `elections_master.fc` contracts. By implementing this solution, the governance system will become more reliable and restore trust in the protocol's core functionality.

## Details

**Update**
The team adds an `execution_fee` to the proposal, which should be used to pay for the extra tx fee cost for the proposal execution. There is also `calculate_min_execution_fee()` function that checks the lower bound of the `execution_fee` when the proposal (`elections_master`) is created.

Addressed in: `48edca93d2971a452a780733d6cb46f875fe3d8d`.

**File(s) affected:**`contracts/elections_master.fc`, `contracts/master.fc`

**Description:** When a proposal closes successfully, `elections_master.fc` forwards its entire balance-an amount that equals the exact `service_fee` collectively paid by voters-to `master.fc`. Inside the transferred message body, the contract also encodes that same `service_fee` value. Upon receipt, `master.fc` subtracts both the embedded `fee_value` and the constant `BASE_FEE` from the incoming `msg_value` in order to create the forwarding message that executes the chosen action. In the ordinary path, where no actor contributes extra value, this arithmetic becomes negative (for example, `1 TON – 1 TON – 0.05 TON = -0.05 TON`). FunC then raises a cell-underflow (runtime error 9), the transaction reverts, and execution halts.

Because governance automation never appends additional coins, the failure is deterministic: every approved action collapses at the first hop unless the last voter that triggers the execution manually “tops up” the trigger transaction so that `msg_value` is at least `service_fee + BASE_FEE`. The flaw therefore turns the DAO into a voting facade; decisions appear to pass, yet no state change can occur under normal use.

The problem is aggravated by the bounce handler in `elections_master.fc`. When `master.fc` reverts, the bounce message arrives carrying the full contract balance, and the handler refunds that amount to `data::initiated_by_address`, the proposal creator. Thus, the collective voting pot is silently funneled to a single participant while all other voters lose their gas fees. The combined effect is a denial-of-service on governance, an economic distortion that rewards initiators for failed actions, and a breach of user trust.

At its root, the design double-spends `service_fee`: first as a payment to the fee manager and then implicitly as gas for message forwarding. Without an external subsidy, the ledger can never satisfy both obligations, guaranteeing perpetual under-funding and reversion.

**Exploit Scenario:**

1.   Voters pay `service_fee` and vote on a proposal.
2.   `elections_master` forwards `service_fee` to `master`.
3.   `make_action()` computes `msg_value - fee_value - BASE_FEE`, which is negative, triggering a revert.
4.   The action fails universally, and the bounce handler in `elections_master` refunds the initiator, draining voter funds.

**Recommendation:** To address the funding shortfall that causes all approved proposals to fail, we recommend a comprehensive overhaul of the fee structure to ensure that the full cost of a proposal-both the protocol service fee and the variable gas cost of execution-is calculated and collected from voters before execution is attempted.

The current design flaw, where the `service_fee` is effectively double-spent, can be resolved by implementing a two-part fee system for every proposal:

1.   `service_fee`: The existing fee paid to the protocol for a given action.
2.   `execution_fee`: A new, dynamically calculated fee that covers the gas costs required to execute the specific `action_message_body` of the proposal.

This approach ensures that each proposal is self-contained and fully funded, preventing the deterministic transaction failure and subsequent fund misdirection described in the issue.

We recommend the following implementation steps:

1.   **Implement dynamic execution fee calculation in `master.fc`:** A new internal function, `_calculate_execution_fee(cell action_message_body)`, should be added to `master.fc`. This function will be responsible for inspecting the proposal’s `op` code and payload to estimate the necessary gas for execution. It must handle both fixed-cost actions (e.g., `op::change_success_percentage`) and variable-cost actions, most notably `op::call_jetton_mint`, where the fee must be calculated based on the number of recipients in the `receivers` dictionary.

2.   **Augment `elections_master.fc` storage and initialization:** When `master.fc` creates a new proposal, it must pass the newly calculated `execution_fee` to the `elections_master` contract. This requires modifying the `pack_elections_master_data` utility function to include the `execution_fee`, and expanding the storage of `elections_master.fc` to store this `execution_fee` alongside the `service_fee`.

3.   **Revise voter fee contribution logic:** The `_calculate_personal_fee()` function in `elections_master.fc` must be updated. Instead of calculating a voter's share of just the `service_fee`, it should now calculate their proportional contribution to the sum of `service_fee` and `execution_fee`. This ensures the total amount collected from all voters is sufficient to cover all costs.

4.   **Ensure correct fund handling in `master.fc`:** Upon a successful vote, `elections_master.fc` will forward the total collected fees to `master.fc`. The `make_action()` function in `master.fc` will then have sufficient funds to both send the `service_fee` to the `fee_manager` and utilize the remaining `execution_fee` to pay for all message forwarding and contract interactions required by the proposal, thus preventing the cell-underflow error.

By adopting this explicit and dynamic fee mechanism, the DAO's governance system will become robust and reliable, ensuring that the outcomes of successful votes can be enacted on-chain as intended and restoring trust in the protocol's core functionality.
