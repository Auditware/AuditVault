---
tags:
  - sector/bridge
  - sector/lending
  - sector/oracle
  - sector/stable
  - sector/staking
  - impact/loss-of-funds/direct-drain
  - impact/loss-of-funds/locked-funds
title: "Mirror Protocol - REKT"
protocol: "[[Mirror Protocol]]"
date: 2021-10-08
loss_usd: 92000000
auditors:
source: "https://rekt.news/mirror-rekt"
excerpt: "Mirror mirror on the wall… $90 million stolen, but that’s not all. Two exploits hit Mirror Protocol, and the larger of the two wasn’t even noticed at first."
genome:
  - "[[direct-drain]]"
  - "[[locked-funds]]"
  - "[[bridge-message-validation]]"
  - "[[chainlink-round-completeness]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Mirror Protocol - REKT

> **Loss:** $92,000,000 | **Date:** 2021-10-08 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/mirror-header.png)
**Mirror mirror on the wall…**

**$90 million stolen, but that’s not all.**

_Two exploits hit Mirror Protocol, and the larger of the two wasn’t even noticed at first._

When the [Ronin Bridge hack](https://rekt.news/ronin-rekt/) was announced, we were all shocked to hear the funds were missing for a week before the alarm was raised. 

It took Mirror Protocol _seven months,_ to spot the loss, and when they did finally notice, they didn’t publicly announce anything.

And then, 232 days later, they were hit again.

The day after the first loss was revealed, another $2M was taken.

**How embarrassing.** 

_Mirror devs need to take a long hard look in the…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [FatManTerra](https://twitter.com/FatManTerra/status/1529978941062139906), [pedroexplore1](https://twitter.com/FatManTerra/status/1529978941062139906)_ 

The first exploit, executed on the 8th of October 2021, involved repeatedly unlocking collateral deposited against short positions on Mirror Protocol.

The [lock contract](https://github.com/Mirror-Protocol/mirror-contracts/blob/main/contracts/mirror_lock/src/contract.rs) did not contain a duplicate call check for withdrawals, allowing the attacker to drain funds deposited by other users by calling _unlock_position_funds_ for their own position ID multiple times.

**Attack transaction:** [08DD2B70…](https://finder.terra.money/classic/tx/08DD2B70F6C2335D966342C20C1E495FD7A8872310B80BAF3450B942F79EBC1F)

_For a step-by-step analysis see this [BlockSec blog post](https://blocksecteam.medium.com/how-the-mirror-protocol-is-exploited-33b5c1d48322)._

Despite the vulnerability remaining live, [no followup](https://twitter.com/pedroexplore1/status/1530286785565171712) attack was made; the balance of the lock contract never rose high enough to exploit again without alerting the protocol’s userbase.

As FatManTerra [pointed out](https://twitter.com/FatManTerra/status/1529978968643981313) on Twitter: 

>”All of this went completely unnoticed by TFL and the Mirror team & community.”

On the 14th of May, the vulnerability was finally, and quietly, [patched](https://github.com/Mirror-Protocol/mirror-contracts/commit/56cc6946b9457293ede6aa0feb296ee1d16f6974?diff=split) with no mention of the bug nor the $90M loss it had produced just seven months earlier.

Suspicions were raised when users on the forum began to look into the bugfix, provoking a [discussion](https://forum.mirror.finance/t/was-there-a-security-hole-in-the-lock-contract/3390) as to why the devs had “smuggled” in the fix without an announcement.

Eventually, the details were [published](https://twitter.com/FatManTerra/status/1529978941062139906) by FatMan on 27th May.

However, the day after the news of the original incident broke, the latest exploit was spotted.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Mirror Hack Two: LUNA Switcheroo**

_Source: [Mirroruser](https://forum.mirror.finance/t/another-exploit/3511), [Blockpane](https://twitter.com/blockpane/status/1531369644531101696), [FatManTerra](https://twitter.com/fatmanterra/status/1531365988809293825)_

“Mirroruser” first [posted](https://forum.mirror.finance/t/another-exploit/3511) the details to the Mirror forum, alerting the community to the loss of funds.

Due to the same mispricing of LUNC that led to the Anchor [exploit](https://twitter.com/vic_vae/status/1530640035116113920), LUNC was assigned the value of LUNA 2.0 on the new chain, at the time ~5 USTC (approx. ~$0.10).

The issue was down to Luna Classic validators [running an out-of-date oracle](https://twitter.com/blockpane/status/1531369644531101696), which hadn’t been updated for the legacy chain.

This meant that users could buy cheap LUNC, deposit as collateral, and take advantage of the overvaluation to drain Mirror’s pools. The protocol’s mBTC, mETH, mDOT and mGLXY were drained, totalling ~$2M for the attacker.

After news of the exploit over the weekend, the oracle was successfully fixed, but the problems didn't stop there.

All mAssets (Mirror-wrapped stocks) were still for the taking, unable to be traded until markets opened following the long-weekend. The worry was that the previously stolen funds would be used to snap up the remaining, [vastly-undervalued](https://twitter.com/FatManTerra/status/1531544246792118272) mAssets.

However, with just minutes to spare before markets opened on Tuesday, the stolen funds were disabled for use as collateral, saving what remained of the protocol.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**The fact that a $90M exploit went unnoticed by users (and probably the devs), is symptomatic of the recklessness associated with the failings around the Terra ecosystem.**

The simplicity of the vulnerabilities seems out of place when compared with the damage that has been done. Firstly, $90M was lost to a basic logic bug, and then, the rushed fork led to the oversight of a very [foreseeable](https://twitter.com/ChainLinkGod/status/1531384782046711808) oracle issue.

**Even in the face of these failures, [Luna 2.0 is pumping](https://www.youtube.com/watch?v=HJzwEi9iJsc) and, despite having lost billions of dollars of other people's money, Do Kwon remains as [arrogant](https://twitter.com/Tree_of_Alpha/status/1530851485889724416) as ever.**

In his rush to repair his reputation, Kwon is taking advantage of all those who are stuck fighting sunk-costs; the developers who invested their time, and retail, who invested their savings.

**DeFi today feels like it has lost a sense of purpose. Our reputation is damaged, and even the keenest users have less confidence.**

We may have advanced our methods of wealth distribution, but our moral compass clearly still needs an update.

_Imagine our industry without all the ego… How much of this damage could have been prevented?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
