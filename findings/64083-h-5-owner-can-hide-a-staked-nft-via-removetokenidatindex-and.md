---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/insurance
  - sector/lending
  - sector/liquid-staking
  - sector/nft
  - sector/nft-lending
  - sector/staking
  - sector/staking-pool
  - sector/vault
protocol: "[[stETH]]"
auditors:
  - "[[0xKemah]]"
  - "[[0xxAristos]]"
  - "[[5am]]"
  - "[[AestheticBhai]]"
  - "[[Baccarat]]"
  - "[[Cybrid]]"
  - "[[Drynooo]]"
  - "[[IzuMan]]"
  - "[[PowPowPow]]"
  - "[[Solea]]"
  - "[[TianZun]]"
  - "[[Ziusz]]"
  - "[[asui]]"
  - "[[bbl4de]]"
  - "[[boredpukar]]"
  - "[[deadmanwalking]]"
  - "[[elolpuer]]"
  - "[[hanz]]"
  - "[[iamephraim]]"
  - "[[ivxylo]]"
  - "[[jayjoshix]]"
  - "[[peazzycole]]"
  - "[[slcoder]]"
  - "[[thimthor]]"
  - "[[tobi0x18]]"
  - "[[xKeywordx]]"
  - "[[zaida]]"
report: "https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi-judging"
genome:
  - "[[centralization]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[account-ownership]]"
  - "[[oracle-manipulation-resistance]]"
---
# H-5: owner can hide a staked nft  via removeTokenIdAtIndex and inflate shares using this to make profit

- id: 64083
- impact: HIGH
- protocol: [[stETH]] by EaseDeFi
- reporter: jayjoshix (Sherlock)
- source: N/A

## Summary


Summary:
The bug report describes a vulnerability in the stNXM smart contract that allows the owner to manipulate the value of the staked Nexus NFT without withdrawing its stake. This can lead to the owner depositing while the vault appears under-collateralized, then re-exposing the NFT and redeeming the over-minted shares at a higher price, causing loss for all stNXM holders except the owner. The protocol team has fixed this issue in a recent commit.

## Details


Source: https://github.com/sherlock-audit/2025-11-stnxm-by-easedefi-judging/issues/878 

## Found by 
0xKemah, 0xxAristos, 5am, AestheticBhai, Baccarat, Cybrid, Drynooo, IzuMan, PowPowPow, Solea, TianZun, Ziusz, asui, bbl4de, boredpukar, deadmanwalking, elolpuer, hanz, iamephraim, ivxylo, jayjoshix, peazzycole, slcoder, thimthor, tobi0x18, xKeywordx, zaida

### Summary

The ability for the owner to remove a staked Nexus NFT from the tokenIds array without withdrawing its stake will cause manipulation and profit, as the owner can hide an NFT’s stake from `stakedNxm()/totalAssets()`, deposit while the vault appears under‑collateralized, then re‑expose the nft and redeem the over‑minted shares at a higher price

### Root Cause

```solidity
function removeTokenIdAtIndex(uint256 _index) external onlyOwner {
    uint256 tokenId = tokenIds[_index];
    tokenIds[_index] = tokenIds[tokenIds.length - 1];
    tokenIds.pop();
    // remove mapping to pool
    delete tokenIdToPool[tokenId];
}
```
https://github.com/EaseDeFi/stNXM-Contracts/blob/b1431014cfadc4e5b65a9b93dfb52092313fef31/contracts/core/stNXM.sol#L723
when a token id is removed the
akedNxm() computes the vault’s Nexus stake by looping only over tokenIds and, for each, using tokenIdToPool[token] plus tokenIdToTranches[token] to attribute a fraction of activeStake to the vault
Removing an NFT from tokenIds causes all of its stake to disappear from stakedNxm() and thus from totalAssets() = stakedNxm() + unstakedNxm() - adminFees, while the NFT itself (and its Nexus stake) still belongs to the vault.
Later, the owner can call stakeNxm(.., _requestTokenId = tokenId) to reuse the same NFT, at which point _stakeNxm will re‑insert the tokenId into tokenIds and tokenIdToPool, restoring that stake into stakedNxm() and totalAssets()

### Internal Pre-conditions

na just owner needs to have funds

### External Pre-conditions

na

### Attack Path

-  Real underlying: 10,000 wNXM in NFT k + 5,000 wNXM across other tracked NFTs = 15,000.​
- tokenIds includes k, and tokenIdToPool[k] points to the correct Nexus pool.​
- stakedNxm() correctly sums ≈15,000, so totalAssets() ≈ 15,000 and totalSupply() = 15,000 (1:1 price).​​
- Owner calls removeTokenIdAtIndex(i) where tokenIds[i] == k.​
- Function swaps out H, pops the array, and deletes tokenIdToPool[k], but does not withdraw or modify the underlying stake in Nexus.​
- stakedNxm() now loops only over the remaining tokenIds, so it sees only 5,000 wNXM; the 10,000 wNXM in NFT k is no longer included.​​
-  totalAssets_view drops to ≈5,000 while the real underlying remains 15,000.
Owner deposits while totalAssets() is artificially low
 ERC‑4626 computes minted shares with stale values:
shares = depositAmount × totalSupply / totalAssets
shares = 10,000 × 15,000 / 5,000 = 30,000 shares
 At the true totalAssets = 15,000, the owner should only receive 10,000 shares; they instead over‑mint by 20,000 shares (3x).​​
Owner re-adds the hidden NFT to accounting.
Later, the owner calls stakeNxm(_smallAmount, poolForK, someTranche, k). _stakeNxm then calls pool.depositTo(..., _requestTokenId = k, address(this)), which returns the same tokenId = k. Because tokenIdToPool[k] was deleted earlier, _stakeNxm treats this as a new NFT: it pushes k back into tokenIds and sets tokenIdToPool[k] = poolForK. From this point on, stakedNxm() once again includes the full stake of NFT k, causing totalAssets() to jump to reflect ≈25,000 underlying (5,000 other + 10,000 hidden + 10,000 owner deposit, ignoring any small new stake).
Owner redeems at the corrected higher price. With the full underlying now visible, the ERC-4626 share price is computed using totalAssets ≈ 25,000 and totalSupply = 45,000 (15,000 original + 30,000 owner). The owner then redeems a large portion (or all) of the 30,000 shares minted earlier, receiving significantly more wNXM than the 10,000 they originally deposited because the underlying NFT k is now fully counted in totalAssets(). The excess payout is effectively funded by diluting other stakers’ proportional claim over the true underlying value.

### Impact

All stNXM holders other than the owner face loss as admin is basically stealing with this even if the owner is changed even doing this one time will make the protocol loss a huge chunk

### PoC

_No response_

### Mitigation

_No response_

## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/EaseDeFi/stNXM-Contracts/commit/beea701e46d16e9b68bbe61bf75efba406191895
