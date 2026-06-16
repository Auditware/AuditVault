---
tags:
  - blockchain/bitcoin
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/gaming
  - sector/governance
  - sector/lending
  - sector/multisig
  - sector/oracle
  - sector/privacy
  - sector/staking
  - sector/token
  - impact/loss-of-funds/direct-drain
  - trigger/first-deposit
title: "Ionic Money - Rekt"
protocol: "[[Ionic Money]]"
date: 2025-02-04
loss_usd: 6943774
auditors:
source: "https://rekt.news/ionic-money-rekt"
excerpt: "Fake LBTC, real losses. Social engineering artists convinced Ionic Money on Mode Network to accept counterfeit collateral, walked away with $6.9M, and left sister protocols holding toxic bags. Previou"
genome:
  - "[[direct-drain]]"
  - "[[first-deposit]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Ionic Money - Rekt

> **Loss:** $6,943,774 | **Date:** 2025-02-04 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/ionic-money-rekt-header.png)






_Mode network's golden child just learned a $6.9 Million lesson in trust._

  

**Ionic Money, fresh from rebranding their twice-hacked predecessor Midas, fell victim to the oldest trick in the DeFi playbook - fake collateral.**

  

The attackers, masquerading as Lombard Finance team members, convinced Ionic to list their counterfeit LBTC token.

  

Within hours, the exploiters minted themselves a mountain of fake tokens, borrowed everything not nailed down, and vanished through the Tornado Cash mixer - leaving behind a trail of empty vaults and red faces.

  

**The Mode team rushed to Twitter with their best "everything is fine" impression while Ionic stammered about "sophisticated social engineering."**

  

_In this game of digital masquerade, who's really wearing the mask - the attackers impersonating Lombard, or Ionic pretending they know what they're doing?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Ionic Money](https://x.com/ionicmoney/status/1886794417270317159), [CertiK](https://x.com/CertiKAlert/status/1886955515990979040), [Quill Audits](https://x.com/quillaudits_ai/status/1886856127499132961), [Lombard Finance](https://x.com/Lombard_Finance/status/1886801867591532802), [ZachXBT](https://x.com/zachxbt/status/1886792512917864953), [fbslo](https://x.com/fbsloXBT/status/1886815288571646258), [USD Denominated](https://x.com/YouAreMyYield/status/1887076221910991012)_

  

**Deep in [Mode network's](https://x.com/modenetwork) backwaters, [Ionic's "ongoing exploit" tweet](https://x.com/ionicmoney/status/1886794417270317159) on February 4th landed like a grenade in a chicken coop.**

  

But before we dive into this fresh disaster, [ZachXBT dropped a truth bomb](https://x.com/zachxbt/status/1886792512917864953) that puts everything in perspective - [Ionic is just Midas wearing a carnival mask](https://medium.com/@ionicmoney/ionic-protocol-introduction-e6e0b748f538).

  

The same Midas that got their pockets turned inside out twice in 2023 - [first for $660k](https://rekt.news/midas-capital-rekt/), then [another $600k encore](https://rekt.news/midas-rekt2/).

  

Because nothing says "trust us with your money" quite like a protocol hat-trick of catastrophe.

  

_[CertiK's front row seats](https://x.com/CertiKAlert/status/1886955515990979040) revealed a performance worthy of DeFi's greatest scammer showcase._

  

**No complex choreography needed - just deploy fake collateral, drain every vault in sight, bridge to Ethereum, and disappear through Tornado's mixer like a magic trick with extra steps.**

  

[QuillAudits traced](https://x.com/quillaudits_ai/status/1886856127499132961) our digital desperado's humble beginnings - 0.01 ETH and a dream.

  
Their masterpiece? A counterfeit [LBTC token](https://www.coingecko.com/en/coins/lombard-staked-btc) that would make even the most seasoned rugging enthusiasts slow clap in appreciation.

  

[Lombard Finance's terse statement](https://x.com/Lombard_Finance/status/1886801867591532802) said it all: "An unofficial LBTC has been deployed as collateral on the Ionic Money platform on Mode network.

  

_The on-chain breadcrumbs tell the tale._  
  
**Exploiter Address:**
[0x9E34d89C013Da3BF65fc02b59B6F27D710850430](https://explorer.mode.network/address/0x9E34d89C013Da3BF65fc02b59B6F27D710850430)

  

**Fake LBTC Contract:**
[0x964dd444e3192f636322229080a576077b06fba3](https://explorer.mode.network/token/0x964dd444e3192F636322229080A576077B06FbA3)

  

The attack itself played out like a speedrunner's masterpiece.  
  
**Mint 250 LBTC:**
[0x9aa3fd43a6b0f85b4f1bf74f0c9e79773f238591d9c6fe666287bd2c8ac19009](https://explorer.mode.network/tx/0x9aa3fd43a6b0f85b4f1bf74f0c9e79773f238591d9c6fe666287bd2c8ac19009)

  

With their freshly minted tokens, the attacker went shopping - borrowing MBTC, uniBTC, wrsETH, WETH, STONE, etc.

  

**Supply LBTC to Ionic (one of the transactions):**
[0x37e53b15cb7f298bd8c45fcbbd914ba90feb3946f5511fc55bc986b7472956df](https://explorer.mode.network/tx/0x37e53b15cb7f298bd8c45fcbbd914ba90feb3946f5511fc55bc986b7472956df)

  

**Borrow everything not nailed down (one of the transactions):**
[0x5db6d90a17a44bed6d9ed9ca73d800df2661751fa1a273e71fc2174ad3b6944f](https://explorer.mode.network/tx/0x5db6d90a17a44bed6d9ed9ca73d800df2661751fa1a273e71fc2174ad3b6944f)

  

The grand finale? 1,204 ETH ($3.2M) bridged straight into Tornado Cash's welcoming arms.

  

**Money Laundering Pipeline:**
[0x15Ed470607601274df6ED71172614B67001901Eb](https://etherscan.io/address/0x15ed470607601274df6ed71172614b67001901eb)

But our thrifty thief isn't done yet - they're still sitting on 38.34 MBTC worth north of $3.7 million in loans on Move, like a dragon hoarding its crypto treasure.

  
[Portfolio showing loans/borrows on Parsec](https://parsec.fi/address/0x9e34d89c013da3bf65fc02b59b6f27d710850430/portfolio)

  

[Flow of Funds on Parsec](https://parsec.fi/address/0x9e34d89c013da3bf65fc02b59b6f27d710850430/defi-trading)

  

_The team's Discord damage control hit peak comedy when [one team member explained](https://discord.com/channels/1126648675733606500/1126775030051786762/1336991727663190098): "it was quite a sophisticated social engineering exploit. They had a legitimate oracle, a legitimate whitelisted balancer pool, and a legitimate token contract that had real bridging integrations with LBTC."_

  

**Translation: they got fooled by a well-dressed scam.**

  

And in a moment of pure DeFi poetry, [one member of their Discord asked](https://discord.com/channels/1126648675733606500/1126775030051786762/1336946399350099989): “What the hell is social engineering?”  
  
Not sure you’re going to make it buddy. Surprised you made it this far.

  

[Some call it an inside job](https://x.com/fbsloXBT/status/1886815288571646258), others blame compromised comms.

  

Either way, almost $7 million vanished faster than trust in centralized exchanges.

  

The contagion spread through Mode's ecosystem like a bad case of crypto herpes.

  

_Our hacker's borrowed MBTC morphed into financial kryptonite, [leaving Ironclad and Layerbank holding bags](https://x.com/YouAreMyYield/status/1887076221910991012) heavier than their hopium addiction._

  

**"Our markets are solvent!" Ironclad screamed into the void, right before Merlin's team dropped their selective snapshot bomb.**

  

Great news for their chosen ones - instant death for everyone else's MBTC collateral.

  

In DeFi's game of musical chairs, some players start with the seats already bolted to their backs.

  

_Under the hood, this wasn't some 200 IQ exploit pulled from the depths of blockchain wizardry._

  

**Our craft social engineers skipped Lombard's security theater entirely, turning their mint function into a personal money printer that would make Jerome Powell blush.**

  

The scoreboard? 1,204 ETH ($3.2M) already living their best life in Tornado Cash's witness protection program, while another $3.7M sits pretty on Mode, probably waiting for its own spa day at the mixer.

  

Not bad for a day's work impersonating Lombard Finance.

  

**Because in 2025's DeFi landscape, the highest APY comes from a well-crafted email signature and a Premium LinkedIn account.**

  

_When multi-million dollar protocols can be fooled by a fake email address and a counterfeit token, are we building financial infrastructure or just elaborate digital trust falls?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_Social engineering - DeFi's favorite bedtime story just got another chapter._

  

**Ionic money joins the growing list of protocols who learned that smart contracts can't patch human gullibility.**

  

They ditched the Midas name after two exploits, but kept the same flawed recipe - trust first, verify never.

  

Mode network's damage control couldn't hide the bitter truth - their flagship protocol got pwned.

  

_Meanwhile, Ironclad and Layerbank discovered that in DeFi's game of musical chairs, someone always loses their seat when the music stops._

  

**The attackers proved once again that the weakest link in our trustless future isn't code - it's the humans deploying it.**

  

No audit can catch a convincing LinkedIn profile, no multisig can stop a smooth-talking scammer.

  

Between Radiant's RAT malware and Ionic's fake Lombard, DeFi's gatekeepers are collecting social engineering war stories faster than yield.

  

**While victims cope with empty vaults, somewhere a hacker is already practicing their next corporate signature.**

  

_Smart contracts might be trustless, but DeFi still runs on trust - so when did we start handing out VIP passes to anyone with a good story and a GitHub repo?_


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
