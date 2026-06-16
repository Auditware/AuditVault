---
tags:
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
title: "Inverse Finance - REKT 2"
protocol: "[[Inverse Finance]]"
date: 2022-06-16
loss_usd: 5800000
auditors:
source: "https://rekt.news/inverse-rekt2"
excerpt: "Flipped again. $1.2M to the anonymous attacker, and $5.8M lost overall. After two hacks in such quick succession, will Inverse be able to survive this crypto winter?"
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Inverse Finance - REKT 2

> **Loss:** $5,800,000 | **Date:** 2022-06-16 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/06/inverse2-header.png)

**Flipped again.**  

$1.2M to the anonymous attacker, and $5.8M lost overall.

This is the second [leaderboard](https://rekt.news/leaderboard/) entry for [Inverse Finance](https://www.inverse.finance/frontier), who also lost $15M to a [price manipulation attack](https://rekt.news/inverse-finance-rekt/) just two months ago.

Now, another oracle manipulation has hit the protocol’s [DOLA](https://www.coingecko.com/en/coins/dola) lending market, which, according to the [Risk DAO](https://twitter.com/Risk_DAO) dashboard, now has [$10.63M of bad debt.](https://bad-debt.riskdao.org/)

Peckshield jumped at the chance to tweet about the exploit, but [deleted their announcement](https://twitter.com/peckshield/status/1537364618422517760) after being publicly reprimanded for disclosing the vulnerability while funds were still at risk.

Inverse Finance [announced](https://twitter.com/InverseFinance/status/1537372199769845760) the incident, stating that:

>”no user funds were taken or were at risk.”

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [Peckshield](https://twitter.com/peckshield/status/1537382891230883841)_

The attacker was able to manipulate the pricing of yvcrv3Crypto used as collateral. The Inverse oracle “_misuses the balances of assets in the pool to directly calculate the LP token price._”

By using the flash loaned WBTC to make large swaps through the underlying pool, the balance of assets was manipulated before and after borrowing, allowing the exploiter to withdraw an inflated amount of DOLA.

**1:** Flashloan 27,000 WBTC via AAVE

**2:** Deposit 225 WBTC to crv3crypto with 5,375 crv3crypto minted

**3:** Deposit 5,375 crv3crypto to y Curve-3Crypto with 4,906 yvCurve-3Crypto minted

**4:** Deposit 4,906 yvCurve-3Crypto to Inverse Finance as collateral

**5:** Swap 26,775 WBTC to 75,403,376 USDT to manipulate the collateral price

**6:** Borrow 10,133,949 DOLA, which is extremely more than normal

**7:** Reverse swap 75,403,376 USDT to 26,626 WBTC

**8:** Swap 10,133,949 DOLA to 9,881,355 3Crv

**9:** Remove 9,881,355 3Cry to get 10,099,976 USDT

**10:** Swap 10,000,000 USDT to 451 WBTC

**11:** Repay flashloan

Funds were then withdrawn from the contract and swapped to ETH, 1000 of which have been deposited into Tornado Cash, and 68 remain in the address.

**Exploiter’s address, [funded](https://etherscan.io/tx/0x84ee1ce4dd2aa5113aa7191baaea5f77ac85f6c95cba16135e89b11c272817e5) via Tornado Cash 2 mins before exploit:** [0x7b792e49f640676b3706d666075e903b3a4deec6](https://etherscan.io/address/0x7b792e49f640676b3706d666075e903b3a4deec6)

**Exploit contract:** [0xf508c58ce37ce40a40997c715075172691f92e2d](https://etherscan.io/address/0xf508c58ce37ce40a40997c715075172691f92e2d)

**Exploit tx:** [0x958236…](https://etherscan.io/tx/0x958236266991bc3fe3b77feaacea120f172c0708ad01c7a715b255f218f9313c)

**Withdrawing 100k USDT from the contract:** [0x3d2f86…](https://etherscan.io/tx/0x3d2f86c1c289731f56bed95dce20434eff48e3bd4a50cdc007ef5d0a2177a9f7)

**Withdrawing 53 WBTC ($1.1M) from the contract:** [0x9959f8…](https://etherscan.io/tx/0x9959f8f10f59b3b88a5499066a21237e492f193e5ff2950bcc7e6c1f5e1fa60c)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

Peckshield further confused matters after the attack by [suggesting](https://twitter.com/peckshield/status/1537389665988202496) that the malicious tx had in fact been executed by a front-running bot, who had sniped the tx before the exploiter.  
  
Others disagreed with the claim, and as the address was funded, and then the loot laundered, via Tornado Cash so quickly. It seems unlikely that we’re dealing with an accidental attack, however, it’s not hard to imagine such a turn of events happening in the future.

After two hacks in such quick succession, and with bad debt making up [over half](https://bad-debt.riskdao.org/) of the protocol’s 20M TVL, will Inverse be able to survive this crypto winter?

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
  
>If you enjoy our work, please consider donating to our [Gitcoin Grant](https://gitcoin.co/grants/1632/rekt-the-dark-web-of-defi-journalism).
