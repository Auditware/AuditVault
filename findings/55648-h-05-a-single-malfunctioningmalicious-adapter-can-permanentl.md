---
tags:
  - lang/solidity
  - lang/vyper
  - sector/governance
  - sector/lending
  - platform/0x52
  - has/github
  - severity/high
  - impact/dos/permanent
  - trigger/first-deposit
protocol: "[[Dynamo]]"
auditors:
  - "[[@IAm0x52]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-10-07-Dynamo.md"
genome:
  - "[[missing-modifier]]"
  - "[[permanent]]"
  - "[[first-deposit]]"
  - "[[dos-resistance]]"
---
# [H-05] A single malfunctioning/malicious adapter can permanently DOS entire vault

- id: 55648
- impact: HIGH
- protocol: [[Dynamo]]
- reporter: @IAm0x52 (0x52)
- source: https://github.com/solodit/solodit_content/blob/main/reports/0x52/2023-10-07-Dynamo.md

## Summary


Summary:

The FundsAllocator contract in the DynamoFinance vault has a bug that could potentially cause the entire vault to be denied service. This is because the contract attempts to withdraw/deposit from each adapter when rebalancing, and if the underlying protocol does not allow this, it could lead to a denial of service. To fix this, an emergency function should be added to remove adapters and make it accessible through Governance.vy. This has been fixed by bypassing failed adapter calls in the latest commit.

## Details

**Details**

https://github.com/DynamoFinance/vault/blob/c331ffefadec7406829fc9f2e7f4ee7631bef6b3/contracts/FundsAllocator.vy#L47-L57

    for pos in range(MAX_POOLS):
        pool : BalancePool = _pool_balances[pos]
        if pool.adapter == empty(address): break

        # If the pool has been removed from the strategy then we must empty it!
        if pool.ratio == 0:
            pool.target = 0
            pool.delta = convert(pool.current, int256) * -1 # Withdraw it all!
        else:
            pool.target = (total_pool_target_assets * pool.ratio) / _total_ratios
            pool.delta = convert(pool.target, int256) - convert(pool.current, int256)

When rebalancing the vault, FundsAllocator attempts to withdraw/deposit from each adapter. In the event that the underlying protocol (such as AAVE) disallows deposits or withdrawals (or is hacked), the entire vault would be DOS'd since rebalancing is called on every withdraw, deposit or strategy change.

**Lines of Code**

[FundsAllocator.vy#L29-L94](https://github.com/DynamoFinance/vault/blob/c331ffefadec7406829fc9f2e7f4ee7631bef6b3/contracts/FundsAllocator.vy#L29-L94)

**Recommendation**

Add an emergency function to force remove adapters and make it accessible via Governance.vy

**Remediation**

Fixed [here](https://github.com/DynamoFinance/vault/commit/24f9d95cc6a7ce62c5a0229c103fe9a95cc39e12) by simply bypassing failed adapter calls
