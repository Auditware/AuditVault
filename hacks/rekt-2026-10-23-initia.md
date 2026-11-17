---
tags:
  - type/hack
  - blockchain/bitcoin
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/infra
  - web3-sector/lending
  - web3-sector/privacy
  - web3-sector/stable
  - web3-sector/staking
  - web3-sector/token
  - vector/social-engineering
title: "Initia - Rekt"
protocol: "Initia"
date: 2026-10-23
loss_usd: 2730000
audit: "N/A"
source: "https://rekt.news/initia-rekt"
excerpt: "A stale script cache in Initia’s MoveVM let forged balances out over LayerZero and CCTP, and real reserves paid out about $2.73 million before the halt. The Initia Foundation has approved funding to r"
---
# Initia - Rekt

> **Loss:** $2,730,000 | **Date:** 2026-10-23 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/initia-rekt-header.png)


_**[A published local replay shows the failure](https://x.com/0xCanzi/status/2113774415657742370):** Initia's virtual machine approved a script once, then kept honoring that approval after the code underneath it had been swapped out._

**On October 23, [an attacker exploited a script-caching bug to credit themselves with unbacked assets](https://x.com/initia/status/2113915002008612945), without increasing the corresponding tokens' recorded total supplies.**

In that replay, [the stale approval let an attacker-made object enter a deposit function as a genuine token](https://x.com/0xCanzi/status/2113774415657742370).

**Then they used those balances to withdraw through the bridges. The systems on the other side paid out real assets:** [1.4 million AUSD and 105 ETH through LayerZero](https://x.com/sprunky_eth/status/2113884422466306511), plus [roughly 1.08 million USDC through Noble and Circle’s CCTP](https://x.com/initia/status/2113915002008612945).

[The attack began at 14:59 UTC](https://x.com/initia/status/2113915002008612945). At 15:41:30 UTC, [Initia halted its L1 and rollups](https://x.com/initia/status/2113661738625155217). Five seconds later, [the attacker consolidated 1,135.52 ETH into a fresh Ethereum wallet](https://x.com/D2_Finance/status/2113667420359700509).

_Stopping the source chain could not undo the payouts already made elsewhere._

**[Bitquery put the forged balances' face value at $7.48 million, against roughly $2.73 million extracted](https://bitquery.io/investigations/initia-hack). Some of that paper value had no bridge exit.**

[The attacker withdrew 1.08 million USDC from the Noble reserve](https://bitquery.io/investigations/initia-hack) backing Initia's USDC.  
  
Other users' withdrawals took most of what remained, [leaving only $63 by 15:37 UTC](https://bitquery.io/investigations/initia-hack).  
  
Ordinary withdrawals began failing as the reserve emptied.

**The failure began in Initia's VM. The bridges turned false balances into real proceeds.**

_When a bridge accepts a withdrawal as valid, who checks whether the balance behind it was ever backed?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Canzi](https://x.com/0xCanzi/status/2113774415657742370), [Initia](https://x.com/initia/status/2113915002008612945), [Sprunky](https://x.com/sprunky_eth/status/2113884422466306511), [D2 Finance](https://x.com/D2_Finance/status/2113667420359700509), [Bitquery](https://bitquery.io/investigations/initia-hack), [Spreek](https://x.com/spreekaway/status/2113653520981447144), [Zon](https://x.com/ItsAlwaysZonny/status/2113667290059190466), [Agora](https://x.com/withAUSD/status/2113676134676406456), [Cryptopolitan](https://www.cryptopolitan.com/initia-attacker-moves-1135-eth-chain-halts/), [CoinStats](https://coinstats.app/news/d8944e0851081cedc5de2f8bdb0d7ca1b22cb74552df5841bcc0e97aa169e42d_In-Initia-exploit-14M-AUSD-stablecoin-tokens-went-to-an-attacker), [KuCoin](https://www.kucoin.com/announcement/en-kucoin-has-temporarily-closed-the-deposit-and-withdrawal-services-of-initia-init-1), [Binance](https://www.binance.com/en/square/post/381353507304629), [LayerZero](https://docs.layerzero.network/v2/concepts/applications/asset0), [Code4rena](https://github.com/code-423n4/2025-01-initia-move), [Zellic](https://github.com/Zellic/publications/blob/master/Initia%20-%20Zellic%20Audit%20Report.pdf), [Hexens](https://hexens.io/research/aptos-hijack-bug), [Liquid Network](https://x.com/Liquid_BTC/status/2097404704028545175), [Initia Foundation](https://x.com/initiaFDN/status/2115345150369038598)_

**[Spreek raised the public alarm](https://x.com/spreekaway/status/2113653520981447144) 28 minutes after the [forged transaction](https://scan.initia.xyz/interwoven-1/txs/67423E84815CEC63632BD4676CA22D33567F3E02C3187281C9B6BFD593CBA7AF).**  
  
By then, [roughly $2.73 million had already escaped](https://bitquery.io/investigations/initia-hack).

At 15:27 UTC, [Spreek estimated $2.6 million already cashed out “thus far with more in flight.”](https://x.com/spreekaway/status/2113653520981447144)

[Bitquery’s later reconstruction records a successful 80,000 USDC withdrawal at 15:24](https://bitquery.io/investigations/initia-hack), three minutes before his post.

_[Initia’s subsequent notice put the halt of its L1 and rollups at 15:41:30 UTC](https://x.com/initia/status/2113661738625155217), roughly fourteen minutes after Spreek’s alert._

**[The notice said the team was “working to establish the full scope of any impact with security teams, validators, and exchanges."](https://x.com/initia/status/2113661738625155217) No loss figure. No cause. No restart time.**

**[Co-founder Zon supplied some of that from his personal account](https://x.com/ItsAlwaysZonny/status/2113667290059190466):** "To the best of our knowledge so far, this is a Day 0 bug related to Initia's MoveVM on CosmosSDK that allowed the exploiter to mint additional tokens on the Initia L1 but does not apply to native INIT tokens," he wrote, putting the haul at roughly $2.7 million in AUSD, ETH and USDC minted and bridged out before the pause.

[Initia’s official account gave its own loss estimate the next day](https://x.com/initia/status/2113915002008612945), confirming roughly $2.7 million bridged out.

**[D2 Finance traced the bridge payouts](https://x.com/D2_Finance/status/2113667420359700509):** 1.4 million AUSD released on Ethereum, followed by 105 ETH in a separate withdrawal. Those payouts depleted 71% of the AUSD adapter’s holdings and 96% of the native-ETH adapter’s, according to D2.

_Agora also intervened on October 23, [saying it would freeze hacker-linked AUSD on networks where its contracts operate](https://x.com/withAUSD/status/2113676134676406456), while stressing that it had no smart contracts deployed on Initia._  
  
**That distinction separated Agora’s own token and contracts from the bridged representation on Initia, and defined the limits of its response.**  
  

Agora used AUSD’s batchFreeze function to freeze the attacker’s Ethereum address, [but by then the attacker had already swapped the 1.4 million AUSD payout for ETH](https://www.cryptopolitan.com/initia-attacker-moves-1135-eth-chain-halts/).  
  
The address held no AUSD when the freeze took effect, so the intervention neither reversed the payout nor recovered those funds.

Early accounts suggested the attacker had minted new tokens.  
  
_[Spreek described tokens as “infiniminted,”](https://x.com/spreekaway/status/2113653520981447144) while [Zon said the bug allowed the attacker to “mint additional tokens.”](https://x.com/ItsAlwaysZonny/status/2113667290059190466)_

**The mechanism turned out to be more nuanced.**  
  
**[Initia’s own explanation landed at 08:46 UTC on October 24](https://x.com/initia/status/2113915002008612945), about 17 hours after the halt, and used a different verb:** “Spoofed.”

[The attacker "artificially spoofed the MoveVM state,"](https://x.com/initia/status/2113915002008612945) Initia wrote, crediting themselves with unbacked WETH, iUSD and USDC without changing the corresponding tokens' total supplies. No native INIT was minted.

The distinction was not whether the forged balances could unlock real money. The bridge payouts had already shown they could. It was how those balances came to exist.

**The bridge exits had accepted withdrawals against credits that no legitimate issuance had created.**

_So how did attacker-made data become a balance the system would let them spend?_

### Checked Once, Trusted Twice  
  
_[Move's type rules were supposed to prevent an attacker-created object from passing as a genuine FungibleAsset](https://x.com/0xCanzi/status/2113774415657742370), the object Move uses to represent tokens._  
  
**[The VM normally verifies a script’s types before execution and rejects code](https://x.com/0xCanzi/status/2113774415657742370) whose types don’t line up.**

[Initia runs an Aptos-derived MoveVM](https://github.com/initia-labs/movevm). Its Rust implementation is compiled into a native library and connected to the Cosmos SDK chain through Go bindings.

[In its October 24 statement](https://x.com/initia/status/2113915002008612945), Initia attributed the incident to a bug in the MoveVM's script caching that let malicious code bypass security checks. It said the attacker spoofed VM state to credit themselves with unbacked token balances, without changing the tokens' recorded total supplies.  
  
The statement did not identify a file, commit, or function.

_[A more detailed reconstruction came from researcher 0xCanzi](https://x.com/0xCanzi/status/2113774415657742370), who published a local replay using real Move VM code, with transaction rollback modeled locally._  
  
**It offers a possible mechanism, not confirmation of the live attack's exact sequence.**

[In that reconstruction, a script was checked once](https://x.com/0xCanzi/status/2113774415657742370), then trusted again after the code it had been checked against changed.

Move scripts are pieces of code submitted with transactions. In 0xCanzi's replay, [the attacker first published a contract module called Router, whose swap function declares that it returns a FungibleAsset](https://x.com/0xCanzi/status/2113774415657742370), but aborts when called.  
  
[A separate script converts the currency’s metadata address into a metadata object, calls swap, and passes its result to the primary fungible store’s deposit function](https://x.com/0xCanzi/status/2113774415657742370). The metadata identifies the currency; referencing it does not create funds. The declared types line up, so the VM verifies the script and caches the result

_Router’s first version then aborts deliberately. That rolls back the Router publication, [but the script's cached verification result survives](https://x.com/0xCanzi/status/2113774415657742370)._

**Next, [the attacker republishes Router at the same address, this time with swap returning an attacker-built object called Quote](https://x.com/0xCanzi/status/2113774415657742370), containing currency metadata and a claimed amount.**  
  
[The attacker reruns the same script](https://x.com/0xCanzi/status/2113774415657742370). The VM reuses its old verification result instead of checking the script against the replacement module’s changed return type.

  
As a result, [the Quote reaches the deposit function under the stale type assumption](https://x.com/0xCanzi/status/2113774415657742370). In the replay, deposit uses the object’s metadata to select the currency store and credits the claimed amount, increasing the demonstration balance by 3 million dollar-denominated units and emitting a DepositEvent.

  
**A fresh [VM with no cached result rejects the same setup with TYPE_MISMATCH](https://x.com/0xCanzi/status/2113774415657742370).**

  
[The replay’s $3 million is a demonstration figure](https://x.com/0xCanzi/status/2113774415657742370), not the incident’s loss.

  
[The replay shows the deposit function adding the attacker’s claimed amount to a balance](https://x.com/0xCanzi/status/2113774415657742370), offering a possible explanation for [how balances increased without changing the corresponding tokens’ recorded total supplies](https://x.com/initia/status/2113915002008612945), as Initia reported.

  
**[The team’s statement](https://x.com/initia/status/2113915002008612945), however, does not confirm that the live attack followed this exact sequence.**  
  

_Once the VM had accepted the forged balance, what was left downstream to question it?_

  

### Burn Here, Pay There  
  
_The gas money arrived six and a half hours before the exploit._

**At 08:26:59 UTC on October 23, [a withdrawal from Tornado Cash's 0.1 ETH pool](https://x.com/sprunky_eth/status/2113884604021018934) delivered about [0.098 ETH to the Ethereum address](https://t.co/uCeckJpatW) that would later receive the bridge payouts.**

[Sprunky identified the relayer](https://x.com/sprunky_eth/status/2113884604021018934) and transaction submitter.  
  
**Tornado Cash Gas Funding Transaction:**  
[0x3fb58feaaff3abdc5d55e3c6128ea03b6527665d702c983630f7f1d2f26c4d49](https://etherscan.io/tx/0x3fb58feaaff3abdc5d55e3c6128ea03b6527665d702c983630f7f1d2f26c4d49)

**Attacker EOA on Ethereum:**  
[0xDD922c841d85E12dac2dc2eef5a5E29cFFf6edFA](https://etherscan.io/address/0xDD922c841d85E12dac2dc2eef5a5E29cFFf6edFA)

_Starting at 14:59:17 UTC, a single Initia account created unbacked balances in four batches over 13 seconds. [Bitquery totals them at 3 million iUSD, 2 million AUSD0, 2 million USDC and 200 WETH](https://bitquery.io/investigations/initia-hack), about $7.48 million at face value._

**[Bitquery has published one of the four transaction](https://bitquery.io/investigations/initia-hack) hashes.**  
  
Spreek posted the same one as a ["sample fake mint"](https://x.com/spreekaway/status/2113653709607686275) from Initia's own explorer.

**Initia Account Behind the Forged Balances:**  
[init1mkfzepqashsjmtpdcth0tf0znnlldm06a5m89u](https://scan.initia.xyz/interwoven-1/accounts/init1mkfzepqashsjmtpdcth0tf0znnlldm06a5m89u)

**Initia L1 Forged-Balance Transaction 1 - 14:59:17 UTC:**  
[712111A48BA4D7F830133BCDE2B2E0ECED1962CED9D8CE118381CFBD1F1C14F5](https://scan.initia.xyz/interwoven-1/txs/712111A48BA4D7F830133BCDE2B2E0ECED1962CED9D8CE118381CFBD1F1C14F5)

**Initia L1 Forged-Balance Transaction 2 - 14:59:21 UTC:**  
[7F0A72758F661A5D7C057B9DEFBBB9F8E0D769CA91DD478C677D9D8FF3720EEF](https://scan.initia.xyz/interwoven-1/txs/7F0A72758F661A5D7C057B9DEFBBB9F8E0D769CA91DD478C677D9D8FF3720EEF)

**Initia L1 Forged-Balance Transaction 3 - 14:59:26 UTC:**  
[67423E84815CEC63632BD4676CA22D33567F3E02C3187281C9B6BFD593CBA7AF](https://scan.initia.xyz/interwoven-1/txs/67423E84815CEC63632BD4676CA22D33567F3E02C3187281C9B6BFD593CBA7AF)

**Initia L1 Forged-Balance Transaction 4 - 14:59:30 UTC:**  
[3F165329DE9C4415C58C76FDA9F7F6E7CAA5F76159F287B109812ECADD0919A3](https://scan.initia.xyz/interwoven-1/txs/3F165329DE9C4415C58C76FDA9F7F6E7CAA5F76159F287B109812ECADD0919A3)

_[AUSD0 is the Initia-side representation of AUSD bridged from Ethereum](https://coinstats.app/news/d8944e0851081cedc5de2f8bdb0d7ca1b22cb74552df5841bcc0e97aa169e42d_In-Initia-exploit-14M-AUSD-stablecoin-tokens-went-to-an-attacker) through LayerZero._  
  
**[The attacker sent the unbacked AUSD0 from Initia through LayerZero](https://x.com/sprunky_eth/status/2113919613977186404), and [the Ethereum bridge contract released real AUSD from its reserve](https://bitquery.io/investigations/initia-hack).**

[At 15:01:59 UTC](https://etherscan.io/tx/0x034c1076a08091b3221ef1e7bbcfb47dfeda93a6e460888f2d1bc124be17f3b6), the [Ethereum bridge contract released 1.4 million AUSD to the attacker’s address](https://bitquery.io/investigations/initia-hack).

**LayerZero AUSD Release (1.4M AUSD):**  
[0x034c1076a08091b3221ef1e7bbcfb47dfeda93a6e460888f2d1bc124be17f3b6](https://etherscan.io/tx/0x034c1076a08091b3221ef1e7bbcfb47dfeda93a6e460888f2d1bc124be17f3b6)

**Ethereum Bridge Contract Holding AUSD for Initia:**  
[0x38b8b7ca28e672018a299b20565aca8cf200c844](https://etherscan.io/token/0x00000000efe302beaa2b3e6e1b18d08d69a9012a?a=0x38b8B7ca28E672018a299B20565aCa8cF200C844#transactions)

At 15:03:23 UTC, [the attacker routed it through 1inch for 581.55 ETH](https://etherscan.io/tx/0xeb5e85e76f00a7a84dfe4d2d6aab146a769785b3d80307c67dde14c79f36c5ae).

**AUSD-to-ETH Swap via 1inch (581.55 ETH):**  
[0xeb5e85e76f00a7a84dfe4d2d6aab146a769785b3d80307c67dde14c79f36c5ae](https://etherscan.io/tx/0xeb5e85e76f00a7a84dfe4d2d6aab146a769785b3d80307c67dde14c79f36c5ae)

The USDC took a different road. [Bitquery records 1 million USDC paid from Noble's reserve backing Initia's USDC](https://bitquery.io/investigations/initia-hack) and moved to Ethereum through Circle's CCTP.

**Noble USDC Reserve for Initia:**  
[noble1j8rrc5epz0wppvl7jpy9p7q0u4ky9dcegaw3cu](https://www.mintscan.io/noble/address/noble1j8rrc5epz0wppvl7jpy9p7q0u4ky9dcegaw3cu)

_At 15:04:59 UTC, [the attacker routed approximately 1 million USDC through 1inch and received 415.70 ETH](https://x.com/sprunky_eth/status/2113884604021018934). The route included swaps through Uniswap V3, with some USDC converted to USDT along the way. The transaction alone doesn’t establish where the USDC came from; [Bitquery’s flow table traces the proceeds to the 1 million USDC withdrawal](https://bitquery.io/investigations/initia-hack)._  
  
**Second 1inch Swap, USDC and USDT (415.70 ETH):**  
[0x6981eed05757cfbce5ac7818449b28132dcb400361029ed3452037936c66c3b0](https://etherscan.io/tx/0x6981eed05757cfbce5ac7818449b28132dcb400361029ed3452037936c66c3b0)

[At 15:06:47 UTC, the native-ETH bridge contract paid out 105 ETH](https://x.com/sprunky_eth/status/2113884422466306511), no swap required.

**Native-ETH Bridge Release (105 ETH):**  
[0x5cd422fd8166abf5d8632e9919bfedf6e26f5b77cf732cc797d863450887d7e9](https://etherscan.io/tx/0x5cd422fd8166abf5d8632e9919bfedf6e26f5b77cf732cc797d863450887d7e9)

**Ethereum Bridge Contract Holding ETH for Initia:**  
[0x66a503a1060ab3f2b1aaabed613fe30babbc1bde](https://etherscan.io/address/0x66a503a1060ab3f2b1aaabed613fe30babbc1bde)

**[A second 1 million USDC request at 15:07 bounced](https://bitquery.io/investigations/initia-hack); the reserve could not cover it.**

_**[The last successful withdrawal request came at 15:24 UTC](https://bitquery.io/investigations/initia-hack):** 80,000 USDC from the Noble reserve, which Bitquery traces to about 33.18 ETH._

**[Initia put its halt at 15:41:30 UTC](https://x.com/initia/status/2113661738625155217). The sweep followed five seconds later:** [At 15:41:35 UTC, 1,135.52 ETH](https://etherscan.io/tx/0x60f15b7e96111f11af54a2a0c9adc2ff33fef6b6a3c1a3b073a55c1421043e06), [roughly $2.72 million at the time](https://x.com/sprunky_eth/status/2113736756067778794), moved into a fresh wallet.

**Consolidation Transaction (1,135.52 ETH):**  
[0x60f15b7e96111f11af54a2a0c9adc2ff33fef6b6a3c1a3b073a55c1421043e06](https://etherscan.io/tx/0x60f15b7e96111f11af54a2a0c9adc2ff33fef6b6a3c1a3b073a55c1421043e06)

**Consolidation Wallet:**  
[0x358eF0130f7A5aA516dCd81Bdc80B18CdE41CAC8](https://etherscan.io/address/0x358eF0130f7A5aA516dCd81Bdc80B18CdE41CAC8)

_**[Bitquery’s account broadly reconciles the consolidation](https://bitquery.io/investigations/initia-hack):** 581.56 ETH from AUSD, 415.70 ETH from the first USDC withdrawal, 105 ETH bridged directly, and 33.18 ETH from the later 80,000 USDC withdrawal, plus roughly 0.098 ETH in initial funding. The figures are rounded, and some ETH was spent on fees._

**[Agora’s freeze landed at 16:31:59 UTC in block 26,256,539 - one hour, 28 minutes and 36 seconds after the AUSD-to-ETH swap](https://x.com/sprunky_eth/status/2113884674724368456). Sprunky counted 441 blocks between them. The attacker’s AUSD balance at the moment of the freeze was zero.**

**Agora batchFreeze Transaction:**  
[0x9df56874a61efc7c84aecc9263a384578d70ec28734990cb74febc3003b794db](https://etherscan.io/tx/0x9df56874a61efc7c84aecc9263a384578d70ec28734990cb74febc3003b794db)

**batchFreeze Caller:**  
[0xcF7D2a525057555d7b4816941185b7ae10E94681](https://etherscan.io/address/0xcF7D2a525057555d7b4816941185b7ae10E94681)

**AUSD Token Contract:**  
[0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a](https://etherscan.io/address/0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a)

_[Bitquery reports that the Ethereum AUSD bridge blocked another 200,000 AUSD payout at 17:51 UTC](https://bitquery.io/investigations/initia-hack). Four of the five required verifiers had signed, but LayerZero Labs' verifier had not._

**[Initia named the consolidation wallet in its October 24](https://x.com/initia/status/2113915002008612945) statement.** 
  
Since then, the funds have started to move.  
  
On October 27, the wallet sent out 400 ETH in two 200 ETH transfers, both to the same recipient address.  
  

**First Outgoing Transfer from the Consolidation Wallet - 200 ETH:**  
[0xf35dcdd4c23816adcd5e1fb6578a75c2d43b4816bf78203b6721cfb59b9cc7f1](https://etherscan.io/tx/0xf35dcdd4c23816adcd5e1fb6578a75c2d43b4816bf78203b6721cfb59b9cc7f1)

**Second Outgoing Transfer from the Consolidation Wallet - 200 ETH:**  
[0x383a55d8caf78c926a5022b8b7a386d1cc31369ca095cdb6b2dc093703b3f038](https://etherscan.io/tx/0x383a55d8caf78c926a5022b8b7a386d1cc31369ca095cdb6b2dc093703b3f038)

**Recipient of Both Transfers:  
[0xA764b87FCB14bC850B68DfE41720Cba3b24a89C0](https://etherscan.io/address/0xA764b87FCB14bC850B68DfE41720Cba3b24a89C0)**

The recipient then distributed ETH to several other addresses. Its subsequent activity included [a 100 ETH Tornado Cash deposit](https://etherscan.io/tx/0xabfc46076fd45942b5b1ca8a2aa6bb6eb0073d81c239ec166fe5e62940632a95).

The attacker had turned forged balances on Initia into real assets on Ethereum. Agora’s freeze came after the AUSD had been exchanged for ETH, and the consolidation wallet later began sending that ETH onward.

Back on Initia, [Bitquery counted $4.55 million in unbacked balances remaining when the chain halted](https://bitquery.io/investigations/initia-hack), at face value.  
  
**That was not money already withdrawn, but forged balances still recorded on the chain, raising the question of how they would be handled before a safe restart.**

_If the chain resumes, what happens to balances that were never backed?_

### Halted, Not Settled  
  
_Initia's recovery had reached the audit stage, but not a scheduled restart._  
  
**On October 27, [the team said a security fix had been drafted and was under audit with security partners](https://x.com/initia/status/2114998062682636376).**  
  
Once those audits were complete, [it would provide concrete plans for restoring the backing of affected assets and restarting the L1 and rollup networks in an orderly manner](https://x.com/initia/status/2114998062682636376).  
  
[The team expected to complete the process “in the coming days,”](https://x.com/initia/status/2114998062682636376) but gave no firm restart date.

  
_On October 28, [Initia said the backing of affected assets would be fully restored when the chain resumes, with help from the Initia Foundation](https://x.com/initia/status/2115345362802053414)._

**[The Foundation approved funding to restore 1:1 backing for affected Noble USDC, WETH and AUSD0 held as iUSD collateral](https://x.com/initiaFDN/status/2115345150369038598). The commitment covers verified shortfalls up to 1.08 million USDC, 105 ETH and 1.4 million AUSD0, following reconciliation and final transfer approval.**  
  
The announcement establishes a funding commitment, not completed transfers.

Exchanges applied their own controls. [KuCoin suspended INIT deposits and withdrawals on October 24](https://www.kucoin.com/announcement/en-kucoin-has-temporarily-closed-the-deposit-and-withdrawal-services-of-initia-init-1).  
  
_On October 26, [Upbit and Bithumb designated INIT a trading-caution asset](https://www.binance.com/en/square/post/381353507304629)._  
  
**[INIT fell to about $0.115 on October 23 before rebounding above $0.15](https://www.kucoin.com/news/flash/initia-halts-l1-and-rollups-after-2-7m-mint-exploit), and [recovered to $0.24 by October 28](https://www.coingecko.com/en/coins/initia).**  
  
The more direct damage was in the reserves that paid out against forged balances.

The Ethereum contract holding AUSD for Initia gave up 1.4 million AUSD and the contract holding ETH lost 105 ETH, [about 71% and 96% of their holdings by D2's count](https://x.com/D2_Finance/status/2113667420359700509).  
  
_[The Noble reserve behind Initia's USDC hit $63 at 15:37 UTC on October 23 and had recovered only to about $24,000](https://bitquery.io/investigations/initia-hack) by 18:52 UTC that day._

**Holders’ exposure depends on the token and its backing arrangements. The AUSD, ETH and USDC reserves were depleted to different degrees.**

Separately, [Bitquery counted $4.55 million in forged balances remaining on Initia when the chain halted, including 3 million iUSD valued at $1 each](https://bitquery.io/investigations/initia-hack). Two attempts to swap some of that forged iUSD into AUSD0 failed.  
  
Face value is not realizable value, and not every forged representation was necessarily transferable or redeemable.

_[The Foundation has approved funding for specified backing shortfalls, subject to reconciliation and final transfer approval](https://x.com/initiaFDN/status/2115345150369038598). That commitment does not specify how the remaining forged balances will be treated._  
  
**Restart timing, treatment of those balances and completion of the backing transfers remain separate questions.**

[Zon called it a "Day 0 bug."](https://x.com/ItsAlwaysZonny/status/2113667290059190466) When checked on October 28, [Initia's public movevm repository listed no published security advisories](https://github.com/initia-labs/movevm/security).  
  
The VM had been put in front of reviewers. [Code4rena’s January 7 to 28, 2025 Initia Move contest included code changes between two specified versions of Initia’s movevm repository in its review scope](https://github.com/code-423n4/2025-01-initia-move), and the contest brief directed reviewers toward the JSON interface and the IBC bridge hook.  
  
_[The brief does not identify script caching as a suggested focus](https://github.com/code-423n4/2025-01-initia-move). It also does not establish whether reviewers tested the rollback-and-republication interaction described in the later replay._

**[The same brief](https://github.com/code-423n4/2025-01-initia-move) links an [earlier Zellic report on Initia](https://github.com/Zellic/publications/blob/master/Initia%20-%20Zellic%20Audit%20Report.pdf), [which records 34 findings, including two rated critical](https://github.com/Zellic/publications/blob/master/Initia%20-%20Zellic%20Audit%20Report.pdf). Its scope included parts of Initia’s movevm repository, including changes to VM code relative to an upstream Aptos version.**  
  
That scope listing does not establish whether reviewers tested the specific script-cache interaction described in the later replay.

[The published local replay reconstructs a failure involving cached verification](https://x.com/0xCanzi/status/2113774415657742370), transaction rollback and module republication, with rollback modeled locally.  
  
**[That reconstruction suggests a targeted test](https://x.com/0xCanzi/status/2113774415657742370):** Compare the same script’s execution in a VM retaining its earlier verification result with execution in a fresh VM after rollback and module replacement. In the replay, the cached approval allowed the forged object through, while the fresh VM rejected it with TYPE_MISMATCH.  
  
_That contrast would flag the kind of stale-verification mismatch demonstrated in the replay._

**[Hexens documented a separate stale type-tag cache flaw in Aptos’s Move VM](https://hexens.io/research/aptos-hijack-bug), involving entries that survived a partial cache flush.**  
  
It concerns a different cache and mechanism from the [script-verification failure described in the Initia reconstruction](https://x.com/0xCanzi/status/2113774415657742370).  
  
The comparison illustrates a broader cache-consistency risk; it does not establish that Initia's fork contained the Aptos flaw.

**Restoring asset backing and restarting the networks are related tasks, not interchangeable ones:** Repairing the VM does not replace the assets already paid out.  
  
**[The Foundation has committed to filling the gaps](https://x.com/initiaFDN/status/2115345150369038598); reconciliation and final transfer approval still stand between that commitment and restored backing.**  
  
_When does a funding promise become a restored backing, and tokens holders can actually redeem?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_**Initia's failure turns on a dangerous assumption:** An old approval still applies._

**[In the published local reconstruction](https://x.com/0xCanzi/status/2113774415657742370), a virtual machine kept a verification result after the code behind it changed.**  
  
Separately, [the on-chain record shows successful bridge exits paying real assets against forged balances](https://bitquery.io/investigations/initia-hack).

LayerZero carried the successful AUSD and ETH withdrawals; USDC left through Noble and Circle's CCTP.

_[About $2.73 million reached Ethereum before the halt](https://bitquery.io/investigations/initia-hack). Another $4.55 million in forged face value remained on Initia._

**Nearly seven weeks earlier, [Liquid Network’s bitcoin reserve fell from approximately 4,205 BTC to 197 BTC following an exploit involving cached range-proof verifications and additional withdrawals before the halt](https://x.com/Liquid_BTC/status/2097404704028545175).**

**The mechanisms differ, but the lesson connects them:** A saved verdict is safe to reuse only while it still applies to what is being checked.  
  
In the Initia replay, [Move's type protections failed when execution relied on a check tied to an earlier version of the code](https://x.com/0xCanzi/status/2113774415657742370).

A patch can close the flaw. A restart can resume execution. Neither, by itself, replaces the assets already paid out.  
  
**[The Foundation has committed to covering the shortfalls](https://x.com/initiaFDN/status/2115345150369038598). Delivering that backing is the next test.**

_How many other systems are still trusting an approval whose assumptions no longer hold?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
