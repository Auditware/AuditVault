---
tags:
  - lang/solidity
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - trigger/first-deposit
protocol: "[[Autonomint Colored Dollar V1]]"
auditors:
  - "[[0x73696d616f]]"
report: "https://github.com/sherlock-audit/2024-11-autonomint-judging"
genome:
  - "[[liquidation-logic]]"
  - "[[first-deposit]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# H-11: Borrower withdrawing at a loss will cause losses for cds depositors that only withdraw after the price recovers

- id: 45464
- impact: HIGH
- protocol: [[Autonomint Colored Dollar V1]]
- reporter: 0x73696d616f (Sherlock)
- source: N/A

## Summary


This bug report discusses an issue where borrowers who withdraw at a loss are protected by cds depositors. However, if the price recovers and the cds depositors do not withdraw, they will receive their full amount back at the expense of other users in the protocol. This bug is caused by a miscalculation in the code, which does not properly account for the downside protection applied to the first cds depositor. This bug can lead to a loss for the second cds depositor who is not able to withdraw their deposit. The report suggests potential solutions to mitigate this issue.

## Details

Source: https://github.com/sherlock-audit/2024-11-autonomint-judging/issues/734 

## Found by 
0x73696d616f

### Summary

Borrowers withdrawing at a loss get downside protection from cds depositors. If these cds depositors withdraw at the same price as the borrower withdrawal that triggered the loss, it works correctly. However, if they do not withdraw, but wait for the price to come back up, they will get their full cds amount back at the expense of other users in the protocol, such as cds depositors that deposit after the price recovers.

### Root Cause

In `BorrowLib.sol:874`, the downside protection is increased.
In `CDS.sol:328`, the downside protection loss is realized.
In `CDS.sol:343`, the return amount will be calculated after the price goes down and then up, returning the full amount to the cds depositor.

### Internal pre-conditions

None.

### External pre-conditions

None.

### Attack Path

1. Cds depositor deposits 1000 usda.
2. Borrower borrows 800 usda for a deposit of 1 ETH at a price of 1000 USD / ETH.
3. Price drops to 900 USD / ETH.
4. Borrower withdraws, [adding](https://github.com/sherlock-audit/2024-11-autonomint/blob/main/Blockchain/Blockchian/contracts/lib/BorrowLib.sol#L930-L934) to the cumulative value a loss of `1 * (1000 - 900) / 1000 = 0.1`, where 1000 - 900 is the price diff, 1 is the vault balance (1  ETH deposited to borrow) and 1000 in the denominator is the cds deposit made. It also [adds](https://github.com/sherlock-audit/2024-11-autonomint/blob/main/Blockchain/Blockchian/contracts/lib/BorrowLib.sol#L873-L875) 100 downside protected.
5. New borrower deposits 1 ETH at a price of 900 USD / ETH.
6. Price comes back up to 1000 USD / ETH
7. CDS depositor deposits 1000 USDa, which triggers the increase of the cumulative value gain by `1 * (1000 - 900) / 1000 = 0.1`, effectively bringing the cumulative value to 0 (it was -0.1. before). Note that it divides by 1000 and not 900, as the downside protection is applied later. The cds deposited amount becomes 1000 + 1000 - 100 = 1900, where the first 1000 is from the first cds depositor, 1000 from this cds deposit and 100 reduced from the downside protection.
8. First cds depositor withdraws their 1000 USDa, at a cumulative value of 0 both now and at the time of the deposit as it went down and up, bringing the cds deposited amount to 900.
9. Second cds depositor can not withdraw 1000 cds, because the cds deposited variable is only 900, underflowing by 100. This happens even though the price is exactly the same for the second depositor and no lossy withdrawal happened in the meantime.

### Impact

Second cds depositor is not able to withdraw their cds deposit as the first cds depositor took 900 USDa even though it contributed to the downside protection, not the second one. This will also happen on a larger scale in case more borrows / depositors participate, the presented scenario was just an example.

### PoC

POC described in the attack path section.

### Mitigation

There are a few options:
1. Consider enforcing the loss on the first cds depositor as the downside protection was applied when it was in the protocol.
2. Or, increase the cds deposited amount variable when the price comes back up, even if it was down before.
