---
tags:
  - lang/solidity
  - sector/staking
  - sector/vault
  - platform/kann
  - has/github
  - severity/high
  - impact/privilege-escalation/role-bypass
protocol: "[[ManifestFinance]]"
auditors:
  - "[[Kann]]"
report: "https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/ManifestFinance-security-review_2025-08-26.md"
genome:
  - "[[missing-modifier]]"
  - "[[role-bypass]]"
  - "[[access-roles]]"
---
# [H-01] FULL-Restricted Users Can Still Deposit

- id: 62716
- impact: HIGH
- protocol: [[ManifestFinance]]-security-review_2025-08-26
- reporter: Kann
- source: https://github.com/Kann-Audits/Kann-Audits/blob/main/reports/md-format/private-audits-reports/ManifestFinance-security-review_2025-08-26.md

## Summary


The report describes a bug in the deposit flow that does not properly enforce the FULL_RESTRICTED_STAKER_ROLE check. This allows restricted users to bypass compliance rules when making a deposit. The bug is caused by the _mint function setting the first parameter for _update to be address 0, which bypasses the role check. The team has fixed the issue.

## Details


## Severity

High

## Description

The deposit flow does not fully enforce the FULL_RESTRICTED_STAKER_ROLE check.
When a user with FULL restriction calls deposit(assets, receiver), the restriction logic fails to prevent the operation, allowing restricted users to bypass intended compliance rules.

Deposit flow:
deposit(ERC4626 logic) -> _deposit(override) where checks if both addresses have SOFT_RESTRICTED_STAKER_ROLE if true reverts
then logic goes to _deposit(ERC4626)

```solidity
 function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual {  
        
        SafeERC20.safeTransferFrom(IERC20(asset()), caller, address(this), assets);  
        _mint(receiver, shares);  
  
        emit Deposit(caller, receiver, assets, shares);  
    }  
```

Where _mint is called.

```solidity
function _mint(address account, uint256 value) internal {  
        if (account == address(0)) {  
            revert ERC20InvalidReceiver(address(0));  
        }  
        _update(address(0), account, value);  
    }  
```
See how _mint sets first parameter for _update to be address 0.

and since we have _update override it goes to

```solidity
 function _update(address from, address to, uint256 value) internal override {  
        if (hasRole(FULL_RESTRICTED_STAKER_ROLE, from) && to != address(0)) {  
            revert OperationNotAllowed();  
        }  
        if (hasRole(FULL_RESTRICTED_STAKER_ROLE, to)) {  
            revert OperationNotAllowed();  
        }  
        super._update(from, to, value);  
    }  
```

Where it fails to check if the msg.sender is restricted role

## Team Response

Fixed.
