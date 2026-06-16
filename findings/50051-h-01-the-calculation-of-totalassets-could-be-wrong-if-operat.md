---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - sector/staking
  - sector/vault
  - platform/code4rena
protocol: "[[Liquid Ron]]"
auditors:
  - 0xvd
report: "https://code4rena.com/reports/2025-01-liquid-ron"
genome:
  - "[[fee-accounting]]"
  - "[[arithmetic/precision-loss]]"
  - "[[data-corruption/accounting-error]]"
  - "[[loss-of-funds/indirect-loss]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# [H-01] The calculation of `totalAssets()` could be wrong if `operatorFeeAmount > 0`, this can cause potential loss for the new depositors

- id: 50051
- impact: HIGH
- protocol: Liquid Ron
- reporter: 0xvd (Code4rena)
- source: https://code4rena.com/reports/2025-01-liquid-ron

## Summary


The Liquid Ron smart contract has a bug that affects the calculation of the total assets in the vault. The fee accumulated by the operator is not properly accounted for and can lead to a decrease in the total assets in circulation. This means that users who withdraw their funds after the operator withdraws the fee will receive less assets than those who withdraw before. This bug has been confirmed and a mitigation has been implemented to fix it.

## Details



[LiquidRon.sol# L293-L295](https://github.com/code-423n4/2025-01-liquid-ron/blob/e4b0b7c256bb2fe73b4a9c945415c3dcc935b61d/src/LiquidRon.sol# L293-L295)
[LiquidRon.sol# L121-L126](https://github.com/code-423n4/2025-01-liquid-ron/blob/e4b0b7c256bb2fe73b4a9c945415c3dcc935b61d/src/LiquidRon.sol# L121-L126)

### Description

The fee accumulated by operator is stored in `operatorFeeAmount`. The amount is directly recorded based on the number of actual assets accumulated, not the portion of shares. The problem is, this fee is stored in the vault contract as WRON token balance together with the assets deposited by the users.

Because the calculation of `totalAssets()` will also depend on the WRON token balance owned by the vault contract, the fee withdrawn by the operator can decrease the total assets in circulation. It means that the users who withdraw their funds after the operator withdraw the fee will receive less assets than the users who withdraw before the fee withdrawal.

### Impact

Potential assets loss for the users who withdraw funds after operator withdraw the fee.

### Proof of Concept

To make things clear here, let’s consider the following scenario. To make the scenario easier, just assume there is enough balance for the new user to withdraw.

1. The operator call `harvest()`. This will increase WRON balance owned by the vault and also increase `operatorFeeAmount`.
2. A new user deposit assets and receive shares. The calculation of `totalAssets()` will include the amount of operator’s fee.
3. The operator withdraw the fee by calling `fetchOperatorFee()` function.
4. The new user withdraw his funds by calling `redeem()`. Now the user receives less assets because the calculation of `totalAssets()` will be based on the new WRON balance after fee withdrawal.

The detailed example:

**Initial state:**
```

totalBalance = 10000 // balance in all (vault, staked, rewards)
totalShares = s // just assume it is a variable `s` to make the calculation easier
operatorFeeAmount = 0
```

**Operator call `harvest()`:**

The state of vault now:
```

totalBalance = 10000 // the total balance is not changed, just the form is changed from rewards into actual WRON
totalShares = s
operatorFeeAmount = 10 // let's assume the operator get 10 units as fee
```

**New user deposit 100 units:**

The number of shares received by the new user:

`userShares = (100*totalShares)/totalBalance`
`userShares = (100*s)/10000`
`userShares = (1/100)s`

The step above will increase the `totalShares`.

The state of vault now:
```

totalBalance = 10100 // including the deposit by new user
totalShares = s + s/100
operatorFeeAmount = 10
```

**Operator withdraws the fee:**

The state of vault now:
```

totalBalance = 10090 // total balance is decreased by 10 as operator withdraw the fee
totalShares = s + s/100
operatorFeeAmount = 0
```

**The user withdraw his funds:**

The assets received by the new user will be:

`userAsset = (userShares*totalBalance)/totalShares`
`userAsset = ((s/100) * 10090)/(s + (s/100))`
`userAsset = ((s/100) * 10090)/((101/100)s)`
`userAsset = 10090/101`
`userAsset = 99.9`

After withdrawal, the new user will receive 99.9 units. The new user loss `0.1` units.

**POC Code**

Copy the POC code below to `LiquidRonTest` contract in `test/LiquidRon.t.sol` and then run the test.
```

function test_withdraw_new_user() public {
        address user1 = address(0xf1);
        address user2 = address(0xf2);

        uint256 amount = 100000 ether;
        vm.deal(user1, amount);
        vm.deal(user2, amount);

        vm.prank(user1);
        liquidRon.deposit{value: amount}();

        uint256 delegateAmount = amount / 7;
        uint256[] memory amounts = new uint256[](5);
        for (uint256 i = 0; i < 5; i++) {
            amounts[i] = delegateAmount;
        }
        liquidRon.delegateAmount(0, amounts, consensusAddrs);

        skip(86400 * 365 + 2 + 1);
        // operator fee before harvest
        assertTrue(liquidRon.operatorFeeAmount() == 0);
        liquidRon.harvest(0, consensusAddrs);
        // operator fee after harvest
        assertTrue(liquidRon.operatorFeeAmount() > 0);

        // new user deposit
        vm.prank(user2);
        liquidRon.deposit{value: amount}();
        uint256 user2Shares = liquidRon.balanceOf(user2);
        uint256 expectedRedeemAmount = liquidRon.previewRedeem(user2Shares);

        // fee withdrawal by operator
        liquidRon.fetchOperatorFee();
        assertTrue(liquidRon.operatorFeeAmount() == 0);

        // user2 redeem all his shares
        vm.prank(user2);
        liquidRon.redeem(user2Shares, user2, user2);

        console.log(user2.balance);
        console.log(expectedRedeemAmount);
        assertTrue(user2.balance == expectedRedeemAmount);
    }
```

Based on the POC code above, the last assertion `assertTrue(user2.balance == expectedRedeemAmount);` will fail because the amount withdrawn is not equal to the expected withdrawn.

### Recommended Mitigation Steps

Change the formula that calculate `totalAssets()` to include `operatorFeeAmount` to subtract the total balance.
```

function totalAssets() public view override returns (uint256) {
-        return super.totalAssets() + getTotalStaked() + getTotalRewards();
+        return super.totalAssets() + getTotalStaked() + getTotalRewards() - operatorFeeAmount;
    }
```

**[Owl (Liquid Ron) confirmed and commented via duplicate issue S-174](https://code4rena.com/audits/2025-01-liquid-ron/submissions/S-174):**

> A simpler fix would be to include `operationFeeAmount` in total assets like such:
>
> 
```

>     function totalAssets() public view override returns (uint256) {
>         return super.totalAssets() + getTotalStaked() + getTotalRewards() - operationFeeAmount;
>     }
> 
```

**[0xsomeone (judge) increased severity to High and commented via duplicate issue S-174](https://code4rena.com/audits/2025-01-liquid-ron/submissions/S-174):**

> The finding and its duplicates outline that the accumulated operator fee is factored in total asset calculations despite being meant to be redeemed as a fee.
>
> Apart from contradicting the EIP-4626 standard, it allows the operator fee to be redeemed by users, undervalues deposits made when a non-zero operator fee exists, and abruptly reduces the total assets whenever the operator fee is claimed.
>
> I believe the consistent dilution of all incoming deposits whenever a non-zero operator fee is present to be a significant issue and one that would merit a high severity rating. Specifically:
>
> * The vulnerability is consistently present whenever an operator fee is realized (i.e. `operatorFeeAmount` is non-zero) - Likelihood of High.
> * The impact of the vulnerability is significant as it devalues all incoming user deposits whenever a non-zero fee is present and can also result in the `operatorFeeAmount` becoming irredeemable in extreme circumstances (i.e. total withdrawal of vault) - Impact of Medium.
>
> Combining the likelihood and impact traits above, I believe that a severity level of high is better suited for this issue.

**[Liquid Ron mitigated](https://github.com/code-423n4/2025-02-liquid-ron-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> Add `operatorFeeAmount` in `totalAssets` calculations.

**Status:** Mitigation confirmed. Full details in reports from [Aamir](https://code4rena.com/audits/2025-02-liquid-ron-mitigation-review/submissions/S-1), [0rpse](https://code4rena.com/audits/2025-02-liquid-ron-mitigation-review/submissions/S-32), and [ilchovski](https://code4rena.com/audits/2025-02-liquid-ron-mitigation-review/submissions/S-11).

---


