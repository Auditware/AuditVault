---
tags:
  - lang/solidity
  - sector/oracle
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/arithmetic/underflow
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Oku'S New Order Types Contract Contest]]"
auditors:
  - "[[t.aksoy]]"
report: "https://github.com/sherlock-audit/2024-11-oku-judging"
genome:
  - "[[underflow]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
  - "[[integer-bounds]]"
  - "[[reentrancy-guard]]"
---
# H-1: Unsafe Type Casting in Token Amount Handling

- id: 44371
- impact: HIGH
- protocol: [[Oku'S New Order Types Contract Contest]]
- reporter: t.aksoy (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue found in the rotocol's handling of token amounts. The contracts use unsafe type casting from uint256 to uint160, which can lead to silent overflow or underflow conditions. This can potentially allow users to create orders with mismatched amounts, leading to fund loss or manipulation of the system. The root cause of this issue is that Solidity 0.8.x does not protect against data loss during type casting. The contracts perform direct casting without validation in several critical functions. An example of this is the `StopLimit::modifyOrder()` function, which takes `uint256 amountIn` as input and casts it to uint160 inside the `handlePermit` function. This can result in the amount becoming very small and the user being able to drain the contract by modifying their order. The user must have enough tokens and be able to interact with the contract's order creation functions for this attack to be successful. The impact of this bug is that the protocol receives fewer tokens than the order amount indicates and the user can modify their order to drain the protocol. To mitigate this issue, the OpenZeppelin SafeCast library should be implemented.

## Details

Source: https://github.com/sherlock-audit/2024-11-oku-judging/issues/64 

## Found by 
bughuntoor, t.aksoy
### Summary

Multiple contracts in the rotocol perform unsafe downcasting from uint256 to uint160 when handling token amounts in Permit2 transfers. This can lead to silent overflow/underflow conditions, potentially allowing users to create orders with mismatched amounts, leading to fund loss or system manipulation.

### Root Cause

While Solidity 0.8.x provides built-in overflow/underflow protection for arithmetic operations, it does not protect against data loss during type casting. The contracts perform direct casting of uint256 to uint160 without validation in several critical functions:

Bracket.sol: procureTokens() , modifyOrder()
StopLimit.sol: createOrder(), modifyOrder()
OracleLess.sol: procureTokens() 

As an example, the `StopLimit::modifyOrder() `function takes `uint256 amountIn` as input. This variable is cast to uint160 inside the handlePermit function. Due to overflow, if the user sets the amount higher than the uint160 limit, the amount would become very small, and the contract would transfer this small amount. When setting orders, it uses amountIn as uint256. As a result, the user creates an order with a high amount but pays very little to the protocol. The user can then drain the contract by modifying their order.


```solidity
    ///@notice see @IStopLimit
    function createOrder(
        uint256 stopLimitPrice,
        uint256 takeProfit,
        uint256 stopPrice,
        uint256 amountIn,
        IERC20 tokenIn,
        IERC20 tokenOut,
        address recipient,
        uint16 feeBips,
        uint16 takeProfitSlippage,
        uint16 stopSlippage,
        uint16 swapSlippage,
        bool swapOnFill,
        bool permit,
        bytes calldata permitPayload
    ) external override nonReentrant {
        if (permit) {
            handlePermit(
                recipient,
                permitPayload,
                uint160(amountIn),
                address(tokenIn)
            );
}

    function handlePermit(
        address owner,
        bytes calldata permitPayload,
        uint160 amount,
        address token
    ) internal {
        Permit2Payload memory payload = abi.decode(
            permitPayload,
            (Permit2Payload)
        );

        permit2.permit(owner, payload.permitSingle, payload.signature);
        permit2.transferFrom(owner, address(this), amount, token);
    }


```

https://github.com/sherlock-audit/2024-11-oku/blob/ee3f781a73d65e33fb452c9a44eb1337c5cfdbd6/oku-custom-order-types/contracts/automatedTrigger/StopLimit.sol#L146



### Internal pre-conditions

_No response_

### External pre-conditions

User must have enough tokens to create an order
Amount must be greater than type(uint160).max
User must be able to interact with the contract's order creation functions

### Attack Path

1. Attacker prepares: maliciousAmount = type(uint160).max + minPosSize;
2. Attacker creates an order with this amount
3. Due to unsafe casting: The order is created with maliciousAmount (full uint256) but only transfers minPosSize
4. User can cancel or modify his order to drain the contract



### Impact

Protocol receives fewer tokens than the order amount indicates and user can modify order to drain the protocol

### PoC

_No response_

### Mitigation

Implement OpenZeppelin's SafeCast library
