---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - sector/dex
  - sector/lending
  - sector/stable
  - has/audit
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Hedgey Finance - Rekt"
protocol: "[[Hedgey Finance]]"
date: 2024-04-19
loss_usd: 44700000
auditors:
  - "[[Consensys Diligence]]"
source: "https://rekt.news/hedgey-finance-rekt"
excerpt: "Not a good strategy to hedge your bets. Hedgey Finance rocked by $44.7 million flash loan attack across both the Arbitrum and Ethereum platforms."
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[access-roles]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[frontrun-exposure]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Hedgey Finance - Rekt

> **Loss:** $44,700,000 | **Date:** 2024-04-19 | **Audited by:** Consensys Diligence

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/hedgey-finance-header.png)





_Not a good strategy to hedge your bets._

  

**Hedgey Finance rocked by $44.7 million flash loan attack across both the Arbitrum and Ethereum platforms.**

  

The exploit was [first reported by Cyvers](https://x.com/CyversAlerts/status/1781221966369714227) and [confirmed by the Hedgey team](https://twitter.com/hedgeyfinance/status/1781257581488418862) just a little over a couple of hours later.  
  
_Hedgey informed the community that they were investigating an attack on the Hedgey Token Claim Contract. Urging users who have created active claims, to please cancel them using the "[End Token Claim](https://app.hedgey.finance/token-claims)" button to mitigate further losses._ 
  
Touted by [Hedgey](https://hedgey.finance/) as “The #1 token vesting and lockup tools.” The platform provides token infrastructure for onchain teams.  
  
It appears the lockup tools were not secure enough, as the thieves drained just over $2.1m worth of assets from the Ethereum contract, consisting of [USDC](https://www.coingecko.com/en/coins/usdc), [NOBL](https://www.geckoterminal.com/eth/pools/0xc98936de9640d6bfc24f82de1cf0f8cd9f5b388d?utm_source=coingecko&utm_medium=referral&utm_campaign=searchresults), and [MASA](https://www.coingecko.com/en/coins/masa) tokens.  
  
On the Arbitrum chain, the attacker was able to steal roughly $42.6m worth of [BONUS](https://www.coingecko.com/en/coins/bonusblock) tokens.  
  
**NobleBlocks(NOBL) gave a [detailed security report](https://twitter.com/nobleblocks/status/1781358386690617404) to their community. Bonus Block(BONUS) briefly posted “Our vestings are safe" and MASA seemed more concerned with [hosting Twitter Spaces](https://twitter.com/getmasafi/status/1781336559771582728) than informing their community about the exploit.**  
  
_As the dust settles, the big question remains, how did Hedgey's vaunted security fail so catastrophically?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [Cyvers](https://x.com/CyversAlerts/status/1781221966369714227), [Hedgey Finance](https://twitter.com/hedgeyfinance/status/1781257581488418862), [NobleBlocks](https://twitter.com/nobleblocks/status/1781358386690617404), [Blocksec](https://app.blocksec.com/explorer/security-incidents?hash=0x03c73a343b5a481c9431af2f4a2146a0e77522a23e5cca9b2ea024778589967f&key=159)_

  

**On April 19, Hedgey Finance was exploited across a series of transactions, which resulted in a loss of $2.1 million on the Ethereum Mainnet and $42.6 million worth of assets on the Arbitrum network, totaling approximately $44.7 million.**

  

The root cause of the exploit is the lack of input validation on users' parameters, which allowed the attacker to manipulate and gain unauthorized token approvals.

  

The attacker took a flash loan of $1.3 million USDC from Balancer to abuse and manipulate the `claimLockup` parameter within the `createLockedCampaign` function of the exploited contract to trick this vulnerable contract into approving USDC token transfer to the attack contract.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/hedgey-flashloan.png)

In the second step, the attacker used the approval to transfer USDC to themselves.

Executing in two separate transactions, likely to prevent being front-run by bots.

  

After checking the commit records of the vulnerable contract, the root cause was confirmed to be Unverified User Input; there was less verification of the parameters passed by users, resulting in tokens being approved to the attacker's contract.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/hedgey-exploit.png)

Exploiter’s address on Ethereum:
[https://etherscan.io/address/0xded2b1a426e1b7d415a40bcad44e98f47181dda2](https://etherscan.io/address/0xded2b1a426e1b7d415a40bcad44e98f47181dda2)

  

Attack Contract on Ethereum:
[https://etherscan.io/address/0xc793113f1548b97e37c409f39244ee44241bf2b3](https://etherscan.io/address/0xc793113f1548b97e37c409f39244ee44241bf2b3)

  

Exploited Contract on Ethereum:
[https://etherscan.io/address/0xbc452fdc8f851d7c5b72e1fe74dfb63bb793d511](https://etherscan.io/address/0xbc452fdc8f851d7c5b72e1fe74dfb63bb793d511)

  

Exploiter’s address on Arbitrum:  
[https://arbiscan.io/txs?a=0xc7241e27ee4b8d32b59a10e848b48530047a8c5b](https://arbiscan.io/txs?a=0xc7241e27ee4b8d32b59a10e848b48530047a8c5b)

  

Attack Contract on Arbitrum:  
[https://arbiscan.io/txs?a=0xbb52f1723ddf2c84ba2668f4e04712f572cbf780](https://arbiscan.io/txs?a=0xbb52f1723ddf2c84ba2668f4e04712f572cbf780)

  

Exploited Contract on Arbitrum:
[https://arbiscan.io/address/0xbc452fdc8f851d7c5b72e1fe74dfb63bb793d511](https://arbiscan.io/address/0xbc452fdc8f851d7c5b72e1fe74dfb63bb793d511)

  
Funds are currently [being held here](https://debank.com/profile/0xC7241E27Ee4B8D32b59a10E848B48530047a8c5b).

  

_Hedgey [sent an onchain message](https://etherscan.io/idm?addresses=0x5a4bc2bda1f6b9929b6efdcef4728246bec4c635,0xd84f48b7d1aafa7bd5905c95c5d1ffb2625ada46&type=1) to the attacker looking to get in touch and discuss next steps. They’re assuming it is a white hat and even told them “well done” for finding the exploit._  
  
**Thanks for robbing us, you’re one of the good guys, right?**

  

Consensys Diligence audited Hedgey’s Token Lockup and Vesting Plans in June and July of 2023.  
  
**Whether it was a white hat or a black hat, doesn’t matter, someone still made away with $44.7 million.**

  
_Isn’t calling theft "well done" an insult to every user whose funds were compromised?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_While Hedgey praises the attacker's skills and holds out hope they are a white hat actor, the nearly $45 million reality check exposes alarming gaps in their security practices._

  

Hedgey Finance faces an uphill battle to rebuild trust, beginning with a comprehensive security overhaul.

  

**It may be a good idea to execute a complete security revamp, fortifying input validation, reinforcing access controls, and enduring stringent audits to prevent history from repeating itself.**

  

With millions of dollars lost and trust shaken, the path to recovery will be a long and challenging one.

  

_By scrutinizing its security practices and learning from these costly mistakes, Hedgey can begin the arduous journey towards rebuilding its reputation and restoring faith within the decentralized finance community._

  

The decentralized finance landscape is a breeding ground for innovation but also presents a constant reminder that the stakes are high, and the consequences of negligence can be dire.

  

**For Hedgey, this exploit serves as a cautionary tale and a reminder that security must always be the top priority.**

  

_The question remains: can Hedgey redeem itself and regain the trust of its users or will this event forever taint its standing in the world of DeFi?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
