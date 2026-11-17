---
tags:
  - type/hack
  - blockchain/arbitrum
  - blockchain/bitcoin
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/governance
  - web3-sector/infra
  - web3-sector/lending
  - web3-sector/oracle
  - web3-sector/perpetuals
  - web3-sector/privacy
  - web3-sector/stable
title: "Ostium - Rekt"
protocol: "Ostium"
date: 2026-07-15
loss_usd: 23750000
audit: "N/A"
source: "https://rekt.news/ostium-rekt"
excerpt: "An attacker used a trusted price forwarder to feed the vault a fake $60K Bitcoin quote to drain $23.75 million from Ostium on Arbitrum, then collected the payout on trades that were never real."
---
# Ostium - Rekt

> **Loss:** $23,750,000 | **Date:** 2026-07-15 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/ostium-rekt-header.png)






_Five minutes and twenty-nine seconds. That's how long it took an Arbitrum perpetuals exchange [backed by General Catalyst and Jump Crypto, and a fresh Nasdaq data partnership](https://www.theblock.co/post/401743/ostiums-onchain-perpetuals-exchange-nasdaq-data) to lose [$23.75 million](https://x.com/_RogueTrader/status/2077411325941346378)._

**The attacker didn't touch a smart contract bug. [He walked in through Ostium's own price-reporting machinery and told the vault whatever price he wanted](https://x.com/blockaid_/status/2077405527428989363), whenever he wanted it.**

[Bitcoin opened at $5,000](https://defiprime.com/ostium-exploit). In the same breath, [it closed at $60,000](https://defiprime.com/ostium-exploit). Nobody's portfolio moved twelvefold that afternoon. Only Ostium's vault did.

The attacker [looped leveraged trades against the vault until it was dry](https://x.com/QuillAudits_AI/status/2077432073758150713), and a [five-minute window](https://x.com/kaledora/status/2077525044733837736) later, the [OLP vault](https://x.com/kaledora/status/2077525044733837736) liquidity providers built to collect yield had instead financed a payout on trades that were never real, right down to the last cent.

The component the attacker used wasn't a gap nobody noticed. It was a gap Ostium had written down, [in its own bug bounty scope](https://immunefi.com/bug-bounty/ostium/information/), as a place security researchers weren't allowed to look.

**Stolen funds hit Kyber within the hour, and [Tornado Cash by nightfall](https://x.com/PeckShieldAlert/status/2077548169811083373), laundered faster than most of the security firms could agree on a dollar figure.**

_When the door you left unlocked is the one you told everyone not to check, is it still a break-in?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [The Block](https://www.theblock.co/post/401743/ostiums-onchain-perpetuals-exchange-nasdaq-data), [Rogue Trader](https://x.com/_RogueTrader/status/2077411325941346378), [Blockaid](https://x.com/blockaid_/status/2077405527428989363), [defiprime](https://defiprime.com/ostium-exploit), [QuillAudits](https://x.com/QuillAudits_AI/status/2077432073758150713), [kaledora](https://x.com/kaledora/status/2077525044733837736), [ImmuneFi](https://immunefi.com/bug-bounty/ostium/information/), [Peckshield](https://x.com/PeckShieldAlert/status/2077548169811083373), [Cyvers](https://x.com/CyversAlerts/status/2077411437782114541), [Ostium](https://x.com/Ostium/status/2077628150054281700), [CBB](https://x.com/Cbb0fe/status/2077413666509471977), [Lookonchain](https://x.com/lookonchain/status/2077559071159558379), [CoinTelegraph](https://cointelegraph.com/news/ostium-pauses-trading-as-security-firms-report-multimillion-dollar-oracle-exploit), [evm codes](https://www.evm.codes/precompiled), [Zellic](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2FaMgw1k5iR4SvbYWRcs7q%2FOstium%20-%20Zellic%20Audit%20Report%20%281%29.pdf?alt=media&token=771b25d4-be83-4a49-b1b5-8a9184d2b3f6), [ThreeSigma](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2FMpYIMzIusmebDMScUlYB%2FOstiumAudit.pdf?alt=media&token=7043d99e-ba05-4ad1-8505-d3cf9e2a6415), [Pashov Audit Group](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2F342r2xPX6yppDzAfPLVz%2FPashov%20Jan%2026.pdf?alt=media&token=a212135d-79f4-4896-bc90-fb7e88058ea3), [DefiLlama](https://defillama.com/protocol/ostium?groupBy=cumulative)_

**[Blockaid's detection system caught it mid-drain on July 15th](https://x.com/blockaid_/status/2077405527428989363), tagging [the exploit transaction and the attacker's wallet](https://x.com/blockaid_/status/2077406790606622799) before the last loop had even fired:  "An attacker used a registered PriceUpKeep forwarder and future-dated authorized oracle reports to create artificial trade profit, triggering a ~$18M USDC payout from the vault."**

**[RogueTrader had a bigger number within minutes](https://x.com/_RogueTrader/status/2077411325941346378), $23.75 million, and the exact attacker address to go with it.**

[Cyvers followed with the fullest picture yet: funds routed through ChangeNOW on Ethereum](https://x.com/CyversAlerts/status/2077411437782114541), bridged to Arbitrum, swapped entirely from USDC to ETH, and scattered across attacker-controlled wallets.  
  
**[Ostium showed up with their first announcement shortly after Blockaid’s initial alarm:](https://x.com/Ostium/status/2077412452392652917)** “We are aware of the issue with the OLP vault. We have paused all trading. The team is investigating.”  
  
**[Ostium followed up with a post just over an hour and a half later](https://x.com/Ostium/status/2077438120354603396):** "Trading remains paused following the security incident. User positions remain open and unmodifiable, and trader margin remains unmoved in frozen trading smart contracts. Over the past 14 hours, the team has been in continuous coordination with relevant authorities, SEAL 911, and multiple security researchers."  
  
**[Ostium's founder, kaledora, acknowledged the incident that afternoon](https://x.com/kaledora/status/2077525044733837736):** "This morning, between 14:18-14:23 UTC, Ostium experienced a security issue leading to a loss of funds from the public OLP vault. Our team identified the issue within minutes and immediately began taking steps to contain it, including coordinating to pause trading contracts within the hour."  
  
**Not everyone watching was sympathetic. [CBB summed up the mood better than any security firm did](https://x.com/Cbb0fe/status/2077413666509471977):**  "Maybe next time focus on securing your protocol instead of trying to beef with Hyperliquid."

[QuillAudits published the first real technical trace](https://x.com/QuillAudits_AI/status/2077432077461660003), the attacker opening a leveraged trade, triggering a price upkeep call in the same transaction, the submitted report's signature recovering to an address the contract itself trusted, isAuthorizedSigner[recovered signer] == true.

**By the time [PeckShield](https://x.com/PeckShieldAlert/status/2077548169811083373) and [Lookonchain](https://x.com/lookonchain/status/2077559071159558379) finished tracing the exit, [the full amount had already been swapped to 12,084 ETH and was moving into Tornado Cash](https://x.com/lookonchain/status/2077559071159558379). The forensic community had reconstructed the entire attack before Ostium had confirmed a single dollar figure.**

_If outside analysts can map your exploit down to the recovered signer address faster than you can post an update, what exactly does "investigating" mean?_

### Authorized to Lie

_Ostium can't read a Bitcoin price off a DEX pool the way a crypto-native perp can._  
  
**Gold, forex, the S&P, none of it exists on-chain.**  
  
**[So Ostium built a pull oracle instead](https://ostium-labs.gitbook.io/ostium-docs/supporting-infrastructure/price-oracle):** Prices are only written onchain when explicitly required for trade execution, [delivered on demand by Gelato](https://ostium-labs.gitbook.io/ostium-docs/supporting-infrastructure/automations), the automation network Ostium's own docs describe as [the only address authorized](https://ostium-labs.gitbook.io/ostium-docs/supporting-infrastructure/automations) to trigger these actions.  
  
**[Ostium's own audit scope lists two price-upkeep contracts](https://ostium-labs.gitbook.io/ostium-docs/security/smart-contract-audits):** PriceUpKeep and PrivatePriceUpKeep.

That distinction matters for anyone trying to verify the exploit against Ostium's own contract list.  
  
_In early coverage, [the exploited contract was often referred to simply as “PriceUpKeep,”](https://www.theblock.co/post/408450/ostium-pauses-trading-after-apparent-18-million-vault-exploit) a convenient shorthand for the upkeep family rather than a specific deployment._  
  
**On-chain, the specific deployment matters.**  
  
Pulling the [raw event logs from the main exploit transaction](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0#eventlog) shows address [0xB71ec9eBD8145daCaCF6724363143cb5667A3d36](https://arbiscan.io/address/0xb71ec9ebd8145dacacf6724363143cb5667a3d36) firing a PriceRequestedV2 event, tagged directly by Arbiscan's contract label as "[Ostium: Private Price Up Keep](https://arbiscan.io/address/0xb71ec9ebd8145dacacf6724363143cb5667a3d36)."  
  
**[The executeBatch calldata in the main exploit transaction backs it up:](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0/advanced#internal)** The internal calls repeatedly route between Ostium’s Trading contract and that exact address.  
  
[The public PriceUpKeep contract](https://arbiscan.io/address/0x52B2a78E12b09B66C6c8ce291D653D40bAb77f0c), Ostium's other listed deployment, never appears anywhere in the transaction.  
  
_Its recent activity had already stalled before the exploit, [with the latest transactions showing repeated Perform Upkeep calls that revert with NotInitiated](https://arbiscan.io/address/0x52B2a78E12b09B66C6c8ce291D653D40bAb77f0c)._  
  
**The contract used in the exploit path was [PrivatePriceUpKeep](https://arbiscan.io/address/0xb71ec9ebd8145dacacf6724363143cb5667a3d36), not [PriceUpKeep](https://arbiscan.io/address/0x52B2a78E12b09B66C6c8ce291D653D40bAb77f0c), and [they are separate deployments with separate histories](https://ostium-labs.gitbook.io/ostium-docs/security/smart-contract-audits).**

**In practice, [that contract is the core of the model](https://arbiscan.io/address/0xB71ec9eBD8145daCaCF6724363143cb5667A3d36):** It writes the signed price a trade settles at, right when the trade needs it. Trust the signer, trust the price. There is no second opinion.  
  
[The internal trace shows PrivatePriceUpKeep calling into the verification path](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0/advanced#internal), which then makes a staticcall to [the EVM's ecrecover precompile](https://www.evm.codes/precompiled), showing [that the exploit path relied on signature verification at that point](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0/advanced#internal).  
  
[Ostium's own Registry contract,](https://arbiscan.io/address/0x799a139aE56e11F0476aCE2f6118CfcAed9608d2#events) the reference every other contract in this system queries at runtime, [shows the ostiumVerifier key was originally registered to a different address roughly 688 days before the exploit](https://arbiscan.io/tx/0x629672c68ec0c297c8dd5ae3a919c34a63d3f8b6d61e8621e444ebdfd481b8f6), then [updated on February 14, 2026](https://arbiscan.io/tx/0x2854305ca1fa808619cca5ee1b76d675c3d5a3336de10eaaa614e732109e9cb4#eventlog), 151 days before the exploit, to the address that appears in the live trace.  
  
_That same governance transaction also added four authorized signers to the new verifier, [including the address flagged](https://arbiscan.io/address/0x38110430184c22d93c30b3e67b9af98d5d0ab8bd) in [QuillAudits' trace](https://x.com/QuillAudits_AI/status/2077432077461660003), showing that address was part of Ostium's approved signer set from the outset._

**[That registry update is consistent with what the live trace shows](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0/advanced#internal); [Ostium's public docs table](https://ostium-labs.gitbook.io/ostium-docs/security/smart-contract-audits) and [Arbiscan's "Verifier" name tag](https://arbiscan.io/address/0xcCF233920e8cc9415ecF503b992881d69b6c47Ad) both appear stale relative to it, [still pointing at the pre-update address](https://arbiscan.io/address/0xcCF233920e8cc9415ecF503b992881d69b6c47Ad).**  
  
**The exploit path appears to have relied on two things:** A registered PrivatePriceUpKeep forwarder capable of triggering its own price delivery, and a price report that passed the contract’s signature check, [with QuillAudits tracing](https://x.com/QuillAudits_AI/status/2077432077461660003) that [signer to this address](https://arbiscan.io/address/0x38110430184c22d93c30b3e67b9af98d5d0ab8bd).  
  
Not a forged signature. Not a broken function. A report the protocol accepted as valid.

[A single executeBatch call produced twenty internal calls](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0#eventlog), alternating between Ostium's [Trading contract](https://arbiscan.io/address/0x6D0bA1f9996DBD8885827e1b2e8f6593e7702411) and the [PrivatePriceUpKeep contract](https://arbiscan.io/address/0xB71ec9eBD8145daCaCF6724363143cb5667A3d36), and repeated the same open-close cycle five times.  
  
**Every trade in that batch was on [pairIndex 0](https://arbiscan.io/address/0x260E349F643f12797fDc6f8c9d3df211D5577823#readProxyContract#F21), whose pairs(uint16) readout maps from = BTC and to = USD, with feed (under Event #1):** [0x7404e3d104ea7841c3d9e6fd20adfe99b4ad586bc08d8f3bd3afef894cf184de](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0#eventlog#1)

_[That same feed hash appears](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0#eventlog) in the exploit transaction's price-request events._

**The position [opened at a delivered price of exactly $5,000](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0#eventlog#20) and [closed, within the same atomic transaction, at roughly $60,000](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0#eventlog#41).**

Bitcoin does not have a 12x intra-block.  
  
**Strip away the contract names and it comes down to this:** Someone got Ostium's price-reporting system to accept a fake Bitcoin price as real, and the protocol paid out millions of dollars based on that lie.  
  
**In plain English, the system did what it was built to do:** Trust an authorized-looking price submission and execute against it, without separately checking whether the price made sense.  
Exactly how the attacker obtained the ability to submit that price is still unconfirmed.  
  
**What is not ambiguous is that Ostium had already classified the relevant keeper path as trusted:** [Its Immunefi bug bounty scope says registered keepers and their forwarders](https://immunefi.com/bug-bounty/ostium/scope/#top), including PriceUpKeep and PrivatePriceUpKeep, are “assumed to be trusted and operating correctly,” and that issues requiring a compromised or malicious keeper are out of scope.  
  
**The attack therefore used a path Ostium had excluded from bounty coverage.**

_What's the point of a bug bounty that pays you to ignore the one lock the attacker actually picked?_  
  
### Kyber to Tornado  
  
_Eight transactions. Five minutes and twenty-nine seconds from the [first test-loop transaction](https://arbiscan.io/tx/0x4b7ff5de823dd7af29cf1a6602a84d7b6eee354edcbaf0427fd5e691d3d80951) to the [final drain transaction](https://arbiscan.io/tx/0xfaf6d3d4d7f1a75bfc11fb4d36d0525791546267fda1cdd371703ce03ae8ba8c)._  
  
**[$23.75 million extracted](https://x.com/_RogueTrader/status/2077411325941346378) by time the damage was done.**

[The attacker opened with a $100 dry run](https://arbiscan.io/tx/0x4b7ff5de823dd7af29cf1a6602a84d7b6eee354edcbaf0427fd5e691d3d80951), deposit, an $897.80 payout, close, confirming the exploit path worked before committing to anything larger.  
  
**[Twenty-five seconds later came the transaction that did most of the damage](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0):** A single executeBatch call, five nested loops, $11.86 million pulled from the vault in one shot.  
  
Six more standalone transactions followed at decreasing size, collecting a payout roughly ten times that size, then closing out for almost exactly what went in. The vault kept pennies. The attacker kept the rest.  
  

**None of it stayed in USDC. [The full amount moved through KyberSwap into 12,084 ETH](https://x.com/lookonchain/status/2077559071159558379), at an average execution price of about $1,966, then fanned out across [30 attacker-controlled wallets](https://arkm.com/explorer/entity/456a2624-9f5f-40da-a124-9552894443ed), a spread wide enough that no single address ever held enough to make an easy target.**

  
**[PeckShield caught the next move](https://x.com/PeckShieldAlert/status/2077548169811083373):** 10,540 of the 12,084 ETH deposited into Tornado Cash before the day was out. The wallet that started this whole thing had been funded, fittingly, with 1 ETH from ChangeNOW and 1 ETH from Bybit, a two-dollar-figure seed for a nine-figure heist.

  
[Arkham's own counterparty data](https://arkm.com/explorer/entity/456a2624-9f5f-40da-a124-9552894443ed) tells a messier story than the clean $23.75M headline number.

[Ostium counterparty volume reads $29.04M](https://arkm.com/explorer/entity/456a2624-9f5f-40da-a124-9552894443ed). [Kyber Network reads $47.07M](https://arkm.com/explorer/entity/456a2624-9f5f-40da-a124-9552894443ed), almost exactly double the real swap, the kind of number you get when both legs of a trade get counted as separate volume instead of one net flow.

[Tornado Cash sits at $22.47 million](https://arkm.com/explorer/entity/456a2624-9f5f-40da-a124-9552894443ed), as the attacker exited with most of the funds.  
  
**[Whatever the exact accounting quirks, the direction of travel isn't in dispute](https://arkm.com/explorer/entity/456a2624-9f5f-40da-a124-9552894443ed):** As of this writing, roughly $4 million remains sitting across the attacker's 30 wallets.  
  
**Everything else already went through the mixer.**  
  

**Exploiter Address:**
[0x321Df194646029e7A6193Ea05573d4B9c398bfD9](https://arbiscan.io/address/0x321df194646029e7a6193ea05573d4b9c398bfd9)

  
**Test-loop Transaction:** [0x4b7ff5de823dd7af29cf1a6602a84d7b6eee354edcbaf0427fd5e691d3d80951](https://arbiscan.io/tx/0x4b7ff5de823dd7af29cf1a6602a84d7b6eee354edcbaf0427fd5e691d3d80951)

  
**Main Exploit Transaction:** [0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0)

  
**6 Standalone Drain Transactions:** [0x56e4139a2f51e99933479becee21812dd2ec656128f6f3593a7fa225e2f24adc](https://arbiscan.io/tx/0x56e4139a2f51e99933479becee21812dd2ec656128f6f3593a7fa225e2f24adc) [0x397daa6c23c87670f949a970961b1014e966cc40301a99b55c3c1908dd61418e](https://arbiscan.io/tx/0x397daa6c23c87670f949a970961b1014e966cc40301a99b55c3c1908dd61418e) [0xd9f91cc3eaec695f45bffad3a068fa52e1625ed44bfcc47d6ac3938f78d9061d](https://arbiscan.io/tx/0xd9f91cc3eaec695f45bffad3a068fa52e1625ed44bfcc47d6ac3938f78d9061d) [0x3b04639ab9b40760b2138e7bfa7eccc9657f3a767a5c414dbb1b3632ed71f3bf](https://arbiscan.io/tx/0x3b04639ab9b40760b2138e7bfa7eccc9657f3a767a5c414dbb1b3632ed71f3bf) [0x6c254483fa47a14622662e792bc3728ab3c408a33d3cbb5712434ba96f5ecdc2](https://arbiscan.io/tx/0x6c254483fa47a14622662e792bc3728ab3c408a33d3cbb5712434ba96f5ecdc2) [0xfaf6d3d4d7f1a75bfc11fb4d36d0525791546267fda1cdd371703ce03ae8ba8c](https://arbiscan.io/tx/0xfaf6d3d4d7f1a75bfc11fb4d36d0525791546267fda1cdd371703ce03ae8ba8c)

  
**Ostium OLP vault (drained):**
[0x20D419a8e12C45f88fDA7c5760bb6923Cee27F98](https://arbiscan.io/address/0x20d419a8e12c45f88fda7c5760bb6923cee27f98)

  
**Ostium TradingStorage (Proxy):**
[0xcCd5891083A8acD2074690F65d3024E7D13d66E7](https://arbiscan.io/address/0xcCd5891083A8acD2074690F65d3024E7D13d66E7)

  
**Ostium Verifier (current, confirmed via Registry's ostiumVerifier update event):** [0xd456939e54F68Ef9B0BE62aBB2EC4A37397Cb814](https://arbiscan.io/address/0xd456939e54F68Ef9B0BE62aBB2EC4A37397Cb814#code)

**Replaced the prior address [via a Registry update transaction dated February 14, 2026](https://arbiscan.io/tx/0x2854305ca1fa808619cca5ee1b76d675c3d5a3336de10eaaa614e732109e9cb4) (151 days before the exploit):**
[0xcCF233920e8cc9415ecF503b992881d69b6c47Ad](https://arbiscan.io/address/0xcCF233920e8cc9415ecF503b992881d69b6c47Ad#code)

**Ostium PrivatePriceUpKeep (exploited contract):** [0xB71ec9eBD8145daCaCF6724363143cb5667A3d36](https://arbiscan.io/address/0xB71ec9eBD8145daCaCF6724363143cb5667A3d36)

**Ostium PriceUpKeep (public, not used in this exploit):** [0x52B2a78E12b09B66C6c8ce291D653D40bAb77f0c](https://arbiscan.io/address/0x52B2a78E12b09B66C6c8ce291D653D40bAb77f0c)

  
**Ostium Trading (opens and closes each position, requests the price):** [0x6D0bA1f9996DBD8885827e1b2e8f6593e7702411](https://arbiscan.io/address/0x6D0bA1f9996DBD8885827e1b2e8f6593e7702411)

**Ostium TradingCallbacks (settles the trade on the delivered price, pulls the payout from the Vault):**
[0x7720fC8c8680bF4a1Af99d44c6c265a74e9742a9](https://arbiscan.io/address/0x7720fC8c8680bF4a1Af99d44c6c265a74e9742a9)

**Arkham entity page (30 linked addresses):**  
[Arkham Page Link Here](https://arkm.com/explorer/entity/456a2624-9f5f-40da-a124-9552894443ed)

**Every one of those addresses is public, labeled, and sitting in plain view. None of that visibility buys a single dollar back.**  
  

_[When 83%](https://arkm.com/explorer/entity/456a2624-9f5f-40da-a124-9552894443ed) of your stolen $23.75 million is already unlaunderable-back-into-existence, what exactly is left to "trace"?_

  
### Flagged and Filed

  

_[Ostium was audited six times across three different firms over more than two years](https://docs.ostium.com/protocol/security/audits). The last of those reports closed just eight months before the exploit._  
  
**[Zellic reviewed the contracts before mainnet in February 2024](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2FaMgw1k5iR4SvbYWRcs7q%2FOstium%20-%20Zellic%20Audit%20Report%20%281%29.pdf?alt=media&token=771b25d4-be83-4a49-b1b5-8a9184d2b3f6), finding 19 issues including two critical.**

[ThreeSigma spent ten person-weeks on it the following month and found 57 findings](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2FMpYIMzIusmebDMScUlYB%2FOstiumAudit.pdf?alt=media&token=7043d99e-ba05-4ad1-8505-d3cf9e2a6415), including two highs and one critical.  
  
[Pashov came through twice in 2025](https://docs.ostium.com/protocol/security/audits), in [January](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2FG0Of6YAPlrOIPs51aj16%2FOstium-security-review_2025-01-21.pdf?alt=media&token=162c18f6-54fe-4dfe-be56-826ad040fff0) and [again in April](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2F7b08UITTgMLh1ej19d7I%2FOstium-security-review_2025-04-06.pdf?alt=media&token=a61ab4ef-2245-4ec6-b865-e8069d40a332).

[Zellic returned for a second full engagement that September](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2F1NAt99nKJ1HesxyWjElF%2FZellic%20Nov%2025.pdf?alt=media&token=3e34f62e-8909-41a7-888a-dda6d6fc481c), running until November of 2025.  
  
_[Pashov closed out the run this January 2026](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2F342r2xPX6yppDzAfPLVz%2FPashov%20Jan%2026.pdf?alt=media&token=a212135d-79f4-4896-bc90-fb7e88058ea3) with a 3rd audit._  
  
**[Six reports, three firms](https://docs.ostium.com/protocol/security/audits), two-plus years of continuous outside review.**

[Ostium's own current documentation summarizes those first two engagements](https://docs.ostium.com/protocol/security/audits) rather differently.  
  
[Its audit page describes Zellic's findings as](https://docs.ostium.com/protocol/security/audits) "no critical vulnerabilities identified in either engagement," and ThreeSigma's as "no critical or high-severity vulnerabilities."  
  
Except the actual audit reports say otherwise.  
  
_[Zellic's February 2024 assessment lists two Critical findings by name](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2FaMgw1k5iR4SvbYWRcs7q%2FOstium%20-%20Zellic%20Audit%20Report%20%281%29.pdf?alt=media&token=771b25d4-be83-4a49-b1b5-8a9184d2b3f6), traders able to increase collateral without paying for it, and an order-ID reuse due to multiple price-upkeep deployments, and [ThreeSigma's own report includes](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2FMpYIMzIusmebDMScUlYB%2FOstiumAudit.pdf?alt=media&token=7043d99e-ba05-4ad1-8505-d3cf9e2a6415) one critical finding and two high findings of its own._  
  
**[Zellic's own report confirms its assessment predated Ostium's Arbitrum deployment](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2FaMgw1k5iR4SvbYWRcs7q%2FOstium%20-%20Zellic%20Audit%20Report%20%281%29.pdf?alt=media&token=771b25d4-be83-4a49-b1b5-8a9184d2b3f6); ThreeSigma's audit, running through that same pre-launch window a month later, [marked its own Critical and High findings "Addressed" rather than left open](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2FMpYIMzIusmebDMScUlYB%2FOstiumAudit.pdf?alt=media&token=7043d99e-ba05-4ad1-8505-d3cf9e2a6415).**  
  
[But the official summary Ostium published describes audits that](https://docs.ostium.com/protocol/security/audits), on paper, missed the very findings its own auditors documented.  
  
[Every one of those audits scoped smart-contract logic](https://docs.ostium.com/protocol/security/audits), including onchain price handling, not the offchain keeper and forwarder infrastructure supplying those prices.  
  
**[Zellic said so explicitly in its very first report](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2FaMgw1k5iR4SvbYWRcs7q%2FOstium%20-%20Zellic%20Audit%20Report%20%281%29.pdf?alt=media&token=771b25d4-be83-4a49-b1b5-8a9184d2b3f6):** "Infrastructure relating to the project" and "key custody" were listed as out of scope. That's a standard, defensible boundary.  
  
_Auditors get a pass here, this was never their job, at least for these engagements._

**What doesn't get a pass is what happened after Zellic's second engagement, in November 2025. [Section 4.8 of that report isn't a missed vulnerability](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2F1NAt99nKJ1HesxyWjElF%2FZellic%20Nov%2025.pdf?alt=media&token=3e34f62e-8909-41a7-888a-dda6d6fc481c).**  
  
**[It's Zellic actively flagging a risk they weren't being paid to fully investigate](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2F1NAt99nKJ1HesxyWjElF%2FZellic%20Nov%2025.pdf?alt=media&token=3e34f62e-8909-41a7-888a-dda6d6fc481c), in writing, eight months before the exploit:** "By design, forwarders can cancel any order or action... These concerns are not a complete enumeration of the potential issues that can arise from a compromised forwarder."

That is close to a preview of what happened on July 15.  
  
[Ostium's response was to patch the one concrete example Zellic illustrated](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2F1NAt99nKJ1HesxyWjElF%2FZellic%20Nov%2025.pdf?alt=media&token=3e34f62e-8909-41a7-888a-dda6d6fc481c), a forwarder abusing REMOVE_COLLATERAL, and move on.  
  
_[The general warning that a compromised forwarder was a real](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2F1NAt99nKJ1HesxyWjElF%2FZellic%20Nov%2025.pdf?alt=media&token=3e34f62e-8909-41a7-888a-dda6d6fc481c), unenumerated risk category never became a follow-up audit scope item, never made it into the bug bounty program, and never triggered a broader review of the keeper trust architecture._  
  
**Instead, [that same bug bounty program went on to state that registered keepers and their forwarders were "assumed to be trusted and operating correctly,"](https://immunefi.com/bug-bounty/ostium/scope/#top) with any finding requiring a compromised keeper explicitly carved out.**

The risk wasn't undiscovered. It was named, dated, and filed. The buck for the gap between "flagged" and "fixed" sits with Ostium, not with the people who told them where the wall ended.

The vault absorbed the consequence directly. [Trader margin, by Ostium’s own account, remained unmoved in frozen trading contracts throughout](https://x.com/Ostium/status/2077628150054281700).

**[Ostium's public response ran the standard playbook](https://x.com/Ostium/status/2077412452392652917):** Pause trading, advise revoking contract approvals, confirm funds frozen and preserved.  
  
_[A late evening update cited fourteen hours of continuous coordination with SEAL 911](https://x.com/Ostium/status/2077628150054281700), unnamed authorities, and multiple security researchers, thanking the community for its help without adding a number, a mechanism, or a timeline._

**Ostium's public account of what happened came in pieces.**  
  
**[A follow-up from Kaledora the night after the exploit confirmed positions remain open and frozen, and also promised](https://x.com/kaledora/status/2077986676756852950) "a technical post-mortem and outline of the path forward towards protocol restoration... over the coming days," and included a pointed warning:** "Please trust only official channels. We are not circulating recovery forms and will never ask for your keys, seed phrase, or funds."

**Three days later, on July 18, [Ostium's official account went further](https://x.com/Ostium/status/2078640436688941194), offering its first real characterization of the mechanism:** The attacker "compromised off-chain infrastructure related to the system that feeds prices into the protocol," then submitted "illegitimate price reports that were manipulated to appear as valid", opening and instantly closing a series of large positions to extract an artificial profit from the vault.  
  
_[That confirms infrastructure compromise rather than a smart-contract bug](https://x.com/Ostium/status/2078640436688941194), consistent with everything traced in this piece, but it still stops short of specifying whether that meant a stolen signer key, a hijacked forwarder, or something else._  
  
**[The same update named three additional security partners](https://x.com/Ostium/status/2078640436688941194) (Mandiant, zeroShadow, Collisionless) alongside SEAL 911 and law enforcement, said trading contracts were frozen within 60 minutes of the first exploit transaction, and [confirmed trader positions will be marked to the price at re-open once trading resumes, independent of interim price movements](https://x.com/Ostium/status/2078640436688941194).**  
  
[A subsequent update said Ostium was working toward a relaunch within the week](https://x.com/Ostium/status/2079268604269285650), with 24 hours' notice before trading resumes, positions marked to the live price at reopen, and a liquidity provider recovery plan Ostium said it intends to contribute from its own balance sheet, alongside new and existing partners.  
  
A full technical postmortem and reimbursement plan for liquidity providers still hadn't arrived by the time this piece went out.

**[The laundering hadn't stopped either](https://arkm.com/explorer/entity/456a2624-9f5f-40da-a124-9552894443ed):** Arkham's transfer feed for the exploiter's cluster shows additional 10 ETH deposits into Tornado Cash within hours of publication, on top of the balance already reconciled elsewhere in this piece.

**The mechanism is now on the record. What accounting for it looks like is not.**

_If the warning was already in writing eight months out, what exactly is left to postmortem?_


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_[Bitcoin was never at $5,000 that afternoon](https://arbiscan.io/tx/0x359f8c05b86a4409d60cfba02084334313fd94b19f74a294fb7fc4ea7d4870e0#eventlog#20), and [Ostium's own contracts paid out $23.75 million on the fabricated gap anyway](https://x.com/_RogueTrader/status/2077411325941346378)._  
  
**Every safeguard that might have caught this had already looked past it by the time it mattered.**  
  
The oracle trusted its signer, [the bug bounty trusted the keeper](https://immunefi.com/bug-bounty/ostium/scope/#top), and [Zellic had written down, eight months early, that a compromised forwarder was exactly the risk nobody had fully mapped](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2F1NAt99nKJ1HesxyWjElF%2FZellic%20Nov%2025.pdf?alt=media&token=3e34f62e-8909-41a7-888a-dda6d6fc481c).  
  
[Ostium patched the one example Zellic illustrated](https://1263702948-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCEDPLHGTrrpP1i2dbe3d%2Fuploads%2F1NAt99nKJ1HesxyWjElF%2FZellic%20Nov%2025.pdf?alt=media&token=3e34f62e-8909-41a7-888a-dda6d6fc481c), marked the finding resolved, and treated the broader warning as closed.

**[Six audits, three firms, two years of paying people to find what was wrong](https://docs.ostium.com/protocol/security/audits), and the thing that actually broke was never specifically anyone's job to check, per [Ostium's own bug bounty scope](https://immunefi.com/bug-bounty/ostium/scope/#top).**

  
That's not a story about a missing audit. It's a story about a warning that got acknowledged, patched around, and shelved instead of escalated.  
  
Ostium might survive this the way better-funded protocols have absorbed worse and kept building, and [$23.75 million](https://x.com/_RogueTrader/status/2077411325941346378) against [~$60.4 billion in lifetime volume](https://defillama.com/protocol/ostium?groupBy=cumulative) is a bad week, not an obituary.  
  
**But surviving isn't the same as answering for it, and eight months is a long time to sit on a warning that turned out to be exactly right.**  
  

_If your own auditor tells you where the compromised door is, and you only fix the example they pointed to instead of the door they described, whose fault is it when someone finally opens it?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
