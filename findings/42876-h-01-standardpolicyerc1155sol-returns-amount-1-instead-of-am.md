---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/nft
  - sector/nft-marketplace
protocol: "[[Blur]]"
auditors:
  - "[[0x52]]"
report: "https://code4rena.com/reports/2022-10-blur"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[access-roles]]"
---
# [H-01] `StandardPolicyERC1155.sol` returns `amount == 1` instead of `amount == order.amount`

- id: 42876
- impact: HIGH
- protocol: [[Blur]] Exchange
- reporter: 0x52 (Code4rena)
- source: https://code4rena.com/reports/2022-10-blur

## Summary


This bug report is about a problem with the `canMatchMakerAsk` and `canMatchMakerBid` functions in the `StandardPolicyERC1155.sol` contract. These functions only return 1 as the amount instead of the actual amount specified in the order. This leads to only 1 ERC1155 token being sent instead of the expected amount. This can result in buyers losing money without receiving all the tokens they paid for and sellers not receiving the correct payment for their tokens. The bug has been acknowledged by the sponsor and will not be fixed as the contract will not be deployed. The judge has assigned a high severity to this issue and has grouped it with other similar reports.

## Details


[StandardPolicyERC1155.sol#L12-L36](https://github.com/code-423n4/2022-10-blur/blob/main/contracts/matchingPolicies/StandardPolicyERC1155.sol#L12-L36)<br>
[BlurExchange.sol#L154-L161](https://github.com/code-423n4/2022-10-blur/blob/main/contracts/BlurExchange.sol#L154-L161)<br>

The `canMatchMakerAsk` and `canMatchMakerBid` functions in `StandardPolicyERC1155.sol` will only return 1 as the amount instead of the order.amount value. This value is then used in the `_executeTokenTransfer` call during the execution flow and leads to only 1 ERC1155 token being sent. A buyer matching an ERC1155 order wih amount > 1 would expect to receive amount of tokens if they pay the order's price. The seller, who might also expect more than 1 tokens to be sent, would have set the order's price to be for the amount of tokens and not just for 1 token.

The buyer would lose overspent ETH/WETH to the seller without receiving all tokens as specified in the order.

### Proof of Concept

[StandardPolicyERC1155.sol:canMatchMakerAsk](https://github.com/code-423n4/2022-10-blur/blob/main/contracts/matchingPolicies/StandardPolicyERC1155.sol#L12-L36)

```solidity
    function canMatchMakerAsk(Order calldata makerAsk, Order calldata takerBid)
        external
        pure
        override
        returns (
            bool,
            uint256,
            uint256,
            uint256,
            AssetType
        )
    {
        return (
            (makerAsk.side != takerBid.side) &&
            (makerAsk.paymentToken == takerBid.paymentToken) &&
            (makerAsk.collection == takerBid.collection) &&
            (makerAsk.tokenId == takerBid.tokenId) &&
            (makerAsk.matchingPolicy == takerBid.matchingPolicy) &&
            (makerAsk.price == takerBid.price),
            makerAsk.price,
            makerAsk.tokenId,
            1,
            AssetType.ERC1155
        );
    }
```

The code above shows that `canMatchMakerAsk` only returns 1 as the amount. `_executeTokenTransfer` will then [call the executionDelegate's `transferERC1155` function with only amount 1](https://github.com/code-423n4/2022-10-blur/blob/main/contracts/BlurExchange.sol#L540), transferring only 1 token to the buyer.

Test code added to `execution.test.ts`:

```typescript
    it('Only 1 ERC1155 received for order with amount > 1', async () => {
      await mockERC1155.mint(alice.address, tokenId, 10);
      sell = generateOrder(alice, {
        side: Side.Sell,
        tokenId,
        amount: 10,
        collection: mockERC1155.address,
        matchingPolicy: matchingPolicies.standardPolicyERC1155.address,
      });
      buy = generateOrder(bob, {
        side: Side.Buy,
        tokenId,
        amount: 10,
        collection: mockERC1155.address,
        matchingPolicy: matchingPolicies.standardPolicyERC1155.address,
      });
      sellInput = await sell.pack();
      buyInput = await buy.pack();

      await waitForTx(exchange.execute(sellInput, buyInput));

      // Buyer only receives 1 token
      expect(await mockERC1155.balanceOf(bob.address, tokenId)).to.be.equal(1);
      await checkBalances(
        aliceBalance,
        aliceBalanceWeth.add(priceMinusFee),
        bobBalance,
        bobBalanceWeth.sub(price),
        feeRecipientBalance,
        feeRecipientBalanceWeth.add(fee),
      );
    });
```

The test code above shows a sell order for an ERC1155 token with amount = 10 and a matching buy order. The `execute` function in `BlurExchange.sol` is called and the orders are matched but the buyer (bob) only receives 1 token instead of 10 despite paying the full price.

### Recommended Mitigation Steps

Policies used for ERC1155 tokens should return and consider the amount of tokens set for the order.

**[blur-io-toad (Blur) acknowledged and commented](https://github.com/code-423n4/2022-10-blur-findings/issues/666#issuecomment-1280075358):**
 > This was an oversight on my part for not putting this contract as out-of-scope. Our marketplace does not handle ERC1155 yet and so we haven't concluded what the matching critieria for those orders will be. This contract was mainly created to test ERC1155 transfers through the rest of the exchange, but shouldn't be deployed initially. When we are prepared to handle ERC1155 orders we will have to develop a new matching policy that determines the amount from the order parameters. Acknowledging that it's incorrect, but won't be making any changes as the contract won't be deployed.

**[Alex the Entreprenerd (Judge) commented](https://github.com/code-423n4/2022-10-blur-findings/issues/666#issuecomment-1292778487):**
 > The sponsor acknowledges the finding, and the report to be technically correct.<br>
> However the sponsor claims they won't be using the code in production.<br>
>
 > Because the code is technically incorrect and was in scope during the contest am going to assign High Severity.<br>
> However, I do understand that the contract will not be deployed.

**[Alex the Entreprenerd (Judge) commented](https://github.com/code-423n4/2022-10-blur-findings/issues/666#issuecomment-1306047646):**
 > Despite the fact that some reports mention a slightly different risk than this one (mismatching amounts), given https://github.com/code-423n4/org/issues/8 and given the consideration that these are substantially the same issue (the policy has a hardcoded amount), am going to group them under the same issue.
> 
> Because this report shows both sides of the issue, is well-written and has a coded Poc, am choosing to make it the selected report.



***
