---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/multisig
  - sector/token
  - trigger/low-liquidity
  - precondition/insider
title: "Hacken - Rekt"
protocol: "[[Hacken]]"
date: 2025-06-20
loss_usd: 170000
auditors:
source: "https://rekt.news/hacken-rekt"
excerpt: "A security firm forgot its own security. Hacken's HAI token got nuked after a bridge key leak let an attacker mint 900M tokens and dump $170K. 99% crash, KuCoin KYC twist, and a tokenomics pivot no on"
genome:
  - "[[trigger/low-liquidity]]"
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[upgrade-safety]]"
---
# Hacken - Rekt

> **Loss:** $170,000 | **Date:** 2025-06-20 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/hacken-rekt-header.png)

_When the security experts need security experts, you know something's gone horribly wrong._

**Hacken built its brand by securing DeFi from itself. But when it came to their own keys, the “smart contract cops” forgot to lock the door.**

It all unraveled on June 20th, when a compromised private key opened the door to a $170K drain and a 99% collapse in token value.

The irony cuts deeper than a smart contract vulnerability - this wasn't sophisticated code manipulation or a novel attack vector.

Just human error during a bridge upgrade, exposing years of postponed security infrastructure that any auditor would flag as critical.

**While Hacken scrambles to rebrand this disaster as an architectural growing pain, the real takeaway smolders beneath the wreckage.**
  
_How can you trust a security firm that couldn't secure its own keys?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Peckshield](https://x.com/PeckShieldAlert/status/1936198957119774979), [Cyvers](https://x.com/CyversAlerts/status/1936369526137860120), [Hacken](https://x.com/hackenclub/status/1936362881932484854), [Dyma Budorin](https://x.com/buda_kyiv/status/1936202524899385668), [Twix](https://x.com/Twix1441/status/1936529275647091085), [Coin Telegraph](https://cointelegraph.com/news/hacken-exploited-through-private-key-leak)_

**First the alerts started pinging.**

[PeckShield caught the blood in the water](https://x.com/PeckShieldAlert/status/1936198957119774979) on June 20th: "$HAI is hacked, resulting in price crash."

[Cyvers followed up with forensic clarity](https://x.com/CyversAlerts/status/1936369526137860120) - confirming the attacker had seized minting privileges and unleashed 900 million $HAI tokens into circulation.

The smoking gun? A bridge private key [left exposed on a decommissioned DigitalOcean server](https://x.com/hackenclub/status/1937261965014933923) - forgotten infrastructure with fatal consequences.

_[Hacken killed the bridges](https://x.com/hackenclub/status/1936362881932484854), but the damage was done - tokens were already hemorrhaging across BSC and Ethereum._

**[Due to shallow liquidity pools](https://x.com/CyversAlerts/status/1936369526137860120), only ~$170K actually escaped before the bloodbath ended - though watching your [token crater 99%](https://cointelegraph.com/news/hacken-exploited-through-private-key-leak) hardly feels like getting off easy.**

Meanwhile, [CEO Dyma Budorin was pulling all-nighters](https://x.com/buda_kyiv/status/1936202524899385668) trying to figure out what the hell happened.

"We are online and making investigation," [he posted at 3am](https://x.com/buda_kyiv/status/1936202524899385668), as the full picture was still coming together.

His [damage control tour continued](https://x.com/buda_kyiv/status/1936230566027813304) with a mix of panic and defiance: "This accident pushed us to an action. We will merge into Hacken security token with all legal rights."

_Translation: We're going to spin this disaster into our master plan all along._

**But first, [Budorin had to admit the uncomfortable truth](https://x.com/buda_kyiv/status/1936364548388184108) - it was a bridge private key compromise, calling it his "worst day" while promising that VeChain's solo-chain design would contain the fallout.**

By June 21st, [Hacken had workshopped their official response](https://x.com/hackenclub/status/1936487412101742852): this wasn't a hack, just "human error during architectural changes."

[Their post-incident report](https://x.com/hackenclub/status/1936487412101742852) walked the damage control tightrope - [the deployer wallet wasn't compromised](https://x.com/hackenclub/status/1936487416178561457), only the minter role keys were leaked, and they [were totally planning to upgrade their bridge security anyway](https://x.com/hackenclub/status/1936487439713071163).

**[The estimated loss: ~$170K](https://x.com/hackenclub/status/1936487419437564201), though that didn't account for the reputational damage of a security firm getting schooled by basic key management.**  
  
_So how exactly do you turn 900 million phantom tokens into real money when everyone's watching?_  
  
### The Mint and Dump

_Here’s what happens when unchecked minting power lands in the wrong hands._  
  
**The address behind it all didn’t bother hiding in the shadows.**

**Attacker Wallet on BSC:**
[0x2FA1789B009A05921eB64F10B8F0d30684661d2d](https://bscscan.com/address/0x2FA1789B009A05921eB64F10B8F0d30684661d2d)

**Attacker Wallet on Ethereum:**
[0x2FA1789B009A05921eB64F10B8F0d30684661d2d](https://etherscan.io/address/0x2fa1789b009a05921eb64f10b8f0d30684661d2d)

  

The attack followed a brutally simple playbook - no complex smart contract gymnastics required.

  

**BSC Mint Transactions:**
[0xe8c895df8d99d3a680faf80bb65f80c53d8f2c48b5d48fe7c73883b6824aa30f](https://bscscan.com/tx/0xe8c895df8d99d3a680faf80bb65f80c53d8f2c48b5d48fe7c73883b6824aa30f)

[0x4836db1d5a038a616d99ae396d73129272123733e394a43ee99d019b26eb142f](https://bscscan.com/tx/0x4836db1d5a038a616d99ae396d73129272123733e394a43ee99d019b26eb142f)

[0xd082fcfe41d20a42f979acea0b03c50c35c5dd97e61d3df8386a9463b13d7f58](https://bscscan.com/tx/0xd082fcfe41d20a42f979acea0b03c50c35c5dd97e61d3df8386a9463b13d7f58)

  

**Ethereum Mint Transaction:**
[0xa0b32ee67d572df80a10c439d395a9907492d6ef62cbf53be66b3145cf479ab6](https://etherscan.io/tx/0xa0b32ee67d572df80a10c439d395a9907492d6ef62cbf53be66b3145cf479ab6)

  

**Nine hundred million tokens conjured from thin air across both chains, then dumped faster than a hot potato.**

_When you can print money at will, why complicate things with DeFi wizardry?_

### Smart Money and Market Chaos

_While $HAI holders watched their portfolios evaporate, some traders found opportunity in the carnage._

  

**[Gate.io became an accidental arbitrage playground](https://x.com/Twix1441/status/1936529921901281441) when their [API leaked support for ETH network deposits](https://x.com/Twix1441/status/1936530002981609489) - even though their UI hid it completely.**

  

[Sharp-eyed traders caught this discrepancy](https://x.com/Twix1441/status/1936530002981609489), stacked tokens from the compromised chains, and flipped them for profit on other exchanges before anyone could blink.

  

[Cross-chain deposit glitches](https://x.com/Twix1441/status/1936529921901281441) turned into alpha for those quick enough to exploit the chaos.

  

[The token crashed 99%](https://cointelegraph.com/news/hacken-exploited-through-private-key-leak), then [pulled off an 8x recovery pump](https://x.com/Twix1441/status/1936530519358910705) - because apparently even disasters need hype cycles.

  

[Dip buyers who timed it right](https://x.com/Twix1441/status/1936530690411266348) walked away with easy profits, while the rest learned an expensive lesson about liquidity traps.

  

**Meanwhile, [$HAI somehow kept trading](https://x.com/Twix1441/status/1936529275647091085) at multiples of its crash price across different venues - market efficiency was taking a coffee break.**

  
_But what happens when the attacker thinks they've gotten away clean?_  
  
### The Plot Twist  
  
_Three days later, [Budorin dropped a bombshell on Twitter](https://x.com/buda_kyiv/status/1937138684907987410): "Thanks to Extractor, we were able to track all fund movements and timely block the account after his KuCoin deposit."_

  

**The hacker had made their first mistake - [depositing funds on KuCoin](https://x.com/buda_kyiv/status/1937138684907987410), where real-world identity meets blockchain transactions.**  
  
Sometimes KYC can become Know Your Criminal.

  

Suddenly "law enforcement in the process" [wasn't just corporate posturing anymore](https://x.com/buda_kyiv/status/1937138684907987410).

  

Meanwhile, Hacken's damage control strategy shifted into overdrive with promises that would make any marketing team proud.

  

_[Transform $HAI into a regulated financial tool](https://x.com/hackenclub/status/1936487429524848992) that merges token utility with equity rights? Check._

  

**[Merge with Hacken equity shareholders](https://x.com/hackenclub/status/1936487429524848992) valued at over $100M? Double check.**

  

Compensate legitimate holders [through a future token swap](https://x.com/hackenclub/status/1936487455362068991)? Triple check with extra corporate buzzwords.

  

The timing couldn't be more perfect - turn a massive security failure into the catalyst for their "always planned" tokenomics revolution.

  

But here's the bitter irony that cuts deepest: [Hacken's own Q1 2025 security report](https://hacken.io/insights/q1-2025-security-report/) had warned that access control exploits were the number one threat to Web3, responsible for $1.6 billion in losses.

  

"While smart contract vulnerabilities remain a threat, most damage is now caused by failures in people, processes, or permission systems," [their report stated](https://hacken.io/insights/q1-2025-security-report/).

  

**They literally wrote the playbook on what not to do, then followed it to the letter.**

  

_When the security auditors can't audit themselves, who's left watching the watchers?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_Hacken's $170K lesson proves that knowing about security and practicing it are two very different skills._

  

**Five years of delayed multisig upgrades caught up with them in the worst possible way - 900 million minted tokens and a 99% price crater later.**

  

While they spin this disaster into their grand tokenomics transformation, the damage to their credibility might be harder to fix than their bridge architecture.

  

Smart traders turned the chaos into profit, law enforcement might get their man, and Hacken gets to learn that being your own worst case study isn't great for business.

  
Hacken now promises to turn this embarrassment into a [case study for others](https://x.com/hackenclub/status/1937261965014933923). Which is fitting - because the smartest lesson here came at their own expense.

  

[Their own security report](https://hacken.io/insights/q1-2025-security-report/) warned that human error was DeFi's biggest threat - turns out they were writing their autobiography.

  

**The real question isn't whether Hacken can recover from this fumble, but whether anyone will trust a security firm that couldn't secure their own cookie jar.**

  

_In an industry built on trustless systems, what happens when the trust enforcers break their own rules?_
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
