---
tags:
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/lending
  - sector/privacy
  - sector/stable
title: "Abracadabra - Rekt III"
protocol: "[[Abracadabra]]"
date: 2025-10-04
loss_usd: 1800000
auditors:
source: "https://rekt.news/abracadabra-rekt3"
excerpt: "$1.8 million walked out the door as Abracadabra’s deprecated Cauldron contracts let anyone flip a flag and borrow uncollateralized MIM. Three hacks, $21 million lost, and the simplest exploit yet prov"
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[liquidation-underwater]]"
  - "[[oracle-freshness]]"
  - "[[upgrade-safety]]"
---
# Abracadabra - Rekt III

> **Loss:** $1,800,000 | **Date:** 2025-10-04 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/abra-rekt3-header.png)




_Three strikes and you're... still planning future deployments?_

  
**Abracadabra just performed their third disappearing act in under two years, with $1.8 million in MIM tokens vanishing through a vulnerability so obvious it practically had a neon sign pointing at it.**  
  
A simple two-action sequence - borrow, then reset the security flag - turned deprecated CauldronV4 contracts into an ATM for anyone who bothered reading the code.  
  
Saturday's exploit targeted six "deprecated" cauldrons on Ethereum mainnet, contracts that hadn't seen an audit since November 2023 yet somehow remained live, accessible, and perfectly capable of minting unbacked stablecoins.  
  
**Magic Internet Money lived up to its name once again, disappearing faster than trust in a protocol that's lost over $21 million to exploits while insisting everything's under control.**

  
_When your security strategy consists of calling old contracts "deprecated" but forgetting to turn them off, who's really getting played?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [William Li](https://x.com/hklst4r/status/1974477630171734327), [BlockSec Phalcon](https://x.com/Phalcon_xyz/status/1974533451408986417), [GoPlus Security](https://x.com/GoPlusSecurity/status/1974716994516877452), [The Block](https://www.theblock.co/post/373453/abracadabra-loses-1-8-million-in-protocols-third-major-defi-hack-since-2024), [MIM Spell](https://x.com/MIM_Spell/status/1975130787486831018), [DK27ss](https://github.com/DK27ss/Abracadabra-1.7M-PoC), [Synnax](https://x.com/synnax_labs/status/1973404161128669574)_

**Saturday turned into an expensive debugging session for Abracadabra.**  
  

Security researcher [William Li spotted it first on October 4th](https://x.com/hklst4r/status/1974477630171734327), dropping a preliminary analysis on Twitter.  
  
[BlockSec Phalcon jumped in with confirmation a few hours later](https://x.com/Phalcon_xyz/status/1974533451408986417), flagging the exploit pattern spreading across multiple cauldron addresses.  
  
[The cook() function's shared status tracker let actions overwrite each other's security flags](https://x.com/Phalcon_xyz/status/1974533451408986417) - action 0 could reset needsSolvencyCheck to false, bypassing the insolvency check entirely.  
  
_[GoPlus Security tracked 51 ETH laundering through Tornado Cash](https://x.com/GoPlusSecurity/status/1974716994516877452) while another [344 ETH sat untouched in the attacker's wallet](https://x.com/GoPlusSecurity/status/1974716994516877452), as if they were taking their time deciding what to do with phase two._  
  

**[Abracadabra's response came shortly after](https://www.theblock.co/post/373453/abracadabra-loses-1-8-million-in-protocols-third-major-defi-hack-since-2024), delivered not through their official Twitter account, but via Discord contributor 0xMerlin.**  
  
[The message hit all the standard notes](https://www.theblock.co/post/373453/abracadabra-loses-1-8-million-in-protocols-third-major-defi-hack-since-2024): vulnerability discovered, DAO treasury mobilized, affected MIM bought back, no user funds lost, everything under control.  
  
Two days after the exploit, [they finally announced the hack publicly on Twitter](https://x.com/MIM_Spell/status/1975130787486831018).  
  
[They paused all cauldron borrowing](https://x.com/MIM_Spell/status/1975130787486831018) "as we review the current codebase for future upcoming deployments" - a phrase that sounds suspiciously like planning expansion while still sweeping up glass from the last break-in.  
  

**[They doubled down on the](https://x.com/MIM_Spell/status/1975130787486831018) "relatively small impact" framing, as if $1.8 million and three exploits in two years qualified as minor paperwork issues.**  
  

_But how does a protocol with multiple audit rounds, two previous multi-million dollar hacks, and a $154 million TVL end up with a vulnerability this elementary still sitting in production code?_  
  
### The Technical Sleight of Hand  
  
_[Abracadabra's CauldronV4 uses a cook() function](https://github.com/DK27ss/Abracadabra-1.7M-PoC) that bundles multiple operations into one transaction._  
  
**[Each action gets an ID number and executes in order](https://github.com/DK27ss/Abracadabra-1.7M-PoC), with a shared status tracker deciding whether the contract needs to check if you're actually solvent before the transaction completes.**

  
[ACTION_BORROW (action 5) kicks off a borrow](https://x.com/Phalcon_xyz/status/1974533451408986417) and flips needsSolvencyCheck to true - basically telling the contract "hey, verify this person has collateral before you let them leave with our money."  
  

[Action 0 (ACTION_CUSTOM) calls an internal helper function](https://x.com/Phalcon_xyz/status/1974533451408986417) named _additionalCookAction() - which despite its official-sounding name, does absolutely nothing except return a fresh CookStatus struct with all fields reset to false.  
  

solidityfunction _additionalCookAction(CookStatus memory, bytes memory) internal pure returns (CookStatus memory) {return CookStatus(false);
}  
  

**[That's the whole function](https://github.com/DK27ss/Abracadabra-1.7M-PoC). A reset button for security checks, sitting in production code like someone left a master key under the doormat.**  
  

[The attacker's execution was efficient](https://x.com/Phalcon_xyz/status/1974533451408986417): call cook() with actions = [5, 0], pass in parameters for a massive borrow, watch as Action 5 sets the solvency flag to true, then watch Action 0 immediately overwrite it back to false.

  
[When cook() finishes and checks](https://x.com/Phalcon_xyz/status/1974533451408986417) if (status.needsSolvencyCheck) _ensureSolvent(user);, the flag reads false, the check gets skipped, and the attacker walks away with 1,793,755 MIM tokens borrowed against exactly zero collateral.  
  
**Attacker’s Address:**  
[0x1AaaDe3e9062d124B7DeB0eD6DDC7055EFA7354d](https://etherscan.io/address/0x1aaade3e9062d124b7deb0ed6ddc7055efa7354d)

**[They repeated this sequence across six different cauldrons](https://github.com/DK27ss/Abracadabra-1.7M-PoC), treating Abracadabra's lending markets like a self-service money printer:**

  

[0x46f54d434063e5F1a2b2CC6d9AAa657b1B9ff82c](https://etherscan.io/address/0x46f54d434063e5F1a2b2CC6d9AAa657b1B9ff82c)

[0x289424aDD4A1A503870EB475FD8bF1D586b134ED](https://etherscan.io/address/0x289424aDD4A1A503870EB475FD8bF1D586b134ED)

[0xce450a23378859fB5157F4C4cCCAf48faA30865B](https://etherscan.io/address/0xce450a23378859fB5157F4C4cCCAf48faA30865B)

[0x40d95C4b34127CF43438a963e7C066156C5b87a3](https://etherscan.io/address/0x40d95C4b34127CF43438a963e7C066156C5b87a3)

[0x6bcd99D6009ac1666b58CB68fB4A50385945CDA2](https://etherscan.io/address/0x6bcd99D6009ac1666b58CB68fB4A50385945CDA2)

[0xC6D3b82f9774Db8F92095b5e4352a8bB8B0dC20d](https://etherscan.io/address/0xC6D3b82f9774Db8F92095b5e4352a8bB8B0dC20d)

  

**Attack transaction:** [0x842aae91c89a9e5043e64af34f53dc66daf0f033ad8afbf35ef0c93f99a9e5e6](https://etherscan.io/tx/0x842aae91c89a9e5043e64af34f53dc66daf0f033ad8afbf35ef0c93f99a9e5e6)

The attacker skipped the complex stuff, no multi-step transaction gymnastics.  
  
**[Just two actions in the right order](https://x.com/hklst4r/status/1974477630171734327), exploiting a logic flaw anyone with access to the contract code could've spotted.**  
  

_Precision errors and rounding bugs require PhD-level math to exploit; this vulnerability just needed someone willing to read the code and ask "wait, what happens if I do this?"_  
  
### Follow the Money  
  
_The attacker didn't materialize from nowhere - Tornado Cash provided the introduction._

  
**Once the vulnerability was identified, execution followed a predictable pattern across six cauldrons.**  
  
**Tornado Cash Funding:**  
[0x68437f1f687e3fbe65dd86a802f6ca08b44af3dff612f02c4c8b6945c9dd4f82](https://etherscan.io/tx/0x68437f1f687e3fbe65dd86a802f6ca08b44af3dff612f02c4c8b6945c9dd4f82)

**Attacker also used this wallet to send the funds from Tornado Cash:**  
[0x1FF8Ea9b29aa10713774b60134D53529301Ca9C5](https://etherscan.io/address/0x1ff8ea9b29aa10713774b60134d53529301ca9c5)

**Primary Attacker Address:**  
[0x1AaaDe3e9062d124B7DeB0eD6DDC7055EFA7354d](https://etherscan.io/address/0x1aaade3e9062d124b7deb0ed6ddc7055efa7354d)

  
**Attack Contract (self-destructed):**  
[0xB8e0A4758Df2954063Ca4ba3d094f2d6EdA9B993](https://etherscan.io/address/0xb8e0a4758df2954063ca4ba3d094f2d6eda9b993#internaltx)

  
**Exploited DegenBox:**  
[0xd96f48665a1410c0cd669a88898eca36b9fc2cce](https://etherscan.io/address/0xd96f48665a1410c0cd669a88898eca36b9fc2cce)

  
Funding came from Tornado Cash - because nothing says "legitimate research" quite like mixing your seed ETH through sanctioned privacy protocols before draining lending markets.

  
[The attacker worked methodically through six cauldrons](https://github.com/DK27ss/Abracadabra-1.7M-PoC), minting 1,793,755 MIM against zero collateral. Once the unbacked stablecoins were secured, they converted roughly half to ETH and started the standard exit routine: swap, bridge, Tornado.  
  

[51 ETH hit the mixer immediately](https://x.com/GoPlusSecurity/status/1974716994516877452) while [344 ETH remained parked in the attacker's wallet](https://x.com/GoPlusSecurity/status/1974716994516877452), but only for a couple of minutes, as all of the ETH was laundered through Tornado Cash in over 3 dozen transactions.  
  
**Tornado Cash Laundering:**  
[0x1aaade3e9062d124b7deb0ed6ddc7055efa7354d](https://etherscan.io/txs?a=0x1aaade3e9062d124b7deb0ed6ddc7055efa7354d)

_[Abracadabra's DAO treasury stepped in with a buyback operation](https://x.com/MIM_Spell/status/1975130787486831018), purchasing the dumped MIM from the market and [claiming they'd](https://x.com/MIM_Spell/status/1975130787486831018) "completely reversed the effect of the attack."_

  
**The buyback transaction:** [0xbaede1ddbab71fb48d25139e720356d8c487d47ce4b94aaf683969dc1fb1c984](https://etherscan.io/tx/0xbaede1ddbab71fb48d25139e720356d8c487d47ce4b94aaf683969dc1fb1c984)

  
[Their narrative leaned hard on](https://x.com/MIM_Spell/status/1975130787486831018) "no user funds lost" - which is only true if DAO treasury reserves don't count as anyone's money.  
  
But treasury funds don't materialize from thin air; they're stakeholder assets that could've funded security audits, development, or literally anything besides covering losses from entirely preventable exploits.  
  

**[Calling it](https://x.com/MIM_Spell/status/1975130787486831018) "relatively small impact" while burning through treasury funds to patch a $1.8 million hole is like calling a car crash minor because insurance covered it.**  
  

_When your damage control strategy relies on redefining whose money counts as "real" losses, what exactly are you protecting?_  
  
### The Audit That Wasn’t  
  
_[Abracadabra's GitHub audit folder](https://github.com/Abracadabra-money/abracadabra-money-contracts/tree/main/audits) reads like a timeline of looking everywhere except where it mattered._  
  

**November 14, 2023: [Guardian Audits reviewed GMXV2 CauldronV4](https://github.com/GuardianAudits/Audits/blob/main/AbracadabraMoney/11-14-2023_Abracadabra_GMXV2.pdf) - a specialized variant that got gutted for $13 million 16 months later.**  
  

**February 6, 2024:**  [LockingMultiRewards audit](https://github.com/Abracadabra-money/abracadabra-money-contracts/blob/main/audits/2024-02-06_Abracadabra_LockingMultiRewards.pdf).  
  

**March 21, 2024:**  [MIMSwap audit](https://github.com/Abracadabra-money/abracadabra-money-contracts/blob/main/audits/2024-03-21_MIMSwap.pdf) - shiny new product gets immediate attention.  
  

**December 16, 2024:**  [BoundSpell audit](https://github.com/Abracadabra-money/abracadabra-money-contracts/blob/main/audits/2024-12-16_Abracadabra_BoundSpell_Report.pdf).  
  

_Spot what's absent?_  
  
**Any recent security review of the base CauldronV4 contracts - the ones actually processing borrows on Ethereum mainnet, the ones labeled "deprecated" but somehow still live and functional.**  
  

The last time [auditors examined standard CauldronV4 logic was November 2023](https://github.com/GuardianAudits/Audits/blob/main/AbracadabraMoney/11-14-2023_Abracadabra_GMXV2.pdf), almost two years before this October exploit.  
  
Between that audit and Saturday's attack, Abracadabra commissioned security reviews for their shiny new features while the foundation sat untouched, unexamined, and apparently unfixable.

  
Two major hacks happened during that window - [$6.5 million in January 2024](https://rekt.news/abra-rekt), [$13 million in March 2025](https://rekt.news/abracadabra-rekt2) - yet audit resources kept flowing toward expansion rather than securing what already existed.  
  

_[Code4rena found 20 vulnerabilities during their March 2024 MIMSwap review](https://code4rena.com/reports/2024-03-abracadabra-money), including four rated high severity._  
  
**Note: [this review focused exclusively on the new MIMSwap module](https://code4rena.com/reports/2024-03-abracadabra-money) and did not include the core CauldronV4 contracts that handle Ethereum mainnet borrows - the contracts ultimately exploited in October 2025.**  
  
This highlights a pattern: security resources were concentrated on new features while foundational logic remained largely unexamined.  
  

Then there's the PeckShield situation - a masterclass in transparency theater.  
  

Synnax Labs, an Abracadabra fork, shared the same vulnerable codebase.  
  
_[PeckShield audited them in November 2024](https://github.com/peckshield/publications/blob/6c46c780d05c21ee520f416800e135416889182a/audit_reports/PeckShield-Audit-Report-Synnax-v1.0.pdf), missed the attack vector entirely, reported two medium and two low severity issues, called it secure._  
  

**3 days before the Abracadabra exploit, [Synnax paused their contracts](https://x.com/synnax_labs/status/1973404161128669574) for "security upgrades."**  
  
Eighteen hours before the attack, [PeckShield quietly deleted their Synnax audit report from GitHub](https://github.com/peckshield/publications/commit/df5b4a78114e6dcfe335ef573e03ab31f4f21506).  
  

[After Synnax requested and received a refund for the failed audit](https://x.com/synnax_labs/status/1974921194697838854), the report vanished from public view - though git history never forgets.  
  

[William Li documented the whole sequence](https://x.com/hklst4r/status/1974827196557426899): audit published, vulnerability exploited on similar codebase, audit deleted, refund issued, everyone pretends it never happened.  
  

**PeckShield's post-exploit silence spoke louder than any alert they didn't send.**  
  
_Companies that miss critical vulnerabilities usually release detailed post-mortems explaining what went wrong; companies that delete evidence and ghost the community are protecting their reputation, not their clients._ 
  

Synnax Labs - Abracadabra's own fork - discovered this vulnerability and paused contracts four days before the attack.  
  
PeckShield deleted their audit report eighteen hours before the exploit hit.
  
The warning signs were public, the codebase was shared, and Abracadabra's deprecated contracts kept running.

  
**"Deprecated" became a convenient label for contracts they'd stopped maintaining but never bothered to shut down - like calling a loaded gun "decorative" and leaving it on the coffee table.**

  
_When your fork pauses contracts four days before your exploit, PeckShield deletes their audit, and you've already bled $19.5 million across two previous hacks - what part of "deprecated" gave anyone confidence these contracts were safe?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)




_Three times rekt, $21 million lighter, still insisting it's all under control._

  
**Abracadabra's magic was supposed to be turning idle collateral into yield - turns out the real trick is making protocol funds vanish while claiming victory.**  
  
$6.5 million vanished through rounding errors, $13 million leaked through phantom collateral, and now $1.8 million walked out the door via a status flag anyone could flip - each exploit more preventable than the last, each response more hollow than the previous.  
  
Their audit folder documents everything except the contracts that mattered, their "deprecated" label meant "ignored but still live," and their damage control playbook reduces to treasury buybacks and semantic debates about whose funds actually count as lost.  
  
Magic Internet Money hasn't just been hacked 3 times - it's become a case study in how protocols prioritize expansion over maintenance, new features over fundamental security, and optics over accountability.  
  
**$21 million in cumulative losses later, they're still planning "future deployments" while sweeping up glass from exploits that never should have happened.**  
  

_When your third disappearing act is the easiest one yet, what's the real magic trick - the exploits, or convincing anyone there's still a protocol worth trusting?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
