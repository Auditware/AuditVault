---
tags:
  - blockchain/bitcoin
  - sector/dex
  - sector/multisig
  - sector/privacy
  - sector/stable
  - precondition/insider
title: "WazirX - Rekt"
protocol: "[[Wazirx]]"
date: 2024-07-18
loss_usd: 235000000
auditors:
source: "https://rekt.news/wazirx-rekt"
excerpt: "India's leading crypto exchange, WazirX took a massive $235 million hit when it's Safe multisig wallet crumbled under a devastating breach. How many times do we need to be reminded of not your keys, n"
genome:
  - "[[insider]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# WazirX - Rekt

> **Loss:** $235,000,000 | **Date:** 2024-07-18 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/wazirx-header.png)


_WazirX, India's leading crypto exchange, took a massive $235 million hit when it's Safe multisig wallet crumbled under a devastating breach._

  

**Cyvers [sounded the alarm](https://x.com/CyversAlerts/status/1813834131165286464) shortly after the attack, detecting multiple suspicious transactions being funded by Tornado Cash making moves on the platform.** 
  

They attempted to contact WazirX during the explicit, but it was too late, as the attacker was already swapping the stolen tokens to ETH and making their exit.  
  
Roughly half an hour later, [WazirX confirmed the security breach](https://x.com/WazirXIndia/status/1813843289940058446) and that they were pausing withdrawals.  
  
WazirX is sliding into number 7 on the [infamous Rekt Leaderboard](https://rekt.news/leaderboard/), right behind this year’s biggest hack, so far, [DMM Bitcoin](https://rekt.news/dmm-rekt/), which lost $304 million at the end of May.  
  
**DMM Bitcoin was another centralized exchange that fell victim to a multisig compromise.** 
  
_How many times do we need to be reminded of not your keys, not your crypto?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Cyvers](https://x.com/CyversAlerts/status/1813834131165286464), [WazirX](https://x.com/WazirXIndia/status/1813843289940058446), [Mudit Gupta](https://x.com/Mudit__Gupta/status/1813881385800913327), [ZachXBT](https://x.com/zachxbt/status/1813896332022882686), [Arkham Intel](https://x.com/ArkhamIntel/status/1813887774191231337)_

  
**The WazirX hack was a masterclass in patience and deception.**

  

According to a [technical breakdown provided by Mudit Gupta](https://x.com/Mudit__Gupta/status/1813881385800913327), the attackers began laying the groundwork at least 8 days before the main event, conducting small test transactions to set the stage.

  

Their target? WazirX's multisig wallet, which had six signatories, five from WazirX and one from Liminal, their custody provider. This was [confirmed by WazirX](https://x.com/WazirXIndia/status/1813981143437611440) in their preliminary report of the exploit.  
  
_Instead of a straightforward drain, the hackers opted for a more insidious approach. They set out to upgrade the multisig wallet to a malicious version under their control._

  

**To achieve this, they needed to overcome WazirX's security measures, which included Ledger Hardware Wallets for signatories and a whitelist policy for destination addresses.**

  

The attackers [likely compromised two of the four](https://x.com/Mudit__Gupta/status/1813881395368038645) required private keys directly. For the remaining two, they employed signature phishing, tricking signers into approving [what appeared to be a normal USDT transfer](https://etherscan.io/tx/0x8b99ae634e1e7180b3fcc66e8fe5d076351477077051a7bbf5ec626a9d0588ef).

  

This deception extended to Liminal's interface, where WazirX suspects a discrepancy between the displayed data and the actual transaction contents allowed the payload to be replaced.

  

**Minutes before the hack, a legitimate USDT transfer failed, a red flag that went unnoticed.**

  

Two of the four signatures were actually for upgrading the safe to the malicious contract, not for the USDT transfer.

  

_With all pieces in place, the hackers executed their exploit._

  

**Using the two compromised keys and the two phished signatures, they [successfully upgraded the multisig](https://etherscan.io/tx/0x48164d3adbab78c2cb9876f6e17f88e321097fcd14cadd57556866e4ef3e185d) to their malicious contract.**

  

Critically, one of the phished signatures came from Liminal Custody, the co-signer responsible for final checks.

  

This suggests a significant failure in Liminal's verification process, a vulnerability the attackers exploited to devastating effect.

  

**With the upgrade complete, the attackers gained full control of the wallet, allowing them to drain funds at will.**  
  
_ZachXBT's investigation [revealed a complex trail of transactions](https://x.com/zachxbt/status/1813896332022882686), broken down into a timeline as follows..._  
  
**July 8th:**

  

**A ChangeNOW hot wallet sent two transactions to this address:**
[0xC891b507A7c109179d38E2Cb4DE6CD8Dc70D2ad4](https://etherscan.io/address/0xc891b507a7c109179d38e2cb4de6cd8dc70d2ad4)

  

**2 Transactions:**

**0.36 ETH:** [0xc2fdc27f98cf02c2da2a180fa35824dc365c63795e7a7ce12ba88c1e06edd4f7](https://etherscan.io/tx/0xc2fdc27f98cf02c2da2a180fa35824dc365c63795e7a7ce12ba88c1e06edd4f7)

**0.66 ETH:**  [0xa62685d8a8b39920e957e0aaf56d527aec6d65bc9323d3d219e11f44e150e224](https://etherscan.io/tx/0xa62685d8a8b39920e957e0aaf56d527aec6d65bc9323d3d219e11f44e150e224)

  

**Timing analysis suggests these funds originated from Bitcoin transactions:**
[53795dd1629026c2f92a87d5cd2447736f1afc9cae71262f3af9e62a4ac83b92](https://explorer.btc.com/btc/transaction/53795dd1629026c2f92a87d5cd2447736f1afc9cae71262f3af9e62a4ac83b92)

[ddfd189125ce88c622ec2453b2e9f2dbe5c5c0931f16e3389eac4976c757e5b9](https://explorer.btc.com/btc/transaction/ddfd189125ce88c622ec2453b2e9f2dbe5c5c0931f16e3389eac4976c757e5b9)

  

**Address [0xc687](https://etherscan.io/address/0xc6873ce725229099caf5ac6078f30f48ec6c7e2e) received 1 ETH from Tornado Cash:**

[0xe3b4cf64e0fc25fafb10d226984b18addc038879ed77f730abbed4737db6a5fc](https://etherscan.io/tx/0xe3b4cf64e0fc25fafb10d226984b18addc038879ed77f730abbed4737db6a5fc)

  

**The matching 1 ETH deposit to Tornado Cash was made 9 hours before:**

[0x87c01ca1f56ef3663651b05cd8ebcf133281c5fdd0ef1016f83a16a862c4a235](https://etherscan.io/tx/0x87c01ca1f56ef3663651b05cd8ebcf133281c5fdd0ef1016f83a16a862c4a235)

**July 9th:**

  **Addresses [0xc687](https://etherscan.io/address/0xc6873ce725229099caf5ac6078f30f48ec6c7e2e) and [0xc891](https://etherscan.io/address/0xc891b507a7c109179d38e2cb4de6cd8dc70d2ad4) transferred funds to each other, potentially compromising their Tornado Cash privacy.**

  

**Transaction 1:**  

[0x5a7e3b2b2425b17ab8afe5aee06245e30d935598b16f1c06958cac50d8fe7948](https://etherscan.io/tx/0x5a7e3b2b2425b17ab8afe5aee06245e30d935598b16f1c06958cac50d8fe7948)

  

**Transaction 2:**

[0xd43c39187f1fdd904b6e1b4da53a1c9bb7ca19a0fc7adcb0dfbbbe732c244f33](https://etherscan.io/tx/0xd43c39187f1fdd904b6e1b4da53a1c9bb7ca19a0fc7adcb0dfbbbe732c244f33)

  

**July 10th:**

  

**Six deposits of 0.1 ETH each were made to Tornado Cash from this address:**
  [0xc6873ce725229099caf5ac6078f30f48ec6c7e2e](https://etherscan.io/address/0xc6873ce725229099caf5ac6078f30f48ec6c7e2e)

  

**The main attack address received 6 x 0.1 ETH from Tornado Cash:**

[0x6EeDF92Fb92Dd68a270c3205e96DCCc527728066](https://etherscan.io/address/0x6EeDF92Fb92Dd68a270c3205e96DCCc527728066)

  

**The attack address began test transactions involving ETH, SHIB and USDT with the [0x09b](https://etherscan.io/address/0x09b33e75e51ae9a30eca4b65db76e511199af664) multisig:**  
  

**ETH Transaction:**
[0xc6cb4c0726efd4f9015924e7d528e19362c01e8d3a4e77bf78f073cf963a2bc2  ](https://etherscan.io/tx/0xc6cb4c0726efd4f9015924e7d528e19362c01e8d3a4e77bf78f073cf963a2bc2)

**SHIB Transaction:**
[0x1455f995980056cf1ddb5bba4a848800b0770caadc11e259a815562721fc2bcd](https://etherscan.io/tx/0x1455f995980056cf1ddb5bba4a848800b0770caadc11e259a815562721fc2bcd)

  
**USDT Transaction:**
[0xc850b252ab32d80203991c9b5359205e917c94c94d3c47d04d8b153453b1e2b2  
](https://etherscan.io/tx/0xc850b252ab32d80203991c9b5359205e917c94c94d3c47d04d8b153453b1e2b2)

**July 18th (Attack Day):**

  

**The attack was executed on the WazirX Wallet:** [0x27fD43BABfbe83a81d14665b1a6fB8030A60C9b4](https://etherscan.io/address/0x27fd43babfbe83a81d14665b1a6fb8030a60c9b4)

  

**This address was used to trigger smart contract calls:** [0x6EeDF92Fb92Dd68a270c3205e96DCCc527728066](https://etherscan.io/address/0x6EeDF92Fb92Dd68a270c3205e96DCCc527728066)


**This address was used to drain funds:**
[0x04b21735E93Fa3f8df70e2Da89e6922616891a88](https://etherscan.io/address/0x04b21735E93Fa3f8df70e2Da89e6922616891a88)

  
  
**Flow of Funds:**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/wazirx-funds.png)


**In a twist that would make a spy novelist proud, [ZachXBT solved an Arkham bounty](https://x.com/ArkhamIntel/status/1813887774191231337) by [identifying a KYC exchange deposit](https://platform.arkhamintelligence.com/explorer/tx/0x0056ae85c2eef7705e8818095cabe8244ced0299456ce30170e89fb6dfe4f1e3) made by the WazirX hacker.**

  
This intricate web of transactions reveals the meticulous planning and execution behind the WazirX hack.  
  
The attackers' use of privacy tools, test transactions, and multiple addresses demonstrates a level of sophistication not seen in most crypto heists.  
  
**[Mudit Gupta made a good point](https://x.com/Mudit__Gupta/status/1813881385800913327) in his analysis, “It's a very methodical and organized attack, pointing towards DPRK as the hacker.”**  
  
This has yet to be confirmed, but you never know…  
  
_Could this be another case of state-sponsored crypto theft?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



**This $235 million heist not only shakes user confidence but also raises questions about the efficacy of current custody solutions and multisig implementations.**
  

_In a world where even the most robust security measures can be bypassed, is entrusting large sums to any single entity, no matter how reputable, a risk worth taking?_

  
The rise of sophisticated, possibly state-sponsored attacks adds a chilling new dimension to an already treacherous landscape.  

With data breaches becoming the norm, the rise of phishing attacks and compromised private keys and multisig a rising concern lately.  
  
We have to ask, where is it safe to store our funds?  
  
**The short answer is obviously not centralized exchanges.** 
  
_Is the only path forward a world where every user becomes their own bank, guardian and last line of defense?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
