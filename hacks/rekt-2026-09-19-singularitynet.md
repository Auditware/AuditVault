---
tags:
  - type/hack
  - blockchain/arbitrum
  - blockchain/bitcoin
  - blockchain/bsc
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/multisig
  - web3-sector/nft
  - web3-sector/stable
  - web3-sector/token
  - vector/access-control
  - vector/bridge-exploit
  - vector/social-engineering
title: "SingularityNET - Rekt"
protocol: "SingularityNET"
date: 2026-09-19
loss_usd: 2290000
audit: "N/A"
source: "https://rekt.news/singularitynet-rekt"
excerpt: "An attacker accessed SingularityNET’s cloud infrastructure. Valid bridge signatures authorized AGIX, WMTX and CGV mints; NTX was minted directly, and 8.72 million FET was drained, and $2.29M in gross "
---
# SingularityNET - Rekt

> **Loss:** $2,290,000 | **Date:** 2026-09-19 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/singularitynet-rekt-header.png)


_SingularityNET spent years pitching a marketplace for autonomous AI agents._  
  
**On the night of September 19, the busiest agent on its network was a script nobody at SingularityNET had written.**

[Armed with signing authority exposed through a breach of the project's cloud infrastructure](https://x.com/SingularityNET/status/2102221596752482469), it [emptied the Ethereum converter's FET liquidity with a single signature](https://x.com/SlowMist_Team/status/2101503515877396639), then spent [the next nine hours printing 2.3 billion AGIX, NTX, WMTX and CGV out of nothing](https://bitquery.io/investigations/asi-bridge-counterfeit-supply).

[Some headlines put the haul at $16.77 million](https://x.com/PeckShieldAlert/status/2101602701251334368). A transaction-level reconstruction finds roughly $2.29 million in gross liquid proceeds; most of the minted tokens remained unsold.

All of the keys that signed were legit. Every contract that obeyed was doing its job.

**The damage outlasted the money, and days later, [nobody involved has published a full post-mortem](https://x.com/ASI_Alliance/status/2101567173189656791).**

_When the keys to an entire alliance of AI projects live in the same cloud, who was ever really in control of the machine?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [SingularityNET](https://x.com/SingularityNET/status/2102221596752482469), [SlowMist](https://x.com/SlowMist_Team/status/2101503515877396639), [Bitquery](https://bitquery.io/investigations/asi-bridge-counterfeit-supply), [Peckshield](https://x.com/PeckShieldAlert/status/2101602701251334368), [ASI Alliance](https://x.com/ASI_Alliance/status/2101567173189656791), [Blockaid](https://x.com/blockaid_/status/2101426221825348095), [Uniswap](https://developers.uniswap.org/docs/liquidity/uniswapx/overview), [Baltex](https://baltex.io/support/faq), [AMLBot](https://x.com/AMLBotHQ/status/2102416103255552509), [NuNet](https://docs.nunet.io/getting-ntx/token-overview/), [Fetch.ai](https://x.com/Fetch_ai/status/2101707839979016337)_

**The first visible loss was FET. But, it would not be the last.**

[The drain cleared at 20:21 UTC on September 19](https://asi1.ai/artifact/a7e8d9b0-de17-4646-a82b-3d56299022f7). Two minutes and twenty-four seconds later, [all 8.7 million tokens had been swapped for 522.78 ETH](https://etherscan.io/tx/0x98f6e59b54fd4d2c086cc7cab4e7070edff6410210a1bf1fbaffd62da3b76d1c).

[At 21:40 UTC, Blockaid flagged the FET drain](https://x.com/blockaid_/status/2101426221825348095) and reported that the same wallet had received a large NTX mint from NuNet’s deployer. Its alert called the incident a Fetch.ai exploit;

[SingularityNET later identified the compromised infrastructure](https://x.com/SingularityNET/status/2102221596752482469) as its own.

What first looked like a Fetch.ai incident, [had a wider impact than initially suspected](https://x.com/PeckShieldAlert/status/2101457227379044822).

_**[By 02:47 UTC, SlowMist had identified the mechanism](https://x.com/SlowMist_Team/status/2101503515877396639):** A compromised authorizer key was enough to drain the bridge._

**A leaked key, and a contract that believed it.**  
  
A theme that has been echoed for quite some time now.

The FET drain was not the end of the attack. Twenty-nine minutes later, at [](https://bitquery.io/investigations/asi-bridge-counterfeit-supply) 20:50 UTC, [the attacker used NuNet’s mint authority to create 408.5M NTX directly on the token contract](https://bitquery.io/investigations/asi-bridge-counterfeit-supply).  
  

**[The bigger printing run began at 03:13 UTC, when unauthorized AGIX mints started in 10M-token batches](https://bitquery.io/investigations/asi-bridge-counterfeit-supply); unauthorized WMTX mints followed at 03:38, AGIX minting ran until 04:21, and CGV completed a 50-call mint run from 04:34 to 04:38.**

By dawn, [public alerts had expanded the incident from a bridge drain into a multi-token compromise](https://x.com/PeckShieldAlert/status/2101602701251334368).  
  
[Early wallet snapshots put the attacker's nominal holdings near $16.77 million](https://x.com/PeckShieldAlert/status/2101602701251334368), treating thinly traded, freshly minted tokens as if they could be sold at quoted prices.

**The attack did not end with the night. At 13:10 UTC on September 20, [a SingularityNET payout contract sent its entire 289,575.10-USDC balance to a wallet swept during the earlier compromise](https://bitquery.io/investigations/asi-bridge-counterfeit-supply); 12 seconds later, the funds reached the attacker’s second collection wallet.**

_So how does one stolen signature empty a bridge in a single call, and why did nothing on-chain ask it to stop?_

### The Keys That Never Spoke

_Every supported token in the SingularityNET bridge exists across two chains. For supported Cardano-to-Ethereum routes, [the token is burned on Cardano](https://dev.singularitynet.io/docs/products/Bridge/); the Ethereum-side bridge then mints or releases its counterpart._

**The Ethereum-side contract does not independently verify the Cardano burn. [It accepts a signature from its configured authorizer as the attestation that the burn occurred](https://asi1.ai/artifact/a7e8d9b0-de17-4646-a82b-3d56299022f7).**

Bitquery counted five authorizer addresses across the affected bridges, [none of which had ever sent an on-chain transaction](https://bitquery.io/investigations/asi-bridge-counterfeit-supply).  
  
That pattern is consistent with off-chain keys used to approve bridge releases rather than transact themselves.  
  
SingularityNET later said an unauthorized party had "[gained access to part of our cloud infrastructure](https://x.com/SingularityNET/status/2102221596752482469)."  
  
_How they gained access, was not mentioned._

**That design concentrated each bridge's trust in whatever held its signing authority.**

**Bridge converter, drained of its entire FET balance:**  
[0xab424a430cc09864fa1277a38193111705adf3a3](https://etherscan.io/address/0xab424a430cc09864fa1277a38193111705adf3a3)

**[Conversion authorizer](https://etherscan.io/address/0xab424a430cc09864fa1277a38193111705adf3a3#readContract) whose signature approved the drain:**  
[0x69e5446b07b23de0a76730062c3252152216c85c](https://etherscan.io/address/0x69e5446b07b23de0a76730062c3252152216c85c)

**Drain transaction, releasing 8,721,530.40 FET:**  
[0xfe12c63b322d52727c615f3342222138d1563400a9880cebb516a9a162ac69e2](https://etherscan.io/tx/0xfe12c63b322d52727c615f3342222138d1563400a9880cebb516a9a162ac69e2)

[An ASI Alliance forensic report prepared by Athena recovered the drain signature and matched it to the live authorizer](https://asi1.ai/artifact/a7e8d9b0-de17-4646-a82b-3d56299022f7), which it says had not changed since the converter’s September 2024 deployment.  
  
Two design choices amplified the impact of the compromised authorization.

[conversionIn() relied on a single EOA signature as its sole authorization check](https://x.com/SlowMist_Team/status/2101503515877396639) and omitted the checkLimits(amount) control used by conversionOut().  
  
_[The configured 100-to-1,000,000-FET limits did not constrain conversionIn()](https://asi1.ai/artifact/a7e8d9b0-de17-4646-a82b-3d56299022f7), so the contract accepted an 8.72 million FET release, 8.7 times its stated maximum._

**[The ASI Alliance forensic report prepared by Athena found that all 100 legitimate ConversionIn events used UUID-style IDs from SingularityNET's backend](https://asi1.ai/artifact/a7e8d9b0-de17-4646-a82b-3d56299022f7). The drain's ID was raw non-ASCII bytes, the only exception. The transaction did not look like normal bridge traffic.**

[NuNet’s leg went one level higher. The 408.5M NTX never touched a converter](https://bitquery.io/investigations/asi-bridge-counterfeit-supply): an address holding NuNet’s on-chain mint role, called mint() directly on the token contract.

  

**NTX mint, [408,532,878.13 tokens](https://asi1.ai/artifact/a7e8d9b0-de17-4646-a82b-3d56299022f7):**  
[0xe14442f6171d8a652e79d44336e58c00cdab271bdb69c668493d420e03ee13ab](https://etherscan.io/tx/0xe14442f6171d8a652e79d44336e58c00cdab271bdb69c668493d420e03ee13ab)

  
The [AGIX mint run was executed through SingularityNET’s Deployer address](https://bitquery.io/investigations/asi-bridge-counterfeit-supply).  
  
**SingularityNET Deployer Address:**  
[0xA7A31d206042B8A3E81aa4cf8c68c1B76856eE48](https://etherscan.io/address/0xA7A31d206042B8A3E81aa4cf8c68c1B76856eE48)

  
_[The AGIX, WMTX, and CGV converter runs each ended on an odd-sized final call](https://bitquery.io/investigations/asi-bridge-counterfeit-supply), a pattern consistent with automated minting that continued until an operational constraint was exhausted._

**[World Mobile’s WMTX converter did impose a per-call limit](https://bitquery.io/investigations/asi-bridge-counterfeit-supply). It did not stop the attack; it forced the attacker to split the minting into 503 calls, mostly for exactly 1 million WMTX as many as ten in a single block.**

[Bitquery reported that 16 wallets were swept over 21 minutes before any token was minted](https://bitquery.io/investigations/asi-bridge-counterfeit-supply), with related BNB Chain activity in the same window. It said four of those wallets carried SingularityNET or NuNet staff labels in its directory, including the account that deployed the converters in 2022.  
  

The incident involved multiple authorization paths associated with the affected projects.  

[A recovery address changed the authorizer configuration for the NuNet, Cogito, and Rejuve converters and later froze NTX](https://explorer.bitquery.io/ethereum/address/0x78a60de4fbf1f1c2daf8c94b5e40f877032cef00). Bitquery reports that the AGIX and WMTX converters were not rescued because their owners were a Gnosis Safe and a 3-of-4 Safe, respectively.

**According to Bitquery, [AGIX and WMTX minting continued for roughly another hour while the handovers went through](https://explorer.bitquery.io/ethereum/address/0x78a60de4fbf1f1c2daf8c94b5e40f877032cef00).**

“[Our systems are audited regularly and we follow industry security standards](https://x.com/SingularityNET/status/2102221596752482469),” SingularityNET wrote.  
  

Audits can assess smart-contract code. They do not, by themselves, prove that the off-chain systems and private keys used to create or exercise signing authority are secure.

  
**Valid signatures from authorization keys associated with the affected projects then enabled a large additional token supply.**  
  
_So, how much of the reported headline value was realized in liquid assets, rather than represented by newly issued tokens that the market might not absorb?_  
  

### Paper Millions

  
_The figures in this story measure different things._  
  
**Tokens taken from a contract without authorization are direct asset removals and tokens minted without authorization are supply damage.**  
  
ETH and stablecoins received from sales or direct extractions by addresses attributed to the attacker are realized proceeds. A wallet balance marked at a quoted token price is neither automatically cash nor automatically recoverable value.  
  
Early coverage repeatedly blurred those categories.  
  

Printing 2.3 billion tokens was the easy part. Finding buyers was not.  
  

_The bridge drain produced the largest single identified realization event. A MetaMask-routed swap converted the drained FET into 522.78 ETH, after the route’s visible fees._

  

**FET sale, 8,72 million FET swapped for 522.78 ETH:**  
[0x98f6e59b54fd4d2c086cc7cab4e7070edff6410210a1bf1fbaffd62da3b76d1c](https://etherscan.io/tx/0x98f6e59b54fd4d2c086cc7cab4e7070edff6410210a1bf1fbaffd62da3b76d1c)

Two addresses received substantial portions of the identified proceeds and minted supply.  
  
[The attacker’s main hub received the drained FET and minted NTX](https://bitquery.io/investigations/asi-bridge-counterfeit-supply). In this reconstruction, it was the recipient in the first 26 of 90 AGIX mint calls and the first 54 of 503 WMTX mint calls.  
  
**Attacker’s Main Hub, recipient of drained FET, minted NTX, and early AGIX/WMTX mint calls:**  
[0x2dcc1085fdcf418b421e45e86e4e54637cc21dfe](https://etherscan.io/address/0x2dcc1085fdcf418b421e45e86e4e54637cc21dfe)

_[Wallet 2 received the remaining 64 AGIX calls](https://bitquery.io/investigations/asi-bridge-counterfeit-supply), 449 WMTX calls, all 50 CGV mint calls, and the payout-contract USDC._

**Wallet 2, recipient of later AGIX/WMTX mints, CGV mints, and payout-contract USDC:**  
[0x83f4424a401a9bb75f90314f21adaea6a9ce09c5](https://etherscan.io/address/0x83f4424a401a9bb75f90314f21adaea6a9ce09c5)

[Bitquery traces the Main hub’s early funding](https://bitquery.io/investigations/asi-bridge-counterfeit-supply) to ChangeNOW.  
  
**ChangeNOW funding:**  
[0xa99a8b71bd90d295db305639fc976339a057812c2693f3e44ae9288e5c13ebe1](https://etherscan.io/tx/0xa99a8b71bd90d295db305639fc976339a057812c2693f3e44ae9288e5c13ebe1)

The Attacker’s Main Hub Ethereum history also shows an Across bridge fill on September 1.  
  
**Across bridge fill, recorded for the hub on September 1:**  
[0xb56d3b900b5ac694d56d6efb9552a89fc0a14641eceefa7e16107cb8ccb0ea6d](https://etherscan.io/tx/0xb56d3b900b5ac694d56d6efb9552a89fc0a14641eceefa7e16107cb8ccb0ea6d)

_Wallet 2 received ETH for gas at 04:04 UTC on September 20 and started to sell roughly a minute later._

**Wallet 2 gas funding and initial sale, 04:04 UTC on September 20:**  
[0x4e8894823caaf8fefaf0849cf69b30148ae5ddcee9e7f9bd0c1be0dae0c720c2](https://etherscan.io/tx/0x4e8894823caaf8fefaf0849cf69b30148ae5ddcee9e7f9bd0c1be0dae0c720c2)

**Wallet 2 WMTX approval, 100,000 WMTX authorized for MetaMask’s Swap Router:**  
[0x8fcaa005da0c1a5ab138898571e2974ba8aa8f0b9864381e5b2b98b81e702da9](https://etherscan.io/tx/0x8fcaa005da0c1a5ab138898571e2974ba8aa8f0b9864381e5b2b98b81e702da9)

**Wallet 2 first WMTX sale, 100,000 WMTX swapped for 0.832455441 ETH after the displayed MetaMask fee:**  
[0xcf4b119f38d0da10dccac787234e05c6cabe3440dfe303f4f407daa92ab8829e](https://etherscan.io/tx/0xcf4b119f38d0da10dccac787234e05c6cabe3440dfe303f4f407daa92ab8829e)

**That split complicates the coverage. [PeckShield’s early alert valued assets it attributed to the exploiter at $16.77 million](https://x.com/PeckShieldAlert/status/2101602701251334368): 198.3 million AGIX, 649 ETH, and 33.538 million WMTX.**  
  
_The sales showed the difference. A MetaMask-routed 10 million NTX swap through Mayan returned 940.39 USDT. Wallet 2, meanwhile, used UniswapX orders in which third-party fillers supplied the ETH consideration; [the settlement records do not reveal how those fillers sourced, hedged](https://developers.uniswap.org/docs/liquidity/uniswapx/overview), or ultimately managed the WMTX they received._

**NTX MetaMask/Mayan route, 10,000,000 NTX entered; 940.5087 USDT reached Mayan’s Ethereum source contract for BNB Chain settlement:**  
[0xb6ecca4deeb2a616507a3f5779cb12db4fd986e5ee37c1832237fae2a1f1258](https://etherscan.io/tx/0xb6ecca4deeb2a616507a3f5779cb12db4fd986e5ee37c1832237fae2a1f1258f)

**CGV was the extreme case:** A swap of 246.2 million CGV into Cogito’s Uniswap pool returned just 0.0123 ETH.

**CGV sale, 246,200,000 CGV swapped for 0.0123 ETH:**  
[0x69a28fb152b2b1b4158ec3db17f7baf565b644859a5150c38729bbb2d198bfad](https://etherscan.io/tx/0x69a28fb152b2b1b4158ec3db17f7baf565b644859a5150c38729bbb2d198bfad)

A transfer from the payout contract sent 289,575.10 USDC to wallet 2, adding a second large stablecoin receipt without requiring a sale of the minted tokens.

**Payout-contract transfer, 289,575.1047 USDC sent to intermediary:**  
[0x869343d87a137a52aebce119c8c35e2fc3500205bf7a8c574ec2e8f4ab677c18](https://etherscan.io/tx/0x869343d87a137a52aebce119c8c35e2fc3500205bf7a8c574ec2e8f4ab677c18)

  
**Intermediary transfer, 289,575.1047 USDC forwarded to wallet 2:**  
[0xca9facda3f3629fa72ff98b4c8e663d3b415011979d749fab96ed9eda287e66f](https://etherscan.io/tx/0xca9facda3f3629fa72ff98b4c8e663d3b415011979d749fab96ed9eda287e66f)

_Through September 22, this transaction-level reconstruction finds that the two principal addresses received about 742.7 ETH-equivalent and $362,075 in stablecoins. It excludes unsold AGIX, WMTX, CGV, and NTX, treats WETH one-for-one with ETH, and counts gross receipts rather than net profit._

**Much of the liquid value did not remain in the two principal wallets.**

On or before 00:00 UTC on September 21, three separate wallets made USDC deposits of [75,000 USDC to Chainflip](https://etherscan.io/tx/0x3c8b12fedf147d82c8a5506edf3fcad4b7e25c8b96e4fb13b10cf2915aba0076), [75,000 USDC to Baltex](https://etherscan.io/tx/0x05d6d42c75356900e523116d34892b480e9f9134ba195db698d7b1448e0b0696), and [118,015.16 USDC to Chainflip](https://etherscan.io/tx/0xea254b148da1a6d028050f3a59f87845e3dc177ca37ef6441c7eb6cff47eb8ed).  
  
[Baltex describes its service as not requiring KYC and advertises a “private” route involving Monero](https://baltex.io/support/faq). Separately, [AMLBot said a Chainflip broker rejected an ETH deposit that it attributed to the same attacker](https://x.com/AMLBotHQ/status/2102416103255552509).  
  

**Chainflip transfer, 75,000 USDC:**  
[0x3c8b12fedf147d82c8a5506edf3fcad4b7e25c8b96e4fb13b10cf2915aba0076](https://etherscan.io/tx/0x3c8b12fedf147d82c8a5506edf3fcad4b7e25c8b96e4fb13b10cf2915aba0076)

**Baltex transfer, 75,000 USDC:**  
[0x05d6d42c75356900e523116d34892b480e9f9134ba195db698d7b1448e0b0696](https://etherscan.io/tx/0x05d6d42c75356900e523116d34892b480e9f9134ba195db698d7b1448e0b0696)

  
**Final Chainflip transfer, 118,015.16 USDC:**  
[0xea254b148da1a6d028050f3a59f87845e3dc177ca37ef6441c7eb6cff47eb8ed](https://etherscan.io/tx/0xea254b148da1a6d028050f3a59f87845e3dc177ca37ef6441c7eb6cff47eb8ed)

  
Shortly before midnight UTC, wallet 2 sent 93.70 ETH to a recipient wallet whose owner no cited public source identifies. About 40 minutes later, the attacker’s hub wallet sent two transfers of exactly 100 ETH each.  
  

**Wallet 2 outbound transfer, 93.70 ETH to recipient wallet:**
[0x605d803890ae4eddc684f82f6de1a82c49a6a3f5646295c1a01fd897fa2a7577](https://etherscan.io/tx/0x605d803890ae4eddc684f82f6de1a82c49a6a3f5646295c1a01fd897fa2a7577)

  
**Recipient Wallet:**  
[0x2fD3285C93437077EF5FA6cecc367FD24d0fF726](https://etherscan.io/address/0x2fd3285c93437077ef5fa6cecc367fd24d0ff726)

**Attacker’s main hub wallet outbound transfer, 100 ETH:**  
[0xa8511628388c330db78fcdcfe7af5577e1f300adee795b578508fb21203b4756](https://etherscan.io/tx/0xa8511628388c330db78fcdcfe7af5577e1f300adee795b578508fb21203b4756)

  
**Attacker’s main hub wallet outbound transfer, 100 ETH:**
[0x14399c61687de491461f76e961a91d2c0dcda4c6bb00ba332ec18b19d394822f](https://etherscan.io/tx/0x14399c61687de491461f76e961a91d2c0dcda4c6bb00ba332ec18b19d394822f)

  
_[AMLBot later described two separate 100-ETH movements](https://x.com/AMLBotHQ/status/2102416103255552509). It said one leg was converted to about 266,000 USDC and moved through CCTP, Arbitrum, and Hyperliquid into “FXMR._  
  
**[Chainflip’s broker rejected the other leg](https://x.com/AMLBotHQ/status/2102416103255552509), which was then reportedly swapped through THORChain into roughly 3.28 BTC. AMLBot did not publish source addresses.**  
  
[Dusting and spoofed token transfers appeared on both wallets](https://etherscan.io/address/0x83f4424a401a9bb75f90314f21adaea6a9ce09c5), sent from lookalike addresses resembling prior counterparties, a pattern consistent with address-poisoning attempts. If that was the purpose, someone was trying to rob the robber.  
  
As of September 25, [the attacker’s hub wallet held about 433 ETH, 15.94 WETH, and 52,395 mUSD](https://etherscan.io/address/0x2dcc1085fdcf418b421e45e86e4e54637cc21dfe#asset-multichain), consistent with [AMLBot’s roughly 433-ETH report](https://x.com/AMLBotHQ/status/2102416103255552509) the day before, [along with 198.30 million AGIX and 33.54 million WMTX](https://etherscan.io/address/0x2dcc1085fdcf418b421e45e86e4e54637cc21dfe#asset-multichain).  

[Wallet 2 held about 18,109 USDC, 625.86 million AGIX, 166.49 million WMTX, and 246 million](https://etherscan.io/address/0x83f4424a401a9bb75f90314f21adaea6a9ce09c5#asset-multichain) CGV.  
  
The tokens’ displayed value is not their realizable value. A sale of holdings this large could face thin liquidity and substantial price impact; the relevant question is not what the balances display, but how much value can actually be sold without collapsing the market.

**Under this reconstruction, the operation generated roughly $2.29 million in gross liquid proceeds.**  
  
_The cash was portable. The remaining 1.27 billion tokens were not. Who bears the cost if those positions are ever sold?_

### Seventy Percent Fake

  
_Prices can recover. Supply cannot._

  
**[Bitquery counted 1.28 billion AGIX across the chains in its reconciliation, including 895.96 million minted during the attack, 70.1% of the measured total](https://bitquery.io/investigations/asi-bridge-counterfeit-supply). The remaining 382.65 million traced to the pre-attack supply.**  
  
In the same analysis, [unauthorized mints accounted for 81.1% of measured CGV supply, 32.4% of measured WMTX supply, and 29.0% of measured NTX supply](https://bitquery.io/investigations/asi-bridge-counterfeit-supply).  
  
[The NTX mint brought the measured cross-chain total to 1.41 billion](https://bitquery.io/investigations/asi-bridge-counterfeit-supply), above [the one-billion-token supply specified in NuNet’s documentation](https://docs.nunet.io/getting-ntx/token-overview/).

[About 40.1 million unauthorized NTX crossed to Cardano](https://bitquery.io/investigations/asi-bridge-counterfeit-supply), and roughly 40 million reached ordinary liquidity pools there. The transaction trail can trace their route, but once those tokens entered the pools, the pools could not distinguish them from authorized NTX.

_FET’s problem was not unauthorized supply; it was whether the bridge could pay. [The Ethereum converter that releases FET bridged from Cardano was emptied](https://etherscan.io/address/0xab424a430cc09864fa1277a38193111705adf3a3), while roughly [870 million FET remained on Cardano](https://bitquery.io/investigations/asi-bridge-counterfeit-supply)._  
  
**[No one had tried to move FET from Cardano to Ethereum since the drain](https://bitquery.io/investigations/asi-bridge-counterfeit-supply), so no one had yet been left waiting for tokens the empty converter could not pay out.**

**[NTX posed the opposite problem](https://bitquery.io/investigations/asi-bridge-counterfeit-supply):** About 40 million unauthorized tokens had reached ordinary Cardano liquidity pools, where the pool treats them like any other NTX despite their unauthorized origin.

[SingularityNET says it revoked compromised access](https://x.com/SingularityNET/status/2102221596752482469), deactivated the affected bridges and conversion contracts, paused AGIX and NTX transfers on Ethereum. It says the bridges will remain offline until an independent security review finds them safe to restore.  
  
[Bitquery found three of five authorizer keys still unchanged on September 20](https://bitquery.io/investigations/asi-bridge-counterfeit-supply); with the bridges switched off, that claim will only be tested when someone switches them back on.

_In regards to AGIX holders, SingularityNET initially said it was working on a “[legitimate, verified path forward for eligible holders](https://x.com/SingularityNET/status/2102221596752482469).”_  
  
**[It has since announced that it will retire the legacy AGIX token and issue a replacement for affected holders](https://x.com/SingularityNET/status/2103104425879347512), though it has not yet explained who will qualify or how replacement tokens will be distributed. AGIX on Ethereum remains paused.**  
  
**With roughly seven in ten measured AGIX units minted during the attack, eligibility is still the hard part:** Any replacement scheme must decide how to treat holdings that passed through ordinary markets after the unauthorized mint.

[Fetch.ai says its contracts were not affected](https://x.com/Fetch_ai/status/2101707839979016337).  
  
[The ASI Alliance acknowledged $1.56 million in FET withdrawn from the converter and promised a full report](https://x.com/ASI_Alliance/status/2101567173189656791). That report has not appeared, and no compensation plan has been announced for holders, or for the fillers and liquidity providers who paid real money for counterfeit tokens.

The signatures the bridge contracts accepted were valid. The contracts checked them and acted; they did not check whether the cross-chain events those signatures claimed had actually happened.  
  
**NuNet’s NTX mint took a different route:** The attacker used the token’s own mint authority directly.

**An alliance built on the promise of decentralized AI left the authority to mint four tokens, and release FET from a converter, within reach of one infrastructure compromise.**

_If the future these projects are selling is autonomous software, who is watching the software that holds the keys?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_[The bridge and conversion contracts accepted signatures](https://bitquery.io/investigations/asi-bridge-counterfeit-supply) from their designated authorizers._  
  
**For the cross-chain mints, the contracts treated those signatures as proof of a corresponding event on another chain rather than checking that event themselves.** 
  
**[The NTX mint took a different route](https://bitquery.io/investigations/asi-bridge-counterfeit-supply):** The attacker called mint() on the token contract directly, using its mint authority.

[SingularityNET says an unauthorized party gained access to part of its cloud infrastructure](https://x.com/SingularityNET/status/2102221596752482469) and used it to mint tokens and withdraw assets through its bridge infrastructure.

_[Fetch.ai says its contracts were not affected](https://x.com/Fetch_ai/status/2101707839979016337)._  
  
**The public statements do not explain how the attacker obtained that access or precisely how each authority was exposed.**  
  
[The on-chain record traces the transactions those authorities permitted](https://bitquery.io/investigations/asi-bridge-counterfeit-supply). It does not establish how the attacker obtained access or who made the security decisions behind it.

**[Bitquery found that the five bridge-authorizer addresses had never sent a transaction](https://bitquery.io/investigations/asi-bridge-counterfeit-supply), consistent with their use to sign messages off-chain. The contracts checked the signatures.**  
  
_When a signature is treated as proof, who checks whether it tells the truth?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
