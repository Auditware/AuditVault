---
tags:
  - lang/solidity
  - sector/token
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Render Network]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/rndr-token-transfer-audit-74b21356b849/"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[reward-theft]]"
  - "[[integer-bounds]]"
---
# Unsafe arithmetic operations in Airdrop contract

- id: 11879
- impact: HIGH
- protocol: [[Render Network]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/rndr-token-transfer-audit-74b21356b849/

## Summary


The Airdrop contract contains a series of arithmetic operations which are not being addressed with caution. This can lead to attempts to store numbers outside the range of the data types of their target variables, resulting in integer overflows/underflows. 

The first case is related to an assignment to a storage variable inside a loop in the addManyUsers function. This function iterates through a _recipients array of addresses and a paired _amounts array of uint256‘s. If an extremely large list of users and amounts is used, the variable totalBonus may reach its maximum possible value and finally overflow, resulting in an inconsistency between the total bonus sum and each user’s bonus amount.

The second case involves an unsafe math operation in the payManyUsers function which could lead to an integer underflow. If 0 is passed as the value of the batchSize variable, the unsigned variable idTo would be assigned the result of the operation 0 + 0 – 1, resulting in an underflow and a stored value of 2²⁵⁶ -1.

To avoid underflows/overflows when doing mathematical operations, consider using the OpenZeppelin's SafeMath library. The library is now being used throughout.

## Details

The `Airdrop` contract contains a series of arithmetic operations which are not being addressed with caution (in lines [30](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L30) , [39](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L39) , [56](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L56) , [58](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L58) , [64](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L64) and [65](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L65) ) , leading to attempts to store numbers outside the range of the data types of their target variables. There are in particular two situations which could potentially cause integer overflows/underflows.


The first case is related to an assignment to a storage variable inside a loop in the [`addManyUsers`](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L45) function. This function iterates through a `_recipients`array of `addresses` and a paired `_amounts` array of `uint256`‘s. In each iteration, the function [`addUser`](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L27) is called, which adds the respective user amount to the storage variable `totalBonus`, in charge of accumulating the sum. For an extremely large list of users and amounts, the variable `totalBonus` may reach its maximum possible value and finally overflow (*i.e.* start again from 0). In this scenario, an inconsistency between the total bonus sum and each user’s bonus amount would be reached.


In the second case, an unsafe math operation in the [`payManyUsers`](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L61) function could lead to an integer underflow. After the contract is deployed, the storage variable [`nextUserToBePaid`](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L11) equals 0. When calling [`payManyUsers`](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L61) , if 0 was passed as the value of the `batchSize` variable (or the function was externally called without parameters) , the unsigned variable `idTo` would be assigned the result of the operation 0 + 0 – 1, resulting in an underflow and a stored value of 2²⁵⁶ – – While in this case the [immediately followin](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L65)  [`if`](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L65) [`clause`](https://github.com/jeualvarez/Token-Airdrop/blob/d96202acf6fb5d0305368bac36aa960d455cbffe/contracts/Airdrop.sol#L65) would prevent something unexpected to happen, this approach is error-prone and not advised.


Consider using [OpenZeppelin’s](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/v1.12.0/contracts/math/SafeMath.sol)  [`SafeMath`](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/v1.12.0/contracts/math/SafeMath.sol) library to avoid underflows/overflows when doing mathematical operations.


***Update:** the `SafeMath` library is now being used throughout.*
