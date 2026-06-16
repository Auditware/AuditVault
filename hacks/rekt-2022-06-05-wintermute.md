---
tags:
  - blockchain/ethereum
  - blockchain/optimism
  - sector/governance
  - sector/multisig
  - sector/privacy
  - precondition/insider
title: "Wintermute - REKT"
protocol: "[[Wintermute]]"
date: 2022-06-05
loss_usd: 27600000
auditors:
source: "https://rekt.news/wintermute-rekt"
excerpt: "The glass is half-empty for Wintermute who have lost 20M OP, worth ~$27.6M at the time of the incident. In an already struggling market, actions such as these make it hard to remain Optimistic."
genome:
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[upgrade-safety]]"
---
# Wintermute - REKT

> **Loss:** $27,600,000 | **Date:** 2022-06-05 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/05/optiwintermute-header.png)

**The glass is half-empty for [Wintermute](https://www.wintermute.com/) who have lost 20M OP, worth ~$27.6M at the time of the incident.**

The funds were supposed to be sent to Wintermute by the Optimism Foundation in an agreement to act as a market maker ahead of the OP token launch.

**But Wintermute provided the address of their [multisig on Ethereum](https://etherscan.io/address/0x4f3a120e72c76c22ae802d129f599bfdbc31cb81) as the [destination address](https://optimistic.etherscan.io/address/0x4f3a120e72c76c22ae802d129f599bfdbc31cb81) on Optimism - an address they did not control.**

According to the Optimism Foundation’s [announcement](https://plaid-cement-e44.notion.site/A-Message-to-the-Community-from-the-Optimism-Foundation-f49b913bb0974d8a854a8bdd409a9dd6), Wintermute then confirmed receipt of two test transactions, firstly for [1 OP](https://optimistic.etherscan.io/tx/0xf79ed3037b55fbfd305007da2f19fb7960d31b8410453c679313e37a6d8548f4) and then for [1M OP](https://optimistic.etherscan.io/tx/0x0c1d6166293924566ea0ca32d07379c7033a8b8f2558f667f917543e51dd474a), without checking that they had access to the funds.

The remaining [19M OP](https://optimistic.etherscan.io/tx/0x8e29eef359f6c18a06e229157d44467b5e873f6e5b996baa7124b38eb6dfb1db) were sent shortly after the second test transaction on the 27th May.

According to Wintermute’s [statement](https://gov.optimism.io/t/message-to-optimism-community-from-wintermute/2595), they notified the Optimism Foundation about their error on 30th May.

The OP launch went ahead regardless on the 1st of June, despite almost 10% of the soon-to-be circulating supply being up for grabs.

**An opportunistic anon seized control of the ownerless funds on 5th June.**

_How did the exploiter gain access?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

_Credit: [yoav.eth](https://twitter.com/yoavw/status/1534699457400520704), [kelvinfichter](https://twitter.com/kelvinfichter/status/1534636743223386119), [banteg](https://mirror.xyz/banteg.eth/iZAsBNL3j_5NIAY2Erav1r7Q4ecc7SC76AfMjyScs34)_

Once the tokens had been sent, they were sitting out in the open, ready to be taken by anyone who spotted them…

The hint was the fact that the address corresponded to a Gnosis Safe proxy on mainnet, but had no contract deployed to the Optimism address.

Nobody could take control of the address as an EOA, that would require the private key.

**However, there was a way to access the funds; anyone could take control of the address by deploying a Gnosis Safe proxy to it.**

_This is [not an easy task](https://help.gnosis-safe.io/en/articles/5267779-i-sent-assets-to-a-safe-address-on-the-wrong-network-any-chance-to-recover), however._

Wintermute [state](https://gov.optimism.io/t/message-to-optimism-community-from-wintermute/2595) that:

>After consulting with the Optimism and Safe teams, Wintermute made the assessment that the funds were potentially retrievable, and that nobody other than Wintermute could recover those funds. The assessment was also that it was a high risk retrieval that could only be attempted once and required Safe to support. Retrieval was scheduled for 7th of June. **However, the assumption that the funds can only be recoverable by Wintermute proved to be false.**

As Wintermute’s Gnosis Safe on mainnet had been [created](https://etherscan.io/tx/0xd705178d68551a6a6f65ca74363264b32150857a26dd62c27f3f96b8ec69ca01#eventlog) back in 2020, it was deployed using an old version of the [ProxyFactory contract](https://etherscan.io/address/0x76e2cfc1f5fa8f6a5b3fc4c8f4788f0116861f9b#code), which includes the out-of-date _create_ opcode, rather than _create2_.

With _create_, the deployed proxy address depends only on the ProxyFactory’s address and nonce. This meant that the exploiter could replay deployments on Optimism (setting themself as owner) until the nonce matched the original mainnet deployment and a matching proxy address was created.

This was eventually achieved after running batched deployments of 162 safes at a time, until the matching address was created in [this transaction](https://optimistic.etherscan.io/tx/0x00a3da68f0f6a69cb067f09c3f7e741a01636cbc27a84c603b468f65271d415b#eventlog).

[Exploiter’s address](https://optimistic.etherscan.io/address/0x8BcFe4f1358E50A1db10025D731C8b3b17f04DBB), used to create the adapted [ProxyFactory contract](https://optimistic.etherscan.io/address/0xe7145dd6287ae53326347f3a6694fcf2954bcd8a), which was [funded](https://optimistic.etherscan.io/tx/0x06cbffe3dcbf9405f5b50aafbdec542cfaeecaeed580c3cc51a0604e423f91eb) by Tornado Cash on the 1st June.

**Wintermute’s multisig on Ethereum: [0x4f3a120e72c76c22ae802d129f599bfdbc31cb81](https://etherscan.io/address/0x4f3a120e72c76c22ae802d129f599bfdbc31cb81)**

**Hijacked address on Optimism: [0x4f3a120e72c76c22ae802d129f599bfdbc31cb81](https://optimistic.etherscan.io/address/0x4f3a120e72c76c22ae802d129f599bfdbc31cb81)**

So far, [1M OP](https://optimistic.etherscan.io/tx/0x230e17117986f0dc7259db824de1d00c6cf455c925c0c8c6b89bf0b6756a7b7e) has been sent to the [exploiter’s EOA](https://optimistic.etherscan.io/address/0x60b28637879b5a09d21b68040020ffbf7dba5107) and [sold](https://optimistic.etherscan.io/tx/0xe9491bfb9a1ad13a47f3c1f61197b097416cbed2e32e038dd3de97172ddee303) for 720 ETH, and a further 1M OP was [sent](https://optimistic.etherscan.io/tx/0xdb693613d550e38d53d47b5fd07ce505e24e141db146fa1321710c9a86d9db6a) to Vitalik’s address.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

The exploiter’s timing is interesting, as pointed out by [yoav.eth](https://twitter.com/yoavw/status/1534699845147152384):

>[Funded](https://optimistic.etherscan.io/address/0x8bcfe4f1358e50a1db10025d731c8b3b17f04dbb#internaltx) via Tornado 7 days ago
>
>Then deployed the contract, waited 4 days, and hijacked wintermute's proxy.
>
>Why wait 4 days?

If they were looking to secure their loot, why give Wintermute the extra time to mount a rescue attempt?

The remaining 18M OP have not yet been dumped, is this down to a lack of liquidity or does the exploiter intend to return the funds?

**[Wintermute](https://gov.optimism.io/t/message-to-optimism-community-from-wintermute/2595) aren’t banking on it:**

>There is hope that it is a whitehat exploit, in which case the remaining funds are potentially recoverable. However we are currently operating under the premise that it is not the case

In the meantime, the Optimism Foundation has provided an [additional 20M OP](https://twitter.com/optimismPBC/status/1534631773887422465) to Wintermute to perform their original market making duties.

**Wintermute’s balance sheet aside, there are more wide-reaching concerns raised by this incident.**

Having almost 10% of the OP circulating supply in the hands of a bad actor is potentially dangerous for Optimism’s governance processes, something the Foundation is [well aware of](https://twitter.com/optimismPBC/status/1534631774936084487).

Should this change, the option of “_a network upgrade … to halt the movement of those OP tokens_” would set a worrying precedent.  

Although the mistake was [flagged](https://twitter.com/0xtroll/status/1531899449512820736) on OP’s launch day, the alert was seemingly ignored by the community. The tweet came hours after the exploiter had funded their address, however, so is unlikely to have been the information to tip-off the incident.

**While [replacing the 20M OP](https://twitter.com/optimismPBC/status/1534631772700516352) won’t be a problem for a giant MM such as Wintermute, the carelessness of this incident is alarming.**

_The funds were sat in an unowned address for 9 days._

In an already struggling market, actions such as these make it hard to remain Optimistic.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
  
>If you enjoy our work, please consider donating to our [Gitcoin Grant](https://gitcoin.co/grants/1632/rekt-the-dark-web-of-defi-journalism).
