---
tags:
  - blockchain/ethereum
  - blockchain/solana
  - sector/bridge
  - sector/dex
  - sector/lending
  - has/audit
  - impact/loss-of-funds/fee-theft
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Crema Finance - REKT"
protocol: "[[Crema Finance]]"
date: 2022-07-02
loss_usd: 8800000
auditors:
  - "[[Bramah Systems]]"
source: "https://rekt.news/crema-finance-rekt"
excerpt: "~$8.8M skimmed off the top. Crema Finance, a concentrated liquidity AMM on Solana, was exploited into issuing millions in excess LP fees."
genome:
  - "[[fee-theft]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Crema Finance - REKT

> **Loss:** $8,800,000 | **Date:** 2022-07-02 | **Audited by:** Bramah Systems

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/crema-header.png)
_~$8.8M skimmed off the top._ 

**[Crema Finance](https://www.crema.finance/), a concentrated liquidity AMM on Solana, was exploited into issuing millions in excess LP fees.**  

The theft was [announced](https://twitter.com/Crema_Finance/status/1543416225622941696) by the team on Sunday at 04:07 UTC, though the attack took place the day before.

_Given that the same vulnerability was spotted by auditors in a different method, this one will be sure to leave a bitter taste for the Crema team._  

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png) 

_Credit: [Crema Finance](https://twitter.com/Crema_Finance/status/1543638844410499073), [PierreArowana](https://twitter.com/PierreArowana/status/1543528391143481344)_ 

**The attack was made possible due to faulty owner validation on one of the protocol’s accounts storing price tick data. These data are used by Crema to calculate LP fees.**

The hacker created a false tick account, with fake data, and used flash loans to add liquidity to the protocol. They could then withdraw the liquidity and claim the fees they were “owed” according to their own contract’s data.  

The proceeds were swapped to 69422.9 SOL and 6,497,738 USDCet (which was bridged to Ethereum and swapped for ETH) and remain in the hacker’s SOL and ETH addresses.  

**Exploiter’s SOL address: [Esmx2QjmDZMjJ15yBJ2nhqisjEt7Gqro4jSkofdoVsvY](https://solscan.io/account/Esmx2QjmDZMjJ15yBJ2nhqisjEt7Gqro4jSkofdoVsvY)**  

**Exploiter’s ETH address: [0x8021b2962dB803b73Aa874030B0B42c202E8458F](http://etherscan.io/address/0x8021b2962dB803b73Aa874030B0B42c202E8458F)**

The Crema team have [reached](https://solscan.io/tx/2p355auu27oGfS96aipnmPkq2V7PZjMXSKVpTWD6mH8fRRcZauyPeHqjfUZx8WFhjTGnBJr1Vzfoasct19KzEzYX)  [out](https://etherscan.io/tx/0xa38b894b2bb1c8a3eaf816d879a542e080443f7bf5a84214a00e6e509f9f6130) to the exploiter in Solana transaction data, offering a whitehat bounty of $800k valid for 72 hours.

>”To the Crema hacker: Your addresses on both Solana and Ethereum have been blacklisted and all eyes are on you right now. You have 72h from now to consider becoming a white hat and keeping 800k USD as the bounty. And transfer remaining funds back to our contract-update-authority address (DR1tLcKEmiNFxF5dxgdWCANdeBMNu9FjuHur2i4vAPHV) . Otherwise the police and legal force will officially get involved and there will be endless tracing waiting for you”

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Bramah Systems’s [audit](https://uploads-ssl.webflow.com/6247b0423c35b87bbaaf6d4c/624d0ba2e7b2065110733ccb_Crema_Finance_Audit_Bramah.pdf) identified the same vulnerability in the Crema’s swap method (p. 7), which was fixed, but the issue also existed in the claim method, where it was not picked up.**

The lack of sufficient validation has been the root cause of other high profile attacks on Solana this year.

In the case of [Wormhole](https://rekt.news/wormhole-rekt/), faulty signature verification across the bridge led to the loss of $326M, and [Cashio](https://rekt.news/cashio-rekt/) suffered a loss of ~$48M due to incomplete validation of LP tokens used for collateral.

_The froth has gone from the markets, but can Crema Finance remain?_ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
