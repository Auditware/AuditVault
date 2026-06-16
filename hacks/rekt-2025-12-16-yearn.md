---
tags:
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/privacy
  - sector/stable
  - sector/vault
title: "Yearn - Rekt IV"
protocol: "[[Yearn]]"
date: 2025-12-16
loss_usd: 293000
auditors:
source: "https://rekt.news/yearn-rekt4"
excerpt: "Deja vu, as Yearn suffers its 2nd hack in 6 weeks and its 4th exploit overall. A recycled 2023 error drained $293k. The archives are fast becoming a shopping list - Yearn x2, Balancer, Abracadabra. Co"
genome:
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Yearn - Rekt IV

> **Loss:** $293,000 | **Date:** 2025-12-16 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/yearn-rekt4-header.png)



_DeFi history doesn't just rhyme, sometimes it just copy-pastes vulnerabilities until the treasury is empty._  
  
**For the fourth time, Yearn Finance has found itself in the crosshairs, this time watching a relic from 2020 bleed out through a [configuration error identical to one that cost $10 million in 2023](https://rekt.news/yearn2-rekt).**  
  
[It was only a measly $293k](https://x.com/PeckShieldAlert/status/2001080131360842011), but may highlight a bigger concern in the space that seems to be popping up lately.  
  
This isn't an isolated incident, but the latest chapter in a brutal season of archeological hacking.  
  
From [Abracadabra’s "deprecated" cauldrons leaking $1.8 million back in October](https://rekt.news/abracadabra-rekt3), to [Balancer’s rounding error draining $128 million last month](https://rekt.news/balancer-rekt2), the ecosystem is learning that old and cold code could turn into hot targets.  
  
Even [Yearn’s own yETH pool was drained of $9 million just two weeks ago](https://rekt.news/yearn-rekt3) by a math bug in a product the team had effectively forgotten.  
  
These recent targets aren't the shiny new vaults protected by auditors and war rooms. They are the dusty, neglected corners of the blockchain where dead money sleeps with one eye open.  
  
**As the low-hanging fruit of the present fades away, the wolves are turning to the archives, treating the industry's immutable legacy not as a history book, but as a shopping list.**

  
_Is someone out there hunting down old code?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [William Li](https://x.com/hklst4r/status/2001072409684685003), [Peckshield](https://x.com/PeckShieldAlert/status/2001080131360842011), [Yearn](https://x.com/yearnfi/status/2001094653391614171?s=20), [Banteg(Github)](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md)_

**The alarm bells started ringing late on December 16th.**  
  
[The vigilant William Li spotted the bleeding first](https://x.com/hklst4r/status/2001072409684685003): “Another Yearn V1 vault attack is underway! The root cause appears to be another configuration problem.”  
  
[PeckShield flagged the exploit shortly after](https://x.com/PeckShieldAlert/status/2001080131360842011), but by then the exploiter had swapped the stolen funds for 103 $ETH.  
  
[Yearn’s team was quick to distance](https://x.com/yearnfi/status/2001094653391614171?s=20) the protocol’s modern infrastructure from the wreckage.  
  
**Their response was less of a "war room" alert and more of an archeological disclaimer, highlighting that the compromised contract was "[deployed over 2,100 days ago](https://x.com/yearnfi/status/2001094653391614171?s=20)" - unrelated to Yearn’s vaults.**  
  
_So what exactly did the exploiters dig out of that old closet?_  
  
### Grave Robbers  
  
_[According to Yearn,](https://x.com/yearnfi/status/2001094653391614171?s=20) this wasn't a breach of their current security perimeter._  
  
**Turns out it was a zombie waking up in the graveyard. But the autopsy revealed a cause of death that was frustratingly familiar.**  
  
The root cause was [pretty much the same as the exploit that hit Yearn back in 2023](https://x.com/yearnfi/status/2001094653391614171?s=20).  
  
It was a configuration error, a [virtual carbon copy of the $10 million exploit that hit the iearn USDT vault in April 2023](https://x.com/yearnfi/status/2001094653391614171?s=20).  
  
The TUSD vault was running with a fatal identity crisis.  
  
_Banteg from Yearn [got into the gritty details](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md)…_  
  
**[Its strategy was set to track Fulcrum iSUSD](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md) (which holds sUSD), despite the vault’s own underlying asset being TUSD.**

  

This misconfiguration allowed the attacker to use [a massive Morpho flashloan to set up a cascading failure across the entire system](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md).

  

[First, they broke the share accounting](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md). By "donating" assets the vault was blind to, the attacker forced the accounting logic to hallucinate a dust-sized balance.

  

With the denominator crushed to near-zero, the share calculation didn't just break - it surrendered.

  

_[The result was extreme supply inflation](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md), minting an astronomical amount of yTUSD shares for the cost of a rounding error._

  

**But minting the money was only part of the job.**  
  
Infinite shares are merely monopoly money until they find a counterparty willing to cash them out.

  

For this attacker, [that counterparty was the Curve yPool](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md).

  

Armed with massive leverage, [the exploiter dumped their newly minted yTUSD into the pool](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md), swapping worthless shares for valuable yDAI and yUSDC.

  

_The math was brutal._

  

**This trade didn't just drain the liquidity, [it collapsed the price of the yPool LP token](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md), leaving downstream systems holding the bag.**

  

This is where the story takes a darker turn.

  

[Downstream of this liquidity sat STABLEx](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md), which relied on the Curve yPool price for its collateral valuation.

  

When the Curve pool collapsed, [STABLEx positions theoretically faced instant insolvency.](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md)

  

_It was effectively a zombie, shuffling forward with drained confidence._

  

**The attacker didn't kill the protocol; they simply scavenged the last few scraps of value left on the corpse.**

  

While the exploiter walked away with roughly $293k in profit, they left a bizarre tip behind.

  

Roughly 214,000 sUSD remained [stuck inside the compromised Yearn vault](https://x.com/hklst4r/status/2001072409684685003).

  

[Because the old code does not recognize sUSD as a valid asset](https://github.com/banteg/iearn-2025-12-investigation/blob/master/technical-writeup.md), the funds are permanently locked in a digital purgatory - visible on-chain, but mathematically unreachable.

  

**The vault is now a tomb, leaving the sUSD to rot alongside the logic that trapped it.**  
  
_With the funds gone and the exploit contained, one has to wonder, who is behind the mask?_  
  
### Dusting Off Old Loot  
  
_The attack didn't need complexity to succeed, just permission._

  

**The attacker's EOA spun up a dedicated contract to handle the mechanics - minting the infinite shares, draining the Curve pools, and swapping the output.**  
  
**Attacker EOA:**
[0xcaca279dff5110efa61091becf577911a2fa4cc3](https://etherscan.io/address/0xcaca279dff5110efa61091becf577911a2fa4cc3)

  
**Attacker Contract:**
[0x67e0c4cfc88b98b9ed718b49b8d2f812df738e42 ](https://etherscan.io/address/0x67e0c4cfc88b98b9ed718b49b8d2f812df738e42)

A 30,000,000 USDC flash loan from Morpho provided the leverage.  
  
**Flash Loan Transaction (In the highlighted event log in the link below):**  
[0x78921ce8d0361193b0d34bc76800ef4754ba9151a1837492f17c559f23771c43](https://etherscan.io/tx/0x78921ce8d0361193b0d34bc76800ef4754ba9151a1837492f17c559f23771c43#eventlog#0)

**Victim Contract: - iearn TUSD (Legacy V1):**  
[0x73a052500105205d34daf004eab301916da8190f](https://etherscan.io/address/0x73a052500105205d34daf004eab301916da8190f)

  
**Exploit Transaction:**
[0x78921ce8d0361193b0d34bc76800ef4754ba9151a1837492f17c559f23771c43](https://etherscan.io/tx/0x78921ce8d0361193b0d34bc76800ef4754ba9151a1837492f17c559f23771c43)

  
_When the transaction was finalized, the stolen stablecoins were converted into approximately 103 ETH._

  

**But unlike [the $9 million November exploit on Yearn](https://rekt.news/yearn-rekt3), where funds were washed immediately, this trail stopped at a specific address.**

  

**The loot sits idle at a holding address:**  
[0x0F214a04c70cf421ae92279afb3cf5668f554066](https://etherscan.io/address/0x0f214a04c70cf421ae92279afb3cf5668f554066)

  

**No Tornado Cash deposits. No bridges. Just a static balance staring back at the investigators.**

  

_This silence suggests confidence. If the attacker is waiting, what are they waiting for - or better yet, what are they looking for next?_  
  
### The Archives  
  
_Yearn didn't spin up a war room for this one._

  

**They simply pointed to the calendar.**

  

[The team confirmed the breach was exclusive to](https://x.com/yearnfi/status/2001094653391614171?s=20) "iEarn’s immutable TUSD contract" deployed over 2,100 days ago.”

  

A relic from a time [before YFI even existed](https://x.com/yearnfi/status/1646436798086672385).

  

[They emphasized that this has no connection](https://x.com/yearnfi/status/2001094653391614171?s=20) to current contracts or vaults.  
  

_It’s a valid defense technically - you can't patch a contract that was designed to be unchangeable._  
  

**To an attacker, it simply translated to "unguarded.”**

  

This incident confirms a growing suspicion within the security community.

  

We aren't just seeing opportunistic hacks anymore.

  

We are seeing a systematic excavation of the past.

  

Entities are combing through five-year-old bytecode, looking for logic errors that were invisible in 2020 but are glaringly obvious to modern AI-assisted tools.

  

**The liquidity locked in these ancient contracts should not just be viewed as old savings accounts, maybe we should now consider them bounties for hackers.**

  
_When the blockchain remembers everything, including your mistakes, can a protocol ever truly move on?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)








_Does anyone else feel like they’re seeing double?_  
  

**This specific configuration error has now paid out twice, proving that while protocols move forward, their ghosts stay put.**

  

Are we witnessing the golden age of the on-chain relic hunter?

  

These aren't hackers breaking through modern defenses - they are archaeologists digging up every DeFi antique that the developers forgot to burn.

  
Immutable code was sold to us as a promise that the rules would never change.  
  
**Meanwhile hackers are finding the loopholes to those rules.**  
  
_If code is law, does the statute of limitations ever run out?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
