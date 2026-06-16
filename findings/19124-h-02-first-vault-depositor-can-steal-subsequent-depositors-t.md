---
tags:
  - lang/solidity
  - sector/dex
  - sector/token
  - platform/pashov-audit-group
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/mev/backrun
  - impact/mev/frontrun
  - trigger/first-deposit
protocol: "[[Yield Ninja]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2022-11-01-Yield Ninja.md"
genome:
  - "[[precision-loss]]"
  - "[[direct-drain]]"
  - "[[backrun]]"
  - "[[frontrun]]"
  - "[[first-deposit]]"
  - "[[frontrun-exposure]]"
---
# [H-02] First vault depositor can steal subsequent depositors’ tokens

- id: 19124
- impact: HIGH
- protocol: [[Yield Ninja]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2022-11-01-Yield Ninja.md

## Summary


This bug report outlines a scenario in which a malicious actor (MEV bot) can exploit a vulnerability in a vault deployment to cause 100% value loss for subsequent depositors. The MEV bot can front run Alice's transaction by depositing 1 wei of underlying, resulting in him receiving 1 wei of vault tokens. The MEV bot then backruns Alice's transaction to withdraw his deposit plus Alice's whole deposit. UniswapV2 has implemented two types of protection to address this vulnerability. The first protection mints the first 1000 shares to the zero-address on the first mint, and the second protection requires that the minted shares are not 0. Implementing these two protections will resolve this vulnerability.

## Details

**Proof of Concept**

Imagine the following scenario:

1. A new vault has been deployed and configured, no depositors yet
2. Alice wants to deposit 10 ether(10e18) worth of `underlying` and sends a transaction to the public mempool
3. A MEV bot sees Alice’s transaction and front runs it by depositing 1 wei(1e-18) of `underlying`, resulting in him receiving 1 wei(1e-18) of vault tokens (shares)
4. The MEV bot also front runs Alice’s transaction with a transfer of 10 ether(10e18) of `underlying` to the vault via `ERC20::transfer`
5. Now the code calculates Alice’s shares as `shares = (_amount * totalSupply()) / _pool;` which is 10e18 \* 1 / (10e18 + 1) which is 0
6. Alice gets minted 0 shares, but she deposited 10e18 of `underlying`
7. Now the MEV bot backruns Alice’s transaction calling `withdraw` with his 1e-18 (1 wei) of share, which is the total supply, so he withdraws his deposit + Alice’s whole deposit

This can be replayed multiple times until the depositors notice the problem.

**Impact**

The result of this is 100% value loss for all subsequent depositors.

**Recommendation**

UniswapV2 fixed this with two types of protection:

[First](https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol#L119-L121), on the first `mint` it actually mints the first 1000 shares to the zero-address

[Second](https://github.com/Uniswap/v2-core/blob/ee547b17853e71ed4e0101ccfd52e70d5acded58/contracts/UniswapV2Pair.sol#L125), it requires that the minted shares are not 0

Implementing them both will resolve this vulnerability.
