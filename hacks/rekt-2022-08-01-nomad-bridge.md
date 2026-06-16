---
tags:
  - blockchain/arbitrum
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/privacy
  - sector/stable
title: "Nomad Bridge - REKT"
protocol: "[[Nomad Bridge]]"
date: 2022-08-01
loss_usd: 190000000
auditors:
source: "https://rekt.news/nomad-rekt"
excerpt: "Nomad Bridge has been torn apart, with $190M drained in a savage attack. This is the 100th incident to make it onto the leaderboard, but DeFi still has plenty of easy prey, and scavengers continue to "
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# Nomad Bridge - REKT

> **Loss:** $190,000,000 | **Date:** 2022-08-01 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/nomad-header.png)

**The vultures had a busy night.**

[Nomad Bridge](https://www.nomad.xyz/) has been torn apart, with $190M of liquidity drained in a savage attack lasting two and a half hours.

_This is the 100th incident to make it onto the rekt.news [leaderboard](https://rekt.news/leaderboard/)._

**Staying true to DeFi principles, this hack was permissionless - _anyone could join in_.**

Once the fatal blow had been struck, the [news spread](https://twitter.com/spreekaway/status/1554219768462426115), and many began to fight over the scraps.

**Cross-chain bridges continue to be a weak point for DeFi and a juicy target for exploiters. And when they go, it's often a [total collapse](https://defillama.com/protocol/nomad).**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/nomad-tvlchart.png)

_$190M... devoured._

The collateral damage from the unbacked assets is also severely affecting the chains that depended on Nomad. [Moonbeam](https://twitter.com/MoonbeamNetwork/status/1554245102071123968), [EVMOS](https://twitter.com/EvmosOrg/status/1554275898156670976) and [Milkomeda](https://twitter.com/Milkomeda_com/status/1554302195763269632) have all taken a significant hit to their TVLs.

This incident is distinct in its every-man-for-himself nature, but many who exploited the bug have declared themselves whitehats… Rekt is looking forward to seeing how much is eventually returned…

**Even so, with four of our [leaderboard’s top 5](https://rekt.news/leaderboard/) entries being cross-chain attacks, it gets ever more difficult to agree with Nomad’s slogan “_The future of cross-chain communication is optimistic_”.**

_But what started the feeding frenzy?_

_And how were so many able to continue picking the bones?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [samczsun](https://twitter.com/samczsun/status/1554252024723546112), [Zellic.io](https://twitter.com/Zellic_io/status/1554296729050025984)_

Following a routine upgrade in June, the bridge’s [Replica contract](https://etherscan.io/address/0xB92336759618F55bd0F8313bd843604592E27bd8#code) was [initialised](https://etherscan.io/tx/0x53fd92771d2084a9bf39a6477015ef53b7f116c79d98a21be723d06d79024cad) with a fatal security flaw leading to the incident. The 0x00 address was set as a trusted root, meaning that all messages were read as valid by default.

After a failed first [attempt](https://twitter.com/sniko_/status/1554221434628706304) (costing $350k in gas), the original attacker’s [exploit tx](https://etherscan.io/tx/0xb1fe26cc8892f58eb468f5208baaf38bac422b5752cca0b9c8a871855d63ae28), which was copied by those that followed, was able to call the process() function directly, without having first ‘proved’ its validity.

The process() function is responsible for the execution of all cross-chain messages and has an internal requirement ([line 185](https://etherscan.io/address/0xB92336759618F55bd0F8313bd843604592E27bd8#code)) to check the validity of the merkle root of all messages to be processed.

**However, the upgrade inadvertently caused transactions with a ‘messages’ value of 0 (invalid, according to legacy logic) to be read by default as 0x00 which was defined in the upgrade as a trusted root, passing the validation requirement as ‘proven’.**

This meant any process() calls could be executed as valid. In fact, a more sophisticated exploiter could have written a contract to drain the whole bridge for themselves.

Copycat attackers simply had to copy/paste the same process() function call via Etherscan, swapping out their address in place of the previous exploiter’s.

**The incident quickly proved to be a chaotic mixture of word-of-mouth crowdhacking, frantic whitehat activity and MEV-bot carnage.**

For example, [🍉🍉🍉.eth](https://etherscan.io/address/0x9634445e293a87ab77ca3cf5b43da94aabc544b6#tokentxns) managed to extract a total of $4M from the bridge, but fortunately claims to be [acting as whitehat](https://etherscan.io/tx/0xba0b139e450b0438e9c986ed00d209f9c289416000712a62a33e9feda045ca10):

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/nomad-txmsg.png)

However, other names stood out for the wrong reasons. There was a notable repeat offender in the Rari Capital (Arbitrum) exploiter from [April’s article](https://rekt.news/fei-rari-rekt/), who got away with [almost $3M](https://etherscan.io/address/0x65760288f19cff476b80a36a61f9dedab16bab49#tokentxns) in stablecoins, which went straight into Tornado Cash.

Of the [multiple exploiters](https://dune.com/beetle/nomad-bridge-assets), the top three addresses (with 95M between them) are the following:

[0x56D8B635A7C88Fd1104D23d632AF40c1C3Aac4e3](https://etherscan.io/address/0x56D8B635A7C88Fd1104D23d632AF40c1C3Aac4e3) ($47M)

[0xBF293D5138a2a1BA407B43672643434C43827179](https://etherscan.io/address/0xBF293D5138a2a1BA407B43672643434C43827179) ($40M)

[0xB5C55f76f90Cc528B2609109Ca14d8d84593590E](https://etherscan.io/address/0xB5C55f76f90Cc528B2609109Ca14d8d84593590E) ($8M)

**A full list of exploiter addresses is available [here](https://twitter.com/PeckShieldAlert/status/1554350737957998592).**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

The project completed a [Quantstamp audit](https://certificate.quantstamp.com/full/nomad) in June, with issue QSP-19 foreshadowing a similar vulnerability:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/nomad-audit.png)

The auditor’s remarks that “_We believe the Nomad team has misunderstood the issue_” speak to a worrying attitude towards security that the project docs’ “[Long-Term Security](https://docs.nomad.xyz/the-nomad-protocol/security/long-term-security)” plan appears to confirm:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/nomad-todo.png)

Concerns were also raised around the response time of the team facing a live and public exploit; the team’s [official acknowledgement](https://twitter.com/nomadxyz_/status/1554246853348036608) came three hours after the exploit began.

The exploit was [eventually halted](https://twitter.com/YannickCrypto/status/1554265378360000515) by simply “_removing the Replica contract as owner_”, but after such a delay it was too late to save the funds.

_Blockchains may be closed systems, but alt L1 are only as strong as their weakest link._

The Harmony chain is still [in disarray](https://talk.harmony.one/t/reimbursement-proposal-horizon-incident/20665/2) since its bridge [lost $100M](https://rekt.news/harmony-rekt/) in late June, in an attack [linked](https://hub.elliptic.co/analysis/the-100-million-horizon-hack-following-the-trail-through-tornado-cash-to-north-korea/) to the [Lazarus Group](https://rekt.news/big-phish/).

_What will the future hold for the ecosystems affected by Nomad’s collapse?_

So far, [Moonbeam’s TVL](https://defillama.com/chain/Moonbeam) has dropped from $300M to $135M, [EVMOS’s](https://defillama.com/chain/Evmos) from ~$7M to ~$3M, and [Milkomeda’s](https://defillama.com/chain/Milkomeda) from $31M to $20M.

_But crucially, the loss of confidence may prove to do far more damage than the missing $190M._

Building in an nascent, experimental industry is tough, and cross-chain infrastructure has many moving parts to secure. The damage done by bridge attacks are often the most painful, as they can contaminate a whole ecosystem, or more.

**But nomadic liquidity has no permanent home, users will always roam to new lands in search of the “next big thing”, and will continue to get stung whenever vigilance becomes stretched too thin.**

With each of the 100 entries on the rekt.news [leaderboard](https://rekt.news/leaderboard/), the industry learns a harsh lesson, slowly growing stronger.

**But for now, DeFi still has plenty of easy prey…**

_…and scavengers continue to circle overhead._

_Will it ever change?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
