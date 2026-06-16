---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/token
protocol: "[[Basic Attention Token]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/basic-attention-token-bat-audit/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Brave can get an unfair refund if tokenCreationMin is not reached

- id: 12080
- impact: HIGH
- protocol: [[Basic Attention Token]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/basic-attention-token-bat-audit/

## Summary


This bug report is about a situation in which Brave, a company, has been assigned a fixed 300 million BAT tokens when the crowdsale contract is deployed. If the contract doesn't reach the minimum amount of tokens, investors can request a refund and receive their ether back. However, this would also allow Brave to request a refund for the 300 million tokens it holds, taking ether that should be available for investors.

The fix for this bug was to check that funds aren't sent to the `batFundDeposit` address in the `refund` function. This was fixed in commit 09a1038c2ac0148b93876057fc056ae2a872fb88.

## Details

A fixed 300 million BAT tokens are assigned to Brave (specifically to the `batFundDeposit` address) [when the crowdsale contract is deployed](https://github.com/brave-intl/basic-attention-token-crowdsale/blob/17a5f8440a256a6dc5d8dd894b9615182c2901b2/contracts/BAToken.sol#L44). If the contract doesn’t reach the minimum amount of tokens (`tokenCreationMin`), though, it goes into a state where investors can request a refund and receive their ether back.


In this situation, Brave would also be able to request a refund for the 300 million tokens it holds, taking ether that should be available for investors.


Fix this by checking that funds aren’t sent to `batFundDeposit` in the `refund`function.


**Update**: fixed in commit [09a1038c2ac0148b93876057fc056ae2a872fb88](https://github.com/brave-intl/basic-attention-token-crowdsale/commit/09a1038c2ac0148b93876057fc056ae2a872fb88).
