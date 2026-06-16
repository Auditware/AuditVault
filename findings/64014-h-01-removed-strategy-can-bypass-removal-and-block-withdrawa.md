---
tags:
  - lang/solidity
  - sector/staking
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - fix/add-access-control
  - fix/use-reentrancy-guard
protocol: "[[Prime Vaults]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Prime-Vaults-Security-Review.md"
genome:
  - "[[frozen-funds]]"
  - "[[role-bypass]]"
  - "[[add-access-control]]"
  - "[[use-reentrancy-guard]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
  - "[[reentrancy-guard]]"
---
# [H-01] Removed Strategy Can Bypass Removal and Block Withdrawals

- id: 64014
- impact: HIGH
- protocol: [[Prime Vaults]]
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Prime-Vaults-Security-Review.md

## Summary


The report is about a bug in the `StrategyRegistry.removeStrategy()` function that allows the owner to permanently remove a strategy. When a strategy is removed, it resets the `kind` to its default value and sets `active` to `false`. This causes inconsistent behavior in the `PrimeStrategy.withdraw()` function, where a removed strategy can still be called in some cases, while in others, it causes the entire withdrawal process to fail. This bug can result in a loss of user funds and a denial of service attack. The recommended solution is to check the `active` flag and skip inactive/removed strategies, or use a try/catch block to handle the revert. The team has fixed the issue.

## Details


## Severity

High Risk

## Description

The `StrategyRegistry.removeStrategy()` function allows the owner to permanently remove a strategy (the context). However, removal is implemented via `delete strategies[stra]`, which resets `kind` to its default enum value (`StrategyKind.SingleAsset == 0`) and sets `active` to `false`, while `PrimeStrategy` ignores `active` and only validates `kind` inside `_withdrawSingle()` / `_withdrawPair()` (the problem). This leads to inconsistent behavior during `PrimeStrategy.withdraw()` when iterating `withdrawPriority`: for `SingleAsset` strategies, a removed strategy appears as `SingleAsset` (kind == 0), so `_withdrawSingle()` passes the kind check and can still call `withdraw()` on a strategy address that was removed from the registry, allowing a bypass; for PairAsset strategies, a removed strategy also appears as `SingleAsset` (kind == 0), so `_withdrawPair()` fails the kind check and reverts, which bubbles up and reverts the entire user `withdraw()`, causing a DoS.

## Location of Affected Code

File: [contracts/StrategyRegistry.sol#L80-L95](https://github.com/prime-vaults/prime-vaults-strategy/blob/b722f446d14f0ff4fd600dab80a16ac8b11b413d/contracts/StrategyRegistry.sol#L80-L95)

```solidity
function removeStrategy(address stra) external onlyOwner {
    // code
    // @audit Deleting resets (kind, active) to defaults (0, false)
    delete strategies[stra];
    // code
}
```

File: [contracts/PrimeStrategy.sol](https://github.com/prime-vaults/prime-vaults-strategy/blob/b722f446d14f0ff4fd600dab80a16ac8b11b413d/contracts/PrimeStrategy.sol)

```solidity
function withdraw(address token, uint256 amount) external nonReentrant {
    // code
    if (shortfall > 0) {
        for (uint256 i; i < withdrawPriority.length && shortfall > 0;) {
            WithdrawPriority memory wq = withdrawPriority[i];
            uint256 withdrawn = 0;

            // @audit If a removed Pair strategy is reached, _withdrawPair reverts
            if (wq.kind == StrategyKind.SingleAsset) {
                withdrawn = _withdrawSingle(wq.allocKey, shortfall, token);
            } else {
                withdrawn = _withdrawPair(wq.allocKey, shortfall, token);
            }

            shortfall = withdrawn >= shortfall ? 0 : shortfall - withdrawn;
            unchecked {
                ++i;
            }
        }
        // code
    }
    // code
}

function _withdrawSingle(bytes32 key, uint256 want, address _token) internal returns (uint256 withdrawn) {
    // code
    (StrategyKind kind,) = IStrategyRegistry(strategyRegistry).strategies(alloc.strategy);

    // @audit Removed strategy returns kind=0 (SingleAsset), passing this check
    if (kind != StrategyKind.SingleAsset) revert VAULT__INVALID_STRATEGY_KIND();

    // ... calls ISingleAssetStrategy(alloc.strategy).withdraw(...)
}

function _withdrawPair(bytes32 key, uint256 want, address _token) internal returns (uint256 withdrawn) {
    // code
    (StrategyKind kind,) = IStrategyRegistry(strategyRegistry).strategies(alloc.strategy);

    // @audit Removed strategy returns kind=0 (SingleAsset), reverting here
    if (kind != StrategyKind.PairAsset) revert VAULT__INVALID_STRATEGY_KIND();
    // code
}
```

## Impact

The inconsistency between strategy removal and the withdrawal logic leads to two distinct impacts:

- `SingleAsset` strategies that have been explicitly removed by the protocol owner can still be interacted with during withdrawals. If a strategy was removed due to malicious behavior or a bug, continuing to execute withdrawals against it puts user funds at risk and ignores the administrator's intent to disconnect the strategy.

- If a `PairAsset` strategy is removed but remains in the withdrawal queue, it triggers a revert in the withdrawal flow due to the mismatched `kind`. This causes the entire `withdraw()` transaction to fail for users, effectively locking funds until the configuration is manually corrected.

## Proof of Concept

1. Owner removes a strategy via `StrategyRegistry.removeStrategy()`, which executes `delete strategies[stra]`.
2. The deleted entry now returns `kind = StrategyKind.SingleAsset(0)` and `active = false`.
3. A user calls `PrimeStrategy.withdraw()` and the vault calculates a `shortfall`.
4. The withdrawal loop iterates `withdrawPriority`.
5. **Bypass path**: if the entry is treated as `SingleAsset`, `_withdrawSingle()` sees `kind == 0` and proceeds to call `withdraw()` on the removed strategy address.
6. **DoS path**: if the entry is treated as `PairAsset`, `_withdrawPair()` sees `kind == 0`, reverts `VAULT__INVALID_STRATEGY_KIND()`, and the entire `withdraw()` reverts.

## Recommendation

In `_withdrawSingle()` and `_withdrawPair()`, fetch and enforce the `active` flag from the registry and skip inactive/removed strategies by returning `0` (so the withdrawal loop can continue) or use the try catch block to handle the revert.

- Read `(StrategyKind kind, bool active) = IStrategyRegistry(strategyRegistry).strategies(alloc.strategy);`
- If `!active`, return `0`
- Keep the `kind` checks as-is for active strategies

Optionally, wrap external strategy withdrawals in `try/catch` to ensure a single bad/paused strategy cannot revert the whole `withdraw()` flow.

## Team Response

Fixed.
