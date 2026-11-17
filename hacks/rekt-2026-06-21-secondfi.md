---
tags:
  - blockchain/bitcoin
  - web3-sector/bridge
  - web3-sector/staking
  - precondition/insider
  - type/hack
  - vector/access-control
  - vector/private-key
  - vector/social-engineering
title: "SecondFi - Rekt"
protocol: "SecondFi"
date: 2026-06-21
loss_usd: 2400000
audit: "N/A"
source: "https://rekt.news/secondfi-rekt"
excerpt: "A single missing secret in SecondFi's signing code made every on-chain transaction a private key disclosure. Attackers drained $2.4 million from 374 wallets on Cardano. One line of missing code, nothi"---
# SecondFi - Rekt

> **Loss:** $2,400,000 | **Date:** 2026-06-21 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/secondfi-rekt-header.png)





_Cardano's largest wallet didn't get hacked. It got read._  
  

**Between June 21 and 23, 2026, external attackers drained roughly [16 million ADA, around $2.4 million, from 374 SecondFi wallets](https://x.com/emurgo_io/status/2070040375331586338).**  
  
[Then SecondFi moved 129 million ADA to a third-party custodian](https://x.com/secondfiapp/status/2069719171391512793) as an emergency rescue.  
  
Over the course of the incident response, the platform became both the victim and the mechanism for a second loss of control.  
  

No contract was exploited, no bridge manipulated, no developer phished.

_[SecondFi Android 10.0.3 shipped an Ed25519 signer where the nonce](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx), the per-signature secret that makes private keys irreproducible, was derived entirely from public transaction data._  
  
**[One signature was enough to reconstruct a key](https://x.com/P3b7_/status/2070121675102863721). Every spend a user had ever made was a standing disclosure. The chain wasn't attacked. It was read.**  
  
[Taylor Monahan called it worse than 2011-era](https://x.com/tayvano_/status/2070111103150063641) Bitcoin wallets.

[EMURGO called it a highly sophisticated](https://x.com/emurgo_io/status/2070040375331586338), pre-meditated, multi-actor exploit enterprise.  
  
EMURGO, [which describes itself as a co-founding entity of Cardano](https://x.com/emurgo_io/status/2070040375331586338) and is the [developer of record on the App Store listing](https://apps.apple.com/gb/app/secondfi-neofinance-platform/id1447326389), [](https://x.com/emurgo_io/status/2070040375331586338) has [pledged to return assets of all affected wallet addresses](https://x.com/emurgo_io/status/2070040375331586338).

  
**What none of them can do is un-publish the signatures that have been sitting on-chain since before the first wallet was touched.**

_When a single missing line of code makes every transaction your users ever signed a public disclosure of their private key, who owns that window?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [SecondFi](https://x.com/secondfiapp/status/2069306133337227382), [Emurgo](https://x.com/emurgo_io/status/2070040375331586338), [hackmd](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx), [Charles Guillemet](https://x.com/P3b7_/status/2070121675102863721), [Tayvano](https://x.com/tayvano_/status/2070111103150063641), [Cos](https://x.com/evilcos/status/2069593768584708589), [小賤狗](https://x.com/pan83727/status/2069698650356506956), [Cardano Foundation](https://cardano-foundation.github.io/cardano-wallet/design/concepts/Ed25519_BIP.pdf), [Tibane Labs](https://www.tibane.net/research/secondfi-cardano)_

**[The attack window was June 21 to 23](https://x.com/secondfiapp/status/2070093205450998032), but the damage started earlier than that.**  
  

On June 12, a user at address [addr1qxvn](https://cexplorer.io/address/addr1qxvnsf03culvvtjjjlxy795ce2egmfxwhm3m6xsseh0ryd9htk2p24jczmadchrrse20hm4teqn7zf95538ls7fpmsvs8yzfma) signed a routine spend of around 1 million ADA. Normal wallet activity, nothing exotic.  
  
What they didn't know was that [SecondFi Android 10.0.3, released four days earlier on June 8](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx), had shipped with a broken Ed25519 signer, one that derived the per-signature nonce entirely from public transaction data.

[Per the HackMD analysis, any transaction signed through that signer was sufficient for an observer to reconstruct the private key](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx) from on-chain data alone.  
  
_[June 12 was not when the funds disappeared.](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx) It was when the key was exposed._  
  

**By June 21, automated attackers had started working through exposed addresses. [Two independent groups drained 374 wallets across three waves](https://x.com/secondfiapp/status/2070093205450998032).**

[Attacker A hit 171 addresses](https://x.com/secondfiapp/status/2070093205450998032) in two automated batches.

[Attacker B swept 203 more](https://x.com/secondfiapp/status/2070093205450998032) in a separate automated sweep.  
  
[SlowMist founder Cos, watching the drain unfold over 30 hours](https://x.com/evilcos/status/2069593768584708589), observed that the attacker appeared to have obtained a batch of private keys in advance and worked through them continuously over more than 30 hours, amounts decreasing from large to small.  
  
_[SecondFi's first public statement arrived June 22](https://x.com/secondfiapp/status/2069306133337227382), describing a security issue affecting a small number of wallets._

**[The platform went into maintenance mode.](https://x.com/secondfiapp/status/2069306133337227382)**

[By the following morning, on June 23](https://x.com/secondfiapp/status/2069380358291001425), the team confirmed the root cause was confined to its native Cardano web wallet generation software, and [put the preliminary damage estimate at around 16 million ADA](https://x.com/secondfiapp/status/2069380371134009494).  
  
A patch for unaffected wallets was [confirmed on June 24](https://x.com/secondfiapp/status/2069719171391512793).  
  

Then came the fourth event. Alongside the three external drains, [SecondFi confirmed it had moved approximately 129 million ADA to an independent third-party custodian](https://x.com/secondfiapp/status/2069719171391512793), describing it [as emergency rescue measures to protect funds](https://x.com/secondfiapp/status/2069719171391512793) before further attackers could reach them.

_[ An external accounting firm was engaged](https://x.com/secondfiapp/status/2069719171391512793) to verify the holdings._

**[The custodian's identity was not disclosed.](https://x.com/secondfiapp/status/2069719171391512793) A return framework had not yet been announced.**

  
One detail cut through the public framing cleanly.

[Charles Guillemet pulled signatures from mainnet](https://x.com/P3b7_/status/2070121675102863721), rebuilt private keys from a single on-chain signature, and confirmed the mechanism held.  
  
**[It held across the addresses tested](https://x.com/P3b7_/status/2070121675102863721). No device access, no second transaction, no special tooling. Just reading what was already on-chain.**  
  
That left one question SecondFi never cleanly answered.

[One user reported having originally generated their seed in Daedalus](https://x.com/pan83727/status/2069698650356506956), imported it into Yoroi, and lost funds after the app auto-updated to SecondFi, which raised the question of whether any wallet that signed through the broken signer was exposed, regardless of where the seed came from.

**[The HackMD analysis supports that reading](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx).**  
  
_When the vulnerability arrived in an app update, sat undetected for two weeks, and the response to cryptographic exposure was a social promise of custody, how much of what users were told to trust was actually trustworthy?_

  

### Public In, Public Out

  

_[Every signature scheme in the Ed25519](https://zisc.ethz.ch/wp-content/uploads/2020/11/ed25519-SP.pdf) family uses a per-signature secret number called the nonce._  
  
**[It has one rule](https://zisc.ethz.ch/wp-content/uploads/2020/11/ed25519-SP.pdf): it must be secret and unpredictable.**

[Cardano uses extended Ed25519](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx), which derives the nonce from the transaction body hash combined with a [secret 32-byte suffix called kR](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx), unique per wallet and never published.  
  
Determinism guards against bad random number generators. [The secret kR is what keeps the nonce unguessable to anyone reading the chain](https://cardano-foundation.github.io/cardano-wallet/design/concepts/Ed25519_BIP.pdf). Both properties are mandatory. Drop either one and the scheme breaks.  
  

[SecondFi Android 10.0.3 dropped kR](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx).  
  

_[The decompiled Hermes bundle from the shipped APK shows the signing function computing the nonce as SHA-512(M)](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx), where M is the transaction body hash, which is public on-chain._  
  
**The secret argument, which carries the full 64-byte extended key including kR, [is only used later at the challenge computation step, which is too late to affect the nonce](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx).**  
  
[kR is absent from the part of the code where it would need to influence nonce generation](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx), and the consequences follow directly.  
  
[A signature is a pair (R, s), where s = r + k · kL mod L](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx), and k is derived from public values already in the signature.  
  
With a correctly derived nonce, the equation has two unknowns and cannot be solved from a single observation.  
  
_But if the nonce is a public function of the transaction body hash, [then r is computable by anyone, kL falls out immediately, and the key is lost](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx)._  
  
**Classic nonce reuse usually takes two signatures.**  
  
[This flaw needed only one.](https://x.com/P3b7_/status/2070121675102863721) Every transaction ever signed through the broken signer is therefore a permanent on-chain disclosure.  
  
[The shipped app does not use the public Yoroi and Cardano Serialization Library stack](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx), which correctly hashes kR together with the message. It uses a private implementation instead. Hardware wallet signing uses a separate code path and was not implicated.  
  

[A separate forensic analysis from Tibane Labs](https://www.tibane.net/research/secondfi-cardano), a competing wallet developer, offered a more granular account.  
  
_[Tibane argues the broken signer was EMURGO’s in-house SDK](https://www.tibane.net/research/secondfi-cardano), published as @stashers.io/trantor, and that [the bug was introduced in the adapter layer that fed the signer key material](https://www.tibane.net/research/secondfi-cardano), not in the underlying cryptographic library._  
  
**That account differs from earlier descriptions that locate the problem more generally in the bundled signer.**  
  
EMURGO has not publicly responded to [Tibane Lab’s analysis](https://www.tibane.net/research/secondfi-cardano).  
  
[Tibane's findings](https://www.tibane.net/research/secondfi-cardano) should be treated as a competing forensic interpretation rather than settled consensus.  
  

[One additional correction came from Taylor Monahan](https://x.com/tayvano_/status/2070818053886263397), who pushed back on the framing that only the first or default address at index 0 was at risk.  
  
**Any key that signed a transaction using SecondFi in June 2026 is exposed, regardless of whether it was generated in SecondFi or not.**  
  

_When the only code that could have caught this was proprietary, and the only people who could review it were the same people who shipped it, what exactly was the audit process protecting?_

  
### First Come, First Drained

  

_Two attacker groups, operating independently, [worked through the exposed address pool across three waves between June 21 and 23](https://x.com/secondfiapp/status/2070093205450998032)._

**[Attacker A drained 171 wallets across two automated batches](https://x.com/secondfiapp/status/2070093205450998032), routing funds through three collection wallets and a central fee address.**

[](https://x.com/secondfiapp/status/2070093205450998032)Attacker B [swept 203 wallets in a separate coordinated run](https://x.com/secondfiapp/status/2070093205450998032).  
  
**[Total taken by external attackers](https://x.com/emurgo_io/status/2070040375331586338):** Approximately 16 million ADA across 374 addresses, roughly $2.4 million at [ADA's price near five-year lows of around $0.146](http://coingecko.com/en/coins/cardano).

  
**Attacker A Collection Wallets:** 
[addr1q9j7f598x988unr4zhjulft205jqnn9ewgwkhes5smf2sr6jsw98nm4qq38jw9epe587twavuhuhj5d8r92rjvmyjlzs9lqc3x](https://cexplorer.io/address/addr1q9j7f598x988unr4zhjulft205jqnn9ewgwkhes5smf2sr6jsw98nm4qq38jw9epe587twavuhuhj5d8r92rjvmyjlzs9lqc3x)  
  
[addr1q9wudkfeelzwev427yvapkmqexmet8q4vl303m7a4eerwtvt6rq00zyuqzeuw759vgqtdky0gyxnqx27n8q4k6h79yhsqelma8](https://cexplorer.io/address/addr1q9wudkfeelzwev427yvapkmqexmet8q4vl303m7a4eerwtvt6rq00zyuqzeuw759vgqtdky0gyxnqx27n8q4k6h79yhsqelma8)

[Addr1q82jlp2u0ezv2hsf6f40fkrv49hd72yv442nmrr5qeultpqamepaykp3m564hnd4zp75wxxds2j6d3ywvc8prhf2kcxqn6nql3](https://cexplorer.io/address/addr1q82jlp2u0ezv2hsf6f40fkrv49hd72yv442nmrr5qeultpqamepaykp3m564hnd4zp75wxxds2j6d3ywvc8prhf2kcxqn6nql3)

**Central Fee/Change Address:**
[addr1q8acx4h5a38x6ekpsp0x7aelw6mflt78khmz8lz75rtnqvn07w88zx2e89tgzqr3x0mecngqlg87kq9surhk48hj79mqcezfa8](https://cexplorer.io/address/addr1q8acx4h5a38x6ekpsp0x7aelw6mflt78khmz8lz75rtnqvn07w88zx2e89tgzqr3x0mecngqlg87kq9surhk48hj79mqcezfa8)

  
**Attacker A Stake Key:**
[](https://x.com/secondfiapp/status/2070093205450998032)[Stake1u9hl8rn3r9vnj45pqpcn8auuf5q05rltqzcwpmm2nme0zasf40ymg](https://cexplorer.io/stake/stake1u9hl8rn3r9vnj45pqpcn8auuf5q05rltqzcwpmm2nme0zasf40ymg)

  
**Attacker B Collection Wallet ( ~4,020,468 ADA remains, flagged and under active monitoring):** [](https://x.com/secondfiapp/status/2070093205450998032) [addr1q8m5wdncq7rwum73r5cyyr82qx2xjem5k4ehapl3wy36aaerj829vasl3amtcwshgvnn6a25dr850tfw6qaj420d2szsslkku6](https://cexplorer.io/address/addr1q8m5wdncq7rwum73r5cyyr82qx2xjem5k4ehapl3wy36aaerj829vasl3amtcwshgvnn6a25dr850tfw6qaj420d2szsslkku6)

  
**Attacker B Stake Key:**
[](https://x.com/secondfiapp/status/2070093205450998032)[stake1uy3er4zkwc0c7a4u8gt5xfeaw42x3n6845hdqwe248k4gpgdq4da5](https://cexplorer.io/stake/stake1uy3er4zkwc0c7a4u8gt5xfeaw42x3n6845hdqwe248k4gpgdq4da5)

  
_The two figures in public circulation, [SecondFi's 16 million ADA](https://x.com/secondfiapp/status/2069719171391512793) and [SlowMist Cos’ estimate of over $20 million](https://x.com/evilcos/status/2069586691535655276), measure different things._  
  
**SecondFi counted [only confirmed external attacker drains](https://x.com/secondfiapp/status/2069719171391512793).**  
  
[SlowMist's Cos tracked broader attacker address flows](https://x.com/evilcos/status/2069586691535655276) and estimated that the wallet users had likely lost over $20 million, including more than 129 million ADA and other tokens stolen.  
  
Separately, [SecondFi moved approximately 129 million ADA to an independent third-party custodian](https://x.com/secondfiapp/status/2069719171391512793), describing it as an emergency rescue measure to protect funds before additional attackers could reach them.  
  

[SecondFi described that sweep as emergency containment](https://x.com/secondfiapp/status/2069719171391512793), triggered to protect funds before additional attackers could reach them.  
  
_**[The logic held as far as it went](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx):** Keys were publicly recoverable from on-chain data, so more actors with access to the same data could have drained more wallets._  
  
**[Moving funds to custodial storage](https://x.com/secondfiapp/status/2069719171391512793) interrupted that window.**  
  

What it could not do was resolve the underlying problem. [Once a key is recoverable from on-chain data](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx), the original owner and [any attacker who observed the signature can derive the same signing authority for that address](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx).  
  
[SecondFi's sweep moved the ADA](https://x.com/secondfiapp/status/2069719171391512793). It did not restore exclusive control over the compromised keys.  
  
**The secondary risk remained live. Attackers were reported to be monitoring the mempool, [so any transaction from a compromised address](https://x.com/secondfiapp/status/2070034865832202281), including staking reward withdrawals, [could be front-run on confirmation](https://x.com/secondfiapp/status/2070034865832202281).**  
  
_**[SecondFi's warning was precise](https://x.com/secondfiapp/status/2070034865832202281):** Restoring the same seed phrase into another wallet recreates the same exposed addresses. The vulnerability was in the signing, not the interface._

  

Attacker B's collection wallet, [still holding over four million ADA, was flagged and placed under active monitoring](https://x.com/secondfiapp/status/2070093205450998032).  
  
**[As of the June 26 recovery update](https://x.com/secondfiapp/status/2070474140906303982), those funds had not moved.**  
  

_When a key compromise means the original holder and any attacker who read the chain hold the same signing authority over an address, what does recovery actually mean?_  
  
### Custody Theater

  
_SecondFi moved into containment, but containment is not the same as control._  
  
**[Users were told not to restore seed phrases into another wallet, not to withdraw staking rewards, and not to move funds independently](https://x.com/secondfiapp/status/2070034865832202281), because any action from a compromised address could expose the same keys again.**  
  
The warning was correct. It was also the only thing left to say after the platform had lost the ability to protect its users cryptographically.  
  

[The 129 million ADA sweep may have stopped additional drains](https://x.com/secondfiapp/status/2069719171391512793). What it could not do was restore control.  
  
Once signatures on-chain can be used to reconstruct private keys, custody is not a fix so much as a holding pattern. The platform could move the assets. It could not un-publish the signatures that made them vulnerable in the first place.  
  

_That is the sharpest edge of this incident. The chain did exactly what it was told to do._  
  
**What it was told to do was unsafe. [A broken signer turned ordinary wallet activity into key disclosure](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx), and once that happened, the question of who held the ADA became a matter of social trust rather than cryptographic fact.**

[EMURGO has pledged to return funds](https://x.com/emurgo_io/status/2070040375331586338). A restoration fund has been established.

[An external accounting firm is verifying](https://x.com/secondfiapp/status/2069719171391512793) the custodian holdings.  
  
_All of that is paperwork built on top of a problem the paperwork cannot solve._  
  

**By June 29, the shape of that paperwork had become clearer. [SecondFi confirmed that EMURGO had funded a dedicated Asset Recovery Wallet to return funds to wallets drained by external attackers](https://x.com/secondfiapp/status/2071558652641870076).**  
  
For the 129 million ADA swept in the emergency containment, [SecondFi said it was in active discussion with IntersectMBO on the appropriate custody mechanism to hold those funds securely before returning them to users](https://x.com/secondfiapp/status/2071558652641870076).  
  
The custodian's identity had still not been disclosed.  
  

**A week into the incident, that question remained open.**  
  

_If the fix for a cryptographic failure is a pledge and an accounting firm, who is actually being protected?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)



_[Two months before SecondFi's drain window](https://rekt.news/volo-rekt), Volo faced a structurally similar situation on Sui._  
  
**A private key was compromised, no code was broken, [and $3.5 million left three vaults before any security researcher had flagged anything](https://rekt.news/volo-rekt).**

[Volo disclosed it themselves](https://rekt.news/volo-rekt), within hours, coordinated with ecosystem partners, intercepted the WBTC bridge attempt, [and recovered $3.44 million within days](https://rekt.news/volo-rekt).

[The net loss absorbed from treasury was $60,000.](https://rekt.news/volo-rekt) Zero passed to users.  
  
In both cases, the security failure came down to key compromise rather than a broken contract.  
  
_**The response diverged sharply:** Volo acted fast and recovered most of the funds, while SecondFi was still working through remediation._

**[SecondFi's recovery timeline, announced June 26](https://x.com/secondfiapp/status/2070474140906303982), estimated funds could begin being returned roughly two weeks out.**  
  
By June 29, that estimate had already shifted. [SecondFi confirmed the on-chain recovery solution was more complex than originally anticipated](https://x.com/secondfiapp/status/2071558652641870076) and may require additional time beyond the two-week window.  
  
[A mechanism for users to check whether their wallet was affected was promised](https://x.com/secondfiapp/status/2071019221786784168) by early the following week.  
  
The custodian [has not been publicly named](https://x.com/secondfiapp/status/2071558652641870076).

**[](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx)No public commit history [has been released that would clarify how the broken nonce came to be](https://hackmd.io/@QmCYMVNVQuqRJhiqMlXVdA/ry2LIyiMGx).**

_If a single missing secret input can turn every signature into a public key disclosure, what exactly are users supposed to trust the next time a wallet says self-custody?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
