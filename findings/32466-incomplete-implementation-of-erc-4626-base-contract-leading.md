---
tags:
  - lang/solidity
  - sector/staking
  - sector/vault
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/dependency/upgradeable-contract
  - novelty/variant
  - misassumption/external-call-is-safe
  - fix/upgrade-dependency
protocol: "[[Forta]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/forta-staking-vault-audit"
genome:
  - "[[upgradeable-contract]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[upgrade-safety]]"
---
# Incomplete Implementation of ERC-4626 Base Contract Leading to Asset Management and Usability Issues

- id: 32466
- impact: HIGH
- protocol: [[Forta]] Staking Vault Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/forta-staking-vault-audit

## Summary


The vault contract, which manages assets, has critical flaws that affect its functionality. The main issue is with the `mint` function, which correctly gives users shares but does not update the total assets and pool holdings. This leads to inaccurate tracking of assets and incorrect calculations for users trying to redeem shares. Another problem is the lack of an override for the `withdraw` function, which can cause transactions to fail and make it difficult for users to interact with the contract. To fix these issues, the `mint` and `withdraw` functions need to be modified to accurately reflect the total assets in the contract. This problem has been resolved in a recent update.

## Details

The vault contract's adaptation from the ERC-4626 standard demonstrates critical flaws in asset management and functionality due to incomplete overrides of essential functions. Initially, the primary concern centers around the `mint` function. When users invoke the function, the contract correctly emits shares. However, it fails to update the [\_totalAssets](https://github.com/NethermindEth/forta-staking-vault/blob/ce87cffbf813e27cc83157933760b51fa44a1885/src/FortaStakingVault.sol#L47) variable and the pool's asset holdings. This discrepancy leads to a significant issue: the vault's asset tracking becomes inaccurate, which in turn will result in incorrect calculations when users attempt to redeem their shares.


Similarly, the omission of an override for the `withdraw` function can lead to transactions reverting when users attempt to execute withdrawals. Although this issue has a minor direct impact compared to the asset management flaw, it contributes to a degraded user experience, potentially deterring user interaction with the contract.


Consider modifying the `mint` and `withdraw` functions from the `ERC-4626Upgradeable` contract within the `FortaStakingVault` contract to accurately reflect withdrawn and minted assets in the `_totalAssets` variable.


***Update:** Resolved in [pull request #22](https://github.com/NethermindEth/forta-staking-vault/pull/22).*
