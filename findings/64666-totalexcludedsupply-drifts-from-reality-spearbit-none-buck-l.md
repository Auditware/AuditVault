---
tags:
  - lang/solidity
  - sector/governance
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/logic/reward-calculation
  - precondition/specific-token-type
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Buck Labs]]"
auditors:
  - "[[R0bert]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Strong-DAO-Spearbit-Security-Review-December-2025.pdf"
genome:
  - "[[underflow]]"
  - "[[reward-calculation]]"
  - "[[wrong-state]]"
  - "[[specific-token-type]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# totalExcludedSupply drifts from reality

- id: 64666
- impact: HIGH
- protocol: [[Buck Labs]]: Smart Contracts
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Strong-DAO-Spearbit-Security-Review-December-2025.pdf

## Summary


The RewardsEngine contract has a bug where the `totalExcludedSupply` value, which is used to calculate reward allocations, can become incorrect over time. This is because the value is only updated in certain functions and does not account for excluded accounts receiving or sending tokens through normal transfers or rewards. This can cause a mismatch between the actual excluded supply and what is used for calculations, potentially leading to incorrect reward allocations and even contract failures. To fix this, it is recommended to update the `totalExcludedSupply` value on every balance change for excluded accounts or to use a more robust mechanism for tracking excluded balances. This bug has been fixed in the latest commit by updating the `totalExcludedSupply` value on every excluded account balance change.

## Details

## Severity: High Risk

## Context
RewardsEngine.sol#L498-L551

## Description
RewardsEngine tracks `totalExcludedSupply` as the sum of balances for excluded accounts, but it only updates this value inside the `setAccountExcluded()` and `setBreakageSink()` functions. Excluded accounts can still receive and send STRX through normal transfers and reward mints, and those balance changes go through the token hook without adjusting `totalExcludedSupply`. As a result, `totalExcludedSupply` drifts from the real excluded balances over time.

### Code Snippet
```solidity
function setAccountExcluded(address account, bool isExcluded) external onlyRole(ADMIN_ROLE) {
    // ...
    if (isExcluded) {
        totalExcludedSupply += s.balance;
        // ...
    } else {
        if (totalExcludedSupply >= s.balance) {
            totalExcludedSupply -= s.balance;
        } else {
            totalExcludedSupply = 0;
        }
    }
}

function onBalanceChange(address from, address to, uint256 amount) external onlyToken {
    if (from != address(0) && from != address(this)) {
        _handleOutflow(from, amount);
    }
    if (to != address(0) && to != address(this)) {
        _handleInflow(to, amount);
    }
}
```

Epoch configuration relies on this value to set the starting eligible supply:
```
currentEligibleSupply = IERC20(token_).totalSupply() - totalExcludedSupply;
```
If `totalExcludedSupply` is stale, `currentEligibleSupply` becomes incorrect. Because excluded balances can increase via reward mints and transfers, this causes a persistent mismatch between the actual excluded supply and what the system uses for denominators during distributions. In extreme cases where excluded balances shrink materially and the tracked value stays high, the subtraction can underflow and revert, blocking epoch configuration.

## Impact
Reward allocation is computed with an incorrect denominator, and epoch configuration can revert if `totalExcludedSupply` exceeds total supply due to drift.

## Recommendation
Consider updating `totalExcludedSupply` on every balance change for excluded accounts. On the token hook path, subtract `amount` when an excluded account is the sender and add `amount` when an excluded account is the recipient, including mint and burn flows. If that is not safe, replace `totalExcludedSupply` with a more robust mechanism that cannot drift, such as tracking excluded balances per account and summing them on demand.

## Buck Labs
Fixed in commit 8105ffb.

## Spearbit
Fix verified. Commit 8105ffb fixes the issue by updating `totalExcludedSupply` on every excluded account balance change. `src/rewards/RewardsEngine.sol` now subtracts `amount` from `totalExcludedSupply` in `_handleOutflow` when `s.excluded` and adds `amount` in `_handleInflow` when `s.excluded`. This keeps `currentEligibleSupply = totalSupply - totalExcludedSupply` accurate and prevents the drift/underflow path described.
