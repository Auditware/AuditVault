---
tags:
  - lang/solidity
  - sector/dex
  - sector/streaming
  - sector/token
  - platform/sigmaprime
  - has/github
  - severity/high
  - vuln/reentrancy/single-function
  - fix/use-reentrancy-guard
  - novelty/known-pattern
  - misassumption/external-call-is-safe
  - trigger/reentrancy-callback
protocol: "[[Sushi]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/sushi/auction-maker-furo/review.pdf"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[reentrancy-guard]]"
---
# Reentrancy Vulnerabilities May Drain Tokens

- id: 19588
- impact: HIGH
- protocol: [[Sushi]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/sushi/auction-maker-furo/review.pdf

## Summary


A potential reentrancy bug has been found in FuroVesting.stopVesting(), which allows draining the token balance of a contract for any ERC20 token that relinquishes control during transfer(). This bug occurs when the function _transferToken() is called twice before the state variable vests is updated. If the token being transferred is one that relinquishes execution control during transfer(), an attacker could reenter the stopVesting() function and cause both calls to _transferToken() to execute again. 

To prevent reentrancy, the development team has implemented the check-effects-interactions pattern, where delete vests[vestId] occurs before making any external calls. Additionally, they have added reentrancy guards such as OpenZeppelin’s ReentrancyGuard over each of the functions which make external calls. This was fixed in PR 17.

## Details

## Description

There is a potential reentrancy bug in `FuroVesting.stopVesting()` that allows draining the token balance of the contract for any ERC20 token that relinquishes control during `transfer()`. In addition to other ERC20 tokens, it’s also possible to withdraw WETH as native ETH in BentoBox which will relinquish control to the attacker.

In the function `stopVesting()`, `_transferToken()` is called twice before the state variable `vests` is updated on line [156]. When `toBentoBox` is false, the underlying asset is transferred out of the BentoBox to the recipient and owner respectively.

If the token being transferred is one that relinquishes execution control during `transfer()`, an attacker could re-enter the `stopVesting()` function. Since `delete vests[vestId];` has not yet been processed, both the calls to `_transferToken()` would execute again.

## Recommendations

To prevent reentrancy, apply the check-effects-interactions pattern. Specifically, `delete vests[vestId];` should occur before making any external calls.

Another mitigation is to use reentrancy guards such as OpenZeppelin’s `ReentrancyGuard` over each of the functions that make external calls.

## Resolution

The development team has fixed the issue by moving the line `delete vests[vestId];` to before the call to `_transferToken()`. This is shown in PR 17.
