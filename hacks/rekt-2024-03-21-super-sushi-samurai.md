---
tags:
  - blockchain/arbitrum
  - has/audit
  - sector/gaming
  - sector/token
title: "Super Sushi Samurai - REKT"
protocol: "[[Super Sushi Samurai]]"
date: 2024-03-21
loss_usd: 4800000
auditors:
  - "[[Verichains]]"
source: "https://rekt.news/sss-rekt"
excerpt: "Blast L2-based game Super Sushi Samurai's LP drained $4.8m in contract bug exploit shortly after its launch, and the price dropped 99.9%."
genome:
  - "[[integer-bounds]]"
---
# Super Sushi Samurai - REKT

> **Loss:** $4,800,000 | **Date:** 2024-03-21 | **Audited by:** Verichains

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/sss2-header.png)

_While you were busy playing with your food, someone stole your lunch._

  

**Blast L2-based game Super Sushi Samurai's LP drained $4.8m in contract bug exploit shortly after its launch, and the price dropped 99.9%.**

Spreek [sounded the alarm](https://twitter.com/spreekaway/status/1770828396332769507) around 14:00 UTC and the Super Sushi Samurai team [responded within minutes](https://twitter.com/SSS_HQ/status/1770829048211546368), saying that they were pausing token transfers and investigating.

  

Half an hour after getting sliced and diced, the Super Sushi Samurai team [commented further](https://twitter.com/SSS_HQ/status/1770836683426062397) on the exploit:

  

_We have been exploited, it's mint related. We are still looking into the code. Tokens were minted and sold into the LP._

  

Gamma Strategies was hit with a [similar mint exploit](https://rekt.news/gamma-strategies-rekt/) earlier this year, resulting in a similar loss on Arbitrum.  
  
**Super Sushi Samurai’s code was audited, but failed to identify the infinite mint exploit.**  
  
_Will some of these protocols and auditing firms ever get this right or keep dropping the ball?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Spreek](https://twitter.com/spreekaway/status/1770828396332769507), [Super Sushi Samurai](https://twitter.com/SSS_HQ/status/1770829048211546368), [Coffeexcoin](https://twitter.com/coffeexcoin/status/1770834359601217886), [Sudo](https://twitter.com/pcaversaccio/status/1770840376636481833)_

The Super Sushi Samurai LP was drained due to a critical bug in the token contract that allowed users to double their token balance simply by transferring the entire balance to their own address.

  

_The [issue stemmed](https://twitter.com/coffeexcoin/status/1770834359601217886) from a coding oversight in the contract's transfer function. When transferring tokens, the contract subtracts the amount from the sender's balance before adding it to the recipient's balance. However, if the sender and recipient are the same address, the contract fails to account for the deducted amount, causing the balance to double instead of remaining unchanged._

  

**This exploitable loophole enabled the attacker to repeatedly double their balance and ultimately sell the artificially inflated holdings, resulting in a $4.8M loss for the project.**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/sssmint-rekt.png)

It only took the attacker around an hour to flip [$35 into $4.6M](https://dexscreener.com/blast/0x92f32553cc465583d432846955198f0ddcbcafa1). Quite a profit, isn’t it?

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/sss35to4-rekt.png)
Attacker Contract:
[0xDed85d83Bf06069c0bD5AA792234b5015D5410A9](https://blastscan.io/address/0xded85d83bf06069c0bd5aa792234b5015d5410a9)

  

Attacker Address: [0x6a89a8c67b5066d59bf4d81d59f70c3976facd0a](https://blastscan.io/address/0x6a89a8c67b5066d59bf4d81d59f70c3976facd0a)

  

Attack Transaction 1: [0x80012bf784b83baaf28f5549a9f233cae5f70be7afcd8f594dc757d431ed93c4](https://blastscan.io/tx/0xfa0b9e704296c1614c54f125e135f8b612b62c5c07f68a23a3179db738c027e4)

  

Attack Transaction 2: [0x62e6b906bb5aafdc57c72cd13e20a18d2de3a4a757cd2f24fde6003ce5c9f2c6](https://blastscan.io/tx/0x62e6b906bb5aafdc57c72cd13e20a18d2de3a4a757cd2f24fde6003ce5c9f2c6)

  

Attack Transaction 3: [0xac3400e3d536ac23c10fdd2c06e1faf8d5de5b797df8433e9b5ab74b102a4e35](https://blastscan.io/tx/0xac3400e3d536ac23c10fdd2c06e1faf8d5de5b797df8433e9b5ab74b102a4e35)

  

_However, the funds may not entirely be lost. The person who drained the funds [sent a message](https://blastscan.io/tx/0xda2ca81e2b89ce1ac5d1faeb331cd715af3902246d62195f7d9a95bd20e2abc1) saying that it was a [whitehat rescue hack](https://twitter.com/pcaversaccio/status/1770840376636481833). They provided details for contacting them and said that users should get reimbursed. The [project said](https://twitter.com/SSS_HQ/status/1770846767497564301) it had [reached out](https://blastscan.io/tx/0xfa0b9e704296c1614c54f125e135f8b612b62c5c07f68a23a3179db738c027e4) to the exploiter._

[Verichains](https://twitter.com/Verichains) was [responsible for the audit](https://docs.sss.game/quick-info/security) and missed the exploit.They let the contract go live with an infinite mint exploit.  
  
**Another audit, another exploit. Is it time to start auditing the auditing firms?**







![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)
_In the aftermath of the Super Sushi Samurai exploit, it's crucial for the crypto community to reflect on the importance of thorough security audits and the role of auditing firms in ensuring the safety of users' funds._

  

**The incident raises concerns about the effectiveness of current auditing practices, given that the contract was audited by Verichains but still went live with an infinite mint exploit.**

  

This event serves as a reminder for both projects and users to remain vigilant and ensure the highest security standards are being met.

Collaborative efforts should focus on improving smart contract development standards and establishing industry-wide best practices.

_It may be time for the industry to consider stricter auditing requirements and establish better mechanisms for identifying and addressing vulnerabilities in smart contracts._

By working together to develop more robust security measures and promoting transparency in the auditing process, the crypto community can foster an environment where users feel confident in the security of their investments.

Moreover, the Super Sushi Samurai incident should serve as a catalyst for reevaluating the relationships between projects and auditing firms.

**While the outcome of the Super Sushi Samurai incident remains uncertain, with the exploiter claiming to be a whitehat hacker and offering to reimburse affected users, it provides an opportunity to reevaluate and improve the overall security landscape.**


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
