---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - sector/oracle
protocol: "[[Y2K]]"
auditors:
  - "[[iglyx]]"
report: "https://github.com/sherlock-audit/2023-03-Y2K-judging"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
---
# H-3: `depositFee` can be bypassed via deposit queue

- id: 18535
- impact: HIGH
- protocol: [[Y2K]]
- reporter: iglyx (Sherlock)
- source: N/A

## Summary


This bug report is discussing an issue where the deposit fee can be bypassed by depositing into the queue and using the mintDepositInQueue() call in the same transaction. This is possible because of the FILO system, which means the deposit fee is not charged and the user pays zero fees instead of incurring the deposit fee. This could lead to a loss of protocol fee revenue.

The bug was found by 0xRobocop, Ace-30, AlexCzm, Ch\_301, Dug, ElKu, Inspex, J4de, Respx, Ruhum, ShadowForce, TrungOre, VAD37, ast3ros, bulej93, evan, hickuphh3, iglyx, immeas, kenzo, minhtrng, roguereddwarf, toshii, and yixxas.

The code snippets related to this bug can be found at https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L494-L500, https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L332-L333, and https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L354. The bug was discovered using manual review.

The recommended solution is to take a proportion of the relayer fee, as well as adding a significant deposit requirement for queue deposits. This will mitigate high deposit fees for queue deposits, as well as prevent late direct depositors from using the queue to evade the deposit fee.

The fix for this issue is in the form of a pull request (PR) at https://github.com/Y2K-Finance/Earthquake/pull/126. This PR applies a minimum deposit requirement to enlistInRollover.

## Details

Source: https://github.com/sherlock-audit/2023-03-Y2K-judging/issues/75 

## Found by 
0xRobocop, Ace-30, AlexCzm, Ch\_301, Dug, ElKu, Inspex, J4de, Respx, Ruhum, ShadowForce, TrungOre, VAD37, ast3ros, bulej93, evan, hickuphh3, iglyx, immeas, kenzo, minhtrng, roguereddwarf, toshii, yixxas

## Summary
The deposit fee can be circumvented by a queue deposit + `mintDepositInQueue()` call in the same transaction.

## Vulnerability Detail
A deposit fee is charged and increases linearly within the deposit window. However, this fee can be avoided if one deposits into the queue instead, then mints his deposit in the queue.

## POC
Assume non-zero `depositFee`, valid epoch `_id = 1`. At epoch end, instead of calling `deposit(1, _assets, 0xAlice)`, Alice writes a contract that performs `deposit(0,_assets,0xAlice)` + `mintDepositInQueue(1,1)` to mint her deposit in the same tx (her deposit gets processed first because FILO system) . She pockets the `relayerFee`, essentially paying zero fees instead of incurring the `depositFee`.

## Impact
Loss of protocol fee revenue.

## Code Snippet
https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L494-L500
https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L332-L333
https://github.com/sherlock-audit/2023-03-Y2K/blob/main/Earthquake/src/v2/Carousel/Carousel.sol#L354


## Tool used
Manual Review

## Recommendation
Because of the FILO system, charging the dynamic deposit fee will be unfair to queue deposits as they're reliant on relayers to mint their deposits for them. Consider taking a proportion of the relayer fee.



## Discussion

**3xHarry**

This is a valid issue. We will apply depositFee to all mints (queue and direct). However, given that queue has the potential to affect when users's shares are minted because of FILO, min deposit has to be raised for the queue, to make it substantially harder to DDoS the queue. Minimizing DDoS queue deposits will lead to queue deposits getting the least fees as relayers can mint from the first second the epoch is created. 

**3xHarry**

fix PR: https://github.com/Y2K-Finance/Earthquake/pull/126

**3xHarry**

@IAm0x52 to elaborate on this issue: relayers are incentivized to mint the depositQueue from the second a new epoch is created to extract the most amount of relayerFees. In fact Y2K will have a build in relayerInfra into the deployment process. The assumption is, that queueDeposit users will pay a minimal Fee. The attack factor of the queue beeing to long leading to prolonged queue deposit executions will be mitigated by adding a significant deposit requirement for queue deposits. These measures will mitigate high deposit Fees for Queue deposits as well as prevent late direct depositors using the queue to evade the depositFee. 

**jacksanford1**

Bringing in this discussion from Discord:

0x52
> As a follow up for PR126. You keep the minRequiredDeposit modifier on enlistInRollover but the way you modified it, it can only apply if epochId == 0 but enlistInRollover doesn't work for epochId == 0 so the modifier is useless on that function. My suggestion would be to either remove it if you no longer need that protection or make a new modifier specifically designed for enlistInRollover

3xHarry
> regarding [issue] 75 / PR 126 fixed in https://github.com/Y2K-Finance/Earthquake/pull/126/commits/9c659161dc952df99201b99d4ea54e9dda642ecb

**IAm0x52**

Fix looks good. enlistInRollover now applies a minimum deposit requirement
