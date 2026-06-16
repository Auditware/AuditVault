---
tags:
  - sector/privacy
  - sector/stable
  - sector/token
title: "THORChain - REKT 2"
protocol: "[[Thorchain]]"
date: 2021-07-22
loss_usd: 8000000
auditors:
source: "https://rekt.news/thorchain-rekt2"
excerpt: "THORChain took a hammering. Recently the protocol was hit for $5M. A second strike saw them lose another $8M. What's next for THOR and their fanatical followers?"
genome:
  - "[[oracle-freshness]]"
---
# THORChain - REKT 2

> **Loss:** $8,000,000 | **Date:** 2021-07-22 | **Audited by:** THORChain

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/thor2-header.png)
**THORChain took a hammering.**

Recently the [protocol was hit for $5M.](https://www.rekt.news/thorchain-rekt/)

A second strike saw them lose another $8M.

The hacker left a clear message for THORChain, but apparently it was not clear enough, as THORChain initially believed they had lost just $800k to a whitehat hacker.

**The tx data told a different story:**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/thor2-hacktxdata.png)
[Source](https://twitter.com/defixbt/status/1418338501255335937)

**THORChain has always used a very conversational tone from their official Twitter account, and they continued to do so even after the attack.** 

_When you’ve lost over 10 million of your users' funds in 10 days, it’s not a good idea to celebrate an increase in followers._ 

**The new followers arrived to watch you bleed, they are not a sign of your success.**

The passion of the THORchain community remains high, but it manifests itself differently now that they are suffering.

The following message was found in a transaction from a RUNE holder to the attacker.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/thor2-assdildo.png)

**“Savage.”**

_What happened to cause such anger?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/thor-investigates.png)

>Credit: [Halborn Security](https://github.com/HalbornSecurity/PublicReports/blob/master/Incident%20Reports/Thorchain_Incident_Analysis_July_23_2021.pdf)

**The observation of an attack began on the 22.07.2021 - 21:42 GMT**

An attacker targeted the Thorchain Bifrost component through the ETH Router contract. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/thor2-contract.png)

**During the transactions, the following addresses are seen in the transactions.**

**Router:** [0xc145990e84155416144c532e31f89b840ca8c2ce](https://etherscan.io/address/0xc145990e84155416144c532e31f89b840ca8c2ce)

**Vault:** [0xf56cba49337a624e94042e325ad6bc864436e370](https://etherscan.io/address/0xf56cba49337a624e94042e325ad6bc864436e370)  

**Attack contract:** [0x700196e226283671a3de6704ebcdb37a76658805](https://etherscan.io/address/0x700196e226283671a3de6704ebcdb37a76658805) 

**Attack wallet (spawned from Tornado Cash):** [0x8c1944fac705ef172f21f905b5523ae260f76d62](https://etherscan.io/address/0x8c1944fac705ef172f21f905b5523ae260f76d62) 

>The simple attack steps can be seen below.

The attacker created a fake router (Contract Address), then a deposit event emitted when the attacker sent ETH. 

The attacker passes returnVaultAssets() with a small amount of ETH, but the router is defined as an Asgard vault. 

On the Thorchain Router, it forwarded ETH to the fake Asgard. 

This creates a fake deposit event with a malicious memo. 

Thorchain Bifrost intercepts as a normal deposit and refunds to an attacker due to a bad memo definition.

[Contract Address](https://etherscan.io/address/0x700196e226283671a3de6704ebcdb37a76658805) 

[Transaction 1](https://etherscan.io/tx/0x10352e6ec052771a92f05f93e037e066873f64bb502d4488726697987f054595) 

[Transaction 2](https://etherscan.io/tx/0x1c6ef4d5122f1287085097ac37df076d43f389bfc62a1bdfcd3163254b5fe94a) 

[Transaction 3](https://etherscan.io/tx/0x0b39a878f1bf3daa78be149222dd8e5fa3e37b54d0451872b3d7a2cbf7f070e2) 

[Transaction 4](https://etherscan.io/tx/0x01f38f17ba838b54350f8e2a2bd54fcdd9cf3c45fa1d2a735f5311507671be9e) 

[Transaction 5](https://etherscan.io/tx/0xa89d90f300fed8d1d987dec86d0d628f31ffd2d8aefdd857ad90151084531d4c) 

[Transaction 6](https://etherscan.io/tx/0x9db403ad39d3fe78de378af0b49f03d244326662f7fee230db87d12a624f564b) 

[Last Transaction By An Attacker](https://etherscan.io/address/0xd95e6eab231b9f3afa24c31c7050bd84c2982072#tokentxns)

**Transactions to THORChain pass user-intent with the MEMO field on the chains which contain custom user input.** 

The THORChain inspects the transaction object, as well as the MEMO in order to process the transaction, so care must be taken to ensure the MEMO and the transaction is valid. If not, THORChain will automatically refund. [(Reference.)](https://docs.thorchain.org/developers/transaction-memos)

The hacker targeted a refund logic. The attack can be named as Lack of proper multi-event handling. 

>Impact (~$8M USD) 

966.62 **ALCX** 

20,866,664.53 **XRUNE** 

1,672,794.010 **USDC** 

56,104 **SUSHI** 

6.91 **YFI** 

990,137.46 **USDT**

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**The price of RUNE [dropped by 25%](https://www.coingecko.com/en/coins/thorchain), however, holders were about to receive more bad news.**

Just as with the previous exploit, a vulnerability present due to decisions actively made by developers was found within the RUNE [token contract code.](https://etherscan.io/token/0x3155ba85d5f96b2d030a4966af206230e46849cb)

Hours after the attack, many addresses began to receive a previously unknown token; UniH. 

Those who tried to sell this token had their full RUNE balances drained upon approving its use.

RUNE’s transferTo function used tx.origin instead of msg.sender, something explicitly advised against within the Solidity documentation as it allows interactions with malicious contracts to move your RUNE.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/7/thor2-origintx.png)

**In this case, granting approval to a protocol to spend UniH was all it took for any RUNE in a wallet to be stolen, as in [this example.](https://etherscan.io/tx/0x30588af6b5337d9ea229339287fa230bf307120252ed06018efb7abf85696285)**

As can be seen in the code’s comments this was a vulnerability that the team had foreseen, and had been acknowledged as “non-standard”.

_Another instance of the THORChain devs leaving instructions for the hackers._

Credit: [Mudit Gupta](https://twitter.com/Mudit__Gupta/status/1418594621622390786?s=20)

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**THORChain rekt again, and they have no one to blame but themselves.**

Although perhaps not a DeFi “blue-chip”, THORChain were a well-established player, and many will be disappointed to see them go downhill so quickly. 

_Why now, and in such quick succession?_ 

Has something changed internally on the THORChain team, or did they upset somebody who had a motive to hurt them? 

An $8M payday would be enough motive for most, but this anonymous antihero left most of the loot behind… 

**This was for power, not wealth.**

_What’s next for THORChain and their fanatical followers after such a string of major mistakes?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/04/second-conc2.png)
