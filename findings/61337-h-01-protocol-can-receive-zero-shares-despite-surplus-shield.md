---
tags:
  - lang/solidity
  - platform/shieldify
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Gluex]]"
auditors:
  - "[[Shieldify Security]]"
report: "https://github.com/shieldify-security/audits-portfolio-md/blob/main/GlueX-V2-Security-Review.md"
genome:
  - "[[slippage]]"
  - "[[indirect-loss]]"
  - "[[fot-slippage]]"
---
# [H-01] Protocol Can Receive Zero Shares Despite Surplus

- id: 61337
- impact: HIGH
- protocol: [[Gluex]] V2
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/GlueX-V2-Security-Review.md

## Summary


The bug in the GluexRouter contract causes the protocol to not receive any compensation from a transaction, which can lead to revenue loss and affect the protocol's sustainability. This is because there is no minimum threshold for the `protocolSlippageShare` variable, allowing it to be set to zero or a very small value. To fix this, the team has added a requirement to enforce a minimum threshold for `protocolSlippageShare`.

## Details


## Severity

High Risk

## Description

The contract computes `protocolShare` by subtracting `partnerShare` from `surplus` and adding a portion of `slippage` based on `protocolSlippageShare`. However, there is no enforcement of a minimum threshold for `protocolSlippageShare`, allowing it to be zero or arbitrarily small. This may result in the protocol receiving negligible or no compensation from a transaction that generates a valid surplus and slippage, undermining protocol sustainability and revenue assumptions.

## Location of Affected Code

File: [router_v1/GluexRouter.sol#L230-L232](https://github.com/gluexprotocol/gluex_router_contract/blob/9c754a3985fa32b72d847c88c83575f29a86bc01/router_v1/GluexRouter.sol#L230-L232)

```solidity
function swap(
    IExecutor executor,
    RouteDescription calldata desc,
    Interaction[] calldata interactions
) external payable returns (uint256 finalOutputAmount, uint256 surplus, uint256 slippage) {
  // code
  uint256 protocolSurplus = surplus - partnerShare;
  uint256 protocolSlippage = (slippage * desc.protocolSlippageShare) / 10000;
  uint256 protocolShare = protocolSurplus + protocolSlippage;
  // code
}
```

## Impact

The protocol may be deprived of its expected revenue from transaction surplus and slippage, weakening its economic model and ability to fund operations or rewards.

## Recommendation

Enforce a minimum threshold for `protocolSlippageShare` to ensure consistent protocol compensation.

```diff
+ require(desc.protocolSlippageShare >= MIN_SHARE, "protocol share too low");
```

## Team Response

Fixed.
