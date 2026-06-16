---
tags:
  - blockchain/ethereum
  - sector/governance
  - sector/lending
  - sector/stable
  - sector/vault
  - trigger/first-deposit
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Abracadabra - REKT"
protocol: "[[Abracadabra]]"
date: 2024-01-30
loss_usd: 6500000
auditors:
source: "https://rekt.news/abra-rekt"
excerpt: "On-chain black magic led to two of Abracadabra’s cauldrons springing a leak yesterday. $6.5M gone and MIM losing its magic... What dark arts are needed for a full repeg?"
genome:
  - "[[first-deposit]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Abracadabra - REKT

> **Loss:** $6,500,000 | **Date:** 2024-01-30 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/abra-header.png)

_Yesterday, some on-chain black magic led to two of Abracadabra’s cauldrons springing a leak._

**The lending platform was hacked for $6.5M on Ethereum, and Abra’s [Magic Internet Money](https://www.coingecko.com/en/coins/magic-internet-money) didn't look so magic after all…**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/abra-depeg.png)

[BlockSec](https://twitter.com/Phalcon_xyz/status/1752278614551216494) and [Peckshield](https://twitter.com/peckshield/status/1752279373779194011) raised the alarm, with the former also [advising](https://twitter.com/BlockSecTeam/status/1752279348541841578) users to withdraw their assets. An official [acknowledgement](https://twitter.com/MIM_Spell/status/1752286636740579440) came shortly after, with the team promising to attempt to restore the MIM peg:

>To the best of its Ability, the DAO treasury will be buying back MIM from the market to then burn.

Just over an hour after the attack began the issue had been mitigated, [according](https://twitter.com/LickMyRomy/status/1752292772839588129) to an Abra team member. And the team’s efforts brought MIM back up to around $0.95.

**With the stablecoin [currently](https://www.coingecko.com/en/coins/magic-internet-money) hovering around $0.97…**

_…what dark arts will it take for MIM to fully repeg?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Offside Labs](https://twitter.com/MageIntern/status/1752319261908017632), [EXVULSEC](https://twitter.com/EXVULSEC/status/1752357798783103158), [Kankodu](https://twitter.com/kankodu/status/1752581744803680680)_

**The [root cause](https://twitter.com/MageIntern/status/1752319261908017632) of the exploit was, as [initially thought](https://twitter.com/qckhp/status/1752285931237740593), a rounding issue in the CauldronV4 code.**

The borrow function in CauldronV4 contracts was vulnerable to manipulation of the part parameter (the user’s share of total debt) via repeatedly borrowing and repaying an asset, taking advantage of the rounding error. For a more in-depth analysis, see [here](https://twitter.com/kankodu/status/1752581744803680680).

_This allowed the attacker drain MIM liquidity from the [yvCrv3Crypto](https://etherscan.io/address/0x7259e152103756e1616A77Ae982353c3751A6a90) and [magicAPE](https://etherscan.io/address/0x692887E8877C6Dd31593cda44c382DB5b289B684) cauldrons, taking advantage of the incorrect debt calculation._

[Step-by-step](https://twitter.com/EXVULSEC/status/1752357798783103158):

>1 Flashloan MIM token with Degenbox
>
>2 Donate MIM token to BentoBox by depositing MIM token to BentoBox with recipient is BentoBox itself (this is a part of ERC-4626 first depositor attacker vector)
>
>3 Repay liabilities for all other users by calling to `repayForAll()`. However the repayment is not complete such that the `elastic` value after the repayment is above a threshold `1000 * 1e18`. So the attacker needs to manually repay liabilities for other borrowers to decrease borrow elastic to zero
>
>4 Repeatedly borrow and repay to inflate the share price. Here the vulnerability is well-known as ERC-4626 first depositor (or vault share price inflation)
>
>5 Add collateral and borrow a large amount of MIM token
>
>6 Repay flashloan and take profit

**The resulting dump of the stolen MIM (for ETH) caused the depeg.**

Attacker address: **[0x87f585809ce79ae39a5fa0c7c96d0d159eb678c9](https://etherscan.io/address/0x87f585809ce79ae39a5fa0c7c96d0d159eb678c9)**

Attack tx 1 (10:14 UTC): [0x26a83db7…](https://etherscan.io/tx/0x26a83db7e28838dd9fee6fb7314ae58dcc6aee9a20bf224c386ff5e80f7e4cf2)

Attack tx 2 (10:26 UTC): [0xdb4616b8…](https://etherscan.io/tx/0xdb4616b89ad82062787a4e924d520639791302476484b9a6eca5126f79b6d877)

Exploited CauldronV4 contracts:

yvCrv3Crypto [0x7259e152103756e1616A77Ae982353c3751A6a90](https://etherscan.io/address/0x7259e152103756e1616A77Ae982353c3751A6a90)

magicAPE [0x692887E8877C6Dd31593cda44c382DB5b289B684](https://etherscan.io/address/0x692887E8877C6Dd31593cda44c382DB5b289B684)

Funds are currently held in two accumulation addresses: [Exploiter address 2](https://etherscan.io/address/0x40d5ffa20fc0df6be4d9991938daa54e6919c714) ($4.2M) and [Exploiter address 3](https://etherscan.io/address/0xbd12d6054827ae3fc6d23b1acf47736691b52fd3) ($2.2M). The Abracadabra team have [reached](https://etherscan.io/tx/0x66c7b94117b230d760d6cbed363cc057cbb81acd2dc8fcc0581e169ebb8adc7a)  [out](https://etherscan.io/tx/0xa1f8e3c30917f33956ef0a96417987a07a70509a2e48b6426b65906462faad6b) on-chain in an attempt to open negotiations.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

After a [busy](https://rekt.news/gamma-strategies-rekt/)  [start](https://rekt.news/radiant-capital-rekt/) to January, and the [chaotic](https://rekt.news/etfgaffe/) ETF approval announcements, the long-awaited TradFi-propelled market turnaround never materialised, and apathy seems to have taken over the timeline.

_Now, a multimillion dollar exploit of one of the last bull run’s key players seems to have made little noise._

**Abracadabra’s Degenbox was a key part of the overleveraged Anchor play which eventually led to the [collapse of LUNA/UST](https://rekt.news/luna-rekt/), and co-founder Daniele Sesta is one of only a few of last cycle’s main characters that _hasn’t_ ended up [behind bars](https://rekt.news/bulls-behind-bars/).**

A mix of populist calls to ‘Occupy DeFi’ and a talent for ponzi-pivoting saw Frog Nation projects propelled to enormous TVLs off relatively little innovation throughout 2021.

_Even [Popsicle](https://rekt.news/popsicle-rekt/) getting rekt for $20M and then Wonderland’s [Sifu scandal](https://rekt.news/sifu-scandal/) didn’t seem to put the degens off._

**Yesterday’s hack comes just as new offerings are being [teased](https://twitter.com/danielesesta/status/1751553380693258326).**

_A taste of things to come?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
