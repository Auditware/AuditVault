---
tags:
  - blockchain/evm
  - blockchain/evm/zksync
  - lang/solidity
  - platform/openzeppelin
  - has/github
  - severity/high
  - sector/bridge
  - sector/staking
  - sector/token
protocol: "[[zkSync]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/zksync-l1-diff-audit-february-2023"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[bridge-message-validation]]"
  - "[[reward-accounting]]"
---
# ETH withdrawal within allowed limit could fail

- id: 33111
- impact: HIGH
- protocol: [[zkSync]] | Layer 1 Diff Audit
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/zksync-l1-diff-audit-february-2023

## Summary


The reported bug is related to the function that limits the amount of ETH that can be withdrawn in a 1-day window. This function has a flaw that could cause a withdrawal within the limit to fail. This happens because the function checks the limit using an incorrect value for the current balance. This could lead to previous withdrawals causing a planned withdrawal to fail. The team has identified the issue and has resolved it in a recent update. They have decided to completely remove the withdrawal limitation.

## Details

The protocol enforces an ETH withdraw limit (currently 10% of the total balance) within each 1-day window as a safety mechanism. This is done through the [`_verifyWithdrawalLimit` function in `Mailbox.sol`](https://github.com/matter-labs/zksync-2-contracts/blob/3f345ce52bc378c4b5d710c80d817db170775049/ethereum/contracts/zksync/facets/Mailbox.sol#L204). However, this function has a logic flaw that could cause an ETH withdrawal within the limit to fail.


When withdrawal validations occur within the same 1-day window, the function checks the limit in [line 215 of Mailbox](https://github.com/matter-labs/zksync-2-contracts/blob/3f345ce52bc378c4b5d710c80d817db170775049/ethereum/contracts/zksync/facets/Mailbox.sol#L215), as follows:




```
 require(
                _amount + s.withdrawnAmountInWindow <= (limitData.withdrawalFactor * address(this).balance) / 100, 
                "w4"
            );

```


However, `address(this).balance` has already changed due to the previous withdrawal within the same day, causing the allowance to be less than the allowed 10%. This could cause any planned withdrawal to fail due to previous withdrawals. Note that a similar issue could also exist in the ERC-20 bridge .


Consider recording `address(this).balance` when updating `s.lastWithdrawalLimitReset`, and using it as the base when calculating the daily withdraw limit.


***Update:** Resolved in [pull request #60](https://github.com/matter-labs/zksync-2-contracts/pull/60) at commit [6365a8b](https://github.com/matter-labs/zksync-2-contracts/pull/60/commits/6365a8bbe412ff0a526905d4d87e78da5cb072e8). The Matter Labs team decided to completely remove the withdrawal limitation.*
