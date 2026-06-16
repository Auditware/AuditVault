---
tags:
  - lang/solidity
  - sector/lending
  - sector/oracle
  - platform/openzeppelin
  - has/github
  - severity/high
  - vuln/oracle/stale-price
  - novelty/known-pattern
  - misassumption/oracle-is-reliable
  - fix/add-check
protocol: "[[Compound]]"
auditors:
  - "[[OpenZeppelin]]"
report: "https://blog.openzeppelin.com/compound-open-oracle-audit/"
genome:
  - "[[stale-price]]"
  - "[[known-pattern]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[oracle-freshness]]"
---
# [H01] Inconsistencies in stored data may lead to incorrect median price

- id: 11553
- impact: HIGH
- protocol: [[Compound]]
- reporter: OpenZeppelin
- source: https://blog.openzeppelin.com/compound-open-oracle-audit/

## Summary


This bug report is about the `DelFiPrice` contract, which is intended to store the median price for each asset. An asset is referenced by its symbol (a string in uppercase letters) and the corresponding median price is stored as a `uint64` value. There are two ways to post an asset’s price on chain. The first way is via the `put` function of the `OpenOraclePriceData` contract. The other way is via the `postPrices` function of the `DelFiPrice`. 

However, the current implementation does not strictly follow the specification that “Whenever a post happens, the official (median) price is recalculated”, leaving the door open for potential data inconsistencies in the registered prices and their medians. This is a High severity issue, and it should be fixed by applying the necessary modifications to strictly follow the specification. In particular, there should be a single reliable way to post prices on chain, and a single reliable way to query the median price for an asset.

## Details

The `DelFiPrice` contract has a [public `prices` mapping](https://github.com/compound-finance/open-oracle/blob/e7a928334e5e454a88eec38e4ee1be5ee3b13f08/contracts/DelFiPrice.sol#L28) intended to store the median price for each asset. Following the specification, an asset is referenced by its symbol (a string in uppercase letters) and the corresponding median price is stored as a `uint64` value. Anyone can post prices on chain, but only those signed by trusted sources are taken into account when calculating the median price. There are two ways to post an asset’s price on chain.


The first method is via the external [`put` function](https://github.com/compound-finance/open-oracle/blob/e7a928334e5e454a88eec38e4ee1be5ee3b13f08/contracts/OpenOraclePriceData.sol#L34) of the `OpenOraclePriceData` contract. Given a signature and the associated message containing the price and the asset’s symbol (among other things), the function will first recover the source from the message and signature, and then update the asset’s price for this particular source. Price data for each source and symbol is kept in the contract’s storage in [private `data` mapping](https://github.com/compound-finance/open-oracle/blob/e7a928334e5e454a88eec38e4ee1be5ee3b13f08/contracts/OpenOraclePriceData.sol#L26). Note that prices updated via this method *do not* trigger a recalculation of the official (median) price hold in the public `prices` mapping of the `DelFiPrice` contract. As a consequence, if at this point a user queries an asset’s price reading the `prices` mapping, the returned median price will be incorrect. Furthermore, if the user queries the asset’s price using the [`medianPrice` function](https://github.com/compound-finance/open-oracle/blob/e7a928334e5e454a88eec38e4ee1be5ee3b13f08/contracts/DelFiPrice.sol#L86), the returned median price may be inaccurate as well, since it will not be compared against the anchor price to validate it.


The other way to submit prices is via the external [`postPrices` function](https://github.com/compound-finance/open-oracle/blob/e7a928334e5e454a88eec38e4ee1be5ee3b13f08/contracts/DelFiPrice.sol#L49) of the `DelFiPrice`, which allows to report a batch of prices (with associated signatures) of one or more assets in a single transaction. Internally, [`postPrices` calls the `put` function](https://github.com/compound-finance/open-oracle/blob/e7a928334e5e454a88eec38e4ee1be5ee3b13f08/contracts/DelFiPrice.sol#L54). In this case, the `postPrices` function also correctly [recalculates the median price](https://github.com/compound-finance/open-oracle/blob/e7a928334e5e454a88eec38e4ee1be5ee3b13f08/contracts/DelFiPrice.sol#L58-L77) of each asset passed in the `symbols` parameter, updating the corresponding entries in the `prices` mapping [if the median is within safe bounds](https://github.com/compound-finance/open-oracle/blob/e7a928334e5e454a88eec38e4ee1be5ee3b13f08/contracts/DelFiPrice.sol#L66-L67). However, if there is a mismatch between the assets referenced in the `symbols` array and the assets which prices were updated, then some median prices will not be recalculated.


According to the specification, *“Whenever a post happens, the official (median) price is recalculated”*. This is not strictly followed by the current implementation, leaving the door open for potential data inconsistencies in the registered prices and their medians. Taking into account that reporting accurate median prices is the fundamental purpose of the system, we understand this to be a High severity issue. Consider applying the necessary modifications to strictly follow the specification. In particular, there should be a single reliable way to post prices on chain, and a single reliable way to query the median price for an asset.
