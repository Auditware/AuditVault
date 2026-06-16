---
tags:
  - blockchain/arbitrum
  - blockchain/polygon
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
title: "Lodestar Finance - REKT"
protocol: "[[Lodestar Finance]]"
date: 2022-12-10
loss_usd: 6500000
auditors:
source: "https://rekt.news/lodestar-rekt"
excerpt: "Lodestar Finance is the latest victim of the mass market manipulation that has affected both people and protocols across our industry. Lending pools drained for $6.5M put Lodestar at number 77 on the "
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[chainlink-round-completeness]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[twap-collateral-valuation]]"
---
# Lodestar Finance - REKT

> **Loss:** $6,500,000 | **Date:** 2022-12-10 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/12/lodestar-header.png)

**[Lodestar Finance](https://www.lodestarfinance.io/), a Compound fork on Arbitrum, is the latest victim of the mass market manipulation that has affected both people and protocols across our industry.**

  
On Saturday, the price oracle of plvGLP collateral was manipulated, allowing the attacker to drain their lending pools for a profit of ~$6.5M.

  
According to the [official announcement](https://twitter.com/lodestarfinance/status/1601686921566375936), “_2.8 Million of the GLP is recoverable, which is worth about $2.4 million._” The team has [appealed](https://twitter.com/LodestarFinance/status/1601697374937939968) to the hacker to negotiate a white-hat bounty.
  
**The incident saw the token [LODE](https://www.coingecko.com/en/coins/lodestar) dump by ~70% and [TVL](https://defillama.com/protocol/lodestar-finance) drop to just $11.**
  
_That’s [#77 on the leaderboard](https://rekt.news/leaderboard/) for Lodestar Finance._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Among Lodestar’s collateral assets is the yield-bearing plvGLP, representing GLP locked in [Plutus DAO](https://plutusdao.io/)’s vault. Using flash loans, the attacker manipulated the plvGLP price reported by Lodestar’s GLPOracle contract, allowing them to “borrow” all the funds supplied on the platform.

  

The Lodestar [docs](https://docs.lodestarfinance.io/documentation/security) state that:

  

>we are relying on Chainlink Oracles for accurate pricing **(with the exception of plvGLP)**

  

_An inviting note for any would-be attackers…_

  

**[Solidity Finance](https://twitter.com/SolidityFinance/status/1601684153740963840) summarised the root cause:**

  

>The GLPOracle did not properly take into account the impact of a user calling donate() on the GlpDepositor contract, which inflates the assets of the GlpDepositor contract, and therefore the oracle-delivered price of the plvGLP token.

  

Lodestar’s preliminary post mortem [gives](https://blog.lodestarfinance.io/post-mortem-summary-13f5fe0bb336?gi=9d8175e9c79c) further details of the exploit, as well as pointing out that “_the oracle can’t be allowed to undergo instantaneous change within the same block._”

  

Certik’s [report](https://www.certik.com/resources/blog/TqTyq4vYHl8JzS7zyJye9-lodestar-finance-incident-analysis) contains a full step-by-step of the attack flow.

  

**Attacker’s address [0xc29d94386ff784006ff8461c170d1953cc9e2b5c](https://arbiscan.io/address/0xc29d94386ff784006ff8461c170d1953cc9e2b5c)**

  

**Example exploit tx:** [0xc523c630…](https://arbiscan.io/tx/0xc523c6307b025ebd9aef155ba792d1ba18d5d83f97c7a846f267d3d9a3004e8c)

  

The 343 ETH ($430k) necessary for the attack was bridged [from](https://etherscan.io/address/0x7093486a8b4624b9f5501b7cd7a60545e02e9164) Polygon three months ago. Following the exploit, the funds were swapped to ETH, bridged back to mainnet and dispersed to [multiple addresses](https://etherscan.io/address/0xb50f58d50e30dfdaad01b1c6bcc4ccb0db55db13).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 


**Manipulating the price of collateral has been a popular attack technique since the beginning of DeFi, but especially in recent times, as this incident follows the attacks on both [Mango](https://rekt.news/mango-markets-rekt/) and [Moola](https://rekt.news/moola-markets-rekt/) Markets, who lost $115M, and $8.4M respectively, in October.**

  

The above examples had funds partially or fully returned, ensuring users didn’t totally lose out. Yet two days have now passed since the initial attack on Lodestar, and no mention of any planned reparations has yet been made.

  

_Forking an existing project, even long-standing and resilient protocols, does not guarantee the same security._

  

But this paragraph in the Lodestar [documentation](https://docs.lodestarfinance.io/documentation/security) suggests they may not have realised as such…

  

>Lodestar is a Compound fork at the core, and Compound has some of the most battle-tested contracts in all of DeFi. We have added code to support a few changes we have made, namely adding Arbitrum support, DPX, MAGIC and plvGLP support, tweaking some Interest Models, and a few other small changes.

  

**Time is the best security audit of all, but smart contract changes render even the most time-tested protocols open to new vulnerabilities.**

  

_Another market manipulated, more millions misplaced, and the market manipulators move on…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
