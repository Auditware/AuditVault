---
tags:
  - blockchain/ethereum
  - blockchain/solana
  - sector/bridge
  - sector/nft
  - sector/privacy
  - sector/stable
  - precondition/insider
title: An Un-SOL-ved Mystery
protocol: "[[Slope Finance]]"
date: 2022-08-02
loss_usd: 5300000
auditors:
source: https://rekt.news/unsolved-mystery
excerpt: Approximately 8,000 addresses on the Solana network have been compromised, draining a total of ~$5.3M. Fear leads to rumours, and separating the signal from the noise is no easy task.
genome:
  - "[[insider]]"
  - "[[bridge-message-validation]]"
  - "[[oracle-freshness]]"
---
# An Un-SOL-ved Mystery

> **Loss:** $5,300,000 | **Date:** 2022-08-02 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/07/solana-header.png)

_Panic, chaos, suspicion._

All are inevitable reactions to an indiscriminate attack, where nobody knows who’s safe, _and who’s next._

**Approximately 8,000 addresses on the [Solana network](https://twitter.com/SolanaStatus/status/1554658171934937090) have been compromised, draining a total of ~$5.3M.**

Shortly after 11pm UTC last night, news [began](https://twitter.com/nftpeasant/status/1554605742174486529) to [circulate](https://twitter.com/solporttom/status/1554609401369137152) of wallets being [drained](https://solscan.io/tx/xHmiZvB56k5SJELKYc2FSRb29rwfToMENYvxa7ZAXMxLwmu6oioDt4Hn6A7BuWqWwyzuonXD3zbpt8HTPvuNqEn), with SOL and USDC transferred directly into exploiter addresses.

_Initially, the possibility of a network-wide bug led to panic over whether this would mean all Solana accounts had been compromised._

But as the stolen funds were tallied, it became clear that the scope of the threat was not existential, but still perturbing. And although the exact vulnerability is still to be uncovered, some clues have emerged.

**But fear leads to rumours…**

_…and separating the signal from the noise is no easy task._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [OtterSec](https://twitter.com/osec_io/status/1554656988499709952), [CIA Officer](https://twitter.com/officer_cia/status/1554615881124167681)_

**Early reports of missing funds from [Phantom](https://twitter.com/phantom/status/1554626111535026177) wallet users were followed by accounts of an identical breach affecting [Slope](https://twitter.com/slope_finance/status/1554643718275305473) wallets, with mobile users making up the majority of victims.**

It quickly [became established](https://twitter.com/cavemanloverboy/status/1554622694162702336) that exploited addresses had been signing the transfers directly, i.e. this wasn’t a simple, but widespread, case of phishing for malicious approvals.

**However, that meant something far more worrying; the private keys to the affected addresses were compromised.**

Was there a leak in a browser extension? Mobile malware? Others suspected something deeper, such as an ECDSA [nonce reuse](https://twitter.com/_patrickogrady/status/1554649399493423104) issue (as in the case of [Anyswap](https://rekt.news/anyswap-rekt/), now Multichain), though [it seems unlikely](https://twitter.com/tayvano_/status/1554664676234969089) that all 8k addresses would have made the 2+ transactions necessary for such an exploit.

News even broke of a [widespread malware attack](https://twitter.com/stephenlacy/status/1554697077430505473) on GitHub repositories, though was quickly dismissed as coincidental and overblown.

**Each new theory added to the confusion, and as the community battled to make sense of the exploit, the only safe havens seemed to be hardware wallets or even CEXs.**

_And all the while, amid the chaos, the number of [drained accounts](https://dune.com/queries/1131425) (currently around 8k) continued to grow._

At least [one Ethereum address](https://etherscan.io/address/0xc611952D81E4ECbd17c8f963123DeC5D7BCe1c27#tokentxns) is also known to be affected. Potentially as a result of [porting a common seed phrase](https://twitter.com/adamscochran/status/1554674564545789953) between the two chains.

**With theories ranging from leaky extensions to a mobile malware epidemic to a bug in the underlying cryptography… it remains to be seen exactly how _so many_ users came to be affected.**

However, Solana co-founder Anatoly Yakovenko [points to](https://twitter.com/aeyakovenko/status/1554745536741138433) an “_iOS supply chain attack_”, affecting users who have their “_key imported or generated on mobile_”.

**In order to help cut through the noise, any affected users should [fill out this form](https://solanafoundation.typeform.com/to/Rxm8STIT?typeform-source=admin.typeform.com).**
---

While investigations into the root cause continue, attention has also been directed towards the exploiter addresses.

One whitehat took it upon themselves to [DDOS the attacker](https://twitter.com/0xMert_/status/1554678657339236352), slowing their progress, but causing downtime for block explorers in the process. [Another anon](https://twitter.com/lordnarfz0g/status/1554649309580300288) even claims to have obtained the exploiter’s info by sending an NFT linked to an image, which logged the IP that sent the request when viewed.

**The four exploiter addresses identified on Solana hold a total of $5,276,392.50 at time of writing:**

[Htp9MGP8Tig923ZFY7Qf2zzbMUmYneFRAhSp7vSg4wxV](https://solana.fm/address/Htp9MGP8Tig923ZFY7Qf2zzbMUmYneFRAhSp7vSg4wxV) ($3,618,270.02)

[CEzN7mqP9xoxn2HdyW6fjEJ73t7qaX9Rp2zyS6hb3iEu](https://solana.fm/address/CEzN7mqP9xoxn2HdyW6fjEJ73t7qaX9Rp2zyS6hb3iEu) ($955,601.51)

[5WwBYgQG6BdErM2nNNyUmQXfcUnB68b6kesxBywh1J3n](https://solana.fm/address/5WwBYgQG6BdErM2nNNyUmQXfcUnB68b6kesxBywh1J3n) ($446,965.00)

[GeEccGJ9BEzVbVor1njkBCCiqXJbXVeDHaXDCrBDbmuy](https://solana.fm/address/GeEccGJ9BEzVbVor1njkBCCiqXJbXVeDHaXDCrBDbmuy) ($255,555.97)

**[This dashboard](https://beta-analysis.solscan.io/public/dashboard/ffaf8155-1d6f-4ec7-96db-2e8e8bc5c160) provides a useful breakdown of the stolen funds, including by token type (50% USDC, 35% SOL, 15% Other) and affected wallets by loss (top 3: $246k, $125k, $100k).**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

While Solana’s appeal has always been focused on ([somewhat exaggerated](https://rekt.news/spotlight-on-solana/)) claims of speed and affordability, will such a widespread attack erode users’ trust in the security of the ecosystem?

**Though this incident is unrelated to Solana’s underlying tech, it will be hard to shake the stigma that jumpy retail users will ascribe to the network.**

The [price of SOL](https://www.coingecko.com/en/coins/solana) did show a noticeable drop around the time the news broke, but there has been no major crash, suggesting that the panic is now fully under control.

But the cryptosphere is wary, yesterday’s attack on [Nomad Bridge](https://rekt.news/nomad-rekt/) was as chaotic in its execution as today’s rumour mill. No surprise, then, that CT (as well as your anonymous author) loves a good [conspiracy theory](https://twitter.com/unclesendit/status/1554627240675139589)…

In this wild-west industry, the promise of short term gains often blinds users to the basic tenets of personal security:

**Use a hardware wallet, diversify risks, and don’t go chasing APYs across risky bridges.**

_But is it ever enough?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
