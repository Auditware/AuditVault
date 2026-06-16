---
tags:
  - lang/solidity
  - sector/lending
  - platform/spearbit
  - has/github
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Tenbin]]"
auditors:
  - "[[R0bert]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Tenbin-Spearbit-Security-Review-January-2026.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[reward-theft]]"
  - "[[use-reentrancy-guard]]"
  - "[[reentrancy-guard]]"
---
# Revenue accounting ignores losses

- id: 64974
- impact: HIGH
- protocol: [[Tenbin]]
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Tenbin-Spearbit-Security-Review-January-2026.pdf

## Summary


This report discusses a bug found in the `CollateralManager` contract which can lead to incorrect distribution of revenue and under-collateralization of the protocol. The issue is caused by the way revenue is calculated and realized, as well as how it is withdrawn. The key behavior is that the system only tracks positive changes in the total assets of the underlying vault, ignoring any negative changes. This can result in the system paying out more revenue than it has actually earned, leading to a loss of principal. The recommended solution is to update the revenue accounting to also consider losses and adjust the pending revenue accordingly. This will ensure that principal is not mistakenly labeled as revenue and paid out. The bug has been fixed in the latest commit and verified by the developers.

## Details

## High-Risk Severity Report

## Severity
**High Risk**

## Context
`CollateralManager.sol#L374-L386`

## Description
The `CollateralManager` accounts for “revenue” in a way that only ever accumulates positive yield and never offsets it when the underlying vault loses value. This allows `withdrawRevenue` to pay out amounts labeled as revenue that exceed the vault's net performance, withdrawing principal as “revenue”.

### Revenue-related state
```solidity
mapping(address => uint256) public pendingRevenue;
mapping(address => uint256) public lastTotalAssets;
```

### New revenue calculation
New revenue is computed and realized as follows:
```solidity
function _computeNewRevenue(address collateral, IERC4626 vault) internal view returns (uint256 revenue) {
    uint256 totalAssets = vault.totalAssets();
    uint256 lastTotal = lastTotalAssets[collateral];
    if (totalAssets > lastTotal) {
        unchecked {
            revenue = totalAssets - lastTotal;
        }
    }
}
```

```solidity
function _realizeRevenue(address collateral, IERC4626 vault) internal {
    uint256 newRevenue = _computeNewRevenue(collateral, vault);
    if (newRevenue > 0) pendingRevenue[collateral] += newRevenue;
}
```

### Revenue withdrawal
When revenue is withdrawn:
```solidity
function withdrawRevenue(address collateral, uint256 amount) external nonReentrant notPaused onlyRole(COLLECTOR_ROLE) {
    IERC4626 vault = vaults[collateral];
    if (address(vault) == address(0)) revert CollateralNotSupported();
    
    _realizeRevenue(collateral, vault);
    uint256 totalRevenue = pendingRevenue[collateral];
    
    if (amount > totalRevenue) revert ExceedsPendingRevenue();
    
    IERC20(collateral).safeTransfer(msg.sender, amount);
    unchecked {
        pendingRevenue[collateral] = totalRevenue - amount;
    }
    
    lastTotalAssets[collateral] = vault.totalAssets();
    emit RevenueWithdraw(collateral, amount);
}
```

### Key behavior
The key behavior is that `_computeNewRevenue` only returns a positive value when `totalAssets > lastTotal`. If `totalAssets < lastTotal` (the vault has suffered a loss), `_computeNewRevenue` returns 0 and `_realizeRevenue` makes no adjustment. As a result, `pendingRevenue` is never reduced when the strategy loses funds.

### Concrete scenario
1. Initially, `lastTotalAssets[collateral] = 100` and `pendingRevenue[collateral] = 0`.
2. The underlying vault appreciates to `totalAssets = 120`. On the next management action, `_realizeRevenue` observes `120 > 100` and adds `20` to `pendingRevenue`. `lastTotalAssets` is updated to `120`. At this point, net yield is `+20`, and `pendingRevenue = 20` is consistent.
3. Later, the strategy loses `15`; `vault.totalAssets()` drops to `105` while `lastTotalAssets[collateral]` remains `120`. `pendingRevenue[collateral]` is still `20`; the previously booked revenue is not reduced, even though net yield is now only `+5`.
4. A call to `withdrawRevenue(collateral, 20)` triggers `_realizeRevenue`, which now sees `totalAssets = 105` and `lastTotal = 120`. Since `totalAssets` is lower, `_computeNewRevenue` returns `0` and `pendingRevenue` remains `20`. The amount `<= pendingRevenue` check passes, and the function transfers `20` units of collateral from the manager's balance to the collector, then zeroes out `pendingRevenue` and updates `lastTotalAssets` to `105`.

In this sequence, the system has only generated net yield of `5`, yet it pays out `20` as “revenue”. The extra `15` must come from collateral that should economically be considered principal backing the asset tokens. This contradicts the intended separation of “collateral backing” versus “revenue” described in the documentation and can lead to over-distribution of yield, under-collateralizing the protocol from the perspective of asset holders. 

In short, `pendingRevenue` tracks the sum of positive increments in totalAssets and ignores negative increments. After losses, it can reflect a number larger than the vault's net performance, enabling revenue withdrawals that eat into principal.

## Recommendation
Change the revenue accounting so that `pendingRevenue` represents net, loss-adjusted yield rather than a sum of only positive jumps. When `totalAssets` decreases below `lastTotalAssets[collateral]`, the loss portion should first reduce `pendingRevenue[collateral]` before it is implicitly borne by principal.

One straightforward approach is to fold loss handling into `_realizeRevenue`, for example:
```solidity
function _realizeRevenue(address collateral, IERC4626 vault) internal {
    uint256 totalAssets = vault.totalAssets();
    uint256 lastTotal = lastTotalAssets[collateral];
    if (totalAssets > lastTotal) {
        uint256 gain = totalAssets - lastTotal;
        pendingRevenue[collateral] += gain;
    } else if (totalAssets < lastTotal) {
        uint256 loss = lastTotal - totalAssets;
        uint256 rev = pendingRevenue[collateral];
        pendingRevenue[collateral] = loss >= rev ? 0 : rev - loss;
    }
    lastTotalAssets[collateral] = totalAssets;
}
```

The view function `getRevenue` should mirror this net logic when computing the current pending revenue without changing state. This ensures that, after a strategy loss, the revenue bucket is reduced (and possibly zeroed) before any further revenue withdrawals, preventing principal from being mislabeled and paid out as revenue.

## Acknowledgments
- Tenbin: Fixed in commit d04a30df.
- Spearbit: Fix verified. This commit updates `_getRevenue` to subtract losses from `pendingRevenue` in `CollateralManager.sol`.
