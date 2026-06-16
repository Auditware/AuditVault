---
tags:
  - sector/dex
  - sector/privacy
  - sector/staking
title: "Bent Finance - REKT"
protocol: "[[Bent Finance]]"
date: 2021-12-21
loss_usd: 1750000
auditors:
source: "https://rekt.news/bent-finance"
excerpt: "Who has been bending the rules at Bent Finance? ~$1.75M taken. Inspector rekt sets things straight."
genome:
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# Bent Finance - REKT

> **Loss:** $1,750,000 | **Date:** 2021-12-21 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/bent-header.png)
**Another project bent out of shape.**

This time, it seems, due to structural failure from within.

**[Bent Finance](https://app.bentfinance.com/) is a "staking and farming platform to enhance your curve returns."** 

**Over the past few weeks, one address has been bending the rules of the protocol, extracting ~$1.75M before things were straightened out.**

When the news broke, and the price of [$BENT](https://www.coingecko.com/en/coins/bent-finance) buckled, the team issued a luke-warm [warning](https://twitter.com/BENT_Finance/status/1473109745942687745) informing users that rewards had been paused, _but no funds had been lost._

**However, when PeckShield [claimed](https://twitter.com/peckshield/status/1473175071560994816) to have identified the exploit as coming from within…**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/bent-peckshield.png)

**…the team was forced to release an [update](https://twitter.com/BENT_Finance/status/1473188374492053505), which could be read as accusations of an inside job:**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/bent-tweet.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [BlockSecTeam](https://twitter.com/BlockSecTeam/status/1473188863136780288?s=20)_

Rather than a technical smart contract manipulation, this case is far more simple.

Bent Finance [cvxCRV contract](https://etherscan.io/address/0x270b6aff561284ef380cdd6d8b036f4981049a86) was [updated](https://etherscan.io/tx/0xf711641ea9814d78780c8a51ad734ad44d58baf3f97256a3f5ec3200a29eadc7) on Nov. 30, manually adjusting the balance of the exploiter’s [address.](https://etherscan.io/address/0xd23cfffa066f81c7640e3f0dc8bb2958f7686d1f)

**This assigned the exploiter enormous amounts of rewards, far exceeding the TVL of Bent Finance itself.**

**Despite the exploit being live for almost three weeks, the problem only became clear with Bent Finance’s recent listing on [DeBank](https://twitter.com/DeBankDeFi/status/1473077001267253248), when the exploiter’s [wallet profile](https://debank.com/profile/0xd23cfffa066f81c7640e3f0dc8bb2958f7686d1f) showed the billions of dollars-worth of pending rewards on the platform.**

Looking at the main wallet’s token [transactions](https://etherscan.io/tokentxns?a=0xd23cfffa066f81c7640e3f0dc8bb2958f7686d1f), we see a handful of small deposits, followed by some very large withdrawals, one on [Dec. 12](https://etherscan.io/tx/0x11961c4df0b27bd7188d451dd18005dc8aff7ad4a80c7f7441b56495cae219c5) (of 263k cvxcrv-f) and another [today](https://etherscan.io/tx/0x52d4d5a9a83ff8ca6a7fd102954c4c5d2658043d9049abfc47cd8c37692b95be) at 02:45 AM +UTC (of 250k cvxcrv-f).

The tokens were then sent on to the exploiter’s [secondary address](https://etherscan.io/address/0x9e966a54082427d7ac56aeaee4baae7d11a6e468), where they were cashed out for CRV, swapped for ETH and sent to Tornado Cash.

**In total, 440 ETH (~$1.75M) has been washed via Tornado Cash between 12/12 and today.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/bent-linebreak.png)

**The role that DeBank’s listing of Bent Finance played in today’s case and Nansen’s recent [$75M raise](https://www.theblockcrypto.com/post/127747/data-startup-nansen-secures-fresh-funding-at-750-million-valuation) show the value that these services bring to an increasingly more complex industry.**

Although on-chain data provides all the necessary information to those with the knowledge (and motivation) to investigate, these tools vastly increase the probability of spotting irregularities in lower profile projects.

However, in the case of Bent Finance, given the source of the exploit, as well as the team’s response, this looks likely to be an inside job:

_Rug pull or rogue team member?_

[Much](https://rekt.news/ascendex-rekt/) [bigger](https://rekt.news/vulcan-forged-rekt/) [hacks](https://rekt.news/grim-finance-rekt/) have dominated the headlines recently, and incidents such as this will soon be forgotten.

_Maybe that’s what the Bent Finance team is counting on…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
