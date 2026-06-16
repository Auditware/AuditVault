---
tags:
  - blockchain/bitcoin
  - blockchain/bsc
  - sector/bridge
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/token
title: "Meter - REKT"
protocol: "[[Meter]]"
date: 2022-02-06
loss_usd: 7700000
auditors:
source: "https://rekt.news/meter-rekt"
excerpt: "Building bridges is a dangerous business. Another attack sees $4.4M taken from Meter.io on BSC, making Hundred Finance lose $3.3M in collateral damage."
genome:
  - "[[bridge-message-validation]]"
  - "[[chainlink-round-completeness]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Meter - REKT

> **Loss:** $7,700,000 | **Date:** 2022-02-06 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/02/meter-header.png)
**Building bridges is a dangerous business.**

Another attack sees $4.4M taken from [Meter.io](https://meter.io/) on BSC, making [Hundred Finance](https://hundred.finance/) lose $3.3M in collateral damage.

This is the 7th bridge attack on our [leaderboard](https://rekt.news/leaderboard/), showing a rising trend in cross-chain criminality.

**How long will it take to perfect the tech and stop these losses?** 

_The meter is running._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [@ishwinder](https://twitter.com/ishwinder/status/1490227406824685569?s=20&t=XsNHTZUI5AEDEppn3xxwUQ)_

The attack started at ~6am PST on February 5th, when [the attacker](https://etherscan.io/address/0x8d3d13cac607B7297Ff61A5E1E71072758AF4D01) maliciously minted a substantial amount of BNB and wETH tokens, draining the bridge reserve of its BNB and wETH before all bridge transactions could be [halted by Meter.](https://twitter.com/Meter_IO/status/1490103308421255168)

Meter_io Passport is a fork of [ChainSafe](https://twitter.com/ChainSafeth)'s ChainBridge, but with one change introduced to the deposit method of the ERC20 Handler.

>This change basically assumes that if the token being bridged is wrapped Native token then it doesn’t burn or lock since the wrapped Native token is already unwrapped and the amount transferred to the handler contract.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/02/meter-code1.png)

>The assumption holds true for one of the deposit methods depositEth which also asserts the value of amount in calldata(which will then ultimately get passed to the handler's deposit method):

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/02/meter-code2.png)

>But the assumption doesn't hold true for another method deposit in the same contract which is mostly unguarded.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/02/meter-code3.png)

>Hacker notices this and sends an arbitrary amount in the calldata, which gets passed on the handler's deposit.
>
The loot was then moved into Tornado Cash across multiple transactions over the space of one hour. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**This attack created collateral damage.**

**Hundred Finance lost $3.3M due to their reliance on the Meter bridge.**

Hundred announced the loss in [a tweet.](https://twitter.com/HundredFinance/status/1490394875459682309)

>Today Hundred Finance's [@MoonriverNW](https://twitter.com/MoonriverNW) deployment was affected by a bridge attack on [@Meter_IO](https://twitter.com/Meter_IO) that resulted in the local depreciation in the price of BNB.bsc.

>Accounts were able to purchase BNB.bsc at a reduced price and use these tokens as collateral at the global Chainlink price to borrow uncompromised assets on our platform. Of these, MIM and FRAX are currently impacted.

>We would like to request that owners of the accounts that did so consider returning the assets borrowed so that other users are able to access their liquidity. 1 acc. holder has already done so and we are willing to pay further bounties to the remaining 3 for doing the same. 

**We spoke to the founder of Hundred Finance, [vfat](https://twitter.com/vfat0/status/1490398279267495944?s=20&t=dNKrs_3KbNuPpRTC5jPs5A):** 

**rekt:**

Will Hundred Finance be making any changes following this incident? You mention you are working with Meter towards a possible resolution - could you provide any more details?

**vfat:**

>Hello, so yes of course this is an issue we are all too aware of, each new chain / bridge we add has its own risks, and a lending protocol is a natural target for bridge attackers. 

>We used Meter as they were the main source of wrapped BTC on Moonriver, this combined with the native bridge and Multichain puts us at 3 bridges on that chain which is the maximum we would use. Going forward we will be stricter on this, and publish more detailed information about which bridges are used for which assets. We will also look into extra monitoring for possible attacks like this.

>Meter have of course accepted responsibility for this hack and are intending to use their native token for reimbursement to the extent that they can, currently we are in the gathering addresses and amounts stage.

>One interesting thing is that there were 4 opportunistic loans at Hundred in total, but the first 2 have been repaid, so there is some modicum of hope still for the other 2. 

>Current loss to Hundred users is $3.3M.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**The voluntary repayments of the “opportunistic loans” taken on Hundred Finance are a rare sight to see, and it is commendable that Meter are accepting full responsibility for all losses.**

Meter [claim to have some evidence](https://twitter.com/Meter_IO/status/1490103313521524738) as to the identity of the hacker, and have stated they are working with authorities to bring justice. 

**However, on-chain crime rarely has off-chain consequences, and it won’t be long until we see another attack of this type.**

**There will be more bridge attacks, and more users will lose money, but eventually someone will succeed in building a safe bridge.**

_We are still too early to be risk-free, but that just means more opportunity._
