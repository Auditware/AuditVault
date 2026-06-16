---
tags:
  - blockchain/ethereum
  - sector/dex
  - sector/gaming
  - sector/governance
  - sector/launchpad
  - sector/lending
  - sector/nft
  - sector/oracle
  - sector/stable
  - sector/vault
title: "Eminence - Rekt in prod"
protocol: "[[Eminence]]"
date: 2020-09-28
loss_usd: 15000000
auditors:
source: "https://rekt.news/eminence-rekt-in-prod"
excerpt: "The crypto community went into another frenzy last night, as Andre Cronje's unreleased project became the focus of hundreds of users, who bought $15 million of the $EMN token."
genome:
  - "[[access-roles]]"
  - "[[chainlink-round-completeness]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Eminence - Rekt in prod

> **Loss:** $15,000,000 | **Date:** 2020-09-28 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/12/tease.jpg)
Andre Cronje’s unreleased project Eminence has been hacked for $15 million.

The crypto community went into yet another frenzy last night, as Andre Cronje's unreleased project became the focus of hundreds of users, who quickly bought $15 million of the mysterious $EMN token.

After some unexplained promotional tweets, users were keenly watching Cronje's account for any clues as to what was coming. As soon as the new contracts were [deployed ](https://etherscan.io/address/0x2d407ddb06311396fe14d4b49da5f0471447d45c#tokentxns.)from the yEarn finance address, the game was on.

Hundreds of users joined in the crowd-sourced investigation project to try and understand what was going on, and how to profit.

Users linked the graphics from the eminence.finance Twitter account to an unfinished MMORG called Eminence, Xander's Tales.

> [pic.twitter.com/tV9LSzPXlV](https://t.co/tV9LSzPXlV) > &mdash; eminence.finance (@eminencefi) [September 28, 2020](https://twitter.com/eminencefi/status/1310628912339316736?ref_src=twsrc%5Etfw)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/09/xanders.png)

> You&#39;re hearing it here first, certified alpha leak, I smell the rebirth of an old card game with an NFT/DEFI twist... [$ENM](https://twitter.com/search?q=%24ENM&src=ctag&ref_src=twsrc%5Etfw)
>
> Do some digging on "Eminence: Xander&#39;s Tales" and you&#39;ll find that [@AndreCronjeTech](https://twitter.com/AndreCronjeTech?ref_src=twsrc%5Etfw) even follows the lead artist for the project... 👀
>
> More soon, follow me
> &mdash; Kiyo (@IslandKiyo) [September 28, 2020](https://twitter.com/IslandKiyo/status/1310709943062888455?ref_src=twsrc%5Etfw)

The contracts that had been deployed included the EMN token, which could be exchanged for other tokens such as eYFI, eAAVE, or eSNX. These tokens, plus the surprise launch, matched perfectly one of Andre's previous tweets about the upcoming yEarn finance project.

> The new yearn system is probably the most complex to date. It incorporates [@synthetix_io](https://twitter.com/synthetix_io?ref_src=twsrc%5Etfw)[@AaveAave](https://twitter.com/AaveAave?ref_src=twsrc%5Etfw)[@chainlink](https://twitter.com/chainlink?ref_src=twsrc%5Etfw)[@iearnfinance](https://twitter.com/iearnfinance?ref_src=twsrc%5Etfw) and will be running on L1/L2
>
> Trying to decide if we should do whitepaper-esque writeups to explain before launch, or just launch and surprise everyone?
> &mdash; Andre Cronje (@AndreCronjeTech) [September 23, 2020](https://twitter.com/AndreCronjeTech/status/1308812154527780865?ref_src=twsrc%5Etfw)

Cronje's reputation as a leading DeFi builder, combined with his promotion of the Eminence Twitter account, caused a full on frenzy, and $15 million flowed into the unexplained contract to be exchanged for EMN or one of the eTokens.

> 🚨 yearn system confirmed.
>
> LAUNCHED AND SURPRISED EVERYONE.
>
> JFC the madman is doing it again.
>
> LONG [$YFI](https://twitter.com/search?q=%24YFI&src=ctag&ref_src=twsrc%5Etfw)[pic.twitter.com/XO5ZkJxDCq](https://t.co/XO5ZkJxDCq) > &mdash; BlueKirby.eth // YFI 🔥 (@bluekirbyfi) [September 28, 2020](https://twitter.com/bluekirbyfi/status/1310708762643181575?ref_src=twsrc%5Etfw)

Despite the EMN token originating from a relatively flat bonding curve, many users were purchasing the tokens "second hand" from Uniswap, which led to a few hours of very profitable arbitrage for those who were comfortable interacting directly with the contract.
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/09/image.png)

At around 04:00 UTC, the $15 million contained in the contract was suddenly drained.

[@fifikobayashi](https://twitter.com/fifikobayashi/status/1310929902946852864?s=20) wrote a short summary of how the attack took place.

- Use flash loan to mint EMN
- Manipulate EMN price downwards by burning EMN for eTokens
- EMN is based on a bonding curve, so when supply goes down, price goes down.
- Short EMN by burning the other half of the flashed EMN back into DAI, which was then inflated in comparison due to the curve-induced drop in EMN value.

Although [hacks ](/epic-hack-homie/)are certainly not unusual in crypto, what happened next certainly is.

11 minutes after [removing ](https://etherscan.io/address/0x223034edbe95823c1160c16f26e3000315171ca9#tokentxns)$15 million in DAI, the attacker [returned ](https://etherscan.io/tx/0x7bc97357364222207f1f011b22ad98ba78fcd3c25d3398346caa3928cdf4a4dd)$8 million to the Yearn: Deployer contract 01:31:04 AM +UTC.

Ethereum Transaction Hash (Txhash) Details | Etherscan

[Ethereum (ETH) detailed transaction info for txhash 0x7bc97357364222207f1f011b22ad98ba78fcd3c25d3398346caa3928cdf4a4dd. The transaction status, block confirmation, gas fee, Ether (ETH), and token transfer are shown.](https://etherscan.io/tx/0x7bc97357364222207f1f011b22ad98ba78fcd3c25d3398346caa3928cdf4a4dd)

![](https://etherscan.io/images/favicon3.ico)etherscan.ioEthereum (ETH) Blockchain Explorer

![](https://etherscan.io/images/brandassets/etherscan-logo-circle.png)
](https://etherscan.io/tx/0x7bc97357364222207f1f011b22ad98ba78fcd3c25d3398346caa3928cdf4a4dd)
Theories are running wild about who was behind the hack, and why they would return any money,  with some pointing the finger at the creators of Yearn Finance, and claiming it was an inside job.

> So.. was it [@bantg](https://twitter.com/bantg?ref_src=twsrc%5Etfw) who ran multiple bots, inflated the SHIT out of [#EMN](https://twitter.com/hashtag/EMN?src=hash&ref_src=twsrc%5Etfw) (and more) to arb DAI and eventually dumped for the growing liquidity?[https://t.co/vKOKs7IlxF](https://t.co/vKOKs7IlxF)[https://t.co/rbb8H6c78H](https://t.co/rbb8H6c78H)[https://t.co/V7ocyAQg0J](https://t.co/V7ocyAQg0J)[@ChainLinkGod](https://twitter.com/ChainLinkGod?ref_src=twsrc%5Etfw)[@AndreCronjeTech](https://twitter.com/AndreCronjeTech?ref_src=twsrc%5Etfw)[pic.twitter.com/9Dle86Yffy](https://t.co/9Dle86Yffy) > &mdash; Spicetoshi (@Spicetoshi) [September 29, 2020](https://twitter.com/Spicetoshi/status/1310884921783787522?ref_src=twsrc%5Etfw)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/09/andrechan.jpg)
Ultimately, those who deposited funds into the unaudited contracts are responsible for the loss of their money, however many have branded Cronje's promotion of the unfinished contract to be irresponsible, as the resulting FOMO could have easily been predicted.

One thing is for certain, a lot of people lost money last night.

> Can we pour one out for our 🐋 whale brother here that spent $130,548 for [$EMN](https://twitter.com/search?q=%24EMN&amp;src=ctag&amp;ref_src=twsrc%5Etfw) 1.5 hours ago and just sold it recently for $368.[https://t.co/5iVIHS93Pv](https://t.co/5iVIHS93Pv)[https://t.co/GBUMc62Eqs](https://t.co/GBUMc62Eqs)[pic.twitter.com/jIa7WVwP6s](https://t.co/jIa7WVwP6s) > &mdash; fomosaurus 🦖 (@fomosaurus) [September 29, 2020](https://twitter.com/fomosaurus/status/1310761830353186816?ref_src=twsrc%5Etfw)

> FOLLOW UP POST: MANS SPENDS 100k TO MAKE $348 - MAD RESPECT TO THE GALAXY BRAIN DEGEN KING WHO RISKED IT ALL FOR AN ETH [$EMN](https://twitter.com/search?q=%24EMN&amp;src=ctag&amp;ref_src=twsrc%5Etfw)[pic.twitter.com/IZnBSTMfqs](https://t.co/IZnBSTMfqs)
> &mdash; end i i i (@end0xiii) [September 29, 2020](https://twitter.com/end0xiii/status/1310777947545051136?ref_src=twsrc%5Etfw)

#rekt

> i bought just over $100,000 [$EMN](https://twitter.com/search?q=%24EMN&amp;src=ctag&amp;ref_src=twsrc%5Etfw) before the hack/exploit. i think my life is over
> &mdash; zerosum (@zerosum666) [September 29, 2020](https://twitter.com/zerosum666/status/1310757909756891136?ref_src=twsrc%5Etfw)

Cronje claims to have received multiple threats regarding the lost funds, and has asked Yearn Treasury to assist with distributing the returned $8 million.

Despite this major setback, Andre continues to build, and released this tweet earlier today.

> I am still building [@eminencefi](https://twitter.com/eminencefi?ref_src=twsrc%5Etfw). I love the metaverse and metaconomy.
>
> I am also going to continue deploying test contracts. I have over ~100 deployed contracts, of which probably >half have vulnerabilities.
>
> Please wait for official announcements.
> &mdash; Andre Cronje (@AndreCronjeTech) [September 29, 2020](https://twitter.com/AndreCronjeTech/status/1310802116391428097?ref_src=twsrc%5Etfw)

Yearn developers [Banteg ](https://twitter.com/bantg)and [Klim K](https://twitter.com/milkyklim) have also been working hard to help those affected, and have created a snapshot of EMN and the eTokens in order to try and refund those who lost money.

Users can check their eligibility [here ](https://gist.github.com/banteg/2ec7b0aec54267adf7d98136eee07cd9)(divide by 1e18)

[rektHQ](https://twitter.com/RektHQ) was not involved in the creation of this list, and no details are final.

> Since we have received 8M DAI, we are working towards distributing them to the people who got rekt. I have finished the first version of the snapshot which uses bonding curve rates of EMN, eCRV, eLINK, eAAVE, eYFI, eSNX at block 10954410. It includes 3656 addresses. [pic.twitter.com/dT3WryyGrD](https://t.co/dT3WryyGrD) > &mdash; banteg (@bantg) [September 29, 2020](https://twitter.com/bantg/status/1310823410289836032?ref_src=twsrc%5Etfw)

Last night's proceedings were the culmination of several different events, attitudes, and concepts that have arisen over recent months.

Those who have FOMO'd into unaudited contracts have been rewarded well in the past, and although many on Twitter are keen to promote this style of "Chad" behaviour, perhaps it's time to rethink this style of surprise launch.

The previously unblemished reputation of the YFI developer has taken a hit, and we are now at what feels like a turning point in DeFi, where hopefully both developers and users can learn from this event.

Until then, we look forward to the real release of Eminence: Xander's Tales.
