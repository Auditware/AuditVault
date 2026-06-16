---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[XPress]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#4-double-counted-fees-in-partial-bid-claims"
genome:
  - "[[fee-accounting]]"
  - "[[arithmetic/rounding]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# Double-Counted Fees in Partial Bid Claims

- id: 56820
- impact: HIGH
- protocol: XPress
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/XPress/Liquidity%20Vault/README.md#4-double-counted-fees-in-partial-bid-claims

## Summary


The `_claimOrder` function in the `ProxyLOB` contract has a bug where if a bid is partially executed and `claimOrder` is invoked with `only_claim` set to false, the unclaimed fee portion is returned to the LPManager but is not subtracted from `lobReservesByTokenId`. This causes an inflated reserve calculation and can lead to protocol insolvency. To fix this, the function should be updated to remove the unclaimed fee portion from `lobReservesByTokenId` once it is returned to the LPManager.

## Details

##### Description
This issue has been identified within the `_claimOrder` function of the `ProxyLOB` contract. 

When placing a bid (`isAsk = false`), the contract transfers `quantity * price + passivePayoutCommission` into the LOB and records the same total in `lobReservesByTokenId`. However, if the order is partially executed, and `claimOrder` is invoked with `only_claim = false`, the unfilled portion of the fee is returned to the LPManager but is never subtracted from `lobReservesByTokenId`. Consequently, `_getReserves` continues to count fees that no longer remain, causing an inflated reserve calculation.

The issue is classified as **critical** severity because overstating reserves can lead to protocol insolvency if the system operates on incorrect balance assumptions.

##### Recommendation
We recommend updating `_claimOrder` to remove the unclaimed fee portion from `lobReservesByTokenId` once it is returned to the LPManager. This prevents double-counting in reserve calculations. For instance, change:
```solidity!
uint256 executedValue = executedShares * price;
uint256 passiveFee = executedValue.mulWadUp(passiveCommissionRate);
```
to:
```solidity!
uint256 returnedValue = totalClaimedShares * price;
uint256 passiveFee = returnedValue.mulWadUp(passiveCommissionRate);
```

---
