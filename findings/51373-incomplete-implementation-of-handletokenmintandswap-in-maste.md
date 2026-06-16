---
tags:
  - lang/solidity
  - severity/high
  - platform/halborn
  - sector/dex
protocol: "[[Entangle Trillion]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/entangle-labs/entangle-trillion"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# Incomplete Implementation of HandleTokenMintAndSwap in MasterSpotter Contract

- id: 51373
- impact: HIGH
- protocol: [[Entangle Trillion]]
- reporter: Halborn
- source: https://www.halborn.com/audits/entangle-labs/entangle-trillion

## Summary


The MasterSpotter contract is supposed to handle certain events related to token minting and swapping. However, upon review, it is found that the function responsible for handling these events does not have any actual code to process them. This could result in important events being missed and affecting the proper functioning of the system. The report suggests reviewing the intended behavior and implementing the necessary logic to ensure these events are properly handled. The issue has been marked as "Not Applicable" as the code-base is no longer in use.

## Details

##### Description

The `MasterSpotter` contract, which is part of a broader system designed to handle various blockchain events, includes the function `HandleTokenMintAndSwap`. This function is intended to process specific events related to token minting and swapping. Upon review, it is observed that the function contains a placeholder comment "TODO handle?" and does not implement any logic beyond decoding the event parameters. This incomplete implementation suggests that the functionality for handling the `TokenMintAndSwap` event is not fully developed, potentially leading to unprocessed events and missed actions that could be critical for the intended operation of the system.

  

```
    // #region Balance Spotter Handlers
    // ??? Huh will this ever be called
    function HandleTokenMintAndSwap(bytes calldata b) public onlyRole(SPOTTER) {
        (, , , , bytes memory eventParams) = abi.decode(b, (bytes32, uint256, uint256, bytes32, bytes));

        EntangleTestBridgeEvents.TokenMintAndSwap memory tokenMintAndSwap = EntangleTestBridgeEvents
            .DecodeTokenMintAndSwap(eventParams);
        // TODO handle?
        return;
    }
```

##### BVSS

[AO:A/AC:L/AX:L/C:N/I:C/A:C/D:N/Y:N/R:P/S:C (7.8)](/bvss?q=AO:A/AC:L/AX:L/C:N/I:C/A:C/D:N/Y:N/R:P/S:C)

##### Recommendation

Review the intended behavior and necessary actions for the `TokenMintAndSwap` events within the context of the `MasterSpotter` contract's role in the system. Develop and integrate the required logic to ensure that these events are processed appropriately, executing any necessary actions such as updating internal states, interacting with other contracts, or triggering further events.

  

**Remediation Plan:** The issue is marked as “Not Applicable” due to the related code-base is deprecated.
