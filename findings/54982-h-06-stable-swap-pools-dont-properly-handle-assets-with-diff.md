---
tags:
  - lang/rust
  - sector/bridge
  - sector/dex
  - sector/options
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
protocol: "[[MANTRA]]"
auditors:
  - carrotsmuggler
report: "https://code4rena.com/reports/2024-11-mantra-dex"
genome:
  - "[[token-decimal-normalization]]"
  - "[[decimal-mismatch]]"
  - "[[variant]]"
  - "[[math-is-safe]]"
  - "[[fix-arithmetic]]"
---
# [H-06] Stable swap pools don’t properly handle assets with different decimals, forcing LPs to receive wrong shares

- id: 54982
- impact: HIGH
- protocol: MANTRA
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2024-11-mantra-dex

## Summary


The bug report discusses an issue with the Stable Swap Pools in Mantra, which use Curve's stable swap logic. The problem is that the amounts are not normalized, causing incorrect calculations and leading to an exaggerated amount of shares being minted for LPs depositing tokens with higher decimals. This can be fixed by ensuring all amounts are in their non-decimal value when computing D. A proof of concept is provided in the form of two tests. The recommended mitigation step is to add this normalization to the `compute_d` function. 

## Details



Stable swap pools in Mantra implement Curve’s stable swap logic, this is mentioned in the [docs](https://docs.mantrachain.io/mantra-smart-contracts/mantra_dex/pool-manager# stableswap). Curve normalizes the tokens in a stable swap pool, by having something called rate multipliers where they’re used to normalize the tokens’ decimals. This is critical as it is used in D computation [here](https://github.com/curvefi/stableswap-ng/blob/main/contracts/main/CurveStableSwapNG.vy# L1090-L1091).

The reflection of this in Mantra is `compute_d`, where it does something similar, [here](https://github.com/code-423n4/2024-11-mantra-dex/blob/main/contracts/pool-manager/src/helpers.rs# L714-L716):
```

// sum(x_i), a.k.a S
let sum_x = deposits
    .iter()
    .fold(Uint128::zero(), |acc, x| acc.checked_add(x.amount).unwrap());
```

However, the issue is that amounts are not normalized from the caller, where this is called from `compute_lp_mint_amount_for_stableswap_deposit`:
```

#[allow(clippy::unwrap_used, clippy::too_many_arguments)]
pub fn compute_lp_mint_amount_for_stableswap_deposit(
    amp_factor: &u64,
    old_pool_assets: &[Coin],
    new_pool_assets: &[Coin],
    pool_lp_token_total_supply: Uint128,
) -> Result<Option<Uint128>, ContractError> {
    // Initial invariant
@>  let d_0 = compute_d(amp_factor, old_pool_assets).ok_or(ContractError::StableInvariantError)?;

    // Invariant after change, i.e. after deposit
    // notice that new_pool_assets already added the new deposits to the pool
@>  let d_1 = compute_d(amp_factor, new_pool_assets).ok_or(ContractError::StableInvariantError)?;

    // If the invariant didn't change, return None
    if d_1 <= d_0 {
        Ok(None)
    } else {
        let amount = Uint512::from(pool_lp_token_total_supply)
            .checked_mul(d_1.checked_sub(d_0)?)?
            .checked_div(d_0)?;
        Ok(Some(Uint128::try_from(amount)?))
    }
}
```

This messes up the whole shares calculation logic, as D would be way greater for LPs depositing tokens of higher decimals than other tokens in the same stable swap pool.

NB: This is handled for swaps, [here](https://github.com/code-423n4/2024-11-mantra-dex/blob/main/contracts/pool-manager/src/helpers.rs# L196-L198).

### Proof of Concept

Add the following in `contracts/pool-manager/src/tests/integration_tests.rs`:

The following test creates a stable swap pool with 3 assets, 2 of them have 6 decimals, while the 3rd has 18 decimals. Initially, the same amount `*` asset decimals of each asset is deposited, depositing the same amount of the 18 decimal token results in an exaggerated amount of shares minted to the LP.

To double check this, you can try changing `uweth`’s decimals to 6, and confirm that both test cases result in equal number of shares, unlike the current implementation, where the difference is huge.
```

fn setup() -> (TestingSuite, Addr, Addr, String) {
    let mut suite = TestingSuite::default_with_balances(
        vec![
            coin(1_000u128 * 10u128.pow(6), "uluna".to_string()),
            coin(1_000u128 * 10u128.pow(6), "uusd".to_string()),
            coin(1_000u128 * 10u128.pow(18), "uweth".to_string()),
            coin(10_000u128, "uom".to_string()),
        ],
        StargateMock::new("uom".to_string(), "8888".to_string()),
    );

    let creator = suite.creator();
    let user = suite.senders[1].clone();

    suite.instantiate_default().add_one_epoch().create_pool(
        &creator,
        vec!["uluna".to_string(), "uusd".to_string(), "uweth".to_string()],
        vec![6u8, 6u8, 18u8],
        PoolFee {
            protocol_fee: Fee {
                share: Decimal::zero(),
            },
            swap_fee: Fee {
                share: Decimal::zero(),
            },
            burn_fee: Fee {
                share: Decimal::zero(),
            },
            extra_fees: vec![],
        },
        PoolType::StableSwap { amp: 100 },
        Some("uluna.uusd.uweth".to_string()),
        vec![coin(1000, "uusd"), coin(8888, "uom")],
        |result| {
            result.unwrap();
        },
    );

    let lp_denom = suite.get_lp_denom("o.uluna.uusd.uweth".to_string());

    suite.provide_liquidity(
        &creator,
        "o.uluna.uusd.uweth".to_string(),
        None,
        None,
        None,
        None,
        vec![
            Coin {
                denom: "uluna".to_string(),
                amount: Uint128::from(10u128 * 10u128.pow(6)),
            },
            Coin {
                denom: "uusd".to_string(),
                amount: Uint128::from(10u128 * 10u128.pow(6)),
            },
            Coin {
                denom: "uweth".to_string(),
                amount: Uint128::from(10u128 * 10u128.pow(18)),
            },
        ],
        |result| {
            result.unwrap();
        },
    );

    (suite, creator, user, lp_denom)
}

#[test]
fn wrong_handling_of_decimals_on_stableswap_deposit_1() {
    let (mut suite, _, user, lp_denom) = setup();

    suite
        .provide_liquidity(
            &user,
            "o.uluna.uusd.uweth".to_string(),
            None,
            None,
            None,
            None,
            vec![
                Coin {
                    denom: "uluna".to_string(),
                    amount: Uint128::from(2u128 * 10u128.pow(6)),
                },
                Coin {
                    denom: "uweth".to_string(),
                    amount: Uint128::from(2u128 * 10u128.pow(18)),
                },
            ],
            |result| {
                result.unwrap();
            },
        )
        .query_balance(&user.to_string(), lp_denom.clone(), |result| {
            assert_eq!(
                result.unwrap().amount,
                Uint128::from(13_901_163_096_216u128)
            );
        });
}

#[test]
fn wrong_handling_of_decimals_on_stableswap_deposit_2() {
    let (mut suite, _, user, lp_denom) = setup();

    suite
        .provide_liquidity(
            &user,
            "o.uluna.uusd.uweth".to_string(),
            None,
            None,
            None,
            None,
            vec![
                Coin {
                    denom: "uluna".to_string(),
                    amount: Uint128::from(2u128 * 10u128.pow(6)),
                },
                Coin {
                    denom: "uusd".to_string(),
                    amount: Uint128::from(2u128 * 10u128.pow(6)),
                },
            ],
            |result| {
                result.unwrap();
            },
        )
        .query_balance(&user.to_string(), lp_denom.clone(), |result| {
            assert_eq!(result.unwrap().amount, Uint128::from(9_054_673_799_013u128));
        });
}
```

### Recommended mitigation steps

Whenever computing D, make sure all the deposits/amounts are in the “non-decimal” value, i.e., without decimals. For example, `100e6` should just be sent as 100, just like how it’s done in [`compute_swap`](https://github.com/code-423n4/2024-11-mantra-dex/blob/main/contracts/pool-manager/src/helpers.rs# L196-L198). This should be added in `compute_d`.

**jvr0x (MANTRA) confirmed**

---


