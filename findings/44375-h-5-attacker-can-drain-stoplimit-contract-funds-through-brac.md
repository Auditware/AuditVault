---
tags:
  - lang/solidity
  - sector/dex
  - sector/token
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/known-pattern
protocol: "[[Oku'S New Order Types Contract Contest]]"
auditors:
  - "[[0xaxaxa]]"
report: "https://github.com/sherlock-audit/2024-11-oku-judging"
genome:
  - "[[missing-modifier]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[fot-slippage]]"
  - "[[integer-bounds]]"
  - "[[reentrancy-guard]]"
---
# H-5: attacker can drain StopLimit contract funds through Bracket contract because it gives type(uint256).max  allowance to bracket contract for input token in performUpkeep function

- id: 44375
- impact: HIGH
- protocol: [[Oku'S New Order Types Contract Contest]]
- reporter: 0xaxaxa (Sherlock)
- source: N/A

## Summary


This bug report discusses a vulnerability found in a contract called "StopLimit". The issue was discovered by a group of individuals and can be exploited by an attacker to drain funds from the contract. The vulnerability is caused by the contract giving unlimited access to another contract called "Bracket" to transfer tokens from the StopLimit contract. This can be exploited by an attacker by creating an order in the Bracket contract and then calling a function in the StopLimit contract that allows the transfer of tokens. This can be done by setting the target address to the token the attacker wants to transfer and providing the necessary transaction data. The impact of this vulnerability is that an attacker can drain almost all of the funds from the StopLimit contract. The team responsible for the contract has fixed this issue in their code. To prevent similar issues in the future, it is recommended that contracts only give specific and limited access to other contracts for token transfers. 

## Details

Source: https://github.com/sherlock-audit/2024-11-oku-judging/issues/700 

## Found by 
0xaxaxa, Contest-Squad, rudhra1749, whitehair0330, xiaoming90
### Summary

performUpkeep::StopLimit function increases allowance of input token for  Bracket contract to type(uint256).max.
https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/StopLimit.sol#L100-L104
```solidity       
 updateApproval(
            address(BRACKET_CONTRACT),
            order.tokenIn,
            order.amountIn
        );
```
https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/StopLimit.sol#L397-L411
```solidity   
 function updateApproval(
        address spender,
        IERC20 token,
        uint256 amount
    ) internal {
        // get current allowance
        uint256 currentAllowance = token.allowance(address(this), spender);
        if (currentAllowance < amount) {
            // amount is a delta, so need to pass max - current to avoid overflow
            token.safeIncreaseAllowance(
                spender,
                type(uint256).max - currentAllowance
            );
        }
    }
```
so now Bracket contract can transfer input tokens to itself in fillStopLimitOrder function.
https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/StopLimit.sol#L126-L140
```solidity   
     BRACKET_CONTRACT.fillStopLimitOrder(
            swapPayload,
            order.takeProfit,
            order.stopPrice,
            order.amountIn,
            order.orderId,
            tokenIn,
            tokenOut,
            order.recipient,
            order.feeBips,
            order.takeProfitSlippage,
            order.stopSlippage,
            false, //permit
            "0x" //permitPayload
        );
```
https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/Bracket.sol#L147-L165
```solidity
    function fillStopLimitOrder(
        bytes calldata swapPayload,
        uint256 takeProfit,
        uint256 stopPrice,
        uint256 amountIn,
        uint96 existingOrderId,
        IERC20 tokenIn,
        IERC20 tokenOut,
        address recipient,
        uint16 existingFeeBips,
        uint16 takeProfitSlippage,
        uint16 stopSlippage,
        bool permit,
        bytes calldata permitPayload
    ) external override nonReentrant {
        require(
            msg.sender == address(MASTER.STOP_LIMIT_CONTRACT()),
            "Only Stop Limit"
        );
```
https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/Bracket.sol#L336
```solidity
            token.safeTransferFrom(owner, address(this), amount);
```
now even after this transfer almost type(uint256).max allowance is there for Bracket contract.
Attacker can take this as advantage and drain StopLimit contract funds.
1) Attacker checks for which tokens there is almost type(uint256).max allowance for Bracket contract to transfer tokens of StopLimit contract.(lets say for tokens A,B,C,D etc...)
2) Attacker creates a readily executable order in Bracket contract such  that let's say tokenOut = tokenA(for which Bracket contract already has almost type(uint256).max allowance to transfer StopLimit contracts tokenA tokens.
3)then attacker calls performUpkeep::Bracket with respect to this order( with target = address of tokenA, txData is such that in calls transferFrom with from = address of StopLimit contract, to = address of Bracket contract, value = no of tokenA tokens StopLimit contract have(or some thing closer to it).
https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/Bracket.sol#L85-L101
```solidity
    function performUpkeep(
        bytes calldata performData
    ) external override nonReentrant {
        MasterUpkeepData memory data = abi.decode(
            performData,
            (MasterUpkeepData)
        );
        Order memory order = orders[pendingOrderIds[data.pendingOrderIdx]];


        require(
            order.orderId == pendingOrderIds[data.pendingOrderIdx],
            "Order Fill Mismatch"
        );


        //deduce if we are filling stop or take profit
        (bool inRange, bool takeProfit, ) = checkInRange(order);
        require(inRange, "order ! in range");
```
and he sets feeBips = 0.
4)performUpkeep function internally calls execute function
https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/Bracket.sol#L108-L115
```solidity
        (uint256 swapAmountOut, uint256 tokenInRefund) = execute(
            data.target,
            data.txData,
            order.amountIn,
            order.tokenIn,
            order.tokenOut,
            bips
        );
```
now Lets observe execute function,
https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/Bracket.sol#L526-L568
```solidity
    function execute(
        address target,
        bytes memory txData,
        uint256 amountIn,
        IERC20 tokenIn,
        IERC20 tokenOut,
        uint16 bips
    ) internal returns (uint256 swapAmountOut, uint256 tokenInRefund) {
        //update accounting
        uint256 initialTokenIn = tokenIn.balanceOf(address(this));
        uint256 initialTokenOut = tokenOut.balanceOf(address(this));


        //approve
        tokenIn.safeApprove(target, amountIn);


        //perform the call
        (bool success, bytes memory result) = target.call(txData);


        if (success) {
            uint256 finalTokenIn = tokenIn.balanceOf(address(this));
            require(finalTokenIn >= initialTokenIn - amountIn, "over spend");
            uint256 finalTokenOut = tokenOut.balanceOf(address(this));


            //if success, we expect tokenIn balance to decrease by amountIn
            //and tokenOut balance to increase by at least minAmountReceived
            require(
                finalTokenOut - initialTokenOut >
                    MASTER.getMinAmountReceived(
                        amountIn,
                        tokenIn,
                        tokenOut,
                        bips
                    ),
                "Too Little Received"
            );


            swapAmountOut = finalTokenOut - initialTokenOut;
            tokenInRefund = amountIn - (initialTokenIn - finalTokenIn);
        } else {
            //force revert
            revert TransactionFailed(result);
        }
    }
```
In execute function after the external call to target(tokenA), tokenOut balance of contract increases by amount used as value in call( which is almost equal to  available balance of StopLimit contract for tokenA).
so finalTokenOut - initialTokenOut=value.so following require check is passed.
```solidity
            require(
                finalTokenOut - initialTokenOut >
                    MASTER.getMinAmountReceived(
                        amountIn,
                        tokenIn,
                        tokenOut,
                        bips
                    ),
                "Too Little Received"
            );
```
and also 
```solidity
 require(finalTokenIn >= initialTokenIn - amountIn, "over spend");
```
this check passes as we are not transfering any TokenIn tokens.
so now 
```solidity
 swapAmountOut = finalTokenOut - initialTokenOut;
```
swapAmountOut = value.(value used in external call to tokenA).
now this swapAmountOut will be transferred to recipient address(set by attacker).
https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/Bracket.sol#L135
```solidity
        order.tokenOut.safeTransfer(order.recipient, adjustedAmount);
```
here adjustedAmount = swapAmountOut = value.(as we set feeBips = 0).
https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/Bracket.sol#L125-L128
```solidity
        (uint256 feeAmount, uint256 adjustedAmount) = applyFee(
            swapAmountOut,
            order.feeBips
        );
```
so finally through this process Attacker can drain all funds of StopLimit contract through creating orders in Bracket contract by setting tokenOut as tokens for which Bracket contract have allowance to transfer from StopLimit contract, and setting takeProfit and stopPrice such that order was readily executable.And setting target as these tokenOut tokens and txData such that it calls transferFrom function with from = address of StopLimit contract, to = address of Bracket contract, value = available balance for  StopLimit contract of tokenOut tokens respectively.


### Root Cause

increasing allowance of Bracket contract to type(uint256).max for transferring tokens of StopLimit contract.
https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/StopLimit.sol#L397-L411
```solidity
    function updateApproval(
        address spender,
        IERC20 token,
        uint256 amount
    ) internal {
        // get current allowance
        uint256 currentAllowance = token.allowance(address(this), spender);
        if (currentAllowance < amount) {
            // amount is a delta, so need to pass max - current to avoid overflow
            token.safeIncreaseAllowance(
                spender,
                type(uint256).max - currentAllowance
            );
        }
    }
```

### Internal pre-conditions

_No response_

### External pre-conditions

_No response_

### Attack Path

1) Attacker creates a readily executable order in Bracket contract such that tokenOut = token for which StopLimit contract already set allowance of Bracket contract to type(uint256).max to transfer tokenOut tokens.
2) Attacker then calls performUpkeep function with respect to this orderId by setting target= address of tokenOut and txData such that it calls transferFrom function with from = address of StopLimit contract and to = address of Bracket contract and value = available balance of tokenOut tokens for  StopLimit contract.

### Impact

Attacker can drain StopLimit contract funds.( almost completely)

### PoC

_No response_

### Mitigation

StopLimit contract should increase allowance of Bracket contract to transfer tokens only which are required in fillStopLimit order function( not to type(uint256).max).



## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/gfx-labs/oku-custom-order-types/pull/1
