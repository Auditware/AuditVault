---
tags:
  - lang/solidity
  - sector/lending
  - sector/options
  - sector/staking
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/reentrancy/cross-contract
  - vuln/reentrancy/single-function
  - impact/loss-of-funds/direct-drain
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Panoptic]]"
auditors:
  - "[[qed]]"
report: "https://code4rena.com/reports/2025-12-panoptic-next-core"
genome:
  - "[[cross-contract]]"
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[liquidation-underwater]]"
  - "[[reentrancy-guard]]"
  - "[[vote-delegation-loop]]"
---
# [H-02] Cross-contract reentrancy in liquidation enables conversion of phantom shares to real shares, draining `CollateralTracker` assets

- id: 65026
- impact: HIGH
- protocol: [[Panoptic]]
- reporter: qed (Code4rena)
- source: https://code4rena.com/reports/2025-12-panoptic-next-core

## Summary


This bug report concerns a vulnerability in the `CollateralTracker.sol` contract, specifically in lines 1359-1360. This vulnerability allows a malicious user to exploit a reentrancy issue during the liquidation process, resulting in the loss of funds from the `CollateralTracker` and causing a catastrophic loss for liquidity providers.

The root cause of this vulnerability is a combination of three behaviors in the protocol: inconsistent revocation timing, an unsafe external call, and an accounting flaw. These issues allow the attacker to transfer "phantom shares" (virtual liquidity used for solvency checks) and convert them into real, redeemable shares.

The code analysis shows that the vulnerability is triggered by an external call in the `settleLiquidation` function of `CollateralTracker`, which opens a reentrancy window. This window is exploited during the sequential settlement process in `PanopticPool`, where the attacker can transfer the phantom shares. The validation step in `CollateralTracker` then incorrectly compensates for the missing shares, resulting in the attacker being able to redeem the underlying assets.

A proof of concept has been provided to demonstrate this vulnerability, and three recommended mitigation steps have been suggested. These include adding a reentrancy guard, restricting phantom share transfers, or moving the ETH refund logic.

The report concludes by stating that the vulnerability has been mitigated by the project team and provides links to reports from other auditors confirming this. 

## Details



`CollateralTracker.sol` [L1359-L1360](https://github.com/code-423n4/2025-12-panoptic/blob/main/contracts/CollateralTracker.sol# L1359-L1360)

### Impact

A malicious liquidator can exploit a cross-contract reentrancy vulnerability during the liquidation process to steal “phantom shares” (virtual liquidity used for solvency checks) and convert them into real, redeemable shares. This results in the complete drainage of assets from the `CollateralTracker` (the lending vault), causing a catastrophic loss of funds for liquidity providers.

### Root Cause

The vulnerability stems from the interaction between three specific behaviors in the protocol:

1. **Inconsistent Revocation Timing**: `PanopticPool._liquidate` delegates phantom shares (amount `2^248 - 1`) to the liquidatee on both `token0` and `token1` collateral trackers simultaneously, but revokes them sequentially (`ct0` first, then `ct1`).
2. **Unsafe External Call**: `CollateralTracker.settleLiquidation` performs an external ETH refund call (`SafeTransferLib.safeTransferETH`) to the liquidator *before* the liquidation process is complete for the other token. This opens a reentrancy window.
3. **Accounting Flaw**: The `revoke` logic in `CollateralTracker` assumes any missing phantom shares were “consumed” (burned) by the protocol logic and compensates by increasing `_internalSupply`. It does not account for the possibility that phantom shares were transferred away.

### Code Analysis

**1. The Trigger: External call in `settleLiquidation`:** In `CollateralTracker.sol`, when `settleLiquidation` is called with a non-negative bonus, it refunds any provided `msg.value` to the caller. This external call passes control to the attacker.
```

contracts/CollateralTracker.sol:

// In settleLiquidation:
} else {
    // ... (logic to revoke phantom shares for THIS tracker) ...

    // @audit-issue The external call here happens while OTHER trackers might still have active phantom shares
    if (msg.value > 0) SafeTransferLib.safeTransferETH(liquidator, msg.value);
}
```

**2. The Window: Sequential settlement in `PanopticPool`:** In `PanopticPool.sol`, settlements happen sequentially. When `ct0.settleLiquidation` is called, `ct1`’s phantom shares are active (delegated) but not yet revoked.
```

contracts/PanopticPool.sol:

// In _liquidate:
// ... Phantom shares delegated to liquidatee on both tokens ...

// 1. Settle token0 (Triggers ETH refund -> Reentrancy)
collateralToken0().settleLiquidation{value: msg.value}(...);

// 2. Settle token1 (Has not happened yet when reentrancy occurs)
collateralToken1().settleLiquidation(...);
```

**3. The Exploit: Transferring phantom shares:** During the reentrancy callback, the attacker calls `ct1.transferFrom`. The only check in `transferFrom` is `numberOfLegs == 0`. Since `_liquidate` burns positions before settlement, this check passes.
```

contracts/CollateralTracker.sol:

function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
    // ...
    // @audit-issue This check passes during liquidation
    if (panopticPool().numberOfLegs(from) != 0) revert Errors.PositionCountNotZero();

    // @audit-issue Standard ERC20 transfer moves phantom shares without checks
    return ERC20Minimal.transferFrom(from, to, amount);
}
```

**4. The Validation: Incorrect supply compensation:** When control returns to `PanopticPool` and `ct1.settleLiquidation` is finally called, it calls `revoke`. Since the liquidatee’s balance is now 0 (shares were transferred), the logic assumes they were consumed and validates them by increasing `_internalSupply`.
```

contracts/CollateralTracker.sol:

function revoke(address delegatee) external onlyPanopticPool {
    uint256 balance = balanceOf[delegatee];
    if (type(uint248).max > balance) {
        // @audit-issue Logic assumes missing shares were burned, permanently minting them
        _internalSupply += type(uint248).max - balance;
        balanceOf[delegatee] = 0;
    }
    // ...
}
```

### Proof of Concept

A comprehensive Foundry test case demonstrates this vulnerability. The PoC performs the following steps:

1. Sets up a pool with liquidity in `token1`.
2. Creates a malicious liquidator contract.
3. Triggers liquidation with `msg.value = 1 wei` to force the ETH refund path.
4. In the `receive()` fallback, the liquidator transfers `ct1` phantom shares from the liquidatee to itself.
5. After liquidation completes, the liquidator holds valid shares and redeems them for the underlying assets.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-12-panoptic-next-core/submissions/S-195)

### Recommended mitigation steps

**Option 1: Reentrancy guard (Recommended):** Add a `nonReentrant` modifier to `CollateralTracker.settleLiquidation` to prevent re-entering the contract or other trackers during the settlement process.

**Option 2: Restrict phantom share transfers:** Modify `CollateralTracker.transferFrom` (and `transfer`) to explicitly forbid transferring shares if the balance indicates the presence of phantom shares.
```

function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
+   // Prevent moving phantom shares
+   if (balanceOf[from] > type(uint248).max) revert Errors.PhantomSharesAreNotTransferable();

    _accrueInterest(from, IS_NOT_DEPOSIT);
    if (panopticPool().numberOfLegs(from) != 0) revert Errors.PositionCountNotZero();
    return ERC20Minimal.transferFrom(from, to, amount);
}
```

**Option 3: Move ETH refund:** Move the ETH refund logic out of `CollateralTracker` and into `PanopticPool._liquidate` (specifically, at the very end of the function), ensuring all settlements and revocations are complete before making external calls.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-12-panoptic-next-core/submissions/S-195)

**[Panoptic mitigated](https://github.com/code-423n4/2026-02-panoptic-next-core-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> Enhance reentrancy protection and add protocol loss tracking.

**Status:** Mitigation confirmed. Full details in reports from [Valves](https://code4rena.com/audits/2026-02-panoptic-next-core-mitigation-review/submissions/S-2), [edoscoba](https://code4rena.com/audits/2026-02-panoptic-next-core-mitigation-review/submissions/S-17), and [Nyx](https://code4rena.com/audits/2026-02-panoptic-next-core-mitigation-review/submissions/S-44).

---
