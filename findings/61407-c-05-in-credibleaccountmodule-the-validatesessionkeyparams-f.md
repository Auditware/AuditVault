---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/staking
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[reward-accounting]]"
---
# [C-05] In `CredibleAccountModule` the `validateSessionKeyParams()` Function is `public`

- id: 61407
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Security-Review.md

## Summary


This bug report discusses a critical risk bug in the `CredibleAccountModule` function of the `validateSessionKeyParams()` function. This function is used to validate user input, but it has been changed to allow anyone to call it with any data and consume user tokens. This can prevent smart wallets from using the session and unlocking tokens. The affected code can be found in the `src/modules/validators/CredibleAccountModule.sol#L200` file. The team has recommended making the function `internal` instead of `public` to fix the issue. The team has confirmed that the bug has been fixed.

## Details


## Severity

Critical Risk

## Description

The function `CredibleAccountModule::validateSessionKeyParams()` will be used in `validateUserOp()` when validating user input. It changed the `TokenData` to claimed so that the smart wallet can unlock the tokens. But since the function is `public`, anyone can call it with any data and consume any user tokens.

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol#L200](https://github.com/etherspot/etherspot-modular-accounts/blob/d4774db9f544cc6f69000c55e97627f93fe7242b/src/modules/validators/CredibleAccountModule.sol#L200)

```solidity
function validateSessionKeyParams(address _sessionKey, PackedUserOperation calldata userOp) public returns (bool) {
    if (isSessionClaimed(_sessionKey)) return false;
    bytes calldata callData = userOp.callData;
    if (bytes4(callData[:4]) == IERC7579Account.execute.selector) {
        ModeCode mode = ModeCode.wrap(bytes32(callData[4:36]));
        (CallType calltype,,,) = ModeLib.decode(mode);
        if (calltype == CALLTYPE_SINGLE) {
            return _validateSingleCall(callData, _sessionKey, userOp.sender);
        } else if (calltype == CALLTYPE_BATCH) {
            return _validateBatchCall(callData, _sessionKey, userOp.sender);
        }
    }
    return false;
}
```

## Impact

Anyone can consume Locked tokens in favour of Smart wallets, preventing them from using the session and unlocking tokens.

## Recommendation

The `validateSessionKeyParams()` function should be made `internal` instead of `public`.

## Team Response

Fixed.
