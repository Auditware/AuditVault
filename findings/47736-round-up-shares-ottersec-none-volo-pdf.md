---
tags:
  - lang/solidity
  - sector/staking
  - platform/ottersec
  - has/poc
  - severity/high
  - vuln/arithmetic/rounding-direction
  - trigger/low-liquidity
  - novelty/known-pattern
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Volo]]"
auditors:
  - "[[Michał Bochnak]]"
report: "https://www.volo.fi/"
genome:
  - "[[rounding-direction]]"
  - "[[trigger/low-liquidity]]"
  - "[[known-pattern]]"
  - "[[direct-drain]]"
  - "[[integer-bounds]]"
---
# Round Up Shares

- id: 47736
- impact: HIGH
- protocol: [[Volo]]
- reporter: Michał Bochnak (OtterSec)
- source: https://www.volo.fi/

## Summary


This report discusses a bug found in the math::to_shares function, which is used to calculate the number of shares a user will receive for staking SUI. The bug occurs when the CERT coin has a high value relative to SUI, resulting in zero shares being received for a non-zero quantity of SUI. This bug can be exploited by iteratively staking a small amount of SUI to accumulate CERT coins, which can then be unstaked for a larger amount of SUI. The report recommends modifying the limit for NativePool::min_stake to prevent this exploitation while maintaining a reasonable ratio range. The bug has been fixed in the latest patch.

## Details

## Vulnerability Description

The vulnerability is rooted in `math::to_shares`, particularly when the CERT coin holds a significant value relative to SUI. This may result in receiving zero shares for a non-zero quantity of SUI. As a result, the function rounds up and returns one CERT.

## Function Breakdown

```rust
public fun to_shares(ratio: u256, amount: u64): u64 {
    let shares = (amount as u256) * ratio / RATIO_MAX;
    assert!(shares <= (U64_MAX as u256), E_U64_OVERFLOW);
    if (amount > 0 && shares == 0) {
        shares = 1;
    };
    (shares as u64)
}
```

This function is utilized in `native_pool::stake_non_entry` to calculate the number of shares a user will receive for staking SUI. The minimum amount of SUI that may be supplied to `native_pool::stake_non_entry` is defined by `NativePool::min_stake`, with the sole requirement being that it must be greater than zero.

```rust
public entry fun change_min_stake(self: &mut NativePool, _owner_cap: &OwnerCap, value: u64) {
    assert_version(self);
    assert!(value > 0, E_LIMIT_TOO_LOW);
    // ...
    self.min_stake = value;
}
```

Consequently, by iteratively staking a small amount of SUI (X times), users may accumulate X CERT coins. Unstaking these coins allows users to obtain more SUI than their initial stake.

## Proof Of Concept

1. **Initial State**:
   - The CERT coin holds a high value in terms of SUI, with a small ratio.
   - `NativePool::min_stake` is established at one MIST.

2. **Malicious User Actions**:
   - The malicious user stakes one MIST multiple times and receives X CERT.
   - The malicious user proceeds to stake an additional amount of SUI to acquire enough CERT coins required for the unstake process.
   - Finally, the malicious user initiates an unstake action, relinquishing all of their CERT coins.

Please find the proof-of-concept code in this section.

## Remediation

Modify the limit for `NativePool::min_stake` to prevent the exploitation process while maintaining a reasonable ratio range.

## Patch

Fixed in commit `8099e49`.
