---
tags:
  - lang/solidity
  - has/github
  - platform/zokyo
  - severity/high
  - sector/bridge
protocol: "[[Cedro Finance]]"
auditors:
  - "[[Zokyo]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-03-19-Cedro Finance.md"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[bridge-message-validation]]"
---
# Method `depositRequest(...)` allows the last deposit to be more than the set deposit cap

- id: 37518
- impact: HIGH
- protocol: [[Cedro Finance]]
- reporter: Zokyo
- source: https://github.com/solodit/solodit_content/blob/main/reports/Zokyo/2024-03-19-Cedro Finance.md

## Summary


The bug report discusses an issue with the `depositRequest()` method in the Contract Branch.sol file. This method is responsible for checking if the deposit cap has been reached before processing any deposits. However, there is a problem with how the deposit cap is being calculated. 

Currently, the deposit cap is set based on the liquidity after tokens have been deposited. This means that if a user deposits more tokens than the set cap, the method does not revert and the deposit is still processed. This can lead to a situation where the total deposited tokens exceed the set cap. 

To fix this issue, the recommendation is to update the `depositRequest()` method to revert if the current deposit is more than the set cap for that particular pool id. This will ensure that the deposit cap is properly enforced and prevent users from depositing more tokens than the set limit. 

## Details

**Severity**: High

**Status**: Resolved

**Description**

In Contract Branch.sol, the method `depositRequest()` checks if the `depositCap` has been reached before processing any deposit.

```solidity
       if (depositCapReached[id]) revert DepositCapReached(TAG, id);
```
However, the deposit cap reached is set as follows:
```solidity
if (liquidity > capAmount[id]) {
           depositCapReached[id] = true;
       }
```
Here the liquidity is calculated after tokens have been deposited and if liquidity is more than the cap amount, it does not revert.

For eg.

- ADMIN sets capAmount for MATIC as 1 million

- User A deposits 0.99 million MATIC and depositCapReached is still false as liquidity < capAmount.

- User B deposits 5 million MATIC and depositCapReached is set as true as liquidity > capAmount.

- Now total deposited MATIC is 5.99 million where whereas the set cap was 1 million only.

- This way a user can deposit much more than the set cap.

**Recommendation**: 

Update the method `depositRequest()` to revert if the current deposit is more than the `setCap` for that particular pool id.
