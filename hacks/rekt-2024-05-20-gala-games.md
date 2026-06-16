---
tags:
  - blockchain/ethereum
  - blockchain/optimism
  - has/audit
  - sector/dex
  - sector/gaming
  - sector/multisig
  - sector/token
title: "Gala Games - Rekt"
protocol: "[[Gala Games]]"
date: 2024-05-20
loss_usd: 216000000
auditors:
  - "[[Anchain]]"
  - "[[Certik]]"
source: "https://rekt.news/gala-games-rekt"
excerpt: "Possible hacker seized control of an admin address to mint a whopping 5 billion GALA tokens worth $216 million, rapidly offloading 592 million tokens for $21.8 million in ETH before Gala Games could b"
genome:
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[upgrade-safety]]"
---
# Gala Games - Rekt

> **Loss:** $216,000,000 | **Date:** 2024-05-20 | **Audited by:** Anchain, Certik

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/gala-header.png)













_Possible hacker seized control of an admin address to mint a whopping 5 billion GALA tokens worth $216 million, rapidly offloading 592 million tokens for $21.8 million in ETH before Gala Games could blacklist the rogue address._  
  

**Devops199fan noticed that someone minted 5 billion GALA tokens and had been dumping them in batches of 100 ETH on [0xProject](https://0x.org/).**  
  
[Gala Games reported the exploit](https://x.com/GoGalaGames/status/1792727587460104377) as an isolated incident a few hours later, stating that they are working closely with law enforcement to investigate the individuals behind the breach.

  
_After catching the exploit, the Gala team used a [blocklist function](https://x.com/TheVultureTrade/status/1792674885615169706) to block the hacker to further mitigate the damage._  
  
**A year earlier, Gala Games had given itself the ability in the [V2 contract](https://blog.gala.games/upcoming-gala-v2-contract-upgrade-aa408d9cad) to blocklist wallets, looks like it came in handy.**  
  
Benefactor from Gala [noted that the ETH contract for GALA](https://x.com/Benefactor0101/status/1792698768166715776) is secure and under the protection of a multi-sig wallet and was never compromised.  
  
Going on to state “we believe we have identified the culprit and we are currently working with the FBI, DOJ and a network of international authorities.”  
  
**Off all the days to fall into a FUD trap. Just before the incident, Bloomberg Intelligence analyst Eirc Balchunas [raised his odds](https://x.com/EricBalchunas/status/1792636523050906102) of the Securities and Exchange Commission greenlighting the products to 75% from 25% and the [market went on a moon mission](https://www.dlnews.com/articles/defi/ethereum-etf-optimism-sends-defi-metrics-soaring/).**

  
_Bucking the uptrend seen in other tokens following news of a possible Ethereum ETF approval, GALA's initial plunge of around 20% stood in stark contrast to the broader market rally._  
  
As investors grappled with the implications of the exploit, fears surrounding the security breach led to a sell-off that saw GALA's price fall

  

Although the token managed to recover some ground in the ensuing hours, the damage had already been done, with GALA ultimately failing to capitalize on the positive momentum sweeping the rest of the crypto market.

  

**The day after the exploit, the [funds were sent back](https://etherscan.io/tx/0x273c6b54fea8b0d616fb3270698dd4387ec3fefc7b0e290330b4019c35a984b1) by the exploiter.** 
  
_Yet the multi-million dollar question remained, who was behind this brazen attack on Gala?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)








_Credit: [The Vulture Trade](https://x.com/TheVultureTrade/status/1792674885615169706), [Gala Games](https://x.com/GoGalaGames/status/1792727587460104377), [Hacken](https://x.com/hackenclub/status/1792937934326247714), [Benefactor](https://x.com/Benefactor0101/status/1792698768166715776), [The Block](https://www.theblock.co/post/248897/gala-games-ceo-sues-co-founder-alleging-130-million-theft-pattern-of-deception), [Crypto Times](https://www.cryptotimes.io/2022/11/04/gala-games-debunks-hacking-rumors-gala-token-crashes/), [Tay](https://x.com/tayvano_/status/1792698359972856310)_

  
**At the core of what could have been a $216 million crypto heist was a critical access control failure.**  
  
_The hacker's path to pillaging Gala Games was paved by allegedly obtaining unauthorized access to an all-powerful admin account on the GALA token contract._

  
According to the [attack breakdown by Hacken](https://x.com/hackenclub/status/1792937934326247714), the exploit involved an “Access Control” attack vector, where a malicious actor gained control over a dormant MINTER account on the GALA token contract that had not been used for 180 days.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/gala-mint.png)

The attacker minted 5 billion $GALA tokens to a new address dubbed “Gala Game Exploiter”

  

**Attack transaction:**
[0xa6d90abe17d17743a9cecab84bcefb0fd0bbfa0c61bba60fd2f680b0a2f077fe](https://etherscan.io/tx/0xa6d90abe17d17743a9cecab84bcefb0fd0bbfa0c61bba60fd2f680b0a2f077fe)

  

Followed by the minting, the compromised account [sent 2 ETH](https://etherscan.io/tx/0x4ea095c84ea9f8e67f30b8281c08515bd596b0dfdf901134bcad00f2612bdaa6) to Gala Exploiter to possibly cover gas fees for further transactions.

  

The exploiter started exchanging the freshly minted GALA for ETH, executing transactions up to 100 ETH.  
  
**GALA for ETH swaps:**  
[0xe2ca471124b124831e231fb835778840ad100f97](https://etherscan.io/txsInternal?a=0xe2ca471124b124831e231fb835778840ad100f97)

  

2 hours and 16 minutes later, Gala admins intervened by blocking the exploiter’s account, halting further transactions.  
  
**Blocked Account:**
[0x15129c219a94e24d40541e622757973c0664338f117ff6c4b68d845854b167b9](https://etherscan.io/tx/0x15129c219a94e24d40541e622757973c0664338f117ff6c4b68d845854b167b9)

  

The exploiter transferred all the stolen ETH back to the Minter account.  
  
**Minter Account:**
[0x273c6b54fea8b0d616fb3270698dd4387ec3fefc7b0e290330b4019c35a984b1](https://etherscan.io/tx/0x273c6b54fea8b0d616fb3270698dd4387ec3fefc7b0e290330b4019c35a984b1)

  

After that, all the ETH was transferred from the MINTER account to a new externally owned account, possibly by the Gala team to secure the funds.  
  
**Externally Controlled Account:**  
[0x16a96053f8e6382a32caa1a4461bf8c500d788019685b803ad3a3194fa5dd290](https://etherscan.io/tx/0x16a96053f8e6382a32caa1a4461bf8c500d788019685b803ad3a3194fa5dd290)

  

3 days before the exploit, Jason Brink aka Bitbender, [announced he was shifting his role](https://x.com/BitBenderBrink/status/1791491366297784451) at Gala from being President of Blockchain to being an unpaid advisor.  
  
He also mentioned that a number of people will also be resigning from their positions at Gala to form an external organization, LFG (Let’s Fight Giants).  
  
**The timing is suspicious, especially given some of the shady past of Gala Games.**

  

_In early 2021, Gala Games lost $130 million after around 8.65 billion GALA tokens were stolen. Eric Schiermeyer, one of the firm's co-founders, sued Wright Thurston, the other co-founder, for [allegedly participating in the hack](https://cointelegraph.com/news/gala-games-founders-sue-court-token-theft-corporate-waste)._  
  
Thurston then [issued his own lawsuit against Schiermeyer](https://drive.google.com/file/d/1qpsaRIPB80aQqtf72aHUbKBinbvzWt6s/view) claiming that he used company funds for personal use, The Block previously [reported](https://www.theblock.co/post/248897/gala-games-ceo-sues-co-founder-alleging-130-million-theft-pattern-of-deception).

  

The United States Securities and Exchange Commission also [sued](https://www.sec.gov/litigation/litreleases/lr-25659) Thurston and another of these companies in March 2023 for allegedly selling $18 million worth of unregistered securities in the form of GREEN, a cryptocurrency related to a public global decentralized power grid.

  

**In [November of 2022](https://x.com/GoGalaGames/status/1588418604315574272) Gala Games urged its community for calm after misplaced fears of a multibillion-dollar rug pull or hack caused the GALA token to temporarily crash 25.6%.**

  

The initial panic, which Gala Games [tried to debunk hacking rumors](https://www.cryptotimes.io/2022/11/04/gala-games-debunks-hacking-rumors-gala-token-crashes/), after a single wallet address [appeared to mint](https://bscscan.com/tx/0x482af8b420cd7e0bdf4f3306c68b7c01e01412ec6ffd338a5bf7e7933e5b5fab) over $2 billion in GALA tokens out of thin air.  
  
Something sounds oddly familiar with the previous minting incident.  
  
**With a track record of unexplained billion-dollar mints and $130 million insider heists, this latest $216 million incident reeks of potential internal sabotage.**  
  
_Is Gala the one playing games here?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






_The shadow cast by the [previous incidents](https://x.com/tayvano_/status/1792698359972856310) at Gala Games, including insider heists and legal troubles, contributes to the aura of suspicion that now surrounds the company._
  
**The departure of key figures just days before the latest exploit and the history of unexplained token mints do little to allay fears.** 
  
In a space where trust is paramount, Gala Games finds itself at a critical juncture, where the next steps it takes could either restore confidence or further erode its standing within the community.  
  
_DWF Labs [announced the day after the incident](https://x.com/DWFLabs/status/1792928187917177030), that they have purchased 28 million $GALA tokens ($1.2M) to stabilize the token's value and express support for Gala._  
  
**So maybe business will carry on as usual and any suspicions just may get swept under the rug, again.**  
  
Time in the crypto space feels as if it moves faster than the speed of light at times, attention spans are short and memories even shorter.

  

The market's resilience, often bouncing back from scandals and breaches, is a testament to the robust enthusiasm for the blockchain space.

  

**Will Gala emerge stronger and more secure, or will it become a cautionary tale?**  
  
_Only time will tell if these red flags are truly just coincidences or harbingers of deeper issues within._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
