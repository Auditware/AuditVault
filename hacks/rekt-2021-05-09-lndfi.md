---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/gaming
  - sector/governance
  - sector/lending
  - sector/multisig
  - sector/oracle
  - sector/stable
  - sector/staking
  - sector/token
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/direct-drain
  - trigger/price-manipulation
  - precondition/insider
title: "LNDFi - Rekt"
protocol: "[[Lndfi]]"
date: 2021-05-09
loss_usd: 1180000
auditors:
source: "https://rekt.news/LNDFi-rekt"
excerpt: "Admin keys leaked. Contracts tweaked. $1.18M gone. LNDfi blames North Korea, but the chain tells a simpler story - a quiet backdoor, a drained pool, and a protocol that trusted too much, too easily."
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[trigger/price-manipulation]]"
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# LNDFi - Rekt

> **Loss:** $1,180,000 | **Date:** 2021-05-09 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01//lndfi-rekt.png)






_In DeFi, a single admin key can make you king - or a thief._

  

**$1.18 million vanished into digital mist on May 9th, when LNDFi's Pool Admin role fell into the wrong hands - turning a modified Aave fork into a personal withdrawal service.**

  

A carefully orchestrated contract modification, deployed 41 days before the heist, transformed pool management functions into an express lane for outbound funds.

  

The exploit didn’t rely on obscure math or oracle manipulation - just one extra condition in a core access check, giving any “Pool Admin” the ability to drain user funds.

  

Was it nation-state infiltration or plain old negligence?

  

**[ZachXBT points to DPRK](https://x.com/zachxbt/status/1923012190681911804), but the blockchain tells a simpler story - admin keys leaked, contracts modified, funds drained.**

  

_In the end, does it matter who squeezed the trigger if the gun was left loaded and unattended?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [LNDFi](https://medium.com/@lndfi/lnd-security-breach-post-mortem-2c54ac006050), [ZachXBT](https://x.com/zachxbt/status/1923012190681911804), [Tiancheng Mai](https://hackmd.io/@michaelmai/LND-Postmortem)_

  

**When the Sonic blockchain lit up with suspicious activity on May 9th, protocol watchers quickly raised the alarm.**

  

[LNDFi's team posted](https://x.com/Lnd_fi/status/1920705062143250845) their first security alert: "We have detected a security issue on our platform. Please do NOT deposit into the platform it has been compromised. We are in talks with security teams to look into it further."

  

The next day, [they followed up](https://x.com/Lnd_fi/status/1920764790437240916): "We are temporarily shutting down the website as people are still depositing."

  

Within hours, security researchers were dissecting the attack.

  

[Tiancheng Mai published](https://x.com/TianchengMai/status/1922186918441144589) an [unofficial post mortem](https://hackmd.io/@michaelmai/LND-Postmortem) detailing the technical exploitation, while the team scrambled to contain the damage.

  

**When the on-chain smoke dissipated, it revealed $1.18 million funneled out through a [hidden admin backdoor deployed](https://hackmd.io/@michaelmai/LND-Postmortem) just 41 days prior.**  
  

_But was it an oversight, or a meticulously staged heist waiting for its cue?_

  

### From Role Grant to Runaway: Anatomy of an Admin Heist

  

_[The unofficial post-mortem](https://hackmd.io/@michaelmai/LND-Postmortem) pulls back the curtain on a vulnerability so precise it feels less like an accident and more like a heist rehearsed in slow motion._

  

**[Tiancheng Mai shows that](https://hackmd.io/@michaelmai/LND-Postmortem), on March 29th, the deployer didn’t merely spin up an Aave fork - he injected a backdoor straight into the heart of the protocol.** 
  
**Add Pool Admin:**
[0xd03b7d80cf7fcd4d14076ca53d42bcfac0115674699adecb99dd3a769d5ea41a](https://sonicscan.org/tx/0xd03b7d80cf7fcd4d14076ca53d42bcfac0115674699adecb99dd3a769d5ea41a)

  

By adding || aclManager.isPoolAdmin(msg.sender) to the onlyPool modifier ([view on Sonicscan](https://sonicscan.org/address/0xaa8cc9afe14f3a2b200ca25382e7c87cd883a527#code#F19#L47)), the team effectively gave any Pool Admin the power to call transferUnderlyingTo, a function that in genuine [Aave deployments](https://github.com/aave-dao/aave-v3-origin/blob/464a0ea5147d204140ceda42a433656a58c8e212/src/contracts/protocol/tokenization/base/IncentivizedERC20.sol#L33-L39) is strictly reserved for the protocol's pool logic.

  

In other words, what should have been an immutable safety check became an admin-run exit hatch.

  

The [official post-mortem from LNDFi](https://medium.com/@lndfi/lnd-security-breach-post-mortem-2c54ac006050) barely mentions this insertion, attributing the drain to “compromised keys” stolen by an outside developer, whereas the unofficial forensic account lays bare the exact lines of code and contract addresses where the privilege expansion occurred.

  

**[The unofficial post mortem](https://hackmd.io/@michaelmai/LND-Postmortem) walks us through a nearly month-and-a-half staging period.**

  

_In the space of 45 seconds on the evening of March 29, 2025, the [deployer picked up the Pool Admin role](https://sonicscan.org/tx/0xd03b7d80cf7fcd4d14076ca53d42bcfac0115674699adecb99dd3a769d5ea41a), deployed two modified token contracts, and walked away - leaving a ticking clock buried in the blockchain._  
  
**AToken Modified Token Contract:**
[0xAA8cc9afE14f3A2B200CA25382e7C87CD883a527](https://sonicscan.org/address/0xaa8cc9afe14f3a2b200ca25382e7c87cd883a527)

  

**VariableDebtToken Modified Token Contract:**
[0x0b1A51C5cbFfc636d79A072b8AA5a763CeC42eF2](https://sonicscan.org/address/0x0b1a51c5cbffc636d79a072b8aa5a763cec42ef2)

  

_Where Aave V3's onlyPool modifier guards its protocol with a single line - [require(_msgSender() == address(POOL))](https://github.com/aave-dao/aave-v3-origin/blob/464a0ea5147d204140ceda42a433656a58c8e212/src/contracts/protocol/tokenization/base/IncentivizedERC20.sol#L33-L39) - LNDFi quietly rewrote the rulebook._

  

**Their version added one tiny clause: [||aclManager.isPoolAdmin(msg.sender)](https://sonicscan.org/address/0xaa8cc9afe14f3a2b200ca25382e7c87cd883a527#code#F19#L47).**

  

A five-word addition. A total permission collapse.

  

That change turned a security checkpoint into a red carpet for insiders.

  

Suddenly, anyone with the Pool Admin role could invoke transferUnderlyingTo - a function meant to move assets only within the protocol’s internal plumbing.

  

**On LNDFi, that plumbing was wide open.**

  

_The key wallets in this heist: the deployer who created the backdoor and the wallet that received the stolen funds._

  

**Deployer Wallet:**  
[0xc0454e29835479ee80d6f42965a16dcee9bfd868](https://sonicscan.org/address/0xc0454e29835479ee80d6f42965a16dcee9bfd868)

**Funds directed to:**  
[0x5149A7696188F083297281D10293a20476252CDD](https://sonicscan.org/address/0x5149a7696188f083297281d10293a20476252cdd)

  

_Only 41 days later, at 2:29 AM UTC on May 9th, those dormant modifications were awakened: repeated calls to transferUnderlyingTo began emptying every pool through a series of transactions._

  
**First drain ($476k USDC):** [0xd52f317b548bd0f67d32d35404d046e4e60f5af23dac8a502495a8714780bffe](https://sonicscan.org/tx/0xd52f317b548bd0f67d32d35404d046e4e60f5af23dac8a502495a8714780bffe)

  

**Second drain (153.7 ETH - $389k):**[](https://sonicscan.org/tx/0x0e192c6a1d4cad8feac85b2c5bdc5242a4ae336a5dd24ab2378d88f758e62dfa)
[0x0e192c6a1d4cad8feac85b2c5bdc5242a4ae336a5dd24ab2378d88f758e62dfa](https://sonicscan.org/tx/0x0e192c6a1d4cad8feac85b2c5bdc5242a4ae336a5dd24ab2378d88f758e62dfa)

  

**Third drain (373,594 Wrapped Sonic - $202k):**[](https://sonicscan.org/tx/0xf1b399290f027b46b517036cc65700fa61e123ff23af27dc7d009e3a72bb5034)
[0xf1b399290f027b46b517036cc65700fa61e123ff23af27dc7d009e3a72bb5034](https://sonicscan.org/tx/0xf1b399290f027b46b517036cc65700fa61e123ff23af27dc7d009e3a72bb5034)

  

**Fourth drain:(189k Beets Staked Sonic - $105k)**[](https://sonicscan.org/tx/0xf9c1afaf46425c922deac9ce677a4352adf305952cde79bda73c3cb1c7c73fb0) 
[0xf9c1afaf46425c922deac9ce677a4352adf305952cde79bda73c3cb1c7c73fb0](https://sonicscan.org/tx/0xf9c1afaf46425c922deac9ce677a4352adf305952cde79bda73c3cb1c7c73fb0)

  

**Fifth drain (4.51 Rings scETH - $11.5k):** [](https://sonicscan.org/tx/0xbf7e41329a2752a3d74a53762d94c6ab4f51da7a990b0363288af4afc17b098a)[0xbf7e41329a2752a3d74a53762d94c6ab4f51da7a990b0363288af4afc17b098a](https://sonicscan.org/tx/0xbf7e41329a2752a3d74a53762d94c6ab4f51da7a990b0363288af4afc17b098a)

  

**Roughly Amount Stolen: $1,183,500**

  

Within ten minutes, the funds were on the move through bridges to Ethereum and BSC, and not until 9:19 AM were the Admin rights finally revoked - long after the service had been turned into a withdrawal machine.  
  
**Admin Rights Revoked:**  
[0x74fadb3d2bdbcc215485537b69c8f25c2562981eee37c7014931941bdb39b913](https://sonicscan.org/tx/0x74fadb3d2bdbcc215485537b69c8f25c2562981eee37c7014931941bdb39b913)

_According to LNDFi, most stolen funds were later bridged to the following wallets…_

  

**Wallets on Ethereum:**  
[0x5a94a3a114cf01f6a703dd8b840cf0a97cdf1434](https://etherscan.io/address/0x5a94a3a114cf01f6a703dd8b840cf0a97cdf1434)
[0x2446f9528fbf55ccf5b3e7a22fc058bda7a12131](https://etherscan.io/address/0x2446f9528fbf55ccf5b3e7a22fc058bda7a12131)

  

**Wallets on BSC:**
[0x4b82e3485d33544561cd9a48410a605aa8892fb1](https://bscscan.com/address/0x4b82e3485d33544561cd9a48410a605aa8892fb1#tokentxns)
[0x8148c4243f8cb49fe80d9e23df0bafc1c6732f3e](https://bscscan.com/address/0x8148c4243f8cb49fe80d9e23df0bafc1c6732f3e#tokentxns)
[0x82be4fe84c2790023906c1648e0836ada67714d9](https://bscscan.com/address/0x82be4fe84c2790023906c1648e0836ada67714d9#tokentxns)

  

[The official narrative](https://medium.com/@lndfi/lnd-security-breach-post-mortem-2c54ac006050) glosses over the pre-drain deployments and never explains why the Admin role was granted or revoked multiple times.

  

**[The unofficial post mortem](https://hackmd.io/@michaelmai/LND-Postmortem), by contrast, reads like a blueprint for a planned extraction, exposing the gap between what was publicly acknowledged and what appears to have played out on-chain.**

  

_Did the exploit begin with code... or with trust in the wrong hands?_

  
### The Blame Game  
  
_Two days after the drain, LNDFi’s team published [their previously mentioned official post-mortem](https://medium.com/@lndfi/lnd-security-breach-post-mortem-2c54ac006050)._

  

**Their explanation? North Korean hackers.**

  

The team [pinned the exploit on an unwitting hire](https://medium.com/@lndfi/lnd-security-breach-post-mortem-2c54ac006050) with state-sponsored ties.

  

“The incident was traced to a developer unknowingly hired by the team who turned out to be an undercover DPRK IT worker. This individual/team unlawfully accessed the project's administrative keys and executed a series of unauthorized transactions.”

  

**[ZachXBT confirmed the DPRK angle](https://x.com/zachxbt/status/1923012190681911804): “I helped initially attribute the incident to DPRK IT workers and flagged theft addresses.”**

  

Though he clarified separately: “I am not formally engaged nor creating an investigative report for them.”

  

Technically, the timeline holds up. The contracts were modified. The access controls were compromised.

  

**But the story still leaves questions in its wake.**

  

_Why were backdoored contracts deployed in March - and left untouched until May?_

  

_Why wasn’t a multisig used to protect admin permissions?_

  

_Why does the post-mortem gloss over the 41-day waiting period?_

  

The blockchain leaves little room for interpretation: someone with admin access deployed compromised contracts, waited over a month, and drained the protocol in one clean sweep.

  

The DPRK angle may hold up - but LNDFi’s own security practices, and possible lack of transparency still leave the community with uncomfortable questions.

  

**Blaming a ghost is easy. Explaining how it got inside is harder.**

  

_If it was all an accident, why did it play out like a script?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_Another day in the DeFi minefield - one false step, and $1.18 million vanishes._

  

**LNDFi lost it because someone handed out admin privileges to the wrong person.**

  

The blockchain's immutable ledger leaves nowhere to hide: backdoor deployed March 29, protocol drained May 9. Forty-one days of silence between crime and punishment.

  

No multisig. No guardrails. Just trust in all the wrong places.

  

Strip away the North Korean hacker narrative, and you're left with a tale older than crypto itself - someone with the keys robbed the vault.

  

Call it a hack. Call it sabotage. Call it negligence. Call it what you want.

  

**The outcome is the same: concentrated power will always attract exploitation - whether by hostile outsiders or those already inside the walls.**

  

_In an ecosystem built to eliminate trusted third parties, why are we still trusting protocols that can't keep their admin keys out of the wrong hands?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
