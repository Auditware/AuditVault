---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/token
protocol: "[[EtherCamp]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/ethercamps-decentralized-startup-team-public-code-audit-65f4ce8f838d/"
genome:
  - "[[wrong-condition]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[cross-contract-state-consistency]]"
---
# issuePreferedTokens vulnerable to multiple calls

- id: 12158
- impact: HIGH
- protocol: [[EtherCamp]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/ethercamps-decentralized-startup-team-public-code-audit-65f4ce8f838d/

## Summary


This bug report is about an issue with the DSTContract.sol file in the virtual-accelerator repository on GitHub. If the issuePrefered function is called twice, the second time line 208 is executed, the old value of allowed[this][virtualExchangeAddress] will be overwritten. This issue has been fixed with the commit deae2e7147f91120dcc8055545a201083d7aae86.

## Details

If issuePrefered is called twice, the second time [line 208 is executed](https://github.com/ether-camp/virtual-accelerator/blob/6d4097a08669c2520e0d5bab317b60f1d13df44e/contracts/DSTContract.sol#L208), the old value of `allowed[this][virtualExchangeAddress]` will be overwritten.


EDIT: Commit with fix: <https://github.com/ether-camp/virtual-accelerator/commit/deae2e7147f91120dcc8055545a201083d7aae86>
