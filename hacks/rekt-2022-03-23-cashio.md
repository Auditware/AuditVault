---
tags:
  - blockchain/ethereum
  - blockchain/solana
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/privacy
  - sector/stable
  - sector/token
  - vuln/access-control/fake-account-substitution
  - novelty/variant
title: "Cashio - REKT"
protocol: "[[Cashio]]"
date: 2022-03-23
loss_usd: 48000000
auditors:
source: "https://rekt.news/cashio-rekt"
excerpt: "$48M CASHed out. The latest leaderboard entry comes from the Solana network, where an anonymous attacker used an infinite mint to make Cashio print faster than the Fed."
genome:
  - "[[fake-account-substitution]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Cashio - REKT

> **Loss:** $48,000,000 | **Date:** 2022-03-23 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/cashio-header.png)
**~$48M CASHed out.**

The latest [leaderboard entry (#13)](https://rekt.news/leaderboard/) comes from the Solana network, where an anonymous attacker used an infinite mint to make Cashio print faster than the Fed.

The exploit began at 08:15 UTC. At 09:59 UTC, Cashio made their [announcement:](https://twitter.com/CashioApp/status/1506571243067224064)

>Please do not mint any CASH. There is an infinite mint glitch.

>We are investigating the issue and we believe we have found the root cause. Please withdraw your funds from pools. We will publish a postmortem ASAP.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/cashio-cg.png)

**Hyperinflation on a crypto timeframe.**

_At least their tagline was accurate._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/cashio-brr.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [samczsun,](https://twitter.com/samczsun/status/1506578902331768832) [@madergaser,](https://twitter.com/madergaser) and [@siintemal.](https://twitter.com/siintemal)_

**The root of the infinite mint vulnerability was Cashio’s incomplete collateral validation system.**

Before accepting tokens as collateral to mint CASH, the contract checks that the tokens to be deposited are correct (the same type of token that the contract holds).

However, the validation of the LP tokens to be deposited via _saber_swap.arrow_ is incomplete, as the _.mint_ field is never validated.

This results in the hacker being able to [create a fake root contract](https://solscan.io/tx/3t1zqtKk4CgCk5ZDZMGSwdfvvWPekyQ5r8Prhk9MiR5Sw8vujCnFBncAuFCttw3oXzacMRH9ud3VY5virUY2Z39y), which is never validated, and then a chain of fake accounts which each pass validation checks as they are compared only to one another.

**UPDATE (25/03/2022): The hacker also bypassed _depositor_source_ via a similar mechanism, creating a false bank in order to pass the _common.collateral_ verification. [Full details here.](https://twitter.com/samczsun/status/1507056110934511619?s=28)**

The hacker was therefore able to use their token as collateral to [mint 2B $CASH.](https://solscan.io/tx/2X1TKidhbocN5HRLVWRUk8W1YSQH9b6VH7biAm1ad5jwTZNrPSxajz2cyorrvqtUbWUAmCb52Yqk8VxYF2P6H5tP)

Part of the funds were then [burned](https://solscan.io/tx/4g5okypEDK9xdDwcootYz86uzTXm41VX7WosiJETGisiG2XpvNgT59djDiD2vwstQtCFF9bqSnViYJGF9Z9QrUvV) for SaberSwap LP tokens which were [cashed out](https://solscan.io/tx/pjUgAeUfWaSSJuw2Cq1cQ9gHNWs8jkxJMtHqVAMuwhg3Uk9LN9Y2obfwt6Qm8bztg56xidWBMytzmqyWzvbsrwH) for 10.8M UST and 16.4M USDC, and the remaining 1.97B CASH were swapped for 8.6M UST and 17M USDC on SaberSwap.

The majority of funds were bridged back to Ethereum, and swapped for >16k ETH (~$48M) which remains in [this wallet.](https://etherscan.io/address/0x86766247ba3405c5f15f06b895294200809e9cfb)

**Following the attack, the exploiter’s [SOL address](https://solscan.io/account/6D7fgzpPZXtDB6Zqg3xRwfbohzerbytB2U5pFchnVuzw) emitted hundreds of transactions of relatively small amounts of USDC to different addresses. And 3 hours after the exploit began, the hacker left the following message via [transaction input data](https://etherscan.io/tx/0xa8394d2e55042f84d096c72dd1075fa2648faf88e248c7992273b4d50a6a647b):**

> _“Account with less 100k have been returned. all other money will be donated to charity.”_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**As the attacker has handled part of the refund process themselves, perhaps Cashio will decide to continue.** 

**We’ll find out for sure in their planned post-mortem.**

Should we believe the charitable claims of the anonymous attacker, or is this just an attempt to dissuade anyone from trying to track them down?

Shitcoins stolen to [fund the war effort?](https://rekt.news/airdrop-siren/)

_We’ll watch [the wallet](https://etherscan.io/address/0x86766247ba3405c5f15f06b895294200809e9cfb) to find out._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
