---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/infra
  - sector/multisig
  - sector/token
  - has/audit
  - impact/loss-of-funds/direct-drain
title: "Merlin DEX - REKT"
protocol: "[[Merlin Dex]]"
date: 2023-04-25
loss_usd: 1820000
auditors:
  - "[[Certik]]"
source: "https://rekt.news/merlin-dex-rekt"
excerpt: "$1.8M disappeared in a puff of smoke as Merlin pulled the classic DeFi magic trick. The zksync-native DEX had just completed its audit with Certik. How can such an easily ruggable protocol be green-li"
genome:
  - "[[direct-drain]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
---
# Merlin DEX - REKT

> **Loss:** $1,820,000 | **Date:** 2023-04-25 | **Audited by:** Certik

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/merlin-dex-header.png)

**$1.8M disappeared in a puff of smoke as [Merlin](https://twitter.com/TheMerlinDEX) pulled the classic DeFi magic trick.**

Merlin, a DEX native to the recently-launched zksync L2, was in the middle of a 3-day “_[Liquidity Generation Event](https://twitter.com/TheMerlinDEX/status/1650877398450163714)_” as part of its token (MAGE) launch.

The alarm was initially [raised](https://twitter.com/wasgiventhatday/status/1651039576860000257) by a community member before Peckshield [spread](https://twitter.com/PeckShieldAlert/status/1651076481240690689) the message. Merlin then [acknowledged](https://twitter.com/TheMerlinDEX/status/1651090982274752513) the incident, advising users to revoke permissions as a precaution.

Not to be confused with three-time [leaderboard](https://rekt.news/leaderboard/) entrant Merlin Labs (who got [rekt](https://rekt.news/merlinlabs-rekt/)  [on](https://rekt.news/merlin2-rekt/)  [repeat](https://rekt.news/merlin3-rekt/) during Spring 2021’s BSC bloodbath), Merlin had [passed](https://twitter.com/TheMerlinDEX/status/1650526832716836866) its second [audit by Certik](https://skynet.certik.com/projects/merlin-dex) just two days before the attack.

**Merlin’s story may be that of a simple rug; a tale we’ve heard many times before.**

_But, this time, Merlin has inadvertently conjured a debate into the value of certain styles of audit…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[BeosinAlert](https://twitter.com/BeosinAlert/status/1651124285409460224)_

The rug mechanism was a straightforward case of draining the liquidity pools into which users were depositing as part of the MAGE token sale.

This was made possible via max approvals granted to the Feeto address upon deployment of the pools. The individual/s in control of the Feeto address could then drain the pool of all assets, which were then bridged to ETH.

Merlin’s own [post-mortem](https://twitter.com/TheMerlinDEX/status/1651281814395187200) places the blame squarely on the back-end development team. The thread includes links to developers’ github profiles and states that Serbian authorities have been contacted.

Attacker address (into which funds were drained): [0x2744d62a1e9ab975f4d77fe52e16206464ea79b7](https://explorer.zksync.io/address/0x2744d62a1e9ab975f4d77fe52e16206464ea79b7)

**See Beosin’s [full analysis](https://twitter.com/BeosinAlert/status/1651124285409460224) for further details and addresses.**

The rugged funds were bridged back to Ethereum, swapped for ETH and transferred to other addresses.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**This is the first incident on zksync, a zero-knowledge Ethereum rollup whose mainnet launched in March.**

_It didn’t take long for the new environment to become a target…_

zksync already had a [close call](https://twitter.com/zksync/status/1647265949110640648) when their Twitter handle was targeted (presumably to conduct a phishing campaign) earlier this month.

**As new ecosystems flourish, leveraging exciting tech to push our industry forward, bad actors will never be far behind.**

_And low-effort cash grabs make the perfect honeypot for those who would pull the rug on users or would-be hackers looking for vulnerable, hastily deployed code…_
---

**Generally, an audit by a _reputable_ blockchain security firm is a good sign for those unsure whether or not to ape in.**

_But when some logos look less like a mark of quality and more like a red flag, what counts as ‘reputable’?_

**The very same day that their recently-approved project was drained, Certik’s founder [boasted](https://twitter.com/WuBlockchain/status/1651085522083909633) of their volume of bargain audits in the industry.**

With Certik’s stamp of approval on so many rekt projects, many are casting doubts on the firm's value to the space.

It should be [noted](https://twitter.com/CertiK/status/1651088669187473408) that, in their initial [audit](https://skynet.certik.com/projects/merlin-dex), Certik did indeed bring up the issue of trust, recommending that the protocol take measures to sufficiently decentralise:

>We advise the client to carefully manage the privileged account's private key to avoid any potential risks of being hacked. In general, we strongly recommend centralized privileges or roles in the protocol be improved via a decentralized mechanism or smart-contract-based accounts with enhanced security practices, e.g., multisignature wallets.

However, this issue was marked as ‘Resolved’ by Certik, who stated that the Merlin team had promised to use a multisig. Enough users apparently didn’t read the audit fully, or simply didn’t care about the implications of trusting the project.

_Facing further [claims](https://twitter.com/redragonvn/status/1651140955846897664) that the code includes an intentional backdoor, Certik is clearly feeling the heat. The firm is [considering](https://twitter.com/CertiK/status/1651252731691036672) a “_community compensation plan_” to cover the losses._

**Quick and dirty audits should not be deemed sufficient reassurance, especially for multimillion dollar protocols. Some personal responsibility is also necessary to stay safe…**

_Ruggers gonna rug._

**And when many protocols have centralisation issues which could potentially lead to a rug, yet are [overlooked](https://twitter.com/cmichelio/status/1651216895234953217) by FOMO-ing [apes](https://rekt.news/ape-tax/) and [airdrop hunters](https://rekt.news/airdrop-hunters/)…**

_Where does the blame really lie?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
