---
tags:
  - has/audit
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - sector/privacy
  - sector/stable
  - sector/token
title: "Warp Finance - REKT"
protocol: "[[Warp Finance]]"
date: 2020-12-18
loss_usd: 7800000
auditors:
  - "[[Hacken]]"
source: "https://rekt.news/warp-finance-rekt"
excerpt: "All human beings, as we meet them, are commingled out of good and evil. As Jekyll was to Hyde, so white hat is to black. The developers we trust in daylight could be different in the night.  A potion "
genome:
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Warp Finance - REKT

> **Loss:** $7,800,000 | **Date:** 2020-12-18 | **Audited by:** Hacken

![](https://lh6.googleusercontent.com/cu47l8eTpNnHgVR_A2gq2boptXZBIIFHI0yO9ptnxWEDwjkAjVTH4vKPdrbsAe2nQZQNtz2YLiEfEb-UpPVg2-Mqk1kh3U-mxquiJZTn8TD1DsjtBVAdSPDvu0rB08TjRGmdycBP)
**Each man you meet upon the street is not one man but two...**

All human beings, as we meet them, are commingled out of good and evil: two faces and two personas that share a set of hidden goals.

**As Jekyll was to Hyde, so white hat is to black.** The developers we trust in daylight could be different in the night.

A potion of knowledge with irresistible results - who among us could resist such prizes when the punishment is zero?

As there are so few [developers](https://twitter.com/warpfinance/status/1339751978977685507?s=20) with these particular capabilities, we are faced with the probability that they give with one hand whilst they take with the other.

![](https://lh4.googleusercontent.com/yCI9vRUEqPRtw70zfTEfCnYowW-jMvvCppKOPyd5zUqbEHbw1JSxd6Y4y8QcMZyTBkx0xJ4RSNz0Wm-Z7FQH2q91pQtT3D22yYXLt8CEVsXs5DCan0KRcxFViCGBwTBDHsH-QTCm)

**Warp Finance is the latest victim of an increasingly unremarkable hack epidemic.**

An [account](https://ethtx.info/mainnet/0x8bb8dc5c7c830bac85fa48acad2505e9300a91c3ff239c9517d0cae33b595090) which had been funded with only one ETH via Tornado cash executed a contract which flash swapped $180m from Uniswap and flash borrowed $51m from dYdX.

Using this technique, the attacker was able to remove $7.8m of DAI, aided by the fact that Warp.finance relied on vulnerable Uniswap LP token prices. This allowed them to borrow more than their collateral, and resulted in a loss of stablecoin lender funds.

The wallets involved are listed below

**Attacker SC** [**0xdf8bee861227ffc5eea819c332a1c170ae3dbacb**](https://etherscan.io/address/0xdf8bee861227ffc5eea819c332a1c170ae3dbacb)

Warp Oracle [0x4A224CD0517f08B26608a2f73bF390b01a6618c8](https://etherscan.io/address/0x4A224CD0517f08B26608a2f73bF390b01a6618c8)

Warp Control [0xBa539B9a5C2d412Cb10e5770435f362094f9541c](https://etherscan.io/address/0xBa539B9a5C2d412Cb10e5770435f362094f9541c)

wBTC-wETH LP Vault [0x3c37f97F7d8f705cc230f97a0668f77a0e05D0aA](https://etherscan.io/address/0x3c37f97F7d8f705cc230f97a0668f77a0e05D0aA)

**WETH-DAI LP Vault** [**0x13db1CB418573f4c3A2ea36486F0E421bC0D2427**](https://etherscan.io/address/0x13db1CB418573f4c3A2ea36486F0E421bC0D2427) **(Affected vault)**

USDT-WETH LP Vault [0xCDb97F4C32F065b8e93cF16BB1E5d198bcF8cA0d](https://etherscan.io/address/0xCDb97F4C32F065b8e93cF16BB1E5d198bcF8cA0d)

USDC-WETH LP Vault [0xb64dfae5122D70Fa932f563c53921FE33967B3E0](https://etherscan.io/address/0xb64dfae5122D70Fa932f563c53921FE33967B3E0)

DAI Vault [0x6046c3Ab74e6cE761d218B9117d5c63200f4b406](https://etherscan.io/address/0x6046c3Ab74e6cE761d218B9117d5c63200f4b406)

USDT Vault [0xDadd9bA311192d360Df13395E137f1E673C91deB](https://etherscan.io/address/0xDadd9bA311192d360Df13395E137f1E673C91deB)

USDC Vault [0xae465FD39B519602eE28F062037F7B9c41FDc8cF](https://etherscan.io/address/0xae465FD39B519602eE28F062037F7B9c41FDc8cF)

**rekt OPSEC provided us with the following summary**

- WarpFinance was exploited and drained ~$7.8 million of DAI/USDC from its vault (WarpVaultSC).
- The attack was initiated at 10:24:41 PM +UTC, Dec. 17, 2020 ([Transaction](https://ethtx.info/mainnet/0x8bb8dc5c7c830bac85fa48acad2505e9300a91c3ff239c9517d0cae33b595090)),
- The root cause of this incident was the use of AMM-based oracle (Uniswap), which allowed the attacker to manipulate the price of UniswapV2 pair (WETH-DAI) LP token.
- This flash loan induced price manipulation on Uniswap lead the attacker to borrow more (approximately double) amount of USDC and DAI from the WarpFinance lending platform than it should.
- An interesting point to note is that the attacker does not profit from this immediately.
- The LP tokens deposited by the attacker are held as collateral and are locked in WarpFinance due to an under-water borrow position.

**Transaction Walkthrough:**

- Take four different flashloans of 2.9M DAI + 344.8K WETH from dYdX and UniswapV2; WETH-WBTC 90k WETH WETH-USDC 82k WETH WETH-USDT 96k WETH dYdX 76k WETH dYdX 2.9m DAI
- Deposit the dYdX flashloan (of 2.9M DAI + 76K WETH) to UniswapV2 pair (WETH-DAI) and mint in return 94.349K LP tokens.

![](https://lh6.googleusercontent.com/D0Q0LzrWP7qJncRlvHLcnvIa-K8Kb1EY4Y92q92DYz9AIGLah2JcK4z6Qi04otZ4jxFxoPonvXi_WEIaa0jb8L6rUa4iojgNmgYZJd78KkM0b_K2WAPiR0WdnwJls47UjFZeRbGF)

- The minted tokens are then transferred to WarpVaultLP as collateral to the credit of the attacker; (current price of UniswapV2 pair WETH-DAI LP token is 58,815,427)
- Swap 341K WETH for 47.6M DAI via UniswapV2 so that DAI becomes very expensive, which cascadingly at least doubles the LP token price to 135,470,392;
- With the higher LP token price and the higher computed collateral value, the attacker is able to borrow 3.86M DAI and 3.9M USDC from WarpFinance (valued about $~7.8 million)

![](https://lh3.googleusercontent.com/FjOa_KgUH2BZFUxv8Azyh_S78EXf7xp-olHSuxbJh01qwZsMnF3LUF0wV9KarNpD_MHnYRYHKZXJiTb5NphmKhjh94eJyG-iUDjjNUZYSBS1V80108K35p0U9qKaO8rL8e8cnrAz)

- Return the flashloans in Step 1 back to dYdX and UniswapV2.
- The attacker lost most of the gains in the transaction fees.
- Though this incident leads to ~$7.8 million loss, the attacker does not immediately benefit from it. Specifically, the attacker currently has an under-water borrow position in WarpFinance, which still locks the 94.349K LP tokens. In the meantime, we are actively monitoring the attackers wallet for any movement.

![](https://lh3.googleusercontent.com/TL9LpgYGa--08j2t5KRVvWfLi_PtVpV68f_qFni86PIM4WHuKEhl33Tz56_XiwevCYzfHcd2s7Ih0xdYoXSut2_m6_nGY1KnELgiONcDVQ5Kd_3z-Cnn8w3pg7odfJgKkfuNFMEN)
Pie chart credit - [@n2ckchong](https://twitter.com/n2ckchong/status/1339727569436901378?s=20)
![](https://lh4.googleusercontent.com/OvaHZqCaAJMaoW7BBHoXtkmw8zPc4ZuYeeMcGpk5OeFJoZc5IDqi7HWIsclDhvs_281kepFEmKQjsbt2ZVkB7O6LwVtRfqrKNNswRznJAZmj9YOkRGNmVFwgn17UlOtUwVZ_mIZQ)

> _There comes an end to all things; the most capacious measure is filled at last; and this brief condescension to evil finally destroyed the balance of my soul._

**How long until the attackers have had their fill?**

Just one of these heists provides enough money that the recipient would never need to work again, so the continuation suggests that these actors seek power, not riches. Or perhaps money is of little interest to the technical mind, who plays with their victims like a cat with a mouse.

**It shows the immaturity of the industry when these attacks draw so little attention.** Outside of cryptocurrency, a seven million dollar heist would create international headlines, yet to DeFi natives, this latest exploit appears somewhat dull, a basic repetition of a known attack vector.

As the majority of funds are held, and can be recovered via liquidation with a new controller from the vault, the attacker has created a sizable bounty.

Perhaps in the future, an altruistic attacker will use this method to provide users with a chance to redeem their funds instead of just taking them. **Attackers could hold funds at ransom and request a payment for their return; forcing the protocol to pay or further ruin their reputation.**

Dr Jekyll did not create a potion to remove the evil parts of his nature. He made a potion that allowed him to express his urges without feeling guilty and without any consequences to his reputation.

**DeFi is a world of pseudonyms and plotting, where anonymity gives power and white hats turn to grey.**

When warp.finance used Twitter to thank their white hat developers, there was a conspicuous familiarity to the [names ](https://twitter.com/warpfinance/status/1339751978977685507?s=20)they mentioned.

**We all break bread with these familiar faces, but do they drink our milkshake when our backs are turned?**
![](https://lh6.googleusercontent.com/G8QlXjqEUXZq0bbcMpE2TDey6BmRdSY49EEHs1z1vEjA-Lg0_aAl-CVI-KGXXIsHAf3RjyLfKyFWyb69Bf-E_HOx2a_Jz_V5EuSDN0YEQ5euqOEdNANHHDb_Q5Mq6la5bGn_xI76)
