---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/oracle
  - sector/privacy
  - sector/stable
  - sector/staking
  - sector/token
  - precondition/insider
title: "Ankr & Helio - REKT"
protocol: "[[Ankr Helio]]"
date: 2022-12-02
loss_usd: 24000000
auditors:
source: "https://rekt.news/ankr-helio-rekt"
excerpt: "18 quadrillion dollars. That’s the theoretical value of the 60 trillion aBNBc that was illegitimately minted from Ankr. Unfortunately, that’s more than the GDP of the entire world, and the aBNBc liqui"
genome:
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Ankr & Helio - REKT

> **Loss:** $24,000,000 | **Date:** 2022-12-02 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/11/ankrhelio-header.png)
**18 quadrillion dollars.**
  

That’s the theoretical value of the 60 trillion aBNBc that was illegitimately minted from Ankr earlier today.

  
Unfortunately, that’s more than the GDP of the entire world, and the aBNBc liquidity couldn’t stretch that far, so the hacker only got away with $5M.

  

Ankr’s official [announcement](https://twitter.com/ankr/status/1598503332477280256) pointed out that underlying staked assets are safe, and the thread goes on to promise users “a reissuance of aBNBc” via a snapshot.


_But the damage didn’t stop there…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)


_Credit: [BlockSec](https://twitter.com/BlockSecTeam/status/1598514978428157954), [Peckshield](https://twitter.com/peckshield/status/1598508401755144196)_

  

**[aBNBc](https://www.coingecko.com/en/coins/ankr-reward-bearing-stake-bnb) is a reward-bearing receipt token for BNB staked via the Ankr platform on BSC.**

  

The exploit was due to a private key compromise of the Ankr deployer address on BSC, potentially the result of a [phishing campaign](https://rekt.news/big-phish/).

  

The compromised deployer account [published](https://bscscan.com/tx/0xb2cb9e5311610c48aeed89e44549542362692808257f706accdc75f051ac7303) a malicious version of the aBNBc token contract, which was then [upgraded](https://bscscan.com/tx/0xcbc5ff4a6c9a66274f9bde424777c3dc862ab576e282fbea3c9c2609ca3e282b) to replace the existing implementation. The upgraded version included a new function (0x3b3a5522) which allowed the attacker to bypass caller verification and mint tokens freely, directly to their own address.

  

**Exploiters address: [0xf3a465c9fa6663ff50794c698f600faa4b05c777](https://bscscan.com/address/0xf3a465c9fa6663ff50794c698f600faa4b05c777)**

  

(Compromised) Ankr deployer address: [0x2ffc59d32a524611bb891cab759112a51f9e33c0](https://bscscan.com/address/0x2ffc59d32a524611bb891cab759112a51f9e33c0)

  

**Example attack tx (minting aBNBc to exploiter’s wallet): [0xe367d05e…](https://bscscan.com/tx/0xe367d05e7ff37eb6d0b7d763495f218740c979348d7a3b6d8e72d3b947c86e33)**

  

Funding exploiter wallet from compromised deployer: [0xeb617798…](https://bscscan.com/tx/0xeb617798207d1c9dc20afbe90e82a44a9ae4b53004ef47f82d3f70eabf69ba72)

  

Despite the large amount of tokens minted, a lack of on-chain liquidity limited the exploiter’s profits to just $5M after draining PancakeSwap’s aBNB pools. Most of the proceeds were bridged to [Ethereum](https://etherscan.io/address/0xf3a465C9fA6663fF50794C698F600Faa4b05c777), where the exploiter is in the process of laundering them through Tornado Cash.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 


**As the [word got out](https://twitter.com/1nf0s3cpt/status/1598514043421356032) about the publicly callable infinite mint, [copycats](https://twitter.com/PeckShieldAlert/status/1598506767637680129) joined in, many of whom can be seen amongst the [top holders](https://bscscan.com/token/0xe85afccdafbe7f2b096f268e31cce3da8da2990a#balances) of the now worthless aBNBc.**

  

Some did find a way to profit, however, with one account making 3x more than the initial exploiter, however the quick timing and recent funding of the address suggest that it could be the same actor.

  

By buying large amounts of depegged aBNB from PancakeSwap, [this address](https://bscscan.com/address/0x8d11f5b4d351396ce41813dce5a32962aa48e217) took the token to stablecoin project [Helio Money](https://helio.money/).

  

Before the oracle had updated to reflect the crashed price, the user borrowed 16M HAY against aBNBc [collateral](https://bscscan.com/tx/0x15dabf0c1bb63ec329361da5ce30a5c28a1ed1b107e3008c92614455f02032e4) for a [profit](https://twitter.com/BlockSecTeam/status/1598625878455373824) of $15.5M. Another [user](https://bscscan.com/address/0x9bae78d1c67826cde91b20b49690589ed0879fc7) profited through the same method, [earning](https://twitter.com/PeckShieldAlert/status/1598590419893641221) approximately $3.5M.

  

The attacks have caused [HAY](https://www.coingecko.com/en/coins/destablecoin-hay) to depeg ($0.62 at the time of writing), but the project has [assured](https://twitter.com/Helio_Money/status/1598587624947589123) its users that they will be compensated.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 


**Audits by both [Peckshield](https://assets.ankr.com/staking/smart_contract_security_audit_bnb_peckshield.pdf) and [Beosin](https://assets.ankr.com/earn/smart_contract_security_audit_bnb.pdf) called out the danger that the privileged accounts posed to Ankr’s smart contracts, and were marked as “Confirmed” and “Acknowledged”, respectively.**

  

_However, Ankr did not take steps to fix these issues._

  

Now they have paid the price, and Helios has caught even more collateral damage.

  

**CZ [tweeted](https://twitter.com/cz_binance/status/1598575867311132673) the following summary:**

  

>”Possible hacks on Ankr and Hay. Initial analysis is developer private key was hacked, and the hacker updated the smart contract to a more malicious one. Binance paused withdrawals a few hrs ago. Also froze about $3m that hackers move to our CEX.”

  

**Is CZ trying to become crypto’s new main character?**  
  
_Someone should remind him that role never ends well…_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
