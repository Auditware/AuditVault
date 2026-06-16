---
tags:
  - blockchain/bitcoin
  - blockchain/ethereum
  - blockchain/tron
  - sector/bridge
  - sector/stable
  - impact/loss-of-funds/direct-drain
title: "HECO Bridge, HTX - REKT"
protocol: "[[Heco Bridge Htx]]"
date: 2023-11-22
loss_usd: 99100000
auditors:
source: "https://rekt.news/heco-htx-rekt"
excerpt: "It's been a rough few weeks for Justin Sun. Today, another $99M went missing as HECO Bridge and HTX (again) were hacked in short succession. His Excellency makes sure to never stay out of the spotligh"
genome:
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[oracle-freshness]]"
---
# HECO Bridge, HTX - REKT

> **Loss:** $99,100,000 | **Date:** 2023-11-22 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/heco-htx-header.png)

_It's been a rough few weeks for [Justin Sun](https://twitter.com/justinsuntron/)._

**Today, another $99M went missing as two Sun-linked projects were hacked in short succession.**

**$86.6M was lost from HECO (Huobi ECO) Chain’s Ethereum bridge, and $12.5M from hot wallets belonging to HTX (formerly Huobi).**

The hacks come just twelve days after Sun’s [Poloniex lost $126M](https://rekt.news/poloniex-rekt/) on the Ethereum, Tron and Bitcoin networks. HTX had also already been [drained of $8M](https://rekt.news/htx-huobi-rekt/) in late September, though funds were [recovered](https://twitter.com/justinsuntron/status/1710687727686160676) around two weeks later.

Yesterday, all eyes (including [Justin’s](https://twitter.com/justinsuntron/status/1727020183813075349)) were on CZ and Binance’s settlement with US authorities.

_But His Excellency makes sure to never stay out of the spotlight for long…_

**With increasing regulatory pressure on crypto’s [main players](https://rekt.news/bulls-behind-bars/), this repetitive-rektage couldn’t have come at a worse time for Sun.**

_Or are these repeated “hacker attacks” just building a [rainy-day fund](https://twitter.com/WhaleWire/status/1727343379032223759), ready for a life on the lam?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Peckshield](https://twitter.com/peckshield/status/1727297135572586701), [Cyvers](https://twitter.com/CyversAlerts/status/1727284118763757661)_

**Two hours after the first alerts of fund movements on [HECO](https://twitter.com/CyversAlerts/status/1727276003196600539) then [HTX](https://twitter.com/CyversAlerts/status/1727284118763757661), Sun [acknowledged](https://twitter.com/justinsuntron/status/1727304656622326180) the attacks, promising to compensate the HTX losses:**

>HTX and Heco Cross-Chain Bridge Undergo Hacker Attack. HTX Will Fully Compensate for HTX's hot wallet Losses. Deposits and Withdrawals Temporarily Suspended. All Funds in HTX Are Secure, and the Community Can Rest Assured. We are investigating the specific reasons for the hacker attack. Once we complete the investigation and identify the cause, we will resume services.

The HECO Bridge funds were drained via a [compromised operator](https://etherscan.io/address/0x3d655889d197125fb90dcb72e4a287a8410ed1b9) account, which ([beginning](https://etherscan.io/tx/0xbb6fe88427c2f3bc179075109d47a805dcfedab0e475eaca0d979311873e131b) at 09:59 AM UTC) withdrew funds from the [bridge](https://etherscan.io/address/0xa929022c9107643515f5c777ce9a910f0d1e490c) to the attacker’s [address](https://etherscan.io/address/0xfc146d1caf6ba1d1ce6dcb5b35dcbf895f50b0c4). The majority of funds were forwarded onto an [accumulation wallet](https://etherscan.io/address/0xe47e6da16bb83eb0fd26b3f29b15ce8fab089b9e).

The compromised [HTX hot wallet](https://etherscan.io/address/0x9281035df6f00557c0285d7df21d323c2e2f99ad) addresses ([ETH](https://etherscan.io/address/0xb9f775179bcc7fcf4534700a48f09c590e390ead), [others](https://etherscan.io/address/0x9281035df6f00557c0285d7df21d323c2e2f99ad)) transferred funds ([beginning](https://etherscan.io/tx/0xd773f61db2bd693d15b09e790a7c257b48ec926865be68a5f88f451242edbeda) at 10:41 AM UTC) directly to separate attacker addresses ([ETH](https://etherscan.io/address/0x5a22f867dfcb4f32d25a5fa365b9d9d78d5515dc), [others](https://etherscan.io/address/0x121a0ff24027fffcdd0ae008da82f2789c7945cc)).

**While the precise source of the attacks is unknown, it seems likely that vulnerabilities exploited in previous hacks could have been [reused](https://twitter.com/peckshield/status/1727297135572586701), given the connections between the affected entities.**

[Peckshield](https://twitter.com/PeckShieldAlert/status/1727286692489679360) puts the HECO bridge losses at $86.6M, in the following assets: 42M $USDT, >10k ETH ($19M), 489 HBTC ($18.8M), 347M SHIB ($2.8M), 173k $UNI ($930k), 619k USDC, 42k $LINK ($600k), 347k TUSD.

[Cyvers](https://twitter.com/CyversAlerts/status/1727284118763757661) summed $12.5M in losses from HTX, made up of: 1,240 ETH ($2.5M), 7.3M USDT, 1.78M USDC, and 62.2K $LINK ($870k).

HECO attacker address: **[0xfc146d1caf6ba1d1ce6dcb5b35dcbf895f50b0c4](https://etherscan.io/address/0xfc146d1caf6ba1d1ce6dcb5b35dcbf895f50b0c4)**

Compromised operator address: [0x3d655889d197125fb90dcb72e4a287a8410ed1b9](https://etherscan.io/address/0x3d655889d197125fb90dcb72e4a287a8410ed1b9)

HECO Bridge address: [0xa929022c9107643515f5c777ce9a910f0d1e490c](https://etherscan.io/address/0xa929022c9107643515f5c777ce9a910f0d1e490c)

HTX hot wallet 1 (ETH): [0xb9f775179bcc7fcf4534700a48f09c590e390ead](https://etherscan.io/address/0xb9f775179bcc7fcf4534700a48f09c590e390ead)

HTX hot wallet 2 (other assets): [0x9281035df6f00557c0285d7df21d323c2e2f99ad](https://etherscan.io/address/0x9281035df6f00557c0285d7df21d323c2e2f99ad)

HTX attacker 1 (ETH): [0x5a22f867dfcb4f32d25a5fa365b9d9d78d5515dc](https://etherscan.io/address/0x5a22f867dfcb4f32d25a5fa365b9d9d78d5515dc)

HTX attacker 2 (other assets): [0x121a0ff24027fffcdd0ae008da82f2789c7945cc](https://etherscan.io/address/0x121a0ff24027fffcdd0ae008da82f2789c7945cc)

_After receiving, funds were forward on to various further addresses; Hacken provided a [list](https://twitter.com/hackenclub/status/1727319910551105797)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**This style of attack targeting CEX and bridges has all the hallmarks of DPRK’s [Lazarus Group](https://rekt.news/big-phish/), who’ve cleared over [half a billion dollars](https://twitter.com/tayvano_/status/1727384134061052410) in the last six months alone.**

_Once they find a foothold, [insufficient spring cleaning](https://twitter.com/tayvano_/status/1727360850640683223) is sure to result in more losses._

Regardless of who carried out the double-pronged hack, costs are mounting up for Justin Sun, who may be [next in line](https://twitter.com/Mudit__Gupta/status/1727024903097135146) for the US authorities’ ongoing crypto cleanse.

HECO and HTX are the 3rd and 4th incidents inside three months on Sun-linked projects, totaling 233M in losses (with just $8M returned, so far).

Earlier this month, we [wondered](https://rekt.news/poloniex-rekt/):

>How deep do Sun’s pockets go?

_At this rate, perhaps one day we'll find out?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
