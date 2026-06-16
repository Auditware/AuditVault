---
tags:
  - lang/solidity
  - sector/bridge
  - sector/token
  - platform/quantstamp
  - severity/high
  - vuln/access-control/missing-modifier
  - vuln/reentrancy/single-function
  - fix/add-access-control
  - novelty/known-pattern
  - misassumption/admin-is-honest
  - misassumption/external-call-is-safe
  - fix/use-reentrancy-guard
  - trigger/reentrancy-callback
protocol: "[[Pheasant Network]]"
auditors:
  - "[[Danny Aksenov]]"
report: "https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html"
genome:
  - "[[missing-modifier]]"
  - "[[single-function]]"
  - "[[role-bypass]]"
  - "[[add-access-control]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[reentrancy-guard]]"
---
# Reentrancy Lets Relayer Withdraw More than Expected by Bond Withdrawal

- id: 60329
- impact: HIGH
- protocol: [[Pheasant Network]]
- reporter: Danny Aksenov (Quantstamp)
- source: https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html

## Summary


The bug report addresses an issue in the `BondManager.sol` file, where a Relayer can withdraw a certain amount of tokens from their bond by calling the `executeWithdrawBond()` function. However, if the Relayer is a contract and the withdrawn token is a native token or a special ERC20 implementation, reentrancy can occur, resulting in incorrect accounting and potentially leaving only a portion of the tokens in the bond. The recommendation is to add a non-reentrant modifier to the function and follow the Check-Effects-Interacts pattern to prevent this issue.

## Details

**Update**
Addressed in: `b0faa8d93c7a7d91961db24753a322a3a8117ca0`.

**File(s) affected:**`BondManager.sol`

**Description:** The Relayer can plan a request to withdraw a given amount `A` of tokens from its bond by calling the function `executeWithdrawBond()`. He will have to wait for a delay of `UPDATE_PERIOD` before being able to withdraw that amount by calling the function `finalizeWithdrawalBond()`. However, in the special case where the Relayer is a contract and the withdrawn token is a native token or some special ERC20 implementation, reentrancy is possible and the Relayer can withdraw a maximum of `totalLockedAmount - totalLockedAmount % A` because each withdrawal must be of exactly A tokens. It would result in a broken internal accounting and in the worst case, only `totalLockedAmount % A` remaining in the bond manager.

**Recommendation:** Add a non-reentrant modifier to the function and follow the Check-Effects-Interacts pattern.
