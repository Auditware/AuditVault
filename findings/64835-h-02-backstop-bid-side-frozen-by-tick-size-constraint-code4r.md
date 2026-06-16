---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
  - sector/launchpad
  - sector/lending
  - sector/perpetuals
protocol: "[[GTE]]"
auditors:
  - "[[dimulski]]"
report: "https://code4rena.com/reports/2025-08-gte-perps-and-launchpad"
genome:
  - "[[frozen-funds]]"
  - "[[locked-funds]]"
  - "[[liquidation-underwater]]"
---
# [H-02] Backstop bid-side frozen by tick-size constraint

- id: 64835
- impact: HIGH
- protocol: [[GTE]]
- reporter: dimulski (Code4rena)
- source: https://code4rena.com/reports/2025-08-gte-perps-and-launchpad

## Summary


The bug report discusses a vulnerability found in the code of a project called "GTE Perps". The vulnerability allows an attacker to manipulate the backstop orderbook, which is used for liquidations, and potentially disrupt the bidding process. This can result in backstop bids not being available for liquidations, which can cause problems for the project. The report recommends adding a one-tick buffer for post-only backstop orders as a mitigation step. 

## Details



* `perps/types/Market.sol` [# L136](https://github.com/code-423n4/2025-08-gte-perps/blob/f43e1eedb65e7e0327cfaf4d7608a37d85d2fae7/contracts/perps/types/Market.sol# L136)
* `perps/types/CLOBLib.sol` [# L277](https://github.com/code-423n4/2025-08-gte-perps/blob/f43e1eedb65e7e0327cfaf4d7608a37d85d2fae7/contracts/perps/types/CLOBLib.sol# L277)
* `perps/types/Book.sol` [# L90](https://github.com/code-423n4/2025-08-gte-perps/blob/f43e1eedb65e7e0327cfaf4d7608a37d85d2fae7/contracts/perps/types/Book.sol# L90)

Backstop orders are restricted to maker-only:
```

// contracts/perps/types/Market.sol:141
if (bookType == BookType.BACKSTOP && args.tif != TiF.MOC) revert InvalidBackstopOrder();
```

Maker orders (`TiF.MOC`) revert whenever they would immediately match:
```

// contracts/perps/types/CLOBLib.sol:246
if (ds.getBestAsk() <= newOrder.price) {
    if (tif == TiF.MOC) revert PostOnlyOrderWouldBeFilled();
}
```

Backstop prices must respect the book tick size:
```

// contracts/perps/types/Book.sol:86
if (price % StorageLib.loadBookSettings(self.config.asset).tickSize != 0) revert OrderPriceOutOfBounds();
```

Attack: The Buy side of the backstop orderbook an attacker place a SELL backstop with price = `tickSize`. That becomes `getBestAsk()`. Any future BUY backstop must choose a price `>= tickSize`; otherwise it’s below the tick step.

The first legal price equals the best ask, so `_executeBuyOrder` always detects crossing and reverts with `PostOnlyOrderWouldBeFilled`. Bids cannot be added until the attacker cancels or the order fills, effectively DoSing the bid side of the backstop book.

If no backstop bids exist, liquidations cannot rely on the backstop.

### Recommended mitigation steps

Add a one-tick buffer for post-only backstop orders.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-08-gte-perps-and-launchpad/submissions/F-292)

---
