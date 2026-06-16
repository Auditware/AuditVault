---
tags:
  - blockchain/bsc
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/privacy
  - sector/stable
  - sector/vault
  - has/audit
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Euler Finance - REKT"
protocol: "[[Euler Finance]]"
date: 2023-03-13
loss_usd: 197000000
auditors:
  - "[[Sherlock]]"
source: "https://rekt.news/euler-rekt"
excerpt: "Against the backdrop of a banking meltdown and stablecoin crisis, Euler Finance was struck a $197M blow. Many other projects had funds tied up in Euler, is anywhere truly safe?"
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[upgrade-safety]]"
---
# Euler Finance - REKT

> **Loss:** $197,000,000 | **Date:** 2023-03-13 | **Audited by:** Sherlock

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/euler-header.png)

_Just as things were looking up…_

**Against the backdrop of a [banking meltdown](https://rekt.news/silvergate-rekt/) and stablecoin crisis, one of DeFi’s most well-established lending protocols, Euler Finance, was struck a ~$200M blow.**

**As USDC was creeping back towards its peg, Peckshield [raised the alarm](https://twitter.com/peckshield/status/1635203838939652097).**

Euler Labs quickly [acknowledged](https://twitter.com/eulerfinance/status/1635218198042918918) the exploit, stating they were “_working with security professionals and law enforcement_”.

As the [situation developed](https://twitter.com/officer_cia/status/1635206447901577218), the losses began to mount. A total of $197M in ETH, WBTC, USDC and DAI were taken, placing Euler at number 6 on the [leaderboard](https://rekt.news/leaderboard/). Euler’s TVL [dropped](https://defillama.com/protocol/euler) from $264M to just $10M.

Any hopes of a whitehat were quickly [put to bed](https://twitter.com/zachxbt/status/1635209310916743170); an associated address had previously been used to [exploit](https://twitter.com/SlowMist_Team/status/1635241569887617024) BSC-based EPMAX before depositing the proceeds to Tornado Cash.

_How did it go so wrong?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[FrankResearcher](https://twitter.com/FrankResearcher/status/1635241475989721089), [Omniscia](https://medium.com/@omniscia.io/euler-finance-incident-post-mortem-1ce077c28454),

**Lending on Euler is managed via eTokens (collateral) and dTokens (debt), with liquidations triggered when a user has more dTokens than eTokens.**

The exploited vulnerability involved the little-used donateToReserves function which was [incorporated](https://euler-xyz.github.io/euler-contracts-upgrade-diffs/eip14/EToken.html) into Euler via [EIP14](https://forum.euler.finance/t/eip-14-contract-upgrades/305) last year. donateToReserves allows users to send eTokens to directly to Euler reserves, however does not contain a check on the health of the user’s position.

**The hacker took advantage of this by using two contracts, one of which would incur bad debt via donateToReserves, and the other would act as liquidator.**

Using flash-loaned funds and Euler’s leverage system to create a large, underwater position on one contract, the liquidator contract could obtain the inflated eToken collateral at a discount, and withdraw into the underlying assets.

Omniscia, one of Euler’s [six auditors](https://docs.euler.finance/security/audits), published a detailed [post-mortem](https://medium.com/@omniscia.io/euler-finance-incident-post-mortem-1ce077c28454), summing up the issue as follows:

>The attack ultimately arose from an incorrect donation mechanism and did not account for the donator’s debt health, permitting them to create an unbacked DToken debt that will never be liquidated.

Attacker’s address (where funds remain): **[0xb66cd966670d962c227b3eaba30a872dbfb995db](https://etherscan.io/address/0xb66cd966670d962c227b3eaba30a872dbfb995db)**

Example tx (DAI): [0xc310a0af…](https://etherscan.io/tx/0xc310a0affe2169d1f6feec1c63dbc7f7c62a887fa48795d327d4d2da2d6b111d)

**SlowMist provided a [summary](https://twitter.com/SlowMist_Team/status/1635241569887617024) of the addresses and transactions involved: total losses comprised 86k in ETH derivatives ($134.6M), 849 WBTC ($18.6M), 34M USDC, 8.9M DAI.**

Auditors and smart contract insurance protocol Sherlock has [taken responsibility](https://twitter.com/sherlockdefi/status/1635366465888215042) for missing the vulnerability in their review of EIP-14 last year, and will pay a claim of $4.5M to Euler.

Euler [reached out](https://etherscan.io/tx/0x539c6fff0fce70e02dddd80a5534acf3df57deafbdc40f41abb20aa8f94a6d0d) to the attacker’s address via tx input data:

>We understand that you are responsible for this morning's attack on the Euler platform. We are writing to see whether you would be open to speaking with us about any potential next steps.

_But with some funds having been sent to Tornado via a pass-through [address](https://etherscan.io/address/0xc66dfa84bc1b93df194bd964a41282da65d73c9a) in what seems like a test, the prospects of returned funds aren’t looking good…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Given Euler’s high-profile and stable reputation, many other DeFi organisations had funds tied up in the protocol.**

The fact that so many other projects chose to integrate with Euler is a testament to just how shocking this exploit has been for the community. And many have reached out in support of the [Euler](https://twitter.com/eulerfinance/) team.

**In addition to Euler itself (whose token, [EUL](https://www.coingecko.com/en/coins/euler), fell over 50%), the fallout affected the following projects:**

[Angle Protocol](https://anglemoney.notion.site/Angle-Protocol-Q-A-Regarding-Euler-Exploit-03af18cbe5e84430b3341b145554492e) (over $17M of agEUR collateral, [ANGLE](https://www.coingecko.com/en/coins/angle) down over 50%)

[Balancer](https://twitter.com/Balancer/status/1635296203343798275) ($11.9M of bbeUSD)

[Temple DAO](https://twitter.com/dcfgod/status/1635264478936956929) ($5M, [TEMPLE](https://www.coingecko.com/en/coins/templedao) down 30%)

[Idle DAO](https://twitter.com/idlefinance/status/1635356439849099264) (~$5M)

[Swissborg](https://twitter.com/swissborg/status/1635250132370477056) ($2.6M in ETH and $1.7M of USDT)

[Yield Protocol](https://twitter.com/yield/status/1635339495611727873) ($1.5M)

[Yearn](https://twitter.com/iearnfinance/status/1635312188712792065) ($1.38M of indirect exposure, losses to be covered by Treasury)

[Inverse Finance](https://twitter.com/InverseFinance/status/1635280206171885572) ($800k)

And [others](https://twitter.com/0xNikitaMashkov/status/1635261107068878852)

**DeFi’s composability allows us to build interesting, automated and lucrative money legos in a way that traditional finance could never pull off.**

_When things go wrong, however, there’s no stopping the on-chain reaction._

The last few days have shown the necessity of a resilient alternative in an increasingly delicate global economy.

Spurred on by disasters such as this, we continue to build out robust architecture, laying ever-stronger foundations for DeFi's future.

_But in the meantime… is anywhere truly safe?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
