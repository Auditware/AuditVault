---
tags:
  - sector/dex
  - sector/governance
  - sector/stable
  - sector/token
  - vuln/pda/reinitialization
  - impact/privilege-escalation/ownership-transfer
  - novelty/variant
title: "DAO Maker - REKT"
protocol: "[[Dao Maker]]"
date: 2021-09-04
loss_usd: 4000000
auditors:
source: "https://rekt.news/daomaker-rekt"
excerpt: "DAO Maker meet their maker. Again. $4M lost, less than a month after losing $7M. If you get rekt on repeat then we have to say something..."
genome:
  - "[[reinitialization]]"
  - "[[ownership-transfer]]"
  - "[[variant]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[initializer-auth]]"
  - "[[oracle-freshness]]"
---
# DAO Maker - REKT

> **Loss:** $4,000,000 | **Date:** 2021-09-04 | **Audited by:** TBC

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/daomaker-header.png)
**DAO Maker meets their maker.**

_Again._

Less than a month ago [they lost $7M.](https://medium.com/daomaker/dao-maker-statement-thursday-12th-of-august-2c3bb0d1bb69)

**Now they’ve lost another $4M.**

**We didn’t cover the first exploit, but if you get rekt on repeat then we’ve got to say something.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/daomaker-investigates.png)
> _Credit: [Mudit Gupta](https://twitter.com/mudit__gupta/status/1434059922774237185?s=28)_

DAOMaker’s init() function was left vulnerable, allowing the attacker to reinitialise 4 token contracts with malicious data. Then, the emergencyExit() function was used to withdraw the funds from each.

The four contracts and the withdrawal transactions are listed below:

[0x6e70c88be1d5c2a4c0c8205764d01abe6a3d2e22](https://etherscan.io/address/0x6e70c88be1d5c2a4c0c8205764d01abe6a3d2e22) - [emergencyExit](https://etherscan.io/tx/0xcb5be97496995d58da6f97491845040547b878e53a7b71f907a13408f3a54e5f) with 13.5M CAPS

[0xd6c8dd834abeeefa7a663c1265ce840ca457b1ec](https://etherscan.io/address/0xd6c8dd834abeeefa7a663c1265ce840ca457b1ec) - [emergencyExit](https://etherscan.io/tx/0x4c273c2403aafd97e4b553f0e381cf1c63e5f2efebbe2ded7642a06f2b68c879) with 2.5M CPD, [twice](https://etherscan.io/tx/0xec2115ddb7f5020b2410978bb13cd23a9a38291d35be310d7825e7faeb6df1f4)

[0xdd571023d95ff6ce5716bf112ccb752e86212167](https://etherscan.io/address/0xdd571023d95ff6ce5716bf112ccb752e86212167) - [emergencyExit](https://etherscan.io/tx/0x1692a57f19b5e8e4bc6a372ac3c83c77cd4a1ea78414377ea66d3d59f4a7d2b7) with 1.44M DERC

[0xa43b89d5e7951d410585360f6808133e8b919289](https://etherscan.io/address/0xa43b89d5e7951d410585360f6808133e8b919289) - [emergencyExit](https://etherscan.io/tx/0xdd0176475165b83c702d49a876d4dc888b73477ad8833582c72aa6ca5e0bacc3) with approx 20.6M SHO

**After the exploit and swap routine, the attacker then made init() calls on two more contracts.**

Both contracts, however, had already been called by a [new address](https://etherscan.io/address/0xcf28556ee95be8c52ad2f3480149128cca51dac1), whose transaction history shows a series of **init()-emergencyExit()** calls, extracting millions of SHO, as well as ALPHR and LSS.

**The final four transactions in this address show the extracted tokens being returned, then an ownership transfer; maybe some belated whitehat behaviour, or the devs trying to save what was left.**

**The attacker went on to sell each token:**

**Ternoa:** [13.5M CAPS for 378,189 DAI](https://etherscan.io/tx/0xbf38346aacf261f5e169a87ed874c33c21efb060c4a393e2b1443a3ac5d6e3fd) on 1inch

**Coinspaid:** [5M CPD for 158,216 DAI](https://etherscan.io/tx/0x3436af2c84d67254a4b81adc350c91d1b98ae52b2ff84645d14d4245c2d08c27) on 1inch

**DeRace:** [1.44M DERC for 997,833 DAI](https://etherscan.io/tx/0xc586a6b94e09556abf46ae3aa8cffa8e46dfcb0c22bce0b024d5e01743ceba9e) on 1inch

**Showcase:** [20.6M SHO for 67,663 DAI via MetaMask Swap Router](https://etherscan.io/tx/0x76163daf6cf0c815c02fb1a98f5c6283ee7a922cbad41218eb7a6452c91824c8)

**Price effects (at time of writing).**

**[Ternoa CAPS](https://www.coingecko.com/en/coins/ternoa)** dropped to -45%, now -11%

**[CoinsPaid CPD](https://www.coingecko.com/en/coins/coinspaid)** dropped to -60% and now -25%.

**[DeRace DERC](https://www.coingecko.com/en/coins/derace)** dropped to -75% initially, now trading around -25%,

**[Showcase SHO](https://www.coingecko.com/en/coins/showcase-token)** trading at approx. -75%

_The prices of all tokens involved have recovered somewhat since the exploit, although not as much as [claimed by DAO Maker.](https://twitter.com/TheDaoMaker/status/1433994197380567041)_

**The DAO Maker source code is not public. Was it exposed to an outsider, or is there an insider who should not be trusted?**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/daomaker-machine.gif)

_Live footage of a DAO Maker developer getting rekt by their own protocol._

**As [Mr Gupta](https://twitter.com/Mudit__Gupta/status/1434059928252006402?s=20) tweeted on Twitter;**

>DaoMaker claimed that they had audits from 3 firms but looking at [learn.daomaker.com/audits](https://t.co/9uTnNl5Z0K?amp=1), 2 of the audits seem to be for unrelated contracts while the third one from [@certik_io](https://twitter.com/certik_io) points to a dead link.

_We await clarification from Certik._

**Even if all three audits were real and relevant, no hacked protocol should try and pass the blame to their auditors.**

Good security has to come from the team, not outsourced to an audit company.

_Every step has to be perfect._

Hiring, spec design, code reviews, testing, fuzzing, formal verification, bug bounty program, incident handling, the list goes on…

**But perhaps it’s too late for DAO Maker, who will just have to make dao and mend.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/daomaker-mend.gif)
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png)
