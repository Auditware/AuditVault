---
tags:
  - severity/high
  - has/github
  - lang/solidity
  - sector/oracle
protocol: "[[Hanji]]"
auditors:
  - MixBytes
report: "https://github.com/mixbytes/audits_public/blob/master/Hanji/Liquidity%20Vault/README.md#4-double-counted-fees-in-partial-bid-claims"
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

- id: 55151
- impact: HIGH
- protocol: Hanji
- reporter: MixBytes
- source: https://github.com/mixbytes/audits_public/blob/master/Hanji/Liquidity%20Vault/README.md#4-double-counted-fees-in-partial-bid-claims

## Summary


This bug report is about a problem in a contract called `ProxyLOB`. The issue happens when placing a bid (a request to buy something) and the order is only partially executed. In this case, the fee that was not used is returned to the LPManager (a manager of the contract) but is not subtracted from a record of the fee called `lobReservesByTokenId`. This causes the contract to think there is more fee than there actually is, which could lead to serious problems. The recommendation is to update the contract to fix this issue.

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
