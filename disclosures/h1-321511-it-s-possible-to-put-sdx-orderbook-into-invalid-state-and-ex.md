---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2018-10-14
submitted: 2018-03-03T05:43:51.105Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/stellar|Stellar.org]]"
reporter: "nebolsin"
source: "https://hackerone.com/reports/321511"
title: "It's possible to put SDX orderbook into invalid state and execute trades at arbitrary price"
---
# It's possible to put SDX orderbook into invalid state and execute trades at arbitrary price

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** Stellar.org | **Disclosed:** 2018-10-14

- Report: [https://hackerone.com/reports/321511](https://hackerone.com/reports/321511)
- CWE: Business Logic Errors
- Submitted: 2018-03-03T05:43:51.105Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

stellar-core improperly handles creation of a buy offer which crosses existing sell offers (immediate execution) but can only be filled partially due to a trustline limit on the source account. This makes it possible to create a valid offer to buy any custom asset at higher price than existing sell offers. If counter is not native, it's also possible to create a sell offer lower than existing bids.

Steps to reproduce
-------------------
1. Choose any asset ABC with non-empty orderbook ABC-XLM
2. Create and fund account `H`, then set a trustline for ABC with limit 1
3. Choose arbitrary price `P` higher than existing best ask price `Pa`
4. Prepare the tx to sell `P` XLM for ABC  at price P and then increase the trustline limit to 2, sign it with H secret key and send to the network.

```
Transaction(
  source = H, 
  operations = [
    manageOffer(selling=XLM, buying=ABC, amount=P, price=P, offerId=0),
    changeTrust(asset=ABC, limit=2)
  ]
)
```

Account `H` will receive 1 ABC balance and an offer to sell `(P - Pa)` XLM for ABC will be created at price P.

Order book is now in invalid state and contains crossing offers, so `max(bidPrice) > min(askPrice)`. Next offer to sell ABC for XLM with price lower than P will claim our offer and result in a trade at  price P.

Examples
----------

F268790: Invalid bid created by exploiting this vulnerability. Account with a trustline for BUG asset (balance=500, limit=501) posted an offer to sell 100XLM to buy BUG at price 100 XLM per BUG. Result: account bought 1 BUG from the best ask at 9 XLM per BUG, and an offer to sell the remaining 91XLM at price 100 was saved into the orderbook.

F268791: Real case on a public network on MOBI-XLM traiding pair happened to some user (this is where I noticed the anomaly in trade history and started investigation). Relevant ledgers 16494494 - 16494512.

## Impact

Attacker could exploit this behaviour to mess up the orderbook, trade history and chart for any trading pair on Stellar Distributed Exchange. 

For example, it's possible (and very easy) to create a bot which will constantly create an bid at arbitrary high price P and immediately sell into this bid from another account, making last ticker price always equal P, despite that there're sell offers at a lower price. 

This will make OHLC chart analysis useless because high price will be P on every tick. It could also confuse other market participants by creating the impression that P is the fair price for the asset.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2018-03-06** @nebolsin: Hi Bartek,

Thanks for looking into it, let me know if you need more info or if there's any other way I can help. 

My suspect is [this place in stellar-core](https://github.com/stellar/stellar-core/blob/master/src/transactions/ManageOfferOpFrame.cpp#L373) where it probably lacks a check for `wheatReceived < maxWheatCanBuy`.
- **2018-03-06** @bart: @nebolsin I have forwarded your report to stellar-core team. Waiting for a timeline.
- **2018-03-06** @nicbar: I need to do some more digging on this one for the real fix. We have a protocol upgrade planned around the end of the month so we'll include the fix with those other changes (actual deployment timeline will depend on validator consensus). When I have the full fix I should be able to do proper severity assessment too which should help on getting validators to agree on the update. Thanks again for the report.
- **2018-04-04** @nebolsin: Hey guys, any updates on this vulnerability?
- **2018-04-04** @nicbar: yes!
We have a fix for it that will be rolled into the next protocol upgrade (we hope to get this adopted by the validator community later this month), as it's security related it will be merged when we are close to releasing the new version. 

We had to delay the release for a little bit due to another report that we're working on fixing.
- **2018-04-04** @nebolsin: Sounds great, look forward for the next release.
- **2018-07-13** @nebolsin: I hate to disturb you but I noticed [this commit](https://github.com/stellar/stellar-core/commit/c3c8fd2c95eae9daa8aab324d9ef3e07047aacc9) is now merged, and it looks like it contains the fix for vulnerability described here. Do you have any updates regarding this report?
- **2018-08-20** @nicbar: We've rolled out the fix in testnet; production rollout is scheduled next month.

In parallel, can you send us an XLM public key for the bounty?
- **2018-08-20** @nebolsin: Cool, I quickly tested a new release a few days ago and it looks great.

My address is GD35ZFMY3V5TAJKYLVBO63DYT76VCZABFBO22O4YT5RFEOEAR2M7OZL6.
- **Report Resolved**
- **Agreed On Going Public**
- **2018-09-14** @nicbar: we're going to publish a CAP that details the changes in the order book, I think we can disclose then (if we don't do it within 30 days, we'll let this auto-disclose). It's in line with the disclosure policy that we have in our security release notes (clock starts when a new version gets released).
- **Report Became Public**
