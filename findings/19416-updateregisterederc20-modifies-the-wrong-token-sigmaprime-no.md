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
# updateRegisteredErc20() modifies the wrong token

- id: 19416
- impact: HIGH
- protocol: [[Interest Protocol]]
- reporter: Sigma Prime (SigmaPrime)
- source: https://github.com/sigp/public-audits/blob/master/reports/interest-protocol/review.pdf

## Summary


The bug report is about an issue in the updateRegisteredErc20() function of the Interest Protocol Smart Contracts. This function is used to update the collateral token's oracle address and LTV, however, the code is using the variable _tokensRegistered as the token ID, which is the token ID of the last token added, not necessarily the ID of the token being updated. If the function were called with the intention of updating one token but instead having the effect of updating another token’s LTV, the results could significantly damage the protocol. This could lead to many vaults that were previously solvent being immediately rendered insolvent and be liquidated, as well as a thousand dollar token suddenly being valued at a couple of dollars.

The recommendation is to modify updateRegisteredErc20() to retrieve a token’s ID based on the parameter token_address. Then use this token ID in place of _tokensRegistered. The bug has since been resolved in commit [b447c19].

## Details

Description
updateRegisteredErc20() updates incorrect collateral token’s oracle address and LTV.
Line [ 264] and line [ 266] of updateRegisteredErc20() both update variables based on the token ID. However, these
lines use the variable _tokensRegistered as the token ID, which is the token ID of the last token added, not necessarily
the ID of the token being updated. This is likely code copied from the previous function, registerErc20() , where the
ID of the token being updated is always the most recent token added, as that is the function which actually adds it.
function updateRegisteredErc20 (
address token_address ,
uint256 LTV,
address oracle_address ,
uint256 liquidationIncentive
) external override onlyOwner {
// (...)
// SigP: Note _tokensRegistered is used below, instead of token_address passed in as a parameter to this function.
// set the oracle of the token
_tokenId_oracleAddress [_tokensRegistered ] = oracle_address ;
// set the ltv of the token
_tokenId_tokenLTV [_tokensRegistered ] = LTV;
IfupdateRegisteredErc20() were called with the intention of updating one token but instead having the effect of
updating another token’s LTV, the results could significantly damage the protocol. Many vaults that were previously
solvent could be immediately rendered insolvent and be liquidated.
Similarly, installing the oracle address for the wrong token could result in a thousand dollar token suddenly being valued
at a couple of dollars. Vaults borrowing against that token would then go insolvent, be fully liquidated, and the token
would be transferred to the liquidator for a thousandth of its value.
Recommendations
Modify updateRegisteredErc20() to retrieve a token’s ID based on the parameter token_address . Then use this token
ID in place of _tokensRegistered .
Resolution
3Resolved in commit [b447c19]
Page | 6
Interest Protocol Smart Contracts Detailed Findings
INT-02 Interest accrual whilst the VaultController is paused
