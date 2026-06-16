---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - sector/staking
  - sector/token
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-GasTankPaymasterModule-Extended-Security-Review.md"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[account-ownership]]"
---
# [H-01] `SessionKey` Owner Can Impersonate Another Session Key Owner for the Same Smart Wallet

- id: 62848
- impact: HIGH
- protocol: [[Etherspot]] Gastankpaymastermodule Extended
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-GasTankPaymasterModule-Extended-Security-Review.md

## Summary


This bug report is about the Smart Wallet, which can have multiple active sessions at the same time. There is a function called `CredibleAccountModule::validateUserOp()` which checks if the signer is the Smart Wallet and owns the session key. However, there is no check to verify if the session key used to sign the message is the same one being used for the `claim()` function. This allows other session key owners to sign messages that consume others' session keys for the same Smart Wallet. This could result in unauthorized parties claiming tokens. The team has fixed this issue by adding a check to make sure the session key used for signing matches the session key used for the `claim()` function.

## Details


## Severity

High Risk

## Description

The Smart Wallet (Etherspot Wallet) can enable multiple sessions at the same time, it can have N count active sessions.

When validating the signature via `CredibleAccountModule::validateUserOp()`, we are making sure that the signer is the SCW and it owns that `sessionKey`.

If the function we are calling is `CredibleAccountModule::claim()`, we pass `sessionKey` for this function to be consumed. However, there is no check to verify if the `sessionKeySigner` that signed the message signed for `claim()` using their `sessionKey`, or for another `sessionKey`. This will allow other `sessionKey` owners to sign messages that consume others' `sessionKey`s for the same Smart Wallet.

## Location of Affected Code

File: [CredibleAccountModule.sol#L759-L766](https://github.com/etherspot/etherspot-modular-accounts/blob/9019f2a78c36e74bdb1df4029672998cb4631162/src/modules/validators/CredibleAccountModule.sol#L759-L766)

```solidity
function _validateSelector(bytes4 _selector) internal pure returns (bytes4) {
   return (_selector == this.claim.selector || _selector == IERC20.approve.selector) ? _selector : bytes4(0);
}

// code

function _validateSingleCall(bytes calldata _callData) internal view returns (bool) {
    (address target,, bytes calldata execData) = ExecutionLib.decodeSingle(_callData[EXEC_OFFSET:]);
    bytes4 selector = _validateSelector(bytes4(execData[0:4]));
    if (selector == bytes4(0)) return false;
    if (selector == IERC20.approve.selector) return true;
    if (target != address(this)) return false; // If not approve call must call this contract
    return true;
}
```

## Impact

Consumption of the session by unauthorized parties

## Proof of Concept

- There is a Smart Wallet (SCW) that has two `sessionKey`s (SK1, SK2)
- SK2 signed a message for making a `claim()` function, passing parameters as `sessionKey` equals `SK1`
- `CredibleAccountModule::validateUserOp()` is called
  - The `msg.sender` is the SCW | check passed
  - The signed `sessionKey` is owned by that SCW | check passed
  - We are calling `claim()` function on the `CredibleAccountModule` contract | check passed
- validation will pass successfully, and the Smart Wallet will execute the transaction
- Now executing `claim()` providing `sessionKey` as `SK1`
- All checks will be passed, the sender will be the SCW, and it owns the `sessionKey`
- This will end up claiming the SK1 tokens, without SK1 signing, but SK2 is the one who signed the message

## Recommendation

Since we only allow two functions to be called, `ERC20::approve()` and `CredibleAccountModule::claim()`, we should make sure that if the function is `claim()`, we check the `sessionKey` provided to match the `sessionKeySigner` for the message.

## Team Response

Fixed.
