---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - sector/dex
  - platform/cyfrin
  - has/github
  - severity/high
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[oracle-manipulation-resistance]]"
---
# Price manipulation during initial ps minting can cause user losses

- id: 64505
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


This bug report describes a problem where a malicious user can manipulate the prices of assets in a new instrument, causing a loss for honest users who provide liquidity. This is because the initial price used to calculate the first liquidity provider's deposit amount is based on the manipulated prices. To prevent this, the report suggests implementing a mechanism similar to Uniswap V2 where users can choose the asset and currency amounts during initial liquidity provision. The bug has been fixed in the Deriverse protocol with two commits. Cyfrin has verified the bug.

## Details

**Description:** When a new instrument is created and the pool is empty (`ps == 0`), the first liquidity provider's deposit amount is calculated using a price derived from `last_px`, `best_bid`, and `best_ask`. A malicious user can manipulate `best_bid` or `best_ask` by placing orders before the first LP provider, causing the first LP provider to deposit funds at an incorrect price, resulting in user fund loss.

Scenario:
1. A new instrument is created with `last_px = 1000`, representing a fair initial price.
2. An attacker places a very low ask order (e.g., price = 1) before any liquidity provider participates.
3. The first liquidity provider attempts to add liquidity, and the price is computed as `px_f64 = last_px.max(best_bid).min(best_ask)`, resulting in `px_f64 = 1000.max(0).min(1) = 1`, causing the LP provider to provide currency tokens based on this manipulated price.
4. Result: the liquidity provider ends up supplying significantly more asset tokens than intended based on the true fair-market price. later, the attacker can swap asset for currency at a more favorable price and extract value, causing a loss to the honest participant.

**Impact:** This may lead to user losses because the liquidity must be supplied at a price that has been manipulated.

**Recommended Mitigation:** A potential mitigation is to enable users to choose the asset and currency amounts during the initial liquidity provision, similar to the mechanism used in Uniswap V2.

**Deriverse:** Fixed in commit [66c878](https://github.com/deriverse/protocol-v1/commit/66c878370dc8041d6544b8fdee636102ce00fe8c), [cf0573](https://github.com/deriverse/protocol-v1/commit/cf0573fbec84bc4d5b7fa89dd0dad8cab1d01f85).

**Cyfrin:** Verified.
