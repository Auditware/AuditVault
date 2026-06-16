---
tags:
  - lang/solidity
  - sector/governance
  - platform/mixbytes
  - has/github
  - severity/high
  - vuln/bridge/replay
  - novelty/variant
  - misassumption/bridge-is-secure
  - misassumption/signature-is-unique
  - fix/add-nonce
  - trigger/cross-chain-message
protocol: "[[Barter DAO]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/Barter%20DAO/Superposition/README.md#1-replay-attack-via-balance-based-nonce"
genome:
  - "[[replay]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[bridge-message-validation]]"
---
# Replay Attack via Balance-Based Nonce

- id: 63501
- impact: HIGH
- protocol: [[Barter DAO]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Barter%20DAO/Superposition/README.md#1-replay-attack-via-balance-based-nonce

## Summary


The bug report describes an issue with the protocol's use of a user's token balance as a nonce to prevent replay attacks. The code only checks the user's balance at the time of the transaction, which means that if the balance increases again, the same transaction can be executed multiple times. This creates a vulnerability where orders can be replayed whenever the maker's balance condition is met again. The report recommends using the Nonces contract from OpenZeppelin to address this issue.

## Details

##### Description
The protocol uses only the user's token balance as a nonce to prevent replay attacks:

```solidity
uint256 currentMakerBalance = order.makerToken.balanceOf(order.maker);
if (currentMakerBalance < order.nonceBalance) {
    revert ReplayAttackDetected(currentMakerBalance, order.nonceBalance);
}
```
https://github.com/BarterLab/superposition-contract/blob/8dfd5bceb02bef6892a574da6862f673a5ea66b6/src/SuperpositionVault.sol#L115-L118

However, once the user's balance increases again (e.g., through receiving tokens from other sources), the same order can be executed multiple times if the deadline allows it. This creates a vulnerability where orders can be replayed whenever the maker's balance condition is satisfied again.

##### Recommendation

We recommend descending from the OpenZeppeling's Nonces contract:
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Nonces.sol 
    
---
