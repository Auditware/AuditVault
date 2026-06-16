---
tags:
  - blockchain/bitcoin
  - blockchain/solana
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/perpetuals
  - sector/stable
  - vuln/oracle/spot-price
  - impact/loss-of-funds/direct-drain
  - novelty/known-pattern
title: "Mango Markets - REKT"
protocol: "[[Mango Markets]]"
date: 2022-10-11
loss_usd: 115000000
auditors:
source: "https://rekt.news/mango-markets-rekt"
excerpt: "Solana’s flagship margin trading protocol lost 9 figures to a well-funded market manipulator. The attacker managed to spike the price of Mango Markets’ native token MNGO and drain their lending pools,"
genome:
  - "[[spot-price]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[twap-collateral-valuation]]"
---
# Mango Markets - REKT

> **Loss:** $115,000,000 | **Date:** 2022-10-11 | **Audited by:** Out of Scope

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/mango-header.png)

To top off yesterday's [rumours](https://rekt.news/sushiswap-grey-area/), [exploits and SEC action](https://twitter.com/sandraaleow/status/1580046028706762752), Solana’s flagship margin trading protocol also got rekt, losing 9 figures to a well-funded market manipulator.

**The attacker managed to spike the price of [Mango Markets](https://mango.markets/)’ native token [MNGO](https://www.coingecko.com/en/coins/mango) and drain their lending pools, leaving the protocol with $115M of bad debt.**
  
The team's initial [announcement](https://twitter.com/mangomarkets/status/1579976051878658048) encouraged users not to deposit, and requested that the attacker get in touch about a bounty.

**Strangely, they were less keen to offer a bounty when the [issue was raised](https://twitter.com/Newdot_Games/status/1579982592686067712) via the project’s Discord back in March.**

In true DeFi style, the attacker has used their freshly acquired responsibility tokens to suggest a solution to the mess that they themselves created.

Their proposal suggests that Mango pay the hacker a bounty of ~$65M, and that they do not pursue any criminal investigation.

No prizes for guessing which way the hacker voted on the proposal…

_Welcome to the future of finance._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [Joshua Lim](https://twitter.com/joshua_j_lim/status/1579987648546246658)_  

**Attacker’s address: [yUJw9a2PyoqKkH47i4yEGf4WXomSHMiK7Lp29Xs2NqM](https://solana.fm/address/yUJw9a2PyoqKkH47i4yEGf4WXomSHMiK7Lp29Xs2NqM?cluster=mainnet-qn1)**  

**The attacker’s address was funded with over $5M ([2M](https://solana.fm/tx/sq2VX7WkNXVWhn9EHLrZWhyV6TKG31hMGrAAGjuG4EnNfSk27SwPTm4bBktvd4jP2w7hsfi4xpauyCAKjNovTCV?cluster=mainnet-qn1) and [3.5M](https://solana.fm/tx/4aPwYv5fKGKnQXiwjJii3cFsfvxqTbdaSWMXejNKD15s4y7p5A1k1PycWQetodTgPPgXHk7ji9vW5JCFB3PwBiYM?cluster=mainnet-qn1) USDC) from FTX, which were [deposited](https://solana.fm/tx/3cBEK257espSw2X6Z7ZZESPPdcsfBoNLYJGAmXEExxw1QpjkSJfcd9kmtER7LkZ3RGbeXKHv1FR4hRBCD5wA8unY?cluster=mainnet-qn1) in Mango Markets and used to take out a large MNGO-PERP position.**
  
By countertrading against the position from another account, the attacker succeeded in [spiking the spot price](https://twitter.com/joshua_j_lim/status/1579987648546246658) of MNGO massively from $0.03 to $0.91. While the MNGO price remained high, the attacker was able to drain the lending pools using the unrealised profit from the long position as collateral. 

The attacker’s [Mango Markets account](https://trade.mango.markets/account?pubkey=4ND8FVPjUGGjx9VuGFuJefDWpg3THb58c277hbVRnjNa) displays a $115M shortfall. The borrowed assets are listed below:

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/mango-loot.png)

The extreme price manipulation was made possible by the MNGO token’s low liquidity and volume. After some [mixed messaging](https://twitter.com/mangomarkets/status/1580053210785796096), Mango Markets [later clarified](https://twitter.com/mangomarkets/status/1580074498174652416) that the incident was not an oracle failure, but rather genuine price manipulation.

In the process of pumping the price, [over 4000 short liquidations](https://twitter.com/osec_io/status/1580019591329169410) were caused and as a result of the collapse of the protocol, the Solana network’s TVL is [down over 20%](https://defillama.com/chain/Solana).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

The attack drained all of Mango Markets’ available borrow liquidity, with $70M remaining in the treasury. This leaves a shortfall of approximately $50M to cover the bad debt left by the incident, which the hacker is proposing to return.
  
**The governance [vote](https://app.realms.today/dao/DPiH3H3c7t47BMxqTxLsuPQpEC6Kne8GA9VXbxpnZxFE/proposal/3WZ5DpZXDvNAK4JwPS1HDPzSinEJUGpBC4XXx9vPtnVS) on the hacker’s proposal is on-going and, of course, the attacker voted yes with all of their stolen 32M votes:**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/mango-proposal.png)

The hackers proposal would allow users to be made whole and the protocol to become functional again, essentially starting from scratch. And by the looks of Mango Markets’ [stated priorities](https://twitter.com/mangomarkets/status/1580053221254787072), it sounds like taking the offer would check all their boxes…

**But surely this behaviour can’t be rewarded with a “bounty” of ~$65M, the total of remaining USDC, BTC, USDT, and SRM?**
 
 How “binding” is a DAO vote? With no existing laws in regards to DeFi governance proposals, this story will set a precedent.

If the token governance vote system remains in use, then there will surely be more hostile takeovers, if not from hackers, then from competing organisations. These events already happen in traditional finance, but DeFi, or regulators, will have to prepare their own method to defend their governance systems from potential bad actors.

_If only Mango had paid out a bounty in March, and prevented the attack from happening in the first place…_
  
A [similar attack](https://quillhashteam.medium.com/200-m-venus-protocol-hack-analysis-b044af76a1ae) on Venus Protocol last year (not to be confused with the more [recent incident](https://rekt.news/venus-blizz-rekt/) related to the Luna fallout) led to a user [raising concerns](https://twitter.com/Newdot_Games/status/1579982592686067712) within the Mango community over six months ago.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/10/mango-discord.png)

_With so much advance notice, why wasn’t this attack averted?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
