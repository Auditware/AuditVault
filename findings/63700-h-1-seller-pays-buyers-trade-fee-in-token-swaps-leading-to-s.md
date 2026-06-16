---
tags:
  - lang/solidity
  - sector/dex
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Index Fun]]"
auditors:
  - "[[0rpse]]"
  - "[[0xDaniel_eth]]"
  - "[[0xDjango]]"
  - "[[0xaxaxa]]"
  - "[[0xdoichantran]]"
  - "[[0xeix]]"
  - "[[0xpiken]]"
  - "[[AlexCzm]]"
  - "[[Arav]]"
  - "[[Artur]]"
  - "[[Atharv]]"
  - "[[Cybrid]]"
  - "[[Dustykid]]"
  - "[[ExtraCaterpillar]]"
  - "[[Falendar]]"
  - "[[GambitMove]]"
  - "[[Icon_0x]]"
  - "[[JohnTPark24]]"
  - "[[KrisRenZo]]"
  - "[[Mishkat6451]]"
  - "[[Olugbenga-ayo]]"
  - "[[Orhukl]]"
  - "[[OxNoble]]"
  - "[[PUSH0]]"
  - "[[RajeshKotaru]]"
  - "[[Valy001]]"
  - "[[Yaneca_b]]"
  - "[[Yanx]]"
  - "[[amar]]"
  - "[[anchabadze]]"
  - "[[blockace]]"
  - "[[covey0x07]]"
  - "[[curly]]"
  - "[[curly11]]"
  - "[[dan__vinci]]"
  - "[[dimulski]]"
  - "[[dray]]"
  - "[[eLSeR17]]"
  - "[[elolpuer]]"
  - "[[fresh]]"
  - "[[gneiss]]"
  - "[[heeze]]"
  - "[[hrmneffdii]]"
  - "[[hyuunn]]"
  - "[[ke1caM]]"
  - "[[kovacs7]]"
  - "[[resosiloris]]"
  - "[[shieldrey]]"
  - "[[silver_eth]]"
  - "[[songyuqi]]"
  - "[[thimthor]]"
  - "[[tobi0x18]]"
  - "[[typicalHuman]]"
report: "https://github.com/sherlock-audit/2025-10-index-fun-order-book-contest-judging"
genome:
  - "[[fee-manipulation]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
---
# H-1: Seller Pays Buyer's Trade Fee in Token Swaps, Leading to Systematic Theft of Funds

- id: 63700
- impact: HIGH
- protocol: [[Index Fun]] Order Book
- reporter: curly11 (Sherlock)
- source: N/A

## Summary


Summary:

The bug report identifies an issue in the token swap settlement logic of the protocol, where the buyer's trade fee is incorrectly deducted from the seller's proceeds instead of being charged as an additional cost. This results in a direct loss of funds for sellers in token swap trades. The root cause is traced to incorrect implementation in the `MarketController.sol` file. The report also explains the attack path and impact of the bug, and suggests a fix to mitigate the issue. The protocol team has addressed the bug in a recent commit.

## Details


Source: https://github.com/sherlock-audit/2025-10-index-fun-order-book-contest-judging/issues/60 

## Found by 
0rpse, 0xDaniel\_eth, 0xDjango, 0xaxaxa, 0xdoichantran, 0xeix, 0xpiken, AlexCzm, Arav, Artur, Atharv, Cybrid, Dustykid, ExtraCaterpillar, Falendar, GambitMove, Icon\_0x, JohnTPark24, KrisRenZo, Mishkat6451, Olugbenga-ayo, Orhukl, OxNoble, PUSH0, RajeshKotaru, Valy001, Yaneca\_b, Yanx, amar, anchabadze, blockace, covey0x07, curly, curly11, dan\_\_vinci, dimulski, dray, eLSeR17, elolpuer, fresh, gneiss, heeze, hrmneffdii, hyuunn, ke1caM, kovacs7, resosiloris, shieldrey, silver\_eth, songyuqi, thimthor, tobi0x18, typicalHuman

### Summary

The inconsistent fee deduction logic in token swap settlement will cause a direct loss of funds for sellers as buyers execute token swap trades where the buyer's trade fee is deducted from the seller's proceeds instead of being charged as an additional cost to the buyer.

### Root Cause

In `MarketController.sol` (both `_executeTokenSwap` and `_executeAgainstMatcher` [functions](https://github.com/sherlock-audit/2025-10-index-fun-order-book-contest/blob/main/orderbook-solidity/src/Market/MarketController.sol#L911-L914)), the buyer's trade fee is incorrectly deducted from the payment amount before transferring to the seller:

```solidity
uint256 buyerFeeRate = _getEffectiveTradeFeeRate(buyOrder.user);
uint256 tradeFee = (paymentAmount * buyerFeeRate) / 10000;
uint256 netPayment = paymentAmount - tradeFee;  //  Bug: Fee deducted from seller's proceeds

vault.transferBetweenUsers(conditionId, buyOrder.user, treasury, tradeFee);
vault.transferBetweenUsers(conditionId, buyOrder.user, sellOrder.user, netPayment); // Seller receives reduced amount
```

This contradicts the correct implementation in `_executeJITMinting`  where each party pays their own fee as an additional cost:
```solidity
uint256 buyerFee = (buyerPayment * buyerFeeRate) / 10000;
uint256 sellerFee = (sellerPayment * sellerFeeRate) / 10000;

vault.lockCollateral(conditionId, buyOrder.user, buyerPayment);
vault.lockCollateral(conditionId, sellOrder.user, sellerPayment);

// Fees are ADDITIONAL transfers, not deducted from payments
vault.transferBetweenUsers(conditionId, buyOrder.user, treasury, buyerFee);
vault.transferBetweenUsers(conditionId, sellOrder.user, treasury, sellerFee);
```

### Internal Pre-conditions

1. Market needs to have been created with valid outcomes and configuration
2. Seller needs to hold tokens (balance >= order amount) to trigger token swap settlement mode instead of JIT minting
3. Buyer needs to have sufficient collateral balance to cover the payment amount (but NOT payment + fee)
4. Trade fee rate needs to be greater than 0 (either default `tradeFeeRate` or custom `userTradeFeeRate[buyer]`)

### External Pre-conditions

None - this bug occurs in all token swap trades regardless of external conditions.


### Attack Path

1. Attacker (Alice) creates a custom account with a high trade fee rate (e.g., 10% = 1000 basis points) by having the protocol owner/matcher call `setUserTradeFeeRate(alice, 1000)`
2. Victim (Bob) lists sell order for 1000 YES tokens at 60% price ($600) expecting to receive $600
3. Attacker (Alice) submits matching buy order at 60%
4. System executes token swap via `_executeTokenSwap`:

- paymentAmount = 1000 * 6000 / 10000 = 600
- tradeFee = 600 * 1000 / 10000 = 60 (Alice's 10% fee)
- netPayment = 600 - 60 = 540

5. System transfers:

- $60 from Alice to treasury (fee)
- $540 from Alice to Bob (payment)


6. Alice's total cost: $60 + $540 = $600 (should be $660)
7. Bob receives: $540 (should be $600)
8. **Bob loses $60 which effectively paid Alice's trade fee**

Note: While step 1 requires admin action, the core bug affects ALL token swap trades. Even with standard 1% fees, sellers lose 1% of their expected proceeds. The 10% example simply amplifies the impact.

### Impact

Sellers in token swap trades suffer a direct loss equal to the buyer's trade fee rate multiplied by the agreed payment amount.
Examples:

- With 1% default fee: Seller expecting $600 receives $594 (loses $6 = 1%)
- With 5% custom fee: Seller expecting $600 receives $570 (loses $30 = 5%)
- With 10% fee: Seller expecting $600 receives $540 (loses $60 = 10%)

Economic Impact:

- Buyers pay the correct total amount but sellers subsidize the buyer's fee
- Creates inconsistency: In JIT minting, buyer pays 606 total (600 + 6 fee), but in token swaps, buyer pays only 600 total for same position
- Market makers and liquidity providers (who primarily use token swaps) are systematically drained
- Creates perverse incentive for buyers to prefer token swaps over JIT minting (cheaper by the fee amount)

Affected Parties:

- All sellers in `_executeTokenSwap` trades
- All user sellers in `_executeAgainstMatche`r when selling to matchers
- Matchers when selling to users in `_executeAgainstMatcher`

### PoC

_No response_

### Mitigation

Modify `_executeTokenSwap` and `_executeAgainstMatcher` to charge fees as additional costs (matching JIT Minting logic):

```diff
function _executeTokenSwap(
    bytes32 conditionId,
    IMarketController.Order calldata buyOrder,
    IMarketController.Order calldata sellOrder,
    uint256 fillAmount,
    uint256 tokenId
) internal {
    uint256 paymentAmount = (fillAmount * sellOrder.price) / 10000;
    
    uint256 buyerFeeRate = _getEffectiveTradeFeeRate(buyOrder.user);
    uint256 tradeFee = (paymentAmount * buyerFeeRate) / 10000;
-   uint256 netPayment = paymentAmount - tradeFee;
    
    positionTokens.burn(sellOrder.user, tokenId, fillAmount);
    uint256[] memory tokenIds = new uint256[](1);
    uint256[] memory amounts = new uint256[](1);
    tokenIds[0] = tokenId;
    amounts[0] = fillAmount;
    positionTokens.mintBatch(buyOrder.user, tokenIds, amounts);
    
    if (tradeFee > 0 && treasury != address(0)) {
        vault.transferBetweenUsers(conditionId, buyOrder.user, treasury, tradeFee);
-       emit TradeFeeCollected(buyOrder.user, buyOrder.questionId, tradeFee, netPayment);
+       emit TradeFeeCollected(buyOrder.user, buyOrder.questionId, tradeFee, paymentAmount);
    }
-   else {
-       netPayment = paymentAmount;
-   }
    
-   vault.transferBetweenUsers(conditionId, buyOrder.user, sellOrder.user, netPayment);
+   vault.transferBetweenUsers(conditionId, buyOrder.user, sellOrder.user, paymentAmount);
}
```

Apply the same fix to `_executeAgainstMatcher` for both buy and sell branches. This ensures:

Buyer pays: `paymentAmount + tradeFee` (consistent with JIT Minting)
Seller receives: `paymentAmount` (full agreed price)
Treasury receives: `tradeFee` (from buyer's funds, not seller's)

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/index-fun/orderbook-solidity/pull/51
