---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/multisig
  - sector/oracle
  - sector/stable
  - sector/token
  - impact/loss-of-funds/direct-drain
  - blast-radius/cross-protocol
title: "Zero To Lend"
protocol: "[[Zero To Lend]]"
date: 2025-02-23
loss_usd: 371000
auditors:
source: "https://rekt.news/zero-to-lend"
excerpt: "Over ten months ago, $371K in LBTC left ZeroLend's Base market and never came back. Neither did an explanation. The team blamed 'high utilization.' GitHub went quiet. Users still can't withdraw. But h"
genome:
  - "[[direct-drain]]"
  - "[[cross-protocol]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[integer-bounds]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reentrancy-guard]]"
---
# Zero To Lend

> **Loss:** $371,000 | **Date:** 2025-02-23 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/zero-to-lend-header.png)








_Ten months of silence can bury a lot of bad debt._

  

**[ZeroLend's](https://x.com/zerolendxyz)  [LBTC market on Base](https://app.zerolend.xyz/reserve-overview/?underlyingAsset=0xecac9c5f704e954931349da37f60e39f515c11c1&marketName=proto_base_v3) got [drained on February 23rd, 2025](https://basescan.org/tx/0xdf1c69feb8e63c70f874cdff22bba7c53eb42a5245e9695713e850966c54ce2a) - just eighteen days after Ionic Money fell to the same fake collateral playbook. The protocol never said a word.**  
  

While users hammered Discord about frozen withdrawals, moderators reportedly blamed "high utilization" and "maintenance" - [until torakapa blew the lid off in late 2025](https://x.com/torakapa/status/1996645966632702295).  
  
**The lid that was blown off:** The vault was empty, and someone forgot to mention the heist.  
  

**[A single wallet](https://basescan.org/address/0x218c572b1ab6065d74bebcb708a3f523d14f7719) borrowed 3.92 LBTC across three transactions in 45 minutes, bridged the profits through Across Protocol, and left behind nothing but worthless PT-LBTC collateral.**  
  
The debt token still sits on-chain like a receipt nobody wants to acknowledge.  
  

[GitHub commits flatlined in September](https://github.com/zerolend). Exchange [listings evaporated](https://www.okx.com/help/okx-to-delist-zero-prq-iq-arty-samo-and-usdt-usdc-spot-trading-pairs). The team may have ghosted [their Discord](https://discord.com/invite/zerolend) and [Twitter](https://x.com/zerolendxyz).  
  

**[$3 million in seed funding](https://x.com/zerolendxyz/status/1760181607137505736), a [Twitter bio stacked with security names](https://x.com/zerolendxyz), and a founder who lists "over $200M+ under management" on LinkedIn - yet somehow nobody noticed when the lights went out?**  
  

_When a protocol gets exploited and spends over ten months pretending it didn't happen, who's really running the con - the hacker who drained the vault, or the team that keeps the deposit button live?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [torakapa](https://x.com/torakapa/status/1996645966632702295), [ZeroLend](https://x.com/zerolendxyz/status/1760181607137505736), [QuillAudits](https://x.com/quillaudits_ai/status/1889324364417597474), [Halborn](https://www.halborn.com/blog/post/explained-the-ionic-money-hack-february-2025), [Ionic Money](https://x.com/ionicmoney/status/1888820557887459513), [Lombard](https://www.lombard.finance/blog/lombard-brings-LBTC-to-base/), [DefiLlama](https://defillama.com/protocol/zerolend), [CoinMarketCap](https://coinmarketcap.com/currencies/zerolend/), [OlimpiusInferno](https://x.com/PresidentIn2030/status/1994170283771506962), [Stack.money](https://stack.money/asset/zerolend), [OKX](https://www.okx.com/help/okx-to-delist-zero-prq-iq-arty-samo-and-usdt-usdc-spot-trading-pairs), [Steven Enamakel](https://www.linkedin.com/in/enamakel/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_verification_details%3Bp%2FKouEm5RmektGVBnnIIAQ%3D%3D) (Founder of ZeroLend)_  
  
**One tweet. That's all it took to crack carefully curated silence.**  
  

**[torakapa dropped the bomb in late 2025](https://x.com/torakapa/status/1996645966632702295):** "There is no any UI issue. Zerolend are lying, they have been exploited on Feb-23-2025. The hacker supply PT-LBTC and manipulated the price to borrow 4,4421 LBTC."  
  

The address attached to that tweet tells a story ZeroLend likely never wanted to tell.  
  
**The Attacker’s Address:**  
[0x218C572b1Ab6065D74bEbcB708a3f523D14F7719](https://basescan.org/address/0x218c572b1ab6065d74bebcb708a3f523d14f7719)

_[Basescan's token holdings for that wallet](https://basescan.org/address/0x218c572b1ab6065d74bebcb708a3f523d14f7719#asset-tokens) read like a confession._

  
**[ZeroLend zk Variable Debt LBTC](https://basescan.org/token/0x8307952247925a2ed9f5729eaf67172a77e08999?a=0x218c572b1ab6065d74bebcb708a3f523d14f7719):** 3.92307607 - ZeroLend's variable debt token, proof of an unpaid loan that's been accruing interest for almost a year.  
  

**[ZeroLend PT Lombard LBTC 29MAY2025](https://basescan.org/token/0x09ff10b3bd188eaf1b972379cc4940833361e5a8?a=0x218c572b1ab6065d74bebcb708a3f523d14f7719):** 10.9955337 - Pendle Principal Token, the "collateral" used to extract real LBTC from the protocol. The date in the token name marks its maturity - when PT holders can redeem for the underlying asset. Until then, it trades at a discount, making it a tempting but risky collateral choice.

  
_February 23rd, 2025, the attack unfolded with clockwork precision._

**Attacker’s Address (Base):**
[0x218C572b1Ab6065D74bEbcB708a3f523D14F7719](https://basescan.org/address/0x218c572b1ab6065d74bebcb708a3f523d14f7719)

**Attacker’s Address (Arbitrum):**
[0x218C572b1Ab6065D74bEbcB708a3f523D14F7719](https://arbiscan.io/address/0x218c572b1ab6065d74bebcb708a3f523d14f7719)

**Attacker’s Address (Ethereum):**  
[0x218C572b1Ab6065D74bEbcB708a3f523D14F7719](https://etherscan.io/address/0x218c572b1ab6065d74bebcb708a3f523d14f7719)

_The [Arbitrum](https://arbiscan.io/address/0x218c572b1ab6065d74bebcb708a3f523d14f7719) and [Base](https://basescan.org/address/0x218c572b1ab6065d74bebcb708a3f523d14f7719) wallets were funded via Across Protocol bridge, PT-LBTC deposited as collateral to ZeroLend's pool, and the extraction began._

**The attacker's wallet hit the protocol three times in 45 minutes. They "borrowed" ~3.923 LBTC (worth ~$371K now) and never paid it back.**

**Hit 1 - Borrowed 0.95324998 LBTC:** [0xdf1c69feb8e63c70f874cdff22bba7c53eb42a5245e9695713e850966c54ce2a](https://basescan.org/tx/0xdf1c69feb8e63c70f874cdff22bba7c53eb42a5245e9695713e850966c54ce2a)

**Hit 2 - Borrowed 1.47687998 LBTC:** [0x47fbcdc986c08bf779cb66267c3f6baa0dd43d6a8591f548dbcda5a1c9fce2d2](https://basescan.org/tx/0x47fbcdc986c08bf779cb66267c3f6baa0dd43d6a8591f548dbcda5a1c9fce2d2)

**Hit 3 - Borrowed 1.492946 LBTC:** [0xc02cea219b2748ccb8e28b2b23c14d7f6d3d144724ba1b9e17adbf07e70e51a3](https://basescan.org/tx/0xc02cea219b2748ccb8e28b2b23c14d7f6d3d144724ba1b9e17adbf07e70e51a3)

All roads led to Across Protocol - the bridge that moved funds both in and out.  
  
The attacker [arrived with 38 ETH](https://basescan.org/tx/0xf1f344d9b30166dee923a540f39f540f85851043b6ba1a69667f479fc1199a55) on Base to fund the operation, [swapped the borrowed LBTC through Aerodrome DEX](https://basescan.org/tx/0xccca86bffbe1be89b80d58175dba2a405a861390963e5850c2026464633ae372), and [left with 163.65 ETH](https://basescan.org/tx/0x8b5502a1b9324286f05a640450bbf86a8c1a3c0a0780cb8866df65a3c40eb6d8) - netting roughly $125k in profit after the round trip.

_The playbook was textbook DeFi extraction: deposit illiquid derivative as collateral, borrow liquid asset, bridge profits cross-chain, ghost the loan. Leave the protocol holding worthless paper while real money disappears._

**That wallet still holds trace amounts - [1.5 ETH on Arbitrum](https://arbiscan.io/address/0x218c572b1ab6065d74bebcb708a3f523d14f7719), [0.5 ETH on Base](https://basescan.org/address/0x218c572b1ab6065d74bebcb708a3f523d14f7719). Operational dust from someone who clearly wasn't worried about covering their tracks.**

The debt token hasn't moved. The collateral sits untouched. The loan will never be repaid.

And for ten months, ZeroLend pretended none of it happened.

**This playbook had already claimed a much bigger victim just eighteen days earlier - and that one made headlines.**

  
_If [Ionic Money's $8.8 million lesson](https://x.com/quillaudits_ai/status/1886856127499132961) was broadcast across every security feed in DeFi, how did ZeroLend miss the memo?_  
  
### Déjà Vu in Eighteen Days  
  
_February 4th, 2025, Ionic Money on Mode Network, $8.8 million gone, [according to QuillAudits research](https://x.com/quillaudits_ai/status/1889324364417597474)._

  
**The attack [made noise across the security feed](https://x.com/HalbornSecurity/status/1889706028838625617) in DeFi, with the mount that was stolen being varied. Every protocol running LBTC derivatives should have been on high alert.**  
  
**The vector was embarrassingly simple:** [Attackers posed as Lombard Finance team members](https://www.halborn.com/blog/post/explained-the-ionic-money-hack-february-2025), convinced Ionic to list a counterfeit LBTC token, minted themselves 250 fake tokens, and borrowed everything the protocol had.

Social engineering dressed up in smart contract clothing. The attackers didn't need to find a bug - they just needed someone to pick up the phone.

Eighteen days later, ZeroLend's Base market got hit with a variation on the same theme.  
  

_Ionic fell on February 4th on Mode Network._  
  
**ZeroLend fell on February 23rd on Base.**  
  
Ionic's attacker used a completely fake LBTC token as collateral.  
  
ZeroLend's attacker used PT-LBTC, a Pendle derivative - different wrapper, same manipulation vector.  
  
Ionic lost approximately $8.8 million.  
  
ZeroLend lost around $371k.  
  
_[Ionic at least published a post-mortem](https://x.com/ionicmoney/status/1888820557887459513)._  
  
**ZeroLend published nothing.**  
  

Same asset class. Same collateral manipulation vector. Same month.  
  

**ZeroLend wasn't some obscure fork nobody had heard of. Lombard Finance had [announced them as a launch partner when LBTC went live on Base in November 2024](https://www.lombard.finance/blog/lombard-brings-LBTC-to-base/):** "At launch, LBTC is live on Base's leading DeFi protocols, including Pendle, Aerodrome, ZeroLend and Morpho."

  
Front row seats to the LBTC ecosystem meant front row seats to watch Ionic burn.  
  
_The playbook was public. The warning signs were flashing neon._  
  

**Yet somehow, less than three weeks later, a nearly identical attack walked right through ZeroLend's front door.**  
  

Ionic at least [had the decency to announce their disaster](https://x.com/ionicmoney/status/1888820557887459513).  
  
They acknowledged the exploit, and let users know their funds were gone. Cold comfort, but honesty counts for something.  
  

**ZeroLend chose a different path: silence, excuses, and a deposit button that still works today.**

  
_When an $8.8 million exploit becomes required reading for every Aave fork in existence, what does it say about a protocol that gets hit by the same attack eighteen days later and decides the best response is to pretend it never happened?_  
  
### The Audit Salad

  
_[ZeroLend's Twitter bio](https://x.com/zerolendxyz) reads like a who's who of blockchain security: Chaos Labs, Zokyo, Halborn, PeckShield, Sherlock, Immunefi, and Cantina._

  
**Impressive lineup. None of them are to blame for what happened.**

  
[Mundus ran a deployment check back in 2023](https://github.com/zerolend/audits/blob/main/mundus/zerolend_report_depcheck_final.pdf) - verified the Aave fork had no backdoors.  
  
[PeckShield audited the core protocol in February 2024](https://github.com/zerolend/audits/blob/main/peckshield/PeckShield-Audit-Report-ZeroLend-v1.0rc.pdf), before LBTC markets existed.  
  
[Halborn's reports cover the ONEZ token contracts](https://github.com/zerolend/audits/tree/main/halborn), not lending markets.

  
**[Zokyo's November 2024 audit actually examined Pendle PT integration code](https://drive.google.com/file/d/1aTKZzHQZBbu3KdWlxEdZ1EAyfiB4T69P/view):** ATokenPendlePT.sol and related contracts. Zero critical issues. Zero high-severity findings.  
  
**Score:** 70 out of 100.  
  
_So what went wrong?_

  
**The exploit wasn't a code bug. No reentrancy, no overflow, no logic flaw waiting to be found.**  
  
**The attack walked through a risk management decision:** ZeroLend chose to list PT-LBTC as borrowable collateral with oracle parameters that could be gamed.

  
No audit covers "should we list this asset?" No security firm signs off on collateral factors and liquidation thresholds. That's governance. That's the team.

  
Eighteen days after Ionic Money proved LBTC derivatives were being hunted, ZeroLend had PT-LBTC live as collateral on Base. The auditors didn't make that call. Someone at ZeroLend did.  
  

**The "Audit Salad" isn't about auditors failing to catch bugs. It's about a protocol stacking logos to imply comprehensive coverage while making risk decisions no audit was ever designed to evaluate.**  
  

_When every audit passes but the protocol still bleeds out, where does the buck actually stop?_  
  
### The Zombie Market  
  

_Exploits end. Zombie markets just keep feeding._  
  

**Ten months after the February drain, ZeroLend's Base LBTC market still accepts deposits. The "Supply" button works fine. Try to withdraw and suddenly it's "high utilization" and "please try again later."**  
  

Later never comes.  
  
[One user documented the experience](https://x.com/PresidentIn2030/status/1994170283771506962) in November 2025: supplied LBTC, couldn't withdraw, got three different explanations from Discord - "pool is basically dry, wait for liquidity to flow back," "asset is paused for safety reasons," and "frontend/UI issue, dev team notified." They asked for one clear public status update. Still waiting.  
  

On-chain data reveals something uglier than a simple exploit aftermath.  
  
**January 13th, 2026:** A user deposits 0.000001 LBTC into the pool. Fourteen seconds later, that liquidity exits to a Gnosis Safe multisig wallet.  
  
**Gnosis Safe Address:**
[0x0f2876396a71fe09a175d97f83744377be9b6363](https://basescan.org/address/0x0f2876396a71fe09a175d97f83744377be9b6363)

_[Basescan shows that the wallet was created on April 27th, 2025](https://basescan.org/tx/0x74213d23eac03364ff05544b7935ad4650dd3bce5401a25cfffd4822839bbaa9) - two months after the February exploit._  
  
**Did someone see a broken pool and set up shop?**  
  

The wallet uses [Gelato](https://www.gelato.network/), an automated transaction relay service that lets smart contracts execute on triggers.  
  
[Basescan's token transfer history shows this single address](https://basescan.org/address/0x0f2876396a71fe09a175d97f83744377be9b6363#tokentxns) has executed dozens of withdrawal transactions against ZeroLend's LBTC pool over the past eight months, extracting over $100k in total. It still has funds supplied to the pool and continues siphoning whatever liquidity appears.  
  

This isn't trapped victims racing to escape. This is someone who built an automated extraction operation on top of a pool that ZeroLend left broken and open for business.  
  
_Every new depositor becomes exit liquidity for an address that arrived months after the heist._  
  
**The APY displays tell their own story. [ZeroLend's utilization mechanics](https://docs.zerolend.xyz/overview/lending-and-borrowing/parameters) follow [Aave V3’s math](https://docs.zerolend.xyz/security/audits) - when almost every deposited asset has been borrowed and never returned, interest rates spike to distress levels that most users never think to check.**

[DefiLlama currently shows ZeroLend's Base deployment](https://defillama.com/protocol/zerolend) at around $100k in TVL.

Meanwhile, the vital signs flatlined months ago.

[GitHub activity tracking shows zero updates](https://github.com/zerolend) since September 2025.  
  
_[Stack.money's developer metrics paint a protocol in maintenance mode at best](https://stack.money/asset/zerolend), abandoned at worst._

  

**[The ZERO token tells the financial story](https://coinmarketcap.com/currencies/zerolend/). Down 100% from its September 2024 all-time high.**  
  
ZERO was [delisted from OKX on June 4, 2025](https://www.okx.com/help/okx-to-delist-zero-prq-iq-arty-samo-and-usdt-usdc-spot-trading-pairs).

[CoinMarketCap data](https://coinmarketcap.com/currencies/zerolend/) shows 91% of tokens concentrated in the top ten wallets - the kind of distribution that makes exit liquidity out of everyone else.  
  

Twitter went quiet. Users report Discord mods offer no clarity from the dev team. [The founder's LinkedIn still claims "over $200M+" under management](https://www.linkedin.com/in/enamakel/) while [DefiLlama shows total TVL has collapsed to around $10 million across all chains](https://defillama.com/protocol/zerolend).  
  

A protocol doesn't die all at once.  
  
**It dies in stages:** First the exploit nobody mentions, then the excuses that buy time, then the developers who stop committing, then the exchanges that delist, then the silence that says everything the team refuses to.  
  

**ZeroLend hit every stage. The only thing still alive is the deposit button.**  
  

_When a protocol leaves a broken pool open long enough for someone to build an automated extraction business on top of it, who's really running the operation?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Could silence be a strategy?_

  
**[Ionic Money got hit for $8.8 million](https://www.halborn.com/blog/post/explained-the-ionic-money-hack-february-2025) and told the world within hours. Ugly, painful, but honest.**  
  
Users knew where they stood.  
  
ZeroLend got hit for $371k and chose a different playbook - over ten months of "high utilization" excuses while the deposit button kept collecting fresh victims.  
  

The exploit itself was almost boring. Fake collateral, borrowed assets, bridge out, ghost the loan. A playbook so predictable it had already made headlines eighteen days earlier on a different chain.  
  

_What wasn't boring was the aftermath._  
  
**No disclosure. No post-mortem. No governance proposal for reimbursement.**  
  
Just moderators running interference in Discord while an automated extraction operation systematically siphoned whatever liquidity appeared.  
  

[$3 million in seed funding](https://x.com/zerolendxyz/status/1760181607137505736) from firms like Momentum 6, Blockchain Founders Fund, and Morningstar Ventures.  
  
_A founder with a [University of Toronto degree](https://www.linkedin.com/in/enamakel/) and claims of managing [$200 million](https://www.linkedin.com/in/enamakel/)._  
  
**All the ingredients of a legitimate operation, none of the accountability when things went sideways.**

  
The [ZERO token crashed 100%](https://coinmarketcap.com/currencies/zerolend/). OKX [delisted ZeroLend’s token](https://www.okx.com/help/okx-to-delist-zero-prq-iq-arty-samo-and-usdt-usdc-spot-trading-pairs). Their [GitHub went cold](https://github.com/zerolend). The Discord turned into a shitshow. And somewhere, [that deposit button still glows green](https://app.zerolend.xyz/markets/).

  
**DeFi promised trustless finance - code as law, transparency as default, accountability baked into every block. ZeroLend delivered the opposite:** A silent insolvency wrapped in audit logos and "please try again later."

  
The hacker who drained the vault walked away with $371k.  
  
**The team that let it happen? Still collecting deposits (assuming there is a team).**  
  

_In a space that prides itself on radical transparency, what's the real cost 
when protocols learn they can fail silently and face zero consequences?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
