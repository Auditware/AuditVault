---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/token
  - has/audit
  - vuln/reentrancy/single-function
  - novelty/known-pattern
title: "Clober Dex - Rekt"
protocol: "[[Clober Dex]]"
date: 2024-12-10
loss_usd: 500000
auditors:
  - "[[Kupia Security]]"
source: "https://rekt.news/cloberdex-rekt"
excerpt: "$500k vanished from Clober DEX when code changes met one of DeFi's oldest vulnerabilities. The twist? The exploit code wasn't there during the audits. Some security lessons write themselves."
genome:
  - "[[single-function]]"
  - "[[known-pattern]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[reentrancy-guard]]"
---
# Clober Dex - Rekt

> **Loss:** $500,000 | **Date:** 2024-12-10 | **Audited by:** Kupia Security

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/clober-rekt-header.png)


_Clober Dex got clobbered._

  

**Clober DEX's Liquidity Vault bled $500k yesterday when attackers exploited a vulnerability as old as DeFi itself - reentrancy.**

  

The protocol's team had rolled out fresh code changes without proper security review, accidentally leaving their vault door wide open.

  

Trust Security and Kupia had done their due diligence, auditing the original contract thoroughly, but Clober's post-audit modifications rendered their work meaningless.

  

Like a horror movie victim who decides to investigate the strange noise alone, Clober walked right into one of crypto's most notorious traps.

  

**The story serves as a textbook example of how not to handle protocol security - deploy first, think later.**

  
_When will projects learn that audits aren't magical shields against their own rushed decisions?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Clober Dex](https://x.com/cloberdex/status/1866426442294469033), [Nick Franklin](https://x.com/0xNickLFranklin/status/1866484588480168045), [Peckshield](https://x.com/peckshield/status/1866443215186088048), [Kupia Security](https://x.com/KupiaSecurity/status/1866489735536840824), [Trust Security](https://x.com/trust__90/status/1866486611808002402), [Raz0r](https://x.com/theRaz0r/status/1866440583276839074)_

**Some thieves bring a crowbar, others just need a callback.**  
  
Some protocols still can't resist leaving their security checks unchecked.

  

Clober Dex learned this the hard way when their Liquidity Vault bled $500k in yet another reentrancy exploit.

  

While most of crypto slept, one attacker found their opening through a simple exploit.

  

_By the time anyone noticed, 133 ETH was already on the move._

  

**Like clockwork, [Clober's team rushed to Twitter](https://x.com/cloberdex/status/1866426442294469033) with the familiar "URGENT: Security Breach Alert" playbook.**

  

They assured users that while their Liquidity Vault had been compromised, the core protocol remained unscathed.

  

Stop me if you've heard this one before - another reentrancy exploit making its rounds through DeFi.

  

According to the breakdown [provided by Nick Franklin](https://x.com/0xNickLFranklin/status/1866484588480168045), the attacker's recipe was depressingly simple: find the unguarded _burn function, abuse its burnHook callback, and watch the ETH flow.

  

_Using their own malicious token contract and a custom strategy, they orchestrated a dance of incomplete state updates and multiple withdrawals, waltzing away with 133 ETH._

  

**Attack transaction:** [0x8fcdfcded45100437ff94801090355f2f689941dca75de9a702e01670f361c04](https://basescan.org/tx/0x8fcdfcded45100437ff94801090355f2f689941dca75de9a702e01670f361c04)

  

**Attacker Address:**
[0x012Fc6377F1c5CCF6e29967Bce52e3629AaA6025  ](https://basescan.org/address/0x012fc6377f1c5ccf6e29967bce52e3629aaa6025)

The stolen funds didn't stay still for long.

  

[PeckShield tracked the attacker's movements](https://x.com/peckshield/status/1866443215186088048) as they bridged the 133 ETH from Base to Ethereum mainnet, splitting the spoils between two addresses.  
  
**Stolen funds sent to:**

  

[0x711C87A0767101Fa6f3893FACb670B5689621e23](https://etherscan.io/address/0x711C87A0767101Fa6f3893FACb670B5689621e23)

  

[0x7760d838192f6E526721a0f6b160627baE989a3e](https://etherscan.io/address/0x7760d838192f6E526721a0f6b160627baE989a3e)

  

**As fingers pointed and questions flew, attention turned to the protocol's security history.**  
  
_The aftermath revealed a complex web of audit histories._

  

Trust Security, who had audited the original contract, were [quick to distance themselves from the carnage](https://x.com/trust__90/status/1866486611808002402):

  

“A post-audit code change introducing the reentrancy attack was audited by another firm.”

  

[Trust Security Audit](https://github.com/clober-dex/clober-rebalancer/blob/master/audits/Clober_Rebalancer_v03.pdf)

  

_Meanwhile, the other firm, [Kupia Security found themselves caught](https://x.com/KupiaSecurity/status/1866489735536840824) in the crossfire after revealing they'd flagged potential issues with malicious strategies – though [Clober insisted](https://x.com/CloberDEX/status/1866494762859319547) this was "NOT related to the reentrancy attack."_

  

**Adding another layer to the story, Kupia Security had completed their own audit [just days before the exploit](https://x.com/KupiaSecurity/status/1865733776736931950).**

  

They had [raised concerns about potential issues](https://x.com/KupiaSecurity/status/1866489236221784405) with malicious strategies in the Rebalancer contract, though Clober maintained these warnings were unrelated to the actual exploit.  
  
[Kupia Security Audit  ](https://github.com/KupiaSec/portfolio/blob/main/reports/pdf/2024-12-clober-rebalancer.pdf)

[According to Raz0r](https://x.com/theRaz0r/status/1866440583276839074) from Decurity, the vulnerable burnHook call appeared to be a post-audit addition - a critical detail that might explain how such a well-known vulnerability slipped through the cracks.

  

A familiar pattern emerged: different audit findings, post-audit changes, and somewhere in between, basic security practices slipped through the cracks.

  

**In the end, Clober did what every recently exploited protocol does - [offered the attacker a 20% bounty](https://etherscan.io/tx/0xce542e1c1faebbf81e5b6f5726f358da7082833be19cbbea060cdd01408a0165) and promised not to press charges.**  
  
_But when protocols treat audits like checkboxes and deploy code without review, who's really to blame when the callbacks come home to roost?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_Call them audits, reviews, or security checks - they mean nothing without proper deployment practices._

  

**Projects rush to tout their security partnerships while quietly pushing unreviewed changes.**

  

Each reentrancy exploit feels like a rerun, yet protocols keep falling for the same tricks.

  

Trust Security and Kupia did their jobs, flagging issues and reviewing code.

  

Yet somewhere between their reports and deployment, basic security measures vanished into thin air.

  

The carnage that followed serves as another testament to crypto's goldfish memory when it comes to security.

  

**Maybe next time a protocol considers deploying unchecked code, they'll remember Clober's $500k lesson.**

  

_But with DeFi's track record, why wait for the next victim when we could just check the callbacks?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
