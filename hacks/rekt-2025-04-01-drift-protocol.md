---
tags:
  - blockchain/bitcoin
  - blockchain/ethereum
  - blockchain/solana
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/multisig
  - sector/oracle
  - sector/privacy
  - sector/stable
  - sector/token
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - precondition/insider
title: "Drift Protocol - Rekt"
protocol: "[[Drift Protocol]]"
date: 2025-04-01
loss_usd: 285000000
auditors:
source: "https://rekt.news/drift-protocol-rekt"
excerpt: "DPRK hackers spent 6 months sending proxies to befriend Drift Protocol. Conferences, trust, $1 million deposited. $285 million later, those friends vanished. No code broken. No bug found. Just a six-m"
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
  - "[[timelock-timestamp-bypass]]"
---
# Drift Protocol - Rekt

> **Loss:** $285,000,000 | **Date:** 2025-04-01 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/drift-protocol-rekt-header.png)

_Credit: [DLNews](https://www.dlnews.com/articles/defi/drift-protocol-investigating-potential-270-million-hack/), [Drift Protocol](https://x.com/DriftProtocol/status/2039404931778535427), [DefiLlama](https://defillama.com/protocol/drift?fees=false&events=false), [Mert](https://x.com/mert/status/2039391215284519045), [Vladimir S.](https://x.com/officer_secret/status/2039396007604006935), [Peckshield](https://x.com/peckshield/status/2039397378931786181), [Arkham Intelligence](https://x.com/arkham/status/2039585047809085602), [Lookonchain](https://x.com/lookonchain/status/2039614071704797489?s=20), [Unchained](https://unchainedcrypto.com/drift-protocol-suffers-285-million-exploit-after-admin-key-compromise-and-oracle-manipulation-unchained/), [CCN](https://www.ccn.com/news/crypto/drift-protocol-285m-biggest-hack-2026-april-fools-day/), [CoinTelegraph](https://cointelegraph.com/news/drift-280-million-hack-questions-circle-response), [Andrew Hong](https://gist.github.com/andrewhong5297/512c55864505f0c6caaece9e9b07b7c3), [QuillAudits](https://www.quillaudits.com/blog/hack-analysis/drift-protocol-multisig-exploit), [wublock](https://wublock.substack.com/p/drift-loses-285-million-did-hackers), [ZachXBT](https://x.com/zachxbt/status/2039566991858794981), [Specter](https://x.com/SpecterAnalyst/status/2039520561886318718?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E2039520561886318718%7Ctwgr%5Ebcbacc585e0c39775dd6585f1eaa1239f9d50134%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fbeincrypto.com%2Fzachxbt-circle-usdc-drift-hack-criticism%2F), [Temmy](https://x.com/Only1temmy/status/2039597809788424677), [TheBlock](https://www.theblock.co/post/396183/drift-280m-exploit-zachxbt-circle), [molu](https://x.com/molusol/status/2039454934823800839), [Fabiano](https://x.com/fabianosolana/status/2039657017825017970?s=52&t=CwvE47heqMMRKEsuVYOjuQ), [Omer Goldberg](https://x.com/omeragoldberg/status/2039455317201707100), [Hayden Adams](https://x.com/haydenzadams/status/2039560830862164329), [Cube Exchange](https://www.cube.exchange/blog/newsletter/security-briefing/security-briefing/2026-04-01--drift-hack), [BleepingComputer](https://www.bleepingcomputer.com/news/security/drift-280m-crypto-theft-linked-to-6-month-in-person-operation/), [Halborn](https://www.halborn.com/blog/post/explained-the-radiant-capital-hack-october-2024), [Tayvano](https://x.com/tayvano_/status/2040664577168547920), [Ariel Givner](https://x.com/GivnerAriel/status/2040807239259128209), [CoinDesk](https://www.coindesk.com/business/2026/04/02/north-koreans-hackers-likely-behind-the-usd286-million-drift-protocol-exploit-elliptic), [The Hacker News](https://thehackernews.com/2026/04/drift-loses-285-million-in-durable.html), [Mitchell Amador](https://x.com/MitchellAmador/status/2036532448461279269), [TRM](https://www.trmlabs.com/resources/blog/the-bybit-hack-following-north-koreas-largest-exploit), [Blockworks](https://blockworks.com/news/fbi-says-north-korea-behind-625m-ronin-hack), [Chainalysis](https://www.chainalysis.com/blog/lessons-from-the-drift-hack/), [Patrick Collins](https://www.youtube.com/watch?v=qjJN5S7PSoE)_  
  
**[Mert saw it first](https://x.com/mert/status/2039391215284519045).**

  

**On the morning of April 1st, the CEO of Helius, one of Solana's most critical infrastructure providers, [posted a hedge that no one in DeFi ever wants to read](https://x.com/mert/status/2039391990073176258):** "Not 100% fully certain yet, but it seems drift might be getting exploited."

  

Minutes earlier, [he had already flagged the situation to Circle directly](https://x.com/mert/status/2039391215284519045), urging someone to reach out "asap" over what he called a "high likelihood of a potentially large exploit."  
  
Circle did not respond publicly.

  

_**Twenty minutes later, [Vladimir S. had the numbers](https://x.com/officer_secret/status/2039396007604006935):**  [Two addresses](https://x.com/officer_secret/status/2039398719091531795), [roughly $200 million in SOL already moved](https://x.com/officer_secret/status/2039396750880903510), and a note that [the exploit had been running quietly for a week](https://x.com/officer_secret/status/2039436523112710509)._

  

**[PeckShield sent Drift a public nudge](https://x.com/peckshield/status/2039397378931786181) after that.**  
  

[Drift's official acknowledgement](https://x.com/DriftProtocol/status/2039404931778535427) came nearly an hour after the first public alarm.

  

"We are observing unusual activity on the protocol. We are currently investigating. Please do not deposit funds into the protocol while we investigate. This is not an April Fools joke."

  

That last line had to be written. April 1st meant the first wave of users who saw the warning assumed it was a bit.  
  

**Shortly after that first acknowledgment, [Drift confirmed an active attack](https://x.com/DriftProtocol/status/2039417136729227425), suspended deposits and withdrawals, and announced coordination with "multiple security firms, bridges, and exchanges."**  
  
They repeated the line again, "[this is not an April Fools joke](https://x.com/DriftProtocol/status/2039417136729227425)", as if repetition might make people take it seriously this time.

  

By then, [Arkham Intelligence had tracked over $268 million moving from Drift's vault to an interim wallet](https://x.com/arkham/status/2039585047809085602).  
  
**Attacker’s Address on Arkham:**  
[98e28143-3e15-4e2a-8527-f30d4c7c11aa](https://intel.arkm.com/explorer/entity/98e28143-3e15-4e2a-8527-f30d4c7c11aa)

[The vault's balance had collapsed from $309 million to $41 million](https://cryip.co/drift-protocol-hack-solana-defi-exploit-ethereum-eth-bridging/). Then lower. [Currently sitting just south of $8 million](https://intel.arkm.com/explorer/address/JCNCMFXo5M5qwUPg2Utu1u6YWp3MbygxqBsBeXXJfrw).

  

**The attacker, meanwhile, [was already converting to ETH](https://x.com/lookonchain/status/2039614071704797489?s=20).**

  

_If the first public warning came an hour before Drift confirmed anything, and the drain was already finished by then, what exactly was the monitoring infrastructure watching?_  
  
### Not an Overnight Operation

  
_The attack didn't start on April 1st. It started on March 23rd. April 1st was just when it finished._

  

**[The attack had three moving parts](https://x.com/DriftProtocol/status/2039564444510846997), each one useless without the others, each one assembled in plain sight over the course of ten days.**  
  
Understanding how it worked means understanding all three, because this wasn't a hack. It was a setup.

  

**Part One: The Fake Token.**  
  
_[On March 12th](https://www.chainalysis.com/blog/lessons-from-the-drift-hack/), three weeks before the drain, [the attacker created a token on Solana called the CarbonVote Token, CVT](https://x.com/officer_secret/status/2039405837144445183)._  
  
**CVT token on Dex Screener:**  
[dqcs7ezc6nc4ju6hcvvamkmnwzdxigtkggdjqpm4zgbl](https://dexscreener.com/solana/dqcs7ezc6nc4ju6hcvvamkmnwzdxigtkggdjqpm4zgbl)

They [minted 750 million units for $1.19](https://solscan.io/tx/2UnWSA4VnAjoPVUzg9VRKcVhDNwKq1LwZUGX3A6rrEPewrPksbUvgbH3AdzsHSwLPiJJcbns1Kb9hGABKhW8tMfK), then [seeded a Raydium liquidity pool with $500](https://unchainedcrypto.com/drift-protocol-suffers-285-million-exploit-after-admin-key-compromise-and-oracle-manipulation-unchained/).  
  
[Then they wash-traded it between their own wallets](https://www.ccn.com/news/crypto/drift-protocol-285m-biggest-hack-2026-april-fools-day/), back and forth, day after day, building a price history that sat near $1 per token.  
  
_The price was fed to Drift by [an oracle the attacker themselves had deployed and controlled](https://www.chainalysis.com/blog/lessons-from-the-drift-hack/)._  
  
**By the time the attack fired, [CVT had a credible, weeks-long price record](https://wublock.substack.com/p/drift-loses-285-million-did-hackers). The oracle wasn't fooled. It was theirs.**  
  

**CVT mint address:**
[G84LEhbNMR1yYbHgHbnNYNSK8mpTKcazh5jcW5yMPQKo](https://solscan.io/token/G84LEhbNMR1yYbHgHbnNYNSK8mpTKcazh5jcW5yMPQKo)

  
_$501.19 That was the seed money for a $285 million theft._

**Part Two: The Durable Nonce.**

_Solana has a feature called a durable nonce. It lets users pre-sign a transaction and hold it, bypassing the normal short expiry window, for execution at any future point. It's a legitimate tool, built for multisig workflows and offline signing._ 
  
[The attacker turned it into a time-delayed detonator.](https://cointelegraph.com/news/drift-280-million-hack-questions-circle-response)

On March 23rd, [four durable nonce accounts were created](https://x.com/DriftProtocol/status/2039564444510846997). Two were controlled by the attacker. Two were linked to legitimate members of Drift's Security Council multisig.

**Multisig member nonce accounts:**
[45cZ5Fj97Va5Abipr6NN8Zf1BqZqWneSek1hU5cQRvhw](https://solscan.io/account/45cZ5Fj97Va5Abipr6NN8Zf1BqZqWneSek1hU5cQRvhw) [39JyWrdbVdRqjzw9yyEjxNtTbTKcTPLdtdCgbz7C7Aq8](https://solscan.io/account/39JyWrdbVdRqjzw9yyEjxNtTbTKcTPLdtdCgbz7C7Aq8)

**Attacker-controlled nonce accounts:** [CZRBcHAvXU6TzzjGuG4rT98UuTR7PBUeSGPZRDW5mfYW](https://solscan.io/account/CZRBcHAvXU6TzzjGuG4rT98UuTR7PBUeSGPZRDW5mfYW) [48cV6Mw5Y5afT8ofukvtFaMtrsCohHhsv8MfbdW8agh3](https://solscan.io/account/48cV6Mw5Y5afT8ofukvtFaMtrsCohHhsv8MfbdW8agh3)

_In the days following the nonce setup, [Drift executed a planned Security Council migration](https://www.quillaudits.com/blog/hack-analysis/drift-protocol-multisig-exploit), replacing four of five signers and [lowering the signing threshold from 3-of-5 to 2-of-5](https://gist.github.com/andrewhong5297/512c55864505f0c6caaece9e9b07b7c3)._ 
  
**The attacker didn't miss a beat. Within days of the new multisig going live, they had already [obtained a pre-signed nonce from one of the replacement signers](https://x.com/DriftProtocol/status/2039564441256083878).**  
  
**New multisig member nonce account:**
[6UJbu9ut5VAsFYQFgPEa5xPfoyF5bB5oi4EknFPvu924](https://solscan.io/account/6UJbu9ut5VAsFYQFgPEa5xPfoyF5bB5oi4EknFPvu924)

The multisig was seven days old. The attacker already had two of the five keys.

**Part Three: The Social Engineering.**

_What the on-chain record showed was the final act. The full picture took another week to emerge._

**For the durable nonce setup to work, legitimate multisig signers had to pre-sign transactions they didn't fully understand.**

[Drift's own statement calls it](https://x.com/DriftProtocol/status/2039564448956858642) "targeted social engineering or transaction misrepresentation." The signers approved something. They just didn't know what they were actually approving.

One detail stands out. On March 25th, [Drift hosted "Liquid Hours NYC"](https://luma.com/yshbx8q2), a happy hour event during DAS NYC, [co-sponsored with AWS and Failsafe](https://luma.com/yshbx8q2).  
  
The [attacker's first funding transactions arrived roughly twelve hours before](https://x.com/officer_secret/status/2039444135376015711) that event started.  
  
**Whether that timing means anything remains unconfirmed.**

_**[What is confirmed](https://x.com/officer_secret/status/2039418752228548828):** the attacker funded the entire operation from Tornado Cash three weeks prior, 10 ETH bridged from Ethereum to Solana via LiFi and NEAR intents, then dispersed across wallets in the lead-up to April 1st._

**Origin transaction:** [0x14cd918f2c1ffcd9a96f9d2ccd1988469fd246a3ed4e3565d2fa5b5b91238ba1](https://etherscan.io/tx/0x14cd918f2c1ffcd9a96f9d2ccd1988469fd246a3ed4e3565d2fa5b5b91238ba1)

**One footnote worth noting:** [Neodyme's 2024 security audit of Drift](https://cdn.prod.website-files.com/6310e7dee49f0866da8eed4c/6686bbdfe7c6e5a997cc51bc_Neodyme%20-%20Drift%20Security%20Audit.pdf) explicitly reviewed the protocol's authority structure, including the admin's ability to initialize markets and update parameters.  
  
According to [Vladimir S. who reviewed the report post-hack](https://x.com/officer_secret/status/2039409295075226021), that architecture was not classified as a critical, medium, or low severity issue. It appears to have been treated as an acceptable assumption within the protocol's trust model.

**No audit catches a compromised private key. But someone had looked directly at this door, decided it was fine, and moved on.**

  

_If the attack was never going to show up in a code review, what governance structure could have stopped it before two signatures handed over $285 million?_  
  
### 128 Seconds

  
_The setup took patience. The execution took less time than it takes to read this paragraph._  
  
**One minute after Drift executed a [routine test withdrawal from its own insurance fund](https://solscan.io/tx/BkUZ8nss1api3b4sFUDZAU81k2R2Y6SB4J77GF14UPrCeYGfRFaay1StPpwGTL86d1kJArWhiNi8xdAfR1AeVb6) on the afternoon of April 1st, the pre-signed nonce transactions fired.**

Two transactions. Four slots apart. Admin transferred.

**Create + approve malicious admin transfer:** [2HvMSgDEfKhNryYZKhjowrBY55rUx5MWtcWkG9hqxZCFBaTiahPwfynP1dxBSRk9s5UTVc8LFeS4Btvkm9pc2C4H](https://solscan.io/tx/2HvMSgDEfKhNryYZKhjowrBY55rUx5MWtcWkG9hqxZCFBaTiahPwfynP1dxBSRk9s5UTVc8LFeS4Btvkm9pc2C4H)

**Approve + execute malicious admin transfer:** [4BKBmAJn6TdsENij7CsVbyMVLJU1tX27nfrMM1zgKv1bs2KJy6Am2NqdA3nJm4g9C6eC64UAf5sNs974ygB9RsN1](https://solscan.io/tx/4BKBmAJn6TdsENij7CsVbyMVLJU1tX27nfrMM1zgKv1bs2KJy6Am2NqdA3nJm4g9C6eC64UAf5sNs974ygB9RsN1)

With that, [Drift's State account had a new owner](https://x.com/officer_secret/status/2039436523112710509).

**Attacker owned Drift's State account:** [5zpq7DvB6UdFFvpmBPspGPNfUGoBRRCE2HHg5u3gxcsN](https://solscan.io/account/5zpq7DvB6UdFFvpmBPspGPNfUGoBRRCE2HHg5u3gxcsN)

_[In the same slot](https://x.com/officer_secret/status/2039405837144445183), whoever now controlled that key acted immediately. [A new collateral market was created for CVT](https://dexscreener.com/solana/dqcs7ezc6nc4ju6hcvvamkmnwzdxigtkggdjqpm4zgbl) with maximal permissive parameters, and updateWithdrawGuardThreshold() was called across five markets, [raising withdrawal caps to 500,000,000,000,000 across the board](https://solscan.io/tx/4a5962Rdqd9pkXtk9DMQ9ZYhdGb2k9gPw71GvukJgELhxbCY5gm1c1hhKdwuGefyqJ3XMvihUTDNDn3qbXnst82X). Every safety limit, effectively gone._

**What followed took [128 seconds](https://github.com/DK27ss/Drift-480M-PoC).**

At the 25-second mark, [the attacker initialized a Drift user account](https://github.com/DK27ss/Drift-480M-PoC) under their own key. Three seconds later, [they deposited 500 million CVT](https://solscan.io/tx/5V72ZK1WejP5Mh3uryEy6BZCV6ukSAnZBFSvHTqfD4NS38xKJUuh4RV5F8D4tDbgMsB2dcTJyZf7hLxH34nCRHRE) into spot market [index 63](https://github.com/DK27ss/Drift-480M-PoC), the collateral market the compromised admin key had created moments earlier with permissive parameters.

[The deposit cost them essentially nothing](https://github.com/DK27ss/Drift-480M-PoC). CVT had negligible real market value, [but the permissive collateral weights set by the attacker allowed them to borrow against it as if it were worth far more.](https://github.com/DK27ss/Drift-480M-PoC)

**CVT deposit transaction:** [5V72ZK1WejP5Mh3uryEy6BZCV6ukSAnZBFSvHTqfD4NS38xKJUuh4RV5F8D4tDbgMsB2dcTJyZf7hLxH34nCRHRE](https://solscan.io/tx/5V72ZK1WejP5Mh3uryEy6BZCV6ukSAnZBFSvHTqfD4NS38xKJUuh4RV5F8D4tDbgMsB2dcTJyZf7hLxH34nCRHRE)

**Then the withdrawals began. Starting at the 30-second mark, [18 tokens drained across multiple vaults](https://www.quillaudits.com/blog/hack-analysis/drift-protocol-multisig-exploit):**

_**JLP:** 42.72M tokens - $159,350,000_  
_**USDC:** 71.42M USDC - $71,420,000_  
_**cbBTC:** ~164.35 BTC - $11,290,000_  
_**USDT:** 5.65M USDT - $5,650,000_  
_**USDS:** 5.25M USDS - $5,250,000_  
_**WETH:** 2,200.59 WETH - $4,690,000_  
_**dSOL:** 45,292.21 dSOL - $4,470,000_  
_**WBTC:** 63.47 WBTC - $4,360,000_  
_**Fartcoin:** 23.37M - $4,110,000_  
_**JitoSOL:** 33,976.51 JitoSOL - $3,600,000_  
_**syrupUSDC:** 2.87M - $3,320,000_  
_**INF:** 21,241.62 - $2,500,000_  
_**mSOL:** 17,418.92 mSOL - $1,990,000_  
_**bSOL:** 9,474.33 bSOL - $1,020,000_  
_**EURC:** 583,980.69 - $677,420_  
_**zBTC:** 8.61 - $586,790_  
_**USDY:** 477,375.42 - $539,430_  
_**JUP:** 2.62M - $431,440_

**[Confirmed total](https://www.quillaudits.com/blog/hack-analysis/drift-protocol-multisig-exploit):** $285.26M

[The JLP vault went first](https://www.quillaudits.com/blog/hack-analysis/drift-protocol-multisig-exploit), $159 million, the single largest position. [cbBTC was left with ~ .16 of a bitcoin.](https://github.com/DK27ss/Drift-480M-PoC) By the time the final withdrawal closed at the [128-second mark](https://github.com/DK27ss/Drift-480M-PoC), the vaults were stripped significantly.

**Executor wallet (deposit + withdrawal cascade):** [55udxhScWQxM7cC9d1NPBQoEDC7B38w81EWKPZsM7ZCW](https://solscan.io/account/55udxhScWQxM7cC9d1NPBQoEDC7B38w81EWKPZsM7ZCW)

**Primary receiving wallet (stolen tokens):** [HkGz4KmoZ7Zmk7HN6ndJ31UJ1qZ2qgwQxgVqQwovpZES](https://solscan.io/account/HkGz4KmoZ7Zmk7HN6ndJ31UJ1qZ2qgwQxgVqQwovpZES)

**Secondary consolidation wallet:**
[8ubo4HbWJHKyFJYJc2Gh74dxCP7bN7Fu2Pi13KZ9rGxw](https://solscan.io/account/8ubo4HbWJHKyFJYJc2Gh74dxCP7bN7Fu2Pi13KZ9rGxw)

[From there, the exit was methodical.](https://www.quillaudits.com/blog/hack-analysis/drift-protocol-multisig-exploit) Some stolen assets were routed through Jupiter on Solana, swapped into USDC, WSOL, WBTC, and WETH, then bridged to Ethereum via Circle's Cross-Chain Transfer Protocol [across more than 100 transactions over six hours](https://x.com/zachxbt/status/2039566991858794981).  
  
**[SOL took a different route](https://x.com/zachxbt/status/2039602706797801726):** Bridged to Ethereum via Chainflip, fragmenting the trail across platforms.

**Chainflip destination address:**
[0xd91a122b585bc588c9a48d0995ee0d7b4f8ab7dd](https://etherscan.io/address/0xd91a122b585bc588c9a48d0995ee0d7b4f8ab7dd)

On Ethereum, the attacker [consolidated stolen funds into ETH across four receiving addresses](https://www.quillaudits.com/blog/hack-analysis/drift-protocol-multisig-exploit).

**Attacker EOAs on Ethereum:**
[0xD3FEEd5DA83D8e8c449d6CB96ff1eb06ED1cF6C7](https://etherscan.io/address/0xD3FEEd5DA83D8e8c449d6CB96ff1eb06ED1cF6C7) [0xAa843eD65C1f061F111B5289169731351c5e57C1](https://etherscan.io/address/0xAa843eD65C1f061F111B5289169731351c5e57C1) [0xbDdAE987FEe930910fCC5aa403D5688fB440561B](https://etherscan.io/address/0xbDdAE987FEe930910fCC5aa403D5688fB440561B)[0x0FE3b6908318B1F630daa5B31B49a15fC5F6B674](https://etherscan.io/address/0x0FE3b6908318B1F630daa5B31B49a15fC5F6B674)

Three weeks of preparation. One minute of admin access. A hundred and twenty-eight seconds to empty the vaults. Then six hours of bridging, in broad daylight, during US business hours, while the stolen USDC moved freely through Circle's own infrastructure.

  
**Nobody stopped it.**

  
_Over $230 million in USDC crossed Circle's own bridge in plain sight for six hours, so why did it take a public callout on Twitter to make anyone ask where Circle was?_  
  
### While You Were Sleeping  
  
_[Six hours.](https://x.com/zachxbt/status/2039566991858794981) That's how long $230 million in stolen USDC spent moving through Circle's own Cross-Chain Transfer Protocol, burning on Solana, minting on Ethereum, across more than 100 transactions, during US business hours, on a Tuesday afternoon._

**Circle did not freeze a dollar of it.**

**[ZachXBT put it plainly](https://x.com/zachxbt/status/2039496650906034602):** "Circle was asleep while many millions of USDC was swapped via CCTP from Solana to Ethereum for hours from the 9 figure Drift hack during US hours. Value was moved and nothing was done yet again."

[Onchain Investigator Specter added a detail](https://x.com/SpecterAnalyst/status/2039520561886318718?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E2039520561886318718%7Ctwgr%5Ebcbacc585e0c39775dd6585f1eaa1239f9d50134%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fbeincrypto.com%2Fzachxbt-circle-usdc-drift-hack-criticism%2F) that made the silence harder to excuse. The attacker had [parked the stolen USDC across multiple wallets for one to three hours before moving it](https://x.com/SpecterAnalyst/status/2039520561886318718?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E2039520561886318718%7Ctwgr%5Ebcbacc585e0c39775dd6585f1eaa1239f9d50134%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fbeincrypto.com%2Fzachxbt-circle-usdc-drift-hack-criticism%2F), sitting on it, waiting.  
  
_They also [made a deliberate choice not to convert to USDT during the bridging process](https://x.com/SpecterAnalyst/status/2039520561886318718?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E2039520561886318718%7Ctwgr%5Ebcbacc585e0c39775dd6585f1eaa1239f9d50134%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fbeincrypto.com%2Fzachxbt-circle-usdc-drift-hack-criticism%2F). They chose USDC specifically, and they held it patiently, [apparently confident that Circle would not act](https://x.com/SpecterAnalyst/status/2039520561886318718?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E2039520561886318718%7Ctwgr%5Ebcbacc585e0c39775dd6585f1eaa1239f9d50134%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fbeincrypto.com%2Fzachxbt-circle-usdc-drift-hack-criticism%2F)._

**They were right.**

What made the inaction land differently was the timing. [Nine days earlier, Circle had frozen USDC across 16 unrelated business hot wallets](https://x.com/Only1temmy/status/2039597809788424677), exchanges, casinos, forex firms, a DFINITY bridge contract with thousands of users behind it, as part of a sealed US civil lawsuit. No public explanation. No advance warning.[](https://x.com/Only1temmy/status/2039597809788424677)

One wallet, belonging to Goated.com, [was quietly unfrozen three days later. Most remained locked as of April 2nd.](https://x.com/Only1temmy/status/2039597809788424677)

ZachXBT had already [called the freeze "incompetent"](https://x.com/zachxbt/status/2039496650906034602), noting the wallets were still being slowly unfrozen.  
  
_Now, nine days later, the same infrastructure watched a confirmed nine-figure theft move through it in real time._

**[Circle has not publicly responded](https://www.theblock.co/post/396183/drift-280m-exploit-zachxbt-circle) to the criticism.**  
  
Are they just being Circle Jerks?

**[molu framed the structural problem cleanly](https://x.com/molusol/status/2039454934823800839):** "Circle could freeze it. But they're not required to."  
  
That's the gap, between capability and obligation, that the Drift hack forced into the open. [Proposed regulatory frameworks like the GENIUS Act could eventually change that calculus](https://x.com/molusol/status/2039454934823800839), but as of April 1st, no rule required Circle to move. So they didn't.

The USDC debate was the loudest secondary story, but it wasn't the only fallout.  
  
[At least 20 protocols reported disruptions, pauses, or losses](https://www.chainalysis.com/blog/lessons-from-the-drift-hack/), with several pausing deposits, withdrawals, or key features while assessing exposure.  
  
The day after the exploit, [a multisig comparison began making the rounds](https://x.com/fabianosolana/status/2039657017825017970?s=52&t=CwvE47heqMMRKEsuVYOjuQ).[  
  
_[Drift's 2/5 multisig with zero timelock](https://x.com/fabianosolana/status/2039657017825017970?s=52&t=CwvE47heqMMRKEsuVYOjuQ) meant any two signers could authorize instant, irreversible admin-level changes, no delay, no review window, no circuit breaker.[  
](https://x.com/fabianosolana/status/2039657017825017970?s=52&t=CwvE47heqMMRKEsuVYOjuQ)_
  
**[Fabiano,](https://x.com/fabianosolana/status/2039657017825017970?s=52&t=CwvE47heqMMRKEsuVYOjuQ) mapped out [where Drift sat relative to its peers](https://x.com/fabianosolana/status/2039657017825017970?s=52&t=CwvE47heqMMRKEsuVYOjuQ):**

_**Jupiter Lend:** 4/7 multisig, 12 hour timelock_  
_**Kamino:** 5/10 multisig, 12 hour timelock_  
_**Solstice:** 3/5 multisig, 1 day timelock_  
_**Loopscale:** 3/5 multisig, not listed_  
_**Exponent:** 2/3 multisig, not listed_  
_**Drift:** 2/5 multisig, no timelock_

*[Chaos Labs founder Omer Goldberg laid out the structural failure:](https://x.com/omeragoldberg/status/2039455317201707100)** "The protocol's signer key had full control over market creation, oracle assignment, withdrawal limits. There was no time lock, no multisig, and no delays." The full sequence, [he noted, took less than 15 seconds](https://x.com/omeragoldberg/status/2039455335858012435).

**[Uniswap founder Hayden Adams went further](https://x.com/haydenzadams/status/2039560830862164329):** "We have to stop letting centralized things call themselves DeFi. Admin key can drain all funds? CeFi. Otherwise DeFi means nothing and it’s brand is destroyed."

**[Cube Exchange put the longer arc into words](https://www.cube.exchange/blog/newsletter/security-briefing/security-briefing/2026-04-01--drift-hack):** "The threat model FTX made obvious, custodial risk, concentrated authority, opaque internal controls, did not disappear when the industry switched from CeFi to DeFi. It just moved from a CEO's discretion to an admin key's permissions."  
  
**Every chain is only as strong as its weakest link. At Drift, that link was two signatures and no timelock.**

_Was this an acceptable security model for a protocol that lost $285 million in user funds?_  
  
### The Long Con  
  

_Everything we knew about this attack last week was wrong, not in the details, but in the scale._

**[Ten days of setup](https://x.com/DriftProtocol/status/2039564444510846997). That's what the on-chain record showed.**

[Initial nonce setup March 23rd](https://x.com/DriftProtocol/status/2039564444510846997), [](https://gist.github.com/andrewhong5297/512c55864505f0c6caaece9e9b07b7c3) a [multisig migration days later](https://gist.github.com/andrewhong5297/512c55864505f0c6caaece9e9b07b7c3), [](https://x.com/DriftProtocol/status/2039564446238953939) execution [on April 1st](https://x.com/DriftProtocol/status/2039564446238953939). Tidy. Traceable. A ten-day window that felt like a long time for a crypto exploit.

Except, the set up wasn't ten days. It was six months.

On April 4th, [Drift published its Incident Background Update](https://x.com/DriftProtocol/status/2040611161121370409). What it described wasn't a hack. It was a structured intelligence operation, the kind that requires organizational backing, significant resources, and the patience of people who are very, very good at being someone else.

_[It started at a conference.](https://x.com/DriftProtocol/status/2040611161121370409) Around October 2025, a group posing as a quantitative trading firm approached Drift contributors at a major crypto event, expressing interest in integrating with the protocol._  
  
**[They were technically fluent](https://x.com/DriftProtocol/status/2040611161121370409). They had verifiable professional backgrounds. They knew how Drift worked. They [set up a Telegram group upon the first meeting](https://x.com/DriftProtocol/status/2040611161121370409) and stayed in it.**

[Over the following months, they kept showing up](https://x.com/DriftProtocol/status/2040611161121370409), at conferences, at industry events, across multiple countries. They weren't strangers sending cold DMs. They were colleagues. People Drift contributors had met in person, worked through sessions with, [built what felt like a normal professional relationship with over nearly half a year](https://x.com/DriftProtocol/status/2040611161121370409).

[Between December 2025 and January 2026](https://x.com/DriftProtocol/status/2040611161121370409), the group went further. They [onboarded an Ecosystem Vault on Drift](https://www.theblock.co/post/396361/drift-links-280-million-exploit-to-six-month-social-engineering-op-run-by-suspected-north-korean-actors), which required filling out strategy documentation and engaging with contributors directly.  
  
They [deposited over $1 million of their own capital](https://www.theblock.co/post/396361/drift-links-280-million-exploit-to-six-month-social-engineering-op-run-by-suspected-north-korean-actors). They participated in working sessions. They asked detailed, informed product questions. They did everything a legitimate trading firm integrating with a DeFi protocol would do.

_By February and March 2026, [these were not strangers](https://x.com/DriftProtocol/status/2040611161121370409), they were people Drift contributors had worked with and met in person._

**Then came the tools. As integration conversations deepened, [the group began sharing links, repositories, and applications](https://x.com/DriftProtocol/status/2040611161121370409), described as frontend deployments for their vault, a wallet product still in testing.**  
  
One contributor may have cloned a code repository the group shared. Another may have downloaded a [TestFlight application](https://www.coindesk.com/markets/2026/04/05/drift-says-usd270-million-exploit-was-a-six-month-north-korean-intelligence-operation) the group presented as their wallet product. [Drift has not confirmed with certainty which vector succeeded](https://x.com/DriftProtocol/status/2040611161121370409), both remain under active forensic investigation.

For the repository vector, [Drift pointed to a known vulnerability in VSCode and Cursor](https://x.com/DriftProtocol/status/2040611161121370409), two of the most widely used code editors in software development, that the security community had been flagging since late 2025.  
  
The flaw required no clicks, no permissions dialog, no warning of any kind. [Simply opening a file or folder was enough to silently execute arbitrary code on the contributor's device.](https://x.com/DriftProtocol/status/2040611161121370409)

_**Once inside those devices, the attackers had what they needed:** [Access to the signing workflows that would let them obtain](https://x.com/DriftProtocol/status/2040611161121370409) multisig pre-approvals. The [durable nonce accounts, the pre-signed transactions, the whole March 23rd setup](https://gist.github.com/andrewhong5297/512c55864505f0c6caaece9e9b07b7c3), all of it traces back to this. The on-chain story was chapter four of a six-chapter operation._

**[Immediately after the April 1st drain, the group scrubbed everything.](https://x.com/DriftProtocol/status/2040611161121370409) Telegram chats deleted. Malicious software wiped. The trading firm that had spent six months building a relationship with Drift contributors simply ceased to exist.**

[Drift, working with the SEAL 911 security team](https://x.com/DriftProtocol/status/2040611161121370409), assessed with medium-high confidence that the operation was carried out by UNC4736, [a North Korean state-affiliated group also tracked as AppleJeus or Citrine Sleet](https://x.com/DriftProtocol/status/2040611161121370409).  
  
The connection rests on both on-chain fund flows tracing back to the actors behind the [October 2024 Radiant Capital hack](https://cointelegraph.com/news/drift-protocol-exploit-preparation-preliminary-findings), and operational overlaps between personas used in this campaign and known DPRK-linked activity.

**[One detail Drift was careful to stress](https://x.com/DriftProtocol/status/2040611161121370409):** The individuals who appeared in person at conferences were not North Korean nationals.  
  
_[DPRK operations at this level deploy third-party intermediaries](https://x.com/DriftProtocol/status/2040611161121370409), people with fully constructed identities, employment histories, public-facing credentials, and professional networks built specifically to survive due diligence._  
  
**Non-Koreans, working for Koreans, running a con that took six months to pay off.**

[The playbook is not new.](https://www.bleepingcomputer.com/news/security/drift-280m-crypto-theft-linked-to-6-month-in-person-operation/) In October 2024, [Radiant Capital lost approximately $53 million](https://www.halborn.com/blog/post/explained-the-radiant-capital-hack-october-2024) after attackers posed as an ex-contractor and delivered malware through a ZIP file shared on Telegram.  
  
The Drift operation was the same logic at roughly six times the scale and six times the patience.

_**MetaMask developer and security researcher [Taylor Monahan didn't soften the wider implication](https://x.com/tayvano_/status/2040664577168547920):** "Lots of DPRK IT workers built the protocols you know and love, all the way back to DeFi summer."_  
  
**[She listed at least 40 DeFi platforms she believes have been infiltrated by North Korean IT workers at some stage](https://x.com/tayvano_/status/2040668973923189123). "The seven years of blockchain dev experience on their resume is not a lie," [she added](https://x.com/tayvano_/status/2040664577168547920), then warned that the depth of the Drift operation "[makes me think they already have multiple other teams on lock.](https://x.com/tayvano_/status/2040616103333040508)"**

**[ZachXBT drew a line between the threat types](https://x.com/zachxbt/status/2040666565503524932):** "Threats via job postings, LinkedIn, email, Zoom, or interviews are basic and in no way sophisticated, the only thing about it is they're relentless. If you or your team still falls for them in 2026, you're very likely negligent."

**[IP and Corporate Attorney Ariel Givner agreed](https://x.com/GivnerAriel/status/2040807239259128209), and went further:** “I can’t help but think we’re dealing with a civil negligence issue.”

**[Givner continued](https://x.com/GivnerAriel/status/2040807239259128209):** "In plain terms, they failed their basic duty to protect the money they were managing. You can’t just shrug, say “state hackers did it,” and leave users holding the bag. People trusted Drift with their funds… not with playing risky games against pro attackers.”

**With the Drift exploit [attributed to DPRK by Elliptic](https://www.coindesk.com/business/2026/04/02/north-koreans-hackers-likely-behind-the-usd286-million-drift-protocol-exploit-elliptic), [TRM Labs](https://thehackernews.com/2026/04/drift-loses-285-million-in-durable.html), and [Drift's own investigation](https://x.com/DriftProtocol/status/2040611161121370409), it would be the [eighteenth such operation Elliptic has tracked in 2026 alone](https://www.coindesk.com/business/2026/04/02/north-koreans-hackers-likely-behind-the-usd286-million-drift-protocol-exploit-elliptic), pushing North Korean crypto theft past $300 million for the year, before April was over.**

_If it took six months to rob Drift, how long have they already been inside the next one?_




![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Nobody broke Drift's code. They broke its people, and they had six months to do it properly._

**[$285 million left a protocol](https://www.quillaudits.com/blog/hack-analysis/drift-protocol-multisig-exploit) that looked bulletproof on paper - audited code, a seat at the Solana DeFi table. But, none of it mattered.**  
  
Not because a bug slipped through. Because what appears to be a state-sponsored intelligence operation with real capital, real identities, and real patience decided Drift was worth six months of their time. They were right.

[The attacker funded this entire operation](https://x.com/officer_secret/status/2039418752228548828) with [10 ETH from Tornado Cash](https://etherscan.io/tx/0x14cd918f2c1ffcd9a96f9d2ccd1988469fd246a3ed4e3565d2fa5b5b91238ba1). What they walked away with was the largest DeFi exploit of 2026, so far…  
  
At that return on investment, the only question is why they didn't start sooner.

_[Drift sent on-chain messages to the four wallets holding stolen funds](https://x.com/DriftProtocol/status/2039939068469870896), asking them to reach out through Blockscan.[](https://finance.yahoo.com/markets/crypto/articles/solana-drift-floats-airdrop-285-184611816.html)_

**No compensation plan has been published.**

[Drift is working with Asymmetric Research and OtterSec](https://x.com/DriftProtocol/status/2041574840524493091) on a coordinated recovery plan and will [participate in the Solana Foundation's STRIDE program](https://x.com/DriftProtocol/status/2041574840524493091).  
  
**On April 9th, [Drift posted an interim update](https://x.com/DriftProtocol/status/2042093972500177305):** “We recognize the impact this has had across our users and the builders who have integrated with us - many of whom rely on Drift as core infrastructure. We’re actively working on next steps and will share more once details are finalized.”  
  
**[Immunefi's data is unsparing](https://x.com/MitchellAmador/status/2036532448461279269):** 83% of native tokens from hacked protocols never recover to pre-hack prices. Not because the technology fails, but because trust, once broken at this scale, doesn't have a patch.  
  
_[Drift had already lost $1 billion in TVL since its October peak](https://defillama.com/protocol/drift?fees=false&events=false) before the attack landed. It has less runway than most and further to fall._

**[Bybit lost $1.5 billion](https://www.trmlabs.com/resources/blog/the-bybit-hack-following-north-koreas-largest-exploit) the same way.**  
  
[Ronin lost $625 million](https://blockworks.com/news/fbi-says-north-korea-behind-625m-ronin-hack) the same way.  
  
[Radiant Capital lost approximately $53 million](https://www.halborn.com/blog/post/explained-the-radiant-capital-hack-october-2024) as [a rehearsal for this](https://x.com/DriftProtocol/status/2040611161121370409).  
  
[North Korean hackers have stolen over $6.75 billion in crypto](https://www.coindesk.com/business/2025/12/18/north-korean-hackers-stole-a-record-usd2b-of-crypto-in-2025-chainalysis-says), and the pace is accelerating, not because the targets are getting easier, but because the operations are getting longer, more patient, and harder to see coming until they're already done.

_[Private key compromises accounted for 88% of all stolen crypto in Q1 2025](https://www.chainalysis.com/blog/crypto-hacking-stolen-funds-2026/). Social engineering is the entry point for almost every major theft in this industry. The industry has known this for years. It responds to each new incident with the same cycle: shock, postmortem, a few weeks of governance discussion, then back to building as if the next team won't be targeted the same way._

**[Patrick Collins called it the scariest hack of 2026](https://www.youtube.com/watch?v=qjJN5S7PSoE), scarier than Bybit, despite being a fraction of the size. Not because of the technical exploit.**  
  
**[Because of what it proved](https://www.youtube.com/watch?v=qjJN5S7PSoE):** "Meeting somebody in person isn't going to be the obstacle we historically thought it would be."  
  
If the industry's last line of defense against state-sponsored infiltration was a handshake and a conference badge, that line is already gone.

Somewhere out there, another protocol is running a 2-of-5 multisig with no timelock. Another contributor just accepted a GitHub invite from a technically fluent stranger they met at a conference. Another TestFlight link is sitting in a Telegram chat, waiting to be opened.

**North Korea didn't find a hole in DeFi's code. They found a hole in DeFi's culture.**

_How many more billion-dollar lessons does it take before that changes?_



![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
