---
tags:
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/privacy
  - sector/stable
title: "MM Finance - REKT"
protocol: "[[Mm Finance]]"
date: 2022-05-04
loss_usd: 2000000
auditors:
source: "https://rekt.news/madmeerkat-finance-rekt"
excerpt: "Mad Meerkat Finance (not to be confused with normal Meerkat Finance) lost $2M to a DNS exploit. Back-end attacks, front-end attacks, when will we see the end of the attacks?"
genome:
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# MM Finance - REKT

> **Loss:** $2,000,000 | **Date:** 2022-05-04 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/madmeerkat-header.png)

**Mad Meerkat Finance (not to be confused with normal [Meerkat Finance](https://rekt.news/meerkat-finance-bsc-rekt/)) is in the hole, to the tune of $2M.**

The Cronos-based DEX had its [front-end exploited](https://twitter.com/MMFcrypto/status/1521943206333542401), resulting in losses of over $2M for its users.

Beginning around 7:30 PM on 4th of May, users swapping, adding or removing liquidity on the protocol had the output funds redirected straight into the attacker’s wallet.

The exploit lasted for approximately 3 hours before the team took down the front-end.

During the attack, team members in Discord advised users not to interact with the site.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/madmeerkat-endorf.png)

_But why was the compromised site left up for so long? Why didn’t they block access?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**It is unclear exactly how the attacker managed to gain access, and the official [post mortem](https://medium.com/@MMFinance/dns-hi-jacking-post-mortem-compensation-3e2b5bb21183) doesn’t give much away:**

>MM.finance site was the subject of a DNS attack earlier where an attacker managed to inject a malicious contract address into the frontend code. Attacker used a DNS vulnerability to modify the router contract address in our hosted files.

This led to some speculation in the [rekt.news telegram group](https://t.me/Rekt_HQ/49327), with users contemplating whether the exploit had redirected users to a cloned version of the page.

>“hmm - looks like it was actually a dns redirect possibly…” 
>“[people are saying](https://discord.com/channels/869152206060937226/967607652643373056/971498877964402738) bad SSL certificate”

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/madmeerkat-hiddenfates.png)

**While others were [more skeptical](https://t.me/Rekt_HQ/49317).**

Some users raised their concerns via [Discord](https://discord.com/channels/869152206060937226/967607652643373056/971498286663999519), but were not taken seriously by the team.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/madmeerkat-keepeyes.png)

**Whatever the attack vector, the exploit was prepared, exposing users’ transactions to a malicious router linked to the attacker’s address.**

Then, beginning with [this swap](https://cronoscan.com/tx/0xdfb5b6f7698121adc9510d69687f9536c1abe320287e6b053e384956cd7be0da) at 19:28:35 PM +UTC, the outputs of all interactions with the DEX were rerouted to the [attacker’s address](https://cronoscan.com/address/0xb3065fe2125c413e973829108f23e872e1db9a6b).

[600+ transactions](https://cronoscan.com/tokentxns?a=0xb3065fe2125c413e973829108f23e872e1db9a6b) were rerouted in this way, with the profits being swapped to USDT and [bridged](https://cronoscan.com/tx/0x9df6975c09ee950ae361894f6aa46c1c5e462449156054c73432e84147724ebb) back to [Ethereum](https://etherscan.io/address/0xb3065fe2125c413e973829108f23e872e1db9a6b) before being deposited (743 ETH so far) into Tornado Cash.

**The post-mortem advises users to double check for the correct router address (0x145677FC4d9b8F19B5D56d1820c48e0443049a30) during transaction confirmations.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**Another mongoose playing fast and loose with their operational security.**

The Mad Meerkat team have traced the attacker’s financing back to OKX, and [are appealing](https://twitter.com/MMFcrypto/status/1522094396342104065) for help in determining the hacker’s identity. 

The affected users will be reimbursed via the team’s share of trading fees. Further details on the compensation package can be found [here](https://medium.com/@MMFinance/compensation-package-updates-5d5915bf0f69).

This will be the first exploit on Cronos to go onto [our leaderboard](https://rekt.news/leaderboard/), with a lowly entry of #76.

_Front-end attacks, back-end attacks, when will we reach the end of the attacks?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/madmeerkat-conc.png)
