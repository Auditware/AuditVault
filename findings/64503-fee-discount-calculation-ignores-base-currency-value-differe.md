---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/dex
  - sector/governance
  - sector/launchpad
  - sector/stable
  - platform/cyfrin
  - has/github
  - severity/high
  - vuln/logic/fee-calculation
  - novelty/variant
  - misassumption/math-is-safe
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[fee-calculation]]"
  - "[[wrong-state]]"
  - "[[variant]]"
  - "[[fee-accounting]]"
---
# Fee Discount Calculation Ignores Base Currency Value Differences

- id: 64503
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


The fee discount calculation in `fees_deposit` is not taking into account the actual value differences between different base currencies. This means that users depositing low-value base currencies can receive the same discount as users depositing high-value currencies, even though there is a significant difference in their actual value. This issue becomes more problematic as the protocol expands to support additional base currencies in the future. To fix this, a value normalization factor will be stored for each base currency to represent its relative value. This bug has been fixed in the Deriverse protocol and verified by Cyfrin.

## Details

**Description:** The fee discount calculation in `fees_deposit` uses the raw token amount divided by decimal factor, without considering the actual value differences between base currencies. This can lead to unfair discount distribution when multiple base currencies with different values are supported.

In `fees_deposit`, the `prepayment` amount is calculated as:
```rust
let dec_factor = get_dec_factor(community_state.base_crncy[crncy_index].decs_count) as f64;
let prepayment = data.amount as f64 / dec_factor;
let fees_discount = community_state.fees_discount(prepayment);
```
The calculation only normalizes for decimal places but does not account for the actual value of different base currencies. For example:
- Depositing 1000 USDC (worth $1000)
- Depositing 1000 tokens of a low-value base currency (worth $0.001 each = $1 total)
- Deposit 1000 SOL would be quite impossible

Both would receive the same discount rate, despite a 1000x value difference.

This becomes more problematic as **the protocol expands to support additional base currencies through governance, as mentioned in the documentation. Different base currencies may have vastly different market values, but the current implementation treats them equally based on raw token count.**

From the documentation https://deriverse.gitbook.io/deriverse-v1/launchpad/launchpad#supported-base-currency:

```plaintext
Supported Base Currency
Current Support:

USDC: Circle USD Stablecoin

Future Expansion:

- Additional base currencies may be added through governance

- Multi-denomination support under consideration

- Community can propose new base currencies
```

**Impact:** Unfair discount distribution: Users depositing low-value base currencies can achieve the same discount thresholds as users depositing high-value currencies with much less actual value

**Recommended Mitigation:** Store a value normalization factor for each base currency that represents its relative value.

**Deriverse:** Fixed in commit [35602457](https://github.com/deriverse/protocol-v1/commit/35602457ebebccacca51749aad6270077724fb38).

**Cyfrin:** Verified.
