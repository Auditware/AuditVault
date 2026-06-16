---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/vault
  - platform/cyfrin
protocol: "[[Strata]]"
auditors:
  - Dacian
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-06-11-cyfrin-strata-v2.1.md"
genome:
  - "[[reward-accounting]]"
  - "[[logic/state-update]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[redesign-logic]]"
  - "[[blast-radius/single-user]]"
---
# During the yield phase, when using supported vaults, users can't withdraw vault assets they are entitled to

- id: 57016
- impact: HIGH
- protocol: Strata
- reporter: Dacian (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-06-11-cyfrin-strata-v2.1.md

## Summary


This bug report discusses an issue where users are unable to withdraw their vault assets during the yield phase. The bug can be reproduced by depositing funds into a supported vault, triggering the yield phase, and then attempting to withdraw the funds. The recommended solution is to make a call to redeemRequiredBaseAssets if there is not enough balance to fulfill the withdrawal. Alternatively, new supported vaults should not be allowed to be added during the yield phase. The bug has been fixed in the Strata-Money/contracts repository. 

## Details

**Description:** During the yield phase, when using supported vaults, users can't withdraw vault assets they are entitled to.

**Proof of Concept:**
```solidity
function test_yieldPhase_supportedVaults_userCantWithdrawVaultAssets() external {
    // user1 deposits $1000 USDe into the main vault
    uint256 user1AmountInMainVault = 1000e18;
    USDe.mint(user1, user1AmountInMainVault);

    vm.startPrank(user1);
    USDe.approve(address(pUSDe), user1AmountInMainVault);
    uint256 user1MainVaultShares = pUSDe.deposit(user1AmountInMainVault, user1);
    vm.stopPrank();

    assertEq(pUSDe.totalAssets(), user1AmountInMainVault);
    assertEq(pUSDe.balanceOf(user1), user1MainVaultShares);

    // admin triggers yield phase on main vault which stakes all vault's USDe
    pUSDe.startYieldPhase();
    // totalAssets() still returns same amount as it is overridden in pUSDeVault
    assertEq(pUSDe.totalAssets(), user1AmountInMainVault);
    // balanceOf shows pUSDeVault has deposited its USDe in sUSDe
    assertEq(USDe.balanceOf(address(pUSDe)), 0);
    assertEq(USDe.balanceOf(address(sUSDe)), user1AmountInMainVault);

    // create an additional supported ERC4626 vault
    MockERC4626 newSupportedVault = new MockERC4626(USDe);
    pUSDe.addVault(address(newSupportedVault));
    // add eUSDe again since `startYieldPhase` removes it
    pUSDe.addVault(address(eUSDe));

    // verify two additional vaults now suppported
    assertTrue(pUSDe.isAssetSupported(address(eUSDe)));
    assertTrue(pUSDe.isAssetSupported(address(newSupportedVault)));

    // user2 deposits $600 into each vault
    uint256 user2AmountInEachSubVault = 600e18;
    USDe.mint(user2, user2AmountInEachSubVault*2);

    vm.startPrank(user2);
    USDe.approve(address(eUSDe), user2AmountInEachSubVault);
    uint256 user2SubVaultSharesInEach = eUSDe.deposit(user2AmountInEachSubVault, user2);
    USDe.approve(address(newSupportedVault), user2AmountInEachSubVault);
    newSupportedVault.deposit(user2AmountInEachSubVault, user2);
    vm.stopPrank();

    // verify balances correct
    assertEq(eUSDe.totalAssets(), user2AmountInEachSubVault);
    assertEq(newSupportedVault.totalAssets(), user2AmountInEachSubVault);

    // user2 deposits using their shares via MetaVault::deposit
    vm.startPrank(user2);
    eUSDe.approve(address(pUSDe), user2SubVaultSharesInEach);
    pUSDe.deposit(address(eUSDe), user2SubVaultSharesInEach, user2);
    newSupportedVault.approve(address(pUSDe), user2SubVaultSharesInEach);
    pUSDe.deposit(address(newSupportedVault), user2SubVaultSharesInEach, user2);
    vm.stopPrank();

    // verify main vault total assets includes everything
    assertEq(pUSDe.totalAssets(), user1AmountInMainVault + user2AmountInEachSubVault*2);
    // main vault not carrying any USDe balance
    assertEq(USDe.balanceOf(address(pUSDe)), 0);
    // user2 lost their subvault shares
    assertEq(eUSDe.balanceOf(user2), 0);
    assertEq(newSupportedVault.balanceOf(user2), 0);
    // main vault gained the subvault shares
    assertEq(eUSDe.balanceOf(address(pUSDe)), user2SubVaultSharesInEach);
    assertEq(newSupportedVault.balanceOf(address(pUSDe)), user2SubVaultSharesInEach);

    // verify user2 entitled to withdraw their total token amount
    assertEq(pUSDe.maxWithdraw(user2), user2AmountInEachSubVault*2);

    // try and do it, reverts due to insufficient balance
    vm.startPrank(user2);
    vm.expectRevert(); // ERC20InsufficientBalance
    pUSDe.withdraw(user2AmountInEachSubVault*2, user2, user2);

    // try 1 wei more than largest deposit from user 1, fails for same reason
    vm.expectRevert(); // ERC20InsufficientBalance
    pUSDe.withdraw(user1AmountInMainVault+1, user2, user2);

    // can withdraw up to max deposit amount $1000
    pUSDe.withdraw(user1AmountInMainVault, user2, user2);

    // user2 still has $200 left to withdraw
    assertEq(pUSDe.maxWithdraw(user2), 200e18);

    // trying to withdraw it reverts
    vm.expectRevert(); // ERC20InsufficientBalance
    pUSDe.withdraw(200e18, user2, user2);

    // can't withdraw anymore, even trying 1 wei will revert
    vm.expectRevert();
    pUSDe.withdraw(1e18, user2, user2);
}
```

**Recommended Mitigation:** In `pUSDeVault::_withdraw`, inside the yield-phase `if` condition, there should be a call to `redeemRequiredBaseAssets` if there is insufficient `USDe` balance to fulfill the withdrawal.

Alternatively another potential fix is to not allow supported vaults to be added during the yield phase (apart from `sUSDe` which is added when the yield phase is enabled).

**Strata:** Fixed in commit [076d23e](https://github.com/Strata-Money/contracts/commit/076d23e2446ad6780b2c014d66a46e54425a8769#diff-34cf784187ffa876f573d51b705940947bc06ec85f8c303c1b16a4759f59524eR190) by no longer allowing adding new supporting vaults during the yield phase.

**Cyfrin:** Verified.

\clearpage
