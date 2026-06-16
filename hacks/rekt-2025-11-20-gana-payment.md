---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - sector/staking
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - precondition/insider
title: "GANA Payment - Rekt"
protocol: "[[Gana Payment]]"
date: 2025-11-20
loss_usd: 3100000
auditors:
source: "https://rekt.news/gana-payment-rekt"
excerpt: "Speed-to-market killed another protocol. Nine days from launch to liquidation. $3.1 million drained from GANA Payment via leaked owner keys and EIP-7702 delegation exploit. BSC's 41% audit rate vs Eth"
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# GANA Payment - Rekt

> **Loss:** $3,100,000 | **Date:** 2025-11-20 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/gana-payment-rekt-header.png)













_Nine days is all the trust you get in DeFi these days._

  

**[GANA Payment's freshly minted payment protocol on BNB Smart Chain lost $3.1 million](https://www.theblock.co/post/379619/gana-payment-exploit) before users could stake anything meaningful.**

  

The attacker didn't need sophisticated exploits or oracle manipulation - [just an EIP-7702 delegator contract and someone's leaked owner key](https://x.com/QuillAudits_AI/status/1991430914451149226?s=20), turning the staking mechanism into a personal ATM through repetitive stake-unstake loops.

  

[Launched November 11th](https://x.com/GANA_PayFi/status/1988161403815903299), exploited November 20th.

  

**No audit. No time to build trust. No chance to prove the tech worked.**

  

[Token holders watched 90% of their value evaporate](https://www.theblock.co/post/379619/gana-payment-exploit) as funds scattered across chains - $2.1 million bridged to Ethereum, the rest laundered on BSC, most already through Tornado Cash while 346 ETH sat dormant, waiting for its turn.

  

**[ZachXBT flagged the carnage first](https://t.me/investigations/289), with [Quill Audits](https://x.com/QuillAudits_AI/status/1991430914451149226?s=20) and [Blockscope](https://x.com/BlockscopeCo/status/1991572063379943535?s=20) dissecting the wreckage as the laundering continued in calculated batches.**

  
_When your protocol dies faster than a TikTok trend, who's really testing the code - developers or attackers?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [TheBlock](https://www.theblock.co/post/379619/gana-payment-exploit), [Quill Audits](https://x.com/QuillAudits_AI/status/1991430914451149226?s=20), [GANA Payment](https://x.com/GANA_PayFi/status/1991424973190361394), [ZachXBT](https://t.me/investigations/289), [Blockscope](https://x.com/BlockscopeCo/status/1991572063379943535?s=20), [Ye in Web3](https://x.com/muststopye/status/1991439431988064373), [BitcoinEthereumNews](https://bitcoinethereumnews.com/tech/gana-payment-hack-causes-3-1m-loss-after-private-key-leak-and-7702-delegate-exploit/), [GoPlus Security](https://x.com/GoPlusSecurity/status/1991543210926305786), [Hacken](https://x.com/extractor_web3/status/1991439162428260432), [Coin Edition](https://coinedition.com/hackers-exploit-gana-payment-for-3-1-million-on-bsc-chain/), [DefiLlama](https://defillama.com/hacks?chain=bsc&time=1y), [Seedify](https://x.com/SeedifyFund/status/1970537553515417918), [SlowMist](https://x.com/SlowMist_Team/status/1935246606095593578), [Yahoo Finance](https://finance.yahoo.com/news/zachxbt-reveals-bsc-project-gana-133554217.html), [DexScreener](https://dexscreener.com/bsc/0x01586dc6d68a20cdf6304febd03be40ec12735e4)_

  

**[ZachXBT broke the news in the wee early morning hours on November 20th](https://t.me/investigations/289), posting the consolidation address while most of crypto Twitter was still asleep.**

  

By the time [GANA Payment posted their "urgent announcement" acknowledging the breach](https://x.com/GANA_PayFi/status/1991424973190361394), the attacker had already deposited 1,140 BNB ($1.04 million) into Tornado Cash on BSC and started bridging the rest to Ethereum.

  

"GANA's interaction contract has been targeted by an external attack, resulting in unauthorized asset theft."

  

**Was it corporate speak for "someone with the keys emptied the vault?"**

  

[The team promised an emergency investigation with a third-party security firm](https://x.com/GANA_PayFi/status/1991424973190361394), a comprehensive reboot plan, and full asset mapping. Standard crisis protocol - investigate, promise, rebuild.

  

**[But the comments section may have told a different story](https://x.com/muststopye/status/1991439431988064373): "Guys it's not 'interaction contract' was targeted it was private key leakage (at least)."**

  

_When your own community calls out the euphemisms before the investigation even starts, what exactly is there left to investigate?_

  

### EIP-7702: From Feature to Folly  
  
_[SlowMist founder Yu Xian cut through the noise](https://bitcoinethereumnews.com/tech/gana-payment-hack-causes-3-1m-loss-after-private-key-leak-and-7702-delegate-exploit/): owner private key leaked, EIP-7702 delegator exploit deployed, onlyEOA check bypassed._

  

**No hack needed. No market manipulation. Just full control handed over.**

  

Because, someone had the keys.

  

EIP-7702 was supposed to make Ethereum accounts smarter - letting externally owned accounts temporarily behave like smart contracts.

  

Batch transactions, sponsored gas, delegated permissions.

  

**GANA's attacker turned that innovation into an exploitation framework.**

  

_The malicious delegator contract became the middleman between the compromised owner key and GANA's staking contract._  
  
**Malicious Delegator Contract:**  
[0x7A44bD9C6095Ca7b2A6f62FE65b81924c6cAb067](https://bscscan.com/address/0x7A44bD9C6095Ca7b2A6f62FE65b81924c6cAb067)

  
**GANA’s Staking Contract:** 
[0xACF753d5d81462db45b7f024e9fa76993ce9bcfb](https://bscscan.com/address/0xacf753d5d81462db45b7f024e9fa76993ce9bcfb)

  

[GoPlus Security suggests the attacker may have gained admin access via social engineering/phishing](https://x.com/GoPlusSecurity/status/1991543210926305786), then [used transferOwnership to rotate through eight pre-prepared addresses](https://x.com/GoPlusSecurity/status/1991543210926305786), each one [authorizing the EIP-7702 delegator to bypass the onlyEOA restriction](https://x.com/GoPlusSecurity/status/1991543210926305786) that should have protected the unstake function.

  

[Hacken's analysis showed the pattern](https://x.com/extractor_web3/status/1991439162428260432): stake GANA and USDT through seven different accounts, then withdrew tokens via a delegated contract using an EIP-7702 transaction.  
  
[Just before the withdrawal](https://x.com/extractor_web3/status/1991439162428260432), they manipulated the reward logic by setting an enormous rate for gana_Computility: 10,000,000,000,000,000

  

_Eight iterations. One systematic drain._

  

**Primary consolidation address collected the pieces:** 
[0x2e8a8670b734e260cedbc6d5a05532264aae5c38](https://bscscan.com/address/0x2e8a8670b734e260cedbc6d5a05532264aae5c38)

  

**The protocol's own systems couldn't tell the difference between legitimate rewards and manufactured theft - because to the smart contract, someone with owner privileges was just doing their job.**

  

_When your security model assumes the admin won't rob you, what's the difference between authorization and exploitation?_

  

### The Laundering Express

  

_The attacker didn't waste time admiring the haul._

  

**Victim Staking Contract:** 
[](https://bscscan.com/address/0xacf753d5d81462db45b7f024e9fa76993ce9bcfb)
[0xACF753d5d81462db45b7f024e9fa76993ce9bcfb](https://bscscan.com/address/0xacf753d5d81462db45b7f024e9fa76993ce9bcfb)

  

**Malicious EIP-7702 Delegator:** 
[](https://bscscan.com/address/0x7A44bD9C6095Ca7b2A6f62FE65b81924c6cAb067)
[0x7A44bD9C6095Ca7b2A6f62FE65b81924c6cAb067](https://bscscan.com/address/0x7A44bD9C6095Ca7b2A6f62FE65b81924c6cAb067)

  

_Key Attack Transactions are as follows…_

  

**Ownership Transfer (just before the drain):** 
[0x8f909383a91c55282a59a1568a9ca58f7e4a02d26f1918dfc5c641a99bdabda8](https://bscscan.com/tx/0x8f909383a91c55282a59a1568a9ca58f7e4a02d26f1918dfc5c641a99bdabda8)

  

**Example Stake Transaction:** 
[0xac935e62f3f6f375d856775f8fe2628e92b1944b15a251090bef213dc5f5f9e2](https://bscscan.com/tx/0xac935e62f3f6f375d856775f8fe2628e92b1944b15a251090bef213dc5f5f9e2)

  

**Main Exploit Transaction (unstake/delegator combo):** 
[0x0a1fabbb536cf776335e2ded5ebf70f4c9601376e7265a127afe55305eff69ad](https://bscscan.com/tx/0x0a1fabbb536cf776335e2ded5ebf70f4c9601376e7265a127afe55305eff69ad)

  

**Primary BSC Consolidation Address:** 
[0x2e8a8670b734e260cedbc6d5a05532264aae5c38](https://bscscan.com/address/0x2e8a8670b734e260cedbc6d5a05532264aae5c38)

  

_All roads led here first. The attacker swapped stolen tokens into liquid assets, then split the laundering operation across two chains._

  

**BSC Route:** 
[1,140 BNB (~$1.04M) → Tornado Cash on BSC](https://t.me/investigations/289).

  

_Fast, efficient, gone._

  

**Secondary BSC Address (Handled remaining ~$1M before Tornado):** 
[0xd10Ed57534Dc63f2ea9dC0cB0096086F3CC8fA4d](https://bscscan.com/address/0xd10Ed57534Dc63f2ea9dC0cB0096086F3CC8fA4d)

  

Then the bridge jump - [roughly $2.1M moved to Ethereum](https://x.com/BlockscopeCo/status/1991572063379943535?s=20) via deBridge and Stargate.

  

**Initial Landing Address on Ethereum:** 
[](https://etherscan.io/address/0x5149A7696188F083297281D10293a20476252CDD)
[0x5149A7696188F083297281D10293a20476252CDD](https://etherscan.io/address/0x5149A7696188F083297281D10293a20476252CDD)

  

**Distribution Wallets ([flagged by Blockscope](https://x.com/BlockscopeCo/status/1991576274683220425)):** 
[0x7a503e3ab9433ebf13afb4f7f1793c25733b3cca](https://etherscan.io/address/0x7a503e3ab9433ebf13afb4f7f1793c25733b3cca) 
[0x98fc13632ff112e4667fc4f21ae980571f122b5a](https://etherscan.io/address/0x98fc13632ff112e4667fc4f21ae980571f122b5a)

  

[346.8 ETH ($1.05M) → Tornado Cash on Ethereum](https://t.me/investigations/289).

  

**But this wallet kept 346 ETH dormant for hours:** 
[0x7a503e3ab9433ebf13afb4f7f1793c25733b3cca](https://etherscan.io/address/0x7a503e3ab9433ebf13afb4f7f1793c25733b3cca)

  

[Then the incremental laundering began](https://www.cryptopolitan.com/gana-payment-exploited/) - 1 ETH, 10 ETH, 100 ETH batches through Tornado Cash. The slow drip designed to shake off security researchers tracking the flow.

  

Two chains, a little mixer action, throw in some calculated patience. And poof, money gone.

  

**The blockchain recorded every hop, every swap, every mixer deposit - a perfect ledger of theft that leads nowhere prosecutors can follow.**

  

_If the system does exactly what it’s told, who’s responsible when it’s exploited?_

  

### BSC's Trust Deficit

  

_[GANA Payment launched November 11th](https://x.com/GANA_PayFi/status/1988161403815903299), with [no public audit and no security documentation](https://www.theblock.co/post/379619/gana-payment-exploit)._

  

**9 days later, [it joined BSC's growing graveyard of mid-sized exploits](https://coinedition.com/hackers-exploit-gana-payment-for-3-1-million-on-bsc-chain/).**

  

**The numbers tell the story:** [41% audit rate for smart contracts deployed on BSC in 2025](https://coinedition.com/hackers-exploit-gana-payment-for-3-1-million-on-bsc-chain/).

  

[Ethereum? 74%](https://coinedition.com/hackers-exploit-gana-payment-for-3-1-million-on-bsc-chain/).

  

That 33-point gap costs money.

  

_[According to DefiLlama’s hacks tracker](https://defillama.com/hacks?chain=bsc&time=1y) - BSC projects lost over $200 million to exploits in 2025 alone._

  
**[KiloEx](https://rekt.news/kiloex-rekt), [Seedify](https://x.com/SeedifyFund/status/1970537553515417918), [GriffinAI](https://rekt.news/griffinai-rekt) and [Woo X](https://rekt.news/woox-rekt) to name a few. [Phemex alone lost $85 million](https://www.theblock.co/post/342265/millions-worth-stolen-funds-phemex-hack-move-tornado-cash-crypto-mixer) and [Nobitex got rekt for $82 million](https://x.com/SlowMist_Team/status/1935246606095593578).**

  

Now add GANA Payment as the latest victim on the network.

  

Another protocol, another rinse‑and‑wipe on the chain.

  

The playbook doesn't change because it doesn't need to.

  

_BNB Chain [celebrated a 70% reduction in losses](https://finance.yahoo.com/news/zachxbt-reveals-bsc-project-gana-133554217.html) - $161 million in 2023 down to $47 million in 2024._

  

**Progress, sure.**

  

But 2025 erased all of it. [Over $200 million lost across twelve exploits](https://defillama.com/hacks?chain=bsc&time=1y) - more than quadruple 2024's total, proving the audit gap and governance problems never went away.

  

[GANA Payment's token crashed 90%](https://www.theblock.co/post/379619/gana-payment-exploit) within 24 hours. [DexScreener charts showed the cliff](https://dexscreener.com/bsc/0x01586dc6d68a20cdf6304febd03be40ec12735e4) - $2.98 to $0.31 as holders realized their payment protocol was paying someone else.

  

[The GANA Foundation announced their November 24th reboot plan](https://x.com/GANA_PayFi/status/1992897151287058822): 100% of capital secured for ecosystem recovery, token bottom pool reconstruction, detailed compensation framework.

  

Classic post-exploit theater - promise everything, deliver timelines, hope the news cycle moves on.

  

**But here's what the reboot plan doesn't address: how a protocol launched without an audit, compromised within 9 days, and drained through a well-known exploit pattern gets a second chance at user funds.**

  

_When speed-to-market beats security-by-design every time, who's really getting rekt - projects or their users?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)





_9 days from launch to liquidation - GANA Payment set a new speed record for trust destruction._

  

**$3.1 million gone before the documentation was even finished.**

  

[Before the first audit could be done](https://gana-payment.gitbook.io/whitepaper/8.-development-roadmap/year-2025). Before users had time to understand what they were staking in.

  

EIP-7702 became the weapon. Private key compromise became the ammunition. Eight ownership rotations became the trigger mechanism.

  

_Someone with access decided the vault belonged to them, and the smart contract had no choice but to agree._

  

**The blockchain recorded every transaction with perfect accuracy - ownership transfers, inflated reward rates, systematic drainage, cross-chain laundering.**

  

GANA promises a reboot. Capital secured. Token pool reconstructed. Compensation planned.

  

But compensation doesn't answer the fundamental question: why should anyone trust version 2.0 of a protocol that couldn't survive version 1.0 for 9 days?

  

**DeFi was supposed to eliminate the need for trusted intermediaries - instead, we've just created faster ways to discover which intermediaries shouldn't be trusted.**

  

_How many nine-day experiments with user funds does it take before "launched too fast" becomes indistinguishable from "launched to fail"?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
