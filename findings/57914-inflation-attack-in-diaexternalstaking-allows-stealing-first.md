---
tags:
  - lang/solidity
  - sector/staking
  - sector/staking-pool
  - has/github
  - severity/high
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#2-inflation-attack-in-diaexternalstaking-allows-stealing-first-depositors-stake"
genome:
  - "[[frontrun-exposure]]"
  - "[[mev/frontrun]]"
  - "[[first-deposit]]"
---
# Inflation Attack in `DIAExternalStaking` Allows Stealing First Depositor's Stake

- id: 57914
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#2-inflation-attack-in-diaexternalstaking-allows-stealing-first-depositors-stake

## Summary


The `DIAExternalStaking` contract has a vulnerability that allows an attacker to exploit the `addRewardToPool` function and steal user's funds. This happens when an attacker stakes a minimum amount in an empty pool, then unstakes almost all of their tokens, and finally frontruns a victim's transaction to call `addRewardToPool` with the victim's deposit. This results in the victim receiving 0 shares in the pool and the attacker being able to repeat the attack on an empty pool. To fix this, it is recommended to add a non-zero shares minted requirement to the `_stake` function or restrict who can call `addRewardToPool`. The issue has already been fixed in a recent commit. 

## Details

##### Description
This issue has been identified within the `DIAExternalStaking` contract.
The contract is vulnerable to a classic inflation attack due to the permissionless nature of the `addRewardToPool` function and the way pool shares are calculated. An attacker can exploit this as follows in newly deployed pool:

1. The attacker stakes in an empty pool the minimum allowed amount (`minimumStake`), receiving `minimumStake` share of the pool.
2. The attacker then unstakes almost all of their tokens, leaving only a single token (i.e., unstakes `minimumStake - 1`).
3. At this point, the total pool shares and the total supply are both equal to 1.
4. The attacker sees in the mempool a transaction of victim and frontruns it, calling `addRewardToPool()` with amount == victim_deposit.
5. After this step there is 1 share in the pool and victim_deposit + 1 stake. So victim receives:
`poolSharesGiven = (amount * totalShareAmount) / totalPoolSize = victim_deposit * 1 / (victim_deposit + 1) = 0` shares
6. The attacker can unstake funds and repeat the attack on an empty pool.

The issue is classified as **Critical** severity because it allows a malicious actor to steal user's funds.
<br/>
##### Recommendation
We recommend adding a non-zero shares minted requirement to the `_stake` function or add a special variable which will be passed to the function by the user to control for the minimum shares minted. Also, we recommend restricting who can call `addRewardToPool` function.

> **Client's Commentary:**
> Client: The issue has been fixed in commit https://github.com/diadata-org/lumina-staking/commit/95aca806165c15ab1826ff19cdac8104019f6fd9
