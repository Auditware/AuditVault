---
tags:
  - sector/dex
  - sector/privacy
  - sector/stable
  - sector/staking
  - precondition/insider
title: "BrincFi - Rekt Cold Case"
protocol: "[[Brincfi]]"
date: 2021-12-14
loss_usd: 1100000
auditors:
source: "https://rekt.news/brincfi-rekt-coldcase"
excerpt: "A backdoor function drained BrincFi’s staking contract in December 2021. They allege an ex-dev, still active in crypto, was behind it. The case drags on in court while users are left without answers. "
genome:
  - "[[insider]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
  - "[[circuit-input-range-check]]"
---
# BrincFi - Rekt Cold Case

> **Loss:** $1,100,000 | **Date:** 2021-12-14 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01//brincfi-rekt-header.png)





_Hacks happen, rugs happen, and the headlines move on._  
  
**But somewhere in the wreckage, users are still waiting for someone to care.** 
  

Most exploits vanish with the news cycle.

  

But BrincFi’s wasn’t just another opportunistic hack - it was a slow, possibly a surgical betrayal written in code.

  
_A betrayal made possible by DeFi’s most dangerous feature: unchecked admin privileges._

  
**[290 ETH disappeared from BrincFi's vaults](https://x.com/Beosin_com/status/1470695420301037569) when their own lead developer may have turned predator in December 2021.**

  

A backdoor ‘rescueToken’ function, embedded in an innocuous-looking upgrade, became what [BrincFi alleges was a carefully planned betrayal](https://medium.com/@brinc.fi/brinc-fi-theft-and-fraud-case-against-daniel-choi-7f58bfa8c8ce).

  

[14.3 million BRC and 3.2 million gBRC tokens](https://x.com/Beosin_com/status/1470696210558300165) siphoned, converted, and washed through Tornado Cash's digital spin cycle.

  

**First the keys. Then the contract. Then the money.**

  

_When the keys to your kingdom may have been held by mercenaries, should you be surprised when the treasury disappears in the dead of night?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Beosin](https://beosin.medium.com/brinc-finance-was-attacked-due-to-private-key-leakage-resulting-in-the-loss-of-290-eth-6758cb810bce), [YannickCrypto](https://x.com/YannickCrypto/status/1470660893218385923), [BrincFi](https://medium.com/@brinc.fi/brinc-fi-theft-and-fraud-case-against-daniel-choi-7f58bfa8c8ce)_

**Digital crimes leave digital fingerprints.**

  

[YannickCrypto caught the scent firs](https://x.com/YannickCrypto/status/1470660893218385923)t - "Contract deployer move funds to new address to rug them".

  

[Beosin confirmed](https://x.com/Beosin_com/status/1470695420301037569) what the on-chain sleuths already knew - "attacked due to private key compromise, resulting in the loss of 290 ETH."  
  
290 ETH went for $1.1 million in December 2021, the amount has fallen to $757k since.

  

_[The digital autopsy was straightforward](https://beosin.medium.com/brinc-finance-was-attacked-due-to-private-key-leakage-resulting-in-the-loss-of-290-eth-6758cb810bce), no complex financial tricks, just surgical precision._

  

**Owner privileges transferred, contract implementation swapped, funds hijacked.**

  

A perfect crime that looked like a hack but smelled like a rug.

  

[Certik's investigation, commissioned by a desperate BrincFi team](https://medium.com/@brinc.fi/brinc-fi-exploit-post-mortem-76ca6b355211), pointed the finger back at home - their own Head of Development held "full authority over the staking contract."

  

The attacker’s ghost lingered only in transaction hashes and court documents.  
  
**The attack itself was brutally effective, embarrassingly simple - and may have been an insider.**

  

_The sequence began December 14th, 2021, with a single transaction that transferred ownership of BrincFi's staking contract to the attacker's wallet._

  

**Transfer Ownership Transaction:** [0x09ae252d00122864070461e78810a3b91c4fb64076f72eb6dba775a80ca00df4](https://etherscan.io/tx/0x09ae252d00122864070461e78810a3b91c4fb64076f72eb6dba775a80ca00df4)

  

**Original Deployer Wallet:**  
[0x43e0acd5314d0b8bcf34d45fc9f5b8ea2dd403b9](https://etherscan.io/address/0x43e0acd5314d0b8bcf34d45fc9f5b8ea2dd403b9)

  

**Attacker:**  
[0x6B0b61323F6d77ef8A1a35D11FA877631d8f67Bb](https://etherscan.io/address/0x6b0b61323f6d77ef8a1a35d11fa877631d8f67bb)

  

The original deployer wallet funded the attacker's address with 0.5 ETH - possibly to cover gas fees for the coming drain.  
  
**Funding Transaction:**
[0xc95e14ea17062bc04bd824fff995a110e07f67ea25c14b2c298768c6bb0c4944](https://etherscan.io/tx/0xc95e14ea17062bc04bd824fff995a110e07f67ea25c14b2c298768c6bb0c4944)

  



Still holding admin privileges, the deployer wallet upgraded BrincFi’s staking contract to a malicious implementation.

  

_Then the attacker drained it using the custom rescueTokens() function - first BRC, then gBRC._

  

**The smoking gun? A simple function:**

function rescueTokens(address to, IERC20Upgradeable token) public onlyOwner {
uint bal = token.balanceOf(address(this));
require(bal > 0);
token.transfer(to, bal);
}

  

**Five lines of code. No complex exploits. Just a backdoor designed to drain everything.**

  

The stolen tokens were immediately swapped for DAI, converted to ETH, and funneled into Tornado Cash's anonymity vortex.  
  
Meanwhile, the "compromised" wallet continued moving funds around.

  

**Maximum damage in minimum time.**
  
_If the master key never left the building, was this a heist or just a withdrawal?_

  
## Behind the Scenes  
  
_Unlike most crypto heists, BrincFi's story didn't end at Tornado Cash._

  

**The team seemed to know exactly where to point fingers - and they pointed straight at Daniel Choi, their former Head of Development.**

  

"As the Head of Development, he had the responsibility to keep the contract secure," [BrincFi's post-mortem stated](https://medium.com/@brinc.fi/brinc-fi-exploit-post-mortem-76ca6b355211) with bitter precision.

  

But instead of disappearing into crypto's shadows, Choi did something unusual for a suspected attacker - [he hired an attorney](https://medium.com/@brinc.fi/brinc-fi-exploit-post-mortem-76ca6b355211).

  

The California court system became the new battlefield as BrincFi filed [case 22TRCV00231](https://www.docketalarm.com/cases/California_State_Los_Angeles_County_Superior_Court/22TRCV00231/PACIFIC_COAST_CO._LTD._D-B-A_BRINCFI_VS_DANIEL_CHOI/) against their former developer.

  

_BrincFi’s legal fight with former developer Daniel Choi [took a strange turn in January 2024](https://medium.com/@brinc.fi/update-daniel-choi-fraud-and-theft-case-72ffabff3335), when a deposition in LA ended with more shrugs than answers._

  

**“Daniel answered certain questions, but did not answer all the questions asked of him,” the company noted dryly. The session was cut short after Choi claimed he felt unwell.**

  

[According to BrincFi](https://medium.com/@brinc.fi/update-daniel-choi-fraud-and-theft-case-72ffabff3335), Choi dodged most of the discovery - failing to hand over 10 of 12 requested documents and objecting to nearly every written question.

  

Then, just days after being pressed about outside contacts, Choi lawyered up with a new firm.

  

**The company’s civil case for theft and fraud is still limping along. So are the questions.**

  

BrincFi made sure to point out: the [alleged thief continues to work in crypto as a Research Engineer](https://medium.com/@brinc.fi/update-daniel-choi-fraud-and-theft-case-72ffabff3335) while they fight for justice in court.

  

The legal system grinds slowly, while crypto moves at light speed.

  

**Who said crime doesn't pay? It just might come with a side of depositions.**

  

_If crypto makes theft instant but justice takes years, is the gap between crime and punishment DeFi's ultimate exploit vector?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_Whether insider betrayal or sophisticated key compromise, DeFi’s most dangerous vulnerability often isn’t in the code – it’s wearing a hoodie at the keyboard._

  

**The BrincFi case isn't ancient history; it's tomorrow's headline with yesterday's date.**  
  
Three years on, while the crypto graveyard fills with fresh corpses, some ghosts refuse to rest.

  

BrincFi's cold case sits frozen in legal limbo - funds vanished, suspects unpunished, users left behind.

  

In an industry obsessed with speed, hype, and forgetting, the past rarely gets a second look.

  

_But cold cases like these deserve one. Because the exploit didn't die with BrincFi - it mutated, rebranded, and lives on in every protocol still guarded by a single private key._

  

**Same script. Different logos. Identical wreckage.**

  

The alleged thief remains gainfully employed in the crypto industry while BrincFi's users count their losses.

  

While lawyers battle in California courtrooms over 2021's mess, fresh victims hemorrhage millions to identical exploits - same attack pattern, different logos.

  

The industry pretends each admin key disaster is a unique tragedy rather than a rerun with fresh victims.

  

**Zero knowledge proofs. Formal verification. Audits by the dozen. None stop the oldest exploit in the book: the trusted insider.**

  

_As BrincFi's legal saga drags on, one cold truth emerges - when your developers hold the keys to your kingdom, are they your greatest security feature or your single point of failure?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
