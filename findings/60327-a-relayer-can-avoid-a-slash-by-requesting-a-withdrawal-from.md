---
tags:
  - lang/solidity
  - sector/bridge
  - sector/staking
  - platform/quantstamp
  - severity/high
  - vuln/arithmetic/underflow
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/locked-funds
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Pheasant Network]]"
auditors:
  - "[[Danny Aksenov]]"
report: "https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html"
genome:
  - "[[underflow]]"
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
  - "[[integer-bounds]]"
---
# A Relayer Can Avoid a Slash by Requesting a Withdrawal From the Bond

- id: 60327
- impact: HIGH
- protocol: [[Pheasant Network]]
- reporter: Danny Aksenov (Quantstamp)
- source: https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html

## Summary


The team has fixed a previous issue, but a new issue still exists. The `bondWithdrawal` function can only track one type of token, but the `BondManager` can support multiple tokens. This can lead to unexpected behavior in the `withdraw()` function. The team has made a second round of fixes by adding a mapping to differentiate between deposits for different tokens in the `BondManager` file. The issue is that when a Relayer withdraws their funds, the amount is instantly made unslashable, which is not the expected behavior. This can be exploited by a Relayer to prevent being slashed. The team recommends referring to a previous recommendation for a related issue.

## Details

**Update**
The team fixed the described issue. However, an issue persisted: `bondWithdrawal` can only keep track of one token, but `BondManager` supports several tokens. `getBond()` receives a token ID as parameter (token A) and subtracts `bondWithdrawal.withdrawalAmount` (can be ANY token). This wrong accounting can lead to unexpected behavior in `PheasantNetworkBridgeChild.withdraw()`.

In a second round of fixes, the team solved this additional issue by adding a mapping to differentiate deposits for different tokens in the Bond Manager (commit `e8a5ca559de4e93407f72ce394b87bcf922995ea`).

**File(s) affected:**`BondManager.sol`

**Description:** The Relayer can withdraw his funds locked in the `Bond Manager` in two steps: 1) request the withdrawal and 2) execute the withdrawal, available after a period of `UPDATE_PERIOD` seconds. When the Relayer executes the first step for an amount `A`, that amount is deducted from the internal accounting. It means that this amount instantly becomes unslashable, while we would expect that the Relayer should remain slashable, especially after he asked for a withdrawal. In parallel, the function `slash()` contains the line `bonds[_tokenIndex] -= _amount;` which can be used by the Relayer to prevent being slashed, as illustrated in the "Exploit section".

**Exploit Scenario:**

1.   Relayer locks 100 tokens in the Bond Manager.
2.   A user triggers a transfer of 30 tokens.
3.   Relayer decides to keep these 30 tokens. It means that he will become slashable for a period of `DISPUTE_PERIOD = 14 days`.
4.   Relayer calls `BondManager.executeWithdrawBond()` for an amount of 80 tokens (it must be any amount between 71 and 100 to make that exploit succeed). The storage variable `bonds[_tokenIndex]` is now 100 - 80 = 20.
5.   A Disputer tries to slash the Relayer, which indirectly triggers the function `BondManager.slash()` that will fail due to an underflow at the instruction `bonds[_tokenIndex] -= _amount;` (because we try to do `20 -= 30;`).
6.   The Relayer calls `BondManager.finalizeWithdrawalBond()` to get back the 80 tokens. He keeps 20 tokens locked in the Bond Manager and 30 tokens on L1.

**Recommendation:** Please refer to the recommendation in "[PHE-3](https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html#findings-qs3) : The Invariant `totalSlashableAmount < lockedAmountInBond` Is Not Enforced in the Code" since both issues are related.
