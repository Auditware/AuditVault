---
tags:
  - lang/solidity
  - sector/lending
  - sector/staking
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/backrun
  - impact/mev/frontrun
  - impact/mev/sandwich
  - trigger/sandwich-attack
protocol: "[[LoopFi]]"
auditors:
  - "[[0xnev]]"
report: "https://code4rena.com/reports/2024-05-loop"
genome:
  - "[[wrong-condition]]"
  - "[[backrun]]"
  - "[[frontrun]]"
  - "[[sandwich]]"
  - "[[defi/sandwich-attack]]"
  - "[[frontrun-exposure]]"
---
# [H-01] Availability of deposit invariant can be bypassed

- id: 33354
- impact: HIGH
- protocol: [[LoopFi]]
- reporter: 0xnev (Code4rena)
- source: https://code4rena.com/reports/2024-05-loop

## Summary


The bug report discusses an issue with the code for the Loop project. The report mentions a specific rule, called an "invariant," that is supposed to be followed by the code. However, there are two ways that this rule can be broken, allowing users to gain tokens without following the proper steps. The report provides two scenarios where this could happen and suggests potential fixes for each scenario. The severity of the issue has been confirmed and increased by two members of the project team.

## Details


### Impact

One of the [main invariants](https://github.com/code-423n4/2024-05-loop?tab=readme-ov-file#main-invariants) stated in the audit is the following:

> Deposits are active up to the lpETH contract and lpETHVault contract are set

However, there are currently two ways this invariant can be broken, allowing users to gain lpETH without explicitly locking tokens before contracts are set.

1.  Sandwich a call to `convertAllETH` by  front-running to directly donate ETH and then back-running to claim lpETH via multiple lock positions

2.  Bundle a transaction of donation and claiming with a previously locked position of wrapped LRT

This bypasses the `onlyBeforeDate(loopActivation)` modifier included in all lock functions. It also potentially allows no cap in lpETH minted and also discourages users from locking ETH in the `PrelaunchPoints.sol` contract before contract addresses are set (i.e. `loopActivation` is assigned).

### Proof of Concept

**Scenario 1**

Bundle a transaction of donation and claiming with a previously locked position of wrapped LRT. User can execute the following in one transaction, assuming the user previously has a locked position with any of the allowed LRTs.

1.  Donate ETH directly to contract.
2.  Call `claim()/claimAndStake()`, claiming all tokens, this swaps users wrapped LRT to ETH via `_fillQuote`.
3.  Since `claimedAmount` is set as `address(this).balance` [here](https://github.com/code-423n4/2024-05-loop/blob/main/src/PrelaunchPoints.sol#L262), `claimedAmount`is computed as the addition of ETH receive from LRT swapped + user donated ETH.
4.  `claimedAmount` worth of lpETH is subsequently claimed/staked via `lpETH.deposit()/lpETHVault.stake()`.

**Scenario 2**

Sandwich a call to `convertAllETH` by  front-running to directly donate ETH and then back-running to claim lpETH via multiple lock positions.

1.  Assume user has 10 positions of ETH/WETH locked each with 1 ether with different addresses, with 100 ETH total locked.
2.  Front-run call to `convertAllETH` by donating 1 ETH. This sets `totalLpETH` to be 101 ETH as seen [here](https://github.com/code-423n4/2024-05-loop/blob/main/src/PrelaunchPoints.sol#L324).
3.  Ratio of `totalLpETH : totalSupply` computed [here](https://github.com/code-423n4/2024-05-loop/blob/main/src/PrelaunchPoints.sol#L249) is now 1.01 (1.01).
4.  Back-run `convertAllETH` by executing claims for all 10 position, each claim will mint 0.01 ETH extra (1.01 lpETH).

This scenario is less likely than scenario 1 as it requires user to perfectly back-run `convertAllETH()` with claims, although it also breaks another invariant of a 1:1 swap.

> Users that deposit ETH/WETH get the correct amount of lpETH on claim (1 to 1 conversion)

### Recommended Mitigation Steps

1.  For scenario 1, set `claimedAmount` to amount of ETH bought from LRT swap (such as `buyAmount` for uniV3).
2.  For scenario 2, no fix is likely required since it would require users to risk their funds to be transferred by other users due to inflated `totalLpETH : totalSupply` ratio. If not, you can consider setting `totalLpETH` to `totalSupply` and allow admin to retrieve any additional ETH donated.

**[0xd4n1el (Loop) confirmed](https://github.com/code-423n4/2024-05-loop-findings/issues/33#event-12908513603)**

**[Koolex (judge) increased severity to High](https://github.com/code-423n4/2024-05-loop-findings/issues/33#issuecomment-2141622967)**



***
