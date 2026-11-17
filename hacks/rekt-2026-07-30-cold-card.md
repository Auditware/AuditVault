---
tags:
  - blockchain/bitcoin
  - blockchain/ethereum
  - blockchain/solana
  - web3-sector/dex
  - web3-sector/governance
  - web3-sector/privacy
  - precondition/insider
  - type/hack
  - vector/social-engineering
title: "Cold Card - Rekt"
protocol: "Cold Card"
date: 2026-07-30
loss_usd: 130000000
audit: "N/A"
source: "https://rekt.news/coldcard-rekt"
excerpt: "A firmware vulnerability silently routed Coldcard's hardware RNG for a guessable software fallback, letting attackers brute-force seeds offline. No phishing, no malware. $130 million reported stolen s"---
# Cold Card - Rekt

> **Loss:** $130,000,000 | **Date:** 2026-07-30 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/coldcard-rekt-header.png)




_Offline was supposed to mean untouchable._  
  
**Coldcard hardware wallets sign every transaction in a sealed environment, keeping private keys away from anything an attacker could reach over a network.**  
  
[That promise sat undisturbed for more than five years](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware), while a firmware bug quietly made every wallet's seed reproducible from a narrow, guessable set of device and timing states.  
  
[A build error swapped genuine hardware randomness for a predictable software substitute](https://decrypt.co/374916/coldcard-bitcoin-exploit-explained-entropy-keys-bits), shrinking the odds of guessing a wallet's seed from cosmic to countable.  
  
[No phishing link, no malware, no stolen device](https://decrypt.co/374916/coldcard-bitcoin-exploit-explained-entropy-keys-bits), attackers ran the numbers on their own machines, derived candidate addresses, and matched them against the public blockchain; the private key came free the moment a match hit.  
  
**[Galaxy Research estimates the theft may have reached roughly 2,055 BTC, around $130 million and counting, as investigators continue to identify affected wallets](https://www.galaxy.com/insights/research/coldcard-hardware-wallet-hack-bitcoin-resilience-ethereum-solana-inflation-proposals), drained from thousands of wallets whose owners did everything self-custody preaches.**

_When the lock was manufactured to open for anyone willing to do the math, was it ever actually locked?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Block Engineering Blog](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware), [decrypt](https://decrypt.co/374916/coldcard-bitcoin-exploit-explained-entropy-keys-bits), [Galaxy Research](https://www.galaxy.com/insights/research/coldcard-hardware-wallet-hack-bitcoin-resilience-ethereum-solana-inflation-proposals), [TechCrunch](https://techcrunch.com/2026/08/04/hackers-steal-over-130-million-by-exploiting-bug-in-offline-hardware-wallets/), [Block's Engineering Blog](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware), [Coinkite](https://blog.coinkite.com/coldcard-mk3-seed-generation-warning/), [nvk](https://x.com/nvk/status/2083216713693151552), [Literatecode](http://www.literatecode.com/yasmarang), [Alex Thorn](https://x.com/intangiblecoins/status/2084079706320646300), [TRM Labs](https://www.trmlabs.com/resources/blog/the-largest-hardware-wallet-exploit-of-2026-inside-the-usd-116-million-coldcard-hack), [Thomas Braziel](https://x.com/Bkclaims/status/2083589981713428977?s=20), [Cris Carrascosa](https://x.com/CarrascosaCris_/status/2083456473032503597?s=20), [Criptolawyer](https://x.com/criptolawyer/status/2083964551364579407)_

**[Coldcard owners noticed first, the way victims usually do](https://techcrunch.com/2026/08/04/hackers-steal-over-130-million-by-exploiting-bug-in-offline-hardware-wallets/): Funds gone, no transaction they remembered signing.**  
  
On July 30th, [between 01:10:20 and 01:51:26 UTC, 1,196 addresses were drained for 1,082.65 BTC](https://x.com/glxyresearch/status/2083181683067506899), across blocks 960,183 through 960,191.

[Block's Engineering team started digging the same day](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware), working from user reports rather than a scanner that caught it first.  
  
[The team identified a pattern in the sweeps](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware); Galaxy Research [used that footprint to map the flow the following day](https://x.com/glxyresearch/status/2083181683067506899), [tracing 1,082.65 BTC](https://x.com/glxyresearch/status/2083181683067506899), roughly $70 million at the time, from the addresses it flagged.  
  

_[Coinkite’s preliminary advisory landed the same day](https://blog.coinkite.com/coldcard-mk3-seed-generation-warning/), warning Mk3 owners whose seeds had been generated on firmware 4.0.1 through 4.1.9._

  
**NVK, Coinkite's CEO, [posted a public apology the next morning](https://x.com/nvk/status/2083216713693151552), taking responsibility for the firmware failure and urging affected users to move funds to newly generated seeds.**  
  
A firmware update alone wouldn't fix it, [Coinkite later clarified](https://blog.coinkite.com/update-sunday/), seeds generated before the patch needed to be replaced outright, not simply updated.

That was the easy part. The number would not hold still.

By August 3rd, [Galaxy Research said losses from the Coldcard hack had exceeded $100 million](https://x.com/glxyresearch/status/2084411904924045370).  
  
_Its high-confidence tally was [1,596 BTC stolen from roughly 7,300 addresses across three confirmed waves and 14 smaller incidents](https://x.com/glxyresearch/status/2084411904924045370)._

**[Galaxy had also identified a potential fourth wave but excluded it from the high-confidence tally](https://x.com/glxyresearch/status/2084411915745595527), because it lacked sufficient victim confirmation.**  
  
At the time, including that unconfirmed activity would have raised its candidate-inclusive estimate to [roughly 2,055 BTC, or about $130 million](https://x.com/glxyresearch/status/2084411915745595527).

[Galaxy Research was then tracking more than 25 separate attack patterns](https://x.com/glxyresearch/status/2085748519625707727), well beyond the three major waves that had defined its earlier public accounting.

Galaxy said it was still vetting additional coins and [expected total losses to exceed $130 million](https://x.com/glxyresearch/status/2085748513015488758).  
  
_Its outstanding candidate cases [could lift the total above 2,300 BTC if ultimately confirmed](https://x.com/glxyresearch/status/2085748538172944787)._  
  
**If confirmed, this would push the amount stolen to roughly $145 million and counting…**

This was not an exchange breach with a single balance sheet or a complete, centrally maintained list of affected accounts.  
  
Investigators instead had to construct estimates from on-chain patterns and victim reports.  
  
By August 7th, the [Head of Firmwide Research at Galaxy, Alex Thorn](https://x.com/intangiblecoins), had [received more than 250 reported cases](https://x.com/glxyresearch/status/2085748513015488758).

**Each new victim report helped clarify the shape of a theft that the blockchain could reveal only in pieces.**

_When the people tracing your stolen coins can see the pattern but not always the owner, what exactly are you supposed to trust, the number, or the silence underneath it?_  
  
### Defined, Not Enabled

_[Coldcard’s intended design was to rely exclusively on its hardware TRNG for seed generation](https://blog.coinkite.com/adding-to-public-record/), with no software fallback._ 
  
**It did not become part of COLDCARD’s seed-generation path [until the libNgU migration in March 2021](https://blog.coinkite.com/adding-to-public-record/).**  
  
[LibNgU stands for "Number Go Up,"](https://github.com/switck/libngu) literally, per the library's own README.  
  
After the migration, the number going up wasn't the price. It was the number of wallets an attacker could reproduce.

The guard that was supposed to catch this looked correct on paper. Libngu's code checked whether a setting called [MICROPY_HW_ENABLE_RNG was defined before compiling](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware).  
  
_Coldcard’s board configuration [did define MICROPY_HW_ENABLE_RNG as zero because Coldcard provided a separate hardware-RNG wrapper](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware)._

**But [#ifndef verifies only that a macro exists; it does not reject a macro whose value is zero](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware).**  
  
Libngu referenced rng_get(), [but Coldcard’s board-local hardware-RNG implementation did not export that symbol](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware).  
  
[It instead exposed random32() and random_buffer()](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware), leaving MicroPython’s own rng_get() implementation to satisfy the reference.

Because the macro’s value was zero, MicroPython selected its [Yasmarang software fallback rather than its STM32 hardware-RNG implementation](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware).

**[Yasmarang is a deterministic](http://www.literatecode.com/yasmarang), non-cryptographic pseudo-random generator.**  
  
_**Once MicroPython’s software path was selected, [it seeded Yasmarang from device state rather than fresh hardware entropy](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware):** The low 32 bits of the chip’s fixed UID, XORed with the current SysTick counter, then mixed with values from two real-time-clock registers._

**None of those inputs is a cryptographic secret, and none refreshes mid-stream:** Once an attacker knows or narrows the boot-time state, the entire output becomes reproducible.  
  
Libngu then XORs that stream against a second, internal Yasmarang generator seeded from [four constants hardcoded directly into the public source code](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware).  
  
Combining two predictable streams doesn't add uncertainty; it just relocates it.

_The change reached [released firmware on March 17, 2021, with v4.0.0](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware)._  
  
**[Every Mk2 and Mk3 seed generated with firmware v4.0.0 through v4.1.9](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware), followed a vulnerable path with no secure reseed.**  
  
With no later injection of independent entropy, the only question was how many plausible starting states an attacker would need to test. That uncertainty is what the estimates express in bits: each additional bit doubles the number of candidate states.  
  
[Coinkite's own public estimate puts the resulting search space at roughly 40 bits](https://blog.coinkite.com/entropy-technical-backgrounder/); that figure describes the best case for defenders, assuming an attacker can't pin down the timer state.  
  
**[Block’s technical analysis explains the limiting case](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware):** If an attacker knows the relevant device UID, timer state, and RNG-call history, wallet generation is deterministic, 2^0 candidates, or one possible output stream.

_**[Mk4, Q, and Mk5 fared only marginally better](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware):** A later reseed added some uncertainty, but only 32 bits of that reseed reached the generator’s internal state._

**[Every production firmware release across all three lines carried the weakness](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware) until the post-disclosure fix.**  
  
A 2022 change added entropy [from Coldcard’s secure elements to the fallback generator’s state](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware).  
  
But the reseed path [retained only four bytes of that material and overwrote only one of Yasmarang’s four 32-bit state words](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware).  
  
**Once the fallback state and call history are fixed, [at most 2^32 securely distinguished output streams remain, with an average brute-force cost of approximately 2^31 candidate trials](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware).**

[Coinkite said the added secure-element entropy materially improved the position of Mk4, Q, and Mk5](https://blog.coinkite.com/entropy-technical-backgrounder/). Under its then-current attack assumptions, it estimated their effective search space at roughly 72 bits, compared with roughly 40 bits for Mk2 and Mk3.

_**[Block’s analysis supplies the important qualification](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware):** The timer inputs are correlated, potentially observable, and may occupy much narrower ranges than a broad search-space estimate assumes._  
  
[The secure-element reseed adds no more than 32 bits of fresh uncertainty to the generator’s state](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware); if an attacker can reconstruct the earlier fallback state and call history, the remaining search is limited to the possible reseed values.

[Coinkite attributed the defect’s survival to a boundary between unrelated submodules](https://blog.coinkite.com/adding-to-public-record/), rather than an error in the cryptographic or Bitcoin-specific code most directly reviewed.  
  
[In Block Engineering’s technical reconstruction](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware), [libngu referenced rng_get()](https://engineering.block.xyz/blog/predictable-rng-fallback-and-32-bit-reseed-in-coldcard-firmware), Coldcard exposed differently named hardware-RNG functions, and MicroPython’s own rng_get() implementation satisfied that reference.  
  
**The failure emerged at the point where those components met.**

_If a check that confirms only a setting’s existence can silently defeat the intended check on its value, how many other systems described as “secure by design” depend on the same unexamined seam?_

### No Funnel, At First  
  

_**Every sweep in this exploit carried the same underlying signal:** Mechanical, not personal._  
  
**[Wave 1 drained 1,196 addresses in full for 1,082.65 BTC within 41 minutes](https://x.com/glxyresearch/status/2083181683067506899). Galaxy categorized the victims as 1,183 native-SegWit BIP84 addresses, seven BIP49 addresses, and six BIP44 addresses.**  
  
The breadth of those simultaneous sweeps was [“consistent with multi-path key scanning,” Galaxy said](https://x.com/glxyresearch/status/2083181683067506899).  
  
The identical fee and no-change-output pattern likewise looked, in Galaxy’s assessment, like [“an automated tool spending keys it already held,” rather than owners moving funds](https://x.com/glxyresearch/status/2083181683067506899).

_[Galaxy’s transaction fingerprinting](https://x.com/glxyresearch/status/2083560940469981591) reinforced that reading._  
  
**[Every Wave 1 sweep paid an identical hardcoded 30.0 sat/vByte fee](https://x.com/glxyresearch/status/2083560949475053782), [30 to 75 times the weekly median](https://x.com/glxyresearch/status/2083181683067506899), and left no change output.**  
  
[Galaxy said the pattern looked like “an automated tool spending keys it already held,”](https://x.com/glxyresearch/status/2083181683067506899) rather than owners moving funds.  
  
Wave 2 arrived the next day, [and used mostly 10 and 50 sat/vByte fees](https://x.com/glxyresearch/status/2083560949475053782).  
  
[Galaxy said Waves 1 and 2 shared the same funnel topology into a handful of collectors](https://x.com/glxyresearch/status/2083623511126638642), the same P2WPKH destinations, and the same mix of derivation paths, 27 hours apart. [It said treating them as one operator was reasonable,](https://x.com/glxyresearch/status/2083623511126638642) but rested on resemblance rather than proof.

_**[Wave 3 complicated that picture](https://x.com/glxyresearch/status/2083623500183421043):** Another 207.7294 BTC was drained, lifting Galaxy’s observed total to 1,367.05 BTC across 4,585 addresses._  
  
**Unlike the first two waves, which funneled funds into a handful of shared P2WPKH collector addresses, [Wave 3 used 293 separate P2WSH vaults](https://x.com/glxyresearch/status/2083623556542349552).**  
  
**[Galaxy left the attribution question open](https://x.com/glxyresearch/status/2083623511126638642):** It could have represented the same attacker changing methods, or a separate operator using the same vulnerability.

By August 2, [researchers were tracking a suspected fourth wave in real time](https://x.com/intangiblecoins/status/2084079706320646300).

[Alex Thorn, Head of Firmwide Research at Galaxy, reported 218 transactions from 462 victim addresses](https://x.com/intangiblecoins/status/2084079706320646300), moving 388.92748828 BTC in roughly 2.5 hours.  
  
**[The transactions used 216 destination addresses](https://x.com/intangiblecoins/status/2084079706320646300), of which [Thorn later corrected the count to 210 newly created addresses](https://x.com/intangiblecoins/status/2084092241153323173), and ran at [about 45 times the sweep rate of a pre-incident control period](https://x.com/intangiblecoins/status/2084092241153323173).**  
  
_**[The topology was essentially one-to-one](https://x.com/intangiblecoins/status/2084079706320646300):** One destination for each victim, with only one destination receiving two sweeps. There was no collector funnel, only a broad distribution of freshly created receiving addresses._  
  
By August 4, [Alex Thorn said at least 15 separate attackers were exploiting the flaw](https://x.com/intangiblecoins/status/2084584185528746434). He also said every wave after the first had been identified through victim reports.  
  
As the investigation expanded, [Galaxy said it was providing confirmed attacker and victim addresses to U.S. federal law-enforcement authorities, crypto exchanges, and compliance and cyber-investigation groups](https://x.com/glxyresearch/status/2084411918861652194).  
  

Yet by its August 3 update, most of the stolen Bitcoin still had not moved. [Galaxy said 90% of the coins remained unmoved, including every coin taken in Waves 1 through 3.](https://x.com/glxyresearch/status/2084411918861652194)

_What laundering did occur was limited. On August 4, [64.9 BTC entered Wasabi and 200 ETH was deposited into Tornado Cash](https://www.trmlabs.com/resources/blog/the-largest-hardware-wallet-exploit-of-2026-inside-the-usd-116-million-coldcard-hack)._  
  
**[TRM Labs said most victim funds had pooled in a small number of attacker-controlled addresses](https://www.trmlabs.com/resources/blog/the-largest-hardware-wallet-exploit-of-2026-inside-the-usd-116-million-coldcard-hack) with limited onward movement.**  
  
When funds moved beyond their initial receiving address, [TRM observed only a further consolidation hop](https://www.trmlabs.com/resources/blog/the-largest-hardware-wallet-exploit-of-2026-inside-the-usd-116-million-coldcard-hack), not layering or sustained mixing, and said the pattern could indicate operators still working out how to move such visible proceeds.  
  
[It contrasted that behavior with North Korea-linked TraderTraitor operators](https://www.trmlabs.com/resources/blog/the-largest-hardware-wallet-exploit-of-2026-inside-the-usd-116-million-coldcard-hack), which it said often begin aggressive laundering within hours or days.

[TRM did not publicly attribute the theft to a specific actor](https://www.trmlabs.com/resources/blog/the-largest-hardware-wallet-exploit-of-2026-inside-the-usd-116-million-coldcard-hack), noting that differences in transaction construction across the waves suggested multiple attackers may be involved.  
  
**As of Galaxy’s August 3 update, researchers could identify many of the relevant addresses and follow their balances on-chain, but not establish who controlled them.**  
  
_When most of the money is sitting in plain sight, barely moved and only minimally laundered, what exactly is everyone waiting for?_

### The Price of a Disclaimer

_Coinkite's technical response moved fast._  
  
**By August 2nd, [the company had destroyed its remaining Coldcard inventory built on vulnerable firmware, halted shipments](https://blog.coinkite.com/update-sunday/), and released patched firmware intended to prevent the flaw in newly generated seeds.**  
  
**[What the patch cannot do, Coinkite was explicit about](https://blog.coinkite.com/update-sunday/):** Repair a seed that already exists.  
  
[Anyone who generated one on the affected firmware has to create a new seed](https://blog.coinkite.com/update-sunday/) and move their funds, full stop.  
  
**[The company's own suggestion for anyone who needed a wallet sooner than Coinkite could ship one](https://blog.coinkite.com/update-sunday/):** Bitkey, Ledger, Trezor, Jade, or BitBox, a direct pointer to its own competitors.

_[Coinkite's August 4th public statement added an uncomfortable footnote to the AI conversation the exploit had already started](https://blog.coinkite.com/adding-to-public-record/). The company said pre-incident AI-assisted review of its own codebase had not caught the flaw, and that post-incident testing against Kimi K3, Claude Fable, and Codex 5.6 didn't catch it either._

**[As of Coinkite's August 7th public update](https://blog.coinkite.com/update-on-customer-data-retention/), the company had not publicly announced a compensation fund. [The closest it came to the word appeared in its own Sunday post](https://blog.coinkite.com/update-sunday/), thanking the volunteers who'd spent the weekend helping victims move funds "selflessly, and without compensation," a description of the community's effort, not the company's.**

On August 7th, [Coinkite suspended its standard practice of blanking most customer records after 120 days](https://blog.coinkite.com/update-on-customer-data-retention/).  
  
[A company whose standard practice was to minimize what it retained on customers](https://blog.coinkite.com/update-on-customer-data-retention/), announced [it would be preserving records otherwise scheduled for blanking until further notice, because legal proceedings may require them](https://blog.coinkite.com/update-on-customer-data-retention/).

Legal interest followed quickly. [Thomas Braziel’s 117 Partners was gathering information from Coldcard victims worldwide while assessing potential product-liability](https://x.com/Bkclaims/status/2083589981713428977?s=20), class or group litigation, and asset-recovery options.  
  
_No lawsuit had been filed at that point._  
  
**[Cris Carrascosa, legal counsel at ATH21, said Coldcard had “zero regulatory responsibility” over the funds of users of its products](https://x.com/CarrascosaCris_/status/2083456473032503597?s=20). She added that a CASP would have had a legal obligation to reimburse users, but that any lawsuits against Coldcard would be “terribly difficult” because claimants would have to prove the company could have foreseen the hack.**  
  
**[Criptolawyer, Blend’s head of institutional business development, offered a different legal view](https://x.com/criptolawyer/status/2083964551364579407):** Victims had no automatic right to recover every satoshi, she wrote, but Coldcard’s security promises, the seed-generation defect, and the resulting losses provided “a credible legal basis to investigate responsibility,” including defect and professional-negligence theories.

Whatever theory a claimant chose, [Coinkite's own terms of sale would be waiting](https://coinkite.com/terms).  
  
[Products are sold “as is”; aggregate direct damages are capped at the purchase price Coinkite received for the device](https://coinkite.com/terms), excluding shipping and taxes; consequential, incidental, indirect, special, punitive, and other listed damages are excluded; and any legal proceeding brought by a user must be filed within one year of the event at issue.  
  
[At Coinkite’s sole option, disputes may be required to proceed through final and binding arbitration in Toronto](https://coinkite.com/terms), under a class-action waiver.  
  
**None of that guarantees enforceability. It sharply narrows the route victims would have to travel to test it.**

_When the fine print does more to protect a company than the firmware it shipped, what exactly did anyone pay for?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






_Coldcard sold five years of silence as security._  
  
**The firmware never announced it was broken, the wallets never behaved strangely, and the seeds looked exactly like every other seed right up until an attacker actually tried the math.**  
  
[Losses had reached nearly $130 million](https://x.com/glxyresearch/status/2085748513015488758), and counting, [with at least 15 attackers believed to have exploited the flaw](https://x.com/intangiblecoins/status/2084584185528746434).  
  
The investigation remains ongoing, as researchers continue tracing stolen funds and identifying affected wallets. The attackers exploited vulnerable code and a mathematical attack path that were both sitting in public view.  
  
[As of Galaxy's August 3rd update, 90% of the stolen Bitcoin had not moved](https://x.com/glxyresearch/status/2084411918861652194), and no actor has been publicly attributed to the theft.  
  
_[Coinkite patched the bug, destroyed vulnerable inventory, and pointed victims toward its own competitors](https://blog.coinkite.com/update-sunday/), but the fine print in [its terms of sale](https://coinkite.com/terms) was doing more to protect the company than the firmware ever did for its customers._  
  
**[Even AI-assisted code review walked past the flaw](https://blog.coinkite.com/adding-to-public-record/), before the exploit and after, on a library whose own name promised the wrong kind of number would go up.**  
  
[Three more models were tested against the same code after the incident](https://blog.coinkite.com/adding-to-public-record/). Three more missed it.  
  
[If AI-assisted review missed a known flaw even after the fact](https://blog.coinkite.com/adding-to-public-record/), what assurance is it actually providing?  
  
**Five years of open-source code, reviewed by humans and tested again by machines after the fact, and the attack itself exposed the flaw.**

_If nobody, human or machine, ever checked whether the lock was actually locked, what exactly did five years of open, reviewable code actually protect?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
