---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/oracle
  - platform/quantstamp
  - severity/high
  - vuln/oracle/stale-price
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - fix/add-check
protocol: "[[Altr]]"
auditors:
  - "[[Roman Rohleder]]"
report: "https://certificate.quantstamp.com/full/altr/b6241933-b256-42d2-bb46-acb54a26e560/index.html"
genome:
  - "[[stale-price]]"
  - "[[defi/price-manipulation]]"
  - "[[known-pattern]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Additional Risks for Lenders Due to Lack of Checks on Oracle Output

- id: 60244
- impact: HIGH
- protocol: [[Altr]]
- reporter: Roman Rohleder (Quantstamp)
- source: https://certificate.quantstamp.com/full/altr/b6241933-b256-42d2-bb46-acb54a26e560/index.html

## Summary


This bug report addresses an issue with the `getValuation()` function in the `PriceIndex` contract. The function returns a `Valuation` struct, but it is missing important checks for the `ltv` and `timestamp` fields. This could lead to borrowed amounts exceeding the collateral value and outdated price data being used, resulting in potential financial losses for borrowers and lenders. The report recommends adding checks for these fields in the `requestLoan()` function and also double-checking the oracle in the `acceptLoan()` function. The bug has been marked as fixed by the client and the fix can be found in the code.

## Details

**Update**
Marked as "Fixed" by the client. Addressed in: `4d1ea9504fefba78fac5d979b94c2b9035bd607b`and `c3ecf51b5a8c09508c27855cc6fc05c8cd8efe1f`.

The fix introduces a `VALUATION_EXPIRY` variable that constrains the oracle value to not be older than 150 days. Oracle prices are updated [on a quarterly basis](https://docs.lucidao.com/dapps/altr-lending/core-concepts/price-index-oracle-committee). As these aspects of the protocol are clearly documented, we deem the check to be sufficient.

**Description:** The `getValuation()` of the `PriceIndex` contract is used to valuate a given NFT. The function returns a `Valuation` struct, which contains the fields `timestamp`, `price` and `ltv`.

However, that struct is missing crucial sanity checks regarding its values:

**1. Missing check that `Valuation.ltv <= 100`**

The actually borrowed amount needs to satisfy the following require-statement:

```
require(_amount <= (valuation.price * valuation.ltv) / 100, "Lending: amount greater than max borrow");
```

If `valuation.ltv` reaches values higher than `100`, the resulting expression would be bigger than `valuation.price`. This would allow borrow amounts higher than the actual collateral value, where an unknowing lender may accept the loan and in the worst case remain with the overpaid NFT.

**2. Missing check that the price data is sufficiently fresh**

The `timestamp` field is never checked to be within a reasonable freshness threshold, which could lead to stale valuation prices and therefore to potentially gross over-/undervaluations and either costing the borrower or the lender unnecessary funds.

**3. The `acceptLoan()` function is not double-checking the oracle**

Currently, when accepting a loan, the loan request's collateral is not double-checked on-chain by the lender. Given that a loan request with a sufficiently high deadline could be arbitrarily old, the oracle should again be consulted to protect lenders from possibly accepting underwater loans.

**Recommendation:** Add a freshness check on the `timestamp` and sanity check on the `ltv` value of the returned struct in the `requestLoan()` function. Furthermore, add the same oracle check to the `acceptLoan()` function.
