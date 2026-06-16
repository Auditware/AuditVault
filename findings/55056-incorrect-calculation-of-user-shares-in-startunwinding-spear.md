---
tags:
  - severity/high
  - has/github
  - has/poc
  - sector/governance
  - platform/spearbit
protocol: "[[InfiniFi Contracts]]"
auditors:
  - R0bert
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf"
genome:
  - "[[reward-accounting]]"
  - "[[arithmetic/precision-loss]]"
  - "[[data-corruption/accounting-error]]"
  - "[[known-pattern]]"
  - "[[always]]"
  - "[[fix-arithmetic]]"
  - "[[blast-radius/single-user]]"
---
# Incorrect Calculation of User Shares in startUnwinding

- id: 55056
- impact: HIGH
- protocol: infiniFi contracts
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf

## Summary


This bug report describes a problem with the `startUnwinding` function in `LockingController` that can lead to incorrect calculations and an inconsistent system state. This occurs when extra shares are accidentally transferred to the gateway, causing an inflated value for `userReceiptToken`. The report includes a proof of concept test case and recommends using the provided `_shares` parameter instead of relying on the `balanceOf` function. The bug has been fixed in the latest version of the code.

## Details

## Severity: High Risk

## Context
(No context files were provided by the reviewer)

## Description
The `startUnwinding` function in `LockingController` calculates user shares using the `balanceOf` function instead of using the provided `_shares` parameter. If residual or accidental shares are transferred to the gateway, the computed `userReceiptToken` value will be larger than expected. Additionally, the function transfers the amount specified by the `_shares` parameter from the gateway, meaning the inflated value from `balanceOf` does not correctly reflect the intended user allocation.

## Proof of Concept
The following test case demonstrates the issue:

1. Users Bob, Carol, and Alice create locked positions.
2. Alice accidentally transfers extra shares to the gateway. This simulates a scenario where unintended shares accumulate at the gateway.
3. Bob and Carol initiate unwinding using `startUnwinding`. Since the function calculates the shares using `balanceOf`, the extra shares in the gateway cause an incorrect calculation of `userReceiptToken`.
4. After waiting for the required epochs, Bob and Carol withdraw their funds. The extra shares remain in the gateway.
5. An emergency governor action transfers the remaining shares back to Alice. This clears out the extra shares from the gateway.
6. Alice attempts to unwind her shares but encounters a revert. Since the calculation of `userReceiptToken` in previous steps included extra shares, the system state becomes inconsistent.

```solidity
function test_createPositionAndStartUnwinding() public {
    _mintAndLock(bob, 1000e6, 1);
    _mintAndLock(carol, 1000e6, 1);
    _mintAndLock(alice, 1000e6, 1);
    vm.warp(block.timestamp + 7 days);
    LockedPositionToken liusd = LockedPositionToken(lockingController.shareToken(1));
    
    vm.startPrank(alice);
    liusd.transfer(address(gateway), liusd.balanceOf(alice)); // Accidental transfer
    vm.startPrank(bob);
    liusd.approve(address(gateway), liusd.balanceOf(bob));
    gateway.startUnwinding(liusd.balanceOf(bob), 1); // Bob gets 2k of receipt token to unwind
    vm.stopPrank();
    
    vm.startPrank(carol);
    liusd.approve(address(gateway), liusd.balanceOf(carol));
    gateway.startUnwinding(liusd.balanceOf(carol), 1);
    vm.stopPrank();
    
    // Time to withdraw passing the necessary epochs
    vm.warp(block.timestamp + 14 days);
    vm.prank(bob);
    gateway.withdraw(block.timestamp - 14 days);
    vm.prank(carol);
    gateway.withdraw(block.timestamp - 14 days);
    
    vm.startPrank(address(gateway)); // Emergency rescue call by governor
    liusd.transfer(alice, liusd.balanceOf(address(gateway))); // Transfers residual shares
    vm.stopPrank();
    
    iusd.balanceOf(bob);
    iusd.balanceOf(carol);
    iusd.balanceOf(alice);
    
    vm.startPrank(alice);
    liusd.approve(address(gateway), liusd.balanceOf(alice));
    gateway.startUnwinding(liusd.balanceOf(alice), 1); // It will revert
    vm.stopPrank();
}
```

## Recommendation
Consider using the `_shares` parameter directly instead of relying on `balanceOf` to determine the amount of user shares. This approach prevents the issue of accumulating accidental transfers in the gateway and may also help reduce gas costs by avoiding unnecessary balance lookups.

## InfiniFi
Fixed in `d8b0616` by using the given input parameter instead of the balance of the gateway.

## Spearbit
Fix verified.
