---
tags:
  - blockchain/bitcoin
  - sector/dex
  - sector/lending
  - sector/multisig
  - sector/privacy
  - sector/stable
  - sector/token
  - blast-radius/cross-protocol
title: "Drained By Design"
protocol: "[[Drained By Design]]"
date: 2025-08-13
loss_usd: 550000
auditors:
source: "https://rekt.news/drained-by-design"
excerpt: "A $550K lesson - Coinbase lost funds after granting ERC-20 approvals to 0xProject's permissionless Settler contract - exactly what their docs warn against. An MEV bot exploited the permissions to drai"
genome:
  - "[[cross-protocol]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Drained By Design

> **Loss:** $550,000 | **Date:** 2025-08-13 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/drained-by-design-header.png)








_Coinbase just learned a $550,000 lesson about why 0xProject’s documentation exists._

  

**The alleged safe custodian's fee wallet got systematically drained on August 13th after granting ERC-20 approvals to 0xProject’s permissionless Settler contract - a move explicitly warned against in bright red letters across 0x's docs.**

  

[An MEV bot spotted the misconfigured permissions](https://x.com/deeberiroz/status/1955718986894549344) faster than Coinbase's risk team could spell "authorization error" and proceeded to vacuum up hundreds of tokens with surgical precision.

  

No code was broken, no exploits were deployed - just a permissionless system doing exactly what it was designed to do when handed the wrong keys.

  

[Coinbase stressed that "the incident did not affect any customer funds,"](https://bitcoinethereumnews.com/finance/coinbase-concedes-300k-loss-to-mev-bot-attack-due-to-0xproject-swapper-oversight/) which translates to only our own fee wallet got rekt.

  

**The bot swapped everything into ETH and vanished, leaving behind a perfect case study in why enterprise-grade doesn't mean mistake-proof.**

  
_When your operational security has more holes than Swiss cheese, how many warning labels does it take to prevent a half-million-dollar oopsie?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [deebeez](https://x.com/deeberiroz/status/1955718986894549344), [bitcoinethereumnews](https://bitcoinethereumnews.com/finance/coinbase-concedes-300k-loss-to-mev-bot-attack-due-to-0xproject-swapper-oversight/), [0xProject](https://x.com/0xProject/status/1956155868279660757), [Blockscope](https://research.blockscope.co/coinbase-approval-exploit), [Blockaid](https://www.blockaid.io/blog/composability-attack-deep-dive-how-an-attacker-stole-128k-without-an-exploit), [Three Sigma](https://threesigma.xyz/blog/exploit/zora-airdrop-exploit-analysis), [ZachXBT](https://x.com/zachxbt/status/1886411879939031530), [cryptonews](https://cryptonews.com/news/coinbase-crypto-scam-4m-gambled-away-zachxbt/), [CryptoSlate](https://cryptoslate.com/zachxbt-reveals-coinbase-users-lost-another-45m-in-a-week-to-ongoing-social-engineering-scams/)_

  

**August 13th started like any other Tuesday for Coinbase's fee collection wallet - until 17:09 UTC turned it into a case study for crypto's most expensive approval mistakes.**  
  

[Security researcher deebeez first flagged the carnage](https://x.com/deeberiroz/status/1955718986894549344) unfolding across the blockchain, watching hundreds of different tokens hemorrhage from Coinbase's corporate wallet.  
  
**Coinbase's Fee Wallet:**  
[0x382ffce2287252f930e1c8dc9328dac5bf282ba1](https://etherscan.io/address/0x382ffce2287252f930e1c8dc9328dac5bf282ba1).  
  
The culprit wasn't some undiscovered vulnerability or complex exploit - just basic ERC-20 approvals granted to the wrong contract.  
  
Hours later, [Coinbase CSO Philip Martin confirmed](https://bitcoinethereumnews.com/finance/coinbase-concedes-300k-loss-to-mev-bot-attack-due-to-0xproject-swapper-oversight/) what the on-chain data already screamed: an isolated issue due to changes in one of their corporate DEX wallets, customer funds untouched, with the team now revoking allowances and moving to a new wallet.

  

_What makes this particularly painful?_  
  
**What makes this particularly painful? [0xProject's response](https://x.com/0xProject/status/1956155868279660757) couldn't be clearer: "Never set allowances on Settler. Always set allowances on Permit2 or AllowanceHolder."**

  
[Blockscope's forensic dig found the real damage](https://research.blockscope.co/coinbase-approval-exploit): $550K, not the ~$300K floating around Twitter and crypto news sites.  
  
[The bot worked methodically](https://research.blockscope.co/coinbase-approval-exploit) - AMP, PyUSD, DEXTools tokens, stablecoins, and many others - converting everything into ETH while paying bribes to block builders for VIP treatment.  
  
**No rushed liquidation, no sloppy swaps. Just professional work from someone who'd clearly studied the playbook while Coinbase's ops team was apparently busy with other priorities.**

_When reading comprehension costs half a million dollars, who's really getting the education here - the institution or the industry?_

### How it Went Down  
  
_This wasn't rocket science - just basic DeFi mechanics executed with ruthless efficiency._

  
**[Coinbase's fee wallet](https://etherscan.io/address/0x382ffce2287252f930e1c8dc9328dac5bf282ba1) had been [accumulating tokens from affiliate fees](https://research.blockscope.co/coinbase-approval-exploit) through 0x Protocol's trading aggregation. Standard business.**  
  
But somewhere in their "corporate DEX wallet implementation" changes, [someone decided to grant broad ERC-20 approvals to the 0xProject Settler contract](https://research.blockscope.co/coinbase-approval-exploit).  
  
Not Permit2. Not AllowanceHolder. The one contract [0xProject explicitly tells everyone to avoid](https://x.com/0xProject/status/1956155868279660757).

  
[0x's Mainnet Settler is permissionless by design](https://research.blockscope.co/coinbase-approval-exploit) - anyone can call it, which enables powerful DeFi composability.

  
**That openness becomes dangerous when wallets grant it spending rights.**  
  
[Once those approvals hit the blockchain at 17:09 UTC](https://research.blockscope.co/coinbase-approval-exploit), sophisticated monitoring bots detected the opportunity faster than Coinbase detected their mistake.  
  
**First Approval Transaction:**
[0xc4c090334cb46ca327a6d833db3dc69ecbaf38ecb29ba53ae996951d828fabe8](https://etherscan.io/tx/0xc4c090334cb46ca327a6d833db3dc69ecbaf38ecb29ba53ae996951d828fabe8)

  

[The attack pattern was textbook](https://research.blockscope.co/coinbase-approval-exploit): transferFrom() using the granted approvals, route through AMM swaps, consolidate to ETH, repeat across ~168 different token types.  
  
**[Professional extraction executed through multiple DeFi pools](https://research.blockscope.co/coinbase-approval-exploit) while paying priority fees to ensure smooth processing.**  
  

_When your security model assumes bots won't notice fresh approvals to known public executors, what exactly were you securing?_

  
### Assessing the Damage  
  
_Professional work deserves professional accounting._  
  

**[Blockscope's forensic analysis](https://research.blockscope.co/coinbase-approval-exploit) tracked the systematic extraction of $550K across ~168 different ERC-20 tokens from Coinbase's fee wallet.**  
  
USDT, PyUSD, AMP, MYRIA, DEXTools, Swell - nothing was safe. The bot treated Coinbase's treasury like a personal shopping mall.  
  

**Three-phase execution:**  
  

**Pull:** Direct transfers using Coinbase's own approvals
**Swap:** Route through ~180 DeFi pools, mostly Uniswap v3
**Cash out:** Everything into wETH, then clean ETH  
  

_Key Players are as follows…_  
  

**Coinbase Fee Wallet:**
[0x382ffce2287252f930e1c8dc9328dac5bf282ba1](https://etherscan.io/address/0x382ffce2287252f930e1c8dc9328dac5bf282ba1)

  

**Exploiter:**
[0x17f79e70ae89c6e32a9244d3d57b7aa648246468](https://etherscan.io/address/0x17f79e70ae89c6e32a9244d3d57b7aa648246468)

  

**Bot:**
[0xac13439d598cd1a60c14c965ed0fa7c46cb0d89d](https://etherscan.io/address/0xac13439d598cd1a60c14c965ed0fa7c46cb0d89d)

  

_[The exploiter's wallet](https://etherscan.io/address/0x17f79e70ae89c6e32a9244d3d57b7aa648246468) tells a story._  
  
**[The wallet was funded by a smart contract that has been labeled as a scam,](https://research.blockscope.co/coinbase-approval-exploit) blocked by multiple centralized entities, involved with Tornado Cash, appears on the OFAC sanctions list, and has been blacklisted by Tether.**  
  
This wasn't some lucky degen - someone with serious preparation and questionable funding.  
  

Four hours of methodical extraction. Priority fees paid throughout to keep block builders happy.  
  
**ETH still sitting there, untouched. A $550K monument to operational failure.**

  
_When sketchy actors process your corporate funds more efficiently than your own systems, who's really running the professional operation?_  
  
### Zora Déjà Vu  
  
_Coinbase's $550K disaster wasn't even original - just a lazy sequel to a movie that bombed twice already this year._  
  

**[Back in April, Zora got rekt](https://www.blockaid.io/blog/composability-attack-deep-dive-how-an-attacker-stole-128k-without-an-exploit) with the exact same 0x's Mainnet Settler trick, losing $128K.[](https://threesigma.xyz/blog/exploit/zora-airdrop-exploit-analysis)**

  

[Attackers chained Settler's public calls](https://threesigma.xyz/blog/exploit/zora-airdrop-exploit-analysis) with Zora's claim logic, redirecting payouts while every contract did exactly what it was coded to do.

  

Different mechanics, same stupid mistake: handing spending rights to a permissionless contract.

  

The difference? Zora's losses stemmed from compositional vulnerabilities where safe systems combined poorly.  
  
Coinbase skipped the complexity and went straight for the simple approach - just hand over the keys directly.  
  

**Both situations taught the same lesson about permissionless DeFi: who you grant authority to matters as much as code security.**  
  
_If documented attack vectors keep working, are protocols not learning or are enterprises not reading?_  
  
### Why This Matters  
  
_Coinbase's $550K blunder isn't an isolated incident - it's just the latest chapter in a security failure anthology that's bleeding users dry._  
  

**Here's the exchange that positions itself as crypto's safe harbor for traditional finance, the one that went public, survived regulatory scrutiny, and preaches "institutional-grade security" to pension funds and corporate treasuries.**

  

Yet they can't follow basic approval hygiene that any DeFi degen learns after their first rug pull.

  

But the approval mistake is just the appetizer.[  
  
ZachXBT's work reveals the main course](https://x.com/zachxbt/status/1886411879939031530):

  

_[Coinbase users bleed $300 million annually to social engineering scams](https://x.com/zachxbt/status/1886411879939031530) while the exchange perfects compliance theater instead of stopping actual theft._

  

**In just two months - [$65 million gone](https://crypto.news/zachxbt-coinbase-users-lose-over-65m-in-widespread-scams/) through organized phishing ops running Coinbase support call centers.**

  

[Same script every time](https://crypto.news/zachxbt-coinbase-users-lose-over-65m-in-widespread-scams/).  
  

Spoofed numbers, stolen personal data, fake emails with official-looking case IDs. Cloned websites so perfect they'd fool Coinbase's own designers.

  

[Users think they're securing accounts by moving funds to safe wallets](https://cryptonews.com/news/coinbase-crypto-scam-4m-gambled-away-zachxbt/) - wallets owned by crews who've been running this con for years.

  

_[Coinbase's response?](https://crypto.news/zachxbt-coinbase-users-lose-over-65m-in-widespread-scams/) Call user complaints "FUD/misinformation" and claim their "fraud-prevention systems are acting as expected" while known theft addresses process millions in stolen funds for weeks without getting flagged._  
  
**Their fraud prevention team claims to have "saved tens of millions" while users hemorrhage hundreds of millions through the exact attack vectors [ZachXBT keeps documenting](https://cryptoslate.com/zachxbt-reveals-coinbase-users-lost-another-45m-in-a-week-to-ongoing-social-engineering-scams/).**

  

This isn't some experimental protocol pushing boundaries or a startup cutting corners to ship fast.

  

This is Coinbase - the company that charges premium fees precisely because they're supposed to know better.

  

**When your entire value proposition is "we're the responsible adults in the room," losing half a million to documented attack patterns while your users lose hundreds of millions to basic phishing becomes more than operational failure - it becomes fraud by negligence.**

  
_When the "safe" players keep making amateur mistakes across every possible attack vector, who exactly is protecting institutional capital from itself?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)







_Coinbase was supposed to be crypto's safe harbor - the place where your mom could buy Bitcoin without immediately getting scammed._  
  

**Mission accomplished, except for the part where everyone keeps getting scammed anyway.**  
  
Crypto's hitting the mainstream with ETFs, institutional money, and presidential promises of strategic reserves.  
  
Meanwhile, one of the industry's oldest players can't stop bleeding user funds through attacks a teenager could execute.  
  
_Half a million lost because someone couldn't be bothered to read 0xProject's docs._  
  
**Hundreds of millions more [vanishing through phone calls that wouldn't fool a savvy 12-year-old](https://rekt.news/pwnedbase).**  
  
This isn't growing pains - it's willful negligence dressed up as operational complexity.  
  
When your entire brand is built on being the "responsible" option while users get systematically rekt through basic operational failures, you're not running an exchange.  
  
**You're running an expensive reminder of why we built DeFi in the first place.**  
  

_In an industry designed to eliminate trusted third parties, why do we keep trusting the institutions that prove daily why they can't be trusted?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
