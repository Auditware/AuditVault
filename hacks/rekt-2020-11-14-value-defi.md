---
tags:
  - sector/dex
  - sector/lending
  - sector/oracle
  - vuln/oracle/spot-price
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
title: "Value DeFi - REKT"
protocol: "[[Value Defi]]"
date: 2020-11-14
loss_usd: 7000000
auditors:
source: "https://rekt.news/value-defi-rekt"
excerpt: "Did they really know flashloan? The value of a reputation is volatile. Humility brings stability - boast too much and you will get rekt. Value DeFi was exploited today for $7,000,000. Another harsh le"
genome:
  - "[[spot-price]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[known-pattern]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
---
# Value DeFi - REKT

> **Loss:** $7,000,000 | **Date:** 2020-11-14 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2020/11/jumpoutwindow-7.jpg)
**Did they really know flashloan?**

The value of a reputation is volatile. Humility brings stability, boast too much and you end up rekt.

Value DeFi was exploited today for $7,000,000. Another harsh lesson from the flash loan family.

**Price before hack** - $2.73

**Price after hack** - $1.87

**Releasing this tweet a day before the hack?**
![](https://lh4.googleusercontent.com/odnNjSzV6LwKmdxXPY63HQ4SPBnxjtGstMRf3v4URKQwAqb1y_16m7O4_QRYXQq3dH5wlZiubb2ZzXrmWr0irFKbud0DFgKWAxP0OIKSHPImB_XrOFsE2n3Kwnc-xjcH08CajSd7)

> **_PRICELESS_**

_(The tweet has since been deleted, but our screenshot lives on.)_

Despite their bold claims of security, it appears the Value DeFi team didn’t know that withdrawals could be made not only through the main Bank contract, but also from the Vault contract through Proxy.

Value DeFi used Curve spot price as an oracle.
![](https://lh5.googleusercontent.com/8LivNANeDVuLd7utYUylaCzk-gG0oe_bUBZh3_XIOeilHQ-xPIpSjQ3yjQwOwhDEQUDgHT7H4C_2-0W6fT6H39XJTw2rrCv1jMqp_aj6QhTZC4DrrIGQPKeIfEH4SvPgoBLdODU1)
The manipulation occurred at steps 5 and 6.

Withdrawal at step 7 is using the wrong Curve function to do the maths.

Credit [@emilianobonassi](https://twitter.com/emilianobonassi)
![](https://lh6.googleusercontent.com/sCMxoK0s_EMlbZfZUYx-BVe9Wuq5iXDAXptoHOAsp2SXYhOgA1ZFJ7VXf83WXrRhyY38Xlf1-qXTUqMU5RMQy0u1Lw0TBNs9zV7IfwT6LJCnRrwJ4EqNvnKv3s7TcUIkWhKGQLrH)
Credit [@FrankResearcher](https://twitter.com/FrankResearcher/status/1327649421492957184?s=20)

15:24 - The exploit came at a particularly bad time for Value DeFi, just 20 minutes before they were due to start an AMA.
![](https://lh6.googleusercontent.com/AOmdisLDuND1OnUWiBCw9dNc_SsCuSRGqZcbhapOyv05JX8Nk3zwMaVB9mIQROSOvXywGoc18QOGkie-y8Sq8WMeNzt0DRDJ3N3iWK0I8U8b4yV8VShPpSe-P63Xi4PdeqL4tVCH)
At 15:41 a user asked about the drop in TVL, which had been [over $11M ](https://discordapp.com/channels/738345978750435408/745301208532516875/777212546746286120)earlier in the day
![](https://lh6.googleusercontent.com/CHKktTxXvzd1xPwEX3K1twFBsL1v6KSNjCncFX6wpdunbOAPU2mi4votbubCgKmvrCguM-PLWW7PBHe1Ms_Cf7bEjHMIq-V84zGFUqGnp-h3LwZs4lIwQ-AXH-_l6-36ocfAtIPG)
At 15:42, concern was growing, and group members hoped for a UI bug.
![](https://lh4.googleusercontent.com/piTSCrkU79lUUJidljebpv2PdMwmVC7JFeBN87kakfy-6gY_QFvDsoF_ZJq3EJRSTl4Ah_NuDZXOlsRrrxDeKV4_tKQ2diz6d94wCFzrpGI08h4Uxk7TjopdPK4j-9RgwoPSeTKY)
Then at 15:49 the [etherscan link](https://etherscan.io/tx/0x46a03488247425f845e444b9c10b52ba3c14927c687d38287c0faddc7471150a) dropped into the chat
![](https://lh5.googleusercontent.com/UkZdx33K3bt2fyUrVmBO1IT4YM0d8xbrHCK0YYavvlmcwXf9oxFmBg0-aWyorFb3e1q0nsrGaYVIPGc_0rtyY0cAsbxczJ96iUGQaKYxgTRPDqI5KcOoqt3Tj-gV70cqHQ5ziARN)
$7,000,000 had been removed from the Value DeFi vault, with $2,000,000 and the following note returned.
![](https://lh5.googleusercontent.com/_b3-umHgK4n0lvMJcrgMjVZkHTIpbdzd_OHLV73C0C4A4PBIqr_lfvDrahBPwdgmJOfDDmgBEiQ6R7-f8-H1ZBh9E3Y-5WgGbGwwk28XSfD4JcURbK9NcP3RAqWVaD7wYEzjtalp)
At 16:00, just as the AMA was due to start, Stani Kulechov put out the following tweet.
![](https://lh6.googleusercontent.com/dBkWmYCfLAx2j6xhO4SeB9FEuMNPOgrFQRzSoYUvwv5rbydivcMqj70HauqhJM0mTx8VIp_nK1jJ4ubvNgZ4H8d4EpoUBAXFwdVrbvsWKvaMKP27fgnPMmS7SEfFyaCAVnS-lFiz)
Meanwhile, in the AMA:
![](https://lh6.googleusercontent.com/e3_MrE8GywtpCPum9fpVI4dItHOA3J4Jcqqv04eGDuI4crIPMv0YfZyLCpVpVMdOsOrvv_0CWIvb38LNMxDd21RRgmvtgyc7HW5PMuw5_HrhorudSvWRBYAwoRsCk9fl1nqJpqVY)
The Value team acknowledged the hack in their [Discord ](https://discordapp.com/channels/738345978750435408/744758563376857210/777202671068381195)at 16:05, yet the AMA questions continued for 40 minutes on unrelated topics, until…

![](https://lh6.googleusercontent.com/vrOHsSMhnYTH7ezrLuhy1twz47KQEtpq4rxcNs4OOChEARyJBaIVVYVvmojSyuoVHpazliLTy0sBCvXDgnyz-9pywr6HNYHlItnFKgz-tbng1Ygu6mGm0IHWdsN-ymAHX2_dJ0wh)
[$FARM](/harvest-finance-rekt/), [$AKRO](/akropolis-rekt/) and now [$VALUE](https://bloxy.info/tx/0x46a03488247425f845e444b9c10b52ba3c14927c687d38287c0faddc7471150a) have been victims of the flash loan, as harsh lessons are dealt out to weak protocols, exposing the weaknesses in their platforms before returning some amount as a sign of “good faith”.

Only semi-reputable projects have been targeted; those with high activity and a reasonable TVL.

**Are these attacks an attempt to teach us something?**

Flash loans are a controversial topic in the DeFi space, they’ve been behind many attacks and exploits in recent months, however it could be argued that this is simply accelerating our learning process and aiding in the removal of weak protocols.

**Without flash loans, we would be waiting for a whale to do the same.** It’s best that we pass through this stage now, during the genesis stage of decentralised finance, as people who are prepared to take risks are experimenting, trying, and releasing new products daily.

Flash loans are here to teach and humble anyone who rushes this process. They are the pinnacle of DeFi - impossible anywhere else, flash loans are a perfect example of the new capabilities that this technology brings.

**A feature of DeFi, not an exploit of the code.**

The strongest protocols aren’t affected by these attacks. Some are even benefiting.

**Flash loans forcibly raise the bar for DeFi developers.**

Until the new standards are met, people and protocols will get rekt. It will be painful, and it will be public, but because of this we will learn. DeFi will get stronger, and we will develop better practices, stronger code, and a safer environment for future users.
