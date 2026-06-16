---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/infra
  - sector/lending
  - sector/oracle
  - sector/stable
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
title: "Rho Market - Rekt"
protocol: "[[Rho Market]]"
date: 2024-07-19
loss_usd: 7500000
auditors:
source: "https://rekt.news/rho-market-rekt"
excerpt: "An oracle's misconfiguration turns into a $7.5 million windfall for an alert MEV bot. What began as a simple misstep in Rho Market's oracle configuration turned into a payday for an opportunistic MEV "
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[bridge-message-validation]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Rho Market - Rekt

> **Loss:** $7,500,000 | **Date:** 2024-07-19 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/rhomarket-header.png)



_An oracle's misconfiguration turns into a $7.5 million windfall for an alert MEV bot._

  

**What began as a simple misstep in Rho Market's oracle configuration turned into a payday for an opportunistic MEV bot on July 19th, as it swiftly seized upon the opening within the protocol built on Scroll.**

  

In the high-stakes world of DeFi, even the slightest miscalculation can lead to catastrophic losses.  
  
Millions can vanish in the blink of an eye.

  

In this digital Wild West, MEV bots are the new gunslingers, their algorithms primed to outdraw any protocol that leaves its vault unlocked.

  

**But when the quick-draw artist holsters their gun and offers to return the loot, who's really the outlaw in this digital frontier?**

  

_Is it still an exploit if the attacker offers to give it all back?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [CJ the "Doughnut"](https://x.com/CJCJCJCJ_/status/1814242147685863600), [ZachXBT](https://x.com/zachxbt/status/1814262548109373922), [Scroll](https://x.com/Scroll_ZKP/status/1814275555681771784), [Rho Markets](https://x.com/RhoMarketsHQ/status/1814250369637294258), [DefiLlama](https://defillama.com/protocol/rho-markets#information), [Sudo](https://x.com/pcaversaccio/status/1814288272303993216), [Miszke](https://x.com/miszke_eth/status/1814323359607361707)_

  

**Oracles are the eyes and ears of smart contracts, providing crucial off-chain data to on-chain systems. But when these digital soothsayers falter, chaos ensues.**  
  
According to [DeFiLlama](https://defillama.com/protocol/rho-markets#information), Rho Markets is a fork of Compound Finance and held approximately $38 million worth of assets shortly before the exploit.

  

Compound itself was at the heart of last week’s [panic](https://protos.com/compound-finance-and-celer-network-websites-compromised-in-front-end-attacks/) over the wave of front-end hijacking incidents on popular DeFi platforms.

  

Rho Market's oracle misconfiguration allowed an MEV bot to manipulate price data, creating an arbitrage opportunity that drained $7.5 million from the protocol in a matter of minutes.  
  
_[First reported](https://x.com/CJCJCJCJ_/status/1814242147685863600) by CJ the “Doughnut”, who noted that the platform was drained of USDC and USDT._  
  
**CJ linked to the [possible attacker’s address](https://debank.com/profile/0xe000008459b74a91e306a47c808061dfa372000e), which showed a gain of $7.5 million over the past hours.**  
  
[Rho Markets acknowledged](https://x.com/RhoMarketsHQ/status/1814250369637294258) the unusual behavior and paused the platform.  
  
The incident prompted Scroll, the L2 network hosting RhoMarket, to [temporarily halt the chain](https://x.com/Scroll_ZKP/status/1814275555681771784).

  
[ZachXBT highlighted](https://x.com/zachxbt/status/1814262548109373922) that “Exploiter has a ton of exposure to centralized exchanges so would say there’s a good probability this gets recovered and they are gray or white hat.”

  

**Zach was not too far from the mark, as [he shared](https://x.com/zachxbt/status/1814286415347544211) an [on chain message](https://etherscan.io/tx/0xab7bc87fca7df222000b870fbe55750c33b3ea0461a8ba8a8ddbe530a1934248) shortly after:**  
  
_“Hello RHO team, our MEV bot have profited from your price oracle misconfiguration. We understand that the funds belong to users and are willing to fully return. But first we would like you to admit that it was not an exploit or a hack, but a misconfiguration on your end. Also, please provide what are you going to do to prevent it from happening again?”_  
  
They honored their word and the [funds were returned](https://scrollscan.com/tx/0x15da6af0207d82d27ca20a542dae1b81580ca1cbfee7028c312229968e356446) shortly after.

  

[Rho Markets confirmed](https://x.com/RhoMarketsHQ/status/1814338976318386324) that the issue was resolved, without any loss of funds and they are currently reassigning funds back to the borrow pools.

  

**In response to the recent events, Rho Markets has outlined the following three-step plan:**

  

-   Identify accounts that supplied funds during the oracle malfunction.
    
-   Replenish the USDC, USDT, and wstETH pools to restore affected balances.
    
-   Reinstate borrowing and transfer functionalities while adhering to strict security protocols.
    

  
While a prior security audit had identified potential vulnerabilities in the protocol's oracle implementation, the incident stemmed from a human error during deployment rather than a code flaw. 
  
**In a space where censorship-resistance and permissionless are more than just buzzwords, incidents like these force us to confront uncomfortable truths about the current state of blockchain infrastructure.**

  

_While Rho Market dodged a bullet this time thanks to a benevolent bot operator, will the next white hat be so generous?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




**The recent DeFi debacle not only exposed oracle misconfiguration issues but also reignited the debate on decentralization in Layer 2 solutions.**

  

_As Rho Market's blunder prompted Scroll to halt its chain, [Sudo pointed out](https://x.com/pcaversaccio/status/1814288272303993216) that L2s touting permissionless and censorship-resistant values are merely posturing to attract VC money, making L1 Ethereum's genuine decentralization all the more appealing._  
  
L2 operators now face a catch-22, censor to save funds and risk centralization accusations or stay true to permissionless ideals at the users' expense.

  

With centralized sequencers and provers becoming common on L2s, [liability concerns grow](https://x.com/miszke_eth/status/1814332489034301752) as operators potentially become centralized failure points vulnerable to legal and regulatory pressure.

  
**While Layer 2 solutions promise scalability and decentralization.**  
  
_Are we building a censorship-resistant future or just creating a more efficient version of the systems we aimed to replace?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
