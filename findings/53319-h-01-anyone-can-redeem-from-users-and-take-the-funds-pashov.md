---
tags:
  - lang/solidity
  - sector/token
  - has/github
  - severity/high
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[access-roles]]"
  - "[[direct-drain]]"
  - "[[mev/frontrun]]"
---
# [H-01] Anyone can redeem from users and take the funds

- id: 53319
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


A bug has been found in the `redeem()` function of the `OmoRouter.sol` contract. This function is used by users to redeem shares for assets. The issue is that the `owner` needs to set approval for the router address to transfer the shares, but this can be exploited by attackers who can drain the allowance for the router address in any vault shares. This can lead to the loss of funds for users. To fix this, the `owner` should only be `msg.sender` to prevent this exploit.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The `redeem()` function in `OmoRouter.sol` contract is triggered by the user to request redeem shares for the equivalent assets.
`owner` should set approval for the router address to transfer the shares

```solidity
File: OmoRouter.sol
     function redeem(uint256 vaultId,uint256 shares, address receiver,address owner)
     /*code*/
         // Transfer shares from owner to router first
         IOmoVault(vault).transferFrom(owner, address(this), shares);

```

An attacker can drain any allowance for the router address in any vault shares (in case chains have the possibility of front-run, MEV bots can just front-run users `redeem()` transactions) and wait for an agent to do the rest (send the funds).

## Recommendations

The owner should only be `msg.sender`

```diff
File: OmoRouter.sol
-     function redeem(uint256 vaultId,uint256 shares, address receiver,address owner)
+     function redeem(uint256 vaultId,uint256 shares, address receiver)
     /*code*/
         // Transfer shares from owner to router first
-         IOmoVault(vault).transferFrom(msg.sender, address(this), shares);
+         IOmoVault(vault).transferFrom(owner, address(this), shares);

```
