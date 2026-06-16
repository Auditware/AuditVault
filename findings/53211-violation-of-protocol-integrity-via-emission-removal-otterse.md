---
tags:
  - lang/solidity
  - platform/ottersec
  - severity/high
  - sector/farm
protocol: "[[Exponent]]"
auditors:
  - "[[Ajay Shankar Kunapareddy]]"
report: "https://www.exponent.finance/income"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[reward-accounting]]"
---
# Violation of Protocol Integrity via Emission Removal

- id: 53211
- impact: HIGH
- protocol: [[Exponent]] Generic Standard
- reporter: Ajay Shankar Kunapareddy (OtterSec)
- source: https://www.exponent.finance/income

## Summary


The bug report discusses a vulnerability in SyMeta that could potentially break the integrity of the system. This is due to an issue with the Position structure, which tracks a user's position and rewards tied to emissions. The function "ensure_trackers" is responsible for making sure that all emissions have a corresponding reward entry. However, the RemoveEmission operation can cause disruptions in this process, leading to a denial-of-service for all positions. The bug has been resolved in a patch released in version #1914.

## Details

## Vulnerability Report

## Summary
The vulnerability concerns the potential for an emission to be removed from SyMeta in a way that breaks the integrity of the system. 

## Details
The **Position** structure tracks the state of a user’s position, including their amount and a list of rewards, which are tied to emissions. Each **Reward** in **Position** corresponds to an **Emission** on SyMeta, tracked by its *mint* and *last_seen_share_index*, which is saved in **Reward**. 

The `Position::ensure_trackers` function ensures that the position has a corresponding reward entry for every emission that exists.

### Code Snippet
```rust
pub fn ensure_trackers(&mut self, emissions: &Vec<Emission>) {
    for (index, emission) in emissions.iter().enumerate() {
        match self.reward_indexes.get_mut(index) {
            Some(reward) => {
                assert_eq!(
                    reward.mint, emission.mint,
                    "Reward mint does not match emission tracker index"
                );
                // [...]
            }
        }
    }
}
```

The **RemoveEmission** operation enables removing an emission from SyMeta, shifting the remaining emissions. In the context of `Position::ensure_trackers`, if an emission is removed from the list, then all subsequent emissions will shift by one index. As the mint is already saved on all the user positions’ rewards, the reward mint will not match the corresponding emission tracker index, causing the function to fail. 

The exponent-core relies on the order of rewards in the position. If emissions are removed and the order is disrupted, the protocol will no longer safely calculate rewards or track their distribution, disrupting the entire protocol and resulting in a denial-of-service for all positions.

## Remediation
- Disallow the **RemoveEmission** operation.

## Patch
- Resolved in **#1914**.
