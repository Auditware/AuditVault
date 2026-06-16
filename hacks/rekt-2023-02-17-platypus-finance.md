---
tags:
  - blockchain/avalanche
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/privacy
  - sector/stable
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Platypus Finance - REKT"
protocol: "[[Platypus Finance]]"
date: 2023-02-17
loss_usd: 8500000
auditors:
source: "https://rekt.news/platypus-finance-rekt"
excerpt: "Evolution works in mysterious ways. Platypus Finance lost $8.5M to a flash loan attack on its recently-launched stablecoin. It’s a jungle out there... and, as ever, it’s survival of the fittest."
genome:
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Platypus Finance - REKT

> **Loss:** $8,500,000 | **Date:** 2023-02-17 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/platypus-header.png)

_Evolution works in mysterious ways._

**Avalanche-based [Platypus Finance](https://platypus.finance/) lost $8.5M to a flash loan attack on its new stablecoin.**

_A highly-specialised creature may be well suited to its own habitat, but Platypus’ attempts to adapt have ended up dead in the water._

Adding to its existing stableswap AMM platform, Platypus recently launched its own stablecoin, USP. However, just 10 days after launch, the new mechanism was attacked, depegging USP and leaving it heavily undercollateralised.

The Platypus team [announced](https://twitter.com/Platypusdefi/status/1626396538611310592) the attack:

>Dear Community,
>
>We regret to inform you that our protocol was hacked recently, and the attacker took advantage of a flaw in our USP solvency check mechanism. They used a flashloan to exploit a logic error in the USP solvency check mechanism in the contract holding the collateral.

According to a recent [announcement](https://medium.com/platypus-finance/platypus-recap-the-2022-2023-transition-503ca5483076) on the launch, USP “_provides an extra layer of protection from the volatility that other stablecoins may experience_”.

_A statement worthy of a Darwin award?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Daniel Von Fange](https://twitter.com/danielvf/status/1626340324103663617), [Peckshield](https://twitter.com/peckshield/status/1626367531480125440)_

**The exploit took advantage of a faulty check mechanism when withdrawing collateral.**

The attacker first took a flash loan of 44M USDC which was deposited into Platypus. The resulting LP tokens were then used as collateral to borrow 41.7M USP.

The _emergencyWithdraw()_ function only checks whether the user’s position is _currently_ solvent, but neglects to first check against any the effect of any borrowed funds. This allows the attacker to withdraw the supplied collateral while keeping the borrowed USP.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/platypus-code.png)

**The collateral was then withdrawn to repay the flash loan, and the USP was swapped via Platypus pools, draining the existing liquidity of other stables (USDC, USDT, DAI, BUSD, etc.).**

**Attacker’s address: [0xeff003d64046a6f521ba31f39405cb720e953958](https://snowtrace.io/address/0xeff003d64046a6f521ba31f39405cb720e953958)**

**Attack tx: [0x1266a937…](https://snowtrace.io/tx/0x1266a937c2ccd970e5d7929021eed3ec593a95c68a99b4920c2efa226679b430)**

**Attack contract: [0x67afdd6489d40a01dae65f709367e1b1d18a5322/](https://snowtrace.io/address/0x67afdd6489d40a01dae65f709367e1b1d18a5322/)**

**The hack has left [USP](https://www.coingecko.com/en/coins/platypus-usd) depegged by over 50% as the attacker swapped the USP for other stables. The stolen $8.5M remain in the hacker’s [contract](https://snowtrace.io/address/0x67afdd6489d40a01dae65f709367e1b1d18a5322/), of which, $1.5M of stolen USDT [has been blacklisted](https://twitter.com/zachxbt/status/1626335278972510208).**

The rather simple vulnerability, combined with the loot being left (_or possibly [trapped](https://twitter.com/BlockSecTeam/status/1626429271614038016)_) as freezable, centralised stables suggests this heist may have been pulled off by a relatively inexperienced amateur.

_Why not swap to a less controlled asset? Or bridge the funds and send them to Tornado?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**As it turns out, OPSEC is not this hacker’s strong suit.**

After just a few hours, fellow platypus [ZachXBT managed to identify the culprit](https://twitter.com/zachxbt/status/1626434265260118021) via their ENS address, linked to the exploiter’s transaction history. The same alias was used for now-deleted Twitter and Instagram accounts. The Platypus team have since [appealed](https://twitter.com/Platypusdefi/status/1626503606953451520) to the doxxed exploiter:

>We're in the process of setting up a bounty & encourage the hacker to reach out to us. We also welcome anyone with useful information to come forward to us.

_Safety in numbers…_

**Just like the Platypus itself, DeFi is a strange and unique beast.**

_A hybrid species born of cypherpunk hackers and finance bros, every protocol must speedrun their way through natural selection._

It’s a [jungle](https://rekt.news/leaderboard/) out there…

_…and, as ever, it’s survival of the fittest._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
