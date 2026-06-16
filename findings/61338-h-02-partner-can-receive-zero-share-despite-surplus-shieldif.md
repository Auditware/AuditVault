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
# [H-02] Partner Can Receive Zero Share Despite Surplus

- id: 61338
- impact: HIGH
- protocol: [[Gluex]] V2
- reporter: Shieldify Security (Shieldify)
- source: https://github.com/shieldify-security/audits-portfolio-md/blob/main/GlueX-V2-Security-Review.md

## Summary


The bug report describes a problem in the contract code that calculates the amount of earnings a partner receives for facilitating transactions. The code does not have a minimum threshold for the percentage of earnings a partner can receive, meaning that a partner could potentially receive no compensation at all. This could lead to a lack of motivation for partners to participate and could also violate agreements with other parties. The recommendation is to add a minimum threshold to ensure that partners always receive some compensation. The team has acknowledged the issue.

## Details


## Severity

High Risk

## Description

The contract calculates `partnerShare` based on the `partnerSurplusShare` and `partnerSlippageShare` percentages provided in the `desc` struct. However, it does not enforce a minimum threshold for these shares, allowing them to be set to zero or an insignificantly low value. This undermines the expected incentive mechanism for partners who facilitate transactions. Without enforcing a floor, a misconfigured or malicious `desc` input can completely exclude a partner from their entitled earnings even when surplus or slippage exists.

## Location of Affected Code

File: [router_v1/GluexRouter.sol#L223-L227](https://github.com/gluexprotocol/gluex_router_contract/blob/9c754a3985fa32b72d847c88c83575f29a86bc01/router_v1/GluexRouter.sol#L223-L227)

```solidity
function swap(
    IExecutor executor,
    RouteDescription calldata desc,
    Interaction[] calldata interactions
) external payable returns (uint256 finalOutputAmount, uint256 surplus, uint256 slippage) {
  // code
  if (surplus > 0 || slippage > 0) {
    uint256 partnerSurplus = (surplus * desc.partnerSurplusShare) / 10000;
    uint256 partnerSlippage = (slippage * desc.partnerSlippageShare) / 10000;
    uint256 partnerShare = partnerSurplus + partnerSlippage;
  }
  // code
}
```

## Impact

Partners may receive no compensation for their participation, reducing incentives for integration and potentially breaching contractual agreements with third-party stakeholders.

## Recommendation

Enforce a minimum threshold for `partnerSurplusShare` and `partnerSlippageShare` to guarantee non-zero rewards.

```diff
+ require(desc.partnerSurplusShare >= MIN_SHARE && desc.partnerSlippageShare >= MIN_SHARE, "partner share too low");
```

## Team Response

Acknowledged.
