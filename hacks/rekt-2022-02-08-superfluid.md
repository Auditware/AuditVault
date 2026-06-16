---
tags:
  - blockchain/polygon
  - has/audit
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/privacy
  - sector/stable
  - sector/token
title: "Superfluid - REKT"
protocol: "[[Superfluid]]"
date: 2022-02-08
loss_usd: 8700000
auditors:
  - "[[Peckshield]]"
source: "https://rekt.news/superfluid-rekt"
excerpt: "$8.7M drained from Superfluid. The crypto streaming protocol was exploited by an anonymous attacker, causing collateral damage to several other DAO's."
genome:
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Superfluid - REKT

> **Loss:** $8,700,000 | **Date:** 2022-02-08 | **Audited by:** Peckshield

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/02/superfluid-header.png)

**$8.7M drained from Superfluid.**

_The crypto streaming protocol was hacked at 06:17 +UTC 08/02/22._

Other projects who were using the service for contributor payments or investor escrow contracts suffered negative price impacts as the attacker dumped their native tokens.

The affected protocols included Mai Finance [(QI)](https://www.coingecko.com/en/coins/qi-dao), Stacker Ventures [(STACK)](https://www.coingecko.com/en/coins/stackos), Stake DAO [(SDT)](https://www.coingecko.com/en/coins/stake-dao), and Museum of Crypto Art [(MOCA)](https://www.coingecko.com/en/coins/museum-of-crypto-art).

QI was the worst affected token, dropping initially by almost 80% following the dump, but it has since recovered to ~62% of its pre-hack price.

Superfluid’s [@francescorenzia](https://twitter.com/francescorenzia) told rekt.news that the attack was focussed only on the platform’s larger wallet balances. In the time before the vulnerability was patched, the hacker left plenty of ETH, USDC and DAI untouched, presumably because the attacker had “_had enough_”.

_How did it happen?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**Attacker’s address:** [0x1574f7f4c9d3aca2ebce918e5d19d18ae853c090](https://polygonscan.com/address/0x1574f7f4c9d3aca2ebce918e5d19d18ae853c090)

**Exploit tx:** [0xdee86cae2e1bab16496a49…](https://polygonscan.com/tx/0xdee86cae2e1bab16496a49b2ec61aae0472a7ccf06f79744d42473e96edd6af6)

**Assets taken:**

19.4M QI (pre-hack value of $24M) [sold](https://polygonscan.com/tx/0xc37151aaefa7e937c97156ca43e3d486299aa89a603d22355592ddd00bfe687a) [in](https://polygonscan.com/tx/0x741908f9707d9dd3a52525380d69f9e74a26d52350308227b84c3ad2db45449f) [four](https://polygonscan.com/tx/0x026032084b3f7c658b7c3467d8567922e3ad93c755669ab0d92f01f040a18dea) [transactions](https://polygonscan.com/tx/0x8dd5e00a54742f182eee7277a3326efd434f893fd94f5473f9ca1f0fd0358577) for a total of 2.3k WETH (~$6.2M)

24.4 WETH - (~$76k)

563k USDC [sold for 173 WETH](https://polygonscan.com/tx/0x9fdbcaefcd2bae1d873720ae8dfb741986818bfc1b5cf8af0a891b99b7bd14b1)

45k SDT - [sold for ~17 WETH](https://polygonscan.com/tx/0xd12c38ce2346bbc29a845dd9099a8d3626ad12e74579be46485e31653a3888bc) - (~$54k)

24k STACK - [sold for ~6.2 WETH](https://polygonscan.com/tx/0x32df8bbeba3a8fcdba51c2a7daa316078cd65345a74b765b8fa2ce6787c91f28) - (~$19k)

39k sdam3CRV - Swapped to [am3CRV](https://polygonscan.com/tx/0x0553be6c6f969c4f91850532f68f4e8bae5824392140edb13c3bfd6f6cb8d35e), then to ~44k [amDAI](https://polygonscan.com/tx/0x7a9b9ad4634fea8681e34c150ef561bf0ced199a3347888dfc448e4164583f7d)

1.5M MOCA - [1M of 1.5M sold](https://polygonscan.com/tx/0x554f5688fb8d31bcd9affc90d16f0326a8d09b0469dbb581580c7187201ef6ba) for 173 WETH (~$500K)

11k MATIC - Not yet sold

>Total - ~$8.7M

**~6 hours after the attack, Superfluid patched the bug with help from [Mudit Gupta.](https://twitter.com/Mudit__Gupta)**

_[The patch can be found here.](https://github.com/superfluid-finance/protocol-monorepo/commit/4048fbc66c144e1afd5ae68b21160e1b25d96270)_

>The text below is taken from [Superfluid’s own post-mortem.](https://medium.com/superfluid-blog/08-02-22-exploit-post-mortem-15ff9c97cdd) 

**Vulnerability Explanation**

Superfluid.sol, known as the host contract, is the contract that allows composable Superfluid agreements _(ConstantFlowAgreement, InstantDistributionAgreement)_ in one single transaction, and the composed systems are often called Super Apps.

However, in order to have a trusted and shared state through the entire transaction between different agreement calls, a concept called _“ctx”_ (a serialized state managed by the host contract) is introduced. 

The “ctx” contains all the context an agreement function needs to know, that includes especially who is the _“msg.sender”_ of the initial call.

That’s where an unfortunate vulnerability was exploited.

**The attacker was able to skillfully craft the calldata such that the process of serialization in the host contract and succeeding de-serialization in the agreement contract resulted in the agreement contract operating on a context object forged specifically to impersonate other accounts.** 

This mechanism was used in order to create IDA indexes “on behalf” of other accounts and move out their tokens that way.

**The Exploiter Contract:**

The following exploiter contract demonstrates how the vulnerability could be used to impersonate other accounts to close their open streams.

In the actual [exploit transaction](https://polygonscan.com/tx/0x396b6ee91216cf6e7c89f0c6044dfc97e84647f5007a658ca899040471ab4d67), the attacker used the IDA contract to drain funds from other accounts using the same technique: 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/02/superfluid-badcall-code.png)

**Chain of Function Calls**

**deleteAnyFlowBad**

The convention to callAgreement is to use the placeholder ctx, so that later agreement solidity code can read it directly as an argument “ctx”.

 _To read more about this concept, see [About-Placeholder-Ctx](https://github.com/superfluid-finance/protocol-monorepo/wiki/About-Placeholder-Ctx)._

This is where the attacker managed to inject a faked “ctx”, where an arbitrary sender could be set.

**Superfluid.callAgreement**

In the normal case, Superfluid.callAgreement creates the ctx and puts a stamp on it (stores its hash in a state variable), such that it can be validated using _Superfluid.isCtxValid._

**ConstantFlowAgreementV1.createFlow**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/02/superfluid-createflow-code.png)

The agreement then uses AgreementLibrary.authorizeTokenAccess to verify that the calling host contract is authorized to do state modifying calls on the token contract.

**AgreementLibrary.authorizeTokenAccess**

Once the calling host is authenticated, the agreement would transitively also trust the handed over ctx and decode (de-serialize) it into a memory structure.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/02/superfluid-authorize-code.png)

**But Fake Ctx!**

The problem was that as in the exploiting function _deleteAnyFlowBad_, one can inject a fake ctx.

After being merged into one bytes object by _Superfluid.replacePlaceholderCtx_ (the Host doesn’t make any assumptions about agreement specific data), the resulting _dataWithCtx_ now contains 2 ctx variants, the legitimate one and the injected one.

**When the agreement contract decodes this data, the abi decoder takes the first (injected) variant and ignores the remaining data which contains the legitimate ctx.**

In order to solve this, Superfluid added a verification step in the agreement contract: 

_ISuperfluid.isCtxValid._ This verifies the decoded ctx by comparing its stamp (hash) stored in the host contract. 

This check was already in place for handling ctx data provided by SuperApp callbacks, but was not in place for data handed over by the trusted Host contract.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Superfluid has reached out to the attacker [on-chain](https://polygonscan.com/tx/0x5f9fd626df2fcfef5899c10cea2ec329e76dc0d4350b4c8cf28ce776785e1952) and, according to the post-mortem, a $1M bounty remains on the table in exchange for the return of the funds.**

The team also states that most of the affected accounts have already been refunded, while the larger QI and MOCA losses will be compensated more gradually.

Although this was not the largest exploit _(number 42 on [our leaderboard](https://rekt.news/leaderboard/))_, and no user funds were lost, it is notable for the manner in which it affected other protocols.

The growing area of DAO infrastructure presents more targets for the anonymous attackers who are so prevalent in DeFi.

**The stolen money still sits in the attackers wallet.**

_Will they take the bounty, or leave Superfluid high and dry?_
