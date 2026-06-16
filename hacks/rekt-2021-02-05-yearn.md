---
tags:
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/perpetuals
  - sector/privacy
  - sector/stable
  - sector/vault
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Yearn - REKT"
protocol: "[[Yearn]]"
date: 2021-02-05
loss_usd: 11000000
auditors:
source: "https://rekt.news/yearn-rekt"
excerpt: "No protocol is too big to fail. The extreme power of flash loans makes blue chips fade to black. Even the mighty Yearn falls victim to the arbitrageur. Will Yearn be bailed out by CeFi?"
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Yearn - REKT

> **Loss:** $11,000,000 | **Date:** 2021-02-05 | **Audited by:** Unaudited

![](https://lh6.googleusercontent.com/2htMKXFnd_RYudETxssIO-ztLBIhBXwlq4jADQmX80p682WvwhLmjSjoYhE5spF_f_Yfan8DLIe4B2NwLLIec9tH5wt9H_RyRertgtKzELIVQrq3XTwFhwULAoP9BHzzmCeyqsWg)

**No protocol is too big to fail.**

_The extreme power of flash loans makes blue chips fade to black. An arbitrage attack on the Yearn DAI v1 vault shows that even our most experienced developers can still make mistakes._

The vault was attacked using 9 flash loans. $11 million was lost from the vault, $2.7m of which went to the attacker, $3.5m went to Curve liquidity providers, $3.5m went to Curve stakers, and $1.4m was paid in Aave v2 fees.

**DeFi systems are in constant flux. Increasingly intertwined protocols create an infinite machine with countless moving parts.**

The development of our industry moves at breakneck speed, and new ideas and potential attack vectors are uncovered everyday.

A constantly changing environment means even time tested products can’t guarantee absolute security.

**Falling victim to an arbitrageur must be humiliating for the team who were once seen as unbeatable, but there is no pleasure to be taken from pointing out flaws in the work of developers who create so much value in our field.**

The Yearn team have issued their version of a post-mortem, although flashloans are not mentioned.

Igor Igamberdiev gave a more detailed analysis of the attack on Twitter.

Attacker profit:

\- 513k DAI

\- 1.7M USDT

\- remaining 506k 3CRV (~$1)

The attacker executed 11 transactions.

1/ Flash loaned 116k ETH from dYdX

2/ Flash loaned 99k ETH from Aave v2

3/ Borrow 134M USDC and 129M DAI using ETH as collateral on Compound

4/ Add 134M USDC and 36M DAI to 3crv Curve pool

5/ Withdraw 165M USDT from 3crv Curve pool

6/ Repeat five times

\- Deposit 93M DAI to yDAI vault (less w/ each time)

\- Add 165M USDT to 3crv pool

\- Withdraw 92M DAI from yDAI vault (less w/ each time)

\- Withdraw 165M USDT from 3crv pool

7/ In the last time withdraw 39M DAI and 134M USDC instead USDT

8/ Repay Compound debts

9/ Repay flash loans

Each time the attacker had more 3crv tokens, which he was later able to swap for stablecoins.

Attacker contract: https://etherscan.io/address/0x62494b3ed9663334e57f23532155ea0575c487c5Attac

Tornado TX #1

https://etherscan.io/tx/0x7ee28e342573ff7b8fb4bd2e4373e742cf80d8f8c7f8764cc6b70439dc33f037

Tornado TX #2

https://etherscan.io/tx/0x13c12895d44f8b890af2187b93b97bec01dd34eeb026ac9669d8412e57d64446

Tornado TX #3

https://etherscan.io/tx/0x6b07e3faaa419ea5a3d58929e07b872f8529441064eb576d61ef5edd697f7256

Tornado TX #4

https://etherscan.io/tx/0xcacdc95bd65556426bae39025ddb1deafb65acb908be49fb7186bb750f7a369f

The profit opportunity was created because the withdrawal fee had been turned off for vault migration.
---

**Readers will know there’s nothing new about flash loan attacks**, and so will Yearn developers, who are competent enough to have prevented this from happening, suggesting this was just an opportunist taking advantage of a mistake made during the vault migration.

Gossip and drama remains high in the DeFi community; and many considered this attack to be a reprisal for Cronje’s earlier accusations of hypocrisy against Julien Bouteloup; one of the contributors to Stake DAO.

![](https://lh6.googleusercontent.com/JTjkSs0iTtatTK92Vs53mx1qb5FlCSkjxf9-BTxvo2BgB69Ftki6dPveLUvORlGpo4eH906UxH8ckMkkxwacqYO7e-itzE4eWMCZbbuQ4twuwni6lWYZAAwPaPJVInaOdAhqqxAH)

Although many of our readers (and your anonymous author) would secretly enjoy watching such a battle between the two developers, these accusations were proven to be false as the attackers account was funded and the contract written hours before this criticism was made.

![](https://lh6.googleusercontent.com/qK0b6N34P6dMIF4bt_pK08fPtPbcmI1dOmmXx3lThk76IKdsmEEyVpbl_5Yz9CqEFJoH4jQE0thf2uL30EnUd_h2Zq0ayyHk6PF14iiP7ZYSAzAktdMZzXTxA23UDgRt5IgUdcOE)

As two of the most prominent developers in our industry, there is bound to be some competition. Passion for their work and the responsibility of tying your reputation to code housing hundreds of millions of dollars puts working relationships under huge amounts of stress.

**It’s also worth remembering that not all of our best developers are on Twitter.**

---

**If a DeFi protocol receives refunds from a centralised company, at what point does it stop being DeFi?**

Tether has frozen 1.7M USDT that was stolen during the hack. In the past, Tether has reimbursed users who mistakenly lost money by sending tokens to the contract address.

**If Tether burns these stolen tokens and mints the equivalent in order to return the funds to Yearn, then they are no different to any central bank.**

Yearn developer @fubuloubu has spoken out against the use of Tether in the past, but seems to have changed his mind after their intervention.

![](https://lh4.googleusercontent.com/EQrZYxGPLP25hIXWLkUI5DUQbVBX8tDe6x_yOJf-P-ebQ9LvaRc0EXcN2N188mDCp1rXFMG92dq7l08jkrygHMXahVYECcHtNQbAcCwjVsWHeZPmhuC_gyRWfDXK2fSXWpVwGbay)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/02/image.png)

We all love decentralisation when it brings us profit, but refunds are best served centralised.

---

**This attack went straight to the heart of one of the biggest DeFi conglomerates, shaking the foundations of what was once seen as an impenetrable fortress.**

Even the best in the business make mistakes, but this should not deter us from encouraging them to build.

When tensions are high and DeFi teams begin to take sides against one another, we would all do well to zoom out and look at the bigger picture.

**We build weapons against [traditional finance](/cefi-rekt/). We should not oppress the flow of innovation by fighting amongst ourselves, when the real fight is [us vs them](/stable-coins-the-empire-strikes-back/).**

Eventually we will look back on this period with nothing but respect for all those who shared the vision at such an early stage

Last night, the first crack appeared in Yearn’s armour. Will their mistake make the community lose their faith, or can we all rally behind this giant of DeFi, and help them to grow even stronger?

![](https://lh5.googleusercontent.com/gwQf4mTtg264KPREnhva2DtM_OLqf7XuW2GCxxaHxhldpl46z-mwe5Mva9_Y61jzO5oIqO5GONSjtrQk-eTKtk1nQyaFnzcCaZm9oG-0dBxTOcCW_6hTAz2VkaI1_Oe6va25J5LD)
