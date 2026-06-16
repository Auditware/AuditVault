---
tags:
  - blockchain/bitcoin
  - blockchain/ethereum
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - sector/privacy
  - sector/stable
  - sector/staking
  - has/audit
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Harvest Finance - REKT"
protocol: "[[Harvest Finance]]"
date: 2020-10-26
loss_usd: 25000000
auditors:
  - "[[Haechi]]"
  - "[[Peckshield]]"
source: "https://rekt.news/harvest-finance-rekt"
excerpt: "The reaper does not listen to the harvest. A skilled farmer used flash loans to reap $24 million from the FARM_USDT and FARM_USDC pools."
genome:
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Harvest Finance - REKT

> **Loss:** $25,000,000 | **Date:** 2020-10-26 | **Audited by:** Haechi, Peckshield

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/10/reaper-3.jpg)
**The reaper does not listen to the harvest.**

A skilled farmer used[ flash loans](https://etherscan.io/tx/0x9d093325272701d63fdafb0af2d89c7e23eaf18be1a51c580d9bce89987a2dc1/advanced#internal) to reap $33.8 million from the FARM_USDT and FARM_USDC pools.

In troubled times, some turn to sacred texts for guidance.

Of the ten plagues that ruined the harvests of ancient Egypt, the first brought blood, and the second; frogs.

It was Baron Rothschild who advised to buy when there’s blood in the streets.

Now that the heady days of DeFi summer are over, the DFI-PERP has taken on a sanguine liquidity, and the behaviour of the more Enlightened Farmers has become decidedly unchristlike.

In Exodus 7:25 8-15, we read

> _“I will plague your whole country with frogs. The frogs will go up on you and your people and all your officials.”_

In our cryptographic metaverse, the developer is the official, and as was prophesied in the ancient scrolls, the Harvest Finance developers have certainly got frogs all up on them.
![](https://lh4.googleusercontent.com/EEKvX8W_B4lZHA9MSaEJA9qThrhZa6rh-AoQOczdOT6lSxVwJ4F9O1tY4uUSdJ0-xuv7VGP9Mo89i63_LF-W-Rqgq28qoytLxTBpggpZeA4pz9ndUb1_jiN7itRThjNxu3MV33PU)

**Arbitrage Analysis**

fUSDT [fell 13.7%](https://twitter.com/jiecut42/status/1320574109005348864?s=20) and $FARM [fell 67%](https://www.coingecko.com/en/coins/harvest-finance) over two hours as the hacker took out a $50m USDT flash loan, then used the Curve Finance Y pool to swap funds and stretch stable coin prices out of proportion.

Detailed transaction analysis [here.](https://ethtx.info/mainnet/0x9d093325272701d63fdafb0af2d89c7e23eaf18be1a51c580d9bce89987a2dc1)

The following actions took place in a 7 minute time period. Credit [@valentinmihov](https://twitter.com/valentinmihov/status/1320667338321154048?s=20)

1. Swap 11.4m USDC to USDT -> USDT price up

2. Deposit 60.6m USDT into Vault

3. Exchange 11.4m USDT to USDC -> USDT price down

4. Withdraw 61.1m USDT from Vault -> 0.5m profit

5. [Rinse and repeat 32 times.](https://etherscan.io/address/0xf224ab004461540778a914ea397c589b677e27bb) (without any prior testing)

6. [Convert to renBTC ](https://app.zerion.io/0x3811765a53c3188c24d412daec3f60faad5f119b/history)and exit to BTC / [ETH ](https://etherscan.io/tx/0x5abe6f9b498471042f6c9f68c63fc3d84398b95a3a9e58c621cee09b3c972879)via Tornado Cash

The attacker was able to withdraw more USDT at step 4 because of the changed USDT price. As the price of USDT was lower during the time of the withdrawal, their shares represent more USDT from the Vault pool.

Approximately 4 cycles can fit into a 10m gas limit, and although the profit on each cycle is less than 1%, ~$500k per repetition adds up quickly.

The price calculation mechanism for LP deposits and withdrawals was the source of the exploit, meaning this attack could have carried over to the renBTC pool, the FARM_TUSD pool, and the FARM_DAI pool. However the hacker chose to stop after draining $25m or 17% of what was available in the FARM_USDT and FARM_USDC pools, although they could have easily continued to drain the entire pool for a total of $400m if they had so desired.

The FARM_USDT strategy has the following code
![](https://lh3.googleusercontent.com/3WZVjYk0XPg_KMkyG8owAtDZUdOPU_PlUaMwHSkl4IYQjAJTeS_yj96Gu0sHTlfukzmqtxdcMUfpVhfmZrAaw05ImW5ceVByqOuEyad2GevtkP0wb_lj_EuqRrI5PB6Su1nCh_vT)
Which indicates some price index was calculated.

However, since they specify "tokenIndex", we can assume they aren't just using get_virtual_price() but instead, do some underlying calculation.
Credit [Andre Cronje](https://twitter.com/AndreCronjeTech)
![](https://lh4.googleusercontent.com/RI7-hbXD-8H7Oi3O_mnwPND-Ik4LyPffaqYUX4C9AoT182ohHliSF-9YrArkfQem8CZhY95vlmkTQtIe9ttvxuwBPDSkdI55zYstQzIRThZEXpyFJiScbmtP4pwcHkF2qNvSrph6)
The arbitrage check function tolerance value was not high enough, but the default slippage tolerance value of 3% was too high.

[Credit PancakeBunnyFin](https://twitter.com/PancakeBunnyFin/status/1320615021588537347)

It wasn’t just the hacker who profited from their actions. LPs and Harvest developers also received a reasonably sized sum of money, as the hacker chose to throw back some scraps ($2,478,549.94) to the Harvest Deployer in the form of USDT and USDC.

Harvest have since stated that this will be returned to the affected users pro-rata using a snapshot.

> No hacker.Just a simple\* $24M (0x53f) juicy arb on [@harvest_finance](https://twitter.com/harvest_finance?ref_src=twsrc%5Etfw)
>
> $50M USDC flash loan [@UniswapProtocol](https://twitter.com/UniswapProtocol?ref_src=twsrc%5Etfw)
> Swap $11M (USDC/USDT) [@CurveFinance](https://twitter.com/CurveFinance?ref_src=twsrc%5Etfw)
> ~61M on fUSDT Vault
> Swap $11M USDT/USDC yUSDT
> Withdraw $61M with $0.5M profit
> Repeat & clean into [@TornadoCash](https://twitter.com/TornadoCash?ref_src=twsrc%5Etfw) [t.co/nFTuyU3s6w](https://t.co/nFTuyU3s6w) [pic.twitter.com/2oXQ2PsY32](https://t.co/2oXQ2PsY32) > &mdash; Julien Bouteloup (@bneiluj) [October 26, 2020](https://twitter.com/bneiluj/status/1320686478486347778?ref_src=twsrc%5Etfw)

**Lucky Liquidity Providers Profit**

The approximate figures are as follows. [Credit Jiecut42](https://twitter.com/jiecut42)

Hacker - $24,000,000

Uniswap LPs - $6,000,000

Harvest Developers - $2,500,000

Curve LPs - $1,000,000

Ethereum Gas - $100,000

RenVM fees $20,000

![](https://lh6.googleusercontent.com/O91Z60MeY81zTI2Lu6g3OAAxdJec9tJjcWcY6rbgRPZYW-i8tShq44_XVuhbx2oUao-CsKSqzhPYyHHZRSbvuMrIUwGeOd2npe4Z7KXOox7S_NKK95IEx6ooqh_5MlN8qgtizZu0)
Credit [BitcoinWhiskers](https://twitter.com/BitcoinWhiskers) for the sweet pie.

With exposure to all [Curve](https://www.curve.fi/) pools, veCRV holders have profited from the extra volume going through Curve, as the hacker generated ~$500k in trading fees which will be shared among all those who are staking their CRV.
Curve trading fees increased over 8,000% from the previous day as the hacker [swapped ](https://etherscan.io/tx/0xb460b70f11a93364fecf1f3c3ec49f053aecd2d6d9912c012170aa7a0de2d526)over $100M in USDT and USDC.
![](https://lh4.googleusercontent.com/P9kpiXDdXJYtJTO1byo7ylD8Ht4_vJNDbSZZtUcG2MzXflb5VxaW634Su-jKF3W9yNKAeJ49BKnQjiaPBYy3w018NmCpTXJ2bcK9kjniEy6E2hENqHwYk2yJebULie9UzMaFm55m)![](https://lh4.googleusercontent.com/Az3qJ6dKLbNiXRkUOshi9tgw5Qg0WcRbxF2KhGoxT4GJQ4dOdLT_CpGK6fFkwHHsrnfN0mhcTIZaBdRq-QYWqH7_bCWft16ow-zNO7R0i6YGTBdQGjysjheUKSbZjCJ8V0cyOSws)
Uniswap LPs also had a field day thanks to the actions of this anonymous superfarmer.

Total Uniswap trade volume spiked from $148 million to $1 billion in 24 hours.

92% of this volume came from the USDT/ETH and USDC/ETH pairs, generating $5.76 million in fees for liquidity providers.

![](https://lh3.googleusercontent.com/fZW3t_eeYeEjsBaluQwSbmHCc2ZP7H5PNBeFUvw0uSxxJqwNs4mL6UvIKWTWGHZ_7rLGpMuveEAzJ_GVLNJbEZOfRi9S8zYV7BWyknpQCgctrsomzLm4Dzbi6qNwuzbzG8gOFGeI)![](https://lh3.googleusercontent.com/T9IWn6M9JIV_82qkS-t6SC9iSOK6r1TNWO6aBCRerRNaxKXZso62bpGa5vypvVvQaUEfgIcLRkZ5QLoBU3ibErYg4cUDmb7p6CpGjR1NFVQHdtEzXy483uACgcJ-_RQMFfelFO-s)
Credit [Larry Cermak](https://twitter.com/lawmaster/status/1320614508772163584?s=20)

**Confidential Contributor**

Whistleblowing and protecting our contributors is a huge part of what we do at Rekt. While your author was writing this story, someone contacted us with information regarding the actions of Harvest Finance some days prior to last nights events.

The following information is presented without comment.

> _I was contacted by the Harvest Finance team seeking collaboration on incentivising liquidity pools for two asset classes._

> _The first was trustless BTC, the second was FARM/ETH._

![](https://lh5.googleusercontent.com/BI91M7nD8yCLZuJtX0Tpas4RCBD8xnGWl2LrRu4PTbO_CrQUDP2GDuhR45vrUpnOSc-hxuvuKTZ76DT8U58QVgvFxa7CNkQL2KXINn1Hsxw7csVd2b3VYOp8Mhw9_tM-fD58ZFOp)

> _I didn’t follow up with them as something was off-putting._

> _I’m not claiming that it is the Harvest team, but seeing the 3% slippage in the smart contract, and the fact that the exploit was in trustless BTC, which is a “novelty”..._

> _I think that if this isn’t Julien, then it has to be Harvest Finance themselves, or the EMN hacker, or someone with deep flashloan knowledge._

**Refund Requests**

As usual, a debate has arisen regarding the ability for protocols to block or amend this type of activity in the future. In the Curve Telegram group, some were of the opinion that Curve should be able to block this type of activity, however the existing smart contracts [cannot be stopped](https://twitter.com/CurveFinance/status/1320694100090376193?s=20) or modified.

There have also been calls for renBTC to refund the fees they earned from the hackers activity. This is a controversial topic which forces users to consider the pros and cons of using decentralised protocols.

**Sloppy Security**

Only three weeks ago on October 6th, Harvest Finance published a [security update](https://medium.com/harvest-finance/week-6-update-security-rules-everything-around-me-62a681a3692a) stating that they were ensuring the safety of their lands via “rigorous security audits” from [Peckshield](https://twitter.com/peckshield), [Haechi Labs](https://haechi.io/), and [CertiK](https://twitter.com/certik_io).

It should be noted that Peck Shield and CertiK also audited Bzx before their three hacks earlier this year.

We await their comments on this situation.

Developers and seemingly even specialised security firms are not used to having to consider the impact of flash loans on their code.

Mastering flash loans is like turning up to a 12th century jousting tournament on a Harley Davidson dual-wielding AK47’s; nobody expects it, plebs get rekt, and it’s years until the uneducated masses are able to protect themselves from such savage master tradesmen.

Harvest Finance has responded to the events with an enjoyably passive-aggressive tone.
![](https://lh6.googleusercontent.com/R_kCRELgxVg20qoViEkHb43yiEoWnuslyOQJaPlG0djFHM8FAJEumBYLQP-URiPun5EdcOpKhBOLGHmsi0h36Z6-LdRxFKwD9ABzrFezDcLcNLXtEPBc896I1HcwxfLHCuz5R9IF)

[twitter.com/harvest_finance/status/1320624369543057409](https://twitter.com/harvest_finance/status/1320624369543057409)

![](https://lh4.googleusercontent.com/kgpAOlAQRPTcNrx-HJzhDhO04Y9CttjxSfNJ3udyDNvVG5D75NbarZjK3aQ_76axChzA05kmDzDOlSyC9mFX98Odw1U5fSucvIw6zo7JOdjBjANdqm7WN-pac8GzxozyBjZQ6qWK)
**Truthful Terminology**

Arbitrage / Exploit / Hack.

The differences in the terminology become increasingly blurred, while the fact that “code is law” becomes crystal clear.

The term used by Harvest Finance was arbitrage economic attack. Some consider this activity a crime, while others simply see the actions of a more capable user, yield farming with modern machinery.

Is this a meritocracy, or anarcho-capitalism?

It’s certainly entertaining either way.

_caveat emptor._

> It is only the farmer who faithfully plants seeds in the spring, who reaps a Harvest in the autumn.  [B.C. Forbes](https://en.wikipedia.org/wiki/B._C._Forbes)
