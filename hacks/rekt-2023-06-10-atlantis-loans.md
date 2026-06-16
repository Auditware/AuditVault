---
tags:
  - blockchain/bsc
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/privacy
  - sector/stable
  - sector/token
  - vuln/dependency/upgradeable-contract
  - impact/loss-of-funds/direct-drain
  - trigger/governance-vote
  - novelty/variant
title: "Atlantis Loans - REKT"
protocol: "[[Atlantis Loans]]"
date: 2023-06-10
loss_usd: 2500000
auditors:
source: "https://rekt.news/atlantis-loans-rekt"
excerpt: "The lost city sunk long ago. Now, former users have been drained, for a total of $1M. Atlantis Loans was abandoned by the developers in early April, but was subject to a governance attack on Saturday."
genome:
  - "[[upgradeable-contract]]"
  - "[[direct-drain]]"
  - "[[governance-vote]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[upgrade-safety]]"
---
# Atlantis Loans - REKT

> **Loss:** $2,500,000 | **Date:** 2023-06-10 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/atlantis-header.png)

**UPDATE: Almost a week after the initial exploit, further funds have been drained, bringing the total lost to $2.5M (as noted by [Peckshield](https://twitter.com/PeckShieldAlert/status/1669659095866175489)).**
---

_The lost city sunk long ago._

_Now, former users have been [drained](https://twitter.com/0xJ1M/status/1667466456622137346), for a total of ~$1M._

**[Atlantis Loans](https://atlantis.loans/) was a lending protocol on BSC, before being abandoned by the developers in early April.**

Users were informed via a [Medium post](https://medium.com/@atlantisfinance/dear-atlantis-community-712307f91a7) in which the dev team said they couldn’t afford to continue maintaining the platform. They added:

>we believe that discontinuing our services is in the best interest of our users and the protection of their funds.

However, the protocol remained live, with the UI even paid up in advance for two years. As stated in the post:

>the only way to make changes or turn things off will have to be done through the governance.

_Foreshadowing?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Beosin](https://twitter.com/BeosinAlert/status/1667790289946435584), [Numen Cyber](https://twitter.com/numencyber/status/1667582488338890752)_

The attack had been [attempted](https://twitter.com/BeosinAlert/status/1667790306627162117) on the 12th of April, but it failed to pass. With the project abandoned, little attention was paid to the recent proposal 52 published on the 7th June.

The attacker pushed and voted through a governance proposal granting them control of Atlantis Loans’ token contracts. They then upgraded with their own malicious contracts, allowing them to transfer tokens from any address which still had active approvals to Atlantis contracts.

For a full breakdown of how the proposal was executed, see Numen Cyber’s [thread](https://twitter.com/numencyber/status/1667582488338890752).

**[Full list](https://twitter.com/BeosinAlert/status/1667790854201962497) of contracts to revoke approvals.**

Attacker’s address: **[0xEADe071FF23bceF312deC938eCE29f7da62CF45b](https://bscscan.com/address/0xEADe071FF23bceF312deC938eCE29f7da62CF45b)**

_The attacker was initially [funded](https://etherscan.io/tx/0x55ad989cf27d3898a014fc837f10612b25d156f85780b421c9bdff9a281e1c08) by Binance on ETH._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Governance attacks can be varied in their scope and effects.**

Last month, we saw [Tornado Cash](https://rekt.news/tornado-gov-rekt/)’s governance system hijacked by an attacker who snuck code into what was supposed to be a safe proposal.

Last year, [Beanstalk](https://rekt.news/beanstalk-rekt/) got rekt for $181M from a flash loan-enabled governance attack made possible by a lack of execution delay on the proposal.

And in March, Swerve, an also-abandoned [Curve-clone](https://rekt.news/the-crooked-swerve/), was (unsucessfully) [targeted](https://www.halborn.com/blog/post/explained-the-swerve-finance-hack-march-2023) via governance. The proposal would have transferred $1.3M remaining in the DAI-USDC-USDT liquidity pool to the attacker’s address, but they were unable to gather enough tokens to force the vote through.

**This week’s case serves not just as a reminder to revoke old token approvals, but highlights the importance of carefully monitoring governance processes, even on defunct projects.**

_For Atlantis, it looks like it’s back to the murky depths…_

_…for good this time._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
