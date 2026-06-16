---
tags:
  - sector/dex
  - sector/lending
  - sector/stable
  - sector/staking
  - sector/vault
  - impact/mev/backrun
title: "Money for nothing?"
protocol: "[[Money For Nothing]]"
date: 2023-12-26
loss_usd: 1300000
auditors:
source: "https://rekt.news/moneyfornothing"
excerpt: "The cost of doing business? 98%. $1.3M was lost yesterday when a Uniswap V3 whale LP made a costly fat-finger error. Who deserves the spoils?"
genome:
  - "[[backrun]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Money for nothing?

> **Loss:** $1,300,000 | **Date:** 2023-12-26 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/moneyfornothing-header.png)

_The cost of doing business?_

_98%._

**$1.3M was lost on Tuesday when a Uniswap V3 whale LP made a costly fat-finger error.**

The victim, [aavebank.eth](https://etherscan.io/address/0xd730cd62cda9cfdc109be2d819b0337fafdca959) (_no apparent relation to the lending protocol_), is [no stranger](https://medium.com/coinmonks/top-5-mysterious-liquidity-providers-in-uniswap-v3-and-what-we-can-learn-from-them-1894bd27096f) to bad luck.

**However, instead of picking up the back-run profits for themself, an MEV bot paid 98% of the take as a bribe to the block’s [lucky solo validator](https://etherscan.io/address/0x7b2e247ea15afc0cd13cd8e60c66d3119d3efa1f).**

In the [dark forest](https://rekt.news/return-to-the-dark-forest/) of MEV extraction, enormous sums are routinely weaponised, often to shave off mere crumbs from the amounts involved.

Amongst such [cutthroat competition](https://libmev.com/dashboard) between ever-evolving bots, the block reward lottery's top prizes are growing. And with the increasing centralisation caused by liquid staking providers, the house (_almost_) always wins.

Should validators be rewarded quite so generously for sitting on their stakes while searchers seek out the opportunities only to pay hefty bribes?

Or should predatory MEV bots be grateful for any scraps they can get?

_Do either of them deserve the spoils?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Peckshield](https://twitter.com/PeckShieldAlert/status/1739742700004389337)_

Despite its deceptive name, we should all be well acquainted with the risks of ‘impermanent loss’ by now, [Uni V3 LPs](https://rekt.news/uniswap-v3-lp-rekt/) more than most.

_But far greater risks come from within._

Illiquid pools and fat fingers make for a dangerous combination on DeFi’s [biggest](https://defillama.com/dexs) DEX, where MEV bots are waiting to [scoop up](https://twitter.com/PeckShieldAlert/status/1739742700004389337) the spoils of even the slightest mistake.

**aavebank.eth [added](https://etherscan.io/tx/0x75d0f64da74ac80f77ed48b823cefd821fba73be78a18e8f1ab9b7097808e023) 2M USDT of liquidity at a very out-of-range pricepoint to the UNI-USDT pair, before burning the LP position to [withdraw](https://etherscan.io/tx/0xd4fb3c50e1438fc222ed9a3fe08d9ed2878958a61bed159e2c9e93fef42c2301) just 99k UNI (worth $730k) just two minutes later.**

In the meantime, MEV bot [0xfde0d1](https://etherscan.io/address/0xfde0d1575ed8e06fbf36256bcdfa1f359281455a) had eaten the excess USDT worth almost $1.3M from the costly, albeit juicy, error.

Out-of-range LP positions on V3 can be used to set limit orders. One user [pointed out](https://twitter.com/pydono/status/1739750493008585169):

>aavebank.eth has added followed a similar pattern in the past where they add $2 million USDT out of range essentially setting a limit order to buy UNI in the future. However, this time they fucked up the range and essentially offered to buy $730k UNI for $2m USDT.

_While the victim LP holds the ENS aavebank.eth, the address doesn’t appear to have a connection to the Aave protocol or team._

**But that doesn’t mean experienced DeFi teams aren’t making [similar blunders](https://github.com/yearn/yearn-security/blob/master/disclosures/2023-12-11.md).**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**In ensuring they would be the one to grab the spoils, the bot gave up the majority of the 578 ETH profit in a 566 ETH ($1.25M) [bribe](https://etherscan.io/tx/0x826da91d8d62b08a23482bdb3afeb364a73ffa228267371b9582ec3c092da8d1) paid to the validator, [keeping](https://twitter.com/gm365/status/1739970642450284839) just 2% for their trouble.**

_While previously a niche and lucrative racket, MEV has increasingly become a [race to the bottom](https://twitter.com/WazzCrypto/status/1739763326865805641)._

It may be entertaining to watch the occasional [examples](https://rekt.news/ripmevbot2/) of on-chain [karma](https://rekt.news/ripmevbot/) as these blockchain predators feast upon one another, but MEV bots can also be responsible for returning frontrunned hack attempts (_in this case, the bot responsible is tagged on [Etherscan](https://etherscan.io/address/0xfde0d1575ed8e06fbf36256bcdfa1f359281455a) as having thwarted two hacks to date_).

Whenever someone loses out, be it to a [sandwich](https://crypticwoods.com/blog/jaredfromsubway-interview/) attack or fat-finger mishap, a blockchain predator will snap up their losses. 

_But pickings are getting slimmer as the arena becomes more crowded._

**Bots willing to take the lowest profit margin are able to take it all, while validators sit back and feast on gradually more generous portions.**

When excess value comes directly from [malicious behaviour](https://rekt.news/sushi-yoink-rekt/), should the recipients feel obliged to [return the ill-gotten gains](https://research.lido.fi/t/sushi-routeprocessor2-post-exploit-request-for-comment/4383)?

_Lido certainly [doesn’t think so](https://research.lido.fi/t/sushi-routeprocessor2-post-exploit-request-for-comment/4383/7)._

**So will these bumper rewards simply serve to drive up rates on liquid-staking behemoths, leading to further concentration of mainnet’s validators?**

_Or might it encourage more users to solo stake, hoping to hit the bribe jackpot themselves?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
