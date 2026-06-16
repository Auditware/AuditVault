---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - has/audit
  - sector/gaming
  - sector/staking
title: "Penpie - Rekt"
protocol: "[[Penpie]]"
date: 2024-09-03
loss_usd: 27000000
auditors:
  - "[[Watch Pug]]"
  - "[[Zokyo]]"
source: "https://rekt.news/penpie-rekt"
excerpt: "The crypto world never sleeps and neither do its hackers. In the latest episode of Who Wants to Be a Millionaire - DeFi Edition, Penpie has found itself on the wrong end of a $27 million exploit."
genome:
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Penpie - Rekt

> **Loss:** $27,000,000 | **Date:** 2024-09-03 | **Audited by:** Watch Pug, Zokyo

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/penpie-rekt-header.png)


_The crypto world never sleeps and neither do its hackers._

  

**In the latest episode of "Who Wants to Be a Millionaire: DeFi Edition," [Penpie](https://x.com/Penpiexyz_io) has found itself on the wrong end of a $27 million exploit.**

  

On September 3rd, a yield farming protocol, built atop the [Pendle Finance](https://x.com/pendle_fi) ecosystem, learned a costly lesson in the dangers of complex financial integrations.

  

As news of the exploit spread, the [PNP token](https://www.coingecko.com/en/coins/penpie) went into a free fall, tanking a brutal 40%, while the [PENDLE token](https://www.coingecko.com/en/coins/pendle) didn't escape unscathed, taking a 9% hit in the chaos.

  
**Another gentle reminder that in the high-stakes game of yield farming, sometimes the only thing you harvest is regret.**  
  
_When the music stops in this high-risk DeFi dance, which investors will be left holding empty bags?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Chaofan Shou](https://x.com/shoucccc/status/1831044487323529639), [Cyvers](https://x.com/CyversAlerts/status/1831050629050954035), [Pendle](https://x.com/pendle_fi/status/1831051530214203808), [Penpie](https://x.com/Penpiexyz_io/status/1831058385330118831), [PeckShield](https://x.com/peckshield/status/1831072098669953388), [Ancilia](https://x.com/AnciliaInc/status/1831082197312516588)_

  

**The first signs of trouble came when [Chaofan Shou raised the alarm](https://x.com/shoucccc/status/1831044487323529639) on Twitter: "Seems like Penpie got hacked. $17M loss."**

  

It didn't take long for the blockchain sleuths to mobilize, within 20 minutes, [Cyvers confirmed the worst](https://x.com/CyversAlerts/status/1831050629050954035) as the damage had ballooned to a staggering $27 million.

  

Pendle Finance, the platform underlying Penpie, was [quick to reassure users](https://x.com/pendle_fi/status/1831051530214203808) that their own funds were secure.

  

Nevertheless, they hit the pause button on all contracts to further mitigate the damage.

  

[Penpie followed suit](https://x.com/Penpiexyz_io/status/1831058385330118831), admitting to a "security compromise" and freezing all deposits and withdrawals.

  

**In a space where code is supposed to be law, it seems some crafty lawyers found a loophole.**  
  
_But in this digital courtroom, who's really calling the shots?_

  

According to the blockchain gumshoes at PeckShield, [the root cause](https://x.com/peckshield/status/1831072098669953388) was "the introduction of an evil market that was used to inflate the staking balance to claim unwarranted rewards."

  

**Translation for the non-tech savvy: the attacker created a fake Pendle market, essentially tricking Penpie's contracts into thinking they were dealing with the real McCoy.**  
  
_[Ancilia provided more information](https://x.com/AnciliaInc/status/1831082197312516588), highlighting that the exploit stemmed from a sneaky loophole in Penpie's batchHarvestMarketRewards() function._  
  
In a flash, the attacker launched a reentrancy attack, creating a fake Pendle market to dupe Penpie's contracts.  
  
When the _harvestBatchMarketRewards() function called redeemRewards(), the hacker's contract slipped in, executing a deceptive maneuver that would make seasoned con artists envious.  
  
**The end result? A textbook double-dip, inflating the attacker's staking balance and siphoning off undeserved rewards.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/penpie-exploit.png)

**Exploit transaction:** [0x56e09abb35ff12271fdb38ff8a23e4d4a7396844426a94c4d3af2e8b7a0a2813](https://etherscan.io/tx/0x56e09abb35ff12271fdb38ff8a23e4d4a7396844426a94c4d3af2e8b7a0a2813)

  

**Exploiter Addresses:**
[0x7a2f4d625fb21f5e51562ce8dc2e722e12a61d1b  
](https://etherscan.io/address/0x7a2f4d625fb21f5e51562ce8dc2e722e12a61d1b)[0xc0Eb7e6E2b94aA43BDD0c60E645fe915d5c6eb84](https://etherscan.io/address/0xc0eb7e6e2b94aa43bdd0c60e645fe915d5c6eb84)

  

**Fake Pendle Market:**  
[0x0ab305033592E16dB7D8e77d613F8d172a76ddc9](https://etherscan.io/address/0x0ab305033592e16db7d8e77d613f8d172a76ddc9)

  

**Attack contracts:**  
  

**Arbitrum:**  [0x4BC9815b859c8172CEe1ab2CD372fD0Eb00eb487](https://arbiscan.io/address/0x4bc9815b859c8172cee1ab2cd372fd0eb00eb487)

**Ethereum:** [0x4aF4C234B8CB6e060797e87AFB724cfb1d320Bb7](https://etherscan.io/address/0x4af4c234b8cb6e060797e87afb724cfb1d320bb7)

  


  

Despite [audits by WatchPug and Zokyo](https://docs.penpiexyz.io/security/audit-reports), this glaring oversight slipped through the cracks.  
  
Penpie has [posted a message to the hacker](https://x.com/penpiexyz_io/status/1831157212963598555?s=46) on Twitter, hoping to retrieve the stolen loot.  
  
Pendle [posted a Post Mortem](https://x.com/pendle_fi/status/1831168623634993402) on behalf of Penpie on Twitter, where they mentioned the $105 million that wasn’t stolen, but failed to mention what was stolen and the specifics behind the exploit.  
  
Yet another reminder that even in the world of trustless systems, we're still putting an awful lot of faith in protocols to do their security due diligence.  
  
**The exploiter, armed with nothing more than some clever code and a dash of audacity, managed to outsmart multiple layers of supposed security.**  
  
_In this game of digital cat and mouse, are we building fortresses or just more elaborate mazes?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Penpie's misfortune serves as a stark reminder that in the wild west of DeFi, even the sharpest tools can get dulled._

  

**It's a tale as old as time (or at least as old as smart contracts), in the rush to innovate, security sometimes takes a back seat.**

  

As the DeFi space continues to evolve at breakneck speed, it's clear that even more rigorous security measures and audit processes are needed.

  

_But in a world where "move fast and break things" is the modus operandi, can we really expect protocols to pump the brakes?_  
  
Is it too much to ask protocols that hold millions in users funds to audit every upgrade?  
  
In this case, it appears so.

  
**For now, Penpie joins the ever-growing list of protocols that have fallen victim to exploits in the digital Wild West.**  
  
_Is it time for DeFi protocols to prioritize security over speed, thoroughly auditing upgrades and fortifying defenses, or will they continue to gamble with user funds and leave themselves vulnerable to relentless blackhat gunslingers?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
