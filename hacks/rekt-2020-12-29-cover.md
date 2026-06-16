---
tags:
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/multisig
  - sector/stable
  - sector/token
  - has/audit
  - blast-radius/cross-protocol
title: "Cover - REKT"
protocol: "[[Cover]]"
date: 2020-12-29
loss_usd: 9400000
auditors:
  - "[[Arcadia Group]]"
source: "https://rekt.news/cover-rekt"
excerpt: "Next time, take care of your own shit. Infinite mint but it’s no Willy Wonka - this is a Hollywood classic insurance themed noir. The black and white outcomes of insurance policies lend themselves wel"
genome:
  - "[[cross-protocol]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
---
# Cover - REKT

> **Loss:** $9,400,000 | **Date:** 2020-12-29 | **Audited by:** Arcadia Group

![](https://lh4.googleusercontent.com/IgAdM7JctrErxRd1kLmyJz4CEUbBDH1xZdsE4h7YZ_6NTRmWbF3p7rNREX-4BcKiTRH9FygNeZXSOzLCe2PqmVZ2NrWz5fb6ZKpPREHc4x3zsCoF8RcQvhj9Sx5XlBDiM04p1Xnh)
**Next time, take care of your own shit.**

Infinite mint but it’s no Willy Wonka - this is a Hollywood classic insurance themed noir.

The black and white outcomes of insurance policies lend themselves well to Hollywood storylines.

**In [Double Indemnity](https://www.youtube.com/watch?v=yKrrAa2o9Eg) (1944), insurance is the motivating force for both good and evil.**

The film takes its name from a life insurance clause that offers double payouts if the death of the policyholder is accidental.

This results in a twisting plot as an insurance salesman is roped into a murderous scheme by his lover, who wants him to murder her husband and frame it as an accident in order to profit from the payout.

**Never take anything at face value.** DeFi plot lines are rarely straightforward. Anonymity and composability are the perfect breeding ground for conspiracy; there are multiple ways one can profit from a single incident, meaning smart players don’t always take the most obvious reward.

**$9.4m taken, $3.2m recovered and $6.2m lost.**

**COVER (formerly known as SAFE) fell ~[90%](https://www.coingecko.com/en/coins/cover-protocol) when an infinite mint loophole was uncovered and exploited,** causing the total supply of tokens to increase by 48 quadrillion percent, from 84,477 to 40,796,131,214,802,600,000.

Six different addresses minted COVER via this loophole before it was closed. **Some kept the money, others did not.**

Of the six addresses to use the loophole, the previously [unknown](https://medium.com/@grap.finance)[Grap Finance](https://etherscan.io/token/0xC8D2AB2a6FdEbC25432E54941cb85b55b9f152dB) gained the most attention, as they took the opportunity to present themselves as a “White hat” by selling minted COVER for ETH and returning it with a sassy message.

**Code is law, but loopholes remain** - we can rely on attackers to take advantage, but we know things are rarely as simple as they seem.

Who had cover on their $COVER? We went undercover to find out.
![](https://lh3.googleusercontent.com/StXzSYZ9O3fWgBSfhG1AUgJwfNlHvh20UIr03MSxmDW94rKhJfr9VJnyjxUyRAhgxAmGY7yeVnqokpMW3rk6ZzpZOB0bQuDCTxMzRAlParXEr6lNlN_WkI_xHSo6hxk5ul1n9D5y)

**Rekt OPSEC**

The original attack had [four steps](https://twitter.com/vasa_develop/status/1343571127331737600?s=20) and one attacker, but the story became more complicated once the loophole was made [public](https://twitter.com/Luciano_vPEPO/status/1343509612583145472?s=20), and other wallets replicated the process.

The following timelines are taken from the official [Cover Post-Mortem](https://coverprotocol.medium.com/12-28-post-mortem-34c5f9f718d4), for a more detailed analysis, please see the [step by step](https://www.notion.so/Cover-Infinite-Mint-Exploit-0a234cc279484982ae559bb5ab54532a#6359c6970a1b414499b76241a7e7b967) from [@vasa_dev](https://twitter.com/vasa_develop).

**Timeline for Exploiter 1**

Dec-28–2020 04:09:27 AM +UTC

- **A new [Balancer pool](https://etherscan.io/address/0x59686e01aa841f622a43688153062c2f24f8fded) was added to the Blacksmith contract** from the team’s multisig via [a transaction](https://etherscan.io/tx/0xe5173fffaed3342b53d41319dc538e7923e287e962df2d27f5e425c633db45d4) for the new coverage expirations.

Dec-28–2020 08:08:12 AM +UTC

- **An attacker [executes ](https://etherscan.io/tx/0xd721b0ef2886f14b75548b70d2d1fd82bea085ca24f5de29b833a64cfd8f7a50)the first deposit to the contract**, depositing 1,326,880 BPT tokens

Dec-28–2020 at 08:11:16 AM +UTC

- **The same attacker then [called ](https://etherscan.io/tx/0xadf27f5dd052482d46fdf69a5208a27cc7352522c7c19bbde5aee18f6ea4373b)withdraw(),** exploiting the contract for ~703.64 $COVER and withdrawing 1,326,878.99 BPT

Dec-28–2020 08:47:15 AM +UTC

- **The first sell of the exploited $COVER tokens can be found [here](https://etherscan.io/tx/0x66128a1685605b1798c852e14db0b0232a56e3bebf7f3f35b168642801754beb).** During this time there were multiple accounts abusing the exploit, and selling their $COVER on market.

Dec-28–2020 09:18:28 AM +UTC

- **The attacker [continues minting](https://etherscan.io/tx/0xf81fb72ee096e0d7afe4b99a55b723110604fb26ec82846043cfc396e1fa79da)** while the attack vector is still present.

**In total, Exploiter 1 stole around $4.4 million of user funds and transferred it to this [address](https://etherscan.io/address/0x85abf036ca922e56fed670f4d3ce53fc4ea52b95#tokentxns).**

It seems the loophole was discovered accidentally at first, as exploiter 1 had poor OPSEC, a normal wallet funded by an exchange with KYC, trading for 3 years. Some claim to know the identity of this exploiter, and [suggest](https://twitter.com/0xRevert/status/1343743516544028672?s=20) that they return the funds.
---

**In a classic DeFi plot twist, the original attacker attracted little attention compared to Grap Finance, who seized the opportunity to play the role of “White Hat”.**

**Timeline for Grap Finance**

Dec-28–2020 11:54:47 AM +UTC

- **[Grap Finance: Deployer](https://etherscan.io/address/0x00007569643bc1709561ec2e86f385df3759e5dd) (Externally owned account) [deposited](https://etherscan.io/tx/0x77490baee41a9b35a6e87d49453c7329c7517c10ce6ce26b4c142692a2877e65) 15,255.552810089260015362 BPT (DAI/Basis pool)** into the Blacksmith farming contract.

Dec-28–2020 11:58:04 AM +UTC

- **[Grap Finance: Deployer](https://etherscan.io/address/0x00007569643bc1709561ec2e86f385df3759e5dd) [withdraws](https://etherscan.io/tx/0x88ce99fc1cb695db82d83ce5fe587396744841d3a123687f95b18df6a3106818) their 15,255.552810089260015361 BPT**(DAI/Basis pool), leaving just 1 wei in their balance in the Blacksmith farming contract.

Dec-28–2020 11:58:56 AM +UTC

- **[Another user](https://etherscan.io/address/0xdf1aefb979d180b4d67cca9abb4c5108c89dc8a4) [withdraws](https://etherscan.io/tx/0xa27fb73caddb1cf24aa7a5afe84eed13db2f0a889a6ee0f3d5e6226a76c0fd9c) most of his full balance** (1,007.599009946121991627 BPT) from the Blacksmith. Now Grap Finance alone has all liquidity for the DAI/Basis pool on the shield mining Blacksmith contract, exactly 1 wei.

Dec-28–2020 12:00:21 PM +UTC

- **[Grap Finance: Deployer](https://etherscan.io/address/0x00007569643bc1709561ec2e86f385df3759e5dd) [deposited](https://etherscan.io/tx/0xbd1fcda7006ddd58b18cb3bfbd01ef2d1a979be596e1c73be1d7d65fd7eb8215) back 15,255.552810089260015361 BPT** (DAI/Basis pool) on the Blacksmith farming contract..

Dec-28–2020 12:02:04 PM +UTC

- **[Grap Finance: Deployer](https://etherscan.io/address/0x00007569643bc1709561ec2e86f385df3759e5dd) [claimed](https://etherscan.io/tx/0xca135d1c4268d6354a019b66946d4fbe4de6f7ddf0ff56389a5cc2ba695b035f) the rewards**, and because of only 1 wei of balance combined with the storage/memory issue this led to the minting of 40,796,131,214,802,500,000.212114436030863813 $COVER.

Dec-28–2020 12:29:03 PM +UTC

- **[Grap Finance: Deployer](https://etherscan.io/address/0x00007569643bc1709561ec2e86f385df3759e5dd) starts to [sell](https://etherscan.io/tx/0xaf94d9b537a13819e873b37160594af2b1cc70b420d0b160a02e341566866a6b) as [many](https://etherscan.io/tx/0x01b3517845ed9c6b7b40d57bd71ac1a89fec080c5b8988f764d8226ac5caa959) tokens as possible** through 1inch.exchange in multiple transactions.

Dec-28–2020 12:59:27 PM +UTC

- **[Grap Finance: Deployer](https://etherscan.io/address/0x00007569643bc1709561ec2e86f385df3759e5dd) [burns](https://etherscan.io/tx/0xe6c068ca3605228b2435a414f2b372057340f77d3fe9f1d3967eb1ad128cb5d2) minted tokens**

Dec-28–2020 at 01:41:01 PM +UTC

- **[Grap Finance: Deployer](https://etherscan.io/address/0x00007569643bc1709561ec2e86f385df3759e5dd) sends the 4351 ([1](https://etherscan.io/tx/0x23cb9bdf14eed955a84da3f3cfcf296356c0f897dec0b99e85151a7f084a3051) + [4350](https://etherscan.io/tx/0xc2fd5094c1e108f83222a86bd46b35fc0da35616385d681964b22003643f982e)) ETH they have extracted by selling $COVER to the deployer account**, which accounts for 34% of the total exploit damage ($9.4 million)

---

**Coverage from Cover**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/12/image-4.png)

**It took six hours for Cover Protocol to publicly acknowledge the attack.**

> _The team is still investigating the current incident. The exploit is no longer possible._
>
> _Please do NOT buy [$COVER](https://twitter.com/search?q=%24COVER&src=cashtag_click) tokens, and remove your liquidity from the COVER/ETH pool on sushiswap._
>
>_CLAIM/NOCLAIM balancer pools are unaffected_

**Eight hours after the attack, Cover protocol [announced](https://twitter.com/CoverProtocol/status/1343581331448586245?s=20) their plan to refund affected users.**

> _Hello everyone, we are exploring providing a NEW [$COVER](https://twitter.com/search?q=%24COVER&src=cashtag_click) token through a snapshot before the minting exploit was abused. The 4350 ETH that has been returned by the attacker will also be handled through a snapshot to the LP token holders.We are still investigating. Do NOT buy COVER_

**“What is dead may never die” appears never more true than in DeFi**. A fourth iteration of the Cover Protocol token will be issued to refund the affected users.

SAFE - SAFE2 - COVER - _$RECOVER?_

**Persistence is admirable up to a certain extent, but when is enough enough?**

Some readers will remember the full history of Cover Protocol, who [rebranded](https://coverprotocol.medium.com/cover-protocol-e202808aa4ef) from SAFE after both @azeemfi and @chefcoverage made poor decisions. They then launched SAFE2, which was migrated to the COVER which we know today.

Is the community is willing to give them a FOURTH opportunity?

---

![](https://lh5.googleusercontent.com/Ogj1lycooZFZrO1GfU4lgsis5tJ2j76L2BHPQ50TC3KuG7mTx_CQ-FcD90AfAQtSQqdc0ERGK95wczwmRdoznGUR9c00f381m3DAhRZp7Ego0j6U4WrxohU-RCMNtE0Sq0c4f55u)

**[Grap Finance](https://medium.com/@grap.finance) is a fork of YAM** - who having failed to ship anything noteworthy during DeFi summer, jumped at the opportunity to gain attention by presenting themselves as a White Hat, which gained them thousands of followers in just one day.

What they will do with this new found following remains to be seen.

**Grap Finance**’s unusual activity puts them within the top five balance changes for COVER within the last 7 days.

![](https://lh3.googleusercontent.com/FMvU_UZhki6SB0ery4HcON4MEfMbBSPmrah0QDGPCqgwePElvreCDCKdVct9Mo2-B2sqqgUqx8y4MQOpJIPMtn-VqI4tm3ND37FW_Kyz0sDVWKDvdmyBZpe555KyeVqpQd2hO6by)

They say there’s no such thing as bad publicity, and this seems to be confirmed by the next chart - unique addresses for COVER increased on the day of the attack by 1,778, as opportunist traders tried to catch a falling knife.
![](https://lh5.googleusercontent.com/n3eflB7D7s60xY-dZg_755bKnUbm-8XEpryBbapuAY1UhlCirnheGGcmDL8hX6Bv8im6TzNFOBryHjcrGL9bUPcMShVRB-wepJfTxod4M71KiL-15n9qdBhjJPRPCzuqe62ixMFZ)
Here we see Binance shown in green, a huge increase in COVER deposits as the community tried to jump ship before they eventually paused trading for the token.
![](https://lh4.googleusercontent.com/ISdelPif5XcLBEWb4fNDHyOanmb9rPv5Ny47vHbshuH0bevewfDrt6Agt28yYWRiSgxUFSC_NPPX_Vp5oJOWFkCeXByfFP9pO07HniqwKcBtNeBgwCrJNKyepBp22XVFgxQeFyQB)
Responsible behaviour may not offer much reward, but wages of sin are always paid in full.

Some say this was an insider job gone wrong.

Perhaps the attackers got doxxed, couldn’t keep the funds, so sent them back and profited from promo instead.
![](https://lh5.googleusercontent.com/8DTMgDPJE8_EL2ldg9LTM8_A4JtUw1oAbAIxFcZj3MOISWVwa5Do7EivF7R5SrcInzstS7lLnHYlA3Sug4uqC95aE_EAZdNOwIeD_QQvB5F9ckPTFrotVFZ2I02JaPT-Gb_J6MwY)

**We don’t claim that these rumours are based in fact,** but it’s easy to see how such ideas arise when the day's events lead to announcements such as [this](https://support.mxc-exchange.com/hc/en-001/articles/360054776091).

![](https://lh3.googleusercontent.com/LJ9XZzZF2hn1qinb-EP8NlGS3vK2QdGWllXXAgmYbHxVCGKF-B07NHSyXREHg7smGNDfyITiFgf7txfb0Eejrn-AVycPUzhnjTFV0dv7hD0Sqmfk_gHEUlonGnnc7J_qGLuzGhce)

**Pure coincidence is out of the question**, this is foul play or desperation. MXC must have fallen on hard times if they’re listing tokens based on gossip.

Crypto Twitter has proven that their risk appetite remains strong by pumping the price of their “rescuers” [token](https://www.coingecko.com/en/coins/grap-finance) by several thousand percent, increasing its 24hr trading volume from $236 to $5,458,084 at the time of writing.

---

**Emiliano Bonassi provided the following quote:**

> _Setting a side the technical issue, this event showed again how this ecosystem is cohesive and supportive._
>
> _We are antifragile._
>
> _I am pretty sure that after this event not only a new Cover will emerge but more importantly a collective to guarantee safety and prompt reaction in the ecosystem - maybe The WhiteHack Group_

---

**Blood is a big expense. The DeFi insurance market is in a sorry state.**

First [NXM](/nxm-hugh-speaks-out/) and now Cover. It doesn’t matter if the protocol is unaffected, if we have to write an article about you, then the user's confidence in your project has already gone.

**DeFi insurance must be fully comprehensive.** Acts of god don’t happen here.

Insecure protocols pay high premiums, while others work hard to build their no claims bonus.

[COVER](https://twitter.com/search?q=%24COVER&src=cashtag_click) went down 40x in 4 hours while[ $GRAP](https://twitter.com/search?q=%24GRAP&src=cashtag_click) went up 40x.

**[“No gains”](https://twitter.com/GrapFinance/status/1343555258316804101?s=20) say Grap team from behind their screen**, a tall tale that tells half the truth.

**Black hats painted white don’t last under a shower of allegations.**

The investigation continues...

---

![](https://lh6.googleusercontent.com/p6se9Mb3aS2HWRTPsm98ZjKAwuUAel7YOOa02gjrlbP6q_iTmGLiQ21XiTm93L102-HH4pMRqgO5dDMZu5BOJOJYmJxSpg9IPRL9S7pHZTbfTksMZkuKjEZKamLrSyh-oxey40pq)
