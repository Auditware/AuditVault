---
tags:
  - lang/solidity
  - sector/bridge
  - platform/quantstamp
  - severity/high
  - impact/loss-of-funds/locked-funds
protocol: "[[Pheasant Network]]"
auditors:
  - "[[Danny Aksenov]]"
report: "https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[bridge-message-validation]]"
---
# Relayer's Bond Funds Can Be Lost

- id: 60331
- impact: HIGH
- protocol: [[Pheasant Network]]
- reporter: Danny Aksenov (Quantstamp)
- source: https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html

## Summary


This bug report is about a problem in the `BondManager.sol` file where a relayer can withdraw funds by calling the `executeWithdrawBond()` function and then waiting for a certain period of time before finalizing the withdrawal with the `finalizeWithdrawalBond()` function. However, if the relayer calls `executeWithdrawBond()` multiple times without finalizing the withdrawal, the amount of funds will decrease and the previous withdrawal request will be blocked, causing the relayer to receive less funds than expected. The report suggests two possible solutions: either not allowing new requests until the previous one is finalized, or implementing a queue system that can handle multiple withdrawals.

## Details

**Update**
The customer followed the first recommended approach, and moved the deduction of funds from the function `executeWithdrawBond()` to the function `finalizeWithdrawalBond()`.

**File(s) affected:**`BondManager.sol`

**Description:** Relayer can withdraw the funds deposited in `BondManager` by calling `executeWithdrawBond()`, waiting `UPDATE_PERIOD`, and calling `finalizeWithdrawalBond()`. However, if the relayer calls `executeWithdrawBond()` several times without finalizing the withdrawal with `finalizeWithdrawalBond()`, the amount of the bonds will be decreased, and `bondWithdrawal` will be overwritten in each call, blocking the amount of funds passed in the previous calls.

**Exploit Scenario:**

1.   Relayer calls `executeWithdrawBond(1, 100)`
    *   `bonds[tokenId1] - 100 = 900`
    *   `bondWithdrawal = (timeStamp1, tokenId1, 100)`

2.   Relayer calls `executeWithdrawBond(1, 300)`
    *   `bonds[1] - 300 = 600`
    *   `bondWithdrawal = (timeStamp2, tokenId1, 300)`

3.   Relayer calls `finalizeWithdrawalBond()`
    *   Relayer will receive only `300`. The request of withdrawing `100` was overwritten and will never be processed, but the system accounted for those `100` by updating the `bonds` mapping.

**Recommendation:** There are several approaches:

1.   Do not allow new requests until the previous one is finalized.
2.   Implement a queue system that supports more than one withdrawal.
