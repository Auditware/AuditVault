---
tags:
  - lang/solidity
  - sector/dex
  - platform/pashov
  - has/github
  - severity/high
  - fix/use-reentrancy-guard
protocol: "[[Catalyst]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Catalyst-security-review-april.md"
genome:
  - "[[single-function]]"
  - "[[use-reentrancy-guard]]"
  - "[[permanent]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
---
# [H-01] Broken mint if market pre-mint less than `p`

- id: 36311
- impact: HIGH
- protocol: [[Catalyst]]
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Catalyst-security-review-april.md

## Summary

This bug report discusses an issue with the `mint` function in a market contract. When the market is created, it allows for the `params.premint` and `p` values to be different, as long as `params.premint` is lower and results in 0 when provided to `getBuyPrice`. However, when the `mint` function is called, it checks against `params.premint` instead of `p`, which can cause issues if `p` is greater than `params.premint`. This can lead to users who want to mint the remaining free pre-mint from `p` always reverting because the net will be 0. The recommendation is to check against `p` from the curve parameters instead of `params.premint`.

## Details

**Severity**

**Impact:** Medium

**Likelihood:** High

**Description**

When market is created, it is allowed that `params.premint` and the `p` configured inside `params.curveParameters` is different, as long as `params.premint` is lower and result in 0 when provided to `getBuyPrice`.

```solidity
  function checkParameters(MarketParameters memory params) public view virtual {
    if (!trustedCurves[address(params.priceCurve)]) {
      revert UntrustedCurve();
    }

    // reverts if parameters are out of sanity range
    params.priceCurve.checkParameters(params.curveParameters, params.fundingGoal);

    //the "premint" parameter can be different from the curve's premint parameter
    if (params.priceCurve.getBuyPrice(0, params.premint, params.curveParameters) != 0) {
      revert ParameterMismatch();
    }

    // check that the deadline isn't too far in the future (eg millisecond issues)
    if (params.deadline > block.timestamp + 10 * 365 days) {
      revert ParameterMismatch();
    }
  }
```

However, when mint is called, it will check against `params.premint`, which is not correct and will cause issue if the actual `p` parameter is greater than `params.premint`.

```solidity
  function mint(uint256 tokenId, uint256 amount)
    external
    payable
    nonReentrant
    returns (uint256 gross, uint256 net, uint256 tokensToMint)
  {
    MarketData storage market = markets[tokenId];
    if (market.state != MarketState.OPEN) {
      revert BadState(MarketState.OPEN, market.state);
    }

    MarketParameters memory _marketParams = marketParams[tokenId];

    if (trySettle(tokenId) > MarketState.OPEN) {
      //this allows settling the market implicitly without reverting
      Address.sendValue(payable(_msgSender()), msg.value);
      return (0, 0, 0);
    }

    uint256 tradingFee;
    //when buying, gross > net
    (gross, net, tradingFee) = getBuyPrice(tokenId, amount);

    // revert trades that require too low volume but still allow premints that require 0 value
    if (
>>>   totalSupply(tokenId) + amount > _marketParams.premint // @audit - premint here can be lower than the actual `p`
        && (amount < MINIMUM_TRADE_SIZE || net == 0)
    ) {
      revert TradeSizeOutOfRange();
    }
   // ...
}
```

Users who only want to mint the rest of the free pre-mint from the actual `p` inside curve parameters will always revert because the net will be 0.

**Recommendations**

Consider checking against the `p` from curve parameters instead of `_marketParams.premint`.

```diff
+  (, uint256 p) = _marketParams.priceCurve.decodeParameters(_marketParams.curveParameters);
    if (
-      totalSupply(tokenId) + amount > _marketParams.premint
+      totalSupply(tokenId) + amount > p
        && (amount < MINIMUM_TRADE_SIZE || net == 0)
    ) {
      revert TradeSizeOutOfRange();
    }
```
