---
tags:
  - lang/solidity
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - sector/lending
  - sector/perpetuals
  - sector/streaming
protocol: "[[Superfluid]]"
auditors:
  - "[[0x73696d616f]]"
report: "https://github.com/sherlock-audit/2024-11-superfluid-locking-contract-judging"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
---
# H-3: `Fontaine` never stops the flows to the tax and recipient, so the buffer component of the flows will be lost

- id: 43734
- impact: HIGH
- protocol: [[Superfluid]] Locking Contract
- reporter: 0x73696d616f (Sherlock)
- source: N/A

## Summary


The report discusses a bug in the `Fontaine` contract of the `Superfluid` protocol. This bug causes the contract to never stop the flow of funds to the tax and recipient, resulting in the loss of the buffer component of the funds. This means that the recipient and tax pool do not receive the full amount of their funds. The root cause of this bug is that the flows are not stopped in the `Fontaine::initialize()` function. There are no internal or external pre-conditions for this bug to occur, and it can be triggered by a user unlocking their `Fluid` from the `Locker` with a non-null unlocking period. The impact of this bug is that the recipient and tax pool do not receive all of their funds. A proof of concept is provided in the report, and the recommended mitigation is to add a way to stop the flow and reclaim the deposit. 

## Details

Source: https://github.com/sherlock-audit/2024-11-superfluid-locking-contract-judging/issues/36 

## Found by 
0x73696d616f
### Summary

`Superfluid` flows [reserve](https://docs.superfluid.finance/docs/protocol/advanced-topics/solvency/liquidations-and-toga) 4 hours of the stream flow rate as a buffer for liquidations, and returns this when the flow is closed.

However, [Fontaine::initialize()](https://github.com/sherlock-audit/2024-11-superfluid-locking-contract/blob/main/fluid/packages/contracts/src/Fontaine.sol#L61) never actually stops the flows, which means the deposit buffer will never be reclaimed, taking the recipient and the tax pool the loss.

### Root Cause

In `Fontaine::initialize()`, the flows are never stopped, which means the buffer will not be returned.

### Internal pre-conditions

None.

### External pre-conditions

None.

### Attack Path

1. User unlocks their `Fluid` from the `Locker` by calling `FluidLocker::unlock()` with a non null unlocking period.

### Impact

The recipient and the tax distribution pool take the loss as they do not receive all their funds (the deposit buffer is never sent to them).

### PoC

Add the following logs to `Fontaine.sol` and run `forge test --mt testVestUnlock -vvvv`. `Alice` sends `10_000e18` to the fontaine, but only `9996.8e18` are left in the fontaine as a part of them are reserved for the buffer which will never be collected back.
```solidity
function initialize(address unlockRecipient, int96 unlockFlowRate, int96 taxFlowRate) external initializer {
    // Ensure recipient is not a SuperApp
    if (ISuperfluid(FLUID.getHost()).isApp(ISuperApp(unlockRecipient))) revert CANNOT_UNLOCK_TO_SUPERAPP();

    console2.log("fontaine balance pre distributeFlow", FLUID.balanceOf(address(this)));

    // Distribute Tax flow to Staker GDA Pool
    FLUID.distributeFlow(address(this), TAX_DISTRIBUTION_POOL, taxFlowRate);

    console2.log("fontaine balance pre createFlow", FLUID.balanceOf(address(this)));

    // Create the unlocking flow from the Fontaine to the locker owner
    FLUID.createFlow(unlockRecipient, unlockFlowRate);

    console2.log("fontaine balance after createFlow", FLUID.balanceOf(address(this)));
}
```

### Mitigation

Add a way to stop the flow and receive the deposit back.
