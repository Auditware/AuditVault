---
tags:
  - blockchain/bitcoin
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/fantom
  - sector/bridge
  - sector/governance
  - sector/stable
  - precondition/insider
title: "Anyswap - REKT"
protocol: "[[Anyswap]]"
date: 2021-07-10
loss_usd: 7900000
auditors:
source: "https://rekt.news/anyswap-rekt"
excerpt: "The bridges are burning. Anyswap and Chainswap in 24 hours. They say it's fixed, but can you trust them?"
genome:
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
  - "[[timelock-timestamp-bypass]]"
---
# Anyswap - REKT

> **Loss:** $7,900,000 | **Date:** 2021-07-10 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/anyswap-header.png)  
**The bridges are burning.**

AnySwap and [Chainswap](https://www.rekt.news/chainswap-rekt/) in a 24 hour period.

**Anyswap were quick to [announce](https://twitter.com/AnyswapNetwork/status/1414248253822881793) the incident.**

>An exploit was detected in the new anyswap v3 prototype, all bridge funds used in v1/v2 are safe.
>Remedial action already in place for all exploited funds.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/anyswap-investigates.png)  

**Attacker’s address:** [0x0aE1554860E51844B61AE20823eF1268C3949f7C](https://etherscan.io/address/0x0aE1554860E51844B61AE20823eF1268C3949f7C)

**The funds lost were all $ pegged stablecoins totalling approximately $7.9M.**

Just over 5.5M $MIM were taken in [this](https://etherscan.io/tx/0xecaaf8b57b6587412242fdc040bd6cc084077a07f4def24b4adae6fbe8254ae3) transaction.

_A further 3 transactions saw a total of ~2.4M USDC stolen._

**1:** [via Ethereum](https://etherscan.io/tx/0xc80e7cfeb16143cba4d5fb3b192b7dbe70e9bcd5ca0348facd20bf2d05693070) - 1,536,821.7694 USDC

**2:** [via BSC](https://bscscan.com/tx/0xa8a75905573cce1c6781a59a5d8bc7a8bfb6c8539ca298cbf507a292091ad4b5) - 749,033.37 USDC

**3:** [via Fantom](https://ftmscan.com/tx/0x7312936a28b143d797b4860cf1d36ad2cc951fdbe0f04ddfeddae7499d8368f8) - 112,640.877101 USDC

The root of the exploit lay in the prototype V3 Router’s use of [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm), the algorithm securing its MPC wallet by generating private keys.

The key here is that every k value calculated in the algorithm should be based on a different, random number for each signature. If two or more transactions contain a repeated k value, then the private key can be back-calculated.

This potential security flaw has been known since 2010, when console hacking group [fail0verflow](https://fail0verflow.com/blog/) detailed the process [here](https://web.archive.org/web/20150627235425/https://events.ccc.de/congress/2010/Fahrplan/attachments/1780_27c3_console_hacking_2010.pdf) (p123-129). And its application to blockchain keys was later detailed in [2013](https://web.archive.org/web/20160308014317/http://www.nilsschneider.net/2013/01/28/recovering-bitcoin-private-keys.html).

Credit: [Tayvano](https://twitter.com/tayvano_/status/1414429115487117316?s=20)

Despite this, Anyswap’s [post-mortem](https://anyswap.medium.com/anyswap-multichain-router-v3-exploit-statement-6833f1b7e6fb) states that the attacker detected a repeated k value in two of the V3 Router’s transactions on BSC, and was able to back-calculate the private key.

Anyswap stressed that “only the new V3 cross-chain liquidity pools have been affected” and that the bridge remains operational via V1 and V2 Routers. The post-mortem also states that the V3’s code has been fixed and will reopen after the 48hr timelock installed by the team expires.

**The team has also reached out to potential bug bounty hunters:**

>Anyswap will reward anyone who reports bugs to us. This will help us build truly secure and even better cross-chain solutions.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/anyswap-linebreak.png)  

**The need for fully secure bridges grows stronger by the day, as crypto capital spreads across multiple chains.**

However, the security architecture for cross-chain bridges is complex - proposing a puzzle to developers which has yet to be solved. 

_Anyswap V3 was a prototype, so perfection was not expected, but considering the nature of the exploit, it seems this loss was preventable._

**Although action was taken relatively quickly to prevent another attack, [@nicksdjohnson](https://twitter.com/nicksdjohnson/status/1414512086672052238?s=20) is of the opinion that the patch does not do enough.**

>Setting aside the fact that there's a much better, industry standard solution to this, their patch:
>Fails catastrophically (exposing users to another hack) if you accidentally delete a file, or restore from an old backup, or move to a new server.

>And it requires every signature request to scan every previous one, but really that's the smallest problem here.

Anyswap call themselves a “trustless protocol”, but perhaps that label no longer has the desired effect after such a damning evaluation from a leading Ethereum developer.

**Do you trust the [Anyswap patch?](https://github.com/anyswap/Anyswap-MPCNode/commit/31f94ff2c8fac19549f6c82b849977730f63bd63)** 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/04/second-conc2.png)
