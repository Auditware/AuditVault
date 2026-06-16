---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/stable
  - sector/token
protocol: "[[Rubicon]]"
auditors:
  - "[[popular00]]"
report: "https://code4rena.com/reports/2023-04-rubicon"
genome:
  - "[[frozen-funds]]"
  - "[[permanent]]"
  - "[[dos-resistance]]"
  - "[[liquidation-underwater]]"
---
# [H-12] DOS of market operations with malicious offers

- id: 48951
- impact: HIGH
- protocol: [[Rubicon]]
- reporter: popular00 (Code4rena)
- source: https://code4rena.com/reports/2023-04-rubicon

## Summary


The Rubicon market has a bug that allows for a denial of service (DOS) attack. This happens when a user creates an order with a zero address as the owner and recipient. This order will be unfillable and will be the first one looked at when filling orders. This means that all subsequent transactions will fail, causing a DOS attack. This bug also affects the Position contract, which could lead to large losses for users. To fix this bug, the contract should not allow zero addresses to be used as owner or recipient. Additionally, the contract should handle unfillable orders by moving on to the next available order. This bug has been confirmed and its severity has been increased to High.

## Details


<https://github.com/code-423n4/2023-04-rubicon/blob/511636d889742296a54392875a35e4c0c4727bb7/contracts/RubiconMarket.sol#L1079> <br><https://github.com/code-423n4/2023-04-rubicon/blob/511636d889742296a54392875a35e4c0c4727bb7/contracts/RubiconMarket.sol#L1039>

The Rubicon market has two functions that are interesting: `buyAllAmount` and `sellAllAmount`. These functions are responsible for using up offers until the entire amount is bought or sold. The contract stores offers in a sorted linked list, each with its unique id, and sorted according to the price. This ensures that the head of the linked list has the best price, or the best offer for either sell or buy. This head is referenced in the code by the mapping `_best[address][address]` and further worse, offers can be navigated to by calling `best.next`, similar to a linked list navigation.

When `buyAllAmount` is called, a `while loop` is ran, and the best offer is taken out in each iteration using the function `getBestOffer()` similar to the snippet below:

```solidity
while (buy_amt > 0) {
            //Meanwhile there is amount to buy
            offerId = getBestOffer(buy_gem, pay_gem); //Get the best offer for the token pair
            require(offerId != 0, "offerId == 0");
```

The offers are then filled one after the other. However, if an offer is unfillable, or reverts, then the whole transaction reverts. This breaks the functionality of the `buyAllAmount` function and creates a DOS attack vector.

The standard openzeppelin implementation of the ERC20 token does not support transfers to the zero address. If a transaction tries to send tokens to 0 address, it reverts with 'ERC20: transfer to the zero address'. Thus, if an offer is created where the receiver of the payment is zero address, that offer can be unfillable. If this offer is created such that it is the best possible price, then this offer will exist at the head of the linked list in the `_best` variable and thus will be the first offer looked into. Since this offer is unfillable, the entire transaction will revert.

When creating an offer, the user can specify two addresses, the owner address and the recipient address. The contract does not sanitize these addresses and even accepts '0 address' in these fields. These are also the addresses where the payment token is sent when the order is filled.

Thus, a malicious user can create a buy/sell order of a small volume but at a very good price. They can set both the owner and the recipient to '0' when calling `offer()`. This will create a lucrative unfillable order which will always be called on first. This will lead to all transactions reverting due to this single unfillable offer.

The impact is even more pronounced for the `Position.sol` contract. Unlike normal users, this contract does not have the ability to select offers by id, and is only filled using `buyAllAmount` or `sellAllAmount`. A DOS attack, as described above, will break the functionality of the two mentioned functions and break the whole Position contract, as a result. This can lead to large losses where users are unable to unwind positions before liquidations.

This also has a secondary impact of blocking the creation of future orders. As can be seen [here](https://github.com/code-423n4/2023-04-rubicon/blob/511636d889742296a54392875a35e4c0c4727bb7/contracts/RubiconMarket.sol#L1273-L1341), in the `_matcho` function, when new offers are created they are first matched with existing offers in the same range.  If there is still a balance remaining, a new offer is created. Now if the existing offers are such unfillable orders, it would also block the creation of further new orders, causing another functionality DOS.

### Proof of Concept

The POC shows that if the recipient and owner addresses are both set to '0', the order cannot be filed. This order will exist in the linked list sorted by price and thus will be the first order to be filled.

First, change the code in `deployRubiconProtocolFixture()` where the orders are created [here](https://github.com/code-423n4/2023-04-rubicon/blob/511636d889742296a54392875a35e4c0c4727bb7/test/hardhat-tests/ProtocolDeployment.ts#L165-L171) to the following order:

```javascript
await rubiconMarket.functions[
            "offer(uint256,address,uint256,address,address,address)"
        ](
            parseUnits("100"),
            testCoin.address,
            parseUnits("110", 6),
            testStableCoin.address,
            ethers.constants.AddressZero,
            ethers.constants.AddressZero,
            { from: owner.address }
        )
```

This creates an unfillable order. Now try running the provided test in "can take an offer with 0 makerFee" by using the command: `hardhat test --grep "0 makerFee"`.

This test fails with 'ERC20: transfer to the zero address' error, since the order is unfillable. The test body is also copied here as reference:

```javascript
it("can take an offer with 0 makerFee", async function () {
                const { rubiconMarket, testCoin, owner } = await loadFixture(
                    deployRubiconProtocolFixture
                )
                const balanceBefore = await testCoin.balanceOf(owner.address)
                // in TEST
                const quantity = parseUnits("14")

                // amount that should be received with fee deducted (only Protocol fee!)
                const quantityAfterFee = await rubiconMarket.calcAmountAfterFee(
                    quantity
                )

                // buying TEST with USDCT
                await rubiconMarket.buy(2, quantity)
                // saving new balance state
                const balanceAfter = await testCoin.balanceOf(owner.address)

                // validating that owner received proper amount with ONLY protocol fee charged
                expect(balanceAfter.sub(balanceBefore)).to.be.equal(
                    quantityAfterFee
                )
            })
```

This shows unfillable orders can be created. If this order exists at the top, it will revert calls from the `Position.sol` contract.

### Tools Used

Hardhat

### Recommended Mitigation Steps

This requires multiple mitigation steps:

1.  Do not allow '0 address' as owner. This can be enforced with a `require` statement in the `offer()` function in `SimpleMarket` contract.
2.  Unfillable orders can still be created by setting recipient to blacklisted addresses, for tokens like USDT. To navigate this, in the `while loop` in `buyAllAmount`, include error handling with try-catch blocks to use the next offer, as the current offer is unfillable.

**[daoio (Rubicon) confirmed](https://github.com/code-423n4/2023-04-rubicon-findings/issues/644#issuecomment-1534560502)**

**[HickupHH3 (judge) commented](https://github.com/code-423n4/2023-04-rubicon-findings/issues/644#issuecomment-1569880769):**
 > > The impact is even more pronounced for the `Position.sol` contract. Unlike normal users, this contract does not have the ability to select offers by id, and is only filled using `buyAllAmount` or `sellAllAmount`. A DOS attack as described above will break the functionality of the two mentioned functions, and thus break the whole Position contract as a result. This can lead to large losses where users are unable to unwind positions before liquidations.
> 
> > This also has a secondary impact of blocking the creation of future orders. As can be seen [here](https://github.com/code-423n4/2023-04-rubicon/blob/511636d889742296a54392875a35e4c0c4727bb7/contracts/RubiconMarket.sol#L1273-L1341), in the _matcho function, when new offers are created, they are first matched with existing offers in the same range, and if there is still a balance remaining, a new offer is created. Now if the existing offers are such unfillable orders, it would also block the creation of further new orders, causing another functionality DOS.
> 
> Impact was well described and explained. I consider this to be medium severity though, because it's on L2s where the mainly supported tokens do not revert on null address (unless proven otherwise).
> 
> Satisfactory: has to be similar to best report in impact description (key word I'm looking for is DoSing the Position via `buyAllAmount()`/`sellAllAmount()`).
> 
> 50%: Mentions DoS in some capacity / loss of user funds.
> 
> 25%: Only mention zero address check with no / little impact description.
> 
> After a brief consultation, I've come to the following conclusion over non-standard ERC20 implementations:
> - No return of `bool`/returning false: Excluded because it's been caught by the 4naly3er.
> - FoT/Rebasing: Isolated impact, doesn't affect trades of other tokens.
> - Revert on zero value: Low, isolated impact, doesn't affect trades of other tokens.
> - Revert on null address: Medium, as a substantial number of ERC20 tokens inherit OZ's implementation that has this check, allowing for DoS.

**[HickupHH3 (judge) decreased severity to Medium](https://github.com/code-423n4/2023-04-rubicon-findings/issues/644#issuecomment-1574611746)**

**[carrotsmuggler (warden) commented](https://github.com/code-423n4/2023-04-rubicon-findings/issues/644#issuecomment-1591874360):**
 > >Impact was well described and explained. I consider this to be medium severity though, because it's on L2s where the mainly supported tokens do not revert on null address (unless proven otherwise).
> 
> According to uniswap [statistics](https://info.uniswap.org/#/arbitrum/), the top 8 tokens by volume are listed below, and their contracts have been evaluated. For all these tokens, transfers to '0 address' results in a revert.
> 
> |Token|Address|
> |-|-|
> |USDT|0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9|
> |USDC|0xaf88d065e77c8cC2239327C5EDb3A432268e5831|
> |weth|0x82aF49447D8a07e3bd95BD0d56f35241523fBab1|
> |wbtc|0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f|
> |arb|0x912CE59144191C1204E64559FE8253a0e49E6548|
> |dai|0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1|
> |bridged usdc|0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8|
> |GMX|0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a|
> 
> Every token (except DAI) follows the open-zeppelin standard and has a require block in their `_transfer` function.
> 
> ```solidity
> require(_sender != address(0), "BaseToken: transfer from the zero address");
> require(_recipient != address(0), "BaseToken: transfer to the zero address");
> ```
> DAI doesn't follow the standard, but has a statement which behaves in a similar manner.
> 
> Since the vast majority (97%+) of the uniswap transactions involve at least one of these tokens, it is safe to assume that **most** transactions would be affected by this bug.
> 
> Since the severity is high (complete breaking of Position contract), and the likelihood is high (97%+ affected volume), the severity of this bug should be upgraded to High.

**[HickupHH3 (judge) increased severity to High and commented](https://github.com/code-423n4/2023-04-rubicon-findings/issues/644#issuecomment-1592175191):**
 > Justified.

***
