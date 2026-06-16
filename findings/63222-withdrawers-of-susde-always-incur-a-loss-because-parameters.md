---
tags:
  - lang/solidity
  - sector/oracle
  - sector/staking
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Strata]]"
auditors:
  - "[[InAllHonesty]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-08-cyfrin-strata-tranches-v2.0.md"
genome:
  - "[[wrong-order]]"
  - "[[indirect-loss]]"
  - "[[use-reentrancy-guard]]"
  - "[[reentrancy-guard]]"
---
# Withdrawers of `sUSDe` always incur a loss because parameters passed from `Tranche::_withdraw` to `CDO::withdraw` are inverted

- id: 63222
- impact: HIGH
- protocol: [[Strata]] Tranches
- reporter: InAllHonesty (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-08-cyfrin-strata-tranches-v2.0.md

## Summary


Bug report: Users can withdraw either `sUSDe` or `USDe` from the system, but there is an issue with the calculations and order of parameters when withdrawing `sUSDe`. This results in users receiving less `sUSDe` than they requested and losing value in `USDe`. The bug has been fixed by correcting the order of parameters in the code. 

## Details

**Description:** Users can choose to withdraw either `sUSDe` or `USDe`. The system is in charge of making the proper calculations to determine how much `USDe` value will be withdrawn based on the requested asset and the `tokenAmount` of such an asset. Based on the calculated `USDe` value being withdrawn, the system burns the required `TrancheShares` for that amount of `USDe` being withdrawn from the system.

This issue reports a problem in which the `Tranche::_withdraw` passes two parameters in the inverse order to the `CDO::withdraw`. These parameters are `baseAssets` and `tokenAssets`.
The CDO expects to receive `tokenAssets` first and then `baseAssets`, but the Tranche passes `baseAssets` first and then `tokenAssets`.
  - The parameters in the inverse order make the system do calculations with the wrong amounts, resulting (on the `Strategy` contract) that the amount of `sUSDe` to release to the user is way lower than what it should be (especially when the `sUSDe <=> USDe` rate is high.

```solidity
// Tranche::_withdraw() //
    function _withdraw(
        address token,
        address caller,
        address receiver,
        address owner,
        uint256 baseAssets,
        uint256 tokenAssets,
        uint256 shares
    ) internal virtual {
        ...
//@audit => Burn Trancheshares for the full requested sUSDe
@>      _burn(owner, shares);

//@audit-issue => Sends baseAssets first and then tokenAssets
@>      cdo.withdraw(address(this), token, baseAssets, tokenAssets, receiver);
        ...
    }

// StrataCDO::withdraw() //
    function withdraw(address tranche, address token, uint256 tokenAmount, uint256 baseAssets, address receiver) external onlyTranche nonReentrant {
        ...
//@audit => Because of the inverted parameters `tokenAmount` is actually `baseAssets`, and `baseAssets` is actually `tokenAssets`
 @>     strategy.withdraw(tranche, token, tokenAmount, baseAssets, receiver);
        ...
    }

// Strategy::withdraw() //
    function withdraw (address tranche, address token, uint256 tokenAmount, uint256 baseAssets, address receiver) external onlyCDO returns (uint256) {
//@audit => `baseAssets` should represent amount of `USDe` being withdrawn, but, because of the inverted parameters, here represents the actual requested amount of `sUSDe` to withdraw
        uint256 shares = sUSDe.previewWithdraw(baseAssets);
        if (token == address(sUSDe)) {
            uint256 cooldownSeconds = cdo.isJrt (tranche) ? sUSDeCooldownJrt : sUSDeCooldownSrt;
//@audit => transfers calculates `shares` of `sUSDe` to Cooldown to be sent to the user after cooldown.
            erc20Cooldown.transfer(sUSDe, receiver, shares, cooldownSeconds);
            return shares;
        }
        ...
    }
```

**Impact:** Withdrawers will always incur a loss in USDe value because more TrancheShares are burned compared to the received value in USDe terms.

**Proof of Concept:** In the next PoC, it is demonstrated how a user withdrawing sUSDe incurs a loss because he receives fewer sSUDe than the requested amount and the TrancheShares that were burned during the process.

As demonstrated on the next PoC, given a `sUSDe => USDe` rate of 1:1.5.
A user requests to withdraw 100 sUSDe, which are worth 150 USDe
- 150 JRTranche will be burnt
- ERC20Cooldown should receive the requested 100 sUSDe

The withdrawer receives only ~66 `sUSDe`, which can withdraw only 100 `USDe` instead of transferring 100 `sUSDe,` which could withdraw 150 `USDe`

Add the next PoC to `CDO.t.sol` test file:
```solidity
    function test_WithdrawingsUSDECausesLosesForUsers() public {
        address bob = makeAddr("Bob");
        USDe.mint(bob, 1000 ether);
        vm.startPrank(bob);
            //@audit => Bob initializes the exchange rate on sUSDe
            USDe.approve(address(sUSDe), type(uint256).max);
            sUSDe.deposit(1000 ether, bob);
        vm.stopPrank();

        address alice = makeAddr("Alice");
        uint256 initialDeposit = 150 ether;
        USDe.mint(alice, initialDeposit);

        //@audit-info => There are 1k sUSDe in circulation and 1k USDe deposited on the sUSDe contract
        //@audit-info => Exchange Rate is 1:1
        assertEq(USDe.balanceOf(address(sUSDe)), 1000 ether);
        assertEq(sUSDe.totalSupply(), 1000 ether);
        assertEq(sUSDe.convertToAssets(1e18), 1e18);

        // Simulate yield by adding USDe directly to sUSDe contract
        //@audit-info => Set sUSDe exchange rate to USDe (1:1.5)
        USDe.mint(address(sUSDe), 500 ether); // 50% yield
        assertApproxEqAbs(sUSDe.convertToAssets(1e18), 1.5e18, 1e6);

        //@audit-info => Bob deposits sUSDe when sUSDE rate to USDe is 1:1.5
        vm.startPrank(bob);
            sUSDe.approve(address(jrtVault), type(uint256).max);
            jrtVault.deposit(address(sUSDe), 100e18, bob);
            assertApproxEqAbs(jrtVault.balanceOf(bob), 150e18, 1e6);
        vm.stopPrank();

        vm.startPrank(alice);
            //@audit => Alice gets 100 sUSDe by staking 150 USDe
            USDe.approve(address(sUSDe), type(uint256).max);
            sUSDe.deposit(150e18, alice);
            assertApproxEqAbs(sUSDe.balanceOf(alice), 100e18, 1e6);

            //@audit => Alice deposits 100 sUSDe on the JRTranche and gets 150 JRTrancheShares
            sUSDe.approve(address(jrtVault), type(uint256).max);
            jrtVault.deposit(address(sUSDe), 100e18, alice);
            assertApproxEqAbs(jrtVault.balanceOf(alice), 150e18, 1e6);
            assertEq(sUSDe.balanceOf(alice), 0);

            //@audit-info => Requests to withdraw 100e18 sUSDe which are worth 150 USDe
            uint256 expected_sUSDeWithdrawn = 100e18;
            uint256 expected_USDe_valueWithdrawn = sUSDe.convertToAssets(expected_sUSDeWithdrawn);

            //@audit-issue => Alice withdraws 100 sUSDe but gets only ~66.6 sUSDe, all her JRTrancheShares are burnt
            jrtVault.withdraw(address(sUSDe), expected_sUSDeWithdrawn, alice, alice);
            uint256 alice_actual_sUSDeBalance = sUSDe.balanceOf(alice);
            uint256 alice_USDe_actualWithdrawn = sUSDe.convertToAssets(alice_actual_sUSDeBalance);

            assertEq(jrtVault.balanceOf(alice), 0);
            assertApproxEqAbs(alice_actual_sUSDeBalance, 66.5e18, 1e18);

            console2.log("Alice expected withdrawn sUSDe: ", expected_sUSDeWithdrawn);
            console2.log("Alice actual withdrawn sUSDe: ", alice_actual_sUSDeBalance);
            console2.log("====");
            console2.log("Alice expected withdrawn USDe value: ", expected_USDe_valueWithdrawn);
            console2.log("Alice actual withdrawn USDe value: ", alice_USDe_actualWithdrawn);
        vm.stopPrank();
    }
```

**Recommended Mitigation:** On the `Tranche::_withdraw`, make sure to pass the parameters in the correct order when calling the `CDO::withdraw`
```diff
    function _withdraw(
        address token,
        address caller,
        address receiver,
        address owner,
        uint256 baseAssets,
        uint256 tokenAssets,
        uint256 shares
    ) internal virtual {
        ...
-       cdo.withdraw(address(this), token, baseAssets, tokenAssets, receiver);
+       cdo.withdraw(address(this), token, tokenAssets, baseAssets, receiver);

    }

```

**Strata:**
Fixed in commit [31d9b72](https://github.com/Strata-Money/contracts-tranches/commit/31d9b7248073652ce28d579d4511d5b93414c6be) by passing the parameters in the correct order.

**Cyfrin:** Verified.

\clearpage
