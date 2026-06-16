---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/multisig
  - sector/privacy
  - sector/token
title: "GriffinAI - Rekt"
protocol: "[[Griffinai]]"
date: 2025-09-24
loss_usd: 3000000
auditors:
source: "https://rekt.news/griffinai-rekt"
excerpt: "LayerZero peer exploit hits Griffin AI - attacker minted 5 billion $GAIN tokens, dumped just 2.8% for $3 million profit while 97.2% sits in the attacker's wallet. When your bridge becomes a money prin"
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# GriffinAI - Rekt

> **Loss:** $3,000,000 | **Date:** 2025-09-24 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/griffinai-rekt-header.png)





_[Less than 24 hours after launching on Binance Alpha](https://x.com/WuBlockchain/status/1971023722485346771), Griffin AI watched their carefully planned tokenomics explode into hyperinflationary chaos._  
  

**Someone with the right connections convinced LayerZero that a fake Ethereum contract deserved the same trust as the real one, then proceeded to mint 5 billion unauthorized $GAIN tokens like a rogue central banker.**  
  

The attacker [dumped just 2.8% of their freshly printed fortune for a clean $3 million payday](https://x.com/BlockscopeCo/status/1971241389523353830), leaving the remaining 97.2% as a digital sword of Damocles hanging over what remained of $GAIN's market cap.  
  

[Griffin AI's founder stepped up with a mea culpa that's rare in DeFi](https://x.com/OliFeldmeier/status/1971270096535326728) - full responsibility, no excuses, complete ownership of the security failure that happened "on his watch."  
  

**But taking blame doesn't resurrect dead tokenomics or explain how someone gained the power to rewrite cross-chain infrastructure rules without anyone noticing.**  
  

_When your bridge becomes someone else's money printer, who's really controlling the flow of value across chains?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Wu Blockchain](https://x.com/WuBlockchain/status/1971023722485346771), [Oliver Felmeier](https://x.com/OliFeldmeier/status/1971270096535326728), [Blockscope](https://x.com/BlockscopeCo/status/1971241389523353830), [GoPlus](https://x.com/GoPlusZH/status/1971016549629820965), [CertiK](https://x.com/CertiKAlert/status/1971053766540657069), [Peckshield](https://x.com/PeckShieldAlert/status/1971045405149495520), [GriffinAI](https://x.com/Griffin_AI/status/1971021877272601021), [Blocksec Phalcon](https://x.com/Phalcon_xyz/status/1971154830447280308), [Bitget](https://www.bitget.com/news/detail/12560604986322), [Cryptopolitan](https://www.cryptopolitan.com/griffin-ai-crash-unauthorized-gain-minting/), [Bein Crypto](https://beincrypto.com/griffin-ai-gain-token-crash-exploit/), [Ember CN](https://x.com/EmberCN/status/1971025117414293924), [bitcoinethereumnews](https://bitcoinethereumnews.com/finance/griffin-ai-crashes-by-90-after-unauthorized-gain-token-minting/), [Noah Mateo](https://x.com/tomjerry_786/status/1970984681647865986)_

  

**[GoPlus Security spotted the bleeding first](https://x.com/GoPlusZH/status/1971016549629820965) on September 24th:**  
  

"The Web3 AI project Griffin AI, which just launched on Binance Alpha, has been hit by malicious minting that issued an additional 5 billion tokens for dumping (with $GAIN's maximum supply being 1 billion tokens), causing the $GAIN price to plummet over 90%."  
  
[GoPlus followed up with posting a screenshot of the malicious minting](https://x.com/GoPlusZH/status/1971016553853505798) that pushed GAIN's supply 5x beyond its intended 1 billion token cap.  
  

**Their warning was crystal clear: users should avoid interacting with the project to prevent losses while the attack was still unfolding.**  
  

[CertiK watched it happen live](https://x.com/CertiKAlert/status/1971053766540657069): "The attacker initialized a false LayerZero Peer on Ethereum, then bridged 5B fake tokens to mint 5B $GAIN on BSC."  
  

[PeckShield followed the money](https://x.com/PeckShieldAlert/status/1971045405149495520) - 147.5M $GAIN dumped for 2,955 BNB, bridged to Ethereum, swapped for 720 ETH, with 700 ETH hitting Tornado Cash.  
  

[Blockscope mapped the laundering operation across chains](https://x.com/BlockscopeCo/status/1971241947781267907) while the funds were still warm.  
  

**Security firms moved faster than Griffin AI's own damage control team - by the time the project acknowledged the exploit, blockchain forensics had already mapped the entire money trail.**  
  

_What does it say about protocol security when external watchdogs sound the alarm before the protocol even knows it's bleeding?_  
  
### Damage Admission Theater  
  
_Griffin AI's first public admission came 22 minutes after GoPlus sounded the alarm - a masterclass in corporate understatement._  
  

**"We are investigating the issue and will make a detailed post as soon as we have more information," [they posted shortly after the exploit](https://x.com/Griffin_AI/status/1971021877272601021), treating a $3 million heist like a minor technical glitch.**  
  

No acknowledgment of the scale, no warning to users, just bureaucratic placeholder text while their token bled out in real-time.  
  

Founder Oliver Feldmeier [finally stepped up over an hour later with the technical breakdown](https://x.com/OliFeldmeier/status/1971041547513889229): an unauthorized LayerZero peer setup had enabled the attacker to deploy a fake Ethereum contract ($TTTTT at 0x7a8caf) and use it to mint 5 billion GAIN on BNB Chain.  
  

_The mea culpa came the following day - [a rare display of executive accountability in DeFi](https://x.com/OliFeldmeier/status/1971270096535326728)._  
  

**"This is an incredibly difficult day, and I want to start by offering my deepest, most sincere apologies to the entire Griffin AI community," [Feldmeier wrote, taking full responsibility for the security incident that happened](https://x.com/OliFeldmeier/status/1971270096535326728) "on my watch."**  
  

[He promised a complete migration to a new, fully audited token](https://x.com/OliFeldmeier/status/1971270096535326728) with restored balances based on pre-hack snapshots - essentially admitting their original tokenomics were beyond repair.  
  
The real question isn't how LayerZero got fooled - it's how someone got the keys to fool it. Admin privileges don't just leak into the wrong hands by accident. Someone either got phished, got paid, or got careless.  
  

**But ownership of failure doesn't explain how someone gained the power to rewrite cross-chain infrastructure rules without anyone noticing until the damage was done.**
  

_Why does taking responsibility feel more like damage control when the fundamental questions remain unanswered?_  
  
### The Cross-Chain Con

  
**LayerZero's peer system turned into Griffin AI's personal money printer.**  
  

_Someone with admin access ran the classic DeFi con - make the bridge believe fake tokens are real tokens._  
  

Contract [0x7a8caf](https://etherscan.io/token/0x7a8caffeb11047e90affc9f7527103b0334572e6) became the decoy while the real GAIN endpoint sat ignored at [0xccdbb9](https://etherscan.io/token/0xccdbb9c8e43f50407c58f81407a16549e2a475dd).

  
**Fake Contract (Decoy):**  
[0x7a8CAffeb11047E90Affc9F7527103b0334572E6](https://etherscan.io/token/0x7a8caffeb11047e90affc9f7527103b0334572e6)

  


**Real GAIN Endpoint Contract:**  
[0xccdbb9c8e43f50407c58f81407a16549e2a475dd  
](https://etherscan.io/token/0xccdbb9c8e43f50407c58f81407a16549e2a475dd)

Deploy fake $TTTTT token on Ethereum. Swap it in as the LayerZero peer. Watch the bridge treat phantom deposits like legitimate cross-chain transfers.  
  
But here's how they actually pulled it off: [Blocksec Phalcon revealed](https://x.com/Phalcon_xyz/status/1971154830447280308) the attacker managed to get an Admin address to invoke the setPeer function - maybe via phishing.  
  
_This action designated a malicious contract address as a trusted peer, enabling arbitrary token minting through the cross-chain bridge._

**Compromised Admin Address (On BSC):**  
[0x54A978238984d581EdD3a9359dDA9BE53A930a7e](https://bscscan.com/address/0x54a978238984d581edd3a9359dda9be53a930a7e)

**Malicious Contract Peer Address (On Ethereum):**  
[0xba159054636e69080ae7c756319e5c85498efeb0](https://etherscan.io/address/0xba159054636e69080ae7c756319e5c85498efeb0)

_[The setPeer transaction on BSC shows exactly when the attacker](https://app.blocksec.com/explorer/tx/bsc/0xf867a8e0b73cc279075cc760747b2a6a552bfa4623ad302f78d5516cb3062d88) gained their minting privileges._

No collateral backing required. No verification. Just minting privileges for days.  
  

Griffin AI's own infrastructure couldn't tell the difference between real cross-chain messages and complete fiction, [happily minting 5 billion GAIN tokens](https://app.blocksec.com/explorer/tx/bsc/0xa85b18bdbd32fbe5468de38032f7f2717faaad663d33991b2c71ce0b3892e866) while the attacker counted their phantom Ethereum "deposits."  
  
**5 billion GAIN tokens minted:**  
[0xa85b18bdbd32fbe5468de38032f7f2717faaad663d33991b2c71ce0b3892e866 ](https://bscscan.com/tx/0xa85b18bdbd32fbe5468de38032f7f2717faaad663d33991b2c71ce0b3892e866)

_This wasn't an isolated incident, [as highlighted by Blocksec Phalcon](https://x.com/Phalcon_xyz/status/1971154830447280308): "Yet another attack targeting Griffin AI similar to the Seedifyfund incident: fraudulent cross-chain messages from the source chain were accepted and executed on the destination chain."_  
  

[GoPlus Security specifically flagged the exploit as similar to](https://x.com/GoPlusSecurity/status/1971026729876832721) "a prior attack on the Yala project," where fake LayerZero peers were also used to bypass cross-chain security checks.

  

LayerZero's peer trust system keeps getting owned the same way - Seedify, Yala, now Griffin AI, all falling for the same fake peer con.

  
**What the blockchain recorded was elegant in its simplicity: someone convinced a bridge that the fake was real, then cashed out before anyone noticed the difference.** 
  

_When cross-chain infrastructure can't distinguish between authentic and counterfeit peers, what's stopping the next attacker from running the same playbook?_  
  
### Following the Money Trail  
  
_The blockchain doesn't lie about the execution._  
  

**The [attacker minted 5 billion GAIN tokens](https://x.com/WuBlockchain/status/1971023722485346771), bloating total supply from 1 billion to 5.2985 billion.**  
  
**Attacker address:** 
[0xf3d17326130f90c1900bc0b69323c4c7e2d58db2](https://bscscan.com/address/0xf3d17326130f90c1900bc0b69323c4c7e2d58db2)

Here's what makes it beautiful: they dumped just 147.5 million tokens.  
  

That's [2.8% of their money printer output](https://x.com/BlockscopeCo/status/1971241389523353830), but enough to [obliterate GAIN's price by 90%](https://www.bitget.com/news/detail/12560604986322) and [walk away with 2,955 BNB (~$3 million)](https://x.com/BlockscopeCo/status/1971241389523353830).  
  

The other 4.85 billion tokens? Still sitting in the attacker’s wallet.  
  
**Attacker’s Wallet on Arkham (still unlabeled):**
[0xF3d17326130F90c1900bc0B69323C4C7E2d58Db2](https://intel.arkm.com/explorer/address/0xF3d17326130F90c1900bc0B69323C4C7E2d58Db2)

**PancakeSwap's shallow liquidity [turned a modest dump into total devastation](https://www.cryptopolitan.com/griffin-ai-crash-unauthorized-gain-minting/).**  
  

_The [stolen BNB got bridged to Ethereum via deBridge](https://x.com/exvulsec/status/1971042064029905104) while Griffin AI was still figuring out what hit them._  
  
**deBridge Transaction 1:**  
[0xcfaf94a7d7e4b56bf0698f2cba88e46c2cc1c584a897e65f1a63ac88de290045](https://bscscan.com/tx/0xcfaf94a7d7e4b56bf0698f2cba88e46c2cc1c584a897e65f1a63ac88de290045)

**deBridge Transaction 2:**  
[0x31661ffc5311cd13bf59cb3a5122198c2ce4d4420d221bedfba634fdda49fc58](https://bscscan.com/tx/0x31661ffc5311cd13bf59cb3a5122198c2ce4d4420d221bedfba634fdda49fc58)

**deBridge Transaction 3:**  
[0x22afbc0ecb066e7247a68919082d9bc1b3f59cb02582ee113f2d570cb446ea57  ](https://bscscan.com/tx/0x22afbc0ecb066e7247a68919082d9bc1b3f59cb02582ee113f2d570cb446ea57)

**deBridge Transaction 4:**  
[0x9be63ee5b0175328403ea0b9ecd55b676e528ee43beba065e83b0d25bc1fae2c](https://bscscan.com/tx/0x9be63ee5b0175328403ea0b9ecd55b676e528ee43beba065e83b0d25bc1fae2c)

**deBridge Transaction 5:**  
[0x3a175487668f521e4aedf86aa2d96f059b50f08520c31c164fb16265fe2f8e0b](https://bscscan.com/tx/0x3a175487668f521e4aedf86aa2d96f059b50f08520c31c164fb16265fe2f8e0b)

**deBridge Transaction 6:**  
[0x16fbdad32ad3f875918604a8f27edd1a22e0e23c6845a6d5b4e0a41741f2d5f2](https://bscscan.com/tx/0x16fbdad32ad3f875918604a8f27edd1a22e0e23c6845a6d5b4e0a41741f2d5f2)

[Some funds made it to Tornado Cash](https://x.com/PeckShieldAlert/status/1971045405149495520) for laundering.  
  
[According to EmberCN](https://x.com/EmberCN/status/1971025117414293924), the 2,955 BNB were converted through deBridge into roughly 720 ETH and distributed into the following six wallets.  
  
_5 of the wallets laundered 100 ETH each and the other laundered 200 ETH._  
  
**Wallets used for laundering:**

  
[0x1afc80d0E15cBCBfAAB9aD5520b4ab843Dfd648D  
](https://etherscan.io/address/0x1afc80d0e15cbcbfaab9ad5520b4ab843dfd648d)[0xD4d83C2BC58B97d6458a7AE7d5b417c5422DC04C  
](https://etherscan.io/address/0xd4d83c2bc58b97d6458a7ae7d5b417c5422dc04c)[0xB31BDDb3d1c2b45E5c5fE149Aa4c8304e9D1916C  
](https://etherscan.io/address/0xb31bddb3d1c2b45e5c5fe149aa4c8304e9d1916c)[0xa6654f227EcCF2f84476d2d51434081613F8Baba](https://etherscan.io/address/0xa6654f227eccf2f84476d2d51434081613f8baba) [0x107E83EBE677DDec253C440127F23310720177c2](https://etherscan.io/address/0x107e83ebe677ddec253c440127f23310720177c2)

**This wallet moved 200 ETH and is still sitting on 20 ETH:**  
[0xf1755A2b7d0e418E9BAB4F81AD674fa39fA7F23D ](https://etherscan.io/address/0xf1755a2b7d0e418e9bab4f81ad674fa39fa7f23d)

**The attacker didn't need to cash out everything to destroy everything.**  
  

_How do you spin a story where 2.8% of fake tokens obliterated 90% of your market cap?_  
  
### When the Music Stops  
  
_The dance floor emptied fast once Griffin AI realized the DJ had left the building._

  
**Within an hour of detecting the exploit, they pulled the emergency brake on everything that mattered - official liquidity pools vanished from BNB Chain like ghosts at sunrise.**  
  

"Please DO NOT interact with any LPs that may be created by the attacker.  
  
They are not official and pose a risk," [Griffin AI warned](https://x.com/Griffin_AI/status/1971067496678686721), essentially admitting they'd lost control of their own token ecosystem.  
  

_[Daily trading volume surged 126% to $96 million](https://beincrypto.com/griffin-ai-gain-token-crash-exploit/) as panic selling dominated DEXs._  
  

**[Griffin AI painted the shutdown in corporate poetry](https://x.com/Griffin_AI/status/1971076999511933421): "we’re coordinating closely with exchanges and security partners" while users watched their portfolios bleed in real-time.**  
  
[Griffin AI called out to all exchanges to pause](https://x.com/Griffin_AI/status/1971076999511933421) GAIN trading, [with KuCoin](https://www.kucoin.com/announcement/en-suspension-of-griffinai-gain-deposits-withdrawals-trading-and-delay-of-campaign) and [MEXC responding](https://www.cryptopolitan.com/griffin-ai-crash-unauthorized-gain-minting/) so far by suspending deposits, withdrawals, and trading.  
  
[Griffin AI also announced the end of its airdrop campaigns](https://bitcoinethereumnews.com/finance/griffin-ai-crashes-by-90-after-unauthorized-gain-token-minting/) following the exploit, though the completed Binance Alpha airdrop remained unaffected, leaving users staring at frozen expansion plans while the token burned around them.

  

**The music had stopped, but the dancers were still falling - and some were still trying to trade with counterfeit tokens in pools that shouldn't exist.**  
  

_When your emergency response involves asking nicely for help, who's really conducting this orchestra of chaos?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






  

_Griffin AI's $3 million vanishing act reads like a DeFi déjà vu fever dream._

  
**Admin keys turned into weapons. Cross-chain bridges became counterfeiting machines.**  
  
Another day, another reminder that your biggest threat might be checking email while holding the master keys.

  

Hours before everything went to hell, [traders were riding GAIN's "price-discovery tear" with $109.8 million in launch volume](https://x.com/tomjerry_786/status/1970984681647865986), hyping the "high-momentum move" toward $0.20 resistance.  
  

_By the next morning, those same momentum chasers were staring at a 90% crater where their portfolios used to be._  
  

**The script feels painfully familiar: UXLink's multisig betrayal cost users $41 million just days ago, proving that whether it's LayerZero peers or delegateCall functions, administrative access keeps morphing into exit ramps.**  
  
Even more fitting - [the Griffin AI exploiter later minted trillions fake UXLink tokens in three separate transactions](https://bscscan.com/address/0xf3d17326130f90c1900bc0b69323c4c7e2d58db2#tokentxns) using a [counterfeit contract created on September 23rd](https://bscscan.com/address/0x442d81a6d080a059d2957c0e2fe6b8513b33e603).  
  
Because apparently when you're running a counterfeiting operation, why not counterfeit the other counterfeiters too.  
  

[Griffin AI's founder took rare ownership of the failure](https://x.com/OliFeldmeier/status/1971270096535326728), but accountability doesn't resurrect dead tokenomics or explain how cross-chain trust mechanisms become counterfeiting operations overnight.

  

The 4.85 billion phantom tokens [still sitting in the attacker's wallet](https://intel.arkm.com/explorer/address/0xF3d17326130F90c1900bc0B69323C4C7E2d58Db2) serve as a constant reminder that this story isn't over - just paused.  
  

**Maybe the real exploit was the friends we trusted with admin keys along the way.**  
  

_When your biggest security risk sits in the boardroom instead of the codebase, what exactly are we auditing?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
