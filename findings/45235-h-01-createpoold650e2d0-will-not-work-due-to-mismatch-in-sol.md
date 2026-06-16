---
tags:
  - lang/rust
  - lang/solidity
  - sdk/stylus
  - severity/high
  - platform/code4rena
  - sector/dex
protocol: "[[Superposition]]"
auditors:
  - "[[ZanyBonzy]]"
report: "https://code4rena.com/reports/2024-10-superposition"
genome:
  - "[[wrong-condition]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
---

# [H-01] `createPoolD650E2D0` will not work due to mismatch in solidity and stylus function definitions

- id: 45235
- impact: HIGH
- protocol: Superposition
- reporter: ZanyBonzy (Code4rena)
- source: https://code4rena.com/reports/2024-10-superposition

## Summary

## References

- https://github.com/code-423n4/2024-10-superposition/blob/7ad51104a8514d46e5c3d756264564426f2927fe/pkg/sol/SeawaterAMM.sol#L160-L168
- https://github.com/code-423n4/2024-10-superposition/blob/7ad51104a8514d46e5c3d756264564426f2927fe/pkg/seawater/src/lib.rs#L802

### Proof of Concept

SeaWaterAMM.sol holds the `createPoolD650E2D0` which allows the admin to initialize a new pool. It calls the `create_pool_D650_E2_D0` function in the stylus contract.

The `create_pool_D650_E2_D0` function takes in token address, sqrtPriceX96, and fee:

```rust
pub fn create_pool_D650_E2_D0(
    &mut self,
    pool: Address,
    price: U256,
    fee: u32,
) -> Result<(), Revert> { ... }
```

But the Solidity `createPoolD650E2D0` definition takes in more parameters - token address, `sqrtPriceX96`, fee, tick spacing, and `maxLiquidityPerTick` - causing a mismatch between the two definitions:

```solidity
function createPoolD650E2D0(
    address /* token */,
    uint256 /* sqrtPriceX96 */,
    uint32 /* fee */,
    uint8 /* tickSpacing */,
    uint128 /* maxLiquidityPerTick */
) external {
    directDelegate(_getExecutorAdmin());
}
```

Calls to the function will always fail, breaking SeawaterAMM.sol's functionality to create a pool position.

### Recommended Mitigation Steps

Remove the unneeded parameters from the Solidity definition.

### Assessed type

Context
