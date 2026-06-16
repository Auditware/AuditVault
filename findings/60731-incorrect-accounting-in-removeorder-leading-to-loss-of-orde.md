---
tags:
  - lang/solidity
  - platform/quantstamp
  - severity/high
  - sector/nft
protocol: "[[Talentir Token & Marketplace]]"
auditors:
  - "[[Zeeshan Meghji]]"
report: "https://certificate.quantstamp.com/full/talentir-token-marketplace/08aae35f-7537-45ef-ae98-0dc5c0e1abe1/index.html"
genome:
  - "[[wrong-condition]]"
  - "[[wrong-state]]"
  - "[[access-roles]]"
---
# Incorrect Accounting in `_removeOrder()` Leading to Loss of Orders

- id: 60731
- impact: HIGH
- protocol: [[Talentir Token & Marketplace]]
- reporter: Zeeshan Meghji (Quantstamp)
- source: https://certificate.quantstamp.com/full/talentir-token-marketplace/08aae35f-7537-45ef-ae98-0dc5c0e1abe1/index.html

## Summary


This bug report is about an issue in the TalentirMarketplaceV1 file. The function `_addOrder()` adds new orders to the front of a linked list, while the function `_removeOrder()` always removes the last element from the list without checking if it is the correct one. This can cause other orders to be deleted and lead to a deteriorated order book. The report recommends redesigning the use of the linked list to fix this issue.

## Details

**Update**
The Talentir team fixed the issue in commit 29e5bc9a49f3af07714752fc458398b1052e8459 by removing the specific order ID from the list.

**File(s) affected:**`TalentirMarketplaceV1`

**Description:** The function `TalentirMarketplaceV1._addOrder()` only ever appends new orders (in increasing order ID number) to the front of the linked list `markets[_tokenId][_side].orderList[_price]`.

```
markets[_tokenId][_side].orderList[_price].push(nextOrderId, true);
```

However, the function `TalentirMarketplaceV1._removeOrder()` always removes the last element/order from the linked list `markets[tokenId][side].orderList[price]` in `L378`, without confirming it being the to-be-deleted element:

```
markets[tokenId][side].orderList[price].pop(false);
```

This could lead to the loss of order IDs other than the desired one. While other "copies" of such deleted order IDs exist (`orders` and `userOrders`), the function `getBestOrder()` always takes the first inserted element of that linked list, which in turn is used when filling existing orders when creating a new one. Deleting and reading order IDs this way would lead to a deteriorated order book, where orders of other users may be (maliciously) removed from the order book.

**Exploit Scenario:** Suppose a user places two orders chronologically, A and B, that are with the same token, with the same price, and on the same side. If this user goes to cancel order B using the `cancelOrder()` function, order `A` will be canceled instead.

**Recommendation:** We recommend redesigning the use of the `orderList` linked list, i.e. such that function `_removeOrder()` traverses the list until it finds the matching ID.
