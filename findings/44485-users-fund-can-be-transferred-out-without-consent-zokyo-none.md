---
tags:
  - lang/solidity
  - sector/dex
  - platform/zokyo
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Onchain Trade]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-01-02-Onchain Trade.md"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fee-accounting]]"
  - "[[fot-slippage]]"
---
# User’s fund can be transferred out without consent

- id: 44485
- impact: HIGH
- protocol: [[Onchain Trade]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2023-01-02-Onchain Trade.md

## Summary


This bug report highlights a critical issue in the Swap contract. The function settleFutureProfit can be used by anyone to transfer funds from any user to itself without their consent. This can be exploited by a bot to drain user funds. Additionally, the user does not receive any liquidity tokens in return, making their tokens immovable from the contract. The report recommends fixing the logic in the contract to prevent unauthorized transfers and providing liquidity tokens to users who transfer their own tokens. The bug has been resolved.

## Details

**Severity**: Critical

**Status**: Resolved

**Description**


In contract Swap, the function settleFutureProfit(address token, uint256 amount, address from) can transfer funds from any user to itself. Anyone can call settleFutureProfit(...) with address of any other user who has approved the spender as Swapl and the tokens can be moved without the consent of the user. A bot can also monitor the approvals on public networks/mem pools and call settleFutureProfit(...) leading to the draining of user funds.  Also, the user does not get any liquidity token in return, making the tokens immovable from the contract. 

Step 1: List token in Swap.sol
Step 2: User approves Swap.sol to spend tokens
Step 3: Anyone can call settleFutureProfit(token, amount, address_from_step_2) and transfer tokens of the address from step 2 to Swap.sol.


**Recommendation**: 

Fix the logic in the contract so that no user can transfer tokens of another address and provide liquidity tokens in case the user transfers their own tokens so that tokens can be retrieved.
