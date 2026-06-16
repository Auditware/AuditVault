---
tags:
  - blockchain/bitcoin
  - blockchain/bsc
  - sector/dex
  - sector/lending
  - sector/token
  - impact/loss-of-funds/direct-drain
  - trigger/flash-loan
  - precondition/flash-loan-available
title: "Spartan Protocol - REKT"
protocol: "[[Spartan Protocol]]"
date: 2021-05-02
loss_usd: 30500000
auditors:
source: "https://rekt.news/spartan-rekt"
excerpt: "Sparta has fallen. A flaw in the code allowed an attacker to drain the SPARTA/WBNB liquidity pool, earning themselves $30 million and the 6th position on the rekt leaderboard as a result."
genome:
  - "[[direct-drain]]"
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# Spartan Protocol - REKT

> **Loss:** $30,500,000 | **Date:** 2021-05-02 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/sparta-header.png)

**Sparta has fallen.** 

A flaw in the code allowed an attacker to drain the SPARTA/WBNB liquidity pool, earning themselves $30.5 million and the 6th position on the rekt leaderboard as a result.

The attacker took advantage of a flawed logic used to calculate liquidity shares when users burned their LP tokens in order to withdraw funds.

A flash loan was used to inflate the balance of the pool before burning the same amount of pool tokens, allowing them to claim a much larger amount of underlying assets.

The following details are taken from the [Peckshield](https://peckshield-94632.medium.com/the-spartan-incident-root-cause-analysis-b14135d3415f) root cause analysis.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/sparta-linebreak.png)

1. **A flash loan was taken for 10K WBNB, to be returned at the last step with 260 WBNB as the flash loan fee;**

2. Swap WBNB to SPARTA five times through the exploited Spartan pool, with each time swapping in 1,913.172376149853767216 WBNB to get 621,865.037751148871481851 SPARTA, 

555,430.671213257613862228 SPARTA, 

499,085.759047974016386321 SPARTA, 

450,888.746328171070956525 SPARTA, 

and 409,342.991760515634291439 SPARTA respectively. 

3. **The resulting total 2,536,613.206101067206978364 SPARTA, plus 11,853.332738790033677468 WBNB, are then added into the pool,** minting 933,350.959891510782264802 pool token (SPT1-WBNB);

4. **Swap WBNB to SPARTA ten times through the same pool**, with each time swapping in 1,674.025829131122046314 WBNB to get 336,553.226646584413691711 SPARTA, 

316,580.407937459884368081 SPARTA, 

298,333.47575083824346321 SPARTA, 

281,619.23694472865873995 SPARTA, 

266,270.782888292437349121 SPARTA, 

252,143.313661963544185874 SPARTA, 

239,110.715943602161587616 SPARTA, 

227,062.743086833745362627 SPARTA, 

215,902.679301559370989883 SPARTA, 

and 205,545.395265586231012643 SPARTA respectively, 

resulting in a total of 2,639,121.977427448690750716 SPARTA.

5. **Inflate the asset balance in the pool** by transferring into the pool 21,632.147355962694186481 WBNB and all SPARTA from the above step 3, i.e., 2,639,121.977427448690750716 SPARTA.

6. **Burn the 933,350.959891510782264802 pool tokens obtained from step 2 to withdraw the liquidity.** Since the pool’s asset balance is inflated, the burn operation leads to 2,538,199.153113548855179986 SPARTA and 20,694.059368262615067224 WBNB. 

>Note that step 2 only deposits 11,853.332738790033677468 WBNB, leading to the profit of about 9K WBNB.

7. **Add the liquidity into the pool with the added assets in step 4** with 1,414,010.159908048805295494 pool token, which is immediately burned to obtain 2,643,882.074112804607308497 SPARTA and 21,555.69728926154636986 WBNB.

8. **Repeat the above steps to continue draining funds from the pool.**

9. **Return the flash loan with 100,260 WBNB.**

The vulnerability stems from the fact that the liquidity share calculation calcLiquidityShare() is querying the current balance which can then be inflated for manipulation. A correct calculation needs to make use of cached balance in baseAmountPooled/tokenAmountPooled.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/sparta-code.png)

Most of the attacker’s funds from the above exploitations are currently held in this wallet: [0x3b6e](https://bscscan.io/address/0x3b6e77722e2bbe97c1cfa337b42c0939aeb83671).

- 30.7k WBNB ($18.9M)
- 4.6M SPARTA ($7.8M at the time of hack)
- 1.3M BUSD-T ($1.3)
- 23.2 BTCB ($1.3M)
- 924k BUSD ($0.9M)

The attacker used 1inch (to swap all tokens to BTCB or BETH), Spartan (to dump SPARTA), Nerve (to swap BTCB and BETH to Anyswap versions). In this way they were eventually able to withdraw part of the profit through Anyswap.

Due to slippage, the profit decreased by a third:
- 219.5 BTC ($12.4M)
- 3311 ETH ($9.7M)

_Credit [igor igamberdiev](https://twitter.com/FrankResearcher/status/1388848787632754690?s=20)_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/05/sparta-linebreak.png)

**A relatively straightforward story of another copied protocol who were too ambitious with their imitation.** 

The era of BSC flash loans is upon us, and this won’t be the last time we see such attacks. 

$30 million reward for only $66 in fees is an excellent ROI, and with so many developers rushing to copy the ETH blue chips onto BSC, there’s sure to be more opportunities for keen eyed hackers. 

With no word yet from CZ or Binance, one wonders, how much of this will they tolerate? 

_How rekt do you have to get for CZ to step in and save you?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-text-linebreak.png)
