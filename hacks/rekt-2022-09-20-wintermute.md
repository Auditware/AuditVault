---
tags:
  - blockchain/ethereum
  - sector/dex
  - sector/privacy
  - sector/stable
  - impact/loss-of-funds/direct-drain
  - precondition/insider
title: "Wintermute - REKT 2"
protocol: "[[Wintermute]]"
date: 2022-09-20
loss_usd: 162300000
auditors:
source: "https://rekt.news/wintermute-rekt-2"
excerpt: "Wintermute have lost over $160M to their second incident this summer. Using a vanity address for 'gas savings' has cost them dearly. Last time, funds were returned, will Wintermute get lucky again?"
genome:
  - "[[direct-drain]]"
  - "[[insider]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Wintermute - REKT 2

> **Loss:** $162,300,000 | **Date:** 2022-09-20 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/09/wintermute-header.png)

**Wintermute have lost over $160M to their second incident this summer.**

In June, the market maker [sent 20M OP tokens](https://rekt.news/wintermute-rekt/) to an account that they didn’t control.

Now, their hot wallet has been compromised, likely through the use of a vanity address, created with the vulnerable tool Profanity.

The loss was [announced](https://twitter.com/evgenygaevoy/status/1572134271011225601) by Wintermute CEO Evgeny Gaevoy approximately three hours after the theft:

>We’ve been hacked for about $160M in our defi operations. Cefi and OTC operations are not affected
>
>We are solvent with twice over that amount in equity left

**The firm’s CEO states that the use of the vanity address was for “[_gas savings_](https://twitter.com/EvgenyGaevoy/status/1572181989242937345)” rather than aesthetics… an expensive choice.**

**Last time Wintermute got rekt, the exploiter [returned](https://twitter.com/RektHQ/status/1535225173179260933) (most of) the funds.**

_Will they stay lucky this time around?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**Hacker’s address: [0xe74b28c2eAe8679e3cCc3a94d5d0dE83CCB84705](https://etherscan.io/address/0xe74b28c2eAe8679e3cCc3a94d5d0dE83CCB84705)**

Attack contract: [0x0248f752802b2cfb4373cc0c3bc3964429385c26](https://etherscan.io/address/0x0248f752802b2cfb4373cc0c3bc3964429385c26)

**Main attack tx: [0xedd31e2a…](https://etherscan.io/tx/0xedd31e2a949b7957a786d44b071dbe1bc5abd5c57e269edb9ec2bf1af30e9ec4)**

Second attack tx: [0xc253450f…](https://etherscan.io/tx/0xc253450fc3e0e124224aef2936c13b371a86056e82e778113fc3ce8800bbe876)

The likely cause of the hack was a weakness in the [Profanity tool](https://blog.1inch.io/a-vulnerability-disclosed-in-profanity-an-ethereum-vanity-address-tool-68ed7455fc8c) used for creating vanity addresses. Following last week’s revelation of the Profanity vulnerability, [$3.3M was drained](https://twitter.com/zachxbt/status/1570927217840132097) from various wallets by [0x6AE09A…](https://etherscan.io/address/0x6AE09AC63487FCf63117A6D6FAFa894473d47b93) over the following days.

Both Wintermute’s [hot wallet](https://etherscan.io/address/0x0000000fe6a514a32abdcdfcc076c85243de899b) and [DeFi vault contract](https://etherscan.io/address/0x00000000ae347930bd1e7b0f35588b92280f9e75) appear to have vanity addresses, with multiple leading zeros. The hot wallet’s private key was likely compromised and used to drain the vault.

Though the weak security of Profanity-generated addresses only came into the spotlight recently, the [issue was raised](https://github.com/johguse/profanity/issues/61) on the project’s GitHub back in January.

As described by [Mudit Gupta](https://mudit.blog/wintermute-muted-in-crypto-winter/):

>The vault only allows admins to do these transfers and Wintermute’s hot wallet is an admin, as expected. Therefore, the contracts worked as expected but the admin address itself was likely compromised.
>
>Around the time that the disclosure happened, Wintermute [removed all ether](https://etherscan.io/tx/0x93716f3e3a9e3f47dec05b4df511e07e53b3e4695e84cd4f05f5d83188f3552a) from this admin address which suggests that they realized it might have been vulnerable. However, they forgot to remove the address as an admin from their vault.

The stolen funds were mostly various stablecoins, totalling $118.4M. The majority of these were deposited into Curve’s 3pool, presumably in an attempt to avoid any blacklisting.

**The exploiter is now the [3rd largest holder](https://etherscan.io/token/0x6c3f90f043a72fa612cbac8115ee7e52bde6e490#balances) of 3CRV with over 13% of the supply.**

_Tornado 3pool?_

The remaining loot is comprised of 671 WBTC (~$13M) and 6,928 ETH ($9.4M) and a [variety](https://debank.com/profile/0xe74b28c2eAe8679e3cCc3a94d5d0dE83CCB84705) of other tokens. At the time of writing, the attacker’s address is worth approximately $162.3M.

While Wintermute’s statement [assures](https://twitter.com/EvgenyGaevoy/status/1572134283912876038) that “_there shouldn’t be a major selloff of any sort_”, certain tokens with smaller marketcaps are exposed to a potential dump, with [up to 21% of circulating supply](https://twitter.com/0xPleiades/status/1572152226289975296) taken in the hack:

1. $PRIMATE 21%
2. $CUBE 12% 
3. $NYM 2.44% 
4. $eXRD 1.93% 
5. $YGG 1.17% 

_The majority of assets haven’t yet been swapped. Could the hacker be looking to negotiate a white-hat reward?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

Shortly after the news broke, the launch of a honeypot token, [WinterMuteInu](https://etherscan.io/address/0xaa030f95c338c604550d5d2000146c013b406ae0), was spoofed from the exploiter’s address to capitalise on all those watching for signs of movement. The [scammer](https://etherscan.io/address/0x87969ef4811981b72a7d05d647281c8ece046beb) seeded a Uniswap pool with [35 ETH of liquidity](https://etherscan.io/tx/0x4261f6d391ef9d5fa82ba93afab43d7e337e36cabfdb33734c835da9e974917a), which has so far accumulated ~ 166 ETH (~ $225k).

**Today’s incident marks the first _major_ hack since the sanctioning of [Tornado Cash](https://rekt.news/eye-of-the-storm/) last month. Assuming Wintermute don’t manage to retrieve the funds, it will be interesting to see how the funds are laundered.**

Post-Tornado sanctions, the potential use of 3pool as a replacement mixer should be of some concern to all Curve users.

_**But for now, [stay humble](https://twitter.com/EvgenyGaevoy/status/1571089099968348160)…**_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/09/wintermute-karma.png)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)

>If you enjoy our work, please consider donating to our [Gitcoin Grant](https://gitcoin.co/grants/1632/rekt-the-dark-web-of-defi-journalism).
