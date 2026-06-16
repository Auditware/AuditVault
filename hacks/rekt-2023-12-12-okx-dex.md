---
tags:
  - sector/dex
  - sector/privacy
  - sector/stable
  - vuln/dependency/upgradeable-contract
  - impact/loss-of-funds/direct-drain
  - precondition/insider
  - novelty/variant
title: "OKX DEX - REKT"
protocol: "[[Okx Dex]]"
date: 2023-12-12
loss_usd: 2700000
auditors:
source: "https://rekt.news/okx-dex-rekt"
excerpt: "CeDeFi strikes again. OKX’s DEX aggregator has fallen victim to one of the oldest tricks in the book, losing $2.7M to a private key compromise. If the compromised contract was deprecated, why did they"
genome:
  - "[[upgradeable-contract]]"
  - "[[direct-drain]]"
  - "[[insider]]"
  - "[[variant]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# OKX DEX - REKT

> **Loss:** $2,700,000 | **Date:** 2023-12-12 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/OKX-DEX-header.png)

_CeDeFi strikes again._

**OKX’s decentralised exchange aggregator has fallen victim to one of the oldest tricks in the book, losing $2.7M to a private key compromise.**

The losses were caused by a compromised proxy contract, which was upgraded and used to steal funds from users who had approved it.

_After community [reports](https://twitter.com/eno_eth/status/1734759709968945323) of funds going missing, Slowmist [raised the alarm](https://twitter.com/SlowMist_Team/status/1734790816806449567)._

**An official [acknowledgement](https://twitter.com/okxweb3/status/1734794114657657004) came shortly after, stating that the affected contract was a deprecated version, and had now been secured.**

_But if the contract was deprecated, why did they wait until it got rekt?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[SlowMist](https://twitter.com/SlowMist_Team/status/1734790816806449567)_

**Although OKX itself is a centralised exchange, it runs a DEX aggregator (featuring “_best-in-class security_”, [apparently](https://www.okx.com/learn/what-is-okx-dex)) to help its more intrepid users seek out more niche opportunities on-chain.**

According to [SlowMist](https://twitter.com/SlowMist_Team/status/1734790816806449567), the proxy admin of a trusted contract controlling OKX DEX trades was compromised. Then, shortly before midnight UTC, the implementation was [upgraded](https://etherscan.io/tx/0xc6a5a7bc31bbc9a7530189e718f7ed96789fa65c56c3a4a08079a95074e280c8) in order to siphon user funds from addresses which had approved the proxy.

**The pattern is described as follows:**

>...when users exchange, they authorize the TokenApprove contract, and the DEX contract transfers the user's tokens by calling the TokenApprove contract. The DEX contract has a claimTokens function that allows a trusted DEX Proxy to make calls, with its functionality being to invoke the claimTokens function of the TokenApprove contract to transfer tokens authorized by the user. The trusted DEX Proxy is managed by the Proxy Admin, and the Proxy Admin Owner can upgrade the DEX Proxy contract through the Proxy Admin.

**Once compromised:**

>...the Proxy Admin Owner upgraded the DEX Proxy contract to a new implementation contract through the Proxy Admin. The new implementation contract's functionality is to directly call the claimTokens function of the DEX contract to transfer tokens. Subsequently, attackers began calling the DEX Proxy to steal tokens.

**Relevant addresses/txs:**

>DEX contract: [0x70cbb871e8f30fc8ce23609e9e0ea87b6b222f58](https://etherscan.io/address/0x70cbb871e8f30fc8ce23609e9e0ea87b6b222f58)
>
>OKX DEX TokenApprove contract: [0x40aa958dd87fc8305b97f2ba922cddca374bcd7f](https://etherscan.io/address/0x40aa958dd87fc8305b97f2ba922cddca374bcd7f)
>
>DEX Proxy: [0x55b35bf627944396f9950dd6bddadb5218110c76](https://etherscan.io/address/0x55b35bf627944396f9950dd6bddadb5218110c76)
>
>Proxy Admin: [0x3c18F8554362c3F07Dc5476C3bBeB9Fdd6F6a500](https://etherscan.io/address/0x3c18F8554362c3F07Dc5476C3bBeB9Fdd6F6a500)
>
>Proxy Admin Owner: [0xc82Ea2afE1Fd1D61C4A12f5CeB3D7000f564F5C6](https://etherscan.io/address/0xc82Ea2afE1Fd1D61C4A12f5CeB3D7000f564F5C6)
>
>Upgrade Transactions: [0xc6a5a7bc…](https://etherscan.io/tx/0xc6a5a7bc31bbc9a7530189e718f7ed96789fa65c56c3a4a08079a95074e280c8) and [0x22ebd2…](https://etherscan.io/tx/0x22ebd267d7344780e6d63cf3a76bab57b8f8fa41cf58df1a2e1707d75d8bee89)
>
>Suspected Attacker [[funded](https://etherscan.io/tx/0x7067bffd722d17d75357286b6b9dc64cd822cadb0baa60b0e27ea943c13f16e6) via Tornado Cash]: **[0xFacf375Af906f55453537ca31fFA99053A010239](https://etherscan.io/address/0xFacf375Af906f55453537ca31fFA99053A010239)**
>
>Profit Address [holding $430k]:
>
>[0x1F14E38666cDd8e8975f9acC09e24E9a28fbC42d](https://etherscan.io/address/0x1F14E38666cDd8e8975f9acC09e24E9a28fbC42d)

While SlowMist’s initial analysis put the losses at around $430k, [PeckShield](https://twitter.com/PeckShieldAlert/status/1734841998077812923) and [Hacken](https://twitter.com/hackenclub/status/1734843884646089099) traced a total of $2.7M stolen, adding the following addresses which received a total of 800 ETH ($1.7M) and $620k in stablecoins:

[0xa15fe801dd5fd31a684c444b6980dbaf0c78d5ad](https://etherscan.io/address/0xa15fe801dd5fd31a684c444b6980dbaf0c78d5ad)

[0x22a2931cb2a7b782d65b2b5562829e84d941b0f0](https://etherscan.io/address/0x22a2931cb2a7b782d65b2b5562829e84d941b0f0)

[0xfe55502a57f388a69602b2780071b759a520468f](https://etherscan.io/address/0xfe55502a57f388a69602b2780071b759a520468f)

[0x48e3712c473364814ac8d87a2a70a9004a42e9a3](https://etherscan.io/address/0x48e3712c473364814ac8d87a2a70a9004a42e9a3#tokentxns)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Private key compromises are often carried out by [the experts](https://rekt.news/big-phish/), and have often led to heavy losses from CEXs, including [Poloniex](https://rekt.news/poloniex-rekt/) and [HTX](https://rekt.news/heco-htx-rekt/) ([_twice_](https://rekt.news/htx-huobi-rekt/)), recently._

**Last week we [covered](https://rekt.news/plenty-of-phish/) some of the latest phishing techniques, pointing out how even experienced users can find it hard to notice common scam methods, including address poisoning campaigns.**

Fitting then, that today’s story shows how even professional security auditors can mistakenly copy/paste phishing [addresses](https://etherscan.io/address/0xa15c89a9913d23a7d4fba081135a17977c78d5ad) into their [write-ups](https://twitter.com/hackenclub/status/1734847395043606781), after presumably misidentifying fake token transfer as a genuine 300 ETH dispersal.

_But CEXs like OKX are aimed at retail, not experts._

Are retail users really expected to know about trust assumptions around proxy implementations, or know to revoke deprecated contracts?

**Well that’s CeDeFi innovation for you… making sure you can get rekt by CEX private key leaks even on-chain.**

OKX initially promised $370k to reimburse victims in their response, before moving on to [more important topics](https://twitter.com/okxweb3/status/1734861970602344684).

_Will they cover the rest?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
