---
tags:
  - lang/solidity
  - sector/lending
  - sector/options
  - sector/token
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - precondition/specific-token-type
protocol: "[[Origin]]"
auditors:
  - "[[Dominik Teiml]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[specific-token-type]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# OUSD total supply can be arbitrary, even smaller than user balances

- id: 18214
- impact: HIGH
- protocol: [[Origin Dollar]]
- reporter: Dominik Teiml (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf

## Summary


This bug report is about the OUSD token contract which allows users to opt out of rebasing effects. The rebaseOptOut function can be called by any account to be removed from the non-rebasing exception list. However, calling the changeSupply function changes the totalSupply but not the balances of users who have opted out. This can lead to the violation of the common EIP-20 invariant that balanceOf(x) must be less than or equal to totalSupply().

The short-term recommendation is for the contract to make clear all common invariant violations for users and other stakeholders. The long-term recommendation is for the system to be designed in such a way that as many commonplace invariants as possible are preserved.

## Details

## Description

The OUSD token contract allows users to opt out of rebasing effects. At that point, their exchange rate is “fixed”, and further rebases will not have an impact on token balances (until the user opts in). The `rebaseOptOut` is a public function that any account can call to be removed from the non-rebasing exception list.

```solidity
function rebaseOptOut() public {
    require(! _isNonRebasingAccount(msg.sender), "Account has not opted in");
    // Increase non rebasing supply
    nonRebasingSupply = nonRebasingSupply.add(balanceOf(msg.sender));
    // Increase non rebasing credits
    nonRebasingCredits = nonRebasingCredits.add(_creditBalances[msg.sender]);
    // Set fixed credits per token
    nonRebasingCreditsPerToken[msg.sender] = rebasingCreditsPerToken;
    // Decrease rebasing credits, total supply remains unchanged so no
    // adjustment necessary
    rebasingCredits = rebasingCredits.sub(_creditBalances[msg.sender]);
    // Mark explicitly opted out of rebasing
    rebaseState[msg.sender] = RebaseOptions.OptOut;
}
```

*Figure 23.1: OUSD.sol#450-469*

However, calling `changeSupply` changes the `_totalSupply`, but not the balances of users that have opted out using the `rebaseOptOut`. As a result, it can happen that `_totalSupply` and the balance of a user differ by an arbitrary amount. Put another way, the contract does not satisfy the common EIP-20 invariant that for all accounts, `balanceOf(x) <= totalSupply()`.

Since providing the option to opt out is part of the design of the contract, this issue is difficult to remedy.

## Exploit Scenario

A third-party contract assumes that `totalSupply` is greater than a user’s balance. It is not, and that can lead to unforeseen consequences.

## Recommendation

Short term, we would advise making clear all common invariant violations for users and other stakeholders.

Long term, we would recommend designing the system in such a way to preserve as many commonplace invariants as possible.
