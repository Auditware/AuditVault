---
tags:
  - lang/solidity
  - sector/token
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - impact/mev/frontrun
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[1Inch]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/1inch/Fee%20Collector/README.md#1-transactions-frontrunning"
genome:
  - "[[fee-calculation]]"
  - "[[frontrun]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
  - "[[frontrun-exposure]]"
---
# Transactions frontrunning

- id: 28345
- impact: HIGH
- protocol: [[1Inch]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/1inch/Fee%20Collector/README.md#1-transactions-frontrunning

## Summary


A bug report has been submitted regarding an error in calculation in the code of the 1inch fee-collector repository. The code in question is located in line 360 of the FeeCollector.sol file. The calculation of the returnAmount is not accurate, as it is fixed for the entire tokenBalance rather than for each unit. This error can be exploited by attackers to gain a profit. 

Two examples have been provided to demonstrate the issue. In the first example, an attacker is able to purchase 10 WETH for a price of 100 1Inch, when the current price is much lower. This results in the attacker gaining a profit of 1.4 WETH, while the user who was meant to buy the 10 WETH only receives 8.6 WETH. In the second example, two users attempt to purchase 5 WETH each at a price of 50 1Inch. The first user is successful, however the second user does not receive the 5 WETH, and the 1Inch is not returned to the original user.

The recommendation is to implement a correct returnAmount calculation. This will ensure that the calculations are accurate and that attackers are not able to exploit the code for their own profit.

## Details

##### Description
The code in this line contains an error in calculation
in line: https://github.com/1inch/fee-collector/blob/3c2626763fd829500496f15476d5e98fbdf4f574/contracts/FeeCollector.sol#L360

`uint256 returnAmount = amount * tokenBalance / value(erc20);`
   
According to the formula, it is fixed price for the rest of  tokenBalance or whole amount, not the price for unit.

*Example:

Someone(something) makes updateReward for 10 WETH - user1
Let's assume now we have minimal price after a long period of time

Current price is 100 Inch for  10 WETH
user2 and user3 are atackers

User4 wants to make a full trade. He wants to buy 10 WETH for 100 1Inch. He wants make a transaction 

attacker puts the next transaction before User4
User2 updateReward with ~101010 WETH
the price is changed
User3 trades after User2 ~101010.mul(price) 
User2 executes trade
attacker has a profit equal ~1.4 WETH

User4 got ~8.6 WETH. 1.4 WETH less that expected*

*Example 2

Let's assume, now we have minimal price after a long period of time
Someone(something) makes updateReward for 10 WETH - user1
Current price is 100 Inch for  10 WETH

User2 and User3 want to make partial trade. They want to buy 5 WETH for 50 1Inch. They make a transaction at approximately the same time


User2 trades first and gets 5 WETH and spends ~50 1Inch. OK
User3 trades after User 2.5WETH  and spends ~50 Inch.  Not correct

User1 never gets his 1Inch because User3 or nobody wants to  make this incorrect transaction

In case User3 makes transaction for 5 WETH and ~spends 100 1Inch, User1 will receive ~2 times more 1Inch than excpected*

##### Recommendation
Implement correct returnAmount calculation
