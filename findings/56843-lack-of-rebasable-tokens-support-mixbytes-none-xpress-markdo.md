---
tags:
  - lang/solidity
  - sector/algo-stable
  - sector/staking
  - sector/token
  - has/github
  - severity/high
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#4-lack-of-rebasable-tokens-support"
genome:
  - "[[fot-slippage]]"
  - "[[specific-token-type]]"
---
# Lack of rebasable tokens support

- id: 56843
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/OnchainCLOB/README.md#4-lack-of-rebasable-tokens-support

## Summary


The report describes a problem with the `LOB` contract, which is used for rebasable tokens (tokens that adjust their supply over time). The issue is that during a rebase (a change in supply), the recorded balances in the contract may not accurately reflect the true balances of the tokens held. This can lead to situations where users who attempt to withdraw their tokens may not receive their full share because the contract's actual balance is less than the recorded balances. To fix this, the contract should be updated to dynamically adjust internal records based on the current total supply and the contract's actual balance.

## Details

##### Description
The issue is identified in the [`LOB`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/OnchainLOB.sol) contract.

For rebasable tokens, such as those that adjust their supply over time (e.g., Ampleforth), the LOB contract may keep all rewards in the contract balance. During a rebase (positive or negative), the recorded balances in the contract may not accurately reflect the true balances of the tokens held. This discrepancy can lead to scenarios where, after a negative rebase (slashing), the remaining users attempting to withdraw may not be able to receive their full share of assets because the contract’s actual balance is less than the sum of the recorded balances.

##### Recommendation
To handle rebasable tokens properly, the contract should dynamically adjust internal records to reflect rebases. This can be done by recalculating balances based on the current total supply and the contract's actual balance.
