---
tags:
  - lang/rust
  - platform/auditware
  - severity/high
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
  - sector/nft
protocol: "[[Rarible]]"
auditors:
  - "[[Auditware]]"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[missing-close-constraint]]"
---
# **AW-C-01: Loss of Funds due to Premature Closure of Partially-filled Orders** {#aw-c-01:-loss-of-funds-due-to-premature-closure-of-partially-filled-orders}

**Severity:** *Critical*							

**Code:**

* [rarible\_marketplace/src/instructions/order/fill.rs\#L59](https://github.com/rarible/protocol-contracts-svm-private/blob/60eeaad48d436a064c96ccb8168dbea3eb57c4b8/programs/rarible_marketplace/src/instructions/order/fill.rs#L59)

**Description:**  
During the audit it was found that an order account on the **rarible\_marketplace** program can be prematurely closed, leading to loss of user funds.

Using [BidNFT](https://github.com/rarible/protocol-contracts-svm-private/blob/60eeaad48d436a064c96ccb8168dbea3eb57c4b8/programs/rarible_marketplace/src/instructions/order/bid.rs#L73-L73) a user (maker) can create a buy order in the marketplace, which initiates a token transfer to the Order account [order\_payment\_ta](https://github.com/rarible/protocol-contracts-svm-private/blob/60eeaad48d436a064c96ccb8168dbea3eb57c4b8/programs/rarible_marketplace/src/instructions/order/bid.rs#L57-L57).

On [FillOrder](https://github.com/rarible/protocol-contracts-svm-private/blob/60eeaad48d436a064c96ccb8168dbea3eb57c4b8/programs/rarible_marketplace/src/instructions/order/fill.rs#L36-L36) a taker can then fulfill the placed order. In intended functionality, a taker can perform a partial fill, in which the order size is reduced by the amount filled, but the order should remain active until its size reaches zero or is explicitly canceled (intended to allow the taker to fill the remaining portion later).

However, it was found that due to the [close constraint](https://github.com/rarible/protocol-contracts-svm-private/blob/60eeaad48d436a064c96ccb8168dbea3eb57c4b8/programs/rarible_marketplace/src/instructions/order/fill.rs#L59) used on **FillOrder**, what actually happens on a partially filled order is an automatic closure of the order account when the transaction ends, meaning that the NFTs remain under the **order\_payment\_ta** account but become inaccessible to the user, resulting in the user losing the unfilled portion.

**Recommendations:**

* Since the logic in the **FillOrder** handler seems to be designed to explicitly handle partial fills, simply remove the `close = maker` constraint from the account attribute and instead use the remaining existing functionality to close the account programmatically when the condition `new_size == 0` occurs.
