---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/oracle
  - sector/stable
  - sector/token
protocol: "[[Oku'S New Order Types Contract Contest]]"
auditors:
  - "[[BugPull]]"
report: "https://github.com/sherlock-audit/2024-11-oku-judging"
genome:
  - "[[missing-owner-check]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
  - "[[oracle-freshness]]"
---
# H-2: Attackers can drain the `OracleLess` contract by creating an order with a `malicious tokenIn` and executing it with a `malicious target`.

- id: 44372
- impact: HIGH
- protocol: [[Oku'S New Order Types Contract Contest]]
- reporter: BugPull (Sherlock)
- source: N/A

## Summary


The `OracleLess` contract has a vulnerability that allows attackers to drain all `USDT` from the contract. This is caused by the `createOrder()` function not verifying if the `tokenIn` is a legitimate ERC20 token and the `fillOrder()` function not checking if the `target` and `txData` are valid. This allows attackers to create an order with a malicious token and execute it with a malicious `target` and `txData`, resulting in all `USDT` being transferred to the attacker. A recommended solution is to implement a whitelist mechanism for `token`, `target`, and `txData` to prevent this vulnerability.

## Details

Source: https://github.com/sherlock-audit/2024-11-oku-judging/issues/357 

## Found by 
0xaxaxa, BugPull, Ragnarok, whitehair0330
### Summary

In the `OracleLess` contract, the `createOrder()` function does not verify whether the `tokenIn` is a legitimate ERC20 token, allowing attackers to create an order with a malicious token. Additionally, the `fillOrder()` function does not check if the `target` and `txData` are valid, enabling attackers to execute their order with a malicious `target` and `txData`.

### Root Cause

The [OracleLess.createOrder()](https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/OracleLess.sol#L38-L67) function does not verify whether `tokenIn` is a legitimate ERC20 token.

Additionally, the [OracleLess.fillOrder()](https://github.com/sherlock-audit/2024-11-oku/blob/main/oku-custom-order-types/contracts/automatedTrigger/OracleLess.sol#L103-L148) function does not check if `target` and `txData` are valid.

### Internal pre-conditions

### External pre-conditions

### Attack Path

Let's consider the following scenario:

1. Alice, the attacker, creates a malicious token.

2. Alice creates an order with her malicious token:

    - `tokenIn`: Alice's malicious token
    - `tokenOut`: `WETH`
    - `minAmountOut`: 0
3. Alice calls the `fillOrder()` function to execute her malicious order, setting parameters as follows:

    - `target`: address of `USDT`
    - `txData`: transfer all `USDT` in the `OracleLess` contract to Alice.
        ```solidity
            function fillOrder(
                ...

        118     (uint256 amountOut, uint256 tokenInRefund) = execute(
                    target,
                    txData,
                    order
                );

                ...
            }
        ```
    - At line 118 of the `fillOrder()` function, `execute()` is invoked:
        <details>
            <summary> execute() </summary>

                function execute(
                    address target,
                    bytes calldata txData,
                    Order memory order
                ) internal returns (uint256 amountOut, uint256 tokenInRefund) {
                    //update accounting
                    uint256 initialTokenIn = order.tokenIn.balanceOf(address(this));
                    uint256 initialTokenOut = order.tokenOut.balanceOf(address(this));

                    //approve
            237     order.tokenIn.safeApprove(target, order.amountIn);

                    //perform the call
            240     (bool success, bytes memory reason) = target.call(txData);

                    if (!success) {
                        revert TransactionFailed(reason);
                    }

                    uint256 finalTokenIn = order.tokenIn.balanceOf(address(this));
                    require(finalTokenIn >= initialTokenIn - order.amountIn, "over spend");
                    uint256 finalTokenOut = order.tokenOut.balanceOf(address(this));

                    require(
            251         finalTokenOut - initialTokenOut > order.minAmountOut,
                        "Too Little Received"
                    );

                    amountOut = finalTokenOut - initialTokenOut;
                    tokenInRefund = order.amountIn - (initialTokenIn - finalTokenIn);
                }
        </details>
        
        - At line 237 of the `execute()` function, `tokenIn.safeApprove()` is called. Alice made her malicious `tokenIn` as follows:
            ```solidity
                function approve(address spender, uint256 amount) public virtual override returns (bool) {
                    WETH.transfer(msg.sender, 1);
                    return true;
                }
            ```
            This transfers 1 wei of `WETH` to the `OracleLess` contract.
        - At line 240, all `USDT` are transferred to Alice, as `target` is `USDT` and `txData` is set to transfer to Alice.
        - At line 251, `finalTokenOut - initialTokenOut` will be 1, as the contract has already received 1 wei. Thus, the require statement will pass since `order.minAmountOut` was set 0.

As a result, Alice can drain all `USDT` from the `OracleLess` contract.

### Impact

Attackers can drain the `OracleLess` contract by using malicious `token`, `target`, and `txData`.

### PoC

### Mitigation

It is recommended to implement a whitelist mechanism for `token`, `target`, and `txData`.
