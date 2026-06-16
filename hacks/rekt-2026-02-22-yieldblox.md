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
  - vuln/oracle/spot-price
  - novelty/known-pattern
title: "Yieldblox - Rekt"
protocol: "[[Yieldblox]]"
date: 2026-02-22
loss_usd: 10970000
auditors:
source: "https://rekt.news/yieldblox-rekt"
excerpt: "Oracle manipulation drained $10.97 million from Script3's YieldBlox pool on Blend V2. Attacker pumped illiquid collateral USTRY 100x on the Stellar DEX. The oracle reported the fake price as real."
genome:
  - "[[spot-price]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Yieldblox - Rekt

> **Loss:** $10,970,000 | **Date:** 2026-02-22 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/yieldblox-rekt-header.png)



_$10.97 million gone from YieldBlox's community-managed pool on Blend V2, and all it took was one trade in the [USTRY/USDC market](https://stellar.expert/explorer/public/contract/CCCCIQSDILITHMM7PBSLVDT5MISSY7R26MNZXCX4H7J5JQ5FPIYOGYFS) with less than $1 in hourly volume._  
  

**No novel bug, no smart-contract sorcery, just liquidity vaporized the old-fashioned way**.  
  
Someone found a collateral asset so thinly traded that [fewer than five tokens sat on the ask side of the order book](https://github.com/DK27ss/YieldBlox-10M-PoC), and they [pumped the price 100x with a single transaction](https://github.com/DK27ss/YieldBlox-10M-PoC).  
  
The [Reflector oracle dutifully reported the new price](https://x.com/DefimonAlerts/status/2025852404617371773). [Blend V2 dutifully accepted the collateral valuation](https://github.com/DK27ss/YieldBlox-10M-PoC). The attacker dutifully borrowed $10.97 million in [XLM](https://stellar.expert/explorer/public/tx/3e81a3f7b6e17cc22d0a1f33e9dcf90e5664b125b9e61f108b8d2f082f2d4657) and [USDC](https://stellar.expert/explorer/public/tx/ae721cacee382bdecac8d2c47286ecd42cb4711f658bb2aec7cba60dc64a31ff) and walked out the door.  
  
_YieldBlox has been [building on Stellar since 2022](https://www.prnewswire.com/news-releases/script3-launches-first-defi-protocol-built-on-the-stellar-network-301464692.html). [Script3](https://x.com/script3official), the team behind it, ran a [community-managed pool on Blend V2](https://stellar.expert/explorer/public/contract/CCCCIQSDILITHMM7PBSLVDT5MISSY7R26MNZXCX4H7J5JQ5FPIYOGYFS)._
  
**[USTRY, a yield-bearing US Treasury stablebond from Etherfuse](https://app.etherfuse.com/bonds/USTRY), was [listed as eligible collateral](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained).**
  
The attacker [deposited ~153,000 USTRY in two rounds](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained), worth roughly $160k at real prices, and borrowed against it [as though it were worth $16 million](https://github.com/DK27ss/YieldBlox-10M-PoC). USTRY was never stolen. It was the key. The [XLM and USDC](https://github.com/DK27ss/YieldBlox-10M-PoC) sitting in the pool were the loot.  
  
Nobody had put a floor on what kind of market conditions that collateral needed to actually hold its value.

**[Tier 1 Validators scrambled to freeze 48 million XLM](https://x.com/script3official/status/2025722569039778261) - about 80% of the stolen native token. The Security Council sent an on-chain bounty message. The attacker's response was to keep laundering.**

_When the [USTRY/USDC market on the SDEX had less than a dollar in hourly volume](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained) and YieldBlox's oracle treated its spot price like gospel - who exactly failed the security review?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [DK27ss](https://github.com/DK27ss/YieldBlox-10M-PoC), [Defimon Alerts](https://x.com/DefimonAlerts/status/2025852404617371773), [PR Newswire](https://www.prnewswire.com/news-releases/script3-launches-first-defi-protocol-built-on-the-stellar-network-301464692.html), [QuillAudits](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained), [Script3](https://x.com/script3official/status/2025722569039778261), [Reflector](https://x.com/in_reflector/status/2025700358626877576), [saariuslystoned](https://github.com/saariuslystoned/blnd-huntr), [Code4rena](https://code4rena.com/audits/2025-02-blend-v2-audit-certora-formal-verification), [Certora](https://www.certora.com/blog/bringing-formal-verification-to-rust)_

  
**At 00:25 UTC on February 22, 2026, two transactions hit the YieldBlox DAO Pool on Blend V2.**  
  
[The first borrowed 1,000,196 USDC](https://stellar.expert/explorer/public/tx/ae721cacee382bdecac8d2c47286ecd42cb4711f658bb2aec7cba60dc64a31ff). The [second borrowed 61,249,278 XLM](https://stellar.expert/explorer/public/tx/3e81a3f7b6e17cc22d0a1f33e9dcf90e5664b125b9e61f108b8d2f082f2d4657). Combined, $10.97 million drained in the time it takes to confirm two blocks.  
  

Security monitoring accounts caught the on-chain movement early, with [DefimonAlerts posting attacker addresses and transaction links](https://x.com/DefimonAlerts/status/2025852404617371773) as the funds were still moving.  
  
**But the [first named team response came from Script3](https://x.com/script3official/status/2025403423840141450), the team behind both YieldBlox and Blend:**

_"At 00:25:00 UTC the Reflector USTRY oracle was manipulated, misreporting a significantly higher price. This resulted in a loss of ~10 million USD in a mixture of USDC and XLM from the Blend YieldBlox pool. NO OTHER BLEND POOLS WERE AFFECTED. NO OTHER POOLS ARE VULNERABLE."_

Short. Controlled. And notably specific about the blast radius, or the lack of one.

Reflector, the oracle provider, [followed with their own thread](https://x.com/in_reflector/status/2025700358626877576), but only after holding back until most of the stolen funds were frozen.  
  
**[Their statement walked a careful line](https://x.com/in_reflector/status/2025700358626877576):** The infrastructure wasn't compromised, the oracle reported what the SDEX was actually showing, and the root cause was a market so illiquid it was impossible to price fairly.  
  
_[In Reflector's framing](https://x.com/in_reflector/status/2025700372489142414):  "it’s impossible to quote adequate prices for a market fully handled by a single market-maker with almost zero trading activity."_

**The oracle did what the market told it to. The question nobody asked was whether that market was worth trusting.**

[Script3 clarified further on February 23](https://x.com/script3official/status/2025999647270199396), confirming the attack was isolated to a single asset in a single community-managed pool, that Blend's smart contracts had no vulnerabilities.  
  
[They followed up with a statement](https://x.com/script3official/status/2026013344453501130), that all depositors - USDC, XLM, and EURC - would be fully compensated for losses caused by the bad debt.

[The PoC that fully documented the exploit mechanics](https://github.com/DK27ss/YieldBlox-10M-PoC), complete with on-chain evidence, poisoned oracle entries, and health factor calculations, was [published publicly on GitHub by DK27ss](https://github.com/DK27ss/YieldBlox-10M-PoC) shortly after, leaving nothing to the imagination about how cleanly the attack had been constructed.  
  
**[YieldBloxDAO, the DAO's own X account](https://x.com/YieldBloxDAO), offered one update:**  [A repost of Script3's compensation announcement](https://x.com/script3official/status/2026013344453501130). No original statement. No acknowledgment of what happened or how.

**Two teams. One exploit. Two very different explanations for who owned the failure.**

  
_When the oracle says it quoted correctly and the protocol says it was manipulated, who actually had the keys to prevent this?_  
  
### One Trade. Four Failures  
  

_USTRY was supposed to be safe collateral. A yield-bearing stablebond backed by US Treasuries, designed to trade at approximately $1.06._  
  
**Boring by design. The kind of asset that belongs in a lending pool.**  
  

What didn't belong was the market it lived in.  
  
The USTRY/USDC pair on the SDEX had [less than $1 in hourly trading volume](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained). [Fewer than five USTRY tokens sat on the ask side of the order book](https://github.com/DK27ss/YieldBlox-10M-PoC).  
  
[The market had no meaningful depth and effectively a single market maker](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained), a market so thin that [there was no competing activity to anchor the price](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained).  
  
_For at least [10 minutes before the exploit executed, there were zero trades](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained). The market wasn't thin, it was a ghost town with a price tag on the door._

**[The Reflector oracle uses a VWAP model](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained), volume-weighted average price, pulling directly from SDEX trading activity.**  
  
In a liquid market, VWAP is a reasonable approach, manipulated trades carry little weight against the aggregate volume of legitimate activity.  
  
In a thin market, a single trade with outsized volume dominates the calculation. In a market with no other activity, that trade's price is the VWAP.  
  
The attacker placed a sell offer at 100x the real price and bought against it, a single trade [that pushed USTRY from ~$1.06 to ~$106.74](https://github.com/DK27ss/YieldBlox-10M-PoC). With nothing else in the window to dilute it, that price became the oracle's truth.

_The [PoC's decoded on-chain diagnostics](https://github.com/DK27ss/YieldBlox-10M-PoC) showed what happened in real time._  
  
**[Four price entries came back for USTRY.](https://github.com/DK27ss/YieldBlox-10M-PoC) Two were flagged by the PoC researcher as SDEX-POISONED at $106.74. Two were normal at $1.06.**  
  
The [Oracle Adapter, the contract sitting between Reflector and Blend, didn't take a median.](https://github.com/DK27ss/YieldBlox-10M-PoC) Didn't flag the deviation. It returned the latest price and passed the full 100x inflation straight through to the pool.

That's where the second failure compounded the first. [Blend V2's health factor system did exactly what it was built to do,](https://github.com/DK27ss/YieldBlox-10M-PoC) it checked whether collateral value exceeded liability value before approving a borrow.

[With USTRY priced at $106.74](https://github.com/DK27ss/YieldBlox-10M-PoC), the pool valued [the attacker's USTRY collateral position at $1.37 million](https://github.com/DK27ss/YieldBlox-10M-PoC).  
  
_At the real price, it was worth ~$13,654, with [a health factor of 1.35](https://github.com/DK27ss/YieldBlox-10M-PoC) and still, the borrow was approved._

**The attacker went back for seconds. After [depositing an additional 140,000 USTRY](https://stellar.expert/explorer/public/tx/81f304ae627ba294df0f9c0708a58a2fe770b39d65f8cd0efe1d7d6d6cc885a6), the same poisoned oracle [valued the total collateral at ~$15.99 million](https://github.com/DK27ss/YieldBlox-10M-PoC).**  
  
**[Real value](https://github.com/DK27ss/YieldBlox-10M-PoC):** ~$158,500.  
  
**[Health factor](https://github.com/DK27ss/YieldBlox-10M-PoC):** 1.47.  
  
The pool handed over [61,249,278 XLM](https://stellar.expert/explorer/public/tx/3e81a3f7b6e17cc22d0a1f33e9dcf90e5664b125b9e61f108b8d2f082f2d4657) without a second question.

No circuit breaker fired. No price deviation check triggered. No staleness flag raised on a market that had been dead for ten minutes. The protocol had no mechanism to distinguish between a price that was accurate and a price that was accurate only because nobody had traded in long enough to correct it.

Four distinct layers collapsed in sequence - illiquid collateral listing, a single-source VWAP oracle, an adapter returning raw last price, and a protocol with no anomaly detection. Remove any one of them and the exploit doesn't work. All four were present, and [nobody had asked whether they could fail together](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained).

**Not a smart contract bug. Not a flash loan. Not a bridge compromise. Just a stablebond with no market, an oracle with no guardrails, and a lending pool that trusted both.**  
  

_Was this a failure of the oracle, the protocol, or the people who decided a ghost-town market was good enough collateral?_  
  
### The Ledger Doesn’t Lie

  
_The attacker had a plan. The blockchain kept receipts._

**Every address. Every transaction. Every token accounted for.**

This exploit didn't start at 00:25 UTC. It started eight days earlier, when the [attacker's primary Stellar wallet](https://stellar.expert/explorer/public/account/GBO7VUL2TOKPWFAWKATIW7K3QYA7WQ63VDY5CAE6AFUUX6BHZBOC2WXC) was created on February 14 with a 56.32 XLM seed.  
  
What followed was a few days of quiet reconnaissance, [small USTRY test buys at normal prices around $1.058](https://github.com/saariuslystoned/blnd-huntr), learning the market before breaking it.

The price manipulation itself required a second, dedicated burner account, created on February 21 at 23:35 UTC with 15 XLM:

**SDEX Manipulation Burner:**
[GCNF5GNRIT6VWYZ7LXUZ33Q3SR2NUGO32F5X65VVKAEWWIQCKGYN75HB](https://stellar.expert/explorer/public/account/GCNF5GNRIT6VWYZ7LXUZ33Q3SR2NUGO32F5X65VVKAEWWIQCKGYN75HB)

  
_This account existed for one purpose. At 23:38 UTC, it placed a sell offer for 1.2185 USTRY at 107 USDC - [100x the real price](https://x.com/QuillAudits_AI/status/2025938596767944861)._  
  
**The offer transaction:**
[09e1a9d1197c9bf0af4e87da328c4f2d5eb49b487630aa61991fb5c1c4637cdb](https://stellar.expert/explorer/public/tx/09e1a9d1197c9bf0af4e87da328c4f2d5eb49b487630aa61991fb5c1c4637cdb)

**Placing the offer wasn't enough - a trade had to execute for the oracle to read it. A third attacker-controlled account handled that.**

**Price-Setting Trade Trigger:**
[GDHRCQNC64UVL27EXSC6OG6I2FCT4NWM72KNHLHKEB3LK4MEEYYWETN3](https://stellar.expert/explorer/public/account/GDHRCQNC64UVL27EXSC6OG6I2FCT4NWM72KNHLHKEB3LK4MEEYYWETN3)

At 00:10:21 UTC on February 22, this account bought 0.05 USTRY against the burner's inflated sell offer. That 50-cent trade became the market price the Reflector oracle ingested at 00:15 and 00:20 UTC.  
  
**Price-setting trade transaction:**
[60fe039e96e88402d175c8de68e80651874ab125880dd384a1636914ba95bef1](https://stellar.expert/explorer/public/tx/60fe039e96e88402d175c8de68e80651874ab125880dd384a1636914ba95bef1)

_With the oracle poisoned across two consecutive windows, the borrow executed at 00:24:27 UTC. Two transactions. Two assets. One protocol drained._

**USDC Borrow (1,000,196 USDC):**
[ae721cacee382bdecac8d2c47286ecd42cb4711f658bb2aec7cba60dc64a31ff](https://stellar.expert/explorer/public/tx/ae721cacee382bdecac8d2c47286ecd42cb4711f658bb2aec7cba60dc64a31ff)

  
**XLM Borrow (61,249,278 XLM):**
[3e81a3f7b6e17cc22d0a1f33e9dcf90e5664b125b9e61f108b8d2f082f2d4657](https://stellar.expert/explorer/public/tx/3e81a3f7b6e17cc22d0a1f33e9dcf90e5664b125b9e61f108b8d2f082f2d4657)

_[The stolen funds were swapped into USDC and bridged off Stellar to Base via Allbridge](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained), before moving further from Base to Ethereum via Across and Relay._  
  
**The bridged funds landed across [Ethereum, Base, and BNB Chain](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained) in the [attacker's wallet](https://etherscan.io/address/0x2d1ce29b4af15fb6e76ba9995bbe1421e8546482).**

Meanwhile, [~48M XLM was frozen across the attacker's Stellar accounts by Tier 1 Validators](https://x.com/script3official/status/2025722569039778261) before it could move.

On the EVM side, [three wallets received the bridged proceeds](https://github.com/saariuslystoned/blnd-huntr), all tagged by Etherscan.

**YieldBlox Exploiter 1:**
[0xE69f6d77DB6Ff493FDD15D8A0B390c36E18E5b21](https://etherscan.io/address/0xE69f6d77DB6Ff493FDD15D8A0B390c36E18E5b21)

**Holdings:** 363.98 ETH + 12.78 ETH on Base (~$729K combined).  
  
Notably, [this wallet was funded by Binance](https://etherscan.io/tx/0x450192b9dce6f76e99912d66483681be2dc96cdf3fc7698e8b655b22ecc65494), a major exchange hot wallet, implying either a KYC'd withdrawal or a Binance bridge conversion. Potentially traceable.

**YieldBlox Exploiter 2:**
[0x2D1CE29b4aF15fb6E76Ba9995BbE1421E8546482](https://etherscan.io/address/0x2D1CE29b4aF15fb6E76Ba9995BbE1421E8546482)

**Holdings:** 357.28 ETH on Ethereum + 19.23 ETH on Base + 38,746 USDC untouched on BSC($769k).  
  
The wallet was [funded by Allbridge Core Bridge](https://etherscan.io/tx/0x77b98cd02c2e105b8b3f01a5feaf068e98f9b76ada034c282378060008ca9676).  
  
**YieldBlox Exploiter 3:**
[0x0b2B16E1a9E2e9b15027AE46Fa5eC547f5ef3eC6](https://etherscan.io/address/0x0b2B16E1a9E2e9b15027AE46Fa5eC547f5ef3eC6)

**Holdings:** ~300 ETH on Ethereum (~$583K). A child wallet of Exploiter 2, funded directly by it.

**On February 27th, [Yieldblox Exploiter 2](https://etherscan.io/address/0x2D1CE29b4aF15fb6E76Ba9995BbE1421E8546482), moved 100 ETH to the following address:**  
[0xFC51b5cD07E73020bE902A5b00902f329b083eaB](https://etherscan.io/address/0xfc51b5cd07e73020be902a5b00902f329b083eab)

**Which was sent to Tornado Cash:**  
[0xdc082828a2358ccb33b3837b49bfe678c31259aad59c39c76916a53f8c73853b](https://etherscan.io/tx/0xdc082828a2358ccb33b3837b49bfe678c31259aad59c39c76916a53f8c73853b)

_[On February 23 between 09:17 and 09:26 UTC, 23 transactions moved ~380 ETH from Base back to Exploiter 2 on Ethereum mainnet](https://github.com/saariuslystoned/blnd-huntr), using two bridge protocols simultaneously. Twelve Relay settlements at ~19.99 ETH each. Ten Across Protocol transfers ranging from 10 to 50 ETH. Consecutive blocks. Uniform batch sizing. [Not scattering, consolidating](https://github.com/saariuslystoned/blnd-huntr)._  
  
**This activity occurred [approximately 12 hours after the Security Council sent the 72-hour white-hat bounty ultimatum](https://github.com/saariuslystoned/blnd-huntr). The attacker's answer was to keep moving.**

The [gas funding trail on the EVM side](https://github.com/saariuslystoned/blnd-huntr) identifies who is behind this. [Multiple wallets across both vanity address rings were funded](https://github.com/saariuslystoned/blnd-huntr) by Etherscan-flagged phishing wallets.

**The most active gas supplier (Labeled Fake_Phishing1701177):**  
[0xd7e42d9502fbd66d90750e544e05c2b3ca7cbd22](https://etherscan.io/address/0xd7e42d9502fbd66d90750e544e05c2b3ca7cbd22)

[This address appears three times as a gas supplier](https://github.com/saariuslystoned/blnd-huntr) across both exploit wallet rings. Three additional flagged phishing addresses complete the funding network. This is not a solo operator working from a laptop.

The Security Council sent on-chain negotiation messages to all three EVM exploiter wallets simultaneously.  
  
The messages were delivered from a Coinbase-funded messenger wallet.

**Security Council Messenger:**
[0x456c2F5F3536b1D9238F4654D5242B0dF8f978AF](https://etherscan.io/address/0x456c2F5F3536b1D9238F4654D5242B0dF8f978AF)

**Bounty Message TX (to Exploiter 1):**  
[0x7979c9faa2eba7afa29702382205930f77a461174d4eeeb3382e22bb7177171e](https://etherscan.io/tx/0x7979c9faa2eba7afa29702382205930f77a461174d4eeeb3382e22bb7177171e)

**[The message](https://etherscan.io/tx/0x7979c9faa2eba7afa29702382205930f77a461174d4eeeb3382e22bb7177171e):** “If you return 90% of the stolen funds within 72 hours, we will stop pursuing legal action. Your 3 Stellar accounts have been frozen by the Tier 1 Validators. If you contact us, we can provide instructions on how to return the 48M XLM those accounts hold on the Stellar network so it is included in the 90%.”

**[The attacker's response? None](https://github.com/saariuslystoned/blnd-huntr?tab=readme-ov-file#evm-chain-1--base-1923-eth). Their wallets sent back nothing. [Twelve hours later, another consolidation batch ran on Relay](https://github.com/saariuslystoned/blnd-huntr?tab=readme-ov-file#evm-chain-1--base-1923-eth).**

_A week of preparation, three bridge protocols, a phishing network for gas. None of that required a single vulnerability in the code. So what exactly were the auditors looking for?_  
  
### What the Auditors Didn’t Ask  
  
_Blend V2 wasn't unaudited. It was extensively audited._  
  
**In February 2025, exactly one year before the exploit, [Blend V2 ran a $125,000 Code4rena competition with a Certora Formal Verification](https://code4rena.com/audits/2025-02-blend-v2-audit-certora-formal-verification) component bolted on.**  
  
**[It was a landmark event](https://www.certora.com/blog/bringing-formal-verification-to-rust):** The first Rust/Soroban formal verification contest in DeFi history.  
  
[The contest focused on the Backstop contract](https://www.certora.com/blog/bringing-formal-verification-to-rust), chosen for its central role in the protocol's solvency.  
  
[Twenty-one security researchers participated](https://www.certora.com/blog/bringing-formal-verification-to-rust). Nearly a thousand rules were written.  
  
_A [$20,000 mitigation review followed in April](https://code4rena.com/audits/2025-04-blend-v2-mitigation-review)._  
  
**That's a serious security investment.**  
  
**Here's what those credentials actually covered:** Pool logic, backstop mechanics, fee vaults, auction systems, flash loan endpoints.  
  
[The Blend V2 Audit + Certora Formal Verification's stated main invariant was precise](https://github.com/code-423n4/2025-02-blend): "Users cannot extract funds from a pool if they do not meet or exceed the minimum health factor."  
  
[The attack ideas section](https://github.com/code-423n4/2025-02-blend) directed researchers toward auctions and flash loans. The oracle, Reflector's integration, and the question of what happens when an accepted collateral asset has no functioning market, none of it was in scope.

_The Certora formal verification [focused specifically on the Backstop contract's solvency](https://www.certora.com/blog/bringing-formal-verification-to-rust). Mathematically rigorous. Provably correct. For the code that was examined._

**The health factor check the attacker bypassed? It worked exactly as verified. It checked oracle price against liability. Oracle price was $106.74. Health factor passed. The proof held. The pool got drained.**

It's the same architecture of failure [that took down Makina Finance a month earlier](https://rekt.news/tr/makina-rekt) - six audits certified that the contracts worked as written, and the exploit lived in the space between what was written and what the external world fed into it.  
  
At Makina, [the gap was a permissionless AUM update function pulling spot prices from manipulable Curve pools](https://rekt.news/tr/makina-rekt).  
  
At YieldBlox, [the gap was a VWAP oracle reading from a market that had effectively ceased to exist](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained).

_In both cases, the auditors were right. The code did what it was supposed to do. Nobody asked whether the inputs were trustworthy._

**[Script3 confirmed all EURC, USDC, and XLM depositors in the affected pool will be fully compensated](https://x.com/script3official/status/2026013344453501130) for losses caused by the bad debt.**  
  
[Reflector confirmed its infrastructure was not compromised](https://x.com/in_reflector/status/2025700372489142414) and that [other assets with meaningful liquidity and multiple active traders are not at risk](https://x.com/in_reflector/status/2025700374930477419). The incident was isolated to the single community-managed pool, [no other Blend pools were affected or vulnerable](https://x.com/script3official/status/2025403423840141450).  
  
**[QuillAudits identified the mitigations that would have prevented this](https://www.quillaudits.com/blog/hack-analysis/yeildblox-10m-hack-explained):** “This incident highlights the critical importance of liquidity thresholds, market depth validation, and circuit breakers when relying on on-chain DEX pricing. Even mathematically sound oracle systems can fail if underlying market conditions are economically unsound. Robust oracle design must account not just for price accuracy, but for market quality and resilience.”

**A [$125,000 formal verification contest](https://code4rena.com/audits/2025-02-blend-v2-audit-certora-formal-verification). A first-of-its-kind Rust audit. And the vulnerability was a market condition that didn't exist yet when the auditors signed off.**

  
_When the proof says the health factor can't be bypassed, and the attacker bypasses it by feeding the oracle a price that's 100x wrong - did the audit pass or did the threat model fail?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_Nobody picked a lock. They just walked through a door the auditors never checked._  
  
**The oracle reported what the market showed. The adapter passed the price it was given. The pool handed over $10.97 million.**  
  
Every component performed exactly as designed, and the pool bled out anyway. That's not a bug. That's a system that was never asked whether the world feeding it data could be trusted.

  
Script3 will compensate depositors. Stellar's validators froze most of the XLM before it could vanish.  
  
**The attacker still has millions sitting in EVM wallets with a Binance KYC trail attached, and a [forensic dashboard that documents](https://github.com/saariuslystoned/blnd-huntr) every move they made.**

  
The fixes are real. The accountability is partial.  
  
And the lesson, that a lending protocol is only as safe as the worst market it accepts as collateral, is not new. It has been written in eight figures of losses across a dozen protocols before this one.

  
**DeFi keeps building faster than it learns. Auditors scope contracts. Nobody scopes reality.**

  
_When your security model [is formally verified](https://code4rena.com/audits/2025-02-blend-v2-audit-certora-formal-verification) and your protocol still gets drained by a single trade in a market with less than a dollar of daily volume, what exactly were you paying the auditors to protect?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
