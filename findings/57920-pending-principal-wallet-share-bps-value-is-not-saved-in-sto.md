---
tags:
  - severity/high
  - has/github
  - sector/staking
  - lang/solidity
protocol: "[[DIA]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#3-pending-principal-wallet-share-bps-value-is-not-saved-in-storage"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# Pending principal wallet share BPS value is not saved in storage

- id: 57920
- impact: HIGH
- protocol: DIA
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/DIA/Lumina%20Staking/README.md#3-pending-principal-wallet-share-bps-value-is-not-saved-in-storage

## Summary


This bug report discusses an issue in two contracts, `DIAExternalStaking` and `DIAWhitelistedStaking`, where a function called `_getCurrentPrincipalWalletShareBps` is not properly updating the value it uses. This can cause problems for the beneficiary, who may not have full control over the rewards between their principal and beneficiary wallets. The recommendation is to update the function to store the pending value in storage after a certain period of time has passed. The client has made a fix in one of the contracts, but the issue still exists in the other one.

## Details

##### Description
In both `DIAExternalStaking` and `DIAWhitelistedStaking` contracts, the `_getCurrentPrincipalWalletShareBps` function uses the pending value directly from memory without storing it in storage after the timeout period has passed. It will lead to using an outdated `stakingStores[stakingStoreIndex].principalWalletShareBps` value in case of the new pending updates which hasn't passed through the timeout yet.

This issue is important because it prevents beneficiary from fully controlling the proportion of the rewards between the principal and beneficiary wallet. Imagine the case when the principal staker initially sets bps share value to 100%, which is then getting changed by the beneficiary to 50% and after some time they decide to change it again and set bps share value to 70%. It will lead to using the 100% bps value originally set by principal staker (during the SHARE_UPDATE_GRACE_PERIOD period), which wouldn't be expected by the beneficiary.
<br/>
##### Recommendation
We recommend updating the `_getCurrentPrincipalWalletShareBps` function to store the pending value in storage after the timeout period has passed.

> **Client's Commentary:**
> Client: "Added latest bps update to storage from map if time required is elapsed,  whenever update bps is called"
> Fixed in https://github.com/diadata-org/lumina-staking/commit/4ba9dd8c761fccffc29f34ff1a8b29d22d226f20
> MixBytes: This issue is still present in the `DIAExternalStaking` contract
> Client: Added fix in DIAExternalsStaking
