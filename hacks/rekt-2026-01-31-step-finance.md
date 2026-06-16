---
tags:
  - blockchain/solana
  - sector/bridge
  - sector/governance
  - sector/privacy
  - sector/rwa
  - sector/staking
title: "Step Finance - Rekt"
protocol: "[[Step Finance]]"
date: 2026-01-31
loss_usd: 27300000
auditors:
source: "https://rekt.news/step-finance-rekt"
excerpt: "Audited contracts, bug bounties, and security reviews. None of it mattered when an executive's inbox at Step Finance became the attack vector. $27.3 million in SOL unstaked and gone. The smart contrac"
genome:
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[reward-accounting]]"
---
# Step Finance - Rekt

> **Loss:** $27,300,000 | **Date:** 2026-01-31 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/step-finance-rekt-header.png)










_Ninety minutes and one compromised laptop [separated Step Finance from $27.3 million](https://cointelegraph.com/news/step-finance-treasury-breach-solana-step-token-crash)._

**The smart contracts worked flawlessly. The humans didn't.**

Just someone's executive device getting owned by [what the team called](https://x.com/StepFinance_/status/2017667403803410554) "a well known attack vector" - the kind of phrasing that screams phishing email without actually saying it.

**Step Finance had checked all the boxes:** [Audited contracts, bug bounties, public security reviews](https://x.com/rzonsol/status/2018395166118150320), [](https://www.coindesk.com/business/2026/01/31/solana-based-defi-platform-step-finance-hit-by-usd30-million-treasury-hack-as-token-price-craters) a [Solana-focused media outlet](https://cointelegraph.com/news/step-finance-treasury-breach-solana-step-token-crash), and [plans to tokenize equities](https://cointelegraph.com/news/step-finance-treasury-breach-solana-step-token-crash) on Solana.

[261,854 SOL unstaked](https://x.com/certikalert/status/2017610781660217643) and gone before breakfast, leaving their STEP token down 93% and their "front page of Solana" branding aging like milk in the summer sun.

**[CertiK flagged the bleeding](https://x.com/certikalert/status/2017610781660217643) while [Step Finance scrambled for cybersecurity DMs](https://x.com/StepFinance_/status/2017581368226574472), eventually [recovering $4.7 million through Token22 protections](https://x.com/StepFinance_/status/2018379876642804213) - a consolation prize on a $27.3 million education.**

_When your code passes every audit but your executives fail basic email hygiene, what exactly are security reviews protecting?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [CoinTelegraph](https://cointelegraph.com/news/step-finance-treasury-breach-solana-step-token-crash), [StepFinance](https://x.com/StepFinance_/status/2017667403803410554), [Piotr Rzonsowski](https://x.com/rzonsol/status/2018395166118150320), [CertiK](https://x.com/certikalert/status/2017610781660217643), [Chainalysis](https://www.chainalysis.com/blog/crypto-hacking-stolen-funds-2026/), [coingecko](https://www.coingecko.com/en/coins/step-finance), [Remora Markets](https://x.com/RemoraMarkets/status/2017665030461002098), [SolanaFloor](https://solanafloor.com/), [Peckshield](https://x.com/PeckShieldAlert/status/2010960699766563200)_

**January 31st started quietly enough.**

Early morning brought the first public sign of trouble - [Step Finance admitting on X that](https://x.com/StepFinance_/status/2017579514943938646) "there has been a breach of security for some of our treasury wallets hours ago."

The attack had already finished its work while the disclosure was still being drafted.

[Minutes later came the desperate follow-up](https://x.com/StepFinance_/status/2017581368226574472): "We are contacting Cybersecurity firms to assist. Any firms who can assist feel free to slide into DMs."

_By late morning, [the story had evolved into something more palatable for public consumption](https://x.com/StepFinance_/status/2017667403803410554) - "sophisticated actor during APAC hours" executing through "a well known attack vector."_

**Sophisticated actor. Well known attack vector.**  
  
**Translation:** Someone phished an executive and walked away with the treasury.

[CertiK's alert told the real story](https://x.com/certikalert/status/2017610781660217643) - 261,854 SOL had been unstaked after "stake authorization had been transferred" to a fresh wallet. On Solana, unstaking requires direct wallet permissions. No exploit needed when you already have the keys.

**Step Finance wasn't hacked. Step Finance was handed over.**

_If the attackers needed sophisticated techniques, why did basic key compromise work just fine?_  
  
### The Laptop That Ate $27.3 Million

_February 2nd [brought the confession nobody wanted to hear](https://x.com/StepFinance_/status/2018379876642804213)._

**"This was a result of our executive team's devices being compromised."**

Not a zero-day. Not a supply chain attack on some obscure dependency. Not even a rogue insider with a grudge and a hardware wallet.

Executive devices. Plural. Compromised.

_Step Finance built the dashboard. They ran the validator. They [acquired Moose Capital and rebranded it Remora Markets](https://cointelegraph.com/news/step-finance-treasury-breach-solana-step-token-crash) to bring tokenized equities to Solana. They [hosted conferences](https://cointelegraph.com/news/step-finance-treasury-breach-solana-step-token-crash). They [built a media outlet](https://cointelegraph.com/news/step-finance-treasury-breach-solana-step-token-crash)._

**And somewhere along the way, someone on the executive team opened the wrong email, clicked the wrong link, or approved the wrong transaction.**

**[QuillAudits put it plainly](https://x.com/QuillAudits_AI/status/2018300903590391809):** "most likely a social engineering attack."  
  
The 2025 playbook - where [private key compromises drove 88% of Q1 losses](https://www.chainalysis.com/blog/crypto-hacking-stolen-funds-2026/) alone - carried right into 2026 without missing a beat.

[Step Finance had audited contracts, bug bounties and public security reviews](https://x.com/rzonsol/status/2018395166118150320). The kind of security posture that looks great in a pitch deck.

None of it mattered when the attack vector [was a human being with inbox access](https://x.com/StepFinance_/status/2018379876642804213) and signing authority.

**[Piotr Rzonsowski’s incident thread laid out the operational failures with surgical precision](https://x.com/rzonsol/status/2018395166118150320):** Weak key management, insufficient access controls, no monitoring during off-hours, single points of failure.

**[Piotr’s full writeup sharpened the knife](https://rzonsol.pl/blog/2026-02-02-step-finance-hack-postmortem):** "Step Finance's hack is a reminder that security is a chain, and chains break at the weakest link."

Step Finance learned this lesson at a $27.3 million tuition rate - though they managed to claw back $4.7 million through Token22's built-in security protections on Remora assets.

**The keys walked out the door. The SOL followed.**

_Where exactly did those 261,854 SOL go after the executive laptops gave up the keys?_  
  
### Following the Breadcrumbs

_[CertiK's on-chain analysis](https://x.com/certikalert/status/2017610781660217643) painted a clean picture of the heist mechanics._

  
**Stake authorization got transferred to a fresh wallet address:**
[LEP1uHXcWbFEPwQgkeFzdhW2ykgZY6e9Dz8Yro6SdNu](https://solscan.io/account/LEP1uHXcWbFEPwQgkeFzdhW2ykgZY6e9Dz8Yro6SdNu)

  
From there, the unstaking began. 261,854 SOL - worth $27.3 million - methodically pulled from Step Finance's treasury and fee wallets.  
  
**Unstaking Transaction:**
[5EeXqPQci3ZnbFGWPJf622cLqLGnMuNcAr1rDGCizKRFt9owawCzovNpBC4xNh7A4a5p7Qkvsg8nPaYmw3MiYCvF](https://solscan.io/tx/5EeXqPQci3ZnbFGWPJf622cLqLGnMuNcAr1rDGCizKRFt9owawCzovNpBC4xNh7A4a5p7Qkvsg8nPaYmw3MiYCvF)Then came the main event.  
  
**Key withdrawal transaction (261,932 SOL):**
[4Ly35PsVTBNPVibpDRww6FC43pU5Tuw6UtaKECzcLKXtWTPyyvw1dw8LoNRLBDMgQUP81nN69mhiAEDJvzL8X317](https://solscan.io/tx/4Ly35PsVTBNPVibpDRww6FC43pU5Tuw6UtaKECzcLKXtWTPyyvw1dw8LoNRLBDMgQUP81nN69mhiAEDJvzL8X317)

  
The operation wasn't a solo act.

  
**A secondary wallet joined the party:**
[7raxiejD8hDUH1wyYWFDPrEuHiLUjJ4RiZi2z1u2udNh ](https://solscan.io/account/7raxiejD8hDUH1wyYWFDPrEuHiLUjJ4RiZi2z1u2udNh)

_[QuillAudits confirmed that the majority of stolen funds remain parked in the attacker's accounts](https://x.com/QuillAudits_AI/status/2018300903590391809). Those are currently being held in one of the wallets mentioned, the secondary wallet used in the attack._  
  
**No frantic bridge hopping. No Tornado Cash deposits showing up in the transaction logs yet. Just a patient wallet waiting for the heat to cool.**  
  

The numbers tell different stories depending on who's counting.  
  

[Step Finance claimed "approximately $40M" in losses](https://x.com/StepFinance_/status/2018379876642804213), but on-chain evidence tells a simpler story [of just one theft, 261,932 SOL](https://solscan.io/tx/4Ly35PsVTBNPVibpDRww6FC43pU5Tuw6UtaKECzcLKXtWTPyyvw1dw8LoNRLBDMgQUP81nN69mhiAEDJvzL8X317), roughly $27.3 million at the time of extraction.  
  
The extra $13 million exists only in Step Finance's press release. Maybe they will release a proper post-mortem that reveals the missing link.  
  

Step Finance [managed to recover $3.7 million in Remora assets through Token22's built-in security features, plus another $1 million in other positions](https://x.com/StepFinance_/status/2018379876642804213). A $4.7 million clawback on a ~$27 million drain - roughly the same success rate as finding your car keys after the car's already been stolen.

  

**The [funds sit visible on Solscan](https://solscan.io/account/7raxiejD8hDUH1wyYWFDPrEuHiLUjJ4RiZi2z1u2udNh), public as a billboard, untouchable as smoke.**

  
_What happens to a protocol when its treasury evaporates but its token holders remain?_  
  
### Ninety-Three Percent Down  
  

_STEP didn't crash. [STEP cratered](https://cointelegraph.com/news/step-finance-treasury-breach-solana-step-token-crash)._  
  

**[From $0.023 to $0.001578 in under 24 hours](https://www.coingecko.com/en/coins/step-finance) - a 93.3% nosedive that turned governance tokens into collectible dust.**  
  

Panic selling hit before Step Finance could even finish drafting their first disclosure. By the time "sophisticated actor" and "well known attack vector" made it into the official narrative, the market had already delivered its verdict.  
  

**[Step Finance's response landed February 2nd](https://x.com/StepFinance_/status/2018379876642804213) with the weight of a protocol fighting for survival:**

  
_"At this time, we do not recommend anyone engage with the STEP token until our investigation is complete."_  
  

**Translation:** Don't touch it, we're figuring out if there's anything left to save.  
  

[A pre-exploit snapshot would determine who gets made whole](https://x.com/StepFinance_/status/2018379876642804213) - or at least partially whole - assuming there's a path forward that doesn't involve the word "defunct."  
  

The damage rippled beyond Step's own walls. [Remora Markets](https://x.com/RemoraMarkets/status/2017665030461002098), the tokenized equities platform Step acquired as Moose Capital in late 2024, [found some of its rStocks tangled in the stolen treasury assets](https://x.com/RemoraMarkets/status/2017665030461002098). Step Finance had been Remora's largest liquidity provider - now that relationship was a liability.  
  

[Remora moved quickly to reassure users that all rTokens remained "backed 1:1](https://x.com/RemoraMarkets/status/2018065419945300454) with our broker" while LP activities paused pending system security.  
  
**[The silver lining](https://x.com/RemoraMarkets/status/2018065419945300454):** All Remora rStocks involved in the incident were eventually recovered through Token22's built-in protections.

  

[SolanaFloor](https://solanafloor.com/), [Step's media arm](https://solanafloor.com/pages/about), [kept publishing](https://solanafloor.com/). The Solana Crossroads ([powered by SolanaFloor](https://solanacrossroads.com/faq)) conference remains in the plans for 2026 ([according to their header](https://x.com/SolanaCrossroad)). But the ecosystem that Step Finance had spent years building now carried an asterisk the size of $27.3 million.  
  

The question now is whether Step Finance can beat the odds.  
  

**[Immunefi CEO Mitchell Amador offered the industry's grim prognosis](https://cointelegraph.com/news/hacked-crypto-projects-never-fully-recover):** "Nearly 80% of crypto projects that suffer a major hack fail to fully recover."  
  

**Not because of the money lost. Because of the trust burned.**  
  

_Does Step Finance beat those odds, or does their front page become a memorial page?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






_[Over $4 billion vanished from crypto in 2025](https://x.com/PeckShieldAlert/status/2010960699766563200) - and the culprit wasn't just buggy code._  
  

**Private key compromises accounted for 88% of all Q1 2025 losses [according to Chainalysis](https://www.chainalysis.com/blog/crypto-hacking-stolen-funds-2026/).**  
  
[Wallet compromises drove $1.71 billion in theft during the first half alone](https://deepstrike.io/blog/crypto-hacking-incidents-statistics-2025-losses-trends). The pattern couldn't be clearer: humans remain the industry's most exploitable vulnerability, and the gap is widening.

  
Step Finance added $27.3 million to that ledger not because their smart contracts failed, but because someone's inbox did.  
  

**Audits can verify code. Bug bounties can incentivize white hats. Security reviews can stress-test logic.**  
  
None of it matters when the person holding the keys clicks the wrong link on the wrong morning.  
  

The industry keeps building better locks while attackers simply ask for the keys - and keep getting them.  
  

**Step Finance wasn't the first protocol to learn that lesson at eight-figure tuition rates, and January 2026's $370 million in total losses suggests they won't be the last.**

  
_How many more treasuries need to empty before the industry realizes the biggest vulnerability isn't in the code - it's checking email?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
