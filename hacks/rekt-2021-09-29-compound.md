---
tags:
  - sector/dex
  - sector/governance
  - sector/lending
title: "Compound - REKT"
protocol: "[[Compound]]"
date: 2021-09-29
loss_usd: 147000000
auditors:
source: "https://rekt.news/compound-rekt"
excerpt: "It’s worse than we thought. Last week ~$80M in excess COMP was wrongly distributed. Now another ~$68.8M has been sent to the vulnerable vault, and even more COMP is being given away."
genome:
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[timelock-timestamp-bypass]]"
---
# Compound - REKT

> **Loss:** $147,000,000 | **Date:** 2021-09-29 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/10/comp2-header.png)
**It’s worse than we thought.**

[Last week,](https://www.rekt.news/overcompensated/) a vulnerability was found in the [updated](https://compound.finance/governance/proposals/62) Compound Comptroller vault, and ~$80M in excess COMP was wrongly distributed. 

The Compound team tried to minimise the _perceived_ damage, but they knew it could only get worse.

Now another ~$68.8M has been sent to the vulnerable vault, and even more COMP is being given away.

_How did it go so wrong for Compound?_ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**As if the inital loss wasn't bad enough, Compound could not stop a continued attack.** 

Any user could call _drip()_ on Compound’s Reservoir vault, which would refill the Comptroller and allow for even more incorrect COMP distribution.

The Reservoir accumulates 0.5 COMP per block. At the time of the first incident, it hadn’t been drained in approximately 2 months.

With over 200k COMP (~$68M) inside the Reservoir, the Compound team could only wait and [hope](https://twitter.com/rleshner/status/1444691278986457095) that nobody would discover that the damage was far from done.

As they waited for [Proposal 64](https://compound.finance/governance/proposals/64) to pass, which contained a fix for the original bug, [Robert Leshner](https://twitter.com/rleshner) and the team had a tense week ahead.

However, just three and a half days after the initial event, the [secret was out](https://twitter.com/bantg/status/1444643482216304641?s=19), the Comptroller had been [refilled](https://etherscan.io/tx/0x02ba168f4d4fc313d095e9f0711447e8b96b26421539bd40be58243cd80a73cd), and another $68.8M was sent to the vulnerable vault. 

**As [Banteg](https://twitter.com/bantg/status/1444685796632670213?s=20) wrote;**

>If you tally the initial $80m, $22m already claimed after the drip and the $45m currently at risk, the bug tallies to $147m. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/10/comp2-price.png)

Although this was more of a “bank error” than an exploit, it’s only fair that Compound takes a place on [our leaderboard](https://www.rekt.news/leaderboard/), where we can see that this case is not without precedent.

In the case of the failed Alchemix experiment, we saw the protocol suffer a ~$6.5M loss due to their own mistake. 

Like Leshner, [Alchemix appealed](https://twitter.com/scupytrooples/status/1443741220384043020) for their users to return the funds, however, they were more successful in doing so. 

55% of the Alchemix funds were returned, an amount which currently seems unachievable for Compound.

It’s no surprise that users are more likely to do the _“right thing”_ when [“asked nicely”](https://twitter.com/scupytrooples/status/1443741220384043020), rather than threatened with the authorities.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**In [Curve Wars](https://www.rekt.news/curve-wars/), we remembered when Robert Leshner [said;](https://twitter.com/rleshner/status/1405337567139139584?s=20)**

>Crying to meatspace courts deeply undermines the “code is law” principles that DeFi was founded on.

>If you want courts and politicians to protect and control you, there is “finance”. If you want a system that is resilient, self-sufficient, open, and upgradable, there is DeFi.

Now we compare those words to his [aggressive appeal](https://twitter.com/rleshner/status/1443730726751506432?s=20);

>If you received a large, incorrect amount of COMP from the Compound protocol error:

>Please return it to the Compound Timelock (0x6d903f6003cca6255D85CcA4D3B5E5146dC33925). Keep 10% as a white-hat.

>Otherwise, it's being reported as income to the IRS, and most of you are doxxed.

Was this a threat or an offer? Return the 'stolen' money and keep a clean 10%, or pay 40% to the IRS and keep a clean 60%...

**These nonsensical threats might have done more damage to Compound’s reputation than the multi-million dollar loss.**

_Leshner has [since apologised](https://twitter.com/rleshner/status/1443759189722116097?s=20) for his words, but can his reputation be repaired?_ 

**It’s still not clear how (or if) the existing legal and financial systems will cope with the new concept that is decentralised finance, but for now...**  

_If you truly want DeFi, then you have to accept the responsibility that comes with it._ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
