---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - sector/streaming
  - sector/token
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Radiant]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/radiant"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[permanent]]"
  - "[[fee-accounting]]"
---
# Incorrect Accounting of earned and unlocked Tokens on exit May Brick the Protocol

- id: 32846
- impact: HIGH
- protocol: [[Radiant]] V2 Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/radiant

## Summary


The `exit` function in the `MultiFeeDistribution` contract is responsible for withdrawing RDNT tokens that are unlocked and still in vesting. However, it is not updating the balances correctly, which can cause issues with other functions in the contract. This can lead to unexpected results and potentially break the contract. To fix this, it is recommended to reset the balances to 0 in the `exit` function. This issue has been resolved in a recent update to the contract.

## Details

The [`exit`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L927-L937) function within the `MultiFeeDistribution` contract is responsible for withdrawing RDNT tokens (earnings) that are already unlocked and still in vesting. It is using [`withdrawableBalance`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L929) to calculate the balance that can be withdrawn, and then it releases the tokens to the user via [`_withdrawTokens`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L936).


While the function is correctly deleting [`userEarnings`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L931), it is not updating the `unlocked` and `earned` balances to `0`, which is where the [`withdrawableBalance`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L522-L541) function gets the data from.


A regular call to `exit` will break that user's internal accounting for earnings and lockings, leading to reverts for crucial functionalities of the system and thus, causing unexpected results and potentially bricking most of the `MultiFeeDistribution` contract alongside other parts of the protocol.


The following features will be impacted by the incorrect value of earned or unlocked tokens:


* The [`exit`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L927-L937) function will be reverting when updating the value of [`total`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L934).
* The [`withdrawableBalance`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L522-L540) function will be returning an incorrect value.
* The [`withdraw`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L805-L862) function will be reverting when updating value of [`total`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L859).
* The [`earnedBalances`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L479-L505) function will be returning anincorrect value.


In order to maintain a correct internal accounting of user balances, it is recommended to reset both the `unlocked` and `earned` balances to `0` in the [`exit`](https://github.com/radiant-capital/v2-core/blob/e8f21f103e17736907b62809d1ad902febc53714/contracts/radiant/staking/MultiFeeDistribution.sol#L927-L937) function.


***Update:** Resolved in [pull request #66](https://github.com/radiant-capital/v2-core/pull/66) at commit [1830760](https://github.com/radiant-capital/v2-core/commit/18307607b7491c8bb3fb7cfbb253aa40fc49060e). Both `unlocked` and `earned` values are now reset to `0` within the `exit` function.*
