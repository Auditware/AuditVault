---
tags:
  - lang/solidity
  - sector/lending
  - sector/perpetuals
  - sector/stable
  - platform/cantina
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
protocol: "[[Particle]]"
auditors:
  - "[[cccz]]"
report: "https://cdn.cantina.xyz/reports/cantina_competition_particle_feb2024.pdf"
genome:
  - "[[fee-calculation]]"
  - "[[variant]]"
  - "[[fee-theft]]"
  - "[[fee-accounting]]"
---
# openPosition should not charge fees on marginfrom or charge fees on marginTo as well 

- id: 40715
- impact: HIGH
- protocol: [[Particle]]
- reporter: cccz (Cantina)
- source: https://cdn.cantina.xyz/reports/cantina_competition_particle_feb2024.pdf

## Summary


The bug report discusses an issue with the calculation of fees in the openPosition function. The current code uses the sum of the marginFrom and amountFromBorrowed variables as the base for calculating the fee. However, it is stated that marginFrom should not be charged a fee because it is provided by the user and not borrowed from somewhere else. Additionally, users can bypass the fee by providing more marginTo, making marginFrom zero. This leads to overcharging of fees for most users. The recommendation is to either not charge fees on marginFrom or to also charge fees on marginTo. The bug has been mitigated by the protocol's design and server-side signature protection, but the severity has been reduced. The feeAmount calculation remains unchanged for consistency.

## Details

## Context
(No context files were provided by the reviewer)

## Description
In `openPosition`, `marginFrom + amountFromBorrowed` is used as the base for calculating the fee:

```javascript
if (cache.feeFactor > 0) {
    cache.feeAmount = ((params.marginFrom + cache.amountFromBorrowed) * cache.feeFactor) / Base.BASIS_POINT;
}
```

However, there are two reasons why `marginFrom` should not be fee charged:

1. `marginFrom` is provided by the user and not borrowed from somewhere else, so it should not be fee charged.
2. Most importantly, the user can bypass the `marginFrom` fee by supplying more `marginTo` to make `marginFrom` zero. 

For example, consider:
ETH:USDC = 3000, to make long ETH, the user needs to provide a `marginFrom` of 6000 USDC. However, since the protocol will charge fees on `marginFrom`, the user can first exchange the 6000 USDC to 2 ETH externally, and then provide 2 ETH as the `marginTo`, thus avoiding the protocol charging fees on the `marginFrom`. This actually overcharges most users.

## Recommendation
It is recommended to not charge fees on `marginFrom` in `openPosition`.

- Current calculation:
  ```javascript
  cache.feeAmount = ((params.marginFrom + cache.amountFromBorrowed) * cache.feeFactor) / Base.BASIS_POINT;
  ```
  
- Suggested modification:
  ```javascript
  cache.feeAmount = (cache.amountFromBorrowed * cache.feeFactor) / Base.BASIS_POINT;
  ```

Alternatively, to charge fees on `marginTo` as well.

## Particle
Mitigated. It's our protocol's design for applying the position fee to which part of the principal. Also, protected by the server-side signature, the borrower can't just overwrite the frontend to use `marginTo` instead of `marginFrom`. Hence, this significantly reduces the severity, and we keep this `feeAmount` calculation for consistency.
