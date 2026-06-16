---
tags:
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/privacy
  - sector/stable
  - sector/vault
  - has/audit
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Alpha Finance - REKT"
protocol: "[[Alpha Finance]]"
date: 2021-02-13
loss_usd: 37500000
auditors:
  - "[[Quantstamp]]"
  - "[[Peckshield]]"
source: "https://rekt.news/alpha-finance-rekt"
excerpt: "The dark arts of DeFi remain the most profitable. ~$37.5M gone in a tale of fake magic, confusion and accusation. The victim has singled out their attacker."
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
---
# Alpha Finance - REKT

> **Loss:** $37,500,000 | **Date:** 2021-02-13 | **Audited by:** Quantstamp, Peckshield

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/02/header-alpha-homora.png)
**The dark arts of DeFi remain the most profitable.**

What follows is one of our most dramatic stories yet. 

**A tale of fake magic, confusion and accusation leading to the biggest DeFi hack to date.**

~$37.5 million was stolen in a complex piece of DeFi deception, as a multi transaction attack was used to raid the vaults of Alpha Finance, whilst leaving many believing that it was the Iron Bank that had been affected.

This murder took place in a [hall of mirrors](https://youtu.be/F-BqDWG72iM). The increasingly intertwined nature of DeFi protocols, combined with the complexity of the attack, left the community confused as to who the real victim was, and who was responsible for making reparations.

The attackers' contract made the Homora code “believe” that their malicious contract was one of their own in order to manipulate internal debt numbers in their system.

**This was a private battle between protocol and attacker.** The exploited contract was not yet announced, nor was it available to users, meaning they were not directly affected. We have not yet seen such a blatant inside job, and Alpha Finance were quick to point out that they had a [“prime suspect”](https://twitter.com/AlphaFinanceLab/status/1360623172433760256?s=20).

Why was the contract left on mainnet if it was not yet ready? We asked Alpha Finance, who told us;

>"We launched several pools e.g. sUSD on the contract level and not the UI because we were preparing to launch new pools including sUSD that coming week"

**Large players quickly moved to preserve their capital amidst the confusion.** SBF withdrew [$400 million](https://twitter.com/_wilbur4ce_/status/1360636958595305474?s=20) of FTT from Cream Finance, and [Three Arrows Capital](https://etherscan.io/address/0x5cfd0cddf989959a6a6c3ad985ce324460d46dfd) sent over [$3 million](https://twitter.com/Raez_x/status/1360542616849375233?s=20) of $ALPHA to Binance, where the only purpose could be to sell.

All tokens related to the attack decreased in value. 

The Alpha Homora governance token [ALPHA](https://www.coingecko.com/en/coins/alpha-finance) fell from $2.25 to $1.78.

The Iron Bank governance token [CREAM](https://www.coingecko.com/en/coins/cream) fell from $288.32 to $193.51. 
[AAVE](https://www.coingecko.com/en/coins/aave), the governance from the home of the controversial flash loan which has enabled so many attacks of this nature, fell from $518 to a low of $492 later in the day. 

**However, token pricing is not the most interesting aspect of this story...**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/02/linebreak-shanghai2.png)

The Alpha Finance team built an excellent [post-mortem](https://blog.alphafinance.io/alpha-homora-v2-post-mortem/), and what they found was startling. The implications of our joint investigation suggest a depth of corruption much worse than expected. 

Whether Alpha Finance goes public with their accusations remains to be seen, but their initial statement of having a prime suspect suggests that repercussions are coming. 

**From the official post-mortem, we can see that the attacker needed to know the following in order to carry out the attack:**

- **HomoraBankv2 has an sUSD pool on a contract level in preparation for the upcoming release, which is neither available on the UI nor publicly announced.**
- **There was no liquidity in sUSD lending pool**, so the attacker can fully manipulate and inflate the total debt amount and total debt share.
- **There is a rounding miscalculation in the borrow function calculation**, which only affects when the attacker is the sole borrower.
- **resolveReserve function can increase totalDebt without increasing totalDebtShare** and the function, intended for collecting revenue to the reserve pool, can indeed be called by anyone.
- HomoraBankv2 accepts any custom spell, as long as the invariant checks out that collateral > borrow (a spell is similar to a strategy in Yearn).

With so many users watching on, the robbers left a clear trail of clues, and in a rare move of counter-aggression, the victims have singled out their attacker.

The above requirements prove that insider information was required in order to carry out this attack. However, due to the range of protocols and audit firms involved, the insider could have come from several different angles. 

_rekt is no longer in the business of making accusations, but we look forward to seeing how Alpha Finance handle the situation._

**How it happened [according to Alpha Finance:](https://blog.alphafinance.io/alpha-homora-v2-post-mortem/)**

**1.** The attacker created an evil spell (equivalent to Yearn’s strategy). https://etherscan.io/tx/0x2b419173c1f116e94e43afed15a46e3b3a109e118aba166fcca0ba583f686d23

**2.** Attacker swaps ETH -> UNI, and supplies ETH + UNI to the Uniswap pool (obtaining ETH/UNI LP token). In the same tx, swaps ETH -> sUSD on Uniswap and deposits sUSD to Cream’s Iron Bank (getting cysUSD)
https://etherscan.io/tx/0x4441eefe434fbef9d9b3acb169e35eb7b3958763b74c5617b39034decd4dd3ad

**3.** Call execute to HomoraBankV2 using the evil spell (creating position 883), performing:
Borrow 1000e18 sUSD
Deposit UNI-WETH LP to WERC20, and use as collateral (to bypass the collateral > borrow check)
In the process, the attacker has 1000e18 sUSD debt shares (because the attacker is the first borrower)
https://etherscan.io/tx/0xcc57ac77dc3953de7832162ea4cd925970e064ead3f6861ee40076aca8e7e571

**4.** Call execute to HomoraBankV2 using the evil spell again (to position 883), performing:
Repay 1000000098548938710983 sUSD (actual debt with interest accrued is 1000000098548938710984 sUSD), resulting in a repay share of 1 less than the total share.
As a result, the attacker now has 1 minisUSD debt and 1 debt share.
https://etherscan.io/tx/0xf31ee9d9e83db3592601b854fe4f8b872cecd0ea2a3247c475eea8062a20dd41

**5.** Call resolveReserve on sUSD bank, accruing 19709787742196 debt, while totalShare remains 1.
Current state: totalDebt = 19709787742197, while totalShare = 1
https://etherscan.io/tx/0x98f623af655f1e27e1c04ffe0bc8c9bbdb35d39999913bedfe712d4058c67c0e

**6.** Call execute to HomoraBankV2 using the evil spell again, performing (repeat 16 times, each time doubling the borrowed amount):
Borrow 19709787742196 minisUSD and transfer to the attacker (doubling each time, since totalDebt doubles each time the borrow is successful). Each borrow is 1 less than the totalDebt value, causing the corresponding borrow share = 0, so the protocol treats this as no debt borrowing.
At the end of tx, the attacker deposits 19.54 sUSD to Cream’s Iron Bank.
https://etherscan.io/tx/0x2e387620bb31c067efc878346742637d650843210596e770d4e2d601de5409e3

**7.** Continue the process: call execute to HomoraBankV2 using the evil spell again, performing (repeat 10 times, each time doubling the borrowed amount). At the end of tx, the attacker deposits 1321 sUSD to Cream’s Iron Bank.
https://etherscan.io/tx/0x64de824a7aa339ff41b1487194ca634a9ce35a32c65f4e78eb3893cc183532a4

**8.** Flashloan from Aave (borrowing 1,800,000 USDC)
Swap 1,800,000 USDC to 1,770,757.56254472419047906 sUSD, and deposit to Cream to have enough liquidity for the attacker to borrow using the custom spell
Continued doubling the sUSD borrow from 1,322.70 sUSD to 677,223.15 sUSD (total of 10 times).
Swap 1,353,123.59 sUSD to 1,374,960.72 USDC on Curve
Borrow 426,659.27 USDC from Cream (since the attacker deposited sUSD already in step b.)
https://etherscan.io/tx/0x7eb2436eedd39c8865fcc1e51ae4a245e89765f4c64a13200c623f676b3912f9

**9.** Repeat step 8, but with ~10M USDC (no USDC borrowing at the end)
https://etherscan.io/tx/0xd7a91172c3fd09acb75a9447189e1178ae70517698f249b84062681f43f0e26e

**10.** Repeat with 10M USDC (no USDC borrowing at the end)
https://etherscan.io/tx/0xacec6ddb7db4baa66c0fb6289c25a833d93d2d9eb4fbe9a8d8495e5bfa24ba57

**11.**Borrow 13,244.63 WETH + 3.6M USDC + 5.6M USDT + 4.26M DAI
Supply the stablecoins to Aave (to get aTokens, so USDC & USDT can’t be frozen)
Supply aDAI, aUSDT, aUSDC to Curve a3Crv pool
https://etherscan.io/tx/0x745ddedf268f60ea4a038991d46b33b7a1d4e5a9ff2767cdba2d3af69f43eb1b

**12.** Add a3Crv LP token to Curve’s liquidity gauge
https://etherscan.io/tx/0xc60bc6ab561af2a19ebc9e57b44b21774e489bb07f75cb367d69841b372fe896

**13.** The rest of txs are supplying to Tornado Cash, GitCoin Grants. 1k ETH is sent to each of Cream’s and Alpha’s deployer addresses.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/02/linebreak-shanghai.png)

**This story is unique in it’s casting.** 

We have always expected some ambiguity and role reversal when it comes to white hat / black hat activity, but rarely do we see such clear accusations from the victim.

Andre Cronje, who [partnered Yearn](https://twitter.com/AndreCronjeTech/status/1347194324237176832?s=20) with Alpha Homora just weeks earlier, today [wrote of the attack](https://twitter.com/AndreCronjeTech/status/1360674224797483010?s=20):

>Take the time to study the exploit. 9 transactions. 4 different manipulations. One including an exact debt calculation. This took teams of researchers hours to figure out. Alpha took immediate steps to mitigate the exploit. It was addressed within minutes of original discovery.

[And Banteg’s reply:](https://twitter.com/bantg/status/1360678595551707139?s=20)
>The setup is absolutely insane. No way this could be found by someone casually looking at the contracts, especially the unannounced stuff.

**Perhaps this will lead to another Yearn acquisition; Cronje’s name is mentioned 4 times in the post-mortem, and the [pattern does seem familiar...](https://rekt.eth.link/decentralised-monopoly/)**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/02/alpha-finance-conclusion.png)
**How much longer can this era last for the anonymous hackers?** 

As the list of possible suspects is so small, it becomes easier to rule out and track down potential attackers, in this case the list is even smaller than usual. 

“Don’t trust, verify” is an excellent mantra when working with code, yet it does not prevent the increasing social paranoia that must be growing in the upper circles of decentralised finance.
We’re living through a period of unprecedented growth for cryptocurrency and DeFi, where the cost of not working is incredibly high. The mental load for DeFi developers grows heavier day by day.

Empires are being built upon lines of code, and the future of finance is being constructed before our eyes. 

**Developers are locked in a race to the sky while corrupt insiders help hackers to work underground, picking holes in their foundations.** 

When one tower falls, the others look on and learn. Before the dust has even settled, the crowds have moved on, and relentless teams return to the race in a quest to build back stronger.

**How long can they maintain this intensity before the inevitable mistake causes their cloak of anonymity to fall?**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/02/af-gif.gif)
