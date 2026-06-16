---
tags:
  - blockchain/ethereum
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/privacy
  - sector/stable
  - vuln/logic/reward-calculation
  - novelty/variant
title: "Acala Network - REKT"
protocol: "[[Acala Network]]"
date: 2021-08-13
loss_usd: 1600000
auditors:
source: "https://rekt.news/acala-network-rekt"
excerpt: "The billion that wasn't. Tornado sanctions didn’t deter these Polkadot thieves, who tried to steal ~$1.3B in aUSD from Acala Network."
genome:
  - "[[reward-calculation]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Acala Network - REKT

> **Loss:** $1,600,000 | **Date:** 2021-08-13 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/08/acala-header.png)

**Edit 16/08/2022:**

In response to Acala Network’s announcement on its Spanish-language Twitter account, user @Jaumeelgran reached out to the team with a wallet screenshot displaying the vast majority of the erroneously minted aUSD, accompanied by the [following message](https://twitter.com/Jaumeelgran/status/1558718225382350848):

“_Hey, I’m an Acala holder since day one and there’s no risk from me, get in touch with me via official channels, this was a fault of the system, not mine as a user_”

Luckily the user had triggered the bug by mistake and has been cooperating with the Acala to [return and burn](https://twitter.com/AcalaNetwork/status/1559360833087488001) the excess aUSD. Other users profited from the same malfunction, amounting to approximately $1.6M in stolen funds. However, while still not back at peg, the price of aUSD has remained above $0.90 since the protocol was reactivated.
---

The one billion that wasn’t.  

Tornado sanctions didn’t deter these Polkadot thieves, who tried to steal ~$1.3B in [aUSD](https://www.coingecko.com/en/coins/acala-dollar) from [Acala Network](https://acala.network/ausd): the self-proclaimed “DeFi Hub of Polkadot”.  

However, Polkadot plays differently to Ethereum, and the transfers were quickly disabled _“until a pending Acala community governance decision resolves the error”._   

Meanwhile, the aUSD price chart shows an all too familiar pattern…

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/08/alcala-price.png)

Acala has yet to confirm the exact amount that was permanently stolen, as even with the disabled transfers, some funds still slipped through the net.

**Now we wait and we wonder, how much can Acala return or replace?**  
  
_And where should this go on the leaderboard?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**Acala stated that:**

>"We have identified the issue as a misconfiguration of the iBTC/aUSD liquidity pool (which went live earlier today) that resulted in error mints of a significant amount of aUSD,"

_and…_

>"The misconfiguration has since been rectified and wallet addresses that received the errorneously minted aUSD have been identified, with on-chain activity tracing in respect of these addresses underway."

Let’s take a look at this “misconfiguration”.

Credit: [@alice_und_bob](https://twitter.com/alice_und_bob)

The misconfigured iBTC - aUSD pool had recently concluded bootstrapping and begun to trade. It was incentivized with aUSD, ACA & INTR.

However, the _incentives.claim_rewards()_ extrinsic in Acala wrongfully minted [$aUSD](https://twitter.com/search?q=%24aUSD&src=cashtag_click) in exponential amounts (1.3B in total).  

While most of the attention has gone toward the one user who minted 1.2b aUSD _(greedy)_, at the same time a handful of other users exploited the situation by:  

a) sending $aUSD to Moonbeam.  

b) swapping for $DOT and sending it to Polkadot.  

c) swapping for $iBTC and sending it to Interlay.

The $iBTC/pool was almost completely drained, but the DOT pool managed to retain some of the value, because it was a DOT - LCDOT pool and users had to go through this route, which mitigated the damage. 

The two wallets that profited the most are listed below.

23bmUgSeKMD8Y9triphPw5YHuiz3QUJNqcbmb3Eg9QMQDMWN

253pFTg22JqHbLeLZupexGMDUuXAJLfEriTYkFqvGWPuwcFi

A few other users extracted value from the misconfiguration, but it is harder to tell if they did so with bad intent.

In total, $1.6M in “good value” was transferred off-chain, and $4.6M of “bad debt” in the form of wrongly minted $aUSD also left the chain.

**As Acala and Polkadot were able to so easily disable the stolen funds, we’re not left with not much to say.**

Like the stories of “compromised keys”, we simply wait and see what those in control decide to do.

Will wrongly minted [$aUSD](https://twitter.com/search?q=%24aUSD&src=cashtag_click) be destroyed?

Will they have to roll back the chain?

**And where should this story go on the leaderboard?!**

We’ll let our [Telegram group](https://t.me/Rekt_HQ) members decide.

_Probably._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
