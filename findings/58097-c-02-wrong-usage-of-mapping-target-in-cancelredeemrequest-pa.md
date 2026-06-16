---
tags:
  - lang/solidity
  - sector/farm
  - sector/token
  - has/github
  - severity/high
protocol: "[[Astrolab]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[use-reentrancy-guard]]"
---
# [C-02] Wrong usage of mapping target in `cancelRedeemRequest``

- id: 58097
- impact: HIGH
- protocol: Astrolab
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Astrolab-security-review.md

## Summary


This bug report describes a high severity issue in a contract that allows users to burn tokens belonging to others. The likelihood of this happening is also high, as it can be done without permission. The problem lies in the `cancelRedeemRequest()` function, which does not check if the operator has permission to burn the owner's tokens. Additionally, the code uses `req.byOperator[operator]` instead of `req.byOperator[owner]`, which further exacerbates the issue. The report includes a proof of concept, which demonstrates how an attacker can exploit this vulnerability by manipulating the price of tokens. The report also recommends making changes to the `cancelRedeemRequest()`, `requestRedeem()`, and `_withdraw()` functions to prevent similar issues from arising.

## Details

## Severity

**Impact:** High, one can burn others' tokens

**Likelihood:** High, it can be done permissionless

## Description

Users can call `cancelRedeemRequest()` can cancel their redeem requests and code would burn the excess shares from the loss incurred while not farming with the idle funds (opportunity cost). The issue is that code doesn't check that operator have allowance over owner's funds and one can call this function and burn others tokens.

also the second mistake is that code uses `req.byOperator[operator]` instead of the `req.byOperator[owner]`.

This is the POC:

1. attacker will create a redeem request when the price in the contract is 1.5 for hist ADD1 address and AMOUNT1.
2. after some time attacker that price() in the contract is 2 attacker can call `cancelRedeemRequest(owner=target_user, operator=ADD1)` with his ADD1 address.
3. now because `msg.sender == operator` code would allow the call and also there is no allowance check for owner and operator.
4. in the end because price has increased from 1.5 to 2 code would burn some of owner's shares.

```solidity
    function cancelRedeemRequest(
        address operator,
        address owner
    ) external nonReentrant {

        if (owner != msg.sender && operator != msg.sender)
            revert Unauthorized();

        Erc7540Request storage request = req.byOperator[operator];
        uint256 shares = request.shares;

        if (shares == 0) revert AmountTooLow(0);

        last.sharePrice = sharePrice();

        if (last.sharePrice > request.sharePrice) {
            // burn the excess shares from the loss incurred while not farming
            // with the idle funds (opportunity cost)
            uint256 opportunityCost = shares.mulDiv(
                last.sharePrice - request.sharePrice,
                weiPerShare
            ); // eg. 1e8+1e8-1e8 = 1e8
            _burn(owner, opportunityCost);
        }

```

There is similar bug in the `requestRedeem()` and `_withdraw()` that require attention too.

## Recommendations

In `cancelRedeemRequest()` use `req.byOperator[owner]` and also make sure operator have allowance over owner tokens.
In `requestRedeem()` code should save information in `req.byOperator[owner]` and also confirms that operator have allowance over owner funds.
Use `req.byOperator[_owner]` in \_withdraw().
