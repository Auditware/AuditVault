---
tags:
  - sector/privacy
  - novelty/variant
title: "Unibot - REKT"
protocol: "[[Unibot]]"
date: 2023-10-31
loss_usd: 640000
auditors:
source: "https://rekt.news/unibot-rekt"
excerpt: "Unibot's brand new router was exploited to drain at least $640k from users who had approved the contract. Sacrificing security for convenience can lead to costly lessons on trust. Will we ever learn?"
genome:
  - "[[variant]]"
  - "[[flashloan-callback-auth]]"
---
# Unibot - REKT

> **Loss:** $640,000 | **Date:** 2023-10-31 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/unibot-header.png)

_Unibot users woke up to seasonally scary news this morning._

**The trading bot’s brand new router was exploited to drain at least $640k from users who had approved the contract.**

An hour after Peckshield [raised the alarm](https://twitter.com/peckshield/status/1719223437024284978), the team’s [response](https://twitter.com/TeamUnibot/status/1719239188514844735) gave the impression that the exploit was over:

>We experienced a token approval exploit from our new router and have paused our router to contain the issue.
>
>Any funds lost due to the bug on our new router will be compensated. Your keys and wallets are safe.

However, [copycats](https://twitter.com/0xSleuth_/status/1719239097234178336) deployed cloned exploit contracts and [continued](https://twitter.com/Brentsketit/status/1719241757571895366) to [drain](https://twitter.com/CollinsCustomIP/status/1719249605412712776) funds after the official announcement.

**Any user with existing approvals to the new router contract remained vulnerable.**

_Why didn’t the team warn users to revoke their approvals?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Beosin](https://twitter.com/BeosinAlert/status/1719230693782507993), [BlockSec](https://twitter.com/BlockSecTeam/status/1719231743515832549)_

Unibot’s [new router contract](https://etherscan.io/address/0x126c9FbaB3A2FCA24eDfd17322E71a5e36E91865), which had been deployed on Saturday and remains unverified on Etherscan, contained a vulnerability which allows an attacker to insert a transferFrom() call to drained approved tokens directly from Unibot user wallets.

**Any users who had approved the new router to spend tokens, and [not yet revoked](https://dune.com/scamsniffer/unibot-hack), is a potential victim.**

**Revoke approvals for the router contract address: [0x126c9FbaB3A2FCA24eDfd17322E71a5e36E91865](https://etherscan.io/address/0x126c9FbaB3A2FCA24eDfd17322E71a5e36E91865)**

Specifically, [BlockSec](https://twitter.com/BlockSecTeam/status/1719231743515832549) explained that:

>As the code is not open-sourced, we suspect that there is a lack of input validation of the function 0xb2bd16ab in the 0x126c contract, which allows an arbitrary call. Therefore, an attacker could invoke 'transferFrom' to transfer out tokens approved to the contract.

[Beosin](https://twitter.com/BeosinAlert/status/1719230693782507993) provided the following diagram of the vulnerable code:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/unibot-code.png)

**While the original exploiter has been inactive since [sending 355 ETH](https://twitter.com/PeckShieldAlert/status/1719251390319796477) ($640k) of profits to Tornado Cash, there have been reports of [copycat attackers](https://twitter.com/0xSleuth_/status/1719239097234178336) deploying contracts to replicate the exploit.**

Exploiter address: **[0x413e4fb75c300b92fec12d7c44e4c0b4faab4d04]**(https://etherscan.io/address/0x413e4fb75c300b92fec12d7c44e4c0b4faab4d04)

Example attack tx: [0xcbe521ae…](https://etherscan.io/tx/0xcbe521aea28911fe9983030748028e12541e347b8b6b974d026fa5065c22f0cf)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**The attack looks to be [identical](https://twitter.com/BeosinAlert/status/1717013965203804457) to one that hit Maestro, another TG trading bot, for ~$500k last week.**

However, Maestro’s [response](https://twitter.com/MaestroBots/status/1717113987479785558) was quick and clear, even refunding users with more than they had lost. Hopefully refunds for today’s victims will be easily budgeted for after the [volume](https://twitter.com/dcfgod/status/1719253619957186994) they created.

_But it seems bizarre that Unibot, a team working on a such a similar product, wouldn’t have double-checked their new router code for the same vulnerability after such recent incident._

In contrast, some [responses](https://twitter.com/reethmos/status/1719248101331116176) from the Unibot team seemed to diminish the risk, potentially leading to [further](https://twitter.com/Brentsketit/status/1719241757571895366) losses.

_[Ouch.](https://twitter.com/PeckShieldAlert/status/1719273674472353867)_

---

**TG trading bots, like the recent SocialFi ponzi boom, [sacrifice](https://twitter.com/hackenclub/status/1707769973039407177) security for convenience.**

While this incident _did not_ involve compromised keys, trusting your wallet to a closed-source project is exactly the kind of behaviour we’re continually warned about.

And as today’s incident (_as well as [LastPass](https://rekt.news/lastpass-users-rekt/), and [StarsArena](https://rekt.news/stars-arena-rekt/)_) shows, these UX tradeoffs sometimes result in costly lessons about trust.

_Will we [ever](https://twitter.com/0xfoobar/status/1719372646914380080) learn?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
