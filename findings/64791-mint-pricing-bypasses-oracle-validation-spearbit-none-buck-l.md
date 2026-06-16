---
tags:
  - lang/solidity
  - sector/options
  - sector/oracle
  - platform/spearbit
  - has/github
  - severity/high
  - vuln/oracle/missing-circuit-breaker
  - vuln/oracle/single-source
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - fix/add-circuit-breaker
  - novelty/variant
  - misassumption/oracle-is-reliable
  - fix/use-multi-oracle
protocol: "[[Buck Labs]]"
auditors:
  - "[[R0bert]]"
report: "https://github.com/spearbit/portfolio/blob/master/pdfs/Buck-Labs-Spearbit-Security-Review-January-2026.pdf"
genome:
  - "[[missing-circuit-breaker]]"
  - "[[single-source]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[add-circuit-breaker]]"
  - "[[variant]]"
  - "[[chainlink-round-completeness]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[pyth-oracle-completeness]]"
  - "[[reentrancy-guard]]"
---
# Mint pricing bypasses oracle validation

- id: 64791
- impact: HIGH
- protocol: [[Buck Labs]]
- reporter: R0bert (Spearbit)
- source: https://github.com/spearbit/portfolio/blob/master/pdfs/Buck-Labs-Spearbit-Security-Review-January-2026.pdf

## Summary


The report discusses a bug in the `PolicyManagerV2` smart contract that allows for manipulation of the price used for minting and refunds. This is caused by using a view-only path that does not validate the oracle result or update the circuit breaker state. Additionally, the circuit breaker state does not reliably latch during the refund process. This means that an attacker can mint at a lower price and later redeem at a higher price, resulting in loss of reserve assets. The report recommends using a validated oracle result and ensuring the circuit breaker can latch in a separate transaction. The bug has been fixed in the `f40ce28` commit.

## Details

## Severity: High Risk

## Context
- `LiquidityWindowV2.sol#L442`
- `LiquidityWindowV2.sol#L446`
- `LiquidityWindowV2.sol#L552-L560`
- `OracleAdapterV4.sol#L238-L243`
- `OracleAdapterV4.sol#L436`
- `PolicyManagerV2.sol#L429`

## Description
`PolicyManagerV2` computes the CAP price for mints and refunds from the oracle adapter using the view-only path. That view path returns the first fresh oracle without cross-validation and without updating any circuit breaker state. `LiquidityWindowV2` uses this view price for mints and only checks the cached circuit breaker flag, so mint pricing can continue to use an unvalidated or manipulated primary oracle even when cross-oracle divergence exists.

The circuit breaker state also does not reliably latch in normal refund flow. `LiquidityWindowV2` calls `refreshPrice` and then immediately calls `checkAndRecordRefund`, which reverts when the circuit breaker is tripped. Because the refresh and the revert happen in the same transaction, the state update that tripped the breaker is rolled back. Unless a separate transaction successfully calls `refreshPrice`, the breaker can remain false even under conditions that should trip it, and mint pricing continues to use the view-only path.

This combination means the system can keep minting against a single oracle that is stale or manipulated, with no enforced cross-validation and no persistent circuit breaker protection. In the worst case, an attacker can mint at a depressed price and later redeem at a higher price, extracting reserve assets.

```solidity
function latestPrice() external view returns (uint256 price, uint256 updatedAt) {
    return _fetchPriceView();
}

function _fetchPriceView() internal view returns (uint256 price, uint256 updatedAt) {
    (uint256 redstonePrice, uint256 redstoneTime, bool redstoneFresh) = _tryRedstone();
    if (redstoneFresh) return (redstonePrice, redstoneTime);
    (uint256 pythPrice, uint256 pythTime, bool pythFresh) = _tryPyth();
    if (pythFresh) return (pythPrice, pythTime);
    return (lastGoodPrice, lastGoodPriceTime);
}

function _computeCAPPrice() internal view returns (uint256 price) {
    (uint256 basePrice,) = IOracleAdapterV3(oracleAdapter).latestPrice();
    // ...
}

function requestRefund(...) external nonReentrant returns (uint256 usdcOut, uint256 feeUsdc) {
    // ...
    IOracleAdapterV3(oracleAdapter).refreshPrice();
    IPolicyManagerV2(policyManager).checkAndRecordRefund(usdcOut);
    // ...
}
```

## Recommendation
Make mint pricing use a validated oracle result that cannot bypass cross-validation. One option is to add a view validation function that compares Redstone and Pyth and returns a safe price without relying on a latched circuit breaker, then use that in `PolicyManagerV2`. If you want to keep the circuit breaker state machine, call `refreshPrice` in the mint path and ensure the breaker can latch in a standalone successful transaction, for example by running a keeper that refreshes prices or by separating breaker evaluation from refund state changes.

## Buck Labs
Fixed in commit `f40ce28`.

## Cantina Managed
Fix verified. `OracleAdapterV5` replaces the V4 CB/refresh flow, and `LiquidityWindow` no longer refreshes CB state. Pricing now uses the single V5 path with max-age fallback.
