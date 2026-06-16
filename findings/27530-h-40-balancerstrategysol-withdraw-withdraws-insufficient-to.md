---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/governance
  - sector/liquid-staking
  - sector/vault
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[carrotsmuggler]]"
report: "https://code4rena.com/reports/2023-07-tapioca"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
---
# [H-40] `BalancerStrategy.sol`: `_withdraw` withdraws insufficient tokens

- id: 27530
- impact: HIGH
- protocol: [[Tapioca DAO]]
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2023-07-tapioca

## Summary


A bug has been identified in the balancer strategy contract, where the function `_withdraw` is called during withdraw operations to withdraw WETH from the balancer pool. The function calculates the amount to withdraw, and then calls `_vaultWithdraw` function. This function submits an exit request with the following userData, which specifies the exact number of tokens to be withdrawn. However, the amount passed to the `_vaultWithdraw` function is scaled down by `pricePerShare`, which leads to an insufficient amount withdrawn, and eventually a revert. This is classified as a high severity issue.

To demonstrate this, a position was created on optimism's weth-reth pool with the min amount out of WETH set to 500 wei. The `exitRequest` was then constructed with the userData generated using the following code:

```solidity
function temp() external pure returns(bytes memory){
    uint256[] memory amts = new uint256[](2);
    amts[0] = 500;
    amts[1] = 0;
    uint256 max = 20170422329691;
    return(abi.encode(2,amts,max));
}
```

The transaction was then run on tenderly to check how many tokens are withdrawn, and it was confirmed that only 500 wei of WETH was withdrawn.

To mitigate this issue, the amount to be withdrawn should be passed without scaling it down by `pricePerShare`.

## Details


The funciton `_withdraw` in the balancer strategy contract is called during withdraw operations to withdraw WETH from the balancer pool. The function calculats the amount to withdraw, and then calls `_vaultWithdraw` function.

```solidity
if (amount > queued) {
            uint256 pricePerShare = pool.getRate();
            uint256 decimals = IStrictERC20(address(pool)).decimals();
            uint256 toWithdraw = (((amount - queued) * (10 ** decimals)) /
                pricePerShare);

            _vaultWithdraw(toWithdraw);
        }
```

The function `_vaultWithdraw` submits an exit request with the following userData.

```solidity
exitRequest.userData = abi.encode(
            2,
            exitRequest.minAmountsOut,
            pool.balanceOf(address(this))
        );
```

A value of 2 here corresponds to specifying the exact number of tokens coming out of the contract. Thus the function `_vaultWithdraw` will withdraw the exact number of tokens passed to it in its parameter.

The issue however is that the function `_vaultWithdraw` is not called with the amount of tokens needed to be withdrawn, it is called by the amount scaled down by `pricePerShare`. Thus if the actual withdrawn amount is less the amounts the user actually wanted. This causes a revert in the next step.

```solidity
require(
            amount <= wrappedNative.balanceOf(address(this)),
            "BalancerStrategy: not enough"
        );
```

Since an insuffucient amount of tokens are withdrawn, this step will revert if there arent enough spare tokens in the contract. Since the contract incorrectly scales doen the withdraw amount and causes a revert, this is classified as a high severity issue.

### Proof of Concept

The following exercise shows that passing the same `exitRequest` data to the balancerPool actually extracts the exact number of tokens as specified in `minamountsOut`.

A position is created on optimism's weth-reth pool. The `userData` is generated using the following code.

````solidity
```solidity
function temp() external pure returns(bytes memory){
    uint256[] memory amts = new uint256[](2);
    amts[0] = 500;
    amts[1] = 0;
    uint256 max = 20170422329691;
    return(abi.encode(2,amts,max));
}
````

Min amount out of WETH is set to 500 wei. The `exitRequest`is then constructed as follows with the userData from above.

```json
{
    "assets": [
        "0x4200000000000000000000000000000000000006",
        "0x9bcef72be871e61ed4fbbc7630889bee758eb81d"
    ],
    "minAmountsOut": ["500", "0"],
    "toInternalBalance": false,
    "userData": "0x00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000012584adba15b000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000001f40000000000000000000000000000000000000000000000000000000000000000"
}
```

This is an exit request of type 2, which specifies the exact amount of tokens to be withdrawn. This transaction was then run on tenderly to check how many tokens are withdrawn. From the screenshot [here](https://gist.github.com/carrotsmuggler/707aa76f78028d6fc66d5ba630d8d677) from tenderly we can see only 500 wei of WETH is withdrawn.

This proves that the `_vaultWithdraw` function withdraws the exact amount of tokens passed to it as a parameter. Since the passed parameter is scaled down by `pricePerShare`, this leads to an insufficient amount withdrawn, and eventually a revert.

### Tools Used

Tenderly

### Recommended Mitigation Steps

Pass the amount to be withdrawn without scaling it down by `pricePerShare`.

**[0xRektora (Tapioca) confirmed via duplicate issue 51](https://github.com/code-423n4/2023-07-tapioca-findings/issues/51)**

***
