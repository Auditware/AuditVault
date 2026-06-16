---
tags:
  - blockchain/bitcoin
  - sector/dex
  - sector/governance
  - sector/launchpad
  - sector/lending
  - sector/multisig
  - sector/nft
  - sector/privacy
title: "Odin.Fun - Rekt"
protocol: "[[Odin Fun]]"
date: 2025-08-12
loss_usd: 7000000
auditors:
source: "https://rekt.news/odin-fun-rekt"
excerpt: "Odin.fun hemorrhaged $7 million on August 12th through basic AMM manipulation - their third breach in six months. PhD founder's credentials can't fix inadequate treasury or unclear compensation plans."
genome:
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Odin.Fun - Rekt

> **Loss:** $7,000,000 | **Date:** 2025-08-12 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/odin-fun-rekt-header.png)






_58.2 Bitcoin vanished in under two hours on August 12th as Odin.fun suffered its third major security breach in six months._  
  

**Bob Bodily's "world's fastest Bitcoin token trading" platform promised revolutionary speed and security, but delivered something else entirely - [a $7 million lesson](https://www.theblock.co/post/366704/bitcoin-launchpad-odin-fun-exploit) in how liquidity manipulation attacks work.**  
  
[Hackers pumped worthless SATOSHI tokens](https://x.com/PeckShieldAlert/status/1955457951558406332) through Odin's AMM, artificially inflated prices, then drained real Bitcoin while the founder's PhD-level engineering watched helplessly from the sidelines.  
  
This wasn't Odin's first rodeo with disaster - [March brought deposit synchronization bugs](https://www.bitget.site/news/detail/12560604624135), [April saw Bodily's personal account reportedly compromised](https://www.namecoinnews.com/odin-funs-bob-bodily-to-liquidation-hacked/) for $178K, and now August delivered the coup de grâce.  
  
**Treasury insufficient to cover losses, trading suspended indefinitely, compensation plans stuck in permanent "coming soon" mode.**

  
_Pattern recognition suggests Odin.fun has perfected the art of losing user funds every two months - so what separates legitimate security failures from something more calculated?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [The Block](https://www.theblock.co/post/366704/bitcoin-launchpad-odin-fun-exploit), [Peckshield](https://x.com/PeckShieldAlert/status/1955457951558406332), [Bitget](https://www.bitget.site/news/detail/12560604624135), [NameCoin News](https://www.namecoinnews.com/odin-funs-bob-bodily-to-liquidation-hacked/), [Bob Bodily](https://x.com/BobBodily/status/1955303509341114444), [decrypt](https://decrypt.co/334986/bitcoin-meme-coin-launchpad-7-million-liqudity-attack), [CoinDesk](https://www.coindesk.com/markets/2025/08/13/memecoin-launchpad-odin-fun-suffers-usd7m-liquidity-exploit), [Cybertechwiz](https://www.cybertecwiz.com/odin-fun-halts-platform-activity-due-to-co-founders-account-breach-and-178k-liquidation/), [crypto.news](https://crypto.news/bitcoin-memecoin-launchpad-odin-fun-exploited-2025/), [businessman.eth](https://x.com/businessmaneth/status/1955315098773254393), [Cryptopolitan](https://www.cryptopolitan.com/odin-fun-panic-withdrawals-drain-deposits/), [CertiK](https://skynet.certik.com/projects/odin-fun), [Halborn](https://www.halborn.com/blog/post/explained-the-onyx-protocol-hack-october-2023?utm_source=chatgpt.com), [Coin Edition](https://coinedition.com/radiant-capital-commences-repayment-post-4-5m-exploit/), [Binance](https://www.binance.com/en/square/post/2024-09-30-onyx-protocol-set-to-relaunch-after-3-8-million-hack-14236071237873), [Radiant Capital](https://medium.com/@RadiantCapital/radiant-capital-dao-community-remediation-plan-196c8366b4da), [DeltaPrime](https://medium.com/@DeltaPrimeDefi/deltaprime-post-mortem-reimbursement-plan-07-12-2024-2d654912715b)_

  

**Bob Bodily's morning started normally on August 12th. It didn't stay that way.**

  
[Then came the first damage control Tweet](https://x.com/BobBodily/status/1955303509341114444): "Hi everyone - we're looking deeper into the recent withdrawals from the platform, so we've paused trading to ensure we can protect user funds,"

  
Classic crypto speak for "we're getting rekt and don't know how to stop it."  
  
_Platform Bitcoin reserves [hemorrhaged from 291 BTC to 232.8 BTC](https://www.theblock.co/post/366704/bitcoin-launchpad-odin-fun-exploit) while Bodily crafted his corporate non-response._  
  
**[PeckShield rang the alarm bells](https://x.com/PeckShieldAlert/status/1955457951558406332), confirming what the on-chain data already screamed: hackers had systematically emptied Odin's liquidity pools with mathematical precision.**  
  

[The attack vector reads like a DeFi exploit tutorial](https://www.coindesk.com/markets/2025/08/13/memecoin-launchpad-odin-fun-suffers-usd7m-liquidity-exploit). Deposit worthless SATOSHI tokens, manipulate AMM price ratios without external validation, withdraw at inflated rates, walk away with real Bitcoin.  
  
Odin's freshly updated AMM [trusted its own internal math more than market reality](https://decrypt.co/334986/bitcoin-meme-coin-launchpad-7-million-liqudity-attack) - a decision that cost users $7 million in under 2 hours.  
  

**[Eight hours of radio silence followed](https://x.com/BobBodily/status/1955477887701881007) while [58.2 Bitcoin found new homes](https://decrypt.co/334986/bitcoin-meme-coin-launchpad-7-million-liqudity-attack) across multiple wallets, each transaction a permanent reminder of Odin's security theater.**  
  

_When fresh coordinated attacks hit with surgical precision while security experts call the vulnerability "inexcusable" for someone with Bob's background, who's really getting schooled here - the hackers or the users?_  
  
### Textbook Manipulation  
  
_[The August carnage followed one of DeFi's oldest tricks](https://www.coindesk.com/markets/2025/08/13/memecoin-launchpad-odin-fun-suffers-usd7m-liquidity-exploit) in the book, executed by someone who'd clearly done their homework on Odin's weak spots._  
  
**[Deploy worthless tokens](https://x.com/PeckShieldAlert/status/1955457951558406332), [manipulate AMM price ratios](https://decrypt.co/334986/bitcoin-meme-coin-launchpad-7-million-liqudity-attack), [cash out with real Bitcoin](https://www.coindesk.com/markets/2025/08/13/memecoin-launchpad-odin-fun-suffers-usd7m-liquidity-exploit) while leaving digital confetti behind. At least, that's how it looked on the surface.**

  

[PeckShield tracked the carnage](https://x.com/PeckShieldAlert/status/1955457951558406332) to two primary attacker addresses ([Odin.fun](https://odin.fun/) operates on Internet Computer Protocol, using ICP principals as user IDs rather than traditional blockchain addresses):  
  
**First Account aka Fresh Attack:**  
[Urguz-m32zo-jlld6-pyy4l-z3c24-jv4pt-5fmll-gq2xd-6siiz-oxkao-xae](https://odin.fun/user/urguz-m32zo-jlld6-pyy4l-z3c24-jv4pt-5fmll-gq2xd-6siiz-oxkao-xae)

**Second Account aka Sleeper Cell:**
[jeypm-z6t4p-uqshx-dtay4-qgw5d-ca7j5-alviu-fch2d-nmsnc-c4k3k-aae](https://odin.fun/user/jeypm-z6t4p-uqshx-dtay4-qgw5d-ca7j5-alviu-fch2d-nmsnc-c4k3k-aae?tab=activity)

  
But the attacker addresses tell a much darker story than random opportunists stumbling onto a vulnerability.

[The first account ("Fresh Attack")](https://odin.fun/user/urguz-m32zo-jlld6-pyy4l-z3c24-jv4pt-5fmll-gq2xd-6siiz-oxkao-xae) was created on August 12th just one hour before Bob Bodily announced the platform suspension. Fresh wallet, immediate funding, surgical execution. Purpose-built for the heist.

[The second account ("Sleeper Cell")](https://odin.fun/user/jeypm-z6t4p-uqshx-dtay4-qgw5d-ca7j5-alviu-fch2d-nmsnc-c4k3k-aae) reveals something far more sinister: created on June 20th, made small SATOSHI token purchases, then went completely dormant for 53 days. A sleeper cell, planted and waiting.

_On August 12th, the dormant account suddenly reactivated. Twenty-three minutes later, the fresh account appeared with funding._  
  
**Coincidence? In crypto, maybe. In criminal coordination? Definitely not.**

Both accounts are still active on Odin.fun, their complete transaction histories sitting there like confessions waiting for someone to read them.  
  
Every manipulation cycle documented: buy tokens, add liquidity, inflate prices, extract Bitcoin, repeat.

The Sleeper Cell account focused on SATOSHI tokens - exactly what PeckShield identified as the primary attack vector.  
  
The Fresh Attack account hit ODINPEPE and multiple other tokens simultaneously.  
  
_This wasn't some degen stumbling onto a vulnerability during their morning coffee._  
  
**Months of planning, split-second coordination, systematic execution - someone did their homework while Bob was busy tweeting about revolutionary Bitcoin DeFi.**

The vulnerability itself wasn't unique - [just basic AMM manipulation](https://decrypt.co/334986/bitcoin-meme-coin-launchpad-7-million-liqudity-attack) that other DeFi protocols have seen before.

  
Odin's AMM math trusted its own price calculations more than reality - always a winning strategy in DeFi.  
  
_Empty liquidity pools with fresh deployments? Might as well hang a "free money" sign on the front door._  
  
**[Multiple fresh accounts hit the same exploit pattern](https://x.com/JC__cooks/status/1955481987101139253) while Bob's security team practiced their surprised Pikachu faces.**

  
Fund shuffling through intermediary wallets before cashing out - professional work from someone who'd clearly studied the playbook.  
  
The vulnerability wasn't exactly cutting-edge. [Midas Capital got rekt](https://rekt.news/midas-capital-rekt) twice in 2023 [due to similar AMM manipulation](https://rekt.news/midas-rekt2/). [Hundred Finance joined the AMM manipulation party](https://rekt.news/hundred-rekt2) the same year. Post-mortems got published. Solutions got documented.

  
**But apparently reading those pesky security reports is optional when you're revolutionizing Bitcoin DeFi.**  
  

_When the solutions to prevent AMM exploits were already published by security researchers, why did Odin's "[top-tier security team](https://x.com/BobBodily/status/1955477887701881007)" miss what every DeFi security researcher flagged as basic due diligence?_

  
### The China Excuse  
  
_[Bob's post-hack performance](https://x.com/BobBodily/status/1955477887701881007) followed the well-worn script of crypto crisis management, with a few suspicious improvisations._  
  
**Eight hours of silence while Bitcoin moved across wallets, then the standard-issue mea culpa with a geopolitical twist.**  
  

"Several malicious users, primarily linked to groups in China, took advantage of this vulnerability to steal a significant amount of BTC from the platform," [Bodily announced](https://x.com/BobBodily/status/1955477887701881007), conveniently deflecting blame to foreign actors.  
  
Classic move - when your code fails, blame state-sponsored hackers.  
  
Never mind that [the exploit required no sophisticated techniques](https://decrypt.co/334986/bitcoin-meme-coin-launchpad-7-million-liqudity-attack), just basic AMM manipulation any DeFi degen could execute.  
  
The "sophisticated" attackers Bob blamed apparently forgot basic operational security - they left complete transaction histories on Odin.fun's own platform for anyone to examine. Hardly the behavior of state-sponsored actors, more like criminals who didn't expect anyone to look.  
  
But hey, why focus on embarrassing operational failures when there's a treasury to discuss?  
  

_[Treasury can't cover the losses](https://x.com/BobBodily/status/1955477887701881007), but don't worry - "[concrete plans](https://x.com/BobBodily/status/1955477887701881007)" are coming._  
  
**Details? That's classified. Timeline? Soon.** 
  
Meanwhile, those "identified several groups who profited from the exploit" remain mysteriously unprosecuted despite Bob's tough-guy ultimatum: "You have a short window to return the funds before it is too late. This is not a negotiation."  
  

[The alleged coordinated law enforcement response](https://www.coindesk.com/markets/2025/08/13/memecoin-launchpad-odin-fun-suffers-usd7m-liquidity-exploit) reads like bad theater. U.S. authorities contacted, Binance and OKX engaged with Chinese officials, blockchain forensics deployed.  
  
Impressive mobilization for a memecoin platform that launched six months ago and burns through user funds bimonthly.  
  

**Most telling? [Bob's unwavering confidence](https://x.com/BobBodily/status/1955477887701881007) that Odin will rebuild stronger. "We believe the future of Bitcoin DeFi is massive, and we want you with us when we get there," he tweeted while millions in stolen Bitcoin sat untouched in attacker wallets.**  
  

_When someone loses $7 million but sounds like they're pitching investors on the next big thing, what exactly are they really selling?_  
  
### Bob’s Broken Record

  

_This wasn't Bob and Odin's debut on the disaster stage. [March 7th brought deposit synchronization chaos](https://www.bitget.site/news/detail/12560604624135) - 74 BTC vanishing from user balances while corresponding mainnet transactions played hide and seek._  
  
**Technical glitch, no actual theft, problem resolved within hours. Standard growing pains for a February 2025 launch, or so the narrative went.**  
  

[April 14th shattered that illusion](https://www.namecoinnews.com/odin-funs-bob-bodily-to-liquidation-hacked/). Bob Bodily's personal account got "hacked," [liquidating $178,700 worth of assets](https://www.cybertecwiz.com/odin-fun-halts-platform-activity-due-to-co-founders-account-breach-and-178k-liquidation/) in what was later attributed to [errors in the "Sign-In With Bitcoin" authentication system](https://crypto.news/bitcoin-memecoin-launchpad-odin-fun-exploited-2025/).

  
[Trading halted platform-wide](https://www.namecoinnews.com/odin-funs-bob-bodily-to-liquidation-hacked/) because apparently one compromised account threatened everyone's funds.  
  
[ODINDOG crashed 50%](https://www.namecoinnews.com/odin-funs-bob-bodily-to-liquidation-hacked/) as panic spread faster than Bodily's damage control tweets.  
  
Why suspend all withdrawals if only Bob's account was compromised?  
  

**Six months, three security failures, and millions in losses later. Lightning doesn't strike the same spot three times by accident.**  
  

_When your track record includes being "hacked" personally, blocking critics on social media, and consistently launching vulnerable code despite PhD-level credentials, where's the line between incompetence and intent?_

  

### The PhD Paradox  
  
_[Bob Bodily's credentials](https://www.linkedin.com/in/bobbodily/) paint the picture of someone who should know better._ 
  
**PhD in Educational/Instructional Technology from BYU, Co-Founder & CEO of Toniq Labs, Co-Founder & CEO of Bioniq Bitcoin Ordinals marketplace.**  
  
[Legitimate technical background](https://cryptonews.com/exclusives/bob-bodily-ceo-of-toniq-scaling-bitcoin-ordinals-ep-273/) spanning blockchain development since 2021, with actual products shipped and functioning ecosystems built.  
  

Yet somehow this accomplished developer consistently deploys code that gets exploited by attacks so basic that anonymous DeFi experts mock them publicly.  
  
"Anyone having some knowledge on DEX pools would know this," [s0xToolman from Bubblemaps told Decrypt about the August hack](https://decrypt.co/334986/bitcoin-meme-coin-launchpad-7-million-liqudity-attack). "There's no excuse for the team to not know this could happen." Textbook AMM vulnerabilities that first-year smart contract students learn to avoid.  
  

_Community warnings weren't subtle either. [businessman.eth had been](https://x.com/businessmaneth/status/1955315098773254393) "warning people for months to get your funds off Odin Fun" before the August carnage._  
  
**His reward? Bob blocked him on Twitter.**  
  
Turns out businessman.eth was literally warning about accounts that were already positioned for attack - the Sleeper Cell account had been dormant with SATOSHI tokens for over a month when those warnings were issued.  
  
[Raven Thorogood III's sarcastic post-mortem hit different](https://x.com/onchainprimate/status/1955315866280534517): "Odin.fun launched 6 months ago and has had 3 legit hacks.  
  
Averaging a major hack every 2 months.  
  
Honestly impressive, just a few more multi million dollar hacks then up only."  
  

The timing raises eyebrows too. [Bob launched Odin.fun in February 2025](https://x.com/BobBodily/status/1885015900790939900), right as the memecoin casino reached peak frenzy.  
  
**Abandoned his established ICP projects for quick-flip Bitcoin speculation plays.**  
  

_When legitimate developers with proven track records repeatedly launch fundamentally broken code while silencing critics, are we witnessing incompetence or something more calculated?_  
  
### Community Fracture

  

_[Odin's user base imploded](https://www.cryptopolitan.com/odin-fun-panic-withdrawals-drain-deposits/) faster than their liquidity pools._  
  
**Bob's remaining cheerleaders clung to the "sophisticated attack" story, still believing in transparency and those eternally "coming soon" compensation plans.**  
  
Meanwhile, [critics who'd been screaming warnings for months](https://x.com/businessmaneth/status/1955315098773254393) watched vindication unfold in real-time - too bad their Twitter accounts were blocked by the founder they'd tried to save.  
  

[ODINDOG token crashed 50%](https://www.namecoinnews.com/odin-funs-bob-bodily-to-liquidation-hacked/) before most holders could process what happened.  
  
_Brutal for anyone, worse for the true believers who'd already eaten losses [during April's "Bob got hacked" episode](https://www.namecoinnews.com/odin-funs-bob-bodily-to-liquidation-hacked/) and doubled down on loyalty._  
  
**Getting rekt three times in six months builds character - specifically, the kind that questions every life choice leading to that moment.**  
  

The timing couldn't have been worse for true believers.  
  
Odin.fun had just [celebrated breaking volume records in early April](https://www.namecoinnews.com/odin-funs-bob-bodily-to-liquidation-hacked/), with [ODINDOG reaching second top Bitcoin token of ALL TIME based on volume](https://www.namecoinnews.com/odin-funs-bob-bodily-to-liquidation-hacked/).  
  
**Success stories becoming cautionary tales overnight.**  
  

_But three hacks in six months raises an uncomfortable question - is this astronomical bad luck, or does Odin belong to an even more exclusive club?_  
  
### Serial Offenders Club  
  
_[Bob's post-hack theater](https://x.com/BobBodily/status/1955880586511573155) hit all the classics: San Francisco meetings with "strategic partners," external reviewers onboarded, audit firms consulted._ 
  
**[Twenty-four hours later](https://x.com/BobBodily/status/1956236206762811586): "One audit underway. Smaller group, but fast and nimble" - translation: the big firms quoted timelines longer than Odin's runway.**
  

Speaking of audits - [Odin.fun's website](https://odin.fun) contains zero documentation, no security audits, no technical papers. Just links to Twitter and Discord.  
  
Even [CertiK's project page](https://skynet.certik.com/projects/odin-fun) shows no completed audits. Revolutionary security through obscurity, apparently.  
  

[FBI involved, blockchain wizards deployed](https://x.com/BobBodily/status/1956236206762811586), "strategic partners" incoming. Quite the avengers for a memecoin platform that burns through user funds bimonthly.  
  

_"The ODIN•FUN community is the most incredible community in all of crypto," [Bob gushed](https://x.com/BobBodily/status/1956236206762811586) while that same community watched their funds disappear for the third time in six months._

  
**Odin.fun joins crypto's most exclusive club - protocols that turned repeat exploitation into an art form.**  
  
Welcome to the serial victims' leaderboard, where second chances become third strikes and "lessons learned" means "vulnerability patterns repeated."  
  
There were two exploits as Midas Capital back in 2023 ([$660K](https://rekt.news/midas-capital-rekt), then [$600K](https://rekt.news/midas-rekt2)), rebrand to Ionic, immediately get social engineered for $6.9M by fake Lombard Finance representatives.  
  
Then after rebranding, they got rekt again under their new name - [Ionic Money back in February of this year](https://rekt.news/ionic-money-rekt).  
  
_Three strikes spanning multiple years, each time promising better security while delivering worse outcomes._  
  
**Maybe the third time is a charm... but in this case, it’s more like 'third strike, you're out.**  
  

Onyx Protocol achieved something even more impressive - back-to-back exploits using the identical Compound v2 vulnerability.  
  
[$2.1M in the first hack](https://rekt.news/onyx-protocol-rekt) in 2023, [$3.8M in the 2024 sequel](https://rekt.news/onyx-protocol-rekt2), same attack vector both times.  
  
[Security researchers literally published the fix between exploits](https://www.halborn.com/blog/post/explained-the-onyx-protocol-hack-october-2023), yet Onyx deployed new markets with the exact same fatal flaw.  
  
_After the second hack, [Onyx had to completely shut down and relaunch as a different protocol](https://www.binance.com/en/square/post/2024-09-30-onyx-protocol-set-to-relaunch-after-3-8-million-hack-14236071237873) - the ultimate death spiral._

  

**Radiant Capital got hit twice in 2024 - [$4.5M to a known Aave fork bug](https://rekt.news/radiant-capital-rekt), then [$53M when their "robust" 3-of-11 multisig crumbled](https://rekt.news/radiant-capital-rekt2) like wet cardboard.**  
  
Two hacks, same tired playbook. To their credit, [Radiant actually launched a comprehensive remediation program](https://medium.com/@RadiantCapital/radiant-capital-dao-community-remediation-plan-196c8366b4da) with specific milestones, including 70% compensation for smaller deposits and a multi-pronged funding strategy.  
  
DeltaPrime speedran the disaster cycle in late 2024: [$6M private key fumble](https://rekt.news/deltaprime-rekt), then [$4.85M input validation face-plant](https://rekt.news/deltaprime-rekt2) just two months later.  
  
[Peckshield had flagged both vulnerabilities beforehand](https://rekt.news/deltaprime-rekt2), yet DeltaPrime shipped vulnerable code anyway.  
  
_But here's the difference - [DeltaPrime actually stepped up](https://medium.com/@DeltaPrimeDefi/deltaprime-post-mortem-reimbursement-plan-07-12-2024-2d654912715b)._  
  
**Founders sacrificed 33% of their token allocation, implemented a comprehensive compensation plan paying victims 140% of their losses through future revenue, and are currently working through $11M in total damages.**  
  

But Odin's trajectory stands out even among this distinguished company.  
  
Six months, three security failures, each time with Bob personally involved or affected.  
  
**Others at least managed gaps between disasters.**  
  

_What separates legitimate bad luck from platforms that have mastered the economics of staying barely afloat while bleeding user funds?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)





_Six months, three hacks, zero accountability - Bob Bodily has achieved what most DeFi founders only dream about: staying relevant [while consistently losing other people's money](https://x.com/BobBodily/status/1955477887701881007)._

  
**Odin.fun [offered Bitcoin DeFi at warp speed](https://x.com/BobBodily/status/1885015900790939900) but delivered a PhD thesis on how credentials can't fix fundamentally broken economics.**  
  
Incompetence or insider job? The results look identical either way: user funds vanishing on schedule while Bob tweets about bright futures and building together.  
  
Those [concrete compensation plans](https://x.com/BobBodily/status/1955477887701881007) have all the substance of vaporware - eternally in development, never quite ready for release.  
  
[Treasury insufficient, timeline indefinite](https://x.com/BobBodily/status/1955477887701881007), but somehow the vision for Bitcoin's DeFi future burns brighter than ever.  
  
The attackers' user profiles remain active on Odin.fun as of now, complete transaction histories preserved like digital evidence in a criminal case that hasn't been filed yet.  
  

**Maybe that's Odin's real innovation - proving that in crypto, reputation death is just another business model waiting to be monetized.**  
  

_When the next memecoin launchpad promises "revolutionary security" and posts their founder's academic credentials, will anyone remember to ask how many times they've been "hacked" before?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
