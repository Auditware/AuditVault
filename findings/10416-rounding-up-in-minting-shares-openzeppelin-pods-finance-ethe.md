---
tags:
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/arithmetic/rounding-direction
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/vault
protocol: "[[Pods Finance]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/pods-finance-ethereum-volatility-vault-audit-1/"
genome:
  - "[[rounding-direction]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[integer-bounds]]"
---
# Rounding up in minting shares

- id: 10416
- impact: HIGH
- protocol: [[Pods Finance]] Ethereum Volatility Vault Audit #1
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/pods-finance-ethereum-volatility-vault-audit-1/

## Summary


A bug report has been identified in the processing of queued deposits in the yield contracts. When processing the queued deposits, shares are minted to the receiver in the queue according to the amount of assets deposited. However, the amount of shares minted is always rounded up. This means that one can always receive 1 vault share with a 1-wei deposit.

This poses a security risk as a malicious user can spam the deposit queue with 1-wei deposit from many accounts to get 1 share each and then redeem them for more assets when each share is worth more. To address the issue, it has been suggested that the vault shares should be rounded down when minting.

The bug has been fixed in Pull Request #46, with the last commit being 5ac5e3c.

## Details

When processing the queued deposits, shares are minted to the receiver in the queue according to the amount of assets deposited. However, the amount of shares minted is always [rounded up](https://github.com/pods-finance/yield-contracts/blob/9389ab46e9ecdd1ea1fd7228c9d9c6821c00f057/contracts/vaults/BaseVault.sol#L392). This means that one can always receive 1 vault share with a 1-wei deposit.


As the vault is expected to be increasing in value from yield rewards, 1 vault share will be worth more than 1 wei asset eventually. A malicious user can spam the deposit queue with 1-wei deposit from many accounts to get 1 share each and then redeem them for more assets when each share is worth more.


Consider rounding down when minting vault shares.


**Update:** *Fixed in [PR#46](https://github.com/pods-finance/yield-contracts/pull/46), with commit `5ac5e3c` being the last one added.*
