---
tags:
  - lang/solidity
  - sector/staking
  - platform/cantina
  - severity/high
  - impact/mev/frontrun
protocol: "[[ZeroLend]]"
auditors:
  - "[[Ch301]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_zerolend_jan2024.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[frontrun]]"
  - "[[access-roles]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[timestamp-dependence]]"
---
# DoS in distribute() 

- id: 40819
- impact: HIGH
- protocol: [[ZeroLend]]
- reporter: Ch301 (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_zerolend_jan2024.pdf

## Summary


The StakingEmissions contract has a function called distribute() that is supposed to transfer a certain amount of VestedZeroLend tokens to a feeDistributor every week. However, there is a problem with the feeDistributor.checkpointToken() function, which can only be called once every day. This means that if someone tries to call distribute() more than once a day, it will fail. This could happen if someone is trying to cheat the system or if innocent users are trying to claim their rewards. This bug could prevent the distribution of rewards and cause delays. The recommended solution is to modify the checkpointToken() function to only call _checkpointToken() if a day has passed since the last call. This will prevent the bug from occurring. 

## Details

## StakingEmissions.sol Issue and Recommendation

## Context
- **File:** StakingEmissions.sol  
- **Line:** 57

Currently, `StakingEmissions.distribute()` is triggered once every 1 week to transfer `VestedZeroLend` to `feeDistributor`, and then users claim from `feeDistributor`:

```solidity
function _distribute() internal checkEpoch whenNotPaused {
    feeDistributor.checkpointToken();
    feeDistributor.checkpointTotalSupply();
    token.transfer(address(feeDistributor), amtPerEpoch);
}
```

The problem is that `feeDistributor.checkpointToken()` has a frequency limit:

```solidity
function checkpointToken() external override {
    require(
        (block.timestamp > lastTokenTime + TOKEN_CHECKPOINT_DEADLINE),
        "cant checkpoint now"
    );
    _checkpointToken(block.timestamp);
}
```

The execution interval needs to be 1 day; otherwise, the call will revert. This may indefinitely prevent the execution of `StakingEmissions.distribute()` in the following two situations:

1. Malicious users front-run `StakingEmissions.distribute()`, preemptively calling `feeDistributor.checkpointToken()`.
2. Innocent users executing `FeeDistributor.claim(id)` will also trigger `feeDistributor.checkpointToken()`, causing `StakingEmissions.distribute()` to fail.

The distribution of rewards may be maliciously or unintentionally blocked, preventing normal distribution, possibly delaying until next week, or even longer.

## Recommendation
Modify `checkpointToken()` as follows:

```solidity
function checkpointToken() external override {
    // Old code
    // require(
    //     (block.timestamp > lastTokenTime + TOKEN_CHECKPOINT_DEADLINE),
    //     "cant checkpoint now"
    // );
    // _checkpointToken(block.timestamp);
    
    // New code
    if ((block.timestamp > lastTokenTime + TOKEN_CHECKPOINT_DEADLINE)) {
        _checkpointToken(block.timestamp);
    }
}
```
