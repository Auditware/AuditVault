---
tags:
  - blockchain/arbitrum
  - blockchain/avalanche
  - blockchain/bitcoin
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/lending
  - sector/multisig
  - sector/stable
  - sector/staking
  - has/audit
  - trigger/flash-loan
  - precondition/flash-loan-available
  - precondition/insider
title: "DeltaPrime - Rekt II"
protocol: "[[Deltaprime]]"
date: 2024-11-11
loss_usd: 4850000
auditors:
  - "[[Peckshield]]"
source: "https://rekt.news/deltaprime-rekt2"
excerpt: "Audited multiple times, hacked twice in two months. DeltaPrime loses another $4.85M after ignoring explicit warnings about admin key security. Like leaving your mansion unlocked after security consult"
genome:
  - "[[flash-loan]]"
  - "[[flash-loan-available]]"
  - "[[insider]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
---
# DeltaPrime - Rekt II

> **Loss:** $4,850,000 | **Date:** 2024-11-11 | **Audited by:** Peckshield

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/deltaprime-rekt-header.png)



_Looks like lightning does strike twice – right in DeltaPrime's already scorched wallet._  
  

**Two months after their $6 million private key catastrophe, DeltaPrime has achieved the dubious honor of a second spectacular security breach.**  
  

This time, an unchecked input validation flaw has cost users another $4.85 million across Arbitrum and Avalanche chains.  
  

For a protocol that promises "Delta-grade security," they're racking up losses faster than a gambler with a credit card addiction.  
  

**While DeltaPrime scrambles to pause operations (again) and users watch their funds vanish (again), one has to wonder – is this a case of terrible luck, or terrible security?**  
  

_In an industry where "twice bitten, thrice shy" should be the motto, will anyone stick around for DeltaPrime's next security surprise?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
Credit: [Certik](https://www.certik.com/resources/blog/53e8FopQX9TTrTnMg3Mas6-deltaprime-incident-analysis), [DeltaPrime](https://x.com/DeltaPrimeDefi/status/1855899502944903195)

**The attack on DeltaPrime reads like the work of someone who actually bothered to study the "Exploiting Unchecked Inputs" chapter – unlike the protocol's developers.**  
  

[CertiK first spotted trouble](https://x.com/CertiKAlert/status/1855893120040497278) as multiple pools on Arbitrum started hemorrhaging funds due to a critical flaw in the periphery adaptor contract.  
  
Seems someone skipped the "check your inputs" lecture.

  

Within minutes, the attacker had drained $750K from Arbitrum – but they were just getting warmed up.

  

_Their next target? The protocol's Avalanche deployment, where another $4.1M would soon vanish. Different chain, same painful lesson._

  

**[DeltaPrime, in a rare display of speed, quickly confirmed](https://x.com/DeltaPrimeDefi/status/1855899502944903195) what everyone already knew: they'd been thoroughly rekt. Again.**

  

At this point, they should probably just laminate their "We've Been Exploited" announcement template.

  

But how did this overachieving exploiter school DeltaPrime for $4.85 million?  
  
The exploit combined two vulnerabilities with the elegance of a well-planned heist and the subtlety of a sledgehammer.  
  
**According to [CertiK's detailed analysis](https://www.certik.com/resources/blog/53e8FopQX9TTrTnMg3Mas6-deltaprime-incident-analysis), here's how DeltaPrime got schooled:**  
  

_The Arbitrum Exploit kicked off our exploiter's masterclass._  
  
**Attacker Address on Arbitrum:**  
[0xb87881637b5c8e6885c51ab7d895e53fa7d7c567](https://arbiscan.io/address/0xb87881637b5c8e6885c51ab7d895e53fa7d7c567)

A flash loan of 59.9 ETH set the stage, supplied to DeltaPrime like bait in a trap. 1.18 WBTC was borrowed and immediately redirected through a swap adapter to their attack contract.  
  
**Attack Contract on Arbitrum:**  
[0x52ee5c0ea2e7b38d4b24c09d4d18cba6c293200e](https://arbiscan.io/address/0x52ee5c0ea2e7b38d4b24c09d4d18cba6c293200e)

Using DeltaPrime's reward mechanism like a personal ATM, they retrieved their ETH collateral through an arbitrary input vulnerability.  
  

**First Blood on Arbitrum:**  
[0x9efe855cd3783462207ff8a3d94dc17a74e2b2f00bf1b4c8a7e0135dae83ab5c](https://arbiscan.io/tx/0x9efe855cd3783462207ff8a3d94dc17a74e2b2f00bf1b4c8a7e0135dae83ab5c)

**The stolen funds were initially aggregated into the following contract before being distributed:**  
[0x52EE5c0eA2E7b38D4B24c09D4d18cba6C293200e](https://arbiscan.io/address/0x52ee5c0ea2e7b38d4b24c09d4d18cba6c293200e)

**On Arbitrum, the $753K was split three ways:**  
[0x56e7f67211683857EE31a1220827cac5cdaa634C](https://arbiscan.io/address/0x56e7f67211683857EE31a1220827cac5cdaa634C) (49.91 ETH)  
[0x101723dEf8695f5bb8D5d4AA70869c10b5Ff6340](https://arbiscan.io/address/0x101723def8695f5bb8d5d4aa70869c10b5ff6340) (16.62 ETH)  
[0x21032a57bb6cfed765b7b5543fe00a3831b1325dacd3c42b6e98db033da8f5da](https://arbiscan.io/tx/0x21032a57bb6cfed765b7b5543fe00a3831b1325dacd3c42b6e98db033da8f5da)(2.96 WBTC bridged to Ethereum)  
  
**Not content with a mere appetizer, our exploiter turned their attention to Avalanche's richer hunting grounds with equal ease and nearly six times the payoff.**  
  
_Avalanche Massacre followed the same recipe._  
  
**Attacker Addresses on Avalanche:**  
[0xd5381c683191EB0999a51567274abAB73a9Df0AD](https://snowscan.xyz/address/0xd5381c683191eb0999a51567274abab73a9df0ad)[0xd3d535141831f6bd8b7df92e2ae0463d60af2413](https://snowscan.xyz/address/0xd3d535141831f6bd8b7df92e2ae0463d60af2413)

The periphery adaptor contract flaw proved just as fatal on a different chain.  
Another $4.1M vanished faster than promises of "guaranteed yields".

**First Avalanche Strike:**  
[0xece4efbe11e59d457cb1359ebdc4efdffdd310f0a82440be03591f2e27d2b59e](https://snowtrace.io/tx/0xece4efbe11e59d457cb1359ebdc4efdffdd310f0a82440be03591f2e27d2b59e)

**But here’s where this heist took an unexpected turn – rather than rushing off, our enterprising exploiter decided to put the stolen funds to work.**  
  
_On Avalanche, the stolen bounty found a new purpose, generating yield._

**Farming Operations:**

-   $600K of Staked USDC staked through Stargate
    
-   $518K USDC/USDT providing liquidity on LFJ
    
-   4,865 AVAX for good measure
    
-   49.68 WETH.e because diversification is key
    
-   6.34 BTC.b to round out the portfolio
    

  

**Stolen Funds on Avax:**  
[0xd5381c683191EB0999a51567274abAB73a9Df0AD](https://snowscan.xyz/address/0xd5381c683191eb0999a51567274abab73a9df0ad) (465.35 AVAX)  
[0xd3d535141831F6Bd8B7DF92E2AE0463D60Af2413](https://snowscan.xyz/address/0xd3d535141831f6bd8b7df92e2ae0463d60af2413) (69,401 AVAX)  
  
_Most exploiters treat stolen funds like a hot potato – tumbling, mixing, and sprinting for the hills faster than a validator during a network outage._  
  

**Not our ambitious apprentice. They've turned their stolen stash into a yield-farming empire, staking and earning with the confidence of someone who just found a genuine 100x gem (spoiler: they very rarely exist).**  
  

PeckShield's audits specifically flagged these vulnerabilities – meaning DeltaPrime had two shots at fixing their security and still managed to miss the target.  
  
Two audits, both explicitly warning about admin key vulnerabilities and input validation issues.  
  
Yet DeltaPrime chose to keep their crown jewels behind a single EOA instead of the recommended multi-sig setup – like leaving your front door key under the welcome mat after a security consultant told you twice to install a proper lock.  
  
[Peckshield Audit 1](https://github.com/DeltaPrimeLabs/deltaprime-primeloans/blob/dev/main/audits/PeckShield-Audit-Report-DeltaPrime-v1.0.pdf)

[Peckshield Audit 2](https://github.com/DeltaPrimeLabs/deltaprime-primeloans/blob/dev/main/audits/PeckShield-Audit-Report-DeltaPrime-v2.1.pdf)

**In a space where "audit" has become as meaningful as "guaranteed APY," at least DeltaPrime is consistent – consistently rekt.**  
  
_When your exploiter starts farming yields instead of running, maybe it's time to reconsider your security strategy?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_While DeltaPrime scrambles to explain their second security disaster in two months, their exploiter is casually farming yields like they're following an alpha caller's medium post._  
  
**The sheer audacity of staking stolen funds in public protocols suggests either supreme confidence or spectacular foolishness.**  
  
Then again, when you're dealing with a protocol that's been exploited twice in sixty days, maybe there's not much fear of consequences.  
  
DeltaPrime's vision of the future seems to involve watching their users' funds evaporate at an increasingly efficient rate.  
  

**With millions now being casually converted into yield-farming positions, the line between "exploit" and "aggressive portfolio management" grows thinner by the day.**  
  

_At this point, DeltaPrime might want to consider rebranding to "DeltaDecline" – or is that too optimistic given their current trajectory?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
