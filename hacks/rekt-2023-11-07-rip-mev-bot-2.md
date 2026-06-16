---
tags:
  - sector/dex
  - sector/lending
  - sector/privacy
  - sector/staking
  - impact/mev/sandwich
  - trigger/flash-loan
  - trigger/sandwich-attack
  - precondition/flash-loan-available
title: "RIP MEV Bot 2"
protocol: "[[Rip Mev Bot 2]]"
date: 2023-11-07
loss_usd: 2000000
auditors:
source: "https://rekt.news/ripmevbot2"
excerpt: "The sandwicher has become the sandwiched. $2M was lost on Tuesday night as an MEV bot got a taste of its own medicine. Is this a simple case of ‘you win some, you lose some’?"
genome:
  - "[[sandwich]]"
  - "[[flash-loan]]"
  - "[[defi/sandwich-attack]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# RIP MEV Bot 2

> **Loss:** $2,000,000 | **Date:** 2023-11-07 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/mevbot-header.png)

_The sandwicher has become the sandwiched._

**$2M was lost on Tuesday night as an MEV bot got a taste of its own medicine.**

The curious case of crypto-karma was spotted by [Spreek](https://twitter.com/spreekaway/status/1722040126614761790), who identified the issue as an unprotected swap function within the bot’s code.

The incident is reminiscent of when the notorious bot [0xbadc0de](https://etherscan.io/address/0xbadc0defafcf6d4239bdf0b66da4d7bd36fcf05a) got [rekt for $1.5M](https://rekt.news/ripmevbot/), last year.

As we wrote at the time:

>MEV bots act on the boundary of “code is law”.

When it comes to autonomous on-chain predators it’s hard to sympathise.

_Is this a simple case of ‘you win some, you lose some’?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[BlockSec](https://twitter.com/BlockSecTeam/status/1722101942061601052), [PeckShield](https://twitter.com/PeckShieldAlert/status/1722046149329363178), [Spreek](https://twitter.com/spreekaway/status/1722040126614761790)_

**For all the complexity within the dog-eat-dog world of MEV, the exploit was surprisingly simple.**

The bot’s code had left a swap function unprotected, which anyone could call. This was exploited to sandwich attack the bot via WETH/WBTC trades on Curve, funded via a $50M flash loan.

BlockSec [explains](https://twitter.com/BlockSecTeam/status/1722101942061601052):

>A bot was attacked due to the lack of access control of a public function 0xf6ebebbb, which could be exploited to manipulate swaps in Curve pools. The loss was ~$2M.
>
>Hence the attacker could first abuse the flawed function to pump the asset price (e.g., WETH) and then make a reverse swap to make a profit.

And Peckshield [provided](https://twitter.com/PeckShieldAlert/status/1722046149329363178) a look at the sandwiched swaps:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/mevbot-code.png)

**The [result](https://twitter.com/spreekaway/status/1722040126614761790/photo/2):**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/mevbot-swap.png)

**_Oooof._**

Attacker address ([funded](https://etherscan.io/tx/0x4dadcadec09e6b92febcbc005409ddfa0367ae9e459fa1c7de7b5525b842d875) via Tornado Cash): **[0x46d9b3dfbc163465ca9e306487cba60bc438f5a2](https://etherscan.io/address/0x46d9b3dfbc163465ca9e306487cba60bc438f5a2)**

Attack tx: [0xbc08860c…](https://etherscan.io/tx/0xbc08860cd0a08289c41033bdc84b2bb2b0c54a51ceae59620ed9904384287a38)

Victim address: [0x05f016765c6c601fd05a10dba1abe21a04f924a5](https://etherscan.io/address/0x05f016765c6c601fd05a10dba1abe21a04f924a5)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Whenever large amounts of money move in DeFi, things tend to work out nicely for Curve (_though [not always](https://rekt.news/curve-vyper-rekt/)_), and this incident was no exception.**

The swapping of vast sums necessary to imbalance the pool enough for a viable exploit generated a cool [$250k in fees](https://twitter.com/CurveCap/status/1722231234259238950) for the protocol.

[0xc0ffeebabe](https://etherscan.io/address/0xc0ffeebabe5d496b2dde509f9fa189c25cf29671), another bot known for the occasional [whitehat](https://rekt.news/curve-vyper-rekt/) exploit-frontrun, also made an [appearance](https://twitter.com/CurveCap/status/1722231231813988491) in cleaning up the mess.

**Autonomous bots, while constantly controversial, seem to be a necessary evil of a permissionless financial system.**

And with the juicy tips often paid to validators, many of the ecosystem’s key players are surely happy to tolerate the activities of the [Dark Forest](https://rekt.news/return-to-the-dark-forest/)’s most dangerous predators.

_How long until you fall prey, anon?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
