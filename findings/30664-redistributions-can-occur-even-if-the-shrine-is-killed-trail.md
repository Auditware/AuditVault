---
tags:
  - lang/solidity
  - sector/cdp
  - sector/lending
  - sector/oracle
  - platform/trailofbits
  - has/github
  - severity/high
  - impact/mev/frontrun
protocol: "[[Lindy Labs]]"
auditors:
  - "[[Justin Jacob]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2023-08-aura-securityreview.pdf"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# Redistributions can occur even if the Shrine is killed

- id: 30664
- impact: HIGH
- protocol: [[Lindy Labs]] Aura
- reporter: Justin Jacob (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2023-08-aura-securityreview.pdf

## Summary


The report discusses a bug in the Aura protocol that allows for a malicious user to trigger a redistribution and cause a trove owner to lose their excess collateral permanently. The bug occurs when the Shrine is killed and trove owners withdraw their yin from the Absorber contract. This can be exploited by a malicious user who front-runs the trove owner and triggers a redistribution. The report recommends short term and long term solutions to fix the bug and improve the protocol's unit test coverage.

## Details

## Difficulty: Low

## Type: Configuration

### Target: src/core/absorber.cairo

## Description

The Aura protocol has steps to shut down gracefully. First, the `Caretaker::shut` function is invoked, which kills the `Shrine` and withdraws collateral from the `Gate` contract to the `Caretaker` contract. The amount of collateral withdrawn is enough to back the total system yin at a 1:1 ratio. During a shutdown, the `Caretaker` contract will allow trove owners to burn their yin to claim back their collateral. Notably, when the `Shrine` is killed, its `forge` and `melt` functions revert.

However, there is nothing stopping a redistribution from occurring when the `Shrine` is killed as long as the `Absorber`’s yin balance is emptied. Similar to finding 6, if the `can_absorb_any` variable is `false`, then `shrine.melt` will never be called and the call to the `absorb` function will not revert. If a trove is eligible for absorption, then before the trove owner can call the `release` function to withdraw their excess collateral, an attacker can front-run them and call `absorb`, triggering a redistribution.

```
// Only update the absorber and emit the `Purged` event if Absorber has some yin
// to melt the trove's debt and receive freed trove assets in return
if (can_absorb_any) {
    let percentage_freed: Ray = get_percentage_freed(
        ltv_after_compensation,
        value_after_compensation,
        trove_debt,
        trove_penalty,
        purge_amt
    );
    
    // Melt the trove's debt using the absorber's yin directly
    shrine.melt(absorber.contract_address, trove_id, purge_amt);
    
    // Free collateral corresponding to the purged amount
    let (yangs, absorbed_assets_amts) = free(
        shrine, 
        trove_id, 
        percentage_freed, 
        absorber.contract_address
    );
    absorber.update(yangs, absorbed_assets_amts);
    
    Purged(
        trove_id,
        purge_amt,
        percentage_freed,
        absorber.contract_address,
        absorber.contract_address,
        yangs,
        absorbed_assets_amts
    );
}

// If it is not a full absorption, perform redistribution.
if (!is_fully_absorbed) {
    shrine.redistribute(trove_id);
    
    // Update yang prices due to an appreciation in ratio of asset to yang from redistribution
    oracle::read().update_prices();
}

Compensate(caller, yangs, compensations);
(yangs, compensations)
```

Figure 12.1: Part of the `absorb` function (`purger.cairo#L309-L352`)

## Exploit Scenario

The `Shrine` is killed and trove owners pull their yin out of the `Absorber` contract to reclaim their collateral from the `Caretaker`. Collateral prices fall and Bob’s trove is eligible for absorption. Before Bob can call `release` to withdraw the excess collateral from a trove, Eve, a malicious user, front-runs him and calls `absorb`. This forces a redistribution, and as a result, Bob loses his excess collateral permanently.

## Recommendations

- Short term, make sure redistributions revert if the `Shrine` is killed.
- Long term, improve unit test coverage to uncover edge cases and ensure intended behavior throughout the protocol.
