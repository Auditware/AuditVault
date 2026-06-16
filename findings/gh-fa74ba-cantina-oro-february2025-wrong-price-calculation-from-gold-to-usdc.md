---
tags:
  - blockchain/solana
  - lang/rust
  - platform/cantina
  - severity/high
  - vuln/arithmetic/decimal-mismatch
  - vuln/arithmetic/precision-loss
  - novelty/variant
  - misassumption/math-is-safe
  - fix/fix-arithmetic
  - sector/oracle
protocol: "[[Cantina Oro February2025]]"
auditors:
  - "[[FrankCastle]]"
genome:
  - "[[decimal-mismatch]]"
  - "[[precision-loss]]"
  - "[[defi/price-manipulation]]"
  - "[[variant]]"
  - "[[integer-bounds]]"
  - "[[pyth-oracle-completeness]]"
  - "[[token-decimal-normalization]]"
---
3.1.2
Wrong price calculation from Gold to USDC
Severity: Critical Risk
Context: (No context ﬁles were provided by the reviewer)
Description: In the mint_gold(), burn_gold(), buy() and sell() functions, the USDC amount required
or received is calculated based on these formulas:
// in buy() and mint_gold()
amount * price / 100 * (10000 + self.price.fee)
// in sell() and buy_gold()
amount * price / 100 * (10000 - self.price.fee)
These formulas are incorrect due to several issues:
1. They don't account for the Pyth price feed exponential value of XAU/USD.
2. They fail to handle the decimal differences between Gold token and USDC token properly.
3. They don't divide by price.fee's denominator (10000) after multiplication.
4. They divide ﬁrst and then multiply, which leads to precision loss.
Recommendation: The formulas should be corrected as follows (in pseudocode):
4

// in buy() and mint_gold()
- amount * price / 100 * (10000 + self.price.fee)
+ amount * price * (10000 + self.price.fee) * pow(10, mint_b.decimals - mint_a.decimals) * pow(10,
pyth_price_result?.exponent)
/ 10000
,→
// in sell() and buy_gold()
- amount * price / 100 * (10000 - self.price.fee)
+ amount * price * (10000 - self.price.fee) * pow(10,mint_b.decimals - mint_a.decimals) * pow(10,
pyth_price_result?.exponent)
/ 10000
,→
Oro: The formulas have been changed for multiple different commits (see for instance commit 7658daa7),
suggest to compare with current implementations.
Cantina Managed: Fix veriﬁed.
