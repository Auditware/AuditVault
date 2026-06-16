---
tags:
  - blockchain/ethereum
  - blockchain/tron
  - sector/dex
  - sector/stable
  - precondition/insider
title: "Remitano - REKT"
protocol: "[[Remitano]]"
date: 2023-09-14
loss_usd: 2700000
auditors:
source: "https://rekt.news/remitano-rekt"
excerpt: "Another exchange drained, is Lazarus going for a September hat-trick? Remitano's hot wallets were hit for $2.7M, yesterday. But quickly frozen USDT ensured profits were vastly reduced. Are we… learnin"
genome:
  - "[[insider]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Remitano - REKT

> **Loss:** $2,700,000 | **Date:** 2023-09-14 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/remitano-header.png)

**Another exchange drained.**

_First [Stake](https://rekt.news/stake-rekt/), then [CoinEx](https://rekt.news/coinex-rekt/). Is [Lazarus](https://rekt.news/big-phish/) going for a September hat-trick?_

**In the third (_almost identical_) story of this month so far, [Remitano](https://twitter.com/remitano/) has lost $2.7M from hot wallets on Ethereum and Tron.**

Suspicious withdrawals were again [detected by Cyvers](https://twitter.com/CyversAlerts/status/1702348063145165016) and Remintano dragged their feet in responding (only publicly [announcing](https://twitter.com/remitano/status/1702617066761826794) the incident over 20 hours after the attack began).

**However, this time there was _some_ good news.**

Tether’s quick response in freezing funds [vastly reduced](https://twitter.com/PeckShieldAlert/status/1702507801669775712) the attack profits from $2.7M to just $260k.

_Are we… learning?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[PeckShield](https://twitter.com/PeckShieldAlert/status/1702507801669775712), [Cyvers](https://twitter.com/CyversAlerts/status/1702566664758337770)_

**The attack, which [began](https://etherscan.io/tx/0xef9a766c6a7a935ee26f4d1e36cd7c19a14b84559c2d350be3aca217273c7891) at 12:47 PM UTC yesterday, was yet another example of a simple hot-wallet draining due to a private key compromise.**

With two similar high-profile incidents in the last two weeks, it seems plausible that this is also the work of the Lazarus Group, a highly sophisticated DPRK state-sponsored hacking group.

The [official announcement](https://remitano.com/forum/ng/134684-latest-updates-on-recent-security-incident-on-remitano) from Remitano doesn’t specify exactly how hackers gained access to the hot wallet addresses in question, but does blame the theft on “_a data breach from a third-party source_”.

The post explains that upon notification of the breach, they consolidated assets from other hot wallets into secure cold storage addresses, and collaborated with Tether to freeze funds.

A total of 1.9M in USDT was frozen by Tether across the two chains, the remaining funds on Ethereum were swapped to ETH and deposited to an exchange, [thought](https://twitter.com/CyversAlerts/status/1702566664758337770) to be either HitBTC or Changelly. The funds on Tron remain in the hacker’s address.

**Attacker addresses:**

ETH: **[0x74530e81e9f4715c720b6b237f682cd0e298b66c](https://etherscan.io/address/0x74530e81e9f4715c720b6b237f682cd0e298b66c)**

TRON: **[TEDNf1aqk8YJEUdNH9NRd4MqibZmdP49Fm](https://tronscan.org/#/address/TEDNf1aqk8YJEUdNH9NRd4MqibZmdP49Fm)**

**Assets stolen on ETH:**

1.36M USDT

210k USDC

34.4 ETH

100k ANKR 

**And on TRON:**

540k USDT

3.75M TRX.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

This time, Tether responded quickly enough to save the majority of funds, and Cyvers have [called on](https://twitter.com/CyversAlerts/status/1702566664758337770) exchanges to check deposits and block any funds that weren’t frozen.

**However, in general, the industry response to these types of events tends to be slow and incomplete.**

Granted, we should expect more from custodians’ ability to secure their wallets, but there is still often a glaring failure in action after the fact.

**Even funds with [clear links](https://twitter.com/PeckShieldAlert/status/1701901745239285777) to Lazarus are being [freely](https://twitter.com/tayvano_/status/1701969824832758128) moved in and out of major exchanges, with chain checkers only able to [watch the flow](https://twitter.com/PeckShieldAlert/status/1702271479394849276) in real time.**

Even the most well-respected exchanges [don’t seem keen](https://twitter.com/cryptogle/status/1702627172949639535) to do the right thing, apparently happy to perpetuate the stereotype of a lawless cryptosphere when they would surely benefit from some good publicity [right now](https://rekt.news/grudgematch-sec/).

**The technology on which our industry is based allows us to [do much better](https://twitter.com/tayvano_/status/1701969820470665405).**

_How long will they keep getting away with this?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
