---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - has/audit
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
title: "Elephant Money - REKT"
protocol: "[[Elephant Money]]"
date: 2021-04-12
loss_usd: 22200000
auditors:
  - "[[Solidity Finance]]"
source: "https://rekt.news/elephant-money-rekt"
excerpt: "An audit couldn’t protect Elephant Money from the on-chain poachers. Solidity Finance failed to notify Elephant about a vulnerability which was later exploited for $22.2M."
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Elephant Money - REKT

> **Loss:** $22,200,000 | **Date:** 2021-04-12 | **Audited by:** Solidity Finance

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/04/elephant-header.png)

**An audit couldn’t protect Elephant Money from the on-chain poachers.**

[Solidity Finance](https://solidity.finance/audits/ElephantMoney/) failed to notify Elephant about a price manipulation vulnerability, which was then exploited in a flash loan attack that this Elephant _will_ want to forget.

The [official post-mortem](https://medium.com/elephant-money/reserve-exploit-52fd36ccc7e8) stated a loss of $11.2M, yet [Peckshield](https://twitter.com/peckshield/status/1514023036596330496) later pointed out that Elephant had chosen not to include the loss of ~30 billion ELEPHANT tokens, bringing the total amount lost to $22.2M.

“DO NOT SELL” [say Elephant Money](https://twitter.com/ElephantStatus/status/1514007291116199936?s=20&t=rwVlFzi-S1G4wOW4K3-yVg).

_Is this… financial advice?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [BlockSecTeam](https://twitter.com/BlockSecTeam/status/1513966074357698563)_

**The attacker used flash loans to manipulate the price of the ELEPHANT token during the minting process of the project’s stablecoin TRUNK.**

**Example tx:** [0xec317deb2f3efdc1dbf7ed5d3902cdf2c33ae512151646383a8cf8cbcd3d4577](https://bscscan.com/tx/0xec317deb2f3efdc1dbf7ed5d3902cdf2c33ae512151646383a8cf8cbcd3d4577)

Firstly, the attacker took flash loans of 131k WBNB and 91M BUSD, the 131,162.00 WBNB was swapped to 34.244e21 ELEPHANT.

TRUNK can be minted by depositing BUSD. During this process, the vulnerable contract first swaps BUSD to WBNB and then uses the WBNB to buy ELEPHANT, raising the price of ELEPHANT. By minting, the attacker both receives TRUNK and increases the value of the ELEPHANT from the previous step.

The attacker then swapped the ELEPHANT, originally acquired for 131k WBNB, to 164k WBNB. Additionally, the attacker redeemed the TRUNK for 37k WBNB and 67M BUSD, making for a total of ~200k WBNB and ~67M BUSD. After returning the flash loans (of 131k WBNB and 91M BUSD), this resulted in a profit of ~$4M

The same process was repeated on a cycle, leading to total gains of over 27k WBNB ($11.2M) for the hacker. Since the incident, the funds have been sent on to various accounts and then either bridged to Ethereum or sent to Tornado Cash, as can be seen in the [visualisation below](https://twitter.com/PeckShieldAlert/status/1514145304253120515).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/04/elephant-peckshield.jpeg)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**[Position #28 on the leaderboard](https://rekt.news/leaderboard/) for [Elephant Money](https://www.coingecko.com/en/coins/elephant-money), despite their attempt to downplay the loss.**

The [price of $ELEPHANT](https://www.coingecko.com/en/coins/elephant-money) is now down by 75%, and their “stable”coin [TRUNK](https://nomics.com/assets/trunk-elephant-money-stable) fell by 40%, before partially recovering to $0.78.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/04/elephant-trunk.png)

**It’s a standard story of flash loans and price manipulation.** 

The most entertaining part is this [headline / financial advice](https://twitter.com/ElephantStatus/status/1513608274733543426?s=20&t=cQr_-Gq5TKnQp5D0tgl5rg) from the Elephant Money marketing department.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/04/elephant-buytops.png)

_So we buy the tops… then we sell the… ?_ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
