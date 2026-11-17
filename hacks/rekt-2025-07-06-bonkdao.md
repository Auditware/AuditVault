---
tags:
  - blockchain/solana
  - web3-sector/gaming
  - web3-sector/governance
  - web3-sector/lending
  - web3-sector/multisig
  - web3-sector/oracle
  - web3-sector/privacy
  - trigger/governance-vote
  - type/hack
  - vector/private-key
title: "BonkDAO - Rekt"
protocol: "BonkDAO"
date: 2025-07-06
loss_usd: 19300000
audit: "N/A"
source: "https://rekt.news/bonkdao-rekt"
excerpt: "$19.3 million drained from BonkDAO in a pure governance attack. An attacker bought 1% of BONK, buried a treasury transfer inside a boring proposal, and passed it with 2.9% turnout. No code broke., no "---
# BonkDAO - Rekt

> **Loss:** $19,300,000 | **Date:** 2025-07-06 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/bonkdao-rekt-header.png)





_Nobody hacked BonkDAO, because nobody needed to._

**On July 6, 2026, an anonymous wallet spent [$4.4 million buying just over one percent of BONK's circulating supply](https://www.coindesk.com/markets/2026/07/07/bonk-faces-usd20-million-treasury-drain-after-attacker-spends-usd4-million-to-pass-malicious-proposal). Then it voted itself the treasury.**

[4.426 trillion BONK](https://x.com/lookonchain/status/2074325873503986103), worth [roughly $19.3 million at the time](https://decrypt.co/372862/solana-meme-coin-bonk-treasury-drained-20-million), [](https://solscan.io/tx/5tPU1srcRcnmibB7KJi2WQ7cK4zuq5iKTMrSCLjq7hvGjuK4KUTmaHfwicixkJa5jZJmp3y98T7r2qecKV5mWw8P) moved out [in one transaction](https://solscan.io/tx/5tPU1srcRcnmibB7KJi2WQ7cK4zuq5iKTMrSCLjq7hvGjuK4KUTmaHfwicixkJa5jZJmp3y98T7r2qecKV5mWw8P), the second the vote closed.

[Seven wallets decided it](https://ethnews.com/bonkdao-20m-treasury-vote/). Eighteen thousand members didn't show up.

[The proposal behind it, "Sowellian BonkDAO](https://www.techtimes.com/articles/319820/20260707/bonkdao-loses-20m-attacker-buys-quorum-44m-bonk.htm)," had been [submitted on June 30](https://x.com/SpecterAnalyst/status/2074469628034629865), dressed as reform, promising to ["rebuild from the ashes,"](https://decrypt.co/372862/solana-meme-coin-bonk-treasury-drained-20-million) a full treasury transfer buried underneath the pitch.  
  

**Nothing here broke. The purchase cleared. The vote counted. Quorum held. The code did exactly what it was told to do.**

  

_When the rules get followed to the letter and the treasury still ends up empty, was this theft, or was this democracy working exactly as designed?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [CoinDesk](https://www.coindesk.com/markets/2026/07/07/bonk-faces-usd20-million-treasury-drain-after-attacker-spends-usd4-million-to-pass-malicious-proposal), [Lookonchain](https://x.com/lookonchain/status/2074325873503986103), [ETHNews](https://ethnews.com/bonkdao-20m-treasury-vote/), [Specter](https://x.com/SpecterAnalyst/status/2074469628034629865), [decrypt](https://decrypt.co/372862/solana-meme-coin-bonk-treasury-drained-20-million), [QuillAudits](https://x.com/QuillAudits_AI/status/2074416524597801319), [Bonk](https://x.com/bonk_inu/status/2074191403781906800), [BIP #76](https://v2.realms.today/dao/84pGFuy1Y27ApK67ApethaPvexeDWA66zNV8gm38TVeQ/proposal/6wR1jdhhJ31bbdRNXva8MxqsgsNLKTxargcdAyZ7FcRj), [Chainalysis](https://x.com/chainalysis/status/2074315262485299686), [Preetam](https://x.com/raopreetam_/status/2074485918145359932), [forklog](https://forklog.com/en/bonkdao-loses-20m-due-to-malicious-proposal/), [Tech Times](https://www.techtimes.com/articles/319820/20260707/bonkdao-loses-20m-attacker-buys-quorum-44m-bonk.htm), [Chainlink](https://chain.link/article/governance-tokens-dao-voting), [COIN360](https://coin360.com/news/bonkdao-governance-attack-bonk-treasury), [Taylor Monahan](https://x.com/tayvano_/status/2074217113527763312)_

**[The vote closed at 09:42 UTC on July 6](https://x.com/SpecterAnalyst/status/2074469638348366186). The treasury emptied in the same block.**

  
[QuillAudits had the mechanics within hours](https://x.com/QuillAudits_AI/status/2074416524597801319): 882.1 billion BONK bought on Bybit and Binance over the prior two days, [just enough to clear a 879.95 billion quorum](https://x.com/QuillAudits_AI/status/2074416528041312471).  
  
[Three yes votes](https://x.com/QuillAudits_AI/status/2074416524597801319), turnout at 2.9 %, proposal passed.  
  
**[Bonk's official acknowledgment landed just over eight hours after the vote closed](https://x.com/bonk_inu/status/2074191403781906800), a single Twitter post confirming what on-chain sleuths had already mapped in full:** A malicious governance proposal, an estimated $20 million gone, exchange wallets identified, law enforcement notified. No transaction hash. No proposal ID. No wallet addresses. The chain had already published all three.  
  

_[By the time the post went up](https://x.com/bonk_inu/status/2074191403781906800), the money had already moved once, and wasn't finished moving yet._  
  

**[Roughly an hour after the drain](https://x.com/chainalysis/status/2074315262485299686), [the voting wallet started selling](https://x.com/chainalysis/status/2074315262485299686), offloading $5.3 million of the BONK it had bought to secure the vote, hours before BonkDAO said anything at all.**  
  
By mid-afternoon, after the official statement had already gone up, [the drained treasury itself had moved again, this time to a second address ending in "eh42"](https://decrypt.co/372862/solana-meme-coin-bonk-treasury-drained-20-million).  
  
[None of the yes-voter rewards ever materialized](https://decrypt.co/372862/solana-meme-coin-bonk-treasury-drained-20-million), despite [the proposal's own pitch promising them](https://v2.realms.today/dao/84pGFuy1Y27ApK67ApethaPvexeDWA66zNV8gm38TVeQ/proposal/6wR1jdhhJ31bbdRNXva8MxqsgsNLKTxargcdAyZ7FcRj).  
  

[Specter was already pulling threads the community hadn't gotten to yet](https://x.com/SpecterAnalyst/status/2074469617917972985), tracing the voting wallets back through shared exchange deposit addresses to names most BONK holders would recognize.

**[QuillAudits co-founder Preetam put the technical verdict plainly](https://x.com/raopreetam_/status/2074485918145359932):** No smart contract bug, no private key leak, just $4 million spent by an attacker who followed the rules, passed a proposal, and drained the treasury, where [most voters never read past the title](https://x.com/raopreetam_/status/2074485921391706209).  
  

**[Upbit paused BONK withdrawals](https://forklog.com/en/bonkdao-loses-20m-due-to-malicious-proposal/). Kraken did the same.**

  

_If the attacker's wallets were visible, the exchange deposits were visible, and the quorum math was public the entire time, what exactly took eighteen thousand people six days to miss?_

### Loaded Gun

  
_[BonkDAO governed itself through Solana's Realms platform](https://www.techtimes.com/articles/319820/20260707/bonkdao-loses-20m-attacker-buys-quorum-44m-bonk.htm), the same SPL Governance front end [used by hundreds of Solana DAOs](https://www.techtimes.com/articles/319820/20260707/bonkdao-loses-20m-attacker-buys-quorum-44m-bonk.htm)._  
  
**[Token-weighted governance](https://chain.link/article/governance-tokens-dao-voting), also known as one token, one vote. Whoever holds the most tokens wins, and nothing in the design asks whether the winner is a community or a single wallet with a plan.**

  
**[The configuration was, in the words of QuillAudits co-founder Preetam, "a loaded gun"](https://x.com/raopreetam_/status/2074485930447266125):** A 1% community vote threshold, an instruction hold-up time of zero seconds, a proposal creation threshold of only 100 million BONK, and direct treasury transfers via Realms.

**[Read that middle line again](https://x.com/raopreetam_/status/2074485933559431615): Instruction hold-up time, zero seconds. The moment a vote passed, the treasury moved. No review window. No time to veto. No time to notice.**

  
[An anonymous wallet submitted BIP #76 on June 30](https://x.com/SpecterAnalyst/status/2074469628034629865), titled "[Sowellian BonkDAO.](https://www.techtimes.com/articles/319820/20260707/bonkdao-loses-20m-attacker-buys-quorum-44m-bonk.htm)"

_**[Its listed actions](https://x.com/raopreetam_/status/2074485921391706209):** "Add Metadata," and a transfer instruction moving 4,426,104,450,305 BONK to a wallet the submitter controlled._  
  
[The proposal for BIP #76](https://v2.realms.today/dao/84pGFuy1Y27ApK67ApethaPvexeDWA66zNV8gm38TVeQ/proposal/6wR1jdhhJ31bbdRNXva8MxqsgsNLKTxargcdAyZ7FcRj), can still [be viewed on Realms](https://v2.realms.today/dao/84pGFuy1Y27ApK67ApethaPvexeDWA66zNV8gm38TVeQ/proposal/6wR1jdhhJ31bbdRNXva8MxqsgsNLKTxargcdAyZ7FcRj).  
  
**Anyone reading past the headline would have caught it in seconds. Nobody did, for six days.**  
  

**Proposal Creator Wallet ([flagged by Specter](https://x.com/SpecterAnalyst/status/2074469628034629865)):** [8xxRdtzsw1CJWfEahViqNjZwh5dYJAdSbBctWwcbycVo](https://solscan.io/account/8xxRdtzsw1CJWfEahViqNjZwh5dYJAdSbBctWwcbycVo)

  
[Over July 4 and 5, a separate wallet bought the outcome outright](https://x.com/SpecterAnalyst/status/2074469628034629865), accumulating BONK on exchanges and borrowing the rest through marginfi until it held the 1 percent needed to clear quorum.  
  
**[Two voting wallets cast that stake on July 6](https://x.com/SpecterAnalyst/status/2074469638348366186):** 882.2 billion BONK, 99.87 percent, from one address, and 97.8 million BONK, 0.011 percent, from a second.  
  
[The final tally landed at 882,383,387,283 BONK in favor of, and 710,848,288 in favor against](https://x.com/raopreetam_/status/2074485923761553831), a 1,241-to-1 margin [that just cleared the 879.95 billion quorum](https://x.com/QuillAudits_AI/status/2074416528041312471).  
  

**Voting Wallet 1 (99.87% of YES):**
[CyEE7oHVDaFJ5xZLbXY3h2Z2uk1VwhTkdy72kPUEtypQ](https://solscan.io/account/CyEE7oHVDaFJ5xZLbXY3h2Z2uk1VwhTkdy72kPUEtypQ)  
  
**Voting Wallet 2 (0.011% of YES):**
[FQnQYaYe1UiQZiokdDH39ybRbhJYfzzwXSghnA32pWxc](https://solscan.io/account/FQnQYaYe1UiQZiokdDH39ybRbhJYfzzwXSghnA32pWxc)

  
**There was no code to break here. The proposal system worked precisely as specified, and the specification was the vulnerability.**  
  

_A one percent quorum, a hundred-million-token proposal threshold, and a zero-second timelock, stacked on top of each other, so which single fix would have actually stopped this?_

### BONK 2.0

  
_[The transfer executed as the vote closed, on June 6th](https://x.com/SpecterAnalyst/status/2074469638348366186), moving [4,426,104,450,305 BONK](https://x.com/raopreetam_/status/2074485928056500455), worth [roughly $19.3 million the moment it left](https://decrypt.co/372862/solana-meme-coin-bonk-treasury-drained-20-million), out of the treasury [into the attacker’s wallet](https://x.com/raopreetam_/status/2074485928056500455).[](https://solscan.io/account/9bxWkNf3BtJ6iehq9KbX9uCWMjem4TFiPZ19T2sYJHvQ)_

  
**[That attacker’s wallet carries a "funded by Bybit" tag on Solscan](https://solscan.io/account/9bxWkNf3BtJ6iehq9KbX9uCWMjem4TFiPZ19T2sYJHvQ), a detail visible to anyone who bothered to look before the vote closed, not just after.**  
  

**BonkDAO Treasury:**  
[F8FqZuUKfoy58aHLW6bfeEhfW9sTtJyqFTqnxVmGZ6dU](https://solscan.io/account/F8FqZuUKfoy58aHLW6bfeEhfW9sTtJyqFTqnxVmGZ6dU)  
  
**Attacker Wallet:**
[9bxWkNf3BtJ6iehq9KbX9uCWMjem4TFiPZ19T2sYJHvQ](https://solscan.io/account/9bxWkNf3BtJ6iehq9KbX9uCWMjem4TFiPZ19T2sYJHvQ)  
  
**Treasury Transfer Transaction:** [5tPU1srcRcnmibB7KJi2WQ7cK4zuq5iKTMrSCLjq7hvGjuK4KUTmaHfwicixkJa5jZJmp3y98T7r2qecKV5mWw8P](https://solscan.io/tx/5tPU1srcRcnmibB7KJi2WQ7cK4zuq5iKTMrSCLjq7hvGjuK4KUTmaHfwicixkJa5jZJmp3y98T7r2qecKV5mWw8P)

_[Roughly ten hours later, the entire balance had moved again](https://decrypt.co/372862/solana-meme-coin-bonk-treasury-drained-20-million), to a second address ending in "eh42"._  
  
**Second Attacker’s Wallet:**  
[EXaJnmrLf7RAKLfn1hehoKX94keKYmvZm5H5zuYVeh42](https://solscan.io/account/EXaJnmrLf7RAKLfn1hehoKX94keKYmvZm5H5zuYVeh42)

No portion of it reached the eighteen thousand members who never voted. None of it reached [the yes voters the proposal had promised rewards to](https://v2.realms.today/dao/84pGFuy1Y27ApK67ApethaPvexeDWA66zNV8gm38TVeQ/proposal/6wR1jdhhJ31bbdRNXva8MxqsgsNLKTxargcdAyZ7FcRj) either.

  
Nine hours after the drain, [the exploiter tested the water with a $188,000 transfer to an exchange](https://x.com/chainalysis/status/2074315260237070574), then moved the remaining roughly $19 million into a freshly deployed multisig.

**[Chainalysis named the structure "BONK 2.0," governed by three keys](https://x.com/chainalysis/status/2074315262485299686):** The malicious voter, the exploiter wallet, and a third wallet with financial ties to the voter wallet.

  

**Not liquidated. Not laundered through a mixer. Parked, under a name that reads less like a hideout and more like a pitch.**

  

_If the money isn't running and isn't spending, what exactly is a three-key multisig called "BONK 2.0" supposed to become?_

### Cold Trail

  
_BONK slid double digits over the next day and [settled roughly 93 percent below its all-time high](https://coin360.com/news/bonkdao-governance-attack-bonk-treasury)._

**[Upbit paused deposits and withdrawals](https://forklog.com/en/bonkdao-loses-20m-due-to-malicious-proposal/). Kraken did the same.**  
  
Neither exchange had a specific account to freeze. They just stopped taking bets on where the rest of it might land.  
  

**[SpecterAnalyst kept pulling the thread](https://x.com/SpecterAnalyst/status/2074469617917972985), and it led somewhere colder than a random wallet:** Both voting addresses funneled funds to a shared exchange deposit address that, [going back to 2023](https://x.com/SpecterAnalyst/status/2074469646703423751), had also [received transfers from crypto notte's own public wallet](https://x.com/SpecterAnalyst/status/2074469646703423751) and from [a wallet Realms founder deanmachine himself had once publicly rewarded in an early governance test game](https://x.com/SpecterAnalyst/status/2074469655935168818).  
  
**None of it proves who wrote [BIP #76](https://v2.realms.today/dao/84pGFuy1Y27ApK67ApethaPvexeDWA66zNV8gm38TVeQ/proposal/6wR1jdhhJ31bbdRNXva8MxqsgsNLKTxargcdAyZ7FcRj). All of it means the wallets moving BonkDAO's treasury are not, strictly speaking, strangers to Realms.**  
  

Nobody has been charged. No funds have been frozen.

[Bonk's own statement said law enforcement had been notified and that recovery was underway](https://x.com/bonk_inu/status/2074191403781906800), the standard language for an investigation with no bug to patch, no stolen key to revoke, and no clear mechanism to reverse a vote that was never illegitimate on-chain.  
  

**[The proposal is still there](https://v2.realms.today/dao/84pGFuy1Y27ApK67ApethaPvexeDWA66zNV8gm38TVeQ/proposal/6wR1jdhhJ31bbdRNXva8MxqsgsNLKTxargcdAyZ7FcRj), permanent, exactly as submitted, titled "Sowellian BonkDAO," sitting on Realms for anyone to reread now that it matters.**  
  

_When the exploit itself is a permanent, unremovable part of the public record and the wallets behind it trace back to names inside the ecosystem, what is BonkDAO actually protecting by staying this quiet?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)






_BonkDAO didn't get robbed, it got outvoted._  
  
**[$4.4 million bought a majority nobody contested](https://www.coindesk.com/markets/2026/07/07/bonk-faces-usd20-million-treasury-drain-after-attacker-spends-usd4-million-to-pass-malicious-proposal), and that majority [moved roughly $19.3 million out through a door](https://decrypt.co/372862/solana-meme-coin-bonk-treasury-drained-20-million) the DAO itself had left open for six days straight.**  
  

No code broke. No key leaked. No auditor missed a thing, because there was nothing here for an audit to catch, only a governance config that treated a whale with a plan the same as a genuine community.  
  
**[Taylor Monahan didn't wait for a post-mortem to render her verdict](https://x.com/tayvano_/status/2074217113527763312):** "Let anyone who buys in (literally) have a say, they said," mocking the entire premise that handing voting power to whoever bought the most tokens was ever going to end anywhere else.  
  
How is that token weighted governance voting working out?

  
[The treasury now sits in a three-key multisig](https://x.com/chainalysis/status/2074315262485299686), named for a sequel nobody asked for, [while the wallets behind it trace back through years of deposit history to names already inside Solana's own governance world](https://x.com/SpecterAnalyst/status/2074469617917972985).

  
Not one of them has answered for it. Nobody has had to.

  
**[Eight hundred-plus DAOs run the same Realms platform on the same 1% quorum math](https://www.techtimes.com/articles/319820/20260707/bonkdao-loses-20m-attacker-buys-quorum-44m-bonk.htm), most with treasuries their own members have never once bothered to check.**

  
_If a majority can be bought for a fraction of what it controls and cashed in without breaking a single line of code, is BonkDAO the story here, or is it just the first of eight hundred to run the math out loud?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
