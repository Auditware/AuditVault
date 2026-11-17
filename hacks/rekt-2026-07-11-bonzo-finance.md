---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - web3-sector/bridge
  - web3-sector/dex
  - web3-sector/infra
  - web3-sector/lending
  - web3-sector/oracle
  - web3-sector/privacy
  - web3-sector/stable
  - web3-sector/staking
  - vuln/reentrancy/single-function
  - trigger/flash-loan
  - precondition/flash-loan-available
  - novelty/known-pattern
  - type/hack
  - vector/flash-loan
  - vector/reentrancy
title: "Bonzo Finance - Rekt"
protocol: "Bonzo Finance"
date: 2026-07-11
loss_usd: 9050000
audit: "N/A"
source: "https://rekt.news/bonzo-finance-rekt"
excerpt: "Zero equals zero. Supra’s oracle verifier accepted a zeroed signature against a zeroed key, and Bonzo Finance on Hedera lost $9.05 million because the math checked out and nobody questioned the premis"---
# Bonzo Finance - Rekt

> **Loss:** $9,050,000 | **Date:** 2026-07-11 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/bonzo-finance2-rekt-header.png)






_Zero equals zero. That was the entire cryptographic proof standing between [Hedera's largest lending market and a $9.05 million bleed-out](https://x.com/0x3b33/status/2076194776324481033)._  
  

**Not a forged signature. Not a stolen key. An absence, mistaken for a presence.**  
  

On July 11th, [an attacker dropped 250 SAUCE tokens](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit), worth [about $3](https://x.com/0x3b33/status/2076194776324481033), into Bonzo Lend, [wrote themselves a price twelve orders of magnitude too high](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit), and waited eight seconds.  
  

Eight seconds bought [6.63 million USDC and 34.5 million WHBAR](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit) against what was functionally dust.  
  

**[No flash loan](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit). No reentrancy. No key ever cracked, [because no key was ever checked](https://supra.com/news/security-incident-report-hedera-pull-oracle-verifier/).**  
  
[Supra's verifier accepted the malformed update](https://supra.com/news/security-incident-report-hedera-pull-oracle-verifier/), and the pairing check returned true.

[Bonzo's contracts read the number they were handed](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit) and did exactly what they were built to do.

**[The precompile answered the question correctly](https://supra.com/news/security-incident-report-hedera-pull-oracle-verifier/). The verifier failed to validate the inputs first.**

_When the equation checks out and the money is still gone, who exactly authorized the withdrawal?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Pyro](https://x.com/0x3b33/status/2076194776324481033), [Bonzo Finance](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit), [Supra](https://supra.com/news/security-incident-report-hedera-pull-oracle-verifier/), [CoinGecko](https://www.coingecko.com/en/coins/saucerswap?chart=type%3Dprice%26mode%3Dline%26timeframe%3Dmax), [Specter](https://x.com/SpecterAnalyst/status/2075852579343303121), [Hedera](https://x.com/hedera/status/2075941843116728461), [Cos](https://x.com/evilcos/status/2075944126819037633), [QuillAudits](https://x.com/QuillAudits_AI/status/2075961114459046191), [Joshua Tobkin](https://x.com/JoshuaTobkin/status/2076630890017587515), [Peckshield](https://x.com/PeckShieldAlert/status/2075867053408629179)_

**00:39 UTC, July 11th, [wallet A deposits 250 SAUCE into Bonzo Lend](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit). Nobody notices, why would they, [it was worth roughly more than $3](https://www.coingecko.com/en/coins/saucerswap?chart=type%3Dprice%26mode%3Dline%26timeframe%3Dmax).**  
  

Twelve minutes later, [the same wallet submits a price update to Supra's on-chain oracle](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit).  
  
SAUCE, trading at roughly a penny and a half, [suddenly prices out at twelve orders of magnitude higher](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit).  
  
Eight seconds after that, [6.63 million USDC and 34.5 million WHBAR leave the pool](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit).  
  
**[Bonzo's own channels catch up first with the vaguest possible language](https://x.com/bonzo_finance/status/2075757610423538036), "investigating volatile markets," a pause, a [link to a status page](https://status.bonzo.finance/). No dollar figure. No mention of an exploit.**

  
_**[Onchain Investigator Specter got there first with the initial details](https://x.com/SpecterAnalyst/status/2075852579343303121):** There appears to be an ongoing hack involving Hedera Network, with over $3.7 million already bridged to Ethereum through LayerZero, stolen funds swapping from WBTC into ETH._  
  
The number kept climbing across separate posts, [past $4 million](https://x.com/SpecterAnalyst/status/2075854944318406790), then [past $5 million](https://x.com/SpecterAnalyst/status/2075864821317140501), then confirmation the [proceeds are heading into Tornado Cash](https://x.com/SpecterAnalyst/status/2075908954266153186).  
  
**[Bonzo then published the official accounting](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit):** The incident would ultimately be pegged at $9.05 million in principal extracted by the attacker, with roughly $1 million more tied to the white-hat responder  
  

**[Hedera's own account draws a line nobody else had drawn yet, this isn't a chain-level failure](https://x.com/hedera/status/2075941843116728461):** "Hedera's consensus mechanism and core network services were not compromised, and mainnet remained operational."  
  
_The blame lands on a third-party oracle verifier, [and Hedera named Supra directly](https://x.com/hedera/status/2075986869569884353), in public, a day before [Supra says a word itself](https://x.com/SUPRA_Labs/status/2076411280035127429)._  
  

**By [09:49 UTC](https://x.com/bonzo_finance/status/2075880102303576390), [Bonzo publishes its full incident report](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit), the document that would eventually account for every wallet, every timestamp, every zeroed signature.**  
  
**[Cos, founder of SlowMist, reduces the mechanism to one sentence anyone can parse](https://x.com/evilcos/status/2075944126819037633):** The attacker's signature and public key were both zero, so "both sides of the underlying mathematical verification equation simultaneously became 0," and the check passed anyway.  
  

[QuillAudits closed the attack loop with addresses, transaction hashes](https://x.com/QuillAudits_AI/status/2075961114459046191), and then a route, [Arbitrum, Base, Ethereum, then Tornado Cash](https://x.com/QuillAudits_AI/status/2075961122172387774).  
  
**Same mixing playbook every exploit reaches for eventually, just with a fresher disguise this time.**  
  

_When the people tracing the stolen money move faster than the protocol that lost it, who's actually running the incident response?_

  
### Two Years Naked

  

_The mechanism itself sounds almost too simple to justify a nine million dollar exploit._


**[Supra's pull oracle lets anyone submit a price update](https://supra.com/news/security-incident-report-hedera-pull-oracle-verifier/), provided the accompanying proof passes a BLS signature check run through Hedera's pairing precompile.**  
  
[The attacker referenced a committee ID that sat outside the range](https://supra.com/news/security-incident-report-hedera-pull-oracle-verifier/) Supra had populated.  
  
[Instead of rejecting that reference](https://supra.com/news/security-incident-report-hedera-pull-oracle-verifier/), the lookup quietly returned a public key of all zeros. Pair a zero signature with a zero key and the equation holds automatically, because both are the BLS identity element.  
  
The precompile did its job and answered correctly. The verifier's job was to reject exactly that kind of degenerate input before it ever reached the precompile, and it never did.

  
**[Supra's own postmortem is candid about the fix](https://supra.com/news/security-incident-report-hedera-pull-oracle-verifier/), three separate checks now stand where zero once stood, range validation on the committee lookup, rejection of identity element keys and signatures, and on curve validation before anything reaches the pairing check.**  
  
_**[Supra states it plainly](https://supra.com/news/security-incident-report-hedera-pull-oracle-verifier/):** "The identity-element check alone would have prevented this attack."_

  
What makes this story different is what came after the technical writeup.

[Joshua Tobkin, Supra's co-founder and CEO, posted directly to the hacker, or hackers, responsible](https://x.com/JoshuaTobkin/status/2076630890017587515), and buried inside that negotiation sits the detail that reframes the entire incident.  
  
_[The flawed verifier had been live](https://x.com/JoshuaTobkin/status/2076630890017587515), unpatched, fully on-chain and visible to anyone, for two years._  
  
**"[Live. Transparent. For two years straight](https://x.com/JoshuaTobkin/status/2076630890017587515)," he wrote, through an entire bull market, before landing on the line that will get quoted for a while, "[Anyone could have found it. Nobody did. Not until now](https://x.com/JoshuaTobkin/status/2076630890017587515)."**

  
[His theory for why now](https://x.com/JoshuaTobkin/status/2076630890017587515), after two years of silence, is AI.  
  
[Tobkin frames it as a new class of adversary](https://x.com/JoshuaTobkin/status/2076630890017587515), one that "reads every line, every branch, every edge case," a tireless auditor human reviewers never had to compete with before.  
  
**Whether or not this specific exploit came from an AI assisted search, [the claim itself](https://x.com/JoshuaTobkin/status/2076630890017587515) says something uncomfortable out loud, every protocol audited by a human team was audited against a threat model that may no longer exists.**

  
_A blind spot sat in plain sight for two years. Where did the nine million dollars it eventually produced actually end up?_

  
### Naked Negotiation  
  

_Money doesn't sit still after an exploit like this, it runs._  
  
**And run it did: within minutes, [a chunk of the loot was already crossing chains off Hedera via LayerZero](https://x.com/SpecterAnalyst/status/2075852579343303121), with [Stargate as the bridge QuillAudits named, hitting Arbitrum, Base, and Ethereum along the way](https://x.com/QuillAudits_AI/status/2075961122172387774).**  
  
By the time it settled, [the receiving wallet held roughly $5.25 million, close to 2,360 ETH and 15.58 WBTC](https://x.com/0x3b33/status/2076194776324481033), WBTC and stablecoins swapped down into ETH as it moved, before most people had finished their coffee.  
  
[Peckshield highlighted that the same wallet had been seeded ten hours earlier with a single ETH sent from Tornado Cash](https://x.com/PeckShieldAlert/status/2075867053408629179), the kind of detail that tells you this wasn't anyone's first attempt at this.  
  

Here’s the trail it left behind, from the forged attestation to the wallets and contracts that carried the rest of the story.  
  

**The forged attestation itself - [Committee ID referenced in the fraudulent submission](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit):** 2

  
Different from a transaction hash, this is the message root the forged signature was supposed to correspond to.  
  
**Committee hash, [the message root the forged signature was supposed to correspond to](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit):** 0xd4e6b48aef731cc8cd74b25fbaec267ff8a6269aea1f4be4ee19dda5ecbf3f7f

  
**[Oracle pair targeted](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit):** 425, SAUCE / wHBAR

  
_Transaction hashes are as follows…_  
  
**The first is the Hedera transaction ID; the second is the EVM-compatible hash for the same Hedera transaction.**

  
**Manipulated price update:**  
  
**Hedera Transaction ID:**  
[0.0.995584-1783731093-686041919](https://hashscan.io/mainnet/transaction/0.0.995584-1783731093-686041919)  
  
**[EVM-compatible Hash](https://hashscan.io/mainnet/transaction/0.0.995584-1783731093-686041919):**  
0xd50c55e24eb8483ec55bf74e84fc9853d0f0fe36f64abdb812a2d9afa2a10a60

  
**SAUCE collateral deposit:**
[1783730393.018023002](https://hashscan.io/mainnet/transaction/1783730393.018023002)

  
**USDC drain:**
[1783731107.330069002](https://hashscan.io/mainnet/transaction/1783731107.330069002)

  
**WHBAR drain:**
[1783731117.865661002](https://hashscan.io/mainnet/transaction/1783731117.865661002)

  
_Wallets and accounts are as follows…_

  
**Wallet A, primary attacker’s Hedera Account:**  
[0.0.10633526](https://hashscan.io/mainnet/account/0.0.10633526)

**Wallet A, primary attacker’s EVM Alias:**  
[0x9a4966152f6e10b33cb7a37975e8619816d6a494](https://etherscan.io/address/0x9A4966152F6e10b33Cb7a37975e8619816d6a494)

  
**Wallet A, linked EVM address used once funds bridged over to Ethereum:** [0xaf20D792A19fD42dCf697ceBa6100291D96dD93e](https://etherscan.io/address/0xaf20D792A19fD42dCf697ceBa6100291D96dD93e)

  
**Wallet B, the self identified white hat responder, Hedera account:**  
[0.0.683607](https://hashscan.io/mainnet/account/0.0.683607)

  
_Contracts are as follows…_

  
**Supra pull oracle:**  
[0.0.4323024](https://hashscan.io/mainnet/contract/0.0.4323024)

  
**Supra verifier, requireHashVerified_V2, where the flaw actually lived:**  
[0.0.4323006](https://hashscan.io/mainnet/contract/0.0.4323006)

  
**Hedera pairing precompile, [system contract](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit):** 0.0.8

  
**Bonzo LendingPool proxy:**  
[0.0.7308459](https://hashscan.io/mainnet/contract/0.0.7308459)

  
**Bonzo SupraOracle adapter (Bonzo-owned integration code):**  
[0.0.7308480](https://hashscan.io/mainnet/contract/0.0.7308480)

  
Every one of those identifiers is public. Anyone can pull them up on HashScan or Etherscan  
right now, and still, as of this writing, nobody has put a name to the wallet holding the money.

  
[That's the backdrop Joshua Tobkin negotiated against](https://x.com/JoshuaTobkin/status/2076630890017587515), in public, on Twitter, addressed directly to the person or people who did this.  
  
_[The terms were blunt.](https://x.com/JoshuaTobkin/status/2076630890017587515) Keep $100,000, return the rest, walk away with no charges and a guaranteed job offer. Refuse, and the bounty on your head grows ten percent a year, forever, payable to whoever eventually turns you in._  
  
**[Seventy two hours](https://x.com/JoshuaTobkin/status/2076630890017587515), one wallet, built specifically to receive it.**  
  

**Supra's return address:**  
[0x913BDd807608DEA920C689a7c3222E94e07551cC](https://etherscan.io/address/0x913bdd807608dea920c689a7c3222e94e07551cc)

  
Whether that address ever receives a cent is a separate question from whether it should exist at all.  
  
A standing bounty is not the same thing as a recovered dollar, and right now Bonzo's principal, [Wallet B's promised return included](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit), is still just a number on a spreadsheet somewhere.

  
**A nine million dollar loss sounds like a story with a bounty on it, until you remember no one has actually recovered the money.**  
  
_Was that offer built to recover funds, or to buy time?_

  
### Wrong Contract Audited  
  
_Bonzo did what a lending protocol is supposed to do._

**[Halborn's name sits against its lending contracts](https://docs.bonzo.finance/hub/security-and-risk/protocol-audits), its liquidity incentives, its staking module, its LayerZero bridge connector, and its vaults, and none of those reports point to Bonzo's own code as the cause.**  
  
The protocol's own documentation leans on that same diligence too, with [Chainlink and Supra](https://docs.bonzo.finance/hub/developer/oracles) as the two named providers, though [SAUCE and wHBAR relied on Supra alone](https://docs.bonzo.finance/hub/developer/oracles/supra).  
  
[Chainlink's integration covers HBAR and USDC](https://bonzo.finance/blog/bonzo-finance-has-integrated-the-chainlink-standard-for-verifiable-data-on-hedera), nothing tied to the pair that was hit. Redundancy works exactly until the asset that gets hit turns out to be the one nobody doubled up on.

Bonzo does have a scope document, and it turns out to be more damning than having none at all.  
  
_[The company's own bug bounty program lists exactly what's covered](https://docs.bonzo.finance/hub/developer/bug-bounty), its lending contracts, its vaults, its staking module, and just as precisely, what isn't, "[Out of scope: third-party contracts not directly associated with Bonzo Finance](https://docs.bonzo.finance/hub/developer/bug-bounty)."_ 
  
**Supra's verifier is exactly that, a contract Bonzo depends on and reads from but never owned, so by Bonzo's own written policy, [nobody would be paid for finding a bug in it](https://docs.bonzo.finance/hub/developer/bug-bounty).**

Supra's own paper trail is stranger still, because there's no audit scope for the contract that failed, not even one that carves it out.

[The one named audit of Supra's oracle work on record is a MoveBit report from years before the exploit](https://movebit.xyz/reports/Supra-Smart-Contract-Audit-Report.pdf), scoped to Supra's Aptos contracts, written in Move, running on an entirely different chain.  
  
[The Hedera pairing check that actually failed](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit), requireHashVerified_V2, [never shows up in it](https://movebit.xyz/reports/Supra-Smart-Contract-Audit-Report.pdf), because it was never in scope. Not carved out. Never there in the first place.

_[Tobkin said the bug sat live and visible for two years](https://x.com/JoshuaTobkin/status/2076630890017587515), missed by every reviewer in the world._  
  
**That claim gets a lot easier to believe once you notice there's no record of any reviewer, anywhere, ever actually looking at that piece of code.**  
  
[His own metaphor](https://x.com/JoshuaTobkin/status/2076630890017587515) explains the section title better than anything we could add on top.  
  
[Being a founder in DeFi](https://x.com/JoshuaTobkin/status/2076630890017587515), he wrote, feels like the nightmare of “showing up to school naked,” and this exploit made it literal: “we’re all naked in the hallway now.”  
  
**[Buried further down](https://x.com/JoshuaTobkin/status/2076630890017587515), almost in passing, is the line that belongs here most of all:** Supra had “recently started” formal verification work, which he called “ironic,” given what had just happened.  
  
**Bonzo wrote a policy that excluded this dependency on purpose. Supra, by its own CEO’s account, had not yet formally verified it.**

_Being out of scope on paper is one failure. Never having a scope document for the contract that mattered is a different one entirely, which is worse?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)







_Zero equals zero, and that one equation will outlast every headline this exploit generated._

**[Nine million dollars was extracted](https://bonzo.finance/blog/bonzo-lend-incident-report-oracle-provider-exploit) because [a verifier trusted a correct answer to the wrong question](https://supra.com/news/security-incident-report-hedera-pull-oracle-verifier/).**  
  
[Three checks would have stopped it](https://supra.com/news/security-incident-report-hedera-pull-oracle-verifier/), all added too late. Instead the flaw sat exposed for two years, missed by human reviewers, and [it took something faster than a human, by the Supra CEO's own account, to finally find it](https://x.com/JoshuaTobkin/status/2076630890017587515).

[The stolen funds crossed three chains and a mixer](https://x.com/QuillAudits_AI/status/2075961122172387774) before anyone could put a name to a wallet, and [a bounty now stands in place of an actual recovery](https://x.com/JoshuaTobkin/status/2076630890017587515).

[Bonzo's contracts passed every audit thrown at them](https://docs.bonzo.finance/hub/security-and-risk/protocol-audits), and none of that mattered, because the number they were handed was a lie, not the logic that processed it.  
  
**Every protocol still running on someone else's verifier is quietly betting its own two year old blind spot hasn't been found yet either.**  
  

_If checking for zero was the entire fix, what else out there is everyone still assuming was never zero?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
