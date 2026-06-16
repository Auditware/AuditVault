---
tags:
  - lang/solidity
  - sector/governance
  - sector/lending
  - sector/stable
  - sector/streaming
  - platform/cantina
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - novelty/known-pattern
protocol: "[[Sablier]]"
auditors:
  - "[[Zach Obront]]"
report: "https://cdn.cantina.xyz/reports/cantina_sablier_october2024.pdf"
genome:
  - "[[underflow]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[known-pattern]]"
  - "[[integer-bounds]]"
  - "[[timestamp-dependence]]"
---
# Sender can brick stream by forcing overﬂow in debt calculation 

- id: 42010
- impact: HIGH
- protocol: [[Sablier]]
- reporter: Zach Obront (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_sablier_october2024.pdf

## Summary


The report discusses a bug found in the SablierFlow smart contract, specifically in the _ongoingDebtOf() internal function. The bug occurs when the function calculates the scaledOngoingDebt by multiplying the seconds that have passed since the last snapshot by the rate per second. If the result of this multiplication is greater than uint128, it will overflow and cause the contract to revert. This can happen even with a small balance of tokens, as long as the ratePerSecond is set to a high value. This bug can lead to the permanent loss of funds and can be exploited by a sender to lock the recipient's funds or accidentally set a high ratePerSecond. The report recommends using uint256 for scaledOngoingDebt and carrying this type through all functions until it is compared to the balance. The bug has been fixed in PR 296 and confirmed by Cantina Managed. The risk level of this bug is considered to be medium.

## Details

## SablierFlow.sol#L474

## Description
The `_ongoingDebtOf()` internal function is used to calculate the amount of funds owed to the stream recipient since the last snapshot. As a part of these calculations, the `scaledOngoingDebt` is calculated by multiplying the seconds that have passed since the last snapshot by the rate per second.

```solidity
uint128 scaledOngoingDebt = elapsedTime * ratePerSecond;
```

Since `elapsedTime` and `scaledOngoingDebt` are both `uint128`, any result of the multiplication that is greater than `uint128` will overflow and cause a revert. Note that this multiplication does not require an unrealistically high balance of the token, only for `ratePerSecond` to be set to a high value, which is completely in the control of the sender. 

This is a major concern because, once this calculation overflows, any calls to `withdraw()`, `refund()`, or to adjust the rate back down will all fail, because they all rely on this function. As a result, once this change happens, there is nothing anyone can do to receive funds from the stream, and all funds will permanently be stuck.

This fact could lead to problems in two situations:
1. It could be abused by a sender who is angry with a recipient to lock all previously streamed funds that have not yet been withdrawn, which should be the property of the recipient.
2. It could occur because a `ratePerSecond` is set to too high of a value accidentally, and then cannot be recovered by either party.

## Proof of Concept
The following proof of concept (which can be placed in any file that imports `Integration_Test`) demonstrates the issue:

```solidity
function test_HighRPSRevert() public {
    deal(address(usdc), address(this), DEPOSIT_AMOUNT_6D);
    usdc.approve(address(flow), DEPOSIT_AMOUNT_6D);
    address receiver = makeAddr("receiver");
    uint streamId = flow.createAndDeposit({
        sender: address(this),
        recipient: receiver,
        ratePerSecond: UD21x18.wrap(type(uint128).max),
        token: usdc,
        transferable: true,
        amount: DEPOSIT_AMOUNT_6D
    });
    vm.warp(block.timestamp + 12);
    vm.expectRevert();
    flow.totalDebtOf(streamId);
    vm.expectRevert();
    flow.pause(streamId);
    vm.expectRevert();
    vm.prank(receiver);
    flow.withdraw(streamId, receiver, 1);
}
```

## Recommendation
Use a `uint256` for `scaledOngoingDebt`, and carry this type through all functions until the value is compared to the balance. At that point, you can safely downcast to `uint128`.

## Sablier
Fixed in PR 296.

## Cantina Managed
Confirmed.
