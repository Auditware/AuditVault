---
tags:
  - blockchain/bitcoin
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/stable
  - impact/loss-of-funds/direct-drain
  - precondition/insider
title: "Mixin Network - REKT"
protocol: "[[Mixin Network]]"
date: 2023-09-23
loss_usd: 200000000
auditors:
source: "https://rekt.news/mixin-rekt"
excerpt: "What a way to start the week. This morning, Mixin Network announced a loss of $200M. The project claims to be “decentralised”, but has blamed the losses on a hacked third-party database. Where's the a"
genome:
  - "[[direct-drain]]"
  - "[[insider]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Mixin Network - REKT

> **Loss:** $200,000,000 | **Date:** 2023-09-23 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/mixin-header.png)

_What a way to start the week._

**This morning, Mixin Network [announced](https://twitter.com/MixinKernel/status/1706139175018529139) a loss of $200M... to an attack which had occurred on Saturday.**

A few hours later, the Hong Kong-based project informed users via livestream that just 50% of their assets were guaranteed, [according](https://www.theblock.co/post/252716/mixin-network-founder-says-just-half-users-assets-are-safe-after-200-million-hack) to The Block. An english summary of the livestream (promised in the initial announcement) is yet to be published.

News of a relatively unheard-of platform losing nine figures brings back memories of Poly Network’s [leaderboard](https://rekt.news/leaderboard/)-topping [incident](https://rekt.news/polynetwork-rekt/) in August 2021. And just goes to demonstrate the vast [disconnect](https://twitter.com/pcaversaccio/status/1706215712237216206) between crypto communities across the globe.

**Mixin Network claims to be “decentralised”, but has blamed the losses on a hacked third-party database.**

_Something doesn’t add up..._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**The details of precisely how funds were drained have not yet been disclosed.**

But Mixin wasted no time in shifting the blame:

>the database of Mixin Network's cloud service provider was attacked by hackers, resulting in the loss of some assets on the mainnet

**The transactions appear to be simple transfers, which would suggest a leak of Mixin users’ private keys held on the cloud service.**

_BlockSec also [believe](https://twitter.com/BlockSecTeam/status/1706319766544155068) that some of the addresses drained may have been Mixin’s hot wallets._

The stolen funds accounted for so far are comprised of ETH, USDT (swapped to unfreeable DAI) and BTC, with not an illiquid shitcoin in sight.

The announcement states that Mixin is in contact with Google (presumably the ‘service provider’ in question) and [SlowMist](https://twitter.com/SlowMist_Team/status/1706133260869468503) to aid in the investigation.

Attacker [addresses](https://t.me/investigations/41) (identified so far, with approx $50M still to be accounted for):

**[0x52E86988bd07447C596e9B0C7765F8500113104c](https://etherscan.io/address/0x52E86988bd07447C596e9B0C7765F8500113104c)** - Received 60k ETH ($94M)

**[0x3B5fb9d9da3546e9CE6E5AA3CCEca14C8D20041e](https://etherscan.io/address/0x3B5fb9d9da3546e9CE6E5AA3CCEca14C8D20041e)** - Received USDT, swapped to DAI ($23.5M)

**[0xB5d631A74AD9c9efcF96d6e9e2fAbcB75C67Eafa](https://etherscan.io/address/0xB5d631A74AD9c9efcF96d6e9e2fAbcB75C67Eafa)** - Used to disperse ETH to victim addresses for gas to transfer USDT

**[bc1qq7uefmz6nng5c4dzs9mwrxxyh9sxg5cjg85hes](https://blockchair.com/bitcoin/address/bc1qq7uefmz6nng5c4dzs9mwrxxyh9sxg5cjg85hes)** - Received 891 BTC ($23M)

If the $200M figure stated by Mixin is accurate, it would make this incident the [biggest hack](https://twitter.com/PeckShieldAlert/status/1706256486991863833) of 2023 so far, knocking March’s $197M exploit of [Euler Finance](https://rekt.news/euler-rekt/) (funds later returned) off the top spot.

As assets currently remain in the drainer wallets, there may be some hope for [Mixin’s request](https://etherscan.io/tx/0x6c593a2378add4594df15eaa89bd32e0ad6332165b31160d16fc7a80e490b5b5) for funds to be returned (_with a $20M bounty_), though the swapping of UDST to DAI is not a good sign.

**This case has many of the hallmarks of a [Lazarus](https://rekt.news/big-phish/) heist, who have been [plenty](https://rekt.news/coinex-rekt/)  [busy](https://rekt.news/stake-rekt/)  [lately](https://rekt.news/alphapo-rekt/).**

_If it does turn out to be Lazarus, the funds will soon be getting a good [Mixin’](https://twitter.com/tayvano_/status/1668935273047261185)…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**By blaming a third-party, as Nansen also did [on Friday](https://twitter.com/nansen_ai/status/1705137387838574904), Mixin is attempting to hide from one of crypto’s most important tenets: accountability.**

Using a web2 service provider for sensitive on-chain data goes against everything about the origins of this industry.

_And given LayerZero’s latest [partnership](https://medium.com/layerzero-official/layerzero-x-google-cloud-7b4784873071), they may have some [reassuring](https://twitter.com/hal2001/status/1706153912439345498) to do…_

**With a [constant stream](https://rekt.news/gone-phishing/) of hacks, leaks and scams, flooding the timeline, it begins to feel like working in an [online minefield](https://twitter.com/tayvano_/status/1611131230074073088).**

_But that's the point._

**This was a [hack, not an exploit](https://twitter.com/0xdface/status/1706200428432548254).**

_Yet another case of legacy infrastructure failing, yet another reason to be working towards a more secure future…_

**As the darkest days of bear market apathy grind on, it becomes ever-harder to stay motivated.**

But for those building genuine, robust protocols for a future true to crypto’s original ideals, [remember](https://twitter.com/safetyth1rd/status/1706195458677526641):

>decentralization doesnt matter
>
>until it really really does

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
