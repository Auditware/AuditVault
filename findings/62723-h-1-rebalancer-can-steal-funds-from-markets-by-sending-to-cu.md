---
tags:
  - lang/rust
  - lang/solidity
  - sector/bridge
  - sector/dex
  - sector/lending
  - platform/sherlock
  - has/github
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Malda]]"
auditors:
  - "[[Angry_Mustache_Man]]"
  - "[[ExtraCaterpillar]]"
  - "[[SafetyBytes]]"
  - "[[Sevyn]]"
  - "[[Ziusz]]"
  - "[[axelot]]"
  - "[[bulgari]]"
  - "[[cergyk]]"
  - "[[elolpuer]]"
report: "https://github.com/sherlock-audit/2025-07-malda-judging"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# H-1: Rebalancer can steal funds from markets by sending to custom receiver through Everclear Bridge

- id: 62723
- impact: HIGH
- protocol: [[Malda]]
- reporter: cergyk (Sherlock)
- source: N/A

## Summary


The bug report discusses a potential issue found by a group of people in the rebalancer contract of the Malda Protocol. The contract allows for a message to be sent in the form of bytes, which is specific to the bridge contract. However, it was found that the parameter for the receiver was left unchecked, meaning that the rebalancer could potentially steal user funds by providing an address controlled by it. The recommendation is to check that the receiver is a valid market on the destination chain. The protocol team has already fixed this issue in a recent update. 

## Details


Source: https://github.com/sherlock-audit/2025-07-malda-judging/issues/124 

## Found by 
Angry\_Mustache\_Man, ExtraCaterpillar, SafetyBytes, Sevyn, Ziusz, axelot, bulgari, cergyk, elolpuer

### Description
The rebalancer contract is called on `sendMsg` with a message encoded as bytes (`_msg.message`). This message is specific for the bridge contract, and in the case of `EverclearBridge` it is of the form `IntentParams`:

[EverclearBridge.sol#L40-L50](https://github.com/sherlock-audit/2025-07-malda/blob/main/malda-lending/src/rebalancer/bridges/EverclearBridge.sol#L40-L50):
```solidity
    struct IntentParams {
        uint32[] destinations;
        //@audit receiver is left unchecked
        bytes32 receiver;
        address inputAsset;
        bytes32 outputAsset;
        uint256 amount;
        uint24 maxFee;
        uint48 ttl;
        bytes data;
        IFeeAdapter.FeeParams feeParams;
    }
```

We notice that the parameter `receiver` is left entirely unchecked, and the rebalancer EOA can provide an address controlled by it, stealing the user funds which should be send for rebalancing.

[EverclearBridge.sol#L111-L121](https://github.com/sherlock-audit/2025-07-malda/blob/main/malda-lending/src/rebalancer/bridges/EverclearBridge.sol#L111-L121):
```solidity
(bytes32 id,) = everclearFeeAdapter.newIntent(
    params.destinations,
    params.receiver,
    params.inputAsset,
    params.outputAsset,
    params.amount,
    params.maxFee,
    params.ttl,
    params.data,
    params.feeParams
);
```

### Recommendation

Check that `params.receiver` is a valid market on the destination chain


## Discussion

**sherlock-admin2**

The protocol team fixed this issue in the following PRs/commits:
https://github.com/malda-protocol/malda-lending/pull/103


**CergyK**

Fix looks good, now `params.receiver` is forced to be equal to `_market`
