---
tags:
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/stable
  - vuln/reentrancy/read-only
  - vuln/reentrancy/single-function
  - novelty/known-pattern
title: "EraLend - REKT"
protocol: "[[Eralend]]"
date: 2023-07-25
loss_usd: 3400000
auditors:
source: "https://rekt.news/eralend-rekt"
excerpt: "One more added to the list. EraLend lost $3.4M to the rampant read-only reentrancy bug plaguing protocols across the cryptosphere. Comments are not effective reentrancy protection."
genome:
  - "[[read-only]]"
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# EraLend - REKT

> **Loss:** $3,400,000 | **Date:** 2023-07-25 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/eralend-header.png)

_One more added to the list._

**Yesterday, [EraLend](https://twitter.com/Era_Lend), a lending platform on zkSync Era, lost $3.4M to the rampant read-only reentrancy bug plaguing protocols across the cryptosphere.**

The [alarm was raised](https://twitter.com/spreekaway/status/1683817944470396928) and the losses [stacked up](https://twitter.com/spreekaway/status/1683822041844027393). Syncswap was [keen to reassure](https://twitter.com/syncswap/status/1683831056015949826) their users that they were not at risk, though recommended pulling LP tokens from EraLend as a precaution. In the end, only USDC deposits on EraLend were affected.

This is the second [leaderboard](https://rekt.news/leaderboard/) entry to come from zkSync, after [Merlin DEX](https://rekt.news/merlin-dex-rekt/)’s $1.8M rugpull in April.

_With hack szn hotting up, where will be hit next?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Spreekaway](https://twitter.com/spreekaway/status/1683823980816236545), [Peckshield](https://twitter.com/peckshield/status/1683830339637219328)_

_Read-only reentrancy is nothing new, with last Friday’s attack on [Conic Finance](https://rekt.news/conic-finance-rekt/) the latest in a long line of projects rekt by the issue._

**In EraLend’s case, the attacker was able to exploit the vulnerability via a callback when burning LP tokens.**

>in the syncswap LP tokens, one can burn, then callback before update_reserves is called. so the oracle uses an incorrect reserves value to calculate the price, resulting in an inflating oracle price.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/eralend-code.png)

The buggy code was recycled from SyncSwap, but improperly implemented. Astonishingly, the code even contained the comment pointing out the potentially risky routine, which was apparently ignored:

>Note reserves are not updated at this point to allow read the old values.

**But comments are [not effective reentrancy protection](https://twitter.com/pcaversaccio/status/1683860327778209792).**

Exploiter address: **[0xf1D076c9Be4533086f967e14EE6aFf204D5ECE7a](https://explorer.zksync.io/address/0xf1D076c9Be4533086f967e14EE6aFf204D5ECE7a)**

Example attack txs: [0x7ac4da1e…](https://explorer.zksync.io/tx/0x7ac4da1ea1b0903dfabda56f713ea5e4a960a3fc34467a844d037f86ee8bfe98), [0x99efebac…](https://explorer.zksync.io/tx/0x99efebacb3edaa3ac34f7ef462fd8eed85b46be281bd1329abfb215a494ab0ef)

_Of the $3.4M lost from EraLend, [Hacken](https://twitter.com/hackenclub/status/1684154146356871168) puts the attacker profits at around $2.66M and traced funds to addresses on ETH, ARB and OP._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**BlockSec tweeted a [warning](https://twitter.com/BlockSecTeam/status/1683830744961912832) to other projects that may be using the same code:**

>Alert! All projects that rely on the following Syncswap code need to be vigilant.

_But given the prevalence of this attack type over the last months, why haven’t all devs already double (or triple) checked by now?_

Peckshield, who [audited](https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Nexon-v1.0.pdf) EraLend (then Nexon Finance) in March, washed their hands of responsibility. The audit [apparently](https://twitter.com/pcaversaccio/status/1683860794084036611) “_assumes a trusted price oracle_”, simplifying their job by simply ignoring one of the trickiest and most exploitable parts of many DeFi protocols.

As [noted](https://www.youtube.com/live/9eyKxfC_EcA?feature=share&t=1162) by ChainSecurity’s Matthias Egli at EthCC last week, the losses from this string of hacks is far lower than the potential losses from far larger protocols that had been vulnerable before the vector was [discovered](https://chainsecurity.com/curve-lp-oracle-manipulation-post-mortem/) last year.

**But that silver lining likely doesn’t make much difference to EraLend users.**

_How long until this bug strikes again?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
