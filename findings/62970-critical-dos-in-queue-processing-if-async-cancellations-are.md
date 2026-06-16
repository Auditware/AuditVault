---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/bridge
  - sector/lending
  - sector/vault
protocol: "[[Accountable]]"
auditors:
  - "[[immeas]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-16-cyfrin-accountable-v2.0.md"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
  - "[[frontrun-exposure]]"
---
# Critical DOS in queue processing if async cancellations are allowed

- id: 62970
- impact: HIGH
- protocol: [[Accountable]]
- reporter: Immeas (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-16-cyfrin-accountable-v2.0.md

## Summary


The `cancelRedeemRequest()` function has a bug that can be used to cause the queue processing to revert. This is because the function marks `state.pendingCancelRedeemRequest` as true and skips reducing the shares in the request state. When `processUpToShares()` is called, `_processRequest()` does not return zero values as expected, causing the loop to break. As a result, the queue processing can be repeatedly DOS'ed, even if the strategy contract allows async cancellations. The bug has been fixed by removing async cancellations' support from the system.

## Details

**Description:** The `cancelRedeemRequest()` function can be used to DOS the queue processing (ie. `processUpToShares()` and `processUpToRequestID()` can be made to revert).

This is the attack path :
- `cancelRedeemRequest()` marks `state.pendingCancelRedeemRequest = true`;
- Assume that this cancellation is not instantly fulfilled, as the associated strategy may support async cancellations


```solidity
    function cancelRedeemRequest(uint256 requestId, address controller) public onlyAuth {
        _checkController(controller);
        VaultState storage state = _vaultStates[controller];
        if (state.pendingRedeemRequest == 0) revert NoPendingRedeemRequest();
        if (state.pendingCancelRedeemRequest) revert CancelRedeemRequestPending();

        state.pendingCancelRedeemRequest = true;

        bool canCancel = strategy.onCancelRedeemRequest(address(this), controller); // @audit strategy can choose to return false here, thus mandating async cancellations.
        if (canCancel) {
            uint256 pendingShares = state.pendingRedeemRequest;

            _fulfillCancelRedeemRequest(uint128(requestId), controller);
            _reduce(controller, pendingShares);
        }
        emit CancelRedeemRequest(controller, requestId, msg.sender);
    }
```



- At this step, it also skips "reducing" the shares in request state, as _reduce() will only be called when cancellation is fulfilled via `fulfillCancelRedeemRequest()`
- Later when `processUpToShares()` is called, `_processRequest()` returns normal request data (does not return "zero values" as request.shares was not reduced in the cancel logic ) => so it doesn't break the loop or continue with nextRequestID
- It goes on to call `_fulfillRedeemRequest()`, where it reverts due to pendingCancelRedeemRequest = true

```solidity
    function _fulfillRedeemRequest(uint128 requestId, address controller, uint256 shares, uint256 price)
        internal
        override
    {
        VaultState storage state = _vaultStates[controller];
        if (state.pendingRedeemRequest == 0) revert NoRedeemRequest();
        if (state.pendingRedeemRequest < shares) revert InsufficientAmount();
        if (state.pendingCancelRedeemRequest) revert RedeemRequestWasCancelled();  // @audit
```

This means even a single async cancellation (that is pending for processing) can DOS queue processing.


**Impact:** Queue processing can be repeatedly DOS'ed under normal operations as well as by an attacker frontrunning a process call, in case the strategy contract allows async cancellations.


**Recommended Mitigation:** Consider removing async cancellations' support from the system, which prevents this kind of attacks.

**Accountable:** Fixed in commit [`2eeb273`](https://github.com/Accountable-Protocol/credit-vaults-internal/commit/2eeb2736eb5ba8dafa2c9f2f458b31fd8eb2d6bf)

**Cyfrin:** Verified. Async cancelation of redeem requests now removed.
