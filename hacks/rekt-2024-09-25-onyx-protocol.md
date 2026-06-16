---
tags:
  - sector/dex
  - sector/gaming
  - sector/governance
  - sector/lending
  - sector/stable
  - sector/token
  - has/audit
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Onyx Protocol - Rekt II"
protocol: "[[Onyx Protocol]]"
date: 2024-09-25
loss_usd: 3800000
auditors:
  - "[[Certik]]"
source: "https://rekt.news/onyx-protocol-rekt2"
excerpt: "Another Compound v2 fork that just can't catch a break, Onyx Protocol, has been exploited again. This time, the damage tally stands at a cool $3.8 million, siphoned off by the same high-profile vulner"
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Onyx Protocol - Rekt II

> **Loss:** $3,800,000 | **Date:** 2024-09-25 | **Audited by:** CertiK

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/onyxprotocol-rekt-header.png)



_Onyx Protocol, another Compound v2 fork that just can't catch a break, has been exploited again._  
  
**This time, the damage tally stands at a cool $3.8 million, siphoned off by the [same high-profile vulnerability](https://rekt.news/onyx-protocol-rekt/) that bit them late last year.**  
  
It's a rerun nobody asked for, featuring the usual suspects: a known bug, a newly added market, and a team seemingly allergic to learning from past mistakes.  
  
The exploit, executed with the precision of a seasoned chef following a recipe, drained a smorgasbord of assets including VUSD, XCN, DAI, WBTC, and USDT.  
  
**Onyx finds itself in the unenviable "fool me twice" club, proving that in DeFi, lightning can indeed strike the same place twice - especially if you're holding a metal rod in a thunderstorm.**  
  
_In the grand tapestry of DeFi disasters, is Onyx weaving a masterpiece or just tying itself in knots?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Cyvers](https://x.com/CyversAlerts/status/1839284600461303958), [Onyx Protocol](https://x.com/OnyxDAO/status/1839335665768845452), [Hacken](https://x.com/hackenclub/status/1839312308880715797), [Peckshield  
  ](https://x.com/peckshield/status/1839302663680438342)_

**In a plot twist surprising absolutely no one, Onyx Protocol decided to take "double or nothing" a bit too literally.**  
  

As crypto degens were busy arguing about the next meme coin or prepping for another conference, [Cyvers played the role](https://x.com/CyversAlerts/status/1839284600461303958) of party pooper:  
  

_"Our system has detected suspicious transaction involving Onyx DAO on ETH chain! Total loss is around $3.8M."_  
  

Meanwhile, the Onyx team seemed to be practicing their ostrich impressions.  
  
4 hours after the exploit, they finally [poked their heads out of the sand](https://x.com/OnyxDAO/status/1839335665768845452):

  

_"Onyx Protocol is aware of unusual activity on our platform and is currently reviewing third party post mortem examination data while conducting our own investigation."_

  

**But by then, the digital safe had long been cracked open, its contents scattered to the winds of the blockchain.**  
  
As blockchain detectives pieced together the digital crime scene, they found themselves watching a rerun of "Precision Manipulation: Onyx Edition." Same vulnerability, different day.  
  
_Hacken, playing the role of DeFi's CSI team, [laid out the attack blueprint](https://x.com/hackenclub/status/1839312308880715797)._  
  
**Our intrepid hacker, clearly a fan of sequels, followed a script we've seen before:**

  

Kick things off with a 2K ETH flash loan from Balancer. Because why use your own money when you can borrow someone else's?

  

Play the ETH shell game: deposit 1,999.5 ETH into the oEther contract, while sneaking 0.5 ETH into a malicious contract cooked up just for the occasion.

  

_Use this custom contract to mint and redeem oETH in amounts so small, they'd make even a satoshi blush. We're talking 0.00000001 oETH here, folks. Because in DeFi, size doesn't always matter._

  

**Rinse and repeat this minting and redeeming dance 56 times. Because if at first you don't succeed, try, try, try, try... (you get the idea) again.**

  

Watch as the exchange rate goes haywire, proving once again that in DeFi, it's not about the size of your transaction, but how you use it.

  

This precision manipulation attack exploited a vulnerability that's becoming all too familiar in the Compound V2 family reunion.

  

_The flaw? A hiccup in the asset's exchange rate calculation when there's low liquidity in a market._

  
**It's as if Onyx left the door wide open, hung up a "Free Money" sign, and went on vacation.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/onyx-exploit1.png)

**Exploiter address:**
[0x680910cf5Fc9969A25Fd57e7896A14fF1E55F36B  ](https://etherscan.io/address/0x680910cf5fc9969a25fd57e7896a14ff1e55f36b)
  
 **Attack transaction:**
[0x46567c731c4f4f7e27c4ce591f0aebdeb2d9ae1038237a0134de7b13e63d8729](https://etherscan.io/tx/0x46567c731c4f4f7e27c4ce591f0aebdeb2d9ae1038237a0134de7b13e63d8729)

  
**Attack Contract:**  
[0xAE7d68b140Ed075E382e0A01d6c67ac675AFa223](https://etherscan.io/address/0xae7d68b140ed075e382e0a01d6c67ac675afa223)

  
But wait, there's more! Our enterprising hacker didn't stop there.  
  
Peckshield, playing the role of DeFi's Sherlock Holmes, [uncovered another skeleton in Onyx's closet](https://x.com/peckshield/status/1839302663680438342).

  

_The attacker also exploited a flaw in the NFTLiquidation contract, which failed to properly validate user input._  
  
**This allowed them to inflate the self-liquidation reward amount, essentially giving them a blank check drawn on Onyx's account.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/onyx-exploit2.png)

**The end result? A smorgasbord of stolen assets [according to Peckshield](https://x.com/peckshield/status/1839302663680438342):**

  

4.1M VUSD

7.35M XCN

5K DAI

0.23 WBTC

50K USDT

  

_All in all, a $3.8M payday for our hacker, and another painful lesson for Onyx Protocol._  
  
**One they've already learned... and apparently forgotten.**  
  
Speaking of forgetting, in the Pokémon world, Onix evolves into Steelix, becoming stronger and more resilient.  
  
_But in DeFi, Onyx Protocol seems stuck in a permanent state of vulnerability, as if it used an Everstone on itself._  
  
**No matter how many times it gets hit by super-effective exploits, it never learns a new move.**  
  
It's less "Rock Throw" and more "Self-Destruct" at this point.  
  
[CertiK audited Onyx](https://skynet.certik.com/projects/onyx#skynet) back in January 2022, and since then? Radio silence. No updates, no follow-ups, nada. At least publicly.  
  
It's as if Onyx thinks smart contracts are like fine wine - leave them alone and they'll get better with age. Spoiler alert: they don't.  
  

**Meanwhile, Onyx decided to play Russian roulette with their protocol, adding a VUSD market via governance proposal.**  
  
Because who needs a fresh audit when you're introducing new markets, right?  
  

Apparently, Onyx's idea of spring cleaning is sweeping old vulnerabilities under the rug while rolling out the red carpet for new ones.  
  
**They didn't just skip a few steps; they took the express elevator to Rekt City, bypassing all the safety floors along the way.**  
  
_In a world where "move fast and break things" meets "copy-paste and pray," is DeFi innovation outpacing common sense, or is common sense just taking a very, very long lunch break?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_If this story gives you a sense of déjà vu, you're not alone._
  
**We've been here before, folks. In our previous coverage of Onyx's misadventures, we highlighted a crucial point: while Certik did their audit dance, the real vulnerability lurks in the market conditions, not just the codebase.**  
  

Remember the golden rule of Compound V2 forks? Empty markets are like catnip for hackers.  
  
Launching new markets should be handled with the care of a bomb disposal expert, not a "yolo and hope for the best" attitude.  
  

**After the Hundred Finance sequel hack, [Hexagate dropped some wisdom](https://www.comp.xyz/t/hundred-finance-exploit-and-compound-v2/4266):**  
  

_"Mint some cTokens, burn them, and make sure the total supply never hits zero. It's like DeFi's version of always leaving one cookie in the jar."_  
  

But did Onyx listen?  
  
Apparently, their memory is shorter than a goldfish's, and their learning curve flatter than a pancake.  
  

**In the grand theater of DeFi, Onyx has managed to turn "once bitten, twice shy" into "twice bitten, still clueless."**  
  
_As the curtain falls on this repeat performance, one can't help but wonder: in a space where code is law, who's writing the constitution? And more importantly, who's bothering to read it?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
