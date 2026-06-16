---
tags:
  - sector/bridge
  - sector/gaming
  - sector/stable
title: "Ronin Network - Rekt II"
protocol: "[[Ronin Network]]"
date: 2024-08-07
loss_usd: 12000000
auditors:
source: "https://rekt.news/roninnetwork-rektII"
excerpt: "The Ronin Network bridge was exploited for roughly $12 million, due to a critical oversight in a contract upgrade. For the Axie Infinity community and Ronin Network users, the words 'bridge exploit' l"
genome:
  - "[[bridge-message-validation]]"
  - "[[initializer-auth]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# Ronin Network - Rekt II

> **Loss:** $12,000,000 | **Date:** 2024-08-07 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/ronin2-header.png)

_The Ronin Network bridge was exploited for roughly $12 million, due to a critical oversight in a contract upgrade._  
  
**For the Axie Infinity community and Ronin Network users, the words "bridge exploit" likely trigger PTSD.**  
  
After the monumental [$624 million hack in March 2022](https://rekt.news/ronin-rekt/), many hoped those days were behind them.

  
But on August 6, those old wounds were reopened as Ronin faced yet another attack.  
  
This time the damage was significantly less, but the psychological impact resonates deeply.  
  
**It's as if the crypto world is watching a horror movie sequel, wondering if the protagonist has learned from past mistakes or if they're doomed to repeat them.**  
  
_As Ronin stumbles yet again, we're left wondering, how many wake-up calls does a project need before it finally masters the basics of operational security?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)



_Credit: [Chaofan Shou](https://x.com/shoucccc/status/1820766899216777495), [Ronin Network](https://x.com/Ronin_Network/status/1820804772917588339), [Verichains](https://x.com/Verichains/status/1820810424159437261)_

  

**Just when you thought it was safe to cross the Ronin bridge again, history repeats itself in a smaller, yet equally alarming fashion.**  
  
On August 6, the Ronin Network, still wearing the crown for the largest hack in crypto history, stumbled into another exploit.

  

This time, the damage was $12 million, a far cry from the $624 million heist of 2022, but no less embarrassing for a project that should have learned its lesson.  
  
It's as if the Ronin team decided to reboot their horror franchise with a low-budget sequel that nobody asked for.

  

As the saying goes, "Fool me once, shame on you. Fool me twice, shame on me."  
  
_But what do we say when a project gets fooled twice by similar oversights?_  
  
**Perhaps it's time for a new adage: "Hack me once, shame on the attacker. Hack me twice, shame on my operational security."**  
  
Like a digital Paul Revere, Chaofan Shou was the [first to sound the alarm](https://x.com/shoucccc/status/1820766899216777495) on X, alerting everyone that once again, the Ronin bridge was under attack.  
  
Unlike their previous six-day delayed reaction, this time Ronin was a little quicker on the draw.  
  
Psycheout.ron, COO of Ronin, [responded shortly after the exploit](https://x.com/Psycheout86/status/1820771028420739140) was detected.  
  

_"The Ronin Network bridge has been paused while we investigate a report from whitehats about a potential MEV exploit. The bridge currently secures over $850M which is safe."_

  

Approximately three hours later, the official Ronin Network account [confirmed the exploit](https://x.com/Ronin_Network/status/1820804772917588339), stating that white hats had alerted them and the bridge was paused 40 minutes after the first on-chain action was spotted.  
  
They revealed that the attackers had withdrawn just under 4K ETH and 2M USDC, valued at around $12M, which was the [maximum single transaction withdrawal limit](https://t.co/atTHhJuax0), a safeguard that prevented further damage.  
  
**As with many crypto heists, the devil was in the details, or in this case, in the upgrade process.**  
  
_Verichains [highlighted the root cause of this exploit](https://x.com/Verichains/status/1820810424159437261), a failure to properly initialize a critical parameter during a contract upgrade. Following is how it unfolded._

  

**The Fateful Upgrade:** On August 6, the Ronin team [deployed an update](https://etherscan.io/tx/0x855dd3b1194e3b889f4667b6a0996220e350e034d35d3eab29b4f23bc205767e) to their [bridge manager](https://etherscan.io/address/0xa71456fa88a5f6a4696d0446e690db4a5913fab0), moving from version 2 to 4.  
  
This upgrade introduced a new implementation contract, [MainchainGatewayV3](https://etherscan.io/address/0xfc274ec92bbb1a1472884558d1b5caac6f8220ee), which was deployed just 6 days prior.  
  
The [Ronin upgrade hub](https://upgradehub.xyz/diffs/etherscan/0x64192819ac13ef72bf6b5ae239ac672b43a9af08?selected=4) shows the changes in this new implementation, including modifications to how the contract handles operator weights and withdrawal submissions.

  
**The Critical Oversight:** In their haste, they called the initializeV4 function but neglected to call initializeV3. This seemingly minor oversight would prove costly.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/ronin-exploit1.png)

**The Unintended Consequence:** The _totalOperatorWeight variable was left uninitialized, defaulting to zero. This meant that the minimumVoteWeight parameter, crucial for cross-chain verification, was effectively disabled.  
  
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/ronin-exploit2.png)

**The Exploit:** With security checks effectively disabled, the vulnerability was ripe for exploitation. An MEV bot identified the vulnerability and front-ran any potential manual exploit attempts, [executing the attack](https://etherscan.io/tx/0x2619570088683e6cc3a38d93c3d98899e5783864e15525d5f5810c11189ba6cb) and directing the funds to its own address.

  

**The Damage Control:** Thanks to a daily withdrawal limit, an additional $72 million was saved from being pilfered. The Ronin team managed to [pause the contract](https://etherscan.io/tx/0x855dd3b1194e3b889f4667b6a0996220e350e034d35d3eab29b4f23bc205767e) about 38 minutes after the exploit began.

  

_In a surprising turn of events, the stolen funds were swiftly returned, thanks to lightning-fast MEV white hats who outpaced potential malicious actors._  
  
**The ETH, valued at approximately $10 million, was [promptly sent back to the Ronin team](https://etherscan.io/tx/0xf8f097982bc0f9a8f4279d4132dc91cfe17ab2d4fc70e7f740bc3ed752165601).**  
  
The [remaining USDC was returned](https://etherscan.io/tx/0x21df45bd48f17cb97f1f2b7f12e298da6ecb418ceedb69c345c934ecaca48d9c) shortly after.  
  
In recognition of their vigilance and integrity, the [Ronin team announced](https://x.com/Ronin_Network/status/1820846361945792751) a $500,000 bounty for the white hat hackers involved.  
  

**[Ronin also stated](https://x.com/Ronin_Network/status/1820846361945792751) that the bridge will undergo an audit before reopening, with Ronin aiming to shift its operation away from the current structure.**  
  
A post-mortem is scheduled for next week, promising deeper insights into the technical details and planned preventive measures.  
  
This incident highlights the double-edged sword of upgradeable contracts and the critical importance of meticulous implementation.  
  
**Ronin's oversight turned a routine upgrade into a $12 million lesson in humility.**  
  
_How many more wake-up calls can a project survive before users decide it's time to cross a different bridge?_


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




**Despite their improved response time, Ronin's failure to properly implement and test their latest upgrade reveals a project still stumbling over basic security practices.**  
  
_They dodged a bullet thanks to the fortuitous intervention of MEV white hats, but luck isn't a sustainable security strategy._  
  

For a project that's already suffered the largest hack in crypto history, this near-miss should be a final wake-up call.  
  
It's time to prioritize rigorous security measures over hasty upgrades.

  
**Moving forward, Ronin and indeed all blockchain projects should do the following:**

  

-   Always implement thorough tests for contract upgrades.
    
-   Collaborate with auditors to verify correct deployment.
    
-   Be cautious with the Initializable contract from OpenZeppelin, understanding its potential pitfalls.
    

  

**Ronin Network wobbles precariously between redemption and infamy.**  
  
_In an ecosystem where reputation is as volatile as the assets it secures, how many near-misses can a project survive before users decide to seek safer shores?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
