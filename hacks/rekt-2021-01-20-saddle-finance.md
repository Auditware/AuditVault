---
tags:
  - blockchain/bitcoin
  - has/audit
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/privacy
title: "Saddle Finance - REKT"
protocol: "[[Saddle Finance]]"
date: 2021-01-20
loss_usd: 275735
auditors:
  - "[[OpenZeppelin]]"
  - "[[Certik]]"
  - "[[Quantstamp]]"
source: "https://rekt.news/saddle-finance-rekt"
excerpt: "Some things are better left alone. Raise $4.2m, copy the code from Curve, and get rekt. Any investor that backed @saddlefinance values profit over progress. Why fund a fork with zero innovation?"
genome:
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
---
# Saddle Finance - REKT

> **Loss:** $275,735 | **Date:** 2021-01-20 | **Audited by:** Openzeppelin, Certik, Quantstamp

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/01/header-2.jpg)

**Some things are better left alone.**

Why fund a fork with zero innovation?

This industry is still so young and there is so much we haven’t yet built, why spend time and money on copying an existing product without adding any value?

Fast forks are understandable when done by small teams - often anonymous developers just looking for fast cash. However, this was a heavily funded and promoted project that offered nothing new to the community.

**Raise $4.2m, copy the code from Curve, and get rekt.**

If you fully understand the maths behind Curve Finance, you have the power to build tools that push forward the technological progress of the human race. So why imitate?

**If you [don’t](https://twitter.com/fubuloubu/status/1351571455960621056?s=20) fully understand the maths behind Curve Finance, why imitate?**

If you have enough funding to become a VC firm, you have enough cash to invest in projects that offer something new to the world. So why fund a fork?

**Any investor that backed this project values profit over progress.**

This includes new (and old) media companies, who took money from Saddle in exchange for promotional pieces. We know it’s hard to start a business and you have to take the work when it’s offered, but please consider your reputation...

![](https://lh5.googleusercontent.com/KzdptOjBOZvoLg_WU75Z3S3Qo3BTqjzwDKmEXnFD0sqB0D3ZoVf6-4IJZSs2O0nmjvLVjHAfsZncdjUch-MaIR6LsEHvk0vXWkykrQCVbtgRj5-KlGF2Bm_GqundpEBXmwC9L-2D)

Saddle finance devops fan, Sunil Srivatsa, was not available for comment.

**The only unexplored field covered by Saddle Finance was the limitation of [IP laws](https://twitter.com/newmichwill/status/1351561990964211715?s=19).**

After the Saddle Finance pools were [arbitraged](https://etherscan.io/tx/0x3c351cea655b8a50348e6ffa1bfff5b4ce68f99366cfad3d8a02ffb01f63138a) for millions within hours of launch, the Saddle team were forced to release a formal [excuse](https://twitter.com/saddlefinance/status/1351639208536858627?s=20) for their performance, which contained an unacceptable amount of slippage for a protocol designed to “fix the problem of slippage in DeFi”

> Some of the early transactions were executed with high slippage.
>
> Individuals may not have yielded to warnings of high slippage.
>
> In response to some of those early transactions with high slippage, we’ve updated the front end to make high slippage warnings even more explicit.

Igor Igamberdiev released [several warnings](https://twitter.com/FrankResearcher/status/1351573863461748741?s=19) advising users to exit the Saddle Finance pools, while their founder Matt Luongo showed no sympathy for the users who lost money by using the protocol he had helped to copy.

At least three major arbs took over 7.9 BTC ($275,735) from the early liquidity providers within 6 minutes.

[4.01 BTC $139,961 Jan-19-2021 04:06:54 PM +UTC](https://etherscan.io/tx/0x3c351cea655b8a50348e6ffa1bfff5b4ce68f99366cfad3d8a02ffb01f63138a)

[0.79 BTC $27,573 Jan-19-2021 04:08:46 PM +UTC](https://etherscan.io/tx/0x299ff1ac7fcec4624ec63bd0192f3df1fc8ca48211e898ac9d6caa828a33de46)

[3.11 BTC $108,548 Jan-19-2021 04:12:37 PM +UTC](https://etherscan.io/tx/0x40d860b536effc7f0f8814d3bc2db88a8d9c80f0b701a224b660578b049a0283)

Users who deposited into Saddle Finance in the hour after their launch will never get out as much as they put in, they can only hope that the liquidity rewards are generous...

**You can’t prevent apes from aping but you can at least care about the outcome.**

---

**Maybe this was all part of Saddle Finance’s marketing plan.** If any publicity is good publicity, then maybe they do win, but it’s the early LPs rather than the rich VCs who pay the price for this poor promotion.

At least they went to the effort of getting a [Quantstamp audit](https://github.com/saddle-finance/saddle-audits/blob/master/12-09-2020_Quantstamp.pdf), but then what’s an audit worth if nobody reads them?

> _Quantstamp has performed a security review of the Saddle Finance implementation of StableSwap. It is important to note that this implementation is ported from in the Curve Finance contracts, which was used as a reference during the review. In total 14 security issues spanning across all severity levels were identified, along with a few deviations from the specification, code documentation issues and best practice issues. Due to the poor documentation we were not able to determine how the developers have derived some of the implemented formulas from the StableSwap whitepaper. Additionally, we have noticed that all tests in the current test suite use exactly 2 tokens in the pool. We strongly recommend adding more tests that use 3 or more tokens and addressing all identified issues before deploying the code in production._
>
> **_The implemented relation looks different (from the original StableSwap). We are not able to understand how this relation is derived from the relation in the original StableSwap paper, mentioned at the beginning of this description._**

**Ben Hauser of Curve said:**

> _The saddle codebase includes sections of the curve codebase in it's comments to explain how it works. It also says "check the curve.fi implementation" at one point when explaining something. They clearly didn’t care much for my gas optimisations, or just lacked the ability to understand why they were optimisations._

**[Valentin Mihov](https://twitter.com/valentinmihov) said:**

> _In the open source world, rewriting instead of forking has certain implications. For example, if tomorrow Curve implements something new in their protocol, the rewritten system can’t just merge the changes in. They will need to spend significant time to rewrite them in their system. This is not the case for Sushi or DSD for example. This is where the difference comes imo._

[Ivangbi](https://twitter.com/ivangbi_) the TG admin provided the following analogy:

> _"I did not copy your book, I translated it to English and added 2 pictures"_

Above quotes forked from l0bsterDAO [Telegram group](https://t.me/lobsters_chat).

Considering it took Saddle Finance six months to port the Curve code from Vyper to Solidity, the end result leaves much to be desired.

![](https://lh3.googleusercontent.com/EBADaPHqlj7W3MiLB65rrJaZtlYks79rPhXKXtJIgAJqZv5KEVH9_25qNtD0HIEejbeYWUWU1eUXkNycQIkjCsysDgsRl0VLahP4zZkjK8j9h28ZrNENDzEy3hbb-uMfmsN5sr4x)

We await the stale memes of Matt Luongo and team.

![](https://lh6.googleusercontent.com/4zcXLh4D2uiUs4jTXzgwLH6-9UxYsHv0OZbRcMf2ntQOb2NhU1B_uPh7IhAJHXhUL4iAQTtbB7S9Uv5cJ0rW_gqTONp0lBzWURaq06ga-c_JXg3_k6N1NeTnDCpf6ORN4jwEot2_)

The founders of Saddle Finance are closely linked to the Thesis project - creators of tBTC. veCRV holders expressed their views on the arrival of Saddle Finance by voting to reduce CRV rewards to the tBTC pool.

Saddle finance devops fan, Sunil Srivatsa, was not available for comment.

![](https://lh4.googleusercontent.com/-BMpoiD8lzDDH6w4jnmVpYZ2-FK5DyMQfVkveIVr-6aItHPOtvEsilt0W9uuxqVORI2lsDTq6JVNS--i4YJSHVGCOs53YKxRcpw4P0ZHVX1wS7dhatO0-HIt9_WDzUb5MImJiJ4f)

---

**“Good artists borrow, great artists steal”**

What must have sounded like the [perfect quote](https://twitter.com/bneiluj/status/1351582180670111748?s=20) for the imitators to include in the Saddle Finance smart contract teaches a different lesson when we turn to the original words of [T.S Eliot](https://www.uvu.edu/arts/applause/posts/stealing.html).

> _Immature poets imitate; mature poets steal; bad poets deface what they take, and good poets make it into something better, or at least something different. The good poet welds his theft into a whole of feeling which is unique, utterly different than that from which it is torn._

The founders and funders of Saddle Finance are all [mature](https://twitter.com/rleshner/status/1351631502153560064?s=19) enough to know better. There is plenty of opportunity to make money in this industry without copying the work of others.

This project will not replace its predecessor, but it does serve to expose the true colours of those who promoted it.
