---
tags:
  - lang/solidity
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - sector/dex
  - sector/stable
  - sector/token
protocol: "[[Mugen]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-01-01-Mugen.md"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[cross-contract-state-consistency]]"
  - "[[fot-slippage]]"
---
# [H-02] Malicious user can easily make the protocol revert on every `USDT` swap on Uniswap

- id: 20423
- impact: HIGH
- protocol: [[Mugen]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-01-01-Mugen.md

## Summary


This bug report is about a malicious user exploiting a well-known attack vector of USDT on Uniswap, which affects the `ArbitrumSwaps` contract. The attack vector is present in the code from `UniswapAdapter.sol`, which is present in both `swapExactInputSingle` and `swapExactInputMultihop`. The attack could be done by a malicious user transferring 1 wei of USDT to `ArbitrumSwaps` and then calling `ArbitrumSwaps::arbitrumSwaps` with `step == UNI_SINGLE` to swap 1 USDT. This would cause the contract to approve 1 + 1e-18 USDT, which would lead to a race condition when anyone wants to swap USDT on Uniswap.

The impact of this attack is medium, as the protocol will not work with only one ERC20 token, but it is a widely used one. The likelihood of this attack is high, as it can easily be done.

The recommendation to fix this bug is to use the `amountIn` parameter instead of the `IERC20(multiParams.token1).balanceOf(address(this))` as the approved allowance.

## Details

**Likelihood:**
High, attack can easily be done and it exploits a well-known attack vector of `USDT`

**Impact:**
Medium, because the protocol will not work with only one ERC20 token, but it is a widely used one

**Description**

A malicious user can get the `ArbitrumSwaps` contract to revert on each `USDT` swap on Uniswap, because of a well-known attack vector of the token implementation. The problem is in the following code from `UniswapAdapter.sol` and is present in both `swapExactInputSingle` and `swapExactInputMultihop`

```solidity
        TransferHelper.safeApprove(
            swapParams.token1, address(swapRouter), IERC20(swapParams.token1).balanceOf(address(this))
        );
```

Here is how the attack can be done:

1. Malicious user transfers manually 1 wei of USDT to `ArbitrumSwaps`
2. Now he calls `ArbitrumSwaps::arbitrumSwaps` with `step == UNI_SINGLE` to swap 1 USDT
3. Now `swapExactInputSingle` approves 1 + 1e-18 USDT, because of the `balanceOf` call
4. Transaction will complete successfully, but next time anyone wants to swap USDT on Uniswap the transaction will revert, because of USDT approval race condition - to do an `approve` call the allowance should be either 0 or `type(uint256).max`, which is not the case because allowance is 1 wei

**Recommendation**

Instead of using the `IERC20(multiParams.token1).balanceOf(address(this))` as the approved allowance, use the `amountIn` parameter.
