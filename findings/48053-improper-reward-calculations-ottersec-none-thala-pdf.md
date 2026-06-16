---
tags:
  - lang/rust
  - sector/governance
  - platform/ottersec
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Thala]]"
auditors:
  - "[[Akash Gurugunti]]"
report: "https://www.thalalabs.xyz/"
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[reward-theft]]"
  - "[[reward-accounting]]"
---
# Improper Reward Calculations

- id: 48053
- impact: HIGH
- protocol: [[Thala]]
- reporter: Akash Gurugunti (OtterSec)
- source: https://www.thalalabs.xyz/

## Summary


The bug report is about a protocol module that calculates the earnings of a token based on the scale of a snapshot. However, it fails to take into account a user's participation in subsequent distributions, leading to incorrect calculations. A proof of concept is provided along with a suggested fix to increase the scale factor and include two consecutive scales in the earnings calculation. The bug has been fixed in a recent patch.

## Details

## Token Earnings Calculation Issue in Protocol Module

In the protocol module, `accumulated_gain` calculates the earnings of a token solely based on the scale of the snapshot. However, a user’s amount may have participated in the distribution of the subsequent scale as well. As a result, the failure to account for this may lead to incorrect calculations of token earnings.

## Proof of Concept

The following code from `thala-protocol-v1/sources/reward_distributor.move` demonstrates the issue:

```rust
use std::debug;

#[test(account = @0xA)]
fun test_gain(account: &signer) {
    // prepare
    let rd = new();
    let mut_rd = &mut rd;
    
    deposit(mut_rd, @0x1, 10000); 
    distribute<ETH>(mut_rd, 9999, 500);
    // debug::print(&mut_rd.current_scale); // Out: 0
    
    deposit(mut_rd, @0x2, 10000); 
    distribute<ETH>(mut_rd, 8999, 450);
    // debug::print(&mut_rd.current_scale); // Out: 1
    
    deposit(mut_rd, @0x1, 9000); 
    distribute<ETH>(mut_rd, 9999, 500);
    // debug::print(&mut_rd.current_scale); // Out: 2
    
    let d1 = account_deposit(mut_rd, @0x1);
    withdraw(mut_rd, @0x1, d1);
    let e1 = claim<ETH>(mut_rd, @0x1);
    
    debug::print(&d1);
    debug::print(&e1);
    
    let d2 = account_deposit(mut_rd, @0x2);
    withdraw(mut_rd, @0x2, d2);
    let e2 = claim<ETH>(mut_rd, @0x2);
    
    debug::print(&d2);
    debug::print(&e2); // Err: This has to be 500, but the output is 450
    
    // cleanup
    move_to(account, RewardDistributorHolder { reward_distributor: rd });
}
```

## Thala Labs Audit 04 | Vulnerabilities

### Remediation

Increase the scale factor and include two consecutive scales in the earnings calculation in the `accumulated_gain`. This will ensure that the function takes into account all relevant factors for accurate calculations of token earnings.

### Patch

Fixed in `bdfabae` by increasing the scaling factor and improving reward calculation.
