---
tags:
  - blockchain/ethereum
  - sector/dex
  - sector/governance
  - sector/multisig
  - sector/privacy
  - sector/stable
  - sector/vault
  - vuln/governance/timelock-bypass
title: "Pickle Finance - REKT"
protocol: "[[Pickle Finance]]"
date: 2020-11-22
loss_usd: 19700000
auditors:
source: "https://rekt.news/pickle-finance-rekt"
excerpt: "The fermentation of finance continues. Even pickles have a shelf life. Pickle Finance has become the latest victim of the hack epidemic. However, this time, something is different..."
genome:
  - "[[timelock-bypass]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[oracle-freshness]]"
  - "[[timelock-timestamp-bypass]]"
---
# Pickle Finance - REKT

> **Loss:** $19,700,000 | **Date:** 2020-11-22 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/11/rr.jpeg)
**The fermentation of finance continues. Even pickles have a shelf life.**

The Pickle Finance [cDAI](https://github.com/pickle-finance/contracts#pickle-jars-pjars) jar was [hacked ](https://bloxy.info/tx/0xe72d4e7ba9b5af0cf2a8cfb1e30fd9f388df0ab3da79790be842bfbed11087b0)for 19.7 million DAI via a vulnerability involving fake “Pickle Jars”.

Pickle Finance has become the latest victim of the[ hack epidemic.](/hack-epidemic/)

**However, this time, something is different...**

As Twitter tried to come to terms with yet another financial fatality, Rekt started to investigate.

We contacted the Stake Capital team, who looked at the code and warned us that other jars could be at risk.

We then quickly contacted the Pickle Finance team and set up a war room between members of Stake Capital (@[bneiluj](https://twitter.com/bneiluj), [@vasa_develop](https://twitter.com/vasa_develop))  Yearn ([@bantg](https://twitter.com/bantg)) [Pickle Finance](https://twitter.com/picklefinance) and experienced developers @[samczsun](https://twitter.com/samczsun), [@emilianobonassi](https://twitter.com/emilianobonassi).

As we worked, it became clear we were looking at something very different to the recent DeFi lego style hacks of recent weeks.

**This was not an arb.**

The attacker had excellent knowledge of Solidity and EVM, and had likely been paying close attention to the Yearn code for some time, as the vulnerability was similar to one which was [discovered ](https://github.com/iearn-finance/yearn-security/blob/master/disclosures/2020-10-10.md)in the Yearn code a month earlier.

Pickle Jars are essentially a fork of Yearn’s yVaults. These Jars are controlled by a contract called the Controller, which has a function that allows users to swap their assets between Jars.

Unfortunately, there is no whitelist for which Jars are allowed to use this swapping function.

The hacker had created a fake Pickle Jar and swapped the funds from the original jar. This was possible because the [swapExactJarForJar ](https://twitter.com/emilianobonassi/status/1330239233538318339?s=20)didn’t check for "whitelisted" jars.

The Pickle Finance team knew they needed help, and were more than willing to work with the others to prevent any further damage.

Pickle had tried to call “withdrawAll”, but the transaction [failed](https://etherscan.io/tx/0xb108205dc90466104f10d3e465593825ea88420cd8db6df29afd57e62df5cba6).

The withdrawal request had to pass through the Governance DAO which had a 12 hour timelock.

Only one member of the Pickle multisig had the ability to bypass the timelock, and they were asleep.

This meant admins couldn’t empty the Pickle Jars, but it didn’t protect them from another hack.

[Pickle Finance](https://twitter.com/picklefinance/status/1330256787002564610?s=20) and [Curve ](https://twitter.com/bneiluj/status/1330255575339438088?s=20)sent out warnings telling users to withdraw their funds from Pickle immediately, however, $50 million remained in the potentially vulnerable pickle jars, while the white hat team investigated the exploit and checked the safety of remaining funds.

The rescue team either had to wake the sleeping admin, or drain the jars themselves.

![](https://lh5.googleusercontent.com/iBloOUNiyzcS6t7vuiT8Ric31fzGktin3XSZ53MAGk0eJiylu53vsQJ_BdPOHba_7yH81037JWZX_H48bzbwH5AoNMn3jFz8Q_YplF9Xk8sm47IHRK07RnTIB8I8Ebeba4vJCCJp)
**The team had to overcome five major challenges.**

1. To get the Pickle Finance team together across several time zones to start rescuing the funds by pushing transactions into 12h timelock (via 3 out of 6 multisig) to withdraw funds.

2. To get thousands of investors to withdraw their funds (and discourage them from redepositing once the pool TVL dropped and the APY inflated to 1000+% APY)

3. Performing safety checks on the other jars to see if there is a possibility of more attacks.

4. Duplicating the attack and whitehacking before anyone can hack the jars again.

5. Avoiding getting front-runned when trying to rescue the remaining 50k

**How long can we continue to rely on pseudo anonymous white hat hackers for help?**

The incentives are clearly more aligned for attackers than protectors; why would they co-ordinate such a gruelling counter attack?

The glory goes to whitehacks, yet the money goes to hackers. **That’s not sustainable.**

How long until the temptation turns these white hats black?

**Analysis**

By releasing this technical information we are aware that we could be triggering new hacks. We discussed the potential consequences with Pickle Finance and other developers, and confirmed that we do not know of any operational forks of Pickle that could be affected by copycat attacks.

Selective disclosure would introduce an aspect of liability, so we decided to release this information freely. If any protocols are running a fork of Pickle’s code, they should already be aware of the unfolding events and be taking preventative action against copycat hacks.

The following chart was created by [@vasa_develop](https://twitter.com/vasa_develop).
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/11/Pickle-Exploit-Overview.png)
The original file can be found [here](https://lucid.app/lucidspark/invitations/accept/8f291e25-bf50-4a77-913d-31ddfb62754b).

**For further details see the teams full post-mortem [here.](https://github.com/banteg/evil-jar/blob/master/readme.md)**

It will be interesting to see how the relatively new insurance primitive “[Cover Protocol](https://twitter.com/CoverProtocol/status/1330238732558098437?s=20)” handles this incident; a large amount for their first claim. The snapshot vote for the insurance claim can be found [here.](https://snapshot.page/#/cover/proposal/QmPSkV68ihhP8EAZbNoQVsTpUh82wiX18ckyEwiUbChRjQ)
![](https://lh5.googleusercontent.com/HcyTLZyj6aAciaM5wFLPJl04zSx8n_iqwYnnetTg_ATBVappkijm1K2TtSjkbAAwsDNFcJCaiz1uibep5WAC4-56uyMRDn8p5jk-iLHk53qklgC1Jc_4JiOZrLkr3jZ-ictipp2N)
**Pickling is a slow process.**

For decades, agile development evangelists have told developers to move fast, fail quickly and release the minimum viable product.
These ideas don’t fit the bill when building in a hostile environment.

**Failing quickly in DeFi comes at great expense.**

We don’t simply need another methodology. We need a paradigm shift allowing for rapid iteration while reducing the likelihood of getting rekt at the same time.

Let’s eliminate the idea that an audit is a guarantee for safety. It is – most of the time – a snapshot of checklist-style security measures applied to moving targets that have often evolved into something else shortly after a project hits mainnet.

The audits from MixBytes (October 3rd) and Haechi (October 20th) were completed before the addition of ControllerV4 (October 23rd), which was one of the key attack vectors.

**The greatest teams in the future of finance will be those capable of handling the trade-offs between shipping fast and shipping safely**, continuously auditing and rigorously testing their composable money robots on a regular basis.

Audits should be a regular and continuous process, not a box to be ticked before launch. New DeFi protocols are subject to constant change and adaptation, and safety audits should reflect this.

**Pickles only stay fresh when they’re inside the jar...**
![](https://lh6.googleusercontent.com/Bx_HYNlFKOcaH6XtCcUCcE5TlykgAkp3vka10Tq1KkOV_bK4YxOtjJTcUt73XhYoauO3_I9SQeu55sTKkjAj0brsKfis-lPGuRpPth03tGxuxEF46oU5lJm_mgvkIL1ro_AYZh6F)photo @[martinkrung ](https://twitter.com/martinkrung)

**EDIT - 18th July 2021.**

Haechi reached out to us with the following statement:

>We audited a part of Pickle’s contracts, but the exploit occurred in newly updated smart contracts. The smart contract with the exploit was “swapExactJarForJar” in “controller-v4.sol”, and our scope of the audit was “controller-v3.sol” without “swapExactJarForJar”.You can find the details [here.](https://twitter.com/haechi_audit/status/1330347468802973698) 
(FYI) I checked that your team mentioned that our audit for pickle finance was completed before the addition of ControllerV4 which was the key attack vector for this hack.

>You can find the details [here.](https://twitter.com/haechi_audit/status/1395583924575686656)
