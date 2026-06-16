---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/staking
  - sector/token
protocol: "[[Etherspot]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Mitigation-Security-Review.md"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[fee-accounting]]"
  - "[[reward-accounting]]"
---
# [C-01] Consumers Can Double the `lockedAmount` In the Session, Draining the SCW and Preventing Claiming of the Session

- id: 61395
- impact: HIGH
- protocol: [[Etherspot]] Credibleaccountmodule Mitigation
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/Etherspot-CredibleAccountModule-Mitigation-Security-Review.md

## Summary


Summary:

The bug report describes a critical risk bug in the CredibleAccountModule.sol file of the etherspot-modular-accounts repository. The bug allows users to consume locked tokens multiple times, preventing session claiming and releasing tokens that should not be released. The bug can be fixed by checking that the claimedAmount is zero before increasing it in the _validateTokenData() function. The team has responded that the bug has been fixed. 

## Details


## Severity

Critical Risk

## Description

When validating the execution of the tx that consumed the locked tokens, the execution can either be a `singleCall()` or `batchCall()`. While validating the batch, we are iterating over all transactions and validating the locked token consumption.

[CredibleAccountModule.sol#L450-L461](https://github.com/etherspot/etherspot-modular-accounts/blob/cb0645c3e7ca2a5aa7a6b9ce0263a182fba24fd9/src/modules/validators/CredibleAccountModule.sol#L450-L461)

```solidity
function _validateBatchCall( ... ) ... {
    Execution[] calldata execs = ExecutionLib.decodeBatch(_callData[EXEC_OFFSET:]);
    for (uint256 i; i < execs.length; ++i) {
        (bytes4 selector,, uint256 amount) = _digestClaimTx(execs[i].callData);
>>      if (!_isValidSelector(selector) || !_validateTokenData(_sessionKey, _wallet, amount, execs[i].target)) {
            return false;
        }
    }
    return true;
}
```

We call `_validateTokenData()` in a loop, as the token contract `execs[i].target`. And in `_validateTokenData()`, once the token exists in the `sessionKey`, we increase the `claimedAmount` of it.

[CredibleAccountModule.sol#L480](https://github.com/etherspot/etherspot-modular-accounts/blob/cb0645c3e7ca2a5aa7a6b9ce0263a182fba24fd9/src/modules/validators/CredibleAccountModule.sol#L480)

```solidity
function _validateTokenData( ... ) ... {
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

The problem is that we increase the `claimedAmount` if the token matches, and the amount is the same as the `lockedAmount`. Since there is no check to see if the tokens are claimed or not. When executing a batch, users can double/triple/... consume the `lockedAmount` in a Batch execution. As in `_validateTokenData()`, we are not checking if the `claimedAmount` is consumed or not.

The same as in Single execution, if the session consists of 5 tokens, and only one is consumed, the one that is consumed can be consumed again and again.

This will not only allow double unlocking of tokens, but also it will prevent the claiming of the session, where `isSessionClaimed()` checks that `lockedAmount` should equal `claimedAmount`.

[CredibleAccountModule.sol#L272](https://github.com/etherspot/etherspot-modular-accounts/blob/cb0645c3e7ca2a5aa7a6b9ce0263a182fba24fd9/src/modules/validators/CredibleAccountModule.sol#L272)

```solidity
function isSessionClaimed(address _sessionKey) public view returns (bool) {
    LockedToken[] memory tokens = lockedTokens[_sessionKey];
    for (uint256 i; i < tokens.length; ++i) {
        if (tokens[i].lockedAmount != tokens[i].claimedAmount) return false;
    }
    return true;
}
```

## Location of Affected Code

File: [src/modules/validators/CredibleAccountModule.sol#L480](https://github.com/etherspot/etherspot-modular-accounts/blob/cb0645c3e7ca2a5aa7a6b9ce0263a182fba24fd9/src/modules/validators/CredibleAccountModule.sol#L480)

## Impact

- Consuming the `lockedAmount` more than once.
- Preventing `sessionClaiming`, as claimed, will be greater than the `lockedAmount`, making the function always return an unclaimed session.
- Releasing of tokens that should not be released.

## Recommendation

We should check that the `claimedAmount` is zero in `_validateTokenData()` so that we are sure the tokens are consumed only on:

```solidity
if (
    _walletTokenBalance(_wallet, _token) >= _amount &&
    _amount == tokens[i].lockedAmount &&
    tokens[i].claimedAmount == 0
) {
    tokens[i].claimedAmount += _amount;
    return true;
}
```

## Team Response

Fixed.
