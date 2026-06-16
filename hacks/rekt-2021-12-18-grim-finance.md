---
tags:
  - blockchain/fantom
  - sector/token
  - sector/vault
  - has/audit
  - vuln/reentrancy/single-function
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Grim Finance - REKT"
protocol: "[[Grim Finance]]"
date: 2021-12-18
loss_usd: 30000000
auditors:
  - "[[Solidity Finance]]"
source: "https://rekt.news/grim-finance-rekt"
excerpt: "Don’t fear the reaper. Grim Finance is rekt. $30M gone, position 18 on the leaderboard."
genome:
  - "[[single-function]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[flashloan-callback-auth]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# Grim Finance - REKT

> **Loss:** $30,000,000 | **Date:** 2021-12-18 | **Audited by:** Solidity Finance

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/grim-header.png)

**Don’t fear the reaper.**

_Grim Finance is rekt._

The latest entry onto our [leaderboard](https://rekt.news/leaderboard/) (#18), was a fork of _“Beefy Finance”_, offering auto-compounding LP vaults on Fantom.

After the attack, the project’s initial [announcement](https://twitter.com/financegrim/status/1472357770846519312) referred to it as “_advanced_”, however reentrancy vulnerabilities are nothing new. 

**The price of [$GRIM](https://www.coingecko.com/en/coins/grimtoken) fell 80% after the attack.** 

[Charge DeFi](https://twitter.com/ChargeDeFi/status/1472136494085296128) lost 1849 [$CHARGE](https://www.coingecko.com/en/coins/chargedefi-charge) to the same attack vector just hours before…

_Was this a serial attacker?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [RugDoc](https://twitter.com/RugDocIO/status/1472293717725913089)_

**The attack exploited a _depositFor()_ function that hadn’t been protected against reentrancy.**

This allowed the hacker to loop additional false deposits within the initial call, vastly increasing their share of the vault.

As shown below, the user is able to choose the deposit token, which is where the attacker inserted their own contract containing the reentrancy deposit loops.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/grim-code.png)

_[Example transaction](https://ftmscan.com/tx/0x19315e5b150d0a83e797203bb9c957ec1fa8a6f404f4f761d970cb29a74a5dd6) and workflow (Credit: [@k3mmio](https://threadreaderapp.com/thread/1472315936166219777.html)):_

**1)** Grab a Flashloan for XXX & YYY tokens (WBTC-FTM e.g.)

**2)** Add liquidity on SpiritSwap

**3)** Mint SPIRIT-LPs

**4)** call depositFor() in GrimBoostVault with token==ATTACKER, user==ATTACKER

**5)** Leverage token.safeTransferFrom for re-entrancy

**6)** goto (4)

**7)** In the last step on re-entrancy call depositFor() with token==SPIRIT-LP, user==ATTACKER

**8)** Amount of minted GB-XXX-YYY tokens is increased in every level of re-entrancy

**9)** Attacker ends up holding huge amount of GB-XXX-YYY tokens 

**10)** Withdraw GB tokens and get more SPIRIT-LP tokens back

**11)** Remove liquidity and get more XXX and YYY tokens

**12)** Repay Flashloan

**Attacker’s address:** [0xdefc385d7038f391eb0063c2f7c238cfb55b206c](https://ftmscan.com/address/0xdefc385d7038f391eb0063c2f7c238cfb55b206c)

**The Grim Finance team has an ongoing investigation tracking the movement of funds across the attacker’s accounts, and have found links to various CEXs.**

_Further details can be found in the rekt.news [Telegram group.](https://t.me/Rekt_HQ)_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Charge DeFi claims they [reached out](https://twitter.com/ChargeDeFi/status/1472223355352895490) to projects who were using the same code in order to warn of the vulnerability.** 

However, perhaps those messages didn’t have the desired effect. One Discord user tried to claim responsibility for the attack.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/grim-discord.png)

**If these messages are to be believed, then at least some of the $30 million stolen will be going to charity.**

_But it will be a Grim Christmas for the unwilling donors._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
