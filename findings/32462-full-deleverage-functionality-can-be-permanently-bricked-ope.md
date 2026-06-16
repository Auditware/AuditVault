---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/lending
  - sector/nft-marketplace
protocol: "[[Ion Protocol]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/ion-protocol-seaport-ezeth-and-rseth-integration-audit"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Full Deleverage Functionality Can Be Permanently Bricked

- id: 32462
- impact: HIGH
- protocol: [[Ion Protocol]] Seaport, ezETH and rsETH Integration Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/ion-protocol-seaport-ezeth-and-rseth-integration-audit

## Summary


The report states that there is a bug in the code for the `SeaportDeleverage` contract, specifically in the `seaportCallback4878572495` function. This function has a requirement that the `BASE` token balance of the contract must be `0` after a full deleverage. However, if a user has transferred any amount of `BASE` tokens into the contract, this requirement will always fail and the contract will be permanently unusable. The report suggests removing this requirement or modifying it to check for changes in the token balance instead. Another solution proposed is to transfer any unneeded `BASE` tokens back to the user or implementing a "rescue" function to remove stranded tokens. The bug has been resolved in a recent update.

## Details

In the [`seaportCallback4878572495` function](https://github.com/Ion-Protocol/ion-seaport/blob/54110bbfbe56d18390d4e9c9f8fc9fb973500da6/src/SeaportDeleverage.sol#L266) within the [`SeaportDeleverage`](https://github.com/Ion-Protocol/ion-seaport/blob/54110bbfbe56d18390d4e9c9f8fc9fb973500da6/src/SeaportDeleverage.sol#L82) contract, there is [a requirement](https://github.com/Ion-Protocol/ion-seaport/blob/54110bbfbe56d18390d4e9c9f8fc9fb973500da6/src/SeaportDeleverage.sol#L290) that the `BASE` token balance of the contract is `0` after a full deleverage.


However, this will always revert if a user has independently transferred any amount of `BASE` tokens into the [`SeaportDeleverage`](https://github.com/Ion-Protocol/ion-seaport/blob/54110bbfbe56d18390d4e9c9f8fc9fb973500da6/src/SeaportDeleverage.sol#L82) contract. Since there is no way to transfer the tokens out of the contract, a single transfer will permanently brick the contract.


Consider removing this check, or modifying it to instead check that the token balance of the contract has not changed since the beginning of the execution flow. Alternatively, consider either modifying the logic to transfer all unneeded `BASE` tokens to the user, or implementing a "rescue" function to remove stranded `BASE` tokens.


***Update:** Resolved in [pull request #3](https://github.com/Ion-Protocol/ion-seaport/pull/3). The sanity check was removed to prevent bricking of the contract.*
