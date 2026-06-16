---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/lending
protocol: "[[HoldeFi]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/holdefi-audit/"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H02] Markets are not being properly removed from the markets list

- id: 10935
- impact: HIGH
- protocol: [[HoldeFi]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/holdefi-audit/

## Summary


This bug report is regarding the HoldefiSettings contract in the Holdefi repository. This contract has two data structures, marketsList and marketAssets, which track markets and their properties, respectively. The bug is that the removeMarket function does not remove a market from both the data structures, only setting it as not active in the Market struct. This can lead to undesired manipulation of collaterals of a borrower in a specific market, generating market debts for inactive collaterals in that market, and updating the promotion reserve and therefore update a market’s supply index for a specific collateral in an inactive market. It can also be confusing for the end-users.

The suggested solutions for this bug are to rename the removeMarket function to deactivateMarket, to make its behavior clear. On all the functions that query marketsList, consider checking if the market is inactive. If the function supports or requires to take into account inactive markets, consider clearly documenting this. Alternatively, consider using different state variables to differentiate from active and inactive markets, instead of leaving them in a state that is not clearly defined.

Holdefi’s statement for this issue is that they calculate the borrow-value of each account in the getAccountTotalBorrowValue function, which uses marketsList for calculation. Removing a market from this list would mean that the borrow-value of that token for the users that borrowed it, will not be calculated. They also mentioned that updating the supply index and promotion reserve does not have any bad effect on the platform, and that they do not want their users to lose their tokens. They suggested that if they check whether a market is active or not in the clearDebts function, the platform will have problems and they will not consider the users that borrowed that market before.

## Details

In the [`HoldefiSettings` contract](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol) there are two data structures to track markets: [`marketsList`](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L64) which is an array of addresses, and [`marketAssets`](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L63), which is a mapping that describes the properties of each market. Additionally, there are two functions to manipulate these markets: [the `addMarket` function](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L176) which adds new markets, and [the `removeMarket` function](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L205) which removes an already existent market.


The problem resides in that [the `removeMarket` function](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L205) does not remove a market from both mentioned data structures, as it only sets a given market as not active in [the `Market` struct](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L42), but does not remove it from the [`marketsList` array](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L64). This means that, when the [`getMarketsList`](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L115) function is called, it will list already removed markets, showing them as valid and active markets.


This could lead into [an undesired manipulation of collaterals of a borrower in a specific market](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L415-L424), that could [generate market debts for inactive collaterals in that market](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L422), and could trigger other operations such as [updating the promotion reserve and therefore update a market’s supply index](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L420) for a specific collateral in an inactive market. Also, this behavior of having a removed market that is still active could be confusing for the end-users.


Consider renaming the `removeMarket` function to `deactivateMarket`, to make its behavior clear. On all the functions that query `marketsList` consider checking if the market is inactive. If the function supports or requires to take into account inactive markets, consider clearly documenting this.


Alternatively, consider using different state variables to differentiate from active and inactive markets, instead of leaving them in a state that is not clearly defined.


***Update:** Not fixed. Holdefi’s statement for this issue:*



> We calculate the borrow-value of each account in “getAccountTotalBorrowValue” function. This function is using “marketsList” for calculating the borrow-value. If we remove a market from “marketList”, the borrow-value of that token for the users that borrowed it, will not be calculated.  
> 
> We did not remove the market from “marketList” with awareness.  
> 
> Actually removing market or collateral in Holdefi stops users from depositing new tokens to contract but withdrawing and other functionalities are not changed because we don’t want our users losing their tokens.  
> 
> Also updating the supply index and promotion reserve doesn’t have any bad effect on the platform and these functions are not “sensitive operations“. They just update index or reserve till current time.  
> 
> You suggested that we should check whether a market is active or not in the “clearDebts”. But if we do that, the platform will have problems and we will not consider the users that borrowed that market before.
> 
> 


*We have updated our suggestions to make them clearer.*
