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
  - "[[volodya]]"
report: "https://code4rena.com/reports/2025-07-gte-spot-clob-and-router"
genome:
  - "[[frozen-funds]]"
  - "[[temporary]]"
  - "[[dos-resistance]]"
---
# [H-01] Order double-linked list is broken because order.prevOrderId is not persisted

- id: 64869
- impact: HIGH
- protocol: [[GTE]]
- reporter: volodya (Code4rena)
- source: https://code4rena.com/reports/2025-07-gte-spot-clob-and-router

## Summary


The bug report is about a problem in the code for a decentralized exchange called CLOB. The code is used to store and manage orders on the exchange. However, there is an issue with the way orders are linked together, which can cause problems when adding or removing orders from the exchange. This can potentially lead to a denial of service attack if the order book becomes full. This problem has been demonstrated by a proof of concept. 

## Details



* `clob/types/Book.sol` [# L275-L289](https://github.com/code-423n4/2025-07-gte-clob/blob/9f06332ebd4cfe2577d9eae81aeb58d3662ffccd/contracts/clob/types/Book.sol# L275-L289)
* `clob/types/Book.sol` [# L150-L154](https://github.com/code-423n4/2025-07-gte-clob/blob/9f06332ebd4cfe2577d9eae81aeb58d3662ffccd/contracts/clob/types/Book.sol# L150-L154)

`order.prevOrderId` is updated only in memory and not saved to storage, breaking the linked list. This causes order adding and removal issues, potentially leading to denial of service when the order book is full and the limit’s tailOrder becomes invalid.

### Description

Orders are stored as a double-linked list in the book.

However, this linking is broken as `order.prevOrderId` is not actually stored in EVM storage:

[File: contracts/clob/types/Book.sol](https://github.com/code-423n4/2025-07-gte-clob/blob/9f06332ebd4cfe2577d9eae81aeb58d3662ffccd/contracts/clob/types/Book.sol# L150-L154)
```

150:     function addOrderToBook(Book storage self, Order memory order) internal {
151:         Limit storage limit = _updateBookPostOrder(self, order);
152:
153:@>       _updateLimitPostOrder(self, limit, order);
154:     }
```

As we can see in the above code, linked list is updated in the end. And order is passed as memory type:

[File: contracts/clob/types/Book.sol](https://github.com/code-423n4/2025-07-gte-clob/blob/9f06332ebd4cfe2577d9eae81aeb58d3662ffccd/contracts/clob/types/Book.sol# L275-L289)
```

275:     function _updateLimitPostOrder(Book storage self, Limit storage limit, Order memory order) private {
276:         limit.numOrders++;
277:
278:         if (limit.headOrder.isNull()) {
279:             limit.headOrder = order.id;
280:             limit.tailOrder = order.id;
281:         } else {
282:             Order storage tailOrder = self.orders[limit.tailOrder];
283:             tailOrder.nextOrderId = order.id;
284:@>           order.prevOrderId = tailOrder.id;
285:             limit.tailOrder = order.id;
286:         }
287:
288:         emit LimitOrderCreated(BookEventNonce.inc(), order.id, order.price, order.amount, order.side);
289:     }
```

In L284, `order.prevOrderId` is updated. However, it is not stored in EVM storage because order is passed as memory in L275.

This completely breaks linked list in future operations. For example, when removing orders:

[File: contracts/clob/types/Book.sol](https://github.com/code-423n4/2025-07-gte-clob/blob/9f06332ebd4cfe2577d9eae81aeb58d3662ffccd/contracts/clob/types/Book.sol# L320-L327)
```

320:         OrderId prev = order.prevOrderId;
321:         OrderId next = order.nextOrderId;
322:
323:         if (!prev.isNull()) self.orders[prev].nextOrderId = next;
324:         else limit.headOrder = next;
325:
326:         if (!next.isNull()) self.orders[next].prevOrderId = prev;
327:         else limit.tailOrder = prev;
```

* `prev` will be null in L320 because `prevOrderId` was not persisted
* Thus, L323 will not be reached and L324 will always be reached. This means `prev` and `next` linkage will be broken
* In L327, `limit.tailOrder` will always be set to null if removed entry was the tail

### Impact

Order adding/removal will be affected.

Especially, when order book is full, CLOB can face DoS because limit tailOrder is set to empty order due to broken linked list.

This DoS is demonstrated by a POC.

[View detailed Proof of Concept](https://code4rena.com/audits/2025-07-gte-spot-clob-and-router/submissions/F-18)

---
