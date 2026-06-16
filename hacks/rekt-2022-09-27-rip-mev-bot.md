---
tags:
  - blockchain/ethereum
  - sector/dex
  - sector/lending
  - sector/perpetuals
  - sector/privacy
  - sector/stable
  - impact/mev/backrun
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "RIP MEV BOT"
protocol: "[[Rip Mev Bot]]"
date: 2022-09-27
loss_usd: 1500000
auditors:
source: "https://rekt.news/ripmevbot"
excerpt: "Zero pity. The notorious MEV bot known as 0xbad has fallen on hard times, just like the rest of us. After 75 days of exploiting value from unexpecting users, this mempool menace backfired on its owner"
genome:
  - "[[backrun]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# RIP MEV BOT

> **Loss:** $1,500,000 | **Date:** 2022-09-27 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/09/ripmev-header.png) 
**Zero pity.**

The notorious MEV bot known as [0xbad](https://etherscan.io/address/0xbadc0defafcf6d4239bdf0b66da4d7bd36fcf05a) has fallen on hard times, just like the rest of us.

After 75 days of exploiting value from unexpecting users, this mempool menace backfired on its owner, creating a beautiful display of on-chain karma.

After one unfortunate user tried to [swap $1.85M of Compound cUSDC for USDC](https://etherscan.io/tx/0x96a129768ec66fd7d65114bf182f4e173bf0b73a44219adaf71f01381a3d0143) on Uniswap v2, a lack of liquidity meant they only received $500 in USDC. 0xbad was quick to profit from the swap, backrunning the trade with an [elaborate arb](https://etherscan.io/tx/0x2a615005a63785284f11a4c5cb803d1935d34e358c10a3b4d76398d2e7bb2f9d) involving many different DeFi dApps.

$1.02M profit.

**Nice.**

*However…*

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/09/ripmev-hour.png) 

**0xbad got put down… _tremendously_.**

An anonymous attacker noticed a flaw in the bots arbitrage contract code, and [stole](https://etherscan.io/tx/0x631d206d49b930029197e5e57bbbb9a4da2eb00993560c77104cd9f4ae2d1a98) not only the recently acquired 800 ETH, but the entire 1,101 ETH in 0xbad’s wallet.  

**Attacker’s address: [0xb9f78307ded12112c1f09c16009e03ef4ef16612](https://etherscan.io/address/0xb9f78307ded12112c1f09c16009e03ef4ef16612)**

**0xbad: [0xbadc0defafcf6d4239bdf0b66da4d7bd36fcf05a](https://etherscan.io/address/0xbadc0defafcf6d4239bdf0b66da4d7bd36fcf05a)**  

[@bertcmiller](https://twitter.com/bertcmiller/status/1574852628030361609?s=20&t=UMyyYEHWlz88vonCknKWUA) of Flashbots broke it down:

0xbad did not properly protect the function that they used to execute the dYdX flashloans.

Note "callFunction," which is the function called by the dYdX router as a part of flashloan execution

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/09/ripmev-code.png) 

**When you get a flashloan the protocol you're borrowing from will call a standardized function on your contract.**  

In this case dYdX called "callFunction" on 0xbad.

Unfortunately for 0xbad, their code allowed for arbitrary execution.  

The attacker used this to get 0xbad to [approve all of their WETH](https://etherscan.io/tx/0x59ddcf5ee5c687af2cbf291c3ac63bf28316a8ecbb621d9f62d07fa8a5b8ef4e) for spender on their contract.

The attacker then simply [transferred the WETH](https://etherscan.io/tx/0x631d206d49b930029197e5e57bbbb9a4da2eb00993560c77104cd9f4ae2d1a98) out to their address.

_Down 0xbad_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**To add further drama to the drama, 0xbad decided to try and threaten their attacker with a [message sent](https://etherscan.io/tx/0x6352ab3619bf078efd19272fc425fefd19e0e9081ce0019a72afadf2ff0a2c41) via transaction input data.**

>Congratulations on this, we got careless and you sure managed to get us good, that was not easy to see. We would like this cooperate with you on resolving this matter. Return the funds to @x19603D249DF53d8b1650c762c4df316013Dce840 before September 28 at 23:59 GMT and we will consider this a whitehat, we will give you 20% of the retrieved amount as a bug bounty, payable as you see fit. Should the funds not be returned by then, we will have no choice but to pursue accordingly with everything in our power with the appropriate authorities to retrieve our funds.

Then came [a reply:](https://etherscan.io/tx/0x56f3ec870a8a76498d40436d6eb6784ee006d3209907c9a20279f7ab35a9a65e)

>What about normal people who you have mev'ed and literally fucked them? Will you return them? Return the funds to all people before September 28 at 23:59 GMT and we will consider this a whitehat, we will give you 1% of the retrieved amount as a good heart sign, payable as you see fit. Should the funds not be returned by then, we will have no choice but to pursue accordingly with everything in our power with the appropriate authorities to retrieve our funds.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Last year, in “Return to the Dark Forest”, we wrote:** 

>Frontrunning is vampiric. It feeds off weaker participants, while conflicts with other bots push gas prices to unusable levels. Most of the time, frontrunners win…

_But not this time…_

**MEV bots act on the boundary of “code is law”.** 

_In the PvP arena that is Ethereum’s Dark Forest, sometimes you win and sometimes you lose._

Despite the fact that the funds were never returned to their original owner, it’s nice to see such a prompt display of on-chain karma.

As Bert Miller wrote on Twitter:

_Bad code, great content_

**Which would make a great tagline for rekt.news…**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
