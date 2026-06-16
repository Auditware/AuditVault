---
tags:
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/privacy
  - sector/stable
  - vuln/governance/flash-loan-voting
  - trigger/flash-loan
  - precondition/flash-loan-available
  - precondition/governance-quorum-reachable
  - novelty/known-pattern
title: "Beanstalk - REKT"
protocol: "[[Beanstalk]]"
date: 2022-04-17
loss_usd: 181000000
auditors:
source: "https://rekt.news/beanstalk-rekt"
excerpt: "$181M jacked from Beanstalk, but the attacker only kept $76M. A malicious governance proposal was pushed through by a flash loan, and the attacker then voted to transfer all the assets to themself, bu"
genome:
  - "[[flash-loan-voting]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[governance-quorum-reachable]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Beanstalk - REKT

> **Loss:** $181,000,000 | **Date:** 2022-04-17 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/04/bean-header.png)

**$181 million jacked from Beanstalk, but the attacker only kept $76M.** 

[rekt.news](https://rekt.news/) records the damage, not the profit, so this one takes #5 on [the leaderboard.](https://rekt.news/leaderboard/)

**A malicious governance proposal was pushed through by a flash loan, and the attacker then voted to transfer all the assets to themself.**

Another ~24800 ETH into Tornado Cash, and 250K of stolen money into the Ukraine War Fund.

_How much longer can this crimewave last?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [Igor Igamberdiev](https://twitter.com/FrankResearcher/status/1515693895887294466), [Peckshield](https://twitter.com/peckshield/status/1515692144190648322?s=20&t=3UTlCZ7ksEn7DFljKsaNFg), [Kelvin Fichter](https://twitter.com/kelvinfichter/status/1515735717305008138)_

**This was a governance attack made possible through the use of flash loans combined with the absence of a delay on proposal execution.**

The attacker temporarily acquired sufficient voting power to immediately execute a malicious emergency governance proposal, draining the protocol.

Though the attack was instant, some [preparation was needed:](https://twitter.com/kelvinfichter/status/1515735717305008138)

> _…there's a ~1 day delay for *all* governance actions in the $BEAN contract. The attacker actually set this whole thing up yesterday when it made two governance proposals._
>
> _The first proposal (proposal #18) steals all the money in the contract. The next proposal (proposal #19) sends $250k worth of $BEAN to the Ukraine donation address. This Ukraine proposal is *named* Bip18 (instead of Bip19)..._

**Once the delay had passed, the attack could be [executed:](https://twitter.com/FrankResearcher/status/1515693895887294466)**

> The exploiter was funded from the Synapse Protocol bridge [though initially from Tornado].
>
>They used a flash loan to get:
> 
> 350M DAI, 500M USDC, and 150M USDT from Aave;
> 
> 32M BEAN from Uniswap v2;
> 
> 11.6M LUSD from SushiSwap.
> 
> These tokens were used to add liquidity to Curve pools with BEAN for the governance voting.
> 
> Further, they deployed and voted for a fake BIP-18 that moved all funds from the protocol contract to the exploiter.
> 
> The next step was removing liquidity, repaying flash loans, and converting all received funds into 24.8k WETH ($76M), which went to Tornado Cash.

**Hacker:** [0x1c5dcdd006ea78a7e4783f9e6021c32935a10fb4](https://etherscan.io/address/0x1c5dcdd006ea78a7e4783f9e6021c32935a10fb4)

**Hacker Contract:** [0x79224bc0bf70ec34f0ef56ed8251619499a59def](https://etherscan.io/address/0x79224bc0bf70ec34f0ef56ed8251619499a59def)

**BIP18:** [0xe5ecf73603d98a0128f05ed30506ac7a663dbb69](https://etherscan.io/address/0xe5ecf73603d98a0128f05ed30506ac7a663dbb69)

**Propose BIP18 tx:** [0x68cdec0ac76454c3b0f7af0b8a3895db00adf6daaf3b50a99716858c4fa54c6f](https://etherscan.io/tx/0x68cdec0ac76454c3b0f7af0b8a3895db00adf6daaf3b50a99716858c4fa54c6f)

**Peckshield provided a [Step by Step](https://twitter.com/peckshield/status/1515692144190648322)**

Hacker proposes a malicious proposal BIP with [initAddress](https://etherscan.io/address/0xe5ecf73603d98a0128f05ed30506ac7a663dbb69)

Launch the hack tx: [0xcd314668aaa9bbfebaf1a0bd2b6553d01dd58899c508d4729fa7311dc5d33ad7](https://etherscan.io/tx/0xcd314668aaa9bbfebaf1a0bd2b6553d01dd58899c508d4729fa7311dc5d33ad7)

1. Flashloan 350,000,000 DAI, 500,000,000 USDC, 150,000,000 USDC, 32, 425,202 BEAN, and 11,643,065 LUSD

2. Vyper_contract_bebc.add_liquidity 350,000,000 DAI, 500,000,000 USDC, 150,000,000 USDT to get 979,691,328 3Crv

3. LUSD3CRV-f.exchange to convert 15,000,000 3Crv to 15, 251,318 LUSD

4. BEAN3CRV-f.add_liquidity to convert 964,691,328 3Crv to 795,425,740 BEAN3CRV-f

5. BEANLUSD-f.add_liquidity to convert 32,100,950 BEAN and 26,894,383 LUSD and get 58,924,887 BEANLUSD-f

6. Deposit 795,425,740 BEAN3CRV-f and 58,924,887 BEANLUSD-f into Diamond

7. Diamond.vote (bip=18)

8. Diamond. emergencyCommit(bip=18) and hacker proposed _init contract is executed to get 36,084,584 BEAN and 0.54 UNI-V2_WETH_BEAN, 874,663,982 BEAN3CRV-f, 60,562,844 BEANLUSD-f to hacker contract

9. BEAN3CRV-f.remove_liquidity_one_coin 874,663,982 BEAN3CRV-f to get 1,007,734,729 3Crv

10. BEANLUSD-f.remove_liquidity_one_coin 60,562,844 BEANLUSD-f to get 28,149,504 LUSD

11. Flashloan back LUSD 11,795,706 and BEAN 32,197,543

12. LUSD3CRV-f.exchange to swap 16,471,404 LUSD to 16,184,690 3Crv

13. Burn 16,184,690 3Cry to get 522,487,380 USDC, 365,758,059 DAI, and 156,732,232 USDT

14. Flashloan back 150,135,000 USDT, 500,450,000 USDC, 350,315,000 DAI

15. Burn UNI-V2_WETH_BEAN 0.54 to get 10,883 WETH and 32,511,085 BEAN

16. Donate 250,000 USDC to Ukraine Crypto Donation

17. swap 15,443,059 DAI to 15,441,256 USDC

18. swap 37, 228,637 USDC to 11,822 WETH

19. Swap 6,597,232 USDT to 2,124 WETH

20. Profit 24,830 WETH is sent to hacker

_And then to Tornado._ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)  

**Presumably to avoid suspicion of an inside-job, Publius, the anon behind the protocol, took the decision to reveal their identity as a group of three in a [statement](https://discord.com/channels/880413392916054098/880500642546851850/965496314244775976) published to Discord.**

Omniscia is [keen to point out](https://medium.com/@omniscia.io/beanstalk-farms-post-mortem-analysis-a0667ee0ca9d) that this attack fell outside the scope of their audit, however their report does include commentary on the [governance contract.](https://omniscia.io/beanstalk-core-protocol/code-style/GovernanceFacet-GFT) 

Either way, it is surprising that such a vulnerability was not noticed at some point, given that flash loans are [not a novel threat](https://www.theblockcrypto.com/post/82721/makerdao-issues-warning-after-a-flash-loan-is-used-to-pass-a-governance-vote) to DeFi governance. A delay on execution of on-chain governance proposals is one way to prevent this.

This incident might encourage bagholders to monitor governance proposals more carefully. 

However, the average user may expect such [heavily](https://twitter.com/phtevenstrong/status/1515682798031548417)-[shilled](https://twitter.com/DegenSpartan/status/1515693260546920452?s=20&t=hvmqaVrw6bEMLuOIufPXrQ) projects such as Beanstalk to be under vigilance of more experienced eyes.

_DYOR._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
