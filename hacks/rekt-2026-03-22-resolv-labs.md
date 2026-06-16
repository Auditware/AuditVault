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
  - sector/privacy
  - sector/stable
  - sector/staking
  - sector/token
  - sector/vault
title: "Resolv Labs - Rekt"
protocol: "[[Resolv Labs]]"
date: 2026-03-22
loss_usd: 25000000
auditors:
source: "https://rekt.news/resolv-labs-rekt"
excerpt: "On March 22, Resolv Labs lost $25 million when a compromised private key handed an attacker unlimited USR minting power. No oracle check. No mint cap. 80 million tokens printed. Hardcoded oracles and "
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[flashloan-callback-auth]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[oracle-manipulation-resistance]]"
  - "[[reward-accounting]]"
  - "[[upgrade-safety]]"
---
# Resolv Labs - Rekt

> **Loss:** $25,000,000 | **Date:** 2026-03-22 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/resolv-labs-rekt-header.png)











_Three hundred thousand dollars walked into a protocol holding $141 million. Eighty million unbacked stablecoins walked out._  
  
**[The official post-mortem would later reveal a supply chain attack](https://x.com/ResolvLabs/status/2040480752643580252); the breach began not inside Resolv, but at a third-party project where a contractor had previously worked.** 
  
A [compromised GitHub credential opened a door](https://x.com/ResolvLabs/status/2040480752643580252), a malicious CI/CD workflow silently exfiltrated signing credentials, and days of quiet reconnaissance inside Resolv's cloud infrastructure ended with a single key in the wrong hands.  
  
That key, [stored inside Resolv's cloud infrastructure](https://x.com/ResolvLabs/status/2040480752643580252), handed an attacker unlimited minting authority over Resolv Labs' USR stablecoin - no multisig required, no oracle check, no on-chain ceiling on what could be printed.  
  
The contract didn't malfunction. It performed exactly as designed, which is precisely the problem.

  
By morning, roughly $25 million in ETH was consolidated in a single attacker wallet, and a protocol that [had cleared $684 million in TVL more than a year prior](https://defillama.com/protocol/resolv?fees=false&events=false), was sitting frozen, its mint and redeem functions indefinitely off.  
  
**[The collateral pool, Resolv would later insist, was never touched](https://x.com/ResolvLabs/status/2035601833645768943), a technically accurate statement that will be cold comfort to anyone who held USR at a dollar and watched it reprice to spare change.**  
  

_When the architecture assumes the supply chain is secure, what exactly happens to everyone who trusted the architecture?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Chainalysis](https://www.chainalysis.com/blog/lessons-from-the-resolv-hack/), [CoinTelegraph](https://cointelegraph.com/news/resolv-labs-stablecoin-depegs-attacker-mints-millions-of-tokens), [DefiLlama](https://defillama.com/protocol/resolv?groupBy=yearly), [Peckshield](https://x.com/PeckShieldAlert/status/2035565047133401563), [Resolv Labs](https://x.com/ResolvLabs/status/2040480752643580252), [YAM](https://x.com/yieldsandmore/status/2035547381026967779), [Hacken](https://x.com/hackenclub/status/2036062692159418593), [QuillAudits](https://x.com/QuillAudits_AI/status/2036027949640781836), [Vadim](https://x.com/zacodil/status/2035658779706974556), [The Defiant](https://thedefiant.io/news/hacks/defi-has-seen-resolv-s-usd25m-usr-exploit-many-times-before), [Omer Goldberg,](https://x.com/omeragoldberg/status/2035817791786221990)  [9summits](https://x.com/nine_summits/status/2035796291725283641), [OAK Research](https://x.com/OAK_Res/status/2036144474535891246), [Morpho](https://docs.morpho.org/curate/concepts/security-considerations/), [Paul Frambot](https://x.com/PaulFrambot/status/2035822674728083906?s=20), [Steakhouse](https://kitchen.steakhouse.financial/p/resolv-usr), [Lido Finance](https://x.com/LidoFinance/status/2035607383544934483?s=20), [Stani Kulechov](https://x.com/StaniKulechov/status/2035631992151146725?s=20), [Samyak Jain](https://x.com/smykjain/status/2035831642099700136), [Inverse Finance](https://x.com/InverseFinance/status/2035590205021782116), [Gauntlet](https://x.com/gauntlet_xyz/status/2035588296592789560), [Fluid](https://x.com/0xfluid/status/2036564938429460817), [kooone](https://x.com/0xkooone/status/2036141151380709586?s=20), [TheBlock](https://www.theblock.co/post/394582/resolvs-usr-stablecoin-depegs-after-attacker-mints-80-million-unbacked-tokens-extracts-roughly-25-million), [Upbit Korea](https://x.com/Official_Upbit/status/2035960534823264609), [Venus Protocol](https://x.com/VenusProtocol/status/2036649791556616581), [Midas](https://x.com/MidasRWA/status/2036405415068446729), [Lista DAO](https://x.com/lista_dao/status/2037322590134366655), [BitcoinEthereumNews  
](https://bitcoinethereumnews.com/finance/resolv-labs-destroys-millions-of-wstusr-and-stusr-tokens-in-hacker-wallets/)_

**Sunday evening, and [YAM was already watching the chain](https://x.com/yieldsandmore/status/2035547381026967779).**  
  

**[The alert landed first](https://x.com/yieldsandmore/status/2035547381026967779):** USR was trading at one cent. Someone had just minted 50 million USR using $100k USDC.  
  
[The transaction was sitting on Etherscan](https://etherscan.io/tx/0xfe37f25efd67d0a4da4afe48509b258df48757b97810b28ce4c649658dc33743), public and unhidden, as if the attacker had no reason to hide at all.

  

They didn't. The contract gave them every right to do exactly what they did.

  
[PeckShield picked it up roughly an hour later](https://x.com/PeckShieldAlert/status/2035565047133401563), flagging both the 50M mint and a second transaction, another 30M, telling the community to stay alert.
  
**[Resolv Labs posted their first statement roughly two hours after YAM's alert](https://x.com/ResolvLabs/status/2035581976514609437):** the protocol had experienced an exploit allowing attackers to mint 50 million unbacked USR, all protocol functions had been paused, and the team was actively working on recovery.  
  
[A follow-up statement came shortly after](https://x.com/ResolvLabs/status/2035601833645768943). The collateral pool, they said, [was fully intact](https://x.com/ResolvLabs/status/2035601833645768943). No underlying assets had been lost. The issue appeared isolated to USR issuance mechanics.  
  
Technically accurate. Operationally devastating.

  
**[Cyvers caught the broader picture shortly after](https://x.com/CyversAlerts/status/2035640521524146636):** 80 million unbacked USR printed from roughly $100K–$200K in collateral, a 500:1 mismatch between supply and backing, USR depegged to $0.257 and still falling.

  

[USR had already hit $0.025 on Curve, a 97% collapse](https://cointelegraph.com/news/resolv-labs-stablecoin-depegs-attacker-mints-millions-of-tokens), 17 minutes after the first mint transaction was confirmed.  
  
By the time [Resolv's statement went live](https://x.com/ResolvLabs/status/2035581976514609437), the attacker had been converting for hours.  
  
**[PeckShield summarized the damage the following morning](https://x.com/PeckShieldAlert/status/2035680133974266292): 11,400 ETH, approximately $24 million, sitting in a single consolidation wallet. A further $1.3 million in wstUSR remained in the attacker's hands.**  
  

_When the first security alert reaches the public before the team has assembled a quorum to respond, what does that say about the monitoring infrastructure meant to protect user funds?_

  

### The Key That Ran the Mint

  
_Resolv's USR minting wasn't permissionless. It required a privileged off-chain backend, designated SERVICE_ROLE, to finalize every swap request._  
  
**That design was intentional, [a two-step process meant to add a layer of control between user deposits and token issuance](https://x.com/QuillAudits_AI/status/2036027949640781836).**

[The SERVICE_ROLE key had been held since May 2024](https://x.com/hackenclub/status/2036062689772855687), controlling not just the mint function but [also ExternalRequestsCoordinator and ResolvRequestsMgr](https://x.com/hackenclub/status/2036062689772855687), additional infrastructure contracts beyond USR issuance. One key. Multiple blast radii.

**Compromised SERVICE_ROLE EOA:**  
[0x15CAd41e6BdCaDc7121ce65080489C92CF6de398](https://etherscan.io/address/0x15cad41e6bdcadc7121ce65080489c92cf6de398)


_[The official post-mortem reveals this was not a direct breach](https://x.com/ResolvLabs/status/2040480752643580252), it was a supply chain attack._  
  
**The attack originated at a third-party project [where a Resolv contractor had previously contributed](https://x.com/ResolvLabs/status/2040480752643580252).**
  
When that third-party was compromised, the attackers obtained a GitHub credential linked to the contractor's account. That [credential opened a door into Resolv's code repositories](https://x.com/ResolvLabs/status/2040480752643580252).  
  
Once inside, the [attackers deployed a malicious CI/CD workflow designed to exfiltrate sensitive infrastructure credentials](https://x.com/ResolvLabs/status/2040480752643580252) without triggering outbound network traffic detection, then removed their own access to minimize their forensic footprint.  
  
The [extracted credentials provided access to Resolv's cloud infrastructure](https://x.com/ResolvLabs/status/2040480752643580252). Over the following days, the attackers conducted reconnaissance, enumerating services and probing for API keys.  
  
_**Gaining signing authority over the minting key was not straightforward, multiple escalation attempts were denied [before the attackers found a path that succeeded](https://x.com/ResolvLabs/status/2040480752643580252):** Using a higher-privileged role's policy management capabilities to modify the key's access policy directly, granting themselves signing authority._

**[According to Chainalysis](https://www.chainalysis.com/blog/lessons-from-the-resolv-hack/), the attacker used that signing authority to pass numbers the system was never supposed to see.**

**Transaction 1 - 50 Million USR minted:** [0xfe37f25efd67d0a4da4afe48509b258df48757b97810b28ce4c649658dc33743](https://etherscan.io/tx/0xfe37f25efd67d0a4da4afe48509b258df48757b97810b28ce4c649658dc33743)

  
**Transaction 2 - 30 Million USR minted:** [0x41b6b9376d174165cbd54ba576c8f6675ff966f17609a7b80d27d8652db1f18f](https://etherscan.io/tx/0x41b6b9376d174165cbd54ba576c8f6675ff966f17609a7b80d27d8652db1f18f)

**[The first transaction](https://etherscan.io/tx/0xfe37f25efd67d0a4da4afe48509b258df48757b97810b28ce4c649658dc33743):** 100,000 USDC deposited, 50,000,000 USR minted.  
  
**[The second transaction](https://etherscan.io/tx/0x41b6b9376d174165cbd54ba576c8f6675ff966f17609a7b80d27d8652db1f18f):** Another 100,000 USDC deposited, another 30,000,000 USR minted.
  
**[The contract had one job](https://www.chainalysis.com/blog/lessons-from-the-resolv-hack/):** Verify that a valid signature existed. It didn't ask whether the numbers made sense. The contract didn't blink. [It was working exactly as designed](https://x.com/zacodil/status/2035658779706974556).

[Hacken noted the key had controlled SERVICE_ROLE since May 2024](https://x.com/hackenclub/status/2036062689772855687), nearly two years, with no multisig requirement, and [no on-chain ceiling on what it could authorize](https://www.chainalysis.com/blog/lessons-from-the-resolv-hack/).  
  
**[Vadim put it plainly](https://x.com/zacodil/status/2035658779706974556):** "The threat model was simply: the key won't leak. It did."

[Resolv's Governance Safe required multi-signature approval to pause the protocol.](https://x.com/OAK_Res/status/2036144474535891246) Assembling those signatures took approximately three hours, with a significant portion of that delay attributed to the multi-signature approval process.  
  
**During that window, the exploit repeated across multiple wallets before anyone with authority to stop it had the signatures required to act.**

_When a single EOA can authorize unlimited token creation and the only circuit breaker requires a quorum no one could assemble in time, how many millions is that coordination delay worth?_

### Print, Wrap, Dump, Exit

  
_Eighty million USR is a lot of tokens to move without crashing yourself on the way out._  
  
**The attacker knew this. The exit was methodical.**

  
**[Step One](https://www.chainalysis.com/blog/lessons-from-the-resolv-hack/):** Convert USR into wstUSR, the wrapped staked version. Rather than dumping raw USR directly into the market, which would have accelerated the depeg even further against the attacker's own position. wstUSR represents a share of the staking pool rather than a fixed number of tokens, a more fungible derivative with access to deeper liquidity.

  
**[Step Two](https://thedefiant.io/news/hacks/defi-has-seen-resolv-s-usd25m-usr-exploit-many-times-before):** Route wstUSR through DEXes including Curve, Uniswap and others, swapping into USDC and USDT.  
  
**[Step Three](https://x.com/PeckShieldAlert/status/2035680133974266292):** Convert the stablecoins into ETH, the final destination. By the time the protocol was paused, most of the position had already cleared.

  
_The attacker operated across multiple wallets before consolidating:_

  
**Attacker EOA 1:**  
[0x04A288a7789DD6Ade935361a4fB1Ec5db513caEd](https://etherscan.io/address/0x04A288a7789DD6Ade935361a4fB1Ec5db513caEd)

  
**Attacker EOA 2:**  
[0xb945ec1be1f42777f3aa7d683562800b4cdd3890](https://etherscan.io/address/0xb945ec1be1f42777f3aa7d683562800b4cdd3890)

  
**Attacker EOA 3:**  
[0x9feeeaec113e6d2dcd5ac997d5358eee41836e5f](https://etherscan.io/address/0x9feeeaec113e6d2dcd5ac997d5358eee41836e5f)

  
**Primary consolidation wallet:**  
[0x8ED8cF0C1c531C1b20848E78f1CB32fa5B99b81C](https://etherscan.io/address/0x8ED8cF0C1c531C1b20848E78f1CB32fa5B99b81C)

  
[That last address is where roughly 11,408 ETH](https://etherscan.io/address/0x8ED8cF0C1c531C1b20848E78f1CB32fa5B99b81C) , approximately $24.3 million, came to rest. No mixer. No bridge hop. No Tornado Cash. Just sitting there, visible to anyone with a browser, while the investigation clock runs.  
  

_[The attacker's remaining $1.2–1.3 million in wstUSR stayed in Attacker EOA 1’s wallet](https://etherscan.io/address/0x04A288a7789DD6Ade935361a4fB1Ec5db513caEd), a rounding error on a $25 million haul._  
  
**[QuillAudits noted the entire operation netted an 83x return on the initial $300,000 deposit](https://x.com/QuillAudits_AI/status/2036027949640781836), and that the exploit cycled through three complete iterations before anyone publicly flagged it.**  
  
Real-time monitoring with an auto-pause capability, [QuillAudits noted](https://x.com/QuillAudits_AI/status/2036027959765856625), could have cut losses to roughly $8 million by catching it on the first transaction.  
  
**[Chainalysis echoed the point directly](https://www.chainalysis.com/blog/lessons-from-the-resolv-hack/):** Real-time monitoring and automated response mechanisms are now a necessity, not a luxury, as exploits that unfold in minutes leave no time for reactive measures once the damage is visible.

  
[Resolv's infrastructure didn't catch it](https://x.com/QuillAudits_AI/status/2036027949640781836) on the first transaction, or the second, or the third.

  
**The following morning, [Resolv sent an on-chain message to the exploiter](https://x.com/ResolvLabs/status/2036139405157736564):** Return 90%, approximately $25 million in ETH, keep 10% as settlement incentive, transfer all remaining USR under your control to the recovery address within 72 hours. Failure to comply will result in escalation and legal action. The [on-chain message is visible on Etherscan](https://etherscan.io/tx/0xc3abc8ff3509919afd7d9f7f51e3b67c09a388e506aff9aa2f9082bd00598473).

  
**Standard post-exploit protocol. The attacker never responded. The funds haven't moved.**

  
_When the entire haul is sitting in a single wallet in plain sight and the attacker still isn't blinking, what leverage does a 72-hour deadline actually carry?_  
  
### Friendly Fire  
  

_The direct damage from the exploit was bad enough._ 
  
**What followed made it worse, and it happened in two distinct phases, each more sophisticated than the last.**  
  

[Before any curator intervened, the original on-chain impact of the exploit inside Morpho's lending markets was approximately $4,900 in USDC borrowed against USR collateral](https://x.com/omeragoldberg/status/2035817794046919108), a rounding error relative to what was about to follow. The number that actually mattered came later, once automation took over.  
  

[Morpho operates a feature called the Public Allocator](https://x.com/omeragoldberg/status/2035817794046919108), a mechanism that [allows curators to automatically route capital toward markets with high utilization](https://x.com/omeragoldberg/status/2035817797452746855), capturing better yields for depositors. Under normal conditions, it's a sensible optimization.  
  
On the night of March 22nd, it became an automatic credit line for anyone holding depegged USR.  
  

_[According to Omer Goldberg](https://x.com/omeragoldberg/status/2035817795791810733), multiple curators, including [Gauntlet, Re7 Labs, kpk, and 9summits had all enabled automatic supply to](https://x.com/omeragoldberg/status/2035817791786221990) Resolv-related markets._  


**[Twenty minutes after the exploit began, at 2:41 AM UTC, Gauntlet's allocations started flowing](https://x.com/omeragoldberg/status/2035817804142629248) into [the broken wstUSR/USDC market](https://x.com/omeragoldberg/status/2035817809314247031), markets [running on hardcoded oracles](https://x.com/omeragoldberg/status/2035817820651397578) that couldn't reprice fast enough to reflect USR's collapse.**  
  
[Wallets began invoking borrow requests immediately after each incremental allocation](https://x.com/omeragoldberg/status/2035817809314247031), draining the liquidity as fast as it arrived.  
  

[Gauntlet's auto-supply continued for roughly 90 minutes](https://x.com/omeragoldberg/status/2035817809314247031) before it was noticed and disabled.[  
](https://x.com/nine_summits/status/2035796291725283641)

[Gauntlet’s first public statement acknowledged limited exposure in a few high-yield vaults](https://x.com/gauntlet_xyz/status/2035588296592789560) while noting most Gauntlet vaults were unaffected.  
  
[9summits, which had intervened early at 3:00 AM UTC,](https://x.com/nine_summits/status/2035796291725283641) documented 32 attack transactions executed against its vault at 12:33 PM UTC, [limiting its residual bad debt to $41,000](https://x.com/nine_summits/status/2035796291725283641).  
  
[9summits has since fully settled 100% of the stUSR](https://x.com/nine_summits/status/2036855553679360273) in the Usual Money vault for USDC with Resolv, with depositors able to redeem their funds in the coming days.

_In total, [Morpho vault curators fed approximately $6.2 million in USDC exit liquidity into broken markets after the exploit](https://x.com/omeragoldberg/status/2035817813776969728), with 96% of that flowing from Gauntlet vaults._

  

**Every dollar supplied was a dollar that borrowers, exploiting the pricing gap between USR's crashed market price and its hardcoded oracle value, [could borrow against worthless collateral and walk away with](https://x.com/omeragoldberg/status/2035817822899597407).**  
  

**[Omer Goldberg, founder of Chaos Labs, laid out the mechanics in a 21-post thread](https://x.com/omeragoldberg/status/2035817791786221990):** The automation [had no circuit breaker](https://x.com/omeragoldberg/status/2035817820651397578), the oracles were [hardcoded and immutable](https://x.com/omeragoldberg/status/2035817820651397578), and their [systems kept supplying liquidity into broken markets for hours after the exploit began](https://x.com/omeragoldberg/status/2035817791786221990).  
  
[His conclusion was direct](https://x.com/omeragoldberg/status/2035817822899597407), a Public Allocator that can be triggered by anyone during a live exploit, against a hardcoded oracle, functions as an automatic subsidy for attackers.  
  
But the Public Allocator was only phase one. [A second, more deliberate attack followed, as documented by OAK Research](https://x.com/OAK_Res/status/2036144474535891246).  
  
_[Once curators responded by setting USR market supply caps to zero](https://x.com/OAK_Res/status/2036144474535891246), the standard defensive move, the attacker exploited a [documented vulnerability in Morpho's vault architecture](https://docs.morpho.org/curate/concepts/security-considerations/)._  
  
**[By calling Morpho's supply() function with a vault's address as the beneficiary](https://x.com/OAK_Res/status/2036144474535891246), anyone can force a vault to accumulate market shares it never chose to hold.**  
  
[Using a flash loan to temporarily acquire a large share of the targeted vault's supply](https://x.com/OAK_Res/status/2036144474535891246), the attacker likely force-injected USDC liquidity into the wstUSR/USDC market, then deposited their devalued wstUSR as collateral, still valued at $1 by the hardcoded oracle, [borrowed the freshly available USDC, repaid the flash loan, and walked away with the difference](https://x.com/OAK_Res/status/2036144474535891246).  
  
[Morpho's own documentation warns explicitly](https://docs.morpho.org/curate/concepts/security-considerations/) that setting supply caps to zero does not prevent this class of attack. The warning, it appears, was not widely understood.

  
_[Morpho co-founder Merlin Egalite was clear](https://cointelegraph.com/news/resolv-says-no-assets-lost-as-defi-partners-respond-to-usr-depeg) that the protocol's own contracts were unaffected and that only certain vaults had exposure._  

**[Morpho Co-founder and CEO Paul Frambot confirmed roughly 15 vaults with more than $10,000](https://x.com/PaulFrambot/status/2035822674728083906?s=20) in liquidity were impacted.**  
  
[Notably, Steakhouse](https://kitchen.steakhouse.financial/p/resolv-usr), despite having been engaged as Resolv's risk manager just days prior, [publishing a risk assessment that explicitly covered this class of exploit](https://kitchen.steakhouse.financial/p/resolv-usr) and concluded that Resolv "demonstrates institutional rigor", had no exposure to the protocol at all.

  
**[Steakhouse later added an update to the report itself](https://kitchen.steakhouse.financial/p/resolv-usr):** "Unfortunately, one of the risks we highlighted in the below report materialized, leading to an exploit that allowed an attacker to mint new USR tokens."  
  
If your risk assessment concludes a protocol is built to handle exactly this scenario, and you have no exposure when it isn't, what exactly were you managing?  
  
_The collateral damage extended well beyond Morpho. Across lending markets, yield products, and integrated protocols._  
  
**The [full list of affected venues](https://x.com/wumpycrypto/status/2035787782455451908) included:**  
  

**[Morpho vaults](https://x.com/wumpycrypto/status/2035787782455451908):** Gauntlet USDC Core, Gauntlet USDC Frontier, Resolv USDC, 9Summits USDC, Extrafi XLend USDC, Re7 USDC, Seamless USDC, Apostro Resolv USDC, August AUSD, Clearstar Yield USDC, kpk USDC Yield, MEV Capital USDC, Keyrock USDC.

  
**[Euler markets](https://x.com/wumpycrypto/status/2035787782455451908):** Apostro Resolv, Euler Arbitrum Yield.  
  

**[Midas products](https://x.com/wumpycrypto/status/2035787782455451908):** mBASIS, mAPOLLO, mEDGE, msyrupUSDp.

  
_**[Beyond those, exposure was confirmed or flagged across](https://x.com/wumpycrypto/status/2035787782455451908):** yoUSD, Fluid on Arbitrum, Base, Ethereum, and Plasma, Venus Protocol Flux, Lista DAO's USD1 vault, Inverse Finance DOLA, and Upshift's coreUSDC, upUSDC, and earnAUSD products._ 
  

**[Lido Finance confirmed Lido Earn user funds](https://x.com/LidoFinance/status/2035607383544934483?s=20) were safe.**  
  
[Aave founder Stani Kulechov stated no direct USR exposure](https://x.com/StaniKulechov/status/2035631992151146725?s=20), with Resolv actively repaying outstanding debt.  
  
[Fluid faced over $11 million in potential bad debt](https://x.com/OAK_Res/status/2036144474535891246) from [a separate hardcoded oracle](https://x.com/smykjain/status/2035860097851863088), distinct from the Morpho situation, and secured short-term loans to cover losses in full. 
  
_[Inverse Finance's Risk Working Group paused the wstUSR-DOLA market within 15 minutes of the exploit](https://x.com/InverseFinance/status/2035590205021782116); despite $10 million in active debt, liquidations brought these position to zero, leaving residual bad debt of 340,060 DOLA._
  
**Stream Finance, [which had previously disclosed a $93 million loss in November 2025](https://rekt.news/loop-contagion), holds [approximately 13.6 million RLP tokens representing roughly $17 million in pre-exploit net exposure](https://x.com/OAK_Res/status/2036144474535891246), with outcome still uncertain as the recovery unfolds and they have been radio silent so far. [Stream Finance has not tweeted](https://x.com/StreamDefi) since [November’s disaster](https://rekt.news/loop-contagion).**

[Euler, Venus, and Lista each took precautionary actions](https://x.com/OAK_Res/status/2036144474535891246), pausing markets or isolating vaults.

**[Cyvers VP GTM and strategy, Michael Pearl told CoinTelegraph:](https://cointelegraph.com/news/resolv-says-no-assets-lost-as-defi-partners-respond-to-usr-depeg)** “That since the supply had inflated faster than the market could absorb and the token had immediately depegged, the value of the remaining tokens was significantly impaired.”  
  
**[Ledger CTO Charles Guillemet offered the measured verdict](https://x.com/P3b7_/status/2035662160118915328):** Given USR's size, "this is not a Terra Luna-type event."  
  

**Small comfort to the protocols still calculating their losses.**  
  

_[When a risk assessment published five days before an exploit concludes the protocol is well-designed to handle exactly this scenario](https://kitchen.steakhouse.financial/p/resolv-usr), and the exploit happens anyway, what is a risk assessment actually worth?_

  
### Still Counting

  
_[Resolv's official position](https://x.com/ResolvLabs/status/2035601833645768943) is that no underlying collateral was lost._  
  
**Technically, that's true, the [collateral pool backing the protocol's delta-neutral strategy](https://docs.resolv.xyz/litepaper/protocol-mechanics/collateral-pool) sat untouched.**  
  

**What was lost was something harder to recover:** The integrity of USR's supply, the confidence of its holders, and roughly $25 million that is now sitting in an attacker's wallet.

  
The protocol has [been paused since the early hours of March 22nd](https://x.com/ResolvLabs/status/2040480752643580252), with the [official post-mortem confirming most operations remain paused](https://x.com/ResolvLabs/status/2040480752643580252) until further notice.  
  
[Pre-exploit USR holders are being compensated on a 1:1 basis, with 98% of whitelisted redemptions already processed or in the pipeline](https://x.com/ResolvLabs/status/2038963136443600944). Work on subsequent phases covering remaining user groups is actively underway.

_Early signs of remediation are emerging, [Gauntlet met with Resolv to discuss next steps](https://x.com/gauntlet_xyz/status/2036162856518099115) and expressed confidence in a positive outcome for affected Morpho vault suppliers._  
  
**[Fluid confirmed debt repayments have begun](https://x.com/0xfluid/status/2036564938429460817), with approximately $70 million in USR-related debt on BNB and Plasma chains cleared, a governance proposal published to transfer remaining debt positions to the team multisig for settlement with Resolv, and a compensation plan for all affected USR users forthcoming.**

[Venus Protocol confirmed $31.6 million in USR-related debt on Flux has been cleared](https://x.com/VenusProtocol/status/2036649791556616581), with the remaining balance expected within days and interest rates returned to normal.

[Midas confirmed mAPOLLO redeemed its USR position in full](https://x.com/MidasRWA/status/2036405415068446729), with mBASIS and msyrupUSDp withdrawing Fluid allocations on Plasma as a precaution despite having no direct USR exposure.

[Lista DAO confirmed $8.4 million of its $8.6 million in USR-related loans has been fully repaid at 1:1](https://x.com/lista_dao/status/2037322590134366655), zero loss for users and the protocol, with one position of $26,000 remaining.

_[Resolv reported that over $77 million has been redeemed by allowlisted pre-exploit USR holders in the first two days](https://x.com/ResolvLabs/status/2036749564485775762), representing more than 90% of that group, with subsequent phases covering remaining user groups actively underway._  

  
**For anyone still trying to map their own exposure, [Exposure.Forum](https://resolv.exposure.forum/) launched during the incident specifically to track Resolv-related contagion, [one screen designed to answer which curator got hit, which protocol lost how much, and whether a given vault is actually safe](https://x.com/0xkooone/status/2036141151380709586?s=20).**  
  
[The RESOLV governance token fell approximately 8.5% in the 24 hours following the exploit](https://www.theblock.co/post/394582/resolvs-usr-stablecoin-depegs-after-attacker-mints-80-million-unbacked-tokens-extracts-roughly-25-million) and has [continued to fall since](https://www.coingecko.com/en/coins/resolv).  
  

**Upbit, South Korea's largest exchange, [designated RESOLV as a trading caution item](https://x.com/Official_Upbit/status/2035960534823264609).**  
  

There is also a number sitting quietly in the background that nobody at Resolv has addressed publicly. [USR's market cap fell from approximately $400 million in early February 2026 to roughly $100 million](https://www.coingecko.com/en/coins/resolv-usr) in the weeks immediately before the attack, a 75% contraction over six weeks, with no public explanation from the team.  
  
The SERVICE_ROLE key [lived exclusively within team infrastructure](https://x.com/zacodil/status/2035658779706974556).  
  
_No evidence of insider trading has been established._

  
**[Resolv has engaged law enforcement](https://x.com/ResolvLabs/status/2035830314799599616) and on-chain analytics firms, [burned approximately 9 million of the attacker's illicitly minted tokens](https://x.com/ResolvLabs/status/2035830314799599616), and [revoked the compromised SERVICE_ROLE](https://x.com/hackenclub/status/2036062692159418593).**  
  

[As of March 26th, Resolv confirmed that approximately 46 million of the 80 million illicitly minted USR , roughly 57%](https://x.com/ResolvLabs/status/2037110361711870214), has been permanently removed from circulation through a combination of burns and blacklisting, with no illicitly minted assets remaining on exploiter-associated addresses.  
  
[On April 6th, Resolv executed a smart contract upgrade to permanently burn 36.73 million wstUSR and stUSR tokens remaining in the hacker's wallets](https://bitcoinethereumnews.com/finance/resolv-labs-destroys-millions-of-wstusr-and-stusr-tokens-in-hacker-wallets/), unwrapping them to USR before sending both to the zero address, permanently beyond anyone's reach.  
  
_[The investigation is being conducted by Mandiant and ZeroShadow](https://x.com/ResolvLabs/status/2038963136443600944), with no evidence of insider involvement found at this stage._  
  
**[The official post-mortem attributes the breach to a supply chain attack](https://x.com/ResolvLabs/status/2040480752643580252) originating from a compromised third-party project where a Resolv contractor had previously contributed, not an insider.**  
  
[The protocol's own accounting puts the collateral pool at approximately $141 million in assets,](https://x.com/ResolvLabs/status/2035830314799599616) with only $0.5 million in redemptions processed before the pause, limiting the confirmed direct financial drain to the protocol itself.  
  

  
**The funds haven't moved.**

  
_When a protocol's collateral is intact but its stablecoin crashed to two cents and its governance token is on a trading alert list, how exactly does "no underlying assets were lost" hold up as the headline?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)





_[February 2026 was the quietest month for crypto hacks since March 2025, $26.5 million lost, a 69.2% drop from January's $86 million](https://cointelegraph.com/news/crypto-hack-losses-february-2026-peckshield-lowest-since-march-2025), and the kind of number that lets an industry exhale._  
  
**Then March arrived.**

Resolv's $25 million sits in that ledger, distinguished not by complexity but by simplicity: [One key, one function, no ceiling, no check](https://x.com/zacodil/status/2035658779706974556). [The contracts were reviewed 18 times](https://docs.resolv.xyz/litepaper/resources/security).  
  
[The key had sat in that environment for nearly two years](https://x.com/hackenclub/status/2036062689772855687). The architecture was never a secret, it was just never treated as a threat.

And the entry point wasn't even inside Resolv, it was a contractor's credential at a third-party project that had been compromised before the attackers ever touched Resolv's infrastructure.
  
**[Chainalysis put it plainly](https://www.chainalysis.com/blog/lessons-from-the-resolv-hack/):** As DeFi systems become more complex and use more external services, privileged keys, and cloud infrastructure, the attack surface expands far beyond the blockchain itself.

[Eighteen audits](https://docs.resolv.xyz/litepaper/resources/security), [$500,000 bug bounty](https://beincrypto.com/resolv-usr-stablecoin-depegs-after-security-failure/), a [risk assessment published five days before the exploit](https://kitchen.steakhouse.financial/p/resolv-usr).  
  
**None of it mattered when the weakest link wasn't in the code, it wasn't even in Resolv. It was in a contractor's GitHub account at a project they'd worked on months before.**

_If the industry already knows that off-chain infrastructure and their teams are the new front line, why does it keep treating it like an afterthought?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
