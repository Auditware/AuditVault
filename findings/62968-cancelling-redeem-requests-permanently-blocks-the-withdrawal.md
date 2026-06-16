---
tags:
  - lang/solidity
  - platform/cyfrin
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/staking
protocol: "[[Accountable]]"
auditors:
  - "[[immeas]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-16-cyfrin-accountable-v2.0.md"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[cross-contract-state-consistency]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Cancelling redeem requests permanently blocks the withdrawal queue

- id: 62968
- impact: HIGH
- protocol: [[Accountable]]
- reporter: Immeas (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-10-16-cyfrin-accountable-v2.0.md

## Summary


The bug report describes an issue with the `AccountableWithdrawalQueue` that can cause it to become permanently stuck. This happens when the current head entry is fully removed without advancing the next request ID. This can be triggered by a user canceling a small amount of their request, which results in the head becoming an empty slot and the pointer not moving. This means that subsequent users will not be able to withdraw from the queue. The report includes a proof of concept test to demonstrate the issue and recommends a mitigation by incrementing the counter and using `continue` instead of `break`. The bug has been fixed by the team and verified by Cyfrin.

## Details

**Description:** `AccountableWithdrawalQueue` can deadlock at the head if the current head entry (`_queue.nextRequestId`) is fully removed (e.g., by a cancel that zeroes `shares` and clears `controller`) without advancing `nextRequestId`.

In [`AccountableWithdrawalQueue::_processUpToShares`](https://github.com/Accountable-Protocol/audit-2025-09-accountable/blob/fc43546fe67183235c0725f6214ee2b876b1aac6/src/vault/queue/AccountableWithdrawalQueue.sol#L153-L156) and [`AccountableWithdrawalQueue::_processUpToRequestId`](https://github.com/Accountable-Protocol/audit-2025-09-accountable/blob/fc43546fe67183235c0725f6214ee2b876b1aac6/src/vault/queue/AccountableWithdrawalQueue.sol#L193-L196), the loop checks `if (shares_ == 0) break;` before incrementing `nextRequestId`:
```solidity
(uint256 shares_, uint256 assets_, bool processed_) =
    _processRequest(request_, liquidity, maxShares_, precision_);

if (shares_ == 0) break;
```

When the head is an empty entry (`controller == address(0)`), [`AccountableWithdrawalQueue::_processRequest`](https://github.com/Accountable-Protocol/audit-2025-09-accountable/blob/fc43546fe67183235c0725f6214ee2b876b1aac6/src/vault/queue/AccountableWithdrawalQueue.sol#L219) returns `(0, 0, true)`, `shares_ == 0`, the loop breaks:
```solidity
if (request.controller == address(0)) return (0, 0, true);
```
The head never advances, so every subsequent call to process or preview gets stuck on the same empty head forever.

This can be triggered by any user whose request is currently at the head by canceling any dust amount (even 1 wei) such that their head entry is fully deleted at the time of processing (e.g., instant cancel-fulfillment) in [`AccountableWithdrawalQueue::_delete`](https://github.com/Accountable-Protocol/audit-2025-09-accountable/blob/fc43546fe67183235c0725f6214ee2b876b1aac6/src/vault/queue/AccountableWithdrawalQueue.sol#L130-L134):
```solidity
/// @dev Deletes a withdrawal request and its controller from the queue
function _delete(address controller, uint128 requestId) private {
    delete _queue.requests[requestId];
    delete _requestIds[controller];
}
```
Once the head becomes an empty slot and the pointer doesn’t move, the entire queue is bricked.


**Impact:** Queue is permanently stuck and no subsequent user will be able to withdraw.

**Proof of Concept:** Add the following test to `test/vault/AccountableWithdrawalQueue.t.sol`:
```solidity
function testHeadDeletionDeadlocksQueue() public {
    // Setup: deposits are instant, redemptions are queued, cancel is instantly fulfilled
    strategy.setInstantFulfillDeposit(true);
    strategy.setInstantFulfillRedeem(false);
    strategy.setInstantFulfillCancelRedeem(true);

    // Seed vault with liquidity and create first (head) request by Alice
    // This helper deposits for Alice and Bob at 1e36 price.
    _setupInitialDeposits(1e36, DEPOSIT_AMOUNT);

    // 1) Alice creates a redeem request -> head of queue (requestId = 1)
    uint256 aliceSharesToQueue = 1;
    vm.prank(alice);
    uint256 headId = vault.requestRedeem(aliceSharesToQueue, alice, alice);
    assertEq(headId, 1, "first request should be head (id = 1)");

    // 2) Alice cancels; cancel is fulfilled instantly by the strategy.
    //    This fully removes the head request entry (controller becomes address(0)),
    //    but _queue.nextRequestId is NOT advanced by the implementation.
    vm.prank(alice);
    vault.cancelRedeemRequest(headId, alice);

    // Sanity: queue indices should still point at the deleted head
    (uint128 nextRequestId, uint128 lastRequestId) = vault.queue();
    assertEq(nextRequestId, 1, "nextRequestId remains stuck at deleted head");
    assertGe(lastRequestId, 1, "there is at least one request in the queue history");

    // 3) Charlie makes a NEW redeem request -> tail (requestId = 2).
    //    This request is perfectly processable with existing liquidity.
    token.mint(charlie, 1000e6);
    vm.prank(charlie);
    token.approve(address(vault), 1000e6);
    vm.prank(charlie);
    vault.deposit(1000e6, charlie);

    uint256 charlieShares = vault.balanceOf(charlie) / 2;
    vm.prank(charlie);
    uint256 tailId = vault.requestRedeem(charlieShares, charlie, charlie);
    assertEq(tailId, 2, "second request should be tail (id = 2)");

    // Check queue bounds reflect head(=1, deleted) and tail(=2, valid)
    (nextRequestId, lastRequestId) = vault.queue();
    assertEq(nextRequestId, 1, "still pointing at deleted head");
    assertEq(lastRequestId, 2, "tail id should be 2");

    // 4) Attempt to process. BUG: _processUpToShares reads head slot (controller==0),
    //    inner _processRequest returns (0,0,true), outer loop sees shares_==0 and BREAKS
    //    BEFORE ++nextRequestId, so NOTHING gets processed and the queue is permanently stuck.
    uint256 assetsBefore = vault.totalAssets();
    uint256 used = vault.processUpToShares(type(uint256).max);
    assertEq(used, 0, "deadlock: processing does nothing while a valid tail exists");

    (uint256 _shares, uint256 _assets) = vault.processUpToRequestId(2);
    assertEq(_shares, 0, "deadlock: processing does nothing while a valid tail exists");
    assertEq(_assets, 0, "deadlock: processing does nothing while a valid tail exists");

    // 5) Verify tail wasn't progressed at all
    assertEq(vault.claimableRedeemRequest(0, charlie), 0, "tail remains unclaimable");
    assertEq(vault.pendingRedeemRequest(0, charlie), charlieShares, "tail remains fully pending");
    assertEq(vault.totalAssets(), assetsBefore, "no reserves changed due to deadlock");
    (nextRequestId, lastRequestId) = vault.queue();
    assertEq(nextRequestId, 1, "nextRequestId is still stuck at deleted head");
}
```

**Recommended Mitigation:** Consider incrementing the counter if it's processed, and `continue` instead of break:
```solidity
if (shares_ == 0) {
    if (processed_) {
        ++nextRequestId;
        continue;
    }
    break;
}
```

**Accountable:** Fixed in commits [`2df3becf`](https://github.com/Accountable-Protocol/credit-vaults-internal/commit/2df3becf29e20d0d1707eb0567b51fe103f606ed) and [`b432631`](https://github.com/Accountable-Protocol/credit-vaults-internal/commit/b432631089e400742b1e584976e26e9e7ae8da85)

**Cyfrin:** Verified. The counter is now incremented if the request was processed even if shares were 0.
