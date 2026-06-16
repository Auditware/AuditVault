---
tags:
  - blockchain/ethereum
  - blockchain/polygon
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - sector/staking
  - sector/token
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
title: "BonqDAO - REKT"
protocol: "[[Bonqdao]]"
date: 2023-02-01
loss_usd: 120000000
auditors:
source: "https://rekt.news/bonq-rekt"
excerpt: "BonqDAO got bonked for $120M, but the anonymous attacker got away with less than $2M. The hacker was able to manually update the price feed of collateral by staking just $175 worth of TRB tokens."
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[trigger/price-manipulation]]"
  - "[[access-roles]]"
  - "[[chainlink-round-completeness]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# BonqDAO - REKT

> **Loss:** $120,000,000 | **Date:** 2023-02-01 | **Audited by:** Out of scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/bonq-header.png)

**[BonqDAO](https://bonqdao.com/) got bonked for $120M.**

_But the anonymous attacker got away with less than $2M._

The Polygon-based lending and stablecoin protocol was hit by a two-stage attack on Wednesday in another example oracle manipulation.

The alarm was raised on Twitter by [@spreekaway](https://twitter.com/spreekaway/status/1620864016741732353), who live-tweeted the dumping of stolen funds. The affected protocols, [BonqDAO](https://twitter.com/BonqDAO/status/1620908233761378304) and [AllianceBlock](https://twitter.com/allianceblock/status/1620887759656460289) (whose ALBT token was used in the exploit), both confirmed the hack in the following hours.

Despite all the action being visible on-chain, BonqDAO telegram admins attempted to [downplay](https://twitter.com/spreekaway/status/1620874236368924673) the incident whilst the team presumably worked out what had happened.

>FUD and spam will not be tolerated

_rekt.news reckons: “using instant price feeds for collateral valuation will not be tolerated.”_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Peckshield](https://twitter.com/peckshield/status/1620917292514299904), [Beosin](https://twitter.com/BeosinAlert/status/1621095640486006787)_

**Attacker’s address:** [0xcacf2d28b2a5309e099f0c6e8c60ec3ddf656642](https://polygonscan.com/address/0xcacf2d28b2a5309e099f0c6e8c60ec3ddf656642)

**Example attack tx:** [0x31957ecc…](https://polygonscan.com/tx/0x31957ecc43774d19f54d9968e95c69c882468b46860f921668f2c55fadd51b19)

**Attacked smart contract:** [0x8f55d884cad66b79e1a131f6bcb0e66f4fd84d5b](https://polygonscan.com/address/0x8f55d884cad66b79e1a131f6bcb0e66f4fd84d5b)

Samczsun [summarised](https://twitter.com/samczsun/status/1620918455468982272) the attack as follows:

>the attacker said "btw 1 ALBT = 5 billion MATIC now" and Bonq said "ok"

The hacker was able to manually update the [Tellor](https://twitter.com/WeAreTellor) price feed of (wrapped) WALBT collateral by staking 10 TRB tokens (worth just ~$175).

**The attacker then used the submitValue function to report WALBT price to the oracle and, because BonqDAO uses the instant value, the attaker was able to borrow against their inflated collateral within the same tx.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/bonq-code1.png)

Firstly, the ALBT price was raised, allowing the attacker to mint 100M BEUR, Bonq’s Euro-pegged stablecoin against 0.1 WALBT collateral.

Then, in a subsequent transaction, the WALBT price was reset to extremely low, allowing the attacker to liquidate user’s WALBT collateral, and netting approximately 113M WALBT.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/bonq-code2.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/bonq-code3.png)

**Beosin [provided](https://twitter.com/BeosinAlert/status/1621095640486006787) a step-by-step:**

>The attacker calls the depositStake function of the TellorFlex contract, depositing 10 $TRB. Why 10 TRBs? We can see that the takeAmount is exactly 10*10^18
>
>Next, the hacker calls the submitValue function to submit a request to change the $WALBT price. The function determines if the caller's stake amount has reached the pre-set takeAmount, which is why the attacker needs to first stake 10 TRB tokens (10^18 is decimal point).
>
>This function will record the price submitted by the caller, in this case 50000000000000000000000000000000.
>
>After the price is set, the hacker calls the createTrove function of the Bonq contract to create the trove(0x4248FD) contract, which is a contract of data recording, borrowing and liquidating. Next, the attacker stakes 0.1 $WALBT to the contract to perform a borrowing operation.
>
>Normally, the borrowing amount should be < 0.1 WALBT to ensure collateral rate in a safe range. But in this contract, the calculation of the collateral value is via TellorFlex contract. The attacker has already raised $WALBT price, thus being able to borrow 100M $BEUR.
>
>The hacker sets $WALBT to a low price in 2nd TX. When the $WALBT price is extremely low, the stake rate of WALBTs staked by other users will be at liquidation, enabling hacker to liquidate $WALBT staked by other users at low cost, eventually obtaining ~114M WALBT.

-

**Losses have been widely reported to be up to $120M, using the tokens’ prices at the time of the hack. But low liquidity meant the attacker has only managed to swap the loot to around $1.7M worth of ETH and DAI, so far.**

_Nevertheless, the damage to BonqDAO was brutal, with [TVL drained](https://defillama.com/protocol/bonqdao) from ~$13M yesterday to just over $100k at the time of writing._

Stolen BEUR was dumped on Polygon for just over $500K. Funds were then sent to the attacker’s [Ethereum address](https://etherscan.io/address/0xcacf2d28b2a5309e099f0c6e8c60ec3ddf656642), where the ALBT was repeatedly dumped for ETH. The attacker’s ETH address currently holds 711 ETH (~$1.2M) and 535k DAI, as well as 89M ALBT (supposedly worth ~$3M, if the attacker can find somewhere to sell it…).

BlockSec provided a detailed flowchart of funds, which can be [found here](https://twitter.com/MetaSleuth/status/1621006016065474560). The attacker’s ETH address was [funded](https://etherscan.io/tx/0xdf4f769c9acbf4fc1c8418a31cc68ff86a3ff296f330d4c0b89b327a2c199b06) via Tornado Cash shortly before the attack, and the stolen funds have since been deposited back into the mixer.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

Omniscia’s [audit](https://omniscia.io/reports/bonq-borrowing-protocol/) of BonqDAO raised concerns over “_multiple vulnerabilities as well as core design flaws_”.

According to Omniscia's [post-mortem](https://medium.com/@omniscia.io/bonq-protocol-incident-post-mortem-4fd79fe5c932), BonqDAO decided to:

>not move forward with the implementations audited at the time, opting to integrate Chainlink oracles in the future.
>
>The Bonq Protocol has introduced numerous updates since the time the audit was finalized, including all contracts involved in the vulnerability (ConvertedPriceFeed, ChainlinkPriceFeed, and TellorPriceFeed). **These contracts were never in scope of any audit conducted by the Omniscia team and thus are considered to be unaudited code.**

**While it may have been BonqDAO had the vulnerability, AllianceBlock has suffered significant collateral damage from this incident.**

The sell-off of Bonq users' liquidated [ALBT](https://www.coingecko.com/en/coins/allianceblock) caused its price to dump up to ~75% following the attack. AllianceBlock have stated they will [reissue](https://twitter.com/allianceblock/status/1620887765058727936) the token and airdrop to users based on a Snapshot from before the hack.

Bonq’s Euro stablecoin, [BEUR](https://www.coingecko.com/en/coins/bonq-euro), has dropped to approximately 25% below its peg and the price of the DAO’s token, [BNQ](https://www.coingecko.com/en/coins/bonq), has also taken a hit of over 30%.

_AllianceBlock may not be at fault for the vulnerability, but perhaps they need to work on their due diligence._

It may not be the most exciting part of DeFi, but it’s surely amongst the most important.

If AllianceBlock wants to achieve their aims of “_seamlessly bring[ing] DeFi and TradFi together_”, maybe they should take a more TradFi approach to due diligence.

_But it looks like it may already be too late for Bonq._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
