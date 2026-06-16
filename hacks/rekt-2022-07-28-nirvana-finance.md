---
tags:
  - blockchain/solana
  - sector/bridge
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/stable
  - has/audit
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Nirvana Finance - REKT"
protocol: "[[Nirvana Finance]]"
date: 2022-07-28
loss_usd: 3500000
auditors:
  - "[[Sec3 Auto Audit Software]]"
source: "https://rekt.news/nirvana-rekt"
excerpt: "Nirvana Finance lost $3.5M yesterday to a flash loan attack. It seems Solana’s relevance is waning, but will Nirvana get a chance at reincarnation?"
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Nirvana Finance - REKT

> **Loss:** $3,500,000 | **Date:** 2022-07-28 | **Audited by:** Sec3 Auto Audit Software

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/nirvana-header.png)

**Nirvana Finance lost $3.5M yesterday to a flash loan attack.**

_Is this “[DeFi 3.0](https://twitter.com/nirvana_fi)”?_

The recently-launched, Solana-based protocol claims that it “_transforms risk into reward_” whilst boasting a “_known maximum downside and unlimited upside._”

_Who knew that the maximum downside could be almost -90%..._

The team eventually [announced](https://twitter.com/nirvana_fi/status/1552629332023152641) the loss, hours after the news had been [broken](https://twitter.com/0xFA2/status/1552576598506762240) by the SolanaFM team. However, a post mortem is yet to be published.

As in the case of [Crema Finance](https://rekt.news/crema-finance-rekt/), the exploiter made use of flash loans from [Solend](https://twitter.com/solendprotocol/status/1552596718864465920), the lending protocol which found itself in a [governance crisis](https://twitter.com/lex_node/status/1538619072438411264) last month.

**The Nirvana team has made an [appeal](https://twitter.com/nirvana_fi/status/1552761630127177730) to the hacker to return the funds.**

_But will the hacker choose the path of enlightenment?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [0xFA2](https://twitter.com/0xFA2/status/1552576598506762240), [OtterSec](https://twitter.com/osec_io/status/1552589378719207424)_

The attacker took a $10M flash loan from Solend, which was then used to mint ANA, inflating the price of ANA from ~$8 to ~$24.

The overpriced ANA was then used to cashed out USDT via Nirvana’s treasury, netting the exploiter ~$3.5M in profit, on top of the flash loaned amount.

The stolen funds were then bridged via Wormhole to the attacker’s [ETH address](https://etherscan.io/address/0xb9ae2624ab08661f010185d72dd506e199e67c09), where they remain at the time of writing.

**Attacker’s address:** [76w4SBe2of2wWUsx2FjkkwD29rRznfvEkBa1upSbTAWH](https://solana.fm/address/76w4SBe2of2wWUsx2FjkkwD29rRznfvEkBa1upSbTAWH)

**Attack tx:** [LyUnvdY9…](https://solana.fm/tx/LyUnvdY9KBQiVRFqmSzGUfCuPGqYX1xNHCWLWxWZ4MvgLcNis2Kui6T25Ayai5UzpTAFkSRSgriKb3pM8tAoeR5?cluster=mainnet-qn1)

**Nirvana’s Treasury contract:** [CxuuSEv67PzNkMxqCvHeDUr6HKaadoz8NhTfxbQSJnaG](https://solana.fm/address/CxuuSEv67PzNkMxqCvHeDUr6HKaadoz8NhTfxbQSJnaG)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

Following last year’s SBF-pumped success of [Solana summer](https://rekt.news/spotlight-on-solana/), ever since the [Wormhole hack](https://rekt.news/wormhole-rekt/), it seems that Solana’s relevance has been waning.

**As VCs move on to the [latest retail-bait L1](https://www.coindesk.com/business/2022/07/25/aptos-labs-raises-150m-to-revive-diem-in-ftx-ventures-led-funding-round/) promising fast transactions and endless scalability, will projects like these prove to be the last cash-grabs of an ecosystem past its prime?**

Nirvana’s [docs](https://docs.nirvana.finance/mechanics/summary) read like a glossary of DeFi buzzwords and statements like “_ANA protects its holders against catastrophic stablecoin depegging_” and “_The ANA token cannot go to zero_”

**The charts beg to differ.**

“Superstable” [NIRV](https://www.coingecko.com/en/coins/nirvana-nirv):

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/nirvana-nirv.png)

“Reserve-backed” [ANA](https://www.coingecko.com/en/coins/nirvana-ana):

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/nirvana-ana.png)

From the hyperbole to the “[automatic audit](https://uploads-ssl.webflow.com/62acc2bbfa68c06f0b46f628/62c729b1b482b308072715b2_nirvana-audit-certificate.pdf)” completed earlier this month, this protocol doesn’t seem built to last…

A user on Solana Forums may have put it best with the following [comment](https://forums.solana.com/t/what-does-nirvana-do/7434):

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/nirvana-forum.png)

The team seem to have [made peace](https://twitter.com/nirvana_fi/status/1552668321962762242) with the fate of their tokens, only time will tell if they’ll get a chance at reincarnation.

Oh well...

_Nevermind._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
