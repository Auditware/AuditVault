---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/dex
protocol: "[[GTE]]"
auditors:
  - "[[newspacexyz]]"
report: "https://code4rena.com/reports/2025-07-gte-spot-clob-and-router"
genome:
  - "[[griefing]]"
  - "[[permanent]]"
  - "[[fot-slippage]]"
---
# [H-02] Dust orders can block order posting

- id: 64870
- impact: HIGH
- protocol: [[GTE]]
- reporter: newspacexyz (Code4rena)
- source: https://code4rena.com/reports/2025-07-gte-spot-clob-and-router

## Summary


The bug report highlights an issue in the `clob/CLOB.sol` contract where maker orders can be reduced below the minimum limit without any checks. This can result in dust positions remaining in the order book, which can block new incoming orders. The report suggests adding a check to remove orders if the amount after matching is lower than the minimum limit. The impact of this bug is demonstrated in a Proof of Concept.

## Details



`clob/CLOB.sol` [# L807-L849](https://github.com/code-423n4/2025-07-gte-clob/blob/9f06332ebd4cfe2577d9eae81aeb58d3662ffccd/contracts/clob/CLOB.sol# L807-L849)

When matching incoming orders, maker orders can be reduced below the minimum limit without checks, resulting in dust positions remaining in the order book. These dust orders can block new incoming orders, as matching them may revert with a `ZeroCostTrade` error if the quote amount rounds down to zero.

### Description

When matching an incoming order, maker order’s amount can be set below `minLimitOrderAmountInBase`, as there is no min amount check:

[File: contracts/clob/CLOB.sol](https://github.com/code-423n4/2025-07-gte-clob/blob/9f06332ebd4cfe2577d9eae81aeb58d3662ffccd/contracts/clob/CLOB.sol# L833-L847)
```

833:@>       bool orderRemoved = matchData.baseDelta == matchedBase;
834:
835:         // Handle token accounting for maker.
836:         if (takerOrder.side == Side.BUY) {
837:             TransientMakerData.addQuoteToken(makerOrder.owner, matchData.quoteDelta);
838:
839:             if (!orderRemoved) ds.metadata().baseTokenOpenInterest -= matchData.baseDelta;
840:         } else {
841:             TransientMakerData.addBaseToken(makerOrder.owner, matchData.baseDelta);
842:
843:             if (!orderRemoved) ds.metadata().quoteTokenOpenInterest -= matchData.quoteDelta;
844:         }
845:
846:         if (orderRemoved) ds.removeOrderFromBook(makerOrder);
847:@>       else makerOrder.amount -= matchData.baseDelta;
```

* In L833, order is removed only when matched amount is equal to maker order’s amount
* In L847, maker order’s amount is decreased by matched amount. The result amount can be dust, as there is no min amount check done afterwards.

As such, maker order’s amount can be a dust amount (up to `lotSizeInBase` config).

This means there can be a dust position in the order book.

What happens if this dust order is matched to another incoming order?

[File: contracts/clob/CLOB.sol](https://github.com/code-423n4/2025-07-gte-clob/blob/9f06332ebd4cfe2577d9eae81aeb58d3662ffccd/contracts/clob/CLOB.sol# L819-L821)
```

819:             matchData.baseDelta = (matchedBase.min(takerOrder.amount) / lotSize) * lotSize;
820:             matchData.quoteDelta = ds.getQuoteTokenAmount(matchedPrice, matchData.baseDelta);
```

* In L819, `matchData.baseDelta` can be as small as `lotSize`, since `makeOrder.amount` can be down to `lotSize`
* In L820, `matchData.quoteDelta` can be zero due to rounddown:

[File: contracts/clob/types/Book.sol](https://github.com/code-423n4/2025-07-gte-clob/blob/9f06332ebd4cfe2577d9eae81aeb58d3662ffccd/contracts/clob/types/Book.sol# L471-L477)
```

471:     function getQuoteTokenAmount(Book storage self, uint256 price, uint256 baseAmount)
472:         internal
473:         view
474:         returns (uint256 quoteAmount)
475:     {
476:         return baseAmount * price / self.config().baseSize;
477:     }
```

If `matchData.quoteDelta` is 0, the trade(or order posting) will revert with `ZeroCostTrade` error:

[File: contracts/clob/CLOB.sol](https://github.com/code-423n4/2025-07-gte-clob/blob/9f06332ebd4cfe2577d9eae81aeb58d3662ffccd/contracts/clob/CLOB.sol# L439)
```

439: if (totalQuoteSent == 0 || totalBaseReceived == 0) revert ZeroCostTrade();
```

### Impact

Dust positions can block incoming orders. An example is shown in the POC.

### Recommended Mitigation Steps

Consider removing orders if the amount after matching is lower than `minLimitOrderAmountInBase`.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-07-gte-spot-clob-and-router/submissions/F-88)

---
