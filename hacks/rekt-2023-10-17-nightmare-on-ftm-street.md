---
tags:
  - blockchain/avalanche
  - blockchain/bitcoin
  - blockchain/bsc
  - blockchain/fantom
  - sector/bridge
  - sector/lending
title: "Nightmare on FTM Street"
protocol: "[[Nightmare On Ftm Street]]"
date: 2023-10-17
loss_usd: 7500000
auditors:
source: "https://rekt.news/nightmare-ftm"
excerpt: "Halloween came early this year for the Fantom Foundation. $7.5M was drained from multiple associated addresses, though the Foundation states that only $550k of the losses were theirs. When did DeFi be"
genome:
  - "[[bridge-message-validation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Nightmare on FTM Street

> **Loss:** $7,500,000 | **Date:** 2023-10-17 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/nightmare-header.png)

_Halloween came early this year for the Fantom Foundation._

**Over $7M was drained from multiple Fantom Foundation-labelled wallets were drained yesterday.**

Fantom’s semi-retired figurehead Andre Cronje quickly [clarified](https://twitter.com/theblockupdates/status/1714291919784984616) that the thefts affected an employee, rather than the Foundation itself.

**However, the Foundation’s [acknowledgement](https://twitter.com/FantomFDN/status/1714337765502992798) of the incident which came three hours later _did_ admit to a $550k loss.**

_There’s been plenty of rushed messaging this week…_

The statement went on to explain that some of the affected addresses were “_no longer utilized_” Foundation Wallets, which had been “_reassigned_” to an employee.

_Why not use new addresses?_

With the Fantom Foundation never publicly disclosing their wallet addresses, even after their [claims](https://andrecronje.medium.com/fantom-an-inside-financial-peak-at-being-a-crypto-company-323d29fb5e81) of having 30+ years of runway (thanks to farming 2020’s DeFi Summer), we’ll just have to take Cronje and the Foundation’s word for it.

_When did DeFi become ‘trust, don’t verify’?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Tayvano](https://twitter.com/tayvano_/status/1714433055446962484), [Spreek](https://twitter.com/spreekaway/status/1714282750830928176)_

**Starting just before 4am UTC yesterday, at least 12 addresses were drained across five chains: ETH, FTM, OP, BSC and AVAX.**

While it remains unknown precisely how the attacker(s) gained access, the fact that multiple associated addresses were drained in short succession may [suggest](https://twitter.com/tayvano_/status/1714433055446962484) a compromised password manager, potentially [LastPass](https://twitter.com/tayvano_/status/1611131253344079872).

_The initial [explanation](https://t.me/Fantom_English/806363), which came via a FTM Foundation TG admin, of a “_zero day exploit on crome_” doesn’t sound so plausible, after all._

Attacker [addresses](https://twitter.com/tayvano_/status/1714433150896754843) (totalling $7.5M):

0x1d93c73d575b81a59ff55958afc38a2344e4f878 ([ETH](https://etherscan.io/address/0x1d93c73d575b81a59ff55958afc38a2344e4f878), [FTM](https://ftmscan.com/address/0x1d93c73d575b81a59ff55958afc38a2344e4f878), [OP](https://optimistic.etherscan.io/address/0x1d93c73d575b81a59ff55958afc38a2344e4f878))

0x2f4f1d2c5944dba74e107d1e8e90e7c1475f4001 ([ETH](https://etherscan.io/address/0x2f4f1d2c5944dba74e107d1e8e90e7c1475f4001), [FTM](https://ftmscan.com/address/0x2f4f1d2c5944dba74e107d1e8e90e7c1475f4001), [OP](https://optimistic.etherscan.io/address/0x2f4f1d2c5944dba74e107d1e8e90e7c1475f4001), [AVAX](https://snowtrace.io/address/0x2f4f1d2c5944dba74e107d1e8e90e7c1475f4001), [BSC](https://bscscan.com/address/0x2f4f1d2c5944dba74e107d1e8e90e7c1475f4001))

0xdadc0421ee1b5426fca3db22f0a94a3bad5a329d ([ETH](https://etherscan.io/address/0xdadc0421ee1b5426fca3db22f0a94a3bad5a329d), [FTM](https://ftmscan.com/address/0xdadc0421ee1b5426fca3db22f0a94a3bad5a329d))

**Attacker consolidation address on ETH (holds 4.5k ETH, $7.1M): [0x0b1f29df74a19c44745862ab018d925501fe9596](https://etherscan.io/address/0x0b1f29df74a19c44745862ab018d925501fe9596)**

_For a full list of victim addresses, labels and relationships, see [Tay’s thread](https://twitter.com/tayvano_/status/1714433976193204224). Beosin also provided a [summary table](https://twitter.com/BeosinAlert/status/1714326758894551477)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_The mixed messaging around the incident was bound to lead to some slight errors in reporting._

However, given the $100M+ in [liquidations](https://www.coindesk.com/markets/2023/10/16/bitcoin-momentarily-hits-30k-on-false-spot-etf-approval-report-leads-to-100m-liquidations/) caused by Cointelegraph’s [unsourced](https://twitter.com/zachxbt/status/1713949999476711883) Bitcoin ETF announcement on Monday, you’d have thought they would be being [tweeting](https://twitter.com/Cointelegraph/status/1714385797443707383) extra carefully.

**[Apparently not.](https://twitter.com/spreekaway/status/1714389330301534473)**

For a website that holds itself to “_high journalistic standards_”, [blaming](https://cointelegraph.com/news/clarification-sharing-false-spot-bitcoin-etf-news) the social media team (_as well as [“the society” and “the technology”](https://twitter.com/timweb3_/status/1713934853652054399) at large_) should probably be followed up by fact-checking tweets…

_…at least for a couple of days…_

_…and against the article it refers to._

---

**Bad luck seems to haunt the Fantom ecosystem like a spectre.**

Cronje may have [boasted](https://andrecronje.medium.com/fantom-an-inside-financial-peak-at-being-a-crypto-company-323d29fb5e81) of the Foundation’s treasury holdings last year, presumably to bolster confidence in the ecosystem in the wake of the uncertainty which followed FTX’s blowup.

But, assuming the funds (_which apparently include over $100M in stables_) are still there, the Foundation now holds far more than the chain’s entire TVL, which has been gradually bleeding from over $500M earlier this year, to just $40M today.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/nightmare-chart.png)

**A general downtrend was punctuated [in July](https://rekt.news/multichain-rekt2/) by the Multichain debacle.**

Now, whether for good reason or not, yesterday’s news has [spooked](https://twitter.com/hackenclub/status/1714519432725193149) users once more.

_Is FTM cursed?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
