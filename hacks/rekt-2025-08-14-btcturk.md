---
tags:
  - blockchain/arbitrum
  - blockchain/avalanche
  - blockchain/bitcoin
  - blockchain/ethereum
  - blockchain/optimism
  - blockchain/polygon
  - sector/dex
  - sector/multisig
  - sector/perpetuals
  - sector/privacy
  - vuln/dos/frozen-funds
  - impact/loss-of-funds/direct-drain
  - precondition/insider
  - novelty/variant
title: "BTCTurk - Rekt"
protocol: "[[Btcturk]]"
date: 2025-08-14
loss_usd: 51700000
auditors:
source: "https://rekt.news/btcturk-rekt"
excerpt: "Crypto deposits and withdrawals frozen as BTCTurk faces Groundhog Day - $55 million lost in June 2024’s private key breach, now $51.7 million gone again, funds funneled into ETH, founder silent, and u"
genome:
  - "[[frozen-funds]]"
  - "[[direct-drain]]"
  - "[[insider]]"
  - "[[variant]]"
  - "[[dos-resistance]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# BTCTurk - Rekt

> **Loss:** $51,700,000 | **Date:** 2025-08-14 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/btcturk-rekt-header.png)







_Lightning doesn't strike twice in the same place, but crypto hackers apparently have no respect for meteorological wisdom._  
  

**BTC Turk just watched $51.7 million vanish from their hot wallets in a multi-chain massacre that carved through seven different blockchains like a digital tornado.**  
  
The Turkish exchange's second major breach in 14 months proves that some lessons require expensive repetition.  
  
Private keys leaked, funds drained, users frozen out - all while the attackers methodically swapped altcoins into ETH with the precision of a Swiss watch.

  
[Cyvers caught the bleeding early on August 14th](https://x.com/CyversAlerts/status/1955967877602803929), but by then the damage was already spreading across Ethereum, Avalanche, Arbitrum, Base, Optimism, Mantle, and Polygon networks.  
  
**Same exchange, same attack vector, different year - because apparently hot wallet security is more of a suggestion than a requirement.**  
  

_When your private key management has the durability of a paper umbrella in a hurricane, how many $50 million plus lessons does it take to learn basic operational security?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Cyvers](https://x.com/CyversAlerts/status/1955967877602803929), [BTCTurk](https://x.com/BtcTurkKripto/status/1955981988747198513), [Halborn](https://www.halborn.com/blog/post/explained-the-btc-turk-hack-june-2024), [Blockscope](https://x.com/BlockscopeCo/status/1956107096346488984), [Beosin](https://x.com/BeosinAlert/status/1957232165814767638), [CoinTelegraph](https://cointelegraph.com/news/btcturk-withdrawal-halt-hack-report), [Richard Teng](https://x.com/_RichardTeng/status/1804525525614096511), [CryptoDaily](https://cryptodaily.co.uk/2025/08/btcturk-faces-second-major-hack-in-a-year-48m-missing-from-hot-wallets), [CoinDesk](https://www.coindesk.com/policy/2023/09/08/11196-years-in-prison-for-faruk-ozer-ceo-of-collapsed-turkish-crypto-exchange-thodex), [Gazete Duvar](https://www.gazeteduvar.com.tr/suleyman-soylu-da-faruk-ozeri-tanimiyorum-dedi-haber-1520163), [Decrypt](https://decrypt.co/303793/thodex-founder-partial-release-2-billion-crypto-fraud), [CNN](https://www.cnn.com/2021/04/20/investing/dogecoin-dogeday-420/index.html), [CNBC](https://www.cnbc.com/2021/04/23/bitcoin-btc-ceo-of-turkish-cryptocurrency-exchange-thodex-missing.html), [ZachXBT](https://t.me/investigations/136), [crypto.news](https://crypto.news/btcturks-48m-hack-compounds-cryptos-bleak-summer-of-security-failure/)_

  

**Fool me once, shame on you. Fool me twice, and apparently I'm running a Turkish crypto exchange.**

  

BTC Turk's latest performance feels like Groundhog Day - stuck repeating the same day over and over, except even Bill Murray’s character learned from his mistakes.

  

[June 2024](https://www.halborn.com/blog/post/explained-the-btc-turk-hack-june-2024): hot wallets drained for $55 million.

  

August 2025: hot wallets drained for $51.7 million.

  

_Both times? Leaked private keys doing what leaked private keys do best._

  

**Same script, different season.**

  

Early morning brought the first signs of trouble [as Cyvers spotted funds flowing in all the wrong directions](https://x.com/CyversAlerts/status/1955967877602803929) across seven networks.

  

Blockchain sleuths watched attackers funnel stolen crypto into just two wallets while BTC Turk's security team was presumably still reaching for their morning coffee.  
  
Almost an hour later, [BTCTurk surfaced with damage control messaging](https://x.com/BtcTurkKripto/status/1955981988747198513) about "technical problems" - because calling it a catastrophic security failure doesn't test well with focus groups.

  
These weren't amateur hour moves. [Attackers carved through](https://x.com/CyversAlerts/status/1955967877602803929) ETH, AVAX, ARB, BASE, OP, MANTLE, and MATIC with methodical efficiency, immediately converting obscure tokens into liquid ETH.  
  
**[BTC Turk suspended crypto deposits and withdrawals within an hour](https://x.com/BtcTurkKripto/status/1955981988747198513) of detection, but by then the attackers had already consolidated their haul across multiple chains.**

  

_When your hot wallets have more holes than a colander, what exactly are you protecting in those cold storage vaults?_  
  
### The Anatomy of a Repeat Offender

  

_BTC Turk got sliced and diced for $51.7 million across seven blockchains, and the attackers didn't leave much on the table._

  

**EVM Chains took the heaviest hit, as they were carved up between multiple collection points.**

  

**[Blocksope highlighted](https://x.com/BlockscopeCo/status/1956107096346488984) that the primary exploiters consolidated funds here:**
[0x7d91d1ebeba91257733a523409125aedac5d8b6e](https://etherscan.io/address/0x7d91d1ebeba91257733a523409125aedac5d8b6e)
[0xb4b537626e21df5386cf167d1e654b38785056cc](https://etherscan.io/address/0xb4b537626e21df5386cf167d1e654b38785056cc)
[0xa041feb3a8297c5689fee180083164a061a17fd6](https://etherscan.io/address/0xa041feb3a8297c5689fee180083164a061a17fd6)

**[Blockscope tracked](https://x.com/BlockscopeCo/status/1956107372159475852) how consolidated ETH was then routed to additional wallets across L2 and EVM chains::**
[0xddfa0884f32d0d210597a996060fbdb5b068b0ea](https://etherscan.io/address/0xddfa0884f32d0d210597a996060fbdb5b068b0ea) ($15.2 Million)
[0x95ab53305bc71d0e6e2d46f2e62690599cbc87fc](https://etherscan.io/address/0x95ab53305bc71d0e6e2d46f2e62690599cbc87fc) ($800K)
[0x0fe41fe8786329fb6bd8f2baa73aa55e770f0951](https://etherscan.io/address/0x0fe41fe8786329fb6bd8f2baa73aa55e770f0951) ($16.7 Million)  
  
**[Further digging by Beosin](https://x.com/BeosinAlert/status/1957232165814767638) revealed more stolen finds were sent here:**  
[0xDDFA0884f32d0D210597A996060fbDB5b068b0Ea](https://etherscan.io/address/0xddfa0884f32d0d210597a996060fbdb5b068b0ea) ($15.1 Million)

  
**[Besoin also revealed that Bitcoin finally joined the party](https://x.com/BeosinAlert/status/1957232165814767638) with 33.247 BTC landing here:**
[Bc1q3xgyvmfk6mw6zvhjklsw7v8wl2dk0xtm35ulut](https://www.blockchain.com/explorer/addresses/btc/bc1q3xgyvmfk6mw6zvhjklsw7v8wl2dk0xtm35ulut) ($3.9 Million)  
  
_The total amount currently being held in the exploiter wallets (As of August 18th): $51.7 Million._  
  
**[Beosin's latest fund flow analysis](https://x.com/BeosinAlert/status/1957232165814767638) shows the attackers are still sitting on their haul.**  
  
The immediate conversion of over 90 different token types into liquid ETH through rapid MetaMask swaps paid off - everything's neatly organized and ready for the next move.

  

Even after BTC Turk slammed the emergency brakes on user accounts, the compromised infrastructure kept bleeding assets like a severed artery.

  

**Multi-chain coordination doesn't happen by chance - someone knew exactly what they were doing across seven different networks.**

  

_When attackers plan better than most Fortune 500 companies, what does that say about exchange security standards?_  
  
### Radio Silence Strategy  
  
_BTC Turk's crisis management approach seems to be "say little and hope it goes away."_  
  

**[One announcement in Turkish](https://x.com/BtcTurkKripto/status/1955973500583170252) that managed to hit every corporate crisis communication bingo square: "technical issue with hot wallets," cold wallets safe, customer funds secure, authorities notified.**  
  
Then they disappeared into the communications equivalent of witness protection while $51.7 million worth of questions pile up in their mentions.  
  

[Crypto deposits and withdrawals](https://cointelegraph.com/news/btcturk-withdrawal-halt-hack-report) earned themselves an indefinite freeze while [fiat deposits, withdrawals, and trading kept humming along](https://cointelegraph.com/news/btcturk-withdrawal-halt-hack-report).  
  
Lucky for lira users - their money wasn't the target, so business as usual unless you want to deposit or withdraw any crypto.  
  

[BTC Turk's founder Kerem Tibuk](https://x.com/keremtibuk), who stepped up as acting CEO after the last hack sent his predecessor packing, has been oddly silent.  
  
**No reassuring tweets, no damage control interviews, no "we're working around the clock" platitudes. Just the sound of crickets while users wait for answers.**  
  

_When your communication strategy involves less talking than a mime convention, what exactly are you hiding?_  
  
### Groundhog Day Exchange

  

_Pete and Repeat walk into a store, Pete walks out and who's left? Repeat._

  

**BTC Turk apparently missed the punchline because they've been living this joke for 14 months straight.**

  

[June 2024](https://www.halborn.com/blog/post/explained-the-btc-turk-hack-june-2024): Private keys compromised, $55 million drained from ten hot wallets, [Binance froze $5.3 million in stolen funds](https://x.com/_RichardTeng/status/1804525525614096511) while helping with the investigation.

  

[BTC Turk swore up and down that only their own money got stolen](https://www.halborn.com/blog/post/explained-the-btc-turk-hack-june-2024) - customer funds totally safe, nothing to see here.  
  
[ZachXBT even connected the June 2024 BTC Turk attackers](https://t.me/investigations/136) to a $3.5 million Sportsbet casino heist just hours later.

  

August 2025: Private keys compromised again, $51.7 million drained from hot wallets, authorities get another notification while attackers sort their fresh loot across multiple chains.

  

_Identical playbook, identical failures, different year._

  

**The only thing that changed was the CEO - [Özgür Güneri stepped down after seven years post-hack](https://cryptodaily.co.uk/2025/08/btcturk-faces-second-major-hack-in-a-year-48m-missing-from-hot-wallets), leaving founder Kerem Tibuk to clean up the mess.**

  

Apparently leadership changes don't automatically upgrade your private key management.

  

Turkey’s crypto scene has a long memory for drama, and BTC Turk’s repeat performance isn’t even the peak of national chaos.

  

[Meet Faruk Fatih Özer](https://www.coindesk.com/policy/2023/09/08/11196-years-in-prison-for-faruk-ozer-ceo-of-collapsed-turkish-crypto-exchange-thodex), the former golden boy of Turkish crypto who founded Thodex in 2017.

By 2021, Özer had become a public figure - [photographed alongside senior politicians such as Mevlut Çavuşoğlu and Süleyman Soylu](https://www.gazeteduvar.com.tr/suleyman-soylu-da-faruk-ozeri-tanimiyorum-dedi-haber-1520163) - while running Thodex, which had rapidly grown into [one of Turkey’s largest exchanges](https://decrypt.co/303793/thodex-founder-partial-release-2-billion-crypto-fraud).  
  
Then came April 20, 2021 - [known among crypto fans as Dogeday](https://www.cnn.com/2021/04/20/investing/dogecoin-dogeday-420/index.html) - when Thodex rolled out a final stunt: [a promotion distributing millions of Dogecoin](https://www.cnbc.com/2021/04/23/bitcoin-btc-ceo-of-turkish-cryptocurrency-exchange-thodex-missing.html), including roughly 4 million tokens - before freezing withdrawals and disappearing into the night.

_The giveaway turned out to be less a celebration than a curtain call, as within hours the exchange went dark and its founder vanished._

  

**On the same April 20th, [Airport security cameras captured Özer fleeing Istanbul with $2 billion](https://www.duvarenglish.com/security-footage-shows-thodex-ceo-fleeing-turkey-after-2b-heist-video-57571) in customer funds, leaving 391,000 users staring at frozen accounts.**  
  
Two years of international manhunting later, [Turkish courts sentenced Özer to 11,196 years in prison](https://www.coindesk.com/policy/2023/09/08/11196-years-in-prison-for-faruk-ozer-ceo-of-collapsed-turkish-crypto-exchange-thodex). For perspective, the last ice age ended 11,000 years ago.

  

Turkey's currency instability drives millions toward digital assets, creating exchanges loaded with desperate money and questionable security practices.

  

**When you're running a private key compromise assembly line, why stop at one target?**

  

_From billion-dollar exit scams to "technical difficulties" that cost tens of millions - when your country's exchanges offer more plot twists than a soap opera, is anyone actually surprised by the reruns?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






_BTC Turk's $51.7 million vanishing act just pushed crypto's summer losses toward the $200 million mark, adding another data point to 2025's brutal ledger of exchange failures._  
  

**[July alone saw $142 million bleed from crypto platforms](https://crypto.news/btcturks-48m-hack-compounds-cryptos-bleak-summer-of-security-failure/) - a 27% spike from June - with [India's CoinDCX leading the carnage](https://rekt.news/coindcx-rekt) at $44 million lost to [a sophisticated server breach](https://economictimes.indiatimes.com/news/new-updates/coindcx-loses-nearly-rs-368-crore-in-major-crypto-breach-heres-what-the-ceo-said-about-its-recovery/articleshow/122794915.cms?utm_source=chatgpt.com).**  
  
[GMX got hit for $42 million](https://rekt.news/gmx-rekt) (though most came back), [BigONE](https://rekt.news/bigone-rekt) and [WOO](https://rekt.news/woox-rekt) X suffered $27 million and $14 million respectively.  
  
Now BTC Turk joins the party fashionably late but stylishly destructive.

  
_The pattern isn't subtle: emerging market exchanges keep getting owned by the same fundamental failures while established players count their insurance money._  
  
**Meanwhile, hot wallet compromises have become so routine that Cyvers can detect them faster than exchanges can hit the emergency brake.**  
  

BTC Turk's attackers are still sitting on their multi-chain haul four days later, funds visible on every blockchain explorer but untouchable as Monopoly money.  
  
Watching stolen crypto sit there on public blockchains feels like staring at your car keys locked inside your car.  
  
_Everyone can see exactly where the money went, but good luck getting it back._

  
**Turkey's mess tells the real story about emerging markets: when your currency's losing value, even exchanges with questionable track records start looking like reasonable options.**

  
Desperation makes for terrible security audits.  
  

The industry keeps promising "lessons learned" after every major breach, but the lessons seem to have an expiration date shorter than fresh milk.  
  
**Multi-sig exists, hardware security modules exist, proper key management exists - yet here we are, watching another exchange explain how their "technical difficulties" somehow involved attackers walking away with enough money to buy a small island.**  
  

_When the cure for currency instability turns out to be just another form of gambling, who's really getting rekt here - the exchanges or the people who trusted them?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
