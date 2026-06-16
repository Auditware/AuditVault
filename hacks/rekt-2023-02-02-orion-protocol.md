---
tags:
  - blockchain/arbitrum
  - blockchain/bsc
  - blockchain/ethereum
  - sector/dex
  - sector/lending
  - sector/privacy
  - sector/stable
  - vuln/reentrancy/single-function
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Orion Protocol - REKT"
protocol: "[[Orion Protocol]]"
date: 2023-02-02
loss_usd: 3000000
auditors:
source: "https://rekt.news/orion-protocol-rekt"
excerpt: "The hunter has become the hunted. Orion Protocol fell prey to a  $3M reentrancy exploit on ETH and BSC. The loss was contained to an internal broker account and user funds are safe. Let's hope they ta"
genome:
  - "[[single-function]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# Orion Protocol - REKT

> **Loss:** $3,000,000 | **Date:** 2023-02-02 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/orion-header.png)

_The hunter has become the hunted._

**[Orion Protocol](https://www.orionprotocol.io/) fell prey to a reentrancy exploit on Thursday, losing a total of $3M on ETH and BSC.**

The project is a ‘liquidity aggregator’ aiming to bring CEX liquidity on-chain (not to be confused with Orion Finance who [rugged $320k](https://twitter.com/paladin_marco/status/1620822928228233222) on Arbitrum the day before).

A few hours after the [news](https://twitter.com/peckshield/status/1621178662396788736)  [spread](https://twitter.com/spreekaway/status/1621181995387686918) on Twitter, Orion’s CEO [announced](https://twitter.com/alexeykoloskov/status/1621269256401731591) the loss, clarifying that the damage was contained to an internal broker account and that user funds remain safe.

Orion’s website states:

>WHY WE EXIST
>
>No one has solved liquidity, custody, accessibility, and scalability in one platform.
>
>Until now.

_Perhaps they should have added security to that list…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[SlowMist](https://twitter.com/SlowMist_Team/status/1621441874841206786), [Peckshield](https://twitter.com/peckshield/status/1621337925228306433)_

**The attacker used manipulated swaps of flash loaned stablecoins, artificially depositing the assets twice before withdrawing the inflated balance.**

By creating a fake token (ATK) and routing a swap of the flash loaned funds via ATK, a reentrancy hook called depositAsset within ATK’s transfer function, effectively doubling the attacker’s account balance.

_Slowmist [provided](https://twitter.com/SlowMist_Team/status/1621441874841206786) a detailed breakdown of the attack:_

>The attacker first called the depositAsset function of the ExchangeWithAtomic contract to make a deposit of 0.5 USDC tokens in preparation for the following attack:
>
>Next, the attacker makes a flashloan of 284,700 USDT and then calls the doSwapThroughOrionPool function of the ExchangeWithAtomic contract to swap the tokens, the exchange path is "USDC -> ATK(malicious token created by the attacker) -> USDT".
>
>The out amount of the exchange is the USDT balance in the ExchangeWithAtomic contract after the exchange minus the initial balance of 2,844,700 USDT.
>
>The problem arises when a call to the ATK token transfer function during the exchange causes the attacker to re-enter the ExchangeWithAtomic contract depositAsset function, resulting in the transfer of 284.4 million USDT from the flashloan to the ExchangeWithAtomic contract.
>
>The attacker's deposit in the ExchangeWithAtomic contract is recorded as 2,844,700 and the balance of USDT tokens in the contract becomes 5,689,000. As a result, the attacker's exchange of USDT is calculated as 5,689,000 minus 2,844,700.
>
>By calling the library function creditUserAssets to update the attacking contract's ledger in the ExchangeWithAtomic contract used the exchanged USDT, resulting in the attacking contract's final deposit of USDT in the ExchangeWithAtomic contract being recorded as 5.68 million.
>
>Finally, the attacker withdraws the USDT and returns it to the flashloan lender and swaps the remaining 2.836 million USDT into WETH for profit. The attackers used the same method to launch an attack on the BSC chain and made $191,000 in profit.
>
>The root cause of the attack was the contract exchange function is not protected from reentrancy...

Peckshield [produced](https://twitter.com/peckshield/status/1621337925228306433) the following diagram showing the basic attack steps:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/orion-code.png)

**Attacker address 1 ([ETH](https://etherscan.io/address/0x3dabf5e36df28f6064a7c5638d0c4e01539e35f1), [BSC](https://bscscan.com/address/0x3dabf5e36df28f6064a7c5638d0c4e01539e35f1)): 0x3dabf5e36df28f6064a7c5638d0c4e01539e35f1**

**Attacker address 2 ([ETH](https://etherscan.io/address/0x837962b686fd5a407fb4e5f92e8be86a230484bd), [BSC](https://bscscan.com/address/0x837962b686fd5a407fb4e5f92e8be86a230484bd)): 0x837962b686fd5a407fb4e5f92e8be86a230484bd**

Example tx (BSC): [0xfb153c57…](https://bscscan.com/tx/0xfb153c572e304093023b4f9694ef39135b6ed5b2515453173e81ec02df2e2104)

Example tx (ETH): [0xa6f63fcb…](https://etherscan.io/tx/0xa6f63fcb6bec8818864d96a5b1bb19e8bd85ee37b2cc916412e720988440b2aa)

Stolen funds have mostly been deposited to Tornado Cash, with approximately $1M of ETH remaining in the Ethereum address. The attacker’s account was funded from a Binance-labelled wallet, though the original source was [allegedly another CEX](https://twitter.com/pcaversaccio/status/1621202593274888196), SimpleSwap.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**In his thread on the incident, Orion’s CEO Alexey Koloskov [stated](https://twitter.com/alexeykoloskov/status/1621269268959477763) his confidence in his own team’s code:**

>We have reasons to believe that the issue was not a result of any shortcomings in our core protocol code, but rather might have been caused by a vulnerability in mixing third-party libraries in one of the smart contracts used by our experimental and private brokers.

But when such large amounts of money are on the line, security must be considered at all levels of a project’s stack.

And it appears that this $3M loss has [motivated](https://twitter.com/alexeykoloskov/status/1621269275020333056) Orion to take a more controlled approach:

>Moving forward, any and all contracts will be developed in-house to eliminate any potential vulnerabilities from third-party libraries. Our focus is to fortify the Orion Protocol and make sure it remains robust.

_Glad to hear Orion will be taking security more Sirius-ly._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
