---
tags:
  - blockchain/bsc
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - sector/privacy
  - sector/stable
  - sector/token
  - sector/vault
  - impact/data-corruption/price-manipulation
  - trigger/low-liquidity
  - trigger/price-manipulation
title: "Venus Protocol - Rekt IV"
protocol: "[[Venus Protocol]]"
date: 2026-03-15
loss_usd: 3700000
auditors:
source: "https://rekt.news/venus-protocol-rekt4"
excerpt: "An attacker spent 9 months building a position, bypassed Venus Protocol's supply cap via a known donation exploit, and extracted $3.7 million, leaving $2.15 million in bad debt on a protocol that has "
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/low-liquidity]]"
  - "[[trigger/price-manipulation]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[chainlink-round-completeness]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[commitment-uniqueness]]"
---
# Venus Protocol - Rekt IV

> **Loss:** $3,700,000 | **Date:** 2026-03-15 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/venus-protocol-rekt4-header.png)









_Nine months of patience. One dismissed audit finding. And [a protocol that had already absorbed $717,000 in bad debt](https://www.theblock.co/post/348785/analysis-of-700k-oracle-manipulation-exploit-highlights-vulnerabilities-in-defi-vaults) from a donation-style exploit on its own ZKSync deployment twelve months earlier._

  

**On March 15, 2026, an attacker who had spent nine months quietly accumulating 84% of Venus Protocol's supply cap for the Thena token executed a [Mango Markets-style price manipulation attack](https://x.com/hklst4r/status/2033192855443808515) on BNB Chain, bypassing the cap entirely through a technique called a donation attack, running a recursive borrow loop against thin liquidity, and extracting $3.7 million in borrowed assets before the position imploded into [$2.15 million in bad debt](https://community.venus.io/t/the-market-incident-post-mortem/5712).**

  

[Fourth major incident since 2021](https://www.mexc.com/news/939007). Same protocol. Same chain. The [same category of collateral inflation exploit it has survived before](https://www.theblock.co/post/348785/analysis-of-700k-oracle-manipulation-exploit-highlights-vulnerabilities-in-defi-vaults).  
  
Venus's own [Code4rena analysis in 2023](https://code4rena.com/reports/2023-05-venus) flagged this exact mechanism, donations bypassing supply cap logic, and the team dismissed it as ‘supported behavior with no negative side effects.

  

**[William Li spotted it early on March 15th](https://x.com/hklst4r/status/2033159804626112932), flagged the attacker's address in real time, [and made $15,000 shorting the collapse](https://x.com/hklst4r/status/2033192855443808515).**  
  
The attacker, despite extracting $5.07 million in assets, [likely walked away with nothing, or less than nothing, on-chain](https://community.venus.io/t/the-market-incident-post-mortem/5712).  
  
[Venus walked away with a $2.15 million hole](https://community.venus.io/t/the-market-incident-post-mortem/5712) it will have to explain to governance.

  

**At some point, surviving every attack stops being a testament to protocol resilience and starts being an indictment of an ecosystem willing to keep depositing into it.**

  
_When the same protocol gets rekt four times in five years, each time from a variation of the same root failure, is the real vulnerability in the code, or in the decision to keep using it?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [The Block](https://www.theblock.co/post/348785/analysis-of-700k-oracle-manipulation-exploit-highlights-vulnerabilities-in-defi-vaults), [William Li](https://x.com/hklst4r/status/2033192855443808515), [Venus Protocol](https://community.venus.io/t/the-market-incident-post-mortem/5712), [Blockaid](https://x.com/blockaid_/status/2033168154164076923), [Thena](https://x.com/ThenaFi/status/2033225864461058265?s=20), [Allez Labs](https://x.com/AllezLabs/status/2033239544234189168), [Hacken](https://x.com/hackenclub/status/2033578740123353585), [DARK HIT9](https://x.com/hit9crypto/status/2033188343098351620?s=46), [EmberCN](https://x.com/EmberCN/status/2033204517467308144?s=20), [ChainCatcher](https://www.chaincatcher.com/en/article/2252203)_

**[William Li was the first](https://x.com/hklst4r/status/2033159804626112932) to say it out loud.**  
  

"Hi Venus Protocol, I think there is some suspicious activity going on with your vTHE pool. Someone is 'donating' to jail-break the THE supply cap and performing a Mango-market like attack. Please pause your pool ASAP!"  
  

Li wasn't guessing. He had modeled this exact type of attack in a [2023 academic paper](https://dl.acm.org/doi/10.1145/3605768.3623545) on role‑play attack strategies in DeFi.  
  
When THE's price started moving in ways that matched the pattern, [he recognized it immediately](https://x.com/hklst4r/status/2033159804626112932).  
  

_He [publicly posted the attacker's address](https://x.com/hklst4r/status/2033159804626112932), before Venus Protocol had posted a single word._  
  

**Attacker address:**  
[0x1A35bD28EFD46CfC46c2136f878777D69ae16231](https://bscscan.com/address/0x1a35bd28efd46cfc46c2136f878777d69ae16231)

[Blockaid issued a community alert identifying it as](https://x.com/blockaid_/status/2033168154164076923) "delegated borrowing abuse."  
  
[Venus Protocol's first public statement came two hours](https://x.com/VenusProtocol/status/2033190887996440667) after [Li's alert](https://x.com/hklst4r/status/2033159804626112932): "We have identified unusual activity involving the $THE pool and are actively investigating. At this time, only the $THE and $CAKE markets appear to be affected."  
  

An hour later, [all THE borrows and withdrawals were paused](https://x.com/VenusProtocol/status/2033206484935344251).

  
Two hours after that, Venus [set the Collateral Factor to zero across six additional markets](https://x.com/VenusProtocol/status/2033237615194034643) - BCH, LTC, UNI, AAVE, FIL, TWT - flagged because a single wallet held more than 60% of the supplied collateral in each. [lisUSD followed shortly after](https://x.com/VenusProtocol/status/2033239533593252133) under the same criteria.

  
_**[Thena moved quickly to separate itself](https://x.com/ThenaFi/status/2033225864461058265?s=20):** "THENA Smart Contracts are safe. A malicious actor targeted the THE market on Venus Protocol. Your funds and positions on THENA remain SAFU."_  
  

**By the following morning, Venus had its [official account of events](https://x.com/venusprotocol/status/2033472117321408870). The attacker spent 9 months slowly accumulating $THE to build a dominant supply position. Supply cap bypassed via direct contract transfers. Recursive loop. Bad debt created. Oracles did not fail. Venus Flux unaffected.**  
  

The oracle claim deserves a footnote. [The official post-mortem that was released on March 17th](https://community.venus.io/t/the-market-incident-post-mortem/5712), confirms Venus's BoundValidator actually rejected the spiking price for approximately 37 minutes before both feeds converged and it accepted the manipulated rate.  
  
Technically accurate, the oracle didn't fail. It resisted, then ran out of road.  
  

**[Three bullet points of damage control, and one line that buried the real story](https://x.com/venusprotocol/status/2033472117321408870):** "This is a gap in our code we are working to close."  
  
Make sure you read that line twice, because yes, they really said that.  
  

**Meanwhile, Li had already closed his short position, with a [profit of $15k](https://x.com/hklst4r/status/2033192855443808515).**

  
_If the researcher who modeled this exact attack class in 2023 could identify it in real time while it was still running, what was Venus's security infrastructure actually watching?_

  

### Nine Months in the Dark

  

_Most exploits are built in hours. This one was built in nine months._

  

**[According to Venus Protocol’s official post-mortem](https://community.venus.io/t/the-market-incident-post-mortem/5712), starting in June 2025, a wallet received [7,447 ETH, roughly $16.29M, across 77 separate Tornado Cash transactions](https://community.venus.io/t/the-market-incident-post-mortem/5712).**  
  
[That ETH was deposited as collateral on Aave](https://community.venus.io/t/the-market-incident-post-mortem/5712), used to borrow approximately $9.92M in stablecoins, and those funds were dispersed through intermediary addresses to quietly accumulate THE on the open market.  
  
No flags. No alerts. No rules broken. Just a patient buyer, month after month, [building toward a position representing 84% of Venus's 14.5 million THE supply cap](https://x.com/AllezLabs/status/2033239544234189168).  
  

**Attacker Address:**  
[0x1a35bd28efd46cfc46c2136f878777d69ae16231](https://bscscan.com/address/0x1a35bd28efd46cfc46c2136f878777d69ae16231)

_[Community members had flagged this address as suspicious before March 15th](https://x.com/hackenclub/status/2033578740123353585). Venus [allegedly took no action](https://x.com/hackenclub/status/2033578740123353585), because technically, nothing had gone wrong yet._  
  

**Then the deposit flow stopped. And [the direct transfers started](https://x.com/AllezLabs/status/2033239544234189168).**  
  
A second attacker EOA, was also identified [as part of the operation by Quill Audits](https://www.quillaudits.com/blog/hack-analysis/venus-5m-exploit), though its exact role (e.g., helper, liquidation‑front‑running, or beneficiary) is not fully detailed in the public write‑ups.  
  
**Second Attacker Address:**  
[0x43c743e316f40d4511762eedf6f6d484f67b2f82](https://bscscan.com/address/0x43c743e316f40d4511762eedf6f6d484f67b2f82)

**[Venus's supply cap is enforced in one place](https://x.com/hackenclub/status/2033578742275063994):** The mint() function, the standard deposit path. It checks whether a new deposit would breach the cap. If it would, the transaction reverts.

  
_[What it does not check is a raw ERC-20 transfer()](https://x.com/hackenclub/status/2033578742275063994) sent directly to the vTHE contract. That path bypasses mint() entirely._  
  

**[Tokens transferred this way still land in the contract](https://community.venus.io/t/the-market-incident-post-mortem/5712). The contract's balanceOf() still counts them. The vToken exchange rate, which determines how much collateral each vTHE token represents, updates accordingly. The supply cap just never sees them.**  
  

The attacker's existing vTHE token count never changed. [No new vTokens were minted. The same position, the same number of tokens, went from representing roughly $3.3M in collateral to over $12M](https://www.quillaudits.com/blog/hack-analysis/venus-5m-exploit), purely because the exchange rate beneath it had been inflated 3.81× by tokens the protocol never tracked.  
  

[This is the donation attack](https://community.venus.io/t/the-market-incident-post-mortem/5712). Transfer tokens directly to the contract, inflate the exchange rate, borrow against collateral the cap was designed to prevent you from having.  
  

A known vulnerability in every Compound V2 fork. Flagged in Venus's own [Code4rena audit in 2023](https://code4rena.com/reports/2023-05-venus). Dismissed by the team as "supported behavior with no negative side effects."  
  

**[The cap breach unfolded as follows](https://x.com/AllezLabs/status/2033239532355858536):**
_12.2M THE supplied via normal deposits - 84% of cap, within limits._  
_49.5M THE - 341% of cap - via direct donation transfers._  
_53.2M THE - 367% of cap - at peak, just before liquidation._

  
[Six wallets coordinated the donation transfers](https://community.venus.io/t/the-market-incident-post-mortem/5712), pushing a combined ~36M THE directly into the vTHE contract in the opening transaction.  
  
**Attack Contract:**  
[0x737bc98f1d34e19539c074b8ad1169d5d45da619](https://bscscan.com/address/0x737bc98f1d34e19539c074b8ad1169d5d45da619)

[The attack contract held no collateral itself,](https://community.venus.io/t/the-market-incident-post-mortem/5712) it was granted delegated permission to draw on [0x1a35's](https://bscscan.com/address/0x1a35bd28efd46cfc46c2136f878777d69ae16231) borrowing power.  
  
Two addresses. One position. The structure let the attacker operate the extraction separately from the collateral base that made it possible.  
  

_**[With a collateral position 3.67 times the intended maximum, the attacker had what they came for](https://x.com/AllezLabs/status/2033239544234189168):** Outsized borrowing power against a token whose on-chain liquidity could barely support a fraction of the position's nominal value._

  

**The loop started.**  
  

[Deposit THE as collateral. Borrow CAKE, BNB, BTCB, USDC against it.](https://x.com/AllezLabs/status/2033239567902650877) Use the borrowed assets to buy more THE on DEX - thin liquidity, violent price impact.  
  

[Transfer the newly acquired THE directly into vTHE, bypassing the cap again.](https://x.com/hackenclub/status/2033578745257156901) Wait for the TWAP oracle to catch up to the manipulated price. Repeat.  
  

[THE's spot price was pushed from roughly $0.26 to nearly $4](https://community.venus.io/t/the-market-incident-post-mortem/5712) on the thinnest DEX liquidity available.  
  
_[Venus's Resilient Oracle, which cross‑checks prices from multiple sources including RedStone and Binance,](https://community.venus.io/t/the-market-incident-post-mortem/5712) didn't simply follow the price up._

  

**[The BoundValidator rejected the spiking Binance feed for approximately 37 minutes](https://community.venus.io/t/the-market-incident-post-mortem/5712) as the divergence grew too wide to accept.**  
  
[Only when the attacker sustained enough buy pressure across multiple venues to force both feeds](https://community.venus.io/t/the-market-incident-post-mortem/5712) to converge did the BoundValidator accept the new rate.  
  
[The oracle caught up to roughly $0.51](https://community.venus.io/t/the-market-incident-post-mortem/5712), not the $4 spot peak, but still nearly double the pre-attack level, and enough to justify another round of borrowing.  
  
The oracle had caught up. The position was loaded. What followed was the extraction.

  
**Attack Transaction:** [0x4f477e941c12bbf32a58dc12db7bb0cb4d31d41ff25b2457e6af3c15d7f5663f](https://bscscan.com/tx/0x4f477e941c12bbf32a58dc12db7bb0cb4d31d41ff25b2457e6af3c15d7f5663f)

  
**Second Attack Transaction:** [0xce6e3eb2a28ced1ef1c2212f36736e89f647365b0dfad6c9addc4c8b31f5fb0e](https://bscscan.com/tx/0xce6e3eb2a28ced1ef1c2212f36736e89f647365b0dfad6c9addc4c8b31f5fb0e)

  
_At peak, [the position held 53.2M THE as collateral](https://x.com/AllezLabs/status/2033239544234189168) against [6.67M CAKE, 2,801 BNB, 1.97K WBNB, 1.58M USDC, and 20 BTCB borrowed against it](https://x.com/AllezLabs/status/2033239567902650877)._  
  
**[The total borrowed at peak was approximately $14.9M](https://community.venus.io/t/the-market-incident-post-mortem/5712), the $3.7M figure widely reported represents net extracted assets after the position unwound through liquidation.**  
  
Around 50 exploit transactions in total, [per Hacken's analysis.](https://x.com/hackenclub/status/2033578737413874139)

[The attack contract had also pre-supplied 1.58M USDC as collateral and borrowed 4.63M THE at 11:55 UTC](https://x.com/AllezLabs/status/2033239567902650877), during the same opening window as the main attack. [That position began liquidating at 12:04 UTC](https://x.com/AllezLabs/status/2033239567902650877), nearly forty minutes before the primary position peaked.

  
Then the attacker got greedy.  
  

_[Rather than exiting after the first extraction, they kept buying THE with borrowed funds,](https://x.com/hklst4r/status/2033192855443808515) trying to force another leg up, another oracle update, another round of borrowing power. Sell pressure mounted. The market stopped moving. The account's health factor crept toward 1.0, the liquidation threshold._  
  

**When liquidation triggered, [53.2M THE hit an order book with almost no depth. The price collapsed to $0.22, below where it started.](https://community.venus.io/t/the-market-incident-post-mortem/5712)**  
  
[The $30M in nominal collateral value](https://community.venus.io/t/the-market-incident-post-mortem/5712) that existed on paper evaporated.  
  
**[Venus was left with $2.15 million in unrecoverable bad debt](https://community.venus.io/t/the-market-incident-post-mortem/5712):** 1.18M CAKE and 1.84M THE that no liquidation proceeds could cover.

  

**The extracted funds remain in the attacker's wallet. No mixer activity detected as of publication. No exit path apparent on-chain.**

  

_Nominal collateral value and realizable liquidation value are not the same number, so why does Venus's risk framework treat them as if they are?_  
  
### The Warning They Filed Away

  

_Venus didn't miss this vulnerability. [They read it, considered it, and assessed it as having “no negative side effects."](https://community.venus.io/t/the-market-incident-post-mortem/5712)_

  

**[May 2023, Code4rena's audit contest of Venus Isolated Pools documented the donation attack in detail](https://code4rena.com/reports/2023-05-venus), including a working proof of concept under finding M-10.**  
  
[Mint vTokens, donate underlying tokens directly to the contract](https://code4rena.com/reports/2023-05-venus), watch the exchange rate inflate, borrow against collateral you were never supposed to have. The mechanics were spelled out. [The math was there](https://code4rena.com/reports/2023-05-venus).

  
**[Poorly enough that Allez Labs put it on the record in the official March 17 post-mortem, word for word](https://community.venus.io/t/the-market-incident-post-mortem/5712):** The vector "was identified in a prior Code4rena audit but was assessed as having 'no negative side effects' and was not remediated."  
  
Not a researcher's characterization. Not a journalist's reconstruction. Venus's own risk manager, in the formal post-mortem, confirming the dismissal happened and naming it as a root cause.

  
_February 2025, a [donation attack hit Venus's ZKSync deployment.](https://community.venus.io/t/post-mortem-wusdm-donation-attack-on-venus-zksync/5004) Not a theoretical risk, an actual exploit, using mechanics nearly identical to what just happened on BNB Chain._  
  
**The wUSDM exchange rate was manipulated via a direct ERC-4626 donation. Venus froze the market. [The protocol absorbed $902,159 in bad debt, later offset by $163,757 in liquidation fees, leaving a net loss of $716,789](https://community.venus.io/t/post-mortem-wusdm-donation-attack-on-venus-zksync/5004).**  
  
[A post-mortem was published on the Venus community forum.](https://community.venus.io/t/post-mortem-wusdm-donation-attack-on-venus-zksync/5004) The BNB Chain Core Pool shared the same vulnerability. Venus did not patch it.  
  

**That's the sequence:**  [Auditors flag the vector in 2023](https://code4rena.com/reports/2023-05-venus#m-10-exchange-rate-can-be-manipulated), the team dismisses it. An attacker [exploits the same vector in 2025](https://community.venus.io/t/post-mortem-wusdm-donation-attack-on-venus-zksync/5004), the team absorbs the loss.  
  
An attacker exploits it again in 2026, on the chain that was never patched, and the team [calls it "a gap in our code we are working to close."](https://x.com/venusprotocol/status/2033472117321408870)

_**[Hacken flagged it explicitly in the aftermath](https://x.com/hackenclub/status/2033578751426977931):** "Attention Compound V2 forks: Verify whether direct token transfers to your cToken contracts bypass supply-cap logic. If so, the same attack pattern may still be exploitable."_  
  

**[Venus is a Compound fork](https://www.allcryptowhitepapers.com/wp-content/uploads/2020/12/Venus-Protocol.pdf). The warning applied to them directly. It applied to them in 2023 when Code4rena raised it. It applied to them again in [February 2025 when ZKSync proved the concept cost real money](https://community.venus.io/t/post-mortem-wusdm-donation-attack-on-venus-zksync/5004).**  
  

Hopefully, every other Compound V2 fork running the same mint() enforcement gap is now reading these same words and deciding whether to act on them or file them away.  
  

[The community had also flagged the attacker's accumulation address before March 15th.](https://x.com/hackenclub/status/2033578740123353585) Concentrated supply, dominant position in a low-liquidity market, [wallet traceable to Tornado Cash funding](https://x.com/hackenclub/status/2033578747262099778). No action was taken, because every individual deposit was technically within the rules. [The rules just had a gap](https://x.com/venusprotocol/status/2033472117321408870).  
  

[Venus's own post-incident criteria for pausing markets, market cap under $2B](https://x.com/VenusProtocol/status/2033237615194034643), 24h trading volume under $100M, DEX TVL under $40M, single-user concentration above 60%, described the THE market precisely.  
  
Those thresholds exist now. They did not exist as enforcement triggers before March 15th.  
  

**Venus had the audit contest finding, the prior exploit, and the community flag, three separate signals pointing at the same gap.**  
  

_How many warnings does a protocol need before inaction becomes a de facto policy?_

  
### Did He Even Win?

  

_[Venus is sitting on $2.15 million in bad debt](https://community.venus.io/t/the-market-incident-post-mortem/5712). The attacker may be sitting on a loss._

  

**[The on-chain math doesn't work out](https://community.venus.io/t/the-market-incident-post-mortem/5712). The attacker entered with 7,447 ETH sourced through Tornado Cash and borrowed an additional $9.92 million via Aave to fund the accumulation phase.**  
  
Against that, they extracted roughly [$5.07 million in assets from Venus](https://www.theblock.co/post/393622/venus-protocol-left-with-roughly-2m-in-bad-debt-after-exploit-manipulates-thenas-the-token-price) - 2,172 BNB, 1.516 million CAKE, and 20 BTCB.  
  
[The position carried roughly $30 million](https://x.com/hklst4r/status/2033192855443808515) in nominal collateral value on paper. [Liquidation turned that into nothing](https://community.venus.io/t/the-market-incident-post-mortem/5712).  
  

**[EmberCN put it plainly](https://x.com/EmberCN/status/2033204517467308144?s=20):** "He borrowed 9.92 million U (stablecoins) to stir things up, but the assets borrowed from Venus were only worth $5.07 million. Onchain alone, it doesn't look profitable."  
  
_**[William Li, speaking to The Block, was equally blunt](https://www.theblock.co/post/393622/venus-protocol-left-with-roughly-2m-in-bad-debt-after-exploit-manipulates-thenas-the-token-price):** "From onchain analysis, he almost didn't profit._

  
**[The official post-mortem goes further](https://community.venus.io/t/the-market-incident-post-mortem/5712). Allez Labs confirmed on-chain analysis shows no net gain, then added: "The strategy could include independent wallets or CEX accounts, to long/short THE. We are coordinating with exchanges and forensic partners to pursue this line of investigation."**  
  
The CEX perp hypothesis isn't speculation anymore, it's the active thread Venus and its partners are pulling.

  
[The extracted funds remain parked in the attacker's wallet](https://debank.com/profile/0x1a35bd28efd46cfc46c2136f878777d69ae16231), with no clear exit path visible on-chain as of publication. No Tornado Cash activity. No bridge movements. Just sitting there.

  
There is one scenario where the numbers flip. [If the attacker holds large short perpetual positions on THE at a CEX](https://x.com/hklst4r/status/2033192855443808515), shorting into the pump, then collecting on the collapse to $0.21, the on-chain loss becomes irrelevant.  

_[The protocol damage was the mechanism, not the payday.](https://community.venus.io/t/the-market-incident-post-mortem/5712) THE's spot price ran from $0.26 to nearly $4, then crashed below its starting point._ 
  
**Anyone short from the top made serious money. That position can't be verified on-chain.**

  
[Li himself demonstrated exactly this trade.](https://x.com/hklst4r/status/2033192855443808515) He shorted THE on a perpetual futures contract as liquidation began and closed the position near $0.24.  
  
**[Profit](https://x.com/hklst4r/status/2033192855443808515):** $15,000.  
  
Same playbook, smaller scale, fully disclosed.  
  

**[EmberCN flagged the same hypothesis:](https://x.com/EmberCN/status/2033204517467308144?s=20)** "I suspect he dominated the THE downturn through on-chain liquidations to profit from his positions on the CEX."  
  

[Nine months of preparation, 7,447 ETH seeded through a mixer](https://community.venus.io/t/the-market-incident-post-mortem/5712), [a near-identical exploit already on the record from 2025](https://community.venus.io/t/post-mortem-wusdm-donation-attack-on-venus-zksync/5004), and the attacker may have broken even at best, made nothing, or made their real money on a derivatives position nobody can trace. Venus absorbed the bad debt regardless of which version is true.  
  

**Nine months of setup, an academic paper modeling the exact attack, a prior exploit on the same codebase, and Venus is left holding the bill no matter which version of the attacker's P&L is true.**  
  
_So who actually paid the price here?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_[Four incidents in five years](https://x.com/hit9crypto/status/2033188343098351620?s=46). One protocol that keeps surviving things that would have buried anything else._

  

**$95 million in bad debt [from an XVS price manipulation in 2021.](https://www.chaincatcher.com/en/article/2252203)**

  
[$14.2 million from the LUNA crash in May 2022](https://medium.com/venusprotocol/venus-protocol-luna-incident-update-2-c334475d9214), as attackers exploited a stalled Chainlink oracle to borrow against artificially inflated LUNA collateral.

[$717,000 from a donation attack on Venus's own ZKSync deployment in February 2025](https://community.venus.io/t/post-mortem-wusdm-donation-attack-on-venus-zksync/5004), a structurally related exploit on a different chain, a warning that went unheeded.  
  
[And now $2.15 million more](https://community.venus.io/t/the-market-incident-post-mortem/5712), left on the books after a nine-month setup that the community flagged, that an auditor documented, that a prior exploit had already demonstrated was real.

  
[Venus called it a gap](https://x.com/venusprotocol/status/2033472117321408870). William Li [called it a Mango Markets like-attack](https://x.com/hklst4r/status/2033159804626112932) before Venus had issued a single statement. [Hacken called it a warning to every Compound V2 fork](https://x.com/hackenclub/status/2033578751426977931) still running the same logic. The [Code4rena auditor called it in 2023](https://code4rena.com/reports/2023-05-venus), but it was assessed as having 'no negative side effects' and was not remediated.

  
_**Every response lands in the same place:** Supply cap hardening, tighter collateral eligibility, price monitoring safeguards._  
  
**The same commitments that follow every incident, rebuilt on top of the rubble of the last ones.**  
  
**[This time the list is longer](https://community.venus.io/t/the-market-incident-post-mortem/5712):** A formal governance VIP for bad debt resolution, coordination with law enforcement on the Tornado Cash-sourced funding trail, and a complete re-audit of the entire core pool.  
  
Whether the longer list means a longer memory is the question Venus hasn't answered yet.  
  

[ChainCatcher called Venus the “most experienced” project in the space at dealing with hacker attacks.](https://www.chaincatcher.com/en/article/2252203) That's one way to read it.  
  
_**Another way to frame it:** 5 years of evidence that surviving an exploit is not the same as learning from one._

  
**The attacker is sitting on extracted funds with no exit path visible. Venus is sitting on bad debt with a governance [resolution pending](https://community.venus.io/t/the-market-incident-post-mortem/5712).**  
  
[The official post-mortem confirmed](https://community.venus.io/t/the-market-incident-post-mortem/5712) the bad debt will be covered by the protocol.

  
[They also announced as part of their short term remediation](https://community.venus.io/t/the-market-incident-post-mortem/5712): “Reduce collateral factors for illiquid assets; introduce more conservative liquidity-weighted calibrations. All market configurations and collateral parameters, with potential delistings.”

  
Venus survived again. It always does, like a defi cockroach.  
  

The question isn't whether Venus will survive this one. It will.  
  
**The question is how many Compound V2 forks are reading [Hacken's warning](https://x.com/hackenclub/status/2033578751426977931) right now and deciding it doesn't apply to them, and how many of those forks will be writing the same post-mortem in six months.**  
  

_Venus keeps surviving. Does anyone else have to get rekt before the rest of the ecosystem acts on the same warning Venus already ignored twice?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
