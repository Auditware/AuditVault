---
tags:
  - lang/solidity
  - sector/perpetuals
  - sector/token
  - platform/mixbytes
  - has/github
  - severity/high
  - precondition/specific-token-type
protocol: "[[NUTS Finance]]"
auditors:
  - "[[MixBytes]]"
report: "https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Tapio/README.md#3-buffer-drainage-through-repeated-rebase-calls-due-to-stale-state-variables"
genome:
  - "[[missing-modifier]]"
  - "[[specific-token-type]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# Buffer Drainage Through Repeated Rebase Calls Due to Stale State Variables

- id: 62662
- impact: HIGH
- protocol: [[NUTS Finance]]
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/NUTS%20Finance/Tapio/README.md#3-buffer-drainage-through-repeated-rebase-calls-due-to-stale-state-variables

## Summary


The `rebase` function in the `SelfPeggingAsset` contract has a bug that allows an attacker to drain the protocol's buffer by repeatedly calling the function. This is because the function does not update the `balances` and `totalSupply` state variables after reducing the total supply. To fix this, the variables should be updated and access controls should be considered to prevent exploitation. This bug is classified as high severity as it can lead to financial loss or disruption of the pool's operations.

## Details

##### Description
This issue has been identified within the `rebase` function of the `SelfPeggingAsset` contract. 

When the old invariant `D` (`oldD`) exceeds the new invariant `D` (`newD`), the function calls `poolToken.removeTotalSupply(oldD - newD, true, true)` to reduce the total supply. However, it fails to update the contract's internal state variables `balances` and `totalSupply` to reflect this change. As a result, if `D` decreases, these variables remain unchanged while the buffer is reduced. Since `rebase` is an external, unprotected function that anyone can call, an attacker could repeatedly invoke it to drain the buffer entirely, operating on outdated state data with each call. 

The issue is classified as **high** severity because it enables unauthorized depletion of the protocol's buffer, potentially leading to significant financial loss or disruption of the pool’s operations.
##### Recommendation
We recommend updating the `balances` and `totalSupply` state variables after the `poolToken.removeTotalSupply` call when `oldD > newD` to ensure they accurately reflect the adjusted state. Additionally, consider implementing access controls (e.g., restricting `rebase` to authorized users) or a cooldown mechanism to prevent repeated exploitation.
