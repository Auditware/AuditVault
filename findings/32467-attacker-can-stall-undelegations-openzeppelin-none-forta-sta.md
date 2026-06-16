---
tags:
  - lang/solidity
  - sector/staking
  - sector/token
  - platform/openzeppelin
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Forta]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/forta-staking-vault-audit"
genome:
  - "[[underflow]]"
  - "[[locked-funds]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
  - "[[vote-delegation-loop]]"
---
# Attacker Can Stall Undelegations

- id: 32467
- impact: HIGH
- protocol: [[Forta]] Staking Vault Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/forta-staking-vault-audit

## Summary


This bug report discusses an issue with the undelegation process in the FortaStakingVault contract. This process involves two steps: the operator initiates the undelegation process by transferring shares to a distributor contract and then, once the waiting period has passed, users can call the undelegate function to receive their staked tokens back. However, there is a problem with the calculation of the amount of FORT tokens to be sent back to the vault. Instead of using the amount returned by the withdraw function from the FortaStaking contract, the balance of FORT tokens held by the distributor is used, which can be manipulated by anyone. This can cause the undelegate function to fail and make the funds deposited in the distributor inaccessible. This can be fixed by using the amount returned by the withdraw function instead of the balance of FORT held by the distributor. This issue has been resolved in a recent pull request.

## Details

The process of undelegating assets from a subject in the [`FortaStakingVault` contract](https://github.com/NethermindEth/forta-staking-vault/blob/ce87cffbf813e27cc83157933760b51fa44a1885/src/FortaStakingVault.sol) requires two steps:


Firstly, the `operator` triggers the undelegation process by calling the [`initiateUndelegate` function](https://github.com/NethermindEth/forta-staking-vault/blob/ce87cffbf813e27cc83157933760b51fa44a1885/src/FortaStakingVault.sol#L201), which [deploys a distributor instance](https://github.com/NethermindEth/forta-staking-vault/blob/ce87cffbf813e27cc83157933760b51fa44a1885/src/FortaStakingVault.sol#L209), an ERC-20 token. The vault transfers its `FortaStaking` shares in the given subject to the distributor, and in return, receives minted distributor tokens that represent its position and are equivalent to the `FortaStaking` shares transferred to the distributor contract. The distributor also [initiates the withdrawal](https://github.com/NethermindEth/forta-staking-vault/blob/ce87cffbf813e27cc83157933760b51fa44a1885/src/InactiveSharesDistributor.sol#L65) of the assets in the `FortaStaking` contract and the waiting period is stored in the Vault for that particular subject.


Secondly, once the waiting period passes, users are permitted to call the [`undelegate` function](https://github.com/NethermindEth/forta-staking-vault/blob/ce87cffbf813e27cc83157933760b51fa44a1885/src/FortaStakingVault.sol#L233) to undelegate all the staked tokens of a specific subject by the vault. However, a problem arises when calculating the amount of FORT tokens to be sent from the distributor back to the vault. Instead of using the amount returned by the [`withdraw` function](https://github.com/NethermindEth/forta-staking-vault/blob/ce87cffbf813e27cc83157933760b51fa44a1885/src/InactiveSharesDistributor.sol#L74) from the `FortaStaking` contract, the balance of [FORT tokens held by the distributor will be used instead](https://github.com/NethermindEth/forta-staking-vault/blob/ce87cffbf813e27cc83157933760b51fa44a1885/src/InactiveSharesDistributor.sol#L75) which can be manipulated since anyone can send FORT tokens to the distributor.


If this occurs, the `undelegate` function will revert when [attempting to subtract the assets](https://github.com/NethermindEth/forta-staking-vault/blob/ce87cffbf813e27cc83157933760b51fa44a1885/src/FortaStakingVault.sol#L259) delegated to the given subject since the amount subtracted will be greater than the one tracked in the `_assetsPerSubject` variable. This implies that the funds deposited in the distributor will become inaccessible and any subsequent attempts to invoke the `undelegate` function for that particular subject will fail.


Nonetheless, this is not irreversible as the operator can allocate additional tokens to the subject, thereby increasing the `_assetsPerSubject` amount to prevent an underflow. However, it may take some time before the operator notices this problem and the attacker could front-run any future delegations to put the undelegation process in a stalled situation again. A step-by-step proof-of-concept for this scenario can be found in [this secret gist](https://gist.github.com/jbcarpanelli/6712c1c882e30263d6e34e08b4808f9b).


Consider using the amount returned by the [`withdraw` function](https://github.com/NethermindEth/forta-staking-vault/blob/ce87cffbf813e27cc83157933760b51fa44a1885/src/InactiveSharesDistributor.sol#L74) from the `FortaStaking` contract instead of the balance of FORT held by the distributor.


***Update:** Resolved in [pull request #24](https://github.com/NethermindEth/forta-staking-vault/pull/24).*
