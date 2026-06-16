---
tags:
  - blockchain/bitcoin
  - sector/gaming
  - sector/governance
title: "The One That Got Away"
protocol: "[[The One That Got Away]]"
date: 2020-12-20
loss_usd: 14847374246
auditors:
source: "https://rekt.news/the-one-that-got-away"
excerpt: "127,426 BTC worth $3.5 billion in 2020 vanished from LuBian’s mining pool in one of the largest single-event crypto thefts ever. Five years later, it’s a $14.8 billion ghost heist - uncovered by Arkha"
genome:
  - "[[access-roles]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[reward-accounting]]"
---
# The One That Got Away

> **Loss:** $14,847,374,246 | **Date:** 2020-12-20 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/one-that-got-away-header.png)




_Five years ago, [127,426 Bitcoin vanished into digital thin air](https://x.com/arkham/status/1951729790299394113)._

  

**At the time, it was worth around $3.5 billion. Today, [the amount has mooned to approximately $14.8 billion](https://x.com/arkham/status/1951729790299394113).**

  

No headlines. No panic. No investigation at the time. Just silence so complete it made the theft invisible for half a decade while the stolen stash grew to eclipse some nations' GDP.

  

December 2020: [LuBian controlled almost 6% of Bitcoin's network hashrate](https://mempool.space/mining/pool/lubiancom), boldly marketing itself as "[the safest high-yielding mining pool in the world.](https://finance.yahoo.com/news/little-known-lubian-now-one-143813766.html)"

  

Behind that promise sat cryptographic security so broken a gaming laptop could crack it in hours.

  

February 2021: [LuBian disappeared without explanation](https://mempool.space/mining/pool/lubiancom), perfectly timed with China's mining crackdown. Everyone shrugged and moved on.

  

**August 2025: [Arkham Intelligence drops a bombshell](https://x.com/arkham/status/1951729790299394113): 127,426 stolen Bitcoin hiding in plain sight - a sum that eclipses even the biggest CEX disasters.**

  
_When broken cryptography can drain more money than entire countries see in a year, what else are we getting catastrophically wrong?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Arkham](https://x.com/arkham/status/1951729790299394113), [Mempool](https://mempool.space/mining/pool/lubiancom), [Yahoo Finance](https://finance.yahoo.com/news/little-known-lubian-now-one-143813766.html), [Ledger](https://www.ledger.com/academy/topics/security/what-is-the-entropy), [CCN](https://www.ccn.com/education/crypto/14-billion-bitcoin-heist-lubian-wallet-flaw-arkham/), [ASecuritySite](https://medium.com/asecuritysite-when-bob-met-alice/a-novice-mistake-meet-milk-sad-and-the-32-bit-key-ba308fb2b633), [Bitcoin.com](https://news.bitcoin.com/chinese-bitcoin-miners-develop-strong-relationships-and-crypto-mining-facilities-in-iran/), [CoinTelegraph](https://cointelegraph.com/news/3-5b-btc-heist-retroactively-uncovered-arkham), [CoinDesk](https://www.coindesk.com/learn/china-crypto-bans-a-complete-history), [TIME](https://time.com/6051991/why-china-is-cracking-down-on-bitcoin-mining-and-what-it-could-mean-for-other-countries/), [Reuters](https://www.reuters.com/technology/iran-bans-cryptocurrency-mining-4-months-amid-power-cuts-2021-05-26/), [CompassMining](https://compassmining.io/education/lubian-bitcoin-mining-private-pool-stopped), [Blockscope](https://research.blockscope.co/august-2025-lubian-hack/), [Milk Sad](https://milksad.info/disclosure.html), [CoinMarketCap](https://coinmarketcap.com/academy/article/bitcoin-news-arkham-intelligence-exposes-dollar145-billion-bitcoin-theft-from-chinese-mining-pool-lubian)_

  

**LuBian’s collapse wasn’t due to a clever exploit or shadowy state actor - it was a cryptographic faceplant.**  
  
No sophisticated malware. No insider betrayal. Just mind-numbing incompetence dressed up as enterprise security.  
  

Bitcoin private keys [should contain 256 bits of entropy](https://www.ledger.com/academy/topics/security/what-is-the-entropy) - roughly 2^256 possible combinations.  
  
That's more potential keys than atoms in the observable universe.  
  
**[LuBian's system? 32 bits](https://www.ccn.com/education/crypto/14-billion-bitcoin-heist-lubian-wallet-flaw-arkham/). Around [4 billion possibilities](https://www.ledger.com/blog/funds-of-every-wallet-created-with-the-trust-wallet-browser-extension-could-have-been-stolen) that any decent computer could churn through in a few hours.**  
  

Picture building a vault with the world's most advanced locks, then leaving the combination written on a sticky note.  
  
[LuBian used a private key generation algorithm with catastrophically weak 32-bit entropy](https://www.ccn.com/education/crypto/14-billion-bitcoin-heist-lubian-wallet-flaw-arkham/), making it vulnerable to the same type of brute-force attacks that would later devastate systems like [Trust Wallet and Libbitcoin Explorer](https://medium.com/asecuritysite-when-bob-met-alice/a-novice-mistake-meet-milk-sad-and-the-32-bit-key-ba308fb2b633).

  

Fine for statistical simulations, catastrophic for cryptography.

  
**This wasn't bleeding-edge exploitation. Script kiddies were [cracking similar setups](https://www.ledger.com/blog/funds-of-every-wallet-created-with-the-trust-wallet-browser-extension-could-have-been-stolen) back when Bitcoin was still cheap enough to mine on GPUs.**  
  

_If the "world's safest mining pool" was running security that belonged in a computer science textbook's "what not to do" chapter, who else was faking it until they got rekt?_  
  
### The China-Iran Power Play

  

_[Liu Ping's LuBian operation](https://news.bitcoin.com/chinese-bitcoin-miners-develop-strong-relationships-and-crypto-mining-facilities-in-iran/) wasn't just any mining pool._

  

**[LuBian had their own customs clearance channels](https://news.bitcoin.com/chinese-bitcoin-miners-develop-strong-relationships-and-crypto-mining-facilities-in-iran/) through experience establishing logistics companies.**

  
[Iran offered extremely affordable electricity at $0.006 per kilowatt-hour](https://news.bitcoin.com/chinese-bitcoin-miners-develop-strong-relationships-and-crypto-mining-facilities-in-iran/), making it a magnet for power-hungry mining operations.[](https://news.bitcoin.com/chinese-bitcoin-miners-develop-strong-relationships-and-crypto-mining-facilities-in-iran/)

  

[LuBian cooperated with a local private power plant](https://news.bitcoin.com/chinese-bitcoin-miners-develop-strong-relationships-and-crypto-mining-facilities-in-iran/), whose investors were Chinese and Iranians, with the plant generating electricity by burning waste and energy.

  

**But the real genius was the political insurance policy.**  
  
[Liu Ping bragged](https://news.bitcoin.com/chinese-bitcoin-miners-develop-strong-relationships-and-crypto-mining-facilities-in-iran/) about maintaining "good relations with Iran's Ministry of Energy, Ministry of Foreign Affairs, and even the army."  
  
Deep state connections in a sanctions-hit nation desperate for hard currency made LuBian untouchable.  
  

**From unknown startup [to almost 6% of Bitcoin's global hashrate](https://mempool.space/mining/pool/lubiancom) in months. From zero to hero to ghost in under a year.**  
  

_When your mining operation needs diplomatic immunity to function, should that maybe raise some red flags about sustainability?_  
  
### Timing is Everything

  

_December 28, 2020: [Over 90% of LuBian's Bitcoin vanishes](https://cointelegraph.com/news/3-5b-btc-heist-retroactively-uncovered-arkham). Not a whisper._

  
**February 2021: [LuBian mines its final block](https://mempool.space/mining/pool/lubiancom). Operations cease without explanation.**

  
May 2021: [China declares war on Bitcoin mining](https://www.coindesk.com/learn/china-crypto-bans-a-complete-history). Perfect cover story delivered on a silver platter.

  
Everyone bought the regulatory crackdown narrative.  
  
Made perfect sense - [Chinese mining operations shutting down left and right](https://time.com/6051991/why-china-is-cracking-down-on-bitcoin-mining-and-what-it-could-mean-for-other-countries/), [Iran was tightening crypto restrictions in 2021](https://www.reuters.com/technology/iran-bans-cryptocurrency-mining-4-months-amid-power-cuts-2021-05-26/), LuBian caught in the crossfire.

  

_Except LuBian wasn't a victim of regulatory pressure._

  

**They were casualties of their own mathematical incompetence, desperately hoping nobody would notice the difference.**

  

[China's mining ban may have become](https://compassmining.io/education/lubian-bitcoin-mining-private-pool-stopped) the ultimate get-out-of-jail-free card.  
  
By September 2021, technical observers like [Compass Mining noted the pool had simply vanished](https://compassmining.io/education/lubian-bitcoin-mining-private-pool-stopped) - though no one connected it to a heist at the time.

  

No awkward questions about missing funds. No uncomfortable audits. No explaining how the "world's safest mining pool" got cleaned out by a calculator.

  

**LuBian didn't exit - they evaporated.** 
  

_What's scarier: that billion-dollar operations can disappear overnight, or that nobody bothers asking why?_  
  
### Message in a bottle

  

_LuBian knew they were screwed._

  

**[Over 1,500 desperate messages sent directly to the hacker's wallets](https://x.com/arkham/status/1951729795575763016) via Bitcoin's OP_RETURN function. Each transaction cost money - [1.4 BTC total](https://x.com/arkham/status/1951729795575763016) - just to beg for their stolen fortune back.**

  

Picture spending $40,000 to send pleading texts to someone who just robbed your house.

  

The messages were pathetic proof of authenticity.

  

Only the rightful wallet owner would burn Bitcoin begging for mercy from their attacker.

  

_Each OP_RETURN transaction screamed the same thing: "Please return our funds, we'll pay a reward."_

  

**Radio silence.**

  

The hacker never responded. Never acknowledged. Never even moved the funds beyond [basic wallet consolidation in July 2024](https://x.com/arkham/status/1951729798285340956).

  

LuBian's digital SOS signals bounced around the blockchain like cosmic background radiation - permanent evidence of their desperation, visible to anyone who cared to look.

  

**Except nobody was looking. Nobody was even asking questions.**

  

_When your last resort is writing messages on the blockchain hoping your thief has a conscience, maybe it's time to admit your security model was fundamentally broken?_  
  
### The Ghost Whale

  

_Five years later, most of the stolen 127,426 Bitcoin remain largely dormant, [linked across over 2,200 addresses in LuBian's compromised wallets](https://research.blockscope.co/august-2025-lubian-hack/) and the attacker's network [according to Blockscope's forensic analysis](https://research.blockscope.co/august-2025-lubian-hack/)._

  

**No mixing. No tumbling. No complex laundering schemes. Just minimal activity indicative of strategic, long-term storage.**

  

The last significant activity was observed in 2024, characterized by funds consolidation, [showcasing classic consolidation patterns spanning from 2020 to 2025](https://research.blockscope.co/august-2025-lubian-hack/).

  

They're now [one of the top 15 largest Bitcoin holders on the planet](https://www.ccn.com/education/crypto/14-billion-bitcoin-heist-lubian-wallet-flaw-arkham/). Above Mt. Gox. Above most nation-states.[](https://www.ccn.com/education/crypto/14-billion-bitcoin-heist-lubian-wallet-flaw-arkham/)

  

[One out of every 125 Bitcoin in existence belongs to someone who cracked LuBian's laughable entropy](https://www.ccn.com/education/crypto/14-billion-bitcoin-heist-lubian-wallet-flaw-arkham/) with what amounts to digital lock-picking.

  

_The restraint is almost admirable. While everyone else capitulates at the first sign of red, this ghost has diamond hands forged in pure criminality._

  

**They've watched their stolen stash grow from $3.5 billion to $14.8 billion without flinching.**

  

Maybe they can't cash out without triggering every blockchain analyst on Earth.

  

Maybe they're waiting for the statute of limitations to expire.

  

Maybe they genuinely believe Bitcoin is going to a million and they're playing the ultimate long game.

  

**Or maybe they're dead, and $14.8 billion is locked away forever because someone forgot to write down their seed phrase.**

  

_If the world's most successful Bitcoin thief turns out to be the ultimate hodler, what does that say about the rest of us paper hands?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)







_LuBian's collapse exposed crypto's dirtiest secret: nobody's actually watching the watchers._

  
**$14.8 billion vanished without a single regulatory filing.**  
  
No exchange froze suspicious transactions. No mining pool association issued warnings. No government agency launched an investigation.  
  
The infrastructure supposed to protect users from exactly this kind of catastrophe was either asleep at the wheel or never existed in the first place.  
  
December 2020: [Bitcoin's market cap sat at $436 billion](https://coinmarketcap.com/historical/20201220/). LuBian's $3.5 billion theft represented nearly 0.8% of Bitcoin's entire existence.  
  
_For context, back then even a $50 million hack could send the whole market into cardiac arrest - LuBian lost 70 times that amount and nobody noticed._

**August 2025: Bitcoin's market cap towers above $2 trillion.**  
  
One of the largest crypto heists ever gets exposed - and the market barely flinches.

We didn't just grow up - we got numb.  
  
When billion-dollar thefts become Tuesday morning news, did we build something stronger or just something too dead inside to feel the pain?

_[Arkham cracked the case](https://x.com/arkham/status/1951729790299394113) not through official channels, but by doing what everyone should have done years ago - actually looking at the blockchain data._  
  
**Every transaction was public. Every wallet movement was recorded.**  
  
The evidence sat there for half a decade waiting for someone to care enough to connect the dots.  
  

Meanwhile, [Trust Wallet got rekt by the same 32-bit entropy flaw](https://www.ledger.com/blog/funds-of-every-wallet-created-with-the-trust-wallet-browser-extension-could-have-been-stolen).  
  
_[The "Milk Sad" vulnerability that devastated Libbitcoin Explorer](https://milksad.info/disclosure.html) showed that LuBian wasn't alone - entire segments of crypto infrastructure were built on cryptographic foundations made of wet cardboard._

  
**But here's the kicker: [LuBian still holds 11,886 Bitcoin worth $1.38 billion](https://coinmarketcap.com/academy/article/bitcoin-news-arkham-intelligence-exposes-dollar145-billion-bitcoin-theft-from-chinese-mining-pool-lubian).**  
  
They survived their own catastrophic security failure better than most protocols survive a weekend exploit.  
  
The founders vanished, but the Bitcoin remains - a testament to the difference between operational incompetence and exit scam planning.  
  

The biggest heist in crypto history wasn't sophisticated. It wasn't innovative. It was 32 bits of broken math that nobody bothered to audit properly.  
  

**When basic entropy generation can cost more than most countries' GDP, maybe it's time to stop pretending this industry has grown up.**  
  

_How many other LuBians are out there right now, one brute-force attack away from making history?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
