---
tags:
  - blockchain/avalanche
  - sector/dex
  - vuln/dependency/upgradeable-contract
  - novelty/variant
title: "Stars Arena - REKT"
protocol: "[[Stars Arena]]"
date: 2023-10-07
loss_usd: 2900000
auditors:
source: "https://rekt.news/stars-arena-rekt"
excerpt: "In the arena, breaking things. A double-whammy led to Stars Arena being drained of almost $3M on Saturday. Ever heard the phrase ‘stop digging’?"
genome:
  - "[[upgradeable-contract]]"
  - "[[variant]]"
  - "[[fot-slippage]]"
  - "[[reentrancy-guard]]"
  - "[[upgrade-safety]]"
---
# Stars Arena - REKT

> **Loss:** $2,900,000 | **Date:** 2023-10-07 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/stars-arena-header.png)

_In the arena, breaking things._

**A double-whammy of embarrassing security blunders led to Stars Arena being drained of almost $3M (_its [entire TVL](https://defillama.com/protocol/stars-arena)_) on Saturday.**

The Avalanche-based FriendTech clone, heavily shilled by [the usual suspects](https://twitter.com/WazzCrypto/status/1710712756620378599), had been hit by an (economically unviable) [exploit](https://twitter.com/0xlilitch/status/1709885464209973549) the previous day.

The team’s cringe [announcement](https://twitter.com/starsarenacom/status/1709934535570608172) of a fix didn’t inspire much confidence that security was their primary concern:

>THE EXPLOIT HAS BEEN FIXED.
>
>BUT DON’T GET THIS WRONG WE ARE AT WAR.

The team brushed off the vulnerability as “_throwing money away_”, a sentiment [repeated](https://twitter.com/el33th4xor/status/1709923165919387999) by Ava Labs’ CEO Emin Gün Sirer, who dismissed the incident as FUD (_unsurprisingly, as he’d also spent last week relentlessly shilling the project_).

While it may be surprising that Avalanche’s ecosystem ambassador would promote an unaudited, unverified fask-fork of a flash-in-the-pan SocialFi ponzi, the [double-down](https://twitter.com/el33th4xor/status/1710617850807832910) after the [second hack](https://twitter.com/0xLawliette/status/1710535739975549352) was more mindboggling still.

>The amount lost is only $3m…
>
>...something that SA can recover in about 10 days or so…
>
>...the hack is a mere speed bump...

Presumably because this was the first time AVAX had been relevant in months, Sirer then continued to [go to bat](https://twitter.com/el33th4xor/status/1710762025133965407) for the commpletely drained protocol as CT looked on in confusion.

_Ever heard the phrase [‘stop digging’](https://twitter.com/gametheorizing/status/1710629754200793495)?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[0xlilitch](https://twitter.com/0xlilitch/status/1709885464209973549), [Beosin](https://twitter.com/BeosinAlert/status/1710578517522718970)_

The first hack was down to a broken getPrice() function. However, the exploit required spending 4x the profit in gas to drain the contract, which lost just $2k before users ([allegedly](https://twitter.com/AveryBigweapon/status/1709910431307817419) including the user who publicised the vulnerability) gave up.

_The team announced the fix and the proxy was upgraded to a new ([also unverified](https://twitter.com/ZoomerAnon/status/1710548542735999174)) contract._

**Then, amidst the criticism of the team’s comms, came the [second exploit](https://twitter.com/starsarenacom/status/1710540444075978846), draining $2.9M.**

The contract is unverified, but [according to Beosin](https://twitter.com/BeosinAlert/status/1710578517522718970) the attacker took advantage of a reentrancy vulnerability to insert a block height as the number of AVAX to send during the sellShares() function.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/stars-arena-code1.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/stars-arena-code2.png)

Hacker’s address: **[0xa2Ebf3FCD757e9BE1E58B643b6B5077D11b4ad7A](https://snowtrace.io/address/0xa2Ebf3FCD757e9BE1E58B643b6B5077D11b4ad7A)**

As more attention was paid to the project, the [hypocrisy](https://twitter.com/0xfoobar/status/1710715320556482929) of the team became clear, claiming "_security is the core driving factor behind everything we do_" whilst having [access](https://twitter.com/0xfoobar/status/1710699199832965391) to users’ PKs and leaving their system [wide open](https://twitter.com/0xCygaar/status/1710685982582780078) to DDOS.

_Oh, and getting hacked twice of course…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**As the summer’s FriendTech hype rapidly died away, our innovative industry did what it does best: launching a slew of clones, quick cash grabs which add nothing new.**

_Except vulnerabilities._

FriendTech itself has been hit by a [wave of SIM-swap attacks](https://twitter.com/zachxbt/status/1709697295464141208) with the last bull run’s [easiest targets](https://rekt.news/monkey-business/) being made [high priority](https://twitter.com/zachxbt/status/1709636770218832101).

_Or perhaps we have simply reached the boating-accident-via-SIM-swap stage of the ponzi cycle._

As the scheme unwinds the userbase appears to be getting [increasingly PvP](https://twitter.com/CirrusNFT/status/1709645708679405900) by the day, but amidst the high-fee dumpfest the devs certainly [aren’t complaining](https://www.theblock.co/post/255279/friendtech-developers-rake-in-nearly-20-million-since-august-launch).

**But as for Avalanche’s [latest failed shill](https://twitter.com/0xGokek/status/1710633927139057997), who look to be planning a [relaunch](https://twitter.com/starsarenacom/status/1711068297397936226)…**

_Will you be jumping back into the Stars Arena, anon?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
