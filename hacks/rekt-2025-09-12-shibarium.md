---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/gaming
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/stable
  - sector/staking
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Shibarium - Rekt"
protocol: "[[Shibarium]]"
date: 2025-09-12
loss_usd: 3000000
auditors:
source: "https://rekt.news/shibarium-rekt"
excerpt: "$3 million validator heist on Shibarium as attacker flash-loaned BONE to control 10 out of 12 validators, then signed fraudulent checkpoints to drain bridge. Half the loot got trapped by blacklists & "
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Shibarium - Rekt

> **Loss:** $3,000,000 | **Date:** 2025-09-12 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/shibarium-rekt-header.png)







_Ronin's ghost haunts the validator landscape once again._  
  

**September 12th brought a familiar nightmare to Shibarium - attackers seizing control of 10 out of 12 validator keys, similar to how the North Korean hackers did to [drain $624 million from Ronin Bridge in 2022](https://rekt.news/ronin-rekt).**  
  
Flash loans met validator capture in a $3 million heist that exposed the brittle trust assumptions underlying cross-chain bridges.  
  
While BONE holders celebrated pump prices, the attacker was busy rewriting the rules of Shibarium's consensus reality.  
  
No smart contract bugs, no protocol vulnerabilities - just someone who figured out that controlling the validators means owning the network.  
  
**[Shiba Inu developer Kaal Dhairya called it](https://x.com/kaaldhairya/status/1966758608940515671): “a sophisticated, probably planned for months attack”, but the blockchain called it exactly what the code allowed.**  
  

_When your bridge security depends on an honest majority, what happens when dishonesty becomes the majority?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Kaal Dhairya](https://x.com/kaaldhairya/status/1966758608940515671), [Peckshield](https://x.com/peckshield/status/1966578130778284440), [Shibarium](https://x.com/Shibizens/status/1966765953888198702), [Shib](https://x.com/Shibtoken/status/1966845298774278444), [Shima](https://x.com/MRShimamoto/status/1966636041839751284), [L2Beat](https://l2beat.com/scaling/projects/shibarium#state-validation), [defi turtle](https://x.com/0xdefiturtle/status/1966590028621975845), [CryptoNewsLand](https://cryptonewsland.com/shibarium-bridge-hit-by-2-4-million-flash-loan-attack/), [CoinDesk](https://www.coindesk.com/markets/2025/09/13/bone-price-surges-40-after-shibarium-flash-loan-exploit), [The Crypto Basic](https://thecryptobasic.com/2025/09/15/shiba-inu-shibarium-bridge-hit-by-3m-exploit/), [crypto.news](https://crypto.news/shiba-inu-price-down-11-5-after-shibarium-bridge-exploit/), [CoinTelegraph](https://cointelegraph.com/news/k9-finance-23k-bounty-shibarium-bridge-exploit), [Mr. Lightspeed](https://x.com/Mr_Lightspeed/status/1966641337094336887)_

  
**[PeckShield caught the first whiff](https://x.com/peckshield/status/1966578130778284440) of blood in the water.**

  
Late evening September 12th, the security firm [flagged suspicious validator activity to Shytoshi Kusama](https://x.com/peckshield/status/1966578130778284440): "Hi ShytoshiKusama, you may want to take a look" - complete with transaction hash evidence of the unfolding disaster.  
  
Almost 12 hours later, Shiba Inu developer [Kaal Dhairya surfaced with damage control mode activated](https://x.com/kaaldhairya/status/1966758608940515671).  
  
_[His announcement revealed the uncomfortable truth](https://x.com/kaaldhairya/status/1966758608940515671): "We are currently in damage control mode and do not yet know if the breach originated from a server or a developer machine."_  
  
**The [attacker took control of the validator keys](https://x.com/kaaldhairya/status/1966758608940515671), gained majority power, and authorized a malicious state to drain the bridge.**  
  

By early morning September 13th, the [Shibarium damage control playbook was in full swing](https://x.com/Shibizens/status/1966765953888198702): "Was Shibarium hacked? No. The protocol itself was not compromised."  
  
Classic crypto crisis management - reframe the narrative before the community fully grasps what happened.  
  

**But the blockchain doesn't care about PR spin, and the numbers told a different story entirely.**  
  
_When your crisis response sounds more like a courtroom defense than a security update, who are you really trying to convince?_  
  
### The Root of the Hack’s Evil  
  
_Shibarium's security model was built on a house of cards - and someone finally huffed and puffed hard enough to blow it down._  
  

**The attack vector was elegantly simple: gain control of enough validators to rewrite consensus reality.**  
  
[Shibarium operates with just 12 validators](https://x.com/Shibtoken/status/1966845298774278444), requiring only 8 signatures (two-thirds majority) to approve state checkpoints.  
  
The attacker managed to [compromise 10 of those 12 signing keys](https://x.com/MRShimamoto/status/1966636041839751284), leaving only [K9 Finance](https://x.com/K9finance) and [Unification](https://x.com/UnificationUND) validators refusing to play along with the charade.  
  

Flash loans [provided the capital injection needed to acquire 4.6 million BONE tokens](https://x.com/kaaldhairya/status/1966758608940515671), temporarily granting the attacker validator voting power within the same block as the exploit.  
  
_No complex smart contract gymnastics required - just convince the network that theft equals legitimate consensus._  
  
**[Mr. Lightspeed's analysis revealed the brutal simplicity](https://x.com/Mr_Lightspeed/status/1967273193187758544): the attacker used bridge funds in the same block to buy BONE, delegate it for validator power, sign fraudulent checkpoints, then repay the "loan" with the stolen assets.**  
  
A perfect closed loop that turned Shibarium's own mechanics against itself.

  

[L2BEAT had already flagged this exact scenario](https://l2beat.com/scaling/projects/shibarium#state-validation) as Shibarium's Achilles heel: "Funds can be stolen if validators submit a fraudulent checkpoint allowing themselves to withdraw all locked funds."  
  
The warning was there in black and white, a prophecy written in risk assessments that appeared to be ignored.  
  

Shibarium's bridge operates without validity proofs or fraud detection - if enough validators sign off, Ethereum's contracts obediently release the funds.  
  
**Code is law, even when the law is being written by criminals.**  
  

_When your security depends on trusting the majority, what happens when the majority can be bought for the price of a flash loan?_  
  
### The Stolen Loot  
  
_The blockchain never lies, even when everyone else is spinning damage control narratives._

  
**Two transactions paint the picture of Shibarium's $3 million bleeding - methodical execution that screams advance planning over lucky timing.**  
  

**Attacker’s Address:** 
[0x999E025a2a0558c07DBf7F021b2C9852B367e80A](https://etherscan.io/address/0x999E025a2a0558c07DBf7F021b2C9852B367e80A)

**Attack Transaction 1:** [0xe882a83afb92d6070b848ef025ae699ec043b7c2f31b21d2a08c94306f9b817e](https://etherscan.io/tx/0xe882a83afb92d6070b848ef025ae699ec043b7c2f31b21d2a08c94306f9b817e)

  

72.6 billion SHIB (~$948k)
4.6 million BONE staking operations
216.39 WETH (~$975k)

  

**Attack Transaction 2:** [0x6df7dcb5dac11355926abf2d9490af031619900de2e202dc780765222101007a](https://etherscan.io/tx/0x6df7dcb5dac11355926abf2d9490af031619900de2e202dc780765222101007a)

  

248.9 billion KNINE (~$631k)
29,167 LEASH (~$490k)
32 million ROAR (~$347k)
34.3 million TREAT (~$47k)
21,094 USDC (~$21k)
16,183 USDT (~$16k)
2.06 trillion BAD (~$16k)
860 million SHIFU (~$9k)
361k FUND (~$9k)

  

_What happened next turned the exploit into an expensive game of digital whack-a-mole._

  
**[K9 Finance DAO blacklisted](https://x.com/0xdefiturtle/status/1966590028621975845) the attacker's address, [blocking the sale of 248.9 billion KNINE tokens](https://cryptonews.com/news/shiba-inus-layer-2-shibarium-targeted-in-flash-loan-attack-nearly-3m-drained/) worth around $700,000.**  
  
Plot twist - [almost half the haul got completely screwed](https://cryptonewsland.com/shibarium-bridge-hit-by-2-4-million-flash-loan-attack/).  
  
Blacklisted tokens and locked stake equal dead money.  
  
**Perfect crime, terrible execution.**  
  

_Stealing $3 million is impressive, but what's the point when $1.3 million of it becomes digital museum pieces that nobody can touch?_  
  
### Reality Bites  
  
_[BONE holders got front-row seats](https://www.coindesk.com/markets/2025/09/13/bone-price-surges-40-after-shibarium-flash-loan-exploit) to exploit economics - a [brutal 122% pump](https://thecryptobasic.com/2025/09/15/shiba-inu-shibarium-bridge-hit-by-3m-exploit/) followed by an even more brutal reality check._

**[The token rocketed from $0.166 to $0.37 on MEXC](https://thecryptobasic.com/2025/09/15/shiba-inu-shibarium-bridge-hit-by-3m-exploit/) as traders mistook validator capture for bullish fundamentals. Flash loan demand created artificial scarcity while the actual network burned - peak crypto moment right there.**

The comedown was swift and merciless. [BONE crashed 43.5% from monthly highs](https://crypto.news/shiba-inu-price-down-11-5-after-shibarium-bridge-exploit/), [SHIB dropped 11.5%](https://crypto.news/shiba-inu-price-down-11-5-after-shibarium-bridge-exploit/), and [KNINE fell 10%](https://cointelegraph.com/news/k9-finance-23k-bounty-shibarium-bridge-exploit). Only the blacklisted tokens kept their "value" - worthless numbers that looked pretty on block explorers.

Shibarium's response [read like a hostage negotiation](https://x.com/kaaldhairya/status/1966758608940515671): [](https://x.com/kaaldhairya/status/1966758608940515671) "We are open to negotiating in good faith with the attacker: if the funds are returned, we will not press any charges and are willing to consider a small bounty." Nothing says we're in control, quite like offering to pay the guy who just robbed you.

_[K9 Finance took a more direct approach](https://x.com/buzzdefi0x/status/1967578705531928973), [](https://etherscan.io/tx/0x15043635a29f6fe140ad4a5b60beb3b4af5dd1f03aaeef30e724964122de1991) sending an [on-chain message](https://etherscan.io/tx/0x15043635a29f6fe140ad4a5b60beb3b4af5dd1f03aaeef30e724964122de1991) offering [](https://cointelegraph.com/news/k9-finance-23k-bounty-shibarium-bridge-exploit) [5 ETH ($23,000)](https://etherscan.io/address/0x8504bfe4321d7a7368f2a96e7aa619811aaab28a#code) for the return of their trapped KNINE tokens.[](https://etherscan.io/tx/0x15043635a29f6fe140ad4a5b60beb3b4af5dd1f03aaeef30e724964122de1991)_

**While most of the community split between denial and anger, one researcher asked the questions that mattered.**
  
[Mr. Lightspeed cut straight to the uncomfortable truth](https://x.com/Mr_Lightspeed/status/1966641337094336887), addressing K9 Finance and Unification - the only two validators who refused to sign the malicious checkpoint:  
  
"Let me guess: you two set up your own validators independently - no outside assistance? Skill set is there. If the others had central help, then all the other keys may belong to one person? That then points to a governance key / signing compromise connected to one person. That would also mean that decentralization was an illusion."

**When the only validators acting independently are the ones who refuse to sign your malicious checkpoint, what does that tell you about your "decentralized" network?**

_If decentralization is just theater and one person controls most of the keys, are we securing DeFi or just building elaborate honeypots?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_So here we are, wrapping up another disasterpiece._  
  

**Shibarium just got schooled by [a similar lesson that destroyed Ronin](https://rekt.news/ronin-rekt/) - put your faith in validator honesty and watch someone buy their way to a $3 million withdrawal.**  
  
No code breaking required, no smart contract wizardry needed. Just enough compromised validators to make theft look like consensus.  
  

[L2BEAT practically drew them a roadmap to the vault](https://l2beat.com/scaling/projects/shibarium), warning in black and white that fraudulent checkpoints could drain everything.  
  
_Prophecy met profit when someone finally bothered to read the fine print._  
  

**Crime meets punishment in crypto's strangest way - half the loot sits frozen forever, trapped by blacklists and staking mechanics.**  
  
K9 Finance turned their tokens into digital cement, while unbonding delays locked the BONE in validator jail. Sometimes the best security happens after you've already been robbed.  
  

All the PR spin can't hide what really happened here.  
  
**Shibarium's bridge worked exactly like it was supposed to - the fatal flaw was building it that way in the first place.**  
  

_When your security model treats consensus as truth instead of verifying it, how long before the next validator majority gets bought and paid for?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
