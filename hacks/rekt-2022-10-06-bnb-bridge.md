---
tags:
  - blockchain/avalanche
  - blockchain/bitcoin
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/fantom
  - blockchain/polygon
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/stable
  - sector/staking
  - vuln/bridge/message-spoofing
  - novelty/variant
title: "BNB Bridge - REKT"
protocol: "[[Bnb Bridge]]"
date: 2022-10-06
loss_usd: 586000000
auditors:
source: "https://rekt.news/bnb-bridge-rekt"
excerpt: "Over half a billion stolen from the BNB bridge. If a chain can be stopped and started at a moment's notice, can it really be considered decentralised? Another bridge exploit, another entry on the lead"
genome:
  - "[[message-spoofing]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[bridge-sender-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# BNB Bridge - REKT

> **Loss:** $586,000,000 | **Date:** 2022-10-06 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/binance-header.png)

**“Have you tried turning it off and on again?”**

_2M BNB stolen in a hack as complex as Binance’s naming system._

BSC Token Hub, the BNB bridge between the old Binance Beacon Chain and BSC, now BNB Chain… was exploited into minting two lots of 1M BNB directly to the hacker’s address.

With a [BNB price](https://www.coingecko.com/en/coins/bnb) of $293 at the time of the hack, the stolen 2M BNB amounts to $586M [(#3 on the leaderboard).](https://rekt.news/leaderboard/)

However, the hacker managed to escape to other chains with just $127M before losing access to the rest of the funds.

After noticing the “[irregular activity](https://twitter.com/BNBCHAIN/status/1578148078636650496)”, DeFi’s [3rd largest L1](https://defillama.com/chains) was paused for [~8 hours](https://twitter.com/BNBCHAIN/status/1578277281000136704).

**However, what of all the users unable to access their own funds?**

_What of those who may have needed funds in an emergency, or were potentially facing liquidation as their positions were out of their reach…_

**...for as long as Binance wanted.**

In a [now deleted tweet](https://twitter.com/cz_binance/status/1578123105649786887), CZ said “_It's not about cash flow; it's crypto flow._” while the attack was underway…

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[samczsun](https://twitter.com/samczsun/status/1578167198203289600), [FrankResearcher](https://twitter.com/FrankResearcher/status/1578148293032706048)_

The attacker exploited the BNB bridge into minting two batches of 1M BNB each, via falsified proofs of deposit on the legacy Binance Beacon Chain. The transactions occurred at [18:26 UTC](https://bscscan.com/tx/0xebf83628ba893d35b496121fb8201666b8e09f3cbadf0e269162baa72efe3b8b) and [20:43 UTC](https://bscscan.com/tx/0x05356fd06ce56a9ec5b4eaf9c075abd740cae4c21eab1676440ab5cd2fe5c57a).

The bridge uses [vulnerable IAVL verification](https://github.com/bnb-chain/bsc/blob/335492482d669efa28b6e1793ba16f100f8c3d54/core/vm/contracts_lightclient.go#L106) which the attacker was able to forge, specifically for block 110217401, from August 2020.

**Exploiter’s address: [0x489a8756c18c0b8b24ec2a2b9ff3d4d447f79bec](https://bscscan.com/address/0x489a8756c18c0b8b24ec2a2b9ff3d4d447f79bec)**

As [samczsun](https://twitter.com/samczsun/status/1578185275062132736) put it:

>In summary, there was a bug in the way that the Binance Bridge verified proofs which could have allowed attackers to forge arbitrary messages. Fortunately, the attacker here only forged two messages, but the damage could have been far worse

For a detailed explanation, see the [full thread](https://twitter.com/samczsun/status/1578167198203289600).

Rather than dumping the BNB directly and drawing attention to the price action, funds were deposited as collateral on BSC lending platform Venus Protocol. Amidst the confusion, the Venus team were keen to [point out](https://twitter.com/VenusProtocol/status/1578166457435033600) that their protocol hadn’t suffered an exploit, although their users faced a spike in rates as borrow liquidity was withdrawn.

The tactic of borrowing rather than dumping initially led some to believe that this may just be a gigawhale [moving funds](https://twitter.com/jeffthedunker/status/1578121391223713792) around. However, as users began to notice [high-slippage swaps](https://bscscan.com/tx/0x0cc52b19aac4c2032358fb757d0800177e5a0d27f7ca5398b58fc7fd24f48037) and Tether [blacklisting funds](https://etherscan.io/tx/0xaafa4200c567b429a9ac2353162d551188d2bf01221ebbbcfe09e170dfdd8dc8), it became clear that this was something more sinister.

**Likely anticipating that Binance would halt the chain, the exploiter raced to find liquidity to bridge and move as much of the loot as possible to other chains.**

[SlowMist](https://twitter.com/SlowMist_Team/status/1578220472373649408) traced the movement of funds. First, the attacker supplied 900k BNB to Venus, borrowing a total of $147M in stablecoins, before bridging to Ethereum and L2s, Fantom (now making up over [10% of TVL](https://defillama.com/chain/Fantom)), Avalanche and Polygon networks.

See [SlowMist’s table](https://twitter.com/SlowMist_Team/status/1578220472373649408) below for a breakdown of the [exploiter’s positions](https://debank.com/profile/0x489a8756c18c0b8b24ec2a2b9ff3d4d447f79bec), including frozen USDT (totalling ~$6.5M).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/binance-table.png)

When the BNB team halted the chain, approximately 90 mins after the second transaction, the hacker lost access to the ~$430M still on their [BSC address](https://bscscan.com/address/0x489a8756c18c0b8b24ec2a2b9ff3d4d447f79bec). The hacker’s addresses were [initially funded](https://twitter.com/SlowMist_Team/status/1578165937320099840) from ChangeNOW exchange.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Since the incident, Binance comms have gone into damage limitation mode.**

An official [update](https://www.bnbchain.org/en/blog/bnb-chain-ecosystem-update/) states that “decentralised chains are not designed to be stopped”. But with just “26 active validators”, does BNB chain qualify as decentralised in the first place?

_And was it ever, really, credibly decentralised?_

The update also sets out some next steps, including governance votes to decide on whether to freeze or burn the stolen funds, and establishing Bug Bounty and whitehat bounty programmes.

The number of “_community validators_” will also be increased in a “_move toward further decentralisation_” (or reduced responsibility).

**Covering the funds that found their way off-chain is a drop in the ocean for Binance.**

And as CZ [makes clear](https://twitter.com/cz_binance/status/1578174707035013120), his size _is_ size: “The current impact estimate is around $100m USD equvilent, about a quarter of the last BNB burn.”

However, the Binance CEO has also distanced himself from the incident, [tweeting](https://twitter.com/cz_binance/status/1578305040112316418) that he is “_not that involved in the technical side of BNB Chain. Far less than Vitalik with ETH._” possibly attempting to convince any regulators looking for a DeFi scapegoat that their attentions should be directed elsewhere…

If the chain could have been paused this time, why not for all the other BSC hacks we’ve covered? And how will this look in the eyes of regulators, now that it’s clear they’ve been in control the entire time…

**More importantly, though, a dangerous precedent has been set by pressing pause on such a heavily-used network.** If we ever reach mass-adoption of crypto for day-to-day transactions, how could these acts be justified when chain halts could, ultimately, mean the difference between life and death?

But, as [this video](https://twitter.com/CoinSpice/status/1125979761728049152) from 2019 shows, CZ doesn’t regard the immutability of blockchains as sacrosanct. Although the plan never went ahead, he contemplates the rolling back of the Bitcoin network despite the “far reaching consequences” and risk of “destroying credibility”.

**Will BNB’s involvement in “DeFi” retain any credibility after today?**

_For now, though, it’s just another bridge exploit, and one more entry on the [leaderboard](https://rekt.news/leaderboard/)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
