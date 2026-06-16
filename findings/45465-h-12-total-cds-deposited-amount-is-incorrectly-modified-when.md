---
tags:
  - lang/solidity
  - sector/lending
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
protocol: "[[Autonomint Colored Dollar V1]]"
auditors:
  - "[[0x73696d616f]]"
report: "https://github.com/sherlock-audit/2024-11-autonomint-judging"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[integer-bounds]]"
---
# H-12: Total cds deposited amount is incorrectly modified when cds depositor is at a loss, leading to stuck USDa

- id: 45465
- impact: HIGH
- protocol: [[Autonomint Colored Dollar V1]]
- reporter: 0x73696d616f (Sherlock)
- source: N/A

## Summary


This bug report is about an issue in the Autonomint blockchain project. The problem occurs when a user deposits a certain amount of USDa currency into the system, but then withdraws it at a later time when the value of the currency has decreased. This causes the total amount of USDa deposited to be incorrectly reduced, leading to stuck USDa and potential loss of funds for the user. The root cause of this issue is a faulty calculation in the code that decreases the total amount of USDa deposited by the user's withdrawal amount, which includes any losses they may have taken. This bug can be exploited by depositing a certain amount of USDa at a high price, then withdrawing it at a lower price, causing the total deposited amount to be incorrect and leading to stuck funds. The impact of this bug can vary depending on the use case, but it can result in stuck funds, loss of funds, or disrupted withdrawals. To fix this issue, the code needs to be updated to divide by the correct total amount of USDa deposited, ensuring that the individual deposited amounts add up to the total amount. 

## Details

Source: https://github.com/sherlock-audit/2024-11-autonomint-judging/issues/738 

## Found by 
0x73696d616f

### Summary

The total cds deposited amount is [decreased](https://github.com/sherlock-audit/2024-11-autonomint/blob/main/Blockchain/Blockchian/contracts/lib/CDSLib.sol#L713) by the [returned amount](https://github.com/sherlock-audit/2024-11-autonomint/blob/main/Blockchain/Blockchian/contracts/Core_logic/CDS.sol#L343) when the cds depositor withdraws, which will include any loss that the cds depositor has taken. After the withdrawal, the following cumulative values will be [calculated](https://github.com/sherlock-audit/2024-11-autonomint/blob/main/Blockchain/Blockchian/contracts/Core_logic/CDS.sol#L312) based on this faulty total cds deposited amount and lead to stuck USDa.

### Root Cause

In `CDSLib.sol:713`, `params.omniChainData.totalCdsDepositedAmount` is decreased by `params.cdsDepositDetails.depositedAmount`, which includes the loss.

### Internal pre-conditions

None.

### External pre-conditions

None.

### Attack Path

1. Cds depositors deposit 400 and 600 USDa, respectively, at a price of 1000 USD / ETH.
2. Borrower deposits 1 ETH at the same 1000 USD / ETH price.
3. Price drops to 900 USD / ETH.
4. 400 cds depositor withdraws, calculating a lossy cumulative value of `1 * (1000 - 900) / 1000 = 0.1`. The return amount is `400 - 400 * 0.1 = 360`. The final total cds deposited amount is 1000 - 360 = 640.
5. All the cumulative values will be calculated on a total cds deposited amount of 640, but the cds depositor left has 600 deposit amount, so all values will be off. For example, consider that the price goes up to 1000 USD / ETH again, and the cds depositor withdraws. The cumulative value will be increased by `1 * (1000 - 900) / 640 = 0.15625`, netting `-0.1 + 0.15625 = 0.05625`, which becomes `600 + 600 * 0.05625 = 633.75`, so 6.25 USDa will be stuck.
6. Alternatively, if the price drops to 850 USD / ETH, and the borrower withdraws, the final total cds deposited amount will underflow, as the downside protected value is 150, so it becomes `640 - 150 - (600 - 600 * (0.1 + 1 * (900 - 850) / 640)) = -3.125`. Note that if it was divided by 600, instead of 640, it would not underflow and everything would add up, for example.

### Impact

Stuck USDa, loss of USDa on withdrawal or DoSed withdrawal, depending on use case.

### PoC

See attack path above.

### Mitigation

Divide by the correct total cds deposited, such that the sum of individual cds deposited amounts equals the total cds deposited amount.
