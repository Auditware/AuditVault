---
tags:
  - lang/solidity
  - sector/insurance
  - sector/lending
  - sector/liquid-staking
  - sector/nft
  - sector/staking
  - sector/vault
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - novelty/variant
protocol: "[[stETH]]"
auditors:
  - "[[0xeix]]"
  - "[[Tricko]]"
  - "[[asui]]"
  - "[[oxwhite]]"
  - "[[typicalHuman]]"
report: "https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi-judging"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[account-ownership]]"
---
# H-2: The vault can be drained

- id: 64080
- impact: HIGH
- protocol: [[stETH]] by EaseDeFi
- reporter: typicalHuman (Sherlock)
- source: N/A

## Summary


The bug report discusses a vulnerability in the stNXM contract, where an admin can drain funds from the vault. This is due to the fact that the `stakeNxm()` function is only accessible by the owner, but it calls another function that does not validate the requested TokenId. This allows an admin to keep ownership of an NFT and use it to stake funds from the vault. This can lead to loss of funds, incorrect accounting, and potential insolvency. The suggested mitigation is to check the vault's ownership of the requested tokenId before calling the depositTo() function. The protocol team has fixed this issue in their codebase.

## Details


Source: https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi-judging/issues/127 

## Found by 
0xeix, Tricko, asui, oxwhite, typicalHuman

### Summary

The funds of vault can be drained by admin

### Root Cause

[stakeNxm](https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi/blob/main/stNXM-Contracts/contracts/core/stNXM.sol#L351) is onlyOwner function and there is no validation of requested TokenId


### Internal Pre-conditions

.

### External Pre-conditions

.

### Attack Path

1. `stakeNxm()` is owner-only but calls [_stakeNxm](https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi/blob/main/stNXM-Contracts/contracts/core/stNXM.sol#L597) from the vault contract, so inside depositTo() the msg.sender is address(this).
2. `depositTo()` only checks that `msg.sender (the vault)` is owner or approved for `requestTokenId`, and that the token belongs to the target pool.
3. An admin can keep ownership of an NFT (say tokenId 105), call `stakingNFT.approve(address(vault), 105)`, then invoke `stakeNxm(amount, pool, tranche, 105)`.
4. The vault unwraps its wNXM and stakes it, but the stake shares are credited to tokenId `105`, which is still owned by the admin.
5. When the admin later uses Nexus’ withdraw on tokenId `105`, they receive the stake that was funded entirely by vault assets.
6. The vault, meanwhile, thinks it gained a staked position (it adds `tokenIdToPool[105]` and counts the tranche in `tokenIdToTranches[105]`), so `stakedNxm()` and `totalAssets()` are inflated with assets the vault does not actually control.

The Readme states: 
>Are there any limitations on values set by admins (or other roles) in the codebase, including restrictions on array lengths?

>Owner (NOT proxy owner) should generally not be able to do anything that would allow them to steal from the vault.

### Impact

1. Loss of funds
2. Incorrect accounting
3. Potential insolvency

### PoC

_No response_

### Mitigation

I think the vault's ownership of requested tokenId should be checked .
Require `stakingNFT.ownerOf(_requestTokenId) == address(this)` before calling depositTo().

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/EaseDeFi/stNXM-Contracts/commit/beea701e46d16e9b68bbe61bf75efba406191895
