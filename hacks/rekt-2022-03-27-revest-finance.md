---
tags:
  - sector/dex
  - sector/governance
  - sector/nft
  - sector/privacy
  - sector/token
  - has/audit
  - vuln/reentrancy/single-function
  - impact/loss-of-funds/direct-drain
  - novelty/known-pattern
title: "Revest Finance - REKT"
protocol: "[[Revest Finance]]"
date: 2022-03-27
loss_usd: 2010000
auditors:
  - "[[Solidity Finance]]"
source: "https://rekt.news/revest-finance-rekt"
excerpt: "~$2M taken from Revest Finance. “One audit is never enough” says Revest, as they found that a reentrancy vulnerability was not picked up in their security checks."
genome:
  - "[[single-function]]"
  - "[[direct-drain]]"
  - "[[known-pattern]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[reentrancy-guard]]"
---
# Revest Finance - REKT

> **Loss:** $2,010,000 | **Date:** 2022-03-27 | **Audited by:** Solidity Finance

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/revest-header.png)

**~$2M taken from Revest Finance.**

A financial NFT platform which “offers instant liquidity for locked assets”, fell victim to a reentrancy attack. 

A fast reaction from the Revest team prevented them from losing more funds, however, they still take a place on [the leaderboard  (#67)](https://rekt.news/leaderboard/).

_How did it happen?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**The Revest team were informed of the _“exploit at 2:24 UTC from the BLOCKS DAO development team_”.** 

In addition to [BLOCKS DAO](https://twitter.com/BLOCKS_DAO/status/1507948104829579279), substantial losses were also suffered by [EcoFi](https://twitter.com/finance_eco/status/1508166280792186884) and [RENA Finance.](https://twitter.com/rena_finance/status/1508033798021459970)

By [halting transfers](https://etherscan.io/tx/0x18fd1a2b17109c7f2bb7244d99bcfb71d131fd9d522fdc41b8a9fb3cdded9c98) of RVST tokens, the team thwarted the [attacker’s attempt](https://etherscan.io/tx/0x7bbc01ad66ba9b07fdc82afe4e0c99ffcf317680635d040427afed06b25c8c0f) _(70 secs later)_ to drain the RVST-ETH pool on Uniswap, avoiding a further $1.15M in losses.

The attacker’s dump of the stolen tokens had a large impact on the price of [BLOCKS](https://www.coingecko.com/en/coins/blocks) (initially down >95%, currently down ~80%) and [ECO](https://www.coingecko.com/en/coins/ecofi) (down ~98%), however the [RENA](https://www.coingecko.com/en/coins/rena-finance) tokens remain untouched in the [attackers address.](https://etherscan.io/address/0xef967ece5322c0d7d26dab41778acb55ce5bd58b)

_Credit: [@BlockSecTeam](https://twitter.com/BlockSecTeam/status/1508065573250678793)_

**The root-cause of the attack was due to a reentrancy vulnerability in the ERC1155 minting contract ([example tx: RENA](https://etherscan.io/tx/0xe0b0c2672b760bef4e2851e91c69c8c0ad135c6987bbf1f43f5846d89e691428))**

The function _mintAddressLock_, used to create new Smart Vaults, contains two critical parameters: _quantities_ and _depositAmount_. 

Revest Vault invokes the _mint_ function of FNFTHandler, to mint _quantities_ of ERC1155(s) with the next _fnftId_ to the recipient(s) which can later be burned in order to claim the position’s proportion of locked tokens. _fnftId_ increments by 1 each time the function is executed.

Extra funds can be deposited to the FNFT using the _depositAdditionalToFNFT_ function, deposits must be in the same proportion as defined by _quantities_, specifically: _quantity==FNFTHandler.getSupply(fnftId)_.

If the above statement is not fulfilled, the user's share will be extracted from the position and transferred to a new FNFT with a balance defined by the existing position's _depositAmount_ plus the newly deposited amount.

Given that the existing position’s _depositAmount_ is used, but _fnftId_ (informed via _fnftsCreated_) is not updated until the end of the minting routine, re-entrancy at this point allows for additional funds to be added to an existing position. 

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2022/03/revest-code.png)

**Step by Step:**

**1:** Attacker uses the _mintAddressLock_ function to open a new position with *fnftId=1027*, *depositAmount=0*, *quantities=[2]*, *asset=Rena*, and *recipients=[malicious contract]*.  Since the *depositAmount X quantities[0] = 0 X 2 = 0*, the attacker transfers zero Rena.

**2:** Attacker uses the *mintAddressLock* function again to open a new position with *fnftId=1028*, *depositAmount=0*, *quantities=360,000*, *asset=Rena*, and *recipients=[malicious contract]*. Again, the attacker transfers zero Rena and receives *360,000* tokens (with *fnftId=1028*). Note that these 1028-tokens have no value now.

**3:** At the end of Step 2, during the *mint* function of *FNFTHandler*, the attacker re-enters the *Revest* contract via the *onERC1155Received* interface. The *depositAdditionalToFNFT* function is used with *amount = 1e18*, *quantities=1*, *fnftId=1027*, which would normally open the *fnftId=1029* (new) position. However, due to the delay in updating _fnftId_, position 1028 is overwritten with the above data, ascribing value to the 1028 tokens owned by the attacker.

**4:** The attacker uses the *withdrawFNFT* function to withdraw the *360,000 X 1e18* Rena tokens after having deposited only *1 quantity X 1e18* Rena tokens in Step 3.

Token losses (approx $2M total) according to the [official post-mortem report](https://revestfinance.medium.com/revest-protocol-exploit-recovery-plan-b06ca33fbdf5):

350k RENA _(~$125k, still in [attacker’s address](https://etherscan.io/address/0xef967ece5322c0d7d26dab41778acb55ce5bd58b))_

715M BLOCKS _(~$1.7M)_

7.7M ECO _(~$100k)_

**Smaller amounts ($10-$12K) of [ConstitutionDAO](https://etherscan.io/tx/0x2b73bc0af8eaaff12eda97105071ac093ea610c00fd2ee7d33c0020f617feeeb) and [LUKSO](https://etherscan.io/tx/0x3b902013ea6e15587dd876d37182cfc09d208cac27fb33ddfa850e8eae4a8597) were also stolen.**

After swapping the majority of the stolen tokens for ETH, the attacker [deposited the funds](https://etherscan.io/address/0xef967ece5322c0d7d26dab41778acb55ce5bd58b) into Tornado Cash.

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png) 

**A security breach is never a good look for a DeFi protocol, especially when its product is a secure locker to be trusted with other project’s tokens.**

“One audit is never enough” says Revest, as they found that the vulnerability was not picked up in the [project’s audit](https://solidity.finance/audits/Revest/) (solidity.finance). 

The team’s quick response and thorough post-mortem are promising signs, and although Revest have stated that “_we do not possess the funds needed for meaningful financial recompense_”, the postmortem report stresses the desire to make things right in the future.

_At the moment, it’s not clear how that will happen._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
