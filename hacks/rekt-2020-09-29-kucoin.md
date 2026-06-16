---
tags:
  - blockchain/bitcoin
  - blockchain/ethereum
  - sector/dex
  - sector/stable
  - sector/token
title: "Kucoin - REKT"
protocol: "[[Kucoin]]"
date: 2020-09-29
loss_usd: 45000000
auditors:
source: "https://rekt.news/epic-hack-homie"
excerpt: "After what was described as an “unplanned movement of funds” on September 26th, Kucoin has reassured their users that all assets stolen in the hack will be returned and that Kucoin is fully insured fo"
genome:
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Kucoin - REKT

> **Loss:** $45,000,000 | **Date:** 2020-09-29 | **Audited by:** Internal audit

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/09/kucoinwojak-2.jpg)
After what was described as an “unplanned movement of funds” on September 26th, Kucoin has reassured their users that all assets stolen in the hack will be returned and that Kucoin is fully insured for this scenario.

Kucoin originally stated that the stolen tokens had a value of at least $150m, however some are estimating the true value to be as high as $280m, as more wallets are linked to the attack.
![](https://lh5.googleusercontent.com/jSvYaOxSiPSRRAs2MpTOVHgjB_tloUJBPJ3ogbbRRc2eRVfCEclg-L_u1MLEgTRuBbtyNWRb1FsGXB2sCZCf02jE2q-VRADXtu5TGwrdhw8QVzVJSOvuHALL83veNYqXgL9KfEXK)https://twitter.com/lawmaster
Over the last 24 hours, the hacker has been attempting to launder the stolen money via Binance and Uniswap, selling all tokens for ETH.

The first tokens to be sold were OCEAN and SNX, where the large market sales caused the price to decrease dramatically.
![](https://lh4.googleusercontent.com/bq0uBVE0LKcPXkhOiswITliRJB11zBqtRF_i2ci_pLZDF6UgIZcSQzinXD9fh-qRyRdrbBHoErrE8mQjD-tDPfptI-zPYEdNg8H_f0IJjnBxaQEi703txSSTM0zSDmI-4a9eQl_p)OCEAN sales on etherscan
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/09/oceansales.JPG)Ocean protocol price impact 7 day chart (Sep-27-2020 06:54:55 AM +UTC)![](https://lh3.googleusercontent.com/ai0TnzWCgqN1R1EcKufgjE-2RoJytN3YYgVlGT_CjRuKi6DUxURPDorDjdndtEEisYqqCmWcXkBc77_xZMMWEKdnsjUFevmMwLC9YH4aEAtd5NSU08QV1UOKbqY0tbSTQvuwLAFW)SNX sales on etherscan![](https://lh4.googleusercontent.com/kHeUKoW7vmnDZBOIgenYYVswNMYSyKvG3kFvF_3yEMGNxiF5vjpIjidNn_5JWHMABPZVBAQ9KzVgHu_dg8JNQi0t4nl2z0zLAEdgMUXN6qYh5N4FyeodIR_uqSJj16h4Rfrvmqhp)SNX price impact 7 day chart (Sep-27-2020 12:52:25 PM +UTC)
The hacker has gone on to sell COMP, LINK, and DIA, and with the token holdings of the wallet in full view, it has caused some uncertainty amongst holders of the ~160 different tokens that remain in[ the wallet](https://etherscan.io/tokenholdings?a=0xeb31973e0febf3e3d7058234a5ebbae1ab4b8c23).

[Breadcrumbs ](https://www.breadcrumbs.app/)provides a visualisation of the flow of tokens from Kucoin to the hackers wallet.
![](https://lh3.googleusercontent.com/1dmQCPHeMQgnLO88hqpAciHifQcwSLyl2fq-mAQ0-y3L9z1qUuWQbhiHZ_YFmOKa7O0l5_qlaOc-18KaG4vjcJ4UfthObxqGZU2HvV9Xi7Jjgld-o3zt1KiX07CmxIFzKMcNs8uB)
From this graphic we can see the attackers funds are flowing through Uniswap and consolidating in the following two addresses.

[0x00600423c03ec4b46f9b8a28c66d42bdd1b19c36 ](https://etherscan.io/address/0x00600423c03ec4b46f9b8a28c66d42bdd1b19c36)

[0xf519e276958c3ef2dffd9b6b2d87d26859526505](https://etherscan.io/address/0xf519e276958c3ef2dffd9b6b2d87d26859526505)

One of the first tokens to be moved out of the hackers address was a relatively small sum of [50,000 USDT](https://etherscan.io/tx/0xc6eb6440d4f2c8b649ee7e647e90ea3a354e0bb300540c95d2464553f6b6cff8), after which Tether moved quickly to freeze the remaining tokens in the wallet; a predictable move that left some wondering why the hacker didn’t exchange this currency first.
![](https://lh6.googleusercontent.com/jlT9bg3gp6rcYpKnRCpy-B7_yTsKDne_XGgFHnFv02jfxnXK4ECflNFjrNGp4Wzbg3DVoeXh_r-HUEISks1ffkML6l5jMTXkQ0p2XBhqVSt8K2vjKOxkVKroI9bRowSk2Czsv3sM)
Other tokens have taken steps to reduce the damage caused by this hack by forking, freezing or blacklisting the stolen tokens.

Some of the projects that have acted against the hacker with approximate value of tokens stolen.

- [Velo ](https://twitter.com/veloprotocol/status/1309937702041608192?s=20)~$76 million
- [Tether ](https://twitter.com/paoloardoino/status/1309771801581494272?s=20)~22 million
- [Orion ](https://blog.orionprotocol.io/tokenswap)~$10 million
- [KardiaChain](https://medium.com/kardiachain/kardiachain-issues-1-1-token-swap-in-response-to-kucoin-security-breach-ensuring-no-loss-to-kai-218b564b03d7) ~$10 million
- [Ocean Protocol](https://twitter.com/oceanprotocol/status/1310154281505390592) ~$9 million
- [Ampleforth ](https://twitter.com/AmpleforthOrg/status/1310355657632092160)- $9 million
- [VIDT Datalink](https://twitter.com/VIDT_Datalink/status/1309880082337615872?s=20) ~$7 million
- [NOIA Network ](https://medium.com/noia/kucoin-exchange-hack-update-fe8f49ca6393)~$5 million
- [Aleph ](https://medium.com/aleph-im/kucoin-exchange-hack-update-c1cd88a55301)- $1.2 million
- [Covesting ](https://twitter.com/covesting/status/1310103008152350725?s=20)~$600,000
- [Opacity ](https://medium.com/opacity-storage/kucoin-security-incident-and-opq-token-swap-faa3fb45d44d)- $215,000
- [SilentNotary ](https://twitter.com/SilentNotary/status/1309876794372354050?s=20)- $99,000

Although this is positive news for the owners of the stolen funds, it does cast doubt on the true decentralisation of each protocol.

Despite the hacker being able to remove $150m in ERC20 tokens from the exchange, the relatively unadvanced techniques used to launder the funds have caused some to wonder if the hacker was in fact a Kucoin employee. As the funds were removed via access to the hot wallet private key rather than a brute force attack,  this looks to be a possibility.

Amidst claims that the hacker would have been better off using DeFi instruments such as Curve or Balancer to launder their money, Curve has spoken out to state that decentralised protocols are actually less effective for money laundering than their centralised alternatives.
![](https://lh5.googleusercontent.com/3MYTGQ9VLY_N1aHUP22vwMNB2UhrBN85gTaiEjmfI5Y7QpQicRbKbO7cNeJgIW2Fj_wEd-Kd1pQscKMBgOK6BxuSpl2a4P4QLLYZKCHgv0UGKhSQUE0SJqk2H091lbV7tQR2decL)
It’s not just Ethereum that has been affected by this hack. 1008 BTC were also stolen.
![](https://lh6.googleusercontent.com/-jqWL3Elk3xHOe5qutdui5mPMzS6IrOOP5HUztVA4-0w3EQ_-VPrGM9Y58AK4JCmSOANBqnIm158aqvZy0Iipe5_ctq3nxYE0iOIzgU3FDC53a8uLsXS1ybCk0yrzxAuXCqF71Hu)https://twitter.com/cryptoquant_com/status/1309668583908061185?s=20
The hacker took the opportunity to send a message to the community using BTC.

> [“Epic Hack Homie - Not your keys not your coins”](https://blockchair.com/bitcoin/transaction/4e6f0e562e1309ff4fa17e0d87e9bdbadce924a16201e86807028cbed9dfb3b8)

![](https://lh3.googleusercontent.com/T1D2MBp9_4_vCpQCT3R-iM3Y7PBEylUJmZ8eP0sMh4Fe85tiWQxQP8M0Y2ZR9ELuXY-blAfwTmvy1jehVjF5zXMblrw1S_uytgoTDnQHwDFz7tzyORBLo8DRotsxIV-se_9zSiVH)
The crypto community has been responding to the hacker address.
![](https://lh3.googleusercontent.com/gecctBXdN_wEWsPiWGmPLpWnkByl9QzWr85Ck6mEg58-c6Pf5I_h6yp3loKcTral-SVjmHMLvmqUUGg4fN9QcAm6E-h2S8MbRLSu3rBnJlv1xmJKp1aA2uEp9uqcZQnEUFzG8mcC)
This is a developing story, and we will be keeping you up to date as it progresses.
