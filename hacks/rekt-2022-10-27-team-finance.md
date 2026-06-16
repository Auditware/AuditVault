---
tags:
  - sector/dex
  - sector/governance
  - has/audit
  - trigger/low-liquidity
title: "Team Finance - REKT"
protocol: "[[Team Finance]]"
date: 2022-10-27
loss_usd: 15800000
auditors:
  - "[[Zokyo Security]]"
source: "https://rekt.news/teamfinance-rekt"
excerpt: "There’s no $ in Team. Four projects got rugged through their shared anti-rug mechanism. $15.8M lost, and number 46 on the leaderboard. Go Team."
genome:
  - "[[trigger/low-liquidity]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
---
# Team Finance - REKT

> **Loss:** $15,800,000 | **Date:** 2022-10-27 | **Audited by:** Zokyo Security

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/teamfi-header.png)

**Four projects got rugged through their shared anti-rug mechanism.**  
  

[Team Finance](https://twitter.com/TeamFinance_), the self-proclaimed “_Industry Leader In Project Security & Automation_”, lost [$15.8M](https://twitter.com/peckshield/status/1585587858978623491?s=20&t=JIa5322R7nAnqNfbcBT_ag) of funds that it was supposed to be safeguarding.

  

Of the four pools drained, [FEG](https://twitter.com/FEGtoken), [Caw](https://twitter.com/CommunityCaw), and [Kondux](https://twitter.com/Kondux_KNDX) were the worst hit. [Tsuka](https://twitter.com/Dejitaru_Tsuka/) was also affected, but experienced less price impact due to a secondary [liquidity pool on Uniswap v3.](https://twitter.com/Dejitaru_Tsuka/status/1585578999484399618)

The project’s website claims to protect over $2.5B of assets, but considering the low liquidity of their selection of shitcoins, we can consider this claim to be optimistic at best.  
  
**#46 on the [leaderboard](https://rekt.news/leaderboard/).**

  

_Teamwork._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)


_Credit: [Peckshield](https://twitter.com/peckshield/status/1585587858978623491)_

  

The [announcement](https://twitter.com/TeamFinance_/status/1585562380591063043) of the hack explained that the exploit targeted “_the audited v2 to v3 migration function._”

  

The vulnerability was contained in one of the [Liquidity Locks](https://docs.team.finance/token-locks/liquidity-locks)’ “bulletproof smart contracts” which allowed projects to migrate locked LP positions from Uni v2 to Uni v3.

  

According to Peckshield’s [analysis](https://twitter.com/peckshield/status/1585587858978623491):

  

>The protocol has a flawed migrate() that is exploited to transfer real UniswapV2 liquidity to an attacker-controlled new V3 pair with skewed price, resulting in huge leftover as the refund for profit. Also, the authorized sender check is bypassed by locking any tokens.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/teamfi-code.png)


**The breakdown of the loss to each project’s Uniswap v2 pool is as follows:**

  

$11.5M CAW

  

$1.7M TSUKA

  

$0.7M KNDX

  

$1.9M FEG

  

**Exploiter address 1:** [0x161cebb807ac181d5303a4ccec2fc580cc5899fd](https://etherscan.io/address/0x161cebb807ac181d5303a4ccec2fc580cc5899fd)

  

**Exploiter address 2 (containing stolen funds):** [0xba399a2580785a2ded740f5e30ec89fb3e617e6e](https://etherscan.io/address/0xba399a2580785a2ded740f5e30ec89fb3e617e6e)

  

**Attack tx:** [0xb2e3ea72…](https://etherscan.io/tx/0xb2e3ea72d353da43a2ac9a8f1670fd16463ab370e563b9b5b26119b2601277ce)

  

**Attacker’s contract:** [0xcff07c4e6aa9e2fec04daaf5f41d1b10f3adadf4](https://etherscan.io/address/0xcff07c4e6aa9e2fec04daaf5f41d1b10f3adadf4)

  

The vulnerable migrate() function was included in Zokyo Security’s [audit](https://github.com/trustswap/audits/blob/main/TrustSwap%20(token%20lock)%20audit%20report.pdf) of Team Finance contracts from August this year.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**“DAO tooling” was amongst the most popular buzzwords throughout the last cycle.**

For small, anon teams working on innovative protocols, it may be tempting to outsource trust to a third party. But given the array of shitcoins “secured” by Team Finance, the vaults seem more likely to be a way for projects to appear trustworthy by proxy.

**Now that it’s clear that trust has been lost.**

_Will this protocol take one for the team and reimburse the victims, or is it every man for himself?_

**There’s no $ in Team.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
