---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/governance
  - sector/staking
  - sector/token
protocol: "[[Tapioca DAO]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2024-02-01-TapiocaDAO.md"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[reward-accounting]]"
---
# [H-02] `BaseLeverageExecutor` doesn’t have a `receive()` method to receive ETH withdrawals from WETH

- id: 31529
- impact: HIGH
- protocol: Tapiocadao
- reporter: Pashov Audit Group
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov Audit Group/2024-02-01-TapiocaDAO.md

## Summary


The `BaseLeverageExecutor.sol` contract is used by other contracts to handle token swapping and wrapping. However, there is an issue when the final token in a leverage action is the ETH tOFT. This is because the contract does not have a `fallback` or `receive` method, causing the `weth.withdraw` call to revert and making any leverage calls that finish with the ETH tOFT fail. The recommendation is to add a `receive` method to the `BaseLeverageExecutor.sol` contract to fix this issue.

## Details

**Severity**

**Impact:** Medium, since it breaks the leverage executor when the output token is the tOFT for ETH

**Likelihood:** High, since it will always happen for this output token

**Description**

The `BaseLeverageExecutor.sol` contract is the base contract that is inherited by all the other leverage executor contracts. It contains the logic for handling token swapping and tOFT wrapping and unwrapping that is common to all the leverage executors.

When the final token of a leverage action is the ETH tOFT, the WETH from the swap is converted to ETH, and the ETH is wrapped in the tOFT:

```solidity
function _handleToftWrapToSender(bool sendBack, address tokenOut, uint256 amountOut) internal {
        address toftErc20 = ITOFT(tokenOut).erc20();
        address wrapsTo = sendBack == true ? msg.sender : address(this);

        if (toftErc20 == address(0)) {
            // If the tOFT is for ETH, withdraw from WETH and wrap it.
            weth.withdraw(amountOut);
            ITOFT(tokenOut).wrap{value: amountOut}(address(this), wrapsTo, amountOut);
        } else {
            // If the tOFT is for an ERC20, wrap it.
            toftErc20.safeApprove(tokenOut, amountOut);
            ITOFT(tokenOut).wrap(address(this), wrapsTo, amountOut);
            toftErc20.safeApprove(tokenOut, 0);
        }
    }
```

The issue here is the call to `weth.withdraw` includes a callback to this contract with the amount of ETH corresponding to the amount of WETH we want to burn. In order to receive this ETH we need a `fallback` or `receive` method, however, this contract has neither. As a result, the `withdraw` call will revert and so any leverage calls that finish with the ETH tOFT will always revert.

This applies to both `AssetTotsDaiLeverageExecutor` and `AssetToSGLPLeverageExecutor`. Any calls to `getAsset` where the `assetAddress` is the tOFT for ETH will always fail.

**Recommendations**

The following snippet should be added to the `BaseLeverageExecutor.sol` contract:

```solidity
receive() external payable {}
```

It can be removed from the `SimpleLeverageExecutor.sol` contract (since it inherits `BaseLeverageExecutor`).
