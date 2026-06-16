---
tags:
  - lang/solidity
  - platform/pashov
  - has/github
  - severity/high
  - sector/dex
protocol: "[[g8keep]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/g8keep-security-review_2024-12-12.md"
genome:
  - "[[state-update]]"
  - "[[wrong-state]]"
  - "[[cross-contract-state-consistency]]"
---
# [H-02] Incorrect reserve assignment leads to reserve mismatch and fund mismanagement

- id: 64999
- impact: HIGH
- protocol: _2024-12-12
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/g8keep-security-review_2024-12-12.md

## Summary


This bug report explains a problem in the `g8keepBondingCurve` function where the reserves for ETH and tokens are incorrectly assigned when handling a failed migration. This can lead to financial discrepancies and manipulation of trades. The report recommends updating the assignments in the function to fix the issue.

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

Upon handling a failed migration in the `g8keepBondingCurve::_handleMigrationFailed` function, the reserves for ETH and tokens are incorrectly assigned. The `tokenAmount` is wrongly assigned to `bReserve.reserve0`, which is intended for the native token (ETH), and the `ethAmount` is assigned to `bReserve.reserve1`, which should hold the token amount.

```solidity
File: g8keepBondingCurve.sol
942:     function _handleMigrationFailed(uint256 ethAmount, uint112 tokenAmount) internal {
943:         curveStatus = curveStatus | STATUS_MIGRATION_FAILED_FLAG;
944:         WETH.withdraw(WETH.balanceOf(address(this)));
945:
946:@>>      bReserve.reserve0 = tokenAmount;
947:@>>      bReserve.reserve1 = uint112(ethAmount);
948:
949:         emit MigrationFailed();
950:     }
```

This reversed assignment can lead to incorrect reserve calculations and mismatches during buy and sell operations. Since buys and sells can still occur after a migration failure, this issue can create financial discrepancies and allow manipulation of trades.

## Recommendations

Update the assignments in the `_handleMigrationFailed` function to correctly assign `ethAmount` to `bReserve.reserve0` and `tokenAmount` to `bReserve.reserve1`.
