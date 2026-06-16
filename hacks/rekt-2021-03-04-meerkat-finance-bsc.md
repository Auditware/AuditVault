---
tags:
  - blockchain/bitcoin
  - blockchain/bsc
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/staking
  - sector/token
  - sector/vault
  - vuln/dependency/upgradeable-contract
  - impact/loss-of-funds/direct-drain
  - impact/privilege-escalation/admin-takeover
  - novelty/variant
title: "Meerkat Finance - BSC - REKT"
protocol: "[[Meerkat Finance Bsc]]"
date: 2021-03-04
loss_usd: 32000000
auditors:
source: "https://rekt.news/meerkat-finance-bsc-rekt"
excerpt: "An impressive debut for the first major exploit on BSC, as Meerkat Finance head straight to number three on our leaderboard. Will CZ and team roll back their corporate chain, or allow their users to s"
genome:
  - "[[upgradeable-contract]]"
  - "[[direct-drain]]"
  - "[[admin-takeover]]"
  - "[[variant]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Meerkat Finance - BSC - REKT

> **Loss:** $32,000,000 | **Date:** 2021-03-04 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/mf-header.png)

**In retrospect, it was inevitable.** 

An impressive debut for the first major exploit on BSC, as Meerkat Finance head straight to number three on our [leaderboard.](https://rekt.eth.link/leaderboard/)

After just one day of operation, Meerkat Finance was rug pulled for 13 million BUSD and about 73,000 BNB, currently totalling around $31m. 

We’ve been watching Binance Smart Chain as they do their speed run through Ethereum’s DeFi summer. Now their copied codes have built up enough capital, and they have entered the _rug pull_ phase.

**The aftermath presents an interesting situation.** 

Will CZ and team [roll back](https://twitter.com/cz_binance/status/1125996194734399488?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1125996194734399488%7Ctwgr%5E%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Fwww.coindesk.com%2Fbinance-may-consider-bitcoin-rollback-following-40-million-hack) their corporate chain, or allow their users to suffer the loss?

**This suricate scam leaves the thieves with [nowhere to hide.](https://www.youtube.com/watch?v=58UD3jU86pY)**

Where can they run to on such a small chain? Binance has [closed the bridges](https://twitter.com/madcapslaugh/status/1367448466453106693?s=20), and even [bscscan.com](https://bscscan.com/) went down for a short while. Was this too much traffic, or some type of smokescreen? 

Meerkat Finance first claimed it was a hack but then deleted their accounts, leaving BSC users with only themselves, or _maybe Binance_ to blame.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/mf-investigate.png)

_With thanks to [0xdeadf4ce.](https://twitter.com/0xdeadf4ce)_

- **Meerkat Finance Deployer upgraded 2 vaults of the project.**
- 
- Attacker address called permissionless initialization function through the Vault proxies, effectively allowing anyone to become the Vault owner [2](https://bscscan.com/tx/0xfcf48681e382e9f9cc1d6a64ff30487306f6b869924c6594075fcc86b3b21f5d)
- 
- Attacker subsequently drains Vaults by calling a function with signature 0x70fcb0a7 which accepts a token address as an input. Decompilation of the upgraded-to Smart Contract shows the only use of the invoked function to be removal of funds with the owner as beneficiary.

Usually, if the contract has a function which allows the owner to retrieve the assets which are used in the strategy/vault actively, then you are placing your trust in the project team. 

They can pull the plug any time. 

That’s why projects like yearn add checks like in the image below, so that the team can only rescue the funds which are not in active use by the strategy/vault.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/mf-code.png)

Both affected Vaults used OpenZeppelin’s Transparent Proxy Upgrade pattern, allowing to upgrade the Vault logic to a new logic implementation by calling the function upgradeTo(address newImplementation) on the Vault proxy level.

The BUSD Vault’s previous implementation is located at [0x49509a31898452529a69a64156ab66167e755dfb](https://bscscan.com/address/0x49509a31898452529a69a64156ab66167e755dfb), the WBNB Vault’s previous implementation is located at [0x3586a7d9904e9f350bb7828dff05bf46a18bb271](https://bscscan.com/address/0x3586a7d9904e9f350bb7828dff05bf46a18bb271), both being rather inconspicuous and verified contracts.

**Meerkat Finance Deployer calls upgradeTo() two times:**

- at block 5381239, setting WBNB Vault implementation to [0x9d3a4c3acee56dce2392fb75dd274a249aee7d57](https://bscscan.com/tx/0x063970f8625f250101a7da8abf914748cf8eaaaa9458041f1928501accfe5d6c)
- at block 5381246, setting BUSD Vault implementation to [0xb2603fc47331e3500eaf053bd7a971b57e613d36](https://bscscan.com/tx/0xf19fa4bcff4adaebeddd28c851458ba0f01ffedd52b62df56ace94e7c8842553)

This changed the Vault logic to introduce two noteworthy functions that have not been part of the initial implementations.

- init(address owner)
- According to decompiled bytecode this function sets the address on storage slot 0 to the address provided to the function.

**There’s no permission check, making this newly added function the ultimate backdoor into the Vaults.**

Using a specific Initializer pattern in transparent proxies is best-practice and was also applied in the first Vault implementations, so it is highly questionable what was the intend to add the init() method other than a planned theft of Vault funds.

- 0x70fcb0a7(address _param1)

Source code is not available, decompiled source is limited to checking that the caller is equal to storage slot 0 set in init() method and transferring out the balanceOf() on the token contract supplied with param1, using the Vault address as the query target.
Both functions are not part of the previous Vault implementations.

Comparing the bytecode size of old and new implementations it can be stated that the new implementation is only 1/4th the size of the previous logic.

Since the upgrades were done by the Meerkat Finance Deployer the most likely scenario given all aspects of the on-chain data is an intentional “rug pull” while granted there is a small chance of private key compromisation.

As of the time of writing funds have partially been split among various addresses and sent to what seemingly belongs to the Binance Bridge hosted by Binance exchange.

The [Binance.org](http://binance.org/) Bridge is currently suspended, probably to avoid the funds from being easily moved to other chains.

**Timeline (04.03.2021)**

**Mar-04-2021 08:53:10 AM +UTC**
Meerkat Finance Deployer upgrades WBNB Vault to contract 0x9d3a4c3acee56dce2392fb75dd274a249aee7d57

**Mar-04-2021 08:53:31 AM +UTC**
Meerkat Finance Deployer upgrades BUSD Vault to contract 0xb2603fc47331e3500eaf053bd7a971b57e613d36

**Mar-04-2021 08:54:31 AM +UTC**
Attacker calls method 0x70fcb0a7 on BUSD Vault to transfer out 13,968,039 BUSD

**Mar-04-2021 08:54:55 AM +UTC**
Attacker calls method 0x70fcb0a7 on WBNB Vault to transfer out 73,635 WBNB

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/mf-linebreak.png)

**The same games are played on different chains, but the balance of power is different. With CZ watching and the bridges burning, the robbers have nowhere to hide.**

Even in the [Meerkat_Rugpull](https://t.me/Meerkat_Rugpull) Telegram group, chat members were not in total agreement of how they wanted Binance to handle the situation. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/mf-poll.png)

**_Could_ Binance roll back the chain and refund their users?**

The answer is not so clear - the 21 mystery [validators](https://docs.binance.org/smart-chain/validator/guideline.html) could in theory arrange a refund, but it is unlikely. It would only fuel the CeDeFi issues and create more work for the (likely already stressed) BSC lawyers. 

Binance will have planned in advance how they would handle such a scenario. How they handle this case will set a precedent. 

Although this is not the first [multimillion rugpull](https://twitter.com/news_of_bsc/status/1354880400984739842?s=20) on BSC, it is the first since the rise of PancakeSwap and the increased user numbers that came along with it. 

Ignoring the unlikely event of someone from Binance stepping up to arrange a merkle distributor and returning the funds, the money is gone. 

**So we find that protocols on BSC are no more secure than Ethereum.** 

CZ won’t save you. Their transactions are cheaper, but there’s no original development. 

_What will become of this corporate chain once Eth L2 arrives?_ 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/mf-rektkat.png)
