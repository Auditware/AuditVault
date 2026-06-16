---
tags:
  - sector/bridge
  - sector/gaming
  - impact/loss-of-funds/locked-funds
  - precondition/insider
title: "Shibarium Bridge - REKT"
protocol: "[[Shibarium Bridge]]"
date: 2023-08-17
loss_usd: 2600000
auditors:
source: "https://rekt.news/shibarium-bridge-rekt"
excerpt: "The Shibarium devs are in the doghouse. A botched launch of Shiba Inu’s ETH L2 sees a total of $2.6M of user funds stuck in a faulty bridge. Memecoins are evolving... but why?"
genome:
  - "[[locked-funds]]"
  - "[[insider]]"
  - "[[bridge-message-validation]]"
  - "[[upgrade-safety]]"
---
# Shibarium Bridge - REKT

> **Loss:** $2,600,000 | **Date:** 2023-08-17 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/shibarium-header.png)

_The Shibarium devs are in the doghouse._

**A botched launch of Shiba Inu’s ETH L2, Shibarium, sees a total of $2.6M of user funds stuck in a faulty bridge.**

_As if there weren’t already enough ways to [get rekt](https://rekt.news/shitcoins/) trading memecoins..._

For some reason, the dog token needed an L2 where loyal holders could participate in canine-themed DeFi, GameFi, NFTs and general degeneracy, playing fetch with tickers such as [BONE](https://www.coingecko.com/en/coins/bone-shibaswap), [LEASH](https://www.coingecko.com/en/coins/doge-killer) (both down ~30%) and TREAT (not yet released).

But shortly after launch, transactions stalled, and [SHIB](https://www.coingecko.com/en/coins/shiba-inu) dropped almost 10% on the news that the chain had stopped producing blocks.

>[We fucked up hard, we can’t recover the ETH bridged.](https://twitter.com/shroom_daddy/status/1691953231289528683)

_Or can they?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**Given Shibarium [isn’t producing blocks](https://www.shibariumscan.io/), withdrawals from the bridge cannot be initiated from the L2 side.**

The contracts hold 1008 ETH ($1.8M) and 635k BONE ($774k), Shibarium’s gas token, at the time of writing, with deposits [continuing](https://etherscan.io/address/0xc3897302ab4b42931cb4857050fa60f53b775870#internaltx)  [long](https://etherscan.io/address/0x885fcE983b6a01633f764325B8c3c5D31032C995) after the word got out.

Bridge address (ETH): [0xc3897302ab4b42931cb4857050fa60f53b775870](https://etherscan.io/address/0xc3897302ab4b42931cb4857050fa60f53b775870)

Bridge address (BONE): [0x885fcE983b6a01633f764325B8c3c5D31032C995](https://etherscan.io/address/0x885fcE983b6a01633f764325B8c3c5D31032C995)

_However, it appears that not all hope is lost…_

**Given the bridges are proxy contracts, the funds should be recoverable, as [pcaversaccio](https://twitter.com/pcaversaccio/status/1692064157942616374) points out:**

>There is certainly a way to recover the ETH as long as the proxy owner didn't lose the private key. Upgrade the implementation, recover the funds via an ownable function, and set up a claim contract. And yes, upgradeability is still a bug as u see here🙃.

Apparently, every dog has its day...

**"ALL IS WELL" claims the latest [Shib Blog post](https://blog.shib.io/shibarium-insane-influx/), also stating that the screenshot about the funds being lost was fake.**

_While this may not be an irreparable mistake, it hopefully serves as a cautionary tale to anyone thinking that memecoins should be treated as anything other than memecoins…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**In other bridge news, Thorchain was paused following [disclosure](https://twitter.com/thorchain/status/1691793526382789044) of a bug in production, with a patch expected within 24-48 hrs, [according](https://twitter.com/THORChain/status/1691793927811342391) to the team.**

The project has [featured](https://rekt.news/thorchain-rekt/) on rekt.news [twice](https://rekt.news/thorchain-rekt2/), both in July 2021, with a spillover scam affecting RUNE holders thanks to a [vulnerability](https://twitter.com/Mudit__Gupta/status/1418594621622390786) in the token’s design.

_Thankfully, this time it’s a near-miss and not a [leaderboard](https://rekt.news/leaderboard/) entry._

Bridges are a necessary evil for users wanting to explore the cryptoverse, and remain the most delicate pillar of the industry.

**Given the risk bottleneck they present, if they’re going to be built, they better be built right.**

_…and for a good reason._

**The latest generation of memecoins have forced earlier examples into evolving.**

_But… [why](https://twitter.com/Dogetoshi/status/1691958129842434491)?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
