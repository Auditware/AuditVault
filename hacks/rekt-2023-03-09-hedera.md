---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/stable
  - has/audit
  - impact/loss-of-funds/locked-funds
title: "Hedera - REKT"
protocol: "[[Hedera]]"
date: 2023-03-09
loss_usd: 515000
auditors:
  - "[[FP Complete]]"
source: "https://rekt.news/hedera-rekt"
excerpt: "A nebulous threat rattled the entire Hedera ecosystem, yesterday. Dapps from across the network were affected and Hedera remains down while investigations continue. DeFi users spook easily… and with g"
genome:
  - "[[locked-funds]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[oracle-freshness]]"
---
# Hedera - REKT

> **Loss:** $515,000 | **Date:** 2023-03-09 | **Audited by:** FP Complete

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/hedera-header.png)

**A nebulous threat rattled the entire [Hedera](https://hedera.com/) ecosystem, yesterday.**

_Fear, rumour and suspicion took hold as both users and devs attempted to make sense of the chaos._

The “_proof-of-stake public ledger_”, built on blockchain-alternative [Hashgraph](https://hedera.com/learning/hedera-hashgraph/what-is-hashgraph-consensus), saw its [TVL plunge](https://defillama.com/chain/Hedera) by a third since the attack, from $36.8M to $24.6M.

The HBAR Foundation [announced](https://twitter.com/HBAR_foundation/status/1633803120328208386) “_network irregularities_” and, given the widespread nature of the attack, users frantically sought a safe haven for their funds.

Dapps from across the network were affected, including AMMs [Pangolin](https://twitter.com/Pangolin_Hedera/status/1633771791415132162) and [Heliswap](https://twitter.com/HeliSwap_DEX/status/1633783357703061504). After an initial [panic](https://twitter.com/SaucerSwapLabs/status/1633796307289505793), the larger SaucerSwap [stated](https://twitter.com/SaucerSwapLabs/status/1633845705638031362) that their users had not been affected. The Hashport bridge was [deactivated](https://twitter.com/HashportNetwork/status/1633771330280767488) in response to the attack.

**The lack of certainty caused chaos, and what turned out to be around $515k stolen by the attacker, turned into $12M of damage to the ecosystem.**

Later, Hedera [announced](https://twitter.com/hedera/status/1633925272830623746) it would be “_turning off network proxies on mainnet, making it inaccessible_” to users. At the time of writing, Hedera [remains down](https://status.hedera.com/) while investigations continue.

_When will users get some clarity?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**Details remain scant on exactly how the exploit worked, however, it is clear that the issue was in the network’s Smart Contract Service code.**

In a Twitter thread, Hedera [explained](https://twitter.com/hedera/status/1634055353435561986) that “_The attacker targeted accounts used as liquidity pools on multiple DEXs that use Uniswap v2-derived contract code ported over to use the [Hedera Token Service](https://hedera.com/token-service)_”. HTS was audited by [FP Complete](https://www.fpcomplete.com/blog/hedera-platform-audit/) in 2021.

The head of Pangolin [published](https://twitter.com/jtrollip/status/1634057932882186240) a preliminary writeup which states the teams believed that the exploit was “_only affecting Hashport tokens. This proved to be false. Further investigation revealed all hts [Hedera Token Service] tokens were at risk_”.

This allowed the attacker to burn bridged/wrapped tokens, as well as remove LP positions from the affected DEXs. According to the report, some funds were bridged back to ETH, after the Hashport team deactivated the bridge, the attacker turned to CEXs.

**Attacker’s address: [https://hashscan.io/mainnet/account/0.0.2015717?p2=1](https://hashscan.io/mainnet/account/0.0.2015717?p2=1)**

The report puts losses from Pangolin at $120k. HeliSwap lost just $2K, according to their [rundown](https://www.heliswap.io/news/hedera-vulnerability-event-log) of events.

**The attacker’s alleged addresses contain a total of around $515k;** ~$60k of HBAR and $280k of HTS stablecoins [on Hedera](https://hashscan.io/mainnet/account/0.0.2015717?p2=1), and $175k of ETH [on Ethereum](https://etherscan.io/address/0x2fd2a8d39fd7c4751fea109a86fa4cdd989e6ad3).

_Despite the news, the network’s native token, [HBAR](https://www.coingecko.com/en/coins/hedera), lost less than the rest of the (currently tanking) market._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**In an industry known for its frequency of multimillion dollar hacks, striking a balance between a clear warning and sowing panic is tricky.**

Especially following the MyAlgo wallet-draining [fiasco](https://twitter.com/myalgo_/status/1632862464244162560) last week, the realisation that this incident was not contained to any one protocol was bound to cause chaos.

While the pausing of the chain may have saved some user funds, it’s a worrying move which damages claims of legitimacy as a DeFi platform.

One [look](https://hedera.com/) at Hedera’s “_decentralized and transparent governing body_” gives an idea of the kind of organisations involved. The likes of Boeing, Dell and Ubisoft don’t strike us as hardcore DeFi idealogues.

We may see some clarity over the next few days as to the exact mechanism of the exploit, but the damage has likely been done.

**DeFi users spook easily…**

_…and with [good reason](https://rekt.news/leaderboard/)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
