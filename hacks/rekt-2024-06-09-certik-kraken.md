---
tags:
  - sector/privacy
title: "Certik/Kraken - Rekt"
protocol: "[[Certik Kraken]]"
date: 2024-06-09
loss_usd: 3000000
auditors:
source: "https://rekt.news/certik-kraken-rekt"
excerpt: "Kraken accuses security researchers of extortion after $3M bug bounty exploit. Certik's disclosure of a critical vulnerability in Kraken's systems has escalated into accusations of extortion and threa"
genome:
  - "[[access-roles]]"
---
# Certik/Kraken - Rekt

> **Loss:** $3,000,000 | **Date:** 2024-06-09 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/certik-kraken-rekt.png)






_Kraken accuses security researchers of extortion after $3M bug bounty exploit._

  

**A cybersecurity firm's disclosure of a critical vulnerability in Kraken's systems has escalated into accusations of extortion and threats between the parties.**

  

Chief Security Officer [Nick Percoco disclosed](https://x.com/c7five/status/1803403632689189154) that Kraken received a bug bounty program alert from a security researcher in early June.  
  
_Security research firm [Certik revealed](https://x.com/CertiK/status/1803471653751423454) that they discovered the bug._  
  
However, rather than cooperating to address the issue, Kraken allegedly responded by threatening CertiK employees and making unreasonable demands, as claimed by CertiK.  
  
**The conflicting claims have devolved into a public he-said-she-said dispute, with each party accusing the other of questionable behavior.**

  
_In this strange and unsettling situation, can we truly trust the guardians of our digital fortresses?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Nick Percoco](https://x.com/c7five/status/1803403632689189154), [Certik](https://x.com/CertiK/status/1803471653751423454), [Tayvano](https://x.com/tayvano_/status/1803478049280893040), [Immutable Lawyer](https://x.com/ImmutableLawyer/status/1803505529299542293)_

  

**While initially vague, the report claimed to have found an "extremely critical" bug that allowed inflating account balances on the cryptocurrency exchange.**

  

Nick Percoco stated that Kraken's security team [promptly investigated the matter](https://x.com/c7five/status/1803403575277814205) and discovered an isolated bug that allowed a malicious attacker, under the right circumstances, to initiate a deposit onto our platform and receive funds in their account without fully completing the deposit.

  

Within an hour and 47 minutes, Kraken had [deployed a fix](https://x.com/c7five/status/1803403585335746796) to resolve the issue.

_CertiK [alleges their investigation](https://x.com/CertiK/status/1803450205389402215) uncovered more alarming vulnerabilities in Kraken's systems beyond the initial bug report._

**According to CertiK, their testing confirmed the ability to fabricate deposits into any Kraken account, withdraw large sums of fabricated crypto exceeding $1 million, all without triggering any alerts for multiple days.**

  
CertiK claims that after responsibly reporting these critical findings, which Kraken itself classified at the highest severity level, the exchange then threatened CertiK employees with demands to repay a "mismatched amount" of crypto within an "unreasonable time" without even providing wallet addresses.

  
The security firm alleges Kraken's threats came after CertiK had already assisted in successfully identifying and remediating the vulnerabilities.

  

_CertiK states they have gone public to protect users and urge Kraken to cease making threats against ethical security researchers acting in good faith._

  
**This contradicts Kraken's portrayal of the initial $3 million incident as clear extortion by bad actors.**

  

CertiK asserts they followed responsible vulnerability disclosure practices in coordination with Kraken initially.  
  
Further analysis revealed that the bug had [already been actively exploited](https://x.com/CertiK/status/1803450205389402215) in the preceding days across three accounts associated with the original researcher's colleagues.

  

**One account controlled by the researcher had deposited a mere $4, seemingly to validate the vulnerability.**

  

_Ultimately, the exploitation of a vulnerability in Kraken's systems enabled the withdrawal of over $3 million dollars from Kraken's corporate wallets [over a five-day period](https://x.com/tayvano_/status/1803478049280893040) by abusing the same flaw._  
  
CertiK claims that the transactions were merely [testing deposit transactions](https://x.com/CertiK/status/1803455720668471448), with millions being withdrawn from the system for testing purposes.  
  
**[Certik asserted](https://x.com/CertiK/status/1803476231041720701) that millions of dollars of crypto were minted out of air, and no real Kraken user’s assets were directly involved in our research activities.**  
  
Notably, they underlined that despite numerous fabricated tokens being generated and exchanged for valid cryptocurrencies over several days, no risk control or prevention measures were enacted until CertiK brought the issue to light.  
  

When Kraken requested that the illegally obtained funds be returned per its bug bounty policy, the researchers refused and instead demanded a speculative ransom payment based on hypothetical maximum losses.

  

**This $3 million exploit formed the basis of Kraken's claim of extortion by bad actors.**  
  
However, CertiK alleges this demand was in response to Kraken's own threats after CertiK reported even more severe vulnerabilities.  
  
It should be worthy to note, according to Kraken’s Bug Bounty page, the max pay out for a Critical severity is [capped at $1.5 million](https://www.kraken.com/features/security/bug-bounty).  
  
**Strangely, 3 transactions made by the same address conducting these “tests” made 3 deposits to Tornado Cash almost 2 weeks ago.**  
  
[Tornado Cash Deposit](https://polygonscan.com/tx/0x66f72780d1516478801ba621f0131fc56be98ff063e400a81ad0b12bcf4061f3)

  
[Tornado Cash Deposit](https://polygonscan.com/tx/0x21153b7f3ae0720fb09ccca17f75e1c41def6cd0ee7afed80d338441bd461453)

  


[Tornado Cash Deposit  
](https://polygonscan.com/tx/0x508c2289b769019014b7c31d3497040e441c4fa6e5e798659d46b26975281fe9)

If it turns out that Certik was routing funds through a Tornado Cash, a [sanctioned virtual currency mixer](https://home.treasury.gov/news/press-releases/jy0916), the [legal implications](https://x.com/ImmutableLawyer/status/1803505529299542293) could be massive.  
  
**Time will tell who was in the wrong here, clearly someone really screwed up.**  
  
_Are we venturing into a realm where the lines between ethical behavior and exploitation blur, akin to crossing over into the enigmatic realm of the Twilight Zone?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**With both parties trading accusations of extortion and threats, the matter has devolved into a heated he-said-she-said quagmire.**

  

_Kraken insists it took reasonable actions to protect itself after ethical boundaries were crossed._

  

CertiK maintains it followed industry best practices for vulnerability disclosures and responsible coordination.

  

Caught in the crossfire of this public spat are the users and broader crypto community.

  

As fingers get pointed in both directions, maybe the truth about what actually transpired will be established.

  

_Whose narrative will prove credible?_  
  
**What if there is another version of the story that has yet to be uncovered, such as a [rogue actor](https://x.com/lord_ashdrake/status/1803472821265506411?s=46)?**

  

As the outcome may significantly impact platform security and user safety in the crypto world, one wonders if ethics and collaboration will triumph over assertions of misconduct.  
  
In light of this significant occurrence, it's important to consider the possible impact on security researchers who may be more cautious about sharing their discoveries, fearing potential involvement in similar disputes.

  


_Additionally, can we fully dismiss the possibility that a rogue actor within CertiK might have played a role in the alleged exploitation, further complicating the narrative and raising questions about trust and accountability in the security research community?_



![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
