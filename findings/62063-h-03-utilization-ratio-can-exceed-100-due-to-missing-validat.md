---
tags:
  - lang/rust
  - sector/lending
  - sector/nft-lending
  - sector/oracle
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - novelty/variant
protocol: "[[Blend]]"
auditors:
  - "[[0x007]]"
report: "https://code4rena.com/reports/2025-02-blend-v2-audit-certora-formal-verification"
genome:
  - "[[wrong-condition]]"
  - "[[indirect-loss]]"
  - "[[variant]]"
  - "[[liquidation-underwater]]"
---
# [H-03] Utilization ratio can exceed 100% due to missing validation in withdrawal functions

- id: 62063
- impact: HIGH
- protocol: [[Blend]]
- reporter: 0x007 (Code4rena)
- source: https://code4rena.com/reports/2025-02-blend-v2-audit-certora-formal-verification

## Summary


This bug report discusses an issue with the utilization ratio check in the protocol's `apply_withdraw` and `apply_withdraw_collateral` functions. These functions do not properly validate the utilization ratio, which can lead to unbounded interest rates and market instability. A proof of concept is provided, and a recommended mitigation is to add a `require_utilization_below_max` validation in both functions. The bug has been confirmed and mitigated by the development team. 

## Details



<https://github.com/code-423n4/2025-02-blend/blob/main/blend-contracts-v2/pool/src/pool/actions.rs# L382>

### Finding description

The protocol implements a maximum utilization ratio check via the `require_utilization_below_max` function, which ensures that `utilization = total_liabilities / total_supply` remains below a specific threshold. However, this validation is only enforced in the `apply_borrow` function when increasing liabilities, and is critically missing from the `apply_withdraw` and `apply_withdraw_collateral` functions.

Since withdrawals reduce the `total_supply` denominator in the `utilization` formula, large withdrawals can cause the utilization ratio to increase beyond the intended maximum threshold. These seems intentional but there are downsides when utilization exceeds 100%. The extra amounts can come from `backstop_interest` or donations.

### Impact

1. **Unbounded Interest Rates**: The protocol’s interest rate models uses utilization ratio as a key input. When utilization exceeds 100%, the interest rate calculation can produce extreme values.
2. **Market Instability**:

   * Extended periods with utilization ratio above 100% can lead to liquidations, bad debt accumulation and potential protocol insolvency.
   * `backstop_interest_auction` might not work because the interest has been lent out

### Proof of Concept

This was slightly modified from [`test_build_actions_from_request_withdraw_allows_over_max_util`](https://github.com/code-423n4/2025-02-blend/blob/main/blend-contracts-v2/pool/src/pool/actions.rs# L664)
```

#[test]
fn test_build_actions_from_request_withdraw_allows_over_100_util() {
    let e = Env::default();
    e.mock_all_auths();

    let bombadil = Address::generate(&e);
    let samwise = Address::generate(&e);
    let pool = testutils::create_pool(&e);

    let (underlying, _) = testutils::create_token_contract(&e, &bombadil);
    let (mut reserve_config, mut reserve_data) = testutils::default_reserve_meta();
    reserve_config.max_util = 0_9000000;
    reserve_data.b_supply = 100_0000000;
    reserve_data.d_supply = 89_0000000;
    testutils::create_reserve(&e, &pool, &underlying, &reserve_config, &reserve_data);

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
    let pool_config = PoolConfig {
        oracle: Address::generate(&e),
        min_collateral: 1_0000000,
        bstop_rate: 0_2000000,
        status: 0,
        max_positions: 2,
    };

    let user_positions = Positions {
        liabilities: map![&e],
        collateral: map![&e],
        supply: map![&e, (0, 20_0000000)],
    };
    e.as_contract(&pool, || {
        storage::set_pool_config(&e, &pool_config);
        storage::set_user_positions(&e, &samwise, &user_positions);

        let mut pool = Pool::load(&e);

        let requests = vec![
            &e,
            Request {
                request_type: RequestType::Withdraw as u32,
                address: underlying.clone(),
                // diff1 from: amount: 2_0000000,
                amount: 20_0000000,
            },
        ];
        let mut user = User::load(&e, &samwise);
        let actions = build_actions_from_request(&e, &mut pool, &mut user, requests);

        assert_eq!(actions.check_health, false);

        let spender_transfer = actions.spender_transfer;
        let pool_transfer = actions.pool_transfer;
        assert_eq!(spender_transfer.len(), 0);
        assert_eq!(pool_transfer.len(), 1);
        // diff2 from: assert_eq!(pool_transfer.get_unchecked(underlying.clone()), 2_0000000);
        assert_eq!(pool_transfer.get_unchecked(underlying.clone()), 20_0000000);

        let positions = user.positions.clone();
        assert_eq!(positions.liabilities.len(), 0);
        assert_eq!(positions.collateral.len(), 0);
        assert_eq!(positions.supply.len(), 1);
        // diff3 from: assert_eq!(user.get_supply(0), 18_0000111);
        assert_eq!(user.get_supply(0), 1110);

        // diff4: add utilization rate check
        let reserve = pool.load_reserve(&e, &underlying.clone(), false);
        assert_eq!(reserve.utilization(&e), 1_1125010);
    });
}
```

### Recommended Mitigation

Add the `require_utilization_below_max` validation to both the `apply_withdraw` and `apply_withdraw_collateral` functions. This ensures that all operations that could potentially increase the utilization ratio (either by increasing liabilities or decreasing supply) are properly validated against the maximum threshold. If you want to permit withdrawal beyond threshold, add a `require_utilization_below_100` for withdrawals.

**markus\_pl10 (Script3) confirmed**

**[Blend mitigated](https://github.com/code-423n4/2025-04-blend-mitigation?tab=readme-ov-file# mitigation-of-high--medium-severity-issues):**

> [PR 48](https://github.com/blend-capital/blend-contracts-v2/pull/48) - Validate if util is below 100% when doing withdraw actions (see [commit](https://github.com/blend-capital/blend-contracts-v2/commit/f35271bd660470e1d3037ed03302e612821c4add)).

**Status:** Mitigation confirmed. Full details in reports from [0x007](https://code4rena.com/audits/2025-04-blend-v2-mitigation-review/submissions/S-41), [0xAlix2](https://code4rena.com/audits/2025-04-blend-v2-mitigation-review/submissions/S-18), [Testerbot](https://code4rena.com/audits/2025-04-blend-v2-mitigation-review/submissions/S-68) and [oakcobalt](https://code4rena.com/audits/2025-04-blend-v2-mitigation-review/submissions/S-23).

---

---
