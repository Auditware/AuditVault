---
tags:
  - type/hack
  - blockchain/bitcoin
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/governance
  - web3-sector/lending
  - web3-sector/privacy
  - web3-sector/stable
  - web3-sector/staking
  - vector/access-control
title: "Nomic - Rekt"
protocol: "Nomic"
date: 2026-06-25
loss_usd: 3150000
audit: "N/A"
source: "https://rekt.news/nomic-rekt"
excerpt: "A flaw in Nomic’s forwarding logic minted 40.65 unbacked nBTC and left Osmosis allBTC about $3.15 million short. Osmosis froze 22.65 allBTC, but roughly 18 BTC-equivalent had already reached Tornado C"
---
# Nomic - Rekt

> **Loss:** $3,150,000 | **Date:** 2026-06-25 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/nomic-rekt-header.png)



_[Forty BTC of counterfeit nBTC sat inside Osmosis's Alloyed BTC for seventy-four days](https://protos.com/osmosis-took-74-days-to-discover-40-btc-nomic-exploit/), counted as real collateral the entire time._  
  
**[Nomic minted nBTC through a vulnerable ibc_deliver path, and it crossed a valid IBC connection to Osmosis](https://x.com/Rarma_/status/2097456879266037797). The allBTC transmuter exchanged it 1:1; IBC relayed the packets Nomic emitted.**

**[Osmosis treated nBTC as BTC-equivalent collateral under its design. The failure sat upstream](https://x.com/osmosis/status/2097623097696251926):** Osmosis said a custom forwarding mechanism on Nomic allowed an attacker to double-spend nBTC and send false vouchers to Osmosis.

[Rarma’s reconstruction says Nomic’s ibc_deliver function minted nBTC twice for one incoming deposit](https://x.com/Rarma_/status/2097456879266037797), in a single block, at a one-satoshi IBC fee.  
  
By the time anyone checked the backing, Nomic had gone dark, [its reserve down to 0.746 BTC](https://hackmd.io/optjLjTdTKadPNmMc60gJg), its [GitHub silent for two years](https://github.com/nomic-io/nomic).  
  
**[The result](https://blockfence.io/nomic-nbtc-exploit-creates-3-15m-hole-in-osmosis-alloyed-btc/):** A $3.15 million hole in Alloyed BTC.  
  
[Osmosis froze 22.65 BTC-equivalent after the attacker left that allBTC position idle](https://x.com/osmosis/status/2097623097696251926); the rest [had already moved through cross-chain conversion and into Tornado Cash](https://x.com/Rarma_/status/2097456879266037797), and pulling it back from there is a long shot.

**Every message Nomic sent was cryptographically genuine. The Bitcoin behind it wasn't.**  
  
_So who exactly was watching for the difference?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Protos](https://protos.com/osmosis-took-74-days-to-discover-40-btc-nomic-exploit/), [Osmosis](https://x.com/osmosis/status/2097623097696251926), [Rarma](https://x.com/Rarma_/status/2097456879266037797), [Johnny Wyles](https://hackmd.io/optjLjTdTKadPNmMc60gJg), [Blockfence](https://blockfence.io/nomic-nbtc-exploit-creates-3-15m-hole-in-osmosis-alloyed-btc/), [Ray Raspberry](https://x.com/RayRaspberry1/status/2097874335142699115), [Sunny Aggarwal](https://x.com/sunnya97/status/2097477013300809820), [Trail of Bits](https://github.com/trailofbits/publications/blob/master/reviews/2024-11-nomic-securityreview.pdf)_

**Seventy-four days passed before the discrepancy was discovered. [Protos reported that neither Nomic nor Osmosis publicly disclosed it during that period](https://protos.com/osmosis-took-74-days-to-discover-40-btc-nomic-exploit/).**  
  
[The exploit only came to light](https://hackmd.io/optjLjTdTKadPNmMc60gJg) because Nomic's chain halted. That halt is what sent Osmosis digging through its own holdings.

[Rarma's reconstruction says the remaining 22.650608 allBTC position had not moved](https://x.com/Rarma_/status/2097456879266037797) since July 17.  
  
[It identifies 25 identical IBC packets, each for the same amount](https://x.com/Rarma_/status/2097456879266037797), originating [in one Nomic transaction and arriving on Osmosis in a single block on June 25th](https://nomic-explorer.nosnode.com/tx/BEE54496B351A018D092779FE6C833238E1CDF965FE9761A572934F37932E028).  
  
_Nomic's [Twitter account has not posted since 2024](https://x.com/nomicbtc)._

**Then Nomic halted. [Rarma's trace places its final block at 15:30:21 UTC on September 7](https://x.com/Rarma_/status/2097456879266037797).**  
  
[It says Bitcoin checkpointing had stopped 23 hours and 39 minutes earlier](https://x.com/Rarma_/status/2097456879266037797), while the chain continued producing blocks.

[The Osmosis governance proposal says Nomic's September 7 halt led Osmosis to check Bitcoin backing](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122), revealing 0.746 BTC of reserve against 40.650602 nBTC minted without Bitcoin backing.

_[The proposal says 39.839746 nBTC of that unbacked issuance was inside](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122) the allBTC transmuter._  
  
**It also says [validators used emergency upgrade v31.1.0 on September 7 to freeze 22.650608 allBTC that the actor had not moved or sold](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122).**

[Rarma published a public forensic trace on September 8](https://x.com/Rarma_/status/2097456879266037797), opening with the finding that allBTC was 63.97% backed.  
  
[Osmosis later issued its own public incident statement](https://x.com/osmosis/status/2097623097696251926) the next day.  
  
**The public record shows an outside researcher publishing a detailed forensic account before Osmosis issued its public incident statement. Meanwhile, Nomic remains silent.**

_What does "rapid response" mean when an outside researcher publishes a detailed forensic account before the protocol's own public incident statement?_

### Two Mints, One Delivery

_[Osmosis calls it a custom forwarding mechanism](https://x.com/osmosis/status/2097623097696251926). That phrase is doing some quiet work._

**[Rarma’s reconstruction identifies the function](https://x.com/Rarma_/status/2097456879266037797) as Nomic’s ibc_deliver.**

[Mint nBTC for the requested amount.](https://x.com/Rarma_/status/2097456879266037797) Pass that coin into burn_coins_execute. Mint the same amount again.

[The second mint was credited to the delivery instruction’s destination](https://x.com/Rarma_/status/2097456879266037797) as spendable nBTC.

Two mints. One delivery. The first coin is consumed. The second becomes spendable nBTC at the destination.

_[The June 25 transaction produced 25 send_packet events](https://x.com/Rarma_/status/2097456879266037797), each for 162,602,409,537,873 µsat, totaling 40.65060238 nBTC._  
  
**[Rarma’s trace places all 25 arrivals in Osmosis block 64,910,685](https://x.com/Rarma_/status/2097456879266037797), over channel-6897, through six relayer transactions.**

[Rarma says the code set IBC_FEE_USATS to 1,000,000, one satoshi.](https://x.com/Rarma_/status/2097456879266037797) Its fund-flow reconciliation separately estimates that roughly 0.0388 BTC-equivalent was lost to slippage, relayer fees, and gas as the proceeds moved through other systems.

None of this required breaking IBC. [Osmosis said IBC was not compromised](https://x.com/osmosis/status/2097623097696251926); it attributed the incident to a bug in Nomic’s custom forwarding mechanism that allowed the attacker to double-spend nBTC and send false vouchers to Osmosis.  
  
IBC delivered packets Nomic had emitted and Osmosis accepted under the chains’ normal protocol rules.

**[The failure sat upstream](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122):** Nomic’s forwarding path created nBTC without corresponding Bitcoin backing.

**[Osmosis’s remediation proposal says that, on June 25](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122), the Nomic bridge minted 40.650602 nBTC with no Bitcoin behind it across 25 identical IBC transfers in a single transaction.**

_Once those coins existed, where did they go?_

### Out Through the Alloy

_[The 25 nBTC packets tied to the counterfeit June 25 mint reached Osmosis](https://x.com/Rarma_/status/2097456879266037797) within minutes._  
  
**What happened next split into two paths.**  
  
[According to Rarma's transaction-level reconstruction](https://x.com/Rarma_/status/2097456879266037797), roughly 18 nBTC-worth was converted and routed out through other systems.

[Rarma traces the remaining 22.65060847 nBTC to an allBTC conversion](https://x.com/Rarma_/status/2097456879266037797) on July 17.  
  
The resulting position then remained dormant [until Osmosis froze it on September 7th](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122).

**Mint Transaction:** [BEE54496B351A018D092779FE6C833238E1CDF965FE9761A572934F37932E028](https://nomic-explorer.nosnode.com/tx/BEE54496B351A018D092779FE6C833238E1CDF965FE9761A572934F37932E028)  
  
**Osmosis packet recipient / [later frozen allBTC position](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122):** [osmo1wq76r2mhqsa9yaygghuwyq4wy6dcsgf8vtzltn](https://www.mintscan.io/osmosis/address/osmo1wq76r2mhqsa9yaygghuwyq4wy6dcsgf8vtzltn)  
  
_Nomic is halted, and its available public explorer has limited address-level visibility._  
  
**[The surviving transaction record lists nomic1kq2rzz6fq2q7fsu75a9g7cpzjeanmk685ak9g7 as the sender of all 25 outbound IBC packet transfers](https://nomic-explorer.nosnode.com/tx/BEE54496B351A018D092779FE6C833238E1CDF965FE9761A572934F37932E028) to the Osmosis address above.**

[Rarma's reconstruction identifies nomic1wq76r2mhqsa9yaygghuwyq4wy6dcsgf8cgz4wt](https://x.com/Rarma_/status/2097456879266037797) as the transaction signer.  
  
Osmosis subsequently froze 22.650608 allBTC in the corresponding Osmosis address through emergency upgrade v31.1.0, [according to its recovery proposal](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122).

[The same 20-byte account identifier appears in addresses](https://x.com/Rarma_/status/2097456879266037797) on several chains.

**Noble:**
[noble1wq76r2mhqsa9yaygghuwyq4wy6dcsgf8vny890](https://www.mintscan.io/noble/address/noble1wq76r2mhqsa9yaygghuwyq4wy6dcsgf8vny890)  
  
**Axelar:**
[axelar1wq76r2mhqsa9yaygghuwyq4wy6dcsgf8q788kq](https://www.mintscan.io/axelar/address/axelar1wq76r2mhqsa9yaygghuwyq4wy6dcsgf8q788kq)

**Ethereum beneficiary in Rarma's trace:**  
[0x8f36fd9ffc0a8ca373aa7a4787292536a489d2b5](https://etherscan.io/address/0x8f36FD9FfC0a8cA373AA7A4787292536a489d2B5)

_[Rarma's trace follows the proceeds from those Cosmos addresses to that Ethereum](https://x.com/Rarma_/status/2097456879266037797) beneficiary._

**[About nine minutes after the June 25th Nomic mint block](https://nomic-explorer.nosnode.com/tx/BEE54496B351A018D092779FE6C833238E1CDF965FE9761A572934F37932E028), the Osmosis recipient began converting the counterfeit nBTC through [Pool 1868](https://www.mintscan.io/osmosis/tx/FE5383D9586D0F416686B0D6EA35B40E189391A63EA77E2EE5698E7E217E47A1?height=64911162), the allBTC transmuter.**

[Rarma describes the pool as a nominal 1:1](https://x.com/Rarma_/status/2097456879266037797), no-slippage conversion path between allBTC constituents.

[Rarma's trace places the initial nBTC-to-WBTC conversions and bridge-outs within roughly fifteen minutes](https://x.com/Rarma_/status/2097456879266037797); other exits followed later that night and again on June 28th.

_[Rarma's trace records the following Osmosis-side sequence](https://x.com/Rarma_/status/2097456879266037797) as follows…_

**June 25, 21:59:14 UTC - 1.0 nBTC to 1.0 WBTC.eth.axl through Pool 1868:** [FE5383D9586D0F416686B0D6EA35B40E189391A63EA77E2EE5698E7E217E47A1](https://www.mintscan.io/osmosis/tx/FE5383D9586D0F416686B0D6EA35B40E189391A63EA77E2EE5698E7E217E47A1?height=64911162)

**June 25, 22:02:46 UTC - 7.0 nBTC to 7.0 WBTC.eth.axl through Pool 1868:** [F218AA3055284DED74587B212CDF00EEA4F7BAED821844BDAFE43047078D1301](https://www.mintscan.io/osmosis/tx/F218AA3055284DED74587B212CDF00EEA4F7BAED821844BDAFE43047078D1301?height=64911346)

**June 25, 22:11:27 UTC - 8.0 WBTC.eth.axl sent by IBC from Osmosis through Axelar GMP to the [Squid Router contract on Ethereum](https://etherscan.io/address/0xce16F69375520ab01377ce7B88f5BA8C48F8D666):** 
[468D435D4705105362DB6BEABFB98852156998A1973CBAA146E1737AC637EE82](https://www.mintscan.io/osmosis/tx/468D435D4705105362DB6BEABFB98852156998A1973CBAA146E1737AC637EE82?height=64911801)

**June 25, 22:12:35 UTC - 10.0 nBTC to 10.0 WBTC.eth.axl through Pool 1868:** [4F1DBB779AEF8ADAEACE65381FDB053120CDB6BE35E7EB81EDA752D3ADBAB96F](https://www.mintscan.io/osmosis/tx/4F1DBB779AEF8ADAEACE65381FDB053120CDB6BE35E7EB81EDA752D3ADBAB96F?height=64911856)

**June 25, 22:14:21 UTC - 1.5 WBTC.eth.axl sent by IBC from Osmosis through Axelar GMP to the [Squid Router contract on Ethereum](https://etherscan.io/address/0xce16F69375520ab01377ce7B88f5BA8C48F8D666):**  
[EF6FFD3034E32DC52B04262681E10311F1EBA626BA0CE7510992963387A30794](https://www.mintscan.io/osmosis/tx/EF6FFD3034E32DC52B04262681E10311F1EBA626BA0CE7510992963387A30794?height=64911947)

**June 25, 22:28:53 UTC - 0.29880120 WBTC.eth.axl to 8.097670262686151 ETH.axl:** [DBCA034646E2A9690D03FD8E753E85C58206ED0DDE5E2A52E69A6D4424F99A81](https://www.mintscan.io/osmosis/tx/DBCA034646E2A9690D03FD8E753E85C58206ED0DDE5E2A52E69A6D4424F99A81?height=64912704)

**June 25, 22:29:53 UTC - 8.097670262686151 ETH.axl sent by IBC from Osmosis through Axelar GMP to the [Squid Router contract on Ethereum](https://etherscan.io/address/0xce16F69375520ab01377ce7B88f5BA8C48F8D666):** [F879A15766BED480F913E74888F572574D88F603CE2EEC97E67946C2A4A1D1D7](https://www.mintscan.io/osmosis/tx/F879A15766BED480F913E74888F572574D88F603CE2EEC97E67946C2A4A1D1D7?height=64912733)

**June 25, 23:24:58 UTC - 1.99940004 allBTC to 112,509.461495 USDC, sent by IBC from Osmosis to noble1wq76r2mhqsa9yaygghuwyq4wy6dcsgf8vny890 on Noble:** [65BD688B63AA6E3EC99E6D3F781086CB85243934E1BF15592ECAB8A73698BE8E](https://www.mintscan.io/osmosis/tx/65BD688B63AA6E3EC99E6D3F781086CB85243934E1BF15592ECAB8A73698BE8E?height=64915592)

**June 28, 18:33:44 UTC - 6.16296736 WBTC.eth.axl sent by IBC from Osmosis through Axelar GMP to the [Squid Router contract on Ethereum](https://etherscan.io/address/0xce16F69375520ab01377ce7B88f5BA8C48F8D666):** [70DFD62F6DC370C25EDD726CF87BCDB3F668E9049AC88B46E6C7E15C0E182904](https://www.mintscan.io/osmosis/tx/70DFD62F6DC370C25EDD726CF87BCDB3F668E9049AC88B46E6C7E15C0E182904?height=65121991)

**July 17, 22:44:35 UTC - 22.65060846827203 nBTC to 22.65060846 allBTC through Pool 1868:**
[8305D3D413AB95576A5DB59F2AA7F4315ED2386BE0A803F290990263021E8D7E](https://www.mintscan.io/osmosis/tx/8305D3D413AB95576A5DB59F2AA7F4315ED2386BE0A803F290990263021E8D7E?height=66554379)

  
**[Mintscan's event logs for that transaction independently establish the allBTC-to-USDC swap and outbound IBC packet to Noble](https://www.mintscan.io/osmosis/tx/65BD688B63AA6E3EC99E6D3F781086CB85243934E1BF15592ECAB8A73698BE8E?sector=json):** 1.99940004 allBTC spent, 112,509.461495 USDC in the post-swap IBC action, and an address on Noble named as the packet receiver.  
  
**Noble Receiver:**  
[noble1wq76r2mhqsa9yaygghuwyq4wy6dcsgf8vny890](https://ibc.range.org/transactions?sc=INTERCHAIN&s=noble1wq76r2mhqsa9yaygghuwyq4wy6dcsgf8vny890)

_That allBTC balance did not move after July 17th, [according to Rarma's trace](https://x.com/Rarma_/status/2097456879266037797)._  
  
**[Osmosis later froze 22.650608 allBTC in the corresponding address](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122) through the validator-operated emergency upgrade v31.1.0.**

Rarma traces the Axelar-routed WBTC proceeds through four GMP calls naming [SquidRouter](https://etherscan.io/address/0xce16F69375520ab01377ce7B88f5BA8C48F8D666) as the Ethereum destination contract, while encoding an Ethereum beneficiary in the payload.  
  
**Ethereum Beneficiary:**  
[0x8f36fd9ffc0a8ca373aa7a4787292536a489d2b5](https://etherscan.io/address/0x8f36fd9ffc0a8ca373aa7a4787292536a489d2b5)

[The execution path runs through Axelar Gateway](https://x.com/Rarma_/status/2097456879266037797), SquidRouter, SquidMulticall, a Uniswap V3 WBTC/WETH pool, WETH unwrapping, and native ETH delivery to the beneficiary.

**303.01315917 ETH:** [0x75b42eceb283eaa88303d23bca8f9ccc6c5579cdfc1e8c757ea1e33118dd125b](https://etherscan.io/tx/0x75b42eceb283eaa88303d23bca8f9ccc6c5579cdfc1e8c757ea1e33118dd125b)  
  
**57.09781972 ETH:** [0xe051dc2bbb37b1510faecaeace9288ca5bc0deda9562bdfe164643d268e69236](https://etherscan.io/tx/0xe051dc2bbb37b1510faecaeace9288ca5bc0deda9562bdfe164643d268e69236)  
  
**8.09751591 ETH:** [0x3dc170230bbbaab36b0bbfb0201ba705d09448be9db973c3725a72577e54ae1a](https://etherscan.io/tx/0x3dc170230bbbaab36b0bbfb0201ba705d09448be9db973c3725a72577e54ae1a)  
  
**232.39729801 ETH:** [0x6426edf655e833c2544a5541faceadb22d8d7c9a758432b409932155b6b4148f](https://etherscan.io/tx/0x6426edf655e833c2544a5541faceadb22d8d7c9a758432b409932155b6b4148f)

Those receipts didn't appear in a standard token-transfer scan. [Rarma says it identified them through debug_traceTransaction](https://x.com/Rarma_/status/2097456879266037797), which exposes the internal contract calls.

[Rarma traces the USDC leg through Noble](https://x.com/Rarma_/status/2097456879266037797) and Circle's CCTP.

**Noble Burn 1, 56,254.663934 USDC:** [14003B7245C38C55778DA07C77AC123A69711AD95D264EC2F4DDA162985C0CD3](https://ibc.range.org/status?id=bm9ibGUtMS8zNDkwNTA)  
  
**Noble Burn 2, 56,254.623933 USDC:** [D8FFF6FD4538CA34B0F40AB842E1C67AF1590DA922AF93B29B0475C7C055FF99](https://ibc.range.org/status?id=bm9ibGUtMS8zNDkwNTI)

**Both named the same Ethereum beneficiary as mint_recipient. [Rarma traces the minted USDC through 1inch Fusion into 71.14822656 ETH](https://x.com/Rarma_/status/2097456879266037797).**

_**Across both routes, [Rarma's trace says the beneficiary received 671.75412248 ETH, then sent 671.10 ETH to the Tornado Cash router](https://x.com/Rarma_/status/2097456879266037797), [](https://etherscan.io/address/0xd90e2f925da726b50c4ed8d0fb90ad053324f31b) across 34 deposits:** 439.10 ETH on June 25th, and 232.00 ETH on June 28th. 0.5753708194 ETH remained in the address in Rarma's cited snapshot._  
  
**Tornado Cash Movement:**  
[0x8f36fd9ffc0a8ca373aa7a4787292536a489d2b5](https://etherscan.io/txs?a=0x8f36fd9ffc0a8ca373aa7a4787292536a489d2b5&f=2)

[Rarma's trace identifies the beneficiary's only pre-exploit funding as 0.03729586 ETH on June 22nd](https://x.com/Rarma_/status/2097456879266037797), from an apparent address-poisoning bot, followed 24 seconds later by a counterfeit token from a lookalike address.  
  
[The trace found no exchange or mixer deposit into the wallet beforehand](https://x.com/Rarma_/status/2097456879266037797), and the funding amount was enough to pay transaction costs.

**One address [circulated as "the exploiter"](https://x.com/Rarma_/status/2097456879266037797):**  
Nomic1rk07saqmvfle50h4h9hul00g67xzrcc5ytfxjm  
  
_**Editor’s note:** Nomic’s chain was unavailable for independent address-level verification at the time of review, so the address above is currently unavailable._  
  
**[Rarma's review counts about 3,100 transactions on it, all update_client calls for an IBC light client](https://x.com/Rarma_/status/2097456879266037797), consistent with a relayer, and says it found no basis to treat it as the attacker.**

[Osmosis's recovery proposal says 18 BTC was extracted and laundered through Tornado Cash](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122). The remaining 22.650608 allBTC sat in an address that could later be frozen.  
  
[Against the proposal's 39.839746 BTC allBTC shortfall](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122), that freeze preserves about 56.9% of the deficit, leaving roughly 17.19 BTC still uncovered.

**Freezing the slow money doesn't unwind what already went through Tornado Cash.**  
  
_So what exactly does a freeze recover, the funds themselves, or just the standing to vote on what's left of them?_

### Nineteen Months Later

_[Osmosis's recovery proposal has four moving parts](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122), and at least one depends on a later governance decision that the proposal does not itself execute._  
  
**First, [it would cancel the pending USDC.noble-to-allUSDC liquidity redeployment](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122), freeing an estimated 7.75 BTC of Community Pool-owned BTC.**  
  
[The proposal assigns 4.7053 BTC to the residual re-peg gap and would redeploy the roughly 3 BTC remainder into the planned wide liquidity position](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122) between 40,000 and 160,000 USDC.  
  
Second, [it would allocate 12.4838 allBTC from the community pool to the Liquidity subDAO](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122).  
  
Third, [it would authorize use of the 22.650608 allBTC frozen at the attacker-linked address](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122), but the proposal says moving that balance requires a separate software upgrade, the transfer is not self-executing.  
  
_Fourth, [it would mark nBTC as corrupted in the allBTC transmuter; the Liquidity subDAO would then withdraw the corrupted nBTC against the collateral supplied in steps two and three, and burn it](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122). Once the nBTC balance reached zero and had been removed from the alloy, Osmosis would restore allBTC deposit and withdrawal functionality._

**[A smaller controversy ran alongside](https://x.com/RayRaspberry1/status/2097874335142699115) the emergency response.**  
  
**[The Osmosis Foundation converted roughly 9 BTC of its own allBTC exposure into WBTC hours before the pool was paused](https://mintscan.io/osmosis/tx/D43E123EE07576B1445DE95D0747A474E6B756B17920FD4BC7F38D5076BC4092), timing that raised an obvious question:** Did someone know early?
  
[The Foundation's answer was a coincidental test of native WBTC burns with Bitglobal](https://x.com/sunnya97/status/2097477013300809820), accompanied by a chronology intended to document that explanation.  
  
Maybe so. The transaction still required an explanation because, absent one, its timing suggested something else.

_Nomic's balance sheet carries a smaller, separate hole. [About 0.797700 nBTC from the fraudulent issuance never entered allBTC](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122), placing it outside the proposed recapitalization entirely._  
  
**[The same forum proposal puts Nomic's entire remaining Bitcoin reserve at 0.746 BTC](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122), close to the external float but not enough to cover it.**  
  
With Nomic halted, neither side of that equation has a live redemption path.

[Nomic's Twitter account went quiet in 2024.](https://protos.com/osmosis-took-74-days-to-discover-40-btc-nomic-exploit/) [](https://github.com/nomic-io/nomic/releases) Its [public release history did too.](https://github.com/nomic-io/nomic/releases) After that, sustained public communication was hard to find.[  
 ](https://github.com/nomic-io/nomic/blob/3dccaf5d6349430148fa490cc4a0bddbf2ef433e/src/app.rs#L651-L684)

[Public GitHub activity visible in the repository history appears to end on October 31, 2024](https://github.com/nomic-io/nomic/commit/70ee32a220050ef56c919b984a1c6b9b0cfd9c49), well before the June 2026 exploit.

_In November 2024, [Trail of Bits published a ten-week security review of Nomic](https://github.com/trailofbits/publications/blob/master/reviews/2024-11-nomic-securityreview.pdf). The engagement covered incoming BTC deposits, outgoing nBTC withdrawals, and transfers of nBTC to native accounts and IBC-compatible chains._  
  
**[The report rated authentication and access controls as strong](https://github.com/trailofbits/publications/blob/master/reviews/2024-11-nomic-securityreview.pdf), found no critical-severity issues, and identified one medium-severity finding.**

[The report also illustrates the limits of a point-in-time audit](https://github.com/trailofbits/publications/blob/master/reviews/2024-11-nomic-securityreview.pdf). In its destination-commitment finding, Trail of Bits wrote that Nomic had already changed the relevant code before the review began, but that the updated code was not included in the audited commit.  
  
The auditors could therefore identify the issue in the supplied revision, but could not independently verify the claimed remediation.

The same principle applies when comparing the two available ibc_deliver source snapshots.  
  
_[At commit 809092f](https://github.com/nomic-io/nomic/blob/809092f/src/app.rs), the function treated the IBC transfer memo as a Bitcoin-withdrawal request. Its second nBTC mint appeared only in the error-handling path, returning funds when that withdrawal could not be completed._  
  

**[At commit 3dccaf5](https://github.com/nomic-io/nomic/blob/3dccaf5d6349430148fa490cc4a0bddbf2ef433e/src/app.rs#L651-L684), ibc_deliver follows a different model. It parses the memo as a general Dest, burns the nBTC credited to the temporary IBC receiver, mints nBTC outside a failed-withdrawal refund path, and routes the resulting value through bitcoin.insert_pending.**  
  
[The same implementation explicitly assigns the sender field to Identity::None and leaves a TODO](https://github.com/nomic-io/nomic/blob/3dccaf5d6349430148fa490cc4a0bddbf2ef433e/src/app.rs#L651-L684), indicating that sender handling remained unfinished.  
  

The two snapshots show materially different ibc_deliver implementations.  
  
[The Trail of Bits report supports conclusions about the code revisions in scope during its engagement](https://github.com/trailofbits/publications/blob/master/reviews/2024-11-nomic-securityreview.pdf), not automatically about the memo-directed forwarding, pending-deposit, and sender-handling logic visible in [3dccaf5](https://github.com/nomic-io/nomic/blob/3dccaf5d6349430148fa490cc4a0bddbf2ef433e/src/app.rs#L651-L684).  
  
**No cited public source documents an independent assessment of the ibc_deliver rewrite at [3dccaf5](https://github.com/nomic-io/nomic/blob/3dccaf5d6349430148fa490cc4a0bddbf2ef433e/src/app.rs#L651-L684). That is not evidence that no later review occurred, but it does mean the public record does not show one.**  
  

_If an audit reviewed an earlier revision of the right file, but the relevant code path was materially rewritten afterward, what is the shelf life of the word “audited”?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_Nobody hacked Bitcoin. [Nobody hacked IBC. Nobody even hacked Osmosis.](https://x.com/osmosis/status/2097623097696251926)_

**A rewritten forwarding function on a lightly monitored chain minted [roughly 40 BTC of nBTC without corresponding Bitcoin collateral](https://x.com/Rarma_/status/2097456879266037797), and the discrepancy went unnoticed for [seventy-four days](https://protos.com/osmosis-took-74-days-to-discover-40-btc-nomic-exploit/).**  
  
By then, [Rarma's trace shows the liquid proceeds had already crossed chains](https://x.com/Rarma_/status/2097456879266037797), converted to ETH, [and moved through Tornado Cash](https://x.com/Rarma_/status/2097456879266037797).  
  
The slower-moving balance sat in the open the entire time, in a position anyone could have queried, on a ledger anyone could have read.  
  
**Osmosis has a plan to make holders whole, [most of it contingent on a governance vote that hasn't happened yet](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122).**  
  
[Nomic has its own unresolved 0.7977 BTC hanging off a halted chain](https://forum.osmosis.zone/t/alloyed-btc-restore-backing-after-the-nbtc-incident/4122) nobody can currently withdraw from.  
  
[The audit covered exactly the right file](https://github.com/trailofbits/publications/blob/master/reviews/2024-11-nomic-securityreview.pdf). It just didn't cover the version of it that ended up costing $3.15 million.  
  
**The audit wasn't a lie. It was a snapshot. The failure was treating that snapshot as if it stayed true after the code changed.**

_If nineteen months and one rewrite is all it takes to turn a clean audit into a false sense of security, how many other bridges are still running on a snapshot nobody's checked since?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
