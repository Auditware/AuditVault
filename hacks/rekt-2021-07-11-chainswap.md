---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/polygon
  - blockchain/solana
  - sector/bridge
  - sector/dex
  - sector/nft
  - sector/privacy
  - sector/stable
  - sector/token
title: "ChainSwap - REKT"
protocol: "[[Chainswap]]"
date: 2021-07-11
loss_usd: 4400000
auditors:
source: "https://rekt.news/chainswap-rekt"
excerpt: "As the demand for DeFi increases across chains, the bridges that join them turn into targets themselves. A chain is only as strong as its weakest link… Who will break next?"
genome:
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# ChainSwap - REKT

> **Loss:** $4,400,000 | **Date:** 2021-07-11 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/chainswap-header.png) 
**A new type of attack is growing in popularity.**

As the demand for DeFi increases across chains, the bridges that join them turn into targets themselves.

ChainSwap rekt, and not for the first time. This is the second incident this month in which the Alameda-backed “cross-chain hub for all smart chains” has lost users' funds. 

**[First](https://chain-swap.medium.com/chainswap-post-mortem-and-compensation-plan-90cad50898ab) $800,000, now $4.4 million.** 

_The ChainSwap team needs to increase security $ASAP._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/chainswap-investigates.png) 

**Attacker address:** [0xEda5066780dE29D00dfb54581A707ef6F52D8113](https://etherscan.io/address/0xEda5066780dE29D00dfb54581A707ef6F52D8113) 

On the Ethereum network, each token to be bridged has its own proxy Factory contract. The attacker was able to exploit the contract, minting tokens directly into different addresses, before reaccumulating them into the wallet from which the transactions were initially sent.

**1.** Call  _receive_ function to the Factory (minting) contract

**2.** Dodge the sloppy auth check system using a new address as signature each tx

**3.** Pay 0.005 ETH _chargeFee_

**4.** Set to parameter to the desired address, which receives the minted volume

**5.** Repeat x times

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/chainswap-code.png) 

Credit: [@cmichelio](https://twitter.com/cmichelio/status/1414035462164033541)

**Over on BSC, the exploit targeted a total of 20 tokens, according to ChainSwap’s [post-mortem.](https://chain-swap.medium.com/chainswap-exploit-11-july-2021-post-mortem-6e4e346e5a32)**

Taking the example of the NFT platform WilderWorld, [this](https://bscscan.com/tx/0x83b4adaf73ad34c5c53aa9b805579ed74bc1391c5297201e6457cde709dff723) is one of 40 repeated transactions, each of which minted 500,000 [$WILD](https://www.coingecko.com/en/coins/wilder-world) tokens each time.

These 20M WILD were then sold for ~650 WBNB, or just over $200,000 USD via PancakeSwap, effectively depleting the WILD/WBNB pool in the process.

**By the time the hacker was finished, their wallet had filled with a variety of tokens, with a total value of approximately $4.4M.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/chainswap-tokens.png) 

**The evidence is present in the attacker's Ethereum wallet taking the form of a long series of 0.005 ETH transactions, each evidence of freshly minted tokens via the Chainswap bridge.**

The last few transactions show the attacker cashing out some of the ETH that had been bridged from BSC, via 1inch - a series of 5 transactions totalling 456 ETH, or approximately $935,000 at the time of writing.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/chainswap-chain.png) 

**If the bridge isn’t the target, then it’s part of the escape route for this new style of cross chain attack.**

BSC, Solana, Polygon, are all seeing increased activity, and as the liquidity grows, the loopholes will show. This won’t be the last time we see this type of hack.

We didn’t cover the initial exploit. With so many to choose from, we need to set some standards. If it’s under a million dollars lost then there has to be something that piques our interest. 

_However, when we looked back at the first post-mortem, we found this email that we thought might interest you._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/chainswap-email.png) 

**A strange correspondence that the ChainSwap team claims to be from their attacker.**

Or did the “great people” at ChainSwap just send it to themselves? Everyone is free to speculate...

**[We are left wondering...]((https://twitter.com/_yowl/status/1414597597285728256?s=20) ) why would the hacker fund his wallet with money from Tornado and then change his bounty into a centralised stablecoin such as USDT?** 

_This leaves him vulnerable to having his funds frozen by Tether, and he hasn't tried to cover his tracks._

**Is this a ChainSwap insider trying to prove a point, or has the email sender with “fake KYC accounts” returned for more?**

**Why has this money still not been laundered?**

ChainSwap have arranged a full compensation plan for those affected by the attack, but the reputation of their platform can’t be refunded.

_A chain is only as strong as its weakest link… Who will break next?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png)
