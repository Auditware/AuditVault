---
tags:
  - platform/code4rena
  - lang/solidity
  - has/github
  - severity/high
  - sector/bridge
protocol: "[[Connext]]"
auditors:
  - "[[Code4rena]]"
report: "https://code4rena.com/reports/2021-07-connext"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[extcall-return-validation]]"
---
# [H-05] `Approval` is not reset if the call to `IFulfillHelper` fails

- id: 25506
- impact: HIGH
- protocol: [[Connext]]
- reporter: Code4rena (Code4rena)
- source: https://code4rena.com/reports/2021-07-connext

## Summary


A bug was discovered in the function `fulfill` of the Connext codebase, which can be exploited by a malicious `callTo` to pull tokens. The function first approves the `callTo` to transfer an amount of `toSend` tokens and tries to call `IFulfillHelper`, but if the call fails, it transfers these assets directly. The issue is that in such case the approval is not reset, allowing the malicious `callTo` to pull these tokens later.

The bug was found by pauliax, 0xsanson, cmichel and shw and was confirmed and patched by LayneHaber (Connext). The patch can be found at https://github.com/connext/nxtp/pull/39 and it recommends that `approval` should be placed inside the try/catch block or `approval` needs to be reset if the call fails.

## Details

_Submitted by pauliax, also found by 0xsanson, cmichel and shw_

The function `fulfill` first approves the `callTo` to transfer an amount of `toSend` tokens and tries to call `IFulfillHelper`, but if the call fails, it transfers these assets directly. However, in such case the approval is not reset, so a malicous `callTo` can pull these tokens later:
```solidity
// First, approve the funds to the helper if needed
    if (!LibAsset.isEther(txData.receivingAssetId) && toSend > 0) {
      require(LibERC20.approve(txData.receivingAssetId, txData.callTo, toSend), "fulfill: APPROVAL_FAILED");
    }

    // Next, call `addFunds` on the helper. Helpers should internally
    // track funds to make sure no one user is able to take all funds
    // for tx
    if (toSend > 0) {
      try
        IFulfillHelper(txData.callTo).addFunds{ value: LibAsset.isEther(txData.receivingAssetId) ? toSend : 0}(
          txData.user,
          txData.transactionId,
          txData.receivingAssetId,
          toSend
        )
      {} catch {
        // Regardless of error within the callData execution, send funds
        // to the predetermined fallback address
        require(
          LibAsset.transferAsset(txData.receivingAssetId, payable(txData.receivingAddress), toSend),
          "fulfill: TRANSFER_FAILED"
        );
      }
    }
```
[Tuesday, August 10, 2021](x-fantastical3://show/calendar/2021-08-18)
Recommend that `approval` should be placed inside the try/catch block or `approval` needs to be reset if the call fails.

**[LayneHaber (Connext) confirmed and patched](https://github.com/code-423n4/2021-07-connext-findings/issues/31#issuecomment-880098587):**
 > https://github.com/connext/nxtp/pull/39
