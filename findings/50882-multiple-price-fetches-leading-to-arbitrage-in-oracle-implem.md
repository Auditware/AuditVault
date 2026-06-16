---
tags:
  - lang/solidity
  - platform/halborn
  - has/github
  - has/poc
  - severity/high
  - sector/oracle
protocol: "[[NLX]]"
auditors:
  - "[[Halborn]]"
report: "https://www.halborn.com/audits/coredao/nlx"
genome:
  - "[[missing-circuit-breaker]]"
  - "[[backrun]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[pyth-oracle-completeness]]"
---
# Multiple price fetches leading to arbitrage in oracle implementation

- id: 50882
- impact: HIGH
- protocol: [[NLX]]
- reporter: Halborn
- source: https://www.halborn.com/audits/coredao/nlx

## Summary


This bug report describes a vulnerability in the `_setPricesFromPriceFeeds` function of a contract. This function uses the Pyth network oracle to fetch and update price feeds. However, since the Pyth network updates prices every 400ms, it is possible to fetch different prices within the same transaction. This can be exploited to create arbitrage opportunities and adversely affect other users. Evidence has shown that two different prices were retrieved within the same transaction, indicating the vulnerability. The report recommends adding checks to prevent significant deviations in prices within short time frames, and the CoreDAO team has solved the issue by implementing these recommendations.

## Details

##### Description

In the current implementation of the `_setPricesFromPriceFeeds` function within the contract, there exists a vulnerability associated with fetching multiple prices from the Pyth network oracle in the same transaction. This vulnerability could potentially be exploited to conduct risk-free arbitrage, adversely affecting other users.

The contract uses the Pyth network oracle to fetch and update price feeds. The Pyth network updates price data every 400ms, making it highly dynamic. The `updatePriceFeeds` function is called with price update data (`pythUpdateData`), and for each call, the oracle may return a different price based on the most recent data submitted to the network. Since a single transaction can involve multiple calls to this function with different `pythUpdateData`, it's possible to fetch different prices within the same transaction.

This behavior can be exploited to create arbitrage opportunities by manipulating trade orders based on the fetched prices.

##### Proof of Concept

Evidence shows that it is feasible to submit and retrieve [two distinct prices](https://basescan.org/tx/0x0e0c22e5996ae58bbff806eba6d51e8fc773a3598ef0e0a359432e08f0b51b95) within the same transaction. Within this transaction, the `updatePriceFeeds` function is invoked using two separate prices. Following each invocation, the prevailing price is retrieved, and an event is broadcast that includes both the price and the timestamp. Clearly, the prices obtained from each price query differ.

```
Address 0x8250f4af4b972684f7b336503e2d6dfedeb1487a
Name    PriceFeedUpdate (index_topic_1 bytes32 id, uint64 publishTime, int64 price, uint64 conf)
Topics  0 0xd06a6b7f4918494b3719217d1802786c1f5112a6c1d88fe2cfec00b4584f6aec
        1 FF61491A931112DDF1BD8147CD1B641375F79F5825126D665480874634FD0ACE
Data    publishTime: 1706358779
        price: 226646416525
        conf: 115941591

Address 0xbf668dadb9cb8934468fcba6103fb42bb50f31ec
Topics  0 0x734558db0ee3a7f77fb28b877f9d617525904e6dad1559f727ec93aa06370866
Data    226646416525
        1706358779

Address 0x8250f4af4b972684f7b336503e2d6dfedeb1487a
Name    PriceFeedUpdate (index_topic_1 bytes32 id, uint64 publishTime, int64 price, uint64 conf)View Source
Topics  0 0xd06a6b7f4918494b3719217d1802786c1f5112a6c1d88fe2cfec00b4584f6aec
        1 FF61491A931112DDF1BD8147CD1B641375F79F5825126D665480874634FD0ACE
Data    publishTime: 1706358790
        price: 226649088828
        conf: 119840116

Address 0xbf668dadb9cb8934468fcba6103fb42bb50f31ec
Topics  0 0x734558db0ee3a7f77fb28b877f9d617525904e6dad1559f727ec93aa06370866
Data    226649088828
        1706358790
```

##### BVSS

[AO:A/AC:L/AX:L/C:M/I:C/A:N/D:N/Y:N/R:P/S:C (7.0)](/bvss?q=AO:A/AC:L/AX:L/C:M/I:C/A:N/D:N/Y:N/R:P/S:C)

##### Recommendation

Adding checks to ensure that the price used in trades does not deviate significantly within short time frames, particularly within the same block.

  

### Remediation Plan

**SOLVED :** The **CoreDAO team** solved the issue by implementing suggested recommendations.

##### Remediation Hash

<https://github.com/NLX-Protocol/nlx-synthetics/commit/a2f22a08fa824131d9f88fdff1e23684ad84b0db>
