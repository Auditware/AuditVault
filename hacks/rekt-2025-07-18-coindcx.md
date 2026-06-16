---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/polygon
  - blockchain/solana
  - sector/bridge
  - sector/gaming
  - sector/privacy
  - sector/stable
title: "CoinDCX - Rekt"
protocol: "[[Coindcx]]"
date: 2025-07-18
loss_usd: 44300000
auditors:
source: "https://rekt.news/coindcx-rekt"
excerpt: "$44.3 million drained in broad daylight. CoinDCX stayed silent for 17 hours - until ZachXBT forced their hand. The attacker funded from Tornado, routed through FixedFloat, and hit with precision. Hard"
genome:
  - "[[bridge-message-validation]]"
  - "[[oracle-freshness]]"
---
# CoinDCX - Rekt

> **Loss:** $44,300,000 | **Date:** 2025-07-18 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/coindcx-rekt.png)


_Transparency has a half-life of exactly 17 hours in CoinDCX time._

  

**Hackers siphoned $44.3 million from India's second-largest crypto exchange while management played mute for nearly a day - only breaking their silence after blockchain detective [ZachXBT dropped receipts](https://t.me/investigations/264) that forced their hand.**

  

The attackers had methodically prepared their heist, routing 1 ETH through Tornado Cash, bridging funds across multiple chains, and executing a precision drain of CoinDCX's wallets.

  

While $28.3 million in SOL and $15.78 million in ETH vanished into mixing protocols, CoinDCX's leadership was apparently practicing radio silence.

  

**Their damage control playbook read like a Mad Libs template: insert "sophisticated server breach" here, sprinkle "treasury reserves" there, and hope nobody noticed customers found out from ZachXBT instead of official channels.**

  

_When you need blockchain detectives to announce your own $44.3 million disaster, what exactly are you managing besides the cleanup?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [ZachXBT](https://t.me/investigations/264), [Cyvers](https://x.com/CyversAlerts/status/1946625586597888163), [Sumit Gupta](https://x.com/smtgpt/status/1946597988660645900), [BSC News](https://bsc.news/post/the-44-m-coin-dcx-hack-explained), [Neeraj Khandelwal](https://x.com/neerajKh_/status/1946626390478229765), [DL News](https://www.dlnews.com/articles/people-culture/coindcx-hacker-routes-46m-into-ethereum-lazarus-style-attack/), [Breadcrumbs](https://www.breadcrumbs.app/reports/18488?share=0ee33a33-cf23-4876-b81b-2d04a9d5c877), [CoinDCX](https://coindcx.com/blog/announcements/incident-report-july-19-2025/)_

  

**ZachXBT wasn't hunting for CoinDCX specifically - he was following breadcrumbs that [Cyvers had flagged](https://x.com/CyversAlerts/status/1946625586597888163) about suspicious withdrawals from an untagged wallet.**

  

July 19th, 14:41 UTC, Zach [dropped a bombshell in his Telegram channel](https://t.me/investigations/264): "Looks like the India centralized exchange 'CoinDCX' was likely drained for ~$44.2M almost 17 hours ago and has yet to disclose the incident to the community."

  

The first transaction hit CoinDCX's Solana wallet on July 18th at 23:22 UTC - a $4.3 million goodbye kiss that nobody at the exchange seemed eager to discuss publicly.  
  
**First Attack Transaction:**
[5mPfNreuEeNanMoxCtGuWWgw1pbpM7SXC7ZZJH9Z6qeGq7YgEsNPmXrZKhnJezFHZFcdronZJKaoGieXcg4S9sqx](https://solscan.io/tx/5mPfNreuEeNanMoxCtGuWWgw1pbpM7SXC7ZZJH9Z6qeGq7YgEsNPmXrZKhnJezFHZFcdronZJKaoGieXcg4S9sqx)

  

_ZachXBT's detective work [revealed the attacker's money trail](https://t.me/investigations/264): 1 ETH from Tornado Cash funding the operation, stolen funds split across Solana addresses, then bridged to Ethereum._

  

The affected wallet [wasn't even publicly tagged](https://t.me/investigations/264) or included in CoinDCX's proof-of-reserves, forcing manual attribution through counterparty analysis.

  

The timeline painted an uncomfortable picture. Attack begins Friday night, funds start moving, silence stretches through Saturday morning - then suddenly everyone's an expert on transparency once the cat's out of the bag.

  

**A fine example of "oh by the way, we got hacked" - nearly a day late and $44.3 million short.**

  

_When public disclosure comes 17 hours after the bleeding starts, who's really setting the transparency timeline?_

  

### Forced Transparency

  

_[ZachXBT's Telegram post](https://t.me/investigations/264) hit at 14:41 UTC on July 19th. By 14:48 UTC, CoinDCX CEO [Sumit Gupta was suddenly ready to talk](https://x.com/smtgpt/status/1946597988660645900)._

  

**Seven minutes. That's how long it took for "we have always believed in being transparent with our community" to materialize after getting publicly called out.**

  

Gupta's [damage control statement](https://x.com/smtgpt/status/1946597988660645900) read like crisis management bingo: "sophisticated server breach," "operational accounts segregated from customer wallets," "treasury reserves," and the classic "no customer funds impacted."

  

Every box checked except the one that mattered - why customers heard about it from Twitter first.

_But the scrambling wasn't over. An hour later at 16:41 UTC, [co-founder Neeraj Khandelwal announced](https://x.com/neerajKh_/status/1946626390478229765): "Because of excessive load on the platform, Portfolio APIs are jammed."_

**Two minutes later, [CEO Sumit Gupta chimed in](https://x.com/smtgpt/status/1946626973997969727) with nearly identical messaging, adding a curious "PS: Customer assets remain safe!"**

Funny how portfolio APIs crash an hour after announcing your hack. Still workshopping the cover story?

ZachXBT wasn't buying the transparency theater. [His response cut through the corporate spin](https://x.com/zachxbt/status/1946626657218863302): "Your team waited 17 hours to disclose (not until after it was alerted publicly)."

  

The exchange's community management apparently went into overdrive, [with team members reportedly asking users](https://x.com/zachxbt/status/1946626657218863302) to thank Gupta for his "transparency" in Discord channels.

  

**Nothing says authentic crisis response quite like crowdsourcing gratitude for doing the bare minimum.**

  

_When your transparency only kicks in after getting exposed by blockchain detectives, is it really transparency or just damage control with better timing?_

  

### The Preparation Game  
  
_July 18th wasn't day one - the real show started three days earlier when someone decided CoinDCX needed a $44.3 million haircut._

  

**July 16th brought the opening move: 1 ETH sliding out of Tornado Cash like butter.**  
  
No direct routes here - the funds bounced through FixedFloat, took a vacation on Polygon, then bridged over to Solana via deBridge.

  

**Fixed Float Funding Transaction:**
[0x90083b839d093536104efb592aa46847993dca26a9410faac99aad4ec236f41b](https://polygonscan.com/tx/0x90083b839d093536104efb592aa46847993dca26a9410faac99aad4ec236f41b)

  

Because why take the highway when you can take a scenic route through every blockchain in existence?

  

_July 17th may have been rehearsal day. Infrastructure setup, system testing, probably ordering pizza while mapping out which wallets to hit first._

  

**This wasn't some weekend warrior looking for lunch money - someone was running a three-day clinic in exchange infiltration.**

  

July 18th, 21:07 UTC: A single USDT test transaction. The digital equivalent of checking if the vault door is actually locked.

  

Then the floodgates opened. Between 22:09 and 22:14 UTC, [five minutes of systematic destruction](https://bsc.news/post/the-44-m-coin-dcx-hack-explained): $2 million, $7 million, $10 million, $10 million, then two separate $5 million withdrawals, finishing with a final $5 million transfer.  
  
The stolen funds landed across multiple addresses:

  

**Solana #1:**
[6peRRbTz28xofaJPJzEkxnpcpR5xhYsQcmJHQFdP22n](https://solscan.io/account/6peRRbTz28xofaJPJzEkxnpcpR5xhYsQcmJHQFdP22n)

  

**Solana #2:**
[3btch8cSVp3Uh2SiY9DeiRNYUBmFiBNHZQzDyecJs7Gu](https://solscan.io/account/3btch8cSVp3Uh2SiY9DeiRNYUBmFiBNHZQzDyecJs7Gu)

  

**Ethereum (holding roughly $44.3 Million as of July 22nd):**
[0xEF0c5b9E0E9643937D75C229648158584A8CD8D2 ](https://etherscan.io/address/0xef0c5b9e0e9643937d75c229648158584a8cd8d2)

Full Transaction Tracing [through Breadcrumbs](https://www.breadcrumbs.app/reports/18488?share=0ee33a33-cf23-4876-b81b-2d04a9d5c877).

  

**The attackers didn't just steal - they performed financial surgery, carving out specific amounts with precision timing that suggests intimate knowledge of CoinDCX's systems.**

  

_When hackers spend more time planning your exploitation than you spent securing against it, who's really the professional here?_  
  

### Bounty Hunters Wanted

  

_Monday morning brought CoinDCX's next act: the [recovery bounty announcement](https://x.com/smtgpt/status/1947215040899158359) that read like a desperate Craigslist ad for stolen goods._

  

**"Up to 25% of any recovered funds will be awarded to individuals or teams who can help trace and retrieve the stolen crypto," CEO [Sumit Gupta posted](https://x.com/smtgpt/status/1947215040899158359), apparently believing white hat hackers work on commission.**

  

The messaging pivoted from transparency champion to victim advocate faster than a politician during election season.

  

"More than recovering the stolen funds, what is important for us is to identify and catch the attackers," Gupta declared, as if catching cybercriminals had suddenly become their core business model.

  

**Co-founder Neeraj Khandelwal [joined the chorus with his own bounty post](https://x.com/neerajKh_/status/1947214618449035329), thanking a laundry list of security firms and foundations for their "support" - because nothing says crisis management quite like name-dropping your entire rolodex.**

  

The exchange's [$538.35 million in reserves supposedly absorbed the loss](https://coindcx.com/blog/announcements/incident-report-july-19-2025/) without breaking a sweat, yet here they were offering bounties like contestants on a game show.

  

Either the treasury hit wasn't as painless as advertised, or someone really wanted those attackers caught.

  

Both executives stressed the hack didn't impact customers or platform operations – corporate speak for "please don't withdraw your funds while we figure this mess out."

  

**Because obviously, a $44.3 million loss is just accounting noise, not a user concern.**

  

_When your post-hack strategy involves crowdsourcing detective work instead of explaining how you got breached, are you running an exchange or a puzzle contest?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






_July 2024: [WazirX gets rekt for $235 million](https://rekt.news/wazirx-rekt) and plays dead until blockchain detectives drag them kicking and screaming into the light._

  

**July 2025: CoinDCX bleeds $44.3 million and pulls the exact same vanishing act until ZachXBT forces their hand.**

  

Déjà vu doesn't begin to cover it. More like déjà poo - same shit, different exchange.

  

India's biggest exchanges have turned silence into an art form - why announce your own disasters when blockchain detectives will eventually do it for you?

  

Both hacks followed the same script: attackers prep for days, execute like professionals, then watch management teams pretend transparency means talking only after getting caught.

  

_CoinDCX's seven-minute turnaround after ZachXBT's post wasn't confusion - it was panic about who controlled the narrative._

  

**The was too clean to be random, yet management won't discuss internal investigations.**

  

When you won't even confirm you're looking at your own employees, what else aren't you saying?

  

The methodical preparation, cross-chain laundering, and surgical precision [could hint Lazarus Group, according to some sources](https://www.dlnews.com/articles/people-culture/coindcx-hacker-routes-46m-into-ethereum-lazarus-style-attack/), the same state-sponsored crew that's been turning exchanges into personal ATMs across the globe.

  

Meanwhile, [CoinDCX leadership](https://coindcx.com/blog/announcements/incident-report-july-19-2025/) went from "we believe in transparency" to "please help us find our money" faster than their treasury absorbed a $44.3 million hit.

  

**Two major Indian exchanges, two massive hacks, two cases of transparency arriving only after public shaming.**

  

_When your crisis management playbook is hoping nobody notices until someone with better blockchain skills does your job for you, are you running an exchange or just playing hide and seek with other people's money?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
