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
  - "[[missing]]"
  - "[[indirect-loss]]"
  - "[[bridge-message-validation]]"
  - "[[reward-accounting]]"
---
# Relayer Can Set Arbitrary Supported Tokens for Upward Trades on L2

- id: 60334
- impact: HIGH
- protocol: [[Pheasant Network]]
- reporter: Danny Aksenov (Quantstamp)
- source: https://certificate.quantstamp.com/full/pheasant-network/0b120935-78d1-45a1-88c4-f770c8e5fa52/index.html

## Summary


This bug report is about a problem in the code for a specific file called `PheasantNetworkBridgeChild.sol`. The issue occurs when a certain function, `acceptUpwardTrade()`, is used by a relayer. The function includes an extra parameter called `_tokenTypeIndex` that needs to be checked to make sure it matches the network id. This will prevent any malicious activity and ensure that the trade is valid. The bug has been fixed in the code and the fix can be found in the specific code version mentioned in the report.

## Details

**Update**
Addressed in: `f0ce3b728e76ae15ac71c5809a28f2a283a54596`.

**File(s) affected:**`PheasantNetworkBridgeChild.sol`

**Description:** When a relayer executes `PheasantNetworkBridgeChild.acceptUpwardTrade()`, it supplies the `_tokenTypeIndex` as an additional parameter next to the evidence struct. Note that this trade will not be subject to slashing as a result of such a malicious relay, as all rules have been followed, and the target network is still the correct one.

**Recommendation:** Validate if the `_tokenTypeIndex` and the network id are matching the values provided through the evidence structure.
