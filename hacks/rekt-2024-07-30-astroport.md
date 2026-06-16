---
tags:
  - blockchain/bitcoin
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/gaming
  - sector/governance
  - sector/stable
  - sector/staking
title: "Astroport - Rekt"
protocol: "[[Astroport]]"
date: 2024-07-30
loss_usd: 6400000
auditors:
source: "https://rekt.news/astroport-rekt"
excerpt: "A DEX on the Terra network, @astroport_fi, fell victim to a hack resulting in losses of roughly $6.4 million. The attack exploited a vulnerability that was known and patched in April, only to be accid"
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[oracle-freshness]]"
  - "[[reentrancy-guard]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Astroport - Rekt

> **Loss:** $6,400,000 | **Date:** 2024-07-30 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/astroport-rekt-header.png)



_On July 30th, Astroport, a DEX on the Terra network, fell victim to a hack resulting in losses of roughly $6.4 million._

  

**The attack exploited a vulnerability that was known and patched in April, only to be accidentally reintroduced in a June upgrade.**

  

This oversight raises serious questions about the state of security practices in the wake of [regulatory actions against Terraform Labs](https://www.fxstreet.com/cryptocurrencies/news/terraform-labs-set-to-restrict-access-for-users-in-the-us-after-recent-ruling-in-sec-lawsuit-202404261027) (TFL) by the SEC.  
  
The exploit sheds light on the complex interplay between regulatory actions and ecosystem security, highlighting potential gaps in the maintenance of critical infrastructure.

  

It also underscores the importance of heeding security warnings and the need for robust processes to prevent the reintroduction of known vulnerabilities.

  

This incident is more than just another entry in the long list of DeFi exploits, it's a stark reminder of the consequences of ignored warnings and regulatory actions.

  

**As the summer heats up, so does the frequency of crypto heists.**

  

_But when old bugs come back to haunt us and warnings fall on deaf ears, who's really to blame?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)




_Credit: [Rarma](https://x.com/Rarma_/status/1818477986569765308), [Cyvers](https://x.com/CyversAlerts/status/1818550103000383984), [Astroport](https://x.com/astroport_fi/status/1818508192822837511), [Terra](https://x.com/terra_money/status/1818498438759411964), [Jacob Gadikian](https://x.com/gadikian/status/1818339036861489475), [_gabrielShapir0](https://x.com/lex_node/status/1818505215420633363), [Zaki Manian](https://x.com/zmanian/status/1818506615001358801), [FXStreet](https://www.fxstreet.com/cryptocurrencies/news/terraform-labs-set-to-restrict-access-for-users-in-the-us-after-recent-ruling-in-sec-lawsuit-202404261027)_

  
**Terra aka Luna is a name that instills nostalgia and PTSD, depending on who you ask.**  
  
Like a phoenix rising from the ashes of its [algorithmic stablecoin disaster](https://rekt.news/luna-rekt/), Terra 2.0 promised a fresh start.  
  
But old habits die hard in the wild west of crypto and it seems some bugs are harder to kill than others.  
  
**First [reported by Rarma](https://x.com/Rarma_/status/1818477986569765308), as he poured one out for ASTRO holders, including himself, as he spotted millions flowing through suspicious transactions.**

  
Astroport [acknowledged the exploit](https://x.com/astroport_fi/status/1818508192822837511) shortly after.  
  
_As the exploit unraveled, Terra's validators pulled the emergency brake, [halting the chain](https://x.com/terra_money/status/1818498438759411964)._  
  
**In a twist of crypto irony, a [critical IBC bug](https://github.com/cosmos/ibc-go/security/advisories/GHSA-j496-crgh-34mx), once vanquished in April's emergency patch across Cosmos chains, rose from the dead in Terra's June upgrade.**  
  
Like a horror movie villain, the vulnerability came back with a vengeance, ready for its summer blockbuster debut.  
  

With the bug reintroduced, the stage was set for a classic crypto caper.

  
_The attacker, wielding the resurrected vulnerability like a cursed wand, [took advantage of a reentrancy vulnerability](https://x.com/CyversAlerts/status/1818550103000383984) in the timeout callback of ibc-hooks to conjure tokens out of thin air, leaving Terra's defenses in tatters._  
  
**The dark magic summoned a haul of 60 million ASTRO tokens, 3.5 million USDC, 500,000 USDT, and 2.7 BTC from the abyss, totaling roughly $6.4 million in ill-gotten gains at the time of the exploit.**

  

[Roughly 3.5 hours later](https://x.com/terra_money/status/1818552290372206614) after halting the chain, Terra's digital heart started beating again.  
  
The chain's emergency chain upgrade completed, transactions flowed once more through its veins.  
  
Validators holding over 67% of the voting power on Terra threw on their digital armor, upgrading nodes to fend off the exploit's encore, with more validators expected to upgrade soon.  
  
_[According to Astroport](https://x.com/astroport_fi/status/1818663685704892511), the attacker's Terra address, hoarding 20 million ASTRO, was swiftly frozen by Astroport, leaving their loot as stagnant and lifeless as a tundra landscape._

  

**The final tally? A whopping 58 million ASTRO tokens pilfered, with 33 million making a bridge trip to Neutron.**  
  
On Neutron, the stolen ASTRO tokens were [removed from the exploiter’s wallet](https://x.com/Rarma_/status/1818570514975408209) via TokenFactory Force Transfer.

  

**The remaining 20 million ASTRO on Terra?**

  

_Blacklisted faster than a Trumper in Hollywood._  
  
ASTRO fell roughly 56% in the aftermath of the attack, according to [Coingecko data](https://www.coingecko.com/en/coins/astroport-fi).

  

**Attacker’s address on Terra:**
[terra1wrve5z5vsmrgy6ldcveq93aldr6wk3qmxavs4j](https://chainsco.pe/terra2/address/terra1wrve5z5vsmrgy6ldcveq93aldr6wk3qmxavs4j)

  

**Attacker’s address on Neutron:**
[Neutron16wynag7xgfy35sp8c5ls25c0je7dydmvq5pnd8  ](https://neutron.celat.one/neutron-1/accounts/neutron16wynag7xgfy35sp8c5ls25c0je7dydmvq5pnd8)

_They also bridged some funds to Ethereum and swapped to ETH._

  

**Bridge transaction:**
[7E28A2BDD3A6DBED27269C23D0BDA2FBE4B2BE7F613E87CC23A237DA473F14E2](https://axelarscan.io/transfer/7E28A2BDD3A6DBED27269C23D0BDA2FBE4B2BE7F613E87CC23A237DA473F14E2)

  
**Address on Ethereum:**
[0xBDe173c4C2249d3a98cD6ed844a4421728114F5A](https://etherscan.io/address/0xBDe173c4C2249d3a98cD6ed844a4421728114F5A)

  
  
_The boy who cried wolf, except the wolf was real._

  

**In a twist that adds a layer of frustration to this incident, it turns out that vulnerabilities had been flagged by Jacob Gadikian, a former prominent figure in the Cosmos ecosystem.** 
  
Gadikian had [recently highlighted the risks](https://x.com/gadikian/status/1818339036861489475), but his [warnings were largely dismissed](https://x.com/gadikian/status/1818612162254061840) by those in a position to act.

  

"This is why I stopped: coordinated harassment endured while making security reports," [Gadikian stated](https://x.com/gadikian/status/1818564981165801801) following the hack.  
  
Jacob even [shared a solution](https://x.com/gadikian/status/1818617490085494828) to mitigate the issue.  
  
“When there's a security patch in comet, IBC, cosmos, etc, that shows in go.mod and that is why I automated it. [This PR changes two files](https://x.com/gadikian/status/1818617490085494828), go.mod and go.sum”

  
_[Gadikian added](https://x.com/gadikian/status/1818541780524314723), "If amulet were doing what I did, this would not have happened. It is trivial to set up monitoring for all cosmos chains based on go.mod. I know, cause I did."_

  
**His experience raises troubling questions about the ecosystem's approach to security and its treatment of those who raise alarms.**

  

However, in an ecosystem as intricate and often contentious as IBC, it's important to note that there are often multiple sides to every story.  
  
Adding fuel to the dumpster fire, it seems Terra's dev team may have been taken out at the knees.  
  
As [pointed out by gabrielShapir0](https://x.com/lex_node/status/1818505215420633363), Terra/TFL patched the vulnerability back in April, only to accidentally un-patch it in a later update. With TFL potentially running on a skeleton crew post-SEC action, such an oversight was perhaps inevitable.

  
[Zaki Manian confirmed](https://x.com/zmanian/status/1818506615001358801), "Terra was part of the original vulnerability coordination but they accidentally reverted the patch in the June upgrade."

  

_The exploit's success may be partially attributed to the reduced capacity of the Terra team following the SEC's actions against Terraform Labs._  
  
**The SEC's actions, meant to protect investors, may have inadvertently left the henhouse door wide open.**  
  
gabrielShapir0 could not have [summed it up better](https://x.com/lex_node/status/1818488028916039875), the SEC shuts down TFL, no one is left to patch known a Terra vulnerability, someone mints infinite $ASTRO and dumps it to oblivion. Slow clap for the SEC.  
  
As the Astroport saga unfolds, we're left with a patchwork of patched and unpatched vulnerabilities, ignored warnings and regulatory aftershocks.  
  
**Terra's phoenix-like resurrection seems to have inherited more than just its predecessor's name.**  
  
_In this blockchain Groundhog Day of exploits and finger-pointing, how many more project implosions must we endure before crypto prioritizes unbreakable security over the blame game?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




**The Astroport exploit serves as a stark reminder of the fragility within our blockchain ecosystems.** 
  
_From overlooked vulnerabilities to regulatory pressures, the crypto world faces challenges on multiple fronts_  
  
This exploit could have been prevented and there could likely be more than one party at fault.  
  
From developers reverting patches to ignored warnings and regulatory actions leaving projects understaffed.

  
This tangled web of oversights and missteps reveals a systemic vulnerability in how the ecosystem approaches security.  
  
The IBC community now faces a crossroads.  
  
**Will it continue down the path of reactive patches and finger-pointing or forge a new way forward with proactive security and collaborative problem-solving?**  
  
_The stakes are high in defi, can we afford to keep treating security as an afterthought rather than a fundamental pillar?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
