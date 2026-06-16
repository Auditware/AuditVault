---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - has/poc
  - severity/high
  - sector/account
  - sector/staking
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Mitigation-Security-Review.md"
genome:
  - "[[centralization]]"
  - "[[ownership-takeover]]"
  - "[[role-bypass]]"
  - "[[account-ownership]]"
  - "[[bridge-sender-auth]]"
  - "[[frontrun-exposure]]"
---
# [H-01] Session Key Can Be Consumed by Unauthorized SCW

- id: 61396
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule Mitigation
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Mitigation-Security-Review.md

## Summary


The bug report describes an issue with the CredibleAccountModule contract, where there is a lack of check to verify that the session key being used belongs to the actual sender. This can lead to unauthorized consumption of session keys and bypassing of validation checks. A proof of concept is provided to demonstrate how a malicious wallet can exploit this bug. The recommendation is to add a check in the `_validateSessionKeyParams()` function to ensure that the consumer of the session is the owner of the recovered `sessionKeySigner`. The team has responded that they have fixed the issue.

## Details


## Severity

High Risk

## Description

When validating the session to be consumed by calling `CredibleAccountModule::validateUserOp()`. We are enforcing the sender to be a wallet that installed the module and to be `userOp.sender` too.

The issue is that there is no check that `userOpHash` is the actual constructed hash from the `EntryPoint` contract when hashing `PackedUserOperation`.

Since we enforce the `msg.sender` to match `op.sender`, this will only allow valid entities to call the function. But the function lacks to check that after recovering the `sessionKeySigner`, the session key belongs to the actual `msg.sender` or `op.sender`.

[CredibleAccountModule.sol#L295-L299](https://github.com/etherspot/etherspot-modular-accounts/blob/cb0645c3e7ca2a5aa7a6b9ce0263a182fba24fd9/src/modules/validators/CredibleAccountModule.sol#L295-L299)

```solidity
function validateUserOp( ... ) ... {
    // code
>>  bytes memory sig = _digestSignature(userOp.signature);
    address sessionKeySigner = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), sig);
>>  if (!_validateSessionKeyParams(sessionKeySigner, userOp)) {
        return VALIDATION_FAILED;
    }
    SessionData memory sd = sessionData[sessionKeySigner][msg.sender];
    return _packValidationData(false, sd.validUntil, sd.validAfter);
}
```

The `sessionKeySigner` is the address that signed `userOp.signature`. After this, we go and validate it.

In validation, there is no check that `sessionKeySigner` is owned by `userOp.sender`. We just check that the `userOp.sender` has enough balance to pay in `_validateTokenData()`.

[CredibleAccountModule.sol#L473-L487](https://github.com/etherspot/etherspot-modular-accounts/blob/cb0645c3e7ca2a5aa7a6b9ce0263a182fba24fd9/src/modules/validators/CredibleAccountModule.sol#L473-L487)

```solidity
function _validateTokenData(address _sessionKey, address _wallet, uint256 _amount, address _token) ... {
    LockedToken[] storage tokens = lockedTokens[_sessionKey];
    for (uint256 i; i < tokens.length; ++i) {
        if (tokens[i].token == _token) {
>>          if (_walletTokenBalance(_wallet, _token) >= _amount && _amount == tokens[i].lockedAmount) {
                tokens[i].claimedAmount += _amount;
                return true;
            }
        }
    }
    return false;
}
```

At the end of the `tx` we grad the `SessionData`.

```solidity
function validateUserOp( ... ) ... {
    // code

    if (!_validateSessionKeyParams(sessionKeySigner, userOp)) {
        return VALIDATION_FAILED;
    }
>>  SessionData memory sd = sessionData[sessionKeySigner][msg.sender];
    return _packValidationData(false, sd.validUntil, sd.validAfter);
}
```

If the `sessionKeySigner` does not belong to the `msg.sender/op.sender`, it will return an empty `SessionData`, making `validUntil` and `validAfter` zero. And these values will be bypassed from the `EntryPoint`.

At the end, the `EntryPoint` will execute the session on the SCW that does not own that key, resulting in consuming the session key in an authorized way by non-owners of that key.

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol#L300](https://github.com/etherspot/etherspot-modular-accounts/blob/cb0645c3e7ca2a5aa7a6b9ce0263a182fba24fd9/src/modules/validators/CredibleAccountModule.sol#L300)

## Impact

- Consumption of the session by non-owners of the session key.
- Preventing consumption sessions by the real owners.
- Bypassing the `validAfter`/`validUntil` check, where the values that will go to the EntryPoint will be zero instead of the real value, because of reading an empty `SessionData` struct.

## Proof of Concept

- SCW1 and SCW2 installed the modules
- SCW2 is a malicious wallet
- SCW1 has `key1` to be consumed
- Key1 signed the tx to unlock tokens
- SCW2 took that signature (either from mempool monitoring, front-running it, etc.)
- SCW2 called `CredibleAccountModule.validateUserOp()` providing the following:
  - userOp.signature: the signature made by `key1`
  - userOp.sender: SCW2 (its address)
  - userOpHash: The constructed hash that will be made from the EntryPoint (can be constructed easily by providing the parameters).
- Now, when recovering, the final `sessionKey` will be `key1`, which belongs to `SCW1` and not `SCW2`
- All validations passed, and SCW2 has enough token balance to pass the token validation.
- The `sessionKey` is consumed by `SCW2`, and it is owned by `SCW1`.
- `SCW1` will not be able to consume that session key.

## Recommendation

We should check that the consumer of the session is the owner of the recovered `sessionKeySigner`. This check can be done as follows.

```solidity
SessionData memory sd = sessionData[sessionKeySigner][msg.sender];
require(sd.sessionKey == sessionKeySigner);
```

NOTE: It is better to include this check in the `_validateSessionKeyParams()` function, which takes `userOp` as input, and `userOp` is the same as `msg.sender`.

## Team Response

Fixed.
