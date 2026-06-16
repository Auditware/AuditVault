---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - sector/bridge
  - sector/gaming
  - sector/governance
  - sector/lending
  - sector/perpetuals
  - sector/stable
  - has/audit
  - vuln/arithmetic/precision-loss
  - impact/loss-of-funds/locked-funds
  - novelty/variant
title: "Abracadabra - Rekt II"
protocol: "[[Abracadabra]]"
date: 2025-03-25
loss_usd: 12913691
auditors:
  - "[[Guardian Audits]]"
source: "https://rekt.news/abracadabra-rekt2"
excerpt: "$13M vanished from Abracadabra’s cauldrons after hackers exploited a liquidation loophole. The phantom collateral bug let attackers borrow against already-liquidated positions while the team desperate"
genome:
  - "[[precision-loss]]"
  - "[[locked-funds]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Abracadabra - Rekt II

> **Loss:** $12,913,691 | **Date:** 2025-03-25 | **Audited by:** Guardian Audits

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/abra-rekt2-header.png)




_Abracadabra Money just performed its most impressive vanishing act yet - $13 million in ETH disappeared in the blink of an eye._

  

**The lending platform's GMX-linked pools were drained of 6,260 ETH after attackers discovered a liquidation loophole hiding in plain sight.**

  

While [GMX rushed to distance itself](https://x.com/GMX_IO/status/1904509326129238479), insisting “no issues have been identified with GMX contracts,” Abracadabra was left staring at empty cauldrons and a $13M-shaped hole in its books.

  

This marks Abracadabra’s second major exploit, following their [January 2024 $6.5M precision loss exploit](https://rekt.news/abra-rekt) - another blow to [Magic Internet Money](https://www.coingecko.com/en/coins/magic-internet-money-ethereum), which is looking less like a stablecoin and more like a disappearing act.

  

**The attackers crafted a masterpiece of financial sleight-of-hand, transforming failed deposits and liquidation bugs into a personal money printer that would make even central bankers jealous.**

  

_Is Abracadabra secretly more talented at making millions vanish than any Vegas magician could ever dream to be?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Vladimir S](https://x.com/officer_cia/status/1904499709051322578), [Peckshield](https://x.com/peckshield/status/1904501599848038490), [Abracadabra](https://x.com/MIM_Spell/status/1904535586532180434), [GMX](https://x.com/GMX_IO/status/1904509326129238479), [DCF God](https://x.com/dcfgod/status/1904239270820503764)_

  

**[Eerily foreshadowed by DCF God](https://x.com/dcfgod/status/1904239270820503764), who hours earlier spun a cautionary tale about founders rewriting reality when debts go bad.**

  

At the time, it was just another Crypto Twitter theory - until $13M vanished, and Abracadabra was left scrambling for answers.

  

[Vladimir S, aka Officer’s Notes](https://x.com/officer_cia/status/1904499709051322578), was the first to sound the alarm, tagging [PeckShield, who quickly confirmed the worst](https://x.com/peckshield/status/1904501599848038490) - Abracadabra’s GMX-linked cauldrons were being drained in real-time.

  

The stolen 6,260 ETH didn't stick around for long.

  

_Like clockwork, the funds were bridged from Arbitrum to Ethereum and dispersed across three separate wallets._

  

**While the funds were frantically being shuffled around, the usual DeFi blame game began.**

  

[GMX immediately went into damage control](https://x.com/GMX_IO/status/1904509326129238479) mode, insisting their core contracts remained unscathed - the equivalent of saying "we just supply the kitchen, not our fault if someone burns down the restaurant."

  

[Abracadabra acknowledged the exploit](https://x.com/MIM_Spell/status/1904535586532180434), insisting their gmCauldrons had been "fully audited by [Guardian Audits](https://x.com/GuardianAudits)."

  

**They also name-dropped [zeroShadow](https://x.com/zeroshadow_io) along with [Chainalysis](https://x.com/chainalysis) for tracking and [Hexagate](https://x.com/hexagate_) response software - fancy tools, but not much help when $13M disappears without resistance.**

  

_So how did Abracadabra's magic show go so horribly wrong?_

  

### The Anatomy of a $13M Magic Trick

  

_Rekt News reached out to [Guardian Audits](https://x.com/GuardianAudits) for details on the exploit._

  

**The verdict? This wasn’t some high-level cryptographic sleight-of-hand. It was like finding the stage door wide open, with the cash box sitting in plain sight.**

  

The slight of hand was brutally efficient though:

  

**The Setup:** Deposit into GMX, but make it fail. The tokens don’t return to the attacker. Instead, they get stuck in the OrderAgent contract, waiting to be claimed.

  

**The Misdirection:** Borrow funds and push the position into liquidation. Everyone focuses on the liquidation, but the real trick is already in motion.

  

**The Switch:** Self-liquidate. The contract wipes the position but forgets to scrub the order. The collateral? Still hanging around like an unpaid bar tab.

  

**The Reveal:** Borrow against a ghost. The system, blissfully unaware, still sees the liquidated position as good collateral. 6,260 ETH exits stage left-while everyone’s eyes are on the wrong trick.

  

No advanced math needed - just a protocol that couldn't keep track of what it had already liquidated.

  

Abracadabra promised magic. Instead, they pulled a vanishing act - on their own money.

  

**The money may have ghosted the cauldron on Arbitrum, but it resurfaced on Ethereum - ready to continue its haunt.**  
  
_Let’s track the phantom’s footsteps…_

  
**Attacker Address:**
[0xAF9e33Aa03CAaa613c3Ba4221f7EA3eE2AC38649](https://arbiscan.io/address/0x51c9d0264d829a4f6d525df2357cd20ea79b5049)

  

**Exploited Cauldron Address:**
[0x625Fe79547828b1B54467E5Ed822a9A8a074bD61](https://arbiscan.io/address/0x625fe79547828b1b54467e5ed822a9a8a074bd61)

  

**Attack Transaction:**
[0xed17089aa6c57b7d5461209e853bdb56bc3460a91805e20d2590609a515ef0b0](https://arbiscan.io/tx/0xed17089aa6c57b7d5461209e853bdb56bc3460a91805e20d2590609a515ef0b0)

  

**The stolen funds (6,260 ETH in total) were bridged from Arbitrum to Ethereum and are currently held in the following 3 addresses:**

[0xa8f822E937C982e65b0437Ac81792a3AdA76A1ff](https://etherscan.io/address/0xa8f822E937C982e65b0437Ac81792a3AdA76A1ff)

[0x047C2a3dd1Ab4105B365685d4804fE5c440B5729](https://etherscan.io/address/0x047c2a3dd1ab4105b365685d4804fe5c440b5729)

[0x018182FD7B856AeE1606D7E0AA8bca10F1Cb0b5d](https://etherscan.io/address/0x018182fd7b856aee1606d7e0aa8bca10f1cb0b5d)

  

[Abracadabra paused all borrowing](https://x.com/MIM_Spell/status/1904535586532180434) and trotted out a [20% bounty offer](https://x.com/MIM_Spell/status/1904535586532180434), but the attacker had already split town with their 6,260 ETH.  
  
_So who cleans up the mess when the money’s gone and the exploit’s already written into DeFi history?_

  
### The Clean Up  
  
_Guardian Audits skipped the usual blame-shifting dance and owned their miss when Rekt News came knocking._

  

**The exploit waltzed through their review while they were busy catching other bugs in the same codebase - they spotted multiple issues but completely missed how a failed deposit and self-liquidation could create a phantom collateral position that remained borrowable.**

  

Their response? Double the security squad and slap on invariant testing - a rare sign that at least one audit shop cares more about actual security than collecting protocol badges.

  

Abracadabra rushed out their "[Path Forward](https://mirror.xyz/0x5744b051845B62D6f5B6Db095cc428bCbBBAc6F9/25X2JijzhkFK6oCC5oARNuVew5pyGZ1hGbMQ4Qu4kxQ)" document the day after the exploit, promising to buy back 6.5 million MIM and cover half the damage upfront.

  

They've vaguely promised to absorb the remaining debt "over the coming months" - the crypto equivalent of "the check's in the mail."

  

_They claim that their treasury still packs enough punch to expand into Berachain, Nibiru, and HyperEVM._

  

**Nothing screams battle-tested protocol quite like rushing to deploy your twice-hacked codebase across even more chains.**

  

Meanwhile, they're playing detective with Chainalysis, chatting up exchanges, and leaving the door open for the hacker to negotiate a bounty.  
  
The stolen funds still sit comfortably across those three wallets, undisturbed by law enforcement or bounty hunters.

  

**Each passing day makes recovery less likely while Abracadabra's grand plans for expansion continue unabated.**

  

_When DeFi protocols keep treating eight-figure hacks as just another Tuesday, why do we still pretend security matters more than shiny new features?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_Magic requires misdirection, and Abracadabra's $13M disappearing act has redirected attention from their previous $6.5M January 2024 failure - a neat trick that only works in crypto's goldfish-memory ecosystem._

  

**GMX pulled off a flawless reputation rescue, doing the "[keep my name out your mouth](https://x.com/GMX_IO/status/1904515674405261364)" dance while letting Abracadabra burn.**
  

Despite back-to-back multi-million dollar hacks, Abracadabra insists this is merely a "moment of reinforcement" rather than collapse.

  

Their solution? More integrations, more chains, more complexity - because when your house is on fire, the best response is clearly to build an addition.

  

[Abracadabra DAO’s treasury](https://debank.com/bundles/211041/accounts) might buy them another chance. But almost half of their holdings are in [MIM](https://www.coingecko.com/en/coins/magic-internet-money-ethereum) and [SPELL](https://www.coingecko.com/en/coins/spell-token).  
  
But no amount of MIM and SPELL can hide the fact that twice-hacked protocols rarely stick the landing on their third performance.

  

**Meanwhile, as exploits pile up like bodies in a horror movie sequel, DeFi's appetite for self-destruction continues unabated - Frog Nation's remains still drawing flies long after [Daniele Sesta's](https://x.com/danielesesta) empire crumbled.**

  

_When your biggest magic trick is convincing users to deposit funds after you've already lost almost $20M to smart contract exploits, who's really getting played here?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
