---
tags:
  - lang/rust
  - sector/oracle
  - sector/perpetuals
  - platform/ottersec
  - severity/high
  - impact/mev/frontrun
protocol: "[[Jupiter Perps Program]]"
auditors:
  - "[[Robert Chen]]"
report: "https://jup.ag/perps"
genome:
  - "[[spot-price]]"
  - "[[frontrun]]"
  - "[[frontrun-exposure]]"
---
# Front-Running Position Execution

- id: 47709
- impact: HIGH
- protocol: [[Jupiter Perps Program]]
- reporter: Robert Chen (OtterSec)
- source: https://jup.ag/perps

## Summary


This bug report discusses a potential issue with the update_decrease_position_request and update_increase_position_request instructions in the perpetuals library. These instructions allow users to update their position requests before they are executed, which could potentially give them an unfair advantage over the keeper. By modifying their position based on the latest market conditions, a user could front-run the keeper and gain a better PnL in a favorable market movement. The report recommends a fix to ensure that the execution of a request takes into account any modifications made within the same slot. This issue has been fixed in the latest version of the library.

## Details

## Update Decrease and Increase Position Request Instructions

The `update_decrease_position_request` and `update_increase_position_request` instructions allow users to update their position requests at any time before the actual execution. The user can use this opportunity to front-run the keeper by adjusting their position based on the latest oracle update. A user may exploit this to gain an advantage by modifying their position in response to market movements after setting the trigger.

## Code Implementation

### File: `perpetuals/src/lib.rs` (Rust)

```rust
pub mod perpetuals {
    use super::*;

    // Admin instructions
    pub fn update_increase_position_request(
        ctx: Context<UpdateIncreasePositionRequest>,
        params: UpdateIncreasePositionRequestParams,
    ) -> Result<()> {
        instructions::update_increase_position_request(ctx, &params)
    }

    pub fn update_decrease_position_request(
        ctx: Context<UpdateDecreasePositionRequest>,
        params: UpdateDecreasePositionRequestParams,
    ) -> Result<()> {
        instructions::update_decrease_position_request(ctx, &params)
    }
    // [...]
}
```

By updating the position request, the user essentially front-runs the keeper by adjusting their position based on the latest market conditions just before the keeper executes the request. The user may increase the leverage to secure a more advantageous PnL in favorable market movements. Conversely, they may decrease leverage for a reduced position size to mitigate losses in unfavorable market conditions.

## Remediation

Ensure that the execution of a request considers the modification of the request within the same slot. Store the slot information of the request inside the corresponding account and check it during the execution process.

## Patch

Fixed in commit `a1e35e7`.
