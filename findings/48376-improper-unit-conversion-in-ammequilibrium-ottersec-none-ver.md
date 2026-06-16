---
tags:
  - lang/solidity
  - platform/ottersec
  - severity/high
  - sector/dex
protocol: "[[Vertex]]"
auditors:
  - "[[Shiva Shankar]]"
report: "https://vertexprotocol.io/"
genome:
  - "[[decimal-mismatch]]"
  - "[[direct-drain]]"
  - "[[fot-slippage]]"
---
# Improper Unit Conversion In AmmEquilibrium

- id: 48376
- impact: HIGH
- protocol: [[Vertex]] Protocol
- reporter: Shiva Shankar (OtterSec)
- source: https://vertexprotocol.io/

## Summary


The bug report is about a mistake in a code that could cause problems in a program. Specifically, in a function called "ammEquilibrium", the wrong function was used which caused a value to be greatly reduced. This could potentially be exploited by an attacker to manipulate the program and make a profit. The suggested fix is to change the function call to the correct one. This fix has been implemented in a new version of the program.

## Details

## Summary of ammEquilibrium Issue

In the `ammEquilibrium` function, `toInt` was used instead of `fromInt`.

## Affected Code

**File:** `contracts/libraries/MathHelper.sol`

```solidity
function ammEquilibrium(
    int256 baseX18,
    int256 quoteX18,
    int256 priceX18
) internal pure returns (int256, int256) {
    if (baseX18 == 0 && quoteX18 == 0) {
        return (0, 0);
    }
    int256 k = baseX18.toInt() * quoteX18.toInt();
    // base * price * base == k
    // base = sqrt(k / price);
    int256 base = (MathHelper.sqrt(k) * 1e9) / MathHelper.sqrt(priceX18);
    // TODO: this can cause a divide by zero
    int256 quote = k / base;
    return (base.fromInt(), quote.toInt());
}
```

## Explanation

In `PRBMath`:
1. **fromInt** - adds 1e18 precision to integers (multiplication by 1e18).
2. **toInt** - removes 1e18 decimal units from integers (division by 1e18).

The current implementation incorrectly divides the quote value by 1e18, which significantly reduces its value. Given that the values returned by this function are sensitive, an attacker could exploit this vulnerability to manipulate the protocol for illicit profit.

## Remediation

Change the function call to `fromInt`.

## Patch

The function call has been updated to `fromInt`. This fix was implemented in pull request #116.
