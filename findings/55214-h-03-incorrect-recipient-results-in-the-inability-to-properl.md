---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/dex
  - sector/options
protocol: "[[Burve]]"
auditors:
  - Pashov Audit Group
report: "https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-01-29.md"
genome:
  - "[[cross-contract-state-consistency]]"
  - "[[logic/state-update]]"
  - "[[loss-of-funds/locked-funds]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[add-check]]"
  - "[[blast-radius/single-user]]"
---
# [H-03] Incorrect recipient results in the inability to properly redeem a position

- id: 55214
- impact: HIGH
- protocol: Burve_2025-01-29
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/Burve-security-review_2025-01-29.md

## Summary


This bug report describes a problem that occurs when trying to mint tokens using a specific code. The severity of this issue is medium and the likelihood of it happening is high. 

The report explains that when minting tokens, the recipient is set incorrectly, which can cause issues when trying to burn the tokens later on. This is because the recipient is set as the `recipient` input instead of `address(this)`. As a result, when trying to burn the tokens, the `Burve` contract, which does not have the minted shares, will revert and cause problems.

The report suggests two options to fix this issue: either transfer the shares to the `Burve` contract before burning them, or burn the shares directly on the island. However, the latter option will result in the user still having the minted `Burve` shares. 

To fix this bug, the report recommends changing the code to set the recipient as `address(this)` instead of the `recipient` input. This will ensure that the tokens can be burned correctly without any issues.

## Details

## Severity

**Impact:** Medium

**Likelihood:** High

## Description

Upon minting, we have the following code:

```solidity
if (range.lower == 0 && range.upper == 0) {
            uint256 mintShares = islandLiqToShares(liq);
            island.mint(mintShares, recipient);
        } else {
            // mint the V3 ranges
            pool.mint(address(this), range.lower, range.upper, liq, abi.encode(msg.sender));
        }
```

When minting for the island, we set the recipient as the `recipient` input and when minting Uniswap V3 liquidity, we set the recipient as `address(this)`. The latter is correct while the former is not. This is because when burning, the shares will be burned from the caller of the `burn()` function on the target, which will be the `Burve` contract. As the `Burve` contract does not have the minted shares when minting for the island, we will simply revert.

The user still has 2 options, thus the medium impact:

- batch a transaction by transferring the shares to the `Burve` contract and then burning the liquidity, this will result in the correct result
- simply burn his shares directly on the island, note that this will result in the user still having the minted `Burve` shares

## Recommendations

```diff
-  island.mint(mintShares, recipient);
+  island.mint(mintShares, address(this));
```
