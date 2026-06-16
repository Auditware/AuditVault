---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/oracle
protocol: "[[Aarna]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-04-aarna.md"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
---
# Potential asset under-disbursement in withdraw function of AFiBase contract

- id: 37167
- impact: HIGH
- protocol: [[Aarna]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-01-04-aarna.md

## Summary


This bug report discusses a problem with the withdrawal function in the AFiBase contract. This function is supposed to allow users to redeem their shares for assets, but there is an issue with the calculation and transfer of these assets. If the contract does not have enough oToken, users may receive less than they are entitled to. The recommendation is for the contract to check if it has enough funds before allowing a withdrawal and to revert the transaction if there are insufficient funds. This issue has been resolved and the transaction will now revert if there are not enough funds available.

## Details

**Severity**: High

**Status**:  Resolved

**Description**

The withdrawal function in the AFiBase contract is designed to allow users to redeem their shares for the corresponding assets. The function computes the user's entitled assets based on their share in the pool. Then, the swapForOtherProduct function is invoked to calculate and prepare the assets for withdrawal. Before transferring the funds to user, the contract checks if it has enough of oToken to satisfy the computed amount r:
```solidity
   if (IERC20(oToken).balanceOf(address(this)) >= redFromContract) {
     IERC20(oToken).safeTransfer(msg.sender, redFromContract);
   } else {
     IERC20(oToken).safeTransfer(msg.sender, IERC20(oToken).balanceOf(address(this)));
   }
```
If the contract does not have enough oToken, users will receive less than they are supposed to, based on their share calculation. This is especially concerning if the contract's balance is significantly lower than r.

**Recommendation**: 

Before allowing a withdrawal, the contract should check if it can satisfy the user's entitlement. If funds are insufficient, the transaction should be reverted or the contract logs the remaining owed amount, ensuring the user can retrieve their due sum when sufficient funds are available.

**Fix**: Issue fixed. If the available funds are insufficient, the transaction reverts.
