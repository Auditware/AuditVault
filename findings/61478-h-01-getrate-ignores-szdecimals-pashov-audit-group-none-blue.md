---
tags:
  - lang/solidity
  - sector/infra
  - sector/lending
  - platform/pashov
  - has/github
  - severity/high
  - vuln/oracle/spot-price
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - misassumption/price-cannot-be-manipulated
  - fix/use-twap
  - trigger/price-manipulation
protocol: "[[Blueberry]]"
auditors:
  - "[[Pashov Audit Group]]"
report: "https://github.com/pashov/audits/blob/master/team/md/Blueberry-security-review_2025-04-30.md"
genome:
  - "[[spot-price]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[oracle-manipulation-resistance]]"
---
# [H-01] `getRate()` ignores `szDecimals`

- id: 61478
- impact: HIGH
- protocol: Blueberry_2025-04-30
- reporter: Pashov Audit Group
- source: https://github.com/pashov/audits/blob/master/team/md/[[Blueberry]]-security-review_2025-04-30.md

## Summary


This bug report identifies an issue with the getRate() function in the Hyperliquid protocol. The function retrieves a spot price from a precompile and scales it assuming a fixed number of decimals. However, this assumption does not always hold true for all assets in the protocol, as the number of meaningful decimals can vary. This results in incorrect prices being returned. To fix this issue, a recommendation is made to apply the correct number of decimals to the precompile result.

## Details


## Severity

**Impact:** High

**Likelihood:** Medium

## Description

The getRate() function retrieves a spot price from a precompile and scales it assuming a fixed USDC_SPOT_DECIMALS = 8:

```solidity
uint8 public constant USDC_SPOT_DECIMALS = 8;
uint256 public constant USDC_SPOT_SCALING = 10 ** (18 - USDC_SPOT_DECIMALS);

function getRate(uint32 spotMarket) public view override returns (uint256) {
    (bool success, bytes memory result) = SPOT_PX_PRECOMPILE_ADDRESS.staticcall(abi.encode(spotMarket));
    require(success, Errors.PRECOMPILE_CALL_FAILED());
    uint256 scaledRate = uint256(abi.decode(result, (uint64))) * USDC_SPOT_SCALING;
    return scaledRate;
}
```

However, in the Hyperliquid protocol, the raw spot price returned by the precompile does not always conform to 8 decimals. Instead, the number of meaningful price decimals is dynamically constrained by the szDecimals value of the asset involved:

For a spot token with szDecimals = 0, prices can go up to 8 decimals (e.g., 0.108 → 10845000)

For szDecimals = 2, the price can have at most 6 decimals (i.e., 8 - szDecimals)

Example:
Token: HFUN (szDecimals = 2)
Price: $37.07
Precompile returns: 37073000
Interpreted as 0.37073000 if assuming 8 decimals - which is incorrect
Should actually be treated as 37.073000 with only 6 decimals

`cast call 0x0000000000000000000000000000000000000808 0x0000000000000000000000000000000000000000000000000000000000000001 --rpc-url https://rpc.hyperliquid.xyz/evm`
--> RESULT: 37073000


## Recommendations

szDecimal should be applied to the precompile result:


```solidity
    function getRate(uint32 spotMarket, uint64 assetIndex ) public view override returns (uint256) {

AssetDetails memory details = $.assetDetails[assetIndex];

        (bool success, bytes memory result) = SPOT_PX_PRECOMPILE_ADDRESS.staticcall(abi.encode(spotMarket));
        require(success, Errors.PRECOMPILE_CALL_FAILED());
        uint256 scaledRate = uint256(abi.decode(result, (uint64))) * USDC_SPOT_SCALING* 10 ** (details.szDecimals) ;
        return scaledRate;

}
```
