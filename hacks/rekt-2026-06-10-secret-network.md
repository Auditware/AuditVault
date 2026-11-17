---
tags:
  - type/hack
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/stable
  - web3-sector/token
  - vector/bridge-exploit
title: "Secret Network - Rekt"
protocol: "Secret Network"
date: 2026-06-10
loss_usd: 4670000
audit: "N/A"
source: "https://rekt.news/secret-network-rekt"
excerpt: "$4.67 million lost from Secret Network’s bridge connection to Axelar Network after a forked Secret-side IBC contract minted unbacked tokens from thin air. 2 missing validation checks let an attacker f"
---
# Secret Network - Rekt

> **Loss:** $4,670,000 | **Date:** 2026-06-10 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/secret-network-rekt-header.png)




_[$4.67 million left Secret Network on June 10th](https://www.commonprefix.com/blog/secret-network-exploit). It took seven days for anyone to notice._

  

**A bridge contract [forked from Secret's standard snip20-ics20 implementation in 2023](https://www.commonprefix.com/blog/secret-network-exploit), with [two security checks quietly removed and never replaced](https://www.commonprefix.com/blog/secret-network-exploit), and [open-sourced on GitHub](https://github.com/scrtlabs/ics20-for-axelar) the entire time, [minted seven different tokens from thin air and redeemed them for real assets in eighteen minutes](https://www.commonprefix.com/blog/secret-network-exploit).**  
  
No alerting system flagged it. No pause mechanism triggered. [No audit had ever been requested for the fork](https://www.commonprefix.com/blog/secret-network-exploit).  
  
[The funds were consolidated, swapped, and split into about 30 transfers](https://www.commonprefix.com/blog/secret-network-exploit), before being deposited at exchanges, all before anyone thought to check the Axelar escrow account.  
  
**[The first sign was a failed transaction on June 17th](https://www.commonprefix.com/blog/secret-network-exploit), when a routine cross-chain transfer failed because the escrow account no longer had enough funds.** 
  
_When the only thing that caught a $4.67 million drain was a failed transaction seven days later, where was the monitoring?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Common Prefix](https://www.commonprefix.com/blog/secret-network-exploit), [F12](https://x.com/f12sec/status/2067992040181322190), [Secret Network](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995), [Axelar Network](https://x.com/axelar/status/2067965810174214451), [Yi](https://x.com/SuplabsYi/status/2068085389534126454), [Rarma](https://x.com/Rarma_/status/2068551985217806355), [Ray Raspberry](https://x.com/RayRaspberry1/status/2069536677152862409)_

**Nobody found it, it found them.**  
  

[On June 17th at 15:39 UTC](https://www.commonprefix.com/blog/secret-network-exploit), seven days after the June 10th exploit, [a routine cross-chain transfer on Axelar failed](https://www.commonprefix.com/blog/secret-network-exploit).  
  
**[The error message was routine](https://www.commonprefix.com/blog/secret-network-exploit):** “unable to unescrow tokens, this may be caused by a malicious counterparty module or a bug: please open an issue on counterparty module: spendable balance 803200wbtc-satoshi is smaller than 1000000wbtc-satoshi: insufficient funds.”  
  
[More tokens were trying to bridge out of Secret](https://www.commonprefix.com/blog/secret-network-exploit) than had ever bridged in.

  
_[Twenty-one minutes later the team confirmed the IBC escrow account for the Secret-SNIP connection](https://www.commonprefix.com/blog/secret-network-exploit) had been drained._  
  
**By 16:48, [they had traced it back to seven IBC transactions on June 10th](https://www.commonprefix.com/blog/secret-network-exploit), all to a single wallet.** 
  

The exploit had occurred seven days earlier. Nothing had flagged it.  
  

On Secret Network, [balances and transaction details are encrypted by default](https://docs.scrt.network/secret-network-documentation/introduction/secret-network-techstack/privacy-technology), so the [shortfall was not visible on-chain until a June 17 cross-chain transfer failed](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995), and the team then confirmed the IBC escrow account for the Secret-SNIP connection had been drained.  
  

**[Security researcher F12 put it plainly on June 19th](https://x.com/f12sec/status/2067992040181322190):** "No exploit tx: Secret is a privacy chain, transfers and balances are encrypted, so the hack isn't visible on-chain."  
  

_That seven-day window was not a consequence of the attacker's sophistication. It was a consequence of the environment they chose to operate in._  
  
**By the time the error message surfaced, [the funds had already been consolidated into ETH, split across thirty wallets, and deposited at three exchanges](https://www.commonprefix.com/blog/secret-network-exploit). The window to intervene had long closed.**  
  

[Axelar Network publicly disclosed the incident on June 19th](https://x.com/axelar/status/2067965810174214451). Their emergency committee disabled the Secret and Secret-SNIP connections.

[ ](https://www.commonprefix.com/blog/secret-network-exploit)According to Common Prefix, [Squid removed Secret Network from its frontend](https://www.commonprefix.com/blog/secret-network-exploit).  
  
Law enforcement [was notified](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995).  
  

**Secret Network's privacy protected its users for years. On June 10th, it protected someone else, and nobody knew until the money was already gone.**  
  
_So who exactly bears responsibility for building a monitoring system capable of seeing through the dark?_

  
### Two Missing Lines

 
_[A fork of Secret's standard snip20-ics20 implementation, open-sourced on GitHub since January 2023](https://www.commonprefix.com/blog/secret-network-exploit), was adapted for Axelar by switching from an escrow model to one that mints wrapped tokens on receipt, a change that required removing two functions that only made sense in the original architecture._  
  

**Vulnerable Contract:**
[secret1yxjmepvyl2c25vnt53cr2dpn8amknwausxee83](https://zonescan.io/secret/accounts/secret1yxjmepvyl2c25vnt53cr2dpn8amknwausxee83)

  
The first removed function, [parse_voucher_denom(&msg.denom, &packet.src)](https://www.commonprefix.com/blog/secret-network-exploit), would have validated that the incoming token's denomination path matched the actual source channel of the packet.  
  

The second, [reduce_channel_balance(...)](https://www.commonprefix.com/blog/secret-network-exploit), would have capped minting to the amount that channel had genuinely deposited.  
  
**Both were gone. [What replaced them was an allow-list](https://www.commonprefix.com/blog/secret-network-exploit):** If the token name appeared on the approved list, the contract minted.

_**[Yi traced it precisely in a fourteen-part thread on June 19th](https://x.com/SuplabsYi/status/2068085389534126454):** "The contract asks 'is this denom supported?' It does not ask 'is this packet authorized?'"_  
  

**[Because opening an IBC channel is permissionless by design](https://www.commonprefix.com/blog/secret-network-exploit), the attacker needed nothing else.**  
  
[The attacker forged deposits from a counterfeit chain](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995), opened a fresh IBC channel to the Secret-side contract, and sent packets carrying the approved token denominations.  
  
[The contract asked only whether the denom was supported](https://www.commonprefix.com/blog/secret-network-exploit), not whether the packet was authorized.  
  

The bug traces back to [the repository's initial commit on January 15, 2023](https://www.commonprefix.com/blog/secret-network-exploit). It [deployed to mainnet on March 30, 2023](https://www.commonprefix.com/blog/secret-network-exploit).  
  
_[A routine migration on March 5, 2026](https://www.commonprefix.com/blog/secret-network-exploit), updated the bytecode for new features and carried the same missing checks forward, untouched._  
  
**No independent audit [was commissioned for the fork](https://www.commonprefix.com/blog/secret-network-exploit).**  
  
Three years, one integration and it appears that no one even bothered to look.  
  

**[Rarma put it without ceremony](https://x.com/Rarma_/status/2068551985217806355):** "Secret Network let a couple of commented lines drain their Axelar-bridged TVL for $4.67M. It's been in their open-source repo since 2023."  
  

**For three years the contract asked only whether a denom was allowed, not whether the packet was authorized.**  
  
_So who, exactly, was reading?_

  

### Permissionless Drain

  
_The attacker spent most of June 10th on preparation._

**[Between 06:50 and 18:54 UTC they created light clients](https://www.commonprefix.com/blog/secret-network-exploit), opened test channels, moved small amounts of native funds, and probed the exit route.**  
  
Twelve hours of reconnaissance against a contract that had been sitting in plain sight for three years.  
  

[At 19:01 UTC they created the live client for their fake chain](https://www.commonprefix.com/blog/secret-network-exploit), ID ibc-dev-allowlist-denom-1.  
  
[By 19:05 they had opened channel-227](https://www.commonprefix.com/blog/secret-network-exploit) directly to the bridge contract.  
  
[At 19:14 the first forged packet landed](https://www.commonprefix.com/blog/secret-network-exploit), at [19:20 the last one cleared](https://www.commonprefix.com/blog/secret-network-exploit).  
  
_Seven tokens, [each minted to the current total locked value of its saToken](https://www.commonprefix.com/blog/secret-network-exploit), with nothing backing them, in six minutes._

**Between [19:33 and 19:36 UTC](https://www.commonprefix.com/blog/secret-network-exploit) the attacker pushed all seven unbacked saTokens back through [channel-61](https://www.commonprefix.com/blog/secret-network-exploit) to Axelar, and Axelar's [channel-69](https://www.commonprefix.com/blog/secret-network-exploit) escrow account unlocked the equivalent amount of real assets automatically.**  
  
Axelar's escrow released real assets automatically. [Secret Network’s Security Incident Report describes no alert, pause, or circuit-breaker response during this phase.](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995)From there, [18 IBC transfers in three batches between 19:38 and 19:56 UTC moved everything through Osmosis via packet-forwarding](https://www.commonprefix.com/blog/secret-network-exploit), then bridged to Ethereum and [consolidated into approximately 2,350 ETH on CoW Protocol between 20:04 and 20:15 UTC](https://www.commonprefix.com/blog/secret-network-exploit).

**[Thirty transfers of 50 to 139 ETH followed across the next thirteen hours](https://www.commonprefix.com/blog/secret-network-exploit), each going to a fresh wallet, all forwarding onward.**  
  
_[The attacker added fake ERC-20 tokens with Unicode symbols mimicking ETH and BNB to clutter the trail](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995), a cosmetic move that added noise without hiding much._

**Attacker's Ethereum Wallet:**
[0x6c2eAB82bA2897A6E99FB6Af018020dA15123976](https://etherscan.io/address/0x6c2eAB82bA2897A6E99FB6Af018020dA15123976)

**[The proceeds resolved to three exchanges](https://www.commonprefix.com/blog/secret-network-exploit):** KuCoin, ChangeNow, and HitBTC.  
  
[KuCoin received approximately 1,199 ETH](https://www.commonprefix.com/blog/secret-network-exploit), a KYC exchange with subpoena-able records.

[ChangeNow received approximately 1,050 ETH](https://www.commonprefix.com/blog/secret-network-exploit), a non-KYC instant swap where funds convert and vanish.

_[HitBTC received approximately 100 ETH](https://www.commonprefix.com/blog/secret-network-exploit)._  
  
**Roughly [170 ETH remained unattributed](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995).**

**KuCoin Hot Wallet:**
[0x45300136662dd4e58fc0df61e6290dffd992b785](https://etherscan.io/address/0x45300136662dd4e58fc0df61e6290dffd992b785)  
  
**ChangeNow Wallet:**
[0xeba88149813bec1cccccfdb0dacefaaa5de94cb1](https://etherscan.io/address/0xeba88149813bec1cccccfdb0dacefaaa5de94cb1)  
  
**HitBTC Wallet:**
[0x80787af194c33b74a811f5e5c549316269d7ee1a](https://etherscan.io/address/0x80787af194c33b74a811f5e5c549316269d7ee1a)  
  
**CoW Protocol Settlement Contract:**
[0x9008d19f58aabd9ed0d60971565aa8510560ab41](https://etherscan.io/address/0x9008d19f58aabd9ed0d60971565aa8510560ab41)

**Attacker's Secret Wallet:**
[secret154pdez8zazqh26wyuyu70nqraal3hkvf2f03vm](https://www.mintscan.io/secret/address/secret154pdez8zazqh26wyuyu70nqraal3hkvf2f03vm)  
  
**Attacker's Axelar Wallet:**
[axelar1hzra9z4zn8q0w8f3dj2wnw0xgetu8dfdhl6ad8](https://axelarscan.io/account/axelar1hzra9z4zn8q0w8f3dj2wnw0xgetu8dfdhl6ad8)  
  
**Attacker's Osmosis Wallet:**
[Osmo1hzra9z4zn8q0w8f3dj2wnw0xgetu8dfdm2l9s5](https://www.mintscan.io/osmosis/address/osmo1hzra9z4zn8q0w8f3dj2wnw0xgetu8dfdm2l9s5)

[Roughly $642K remains](https://www.commonprefix.com/blog/secret-network-exploit) in the [attacker's Axelar wallet](https://axelarscan.io/account/axelar1hzra9z4zn8q0w8f3dj2wnw0xgetu8dfdhl6ad8), holding 6.2 WBTC, 239,324 USDC, 64.04 WBNB, and 248.85 AXL.

**The trail is documented. The funds are mostly gone. And that $642K [is sitting in a wallet Secret Network asked Axelar to freeze, a request Axelar did not pursue](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995).**  
  
_So what exactly does "coordinating with law enforcement" mean when the money is still right there?_

### Finger Pointing

_Both teams published statements on June 19th._  
  
**Both were accurate. Neither was sufficient.**

  
**[Axelar was direct](https://x.com/axelar/status/2068349929601262010):** "Neither Axelar nor IBC was compromised. The exploited token smart contract was not developed, deployed, or maintained by Axelar."  
  
**[Their post continued](https://x.com/axelar/status/2068349929601262010):** “This deployment was vulnerable because its Secret-side fork had core security checks removed. The issue was not Axelar-specific logic or a flaw in IBC itself.”  
  
**[Secret Network aimed at a different failure](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995):** The contract had a bug, yes. But when forged tokens were redeemed through the legitimate channel, [Axelar's channel-69 escrow account unlocked the equivalent real assets automatically](https://www.commonprefix.com/blog/secret-network-exploit), with nothing flagging it.

_**[Secret Network](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995):** "No effective monitoring, anomaly-detection, or emergency pause mechanisms were triggered within the Axelar bridge infrastructure to identify and temporarily halt unusually large or suspicious transfers before the bridge assets were substantially drained from Axelar."_

**[The quietest line in Secret's post carried the most weight](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995):** “No external audit was requested by Axelar as part of the integration.”  
  
**The [Axelar-Secret integration was announced on July 13, 2022](https://www.commonprefix.com/blog/secret-network-exploit). The fork [shipped to Secret Network in March 2023](https://www.commonprefix.com/blog/secret-network-exploit).**  
  
[Because no external audit was requested by Axelar as part of the integration](https://www.commonprefix.com/blog/secret-network-exploit), the custom code that changed how the contract trusted its counterparties appears to have gone unreviewed for three years.

[Common Prefix authored the exploit report](https://www.commonprefix.com/blog/secret-network-exploit). It named both failures without flinching.  
  
About $642K [remains in the attacker's Axelar wallet](https://axelarscan.io/account/axelar1hzra9z4zn8q0w8f3dj2wnw0xgetu8dfdhl6ad8).  
  
Secret Network asked Axelar to freeze it, [a request Axelar decided not to pursue](https://forum.scrt.network/t/security-incident-axelar-secret-ibc-bridge-exploit-june-10-2026/7995).  
  
Axelar said it is [coordinating with exchanges and law enforcement](https://x.com/axelar/status/2067965810174214451).  
  
**The Secret and Secret-SNIP [connections remain disabled with no timeline given](https://x.com/axelar/status/2067965810174214451).**

  
_When a custom integration changes the trust model and nobody commissions a new audit, who owns the failure when the bridge empties?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_This was not a sophisticated attack. It was a patient one._  
  

**[Ray Raspberry identified five Cosmos ecosystem chains drained in 35 days](https://x.com/RayRaspberry1/status/2069536677152862409), roughly $21M gone.**

[Gravity Bridge lost $5.4 million in late May](https://rekt.news/gravity-bridge-rekt), after a patch [had sat unread on GitHub for 123 days before the exploit ran](https://x.com/RayRaspberry1/status/2069536677152862409).  
  
[Namada was drained for $600K](https://x.com/f12sec/status/2068065239187218505), and the loss [stayed invisible until someone checked live RPC against a stale indexer](https://x.com/f12sec/status/2068066717809410517).  
  
The pattern across all of them is not a single bug class. It's an operational condition: Real money parked in infrastructure that the people who built it have largely moved on from, watched by nobody, audited by nobody.

_**[Ray Raspberry called it plainly](https://x.com/RayRaspberry1/status/2069536733218127903):** "The attacker's innovation isn't technical. It's reading the room. Ghost chains still hold real money."_  
  
The door on this contract had been open for three years, public, requiring nothing more than someone willing to look.  
  
**Someone looked. They came back with a fake chain, a fresh IBC channel, and eighteen minutes to spare.**  
  

_If real money keeps sitting in infrastructure that nobody is actively watching, what exactly is the working theory for how it stays safe?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
