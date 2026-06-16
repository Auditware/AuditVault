---
tags:
  - sector/dex
  - sector/governance
  - sector/privacy
title: "Curve Finance - REKT"
protocol: "[[Curve Finance]]"
date: 2022-08-09
loss_usd: 575000
auditors:
source: "https://rekt.news/curve-finance-rekt"
excerpt: "Curve fell victim to a DNS hijacking yesterday, with approximately $575k lost to malicious contract approvals. For users, DeFi protocols are only as secure as their centrally-hosted front end. How muc"
genome:
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
---
# Curve Finance - REKT

> **Loss:** $575,000 | **Date:** 2022-08-09 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/08/curve-header.png)

**Curve Finance’s principal front end, [curve.fi](https://curve.fi/), fell victim to a DNS hijacking [yesterday](https://twitter.com/samczsun/status/1557100692518473728), in which users were prompted to approve a malicious contract.**

Approximately $575k was stolen from users who approved, with proceeds being sent to CEXs and Tornado Cash. It seems [OFAC’s sanctions](https://rekt.news/eye-of-the-storm/) don’t scare those who are already breaking the law…

The exploit was not active on [curve.exchange](https://curve.exchange/), the project's alternate UI, which the team [directed](https://twitter.com/CurveFinance/status/1557116419497672711) users to while the incident was dealt with. The hacker’s mirrored site was taken down quickly, however some nameservers are [still to be updated](https://twitter.com/CurveFinance/status/1557367150192562178).

**This episode, and others like it, serve as stark reminders that web3 still runs on web2.**

When even the backbone of DeFi is reliant on legacy infrastructure…

_…how decentralised can we claim to be?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

As with other DNS hijacking events, identification of the exact cause falls to the service provider, and we must rely on their account of events, without being able to corroborate on-chain.

**So far, [iwantmyname](https://iwantmyname.com/) is yet to comment on exactly what led to the hijacking, but [Curve believes](https://twitter.com/CurveFinance/status/1557115032646959105) that the underlying nameserver was compromised, rather than a vulnerability at the account level.**

Curve Founder and CEO [Michael Egorov](https://twitter.com/newmichwill) confirmed his team's suspicions with rekt.news:

>Well for now I can say that dns registrar iwantmyname had their ns compromised
>
>No account hack
>
>Switched the ns
>
>Besides a good bunch of hacked money frozen by centralized services
>
>What could be done better.. we should try to go away from web2 things like dns tbh, that would be the best

Further details provided [here](https://twitter.com/CryptoShine/status/1557108025944674306).

**All Curve users who interacted with the platform should [revoke approvals](https://revoke.cash/) to the malicious contract immediately:**

**[0x9eb5f8e83359bb5013f3d8eee60bdce5654e8881](https://etherscan.io/address/0x9eb5f8e83359bb5013f3d8eee60bdce5654e8881).**

**Attacker’s address:** [0x50f9202e0f1c1577822bd67193960b213cd2f331](https://etherscan.io/address/0x50f9202e0f1c1577822bd67193960b213cd2f331)

The [stolen funds](https://twitter.com/PeckShieldAlert/status/1557202180569833472) (340 ETH, or ~$575k, in total) have been deposited to CEXs FixedFloat (292 ETH of which 112 ETH [have been frozen](https://twitter.com/FixedFloat/status/1557116267378708481)) and Binance (20 ETH) as well as Tornado Cash (27.7 ETH)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Currently, for the vast majority of users, DeFi is only as secure as the centrally-hosted front ends that they interact with.**

As the [battle-tested](https://rekt.news/leaderboard/) contracts which secure established protocols’ back end become gradually more robust, exploiters are increasingly targeting the front end. This vector leverages users’ trust in the project’s contracts whilst overlooking the security behind the UI.

Without real decentralisation at every step, we will continue to see approval-harvesting attacks, such as those that have affected users of [BadgerDAO](https://rekt.news/badger-rekt/), [Mad Meerkat Finance](https://rekt.news/madmeerkat-finance-rekt/) and, most recently, the [Namecheap breach](https://twitter.com/LefterisJP/status/1540306236087877635) which affected front ends of four DeFi protocols.

For all the effort put into smart contract security, audits and decentralisation of governance powers, a project’s reputation can get still rekt through the fault of a web2 corporation.

Aside from [monitoring for any site changes](https://twitter.com/AlexSmirnov__/status/1540322738975416321), DeFi protocols (and more importantly, users) are stuck trusting another company’s security infrastructure and [staff members](https://twitter.com/NamecheapCEO/status/1540378726055174144).

**The next logical step is protocols hosting their Dapps via IPFS and ENS, cutting reliance on web2 DNS providers.**

**The vast majority of users are not interested in dealing directly with smart contracts; front end security should not be treated as an afterthought.**

_How much longer will web3 rely on web2?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
