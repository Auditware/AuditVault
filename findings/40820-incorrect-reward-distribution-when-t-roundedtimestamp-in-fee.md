---
tags:
  - lang/solidity
  - platform/cantina
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/token
protocol: "[[ZeroLend]]"
auditors:
  - "[[0xarno]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_zerolend_jan2024.pdf"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Incorrect reward distribution when t == roundedtimestamp in feedistributor.sol contract 

- id: 40820
- impact: HIGH
- protocol: [[ZeroLend]]
- reporter: 0xarno (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_zerolend_jan2024.pdf

## Summary


The FeeDistributor contract has a vulnerability that may result in incorrect reward distribution when a transaction occurs at the beginning of an epoch. This is due to a miscalculation in the _checkpointTotalSupply function, which can result in users receiving incorrect rewards. To fix this issue, it is recommended to update the function with a specific code. This type of vulnerability is common in similar codebases.

## Details

## Vulnerability Analysis of FeeDistributor.sol

## Context
- **File**: FeeDistributor.sol
- **Line**: 156

## Description
The `FeeDistributor` contract has a vulnerability that leads to incorrect reward distribution when a transaction occurs at the beginning of an epoch. The issue is related to the `_checkpointTotalSupply` function, where the reward calculation may be inaccurate when the timestamp exactly matches the rounded timestamp. This can result in incorrect reward amounts for users. 

`FeeDistributor` distributes newly minted tokens to users who lock the tokens in `ZeroLocker`. The `FeeDistributor` stores the supply in the public `veSupply` mapping. The `_checkpointTotalSupply` function iterates from the last updated time until the latest epoch time, fetches `totalSupply` from `ZeroLocker`, and saves it.

The impact of this vulnerability is that users may receive incorrect rewards when interacting with the `FeeDistributor` contract. Specifically, when a transaction occurs at the beginning of an epoch and the timestamp matches the rounded timestamp, the reward calculation for subsequent transactions will be inaccurate.

## Proof of Concept
Assume the following scenario when a transaction is executed at the beginning of an epoch:
1. Alice locks 100 tokens, and the supply of `Zero` increases to 100.
2. Bob calls the `checkpointTotalSupply`. The `FeeDistributor` saves the `totalSupply` as 100.
3. Bob locks 300 tokens, and the supply of `Zero` increases to 400.
4. After some time, Bob claims the reward. The reward is calculated by `totalReward * balance / supply`. However, due to the vulnerability, Bob gets `reward = 3` instead of the expected `reward = 3/4`.

The invariance of the week-bound total supply is broken, as described in `FeeDistributor.sol#L39`.

> **Note**: This kind of vulnerability is common in similar type of codebases.

## Recommendation
It is recommended to update the `_checkpointTotalSupply` function as follows:

```solidity
function _checkpointTotalSupply(uint256 timestamp) internal {
    uint256 t = timeCursor;
    uint256 roundedTimestamp = (timestamp / WEEK) * WEEK;
    locker.checkpoint();
    for (uint256 index = 0; index < 20; index++) {
        - if (t > roundedTimestamp) {
        + if (t >= roundedTimestamp) {
            break;
        } else {
            uint256 epoch = _findTimestampEpoch(t);
            IZeroLocker.Point memory pt = locker.pointHistory(epoch);
            int128 dt = 0;
            if (t > pt.ts) dt = int128(uint128(t - pt.ts));
            veSupply[t] = Math.max(uint128(pt.bias - pt.slope * dt), 0);
        }
        t += WEEK;
    }
    timeCursor = t;
}
```
