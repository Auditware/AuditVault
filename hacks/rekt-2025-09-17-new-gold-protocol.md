---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "New Gold Protocol - Rekt"
protocol: "[[New Gold Protocol]]"
date: 2025-09-17
loss_usd: 2000000
auditors:
source: "https://rekt.news/newgold-protocol-rekt"
excerpt: "Flash loans meet amateur hour. New Gold Protocol hemorrhaged $2 million shortly after launch through price oracle stupidity and broken transfer logic. Team went completely radio silent while security "
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# New Gold Protocol - Rekt

> **Loss:** $2,000,000 | **Date:** 2025-09-17 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/newgold-protocol-rekt-header.png)









_299 followers and a "security is non-negotiable" [tweet 3 days prior](https://x.com/newgoldprotocol/status/1967408027742466531) - New Gold Protocol's entire legacy before becoming Tuesday's bloodbath._  
  

**September 17th brought fresh carnage to BNB Chain as this freshly minted protocol [hemorrhaged $2 million](https://www.theblock.co/post/371191/ngp-exploited-2-million) through vulnerabilities so obvious that even script kiddies would blush** 
  
Flash loans, price oracle stupidity, and transfer logic written by someone who apparently skipped smart contract kindergarten - NGP speedran every possible way to get rekt.

  
Twitter promised transparency and automated burns.  
  
**Smart contract delivered automated theft and transparency about how incompetent the devs were.**  
  
Flash loan some USDT, manipulate the PancakeSwap pool reserves, bypass their pathetic buying limits by [sending tokens to the dead address](https://bscscan.com/address/0x000000000000000000000000000000000000dead), then watch their broken fee mechanism sync the pool into oblivion.  
  

444 ETH vanished into Tornado Cash faster than NGP's credibility.  
  
**[Token cratered 88%](https://bitcoinethereumnews.com/tech/ngp-token-crashes-88-after-2m-oracle-hack/). The protocol has remained radio silent since the incident.** 
  

_When your protocol works flawlessly for hackers but catastrophically fails users, what exactly were you building?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [New Gold Protocol](https://x.com/newgoldprotocol/status/1967408027742466531), [The Block](https://www.theblock.co/post/371191/ngp-exploited-2-million), [BitcoinEthereumNews](https://bitcoinethereumnews.com/tech/ngp-token-crashes-88-after-2m-oracle-hack/), [Blockaid](https://x.com/blockaid_/status/1968397977929515221), [Peckshield](https://x.com/peckshieldalert/status/1968512105880977569), [CertiK](https://x.com/CertiKAlert/status/1968524034464977366), [William Li](https://x.com/hklst4r/status/1968414059205636433)_

**[Blockaid's exploit detection system caught the carnage first](https://x.com/blockaid_/status/1968397977929515221) - “multiple malicious transactions targeting NGP on BSC”, with roughly $2 million drained.**  
  
Real-time monitoring turned into a live autopsy as security firms rushed to explain how spectacularly NGP had failed.  
  

[PeckShield confirmed the obvious hours later](https://x.com/peckshieldalert/status/1968512105880977569): "$NGP token from [newgoldprotocol](https://x.com/newgoldprotocol) was exploited for ~$2M."  
  
[Token down 88% in an hour](https://x.com/peckshieldalert/status/1968512105880977569), stolen funds already washing through Tornado Cash.  
  

_Meanwhile, [New Gold Protocol's Twitter account](https://x.com/newgoldprotocol)? Complete radio silence._  
  
**No acknowledgment, no damage control, no "we're investigating" platitudes.**  
  
Just the digital equivalent of hiding under a rock while security firms dissected their corpse in public.  
  

Even 24 hours later, NGP couldn't muster a single tweet about losing $2 million of other people's money.  
  
[They were still promoting their launch](https://x.com/newgoldprotocol/status/1967872890948423923), like they were living in an alternate reality.  
  
**Ironically, on September 14th, [they posted that](https://x.com/newgoldprotocol/status/1967408027742466531) : "Security is non-negotiable."**

  
_Apparently neither is staying silent when your non-negotiable security gets negotiated away for $2 million?_  
  
### Turning $211 Million into $2 Million  
  
_NGP's code was a fine example in writing the worst possible smart contract._  
  
**Two catastrophic flaws that any competent developer would catch in five minutes of testing, but somehow made it to mainnet.**  
  
Two fatal flaws working in perfect harmony: a getPrice() function that trusted PancakeSwap reserves like gospel, and transfer logic so broken it made the exploit trivial.  
  

Price oracles 101: never rely on a single DEX pool's reserves for pricing.  
  
Attackers can manipulate those numbers with flash loans faster than you can say "rug pull."  
  
_NGP apparently skipped that lecture._  
  

**The attack script was embarrassingly simple.**  
  
[Flashloan $211 million](https://x.com/CertiKAlert/status/1968524034464977366), dump it into [the mainPair pool to crash NGP reserves](https://www.theblock.co/post/371191/ngp-exploited-2-million) and inflate the USDT side.  
  
[Now getPrice() thinks NGP is worthless](https://x.com/blockaid_/status/1968405728877756908), letting the attacker bypass maxBuyAmountInUsdt limits by buying massive amounts of tokens.  
  

But here's where NGP's incompetence really shines: their transfer function included a "fee mechanism" [that deducted 35% from the pool balance](https://x.com/CertiKAlert/status/1968524034464977366) whenever someone sold, then called sync() to update reserves.  
  
_This wasn't a feature - it was a self-destruct button waiting to be pressed._

  
**The [attacker bought NGP tokens earlier with multiple accounts](https://x.com/Phalcon_xyz/status/1968520529046016248), then used the manipulated pricing to acquire even more tokens by [setting the recipient address to the "dead" address - conveniently whitelisted](https://x.com/hklst4r/status/1968414059205636433) to bypass buying restrictions.**  
  
Finally, they dumped all their NGP tokens, triggering that transfer logic mechanism [that reduced the pool's NGP reserves from 477,000 to 0.035 tokens](https://x.com/CertiKAlert/status/1968524034464977366).  
  

[When you reduce token reserves by 13.6 million times](https://x.com/CertiKAlert/status/1968524034464977366), you don't just break the AMM's x*y=k invariant - you obliterate it.  
  
**Pool drained, attack complete, protocol dead.**  
  

_What happens when your smart contract's biggest security feature is teaching attackers exactly how to rob you?_  
  
### Following the Breadcrumbs  
  
_Tornado Cash funded the wallet that killed NGP. Classic move - mix your ETH, bridge to BNB Chain, then go shopping for vulnerable protocols._  
  
**Tornado Cash Funding (September 10th):**  
[0x31b80cf3b477948fb47a03aa5ecb8a9e30b99840e59af8959e5797c1ea4cd3a3](https://etherscan.io/tx/0x31b80cf3b477948fb47a03aa5ecb8a9e30b99840e59af8959e5797c1ea4cd3a3)

**Exploiter Address:**  
[0x0305ddd42887676ec593b39ace691b772eb3c876](https://bscscan.com/address/0x0305ddd42887676ec593b39ace691b772eb3c876)

**Attack Transaction:** [0xc2066e0dff1a8a042057387d7356ad7ced76ab90904baa1e0b5ecbc2434df8e1](https://bscscan.com/tx/0xc2066e0dff1a8a042057387d7356ad7ced76ab90904baa1e0b5ecbc2434df8e1)

_September 17th, 7:02 PM UTC - NGP went from "promising new protocol" to "expensive lesson" in a single transaction._  
  
**Flash loan secured, reserves manipulated, limits bypassed, pool drained. All the stolen USDT got swapped to ETH and bridged back to Ethereum mainnet.**  
  

**Ethereum Address:**  
[0x8618314270528e245fbbb6fba54e245bb61a8d47](https://etherscan.io/address/0x8618314270528e245fbbb6fba54e245bb61a8d47)

444 ETH was methodically fed into Tornado Cash's tumble cycle.  
  
The attacker didn't rush - they broke down the haul into digestible chunks over 10 minutes.

  
Almost twenty separate deposits into Tornado Cash's mixer pools: 0.1 ETH, 1 ETH, 10 ETH, and 100 ETH increments.  
  
Standard Tornado Cash denominations, but the systematic approach suggests someone familiar with the mixing process.  
  
**They didn't reinvent the wheel, just found a protocol dumb enough to let them use it.**  
  

_When your exploit gets traced by every major security firm but your protocol can't even acknowledge it happened, who really got played?_  
  
### The Road to Nowhere  
  
_[NGP's five-year roadmap promised](https://whitepaper.newgoldprotocol.io/8.-five-year-roadmap-from-protocol-to-intelligent-civilization) "AI-powered contract auditing improves security" by 2026._  
  
**Apparently they planned to wait three years before bothering with basic security measures.**

  
[Their whitepaper](https://whitepaper.newgoldprotocol.io/) reads like fever dream economics mixed with ChatGPT hallucinations:  
  
"Native DEX with automated matching," "Layer 2 testnets," "Aurora AI v2 enables automated fund management" - all scheduled for 2026 while their 2025 launch couldn't handle basic price feeds.  
  

Even their [resources page screams amateur hour](https://drive.google.com/drive/folders/1syI7HP9s7SE31MAFuZLSBQZH7YyRWgwQ?usp=sharing). Documentation hosted on Google Drive?  
  
_Professional protocols use proper hosting, version control, and redundancy. NGP used free cloud storage like a college student sharing homework._  
  

**The protocol that promised to build an "[intelligent civilization](https://whitepaper.newgoldprotocol.io/8.-five-year-roadmap-from-protocol-to-intelligent-civilization)" couldn't figure out how to prevent flash loan attacks that script kiddies master in weekend hackathons.**  
  
[Their roadmap talks about AI-powered auditing](https://whitepaper.newgoldprotocol.io/8.-five-year-roadmap-from-protocol-to-intelligent-civilization) while their current code suggests they've never heard of human-powered auditing.  
  

Three days of security promises, hours of actual uptime, and years of grandiose plans that will never see mainnet.  
  
**NGP managed to speedrun the entire lifecycle of a failed protocol - hype, launch, exploit, silence, irrelevance.**  
  
_When your protocol's biggest achievement is teaching others what not to do, was building it ever the point?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_Radio silence isn't just NGP's Twitter strategy - it's their entire community management playbook._  
  

**Over 24 hours since losing $2 million and [their Telegram channel](https://t.me/newgoldprotocol) reads like nothing happened.**  
  
No team announcements, no damage control, no panicked community members demanding answers.  
  
The chat logs show regular activity but zero mention of the $2 million hack.  
  
**NGP created the perfect echo chamber - a community so detached from reality that a $2 million exploit doesn't even register as newsworthy.**  
  

Maybe staying quiet worked for their 299 Twitter followers, but ignoring catastrophic security failures doesn't make them disappear.  
  
While security firms dissected their code and traced their stolen funds across multiple blockchains, NGP's team apparently decided the best crisis management strategy was pretending the crisis never existed.  
  

**[Their roadmap promised an intelligent civilization by 2030](https://whitepaper.newgoldprotocol.io/8.-five-year-roadmap-from-protocol-to-intelligent-civilization), but they couldn't even manage intelligent damage control for 48 hours.**  
  

_If your protocol gets rekt in DeFi but nobody in your community talks about it, did the exploit really happen?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
