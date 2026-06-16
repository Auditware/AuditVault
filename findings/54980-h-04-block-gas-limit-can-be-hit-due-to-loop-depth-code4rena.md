---
tags:
  - lang/rust
  - sector/dex
  - sector/farm
  - sector/staking-pool
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
protocol: "[[MANTRA]]"
auditors:
  - carrotsmuggler
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[dos-resistance]]"
  - "[[unbounded-loop]]"
  - "[[reward-calculation]]"
  - "[[known-pattern]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-04] Block gas limit can be hit due to loop depth

- id: 54980
- impact: HIGH
- protocol: MANTRA
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


This bug report discusses an issue with the `claim` function in the `farm-manager` contract. The function is used to calculate rewards for users who have positions in the farm. The problem is that the function is highly susceptible to an "out of gas" error, which can prevent the transaction from being included in the blockchain. This is because the function uses nested loops, which can exceed the block gas limit. This can be a problem for users who have many positions and have held them for a long time. The report suggests implementing a sushi-masterchef style reward accounting or a way to process a limited number of positions at a time to mitigate this issue. 

## Details



[/contracts/farm-manager/src/farm/commands.rs# L43-L94](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/farm-manager/src/farm/commands.rs# L43-L94)

### Finding description and impact

The `claim` function iterates over the user positions and calculates the rewards in nested loops. The issue is that every blockchain, to combat against gas attacks of infinite loops, has a block gas limit. If this limit is exceeded, that transaction cannot be included in the chain. The implementation of the `claim` function here is of the order of `N^3` and is thus highly susceptible to an out of gas error.

The claim function iterates over all the user’s positions.
```

let lp_denoms = get_unique_lp_asset_denoms_from_positions(open_positions);

for lp_denom in &lp_denoms {
    // calculate the rewards for the lp denom
    let rewards_response = calculate_rewards(
        deps.as_ref(),
        &env,
        lp_denom,
        &info.sender,
        current_epoch.id,
        true,
    )?;
    //...
}
```

Lets say the user has `P` positions, all of different `lp_deonm` values. Thus this loop is of the order of `P`. The `calculate_rewards` function then loops over all the farms of each `lp_denom`.
```

let farms = get_farms_by_lp_denom(
    deps.storage,
    lp_denom,
    None,
    Some(config.max_concurrent_farms),
)?;
//...
for farm in farms {
    // skip farms that have not started
    if farm.start_epoch > current_epoch_id {
        continue;
    }

    // compute where the user can start claiming rewards for the farm
    let start_from_epoch = compute_start_from_epoch_for_address(
        deps.storage,
        &farm.lp_denom,
        last_claimed_epoch_for_user,
        receiver,
    )?;
    //...
}
```

Say there are `F` farms, then this inner loop is of the order of `F`. Then for each farm, the reward is calculated by iterating over all the epochs from `start_from_epoch` up to the `current_epoch`.
```

for epoch_id in start_from_epoch..=until_epoch {
    if farm.start_epoch > epoch_id {
        continue;
    }
    //...
}
```

The `start_from_epoch` can be the very first deposit of the user, far back in time, if this is the first time the user is claiming rewards. Thus, this loop can run very long if the position is years old. Say the epoch loop is of the order of `E`.

Since these 3 loops are nested, the `claim` function is of the order of `P*F*E`. `P` and `F` are restricted by the config can can have maximum values of the order of 10. But `E` can be very large, and is actually the order of epoch number. So if epochs are only a few days long, the `E` can be of the order of 500 over a couple of years.

Thus the `claim` function can be of the order of `50_000`. This is an issue since it requires a loop running `50_000` times along with reward calculations and even token transfers. This can be above the block gas limit and thus the transaction will fail.

There is no functionality to skip positions/farms/epochs. Thus users cannot claim rewards of only a few particular farms or epochs. This part of the code is also executed during the `close_position` function, which checks if rewards are 0. Thus, the `close_position` function can also fail due to the same issue, and users are thus forced to emergency withdraw and lose deposits as well as their rewards.

Thus users who join a bunch of different farms and keep their positions for a long time can hit the block gsa limit during the time of claiming rewards or closing positions.

The OOG issue due to large nesting depth is present in multiple instances in the code, this is only one example.

### Proof of Concept

`P`, the number of open positions of a user, is restricted by limit of 100 stored in `MAX_ITEMS_LIMIT`. `F` is restricted by the max concurrent no of farms per `lp_denom`, which we can assume to be 10. `E` is of the order of epochs between the first deposit and the current epoch, which can be in the 100s if epochs are single days, or 100s if epochs are weeks.

Thus, `P*F*E` is of the order of `100*10*100 = 100_000`; `100_000` iterations are required for the `claim` function on top of token transfers and math calculations. This can easily exceed the block gas limit.

### Recommended mitigation steps

The order of the nested loops need to be decreased. This can be done in multiple ways.

1. Implement sushi-masterchef style reward accounting. This way the entire `E` number of epochs dont need to be looped over.
2. Implement a way to only process a given number of positions. This way `P` can also be restricted and users can claim in batches.

**jvr0x (MANTRA) confirmed**

---


