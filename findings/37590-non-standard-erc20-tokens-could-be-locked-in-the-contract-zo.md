---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/stable
  - sector/token

protocol: "[[Cyber Finance]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-25-Cyber Finance.md"
genome:
  - "[[unchecked-return-value]]"
  - "[[locked-funds]]"
  - "[[extcall-return-validation]]"
---
# Non-Standard ERC20 tokens could be locked in the contract

- id: 37590
- impact: HIGH
- protocol: [[Cyber Finance]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-06-25-Cyber Finance.md

## Summary


This bug report is about a problem with the ERC20 transfer function used to transfer rewardToken tokens. Some ERC20 tokens, like USDT, BNB, and OMG, do not return a boolean value, causing the transfer to fail and potentially lock tokens in the contract. To fix this issue, it is recommended to use the SafeERC20 library from OpenZeppelin, which has a safe transfer function that can properly handle tokens that do not return a value. The suggested solution is to replace the current transfer function with the one from the SafeERC20 library.

## Details

**Severity**: High

**Status**: Resolved

**Description**

The ERC20 transfer function is used to transfer `rewardToken` tokens. However, some ERC20 tokens, such as USDT, BNB, and OMG, do not return a boolean. This can cause the `require(success, "Token transfer failed")` check to always fail, potentially resulting in tokens being locked in the contract.

**Recommendation**: 

To ensure compatibility with all ERC20 tokens and to handle transfer failures properly, it is recommended to use the SafeERC20 library from OpenZeppelin. This library provides a safe transfer function that properly handles tokens that do not return a value.

**Replace**:

```solidity
bool success = IERC20(rewardToken).transfer(owner(), amount);
```
With:
```solidity
SafeERC20.safeTransfer(IERC20(rewardToken), owner(), amount);
```
