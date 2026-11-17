---
tags:
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/governance
  - web3-sector/lending
  - web3-sector/oracle
  - web3-sector/stable
  - vuln/reentrancy/single-function
  - trigger/flash-loan
  - trigger/low-liquidity
  - precondition/flash-loan-available
  - novelty/known-pattern
  - type/hack
  - vector/access-control
  - vector/flash-loan
  - vector/price-manipulation
  - vector/reentrancy
  - vector/social-engineering
title: "Nostra - Rekt"
protocol: "Nostra"
date: 2026-09-17
loss_usd: 3500000
audit: "N/A"
source: "https://rekt.news/nostra-rekt"
excerpt: "A rigged pool fed Nostra's oracle a fake NSTR price, 8,306x real value, unlocking a $3.5 million borrow on Starknet. Pragma says it warned Nostra the feed was high-risk beforehand. Money market is sti"---
# Nostra - Rekt

> **Loss:** $3,500,000 | **Date:** 2026-09-17 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/nostra-rekt-header.png)




_[Eight thousand three hundred and six](https://x.com/sprunky_eth/status/2100839003557691673). That is roughly how many times Nostra's own oracle inflated the price of its own token in its own lending market, [within an eleven-minute window](https://x.com/sprunky_eth/status/2100838909928227313)._  
  
**[NSTR's circulating value was estimated at about $550,000 that morning by third-party trackers](https://beincrypto.com/nostra-starknet-oracle-exploit-market-paused/), not by Nostra's own pricing, [yet one account used the distorted print to borrow roughly $3.5 million in ETH, STRK, USDC, USDT, WBTC, and DAI](https://x.com/nostrafinance/status/2100577538053493076), a figure Nostra itself confirmed.**  
  
There was no flash loan here, no reentrancy bug, just an attacker-seeded, thin-liquidity pool, [a GeckoTerminal-derived market quote that appears to have entered Pragma's price pipeline](https://x.com/Phalcon_xyz/status/2100818035082952751), and an oracle that blended the resulting quote with a clean one instead of rejecting the gap between them.  
  
[By one independent reconstruction](https://x.com/sprunky_eth/status/2100839003557691673), the NSTR posted behind that loan had a clean-market value of roughly $421, pocket change dressed up as collateral.

[Nostra disclosed the incident with its money market already paused](https://x.com/nostrafinance/status/2100577538053493076) and said a post-mortem would follow.  
  
The protocol had already disclosed a version of this fragility once before, [pausing borrowing against two other tokens in March 2025, after its oracle overstated their value roughly threefold and admitting it had no fallback source](https://cointelegraph.com/news/lending-protocol-nostra-reports-critical-price-feed-issue), a different asset and a different mechanism, but the same broader oracle-risk problem.  
  
**Eighteen months later, that risk resurfaced in a far more consequential form.**  
  
_Was that first warning ever actually fixed, or just filed away?_  

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Sprunky](https://x.com/sprunky_eth/status/2100838855872037296), [BeinCrypto](https://beincrypto.com/nostra-starknet-oracle-exploit-market-paused/), [Nostra](https://x.com/nostrafinance/status/2100577538053493076), [Blocksec](https://x.com/Phalcon_xyz/status/2100818035082952751), [CoinTelegraph](https://cointelegraph.com/news/lending-protocol-nostra-reports-critical-price-feed-issue), [PeckShield](https://x.com/PeckShieldAlert/status/2100747001516454390), [CertiK](https://x.com/CertiKAlert/status/2100774528494526812), [BlockSec](https://x.com/Phalcon_xyz/status/2100818035082952751), [AMLBot](https://x.com/AMLBotHQ/status/2101007274840134041), [GoPlus Security](https://x.com/GoPlusSecurity/status/2100869014633468266), [Pragma](https://docs.pragma.build/starknet/architecture), [DBCrypto](https://x.com/DBCrypt0/status/2101022722352730464), [DefiLlama](https://beincrypto.com/nostra-starknet-oracle-exploit-market-paused/), [Vesu](https://docs.vesu.xyz/blog/2026-09-13-incident-refunds)_

**On September 17th, Nostra disclosed its own incident.**

[The protocol's own Twitter account said a manipulated NSTR oracle price had enabled one account to borrow roughly $3.5 million against inflated collateral](https://x.com/nostrafinance/status/2100577538053493076), and announced that its money market was already paused, lending, borrowing, withdrawals, and liquidations, all unavailable.  
  
[Nostra's statement appeared before public posts](https://x.com/nostrafinance/status/2100577538053493076) from [PeckShield](https://x.com/PeckShieldAlert/status/2100747001516454390), [CertiK](https://x.com/CertiKAlert/status/2100774528494526812), and other security trackers.  
  
What it doesn't establish is when Nostra detected the manipulation, when it executed the pause, or whether outside researchers had already identified the relevant transactions privately.

  
_The public forensic accounting began about eleven hours later._

**[PeckShield quote-tweeted Nostra's statement with the first number that mattered beyond the headline figure](https://x.com/PeckShieldAlert/status/2100747001516454390), roughly $1.92 million already bridged to Ethereum, broken down to 234.57 ETH and 1.3 million DAI.**  
  
[CertiK followed within two hours, first confirming the price manipulation](https://x.com/CertiKAlert/status/2100774528494526812), then eighteen minutes later [posting the fund split, about $1.55 million still sitting on the Starknet contract, another $1.93 million already on an Ethereum address](https://x.com/CertiKAlert/status/2100779085467402278).  
  
[BlockSec's Phalcon thread laid out the mechanics that the earlier alerts hadn't detailed](https://x.com/Phalcon_xyz/status/2100818035082952751), an attacker-created NSTR/SolvBTC pool, one-sided liquidity, a small trade that sharply moved the reported quote, each step tied to a transaction hash.  
  
[Independent researcher Sprunky then expanded the reconstruction, decoding the actual Pragma price prints](https://x.com/sprunky_eth/status/2100838909928227313), a clean AVNU quote, followed ten minutes and forty seconds later by a poisoned GeckoTerminal-derived quote, and [running a detailed independent calculation that put the gap between the real NSTR/ETH rate and the one the borrow actually used at roughly 8,306x](https://x.com/sprunky_eth/status/2100839003557691673).

  
_By the next morning, [AMLBot said it had traced the exit route, Near Intents, CCTP, and LayerZero OFT stitched together to move funds off Starknet](https://x.com/AMLBotHQ/status/2101007274840134041), with roughly $1.6 million still parked at the Starknet address at the time._  
  
**[GoPlus Security's own reconstruction landed that same day, and it went further back than anyone else had reported, tracing the attacker's NSTR accumulation to March and August](https://x.com/GoPlusSecurity/status/2100869014633468266), months before the pool used in the manipulation was actually created.**  
  

[Nostra disclosed the incident before the public forensic threads](https://x.com/nostrafinance/status/2100577538053493076) assembled the fuller picture.  
  
[The relevant NSTR accumulation predated the manipulation by months](https://x.com/GoPlusSecurity/status/2100869014633468266), that's what the record shows, not that anyone could have flagged an ordinary-looking wallet as a future exploit months in advance.  
  
The attacker didn't need six months of undetected activity to pull this off.  
  
**They needed one thin, attacker-shaped pool to become a valid price source for borrowable collateral on the one day they chose to use it.**  
  
_So why did Nostra's controls treat that pool's price as valid at all?_

  
### The Oracle That Split the Difference

  
_The attacker didn't need to break Pragma's contract. They needed to feed it a lie convincing enough that averaging it with the truth still produced a number worth borrowing against._

  
**[BlockSec's Phalcon reconstruction](https://x.com/Phalcon_xyz/status/2100818035082952751) lays out the setup in three moves.**  
  
First, [a brand new NSTR/SolvBTC pool, seeded with about 1.5 SolvBTC placed one-sided](https://x.com/Phalcon_xyz/status/2100818035082952751), away from where the token actually traded.  
  
Second, [that reported liquidity appears to have influenced GeckoTerminal's pool-selection behavior](https://x.com/Phalcon_xyz/status/2100818035082952751), pulling the new, thin pool into play as a reference for NSTR's price.  
  
Third, [a small buy inside the now-rigged pool sent its quoted price from a fraction of a cent to just over $99](https://x.com/Phalcon_xyz/status/2100818035082952751).  
  
**New Pool Created:**  
[0x741af6efcc55165e89f7ef0b8ebad7e87efeaa8daa3b60dddd62d5dcacae69d](https://voyager.online/tx/0x741af6efcc55165e89f7ef0b8ebad7e87efeaa8daa3b60dddd62d5dcacae69d)[Pragma’s aggregation was designed to reduce the risk that any one manipulated feed could dominate](https://docs.pragma.build/starknet/architecture). 

_Pragma first establishes a price for each source by taking the median of publisher-submitted values; the consuming protocol then selects the final method for combining those source-level prices._

**[Its integration guidance recommends at least three pricing sources](https://www.pragma.build/updates/nostra-nstr-incident#risk), alongside freshness checks and thresholds appropriate to an asset’s risk.**

  
Only two inputs appear to have contributed that morning, [an AVNU-derived reference quote near $0.00596 and a manipulated GeckoTerminal-derived quote near $99.02](https://x.com/Phalcon_xyz/status/2100818035082952751).  
  

With a third source missing, [the two available values produced a midpoint of roughly $49.52](https://x.com/Phalcon_xyz/status/2100818035082952751).  
  
In Sprunky's reconstruction, [that midpoint was the final aggregate returned to the Nostra market](https://x.com/sprunky_eth/status/2100838952424951909), the figure used to value NSTR collateral.  
  
_[Sprunky traced the borrowing transaction to an NSTR/ETH collateral rate of 0.02032399](https://x.com/sprunky_eth/status/2100838952424951909), versus an estimated real NSTR/ETH rate of [0.00000244689, a 8,306-fold inflation at the time of the borrow](https://x.com/sprunky_eth/status/2100839003557691673)._

  
**That ratio didn't depend on ETH's dollar price that morning.**  
  
Pragma's post-incident update goes beyond confirming the two-source gap. [It says NSTR had already been classified as a high-risk feed because of limited liquidity and available pricing sources](https://www.pragma.build/updates/nostra-nstr-incident#summary), and that Pragma had previously highlighted these risks to Nostra.  
  
[It also says Gate.io was removed as an NSTR source at Nostra's request because of illiquidity and manipulation concerns](https://www.pragma.build/updates/nostra-nstr-incident#summary), leaving limited source coverage in the months before the incident.

  

Removing a weak source may have been reasonable.  
  
_**The issue is what came next:** NSTR was a high-risk, source-limited feed, yet its two available prices still produced a collateral valuation that Nostra used to authorize borrowing against other assets._

**[Pragma says a mandatory three-source minimum would have rejected the manipulated response](https://www.pragma.build/updates/nostra-nstr-incident#risk). And Pragma's reconstruction says it found no decimal or median-calculation error.** 
  
The aggregation math, in other words, appears to have produced exactly the output the configuration permitted.

Run the collateral math and the absurdity gets worse, not better. By Sprunky’s reconstruction, [roughly 70,686 NSTR posted against the loan had a real-market value of about $421](https://x.com/sprunky_eth/status/2100839003557691673), yet supported approximately $3.5 million in borrowing, more than $8,000 borrowed for every dollar of estimated real collateral value.  
  
[That figure is an independent reconstruction](https://x.com/sprunky_eth/status/2100839003557691673), not a Nostra-confirmed accounting, but it explains why the attack never needed much real collateral to begin with.  
  
_[NSTR's estimated circulating market cap sat around $550,000 that morning](https://beincrypto.com/nostra-starknet-oracle-exploit-market-paused/), which [puts the borrowed assets at more than six times NSTR's entire circulating market cap](https://x.com/DBCrypt0/status/2101022722352730464), a comparison that's illustrative rather than a solvency test since market cap was never meant to double as a borrowing limit._

**The public record establishes the outcome, not the reason. An extreme divergence between two price inputs was accepted, a missing third input didn't prevent a borrowable value from being produced, and the resulting NSTR collateral value was sufficient to authorize millions in debt.**  
  
What it doesn't yet establish is why no effective safeguard intervened.  
  
What the public record does not yet establish is what controls, if any, Nostra applied to NSTR’s price inputs and collateral valuation, or why they allowed this price to authorize borrowing. Nostra’s code review and promised post-mortem should answer that.  
  
Every component may have behaved exactly as configured. That's precisely why the configuration is an open question.

If a protocol can average a $0.006 quote with a $99 quote and call the result a collateral price, the manipulated pool was not the whole failure. The deeper failure was an oracle architecture that never asked whether $49.52 made economic sense.

**The oracle didn't test whether the number was economically credible.**  
  
_Once it cleared, who was left checking where the $3.5 million it unlocked actually went?_

### Six Assets, Seven Borrow Transactions  
  
_[The core transactions in BlockSec's Phalcon reconstruction are public on-chain](https://x.com/Phalcon_xyz/status/2100818035082952751), and the key hashes are available for independent review._  
  
**What follows is the full chain, in order: the pool that made the manipulation possible, the trade that spiked its price, the two oracle entries Pragma recorded from it, and then every transaction in the borrow itself, asset by asset.**  
  

**Pool creation (an NSTR/SolvBTC pool seeded with roughly 1.5 SolvBTC as one-sided liquidity):**
[0x741af6efcc55165e89f7ef0b8ebad7e87efeaa8daa3b60dddd62d5dcacae69d](https://voyager.online/tx/0x741af6efcc55165e89f7ef0b8ebad7e87efeaa8daa3b60dddd62d5dcacae69d)

**Price-moving trade (a small transaction inside that thin pool that pushed its reported NSTR quote toward $99):** [0x772e73613ffbc845508377fc6ded1137f60ad730aecb2b7c18a2978a84a6ac1](https://starkscan.co/tx/0x772e73613ffbc845508377fc6ded1137f60ad730aecb2b7c18a2978a84a6ac1)

**AVNU oracle entry: A 05:37 UTC publish_data_entries transaction decoded as an NSTR quote of $0.00596118:** [0x1d33ab3d3ff72c82d7b1b6b317d28eff38abd03c0f084985c30b14859328b7f](https://starkscan.co/tx/0x1d33ab3d3ff72c82d7b1b6b317d28eff38abd03c0f084985c30b14859328b7f)

**GeckoTerminal oracle entry: A 05:47 UTC publish_data_entries transaction decoded as a manipulated NSTR quote of $99.02439975:** [0x6bc9b41bce2b6c08639c16790af064efafa15890c1ebf8cc72df99a577a1cf1](https://starkscan.co/tx/0x6bc9b41bce2b6c08639c16790af064efafa15890c1ebf8cc72df99a577a1cf1)

**ETH borrow (939.30 ETH, ~$2,297,659.30 at the September 17th price of $2,446.14):** [0x2460fde607d09f2434d1b4e6d4089c6e1f459f4ce70ba2853d3a37547cdf00e](https://starkscan.co/v1/SN_MAIN/tx/0x2460fde607d09f2434d1b4e6d4089c6e1f459f4ce70ba2853d3a37547cdf00e/trace)

  

**STRK borrow (28,272,985.90 STRK, ~$819,250.48 at the September 17th price of $0.02897644):**
[0x79005742a8f7fe443a4a0d444f053ba06a49a15d558662404aa894479ddb820](https://voyager.online/tx/0x79005742a8f7fe443a4a0d444f053ba06a49a15d558662404aa894479ddb820)

  

**USDC.e borrow (113,661 USDC.e, ~$113,648.39):** [0x34bb10618939a14db2f613acad1d63bfbfb96908fdb6a6f2fb65a07af6a200a](https://voyager.online/tx/0x34bb10618939a14db2f613acad1d63bfbfb96908fdb6a6f2fb65a07af6a200a)

  

**USDT borrow (84,377 USDT, ~$84,365.93):** [0x61eacbd4f4fc4230a6e3b204ff0cdc26939db0663f3bec1418f51b79c5b0647](https://voyager.online/tx/0x61eacbd4f4fc4230a6e3b204ff0cdc26939db0663f3bec1418f51b79c5b0647)

  

**WBTC borrow, first (2 WBTC, ~$152,742.00 at the September 17th price of $76,371):** [0x373be1419cb2b5d0ef7fc684070857dbe88235e81c29fbe5d8e053640968fb4](https://voyager.online/tx/0x373be1419cb2b5d0ef7fc684070857dbe88235e81c29fbe5d8e053640968fb4)

  

**DAI borrow (29,078 DAI, ~$29,264.11):** [0x5a8a94a14cc2950f81f5409c992218fa25827b4e2b9ec9a1d4b33bd623bc54d](https://voyager.online/tx/0x5a8a94a14cc2950f81f5409c992218fa25827b4e2b9ec9a1d4b33bd623bc54d)

  

**WBTC borrow, second (0.88 WBTC, ~$67,206.48 at the September 17th price of $76,371):** [0x439ab7565b07299ad1f6cb57ee10e9f47dd80b1b98a4bac2ba696a0934ce95](https://voyager.online/tx/0x439ab7565b07299ad1f6cb57ee10e9f47dd80b1b98a4bac2ba696a0934ce95)

_**Total borrowed:** Approximately $3.56 million across six assets, priced at their September 17th values, [consistent with the $3.5 million Nostra itself confirmed](https://x.com/nostrafinance/status/2100577538053493076)._

  
The borrowed assets were subsequently sold through approximately 80 transactions across AVNU, Ekubo and JediSwap, [according to GoPlus Security’s on-chain reconstruction](https://x.com/GoPlusSecurity/status/2100869014633468266).  
  
**[The reconstruction describes a two-stage exit route](https://x.com/GoPlusSecurity/status/2100869014633468266):** Sales on Starknet, followed by transfers through intermediary accounts and movement via NEAR Intents.  
  

**GoPlus attributes the seven-transaction Nostra borrowing sequence to this Starknet account:**
[0x06d48ef7ab62c26e3ef1987c322096cd508e9034c82048783a6b438fc1344bc3](https://voyager.online/contract/0x06d48ef7ab62c26e3ef1987c322096cd508e9034c82048783a6b438fc1344bc3)

  
**It separately attributes the thin-pool trading and price movement that preceded the oracle distortion to this Starknet account:** [0x2d9fb4edec9d5c015c43514ca5a309aab1b2638c3a45ad750d09ee971d0da23](https://voyager.online/contract/0x2d9fb4edec9d5c015c43514ca5a309aab1b2638c3a45ad750d09ee971d0da23)

**After the DEX sales, 1.2 million STRK moved to this first transit account:** [0x0285b4bf99e227c4baed7f9a8c7c673771fe0b75e897f7350729e3e13021321d](https://voyager.online/contract/0x0285b4bf99e227c4baed7f9a8c7c673771fe0b75e897f7350729e3e13021321d)

**Another 1.0 million STRK moved to this second transit account:** [0x074f5318f8d60ad0832068dc0430d0a0e2f9dd0c2e710fb8c032945a3804b57e](https://voyager.online/contract/0x074f5318f8d60ad0832068dc0430d0a0e2f9dd0c2e710fb8c032945a3804b57e)

  
[According to GoPlus](https://x.com/GoPlusSecurity/status/2100869014633468266), both intermediary accounts then moved funds through NEAR Intents.  
  
**The reconstruction identifies this Ethereum wallet as a consolidation point:** [0xa059aaab82773caf622de9d9a0f2dbf9aa7f3c37](https://etherscan.io/address/0xa059aaab82773caf622de9d9a0f2dbf9aa7f3c37)  
  

**[The reported route is therefore](https://x.com/GoPlusSecurity/status/2100869014633468266):** Nostra borrows → AVNU / Ekubo / JediSwap sales → two Starknet transit accounts → NEAR Intents→Ethereum consolidation

**The on-chain route shows how the assets moved; the next question is what the attack’s aftermath meant for the protocol and the people whose funds remained inside it.**

_The funds can be traced leaving Nostra, but what did the exploit leave behind for the protocol, its markets and its depositors?_  
  
### When the Price Feed Becomes the Attack Surface  
  
_[Nostra’s disclosure of roughly $3.5 million in unauthorized borrowing](https://x.com/nostrafinance/status/2100577538053493076) did not stop users from leaving._  
  
**The exploit had consequences, [Nostra’s total value locked had fallen from about $4.15 million on September 16 to roughly $743k on September 18th, according to DefiLlama](https://beincrypto.com/nostra-starknet-oracle-exploit-market-paused/), while [NSTR’s estimated circulating market value stood at about $546,751](https://beincrypto.com/nostra-starknet-oracle-exploit-market-paused/).**

[In its initial statement, Nostra said it had paused lending, borrowing, withdrawals and liquidations](https://x.com/nostrafinance/status/2100577538053493076); that the final loss and potential recoveries remained unknown; and that it would publish a detailed post-mortem.  
  
**[It also warned that it would never send direct messages or ask users to connect a wallet as part of recovery efforts](https://x.com/nostrafinance/status/2100577538053493076):** A warning worth repeating, since exploit-response periods are especially fertile ground for impersonation and phishing attempts.

Nostra was not the only Starknet oracle incident that month. On September 4, less than two weeks earlier, [an upstream price-feed fault caused the oracle used by Vesu to report several assets at roughly half their real value for 109 seconds](https://docs.vesu.xyz/blog/2026-09-13-incident-refunds).

_[The error triggered 47 liquidations across 42 borrower wallets](https://www.pragma.build/updates/vesu-incident) in seven Vesu pools._

**The Vesu event was not a market-manipulation attack. It was a faulty price-publication event.**

**[Vesu later said it had recovered 95% of the affected value at then-current prices, or 93% at prices from the morning of the incident](https://docs.vesu.xyz/blog/2026-09-13-incident-refunds):** Approximately $1.33 million recovered against $1.395 million in borrower claims.

**The two incidents had different causes:** A price-publication failure at Vesu and an attacker-manipulated market input at Nostra.  
  
But they demonstrate the same structural reality. An oracle does not merely describe a market when protocol contracts rely on it to determine collateral value or liquidation eligibility. A bad value can trigger liquidations or authorize borrowing before a human operator has time to intervene.

_September had already been costly for the sector. Including the Nostra incident, [DefiLlama’s exploit database had recorded more than $342 million in crypto losses for the month](https://defillama.com/hacks), with the [vast majority tied to the roughly $320 million Liquid Network incident](https://rekt.news/liquid-network-rekt)._

  
**[Nostra says Trail of Bits, Cairo Security Clan and Salus audited its smart contracts](https://docs.nostra.finance/lend-and-borrow/faqs#has-nostra-been-audited), although [neither its FAQ](https://docs.nostra.finance/lend-and-borrow/faqs#has-nostra-been-audited) nor [terms page](https://nostra.finance/terms/) links to the reports, dates, scope, findings or remediation.**  
  
The apparent failure involved the price-data path feeding those contracts, the external market and oracle/pool-selection process that produced NSTR’s collateral price, not necessarily a defect in the lending code itself.

[Pragma’s published documentation and audit material concern its oracle architecture and on-chain contracts](https://docs.pragma.build/starknet/architecture); they do not, on their face, establish how an external market-data provider selected the pool whose price entered Nostra’s collateral calculation.

[GeckoTerminal’s public API documentation shows that applications can retrieve token and pool data](https://docs.coingecko.com/reference/pools), including multiple pools for one token, but does not disclose what pool-selection safeguards, liquidity thresholds or manipulation checks, if any, determined which NSTR market informed the price used in this incident.

**The question, then, is not whether Nostra’s contracts were audited. It is whether the protocol’s risk design adequately accounted for the off-chain dependencies those contracts were built to trust.**

_When a protocol’s code is designed to obey an oracle, who is accountable for ensuring the oracle deserves to be believed?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_A thin pool did not authorize a multimillion-dollar loan on its own. A chain of trusted systems converted an attacker-shaped market price into borrowable collateral._

**The critical question is not whether Nostra’s lending contracts malfunctioned, but why the protocol’s risk design allowed a thin, manipulable market signal to determine collateral capacity at that scale.**

The incident was not without precedent. In March 2025, [Nostra said price-feed errors had inflated the reported values of xSTRK and sSTRK to roughly three times their actual prices](https://x.com/nostrafinance/status/1904189791132131664), and acknowledged [it had no secondary oracle available for those assets](https://x.com/nostrafinance/status/1904189796551217438).  
  
In August 2025, [Nostra’s own post-mortem said the Pragma-supplied xSTRK feed became non-functional](https://www.nostra.family/t/post-mortem-xstrk-price-feed-incident-on-nostra/349), leaving four accounts undercollateralized and producing about $14,212 in bad debt, which Nostra Labs said it covered.

Pragma’s account of the recent NSTR incident makes the risk more concrete. [Pragma said NSTR was already classified as a high-risk feed because of limited liquidity and available pricing sources, that it had previously raised those concerns with Nostra](https://www.pragma.build/updates/nostra-nstr-incident), and that Gate.io was removed as a source at Nostra’s request over illiquidity and manipulation concerns.

**[Pragma recommends at least three pricing sources](https://www.pragma.build/updates/nostra-nstr-incident), but said the response used in the incident had two contributors and that an enforced three-source minimum would have rejected it.**

_**These earlier events did not share the same exact mechanism as the most recent NSTR exploit:** [March involved an overvalued price feed](https://x.com/nostrafinance/status/1904189791132131664), August [involved a non-functional or stale xSTRK feed](https://www.nostra.family/t/post-mortem-xstrk-price-feed-incident-on-nostra/349), and [September involved manipulation of an illiquid on-chain NSTR market](https://x.com/nostrafinance/status/2100577538053493076)._  
  
But together they document a recurring category of risk, external price inputs affecting collateral valuation, rather than a wholly unforeseeable failure.

Nostra’s eventual post-mortem should therefore account for more than the manipulated pool.  
  
**It should explain how it assessed thin-liquidity collateral, what controls governed missing or divergent price sources, why NSTR remained eligible to support borrowing under those conditions, and how it will reconcile outstanding liabilities, recoverable assets and user losses.**

_The pool was the instrument, but will Nostra’s accounting identify the security model that treated its price as trustworthy enough to lend against?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
