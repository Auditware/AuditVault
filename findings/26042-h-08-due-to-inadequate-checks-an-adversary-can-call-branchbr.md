---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/governance
protocol: "[[Maia DAO Ecosystem]]"
auditors:
  - "[[xuwinnie]]"
report: "https://code4rena.com/reports/2023-05-maia"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[bridge-message-validation]]"
  - "[[bridge-sender-auth]]"
---
# [H-08] Due to inadequate checks, an adversary can call `BranchBridgeAgent#retrieveDeposit` with an invalid `_depositNonce`, which would lead to a loss of other users' deposits.

- id: 26042
- impact: HIGH
- protocol: [[Maia DAO Ecosystem]]
- reporter: xuwinnie (Code4rena)
- source: https://code4rena.com/reports/2023-05-maia

## Summary


A bug has been discovered in the BranchBridgeAgent#retrieveDeposit function of the Maia project. This bug allows an attacker to call the function with an invalid `_depositNonce`, which will cause the user's funds to be collected and locked on the Branch chain without it being recorded on the root chain. This means, when a user makes a deposit and their deposit is assigned a `depositNonce`, which the attacker previously called `retrieveDeposit` for, their tokens would be collected on the BranchBridgeAgent, but not succeed on the RootBridgeAgent. This will result in the user losing their deposit.

To mitigate this issue, a simple solution is to ensure that in the `BranchBridgeAgent#retrieveDepoit` function, `msg.sender==getDeposit[_depositNonce].owner` is called, just like it was done in `BranchBridgeAgent#retryDeposit`. The bug has been confirmed by 0xBugsy (Maia) and addressed by 0xLightt (Maia).

## Details


An attacker will cause the user's funds to be collected and locked on Branch chain without it being recorded on the root chain.

### Proof of Concept

Anyone can call `BranchBridgeAgent#retrieveDeposit` with an invalid `_depositNonce`:

```solidity
function retrieveDeposit(
        uint32 _depositNonce
    ) external payable lock requiresFallbackGas {
        //Encode Data for cross-chain call.
        bytes memory packedData = abi.encodePacked(
            bytes1(0x08),
            _depositNonce,
            msg.value.toUint128(),
            uint128(0)
        );

        //Update State and Perform Call
        _sendRetrieveOrRetry(packedData);
    }
```

For example, if global `depositNonce` is "x", an attacker can call `retrieveDeposit(x+y)`. `RootBridgeAgent#anyExecute` will be called and the `executionHistory` for the `depositNonce` that the attacker specified would be updated to true.

```solidity
    function anyExecute(bytes calldata data){
        ...
    /// DEPOSIT FLAG: 8 (retrieveDeposit)
    else if (flag == 0x08) {
    //Get nonce
    uint32 nonce = uint32(bytes4(data[1:5]));

    //Check if tx has already been executed
    if (!executionHistory[fromChainId][uint32(bytes4(data[1:5]))]) {
        //Toggle Nonce as executed
        executionHistory[fromChainId][nonce] = true;

        //Retry failed fallback
        (success, result) = (false, "");
    } else {
        _forceRevert();
        //Return true to avoid triggering anyFallback in case of `_forceRevert()` failure
        return (true, "already executed tx");
    }
    }
    ...
    }
```

This means, that when a user makes a deposit on the `BranchBridgeAgent` and their deposit gets assigned a `depositNonce`, which the attacker previously called `retrieveDeposit` for, their tokens would be collected on the `BranchBridgeAgent`, but would not succeed on `RootBridgeAgent`. This is because `executionHistory` for that `depositNonce` has already been maliciously set to true.

### Attack Scenario

- The current global `depositNonce` is 50.
- An attacker calls `retrieveDeposit`(60), which would update `executionHistory` of `depositNonce`(60) to true on the Root chain.
- When a user tries to call any of the functions (say `callOutAndBridge`) and gets assigned `depositNonce` of 60, it won't be executed on root chain because `executionHistory` for `depositNonce`(60) is already set to true.
- A user won't also be able to claim their tokens because `anyFallback` was not triggered. So they have lost their deposit.

### Recommended Mitigation Steps

A very simple and effective solution is to ensure that in the `BranchBridgeAgent#retrieveDepoit` function, `msg.sender==getDeposit[_depositNonce].owner` is called just like it was done in [`BranchBridgeAgent#retryDeposit`](https://github.com/code-423n4/2023-05-maia/blob/main/src/ulysses-omnichain/BranchBridgeAgent.sol#L327).

### Assessed type

Invalid Validation

**[0xBugsy (Maia) confirmed](https://github.com/code-423n4/2023-05-maia-findings/issues/688#issuecomment-1632852679)**

**[0xLightt (Maia) commented](https://github.com/code-423n4/2023-05-maia-findings/issues/688#issuecomment-1708808381):**
> Addressed [here](https://github.com/Maia-DAO/eco-c4-contest/tree/183-492-688-869).

***
