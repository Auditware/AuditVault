---
tags:
  - lang/solidity
  - sector/farm
  - sector/nft
  - sector/nft-marketplace
  - platform/quantstamp
  - severity/high
  - novelty/variant
protocol: "[[Talentir Token & Marketplace]]"
auditors:
  - "[[Zeeshan Meghji]]"
report: "https://certificate.quantstamp.com/full/talentir-token-marketplace/08aae35f-7537-45ef-ae98-0dc5c0e1abe1/index.html"
genome:
  - "[[frozen-funds]]"
  - "[[variant]]"
  - "[[locked-funds]]"
  - "[[dos-resistance]]"
  - "[[royalty-edge-cases]]"
---
# Denial of Service Through Expensive ETH Receiver

- id: 60732
- impact: HIGH
- protocol: [[Talentir Token & Marketplace]]
- reporter: Zeeshan Meghji (Quantstamp)
- source: https://certificate.quantstamp.com/full/talentir-token-marketplace/08aae35f-7537-45ef-ae98-0dc5c0e1abe1/index.html

## Summary


This report discusses an exploit found in the `TalentirMarketplaceV1` contract, which allows a malicious seller to cause subsequent buy transactions to revert. This is done by placing a very cheap sell order and then using the contract's fallback function to expend the transaction's gas, preventing it from completing. This exploit can also be performed on the buy side by offering a high price and implementing a malicious ERC-1155 receiver function. The report recommends implementing the withdrawal pattern, which would prevent the exploit by not returning the native currency to the seller when the buy order is executed. The same pattern should also be implemented for withdrawing NFTs to prevent the exploit on the buy side. 

## Details

**Update**
PR-37 implements The withdrawal pattern for both the native cryptocurrency (e.g. ETH) and Talentir ERC-1155 tokens.

**File(s) affected:**`TalentirMarketplaceV1`

**Description:** A malicious seller can submit a sell order which causes a revert on any subsequent buy transaction. The attack is made possible by two components. Firstly, the addition of a very cheap sell order guarantees its execution the next time a user submits a buy order. Secondly, when the seller receives ETH, the fallback function in their contract can be used to expend the transaction's gas such that it does not have enough to complete the order.

The `TalentirMarketplaceV1` allows users to either buy Talentir tokens with the chain's native currency, such as ETH or sell Talentir tokens in exchange for the chain's native currency. If a user submits a buy order, `TalentirMarketplaceV1` first tries to find the cheapest sell order to fill the buy order with. Thus, if a malicious seller is able to submit a sell order with the lowest price, this order is always guaranteed to be used to fill the next order. This can be seen in the function which is used to retrieve the appropriate sell order:

```
function getBestOrder(uint256 _tokenId, Side _side) public view returns (uint256, uint256) {
    uint256 price = _side == Side.BUY
        ? markets[_tokenId][_side].priceTree.last()
        : markets[_tokenId][_side].priceTree.first();
    uint256 bestOrderId;
    (, bestOrderId, ) = markets[_tokenId][_side].orderList[price].getNode(0);
    return (bestOrderId, price);
}
```

When the order actually executes, ETH (or another native coin) is sent to the seller through a low-level `call()`. According to [EIP-150](https://eips.ethereum.org/EIPS/eip-150), by default `63/64` of the remaining gas can be used by default in a low-level call. Several actions happen after this call, including the emission of an event and ETH transfers to other addresses. If the `call()` to the seller expends too much gas, then these other actions will fail as there is not enough gas left to execute them:

```
function _executeOrder(
    address _sender,
    uint256 _orderId,
    uint256 _quantity
) internal returns (uint256 ethQuantity) {
    ...
    (locals.success, ) = locals.seller.call{value: locals.payToSeller}("");
    (locals.success, ) = locals.royaltiesReceiver.call{value: locals.royalties}("");
    (locals.success, ) = talentirFeeWallet.call{value: locals.talentirFee}("");

    emit OrderExecuted(
    ...
}
```

By placing a very cheap sell order which would invoke an expensive fallback function, the malicious seller is able to stop the marketplace from functioning for that `tokenId`. All subsequent buy orders would revert. Subsequent sell orders would not revert but would never get executed due to the buy orders reverting.

Note that the same exploit is also possible to perform on the buy side, by offering a high price and then implementing a malicious ERC-1155 receiver function.

**Exploit Scenario:**

1.   Suppose we have a `TalentirMarketplaceV1` contract with no orders yet.
2.   An attacker creates an attack contract with the following functions and transfers `1` Talentir token to it:
    1.   `placeCheapSellOrder()`: Call `TalentirMarketplaceV1.makeSellOrder()` to place a sell order at a very low price.
    2.   `fallback()`: Has an infinite loop of expensive operations.

3.   The attacker calls `placeCheapSellOrder()` on the attack contract.
4.   A user called `user_1` , places a normal sell order.
5.   Another user called `user_2` places a buy order which matches the sell order placed by `user_1`. 
    1.   The hacker's sell order is executed first, causing a revert due to the transaction running out of gas.

**Recommendation:** Do not return the ETH (or other native currency) to the seller when the corresponding buy order is placed and executed. Instead, add a function to the marketplace contract which allows the seller to retrieve the proceeds from the sale. This would be an implementation of the [withdrawal](https://www.tutorialspoint.com/solidity/solidity_withdrawal_pattern.htm) pattern.

The same pattern should be implemented for withdrawing the NFTs since the same exploit is possible on the buy side.
