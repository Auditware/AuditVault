---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/bridge
  - sector/staking
protocol: "[[Pheasant Network]]"
auditors:
  - "[[Danny Aksenov]]"
report: "https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html"
genome:
  - "[[price-calculation]]"
  - "[[defi/price-manipulation]]"
  - "[[bridge-message-validation]]"
  - "[[dos-resistance]]"
  - "[[reward-accounting]]"
---
# Relayer Can Use Valid Evidence of One Trade to Avoid Getting Slashed for Another Trade

- id: 60335
- impact: HIGH
- protocol: [[Pheasant Network]]
- reporter: Danny Aksenov (Quantstamp)
- source: https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html

## Summary


The bug report is about a potential exploit in the function `withdraw()` of the `PheasantNetworkBridgeChild.sol` file. The issue is that the evidence submitted by the Relayer is not checked, making it possible for the Relayer to keep funds without getting slashed. The exploit involves creating a small trade on L2 and using its evidence to withdraw a larger amount on L1. The recommendation is to separate the data structure for recording evidence into two sets for L1 -> L2 trades and L2 -> L1 trades.

## Details

**Update**
Addressed in: `0508a14eb93180ea7b313978248663a60ccb5faa`.

**File(s) affected:**`PheasantNetworkBridgeChild.sol`

**Description:** The evidence submitted by the Relayer is not checked at all in the function `withdraw()`. This may be explained by the fact that the system is an optimistic bridge and that if the evidence provided is incorrect, it will be detected, and the Relayer will get slashed.

However, the current system makes the following scenario possible:

1.   One user sends the equivalent of `100$` to Relayer on L1 because he wants to do a L1 -> L2 trade.
2.   In that exploit, the goal of the Relayer is to keep this '100$`(meaning, not sending on L2 the`100$` to the user) and not get slashed for that.
3.   For that exploit to work, a trade L2 -> L1 initiated by anyone (it can be the Relayer itself) must exist with a small amount, let's say, `10$`. That trade is created using the function `newTrade()`, so it has the status `Lib_DefaultValues.STATUS_START`.
4.   The Relayer calls `withdraw()` with the evidence of the trade of `100$` and the tradeID of the trade of `10$`. As a result, the lines `isUniqueHashedEvidence[hashedEvidence] = uint(Bool.TRUE);` and `hashedEvidences[_user][_index] = hashedEvidence;` are executed.
5.   The Relayer cannot get slashed anymore for the trade of `100$` by a user calling `slashUpwardTrade()`, because the first require statement will revert since the evidence he will have to use has already been recorded.
6.   Relayer can still get slashed by a disputer calling the function `slash()` for the trade of `10$`, but the whole exploit will be profitable for the Relayer.

**Recommendation:** Consider separating the data structure recording the hash evidences (`isUniqueHashedEvidence` and `hashedEvidences`) in two sets, one for L1 -> L2 trades and one for L2 -> L1 trades.
