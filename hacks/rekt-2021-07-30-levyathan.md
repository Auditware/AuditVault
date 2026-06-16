---
tags:
  - sector/governance
  - sector/multisig
  - sector/privacy
  - sector/staking
  - sector/token
  - vuln/logic/reward-calculation
  - precondition/insider
  - novelty/variant
title: "Levyathan - REKT"
protocol: "[[Levyathan]]"
date: 2021-07-30
loss_usd: 1500000
auditors:
source: "https://rekt.news/levyathan-rekt"
excerpt: "Levyathan Finance sank last week, along with its TVL of $1.5M. Basic errors lead to total destruction. Bad intentions or just raw incompetence? You decide."
genome:
  - "[[reward-calculation]]"
  - "[[insider]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[reward-accounting]]"
---
# Levyathan - REKT

> **Loss:** $1,500,000 | **Date:** 2021-07-30 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/levy-header.png)

**Another TVL taken by a mysterious monster.**

[Levyathan.finance](https://www.levyathan.finance/) sank last week, along with its TVL of $1.5M.

The team have since issued a few tone-deaf tweets and long-winded Medium posts trying to shift the blame, but we’ll tell you how we see it.

**The Levyathan developers left the private keys to a wallet with minting capability available on Github.** 

[~Four months](https://github.com/levyathan-finance/governance/blob/master/hardhat.config.ts) later, these keys were used to mint and dump LEV into oblivion.

Afterwards, when users tried to redeem what was left of their money, a bug in the withdrawal mechanism meant that their worthless tokens were also irretrievable... 

>“Have a nice day”

_[Said](https://twitter.com/Levyathan_index/status/1421194683900891136?s=20) the Levyathan admins._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/levy-price.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/levy-investigates.png)

**The [official post-mortem](https://levyathan-index.medium.com/post-mortem-levyathan-c3ff7f9a6f65) is almost irrelevant when you realise that they made it so easy for anyone to mint their token.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/levy-privkeys.png)

**As a result of the exploit, users were forced to use emergencyWithdraw() to attempt to retrieve their staked tokens.**

However, the emergencyWithdraw() logic contained a bug which referenced rewardDebt (a variable related to reward calculation) instead of user.amount as the quantity of tokens to be withdrawn.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/levy-withdraw.png)

**Some users who were quick to [withdraw](https://bscscan.com/tx/0x03c1ba947d451a8c7beff8ba09d6b505c84d8fee31462bb02ee0b07e9ca4c06b) in this way noticed that they were receiving more tokens than expected, and continued to withdraw more and more LEV, depleting the contract and leaving nothing for those who came later.**

In their post mortem Levyathan provided an [address](https://bscscan.com/address/0x6cadA45b257DA674f1169B4e68A59765226Fc9aE) to which users could return funds ”in an anonymous manner", which has received 3 billion dog tokens and one PLUGANAL. 

The team later on provided a second [address](https://www.bscscan.com/address/0xf3381970372fcA75270C0d67956Fd8D6304377D7) which has so far received ~150,000 BUSD _([coming from the first address provided by the Levyathan team](https://bscscan.com/token/0xe9e7cea3dedca5984780bafc599bd69add087d56?a=0x3b5d5bb99258990313d9d620bf5ffb68603cfff9))_.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/levy-linebreak.png)

**What a shitshow.**

Leaving clearly labelled private keys visible on a public repo is unthinkable. 

Especially when they grant access to total control _(no multisig)_ over your protocol’s native token.

In their latest clumsy [communication](https://levyathan-index.medium.com/levyathan-what-future-for-the-project-1e345539972d), the Levyathan team pointed out the fact that as the private keys were publicly available, we can be sure “that it was not an inside job”.

Until they said that, we had assumed incompetence, but could the Levyathan team be stupid enough to to try and set up this “exposed keys” situation as an alibi?

_You decide..._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
