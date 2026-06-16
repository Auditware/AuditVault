---
tags:
  - sector/dex
  - sector/lending
  - sector/token
title: "SushiSwap - REKT"
protocol: "[[Sushiswap]]"
date: 2023-04-09
loss_usd: 3300000
auditors:
source: "https://rekt.news/sushi-yoink-rekt"
excerpt: "Yoink. Over $3.3M was stolen from SushiSwap users over the weekend via a new routing contract. This is a bad look for an already-embattled protocol. How many more scandals can Sushi take?"
genome:
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# SushiSwap - REKT

> **Loss:** $3,300,000 | **Date:** 2023-04-09 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/sushi-yoink-header.png)

_Yoink._

**Over $3.3M was stolen from [SushiSwap](https://twitter.com/SushiSwap) users over the weekend via a new routing contract.**

All users who had approved Sushi’s 4 day old [RouteProcessor2 contract](https://etherscan.io/address/0x044b75f554b886A065b9567891e45c79542d7357) at the time of the incident, were at risk, across [14 chains](https://gist.github.com/0xngmi/40c530a6dc219e62939ed911b5d5ac70).

**Sushi Head Chef, Jared Grey, [acknowledged](https://twitter.com/jaredgrey/status/1644914375151550464) the bug, urging users to revoke approvals. He later [stated](https://twitter.com/jaredgrey/status/1645195713305878528) that the protocol is now safe to use, and the exploited contract has been removed, as well as [promising](https://twitter.com/jaredgrey/status/1645109790425731075) a full post-mortem on events.**

_Amongst the chaos, [DeFi’s favourite villain](https://rekt.news/sifu-scandal/) got [rekt](https://twitter.com/peckshield/status/1644907207530774530) for 1800 ETH, and there was plenty of [whitehacking](https://twitter.com/jaredgrey/status/1645065502748704769)  [activity](https://twitter.com/_anishagnihotri/status/1645040757219250176)._

One user [claimed](https://twitter.com/trust__90/status/1644895249058131971) to have targeted 0xSifu as a whitehat, though the attempt appeared to have been [botched](https://twitter.com/trust__90/status/1644900643608358913), with only 100 ETH eventually [returned](https://twitter.com/0xSifu/status/1644996954093486080). [BlockSec](https://twitter.com/BlockSecTeam/status/1644963756621852673) also got involved, adding to their impressive list of [recent whitehacks](https://twitter.com/BlockSecTeam/status/1644971411260289031).

Luckily, the days-old contract had relatively few approvers, and this didn’t turn out to be the AMM-ageddon it could have been.

**But this is a bad look for an already-embattled protocol, nonetheless.**

_How many more [scandals](https://rekt.news/sushiswap-scandal/) can Sushi take?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Inspex](https://twitter.com/InspexCo/status/1644966371149889538), [0xfoobar](https://twitter.com/0xfoobar/status/1645087636061577216), [ernestognw](https://twitter.com/ernestognw/status/1645113066021965825)_

The new contract contained the function, processRoute, which is insufficiently protected against accepting arbitrary data.

The attacker was able to create a fake Univ3 pool, and insert their own contract address in place of a genuine liquidity pool. During the uniswapV3SwapCallback function, the contract is then able to drain (or ['yoink'](https://twitter.com/cryptocojak/status/1644908746001494017)) tokens from any address which had approved it.

As 0xfoobar [explained](https://twitter.com/0xfoobar/status/1645087636061577216):

>SushiSwap router exploit comes from a bad callback. Although the line 328 comment is correct, line 340 does not check the pool deployer. So you can impersonate a V3Pool, do a no-op swap, call safeTransferFrom on an arbitrary ERC20 and arbitrary `from` address on line 347

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/sushi-yoink-code.png)

A more [detailed breakdown](https://twitter.com/ernestognw/status/1645113041430757378) was provided by ernestognw.eth.

Example attack tx: [0xea3480f1…](https://etherscan.io/tx/0xea3480f1f1d1f0b32283f8f282ce16403fe22ede35c0b71a732193e56c5c45e8)

RouteProcessor2 contract on ETH: [0x044b75f554b886A065b9567891e45c79542d7357](https://etherscan.io/address/0x044b75f554b886A065b9567891e45c79542d7357)

[See this list for addresses to revoke across multiple chains.](https://gist.github.com/0xngmi/40c530a6dc219e62939ed911b5d5ac70)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Rather than an existential threat to SushiSwap, this incident is more of an embarrassment than anything.**

The damage wasn’t enourmous, nor [particularly widespread](https://dune.com/0xkhmer/sushiswap-exploit). Users were either [drained or revoked](https://twitter.com/geek_sg/status/1645048235860586496) quickly, and whitehat efforts certainly helped to soften the PR blow.

_Ever since its launch, though, Sushi has been surrounded by drama._

2020’s DeFi summer saw Sushi come onto the scene in dramatic fashion, quickly establishing itself as one of DeFi’s darlings, alongside Uniswap, Curve, Aave and Compound.

**However, a period of stagnation during the 2021 bull run ended in [infighting](https://rekt.news/sushiswap-scandal/). Then, in October, the new head chef, Jared Grey’s, [murky past](https://rekt.news/sushiswap-grey-area/) in a variety of struggling projects drew suspicion.**

Sushi seems to be a good case study for DAOs working, until they don’t.

A small team of highly-motivated devs can disrupt the DEX landscape in just weeks. But once the excitement wanes, a bloated team can get too comfortable with inactivity and apathy (or simply farming a project’s treasury).

Grey [receiving](https://forum.sushi.com/t/head-chef-jared-greys-official-sec-statement-faq/11918) an SEC subpoena, [criticism](https://twitter.com/0xriptide/status/1645106409594314752) of a paltry bug bounty programme, and large [operating expenses](https://twitter.com/jaredgrey/status/1602701300520652800) (including 500k for Grey himself)...

_It appears the [drama](https://forum.sushi.com/t/remove-jared-grey-as-head-chef/11892) is far from over for Sushi._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
