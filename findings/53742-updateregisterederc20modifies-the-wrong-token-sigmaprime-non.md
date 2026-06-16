---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - platform/sigmaprime
  - has/github
  - severity/high
  - vuln/pda/missing-seeds-check
  - novelty/variant
  - fix/add-check
protocol: "[[Interest Protocol]]"
auditors:
  - "[[Sigma Prime]]"
report: "https://github.com/sigp/public-audits/blob/master/reports/interest-protocol/review.pdf"
genome:
  - "[[missing-seeds-check]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
  - "[[pda-derivation]]"
---
# updateRegisteredErc20()modifies the wrong token

- id: 53742
- impact: HIGH
- protocol: [[Interest Protocol]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/interest-protocol/review.pdf

## Summary


This bug report is about an issue with a function called `updateRegisteredErc20()`. This function is supposed to update the oracle address and loan-to-value ratio (LTV) for a specific collateral token. However, there is a problem with the code that could cause it to update the wrong token's information. This could have serious consequences for the protocol, such as making previously solvent vaults insolvent and causing tokens to be undervalued. The report recommends modifying the function to use the correct token ID when updating the information. This issue has been resolved in a recent commit.

## Details

## Description

`updateRegisteredErc20()` updates incorrect collateral token’s oracle address and LTV. Line [264] and line [266] of `updateRegisteredErc20()` both update variables based on the token ID. However, these lines use the variable `_tokensRegistered` as the token ID, which is the token ID of the last token added, not necessarily the ID of the token being updated. This is likely code copied from the previous function, `registerErc20()`, where the ID of the token being updated is always the most recent token added, as that is the function which actually adds it.

```solidity
function updateRegisteredErc20(
    address token_address,
    uint256 LTV,
    address oracle_address,
    uint256 liquidationIncentive
) external override onlyOwner {
    // (...)
    // SigP: Note _tokensRegistered is used below, instead of token_address passed in as a parameter to this function.
    // set the oracle of the token
    _tokenId_oracleAddress[_tokensRegistered] = oracle_address;
    // set the ltv of the token
    _tokenId_tokenLTV[_tokensRegistered] = LTV;
}
```

If `updateRegisteredErc20()` were called with the intention of updating one token but instead having the effect of updating another token’s LTV, the results could significantly damage the protocol. Many vaults that were previously solvent could be immediately rendered insolvent and be liquidated. Similarly, installing the oracle address for the wrong token could result in a thousand dollar token suddenly being valued at a couple of dollars. Vaults borrowing against that token would then go insolvent, be fully liquidated, and the token would be transferred to the liquidator for a thousandth of its value.

## Recommendations

Modify `updateRegisteredErc20()` to retrieve a token’s ID based on the parameter `token_address`. Then use this token ID in place of `_tokensRegistered`.

## Resolution

Resolved in commit [b447c19].
