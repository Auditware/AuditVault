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
  - "[[token-approval-flow]]"
  - "[[direct-drain]]"
  - "[[mev/frontrun]]"
---
# [H-02] The `transferFrom()` in `OmoRouter.sol` has approval vulnerabilities

- id: 53320
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


This bug report is about a medium severity bug in the `transferFrom()` function in the `OmoRouter.sol` contract. This function transfers shares from one address to another, but it has a security issue that allows malicious users to steal funds from other users. The recommended solution is to change the function to only allow transfers from the user's own address.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

The `transferFrom()` function in `OmoRouter.sol` contract transfers a certain amount of shares from a sender `from` to a recipient address `to`.

```solidity
File: OmoRouter.sol

File: OmoRouter.sol
     function transferFrom(uint256 vaultId,address from,address to,uint256 amount) external returns (bool) {
         address vault = vaultFactory.getVault(vaultId);
         return IOmoVault(vault).transferFrom(from, to, amount);
     }
```

It directly sub-calls to `OmoVault.sol#transferFrom()`.
The user needs to call `Approve()` in the vault to allow the router to spend on behalf of `msg.sender` and send it to the recipient address.

Malicious users can steal any amount in `allowance[][]` for the router address from other users or can front-run user transactions that call `transferFrom()#OmoRouter.sol` and transfer all the approved value by the user to his address.

## Recommendations

```diff
File: OmoRouter.sol

-     function transferFrom(uint256 vaultId,address from,address to,uint256 amount) external returns (bool) {
+     function transferFrom(uint256 vaultId,address to,uint256 amount) external returns (bool) {
         address vault = vaultFactory.getVault(vaultId);

-         return IOmoVault(vault).transferFrom(from, to, amount);
+         return IOmoVault(vault).transferFrom(msg.sender, to, amount);
     }
```
