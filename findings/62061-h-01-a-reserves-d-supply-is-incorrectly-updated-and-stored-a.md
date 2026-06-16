---
tags:
  - lang/rust
  - sector/farm
  - sector/lending
  - sector/nft-lending
  - sector/oracle
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - vuln/logic/reward-calculation
  - trigger/first-deposit
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Blend]]"
auditors:
  - "[[carrotsmuggler]]"
report: "https://code4rena.com/reports/2025-02-blend-v2-audit-certora-formal-verification"
genome:
  - "[[reward-calculation]]"
  - "[[wrong-state]]"
  - "[[first-deposit]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[variant]]"
  - "[[flashloan-callback-auth]]"
  - "[[integer-bounds]]"
  - "[[reward-accounting]]"
---
# [H-01] A reserve’s `d_supply` is incorrectly updated and stored after flash loan execution

- id: 62061
- impact: HIGH
- protocol: [[Blend]]
- reporter: carrotsmuggler (Code4rena)
- source: https://code4rena.com/reports/2025-02-blend-v2-audit-certora-formal-verification

## Summary


This bug report discusses a potential issue in the code for a project called Blend. The issue involves a function called `contract.flash_loan()` which can lead to incorrect calculations and manipulation of the system. This is due to a failure to properly cache a reserve in the `Pool.reserves` array, resulting in an incorrect `d_supply` value for the reserve. This can have various impacts on the system, such as allowing users to borrow more assets than they should be able to and incorrect distribution of rewards. A proof of concept is provided to demonstrate how this issue can be exploited. The recommended mitigation is to add a `pool.cache_reserve()` call after applying state changes in the `submit.execute_submit_with_flash_loan()` function. The project has confirmed that they have implemented this mitigation.

## Details



<https://github.com/code-423n4/2025-02-blend/blob/f23b3260763488f365ef6a95bfb139c95b0ed0f9/blend-contracts-v2/pool/src/pool/submit.rs# L86>

<https://github.com/code-423n4/2025-02-blend/blob/f23b3260763488f365ef6a95bfb139c95b0ed0f9/blend-contracts-v2/pool/src/pool/submit.rs# L101>

<https://github.com/code-423n4/2025-02-blend/blob/f23b3260763488f365ef6a95bfb139c95b0ed0f9/blend-contracts-v2/pool/src/pool/actions.rs# L187>

<https://github.com/code-423n4/2025-02-blend/blob/f23b3260763488f365ef6a95bfb139c95b0ed0f9/blend-contracts-v2/pool/src/pool/actions.rs# L412>

<https://github.com/code-423n4/2025-02-blend/blob/f23b3260763488f365ef6a95bfb139c95b0ed0f9/blend-contracts-v2/pool/src/pool/actions.rs# L417>

### Finding description and impact

Executing `contract.flash_loan(...)` will subsequently call `submit.execute_submit_with_flash_loan(...)` where the `Pool` struct is loaded with `Pool.config` assigned to the pool’s configuration and all other `Pool` fields are empty: `let mut pool = Pool::load(e)`.

After that, the Reserve of the asset that will be borrowed as a flash loan is loaded - `let mut reserve = pool.load_reserve(e, &flash_loan.asset, true)`. The function `pool.load_reserve(...)` caches the Address of the asset in the array `Pool.reserves_to_store` and loads the Reserve from storage since the Reserve is not yet present in the Map `Pool.reserves`.

The execute function then adds the flash loan amount as a liability for the user through `from_state.add_liabilities(e, &mut reserve, d_tokens_minted)` which will update the `d_supply` of the Reserve. However, the execute function has not cached the Reserve in `Pool.reserves` through the function `pool.cache_reserve(...)`.
```

pub fn execute_submit_with_flash_loan(...) -> Positions {
    ...
    let mut pool = Pool::load(e);
    let mut from_state = User::load(e, from);
    ...
    {
        let mut reserve = pool.load_reserve(e, &flash_loan.asset, true);
        let d_tokens_minted = reserve.to_d_token_up(e, flash_loan.amount);
        from_state.add_liabilities(e, &mut reserve, d_tokens_minted);
        ...
    }
    let actions = build_actions_from_request(e, &mut pool, &mut from_state, requests);
    ...
    pool.store_cached_reserves(e);
    ...
}
```

The execute function then continues to process the rest of the user’s requests by calling `build_actions_from_request(...)`. However, if the asset used for the flash loan is also used in the requests, such as a Repay Request to payback the flash loaned amount, `build_actions_from_request(...)` will call; for example, `apply_repay(...)` which will attempt to load the Reserve for the same token that was borrowed by the user.

Since the flash loan asset’s Reserve wasn’t originally cached with `pool.cache_reserve()`, the Reserve will again be loaded from storage where the `d_supply` is the value before the flash loan liability was added. The `apply_repay()` function will then subtract the repaid flash loan amount from the stale `d_supply` (before the flash loan liability was accounted for) and will call `pool.cache_reserve()` to cache the reserve in `Pool.reserves`. Finally, after `build_actions_from_request(...)` has finished processing requests, the reserves cached in `Pool.reserves` are saved in storage through `pool.store_cached_reserves(e)` and the flash loaned asset’s Reserve will be stored with an incorrect `d_supply`.
```

fn apply_repay(...) -> (i128, i128) {
    let mut reserve = pool.load_reserve(e, &request.address, true);
    ...
    if d_tokens_burnt > cur_d_tokens {
        ...
        user.remove_liabilities(e, &mut reserve, cur_d_tokens);
        pool.cache_reserve(reserve);
        ...
    } else {
        ...
        user.remove_liabilities(e, &mut reserve, d_tokens_burnt);
        pool.cache_reserve(reserve);
        ...
    }
}
```

A summary through an example:

* Asset X has a Reserve with `d_supply = 500` and a 1:1 rate of X tokens to `d_tokens`
* User calls `contract.flash_loan(...)` with a `Flash_Loan.asset = X`, `Flash_Loan.amount = 250` and a Repay Request where
  `Request.asset = X` and `Request.amount = 250`
* X Reserve is loaded with `d_supply = 500`
* Call to `from_state.add_liabilities(e, &mut reserve, d_tokens_minted)` sets `d_supply = 750`
* X Reserve is not cached or saved in storage
* `build_actions_from_request(...)` processes the Repay Request
* `apply_repay(...)` calls `pool.load_reserve(...)`
* The X Reserve is again loaded from storage with `d_supply = 500`
* `apply_repay(...)` calls `user.remove_liabilities(...)` which sets `d_supply = 250`
* `apply_repay(...)` saves in cache X Reserve with `d_supply = 250`
* Finally, `pool.store_cached_reserves(e)` is called and X Reserve is saved in storage with `d_supply = 250`

### Impact

A core invariant of the system is violated where for a Reserve, the sum of all user’s liabilities must be equal to `d_supply`. There are numerous places where `d_supply` is used within the protocol and when updated incorrectly will cause erroneous calculations:

* The function `reserve.utilization()` uses `d_supply` to determine how much of the Reserve’s liquidity can be given as a loan. An incorrect decrease in `d_supply` will allow borrowing assets even if the maximum utilization ratio is met.
* The utilization of the reserve is also used in calculating the accrual fees of the Reserve in `reserve.load(...)` which downstream calls `interest.calc_accrual(...)`. An incorrect update of the accrued interest can be of benefit to some users and a drawback to others.
* Since `d_supply` is an `i128` value, a `d_supply` that is lower than the sum of all user’s liabilities in the Reserve can cause `d_supply` to become negative when `user.remove_liabilities(...)` is executed. As per the assumptions of the protocol, `d_supply` should never be a negative number.
* The distribution of BLEND token emissions will be incorrect when `d_supply` incorrectly decreases, allowing users to illegally claim more BLEND tokens than they are owed, damaging other Reserve’s emission rewards and denying other users from claiming rewards.

A short example of an attack idea where a malicious user claims illegally BLEND token emissions:

* Assume Reserve for token X with `d_supply = N`.
* Assume a malicious user has some existing liability, participating in the `d_supply` for Reserve X .
* Malicious user calls `contract.flash_loan(...)` and exploits to reduce the `d_supply = 1` with a Flash Loan amount of `N-1` and a Repay Request of `N-1`.
* When time passes, `distributor.update_emission_data(...)` will update the index (reward per token) for the Reserve X according to `d_supply = 1`; i.e. inflating the reward per token (there are still other users that have liabilities but `d_supply` does not reflect that).
* Malicious user calls `contract.claim()` for Reserve X where he will claim an inflated amount of accrued rewards since the index (reward per token) is inflated.
* Subsequent accounts of the malicious user or regular users can continue claiming their rewards for Reserve X with an inflated index, therefore, stealing other Reserves rewards.

### Proof of Concept

* In `/blend-contracts-v2/pool/src/pool/submit.rs`
* Apply the modifications below to the the test `test_submit_with_flash_loan_process_flash_loan_first()`
* Change directory to `/blend-contracts-v2/pool`
* Run with `cargo test pool::submit::tests::test_submit_with_flash_loan_process_flash_loan_first -- --nocapture --exact`
* Inspect the `@` audit tags in the test and the log output in the console
```

-use soroban_sdk::{panic_with_error, Address, Env, Map, Vec};
+use soroban_sdk::{panic_with_error, Address, Env, Map, Vec, log};
#[test]
fn test_submit_with_flash_loan_process_flash_loan_first() {
    let e = Env::default();
    e.cost_estimate().budget().reset_unlimited();
    e.mock_all_auths_allowing_non_root_auth();

    e.ledger().set(LedgerInfo {
        timestamp: 600,
        protocol_version: 22,
        sequence_number: 1234,
        network_id: Default::default(),
        base_reserve: 10,
        min_temp_entry_ttl: 10,
        min_persistent_entry_ttl: 10,
        max_entry_ttl: 3110400,
    });

    let bombadil = Address::generate(&e);
    let samwise = Address::generate(&e);
    let pool = testutils::create_pool(&e);
    let (oracle, oracle_client) = testutils::create_mock_oracle(&e);

    let (flash_loan_receiver, _) = testutils::create_flashloan_receiver(&e);

    let (underlying_0, underlying_0_client) = testutils::create_token_contract(&e, &bombadil);
    let (mut reserve_config, mut reserve_data) = testutils::default_reserve_meta();
    reserve_config.max_util = 9500000;
    reserve_data.b_supply = 100_0000000;
+   // @audit d-supply is 5e8
    reserve_data.d_supply = 50_0000000;
    testutils::create_reserve(&e, &pool, &underlying_0, &reserve_config, &reserve_data);

    let (underlying_1, underlying_1_client) = testutils::create_token_contract(&e, &bombadil);
    let (reserve_config, reserve_data) = testutils::default_reserve_meta();
    testutils::create_reserve(&e, &pool, &underlying_1, &reserve_config, &reserve_data);

    oracle_client.set_data(
        &bombadil,
        &Asset::Other(Symbol::new(&e, "USD")),
        &vec![
            &e,
            Asset::Stellar(underlying_0.clone()),
            Asset::Stellar(underlying_1.clone()),
        ],
        &7,
        &300,
    );
    oracle_client.set_price_stable(&vec![&e, 1_0000000, 5_0000000]);

    let pool_config = PoolConfig {
        oracle,
        min_collateral: 1_0000000,
        bstop_rate: 0_1000000,
        status: 0,
        max_positions: 4,
    };
    e.as_contract(&pool, || {
        storage::set_pool_config(&e, &pool_config);

        underlying_0_client.mint(&samwise, &1_0000000);
        underlying_0_client.approve(&samwise, &pool, &100_0000000, &10000);

        let pre_pool_balance_0 = underlying_0_client.balance(&pool);
        let pre_pool_balance_1 = underlying_1_client.balance(&pool);

        // pool has 100 supplied and 50 borrowed for asset_0
        // -> max util is 95%
+       // @audit flash loan amount is 2.5e8
+       // @audit after the FlashLoan request
+       // @audit d_supply will be (5e8 + 2.5e8) = 7.5e8
        let flash_loan: FlashLoan = FlashLoan {
            contract: flash_loan_receiver,
            asset: underlying_0.clone(),
            amount: 25_0000000,
        };
-
+
+       // @audit after the Repay request to repay the borrowed through FLashLoan request
+       // @audit d_supply should be (7.5e8 - ~2.5e8) = ~5e8
        let requests = vec![
            &e,
            Request {
                request_type: RequestType::Repay as u32,
-                    address: underlying_0,
+                    address: underlying_0.clone(),
                amount: 25_0000010,
            },
        ];
        let positions = execute_submit_with_flash_loan(&e, &samwise, flash_loan, requests);
-
+
+       // @audit inspect this log to see d_supply is ~2.5e8 instead of ~5e8
+       // @audit d_supply has erroneously decreased by 2.5e8
+
+       log!(&e, "D_SUPPLY POST FLASH LOAN: {}", storage::get_res_data(&e, &underlying_0).d_supply);
        assert_eq!(positions.liabilities.len(), 0);
        assert_eq!(positions.collateral.len(), 0);
        assert_eq!(positions.supply.len(), 0);

        assert_eq!(underlying_0_client.balance(&pool), pre_pool_balance_0 + 1,);
        assert_eq!(underlying_1_client.balance(&pool), pre_pool_balance_1,);

        // rounding causes 1 stroops to be lost
        assert_eq!(underlying_0_client.balance(&samwise), 0_9999999);
        assert_eq!(underlying_1_client.balance(&samwise), 0);

        // check allowance is used
        assert_eq!(
            underlying_0_client.allowance(&samwise, &pool),
            100_0000000 - 25_0000001
        );
    });
}
```

### Recommended mitigation steps

In `submit.execute_submit_with_flash_loan()`, use `pool.cache_reserve()` to cache the Reserve of the Flash Loan asset after adding the flash loan amount as a liability for the user.

**markus\_pl10 (Script3) confirmed**

**[mootz12 (Script3) commented:](https://code4rena.com/audits/2025-02-blend-v2-audit-certora-formal-verification/submissions/F-4?commentParent=Aa5KrVgCsGw)**

> Fixed to add `cache_reserve()` call after applying state changes.

**[Blend mitigated](https://github.com/code-423n4/2025-04-blend-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> [Commit e4ed914](https://github.com/blend-capital/blend-contracts-v2/commit/e4ed914e45433f160bb4f066fd517667b7d8907b) to clean up flash loans implementation.

**Status:** Mitigation confirmed. Full details in reports from [0xAlix2](https://code4rena.com/audits/2025-04-blend-v2-mitigation-review/submissions/S-8), [Testerbot](https://code4rena.com/audits/2025-04-blend-v2-mitigation-review/submissions/S-58), [0x007](https://code4rena.com/audits/2025-04-blend-v2-mitigation-review/submissions/S-43), [oakcobalt](https://code4rena.com/audits/2025-04-blend-v2-mitigation-review/submissions/S-25) and [rscodes](https://code4rena.com/audits/2025-04-blend-v2-mitigation-review/submissions/S-75).

---
