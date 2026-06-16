---
tags:
  - lang/solidity
  - platform/sigmaprime
  - has/github
  - severity/high
  - impact/loss-of-funds/locked-funds
  - sector/token
protocol: "[[Taiko]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[cross-contract-state-consistency]]"
---
# Incorrect Value Assigned To token When Recalling Messages

- id: 35998
- impact: HIGH
- protocol: [[Taiko]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/taiko/review.pdf

## Summary

This bug report is about a function in a contract called ERC20Vault. The function is supposed to refund a user's tokens, but it is not working correctly. This is because the variable "token" is being assigned the wrong value, which is causing the contract to be unable to refund the tokens. This means that any messages that are recalled from the ERC20Vault will not be refunded correctly and may result in funds being stuck in the contract. To fix this issue, the variable "token" needs to be assigned the correct address, which has been done in a recent update to the contract. 

## Details

## Description

In the function `onMessageRecalled()` in `ERC20Vault.sol`, the calldata intended for `receiveToken()` is decoded to refund the user’s tokens. However, during this decoding, the `token` variable is assigned the value `user` instead of the token address.

```solidity
(, address token,, uint256 amount) =
abi.decode(message.data[4:], (CanonicalERC20, address, address, uint256));
```

As seen in the code snippet above, `token` decoded as the second parameter of `message.data`. However, looking at the encoding in the following code snippet, it can be seen that the second parameter, excluding the selector, is `user`.

```solidity
msgData =
abi.encodeWithSelector(this.receiveToken.selector, ctoken, user, to, _balanceChange);
```

Consequently, the contract is unable to refund the user’s tokens, as the incorrect token address is used. Therefore, any recalled messages from the `ERC20Vault` will revert or result in funds stuck in the contract.

## Recommendations

To resolve this issue, ensure `token` is assigned the correct address, found inside the struct `CanonicalERC20.addr`.

## Resolution

The recommendation has been implemented in PR #15582.
