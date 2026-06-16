---
tags:
  - blockchain/bitcoin
  - blockchain/ethereum
  - blockchain/optimism
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/stable
  - sector/staking
  - has/audit
  - vuln/reentrancy/single-function
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Hundred Finance - REKT 2"
protocol: "[[Hundred Finance]]"
date: 2023-04-15
loss_usd: 7400000
auditors:
  - "[[WhiteHatDAO]]"
source: "https://rekt.news/hundred-rekt2"
excerpt: "On April 15th, Hundred Finance suffered a $7.4M exploit on Optimism. This is the protocol's first solo article, after having shared the stage with both Agave DAO and Meter. With Hundred’s leaderboard "
genome:
  - "[[single-function]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
---
# Hundred Finance - REKT 2

> **Loss:** $7,400,000 | **Date:** 2023-04-15 | **Audited by:** WhiteHatDAO

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/hundred-header.png)

**Hundred Finance finally gets its very own article.**

_No sharing the spotlight this time…_

Shortly after 2pm UTC on April 15th, Hundred Finance suffered a $7.4M exploit on Optimism.

The team’s [announcement](https://twitter.com/HundredFinance/status/1647247792589471745) sounded more like a bystander’s observation than a protocol informing users of a multimillion dollar hack…

>It looks that Hundred got hacked on #Optimism. We will update when there is more information to it.

_But, then again, Hundred have been through all this before._

Last February, Hundred caught a stray to the tune of 3.3M when [Meter got rekt](https://rekt.news/meter-rekt/).

The following month saw Hundred’s [leaderboard debut](https://rekt.news/agave-hundred-rekt/), when $6.2M was lost on xDAI chain to a dual-edged attack which also hit Agave DAO for $5.5M.

That time, the attack vector was the same reentrancy mechanism which hit [CREAM Finance](https://rekt.news/cream-rekt/) in August 2021.

**With Hundred’s leaderboard total now standing at $16.9M…**

_…what was it this time?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Daniel Von Fange](https://twitter.com/danielvf/status/1647329491788677121), [Peckshield](https://twitter.com/peckshield/status/1647307128267476992), [Beosin](https://twitter.com/BeosinAlert/status/1647456363856134144), [Numen Cyber](https://twitter.com/numencyber/status/1647530400028450816)_

Hundred is a Compound fork which uses hTokens to track lending positions. It was [audited](https://github.com/WhiteHatDAO/Smart-Contract-Security-Audits-by-White-Hat-DAO/blob/main/Audit_Report_Hundred_Finance%20(2).pdf) in Feb 2022 by WhiteHatDAO.

As Daniel Von Fange [points out](https://twitter.com/danielvf/status/1647329491788677121):

>the project setup two wBTC cTokens, one of which was used by the UI, one of which was empty.

Using a flashloan of WBTC from Aave, the attacker was able to donate large amounts of WBTC to the empty hWBTC contract, manipulating the exchange rate between hWBTC and WBTC. To top it off, the redeemUnderlying function contained a rounding error.

Attacker’s address ([OP](https://optimistic.etherscan.io/address/0x155da45d374a286d383839b1ef27567a15e67528), [ETH](https://etherscan.io/address/0x155da45d374a286d383839b1ef27567a15e67528)): **0x155da45d374a286d383839b1ef27567a15e67528**

Hack tx 1: [0x6e9ebcde…](https://optimistic.etherscan.io/tx/0x6e9ebcdebbabda04fa9f2e3bc21ea8b2e4fb4bf4f4670cb8483e2f0b2604f451)

Hack tx 2: [0x15096dc6…](https://optimistic.etherscan.io/tx/0x15096dc6a59cff26e0bd22eaf7e3a60125dcec687580383488b7b5dd2aceea93)

**Peckshield [summed up](https://twitter.com/peckshield/status/1647307128267476992) the exploit as:**

>The root cause appears the attacker donates 200 WBTC to inflate hWBTC's exchange rate so that even a tiny amount (2 wei) of hWBTC can basically drain current lending pools.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/hundred-code.png)

**Beosin also [provided](https://twitter.com/BeosinAlert/status/1647456363856134144) a step-by-step analysis:**

>The root cause is that the attacker can manipulate the exchangeRate by donating a large amount of WBTC to the hWBTC contract.
>
>In the getAccountSnapshot function, the value of exchangeRateMantissa relies on the amount of WBTC in the contract.
>
>The attacker flashloaned 500 $WBTC, then called the redeem function to redeem the previously staked 0.3 WBTC.
>
>Next, the attack contract 1 sent 500.3 WBTC to attack contract 2. Contract 2 used 4 BTC to mint 200 hWBTC. The redeem function was then called to redeem the 4 BTC.
>
>Here the attacker can redeem the 4 WBTC previously staked with less than 200 hWBTC. At this point the attacker had a very small amount of hWBTC left on contract 2.
>
>Attack contract 2 then sent 500.3 WBTC to the hWBTC contract and borrowed 1021.91 ETH via the remaining 2 hWBTCs.
>
>Finally the attack contract 2 repaid the previous debt by using 1 hWBTC, and withdrew 500.3 WBTC from the contract.

The attacker bridged most of the [stolen funds](https://twitter.com/PeckShieldAlert/status/1647802990160662531) to ETH where centralised stables USDT and USDC were swapped, or deposited into Curve.

**At the time of writing, the hacker’s [debank profile](https://debank.com/profile/0x155da45d374a286d383839b1ef27567a15e67528) shows approximately $5.4M of assets on Ethereum and $0.9M remaining on Optimism.**

The price of [HND token](https://www.coingecko.com/en/coins/hundred-finance) dropped around 50% over the day following the hack. It has since recovered somewhat, to ~$0.025, down from ~$0.039 before the attack.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**As we wrote [last time](https://rekt.news/agave-hundred-rekt/):**

>Forks upon forks create a house of cards. If the code is copied and pasted, vulnerabilities can open up where they're least expected.
>
>When one fork falls, all others have to check their foundations.

**Hundred have advised other COMP forks to get in touch, [warning](https://twitter.com/HundredFinance/status/1647634154710769664) that the hack exploited “_a general flaw in the code and not specific to Hundred deployment_”.**

Likely spurred on by [Euler Finance](https://rekt.news/euler-rekt/)’s recent success, the Hundred team have [announced](https://twitter.com/HundredFinance/status/1647995836117180416) a reward for info leading to identification of the hacker:

>48h passed since we sent an on-chain message to the hacker and tried to start negotiations with him.
>
>Today we are launching a $500k reward in the hope that this provides additional incentive for info that leads to the Hundred attacker’s arrest and the return of all funds.

Hopefully the added pressure is as effective in recovering the funds…

_Will Hundred get lucky?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
