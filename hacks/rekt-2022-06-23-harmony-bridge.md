---
tags:
  - blockchain/bsc
  - sector/bridge
  - sector/dex
  - sector/multisig
  - sector/staking
  - sector/token
  - precondition/insider
title: "Harmony Bridge - REKT"
protocol: "[[Harmony Bridge]]"
date: 2022-06-23
loss_usd: 100000000
auditors:
source: "https://rekt.news/harmony-rekt"
excerpt: "Harmony has hit a bum note. To the tune of $100M. Were nine figures really secured by just two signatures? And is this the final encore for Harmony Network?"
genome:
  - "[[insider]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
---
# Harmony Bridge - REKT

> **Loss:** $100,000,000 | **Date:** 2022-06-23 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/06/harmony-header.png)

**Harmony has hit a bum note.**

_To the tune of $100M._

This is the 3rd bridge in the [top 10](https://rekt.news/leaderboard/), and the second drained via compromised private keys.

Over 14 hours after the first funds began to move, the theft was [announced](https://twitter.com/harmonyprotocol/status/1540110924400324608).

**Were nine figures really secured by just _two_ signatures?**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [RugDocIO](https://twitter.com/RugDocIO/status/1540151929728249856), [BeosinAlert](https://twitter.com/BeosinAlert/status/1540224748214398977)_

**The Harmony Bridge was secured by a 2 of 5 [multisig](https://etherscan.io/address/0x715CdDa5e9Ad30A0cEd14940F9997EE611496De6), of which the [following addresses](https://twitter.com/RugDocIO/status/1540151942214651904) were compromised:**

[0xf845A7ee8477AD1FB4446651E548901a2635A915](https://etherscan.io/address/0xf845A7ee8477AD1FB4446651E548901a2635A915)

[0x812d8622C6F3c45959439e7ede3C580dA06f8f25](https://etherscan.io/address/0x812d8622C6F3c45959439e7ede3C580dA06f8f25)

The attack vector which allowed the hacker to take control of these addresses remains unknown, though some have [speculated](https://twitter.com/Mudit__Gupta/status/1540225237912010753) that they were hot wallets with private keys kept in plaintext.

If an attacker managed to gain access to the servers running these hot wallets, they would have access to the two addresses necessary to pass any transactions they like, such as draining $100M from the bridge.

**Exploiter address:** [0x0d043128146654c7683fbf30ac98d7b2285ded00](https://etherscan.io/address/0x0d043128146654c7683fbf30ac98d7b2285ded00)

**Harmony ETH Bridge:** [0xf9fb1c508ff49f78b60d3a96dea99fa5d7f3a8a6](https://etherscan.io/address/0xf9fb1c508ff49f78b60d3a96dea99fa5d7f3a8a6)

**Harmony ERC20 Bridge:** [0x2dCCDB493827E15a5dC8f8b72147E6c4A5620857](https://etherscan.io/address/0x2dCCDB493827E15a5dC8f8b72147E6c4A5620857)

**Harmony BUSD Bridge:** [0xfd53b1b4af84d59b20bf2c20ca89a6beeaa2c628](https://etherscan.io/address/0xfd53b1b4af84d59b20bf2c20ca89a6beeaa2c628)

Beginning at 11:06 UTC, the hacker sent [13.1k ETH](https://etherscan.io/tx/0x27981c7289c372e601c9475e5b5466310be18ed10b59d1ac840145f6e7804c97) from the ETH Bridge to the exploiter’s address, [5.5M BUSD](https://etherscan.io/tx/0x44256bb81181bcaf7b5662614c7ee5f6c30d14e1c8239f006f84864a9cda9f77) from the BUSD Bridge and drained the [following assets](https://etherscan.io/tokentxns?a=0x0d043128146654c7683fbf30ac98d7b2285ded00) from the ERC20 Bridge:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/06/harmony-explorer.png)

The above were sent on to exploiter addresses [2](https://etherscan.io/address/0x9e91ae672e7f7330fc6b9bab9c259bd94cd08715) and [3](https://etherscan.io/address/0x58f4baccb411acef70a5f6dd174af7854fc48fa9), swapped into ETH and returned to the main address, where they remain.

On BSC, the attacker also took 5k BNB and 640k BUSD which also remain in the [BSC address](https://bscscan.com/address/0x0d043128146654c7683fbf30ac98d7b2285ded00).

**The flow of funds can be seen in [Peckshield’s graphic](https://twitter.com/peckshield/status/1540215805366964224) below:**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/06/harmony-peckshield.png)

Since the hack, the number of signers has been [updated to 4](https://twitter.com/BeosinAlert/status/1540224753948303361).

_Too little, too late._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Since the leaderboard-topping [Ronin](https://rekt.news/ronin-rekt/) incident, in which keys to 5 of 9 validators were compromised, there has been much talk of the sophisticated [spearphishing campaigns](https://rekt.news/big-phish/) ascribed to the Lazarus group.**

With threats like these known to be [relentlessly targeting](https://www.kaspersky.com/blog/snatchcrypto-bluenoroff/43412/) cryptocurrency projects, the fact that another entire network’s official bridge could be drained by compromising just two addresses is far from acceptable.

**Not only should the other cases have set the alarm bells ringing, but in early April [@_apedev](https://twitter.com/_apedev/status/1510007663832223751) specifically called out the Harmony bridge’s precarious security situation.**

How did the devs overlook, and then ignore, such lax security for securing 9 figures of users’ funds?

Harmony always struggled with attracting users.

After this attack, and with market sentiment at all time lows, is this the final encore for Harmony Network?

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
