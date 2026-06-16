---
tags:
  - lang/solidity
  - sector/staking
  - platform/hexens
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
  - trigger/first-deposit
protocol: "[[Zealous]]"
auditors:
  - "[[Hexens]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-05-26-Zealous.md"
genome:
  - "[[rounding-direction]]"
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[first-deposit]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
---
# [ZLS1-2] First Depositor Can Front-Run and Steal the Next User's Stake

- id: 62427
- impact: HIGH
- protocol: [[Zealous]]
- reporter: Hexens
- source: https://github.com/solodit/solodit_content/blob/main/reports/Hexens/2025-05-26-Zealous.md

## Summary


The report describes a bug in the `ZEALInfinityPool` contract where the `stake()` function can be exploited by an attacker to manipulate the exchange rate and steal funds from other users. The bug occurs due to a rounding error in the calculation of the number of shares minted, which can result in the value being rounded down to zero. The attacker can take advantage of this by artificially inflating the exchange rate using the `addRewards()` function, causing the next user's stake to lose half of its value. This can lead to the attacker making a profit at the expense of other users. The report suggests a potential fix for this issue by burning a certain amount of xZeal tokens, similar to a strategy used in another contract. The bug has been fixed by the developers.

## Details

**Severity:** High

**Path:** contracts/ZEALInfinityPool.sol#L196-L197
contracts/ZEALInfinityPool.sol#L274-L287  

**Description:** The `ZEALInfinityPool.stake()` function mints xZeal shares in exchange for Zeal tokens. The number of shares minted is calculated as follows:
```
1. currentRate = (totalStaked + totalRewards).mulDiv(PRECISION_FACTOR, xSupply);
2. xMint = _amount.mulDiv(PRECISION_FACTOR, currentRate);
```
Since the calculation uses rounding down, `xMint` will be zero if `_amount * PRECISION_FACTOR < currentRate`. An attacker can exploit this by inflating the exchange rate using the `addRewards() `function, effectively making the next user's stake lose half of value.

Exploit Scenario (Assuming `zealPerBlock = 0`)
1. Initial Stake:

    - The attacker stakes `minStakeAmount`, receiving the same amount in xZeal.

    - State:

        - `totalStaked = minStakeAmount`

        - `xZeal.totalSupply() = minStakeAmount`

        - `getExchangeRate() = 1e18`

2. Partial Unstake:

    - The attacker unstakes `minStakeAmount - 1` xZeal.

    - State:

        - `totalStaked = 1`

        - `xZeal.totalSupply() = 1`

        - `getExchangeRate = 1e18`

3. Victim Prepares to Stake:

    - Alice (a regular user) submits a transaction to stake `X` Zeal.

4. Front-Run with Rewards:

    - The attacker front-runs Alice by calling addRewards(X / 2).

    - This increases `totalStaked` without changing `xZeal.totalSupply`, causing the exchange rate to spike.

    - State:

        - `totalStaked = 1 + X / 2`

        - `xZeal.totalSupply() = 1`

        - `getExchangeRate() = (1 + X / 2) * 1e18`

5. Alice's Stake Executes:

    - Alice’s minted shares:

        `xMint = X * 1e18 / ((1 + X / 2) * 1e18) = X / (1 + X / 2)`

        - Due to rounding, `xMint = 1`

Outcome:
The attacker eventually calls `unstake()` to reclaim their Zeal tokens, they will receive:
```
    (X + 1 + X / 2) / 2 
  = (X / 2 + 1) + (X / 4 - 0.5)
```
Here:

- `(X / 2 + 1) `represents the attacker’s initial investment in the strategy.

- `(X / 4 - 0.5)` is the net profit gained from front-running and draining the next user’s stake.
```
uint256 xMint = _amount.mulDiv(PRECISION_FACTOR, currentRate);
require(xMint > 0, "Stake amount too small");
```
```
totalRewards += _amount;
totalManualRewards += _amount;

uint256 xSupply = xZealToken.totalSupply();
uint256 newRate;

if (xSupply == 0) {
    newRate = currentRate;
} else {
    newRate = (totalStaked + totalRewards).mulDiv(
        PRECISION_FACTOR,
        xSupply
    );
}
```

**Remediation:**  Consider burning an initial amount of xZeal tokens (representing dead shares), similar to the approach used in the `ZealousSwapPair` contract.

**Status:**  Fixed


- - -
