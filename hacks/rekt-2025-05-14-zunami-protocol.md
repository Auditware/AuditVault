---
tags:
  - blockchain/ethereum
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - sector/token
  - sector/vault
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
  - precondition/insider
title: "Zunami Protocol - Rekt II"
protocol: "[[Zunami Protocol]]"
date: 2025-05-14
loss_usd: 500000
auditors:
source: "https://rekt.news/zunami-protocol-rekt2"
excerpt: "$500k vanished from Zunami Protocol in a mid-May admin key exploit. Months of stagnant development & perfect timing may have paved the way. Team offered weak excuses, dismissed concerns, left users em"
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Zunami Protocol - Rekt II

> **Loss:** $500,000 | **Date:** 2025-05-14 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/zunami-rekt2-header.png)




_Emergency functions make excellent getaway vehicles._

  

**Zunami Protocol watched $500K vanish into digital mist when their contract authority fell into the wrong hands on May 14th, transforming a yield aggregator into an express lane for outbound funds.**

  

No flash loans. No price manipulation. No complex smart contract wizardry.

  

Just someone with god-mode access casually calling withdrawStuckToken() and walking away with the vault's entire contents.

  

**Three weeks of radio silence later, users are left questioning whether Zunami was genuinely compromised - or whether the "compromise" was the plan all along.**

  

_When your emergency function becomes someone else's payday, who's really pulling the strings in your protocol?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Zunami Protocol](https://x.com/ZunamiProtocol/status/1922993510925435267), [Vladimir S.](https://x.com/officer_cia/status/1923006883633266842), [Peckshield](https://x.com/PeckShieldAlert/status/1923017858033799287), [Tony Ke](https://x.com/tonykebot/status/1923029477820420316), [SuplabsYi](https://x.com/SuplabsYi/status/1923038716966338703), [Michael Egorov](https://x.com/newmichwill/status/1923007821722915165), [Dedaub](https://app.dedaub.com/ethereum/tx/0xd7ce50992b36acbc746a821a74e5600230cfe5b36cfc155841581e376f4c14d2), [oxdavid](https://x.com/_0xdavid_/status/1923196203379896799), [Sterx (Zunami CEO)](https://x.com/kirill_zunami/status/1928131508117651725)_

  

**Zunami broke their own bad news first: "The Zunami protocol has been hacked - the collateral for zunUSD & zunETH has been stolen. We are currently investigating the situation."**

  

Almost an hour later, [Vladimir S. spotted the carnage](https://x.com/officer_cia/status/1923006883633266842), flagging the admin key compromise while funds vanished into Tornado Cash.

  

[PeckShield confirmed the kill](https://x.com/PeckShieldAlert/status/1923017858033799287) - $500K in zunUSD and zunETH collateral, gone.

  

[Tony Ke asked the question everyone was thinking](https://x.com/tonykebot/status/1923029477820420316): admin private key compromised, or insider job?

  

[SuplabsYi wondered how private key leaks](https://x.com/SuplabsYi/status/1923038716966338703) somehow made audits useless, calling out the obvious misdirection.

  

**But [Michael Egorov cut straight to the bone](https://x.com/newmichwill/status/1923007821722915165): "What is worse, admin key existed!"**
  
_What kind of protocol leaves the vault wide open and then vanishes when someone walks in?_

  
### The Attack  
  
_The exploit didn’t require clever code or timing. Just a single call from someone holding the keys to the castle._

  

**Here’s how it went down…**  
  
**Admin Role granted on May 14th:**
[0x2697a6f04bb4aff65f9ce2e7a3cac8addeafc52131495ef4d1760316b5aee3b0](https://etherscan.io/tx/0x2697a6f04bb4aff65f9ce2e7a3cac8addeafc52131495ef4d1760316b5aee3b0)

**Access was granted by the Zunami Protocol Deployer Wallet:**
[0xe9b2B067eE106A6E518fB0552F3296d22b82b32B](https://etherscan.io/address/0xe9b2b067ee106a6e518fb0552f3296d22b82b32b)

_7 minutes later, Zunami was exploited…_

  

**Attacker Address:**
[0x051370419b871f7c05dee8f7134401530832e250](https://etherscan.io/address/0x051370419b871f7c05dee8f7134401530832e250)

  

**Attack Transaction:** [0xd7ce50992b36acbc746a821a74e5600230cfe5b36cfc155841581e376f4c14d2](https://etherscan.io/tx/0xd7ce50992b36acbc746a821a74e5600230cfe5b36cfc155841581e376f4c14d2)

  

_[Dedaub's transaction trace](https://app.dedaub.com/ethereum/tx/0xd7ce50992b36acbc746a821a74e5600230cfe5b36cfc155841581e376f4c14d2) shows the smoking gun - someone called withdrawStuckToken() on Zunami's UsdtCrvUsdStakeDaoCurve strategy._

  

Turns out the only thing "stuck" was users' money.

  

296,456 LP tokens ([collateral for zunUSD and zunETH](https://x.com/ZunamiProtocol/status/1922993510925435267)) transferred clean to the attacker's address. No complex exploit mechanics.

  

No flash loan wizardry. Just: "Hey contract, give me all your tokens." → "Okay boss!"

  

**The attacker didn't crack any cryptographic puzzles - they just flashed their admin badge and politely asked for everything inside.**

  

_But how does an admin key end up in an attacker's wallet - accident or design?_

  

### Red Flags Flying

  

_Zunami's May 2025 collapse didn't happen in a vacuum - the warning signs were flashing neon for months._

  

**No commits to the [public GitHub repo](https://github.com/ZunamiProtocol/ZunamiProtocolV2/tree/main) for at least three months before the hack. Development appeared abandoned while user funds sat locked in strategies.**

  

TVL bleeding out steadily over months as yield incentives evaporated.

  

According to a regular member on their Discord, [Curve gauge rewards dropped to zero right before the exploit](https://discord.com/channels/882212259626106890/882212332397297705/1377051490740338789) - perfect timing for an exit.

  

[The team's first Discord response](https://x.com/_0xdavid_/status/1923196203379896799) to losing half a million? "rekt lmfao"

  

**Three weeks later, radio silence continues while users demand answers that never come.**

  

_When a protocol shows every symptom of abandonment, is a "hack" really a surprise - or just the final curtain call?_

  

### History repeats

  

_Zunami's 2025 disaster was just the latest in a series of catastrophic failures stretching back years._

  

**2023 started with a triple threat of exploits that should have been warning enough.**

  

[January 26th](https://zunamiprotocol.medium.com/the-zunami-protocol-has-come-under-two-attacks-e201a8a0ec6c) - a routine fund transfer got sandwich-attacked in the mempool. $49K gone on what should have been a simple swap.

  

A month later, [the blood bath continued](https://zunamiprotocol.medium.com/the-zunami-protocol-has-come-under-two-attacks-e201a8a0ec6c). Price gaps between Zunami's pools turned into an all-you-can-eat buffet for flashloan attackers.

  

Mint ZLP tokens at discount prices, cash out at inflated rates. Rinse and repeat across thirteen transactions.  
  
[According to Zunami's own Medium post](https://zunamiprotocol.medium.com/the-zunami-protocol-has-come-under-two-attacks-e201a8a0ec6c), the team admitted the combined damage: "In total, the attackers stole $260k.

  

_[$260K vanished](https://zunamiprotocol.medium.com/the-zunami-protocol-has-come-under-two-attacks-e201a8a0ec6c). LP pricing broken. Investment strategies exposed._

  

**But the worst was yet to come.**

  

August 2023 delivered the knockout punch - a [$2.1M price manipulation attack that we covered right here on Rekt](https://rekt.news/zunami-protocol-rekt).

  

Flash loans drained zETH and UZD liquidity pools on Curve, causing 85% and 99% depegs respectively. The attacker used token swaps to manipulate LP prices, then cashed out 1,184 ETH straight to Tornado Cash.

  

_Three separate attacks. One catastrophic year. $2.36 million in total losses._

  

**The team promised fixes, compensation, better security.**

  

Two years later, here we are again - except this time it's an "admin key compromise".  
  
Now 2025 brings exploit number four - someone with the master keys simply walked in and cleaned the house.

  

**Same protocol. Fourth time's the charm. Each excuse is more creative than the last.**

  

_Four exploits, four excuses - coincidence or playbook?_

  

### Damage Control Comedy Theater

  

_Two weeks after the exploit, [Zunami CEO Kirill Kozlov finally surfaced](https://x.com/kirill_zunami/status/1928131508117651725) with corporate ambiguity:_

  

**“We’re investigating the exploit and considering both scenarios: a compromised deployer or malicious intent by the key holder.”**

  

Translation: We don’t know if we got hacked - or robbed by our own team.

  

**CTO Mikhail Zelenin, aka MioGreen on Discord, [went with a more cinematic explanation](https://discord.com/channels/882212259626106890/882212332397297705/1381974448890052708):**

  

_"My laptop was deeply investigated by Russian police during a border crossing. It was in their possession for many hours. All source codes of the protocol were there without cryptographic security... I still don't have any other hypothesis except the cloning of my hard drive."_

  

[He admitted the protocol strategies were never switched over to DAO control](https://discord.com/channels/882212259626106890/882212332397297705/1381974448890052708) as promised, citing developer burnout and a lack of support:

  

“Because of the absence of investment in the protocol, I was the only developer… I made simple mistakes.”

  

Then came the Ferrari subplot.

  

**After [a Russian article](https://teletype.in/@processcases/0rwkY1W7gh9) mentioned the CTO owning a Ferrari, [Zelenin clapped back](https://discord.com/channels/882212259626106890/882212332397297705/1381977588662145144):**

  

_“I never had any Ferrari. And I don’t have any right now. Cyprus police will easily clarify it, because I am here in the residential permit.”_

  

The community didn’t buy it.

  

[One Discord user fired back](https://discord.com/channels/882212259626106890/882212332397297705/1382286189863899236): “You’re either a thief or completely incompetent and responsible for the protocol getting hacked three times.”

  

When your best explanations involve cloned laptops, abandoned strategy updates, and Ferrari denials - maybe the problem isn’t the investigation.

  

**Maybe it's the infrastructure.**

  

_When your damage control involves blaming Russian border police and denying Ferrari ownership, maybe the real problem isn't the investigation?_  
  
### Community Uprising

  

_Zunami’s Discord turned into a war zone as users pieced together a familiar pattern: ghosted devs, dead links, and suspicious timing._

  

**[One member highlighted some red flags](https://discord.com/channels/882212259626106890/882212332397297705/1377051490740338789): “What makes it likely for me: No commits in 3 months, TVL dropping for months, domain expired, rug happened hours after Curve gauge incentives dropped to 0%.”**

  

When users raised questions, the [team got defensive instead of transparent](https://discord.com/channels/882212259626106890/882212332397297705/1377069167441608825):

  

“You're making direct accusations, and I'd like to ask you to be more careful.”

  

**[The reply was blunt](https://discord.com/channels/882212259626106890/882212332397297705/1377075709033316352): “I'm not making direct accusations, I'm literally saying ‘if it turns out to be’-but yeah, there is a high likelihood here.”**

  

By June, the community's patience had evaporated. Even [the team moderator issued an ultimatum](https://discord.com/channels/882212259626106890/882212332397297705/1379712940416172072):

  

“I live in Thailand. If the founder doesn’t make progress on this soon, I’m prepared to file a report with the Thai police myself.”

  

His deadline? June 13th. Which has since passed…

  

**The founder’s update? Crickets.**

  

_When even your own moderators are threatening police action, is this still a “technical investigation” - or just a crime scene with better branding?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_Emergency functions make excellent getaway vehicles - just ask whoever held Zunami's admin keys._

  

**Three weeks of silence. No post-mortem. No compensation plan. No answers about who exactly had "malicious intent" with those keys.**

  

Zunami’s collapse barely made headlines.

  

Half a million dollars vanished into Tornado Cash, and the story slipped off the radar, except for a few who stayed vigilant.

  

Vladimir S. flagged the admin compromise. PeckShield confirmed the loss. Tony Ke asked the hard questions. SuplabsYi pointed out the audit theater.

  

But after that? The story fell off the radar.

  

_Sometimes these convenient "hacks" get swept under the rug until users find their voice._

  

**We are that voice.** 
  
We have been following this citation since the story broke and the suspicions kept piling up.

  

The red flags were flashing neon - abandoned development, expired domains, perfect timing with incentive drops, and a team that responds to theft with "rekt lmfao."

  

Whether this was gross negligence or calculated theft, the result is identical: users holding empty bags while someone else counts their stablecoins.

  

**Emergency functions were meant to save protocols in crisis, not provide cover for digital heists.**

  

_But when the people holding the keys are the same ones calling the shots, who's really driving the getaway car?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
