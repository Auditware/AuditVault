---
tags:
  - lang/solidity
  - platform/spearbit
  - has/github
  - severity/high
  - sector/bridge
  - sector/liquid-staking
protocol: "[[DRAFT]]"
auditors:
  - "[[Milo Truck]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/report-blast-contracts-review-draft.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[bridge-sender-auth]]"
---
# msg.sender has to be un-aliased in L2BlastBridge.finalizeBridgeETHDirect()

- id: 29873
- impact: HIGH
- protocol: [[DRAFT]]
- reporter: Milo Truck (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/report-blast-contracts-review-draft.pdf

## Summary


This bug report discusses a critical risk bug in the L2BlastBridge contract. The issue is related to the function finalizeBridgeETHDirect(), which is supposed to check that the sender is another contract called L1BlastBridge. However, due to the way the function is called, the sender is actually an alias of L1BlastBridge, causing the check to always fail and resulting in users not receiving their ETH on L2. The recommendation is to un-alias the sender in the check to fix the issue.

## Details

## Severity
**Critical Risk**

## Context
L2BlastBridge.sol#L48

## Description
`L2BlastBridge.finalizeBridgeETHDirect()` checks that `msg.sender` is `L1BlastBridge`:

```solidity
require(msg.sender == address(OTHER_BRIDGE), "StandardBridge: function can only be called from the other bridge");
```

However, since the function is called directly as a L1 to L2 transaction initiated by `L1BlastBridge`, which is a contract, `msg.sender` will actually be the aliased address of `L1BlastBridge`. `OTHER_BRIDGE` is the un-aliased address of `L1BlastBridge`, as other functions in `L2BlastBridge` use it, such as `_initiateBridgeETH()`. As such, this check will always revert, thus users who deposit `stETH` in `L1BlastBridge` will not receive `ETH` on L2.

## Recommendation
Un-alias `msg.sender` in the check as follows:

```solidity
- require(msg.sender == address(OTHER_BRIDGE), "StandardBridge: function can only be called from the other bridge");
+ require(AddressAliasHelper.undoL1ToL2Alias(msg.sender) == address(OTHER_BRIDGE), "StandardBridge: function can only be called from the other bridge");
```
