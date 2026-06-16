---
tags:
  - blockchain/bsc
  - sector/bridge
  - impact/loss-of-funds/direct-drain
  - impact/mev/frontrun
title: "Safemoon - REKT"
protocol: "[[Safemoon]]"
date: 2023-03-28
loss_usd: 8900000
auditors:
source: "https://rekt.news/safemoon-rekt"
excerpt: "Not so safe after all. Yesterday, Safemoon lost $8.9M worth of supposedly locked LP thanks to a bug introduced in the project’s latest upgrade. How much longer can Safemoon last?"
genome:
  - "[[direct-drain]]"
  - "[[frontrun]]"
  - "[[bridge-message-validation]]"
  - "[[frontrun-exposure]]"
  - "[[upgrade-safety]]"
---
# Safemoon - REKT

> **Loss:** $8,900,000 | **Date:** 2023-03-28 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/safemoon-header.png)

_Not so safe after all._

**Yesterday, [Safemoon](https://twitter.com/safemoon/) lost $8.9M worth of ‘locked LP’ thanks to a bug introduced in the project’s latest upgrade.**

The attack, which drained the SFM/BNB pool, was [announced](https://twitter.com/safemoon/status/1640825402795991048) by the project and its CEO, [John Karony](https://twitter.com/CptHodl/status/1640914110350016512), with replies disabled on both tweets.

A few hours after the attack, the hacker sent a message to the Safemoon: Deployer address, [claiming](https://bscscan.com/tx/0xf98a8b7e3ffee676f06f0c037141483ec2c9cf8753a57fbcdbd718590e4d77ff) to be MEV bot operator willing to return the funds:

>Hey relax, we are accidently frontrun an attack against you, we would like to return the fund, setup secure communication channel , lets talk

_However, past on-chain [activity](https://twitter.com/BeosinAlert/status/1640893350919438336) suggests they are [no white knight](https://twitter.com/bbbb/status/1640867460172619776) after all…_

**Even if the team has dodged a bullet this time…**

_…can they be trusted after such a basic error?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Peckshield](https://twitter.com/peckshield/status/1640855857910149122), [MoonMark](https://twitter.com/MoonMark_/status/1640844732082290688)_

Just over six hours before the attack, the [Safemoon: Deployer](https://bscscan.com/address/0x678ee23173dce625a90ed651e91ca5138149f590) address [upgraded](https://bscscan.com/tx/0x71273e731752457892f73d2ad8b89060bd4f0bf131ed403d5dfc149319c1c01d) the token [contract](https://bscscan.com/address/0x42981d0bfbaf196529376ee702f2a9eb9092fcb5) to a [new implementation](https://bscscan.com/address/0xeb11a0a0bef1ac028b8c2d4cd64138dd5938ca7a#code). In doing so, the team introduced a vulnerability leading to an astonishingly simple exploit.

**The new code left the burn() function publicly callable, allowing anyone to burn SFM tokens from any address.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/safemoon-burn.png)

This allowed the attacker to burn large quantities of SFM held inside the SFM:BNB liquidity pool, vastly inflating the price of SFM tokens in the pool.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/safemoon-code.png)

**Then, by selling (previously acquired) SFM tokens into the skewed pool, the attacker was able to drain it of BNB liquidity, for a profit of 28k BNB, or $8.9M.**

Exploit tx: **[0x48e52a12…](https://bscscan.com/tx/0x48e52a12cb297354a2a1c54cbc897cf3772328e7e71f51c9889bb8c5e533a934)**

Attacker’s address: **[0x286e09932b8d096cba3423d12965042736b8f850](https://bscscan.com/address/0x286e09932b8d096cba3423d12965042736b8f850)**

The hacker [claims](https://bscscan.com/tx/0xf98a8b7e3ffee676f06f0c037141483ec2c9cf8753a57fbcdbd718590e4d77ff) to have frontrunned attack and has [reached out](https://bscscan.com/tx/0x9335559f951b3ae42218fff473ebd9fdf3231e8e10d157a6b6d629c5a30ba65f) to Safemoon to negotiate the return of funds, the majority of which have since been [transferred](https://bscscan.com/tx/0xfd2aee213c3d357b3dd12be73385313879bbed4ee9b84a03dace2cea45e9e737) to [0x237D](https://bscscan.com/address/0x237d58596f72c752a6565858589348d0fce622ed) where they remain at the time of writing.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Since its launch two years ago, Safemoon has been beset by scandal.**

Initially labelled as a pump and dump scheme, Safemoon shillfluencers were later slapped with a [class action suit](https://www.classaction.org/media/merewhuader-et-al-v-safemoon-llc-et-al.pdf), before Coffeezilla published a series of detailed [investigations](https://www.youtube.com/watch?v=CzbBi0agLNg) into what went on behind the scenes.

The favourite of [tiktok investors](https://twitter.com/TikTokInvestors/status/1384175716535730180) during the peak of Spring 2021’s [BSC hype](https://rekt.news/bsc-the-bridge-to-defi/), Safemoon claimed it was un-ruggable due to locked liquidity, which was [topped-up](https://safemoon.com/whitepaper.pdf) with every transfer of tokens. However, the transfer fees were also criticised as ponzinomics as bagholders were disincentivised to sell.

At the peak of [shitcoin szn](https://rekt.news/shitcoins/), we wrote:

>the shitcoins show no sign of stopping

**The markets have cooled down significantly since then, and it seems hardly believable that some of these projects have managed to survive this far….**

Given the vulnerability was introduced by the project’s deployer address, Peckshield (perhaps charitably, or perhaps via Hanlon’s Razor) [suggested](https://twitter.com/peckshield/status/1640855857910149122) that admin keys may have been leaked or phished.

Regardless of whether the funds are in the hands of a blackhat hacker or whitehat MEV frontrunner, the lack of trust in Safemoon from the wider crypto community suggests they’ll unlikely be safe, even with the team…

Whether a botched rug attempt, or sheer incompetence, this episode is not a good look for a project that was never very highly regarded.

Despite all the bad press, any remaining soldiers in the SFM army appear to still believe, or are suffering from a bagholder’s case of Stockholm Syndrome.

_Perhaps if they haven’t been put off by now, they never will be._

**And even if this turns out to be a lucky escape for Safemoon, errors like this don’t bode well for the project’s future.**

_How much longer can Safemoon last?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
