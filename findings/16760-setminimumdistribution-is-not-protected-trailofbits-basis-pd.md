---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - has/poc
  - severity/high
  - sector/token
protocol: "[[Basis]]"
auditors:
  - "[[Gustavo Grieco]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/basis.pdf"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
---
# setMinimumDistribution is not protected

- id: 16760
- impact: HIGH
- protocol: [[Basis]]
- reporter: Gustavo Grieco (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/basis.pdf

## Summary


This bug report is about an issue with the Access Controls of Basis.sol (v1). It is classified as a high difficulty bug. The bug is related to the function setMinimumDistribution in MultiDistributor which allows a trusted participant to add a distribution into the tokens list. The documentation states that this method should only be used by trusted participants, however, this requirement is not implemented, meaning any user can add distributions into the tokens list. This could lead to Bob calling the setMinimumDistribution a large number of times to extend the tokens list and increase the gas cost of related operations.

To fix this issue in the short term, MultiDistributor should be ownable, controllable or whitelistable to implement proper user validation for setMinimumDistribution. In the long term, all public contract methods should be carefully reviewed to ensure they are only callable by authorized users and unit tests should be implemented to validate the implementation.

## Details

## Access Controls Report

**Type:** Access Controls  
**Target:** Basis.sol (v1)  

**Difficulty:** High  

## Description  
An attacker can call the `setMinimumDistribution` function in `MultiDistributor` to add useless values to the tokens list and increase the gas cost of all related functions. The `setMinimumDistribution` function allows a trusted participant to add a distribution into the tokens list.

> The minimum distribution requirement is to prevent DOS attack via many negligible distributions. Thus, this method should ONLY be used by trusted participants. A minimum distribution of zero prevents any and all distributions of this token.

```solidity
function setMinimumDistribution(address token, uint256 tokenMinDistribution) public {
    uint256 idx = tokenIdx[token];
    if (idx == 0) {
        tokenIdx[token] = idx = tokens.length;
        tokens.push(token);
    }
    minDistribution[idx] = tokenMinDistribution;
}
```

**Figure 1:** The `MultiDistributor` implementation of `setMinimumDistribution`  

The documentation indicates that this method should be "ONLY be used by trusted participants," but that requirement is not implemented, so any user could add distributions into the tokens list.

## Exploit Scenario  
Bob calls the `setMinimumDistribution` a large number of times to extend the tokens list and increase the gas cost of related operations.

## Recommendation  
In the short term, `MultiDistributor` should be ownable, controllable, or whitelistable in order to implement proper user validation for `setMinimumDistribution`. Select one of these alternatives and protect the function so only trusted participants can use it.

In the long term, carefully review all public contract methods to ensure that they are only callable by authorized users. Implement unit tests to validate the implementation.

**Note:** This issue was related to minting and burning operations not appropriately updating Basis token distributions. Upon further investigation and a discussion with Basis, it was determined that this was expected functionality.
