---
tags:
  - blockchain/bitcoin
  - sector/dex
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - sector/vault
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Cream Finance - REKT 2"
protocol: "[[Cream Finance]]"
date: 2021-10-27
loss_usd: 130000000
auditors:
source: "https://rekt.news/cream-rekt-2"
excerpt: "Cream Finance has been hacked (again) for ~$130 million. The Yearn Finance decentralised monopoly has grown too large. Why accumulate so many protocols if you don’t care for their users?"
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Cream Finance - REKT 2

> **Loss:** $130,000,000 | **Date:** 2021-10-27 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/10/cream2-header.png)  

**Another failed experiment from the Yearn Finance ecosystem.**

**Cream Finance has been hacked _([again](https://rekt.news/cream-rekt/))_ for ~$130 million.**

The Yearn Finance [decentralised monopoly](https://rekt.news/decentralised-monopoly/) has grown too large, and its operators; too careless.

_Why accumulate so many protocols if you don’t care for their users?_

We assumed that following the string of aggressive acquisitions by Yearn in 2020, we would see improved security on these platforms.

_However, that was clearly not the goal._

The [CoinGecko Yearn Ecosystem page](https://www.coingecko.com/en/categories/yearn-yfi-partnerships-mergers?__cf_chl_captcha_tk__=OPpx03zypJXPB4a8bKf354z2Zvl2TO7NF6bMRogkBh4-1635437847-0-gaNycGzNByU) shows the price impact of this hack.

>That’s position number three on our leaderboard, the second entry for the Cream Finance protocol, and **ten positions in total for the Yearn Ecosystem.**

Whilst Yearn developers continue to make [fast](https://medium.com/@geistfantom/pre-launch-announcement-geist-finance-fbfb938afd2f)  [forks](https://twitter.com/The3D_/status/1452779577739202569?s=20) of other platforms, and incentivise users to use chains that work in their favour, they [abuse the developers](https://twitter.com/bantg/status/1453678280914128900?s=20) who worked on the original code, and put other users' funds at risk.

**This is not to say that Yearn seeks to trick their users - all DeFi degenerates are aware of the risks, but we can’t ignore this track record.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/10/cream2-leaderboard.png)

**Business is business, whether on or off-chain.**

**Some of these protocols were picked up post-hack, but who had the most motive for those Yearn competitors to fail?**

There was a clear advantage for Yearn in being able to link and leverage such a range of protocols, but with great power comes great responsibility…

_Who takes the blame for losing $130M?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/10/cream2-investigates.png)

> _credit: [@Mudit__Gupta](https://twitter.com/Mudit__Gupta/status/1453401698563596293) and [@cryptofishx](https://twitter.com/cryptofishx/status/1453425047108927488?t=M6S6eaD0LPtB9fxqIsXQmQ&s=19)_

**Exploiter wallets:**

[Address A](https://etherscan.io/address/0x961d2b694d9097f35cfffa363ef98823928a330d), [Address B](https://etherscan.io/address/0x24354d31bc9d90f62fe5f2454709c32049cf866b)

**The hacker was able to take advantage of a pricing vulnerability by repeatedly lending and borrowing flash-loaned funds across two addresses.**

Next, after accumulating yUSDVault-collateralised crYUSD, the price of the underlying yUSDVault token was manipulated in order to effectively double the value of the collateral owned by the attacker.

Finally, using the now overvalued collateral, the attacker drained CREAM’s lending vaults of as many assets as possible.

A full table of the stolen funds, which include over 2760 ETH, a total of 76 BTC in renBTC, WBTC and HBTC, as well as tens of millions in stablecoins and other tokens, can be found [here](https://twitter.com/SlowMist_Team/status/1453398034151194627?t=EjgoIA992F938Hoc1oyBVw&s=19).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Using address A, the attacker took a flash loan of 500M DAI from MakerDAO, depositing into Curve’s yPool for yDAI which was then used to mint yUSD. The yUSD was then deposited into Yearn’s yUSD strategy.**

By using the yUSDVault tokens from Yearn as collateral on CREAM, the attacker then could mint ~$500M of crYUSD.

With address B, the hacker then took a flash loan from AAVE worth $2B in ETH, to use as collateral on CREAM. This allowed for borrowing a further ~$500M of yUSD, which was deposited again in order to mint crYUSD.

The two accounts then performed a loop of depositing and borrowing, with B transferring ~$500M in yUSDVault tokens to A each time, until account A was in possession of ~$1.5B in crYUSD and ~$500M yUSDVault.

The attacker then exploited a vulnerability in CREAM’s internal PriceOracleProxy of yUSDVault tokens. The price of yUSDVault depends on its pricePerShare, which is defined by the vault’s yUSD balance / totalSupply yUSDVault.

By redeeming ~$500M yUSDVault for the underlying yUSD, the attacker was able to decrease the vault’s totalSupply to just $8M. Combining this depletion with a deposit of ~$8M in yUSD into the vault led CREAM to increase the value of yUSDVault shares by approximately a factor of two.

Due to the price manipulation, **CREAM now sees address A as having $3B crYUSD in collateral.** $2B of this was withdrawn in ETH in order to repay B’s flash loan while the ~$500m of yUSD redeeming from the yUSDVault pays off A’s DAI loan.

**The $1B left over was more than enough to drain (borrow and default) CREAM’s $130M assets available for lending.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**Following the attack, funds were [pulled](https://etherscan.io/tx/0xafd29e7918112de30a8c994f19bb503ee9ce717030b0da43a68e2bd9ae25f86a) from the [exploit contract](https://etherscan.io/address/0x961d2b694d9097f35cfffa363ef98823928a330d) back to [this wallet](https://etherscan.io/address/0x24354d31bc9d90f62fe5f2454709c32049cf866b) which had been funded by Tornado Cash around 30 mins before the attack in two transactions: [one](https://etherscan.io/tx/0x753cce254051aae778af6f46e999ed9927cc4d93e5cfb95b23f90ff902d7c090), [two](https://etherscan.io/tx/0xaa47963fc4471f81550a830d679c0c14a9ba30d886a8c70ae9653bd78a55b089).**

Since the attack, the hacker has been [using the renBridge](https://etherscan.io/tx/0x9fdcfe7ba45d092ac3f819f746fa2000a344861f3cc100fdefc1c0957cdba7a1) to send funds to BTC as well as [adding](https://etherscan.io/tx/0xc79559d42a4c25c92ca8511c3dd5dfcdd41f0382e1f7577abc7224c5ae8ac343) over $40M CRETH2 in single-sided liquidity to Uniswap’s ETH-CRETH2 [pool](https://info.uniswap.org/#/tokens/0xcbc1065255cbc3ab41a6868c22d1f1c573ab89fd), presumably in an attempt to offload as much as possible as CRETH2 [may be salvageable](https://twitter.com/adamscochran/status/1453382363753459714).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/10/cream2-whatnow.png)

**The Cream.Finance: Deployer is amongst the [many accounts](https://pentacle.xyz/bad-things-cream) who have tried to communicate with the hacker.**

[Their message](https://etherscan.io/tx/0x606bdd12584ccda8a3ecdb9e4bd43046d066d2b223d857121eec51820f34cc89);

>_you win. we're rekt. please return funds and we will honor a 10% bounty._

When experienced attackers make moves like this, the motives are not just financial.

This is manipulation of the industry as well as the markets, and we must consider who stands to benefit.

Other protocols were named in a mysterious message in the [main exploit transaction’s input data;](https://etherscan.io/tx/0x0fe2542079644e107cbf13690eb9c2c65963ccb79089ff96bfaf8dced2331c92)

> _gÃTµ Baave lucky, iron bank lucky, cream not. ydev : incest bad, dont do_

In [Mudit Gupta’](https://twitter.com/Mudit__Gupta/status/1453417777599901702)s _[Observations and Theories](https://mudit.blog/cream-hack-analysis/)_ about the attack, he points out several reasons why he believes the hacker, (or hackers) to be experienced DeFi developers, and how it is not the average black hat attack.

**This hack revealed not only vulnerabilities in project code, but deeper rivalries that may not have been apparent for the average DeFi user.**

_A once hidden war is now being fought in public._

A $130M hack gets headlines, but for many, this attack will be remembered not for the loss, but for how it was used as a campaign tool by opposing teams, neither of which have come out on top.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
