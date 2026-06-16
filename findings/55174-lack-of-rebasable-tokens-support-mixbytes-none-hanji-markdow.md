---
tags:
  - lang/solidity
  - sector/algo-stable
  - sector/dex
  - sector/staking
  - sector/token
  - platform/mixbytes
  - has/github
  - severity/high
  - precondition/specific-token-type
protocol: "[[Hanji]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#4-lack-of-rebasable-tokens-support"
genome:
  - "[[reward-calculation]]"
  - "[[specific-token-type]]"
  - "[[locked-funds]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# Lack of rebasable tokens support

- id: 55174
- impact: HIGH
- protocol: [[Hanji]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Hanji/OnchainCLOB/README.md#4-lack-of-rebasable-tokens-support

## Summary


The report is about a bug found in a contract called `LOB` which is used for rebasable tokens. These tokens adjust their supply over time and the bug causes the contract to keep all rewards in its balance. This can lead to incorrect balances being recorded and users not being able to withdraw their full share of assets after a negative rebase. To fix this, the contract should be updated to dynamically adjust records based on the current total supply and the actual balance of the contract.

## Details

##### Description
The issue is identified in the [`LOB`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/OnchainLOB.sol) contract.

For rebasable tokens, such as those that adjust their supply over time (e.g., Ampleforth), the LOB contract may keep all rewards in the contract balance. During a rebase (positive or negative), the recorded balances in the contract may not accurately reflect the true balances of the tokens held. This discrepancy can lead to scenarios where, after a negative rebase (slashing), the remaining users attempting to withdraw may not be able to receive their full share of assets because the contract’s actual balance is less than the sum of the recorded balances.

##### Recommendation
To handle rebasable tokens properly, the contract should dynamically adjust internal records to reflect rebases. This can be done by recalculating balances based on the current total supply and the contract's actual balance.
