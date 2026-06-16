---
tags:
  - lang/solidity
  - platform/trailofbits
  - has/github
  - severity/high
  - sector/cdp
  - sector/governance
  - sector/lending
  - sector/options
protocol: "[[Opus]]"
auditors:
  - "[[Justin Jacob]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2023-12-opus-contracts-securityreview.pdf"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[timelock-timestamp-bypass]]"
  - "[[timestamp-dependence]]"
---
# Yin cannot be pulled out of the Absorber if the Shrine is killed

- id: 30651
- impact: HIGH
- protocol: [[Opus]]
- reporter: Justin Jacob (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2023-12-opus-contracts-securityreview.pdf

## Summary


This bug report describes a timing issue that occurs when the system is shut down and the Caretaker module is responsible for withdrawing collateral to back the yin supply. The shut function is called, which should mint any final budget surpluses and withdraw yang from the Sentinel, but it does not kill the Absorber, which prevents stakers from withdrawing their yin. This can cause issues when the system's loan-to-value ratio increases and recovery mode is enabled, making it impossible for users to withdraw their yin and causing them to lose their assets permanently. The report recommends allowing users to remove their yin when the Shrine is killed, and improving unit test coverage and documentation to prevent similar issues in the future.

## Details

## Difficulty: Medium

## Type: Timing

### Target: `src/core/absorber.cairo`

## Description
When the system is shut down, the Caretaker module is responsible for withdrawing as much collateral as possible to back the yin supply as close to 1:1 as possible. To do this, the `shut` function is called. It will mint any final budget surpluses, calculate the amount of yang needed to back the yin supply, and pull the collateral from the Sentinel. It will then proceed to irreversibly kill the Shrine. Notably, the `shut` function does not kill the Absorber, in order to allow stakers to withdraw their yin. Trove owners can then call the `release` function to reclaim any remaining yang in a trove:

```
// Loop over yangs deposited in trove and transfer to trove owner
loop {
    match yangs_copy.pop_front() {
        Option::Some(yang) => {
            let deposited_yang: Wad = shrine.get_deposit(*yang, trove_id);
            let asset_amt: u128 = if deposited_yang.is_zero() {
                0
            } else {
                deposited_yang;
            let exit_amt: u128 = sentinel.exit(*yang, trove_owner, trove_id,
                // Seize the collateral only after  assets have been
                // transferred so that the asset amount per yang in Gate
                // does not change and user receives the correct amount
                shrine.seize(*yang, trove_id, deposited_yang);
                exit_amt
            };
            released_assets.append(AssetBalance { address: *yang, amount: asset_amt });
        };
    };
},
Option::None => { break; },
```

*Figure 7.1: Seizing of collateral from the Shrine in `caretaker.cairo#L285-L304`*

However, as a result of shutting down the system and withdrawing yang from the Shrine, the Shrine’s loan-to-value (LTV) ratio increases, and there is a high chance that recovery mode will be enabled. This is problematic because withdrawing yin from the Absorber is not possible when recovery mode is active; furthermore, since the system’s total yin supply is fixed at shutdown, it is impossible to turn recovery mode off:

```rust
fn assert_can_remove(self: @ContractState, request: Request) {
    assert(!self.shrine.read().is_recovery_mode(), 'ABS: Recovery Mode active');
    assert(request.timestamp.is_non_zero(), 'ABS: No request found');
    assert(!request.has_removed, 'ABS: Only 1 removal per request');
    let current_timestamp: u64 = starknet::get_block_timestamp();
    let removal_start_timestamp: u64 = request.timestamp + request.timelock;
    assert(removal_start_timestamp <= current_timestamp, 'ABS: Request is not valid yet');
    assert(current_timestamp <= removal_start_timestamp + REQUEST_VALIDITY_PERIOD, 'ABS: Request has expired');
}
```

*Figure 7.2: The `assert_can_remove` helper function in `absorber.cairo#L896-L906`*

## Exploit Scenario
The Caretaker shuts down the system, and trove owners call `release` to reclaim any leftover collateral. As a result, the Shrine enters recovery mode because the system’s total LTV surpassed the 70% system threshold. Alice, a staker in the Absorber, goes to remove her yin in order to call the `reclaim` function and get back a proportion of system collateral; however, because recovery mode is active, she is prevented from withdrawing her yin and loses her assets permanently.

## Recommendations
- **Short term:** Allow users to remove their yin when the Shrine is killed regardless of whether recovery mode is active.
- **Long term:** Improve the unit test coverage to uncover edge cases and ensure that the system behaves as intended. Ensure that all system features are appropriately disabled or enabled during component shutdowns, and document invariants that should hold when the system components are not live.
