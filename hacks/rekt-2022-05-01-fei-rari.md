---
tags:
  - blockchain/arbitrum
  - sector/governance
  - sector/lending
  - sector/privacy
  - sector/stable
  - vuln/reentrancy/single-function
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Fei Rari - REKT 2"
protocol: "[[Fei Rari]]"
date: 2022-05-01
loss_usd: 80000000
auditors:
source: "https://rekt.news/fei-rari-rekt"
excerpt: "Fei Rari - rekt. Seven of Rari’s Fuse pools were drained for a total of ~$80M. This isn’t the first time that Rari's got rekt - lets hope the hackers don’t go for a hat trick."
genome:
  - "[[single-function]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
  - "[[timelock-timestamp-bypass]]"
  - "[[upgrade-safety]]"
---
# Fei Rari - REKT 2

> **Loss:** $80,000,000 | **Date:** 2022-05-01 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/fei-rari-header.png)
**Fei Rari - rekt.**

Between approximately 9:00 and 9:35 AM UTC on April 30th, seven of [Rari’s Fuse pools](https://twitter.com/feiprotocol/status/1520344430242254849) were drained for a total of ~$80M.

Despite [claiming](https://twitter.com/hacxyk/status/1520689345786617856) “_none of the arbitrum pools are vulnerable_”, the attack [continued](https://twitter.com/RariCapital/status/1520651835081740290) on Arbitrum today, though the losses (~100 ETH) were minimal in comparison.

This isn’t the first time that [Rari has got rekt](https://rekt.news/rari-capital-rekt/) - lets hope the hackers don’t go for a hat trick. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [Hacxyk](https://twitter.com/Hacxyk/status/1520370421773725698), [Certik](https://certik.medium.com/fei-protocol-incident-analysis-8527440696cc)_

**Rari uses forked Compound code, which doesn’t follow the check-effect-interaction pattern, and has led to a number of re-entrancy incidents: [CREAM](https://rekt.news/cream-rekt/), [Hundred](https://rekt.news/agave-hundred-rekt/), [Voltage/Ola](https://rekt.news/voltage-finance-rekt/).**

In this case though, the re-entrancy pattern is via CEther which uses _call.value_ to send ETH. In the case of the receiver being a contract, _call.value_ is able to make another call which can be abused.

This [vulnerability](https://medium.com/@JackLongarzo/rari-capital-fuse-security-upgrade-report-e5d154c16250) was reported in early March and mitigated by upgrading the CToken and Comptroller contracts. However, the new re-entrancy protections didn’t cover the function _exitMarket_ within the Comptroller contract.

_exitMarket_ re-assigns a deposited asset as no longer being collateral, which can then be withdrawn, as long as there is no loan taken against the funds. Given that the checks are made after the transfer (due to Compound code not following check-effect-interaction pattern), the transaction doesn’t record the borrowed amount as debt before the collateral is withdrawn.

By using flash loans to borrow ETH, the attacker was able to re-enter via _call.value_, calling _exitMarket_ in order to withdraw the flash loaned collateral whilst also keeping the borrowed ETH.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/feirari-certik.png)

**[Step-by-step](https://certik.medium.com/fei-protocol-incident-analysis-8527440696cc) using example tx [0xab4860…](https://etherscan.io/tx/0xab486012f21be741c9e674ffda227e30518e8a1e37a5f1d58d0b0d41f6e76530)**

**1.** Attacker flashloaned 150,000,000 USDC and 50,000 WETH

**2.** Deposited 150,000,000 USDC as collateral into the fUSDC-127 contract, which is a vulnerable fork version of the compound protocol.

**3.** With deposited collateral, the attacker borrowed 1,977 ETH via the “borrow()” function.

**4.** However, the “borrow()” function does not follow the check-effect-interaction pattern. Specifically, it transfers ETH to the attacker’s contract before updating the attacker’s actual borrow records.

**5.** Therefore, with the attacker’s borrow record not updated, the attacker made a reentrant call to “exitmarket()” in the fallback function, which allows the attacker to withdraw all his collateral (150M USDC)

**6.** The attacker repeated steps 1~5 on multiple other tokens.

**7.** Finally, the attacker repaid the flashloan and transferred the rest to their address as profit, and routed some of the funds onward to Tornado Cash.

**Affected Fuse pools: 8, 18, 27, 127, 144, 146, 156**

Attacker’s address (inc. all exploit txs): **[0x616275…](https://etherscan.io/address/0x6162759edad730152f0df8115c698a42e666157f)** 

Attack contracts: **[0xE39f3C…](https://etherscan.io/address/0xE39f3C40966DF56c69AA508D8AD459E77B8a2bc1), [0x32075b…](https://etherscan.io/address/0x32075bad9050d4767018084f0cb87b3182d36c45)**

Arbitrum attack tx: **[0x3212d0…](https://arbiscan.io/tx/0x3212d091792f81f18a31aab753de6b3128d79dcb5e8392167249595f813203ef)** 

[Total funds lost:](https://twitter.com/starit1992/status/1520419032805306368)

6,037.8139071514 eth

20,251,603.11559831 fei

14,278,990.684390573 dai

1,948,952.1788665l lusd

10,055,556.328173 usdc

132,959.9008 usdt

31,615.8714 rai

13,101,364.94 frax

2,765,891 ust

**Total estimated value: $79,749,026**

Following the attack, the hacker began depositing the proceeds into Tornado Cash, however stopped after moving just 5400 ETH (~$15M).

With the remaining $62.7M still in the wallet, is the hacker considering the [offer of a bounty](https://twitter.com/RariCapital/status/1520505023804891139) to return the funds?

Tribe DAO seems to be hopeful, as they sent the following [message via etherscan.](https://etherscan.io/tx/0xcbe38d148c0c3ebe486d49a3bdf399650be794716390135c0d2f3aa459a4a4cd) 

>We noticed you may be considering the no-questions-asked $10m offer. If you wish to take us up on this, please deposit the remaining funds to the Tribe DAO Timelock: 0xd51dbA7a94e1adEa403553A8235C302cEbF41a3c

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

All Compound forks should take this opportunity to check their code for similar vulnerabilities.

As [0x_b1](https://twitter.com/0x_b1/status/1520488894332026880) pointed out:

>this exploit had been fixed in Compound code some time ago, but was changed to its previous form in [this commit](https://github.com/Rari-Capital/compound-protocol/commit/7acb8df5a5cbf12464b4336663ef7ae6434e62da) by developers

Hopefully the user who asked Rari if the Arbitrum pools were safe was not too badly affected, as they were reassured of their safety by Rari, only to fall victim to the same exploit today. 

**A quick check could have prevented the double damage.** 

_Now Rari shares [#10 on the leaderboard.](https://rekt.news/leaderboard/)_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
