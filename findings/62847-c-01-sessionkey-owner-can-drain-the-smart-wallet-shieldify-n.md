---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - sector/stable
  - sector/staking
  - sector/token
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-GasTankPaymasterModule-Extended-Security-Review.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[account-ownership]]"
---
# [C-01] `SessionKey` Owner Can Drain the Smart Wallet

- id: 62847
- impact: HIGH
- protocol: [[Etherspot]] Gastankpaymastermodule Extended
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-GasTankPaymasterModule-Extended-Security-Review.md

## Summary


The bug report is about a critical risk in the `CredibleAccountModule` code, which is designed to allow time-based restricted authorization for a `sessionKey`. This session is restricted to a given period, for a given `sessionKey`, and a given set of locked tokens with an amount for each one. The problem is that when approving tokens, there is no check to ensure that the `sessionKey` is approving the `CredibleAccountModule` as the spender, which means that the `sessionKey` owner can easily drain the entire supply of tokens from the SCW. This can happen because the `sessionKey` has the ability to call two functions: `ERC20::approve()` and `CredibleAccountModule::claim()`. The bug is located in two parts of the code, specifically in the `_validateSingleCall()` and `_validateBatchCall()` functions. The impact of this bug is that any `sessionKey` owner can completely drain the SCW of all tokens, even those that are not locked or whitelisted in `InvoiceManager`. A proof of concept has been provided to demonstrate how this bug can be exploited. The recommendation is to add a check in both functions to ensure that the `CredibleAccountModule` address is being approved as the spender. The team has confirmed that this issue has been fixed.

## Details


## Severity

Critical Risk

## Description

`CredibleAccountModule` is designed to allow time-based restricted authorization for `sessionKey`, where it gives `sessionKey` the ability to transfer tokens on behalf of the main SCW. This session is restricted to a given period, for a given `sessionKey`, and a given set of Locked tokens with an amount for each one.

So, in order for the SCW to be safe, each `sessionKey` can only take the tokens that are in its session, and not exceed the amount locked. This means that the `sessionKey` owner can drain the SCW totally.

The `sessionKeys` have the ability to call two functions:

- `ERC20::approve()` (Any ERC20 token)
- `CredibleAccountModule::claim()` (Only `CredibleAccountModule` contract as target)

The problem is that when approving token there is no check weather the `sessionKey` is approving the `CredibleAccountModule` as the Spender or he is Approving another address, so the `sessionKey` owner can easily drain the SCW by approving tokens to himself with full approval (no check for the amount too), and take the tokens himself (via `transferFrom()` function, since he is a spender).

## Location of Affected Code

File: [CredibleAccountModule.sol#L763](https://github.com/etherspot/etherspot-modular-accounts/blob/9019f2a78c36e74bdb1df4029672998cb4631162/src/modules/validators/CredibleAccountModule.sol#L763)

```solidity
function _validateSingleCall(bytes calldata _callData) internal view returns (bool) {
    // code
>>  if (selector == IERC20.approve.selector) return true;
    if (target != address(this)) return false; // If not approve call must call this contract
    return true;
}
```

File: [CredibleAccountModule.sol#L780](https://github.com/etherspot/etherspot-modular-accounts/blob/9019f2a78c36e74bdb1df4029672998cb4631162/src/modules/validators/CredibleAccountModule.sol#L780)

```solidity
function _validateBatchCall(bytes calldata _callData) internal view returns (bool) {
    Execution[] calldata execs = ExecutionLib.decodeBatch(_callData[EXEC_OFFSET:]);
    for (uint256 i; i < execs.length; ++i) {
       // code
>>     if (selector == IERC20.approve.selector) continue;
       if (execs[i].target != address(this)) return false; // If not approve call must call this contract
    }
    return true;
}
```

## Impact

Any `sessionKey` owner can completely drain the SCW from all tokens, even tokens that are not locked or tokens that are not whitelisted in `InvoiceManager`.

## Proof of Concept

- SCW has a `sessionKey` activated
- The SCW give that `sessionKey` the ability to claim `100 USDT` and `1 WETH`
- The SCW owns USDT, WETH, WBTC, and USDC
- The `sessionKey` enters its active period
- The `sessionKey` made a transaction for calling approve USDT for the full balance, WETH, WBTC, USDC, USDT
- He approved for himself, where he made himself the spender
- Transactions have been executed on SCW
- The `sessionkey` took all the SCW balance for himself

## Recommendation

In `_validateSingleCall()`, we should extract the spender address and check that it is approving the `CredibleAccountModule` address to be the spender. The same should be made for `_validateBatchCall()` by checking that the Execution that is calling approve is with `callData`, making the `CredibleAccountModule` address as the spender.

## Team Response

Fixed.
