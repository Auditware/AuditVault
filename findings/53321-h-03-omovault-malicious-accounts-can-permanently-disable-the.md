---
tags:
  - lang/solidity
  - sector/oracle
  - has/github
  - severity/high
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[fake-account-substitution]]"
  - "[[single-source]]"
  - "[[permanent]]"
  - "[[variant]]"
  - "[[admin-is-honest]]"
  - "[[oracle-is-reliable]]"
  - "[[add-access-control]]"
  - "[[use-multi-oracle]]"
---
# [H-03] `OmoVault` malicious accounts can permanently disable the vault

- id: 53321
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


This bug report discusses a high severity issue in the `OmoVault` contract that can lead to a permanent denial of service (DoS) for the vault. The problem occurs because whitelisted users can register accounts without approval, allowing a malicious actor to set up an invalid oracle for price retrieval. This causes the `totalAssets()` function to fail, making the vault unusable. To prevent this, the report suggests restricting the ability to register accounts to only the vault owner or manager, implementing a way to remove malicious accounts, and modifying `totalAssets()` to handle oracle failures gracefully.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

- The `OmoVault` contract allows whitelisted users to register accounts (`OmoAgent`) without requiring approval from the vault owner or manager.
  A malicious actor can exploit this by registering an `OmoAgent` account that is configured with an invalid oracle for price retrieval, this would cause the `OmoVault.totalAssets()` function to revert whenever it is called, leading to a **permanent denial of service (DoS) for the vault**:

```javascript
function totalAssets() public view virtual override returns (uint256) {
        //...
        // Sum up values from all registered accounts
        for (uint256 i = 0; i < accountList.length; i++) {
            address account = accountList[i];
            if (registeredAccounts[account]) {
                IDynamicAccount dynamicAcc = IDynamicAccount(account);
                accountHoldings += dynamicAcc.getPositionValue(address(asset));
            }
        }
        //...
    }
```

- Since `totalAssets()` is used to calculate the share value by `deposit()`, `mint()` and `redeem()` functions, this would make the vault unusable as there is **no implemented method to remove malicious accounts (`OmoAgent`) from the vault**, preventing recovery from such an attack.

## Recommendations

- Possible mitigation for this issue:

1. Restrict the ability to register accounts in the vault to **only the vault owner or manager**.
2. Implement a function to allow vault owner/manager to **remove malicious or compromised accounts** from the system.
3. Modify `totalAssets()` to **handle oracle failures gracefully**, ensuring that a single failing oracle does not cause the entire function to revert.
