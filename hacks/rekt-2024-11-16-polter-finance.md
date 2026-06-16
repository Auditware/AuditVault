---
tags:
  - blockchain/fantom
  - blockchain/optimism
  - sector/bridge
  - sector/lending
  - sector/oracle
  - vuln/oracle/spot-price
  - impact/data-corruption/price-manipulation
  - trigger/flash-loan
  - trigger/price-manipulation
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Polter Finance"
protocol: "[[Polter Finance]]"
date: 2024-11-16
loss_usd: 8700000
auditors:
source: "https://rekt.news/polter-finance-rekt"
excerpt: "After losing roughly $8.7 million to a textbook case of oracle manipulation, Polter Finance is scrambling to clean up the mess. Their unaudited protocol left key vulnerabilities wide open, and now the"
genome:
  - "[[spot-price]]"
  - "[[data-corruption/price-manipulation]]"
  - "[[flash-loan]]"
  - "[[trigger/price-manipulation]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Polter Finance

> **Loss:** $8,700,000 | **Date:** 2024-11-16 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/polter-rekt-header.png)


_When will they learn that "fork and pray" isn't a security strategy?_  
  

**Polter Finance, the latest victim in DeFi's parade of recklessness, lost roughly $8.7 million when their unaudited protocol met a classic price manipulation attack.**  
  
Their newly launched BOO market proved to be more trick than treat, as an attacker turned spot price dependencies into their personal ATM.  
  

The team's response was a masterclass in damage control theater - filing a [possibly inflated $12 million police report](https://x.com/whichghost/status/1858134916632080648) while their TVL bled out through a painfully predictable oracle exploit.  
  

Like a crypto soap opera, we watched the familiar scenes unfold: platform pause, bridge notifications, Binance wallet traces, and the obligatory "dear ser hacker" negotiation attempts.  
  

**Another day, another protocol learning that copying code doesn't copy security.**  
  

_But who needs audits when you have optimism?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [whichghost](https://x.com/whichghost/status/1858134916632080648), [BcPaintball](https://x.com/Bcpaintball26/status/1857865758551805976), [Polter Finance](https://x.com/polterfinance/status/1857971122043551898), [William Li](https://x.com/hklst4r/status/1858102691693514871), [Nick Franklin](https://x.com/0xNickLFranklin/status/1858402633935126969)_

  

**Turns out BOO markets can haunt you.**

  

[BcPaintball first spotted](https://x.com/Bcpaintball26/status/1857865758551805976) the ghost in the machine, reporting suspicious activity on Polter's newly launched BOO market.

  

The team, perhaps too busy counting their [unaudited chickens](https://polter.gitbook.io/polter/audit), took [roughly 7 hours to acknowledge](https://x.com/polterfinance/status/1857971122043551898) what was already painfully obvious to everyone else.

  

[Nick Franklin's autopsy](https://x.com/0xNickLFranklin/status/1858402633935126969) revealed a textbook case of oracle manipulation - proving yet again that spot prices make better victims than oracles.

  

_[William Li's initial analysis](https://x.com/hklst4r/status/1858102691693514871) pointed to what looked like an "empty market" rounding error, but deeper investigation exposed something far more fundamental - a faulty oracle implementation that practically begged to be exploited._

  

**The protocol's critical mistake? Trusting SpookySwap V2/V3 pool prices for their BOO token oracle - about as secure as using a paper lock on a bank vault.**

  

By draining the BOO token reserves through a flash loan, the attacker manipulated the price feed like a puppeteer with particularly profitable strings.  
  
One BOO deposit was all it took to borrow against artificially inflated collateral, proving that in DeFi, sometimes the simplest tricks are the most expensive.  
  
**Exploiter:**
[0x511f427Cdf0c4e463655856db382E05D79Ac44a6](https://ftmscan.com/address/0x511f427cdf0c4e463655856db382e05d79ac44a6)

  

**Exploiter contract:**
[0xA21451aC32372C123191B3a4FC01deB69F91533a](https://ftmscan.com/address/0xa21451ac32372c123191b3a4fc01deb69f91533a)

**[Flow of Funds on Metasleuth](https://metasleuth.io/result/fantom/0x5118df23e81603a64c7676dd6b6e4f76a57e4267e67507d34b0b26dd9ee10eac).**

  

_The team's post-exploit performance deserves its own review._

  

**Hours after watching roughly $8.7 million evaporate, they [filed a police report claiming $12 million in losses](https://x.com/whichghost/status/1858134916632080648) - perhaps hoping inflation would make up the difference.**

  

The team's crisis management playbook rolled out with clockwork predictability.

  

Within hours, they'd paused the platform, notified bridges, and [claimed to have traced the exploiter's wallet to Binance](https://x.com/polterfinance/status/1857971122043551898) - though blockchain analysis suggests the funds had already begun their journey through different paths.

  

"Platform paused soon after the exploit was identified. Bridges were notified. We identified wallets involved and traced it to Binance," announced the Polter team, punctuating their statement with the DeFi equivalent of "thoughts and prayers" - a promise to contact authorities.

  

_Like a jilted lover sliding into DMs, [Polter took to the blockchain to negotiate](https://etherscan.io/tx/0xf233688a08b6e9395ac72f7edc779e9446ed2fa559b8dc1dd0cdaa1f91af949f) - though perhaps their time would've been better spent sliding into auditors' inboxes months ago._
  

**In the grand tradition of "move fast and break things," Polter Finance [skipped the tedious business of security audits entirely](https://polter.gitbook.io/polter/audit). Their confidence in unaudited code proved almost as inflated as their BOO token prices.**

  

"As the smart contract used is identical to Geist, except for the removal of the flash-loan function in Lending Pool, we are providing the Geist audit report here" - [proclaims Polter's audit page](https://polter.gitbook.io/polter/audit), demonstrating the kind of security theater that gives Broadway a run for its money.

  

The aftermath serves as yet another case study in the false economy of skipping audits. Close to $8.7 million lost to save what - a few weeks and a few thousand dollars?

  

But who needs professional security reviews when you can CTRL+C CTRL+V your way to launch?

  

The only audit they got was from the exploiter - and those results just came in.  
  
Crypto may be rocketing into the mainstream, but unless protocols like Polter start getting their act together, it’s more likely to crash and burn before it ever reaches the moon.

  

**The industry's growing pains are already painful enough, and without addressing these basic security flaws, mainstream adoption could end up being a full-speed disaster.**

  
_Anyone else think Polter won’t stick around for the full ride?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_Another day, another protocol proving that copying code doesn't equal competence._

  

**Polter Finance's roughly $8.7 million lesson in basic oracle security came with extra credit in creative accounting - [their $12 million police report](https://x.com/whichghost/status/1858134916632080648) suggesting they're better at inflating numbers than securing them.**  
  
From skipping audits to serving up manipulatable oracles on a silver platter, the team demonstrated a masterclass in "how not to run a DeFi protocol."

  

Their security strategy amounted to little more than hopes, prayers, and someone else's audit report.

  

The exploiter didn't discover a novel vulnerability - they simply walked through the front door Polter left wide open.

  
In crypto's current surge toward mainstream adoption, such amateur-hour security practices aren't just embarrassing - they're dangerous.  
  
**Polter now takes its place among the countless protocols that mistook convenience for competence.**  
  
_But here's the real haunting question - how many more users need to get rekt before protocols realize that copy pasta code doesn't make you ready for primetime?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
