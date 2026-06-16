---
tags:
  - lang/solidity
  - platform/mixbytes
  - has/github
  - severity/high
  - sector/bridge
  - sector/lending
  - sector/staking
protocol: "[[DForce]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/dForce/sUSX/README.md#1-mintcap-check-missing-in-cross-chain-transfer"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# MintCap Check Missing in Cross-Chain Transfer

- id: 36546
- impact: HIGH
- protocol: [[DForce]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/dForce/sUSX/README.md#1-mintcap-check-missing-in-cross-chain-transfer

## Summary


The `outboundTransferShares` function in the `sUSX` contract has a bug that could allow an attacker to bypass the `MSDController.mintCap` limit and potentially weaken the collateralization guarantees of the `sUSX` interest. This could happen through a cross-chain transfer where the `totalMint` value exceeds the `mintCap` limit. To fix this, a check should be implemented in the `outboundTransferShares` function to ensure that the `totalMint` value does not exceed the `mintCap` limit. This bug is classified as high severity and could have serious consequences.

## Details

##### Description
The issue was identified within the [`outboundTransferShares`](https://github.com/dforce-network/OFT/blob/2ff5d7a8f9a509006557bf5de72fabf40d1138a5/src/sUSX.sol#L276) function of the `sUSX` contract.

There is no check to ensure that the total mint amount does not exceed the `MSDController.mintCap` parameter. This oversight could lead to an attack vector where the mintCap limit is bypassed through cross-chain transfers. The following scenario outlines the potential attack:
1. `sUSX.totalMint` equals `MSDController.mintCap(sUSX)`, preventing direct USX withdrawals on the current network.
2. A cross-chain transfer is performed to a chain where the mintCap limit hasn't been reached.
3. The `unstakedAmount` on the sending network increases by the `assets` value, causing `sUSX.totalMint` to surpass the `MSDController.mintCap(sUSX)` value.
4. On the receiving chain, the `stakedAmount` increases by the `assets` amount.
5. Assets are withdrawn on the receiving chain, decreasing the `unstakedAmount` by the same value, thereby the `totalMint` value on the receiving chain remains unchanged.

This manipulation allows the number of minted USX token rewards to exceed the sum of mintCaps on all chains, potentially bypassing the collateralization limits of the `sUSX` interest.

The issue is classified as **high** severity as it can significantly weaken the collateralization guarantees of the `sUSX` interest.

##### Recommendation
We recommend implementing a check to ensure that the `totalMint()` value after `_burn` does not exceed the `MSDController.mintCap(sUSX)` in `outBoundTransferShares` function.
