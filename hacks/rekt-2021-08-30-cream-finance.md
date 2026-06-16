---
tags:
  - sector/governance
  - sector/lending
  - sector/token
  - vuln/reentrancy/single-function
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Cream Finance - REKT"
protocol: "[[Cream Finance]]"
date: 2021-08-30
loss_usd: 18800000
auditors:
source: "https://rekt.news/cream-rekt"
excerpt: "Inspector rekt back once again. $18.8M lost to a ghostface killer, this time from an old school DeFi protocol."
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
---
# Cream Finance - REKT

> **Loss:** $18,800,000 | **Date:** 2021-08-30 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/cream-header.png)
**Inspector rekt back once again.**

_$18.8M lost to a ghostface killer, this time from an old school DeFi protocol._ 

[Cream Finance](https://twitter.com/peckshield/status/1432224092275548160?s=20) was audited by [Trail of Bits](https://docs.cream.finance/audit-report) (one of the few auditors absent from our [leaderboard](https://www.rekt.news/leaderboard/)) on Jan 28th 2021. 

**However, even the strongest audit becomes irrelevant once the protocol is changed.**

On Feb 10th 2021, the [Cream proposal](https://forum.cream.finance/t/proposal-add-amp-as-a-collateral-asset/387) to add the [AMP token](https://twitter.com/CreamdotFinance/status/1359348996032974852?s=20) came into effect, and the loophole opened up.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/cream-investigates.png)
_Credit: [@peckshield](https://twitter.com/peckshield/status/1432249600002478081)_

418,311,571 AMP tokens and 1,308.09 ETH were lost on the Cream Finance AMP token contract.

The AMP token contract implements ERC77-based ERC1820, which has the **_callPreTransferHooks** for reentrancy.

The reentrancy vulnerability within the [AMP token contract](https://etherscan.io/address/0xff20817765cb7f73d4bde2e66e067e58d11095c2#code) allowed the exploiter to nest a second borrow() function inside the token transfer() before the initial borrow() has been updated:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/cream-reentry.png)
**[Example exploit transaction](https://etherscan.io/tx/0xa9a1b8ea288eb9ad315088f17f7c7386b9989c95b4d13c81b69d5ddad7ffe61e) (one of 17)**

Attack contracts: [A](https://etherscan.io/address/0x38c40427efbaae566407e4cde2a91947df0bd22b), [B](https://etherscan.io/address/0x0ec306d7634314d35139d1df4a630d829475a125) and [exploiter wallet](https://etherscan.io/address/0xce1f4b4f17224ec6df16eeb1e3e5321c54ff6ede).

In the above example, the hacker:

**1:** Uses contract A to take a flash loan of 500 WETH to use as collateral on Cream, minting 24.17k crETH

**2:** Borrows 19.48M AMP against crETH

**3:** Exploits the reentrancy bug by inserting a further borrow() function into the token transfer, taking a further 355 ETH before the initial borrow() has been updated.

**4:** Creates contract B, which is funded with half (9.74M) of A’s borrowed AMP

**5:** Contract B then liquidates part of A’s loan, redeeming 187 WETH and transferring it back to contract A.

**6:** Contract A then uses the ETH borrowed via reentrancy to repay the remainder of the flashloan, leaving a surplus of 41 ETH and 9.74 AMP as profit for this transaction.

A similar process was used over 17 transactions, accumulating a total of almost 6k ETH.

At the time of writing, the stolen ETH (currently worth just over $18M) remains in the exploiter’s address: [0xce1f4b4f17224ec6df16eeb1e3e5321c54ff6ede](https://etherscan.io/address/0xce1f4b4f17224ec6df16eeb1e3e5321c54ff6ede)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/cream-parental-advisory-linebreak.png)
**Cream has never had a great reputation. Perhaps this is why many believed this to be their second or third time getting rekt**

Although they were involved with the [Alpha Finance incident](https://rekt.news/alpha-finance-rekt/), this is actually the first direct attack to hit Cream Finance.

Regardless of reputation, even time-tested protocols can be undermined by the [integration of a vulnerable token.](https://www.youtube.com/watch?v=6GaCt_lM_ak) 

However, as @muditgupta pointed out;

>...seems like [Cream] would have been safe had they just added reentrancy protection on their borrow/lend function.

_Can it all be so simple?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/cream-conclusion.gif)
