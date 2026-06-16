---
tags:
  - lang/move
  - sector/lending
  - sector/oracle
  - platform/ottersec
  - has/poc
  - severity/high
  - vuln/logic/liquidation-logic
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[Navi]]"
auditors:
  - "[[Ajay Shankar]]"
report: "https://www.naviprotocol.io/"
genome:
  - "[[liquidation-logic]]"
  - "[[variant]]"
  - "[[direct-drain]]"
  - "[[liquidation-underwater]]"
---
# Erroneous Calculation Leads To Unfair Liquidation

- id: 48037
- impact: HIGH
- protocol: [[Navi]]
- reporter: Ajay Shankar (OtterSec)
- source: https://www.naviprotocol.io/

## Summary


The bug report is about a function called "calculate_max_liquidation" in the Inlogic.move code. This function is used to calculate the maximum amount of collateral and debt that can be liquidated from a user's account. However, there are some inaccuracies in the calculations that can be exploited by attackers to profit from improper liquidation scenarios. The report provides a proof of concept scenario where an attacker can take advantage of this bug to obtain collateral for a very small loan repayment. The report also includes a suggested modification to the code to fix this issue. This modification has already been implemented in the code.

## Details

## Inlogic.move Vulnerability Overview

The `calculate_max_liquidation` function retrieves `max_liquidable_collateral` and `max_liquidable_debt`. During calculations done within the function, some inaccuracies undermine the accuracy of these values. The calculations create exploitable opportunities for attackers, enabling them to profit from improper liquidation scenarios.

## Code Snippet

```rust
public fun calculate_max_liquidation(
    storage: &mut Storage,
    oracle: &PriceOracle,
    liquidated_user: address,
    collateral_asset: u8,
    loan_asset: u8
): (u256, u256) {
    let (liquidation_ratio, liquidation_bonus, _) =
        storage::get_liquidation_factors(storage, collateral_asset);
    let _collateral_value = user_collateral_value(oracle, storage,
        collateral_asset, liquidated_user); // 100 u ETH
    let _loan_value = user_loan_value(oracle, storage, loan_asset,
        liquidated_user); // 1000u - 100u
    
    let max_liquidable_collateral_value = ray_math::ray_mul(_collateral_value,
        liquidation_ratio);
    
    let max_liquidable_debt_value = _loan_value;
    
    if (_loan_value > _collateral_value) {
        max_liquidable_collateral_value =
            ray_math::ray_mul(max_liquidable_collateral_value, (ray_math::ray() +
            liquidation_bonus));
        
        max_liquidable_debt_value = _collateral_value;
    } else {
        max_liquidable_debt_value = ray_math::ray_mul(max_liquidable_debt_value,
            (ray_math::ray() + liquidation_bonus));
    };
    
    let max_liquidable_collateral = calculator::calculate_amount(oracle,
        max_liquidable_collateral_value, collateral_asset);
    
    let max_liquidable_debt = calculator::calculate_amount(oracle,
        max_liquidable_debt_value, loan_asset);
    
    (max_liquidable_collateral, max_liquidable_debt)
}
```

## Proof of Concept

Consider the following scenario:
1. A victim has health less than one and two loan assets, one large and one small.
2. An attacker liquidates the small loan asset using the large collateral asset.
3. The attacker obtains the collateral for a minuscule loan repayment.
4. Note that `max_liquidable_collateral_value` is not appropriately reduced based on the `max_liquidable_debt_value` when the collateral exceeds the loan amount.

## Remediation

Modify the code as follows, since `max_liquidable_collateral_value` should always be equal to `max_liquidable_debt_value * (1 + bonus)`:

```diff
@@ -487,11 +487,10 @@ module lending_core::logic {
    let max_liquidable_collateral_value = ray_math::ray_mul(_collateral_value,
        liquidation_ratio);
    
    let max_liquidable_debt_value = _loan_value;
    
    - if (_loan_value > _collateral_value) {
    -     max_liquidable_collateral_value =
            ray_math::ray_mul(max_liquidable_collateral_value, (ray_math::ray() +
            liquidation_bonus));
    
    -     max_liquidable_debt_value = _collateral_value;
    + if (max_liquidable_debt_value > max_liquidable_collateral_value) {
    +     max_liquidable_debt_value =
            ray_math::ray_div(max_liquidable_collateral_value, (ray_math::ray() +
            liquidation_bonus));

    } else {
    -     max_liquidable_debt_value =
            ray_math::ray_mul(max_liquidable_debt_value, (ray_math::ray() +
            liquidation_bonus));
    
    +     max_liquidable_collateral_value =
            ray_math::ray_mul(max_liquidable_debt_value, (ray_math::ray() +
            liquidation_bonus));
    
    };
    
    let max_liquidable_collateral = calculator::calculate_amount(oracle,
        max_liquidable_collateral_value, collateral_asset);
```

## Patch

This modification has been implemented in `33fbb0f` by deprecating `calculate_max_liquidation` and performing the calculation of liquidation using the updated `calculate_liquidation`.
