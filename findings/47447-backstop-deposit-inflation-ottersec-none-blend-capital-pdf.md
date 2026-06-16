---
tags:
  - lang/rust
  - sector/lending
  - sector/nft-lending
  - platform/ottersec
  - severity/high
  - vuln/dos/frozen-funds
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/direct-drain
  - trigger/first-deposit
  - trigger/price-manipulation
  - novelty/variant
protocol: "[[Blend Capital]]"
auditors:
  - "[[Andreas Mantzoutas]]"
report: "https://www.script3.io/"
genome:
  - "[[frozen-funds]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[first-deposit]]"
  - "[[trigger/price-manipulation]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[integer-bounds]]"
  - "[[oracle-manipulation-resistance]]"
---
# Backstop Deposit Inflation

- id: 47447
- impact: HIGH
- protocol: [[Blend Capital]]
- reporter: Andreas Mantzoutas (OtterSec)
- source: https://www.script3.io/

## Summary


The vulnerability in this report involves the first depositor in the backstop pool. The attacker can manipulate the price of the share token by minting just one share and making a large donation of backstop tokens to the pool. This artificially inflates the calculated price of the share token. During the deposit process, subsequent depositors may see their share tokens rounding down to zero, resulting in loss of funds. The recommended solution is to implement thresholds and permanently lock a portion of the initial deposit, or restrict donations to prevent manipulation. The issue has been fixed in version 26698 by restricting donations.

## Details

## Vulnerability Analysis

The vulnerability involves the first depositor in backstop. This initial depositor may exploit the price of the share token. The attacker initiates the attack by calling `execute_deposit` to mint a single share. The attacker influences the share token’s price calculation by minting just one share.

```rust
> _ backstop/src/backstop/pool.rs
pub fn convert_to_shares(&self, tokens: i128) -> i128 {
    if self.shares == 0 {
        return tokens;
    }
    tokens
    .fixed_mul_floor(self.shares, self.tokens)
    .unwrap_optimized()
}
```

After minting a single share, the attacker executes a substantial donation of backstop tokens to the backstop pool using `execute_donate`. This combination of minting a single share and making a large donation of backstop tokens artificially inflates the calculated price of the share token. During the deposit process, subsequent depositors may observe their share tokens rounding down to zero, where the share token price is computed based on the product of the number of shares (self.shares) and the number of tokens (self.tokens). As indicated above, the `fixed_mul_floor` performs fixed-point multiplication with flooring.

The rounding down occurs when the computed number of shares falls below one, and the flooring operation adjusts it to zero. Consequently, depositors lose funds as their planned share allocation becomes zero, and the deposited funds fail to contribute to their share balance as anticipated.

## Remediation

Implement thresholds and permanently lock a portion of the initial deposit, or restrict donations, to prevent manipulation.

## Patch

Fixed in A6 26698 by restricting donations.

© 2024 Otter Audits LLC. All Rights Reserved. 10/22
