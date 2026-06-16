---
tags:
  - blockchain/bsc
  - sector/dex
  - sector/lending
  - sector/multisig
  - sector/privacy
  - sector/stable
  - sector/token
title: "MobiusDAO - Rekt"
protocol: "[[Mobiusdao]]"
date: 2025-05-11
loss_usd: 2150000
auditors:
source: "https://rekt.news/mobiusdao-rekt"
excerpt: "67 cents minted 9.73 quadrillion MBU via a double-decimal bug, letting an attacker siphon $2.15 million, dump tokens, and vanish through Tornado Cash. MobiusDAO went from launch to zero in three days "
genome:
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[reentrancy-guard]]"
---
# MobiusDAO - Rekt

> **Loss:** $2,150,000 | **Date:** 2025-05-11 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01//mobiusdao-rekt-header.png)




_It started with 67 cents and ended like a punchline no one was ready for._

  

**On May 11, [MobiusDAO’s](https://x.com/MobiusDAO123) Mobius Token ([MBU](https://dexscreener.com/bsc/0xb5252fcef718f8629f81f1dfcff869594ad478c6)) became the latest DeFi project to implode not from a sophisticated attack, but from elementary school math.**

  

An attacker deposited 0.001 BNB and minted 9.73 quadrillion MBU tokens – enough to drain $2.15 million in actual stablecoins.

  

The bug? A decimal handling error that turned pennies into quadrillions.

  

_Double the decimals, double the fun._

  

**[Blockaid spotted the tragic comedy show](https://x.com/blockaid_/status/1921476644092452922) in the early hours of May 11th.**  
  
By the time [Cyvers confirmed the attack shortly after](https://x.com/CyversAlerts/status/1921489580991119736), the attacker was already dumping tokens until [MBU's price flatlined](https://dexscreener.com/bsc/0xb5252fcef718f8629f81f1dfcff869594ad478c6).

  

The funds took their usual vacation to Tornado Cash - 21 neat transfers of 100 BNB each.

  

**In a system built on "code is law," nobody bothered to check if the law could do basic arithmetic.**

  

_Is this the future of finance - or just a $2.15 million magic trick, where the rabbit was decimal error and the hat was smart contract code?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Blockaid](https://x.com/blockaid_/status/1921476644092452922), [Cyvers](https://x.com/CyversAlerts/status/1921489580991119736), [MobiusDAO](https://x.com/MobiusDAO123/status/1921819107088859414), [AstraSec](https://x.com/AstraSecAI/status/1921498296172138525), [Quill Audits](https://www.quillaudits.com/blog/hack-analysis/mobius-token-exploit-breakdown), [Noveleader](https://x.com/0xnoveleader/status/1921934671983616384), [CertiK](https://www.certik.com/resources/blog/mobius-token-incident-analysis)_

  

**[MobiusDAO launched on May 8](https://x.com/MobiusDAO123/status/1918917722412360052) with little more than a token address, a [bare bones website](https://mobiusdao.com/), and some fancy buzz speak of “Dimensional Integration” for DeFi and RWAs.**

  

There appears to be no audit, possibly [no open-source code](https://x.com/AstraSecAI/status/1921498296172138525), no docs and no team that can be vetted publicly. Just a Telegram group and a Twitter account [tweeting about 10x pumps](https://x.com/MobiusDAO123/status/1920612816219680814).  
  

By May 11, it was over, as an attacker exploited a fatal decimal handling bug in the minting function.  
  
_MobiusDAO stayed silent for over 10 hours, then [issued a surreal statement](https://x.com/MobiusDAO123/status/1921819107088859414) blaming the “BSC Byzantine consensus mechanism” and promising cooperation with global law enforcement._

  

**[According to Quill Audits' autopsy](https://www.quillaudits.com/blog/hack-analysis/mobius-token-exploit-breakdown), the fatal flaw lived in the deposit function.**

  

When users deposited WBNB, the contract called getBNBPriceInUSDT to calculate how many MBU tokens to mint.

  

The exploit was embarrassingly simple: a double multiplication in the price calculation.

  

[Noveleader from Quill Audits](https://x.com/0xnoveleader/status/1921934671983616384) summarized it best: "The contract performed an extra multiplier of 10**18 on the amount the attacker deposited, inflating the amount deposited though the deposited amount was only $0.67."

  

**How did the mathematics of madness unfold across BSC with predictable precision?**  
  
_Standard protocol: Tornado Cash for privacy, then deployment. The attacker was methodical where Mobius was not._

**Tornado Cash Funding:** [0x491b6888843f260587e86efaa26b837c6a1c26d17442a526088bb2ec46ee828f](https://bscscan.com/tx/0x491b6888843f260587e86efaa26b837c6a1c26d17442a526088bb2ec46ee828f)

**Attacker:**
[0xB32A53Af96F7735D47F4b76C525BD5Eb02B42600](https://bscscan.com/address/0xB32A53Af96F7735D47F4b76C525BD5Eb02B42600)

  

_Next came the magic trick. Deploy a contract to do the dirty work._

  
**Attacker's Contract:**
[0x631adFF068D484Ce531Fb519Cda4042805521641](https://bscscan.com/address/0x631adFF068D484Ce531Fb519Cda4042805521641)

  

_The victim contract stood ready, its decimal flaw waiting to make someone rich._

  

**Victim Contract:**
[0x95e92B09b89cF31Fa9F1Eca4109A85F88EB08531](https://bscscan.com/address/0x95e92B09b89cF31Fa9F1Eca4109A85F88EB08531)

  

**MBU Token Contract:**
[0x0dfb6ac3a8ea88d058be219066931db2bee9a581](https://bscscan.com/address/0x0dfb6ac3a8ea88d058be219066931db2bee9a581)

_One transaction. 0.001 BNB in, 9.73 quadrillion MBU out._

  

**Exploit Transaction:** [0x2a65254b41b42f39331a0bcc9f893518d6b106e80d9a476b8ca3816325f4a150](https://bscscan.com/tx/0x2a65254b41b42f39331a0bcc9f893518d6b106e80d9a476b8ca3816325f4a150)

  

The attacker had quadrillions to dump. PancakeSwap swallowed them whole, dragging MBU’s price straight to zero.

  

**Exit strategy? The classic [21 Tornado Cash spin cycles](https://www.certik.com/resources/blog/mobius-token-incident-analysis), 100 BNB each. Washed clean, protocol left for dead.**  
  
_Ready to take a peak behind the code for how this tragic comedy of errors unfolded?_  
  
### The Math That Broke the Bank

_[Quill Audits broke down the farce](https://www.quillaudits.com/blog/hack-analysis/mobius-token-exploit-breakdown) step by step._

  

**When the attacker called the deposit function with 0.001 WBNB, the contract fetched BNB's price: ~$656, correctly formatted with 18 decimals.**

  

[As Quill put it](https://www.quillaudits.com/blog/hack-analysis/mobius-token-exploit-breakdown): "The problem arises as the function returns the value in 18 decimals, the contract multiplies this value again by 10**18, minting an enormous amount of tokens."

  

This wasn't a sophisticated zero-day or a complex reentrancy attack. It was elementary school math gone nuclear. The protocol quite literally couldn't count its own zeros.

  

The result? 9,731,099,570,720,980.659843835099042677 MBU tokens materialized from a 67-cent deposit.

  

Once the tokens existed, the rest was mechanical: dump into PancakeSwap pools, crash the price to dust, walk away with $2.15 million.

  

_The [token that launched on May 8](https://x.com/MobiusDAO123/status/1918917722412360052) died on May 11._  
  
**Days later, [MobiusDAO's latest post-hack bizarre announcement](https://x.com/MobiusDAO123/status/1922196634588307497) read like fever dream economics.**

  

They called the exploit a "system data anomaly" and promised to keep paying 0.5% compound interest twice daily on "pre-attack collateral data" - whatever that meant.

  

They vowed to "intercept abnormal transactions in real time" and undergo "audits by multiple auditing companies" before relaunching.

  

Now promising yields on phantom collateral while discovering the magic of multi-sig wallets.

  

**A protocol that couldn't catch an extra multiplication suddenly claimed it could "intercept abnormal transactions in real time."**

  
_When a protocol can't tell the difference between $656 and $656 quintillion, are we building the future of money or just very expensive calculators that can't calculate?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Three days from debut to detonation - all because someone multiplied when they shouldn't have._

  

**[According to Astrasec](https://x.com/AstraSecAI/status/1921498296172138525), the contract wasn't even public.**

  

The preventable flaws read like a checklist of what not to do: no mint cap, no validation, no testing.

  

Just raw logic - possibly unaudited - programmed by someone who forgot how decimals work.

  

**MobiusDAO died the way it lived: abstract, maybe unaudited, and alone on the chain.**

  

No documentation, no security review, no problem - until someone deposited 67 cents and walked away with millions.

  

The protocol that promised "Dimensional Integration for DeFi and RWAs" couldn't integrate basic multiplication.

  

**In the end, Mobius created exactly what DeFi didn't need: another cautionary tale where ambition exceeded arithmetic.**

  

_They sold you on “Dimensional Integration” - but did you get anything more than multiplication malpractice?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
