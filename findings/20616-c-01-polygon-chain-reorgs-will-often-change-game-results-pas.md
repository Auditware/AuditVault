---
tags:
  - lang/solidity
  - sector/gaming
  - sector/nft
  - sector/oracle
  - platform/pashov-audit-group
  - has/github
  - severity/high
  - trigger/reorg
protocol: "[[NFT Loots]]"
auditors:
  - "[[Pashov]]"
report: "https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-06-01-NFT Loots.md"
genome:
  - "[[wrong-condition]]"
  - "[[reorg]]"
  - "[[reward-theft]]"
  - "[[chainlink-round-completeness]]"
  - "[[reward-accounting]]"
  - "[[weak-randomness]]"
---
# [C-01] Polygon chain reorgs will often change game results

- id: 20616
- impact: HIGH
- protocol: [[NFT Loots]]
- reporter: Pashov (Pashov Audit Group)
- source: https://github.com/solodit/solodit_content/blob/main/reports/Pashov/2023-06-01-NFT Loots.md

## Summary


This bug report is about a constant, `REQUEST_CONFIRMATION` set to 3, in the `VRFv2Consumer` code. This value is used to tell the Chainlink VRF service how much blocks do you want to wait at a minimum before receiving randomness. The problem is that the application is expected to be launched on Polygon, where more than 5 block reorganizations a day with depth that is more than 3 blocks can occur. This means that the winner of a lootbox game might be changed, as the randomness will change when the transaction for requesting randomness from VRF is moved to a different block. The impact of this bug is high, as an already winning user will lose its reward, and the likelihood is also high. The recommendation is to use a larger `REQUEST_CONFIRMATIONS` value, suggested to be around 60, as the deepest chain reorganization had a depth of < 30 blocks in the past 7 days.

## Details

**Impact:**
High, as an already winning user will lose its reward

**Likelihood:**
High, as reorgs with > 3 depth happen often on Polygon

**Description**

The `REQUEST_CONFIRMATION` constant in `VRFv2Consumer` is set to 3. This value is used to tell the Chainlink VRF service how much blocks do you want to wait at a minimum before receiving randomness. The reason this value was added is because of chain reorganizations - when this event happens, blocks and transactions get reorganized and they change. This is a serious problem in this application as it is expected to be launched on Polygon (mentioned in `README.md`), but as we can see [here](https://polygonscan.com/blocks_forked) there are more than 5 block reorganizations a day with depth that is more than 3 blocks. In [this article](https://protos.com/polygon-hit-by-157-block-reorg-despite-hard-fork-to-reduce-reorgs/) we can even see a recent event where there was a 156 block depth chain reorg on Polygon. This means that it is possible that often the winner of a lootbox game to be changed since when your transaction for requesting randomness from VRF is moved to a different block then the randomness will change as well.

**Recommendations**

Use a larger `REQUEST_CONFIRMATIONS` value - I would suggest around 60 to be safe. For the past 7 days the deepest chain reorganization had a depth of < 30 blocks. While 60 might not fit your use case for the game, I think anything below 25-30 is potentially dangerous to the project's users and reputation.
