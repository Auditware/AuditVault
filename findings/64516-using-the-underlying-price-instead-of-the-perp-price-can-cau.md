---
tags:
  - lang/rust
  - lang/solidity
  - sdk/anchor
  - platform/cyfrin
  - has/github
  - severity/high
  - sector/dex
  - sector/perpetuals
  - lang/anchor
protocol: "[[Deriverse]]"
auditors:
  - "[[RajKumar]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md"
genome:
  - "[[stale-price]]"
  - "[[indirect-loss]]"
  - "[[fot-slippage]]"
---
# Using the underlying price instead of the perp price can cause problems

- id: 64516
- impact: HIGH
- protocol: [[Deriverse]] Dex
- reporter: RajKumar (Cyfrin)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Cyfrin/2025-12-15-cyfrin-deriverse-dex-v2.0.md

## Summary


This bug report highlights an issue with the use of perp price in buy/sell operations and funding rate calculations. When calculating the perp value, the underlying price is currently being used, which can lead to incorrect values. This can have a high impact as it allows users to withdraw more funds than they should based on the actual perp price. To mitigate this issue, it is recommended to use the perp price instead of the underlying price. The bug has been fixed in the Deriverse protocol and verified by Cyfrin.

## Details

**Description:** Currently, we use the perp price only for buy/sell operations and for funding rate calculations. However, when calculating the perp value we rely on the underlying price:

Scenerio with perp withdrawal:
The mark price is 100k, and the index price is also 100k.
A user buys a 1 BTC perpetual contract at 100k with 10× leverage. The notional position is 1 BTC, and the user’s account balance becomes –90k.
Later, the index price increases to 120k, while the mark price remains unchanged.
At this point, the user is able to withdraw 18k, bringing their account balance to –108k.
However, the actual perp price is still 100k for 1 BTC. However, the user’s funds are –108k, and their position can only cover 100k

This issue arises because we are using the underlying price to calculate the perp value.

**Impact:** The impact is high, as it allows users to withdraw more funds than they should based on the actual perp price.

**Recommended Mitigation:** Consider using the perp price instead of the underlying price to mitigate this issue.

**Deriverse:** Fixed in commit [1ef948](https://github.com/deriverse/protocol-v1/commit/1ef948af18b47f3e502d0054d760212d4b6263f1).

**Cyfrin:** Verified.
