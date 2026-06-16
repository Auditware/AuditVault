---
tags:
  - lang/solidity
  - sector/dex
  - platform/ottersec
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
protocol: "[[Neutron]]"
auditors:
  - "[[Robert Chen]]"
report: "https://www.neutron.org/"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# Swapping Of Incorrect Pools

- id: 47239
- impact: HIGH
- protocol: [[Neutron]]
- reporter: Robert Chen (OtterSec)
- source: https://www.neutron.org/

## Summary


The vulnerability is caused by an assumption in the MultiHopSwapCore code that all routes start with the same initial token. If the initial tokens differ across routes, it can result in incorrect swaps and loss of funds. The code does not check if the initial tokens of all routes are the same. This allows for routes like "TokenD", "TokenC", "TokenB" and "TokenC", "TokenD", "TokenB" to be considered valid, but in the second route, the pool TokenC<>TokenD will be called, but TokenD will be swapped for TokenD instead of TokenC, resulting in a loss of funds. To fix this, a check has been added to ensure that all routes start with the same initial token. This issue has been fixed in the latest code update.

## Details

## Vulnerability Summary

The vulnerability arises from the assumption in `core::MultiHopSwapCore` that all routes start with the same initial token. If the initial tokens differ across routes, it may result in incorrect swaps, leading to a loss of funds. `MultiHopSwapCore` utilizes `initialInCoin` (derived from the first route) for all routes. This assumes that all routes start with the same initial token. `message_multi_hop_swap::ValidateBasic` does not check if the initial tokens of all routes are the same.

```go
> _message_multi_hop_swap.gogo
func (k Keeper) MultiHopSwapCore(
    goCtx context.Context,
    amountIn math.Int,
    routes []*types.MultiHopRoute,
    exitLimitPrice math_utils.PrecDec,
    pickBestRoute bool,
    callerAddr sdk.AccAddress,
    receiverAddr sdk.AccAddress,
) (coinOut sdk.Coin, err error) {
    [...]
    for _, route := range routes {
        routeDust, routeCoinOut, writeRoute, err := k.RunMultihopRoute(
            ctx,
            *route,
            initialInCoin,
            exitLimitPrice,
            stepCache,
        )
        [...]
    }
    [...]
}
```

This allows routes like "TokenD", "TokenC", "TokenB" and "TokenC", "TokenD", "TokenB" to be considered valid. However, in the above case, within the second route, the pool `TokenC<>TokenD` will be called, but `TokenD` will be swapped for `TokenD` instead of `TokenC`. This will result in a loss of funds if one `TokenC` is swapped for more than one `TokenD`.

© 2024 Otter Audits LLC. All Rights Reserved. 6/14

## Neutron Audit 04 - Vulnerabilities

### Proof of Concept

In the test given below:

```go
> _test.gogo
func (s *DexTestSuite) TestSwapBug1() {
    amountAInt,_ := math.NewIntFromString("100000000")
    amountDInt,_ := math.NewIntFromString("100000000")
    coins := sdk.NewCoins(
        sdk.NewCoin("TokenA", amountAInt),
        sdk.NewCoin("TokenD", amountDInt),
    )
    s.fundAccountBalancesWithDenom(s.alice, coins)
    // GIVEN liquidity in pools A<>B, B<>C, C<>D,
    s.SetupMultiplePools(
        NewPoolSetup("TokenA", "TokenB", 0, 200, -20, 1),
        NewPoolSetup("TokenB", "TokenC", 0, 200, -2, 1),
        NewPoolSetup("TokenC", "TokenD", 0, 200, -2, 1),
        NewPoolSetup("TokenD", "TokenB", 0, 200, -2, 1),
    )
    route := [][]string{{"TokenD", "TokenC", "TokenB"},{"TokenC", "TokenD", "TokenB"}}
    s.aliceMultiHopSwaps(route, 100, math_utils.MustNewPrecDecFromStr("0.9"), false)
}
```

1. Two tokens, `TokenA` and `TokenD`, are funded to Alice’s account, and liquidity pools are set up for pairs `A<>B`, `B<>C`, `C<>D`, and `D<>B`.
2. Two routes are defined: `TokenD`, `TokenC`, `TokenB` and `TokenC`, `TokenD`, `TokenB`.
3. The first route failed but the second route succeeded. The second route mistakenly utilizes `TokenD` (instead of `TokenC`) due to the initial token mismatch, resulting in an incorrect swap.
4. This will result in getting more tokens than expected due to favorable pool rates, as shown in the test case where `1000000000 TokenD` gets `1000100000 TokenD`.

### Remediation

Add a check in `ValidateBasic` to ensure that all routes start with the same initial token.

### Patch

Fixed in PR #541.

© 2024 Otter Audits LLC. All Rights Reserved. 7/14
