---
tags:
  - blockchain/arbitrum
  - blockchain/avalanche
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/stable
  - impact/loss-of-funds/direct-drain
  - impact/privilege-escalation/ownership-transfer
title: "Steadefi - REKT"
protocol: "[[Steadefi]]"
date: 2023-08-07
loss_usd: 1140000
auditors:
source: "https://rekt.news/steadefi-rekt"
excerpt: "Steady lads. Steadefi lost $1.14M to a compromised deployer address on Monday. The attacker drained lending contracts after transferring their ownership. Phishing or an inside job?"
genome:
  - "[[direct-drain]]"
  - "[[ownership-transfer]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Steadefi - REKT

> **Loss:** $1,140,000 | **Date:** 2023-08-07 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/steadefi-header.png)

_Steady lads._

**Steadefi lost $1.14M to a compromised deployer address on Monday.**

_Phishing or an inside job?_

**The yield farm on Arbitrum and Avalanche [announced](https://twitter.com/steadefi/status/1688619454178144264) the exploit:**

>NOTICE: Steadefi has been exploited and all funds are currently at risk.

The warning came with an on-chain bounty [plea](https://etherscan.io/tx/0xdfc31c31e07f9007a15680e9c98a4d523cc440d4349515cebf22196086c889d4) to the attacker (though a second [message](https://etherscan.io/tx/0x239fbabbcb8eba217b639ecea34b416bf08098b8031b2439f1fe013bde41e83d) followed, due to a typo in the email provided for negotiation…).

Taking inspiration from the [bounty offered](https://etherscan.io/tx/0xc45e47f6e7d3e74763032e2fb991fa9a003d8ed55c13c93c6a5368ff322d7742) following the recent [hack of Curve pools](https://rekt.news/curve-vyper-rekt/), the exploiter has a deadline to return 90% of the funds, keeping the rest as a bounty.

**After the deadline, the 10% bounty will be offered to the public as a reward for information leading to a conviction.**

**Could this a new industry standard for bounty payments?**

_And will it work?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

Credit: _[Steadefi](https://twitter.com/steadefi/status/1688638572608552960)_

According to Steadefi’s own [announcement](https://twitter.com/steadefi/status/1688638572608552960), the deployer address of the protocol was compromised.

As the deployer was the owner of all of the platform’s vault contracts, the attacker was able to transfer ownership (for example, the USDC vault on Abritrum [in this tx](https://arbiscan.io/tx/0x1e94a17f392c77fd897b4bfb66a1364b5508de6b2a36f3b0227a4a9ca4a657f0)) to their own address. From there, the exploiter:

>went on to take various owner-only actions such as allowing any wallet to be able to borrow any available funds from the lending vaults.

The attack drained all funds available for borrowing on both Arbitrum and Avalanche, with the only funds protected being deposits in the ‘Depositor vaults’. Steadefi’s [TVL](https://defillama.com/protocol/steadefi) fell from over $2M to just $550k.

At least some of the remaining TVL appears to have been locked in contracts by the exploiter:

>However, the exploiter has also paused the farms contract, which means that if you (and the majority of everyone is) has your svTokens or ibTokens deposited in the farms, you will not be able to withdraw them as well. However, the exploiter is also unable to withdraw them.

The funds were swapped to ~625 ETH and bridged to Ethereum before being forwarded onto [another address](https://etherscan.io/address/0xe10d4a5bd440775226c7e1858f573e379d0aca36), where they remain.

Attacker’s address ([ETH](https://etherscan.io/address/0x9cf71F2ff126B9743319B60d2D873F0E508810dc), [ARB](https://arbiscan.io/address/0x9cf71F2ff126B9743319B60d2D873F0E508810dc), [AVAX](https://snowtrace.io/address/0x9cf71F2ff126B9743319B60d2D873F0E508810dc)): **0x9cf71F2ff126B9743319B60d2D873F0E508810dc**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**With many projects having [funds returned](https://twitter.com/PeckShieldAlert/status/1688404426825117697) recently, Steadefi may be hoping for a happy ending.**

However, given that this incident was due to an account compromise and not a potential whitehat poking about for bugs in a smart contract, we won’t be holding our breath.

_Especially if certain state-sponsored [phisherman](https://rekt.news/big-phish/) are involved…_

But who knows, between Arkham’s opening of a [public doxx-market](https://rekt.news/arkham-asylum/) and Curve’s [bounty hunter reward](https://twitter.com/CurveFinance/status/1687180381714358272), we may be seeing the emergence of a new post-hack strategy.

In the case of Curve, one bounty hunter (or on-chain bluffer) has [already opted](https://etherscan.io/tx/0xf600ef0425ba2a57837b4b6b277db5bbafaba5625ce2010e1a00c611b4a2b1df) to go straight to the source rather than take the 10%:

>Hacker. I have your IP address. I give you until 08/10/23 8:00 AM UTC to return: 7,000,000 CRV and 7,000 WETH to this address: 0xC6a194f5F08352C6aD0B9Dcff1C7A5Ef9f8A7802. After this time I will reveal your IP address. This is your last chance to make the right choice.

**Blackmailing a blackhat.**

_Is there really no honour among thieves?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
