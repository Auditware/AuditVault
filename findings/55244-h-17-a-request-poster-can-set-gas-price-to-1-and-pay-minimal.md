---
tags:
  - lang/rust
  - lang/solidity
  - sector/staking
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
protocol: "[[SEDA Protocol]]"
auditors:
  - g
report: "https://github.com/sherlock-audit/2024-12-seda-protocol-judging"
genome:
  - "[[fee-accounting]]"
  - "[[variant]]"
---
# H-17: A request poster can set gas_price to 1 and pay minimal fees for a lot of gas and drain validators' resources

- id: 55244
- impact: HIGH
- protocol: SEDA Protocol
- reporter: g (Sherlock)
- source: N/A

## Summary


The SEDA Core contract has a bug that allows request posters to set a gas price of 1 and pay minimal fees, causing a drain on validators' resources. This is due to a lack of validation on the gas price in the `post_request()` function. This can be exploited by submitting a valid data request with a gas price of 1 and a high replication factor, causing the Tally module to execute the Tally Program with a high gas limit and potentially causing chain delays or halts. The protocol team has fixed this issue in a recent PR. To mitigate this issue, it is recommended to require a minimum gas price for data requests. 

## Details

Source: https://github.com/sherlock-audit/2024-12-seda-protocol-judging/issues/256 

## Found by 
g

### Summary

Due to a lack of validation on `gas_price`, anyone can post a request to the SEDA Core contract that will consume a lot
of resources of validators.

### Root Cause

In [`post_request():9-102`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain-contracts/contract/src/msgs/data_requests/execute/post_request.rs#L9-L102), no validations are done on the `gas_price` and the amount of funds that are [required](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain-contracts/contract/src/msgs/data_requests/execute/post_request.rs#L32-L33) from the
poster is just the `total gas limit * gas price`.

```rust
let required = (Uint128::from(self.posted_dr.exec_gas_limit) + Uint128::from(self.posted_dr.tally_gas_limit))
    .checked_mul(self.posted_dr.gas_price)?;
```

Since there is no minimum `gas_price`, the request poster can set it to 1.

### Internal Pre-conditions
None


### External Pre-conditions
None


### Attack Path
1. A request poster will submit a valid data request with `gas_price` set to 1, 1 replication factor, tally gas limit set to the max.
2. A malicious validator commit-reveals a result for this data request and its status changes to "tallying".
3. In the Tally module's [`EndBlock()`](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/endblock.go#L22-L41), all "tallying" data requests will be processed. When the malicious data request is processed, it [executes](https://github.com/sherlock-audit/2024-12-seda-protocol/blob/main/seda-chain/x/tally/keeper/endblock.go#L210) the Tally Program with the tally gas limit. 
4. The Tally Program executed can allocate the maximum memory by using imports and loop until the tally gas limit is reached to inflate
memory usage and block execution as long as possible. The inflated memory use lasts as long as the tally program has not exited.


### Impact

Inflated resource use on validators running the Tally `EndBlock()` will cause chain delays or chain halts in the worst case.


### PoC
None


### Mitigation
Consider requiring a minimum `gas_price` per data request.

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/sedaprotocol/seda-chain-contracts/pull/279
