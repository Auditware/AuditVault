---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/lending
protocol: "[[Omo]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md"
genome:
  - "[[reward-accounting]]"
  - "[[logic/state-update]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/protocol-wide]]"
---
# [H-04] Cross-vault misattribution leads to incorrect `OmoVaults` valuation

- id: 53322
- impact: HIGH
- protocol: Omo_2025-01-25
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Omo-security-review_2025-01-25.md

## Summary


This bug report highlights an issue with the `OmoAgent` and `OmoVault` contracts, where the `OmoVault.totalAssets()` function is not accurately tracking the assets borrowed and deposited by the `OmoAgent` agents. This results in an overvaluation of the vault shares and an inaccurate valuation of the vault's holdings. To fix this issue, the report suggests implementing a tracking mechanism to link deposited liquidity positions with their corresponding vault and modifying the `totalAssets()` function to only account for positions created from assets borrowed from that specific vault. This will ensure a more accurate valuation of the vault's holdings.

## Details

## Severity

**Impact:** High

**Likelihood:** Medium

## Description

- The `OmoAgent` agents will interact with multiple `OmoVault` vaults, borrowing assets and depositing liquidity positions back into the dynamic account (`OmoAgent`), however, the `OmoVault.totalAssets()` function accounts for **all** liquidity positions deposited in the `OmoAgent`, without tracking whether these positions were generated from assets borrowed from that specific vault.

```javascript
function totalAssets() public view virtual override returns (uint256) {
        uint256 vaultHoldings = _totalAssets;
        uint256 accountHoldings;

        // Sum up values from all registered accounts
        for (uint256 i = 0; i < accountList.length; i++) {
            address account = accountList[i];
            if (registeredAccounts[account]) {
                IDynamicAccount dynamicAcc = IDynamicAccount(account);
                accountHoldings += dynamicAcc.getPositionValue(address(asset));
            }
        }

        return vaultHoldings + accountHoldings;
    }
```

- This leads to **overvaluation** of vault shares, as `totalAssets()` will include the value of liquidity positions that originated from borrowed assets of **different vaults**, inflating the share price and creating an inaccurate valuation of the vault’s holdings.

## Recommendation

1. Implement a tracking mechanism in the `OmoAgent` contract to associate deposited liquidity positions with their **corresponding vault (`vaultId`)**, ensuring that each position is linked to the vault from which the assets used to open it were borrowed.
2. Modify `OmoVault.totalAssets()` to **only account for positions created from assets borrowed from that specific vault** rather than summing all positions in the `OmoAgent`.
