---
tags:
  - lang/solidity
  - sector/algo-stable
  - sector/staking
  - sector/token
  - has/github
  - severity/high
protocol: "[[XPress Protocol]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#4-lack-of-rebasable-tokens-support"
genome:
  - "[[fot-slippage]]"
  - "[[specific-token-type]]"
---
# Lack of rebasable tokens support

- id: 53806
- impact: HIGH
- protocol: XPress Protocol
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress%20Protocol/OnchainCLOB/README.md#4-lack-of-rebasable-tokens-support

## Summary


The report discusses an issue found in the `LOB` contract, which deals with tokens that change their supply over time. This can cause a discrepancy between the recorded balances in the contract and the actual balances of the tokens held, leading to users not being able to withdraw their full share of assets after a negative rebase. To fix this, the contract should dynamically adjust internal records to reflect rebases by recalculating balances based on the current total supply and the contract's actual balance.

## Details

##### Description
The issue is identified in the [`LOB`](https://github.com/longgammalabs/hanji-contracts/blob/09b6188e028650b9c1758010846080c5f8c80f8e/src/OnchainLOB.sol) contract.

For rebasable tokens, such as those that adjust their supply over time (e.g., Ampleforth), the LOB contract may keep all rewards in the contract balance. During a rebase (positive or negative), the recorded balances in the contract may not accurately reflect the true balances of the tokens held. This discrepancy can lead to scenarios where, after a negative rebase (slashing), the remaining users attempting to withdraw may not be able to receive their full share of assets because the contract’s actual balance is less than the sum of the recorded balances.

##### Recommendation
To handle rebasable tokens properly, the contract should dynamically adjust internal records to reflect rebases. This can be done by recalculating balances based on the current total supply and the contract's actual balance.
