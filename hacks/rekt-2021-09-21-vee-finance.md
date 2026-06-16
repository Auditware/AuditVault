---
tags:
  - blockchain/avalanche
  - blockchain/ethereum
  - has/audit
  - sector/bridge
  - sector/dex
  - sector/oracle
  - sector/privacy
  - sector/stable
title: "Vee Finance - REKT"
protocol: "[[Vee Finance]]"
date: 2021-09-21
loss_usd: 34000000
auditors:
  - "[[Slowmist]]"
source: "https://rekt.news/veefinance-rekt"
excerpt: "Top ten thievery. $34 million taken from Vee Finance earns them the number 7 spot on our leaderboard, yet nobody seems surprised. What’s normal for us is not normal elsewhere."
genome:
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Vee Finance - REKT

> **Loss:** $34,000,000 | **Date:** 2021-09-21 | **Audited by:** Slowmist

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/vee-header.png)
**Top ten thievery.**

$34 million taken from [Vee Finance](https://vee.finance/) earns them the number 7 spot on our [leaderboard.](https://www.rekt.news/leaderboard/)

As [AVAX](https://www.coingecko.com/en/coins/avalanche) rises in popularity, its crime rates increase accordingly. This is the second substantial loss on the Avalanche network this month.

On the 12th of September [Zabu Finance](https://twitter.com/zabufinance/status/1436844509644537856) lost ~$3.2M; a small sum compared to [today’s loss](https://twitter.com/VeeFinance/status/1440176202673623040?s=20), yet still a huge haul for those who are not used to the drama of DeFi.

**What’s normal for us is not normal elsewhere.**

_34 million dollars stolen, but this story is just one of many._ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_The following is taken from the (first) [official post-mortem.](https://veefi.medium.com/vee-finance-attack-analysis-a4839724e085)_

**Exploiter ETH Address:** [0xeeee458c3a5eaafcfd68681d405fb55ef80595ba](https://etherscan.io/address/0xeeee458c3a5eaafcfd68681d405fb55ef80595ba)

**Exploiter AVAX Address:** [0xeeeE458C3a5eaAfcFd68681D405FB55Ef80595BA](https://cchain.explorer.avax.network/address/0xeeeE458C3a5eaAfcFd68681D405FB55Ef80595BA/transactions)

The exploiter’s [Ethereum address](https://etherscan.io/address/0xeeee458c3a5eaafcfd68681d405fb55ef80595ba) was funded via TornadoCash in three lots of 10 ETH: [ONE](https://etherscan.io/tx/0x1faa95fa7a542b34563a387d63c1c61d89e4a5e30848567d1e097753b3f7713f), [TWO](https://etherscan.io/tx/0x3e25d185a72a62c9e0d6bfa58b7a917978674b8aa97ecce3f6caa2ff2c59f3c2), [THREE](https://etherscan.io/tx/0x34b1765ee7778ada497af55856e52f2ce9259918ba56ae3d9c9fd06685c4e8e8).

The funds were then bridged to Avalanche, where the attacker swapped 26.999006274904347875 WETH.e for 1,369.708 AVAX via Pangolin.

The attacker then deployed exploit [contract 1](https://cchain.explorer.avax.network/tx/0x50a136886e45d018f84f194e49d47aaaa34e1bd5f2b51f2bdc42e4fd20999062) and used it to firstly [swap AVAX](https://cchain.explorer.avax.network/tx/0x031f388aabfa26df922603c377e002713c6315e2660b89e9eea0f0983fbe137c/token-transfers) for the targeted tokens, then create the following trading pairs:

[QI/WETH.e](https://cchain.explorer.avax.network/tx/0x072c8cb4a3d71f833d9b22965993657fd2a38e599ed0bcaa37554b39ac0be1b0)

[XAVA//WETH.e](https://cchain.explorer.avax.network/tx/0x6a05f6825273ff5ab5a6af4c22b2ab080fcfb152c45ff157e06f0f407c23fb24)

[LINK.e/WETH.e](https://cchain.explorer.avax.network/tx/0xf588a524d94e2b763361ec00e909b6b9ea9771eaea6a0f8a9137b22f4eda9250)

[QI/LINK.e](https://cchain.explorer.avax.network/tx/0x3579b8e772883aa77c22332b36dd4498c1016fed51ae58638d525934a83a9a88)

[XAVA/LINK.e](https://cchain.explorer.avax.network/tx/0x018dea69171e5451918530b13f750c9e4e528d161bc040be6079a15a5d1e007f)

[XAVA/WBTC.e](https://cchain.explorer.avax.network/tx/0x302a831bb6658d105f3772624078cec5600367d38cff351adb8cd87e005f5ac8)

[LINK.e/WBTC.e](https://cchain.explorer.avax.network/tx/0xf37d07ea719c3bccc02a45f3c9e65a3ed4c436fdee192d5a53f5453ea109d9d1)

**Once the attack contract had been funded with 20 AVAX in 5 addresses, the preparation was complete and the exploit execution could begin.**

After initially [failing](https://cchain.explorer.avax.network/tx/0xc5b769e26fb0f384965c407a08d38e875a4aa1c39944176b426998dbb18da617) due to low gas, the attacker was able to use a dynamic contract to conduct [leveraged trading](https://cchain.explorer.avax.network/tx/0xc490b881f7434af48a1f39ca2d71064e93a1802b5853e3312e8800468dc83b81/token-transfers) on the QI/WETH.e pair, before [failing](https://cchain.explorer.avax.network/tx/0x9db7688d5886a1f17e4bf730af3d7785487e4c4ef70856dd9ac21b32703e3b29) again.

After deploying a new [attack contract](https://cchain.explorer.avax.network/tx/0xfd2c5979d2857f385cc0b055a2a4320e0e63e389404fd9e12a169dbdb5b20ac0), the same steps were used, this time successfully.

Repeated [trades](https://cchain.explorer.avax.network/tx/0x83821d9869467395583f1d42be15b5e0387e30634fcc2ac75d005ac190dc94dc) of USDT.e to ETH.e were made via AugustusSwapper.

And a third attack was [deployed.](https://cchain.explorer.avax.network/tx/0xb9581cb407c67db29a18ce9f056be69d05e0c47909c988a9fd0fe07589bf9709)

During leveraged trading, Vee Finance uses a single source price oracle: the prices of assets in the Pangolin pools. Via trading between these newly created pairs, the attacker was able to manipulate the prices that Vee Finance referenced.

This manipulation, together with the fact that price acquisition wasn’t processed for decimals, allowed for the approval of transactions that would usually not pass the protocol’s slippage check.

For an in-depth analysis of the exploit, see Vee Finance’s [second post-mortem](https://veefi.medium.com/the-main-cause-of-vee-finance-attack-7a8475085ec5) of the day.

The stolen funds were bridged back to Ethereum during and after the attack, over a series of over 100 transactions, for example [this transaction.](https://cchain.explorer.avax.network/tx/0x84ec1d428149a73bebc4adcc8bc2906647e2ad4e43ceb8435e6ffeb9298a9bc0/token-transfers) 

_The exploiter’s Ethereum wallet currently holds a total of 214 WBTC ($9.3 M) and 8,804 WETH ($26.9M)_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**According to Vee Finance’s [incident report](https://veefi.medium.com/vee-finance-accident-announcement-5e75ff197da6) “The VEE team is actively working to further clarify the incident and will continue to try to contact the attacker to recover the assets” and are appealing to the hacker to take a bug bounty.**

The team sent a transaction to the exploiter’s addresses on both [Ethereum](https://etherscan.io/tx/0x8af5730d2a4f3e2eb3e229f79d7ce6b6ee946fd228f182c6c3a70651acb98669) and [Avalanche](https://cchain.explorer.avax.network/tx/0x2e5f6e2cafeb9a75cb73168ceace867fc343bc1cb351a9e1213b05ea3bf43922/internal-transactions), with the following message, also sharing on [Twitter](https://twitter.com/VeeFinance/status/1440217570339016704):

>Hello, this is vee.finance team. We are willing to launch a bug bounty program for the bug you identified, please contact us via contact@vee.finance.

Other incoming transactions contained messages, too, ranging from [warnings:](https://etherscan.io/tx/0x83c3ff56ae9cfdae1679abd69c0be9070fdaf646e04b23572e0bf3ecbbee961a) 

>Your address has been caught by the team

To [self-promo](https://etherscan.io/tx/0x066f2970fee658c063bc8e909f1fbf6d583b62704aab022fbd060b1b17ffc99f):

>Hello this is @yannickcrypto, please follow me on twitter https://twitter.com/yannickcrypto_

To outright [begging on-chain:](https://cchain.explorer.avax.network/tx/0x3c9f0298ed6a5a2ece4118934fd379392af3bd352a5da210d1e5b28f144ab514/internal-transactions)

>Big man, send me some for a poor man who can't afford to eat

**At press time, there was still no response from Big man.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Vee Finance ignored the recommendations given in their [Slowmist audit](https://github.com/VeeFinance/audit/blob/main/2021-9-09_SlowMist%20Security%20Audit%20Vee%20Finance/Smart%20Contract%20Security%20Audit%20Report%20-%20Vee%20Finance.pdf), and their [Certik audit](https://github.com/VeeFinance/audit/blob/main/2021-5-26_Certik%20Security%20Audit%20Vee%20Finance/Vee-Certik%20Audit%20report.pdf) wasn’t much help either.**

Any project which appears in “pump groups” such [as this one](https://t.me/newgpg) is not doing well at all.

**Will we see a vee-shaped recovery, or has all the value veritably vanished?**

_(Please consider the task of your anonymous author when naming your protocols)_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)

>If you enjoy our work, please donate to our [Gitcoin Grant.](https://gitcoin.co/grants/1632/rektnews-the-dark-web-of-defi-journalism)
