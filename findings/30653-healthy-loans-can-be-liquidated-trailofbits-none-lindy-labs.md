---
tags:
  - lang/solidity
  - sector/cdp
  - sector/farm
  - sector/lending
  - platform/trailofbits
  - has/github
  - severity/high
  - vuln/logic/liquidation-logic
  - impact/loss-of-funds/direct-drain
  - novelty/variant
  - misassumption/math-is-safe
  - fix/redesign-logic
protocol: "[[Lindy Labs]]"
auditors:
  - "[[Justin Jacob]]"
report: "https://github.com/trailofbits/publications/blob/master/reviews/2023-08-aura-securityreview.pdf"
genome:
  - "[[liquidation-logic]]"
  - "[[direct-drain]]"
  - "[[variant]]"
  - "[[liquidation-underwater]]"
---
# Healthy loans can be liquidated

- id: 30653
- impact: HIGH
- protocol: [[Lindy Labs]] Aura
- reporter: Justin Jacob (TrailOfBits)
- source: https://github.com/trailofbits/publications/blob/master/reviews/2023-08-aura-securityreview.pdf

## Summary


This bug report describes an issue in the code for a financial system. The bug allows for an arbitrary loan to be liquidated, resulting in the loss of funds for the borrower. This is due to missing validation in the code, specifically related to the loan's threshold and LTV values. This can occur when the loan is insolvent and liquidations are triggered via the stability pool. The code does not properly check if the loan's threshold is less than the maximum penalty LTV, allowing for incorrect liquidations to occur. The report recommends setting the maximum threshold value to be the same as the maximum penalty LTV and improving unit tests in the long term to prevent similar issues. 

## Details

## Vulnerability Report

## Difficulty: High

## Type: Undefined Behavior

### Target: src/core/purger.cairo

### Description
Due to missing validation that the loan's threshold is less than the LTV, an arbitrary loan can be liquidated if the threshold is between the `MAX_PENALTY_LTV` and `MAX_THRESHOLD` variables.

When loans are insolvent, liquidations via the stability pool can occur by calling the `absorb` function, which will use funds from the stability pool to cover a borrower's debt. To verify that a loan is liquidatable, the loan's LTV is checked against the `MAX_PENALTY_LTV` variable, with the rationale that the loan's threshold must be less than the LTV. This would mean that the loan's LTV is larger than the threshold, marking it insolvent.

```c
// Performs stability pool liquidations to pay down a trove's debt in full and transfer the
// freed collateral to the stability pool. If the stability pool does not have
// sufficient yin, the trove's debt and collateral will be proportionally redistributed among all
// troves containing the trove's collateral.
// - Amount of debt distributed to each collateral = (value of collateral / trove value) * trove debt
// Reverts if the trove's LTV is not above the maximum penalty LTV
// - This also checks the trove is liquidatable because threshold must be lower than max penalty LTV.
// Returns a tuple of an ordered array of yang addresses and an ordered array of asset amounts
// in the decimals of each respective asset due to the caller as compensation.
#[external]
fn absorb(trove_id: u64) -> (Span<ContractAddress>, Span<u128>) {
    let shrine: IShrineDispatcher = shrine::read();
    let (trove_threshold, trove_ltv, trove_value, trove_debt) = shrine.get_trove_info(trove_id);
    assert(trove_ltv.val > MAX_PENALTY_LTV, 'PU: Not absorbable');
}
```
*Figure 1.1: The absorb function (Purger.cairo#L167-L181)*

However, the threshold may not be less than the `MAX_PENALTY_LTV` variable. The only bound it has is the `MAX_THRESHOLD` variable, which is larger than `MAX_PENALTY_LTV`:

```c
const MAX_THRESHOLD: u128 = 1000000000000000000000000000;  // (ray): RAY_ONE
```
*Figure 1.2: The MAX_THRESHOLD constant (Shrine.cairo #L31)*

```c
#[external]
fn set_threshold(yang: ContractAddress, new_threshold: Ray) {
    AccessControl::assert_has_role(ShrineRoles::SET_THRESHOLD);
    assert(new_threshold.val <= MAX_THRESHOLD, 'SH: Threshold > max');
    thresholds::write(get_valid_yang_id(yang), new_threshold);
    // Event emission
    ThresholdUpdated(yang, new_threshold);
}
```
*Figure 1.3: The set_threshold function (Shrine.cairo#L449-L458)*

As a result, if a loan has `MAX_PENALTY_LTV < threshold < MAX_THRESHOLD` and `LTV < threshold`, it will incorrectly be flagged for liquidation.

### Exploit Scenario
Alice, a borrower, has a position with an LTV of 90% and a threshold of 95%. Eve, a malicious user, calls `absorb` and incorrectly liquidates Alice's position. As a result, Alice loses her funds.

### Recommendations
- **Short term**: Set the `MAX_THRESHOLD` value to be the same as the `MAX_PENALTY_LTV` value.
- **Long term**: Improve unit tests to increase coverage and ensure intended behavior throughout the system.
