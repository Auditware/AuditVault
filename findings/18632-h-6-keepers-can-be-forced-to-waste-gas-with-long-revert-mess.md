---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - severity/high
  - sector/gaming
  - sector/perpetuals
protocol: "[[GMX]]"
auditors:
  - "[[0xAmanda]]"
  - "[[IllIllI]]"
  - "[[KingNFT]]"
report: "https://github.com/sherlock-audit/2023-02-gmx-judging"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[access-roles]]"
---
# H-6: Keepers can be forced to waste gas with long revert messages

- id: 18632
- impact: HIGH
- protocol: [[GMX]]
- reporter: KingNFT (Sherlock)
- source: N/A

## Summary


This bug report is about a vulnerability found in the GMX-Synthetics project, which is a decentralized protocol for trading synthetic assets. The vulnerability is that malicious users can use the full callbackGasLimit() to create an extremely long revert string. This would use three times the expected amount of gas, since the callback will spend that amount, the fetching of the message during the revert will fetch that much, and the emitting of the same string will fetch that much. As a result, keepers can be forced to spend more gas than they expect to for all operations. This could also be used by a user to game the price impact. The tool used to identify this vulnerability was Manual Review. The recommendation given to fix this vulnerability was to count the gas three times during gas estimation. The fix for this vulnerability was implemented in the commit b0bac262191f4f96edc9606192d2e4abfa043dc3.

## Details

Source: https://github.com/sherlock-audit/2023-02-gmx-judging/issues/141 

## Found by 
0xAmanda, IllIllI, KingNFT

## Summary

Most actions done on behalf of users have a callback triggered on an address provided by the position's account holder. In order to ensure that these callbacks don't affect order execution, they're wrapped in a try-catch block, and the actual external call has a limited amount of gas provided to it. If the callback fails, the revert message is fetched and emitted, before processing continues. Keepers are given a limited gas budget based on estimated amounts of gas expected to be used, including a maximum amount allotted for callbacks via the [`callbackGasLimit()`](https://github.com/sherlock-audit/2023-02-gmx/blob/main/gmx-synthetics/contracts/gas/GasUtils.sol#L175-L194).


## Vulnerability Detail

A malicious user can use the full `callbackGasLimit()` to create an extremely long revert string. This would use three times the expected amount of gas, since the callback will spend that amount, the fetching of the message during the revert will fetch that much, and the emitting of the same string will fetch that much.


## Impact

Keepers can be forced to spend more gas than they expect to for all operations. If they don't have a reliable way of calculating how much gas is used, they'll have spent more gas than they get in return. 

If all keepers are expected to be able to calculate gas fees, then an attacker can submit an order whose happy path execution doesn't revert, but whose failure path reverts with a long string, which would essentially prevent the order from being executed until a more favorable price is reached. The user could, for example, submit an order with a long revert string in the frozen order callback, which would prevent the order from being frozen, and would allow them to [game the price impact](https://github.com/sherlock-audit/2023-02-gmx/blob/main/gmx-synthetics/contracts/exchange/OrderHandler.sol#L256-L261)

## Code Snippet

A single revert message uses gas x3:
```solidity
// File: gmx-synthetics/contracts/callback/CallbackUtils.sol : CallbackUtils.afterOrderCancellation()   #1

127        function afterOrderCancellation(bytes32 key, Order.Props memory order) internal {
128            if (!isValidCallbackContract(order.callbackContract())) { return; }
129    
130 @>         try IOrderCallbackReceiver(order.callbackContract()).afterOrderCancellation{ gas: order.callbackGasLimit() }(key, order) {
131            } catch (bytes memory reasonBytes) {
132 @>             (string memory reason, /* bool hasRevertMessage */) = ErrorUtils.getRevertMessage(reasonBytes);
133 @>             emit AfterOrderCancellationError(key, order, reason, reasonBytes);
134            }
135:       }
```
https://github.com/sherlock-audit/2023-02-gmx/blob/main/gmx-synthetics/contracts/callback/CallbackUtils.sol#L127-L135

## Tool used

Manual Review


## Recommendation

Count the gas three times during gas estimation




## Discussion

**xvi10**

Fix in https://github.com/gmx-io/gmx-synthetics/commit/b0bac262191f4f96edc9606192d2e4abfa043dc3
