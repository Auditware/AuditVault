---
tags:
  - type/hack
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/governance
  - web3-sector/multisig
  - web3-sector/privacy
  - web3-sector/stable
  - web3-sector/staking
  - web3-sector/token
  - vector/bridge-exploit
  - vector/private-key
title: "Gravity Bridge - Rekt"
protocol: "Gravity Bridge"
date: 2026-05-29
loss_usd: 5400000
audit: "N/A"
source: "https://rekt.news/gravity-bridge-rekt"
excerpt: "$5.4 million gone from Gravity Bridge after an attacker minted worthless tokens on Osmosis, poisoned the token registry with a fabricated denom string, and walked out with real assets. The attacker di"
---
# Gravity Bridge - Rekt

> **Loss:** $5,400,000 | **Date:** 2026-05-29 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/gravity-bridge-rekt-header.png)


_Nobody broke the code._  
  
**The attacker didn't need to. They just needed the bridge to trust a string.** 
  

Gravity Bridge, the Ethereum-Cosmos corridor and [decentralized alternative to multisig bridges](https://cointelegraph.com/news/cosmos-based-gravity-bridge-halts-bridge-after-reported-54m-exploit), was [drained on May 29th](https://x.com/SpecterAnalyst/status/2060613063816941820) in a denom mapping exploit.  
  
The attacker [minted worthless tokens on Osmosis, embedded real Ethereum custody addresses inside a fabricated denom string, and called a permissionless function](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) that the bridge accepted without question.  
  

Once the bridge's token registry was poisoned, the rest followed automatically.  
  
_[Validators signed the withdrawal batches legitimately,](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) they had no way of knowing the registry mapping their signatures to real assets had been corrupted._  
  
**The contract executed exactly what it was told. It always does.**

  

$4.3M in USDC, 274 WETH, $434K in USDT, and 14.16 PAXG, [swept clean before a single public alert landed](https://x.com/QuillAudits_AI/status/2060654689126154700).  
  
[By the time Specter flagged it](https://x.com/SpecterAnalyst/status/2060613063816941820), the funds were already moving.

  

[The fix appears to have been a lookup that already existed in the codebase](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning). It just was never called in the right place.

  

[The bridge remained offline](https://x.com/gravity_bridge/status/2060737691348807698) at the time of writing. The team has said almost nothing. No postmortem. No entry point disclosed.  
  
**[The investigation continues](https://x.com/gravity_bridge/status/2060737691348807698), which is another way of saying: nobody is ready to say out loud how a missing function call cost $5.4 million.**

  

**[Getting there required one preparatory step](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning):** Registering as a validator with 80 GRAV, just enough to submit claims alongside the real ones.

  
**Every validator signature was clean. Every batch withdrawal was valid. The bridge did exactly what the protocol told it to do, it just never thought to ask whether what it was told was true.**

  
_When the entire security model rests on a registry that trusts whatever it receives, and the check that would have caught it was sitting unused in the same file, what exactly was the audit supposed to find?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [CoinTelegraph](https://cointelegraph.com/news/cosmos-based-gravity-bridge-halts-bridge-after-reported-54m-exploit), [Specter](https://x.com/SpecterAnalyst/status/2060613063816941820), [QuillAudits](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning), [Gravity Bridge](https://x.com/gravity_bridge/status/2060737691348807698), [PeckShield](https://x.com/PeckShieldAlert/status/2060636956984594521?s=20), [ForgeAudit](https://x.com/ForgeAudit/status/2060681036955283588), [Popeye](https://t.me/ETHSecurity/157993), [TheBlock](https://www.theblock.co/post/403108/cosmos-based-gravity-bridge-drained-of-5-4-million-in-suspected-key-compromise-researchers-say), [Blockchain News](https://blockchain.news/news/gravity-bridge-halts-54m-exploit), [AMB Crypto](https://ambcrypto.com/gravity-bridge-hack-drains-5-4m-as-tvl-crashes-47-details/), [Least Authority](https://leastauthority.com/static/publications/LeastAuthority_Althea_Gravity%20Bridge_Final_Audit_Report.pdf)_

**Specter was first on the scene.**

  

**On May 29th, [the on-chain analyst posted to X with no hedging](https://x.com/SpecterAnalyst/status/2060613063816941820):** "It appears the Gravity Bridge - bridge contract key may have been compromised, resulting in the theft of $5.4M."

  
Four assets itemized. Two theft addresses published. The vulnerable contract flagged. The alert was surgical, and it landed after the damage was done.

  

**Primary Theft Wallet:**  
[0x7B582033061b96cC3F9421e73a749ED7C62da1F9](https://etherscan.io/address/0x7b582033061b96cc3f9421e73a749ed7c62da1f9)

  
**Secondary Theft Wallet:**  
[0x4d3ca32e687e871a58b78AcAc73bE59AC37C7A47](https://etherscan.io/address/0x4d3ca32e687e871a58b78AcAc73bE59AC37C7A47)

  
**Vulnerable Contract:**  
[0xa4108aa1ec4967f8b52220a4f7e94a8201f2d906](https://etherscan.io/address/0xa4108aa1ec4967f8b52220a4f7e94a8201f2d906)

  
_**[PeckShield followed with confirmation:](https://x.com/PeckShieldAlert/status/2060636956984594521?s=20)** ~$5.4M drained, including $4.3M in USDC and 274 ETH._  
  
**[The initial read across security firms](https://x.com/SpecterAnalyst/status/2060613063816941820) pointed toward a contract key or signing path compromise, a reasonable interpretation of what the Ethereum-side record showed.** 
  
Every alert named the same suspected vector. None of them had yet looked at what was happening on Cosmos, where the groundwork for the attack had already been laid before the first withdrawal hit Ethereum. 


**Gravity Bridge's own response arrived in two posts.**  
  
_**[The first on May 30th](https://x.com/gravity_bridge/status/2060715098809970741), almost 7 hours [after Specter’s initial alert](https://x.com/SpecterAnalyst/status/2060613063816941820):** "There was an unfortunate incident on Gravity. Validators should halt their validators and orchestrators while this incident is being investigated."_

**[The second, an hour and a half later](https://x.com/gravity_bridge/status/2060737691348807698):** "Thanks to the swift action of validators, the bridge is currently halted while investigations continue."

That was it. No figure. No technical detail. No acknowledgment of the 282-day dormant wallet, the validator set reduction, or the timeline of events that security researchers had already assembled in public.

The bridge was halted. Everything else was silence.

[TheBlock confirmed it was unable to immediately reach Gravity Bridge](https://www.theblock.co/post/403108/cosmos-based-gravity-bridge-drained-of-5-4-million-in-suspected-key-compromise-researchers-say) for comment.

**Security firms mapped the attack in hours. The team posted two sentences and went quiet.**  
  
_So who exactly is still waiting for an explanation, and who already has one?_  
  
### Poison the Registry

  
_[The attack began on the Cosmos side,](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) after the attacker established a minimal validator foothold._  
  

**But before the attacker touched Osmosis, they did something quieter.**  
  
**[They registered a validator on Gravity chain under the handle julia666,](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) self-delegating just 80 GRAV:**  
[gravityvaloper1rdwckpx2p3mwu4k8xdz8vmd4x3mqx4v9ars8k](https://www.mintscan.io/gravity-bridge/validators/gravityvaloper1rdwckpx2p3mwu4k8xdz8vmd4x3mqx4v98ars8k)

[That minimal stake was enough to satisfy the checkOrchestratorValidatorInSet requirement](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) that gates claim submission.  
  
[The attacker's orchestrator could now submit MsgERC20DeployedClaim messages alongside legitimate validators](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning). No meaningful voting weight. Just a registered presence in the set.

  
**Create validator transaction:** [F6AA34E8D01C55A5F1E38310E816DBB4BEE25B2FDB29ACD7ED1E25352BA62009](https://www.mintscan.io/gravity-bridge/tx/F6AA34E8D01C55A5F1E38310E816DBB4BEE25B2FDB29ACD7ED1E25352BA62009?height=22694591)

  
**Orchestrator Ethereum key:**  
[0x91B52e07132a49DAD1B7a3939a51547f79468Ec7](https://etherscan.io/address/0x91b52e07132a49dad1b7a3939a51547f79468ec7)

  
_With that foothold established, the attacker moved to Osmosis._  
  
**[Osmosis's tokenfactory module lets any address](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) mint arbitrary tokens at zero cost.**  
  
**[Using the an address on Osmosis, the attacker created four fake tokens , one mirroring each real asset sitting in Gravity Bridge's Ethereum custody:](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning)** USDC, USDT, WETH, and PAXG.  
  
**Attacker Address on Osmosis:**  
[osmo1m9athjzah02f2mnrgtcke7e5ya3zpvw8lccuss](https://www.mintscan.io/osmosis/address/osmo1m9athjzah02f2mnrgtcke7e5ya3zpvw8lccuss)

  
_[These tokens held no value and represented nothing](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning). Once minted, all four were IBC-transferred to Gravity chain over channel-144, where each received a plain ibc/HASH denom identifier._

  
**[Once the fake tokens landed on Gravity chain,](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) the attacker moved to Ethereum.**

[The Gravity Bridge contract has a permissionless deployERC20() function](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning)

that anyone can call to register a Cosmos-originated token on Ethereum.

  
[The attacker's Ethereum address called it four times,](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) passing a fabricated _cosmosDenom argument each time.  
  
**Attacker Address on Ethereum:**  
[0x73E95aE5f3b87e02D4547AFE86d0d466e9450d6B](https://etherscan.io/address/0x73e95ae5f3b87e02d4547afe86d0d466e9450d6b)Rather than passing the plain ibc/HASH Gravity had been assigned to each fake token, [the attacker embedded the real Ethereum contract address of the corresponding custody token as a path segment inside the denom string.](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning)

**The USDC call, for example, passed:**
[ibc/C92D312D79D9C44B6C6F94AF40FFCB30A334D87F08952D6ED9904E3E83A9F50C/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/transfer/channel-10/factory/osmo1m9athjzah02f2mnrgtcke7e5ya3zpvw8lccuss](https://etherscan.io/token/0x9a280b869a73b6ff812a599E40ABd8dbdFB738c2)

[The function deployed a fresh CosmosERC20 wrapper contract and emitted ERC20DeployedEvent](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) carrying the fabricated denom string verbatim. No validation was performed on what _cosmosDenom contained.

  
**Fake USDC Deploy:** [0x92b2a61d88b3f68d7d3b5cba4a12f53e0c226287702d72de80a60515987e3532](https://etherscan.io/tx/0x92b2a61d88b3f68d7d3b5cba4a12f53e0c226287702d72de80a60515987e3532)

  
**Fake USDT Deploy:** [0x364ebefab8e7c8ddd425447349cc99dcd75ab1751612f7ef9c60c20fdb9a2bb6](https://etherscan.io/tx/0x364ebefab8e7c8ddd425447349cc99dcd75ab1751612f7ef9c60c20fdb9a2bb6)

  
**Fake WETH Deploy:** [0x871433af303743d61b3f2a38174e9e6655fdc8937c0689122685509dcabbf066](https://etherscan.io/tx/0x871433af303743d61b3f2a38174e9e6655fdc8937c0689122685509dcabbf066)

  
**Fake PAXG Deploy:** [0x67a181c333cb75231613c125215168a1eacbb4021d07cf0d91ca8bbaa65f8245](https://etherscan.io/tx/0x67a181c333cb75231613c125215168a1eacbb4021d07cf0d91ca8bbaa65f8245)

  
_[Gravity validators watching Ethereum observed the events and submitted MsgERC20DeployedClaim acknowledgement](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) transactions to Gravity chain._  
  
**[handleErc20Deployed then updated the denom-to-ERC20 registry using attacker-influenced,](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) registering each fabricated denom into the bridge's trusted lookup path.**  
  
The [registry now carried a poisoned mapping](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning).  
  

**MsgERC20DeployedClaim - USDC:** [786C41F0B9DA6EB8F59A1BC3299504AE47EFC4BBAB13673E391E307DB1BCEE49](https://www.mintscan.io/gravity-bridge/tx/786C41F0B9DA6EB8F59A1BC3299504AE47EFC4BBAB13673E391E307DB1BCEE49)

  
**MsgERC20DeployedClaim - USDT:** [9DF358F96E2BDE91FA96D1CC1CBEBE42E5CA2DD2F5745CD2ADA2591751101A9D](https://www.mintscan.io/gravity-bridge/tx/9DF358F96E2BDE91FA96D1CC1CBEBE42E5CA2DD2F5745CD2ADA2591751101A9D)

  
**MsgERC20DeployedClaim - WETH:** [388112D6C4BEDD74D34157AEC689195B942A8EDC4F476C4230C638CDF399E499](https://www.mintscan.io/gravity-bridge/tx/388112D6C4BEDD74D34157AEC689195B942A8EDC4F476C4230C638CDF399E499)

  
**MsgERC20DeployedClaim - PAXG:** [14BC7A377F959973613473A5EFB623D4011AED86BE00D68B782DB6D6720F9A37](https://www.mintscan.io/gravity-bridge/tx/14BC7A377F959973613473A5EFB623D4011AED86BE00D68B782DB6D6720F9A37)

  
Two code failures made this possible, and understanding how they interact reveals why the attack worked at all.  
  

**[The first failure is in deployERC20() on Gravity.sol](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning):** It is permissionless by design and accepts _cosmosDenom as a plain string with zero validation on its contents.
  
**Anyone can pass anything. [The attacker embedded the real USDC contract address as a path segment in the fabricated denom string](https://etherscan.io/tx/0x92b2a61d88b3f68d7d3b5cba4a12f53e0c226287702d72de80a60515987e3532), and [deployERC20() accepted it without restriction.](https://github.com/Gravity-Bridge/Gravity-Bridge/blob/main/solidity/contracts/Gravity.sol)**  
  
_The second failure is in [handleErc20Deployed on Gravity chain](https://raw.githubusercontent.com/Gravity-Bridge/Gravity-Bridge/main/module/x/gravity/keeper/attestation_handler.go), and this is where the exploit's real sophistication lies._  
  
[The function checks the denomination metadata](https://raw.githubusercontent.com/Gravity-Bridge/Gravity-Bridge/main/module/x/gravity/keeper/attestation_handler.go) and validates that the ERC20's name, symbol, and decimals match what's registered for that denom.  
  
That check was not a defense, because [the IBC metadata was predictable and attacker-influenced](https://github.com/cosmos/ibc-go/blob/main/modules/apps/transfer/keeper/keeper.go), so the attacker could satisfy it by design.

  

_When the attacker IBC-transferred their fake Osmosis tokens to Gravity chain, [ibc-go automatically called SetDenomMetadata on the destination chain](https://github.com/cosmos/ibc-go/blob/main/modules/apps/transfer/keeper/keeper.go), registering bank module metadata with deterministic, predictable values: Name = "<path> IBC token", Symbol = strings.ToUpper(base_denom), Decimals = 0._  
  
**[The attacker knew exactly what those values](https://etherscan.io/tx/0x92b2a61d88b3f68d7d3b5cba4a12f53e0c226287702d72de80a60515987e3532) would be before the transfer landed.**  
  
[They simply set the _name and _symbol parameters in their deployERC20() call to match](https://etherscan.io/tx/0x92b2a61d88b3f68d7d3b5cba4a12f53e0c226287702d72de80a60515987e3532), and the decimals defaulted to zero anyway.  
  
[The metadata checks were satisfied.](https://raw.githubusercontent.com/Gravity-Bridge/Gravity-Bridge/main/module/x/gravity/keeper/attestation_handler.go) The metadata check was not a defense. It was the thing the attacker was satisfying by design.

  
[The bridge incorrectly treated auto-generated IBC denom metadata as a trustworthy identity signal](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning), a trusted-metadata and registry-collision failure on the Cosmos side, with the Ethereum batch withdrawals as downstream evidence.  
  
_Because that metadata was attacker-influenced and fully predictable, the attacker could register a fabricated denom, satisfy all the metadata checks, and poison the registry with a convincing ERC20 mapping._  
  
**The missing safeguard was a collision check in handleErc20Deployed that would have blocked the conflicting registration. A relevant lookup existed elsewhere in the same file, [but it was not used in handleErc20Deployed](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning).**

  
[The Rust orchestrator is not the failure point;](https://raw.githubusercontent.com/Gravity-Bridge/Gravity-Bridge/main/orchestrator/gravity_utils/src/types/ethereum_events.rs) it appears to have relayed the wrapper address correctly from topics[1] of the Ethereum event log.  
  
[The exploit is in the Cosmos claim-handling path,](https://raw.githubusercontent.com/Gravity-Bridge/Gravity-Bridge/main/module/x/gravity/keeper/attestation_handler.go) where the bridge trusted predictable metadata and failed to block conflicting registrations.  
  
**[A relevant safeguard existed elsewhere in the codebase](https://github.com/Gravity-Bridge/Gravity-Bridge/blob/main/module/x/gravity/keeper/attestation_handler.go). It was just never placed in the right function.**  
  
_When the only thing between a fabricated denom and $5.4 million was a missing function call, was someone always going to find it?_

  
### Cash Out, Stay Put  
  

_With the registry poisoned, the attacker submitted MsgBatchSendToEthClaim withdrawal transactions._  
  
**[DenomToERC20Lookup hit the corrupted entries](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) and returned the real token addresses.** 
  
[Gravity produced outgoing batches 41572 through 41575,](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) validators signed them, and relayers submitted them to the custody contract on Ethereum.  
  
[The contract verified the signatures and called safeTransfer() for each asset](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) - releasing 4,349,701 USDC, 434,072 USDT, 274.34 WETH, and 14.16 PAXG to the attacker's wallet.  
  
**No alarm. No anomaly flag.**  
  
_The drain transactions are on-chain._

  

**USDC Drain ($4.3M):** [0xfce883a8f9a4f3479cce1368b99287973ab40451ac092f5a41e1e09eecab5044](https://etherscan.io/tx/0xfce883a8f9a4f3479cce1368b99287973ab40451ac092f5a41e1e09eecab5044)

  
**USDT Drain ($434K):** [0x469274f4edd45ec3284bf60de8eb30086222745f8f8c8b6a955137feed41281d](https://etherscan.io/tx/0x469274f4edd45ec3284bf60de8eb30086222745f8f8c8b6a955137feed41281d)

  
**WETH Drain (274 ETH - $495k):** [0x59e52302c53e862fcf833b61eb851ff66e098e3d29db19fd66e5a04734eeb84b](https://etherscan.io/tx/0x59e52302c53e862fcf833b61eb851ff66e098e3d29db19fd66e5a04734eeb84b)

  
**PAXG Drain ($64K):** [0xd3cdfa10be4f0cde6b3f294856a8bdd840983dcef29a5dc24c70c36e2d7f9ef0](https://etherscan.io/tx/0xd3cdfa10be4f0cde6b3f294856a8bdd840983dcef29a5dc24c70c36e2d7f9ef0)

  
Post-drain, [the attacker converted the stolen assets into ETH](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) and began moving them.  
  
**Funds flowed from the [primary holding wallet](https://etherscan.io/address/0x4d3ca32e687e871a58b78AcAc73bE59AC37C7A47) into a [dedicated laundering address](https://etherscan.io/address/0xc8c71ae4261e55a66d9967f2ac252be4e669f562), which has been systematically routing ETH into Tornado Cash, 10 and 100 ETH deposits, batch after batch, across multiple days.**  
  
_The trail is visible and the pattern is methodical. What went into Tornado Cash does not come back out traceable._  
  

**Primary Theft Wallet:**  
[0x7B582033061b96cC3F9421e73a749ED7C62da1F9](https://etherscan.io/address/0x7B582033061b96cC3F9421e73a749ED7C62da1F9)

  
**Secondary Theft Wallet (Primary Fund Holder):** [0x4d3ca32e687e871a58b78AcAc73bE59AC37C7A47](https://etherscan.io/address/0x4d3ca32e687e871a58b78AcAc73bE59AC37C7A47)

  
**Tornado Cash Routing Address:**  
[0xc8c71ae4261e55a66d9967f2ac252be4e669f562](https://etherscan.io/address/0xc8c71ae4261e55a66d9967f2ac252be4e669f562)

  
**[Other Attacker EOAs](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning):**  
[0x73e95ae5f3b87e02d4547afe86d0d466e9450d6b](https://etherscan.io/address/0x73e95ae5f3b87e02d4547afe86d0d466e9450d6b)
[0xDaf38ad7f8F7431978d6bFffa78A23e4c5f010c6](https://etherscan.io/address/0xDaf38ad7f8F7431978d6bFffa78A23e4c5f010c6)
[0x91B52e07132a49DAD1B7a3939a51547f79468Ec7](https://etherscan.io/address/0x91B52e07132a49DAD1B7a3939a51547f79468Ec7)

  
The drain was precise. The exit is methodical. Tornado Cash has no KYC and leaves no custodian to subpoena, each deposit disappears into the pool and the on-chain trail ends there.  
  
**The attacker has said nothing and responded to no one. The funds are moving, batch by batch, into the mixer.**  
  
_Is that patience, or just the only play left?_

  
### Gone Quiet  
  
_Gravity Bridge [announced a bridge halt on May 30th](https://x.com/gravity_bridge/status/2060737691348807698): "Thanks to the swift action of validators, the bridge is currently halted while investigations continue."_  
  
**No restart timeline. No compensation plan. No postmortem.**  
  
No public accounting of how a fabricated denom string passed through a permissionless function undetected, or how the registry mapping was corrupted without triggering any alert.  
  
[GRAV dropped roughly 4% on the news, then partially recovered to $0.0009851 by May 31st](https://blockchain.news/news/gravity-bridge-halts-54m-exploit), a 1.01% daily gain that markets read, charitably, as stabilization.  
  
The market cap at that point [sat at approximately $958,510](https://blockchain.news/news/gravity-bridge-halts-54m-exploit).  
  
_[TVL crashed 47%](https://ambcrypto.com/gravity-bridge-hack-drains-5-4m-as-tvl-crashes-47-details/) from 11.82 million to $6.2 million in a day._  
  
**This was not a protocol with deep reserves to absorb the blow.**  
  

Gravity Bridge did not offer a white-hat bounty. It did not send an on-chain message to the attacker. It did not publish a wallet-flagging campaign or coordinate publicly with exchanges.  
  
What it offered was silence, [and a halt notice](https://x.com/gravity_bridge/status/2060737691348807698) that reads, in the absence of any recovery roadmap, less like a pause and more like an ending.  
  

The bridge sits in a year that has been catastrophic for cross-chain infrastructure.  
  
_By mid-May, before Gravity Bridge was even hit, [PeckShield had already tracked eight major bridge exploits totaling $328.6 million in 2026](https://x.com/PeckShieldAlert/status/2056227303596957818)._  
  
**[KelpDAO lost roughly $290 million in April](https://rekt.news/kelpdao-rekt) to an attack attributed to the Lazarus Group.**  
  
What distinguishes Gravity Bridge in this company isn't the size of the loss, $5.4M is modest against 2026's headline numbers.  
  
It is the combination of a permissionless registration function with no input validation, combined with a claim handler that wrote whatever arrived to the registry without cross-checking existing ERC20 mappings, a [2022 Least Authority audit](https://leastauthority.com/static/publications/LeastAuthority_Althea_Gravity%20Bridge_Final_Audit_Report.pdf) that was completed before this cross-chain failure mode was understood as an attack vector and never documented as refreshed, and a response that offered nothing to the users whose funds were in the bridge when it failed.

  
**No bounty. No postmortem. No timeline.**  
  
_The bridge went dark and the team went quiet, so what exactly do the users who trusted the bridge with their funds do with that?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)


_Gravity Bridge didn't fail because someone found a bug. It failed because a permissionless Ethereum input path and a Cosmos-side claim handler were missing a critical cross-check between them._  
  
**[deployERC20()](https://github.com/Gravity-Bridge/Gravity-Bridge/blob/main/solidity/contracts/Gravity.sol) accepted arbitrary string input.** 
  
handleErc20Deployed validated metadata, but it did not cross-check the incoming registration against the existing custody asset registry. A relevant lookup already existed elsewhere in the codebase, but it was not used in this path.  
  
[A collision check in handleErc20Deployed](https://raw.githubusercontent.com/Gravity-Bridge/Gravity-Bridge/main/module/x/gravity/keeper/attestation_handler.go) that would have blocked the conflicting registration.  
  
[A relevant lookup existed in the same file,](https://www.quillaudits.com/blog/hack-analysis/gravity-bridge-demon-mapping-poisoning) called correctly in one function, never called in the other.  
  
_The attacker didn't need to break anything. They needed to find the place where the bridge stopped asking questions._  
  

**That place was documented.**  
  
**[Gravity Bridge's own GitHub states it plainly:](https://github.com/Gravity-Bridge/Gravity-Bridge/blob/main/solidity/contracts/contract-explanation.md)** In practice, the bridge accepts event-based claims once the validator set signs off, rather than independently verifying the Ethereum event itself.  
  
The validators attested to what they observed. The claim-processing path then wrote the resulting mapping into state. The signatures were valid. The batches were legitimate. The assets were real.  
  

_[A 2022 Least Authority audit reviewed the codebase](https://leastauthority.com/static/publications/LeastAuthority_Althea_Gravity%20Bridge_Final_Audit_Report.pdf), before this failure mode had been clearly demonstrated._  
  
**That context matters, because what followed the exploit matched the silence that preceded it.**  
  
After two posts [and a bridge halt](https://x.com/gravity_bridge/status/2060737691348807698), there was no postmortem, no compensation plan, and no public acknowledgment of the specific failure - a missing lookup, a permissionless entry point, and a registry that trusted whatever it was handed.  
  

Every input crossing a chain boundary is untrusted data. That principle isn't new. It isn't obscure. It is the first thing any cross-chain security review should establish.  
  
Gravity Bridge accepted a fabricated string from an anonymous caller, wrote it to a registry that controlled access to millions in real assets, and did not perform the cross-check that would have blocked the poisoned mapping.  
  

A relevant safeguard should have been in place, but it wasn’t where it needed to be. The issue was not the absence of a security model, but the absence of the right check in the right path.  
  
**The question the postmortem needs to answer isn't how the attacker found the gap, it's how three years of operation passed without anyone else finding it first.**  
  

_When the lookup that appears to have been relevant to stopping this was already written, already working, already called correctly in the function directly above, what exactly was the review process protecting?_


![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
