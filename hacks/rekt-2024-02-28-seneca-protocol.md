---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - has/audit
  - sector/dex
  - sector/multisig
title: "Seneca Protocol - REKT"
protocol: "[[Seneca Protocol]]"
date: 2024-02-28
loss_usd: 6400000
auditors:
  - "[[Halborn]]"
source: "https://rekt.news/seneca-protocol-rekt"
excerpt: "Over $6.4 million was stolen from users wallets on February 28, thanks to the bad tao of Seneca. Roughly 80% of the funds were returned within a day. Clearly Seneca knew there were issues, but chose t"
genome:
  - "[[fot-slippage]]"
---
# Seneca Protocol - REKT

> **Loss:** $6,400,000 | **Date:** 2024-02-28 | **Audited by:** Halborn

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/seneca-header.png)

**Over $6.4 million was stolen from users wallets on February 28, thanks to the bad tao of Seneca.**

First [reported by spreekaway](https://twitter.com/spreekaway/status/1762857769714012217) on X, the attack involved a critical approval exploit,  affecting users on Arbitrum and Ethereum.

_Roughly 80% of the funds were returned within a day, but the remainder has been transferred to 2 addresses, possibly as a bounty._
  
During the canceled audit contest this past November, a security researcher [caught the same bug](https://twitter.com/cawfree/status/1762895548426715419/photo/1) behind the attack.

**“Seneca is using battle-tested code, publicly verifiable on [Seneca's GitHub](https://github.com/SenecaDefi/SenecaProtocol).” Seneca made this statement on X shortly after [abruptly closing](https://twitter.com/SenecaUSD/status/1724882009820893401) their [Sherlock audit contest](https://twitter.com/sherlockdefi/status/1721863251946856639) due to potential code licensing issues.**  
  
Weeks later they went into battle and launched without fear, under the belief that they had enough armor thanks to the [audit done by Halborn](https://github.com/HalbornSecurity/PublicReports/blob/master/Solidity%20Smart%20Contract%20Audits/Seneca_SenecaDefi_Smart_Contract_Security_Assessment_Report_Halborn_Final.pdf)  Security.

The source of the bug, the Chamber contract, was audited prior to deployment, according to Seneca. To note, some of Halborn’s findings were approval related, this exact issue was not highlighted.

Clearly the other warriors on the battlefield were up for the challenge, because it only took them less than 2 months to find cracks in Seneca’s armor.

_Post-hack, others in the community claimed they were getting [booted from Discord](https://twitter.com/danielvf/status/1762862834252210224) for reporting the bug._  
  
**Clearly Seneca knew there were issues, but chose the reckless route.**

Revoke approvals if you were unfortunate to invest in this disaster.

Ethereum:

PT-ezETH: 0x529eBB6D157dFE5AE2AA7199a6f9E0e9830E6Dc1

apxETH: 0xD837321Fc7fabA9af2f37EFFA08d4973A9BaCe34

PT-weETH: 0xBC83F2711D0749D7454e4A9D53d8594DF0377c05

PT-rsETH: 0x65c210c59B43EB68112b7a4f75C8393C36491F06

Arbitrum:

PT-weETH: 0x11446bbb511e4ea8B0622CB7d1437C23C2f3489b

stEUR: 0x7C160FfE3741a28e754E018DCcBD25dB04B313AC

PT-aUSDC: 0x4D7b1A1900b74ea4b843a5747740F483152cbA5C

wstETH: 0x2d99E1116E73110B88C468189aa6AF8Bb4675ec9

PT-rsETH: 0x2216E32006BB80d20f7906b88876964F9AF68aFb

  
**Bad decisions or just another bad protocol?**  
  
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)  
Credit: _[Crypto Smith](https://twitter.com/0xAdamDecentral/status/1762893022302495224), [Seneca](https://twitter.com/SenecaUSD/status/1762886130561630227), [Spreek](https://twitter.com/spreekaway/status/1762857769714012217), [Beosin Alert](https://twitter.com/BeosinAlert/status/1763024503452611038)_

The exploit took advantage of a bug in Seneca's code to drain assets from users who had active approvals to certain contracts.

**The attacker used constructed calldata parameters to call transferfrom and transfer tokens that were approved to the project's contracts to the attacker's address.**

This allowed the exploiter to steal any undeployed LSTs from the user's wallet.

_Contracts couldn’t be paused due to a [bad implementation](https://twitter.com/peckshield/status/1762870782495985750) of the pause function. Because the pause and unpause [functions are internal](https://twitter.com/ddimitrovv22/status/1762886306420379864), there is no way to call them._  
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/seneca-transactions.png)


_The exploiter even stole 50k senUSD from the [Seneca’s team’s address](https://arbiscan.io/tx/0x3fe4b1486f2a800aa39131b359c0fc4fda0f4aaf621710c6b6754b4107a00fd1). 50K that was approved [33 days earlier](https://arbiscan.io/tx/0x10857f92ac51ee6c6a4d8ce451cb2a52ec776c2e85457bee84bbb44bf13d1010), but never deployed. Should we wonder why?_  
  
**Over 1.9k of ETH was stolen involving various LSTs that were swapped for ETH. Currently being held in 3 addresses.**  
  
Exploiter addresses 1: [0x94641c01a4937f2c8ef930580cf396142a2942dc](https://etherscan.io/address/0x94641c01a4937f2c8ef930580cf396142a2942dc)

Exploiter addresses 2: [0x5217c6923a4efc5bcf53d9a30ec4b0089f080ed0](https://etherscan.io/address/0x5217c6923a4efc5bcf53d9a30ec4b0089f080ed0)Exploiter addresses 3: [0xe83b072433f025ef06b73e0caa3095133e7c5bd0](https://etherscan.io/address/0xe83b072433f025ef06b73e0caa3095133e7c5bd0)

Example attack tx: [0x9f371267](https://etherscan.io/tx/0x9f3712672be7a120757d42fbe15ceefe9578914946bacbd0f3531e7fb7305576)

_Seneca [addressed the exploit](https://twitter.com/SenecaUSD/status/1762886130561630227) a few hours after. Instructing users to revoke approvals. But the damage was already done._  
  
**A few hours later, Seneca posted an [onchain](https://etherscan.io/tx/0x6e81e21ae6345279060de5c2c27378e2dca4c27a83615c8d835d218c4f66ffbd) message [on X](https://twitter.com/SenecaUSD/status/1762999045109248461) addressing a Whitehat, requesting the funds be returned for a 20% bounty.**  
  
Shortly after, the [hacker returned](https://twitter.com/SenecaUSD/status/1763181438113865960) 1,537 ETH to the [Gnosis Safe address](https://etherscan.io/address/0xb7aF0Aa318706D94469d8d851015F9Aa12D9c53a) and transferred 300 ETH to 2 new addresses.  
  
Address 1: [0x0C77350C4BDe539FfCee261A149dbc6e6afDA517](https://etherscan.io/address/0x0c77350c4bde539ffcee261a149dbc6e6afda517)

Address 2: [0xa07c64E55F52AAf5c361321CF01b316eCbddB5A9](https://etherscan.io/address/0xa07c64e55f52aaf5c361321cf01b316ecbddb5a9)

They claim a [post-mortem](https://twitter.com/SenecaUSD/status/1762920309919740307) will be published once all of the information is collected.

The exploiter's address behind the attack was [funded](https://etherscan.io/tx/0x88f54ae9606ebf3632f65a94a2fe4676cca59ab2eb8931f3d61fc0fd615db132) 5 months ago through [FixedFloat](https://fixedfloat.com/). It remained dormant, until shortly before the attack was carried out on Seneca.  
  
Follow the [flow of funds](https://metasleuth.io/result/eth/0x94641c01a4937f2c8ef930580cf396142a2942dc?source=8cf443b6-176d-4202-8122-a8b641ee7062):  
![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/seneca-funds.png)

  
**Will Seneca do their due diligence or continue the pattern of irresponsibility?**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)  
  
The warning signs were there from [several](https://twitter.com/qedk_/status/1762903467255853394) in the Web3 security community. Everybody sounded the alarm, except Seneca.  
  
_Seneca acted bulletproof with their battle tested (i.e. forked) code. A team member, in a since [deleted Tweet](https://twitter.com/0xTaylor_/status/1762901759805284607) bragged about their pristine code, all while trashing Sherlock in the process._  
  
**Claiming [no legal liability](https://twitter.com/0xAdamDecentral/status/1762895194893201466) is a nice shady cherry on top of this hot mess.**  
  
There is a thin line between cockiness and ignorance and Seneca fell face first on one side. Which side do you think it is?

_Maybe they should have spent more time getting their code locked tight instead of [marketing](https://twitter.com/SenecaUSD/status/1762857953730719991) a broken project._  
  
There is no such thing as having too many eyes on your code. The more audits, contests and security reviews the better.

_The worst case scenario was likely avoided, thanks to the attacker returning most of the funds, but this could have been avoided._  
  
If you don’t pay the white hats to try to break your code, they'll be forced to make an example of you.  
  
**But given the way Seneca handled this situation, can you blame them?**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
