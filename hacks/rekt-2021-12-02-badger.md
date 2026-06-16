---
tags:
  - blockchain/bitcoin
  - blockchain/ethereum
  - sector/bridge
  - sector/gaming
  - sector/governance
  - sector/lending
  - sector/token
  - impact/loss-of-funds/direct-drain
title: "Badger - REKT"
protocol: "[[Badger]]"
date: 2021-12-02
loss_usd: 120000000
auditors:
source: "https://rekt.news/badger-rekt"
excerpt: "rekt roadkill. $120M taken in a front-end attack, placing Badger at number four on the leaderboard. rekt repeats; 'infinite approval means unlimited trust.'"
genome:
  - "[[direct-drain]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Badger - REKT

> **Loss:** $120,000,000 | **Date:** 2021-12-02 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/badger-header.png)

**rekt roadkill.**

_The badger is dead._

[$120 million](https://twitter.com/peckshield/status/1466356911842856967) taken in various forms of wBTC and ERC20.

**A front-end attack places Badger DAO at number four on the [leaderboard](https://rekt.news/leaderboard/).**

[rekt.news repeats:](https://rekt.news/furucombo-rekt/)

> _Infinite approval means unlimited trust - something which we know we shouldn’t do in DeFi._

**But should regular users be expected to spot an illegitimate contract via wallet approvals if the front-end is compromised?**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**An unknown party inserted additional approvals to send users' tokens to their own address. Starting from 00:00:23 UTC on 2.12.2021, the attacker used this stolen trust to fill their own wallet.**

As the news of users’ addresses being drained reached Badger, the team announced they had [paused](https://twitter.com/BadgerDAO/status/1466263899498377218) the project’s smart contracts, and the malicious transactions began to fail around 2 hours 20 mins after they had begun.

BadgerDAO’s aim is to bring Bitcoin to DeFi. The project is made up of various vaults for users to earn yield on wrapped BTC variants on Ethereum.

The vast majority of [stolen](https://twitter.com/peckshield/status/1466286523729383427) assets were vault deposit tokens which were then cashed out, with the underlying BTC bridged back to the Bitcoin network, and any ERC20 tokens remaining on Ethereum.

_The current locations of the stolen funds is summarised [here](https://twitter.com/peckshield/status/1466356911842856967)._

Rumours that the project’s Cloudflare account was compromised have been circulating, as have other [security](https://twitter.com/SlowMist_Team/status/1466359656981225475)  [vulnerabilities](https://twitter.com/SlowMist_Team/status/1466361705571618817).

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/badger-discord.png)

**The approvals presented themselves when users attempted to make legitimate deposit and reward claim transactions, building a base of unlimited wallet approvals that allowed the attacker to transfer BTC related tokens directly from the user’s address.**

The first instance of approvals for the hacker’s address was almost two weeks ago, according to [Peckshield](https://twitter.com/peckshield/status/1466317257085227012). Anyone interacting with the platform since then, may have inadvertently approved the attacker to drain funds.

**Over [500 addresses](https://bloxy.info/txs/references_address/0x1fcdb04d0c5364fbd92c73ca8af9baa72c269107?argument=spender&signature_id=5) have approved the Hacker’s address: [0x1fcdb04d0c5364fbd92c73ca8af9baa72c269107](https://etherscan.io/address/0x1fcdb04d0c5364fbd92c73ca8af9baa72c269107)**

**Check your approvals and revoke here: [etherscan.io/tokenapprovalchecker](https://etherscan.io/tokenapprovalchecker)**

**[Example transaction](https://etherscan.io/tx/0x951babdddbfbbba81bbbb7991a959d9815e80cc5d9418d10e692f41541029869): draining ~900 byvWBTC, worth over $50M.** The [victim](https://etherscan.io/address/0x53461e4fddcc1385f1256ae24ce3505be664f249) had [approved](https://etherscan.io/tx/0x5e4c7966b0eaddaf63f1c89fc1c4c84812905ea79c6bee9d2ada2d2e5afe1f34) the attacker’s address to spend unlimited funds via the _increaseAllowance()_ function around 6 hours earlier.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/12/badger-inputdata.png)

**Eventually, thanks to an “[_unusual_](https://mobile.twitter.com/flashfish0x/status/1466369783016869892)” feature in Badger’s _transferFrom()_ function, the team was able to pause all activity, halting the further loss of funds.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

If longstanding projects with such strong reputations as Badger can get rekt like this, and some of the biggest names in the game have their [near-misses](https://governance.aave.com/t/analysis-of-xsushis-incident/6335), DeFi users can’t afford to get too comfortable about the security of their biggest bags. Diversification is key to survival.

Despite all the stress that’s usually placed on checking the URL and making sure you’re interacting with proper channels, this wouldn’t have helped users in this case.

**The front-end was manipulated at least [12 days ago](https://twitter.com/peckshield/status/1466317257085227012).**

_How did Badger not notice?_

**A user [flagged](https://twitter.com/0xMoves/status/1466275399944445952) the suspicious _increaseAllowance()_ approval in Discord.**

_Why did Badger devs not look into it?_

For experienced users, these kinds of bogus approvals might be easy to spot, and checking the validity of any contract is easy enough by copy/pasting the address into Etherscan before signing the transaction.

But for DeFi to reach “mass adoption”, these extra precautions must be streamlined. 

_Until then, we can only practise good [wallet and approval hygiene](https://twitter.com/CryptoCatVC/status/1466380960648380419)._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
