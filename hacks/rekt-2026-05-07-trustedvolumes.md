---
tags:
  - type/hack
  - blockchain/ethereum
  - web3-sector/dex
  - web3-sector/oracle
  - web3-sector/stable
  - web3-sector/token
  - vector/access-control
  - vector/price-manipulation
title: "TrustedVolumes - Rekt"
protocol: "TrustedVolumes"
date: 2026-05-07
loss_usd: 5870000
audit: "N/A"
source: "https://rekt.news/trustedvolumes-rekt"
excerpt: "$5.87 million gone in one transaction. A permissionless signer function, a broken authorization check, and unlimited approvals did the rest. TrustedVolumes' contract was never open-sourced. The team h"
---
# TrustedVolumes - Rekt

> **Loss:** $5,870,000 | **Date:** 2026-05-07 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/trustedvolumes-rekt-header.png)





_[$5.87 million](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack), one transaction, four assets drained before most of the security firms had finished typing their alerts._

  

**TrustedVolumes, a liquidity provider and resolver operating inside 1inch's Fusion ecosystem, was hit on Ethereum on May 7, 2026, through an [authorization boundary failure](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b) in a [custom RFQ swap proxy](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b) the team built and controlled.**

  

No zero-day. No stolen keys. Just a public function, open to anyone, that let the attacker register themselves as a valid order signer - and a fill path that never bothered to check whether the signer actually owned what was being transferred.

  

[CertiK flagged](https://x.com/CertiKAlert/status/2052198011946795264) it first.  
  
[Blockaid followed](https://x.com/blockaid_/status/2052198320420819089) a minute later.  
  
**[TrustedVolumes took almost two and a half hours to confirm](https://x.com/trustedvolumes/status/2052235435292910005) what everyone watching on-chain already knew.**

  
_When the entry point is a function anyone could call, is it even fair to call it an attack?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [QuillAudits](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack), [TrustedVolumes](https://x.com/trustedvolumes/status/2052235435292910005), [banteg](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b), [CertiK](https://x.com/CertiKAlert/status/2052198011946795264), [Blockaid](https://x.com/blockaid_/status/2052198320420819089), [SlowMist](https://x.com/slowmist_team/status/2052227002980253715), [The Defiant](https://thedefiant.io/news/defi/defi-sets-new-hack-record-as-april-logs-28-exploits-with-usd635m-stolen), [CoinPaprika](https://coinpaprika.com/news/crypto-hacks-630m-april-worst-month/)_  


**[CertiK was first](https://x.com/CertiKAlert/status/2052198011946795264) - one post, the damage already done: "The attacker registers as an AllowedOrderSigner through a public function, then executes the order to transfer from the victim. Please revoke any approval to the vulnerable contract."**

  

**[Blockaid followed sixty seconds later with more](https://x.com/blockaid_/status/2052198320420819089):** Victim contract, exploiter address, attack transaction, and a running damage tally of $5.87M across four assets.

  

**[SlowMist posted the root cause breakdown shortly after](https://x.com/slowmist_team/status/2052227002980253715):** "Signature validation checks _allowedSigners[msg.sender][signer] using caller (taker) instead of order's maker as key, allowing registration via registerAllowedOrderSigner for attack contract and execution of forged orders for any maker." Four drains. Unlimited approvals. No victim signature required at any point.

  

[TrustedVolumes confirmed the exploit more than a couple of hours later](https://x.com/trustedvolumes/status/2052235435292910005), long after the attacker had already converted the stolen assets into ETH.  
  
[TrustedVolumes' response arrived measured, almost corporate in its restraint](https://x.com/trustedvolumes/status/2052235435292910005) - a bug bounty email address, wallet links, and an offer of "constructive communication." Nothing about how it happened. Nothing about what comes next.  
  
**Security firms had the mechanics mapped before the team had typed a word.**

  
_So if the people watching from the outside understood exactly what broke, what was the team looking at from the inside?_  
  

### Sign Here, Anyone  
  
_Three bugs. [Chained together in a custom RFQ implementation that TrustedVolumes built](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack), deployed, and handed unlimited access to their own treasury._  
  
**None of them required sophisticated cryptography to find. One of them required little more than reading the function name.**

**The core failure, [what banteg's Foundry reproduction calls an authorization boundary failure](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b), is this:** The contract verified who signed an order, but never once asked whether the signer had any right to spend the funds being moved. Authentication and authorization are treated as the same question, when they are two entirely different ones.

[registerAllowedOrderSigner() was permissionless](https://x.com/QuillAudits_AI/status/2052299893989941343). Any address could call it and register any EOA as an authorized signer for themselves as a maker. No owner check. No access control. The attacker called it, [registered their own EOA](https://x.com/QuillAudits_AI/status/2052299893989941343), and became a "valid" participant in the system in a single transaction.

From there, the second bug compounded the first. During [fillOrder()](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack), the contract verified [allowedOrderSigner[order.receiver][signer]](https://x.com/slowmist_team/status/2052227002980253715) - confirming the signer was allowed for the attacker-controlled receiver, [not for the inventory](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack), not for the address actually holding the funds.

_[The check confirmed the attacker could sign for their own receiver](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b). It proved nothing about who controlled the inventory._

**The third bug closed the trap. [The contract used the taker field as the from address in the token transfer](https://x.com/QuillAudits_AI/status/2052299893989941343). The attacker set taker = victim.**  
  
TrustedVolumes' inventory had [granted the RFQ proxy unlimited ERC-20 approvals](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack). No signature from the victim required. The proxy pulled directly from TrustedVolumes' own vault on the attacker's instruction.

[Replay protection existed on paper](https://x.com/QuillAudits_AI/status/2053839713463923073). In practice, [saltStatus wrote to one storage key and read from a different one](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack), meaning every one of the four drain calls passed the replay check without friction. The same structural flaw, four times, back to back, in a single transaction.

**[Setup cost](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack):** One deployed contract, 4 wei USDC seeded as nominal payment - one per order.

[The RFQ structure required the taker to send something to the inventory per fill.](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack) So the exploit contract sent 1 wei USDC to TrustedVolumes per drain, a cent-level gesture the contract accepted as a completed trade, while shipping millions in the other direction.

[Banteg's full Foundry reproduction](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b) - reconstructed Solidity, D2 flow diagram, on-chain evidence - confirmed every step against a fork of block 25039669. The exploit didn't need the live attacker's signed blobs. Any address with four USDC and fifteen minutes could have run it.

**A public registration function, a signer check against the wrong address, and a replay guard that never fired, if any one of those three had been built correctly, none of this happens.**  
  
_**So which one was the real mistake:** The bugs, or the missing review that should have caught all of them?_  
  
### Four Calls, One Transaction, and Gone

  
_Everything happened [in a single exploit transaction](https://x.com/QuillAudits_AI/status/2053839709248557478)._  
  
**[Four calls to the fill function](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack), four assets stripped from TrustedVolumes' inventory, all of it executed within a single Ethereum block.**

[1,291 WETH, 206,282 USDT, 16.939 WBTC, and 1,268,771 USDC](https://x.com/blockaid_/status/2052198320420819089). Roughly $5.87 million, all out the door in one shot.

[Each drain followed the same script](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack). The attacker's contract called the fill function, the proxy pulled the asset from TrustedVolumes' inventory using its [pre-existing unlimited approval](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b), and sent 1 wei USDC to the inventory as the taker's nominal buy payment.  
  
_Four trades, [fully executed by the protocol's own logic, each one a forgery the contract had no mechanism to detect](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack)._

**Exploit Transaction (Single tx - all four drains executed here):** [0xc5c61b3ac39d854773b9dc34bd0cdbc8b5bbf75f18551802a0b5881fcb990513](https://etherscan.io/tx/0xc5c61b3ac39d854773b9dc34bd0cdbc8b5bbf75f18551802a0b5881fcb990513)  
  
**Attacker EOAs:**  
[0xC3EBDdEa4f69df717a8f5c89e7cF20C1c0389100](https://etherscan.io/address/0xC3EBDdEa4f69df717a8f5c89e7cF20C1c0389100)  
[0x61e6301614178A2cA21Bfa0FBB30ABa06ACC2D1c](https://etherscan.io/address/0x61e6301614178a2ca21bfa0fbb30aba06acc2d1c)


**Exploit Contract ([One-shot contract acting as maker/receiver - received the drained funds](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b)):**  
[0xD4D5DB5EC65272B26F756712247281515F211E95](https://etherscan.io/address/0xD4D5DB5EC65272B26F756712247281515F211E95)  
  
**Vulnerable RFQ Proxy ([TrustedVolumes' custom swap proxy - entry point for the attack](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack)):**  
[0xeEeEEe53033F7227d488ae83a27Bc9A9D5051756](https://etherscan.io/address/0xeEeEEe53033F7227d488ae83a27Bc9A9D5051756)  
  
**RFQ Implementation ([Logic contract behind the proxy, where the buggy code lived](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b)):**
[0x88eb28009351Fb414A5746F5d8CA91cdc02760d8](https://etherscan.io/address/0x88eb28009351Fb414A5746F5d8CA91cdc02760d8) 
  
**TrustedVolumes Inventory Owner ([Held the assets, had unlimited approvals to the RFQ proxy](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack)):**  
[0x9bA0CF1588E1DFA905eC948F7FE5104dD40EDa31](https://etherscan.io/address/0x9bA0CF1588E1DFA905eC948F7FE5104dD40EDa31)  
  
_Once the assets landed in the exploit contract, [WETH was unwrapped and the proceeds forwarded to the](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack) [attacker EOA](https://etherscan.io/address/0xC3EBDdEa4f69df717a8f5c89e7cF20C1c0389100).[](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b)_

**The remaining tokens - [USDT, WBTC, USDC - followed the same path out.](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b)**

From there the attacker moved quickly to convert and consolidate the stolen assets, the resulting positions sitting visible on-chain while [TrustedVolumes was still drafting its confirmation post.](https://x.com/trustedvolumes/status/2052235435292910005)

The [stolen funds sat across two attacker-controlled wallets](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack) - [TrustedVolumes' own post-exploit accounting put the figure at approximately $6.7M](https://x.com/trustedvolumes/status/2052235435292910005), though the [on-chain drain prices totals $5.87M across the four assets](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack).

**Stolen Funds Address 1:**  
[0x61e6301614178a2ca21bfa0fbb30aba06acc2d1c](https://etherscan.io/address/0x61e6301614178a2ca21bfa0fbb30aba06acc2d1c)

**Stolen Funds Address 2:**  
[0xc3ebddea4f69df717a8f5c89e7cf20c1c0389100](https://etherscan.io/address/0xc3ebddea4f69df717a8f5c89e7cf20c1c0389100)

**The funds moved faster than the response, the conversion happened before the confirmation, and the trail was already cold by the time anyone official said a word.**  
  
_So what does it mean that the attacker knew this infrastructure better than the team defending it?_  
  
### Open For Business, Apparently

_[TrustedVolumes broke an extended Twitter silence to confirm they had been drained](https://x.com/trustedvolumes/status/2052235435292910005). their first public post in well over a year._  
  
**No prior warnings, no security updates, no community posts. Their first words back were an exploit confession and a bug bounty email address.**

**[TrustedVolumes stated they were open to "constructive communication regarding a bug bounty and a mutually acceptable resolution"](https://x.com/trustedvolumes/status/2052235435292910005) and provided two contact points:** tvbugbounty@proton.me and [t.me/trustedvolumes](https://t.me/trustedvolumes).

[Their website lists CeFi, DeFi, API, and About Us sections](https://trustedvolumes.com/). The [API documentation points nowhere useful](https://trustedvolumes.com/documentation) - a base URL and a production endpoint, nothing to click on, no architecture overview, no security disclosures of any kind.  
  
For a protocol operating as a market maker and resolver sitting on top of millions in assets, the public-facing infrastructure amounted to a name, a Proton Mail address, and a docs page with nothing behind it.

_No audit of the vulnerable RFQ proxy has ever been publicly disclosed._  
  
**The implementation contract was unverified on Etherscan - source code never submitted.**

[The contract was never open-sourced.](https://x.com/QuillAudits_AI/status/2053839713463923073) Both bugs were visible only from bytecode.  
  
For a contract that held the keys to unlimited approvals over millions in assets, that absence is its own kind of answer.

[The bug bounty line is open](https://x.com/trustedvolumes/status/2052235435292910005). Whether the attacker picks up is a separate question. The invitation is going one way. The funds are going the other.  
  
[April had already set a grim record - $635M gone across 28 separate incidents](https://thedefiant.io/news/defi/defi-sets-new-hack-record-as-april-logs-28-exploits-with-usd635m-stolen), the worst month for crypto theft [since the Bybit breach in February 2025](https://coinpaprika.com/news/crypto-hacks-630m-april-worst-month/).  
  
**TrustedVolumes adds to a running total that the industry keeps promising to take seriously.**

_A docs page with nothing behind it, an unverified contract, well over a year of silence, and a bug bounty email - if this is what operating a multi-million dollar market maker looks like from the outside, what was it ever supposed to look like from the inside?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_The pattern is simple. Someone built a contract that moved millions, and they may have skipped the security review._  
  
**A team that went well over a year without a public word, [right up until the moment there was nothing left to say except that they'd been drained](https://x.com/trustedvolumes/status/2052235435292910005).**

An attacker needed a public function, a misaligned authorization check, and a vault with no gate on it. That's what was sitting there. That's what got taken.

[Banteg rebuilt the entire exploit in Foundry in a matter of hours](https://gist.github.com/banteg/3475d43a80fb6e0ab81f2fa549b88c1b).  
  
Any address, 4 wei USDC, fifteen minutes - that's the barrier that stood between TrustedVolumes' inventory and anyone paying attention.

[The bug bounty line is open](https://x.com/trustedvolumes/status/2052235435292910005). Maybe the funds will come back. But a negotiated return doesn't fix an unverified contract, doesn't publish a docs page, and doesn't explain well over a year of silence while sitting on millions in assets with unlimited approvals pointed at custom code nobody may have ever reviewed.

**The vectors shift - private keys, oracle manipulation, authorization failures, but the underlying pattern holds - someone built something that moved millions and skipped the part where they asked whether it was safe.**

_If it takes [a $5.87 million exploit](https://www.quillaudits.com/blog/hack-analysis/trustedvolumes-rfq-hack) to prompt a security review, what exactly was the plan before the attacker showed up?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
