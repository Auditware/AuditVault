---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/lending
  - sector/token
protocol: "[[HoldeFi]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/holdefi-audit/"
genome:
  - "[[missing-modifier]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[access-roles]]"
  - "[[account-ownership]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# [H03] Users can add non-existent ERC20 tokens into the promotion reserve

- id: 10936
- impact: HIGH
- protocol: [[HoldeFi]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/holdefi-audit/

## Summary


The Holdefi contract is a protocol that allows users to supply assets, add collateral, and borrow other assets based on the collateral power of their account. The depositPromotionReserve function allows any account to deposit ERC20 token assets into the promotion reserve for a particular market. However, the function does not check whether the market the caller is trying to interact with is whitelisted by checking the isActive flag, which enables the possibility to pass any address (except the zero address) as a possible market. This means an attacker could create a new contract that implements a simple transferFrom function that always returns true, bypassing the requirement that checks the output of the real transferFrom function. This would allow the attacker to call the depositPromotionReserveInternal function with a fake market address and number of tokens.

The suggested solutions to this bug are to restrict the call to the whitelisted markets by using the already implemented isActive flag, and to restrict who is able to deposit ERC20 assets into the promotion reserve. Holdefi has stated that they will implement the first suggestion, but that restricting users to deposit into the promotion reserve will not change anything. They also state that updating indexes is not bad for the protocol.

## Details

The [`Holdefi` contract](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol) implements most of the functionalities of the Holdefi’s protocol, such as [the supply of assets](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L160-L181) into the system, [add collateral](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L234-L258), and to [borrow other assets](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L298) based on the collateral power that the account has, among others.


In particular, [the `depositPromotionReserve` function](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L741), allows any account to deposit ERC20 token assets into [the promotion reserve](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L57) for a particular market.


The problem is that [the `depositPromotionReserve` function](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L741) does not check whether the market that the caller is trying to interact with is actually whitelisted by checking [the `isActive` flag](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L43) which enables the possibility to pass any address (except the zero address) as a possible market.


Here, an attacker could create a new contract that implements a simple `transferFrom` function that always returns `true`, so [the requirement that checks the output of the real `transferFrom` function](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L746) can be bypassed. By doing this, the attacker would be calling [the `depositPromotionReserveInternal` function](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L715) with a fake market address and number of tokens.


This last function will later call several other functions from the same and other contracts, such as [the `getCurrentPromotion` function](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L525) and [the `getInterests` function from the `HoldefiSettings` contract](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L100), but because the code also abuses the default zero values in several parts, all checks will be bypassed, including the protections that the usage of [the `SafeMath` library](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/SafeMath.sol) provides, ending up in [writing in storage](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/Holdefi.sol#L733-L737) not only a fake deposited value of the particular ERC20 token market but also it will update the timestamp from when the inexistent assets were deposited, emulating the behavior of a real ERC20 token.


Consider restricting the call to the whitelisted markets by using the already implemented [`isActive` flag](https://github.com/holdefi/Holdefi/blob/f4df394d7cf6df347b1f1e9af8e2676c5933c2c9/contracts/HoldefiSettings.sol#L43), and restricting who is able to deposit ERC20 assets into the promotion reserve.


**Update**: *Not fixed. Holdefi’s statement for this issue:*



> You have 2 suggestions for this issue: 1-implementing isActive flag 2-restricting who is able to deposit ERC20 assets first suggestion is good and we will implement it. But restricting users to deposit into promotion reserve will not change anything. Users can deposit their assets into promotion reserve and it’s good for us. Also updating indexes is not bad for the protocol.
> 
>
