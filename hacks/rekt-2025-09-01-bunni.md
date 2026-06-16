---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/gaming
  - sector/lending
  - sector/oracle
  - sector/stable
  - impact/data-corruption/price-manipulation
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
title: "Bunni - Rekt"
protocol: "[[Bunni]]"
date: 2025-09-01
loss_usd: 8400000
auditors:
source: "https://rekt.news/bunni-rekt"
excerpt: "Innovation meets reality check -  fancy LDF curves and rehypothecation magic caught a hacker's attention. Bunni's basic rounding bug became an $8.4 million lesson in precision. TVL went up overnight i"
genome:
  - "[[data-corruption/price-manipulation]]"
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Bunni - Rekt

> **Loss:** $8,400,000 | **Date:** 2025-09-01 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/bunni-rekt-header.png)




_One precision bug. Two pools. $8.4 million gone._

  

**Bunni thought they'd cracked the code with their custom Liquidity Distribution Function - some next-level math that would squeeze every drop of profit from Uniswap V4.** 
  
Turned out they'd just built themselves a very expensive calculator that someone else learned to break.

  

On September 1st, an attacker turned pocket change into an $8.4 million payday by exploiting Bunni's rebalancing logic across Ethereum and Unichain.  
  
**No flash loans needed. No oracle manipulation required.**  
  
Just carefully sized trades that broke the math at exactly the right moments, allowing repeated withdrawals that drained pools faster than you could say "liquidity provider."  
  

[BlockSec sounded the alarm](https://x.com/phalcon_xyz/status/1962743751568433416), but by then millions were already [crossing bridges to Ethereum in tidy 100 ETH chunks](https://x.com/hackenclub/status/1962768341367390643).  
  
**Bunni hit the emergency pause button across all networks, but the vault was already empty.**

  
_When your protocol's greatest innovation becomes your fatal flaw, who's really doing the math?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Blocksec](https://x.com/phalcon_xyz/status/1962743751568433416), [Hacken](https://x.com/hackenclub/status/1962768341367390643), [CertiK](https://x.com/CertiKAlert/status/1962782447931703548), [Bunni](https://x.com/bunni_xyz/status/1962773674634756450), [Victor Tran](https://x.com/vutran54/status/1962770733769367780), [William Li](https://x.com/hklst4r/status/1962809962326827491), [m4rio](https://x.com/m4rio_eth/status/1962768562700906546), [zeez](https://x.com/1zaqk1/status/1962775495184977956), [Cyfrin Audits](https://gist.github.com/giovannidisiena/716324d50b6649be3a0e91395890917e), [Dapp Radar](https://dappradar.com/dapp/bunni?range-dlc=three-months)_

  
**[BlockSec fired the first shot late on September 1st](https://x.com/phalcon_xyz/status/1962743751568433416), flagging suspicious transactions targeting Bunni's Ethereum contracts with losses around $2.3 million.**

  

An hour later, the damage assessment exploded. [CertiK identified the same exploit pattern on Unichain](https://x.com/CertiKAlert/status/1962782447931703548), pushing total losses to $8.4 million across both networks.

  

Half the stolen Unichain funds had [already been swapped to ETH and were bridging to Ethereum through Across Protoco](https://x.com/hackenclub/status/1962768341367390643)l in methodical 100 ETH transfers.

  

**[Bunni's acknowledgment](https://x.com/bunni_xyz/status/1962773674634756450) came two hours after BlockSec's initial alert.**

  

[Their response was textbook damage control](https://x.com/bunni_xyz/status/1962773674634756450): "The Bunni app has been affected by a security exploit. As a precaution, we have paused all smart contract functions on all networks."

  

About 4 hours later, Bunni had narrowed the blast radius, [confirming only two pools were compromised](https://x.com/bunni_xyz/status/1962833866277744953): USDC/USDT on Ethereum and ETH/weETH on Unichain.  
  
[Silent P from Bunni announced a pause on all contracts](https://x.com/Psaul26ix/status/1962881787413061793), while they assembled a war room with Hypernative, Cyfrin Audits, Impossible, and BlockSec.  
  
**All hands on deck, but the horse had already bolted.**

  

_But how exactly do you turn a few precisely timed trades into an eight-figure heist?_  
  
### The Math That Broke the Bank

  

_Bunni got rekt by their own cleverness._

  

**Most DEXes stick with Uniswap's battle-tested logic.**

  

Not Bunni. [They cooked up their own mathematical masterpiece](https://docs.bunni.xyz/docs/v2/concepts/swaps/) - a custom Liquidity Distribution Function that would milk maximum profits from every trade.

The [LDF lived to optimize liquidity distribution](https://docs.bunni.xyz/docs/v2/concepts/swaps/), with [swaps triggering rebalancing when token ratios deviate significantly from targets](https://docs.bunni.xyz/docs/v2/concepts/swaps/).

_Spot a deviation and boom - time to recalculate and rebalance to keep those token ratios looking pretty._

**[Victor Tran from KyberSwap](https://x.com/vutran54/status/1962770733769367780) figured out what went wrong: someone discovered they could game this LDF with trades of very specific sizes.**

  

These precision strikes broke the rebalancing math, causing it to spit out completely wrong calculations for how much each LP share was worth.

  

The attacker just kept hitting replay - withdrawing more tokens than they should have, cycle after cycle.

  

_Each round made the error nastier, turning rounding mistakes into cold hard cash._

  

**[William Li spotted the smoking gun](https://x.com/hklst4r/status/1962809962326827491): the attacker had drained one balance down to a measly 25 wei.**

  

When you're dividing by numbers that small, precision goes out the window and the math falls apart.

  

Best part? [The attacker left over 1,000 logs in their transactions](https://x.com/m4rio_eth/status/1962768562700906546), complete with [helpful markers like](https://x.com/1zaqk1/status/1962775495184977956) "Depositing to euler" and "Unlock Callback."

  

**Basically wrote themselves a how-to guide while robbing the place.**

  

_When your rebalancing mechanism becomes someone else's money printer, who's watching the watchers?_

  

### Where’s the Money, Lebowski?

  

_The attacker didn't materialize out of thin air with $8.4 million._

  

**Time to follow the breadcrumbs.**

  

**Primary Attacker on Ethereum:**
[0x0C3d8fA7762Ca5225260039ab2d3990C035B458D](https://etherscan.io/address/0x0c3d8fa7762ca5225260039ab2d3990c035b458d)

**Primary Attacker on Unichain:**  
[0x0C3d8fA7762Ca5225260039ab2d3990C035B458D](https://unichain.blockscout.com/address/0x0C3d8fA7762Ca5225260039ab2d3990C035B458D)

  

**Attack Contract on Ethereum:**  
[0x657D8BcCDD9C6e1Da8DA1e7d331CFdeA8357AdBc](https://etherscan.io/address/0x657d8bccdd9c6e1da8da1e7d331cfdea8357adbc)

**Attack Contract on Unichain:**
[0x6F559f75ba08d7f45a344E12ECBe8BC15A700DdA](https://unichain.blockscout.com/address/0x6F559f75ba08d7f45a344E12ECBe8BC15A700DdA)

  

_Attack Transactions as follows…_

  

**Ethereum:**
[0x1c27c4d625429acfc0f97e466eda725fd09ebdc77550e529ba4cbdbc33beb97b](https://etherscan.io/tx/0x1c27c4d625429acfc0f97e466eda725fd09ebdc77550e529ba4cbdbc33beb97b)

  

**Unichain:**
[0x4776f31156501dd456664cd3c91662ac8acc78358b9d4fd79337211eb6a1d451](https://unichain.blockscout.com/tx/0x4776f31156501dd456664cd3c91662ac8acc78358b9d4fd79337211eb6a1d451)

  

**Two Ethereum wallets caught the loot:**
[0xe04efd87f410e260cf940a3bcb8bc61f33464f2b](https://etherscan.io/address/0xe04efd87f410e260cf940a3bcb8bc61f33464f2b)
[0x18a0Aa63C07534f69aD626E6F72f20Cbe5969263](https://etherscan.io/address/0x18a0aa63c07534f69ad626e6f72f20cbe5969263)

  

_The heist played out in two acts._

  

**First, [$2.4 million drained](https://x.com/PeckShieldAlert/status/1962763040463696095) from Ethereum's USDC/USDT pool.**

  

Then [$6 million vanished](https://x.com/hackenclub/status/1962768341367390643) from [Unichain's ETH/weETH pool](https://x.com/bunni_xyz/status/1962833866277744953) - because why stop at one network when you can double down?

  

[Half the Unichain haul got immediately swapped to ETH](https://x.com/hackenclub/status/1962768341367390643) and started its journey to Ethereum via Across Protocol.

  

Not all at once though - the attacker was methodical, [bridging funds in neat 100 ETH chunks](https://x.com/hackenclub/status/1962768341367390643) like they were following some money laundering manual.

  

**By the time security firms finished tallying the damage, most of the funds were already consolidated on Ethereum, sitting pretty in those two addresses while Bunni scrambled to figure out what the hell just happened.**

  

_When precision errors pay better than most day jobs, who needs a resume?_

  

### The Audit Situation

  

_Here's where things get messy._

  

**Who caught what when becomes a tangle of timelines and audit scope questions - the kind of complexity that makes post-mortems messy.**

  

Bunni wasn't some garage operation cutting corners on security. They got themselves [audited by legit firms](https://docs.bunni.xyz/docs/v2/audits/).

  

**[Trail of Bits (January 2025)](https://github.com/trailofbits/publications/blob/master/reviews/2025-01-bacon-labs-bunniv2-securityreview.pdf):** Caught precision issues dead-on, flagged TOB-BUNNI-13 about "lack of systematic approach to rounding and arithmetic errors" plus TOB-BUNNI-9 on excess liquidity manipulation.

  

_[According to the advice in their audit,](https://github.com/trailofbits/publications/blob/master/reviews/2025-01-bunni-securityreview.pdf) Trail of Bits told them to fix their rounding and add more fuzzing. Repo history shows code kept changing before, during, and after their review._

  

**[Pashov Audit Group (August-September 2024)](https://github.com/pashov/audits/blob/master/team/pdf/Bunni-security-review-August.pdf):** Earlier comprehensive review, found 45 issues including 6 critical ones. Code changes kept happening after they finished up.

  

**[Cyfrin (June 2025 - Main Audit)](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-06-10-cyfrin-bunni-v2.1.pdf):** This is where things get complicated.

  

_In response to Rekt News inquiries, Cyfrin confirmed they found 50+ issues and basically said 'Considering the number of issues identified, it is statistically likely that there are more complex bugs still present... it is recommended that a follow-up audit and development of a more complex stateful fuzz test suite be undertaken prior to continuing to deploy significant monetary capital to production.'_

  

Cyfrin didn't catch the specific rounding bug, but they called the bigger picture - essentially warning Bunni that more bugs were likely hiding and not to scale without additional security work.

  

**[Cyfrin (July 2025 - Fee Override Hooklet)](https://github.com/Cyfrin/cyfrin-audit-reports/blob/main/reports/2025-07-19-cyfrin-bunni-fee-override-hooklet-v2.0.pdf):** Totally different scope, just covered fee stuff. Withdrawal logic wasn't even on their radar.

  

_Which leads us to a Move Fast and Break Things Problem._

  

**Cyfrin essentially handed Bunni a roadmap to prevent getting rekt: don't scale until you've done more security work.**  
  
The protocol had already deployed, but the recommendation was clear - additional audits before continuing to deploy significant monetary capital.

  

Bunni chose speed over security.  
  
**[TVL exploded from $2.4M to $23.9M overnight](https://dappradar.com/dapp/bunni?range-dlc=three-months) (July 31st to August 1st) following Cyfrin's audit instead of following their recommendations for additional security measures.**

  

_The result? An exploit by exactly the type of "complex bug" Cyfrin predicted would exist._
  
**The Technical Reality (From [Bunni's Own Post-Mortem](https://blog.bunni.xyz/posts/exploit-post-mortem/)):**

  

_The exploit wasn't some theoretical edge case - it was a sophisticated three-step attack that Bunni's own analysis confirms could have been prevented with better testing frameworks._

  

The attack involved manipulating tiny withdrawals to exploit rounding errors, decreasing USDC active balance from 28 wei to 4 wei - an 85.7% decrease disproportionate to the liquidity shares being burnt.  
  

Bunni admits their existing testing framework failed: "We have Foundry unit tests and fuzz tests as well as Medusa fuzz tests, but they did not cover the scenario that occurred during the exploit".  
  

_What actually broke? Rounding that looked fine by itself turned lethal when chained together. Cyfrin literally called this shot._

  
**Post-Exploit Confirmation:**  
  
_After getting rekt, [Cyfrin dropped a detailed breakdown](https://gist.github.com/giovannidisiena/716324d50b6649be3a0e91395890917e) of exactly how the exploit worked._ 
  
Awkward timing, considering they'd just spent June telling Bunni that complex bugs were lurking and more security work was needed before scaling.

The firm that predicted hidden complex vulnerabilities ended up reverse-engineering the exact complex vulnerability they warned about.

This wasn't an audit oopsie - Bunni made a business call to ignore explicit warnings about sophisticated bugs still hiding in their code.

**[Cyfrin's post-hack analysis](https://gist.github.com/giovannidisiena/716324d50b6649be3a0e91395890917e) basically confirmed their own June prediction: safe-looking code can hide nasty edge cases when operations get chained together.**

_Moral of the story: When security firms tell you complex bugs are probably still there, maybe don't YOLO into higher TVL?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)





_Math is a bitch in DeFi._

  

**Bunni thought they were building the future of liquidity optimization.**

  

Turns out they were just building an $8.4 million lesson in why you don't mess with formulas that already work.

  

Uniswap V4 gave them rock-solid infrastructure, but Bunni's custom LDF became their own weapon of mass destruction.

  

The exploiter came armed with nothing but basic math and infinite patience, turning rounding errors into retirement money.

  

Multiple audit firms gave their blessing, yet somehow a precision bug that any decent analyst could spot in the transaction logs sailed right past everyone.

  

**Bunni joins the growing pile of protocols that got too smart for their own good, proving yet again that innovation without bulletproof math is just expensive trial and error.**

  

_When decimals decide who gets rekt and who gets rich, why gamble on reinventing wheels that already roll?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
