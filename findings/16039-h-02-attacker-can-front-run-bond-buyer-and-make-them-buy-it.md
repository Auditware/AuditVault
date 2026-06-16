---
tags:
  - lang/solidity
  - platform/code4rena
  - has/github
  - has/poc
  - severity/high
  - impact/mev/frontrun
  - trigger/time-based/epoch-boundary
  - sector/dex
protocol: "[[Mute.Io]]"
auditors:
  - "[[0xA5DF]]"
report: "https://code4rena.com/reports/2023-03-mute"
genome:
  - "[[wrong-condition]]"
  - "[[frontrun]]"
  - "[[epoch-boundary]]"
  - "[[frontrun-exposure]]"
---
# [H-02] Attacker can front-run Bond buyer and make them buy it for a lower payout than expected

- id: 16039
- impact: HIGH
- protocol: [[Mute.Io]]
- reporter: 0xA5DF (Code4rena)
- source: https://code4rena.com/reports/2023-03-mute

## Summary


The MuteBond contract contains a feature which reduces the bond's payout for future purchases based on the amount of time that has passed since the epochStart. This can be exploited by an attacker to front-run a deposit/purchase transaction and lower the victim's payout. This can also happen when the owner changes the config in a way that lowers the price. The impact of this bug is that users end up buying bond for a lower payout than intended.

A proof of concept was given which showed that an attacker can make the buyer purchase a bond at a price lower by 32% than intended. The recommended mitigation steps are to add a min payout parameter so that users can specify the expected payout. The transaction should revert if the actual payout is lower than expected.

## Details


The `MuteBond` contract contains a feature in which after each purchase the `epochStart` increases by 5% of the time passed since `epochStart`, this (in most cases) lowers the bond's price (i.e. buyer gets less payout) for future purchases.

An attacker can exploit this feature to front-run a deposit/purchase tx and lower the victim's payout.

This can also happen by innocent users purchasing before the victim's tx is included in the blockchain.

Another (less likely) scenario in which this can happen is when the owner changes the config in a way that lowers the price (e.g. lowering max price, extending epoch duration), if the owner tx executes while a user's `deposit()` tx is in the mempool the user would end up with less payout than intended.

Side note: the term 'bond price' might be confusing since it refers to the payout the buyer gets divided by the value the buyer pays, so a higher price is actually in favor of the buyer.

### Impact

User ends up buying bond for a lower payout than intended.

### Proof of Concept

In the PoC below, an attacker manages to make the buyer purchase a bond at a price lower by 32% than intended.

File: `test/bonds.ts`

```typescript
  it('Front run PoC', async function () {
    // let price reach the max price
    await time.increase(60 * 60 * 24 * 7)

    // price when victim sends out the tx to the mempool
    var expectedPrice = await bondContract.bondPrice()

    const startPrice = new BigNumber(100).times(Math.pow(10,18))
    let minPurchasePayout = new BigNumber(Math.pow(10,16));
    // using dynamic price didn't work out so I'm using the lowest price
    var minPurchaseValue = minPurchasePayout.times(1e18).div(startPrice).plus(1);

    // attacker buys the lowest amount 20 times
    for(let i = 0; i< 20; i++){
      await bondContract.connect(buyer1).deposit(minPurchaseValue.toFixed(), buyer1.address, false)
    }

    var init_dmute = await dMuteToken.GetUnderlyingTokens(buyer1.address)
    let depositValue = new BigNumber(10).times(Math.pow(10,18)).toFixed();
    var price = await bondContract.connect(buyer1).deposit(depositValue, buyer1.address, false)
    var post_dmute = await dMuteToken.GetUnderlyingTokens(buyer1.address)

    var dmute_diff = new BigNumber(post_dmute.toString()).minus(init_dmute.toString());
    var actualPrice = dmute_diff.times(1e18).div(depositValue);

    var receipt = (await price.wait())
    // compare the expected price with the actual price
    // expected price = 200; actual price = 135.8; meaning actual price is ~68% of expected price
    console.log({expectedPrice, actualPrice:actualPrice.toString()});
  })
```

### Recommended Mitigation Steps

Add a min payout parameter so that users can specify the expected payout. The tx should revert if the actual payout is lower than expected.

**[mattt21 (Mute Switch) confirmed](https://github.com/code-423n4/2023-03-mute-findings/issues/24#issuecomment-1499249679)**



***
