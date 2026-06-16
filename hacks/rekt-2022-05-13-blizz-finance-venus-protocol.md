---
tags:
  - blockchain/avalanche
  - blockchain/bitcoin
  - blockchain/bsc
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - sector/stable
title: "Blizz Finance, Venus Protocol - REKT"
protocol: "[[Blizz Finance Venus Protocol]]"
date: 2022-05-13
loss_usd: 21800000
auditors:
source: "https://rekt.news/venus-blizz-rekt"
excerpt: "The Luna fall-out continues. Venus Protocol on BSC and Blizz Finance on Avalanche have been drained of $13.5 and $8.3M, respectively. With shaky markets, and the first projects falling victim to the f"
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[chainlink-round-completeness]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[timelock-timestamp-bypass]]"
---
# Blizz Finance, Venus Protocol - REKT

> **Loss:** $21,800,000 | **Date:** 2022-05-13 | **Audited by:** n/a

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/venusblizz-header.png)

**The Luna fall-out continues.**

Two lending platforms, [Venus Protocol](https://blog.venus.io/venus-protocol-official-statement-regarding-luna-6eb45c3cb058) on BSC and [Blizz Finance](https://twitter.com/BlizzFinance/status/1524911400992243761) on Avalanche, have been drained of $13.5 and $8.3M, respectively.

As the LUNA price continued to plummet, the Chainlink price feed used by the protocols became inaccurate, allowing funds to be borrowed against vastly overpriced LUNA collateral.

Neither project had existing failsafe mechanisms in place, and even though it appears the [alarm was raised](https://twitter.com/BoxMrChen/status/1524806697201504256) in advance, preventative measures weren’t established in time to prevent losses.

With shaky markets, and the first projects falling victim to the failure of LUNA and UST, how far will the damage spread?

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**The total collapse of the [Terra ecosystem](https://www.coingecko.com/fr/categories/terra-ecosystem) is no longer in doubt.** 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/venusblizz-terra.png)

For a short while the whole chain was [halted](https://twitter.com/terra_money/status/1524935730308456448), and several exchanges (Binance, Bybit, eToro, dydx) [suspended](https://www.binance.com/en/support/announcement/f68451879a1841a6a0f44025735d9236) trading on LUNA and UST.

Block production on [Terra has now resumed](https://twitter.com/terra_money/status/1525095111389945857), and the chain is active, but it's far from healthy. On-chain swaps are disabled, and IBC channels are closed.

The failed UST recovery plan crashed the [price of LUNA](https://www.coingecko.com/en/coins/terra-luna) to fractions of a cent, down from an ATH of almost $120, just over a month ago.

However, the Chainlink oracle, used as a price feed by both protocols to value collateral, contained a minimum price (_minAnswer_) for LUNA [hardcoded](https://bscscan.com/address/0xec72d46011d67a6ac4fa7d3f476fa2049dc807ee#readContract) at $0.10.

As the price dropped below this, anyone was able to buy up large quantities of LUNA at market price and use it as collateral (valued at $0.10) to borrow funds from the platforms.

Venus, with a TVL of ~$1B, was [(luckily)](https://t.me/venusprotocol/427357) able to suspend activity before being totally cleaned out. There is currently an [active proposal](https://app.venus.io/vote/proposal/60) to resume functionality, but with LUNA and UST positions suspended.

According to the [official statement:](https://blog.venus.io/venus-protocol-official-statement-regarding-luna-6eb45c3cb058) 

>Venus Protocol also has a Risk Fund that will be utilised to remedy the shortfall that resulted from this event.

Blizz Finance, however, was unable to react in time, due to their timelock, leaving the protocol wiped out. A glance at [the project’s site](https://blizz.finance/) shows all assets lent out, supposedly on worthless collateral. 

_[$8.3M of TVL gone in a flash.](https://defillama.com/protocol/blizz-finance)_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/venusblizz-blizztweet.png)

With both protocols claiming that the blame lies with Chainlink for the “pausing” of their price feeds, Chainlink put out [a statement](https://twitter.com/ChainLinkGod/status/1524945117471047680/) explaining the functionality of the automatic circuit breaker and describing best practices followed by other protocols.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**No protocol is too big to fail.**

LUNA dropping below $0.10 may have been unthinkable when the Chainlink feed was set up, but as it became clear that LUNA was not going to recover, Chainlink should have updated their oracle’s parameters to reflect reality.

This incident shows that even using a reputable oracle such as Chainlink is not a silver bullet. The responsibility lies with each project to understand every element of their protocol and integrate everything in a safe and secure way, no matter what the market does.

Protocols should have measures in place for these unforeseen events, such as their own automated circuit-breakers to pause contracts under such conditions, as suggested in [Chainlink’s docs](https://docs.chain.link/docs/selecting-data-feeds/#risk-mitigation).

**Unfortunately, these two casualties are unlikely to be the last incidents linked to the implosion of Terra.**

After maintaining radio silence since announcing the plan to nuke LUNA, Do Kwon has just published [his thoughts](https://agora.terra.money/t/terra-ecosystem-revival-plan/8701) on how the chain should be resurrected.

_The consequences continue, and we still don't know what happened to the $3B of BTC that belonged to the Luna Foundation…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
