---
tags:
  - lang/solidity
  - sector/lending
  - platform/cyfrin
  - has/github
  - severity/high
  - impact/dos/permanent
protocol: "[[Accountable]]"
auditors:
  - "[[immeas]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-16-cyfrin-accountable-v2.0.md"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
---
# `AccountableAsyncRedeemVault::fulfillCancelRedeemRequest` can de-sync request data causing permanent DOS for queue processing

- id: 62969
- impact: HIGH
- protocol: [[Accountable]]
- reporter: Immeas (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-16-cyfrin-accountable-v2.0.md

## Summary


The `fulfillCancelRedeemRequest()` function in the code first cancels a redeem request and then updates the request state and total queued shares. However, there is a bug where the `_reduce()` function is called with a value of zero shares, even though the request state was set to zero in the previous step. This can cause problems in the batch processing of the queue and can lead to permanent de-sync between the values stored and the vault state. To fix this, the code has been updated to cache the pending shares before fulfilling the cancel request and then passing it as an argument to the `_reduce()` function. This bug has been fixed in commit `84946dd`.

## Details

**Description:** `fulfillCancelRedeemRequest()` function first finalises the cancellation of the redeeem request with input `requestID`, and then calls `_reduce()` to update the request state and `totalQueuedShares`.

```solidity
    function fulfillCancelRedeemRequest(address controller) public onlyOperatorOrStrategy {
        _fulfillCancelRedeemRequest(_requestIds[controller], controller);
        _reduce(controller, _vaultStates[controller].pendingRedeemRequest);
    }
```

The problem here is that it is using current value of `_vaultStates[controller].pendingRedeemRequest` in the `_reduce()` call, but it has been set to zero in `_fulfillCancelRedeemRequest()`.

This means `_reduce()` here will always be called with zero shares, and it does not revert when shares input is zero. But it corrupts the request struct and `totalQueuedShares` value.

The request will still exist with actual shares values, and create problems in usual batch processing of the queue.

One example of the resulting impact is this :
1. User X places a redeem request for 100 shares
2. User X cancels this redeem request
3. His request is not fulfilled instantly (this depends on the strategy)
4. Operator calls `fulfillCancelRedeemRequest()` to process this cancellation.
5. The call goes through properly. As a result [state.pendingRedeemRequest = 0] but the request state still has request.shares == 100 and other values. Also, the `_queue.nextRequestID` remains unchanged.
6. Now when batch processing proceeds via `processUpToShares()`, it is guaranteed that User X's requestID will also be processed (it is still in the queue from nextRequestID to lastRequestID) and when that happens, it will suffer a revert in `_processUptoShares()` => `_fulfillRedeemRequest()` because `state.pendingRedeemRequest` was set to == 0 in step 5.

```solidity
    function _fulfillRedeemRequest(uint128 requestId, address controller, uint256 shares, uint256 price)
        internal
        override
    {
        VaultState storage state = _vaultStates[controller];
        if (state.pendingRedeemRequest == 0) revert NoRedeemRequest();
        if (state.pendingRedeemRequest < shares) revert InsufficientAmount();
        if (state.pendingCancelRedeemRequest) revert RedeemRequestWasCancelled();
```


**Impact:** If this function is ever called, there will be a permanent de-sync between the values stored as per requestID data and the vaultState of the controller, which will interfere with queue processing in different ways.

The example showcased here is a critical DOS blocking queue processing permanently. This will happen for strategies that offer async cancellation processing, but since vault is expected to be compatible with this behavior, fixing this is critical.


**Recommended Mitigation:**
```solidity
    function fulfillCancelRedeemRequest(address controller) public onlyOperatorOrStrategy {

+++        uint256 pendingShares = state.pendingRedeemRequest;
               _fulfillCancelRedeemRequest(_requestIds[controller], controller);
---          _reduce(controller, _vaultStates[controller].pendingRedeemRequest);
+++        _reduce(controller, pendingShares);
    }
```

**Accountable:** Fixed in commit [`84946dd`](https://github.com/Accountable-Protocol/credit-vaults-internal/commit/84946dd49dd70f9f5dfe40184beb52b734362701)

**Cyfrin:** Verified. `pendingShares` now cached before fulfill and then passed as argument to `_reduce`.
