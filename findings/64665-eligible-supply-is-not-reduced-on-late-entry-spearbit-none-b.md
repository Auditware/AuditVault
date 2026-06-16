---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/governance
protocol: "[[Buck Labs]]"
auditors:
  - "[[R0bert]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Strong-DAO-Spearbit-Security-Review-December-2025.pdf"
genome:
  - "[[state-update]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Eligible supply is not reduced on late entry

- id: 64665
- impact: HIGH
- protocol: [[Buck Labs]]: Smart Contracts
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Strong-DAO-Spearbit-Security-Review-December-2025.pdf

## Summary


This bug report discusses an issue with the RewardsEngine contract, specifically in the code section between lines 1257 and 1274. The issue is related to the integration of global eligible units, which are meant to represent the sum of balances that are currently eligible to earn rewards. However, in the case of a late-entry, where an account becomes ineligible for rewards, the prior eligible balance is not removed from the global eligible supply. This results in a discrepancy between the actual eligible units and the global denominator used for distribution, leading to diluted rewards for eligible accounts. 

The impact of this bug is that rewards can be systematically diluted and distribution accounting becomes inconsistent. To fix this issue, the recommendation is to subtract the ineligible balance from the global eligible supply before marking the account as ineligible. Additionally, if eligibility can be partial per-balance, an explicit eligible balance should be tracked per account and used to update the global eligible supply. 

The bug has been fixed in commit `559b098` by removing the late-entry disqualification and replacing it with late-inflow accounting. This ensures that the global denominator only reflects the earning balance and prevents dilution from ineligible units. The accrual paths have also been updated to use the earning balance, further preventing dilution. 

## Details

## Severity: High Risk

## Context
`RewardsEngine.sol#L1257-L1274`

## Description
RewardsEngine integrates global eligible units using `currentEligibleSupply`, which is intended to represent the sum of balances that are currently eligible to earn. In the late-entry path of `_handleInflow`, the account is marked ineligible, but the prior eligible balance is not removed from `currentEligibleSupply`. If the account already had an eligible balance before the late inflow, the global integrator keeps counting that balance even though the account will no longer accrue units.

```solidity
bool isLateEntry = (checkpointStart > 0 && now_ >= checkpointStart && now_ < epochEnd);
if (isLateEntry) {
    s.eligible = false;
    s.lastAccrualTime = now_;
} else {
    if (!s.excluded) {
        s.eligible = true;
        currentEligibleSupply += amount;
    }
}
if (elapsed > 0 && currentEligibleSupply > 0) {
    globalEligibleUnits += currentEligibleSupply * elapsed;
}
```

This breaks the intended relationship between the per-account accruals and the global denominator used at distribution time. The contract then computes `deltaIndex` using a denominator that includes balances that are no longer eligible, so it dilutes rewards for eligible accounts and decouples `globalEligibleUnits` from the sum of actual eligible units.

## Impact
Rewards can be systematically diluted, and distribution accounting becomes inconsistent because the denominator includes balances that are no longer earning.

## Recommendation
When an account becomes ineligible during `_handleInflow`, subtract its eligible balance from `currentEligibleSupply` before flipping the flag. If eligibility can be partial per-balance, track an explicit eligible balance per account and update `currentEligibleSupply` using that value.

## Buck Labs
Fixed in commit `559b098`.

## Spearbit
Fix verified. Commit `559b098` fixes the issue by removing the late-entry disqualification that inflated `currentEligibleSupply` and replacing it with late-inflow accounting, so the denominator only reflects the earning balance.

- `src/rewards/RewardsEngine.sol` adds `lateInflow/lateInflowEpoch`, treats late inflows as non-earning, and keeps `currentEligibleSupply` unchanged for those tokens; outflows now reduce eligible supply only for the earning portion, so the global denominator stays consistent.
- The accrual paths are updated to use `earningBalance` (balance minus late inflow), preventing dilution from ineligible units.
