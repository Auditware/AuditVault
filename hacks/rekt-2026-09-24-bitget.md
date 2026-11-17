---
tags:
  - blockchain/arbitrum
  - blockchain/avalanche
  - blockchain/bitcoin
  - blockchain/bsc
  - blockchain/ethereum
  - blockchain/near
  - blockchain/optimism
  - blockchain/solana
  - blockchain/tron
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/governance
  - web3-sector/multisig
  - web3-sector/rwa
  - web3-sector/stable
  - web3-sector/staking
  - precondition/insider
  - type/hack
  - vector/access-control
  - vector/social-engineering
title: "Bitget - Rekt"
protocol: "Bitget"
date: 2026-09-24
loss_usd: 387500000
audit: "N/A"
source: "https://rekt.news/bitget-rekt"
excerpt: "An attacker drained $387.5 million from Bitget’s hot and warm wallets after breaching third-party security products and reaching its wallet system. No keys stolen, Bitget says; freezes barely dented t"---
# Bitget - Rekt

> **Loss:** $387,500,000 | **Date:** 2026-09-24 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/bitget-rekt-header.png)



_The keys were never stolen. The wallets were drained anyway._

**[Bitget initially said its security systems flagged unauthorized transfers](https://x.com/GracyBitget/status/2103235655879074084) at 18:31 UTC on September 24.**  
  
**[The newly published investigations push the story further back](https://x.com/SlowMist_Team/status/2105145931645743534):** SlowMist traces the earliest malicious activity in the available logs to August 31, when an attacker exploited a zero-day in a third-party security product.

[Over roughly three hours](https://x.com/arkham/status/2103454007607874022), attackers [pulled $387.5 million from the exchange across Ethereum and other EVM networks, XRP, Zcash and TRON](https://www.bitget.com/support/articles/12560603896108), the [largest crypto theft of 2026 so far by DefiLlama's count](https://defillama.com/hacks).

[Mandiant’s Incident Response Status Report says Bitget found no evidence that private keys were compromised](https://img.bgstatic.com/multiLang/events/MFR26-1029_Status_Update_Bitget_0930.pdf) and that cold wallets were unaffected.  
  
_Instead, [Mandiant says the attacker gained unauthorized privileged access to third-party security appliances](https://img.bgstatic.com/multiLang/events/MFR26-1029_Status_Update_Bitget_0930.pdf), before moving laterally to Bitget’s production wallet job server._

**[SlowMist recovered a custom tool that forged risk-control parameters](https://x.com/SlowMist_Team/status/2105145931645743534), constructed withdrawal requests and invoked the wallet’s withdrawal process.**  
  
Investigators are still working out how the attacker moved between the affected systems.

_[Arkham says $228 million left](https://x.com/arkham/status/2103454010359398437) in just 18 minutes._  
  
**[The largest asset component was roughly 103 million XRP](https://x.com/lookonchain/status/2103290466116763936) ($157.48 million), which [cannot be frozen on the ledger](https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes).**

[Bitget says its protection fund covers the loss](https://x.com/GracyBitget/status/2103235655879074084). [BTC withdrawals have resumed on Bitcoin and BNB Chain](https://www.bitget.com/support/articles/12560603896189), while [other assets remain on a phased schedule](https://www.bitget.com/support/articles/12560603896110).  
  
Gracy Chen, Bitget’s CEO, [has raised a possible DPRK link](https://x.com/GracyBitget/status/2103359608484172104), though attribution remains unconfirmed.  
  
[TRM Labs found overlaps between the laundering network handling the proceeds and wallets used in earlier North Korean-linked hacks](https://www.trmlabs.com/resources/blog/bitget-loses-usd-3516-million-in-hot-wallet-breach-in-likely-north-korea-attack), but says it has not definitively attributed the Bitget intrusion to North Korea.

**[Bitget has now published progress reports from Mandiant and SlowMist](https://www.bitget.com/support/articles/12560603896305), but neither identifies the third-party vendor or fully explains the attacker’s movement between systems.**  
  
_When the signer does exactly what it’s told, who’s really holding the keys?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Gracy Chen](https://x.com/GracyBitget/status/2103235655879074084), [Arkham](https://x.com/arkham/status/2103454007607874022), [Bitget](https://www.bitget.com/support/articles/12560603896108), [DefiLlama](https://defillama.com/hacks), [decrypt](https://decrypt.co/379350/bitget-hack-387m-what-happened-why-north-korea-suspect), [Lookonchain](https://x.com/lookonchain/status/2103290466116763936), [XRP](https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes), [TheBlock](https://www.theblock.co/news/business/2026-09-28-bitget-starts-phased-withdrawal-resumption-416965), [DCF GOD](https://x.com/dcfgod/status/2103212139007873136), [CoinDesk](https://www.coindesk.com/markets/2026/09/25/circle-and-tether-step-in-to-freeze-hacker-wallet-after-massive-bitget-crypto-heist), [Officer’s Notes](https://x.com/officer_secret/status/2103215828954972576), [Hacken](https://x.com/hackenclub/status/2103226997346357636), [Foresight News](https://x.com/Foresight_News/status/2104481190174769468), [U Today](https://u.today/bitget-details-388-million-security-incident-as-btc-withdrawals-resume), [Bybit](https://www.bybit.com/en/learn/this-week-in-bybit/bybit-security-incident-timeline), [vdiceco](https://x.com/vdiceco/status/2104614093554597895), [AMLBot](https://x.com/AMLBotHQ/status/2103510273378406550), [MistTrack](https://x.com/MistTrack_io/status/2104767013117694156), [ZachXBT](https://x.com/zachxbt/status/2104528688469647700), [Ben Zhou](https://x.com/benbybit/status/2103328213141508335), [THORChain](https://x.com/THORChain/status/2103911825490203083), [Star Xu](https://x.com/star_okx/status/2103921954340385100), [GoPlus Security](https://x.com/GoPlusSecurity/status/2104088981675925752), [Cos](https://x.com/evilcos/status/2104019752456966397), [Specter](https://x.com/SpecterAnalyst/status/2104115156326240650), [Michael Perklin](https://x.com/mperklin/status/2104201990104399886), [Alex Shevchenko](https://x.com/AlexAuroraDev/status/2104554958754357482), [Illia Polosukhin](https://x.com/ilblackdragon/status/2104706901837795348), [TRM Labs](https://www.trmlabs.com/resources/blog/bitget-loses-usd-3516-million-in-hot-wallet-breach-in-likely-north-korea-attack), [CoinTelegraph](https://cointelegraph.com/news/bitget-ceo-gracy-chen-chances-recovering-funds-security-breach)_

**One early public clue was a bad trade.**

Around 19:57 UTC on September 24th, [DCF GOD flagged a freshly created wallet dumping 19.67 million USDT0 for 7,111 ETH in six minutes](https://x.com/dcfgod/status/2103212139007873136), paying up to 5% over market through UniswapX and 1inch Fusion.

Nobody pays that kind of premium for convenience. [Stablecoins can be frozen by their issuer and ether can't](https://www.coindesk.com/markets/2026/09/25/circle-and-tether-step-in-to-freeze-hacker-wallet-after-massive-bitget-crypto-heist). It looked like a race against a blacklist.

**About a quarter hour later, [Officer’s Notes pointed to the broader Bitget outflows](https://x.com/officer_secret/status/2103215828954972576):** "It looks like bitget hot wallet might've just been hacked."  
  
_By that count, [$174 million had crossed](https://x.com/officer_secret/status/2103215828954972576) multiple chains [into a single address](https://etherscan.io/address/0x770b10b273fC44Fe9197D6bF20F145c2e98463Ee) within the hour._

**At 20:56 UTC, [Hacken posted a preliminary on-chain assessment](https://x.com/hackenclub/status/2103226997346357636), with roughly $145 million traced in ETH, USDT, USDC and tokenized gold, and transfers on BNB Chain, Avalanche and USDT0 still under review. Bitget, it noted, [had not issued any statement](https://x.com/hackenclub/status/2103226997346357636) at the time.** 
  
The transactions showed money leaving Bitget; they did not show whether the attacker had reached its private keys or cold storage.

[Bitget would later say its cold wallets](https://x.com/GracyBitget/status/2103235655879074084) were unaffected.  
  
**[Mandiant’s preliminary status report repeats that assessment and says Bitget observed no evidence](https://img.bgstatic.com/multiLang/events/MFR26-1029_Status_Update_Bitget_0930.pdf) of compromised private keys.**

[Bubblemaps followed at 21:06 UTC](https://x.com/bubblemaps/status/2103229553850380794), mapping around $180 million from Bitget wallets into one address before it scattered across six more.

_The early tallies were still missing the biggest piece. [Arkham's later reconstruction put roughly $153 million of XRP in the outflows](https://x.com/arkham/status/2103454010359398437), sent to a [fresh XRP Ledger address](https://xrpscan.com/account/rwNhefsz1UQEusxhCvHip3RANinWi4CTck), pushing its total to [about $350 million](https://x.com/arkham/status/2103454007607874022)._

**At 21:30 UTC, Bitget spoke. [Gracy Chen posted a security notice on Twitter that put the loss at approximately $351.6 million](https://x.com/GracyBitget/status/2103235655879074084), said cold wallets "remain fully secure" and announced paused withdrawals. Chen promised a full incident report, including root cause analysis, within 24 hours.**

[Arkham’s observed drain window ended at 21:23 UTC](https://x.com/arkham/status/2103454007607874022), seven minutes before Chen’s notice and [nearly three hours after Bitget’s initially reported detection time](https://x.com/GracyBitget/status/2103235655879074084). By then, researchers had published the [receiving address](https://x.com/officer_secret/status/2103215828954972576).

**Just after midnight UTC, [Chen offered the explanation that would define the incident](https://x.com/GracyBitget/status/2103284265563902056):** A compromised backend, spoofed transaction data and Bitget's own authorization process moving the funds.  
  
The count kept climbing. On September 25, [Bitget revised the loss to $387.5 million](https://www.bitget.com/support/articles/12560603896108), adding Zcash and TRON transfers left out of its first estimate.  
  
[The higher figure, Gracy Chen said](https://x.com/GracyBitget/status/2103487508147491014), reflected a more complete accounting, [not additional theft](https://x.com/GracyBitget/status/2103487508147491014).

**The chain had given up its side of the story. Bitget's side was still unfolding, one statement at a time.**  
  
_What exactly happened inside Bitget while the money kept moving?_

### Infiltrating the Defenses  
  
_The exploit appears to have been in the making weeks earlier._

**[SlowMist’s investigation traces the earliest malicious activity in the available logs to August 31](https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/incident-response/SlowMist%20Investigation%20Progress%20Report%20-%20Bitget_en-us.pdf), when a zero-day affected a service on a third-party security product it calls Product A.**  
  
[A hidden script read an environment variable holding a database password and connected to the database](https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/incident-response/SlowMist%20Investigation%20Progress%20Report%20-%20Bitget_en-us.pdf); similar activity appeared on other Product A nodes on September 23 and 25.  
  
[Mandiant’s preliminary findings place unauthorized privileged access to two third-party security appliances on September 24](https://img.bgstatic.com/multiLang/events/MFR26-1029_Status_Update_Bitget_0930.pdf). It says the attacker planted a web shell on one appliance, established a command-and-control connection, then moved laterally to Bitget’s production wallet job server and deployed malicious packages.  
  
[SlowMist reports all times in UTC+8](https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/incident-response/SlowMist%20Investigation%20Progress%20Report%20-%20Bitget_en-us.pdf); the times below have been converted to UTC.  
  
**[SlowMist’s account picks up another part of the path](https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/incident-response/SlowMist%20Investigation%20Progress%20Report%20-%20Bitget_en-us.pdf):** At 16:07 UTC on September 24, the attacker began trying to inject commands into Product B’s task parameters after accessing its management platform using an internal employee identity.  
  
_[The attacker also submitted code through its web execution endpoint in attempts to alter configuration and assemble malicious files](https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/incident-response/SlowMist%20Investigation%20Progress%20Report%20-%20Bitget_en-us.pdf). SlowMist says it is still investigating how the attacker moved between the systems._  
  
**[SlowMist recovered a customized withdrawal tool from the files the attacker had deleted](https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/incident-response/SlowMist%20Investigation%20Progress%20Report%20-%20Bitget_en-us.pdf). It says the tool forged risk-control parameters, constructed withdrawal requests and invoked the wallet system’s withdrawal process.**  
  
[Host logs place the malicious program’s execution at 17:49 UTC on September 24](https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/incident-response/SlowMist%20Investigation%20Progress%20Report%20-%20Bitget_en-us.pdf), 42 minutes before the first verified on-chain transfer.  
  
The newly released reports from [Slowmist](https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/incident-response/SlowMist%20Investigation%20Progress%20Report%20-%20Bitget_en-us.pdf) and [Mandiant](https://img.bgstatic.com/multiLang/events/MFR26-1029_Status_Update_Bitget_0930.pdf) add the weeks-long intrusion and the path into the wallet environment.  
  
[Gracy Chen had already outlined the public-facing chronology in a September 28 livestream](https://x.com/bitget/status/2104498788564119612), summarized [by Foresight News](https://foresightnews.pro/news/detail/114135).  
  
At 18:31 UTC, [the attacker sent 0.84 ETH and 93 TRX out of Bitget's Ethereum and TRON hot wallets](https://x.com/Foresight_News/status/2104481190174769468).  
  
_Both amounts [sat below the exchange's risk-control threshold, and no alert fired](https://x.com/Foresight_News/status/2104481190174769468)._

**[Bitget initially said its systems detected unauthorized transfers at 18:31 UTC](https://x.com/GracyBitget/status/2103235655879074084). Its [later account says the small transfers at that time triggered no alert](https://www.theblock.co/news/regulation/2026-09-28-bitget-attacker-tested-risk-controls-small-transfers-388-million-theft-ceo-says-417045). It has not explained the discrepancy.**

At 18:58, the large transfers began. [Bitget counted 17 of them through 20:09 UTC](https://x.com/Foresight_News/status/2104481190174769468), across XRP, Zcash, BNB Chain, Base, Arbitrum, Optimism and more, worth about $360 million.

At 19:05, [Bitget's reconciliation system spotted a significant discrepancy](https://x.com/Foresight_News/status/2104481190174769468).  
  
[Bitget says its risk controls automatically blocked user withdrawal requests](https://x.com/Foresight_News/status/2104481190174769468) at the same time.  
  
[They did not stop the attacker's wallet-system commands](https://x.com/Foresight_News/status/2104481190174769468): The large-transfer window in Bitget's account continued until 20:09, with a second wave later that evening.

_At 19:14, [Bitget declared a P0 emergency](https://x.com/Foresight_News/status/2104481190174769468)._  
  
**At 19:40, [the technical team began loss mitigation](https://x.com/Foresight_News/status/2104481190174769468).**

At 20:40, with private key theft still not ruled out, [the wallet team started moving funds into cold wallets](https://x.com/Foresight_News/status/2104481190174769468).

Fifteen minutes later, a second wave hit. [Seven more transfers between 20:55 and 21:13 UTC](https://x.com/Foresight_News/status/2104481190174769468), across Avalanche and other chains, took roughly $28 million more.  
  
[SlowMist’s compiled transfer records run through 21:23:11 UTC](https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/incident-response/SlowMist%20Investigation%20Progress%20Report%20-%20Bitget_en-us.pdf). Its logs also show that, after the transfers had begun, the attacker attempted to alter withdrawal records and initiate two fabricated BTC withdrawal orders; both entered processing but returned errors.  
  
_[Bitget halted its signing machines and isolated wallet withdrawal services at 21:44 UTC](https://x.com/Foresight_News/status/2104481190174769468), two and a half hours after the emergency response began and 14 minutes after [Chen's 21:30 notice](https://x.com/GracyBitget/status/2103235655879074084)._

**At 08:43 UTC on September 25, [Bitget says its security team identified the root cause](https://www.bitget.com/academy/bitget-security-incident-what-happened-timeline-impact-response). The story it tells is one of legitimate identities doing illegitimate work.**

According to Chen, [the attacker exploited vulnerabilities in third-party security products to steal internal credentials](https://x.com/GracyBitget/status/2104515761691939026).

With those credentials, [the attacker impersonated authorized activity and sent fraudulent withdrawal commands to Bitget’s wallet system](https://www.bitget.com/academy/bitget-security-incident-what-happened-timeline-impact-response), according to the exchange.  
  
**[The reports make Bitget’s earlier account more concrete:](https://www.bitget.com/support/articles/12560603896305)** Both firms identify compromised third-party security products as the route that ultimately enabled unauthorized access to Bitget’s wallet environment; SlowMist says the recovered withdrawal tool forged risk-control parameters and invoked the withdrawal process. Neither report yet fully explains how the attacker moved between the affected systems.

_After the transfers, [Chen said, the attacker disguised its activity as routine administrative work while “removing traces of their actions.”](https://u.today/bitget-details-388-million-security-incident-as-btc-withdrawals-resume)_

**[Bitget said it found no common viruses or malware in the attack chain](https://x.com/Foresight_News/status/2104481190174769468) and described the breach as a highly targeted attack.**  
  
That “no common viruses or malware” claim should not be read as “no malicious code”: Mandiant reports a web shell and malicious packages, while SlowMist recovered the customized withdrawal tool from deleted files.  
  
[Private keys were not compromised](https://x.com/GracyBitget/status/2104515761691939026), and [insider involvement has been preliminarily ruled out](https://x.com/Foresight_News/status/2104481190174769468).

The keys stayed put, Bitget says, [while its wallet system executed fraudulent commands](https://x.com/GracyBitget/status/2104515761691939026).

_By contrast, [Bybit’s signers saw a spoofed Safe wallet interface](https://www.bybit.com/en/learn/this-week-in-bybit/bybit-security-incident-timeline)._  
  
**Bitget’s account, so far, [describes forged commands sent to its wallet system](https://www.bitget.com/campaigns/bitget-security-incident-2026), rather than a human signer being deceived.**

[Chen says Bitget has since isolated the affected servers](https://x.com/GracyBitget/status/2104515761691939026), revoked and reissued internal credentials, restructured access to sensitive systems, and notified the vendor, disabling the affected functionality pending a fix.  
  
It says it is also [strengthening how it assesses and deploys third-party security products](https://www.bitget.com/academy/bitget-security-incident-what-happened-timeline-impact-response).

Bitget has not named the products or their vendor; [SlowMist’s report identifies them only as Product A and Product B.](https://github.com/slowmist/Knowledge-Base/blob/master/open-report-V2/incident-response/SlowMist%20Investigation%20Progress%20Report%20-%20Bitget_en-us.pdf)

  
How did access to the compromised security products become control over the wallet job server, and where could that movement have been stopped?

  

**The movement of the stolen funds, however, was already visible.**

_With the doors sealed and the signing machines finally dark, where was $387.5 million headed?_

### Catch What You Can

_The attacker didn't wait to learn who would freeze what._

**Within minutes of the drain, Arkham says, [stablecoins and tokenized gold were already being sold for ETH](https://x.com/arkham/status/2103454014927229114).**

[$25 million of USDT went to Rizzolver](https://x.com/arkham/status/2103454014927229114), a UniswapX filler, in five $5 million fills. The remaining USDT moved through [Uniswap, 1inch and Furucombo](https://x.com/arkham/status/2103454014927229114), while [USDC was bridged to Ethereum and sold there](https://x.com/arkham/status/2103454014927229114).

Freezable tokens were being turned into ETH.

From 19:44 UTC, [ETH on Arbitrum, Optimism and Base was bridged to Ethereum through Across, Stargate and LayerZero](https://x.com/arkham/status/2103454018408169491), mostly in 400 to 500 ETH lots.  
  
_By 20:04, the cross-chain legs were done, and roughly [$100 million of non-ETH assets had become about 36,600 ETH](https://x.com/arkham/status/2103454018408169491)._

**Then came the parking. The [first 10,000 ETH wallet was funded at 20:13 UTC](https://x.com/arkham/status/2103454021008687327). By 22:45 there were six, and Arkham later counted [68,300 ETH, about $183 million, across eight fresh addresses](https://x.com/arkham/status/2103454021008687327).**  
  
The XRP took a different route. [Three transfers sent 102.98 million XRP out of Bitget](https://bitquery.io/investigations/bitget-hack). Six accounts holding the stolen XRP then sent it out in chunks; by 07:43 UTC on September 27, those accounts were empty. Bitquery traced the funds through new accounts to THORChain, [where 90.5% of the stolen XRP was swapped for bitcoin and 7.6% for ETH](https://bitquery.io/investigations/bitget-hack).

BNB never sat still. [Arkham tracked $6.9 million split across 12 BNB Chain wallets](https://x.com/arkham/status/2103454025488486519), with at least [$4.7 million deposited to THORChain and $2 million to FixedFloat](https://x.com/arkham/status/2103454025488486519).

Some funds could still be frozen. The first public example was small. [Circle blacklisted "Bitget Exploiter 8" at 05:00 UTC on September 25 and Tether followed](https://www.coindesk.com/markets/2026/09/25/circle-and-tether-step-in-to-freeze-hacker-wallet-after-massive-bitget-crypto-heist), stranding [about $318,000 in stablecoins by CoinDesk's count](https://www.coindesk.com/markets/2026/09/25/circle-and-tether-step-in-to-freeze-hacker-wallet-after-massive-bitget-crypto-heist).  
  
_[Bitget says other freezes have been secured through industry partners](https://www.bitget.com/support/articles/12560603896108), without saying how much._

**[Tether later froze another 21,091 USDT in a second attacker wallet](https://bitquery.io/investigations/bitget-hack), bringing the publicly identified issuer freezes to about $339,000.**  
  
[NEAR Intents separately says it froze $503,000 during attempted swaps](https://x.com/AlexAuroraDev/status/2104554958754357482). Together with the issuer freezes, that puts the publicly identified restricted funds at about $842,000, or 0.22% of Bitget’s $387.5 million loss.  
  
**[That is not money recovered, nor a complete tally](https://www.bitget.com/support/articles/12560603896108):** Bitget says other affected assets were frozen through industry partners, without giving an amount.

In a September 25 snapshot, [AMLBot counted about $343 million](https://x.com/AMLBotHQ/status/2103510273378406550), roughly 88% of the roughly $389 million it tracked, dormant across 13 attacker wallets.

_Elsewhere in the attacker's holdings, the money kept moving._

**On September 26, [AMLBot reported a possible Bitget-linked route into a Wasabi CoinJoin](https://x.com/AMLBotHQ/status/2103895436557992242).**  
  
**[It traced roughly 4 BTC in the CoinJoin back to a TRON wallet through swaps and a USDT0 bridge](https://x.com/AMLBotHQ/status/2103895436557992242):** TRX became USDT, then about 145 ETH on Ethereum, then roughly 4.59 BTC through THORChain.  
  
The ETH began moving too. [Lookonchain flagged ETH-to-BTC swaps through THORChain](https://x.com/lookonchain/status/2104473020693979406) on September 28.  
  
**In the same route, [CoinDesk identified 27 successful swaps between about 03:55 and 06:23 UTC](https://www.coindesk.com/tech/2026/09/28/thorchain-rejects-bitget-request-to-block-hacker-as-usd6-million-moves-to-bitcoin):** Roughly 2,390 ETH, worth $6.3 million, became 75.2 BTC paid to one address.  
  
_That is one dated slice of the ETH movement, not a total for the route._  
  
**[MistTrack reported that a Chainflip broker rejected a deposit from the Bitget exploiter](https://x.com/MistTrack_io/status/2104767013117694156) and refunded it to the sender.**  
  
Then people alleged to be moving the money went looking for customer service.  
  
On September 28, [ZachXBT said operators he described as Chinese launderers acting for the alleged DPRK attackers were asking for help with orders in public Discord and Telegram channels](https://x.com/zachxbt/status/2104528688469647700).  
  
[He listed five aliases alongside transaction hashes and said one alias had also appeared in laundering linked to April’s $292 million KelpDAO](https://x.com/zachxbt/status/2104528688469647700) exploit.  
  
The aliases remain investigative leads. The addresses receiving the stolen funds are on Bitget’s published list.

**Primary attacker receiving addresses, [per Bitget](https://www.bitget.com/support/articles/12560603896108):**

**EVM:**
[0x770b10b273fC44Fe9197D6bF20F145c2e98463Ee](https://etherscan.io/address/0x770b10b273fC44Fe9197D6bF20F145c2e98463Ee)

**XRP:**
[rwNhefsz1UQEusxhCvHip3RANinWi4CTck](https://xrpscan.com/account/rwNhefsz1UQEusxhCvHip3RANinWi4CTck)

**ZEC:**  
[t1WgMdtND8NF7NDUuYmq8MpMj1NTCXkMDVG](https://blockchair.com/zcash/address/t1WgMdtND8NF7NDUuYmq8MpMj1NTCXkMDVG)

**TRON:**  
[TBWNguTTgezw9dVorX441C6nDrZpRxYwKD](https://tronscan.org/address/TBWNguTTgezw9dVorX441C6nDrZpRxYwKD)

For those who want to track the exploiter’s main address, here is the [Bitget Hacker on Arkham](https://arkm.com/explorer/entity/bitget-hacker)  
  
**The addresses were public. The money kept moving.**  
  
_When it reached someone who could stop it, would they?_

### The Big Red Button

_Bitget's recovery effort has depended on others acting._

**On September 25, [they launched a Recovery Bounty Program](https://www.bitget.com/support/articles/12560603896108), offering eligible voluntary contributors a bounty of up to 5% of funds they helped freeze or recover.**  
  
The bounty also covers [freezes secured before the program launched, but excludes actions taken under court orders or law-enforcement requests](https://www.bitget.com/support/articles/12560603896108). Bitget decides who qualifies and how much to award.

[Bitget announced a live tracing dashboard, a recovery-submission portal and an attacker-address API](https://www.bitget.com/support/articles/12560603896108), and named Bybit’s LazarusBounty platform as a core recovery channel.  
  
[Bybit CEO Ben Zhou offered help](https://x.com/benbybit/status/2103328213141508335), noting that Bitget had backed Bybit through its own hack in 2025.

_Then Bitget asked the one venue its tracers kept pointing at._

**[MistTrack had already framed the question on September 25](https://x.com/MistTrack_io/status/2103403250183815294). After Bybit, it said, nearly $1.2 billion in stolen funds was reportedly traced through THORChain, and Bitget exploiter funds were now heading the same way.**

**[At 11:44 UTC on September 26, Chen went public with her request:](https://x.com/GracyBitget/status/2103812967066439817)** "We are formally asking THORChain to refuse service to these addresses," she wrote, adding that decentralization "is a design principle, not a shield for facilitating known stolen funds."

[THORChain's reply arrived that evening](https://x.com/THORChain/status/2103911825490203083). It said it was "devastated" by the exploit, then described itself as decentralized and permissionless like Bitcoin, Ethereum and BNB Chain, and asked what responsibility those networks bear for known stolen funds?

Critics rejected the comparison.

_[OKX founder and CEO Star Xu rejected THORChain’s comparison with Bitcoin and Ethereum](https://x.com/star_okx/status/2103921954340385100). Its selected validators collectively control assets in TSS vaults and can move them once a signing threshold is met, he argued, making THORChain an intermediary between users and the native chains: “Distributing an intermediary does not eliminate the intermediary.”_

**[GoPlus Security said node votes can pause outbound signing on a single chain](https://x.com/GoPlusSecurity/status/2104088981675925752). By its estimate, the Bybit attacker moved nearly 499,000 ETH within ten days, mostly through THORChain, generating roughly $5.5 million in protocol fees. "Do not put the industry at risk for the fee line," they wrote.**

SlowMist founder Cos, whose firm is [working on Bitget’s investigation](https://www.bitget.com/support/articles/12560603896108), [pointed to THORChain’s emergency pause procedure](https://x.com/evilcos/status/2104019752456966397).  
  
**[His challenge was the apparent double standard](https://x.com/evilcos/status/2104019752456966397):** THORChain had halted the network when its own protocol was attacked, but would not halt it as stolen Bitget funds passed through.  
  
[Specter was blunter](https://x.com/SpecterAnalyst/status/2104115156326240650), saying THORChain only acts when the loss is its own.

_**On September 27th, [THORChain answered again](https://x.com/THORChain/status/2104460133132562449):** "A halt is not a selective freeze of specific funds or an individual swap," it wrote, adding that it "doesn't censor by design." During its May 2026 exploit, it said, the attackers' addresses were never blacklisted either._

**It found at least one defender. [Michael Perklin called GoPlus's argument](https://x.com/mperklin/status/2104201990104399886) "cherry picking at best, a false equivalency at worst," arguing that all tools are inherently neutral.**

Not every protocol took THORChain's line.

NEAR Intents general manager [Alex Shevchenko reported that attackers tried to push more than $50 million through the cross-chain protocol](https://x.com/AlexAuroraDev/status/2104554958754357482). About $166,000 got through, and $503,000 was frozen mid-execution, figures he called indicative and rounded, within about 10%.

[The blocking came from SHIELD, a risk-intelligence layer that, per Shevchenko, declines to quote a trade tied to a hack or halts it once execution has begun](https://x.com/AlexAuroraDev/status/2104554958754357482). "Permissionless doesn't mean neutral," he wrote. NEAR Intents also said it was waiving any bounty, while telling Bitget to pursue the frozen funds through legal and law-enforcement channels.

_[NEAR co-founder Illia Polosukhin backed the call](https://x.com/ilblackdragon/status/2104706901837795348). Permissionless, he wrote, "does not mean every application or liquidity provider must process every transaction."_

**[Chen thanked NEAR Intents for showing what "permissionless but not 'facilitating known stolen funds”](https://x.com/GracyBitget/status/2104602301503816040) should look like.**  
  
On THORChain, [the swaps kept clearing while the argument ran](https://x.com/lookonchain/status/2104473020693979406).

The two protocols described different ways to intervene.

[NEAR Intents said its SHIELD layer could decline a quote](https://x.com/AlexAuroraDev/status/2104554958754357482) or halt an execution already underway.  
  
_[THORChain said a network halt is an emergency measure to protect the protocol](https://x.com/THORChain/status/2104460133132562449), not “a selective freeze of specific funds or an individual swap.” It said the attackers’ addresses were not blacklisted during the May exploit and that it “doesn’t censor by design.”_  
  
**[Chen had asked it to refuse service to Bitget’s listed attacker addresses](https://x.com/GracyBitget/status/2103812967066439817); THORChain’s stated policy left that request unanswered in practice.**

Inside the exchange, recovery looked different.

[Bitget said it had isolated the affected systems and remediated the vulnerability](https://x.com/GracyBitget/status/2104515761691939026). It then began restoring withdrawals in phases, [starting with BTC on Bitcoin and BSC on September 28](https://x.com/GracyBitget/status/2104515761691939026).  
  
[ETH withdrawals reopened on September 29 across Ethereum](https://www.bitget.com/support/articles/12560603896190), BSC, Arbitrum One, Base and Optimism.

_[Bitget says USDT withdrawals have now reopened on Ethereum, BSC, Solana and Tron](https://www.bitget.com/support/articles/12560603896191). Chen says [P2P withdrawals and the remaining services are scheduled for Friday, October 2, at 08:00 UTC](https://x.com/GracyBitget/status/2105232217488433370)._

**[Bitget reported that its Protection Fund was backed by 5,500 BTC before the incident](https://www.bitget.com/blog/articles/bitget-protection-fund-382m-august-2026). Chen [said the fund would cover the incident’s financial impact and that users were “100% covered”](https://x.com/GracyBitget/status/2104515761691939026).**  
  
[Chen says the fund is back above $300 million](https://x.com/GracyBitget/status/2105231125568446805), fulfilling her pledge to replenish it within a week.  
  
[She also reported a 131% proof-of-reserves ratio](https://x.com/GracyBitget/status/2105231125568446805) in the September 29 update.

**Bitget has also launched two programs:** The [Bitget Alliance Program](https://www.bitget.com/support/articles/12560603896118), which allocates a reward pool equivalent to 30% of eligible net transaction-fee revenue to qualifying users based on trading activity or asset holdings; and [Project Stand Together](https://www.bitget.com/support/articles/12560603896116), which offers PRO users 20% taker-fee discounts, increases maker rebates for Futures Group A under its Liquidity Incentive Program, and extends PRO tier protection.  
  
Chen called this [the exchange's first security incident of its kind in eight years](https://x.com/GracyBitget/status/2104515761691939026).

**The wallets were mapped. The people behind the breach were not.**

_If the money can be tracked in public but not stopped, wasn't the only real chance to stop it back inside Bitget?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Nobody needed to steal the keys._

**[By Bitget’s account](https://x.com/GracyBitget/status/2104515761691939026), a vulnerability in an unnamed third-party security product handed an attacker valid internal credentials, and a wallet system built to obey its own backend did the rest. Bitget says its private keys were not compromised.**  
  
[Chen says users’ funds are fully covered by Bitget’s Protection Fund](https://x.com/GracyBitget/status/2104515761691939026), and [BTC, ETH and USDT withdrawals have reopened](https://x.com/GracyBitget/status/2105231125568446805).

**Recovering the stolen assets is another matter:** [Bitquery documents about $339,000 frozen by Circle and Tether](https://bitquery.io/investigations/bitget-hack), while [NEAR Intents says it stopped another $503,000 mid-execution](https://x.com/AlexAuroraDev/status/2104554958754357482), together roughly 0.22% of Bitget’s reported $387.5 million loss, with no confirmed total across all services.  
  
**[Gracy Chen told CoinTelegraph she was “not very optimistic” about recovering the stolen funds](https://cointelegraph.com/news/bitget-ceo-gracy-chen-chances-recovering-funds-security-breach). She pointed to the 2025 Bybit hack, saying only about 3.5% of its stolen funds had been frozen after roughly a year, and stressed that freezing is not the same as recovery.**

[TRM Labs links the laundering network to one previously used by TraderTraitor](https://www.trmlabs.com/resources/blog/bitget-loses-usd-3516-million-in-hot-wallet-breach-in-likely-north-korea-attack), but has not definitively attributed the intrusion to North Korea.  
  
Bitget has not named the vendor. [](https://www.theblock.co/news/business/2026-09-28-bitget-starts-phased-withdrawal-resumption-416965) [Progress reports from SlowMist and Mandiant now describe the compromise of third-party security products and access to Bitget’s wallet environment](https://www.bitget.com/support/articles/12560603896305), but SlowMist says it is still investigating how the attacker moved between the affected systems.  
  
**The reports show where the trail leads, but not which products other exchanges should be examining.**

_How does the industry fix a shared weakness it still cannot name?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
