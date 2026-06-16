---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/staking
protocol: "[[Cabal]]"
auditors:
  - "[[ret2basic]]"
report: "https://code4rena.com/reports/2025-04-cabal-liquid-staking-token"
genome:
  - "[[wrong-condition]]"
  - "[[locked-funds]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# [H-01] LP unstaking only burns the shares but leaves the underlying tokens in the system, which distorts the shares-to-tokens ratio and leads to incorrect amounts being calculated during staking and unstaking

- id: 56895
- impact: HIGH
- protocol: [[Cabal]]
- reporter: ret2basic (Code4rena)
- source: https://code4rena.com/reports/2025-04-cabal-liquid-staking-token

## Summary


This report describes a bug in the code that handles unstaking and staking of LP tokens in the Cabal protocol. When a user unstakes their tokens, the corresponding shares (Cabal tokens) are burned, but the actual undelegation from the validator can take up to 3 days. During this time, the shares are burned, but the underlying tokens are still included in conversions. This leads to an incorrect calculation of the amount of tokens to be unbonded, resulting in users receiving too many tokens that belong to other users. This bug is considered high severity and can be mitigated by subtracting the pending tokens from the total amount when calculating the unbonding amount. A proof of concept is provided to demonstrate the bug. 

## Details



<https://github.com/code-423n4/2025-04-cabal/blob/5b5f92ab4f95e5f9f405bbfa252860472d164705/sources/cabal.move# L1051-L1054>

### Finding description

When a user unstakes LP tokens, the corresponding shares (Cabal tokens) are burned. However, the actual undelegation from the validator will occur only after a delay of up to 3 days. During this period, the shares are already burned, but the underlying tokens are still included in shares-to-token conversions.
This is a problem because, in `process_lp_unstake`, the amount of tokens to unbond is calculated as follows:
<https://github.com/code-423n4/2025-04-cabal/blob/5b5f92ab4f95e5f9f405bbfa252860472d164705/sources/cabal.move# L1051-L1054>

The `lp_amount` is calculated based on the amount of tokens actually staked on the validator. This includes tokens that are pending to be undelegated (`unstaked_pending_amounts`), for which the Cabal tokens have already been burned.

This means that the `unbonding_amount` is also calculated incorrectly because the `lp_amount` is too high. As a result, the `unbonding_amount` will also be too high, and the unstaker will receive too many tokens that are actually belonging to other users.

Since the Cabal tokens a user receives are also calculated this way in `process_lp_stake`, users will receive too few shares when there are pending undelegations. As a result, they will have fewer tokens after the next `batch_undelegate_pending_lps`:
<https://github.com/code-423n4/2025-04-cabal/blob/5b5f92ab4f95e5f9f405bbfa252860472d164705/sources/cabal.move# L946-L953>

### Impact

Because users receive too many tokens that actually belong to other users, and since this issue occurs during normal unstaking and staking, it is high severity.

### Recommended mitigation steps

The `unstaked_pending_amounts` should be subtracted from the `lp_amount` to correctly account for the pending tokens to be undelegated, for which the Cabal tokens have already been burned.

### Proof of Concept
```

    #[test(
        c = @staking_addr, user_a = @0xAAA, user_b = @0xBBB, user_c = @0xCCC
    )]
    fun test_poc(
        c: &signer,
        user_a: &signer,
        user_b: &signer,
        user_c: &signer
    ) {
        test_setup(c, string::utf8(b"initvaloper1test"));

        //gets the metadata for all tokens
        let ulp_metadata = coin::metadata(@initia_std, string::utf8(b"ulp"));
        let init_metadata = coin::metadata(@initia_std, string::utf8(b"uinit"));
        let cabal_lp_metadata = cabal::get_cabal_token_metadata(1);
        let x_init_metadata = cabal::get_xinit_metadata();
        let sx_init_metadata = cabal::get_sxinit_metadata();

        let initia_signer = &account::create_signer_for_test(@initia_std);

        let ulp_decimals = 1_000_000; //ulp has 6 decimals

        let deposit_amount_a = 100 * ulp_decimals; //the amount user a deposits
        primary_fungible_store::transfer( //user a must first be funded
            initia_signer,
            ulp_metadata,
            signer::address_of(user_a),
            deposit_amount_a
        );
        utils::increase_block(1, 1);
        cabal::mock_stake(user_a, 1, deposit_amount_a); //user a stakes 100 ulp

        utils::increase_block(1, 1);

        let deposit_amount_b = 50 * ulp_decimals; //the amount user b stakes
        primary_fungible_store::transfer(
            initia_signer,
            ulp_metadata,
            signer::address_of(user_b),
            deposit_amount_b
        );
        utils::increase_block(1, 1);
        cabal::mock_stake(user_b, 1, deposit_amount_b); //user b stakes 50 ulp

        utils::increase_block(1, 1000);
        cabal::mock_unstake(user_b, 1, deposit_amount_b); //user b unstakes 50 ulp this means the cabal tokens are now 100 and the underlying tokens 150
        //This mock unstaking uses the pool balances instead of querying the validator because Cosmos is not supported during testing.
        //However, this is not a problem, since the pools are only modified after the undelegation, not during the unstaking

        utils::increase_block(1, 1000);
        cabal::mock_unstake(user_a, 1, 50 * ulp_decimals); //user a unstakes half of his cabal lp tokens for which 50 ulp tokens should be unstaked but actually 75 are getting unstaked
    }
```

You can also add `debug::print(&unbonding_amount);` to line 1334 in cabal.move to verify that 75 ULP tokens are being unstaked instead of 50.

To run the POC, paste it into the file `tests/core_staking_test.move` and run the command `initiad move test -f test_poc`

---
