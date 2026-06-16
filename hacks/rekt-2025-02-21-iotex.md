---
tags:
  - blockchain/bitcoin
  - blockchain/ethereum
  - sector/bridge
  - sector/dex
  - sector/governance
  - sector/multisig
  - sector/privacy
  - sector/stable
  - sector/staking
  - sector/token
  - precondition/insider
title: "IoTeX - Rekt"
protocol: "[[Iotex]]"
date: 2025-02-21
loss_usd: 4400000
auditors:
source: "https://rekt.news/iotex-rekt"
excerpt: "A Private key compromise handed an attacker full admin control over IoTeX's ioTube bridge. $4.4 million drained. Two tokens minted on top, which IoTeX claims most are frozen or worthless. The key was "
genome:
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[bridge-message-validation]]"
  - "[[fot-slippage]]"
  - "[[governance-voting-power-snapshot]]"
  - "[[oracle-freshness]]"
  - "[[reward-accounting]]"
  - "[[timelock-timestamp-bypass]]"
  - "[[upgrade-safety]]"
---
# IoTeX - Rekt

> **Loss:** $4,400,000 | **Date:** 2025-02-21 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/iotex-rekt-header.png)


_One compromised private key. One Saturday morning. One bridge that handed over the keys to everything it was supposed to protect._

  

**On February 21, 2026, an attacker quietly obtained the owner key to IoTeX's ioTube bridge validator contract, and with it, administrative control over every asset the bridge was holding.**  
  
No exploit. No zero-day. No clever math. Just a single key in the wrong hands, and a four-step execution that drained $4.4M in real bridged assets from the TokenSafe and minted 410 million unbacked CIOTX tokens on top of it.

  

[Onchain investigator Specter was first to flag the bleeding](https://x.com/SpecterAnalyst/status/2025138590393532656), reporting $4.3M drained.  
  
[PeckShield escalated to $8M](https://x.com/PeckShieldAlert/status/2025161252620955965) within ninety minutes.  
  
By the time [IoTeX co-founder Raullen Chai told The Block the losses were "around $2M,"](https://www.theblock.co/post/390698/iotex-hit-by-private-key-exploit-draining-up-to-8-8-million-from-bridge-contracts) three different numbers were already circulating and none of them were wrong, they were just counting different things.

  

**Here's what actually happened:** [The attacker physically stole $4.4M in real assets](https://x.com/iotex_io/status/2025824807120412842) - USDC, USDT, WBTC, WETH, IOTX, PAXG, DAI, BUSD, and UNI - directly from the bridge reserves.  
  
_[According to Defimon Alerts](https://x.com/DefimonAlerts/status/2025148338635469074), they minted [821 million CIOTX (~$4.09M)](https://x.com/DefimonAlerts/status/2025148338635469074) and [9.3 million CCS tokens](https://etherscan.io/address/0xe6a191a894dd3c85e3c89926e9f476f818ee55d9#asset-multichain) ([deprecated tokens with no market value, per Chai](https://www.theblock.co/post/390698/iotex-hit-by-private-key-exploit-draining-up-to-8-8-million-from-bridge-contracts)) out of thin air using the same stolen access._  
  
**[IoTeX's own accounting later cited 410M CIOTX](https://x.com/iotex_io/status/2025824807120412842), a figure the on-chain mint record does not support.**  
  
[10 confirmed mint transactions on Ethereum](https://etherscan.io/advanced-filter?tkn=0x9F90B457Dea25eF802E38D470ddA7343691D8FE1&txntype=2&mtd=0xc6c3bbe6%7eMint), that total roughly 821M. IoTeX has not explained the discrepancy.  
  
IoTeX's [$2M "net loss" claim](https://x.com/iotex_io/status/2025824807120412842) rests on their assertion that 86% of those minted tokens are now frozen on-chain with no liquidity and can't be moved.  
  
**The number that doesn't require trusting anyone:** 66.77 BTC (~$4.29M) sitting in four freshly created Bitcoin wallets, visible to anyone with a browser, untouched as of February 23.  
  

[IOTX dropped 22% on the news (from $0.0054 to below $0.0042)](https://www.coindesk.com/business/2026/02/23/iotex-bridge-exploit-sparks-debate-over-losses-and-recovery-prospects), trading [near $0.00467 as of February 24](https://www.coingecko.com/en/coins/iotex) - roughly 98% below its [all-time high of $0.255 set in November 2021](https://www.coingecko.com/en/coins/iotex).  
  
[South Korea's Upbit placed IOTX on its trading alert list](https://www.wublock123.com/index.php?m=content&c=index&a=show&catid=6&id=57064) and suspended deposits.  
  
[IoTeX distributed an emergency patch to chain delegates to blacklist attacker addresses](https://x.com/iotex_io/status/2025824807120412842), consensus would resume automatically once enough patched delegates came online, [suspended the bridge pending a full independent audit](https://x.com/iotex_io/status/2025824807120412842), and began coordinating with exchanges to freeze what they could.  
  
Their [L1 chain is currently back online](https://x.com/iotex_io/status/2026257009054527835).  
  
**The attacker, meanwhile, had already [moved through THORChain and is holding stolen assets on Bitcoin](https://x.com/BeosinAlert/status/2025521268733485103).**

  
_When a single key can silently transfer ownership of every contract in your bridge stack, what exactly is the security model protecting?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Specter](https://x.com/SpecterAnalyst/status/2025138590393532656), [PeckShield](https://x.com/PeckShieldAlert/status/2025161252620955965), [The Block](https://www.theblock.co/post/390698/iotex-hit-by-private-key-exploit-draining-up-to-8-8-million-from-bridge-contracts), [IoTeX](https://x.com/iotex_io/status/2025824807120412842), [Defimon Alerts](https://x.com/DefimonAlerts/status/2025148338635469074), [CoinDesk](https://www.coindesk.com/business/2026/02/23/iotex-bridge-exploit-sparks-debate-over-losses-and-recovery-prospects), [CoinGecko](https://www.coingecko.com/en/coins/iotex), [Wublock](https://www.wublock123.com/index.php?m=content&c=index&a=show&catid=6&id=57064), [Beosin Alert](https://x.com/BeosinAlert/status/2025521268733485103), [QuillAudits](https://x.com/QuillAudits_AI/status/2025197034647482530), [The Crypto Times](https://www.cryptotimes.io/2026/02/22/iotex-confirms-4-3m-iotube-bridge-breach-validator-key-compromised/), [CRYIP](https://cryip.co/iotex-bridge-hack-full-on-chain-analysis-report/), [𝟘xpaiN Σ](https://x.com/0xOwnerpaiN/status/2025479734683943192), [Trade Brains](https://tradebrains.in/brand/infini-loses-49-million-in-stablecoin-exploit-tied-to-rogue-developer/), [Chainalysis](https://www.chainalysis.com/blog/crypto-hacking-stolen-funds-2026/)_

**[Specter fired the first warning shot](https://x.com/SpecterAnalyst/status/2025138590393532656) on February 21st.**

  

"The private key of IoTeX may have been compromised, resulting in their token safe being drained for a total loss of approximately $4.3M."

  

[USDC, USDT, IOTX, WBTC, BUSD drained](https://x.com/SpecterAnalyst/status/2025138590393532656). Stolen assets [already swapped into ETH, with 45 ETH bridged to Bitcoin](https://x.com/SpecterAnalyst/status/2025138590393532656). [Three attacker addresses published](https://x.com/SpecterAnalyst/status/2025138590393532656). The alert was clean, specific, and landed while most of the industry was asleep.

  

**Ninety minutes later, [PeckShieldAlert escalated the number](https://x.com/PeckShieldAlert/status/2025161252620955965).**

  

_"The IoTeX[.]io Bridge has been hacked for over $8M worth of crypto due to a compromised private key. The hacker has swapped the stolen funds to $ETH and has started bridging them to BTC via Thorchain."_

  

The jump from $4.3M to $8M wasn't a correction, it was a wider lens. [Specter had counted](https://x.com/SpecterAnalyst/status/2025138590393532656) what left the vault. [PeckShield may have counted what the attacker minted on top of it](https://x.com/PeckShieldAlert/status/2025161252620955965). Both were right. They were just measuring different parts of the same operation.

  

**[DefimonAlerts filled in the technical picture shortly after](https://x.com/DefimonAlerts/status/2025148338635469074), putting the gross estimate at $8.46M and naming the contract at the center of it:** The TransferValidatorWithPayload. The attacker had [seized ownership of both the bridge's TokenSafe and its MinterPool](https://x.com/DefimonAlerts/status/2025148338635469074). They drained one and printed from the other.

  

[IoTeX's first public response](https://x.com/iotex_io/status/2025158438901481840) came 79 minutes after [Specter's alert](https://x.com/SpecterAnalyst/status/2025138590393532656).

  

"Our team is fully engaged, working around the clock to assess and contain the situation. Initial estimates indicate the potential loss is significantly lower than circulating rumors suggest."

  

No figure. No technical detail. No acknowledgment of what had already been mapped on-chain by three separate security firms. Just the assurance that the situation was under control, posted while the attacker was still actively bridging funds through THORChain.

  

**A few hours later, [IoTeX had a number](https://x.com/iotex_io/status/2025278610375143497):** $2M. [Co-founder Raullen Chai told The Block the same figure directly](https://www.theblock.co/post/390698/iotex-hit-by-private-key-exploit-draining-up-to-8-8-million-from-bridge-contracts) - "around $2M USD for now" - and added that the minted tokens were "[of little consequence.](https://www.theblock.co/post/390698/iotex-hit-by-private-key-exploit-draining-up-to-8-8-million-from-bridge-contracts)"  
  
Eight hours had passed since the first alert. The attacker had been done with the drain phase for most of them.

  

**The gap between what the chain showed and what the team said would define how this story got told everywhere else.**

  

_When three security firms have already mapped your exploit before your first statement drops, what does your response timeline actually tell users about your monitoring infrastructure?_  
  
### Pwned by Access  
  

_IoTeX's bridge wasn't exploited. It was administered - by someone who shouldn't have been holding the keys._

  

**At the center of the attack sat a single externally owned account:** The owner of the TransferValidatorWithPayload contract on Ethereum.  
  
That EOA had one critical privilege, the ability to call upgrade(). In the right hands, a routine maintenance function. In the wrong ones, a master switch.

  

**Compromised Validator Owner EOA:**
[0x6dd31a526eE3DdBC7BE888b729A445695c03148e](https://etherscan.io/address/0x6dd31a526ee3ddbc7be888b729a445695c03148e)

**TransferValidatorWithPayload Contract:**
[0xE7eBA1CEA51EC9B3AcCC16728e3B8786560c59d5](https://etherscan.io/address/0xE7eBA1CEA51EC9B3AcCC16728e3B8786560c59d5)

**Ownership Transfer Transaction:**  
[0xe9e7f33ebfe2230c147e6e0321f5f2c7de1b89fe9fc08830fc3f8ac5845bc9f0](https://etherscan.io/tx/0xe9e7f33ebfe2230c147e6e0321f5f2c7de1b89fe9fc08830fc3f8ac5845bc9f0)

_The attacker called upgrade() and pushed a malicious contract version in its place - one that had been stripped of every signature check and validation requirement the original contained._  
  
**Upgrade Transaction:**  
[0xc9c53b28a2aec4f8641394d2ba086a4d0b0a93e40d0a86c578c7fc20ab6351b8  ](https://etherscan.io/tx/0xc9c53b28a2aec4f8641394d2ba086a4d0b0a93e40d0a86c578c7fc20ab6351b8)

**The bridge's own upgrade path became the entry point.**

  

With the validator layer replaced, ownership of the TokenSafe and MinterPool transferred cleanly to attacker-controlled addresses.  
  
No alarm. No threshold. No second signature required. The contracts simply obeyed their new owner.

  

**[QuillAudits put it plainly](https://x.com/QuillAudits_AI/status/2025197034647482530):** This was not a smart contract exploit. Just compromised trust at the ownership layer.

  

_How the key was obtained remains publicly unconfirmed._  
  
**[IoTeX's own statement described](https://x.com/iotex_io/status/2025278610375143497) "a sophisticated, long-planned attack by professional actors targeting multiple chains," [with Chai telling The Block the operation showed signs of preparation spanning six to eighteen months](https://www.theblock.co/post/390698/iotex-hit-by-private-key-exploit-draining-up-to-8-8-million-from-bridge-contracts).**  
  
That timeline points toward something more deliberate than a phishing click, possible insider access, a long-horizon social engineering campaign, or infrastructure infiltration that went undetected for over a year.

  

The structural failure underneath it is harder to excuse than the key loss itself.  
  
A single EOA held unchecked upgrade authority over contracts that custodied millions in bridged assets, with no multisig requirement, no timelock, and no circuit breaker that could intervene between the attacker calling upgrade() and the drain beginning.  
  
**The architecture assumed the key would never be compromised. It had no answer for when it was.**

  

_If eighteen months of preparation can quietly dismantle a bridge from the inside, how many other validator keys are already in the wrong hands right now?_  
  
### Drain, Mint and Exit

  
_[189 transactions on a Saturday morning](https://www.cryptotimes.io/2026/02/22/iotex-confirms-4-3m-iotube-bridge-breach-validator-key-compromised/). The attacker didn't linger._

  

**Phase one was the drain. With ownership of the TokenSafe secured, every bridged reserve asset moved out in rapid succession - nine tokens, [according to IoTex’s Security Incident Update](https://x.com/iotex_io/status/2025824807120412842):**

  

_1,36K USDC_
_1,14K USDT_
_635 WETH_
_6.12 WBTC_
_20,159 DAI_
_8.72 PAXG_
_13.85M IOTX_
_45,825 BUSD_
_2,835 UNI_

  
**Total out of the TokenSafe:**  [~$4.4M](https://x.com/iotex_io/status/2025824807120412842). Real assets, real value, gone.

  

**Phase two was the mint. The MinterPool produced [821 million CIOTX](https://etherscan.io/token/0x9F90B457Dea25eF802E38D470ddA7343691D8FE1) across 7 transactions, confirmed on-chain by Rekt News, routed to three beneficiary addresses:**

  
**CIOTX Mint Beneficiary #1:**
[0xa467a6c7ca8e812e997bfe50ce4e7991aad00a88](https://etherscan.io/address/0xa467a6c7ca8e812e997bfe50ce4e7991aad00a88)

  
_111,111,000 CIOTX in 3 mint transactions._  
  
**1,100,000 CIOTX Minted:**
[0x1211c49c178446f6952781f136b212383db92ac22257e2bb6d1d7fa4372aaf11](https://etherscan.io/tx/0x1211c49c178446f6952781f136b212383db92ac22257e2bb6d1d7fa4372aaf11)  
  
**110,000,000 CIOTX Minted:**  
[0x02dde64548455b26b437a25e653cc6e399af3dc4f75698a94d5164b0d161251f](https://etherscan.io/tx/0x02dde64548455b26b437a25e653cc6e399af3dc4f75698a94d5164b0d161251f)  
  
**11,000 CIOTX Minted:**
[0x1738b63ceebdb9c16da62edad6586ef4c15ed7856bb80104dd7bc19353a8e6d3](https://etherscan.io/tx/0x1738b63ceebdb9c16da62edad6586ef4c15ed7856bb80104dd7bc19353a8e6d3)

**CIOTX Mint Beneficiary #2:**
[0x43ed5caadb3fbef610dad8aae621519b20b34de6](https://etherscan.io/address/0x43ed5caadb3fbef610dad8aae621519b20b34de6)

_610,000,000 CIOTX in 2 mint transactions._  
  
**110,000,000 CIOTX Minted:**
[0x4b532369f06e56bba9d4765c377de5d3336ba9b78b49005af06a6d32fa6eec82](https://etherscan.io/tx/0x4b532369f06e56bba9d4765c377de5d3336ba9b78b49005af06a6d32fa6eec82)

**500,000,000 CIOTX Minted:**  
[0xa40a1a464bf317c0fa023d285109b768d9f81a971820324baaa80c33a6f77350](https://etherscan.io/tx/0xa40a1a464bf317c0fa023d285109b768d9f81a971820324baaa80c33a6f77350)  
  
**CIOTX Mint Beneficiary #3:**
[0xc9ca98967cc0f9ffb36c9752e8d7536f6b815c1b](https://etherscan.io/address/0xc9ca98967cc0f9ffb36c9752e8d7536f6b815c1b)

_100,000,000 CIOTX in 2 mint transactions._  
  
**50,000,000 CIOTX Minted:**
[0x0aa445c34b989884f5f252dfd320ffd9f937fad4b27d71635691d4bb3402c8a1](https://etherscan.io/tx/0x0aa445c34b989884f5f252dfd320ffd9f937fad4b27d71635691d4bb3402c8a1)  
  
**50,000,000 CIOTX Minted:**
[0xc9ce7bb9dfb19d9b6e27485725a8fb76d820a323f433f2ad509b1c57586e5520](https://etherscan.io/tx/0xc9ce7bb9dfb19d9b6e27485725a8fb76d820a323f433f2ad509b1c57586e5520)  
  
[The 821M figure from DefimonAlerts](https://x.com/DefimonAlerts/status/2025148338635469074) is confirmed by the on-chain mint record, all 7 transactions on Ethereum, as noted above in detail.  
  
[IoTeX's own Feb 22 statement cited 410M CIOTX](https://x.com/iotex_io/status/2025824807120412842), a figure that remains unexplained given the on-chain evidence.  
  
The discrepancy may reflect burns or freezes between mint and accounting, an incomplete trace at time of reporting, or deliberate framing, IoTeX has not addressed it directly.

  
[The attacker also minted 9.3 million CCS tokens](https://x.com/DefimonAlerts/status/2025148338635469074), which remain unspent in the secondary exploit EOA.  
  
**Combined mint-time value:**  [Could be $8 million on paper](https://cryip.co/iotex-bridge-hack-full-on-chain-analysis-report/) - though Chai would later tell The Block that [CCS tokens are "deprecated long time ago so have no value."](https://www.theblock.co/post/390698/iotex-hit-by-private-key-exploit-draining-up-to-8-8-million-from-bridge-contracts)

_If we were to go by Coingecko’s stats, which could be out of date, the minted totals would add up to the following…_  
  
**821 Million [CIOTX](https://www.coingecko.com/en/coins/crosschain-iotx):** $3.7 Million  
  
**9.3 Million [CCS](https://www.coingecko.com/en/coins/cloutcontracts):** $4.3 Million  
  
**Hypothetical Total of Minted Tokens(As of February 25th): $8 Million**  
  
Whether that number reflects real exit liquidity is a separate question entirely.  
  
_Both phases funneled through two primary exploit addresses._  
  

**Primary Exploit EOA:**
[0x6487B5006904f3Db3C4a3654409AE92b87eD442f ](https://etherscan.io/address/0x6487b5006904f3db3c4a3654409ae92b87ed442f)

**Secondary Exploit EOA:**
[0xE6A191a894dD3c85e3c89926e9f476F818eE55d9](https://etherscan.io/address/0xe6a191a894dd3c85e3c89926e9f476f818ee55d9)

_From there, everything got converted. [Uniswap and other DEXs absorbed the diverse basket of stolen tokens and returned ETH.](https://cryip.co/iotex-bridge-hack-full-on-chain-analysis-report/)_  
  
**Then came THORChain - no KYC, no custodian, no freeze mechanism. [The ETH moved through a network of relay wallets and out the other side as Bitcoin](https://x.com/PeckShieldAlert/status/2025161252620955965), clean and cross-chain, [landing in four Bitcoin addresses](https://x.com/0xOwnerpaiN/status/2025281337930727737) that hadn't existed before February 21st.**  
  

**ETH Relay / DEX Swap Hub (used for DEX swaps and THORChain outbound):**
[0x39c188029433bdd7965B55959221ABe00466565E ](https://etherscan.io/address/0x39c188029433bdd7965b55959221abe00466565e)

**Frozen ETH Relay (~$248K recovered by exchanges):**
[0xa5f24f4f89f62dd2df9a4a46b9f81f6590025d97](https://etherscan.io/address/0xa5f24f4f89f62dd2df9a4a46b9f81f6590025d97)

  

_[0xOwnerpaiN tracked them down one by one](https://x.com/0xOwnerpaiN/status/2025247211890553271) as the funds arrived, publishing each address as the inflows hit._  
  

**BTC Destination Wallet #1:**
[135oSa2fobTxtHtm5dwTREDyRY2o1DG1Aw](https://mempool.space/address/135oSa2fobTxtHtm5dwTREDyRY2o1DG1Aw)

_14.37 BTC - ~$967K - confirmed balance as of February 25th._  
  

**BTC Destination Wallet #2:**
[16xusPKLMyqK68SkhfXDtic6AJPDi51tqh](https://mempool.space/address/16xusPKLMyqK68SkhfXDtic6AJPDi51tqh)

  
_19.97 BTC - ~$1.34M - confirmed balance as of February 25th._  
  

**BTC Destination Wallet #3:**
[12V7jhcPnqnGbRFMasSW2CZVBd8qpvUgAK](https://mempool.space/address/12V7jhcPnqnGbRFMasSW2CZVBd8qpvUgAK)

  
_13.77 BTC - ~$926K - confirmed balance as of February 25th._  
  

**BTC Destination Wallet #4:**
[1PN2BoHU4buDQWcrNHk9T9NBA2qX8oyYEc](https://mempool.space/address/1PN2BoHU4buDQWcrNHk9T9NBA2qX8oyYEc)

  
_18.66 BTC - ~$1.25M - confirmed balance as of February 25th - the largest wallet, fed from 3 separate ETH sources._  
  

Combined total across all four: 66.77 BTC (~$4.49M) - confirmed on-chain as of February 25th.  
  
The attacker parked everything and went quiet. No cash-out attempt. No mixer. No further hops.  
  
Just four Bitcoin addresses sitting still, visible to anyone with a browser, while the investigation clock runs.  
  

**[One detail 𝟘xpaiN Σ caught live](https://x.com/0xOwnerpaiN/status/2025479734683943192):** Wallet #2 was still actively receiving funds during his tracking window - growing from 14.2 BTC to 19.96 BTC as the attacker continued converting ETH through THORChain even after the breach was public. The drain was done. The laundering was still in motion.  
  

**Four Bitcoin wallets. 66.77 BTC. Zero outgoing transactions.**  
  

_What exactly is the attacker waiting for?_

  
### Still Counting  
  

_On February 22, [IoTeX published the most substantive statement of the entire incident](https://x.com/iotex_io/status/2025824807120412842) - a formal recovery roadmap that finally named the figures the team had been dancing around for two days._  
  

**The numbers according to IoTeX:**  [$4.4M drained from the bridge reserves](https://x.com/iotex_io/status/2025824807120412842) (TokenSafe). 410M CIOTX minted via MinterPool - [IoTeX's figure](https://x.com/iotex_io/status/2025824807120412842), which the on-chain mint record puts at 821M.  
  
[Of those minted tokens, IoTeX claimed 86% were already locked or frozen through chain-level controls](https://x.com/iotex_io/status/2025824807120412842) - 315M CIOTX trapped on Ethereum and Base with no bridge path, 40.5M remaining in attacker wallets on the IoTeX chain that are currently blacklisted, and 52.4M deposited to Binance where the team said it was actively working to freeze.  
  
[Only 1.7M CIOTX - 0.4% of the total minted](https://x.com/iotex_io/status/2025824807120412842) - had been swapped on DEX and was considered unrecoverable.  
  

If those figures hold, [the math behind IoTeX's $2M net loss claim becomes more defensible.](https://www.theblock.co/post/390698/iotex-hit-by-private-key-exploit-draining-up-to-8-8-million-from-bridge-contracts)

  
_The problem is that "if" is doing significant work. The Binance freeze status has not been independently confirmed._  
  
**[The chain-level blacklisting of 29 attacker-controlled addresses](https://x.com/iotex_io/status/2025824807120412842) is a unilateral action by IoTeX against its own chain.**  
  
And the non-IOTX assets - [the $4.4M in USDC, USDT, WBTC, WETH, and the rest pulled from the TokenSafe - converted to approximately 2,183 ETH and routed to Bitcoin via THORChain](https://x.com/iotex_io/status/2025824807120412842), remain entirely in attacker hands.  
  
That part of the story does not have a recovery chapter yet.  
  

**One exception worth noting:** The 9.3 million CCS tokens minted via the secondary exploit EOA - the mystery position - are [still sitting unspent in that address](https://etherscan.io/address/0xe6a191a894dd3c85e3c89926e9f476f818ee55d9#asset-multichain). The attacker hasn't moved them.  
  
_The chain-listed value shows ~$4.3M, but [Chai told The Block directly](https://www.theblock.co/post/390698/iotex-hit-by-private-key-exploit-draining-up-to-8-8-million-from-bridge-contracts) that CCS is "deprecated long time ago so have no value."_  
  
**Whether the Etherscan price is a ghost, a stale feed, or a thin illiquid market, the practical exit value appears to be near zero.**  
  
**The attacker may be sitting on a nominally large position that is effectively worthless, or may have known that all along and moved on to what actually mattered:** The TokenSafe drain and the BTC already parked in four wallets.  
  

The Feb 22 statement [also carried a white-hat bounty offer](https://x.com/iotex_io/status/2025824807120412842).  
  
**On February 23, [IoTeX formalized the offer to CoinDesk](https://www.coindesk.com/business/2026/02/23/iotex-bridge-exploit-sparks-debate-over-losses-and-recovery-prospects):** $440,000 (10%) in exchange for the return of ~$4.4M within 48 hours, with a pledge of no legal action and no sharing of identifying information with law enforcement.  
  
**IoTeX announced they had flagged the primary exploit address on Etherscan as [Fake_Phishing2054654](https://etherscan.io/address/0x6487b5006904f3db3c4a3654409ae92b87ed442f) and sent an on-chain message directly to the attacker.**  
  
_[The onchain message reads](https://etherscan.io/tx/0x451c8c62d1fbc08258a0eaad73668e1ad75fd4d57caa3da4f16f1d060397f98f): "This is regarding the ioTube bridge exploit on Feb. 21, 2026. All fund movements across Ethereum, IoTeX, and bitcoin have been fully traced."_  
  
No response has been reported as of February 25th. The 48-hour deadline that expires today.  
  
**Onchain Message:**  
[0x451c8c62d1fbc08258a0eaad73668e1ad75fd4d57caa3da4f16f1d060397f98f](https://etherscan.io/tx/0x451c8c62d1fbc08258a0eaad73668e1ad75fd4d57caa3da4f16f1d060397f98f)

[SpecterAnalyst flagged something else in the aftermath](https://x.com/SpecterAnalyst/status/2025254991187894459) that the team's statement never addressed directly: A wallet funding trail connecting the IoTeX attacker's EOA [to the $49.5M Infini stablecoin hack from February 2025.](https://rekt.news/infini-rekt)  
  
[The Infini case involved a former contract developer who retained admin privileges after their engagement ended](https://tradebrains.in/brand/infini-loses-49-million-in-stablecoin-exploit-tied-to-rogue-developer/), then executed a delayed drain using the same operational playbook - insider key access, deferred execution, cross-chain laundering through Tornado Cash.  
  
[Chai's comment to The Block](https://www.theblock.co/post/390698/iotex-hit-by-private-key-exploit-draining-up-to-8-8-million-from-bridge-contracts) about "a planned attack that could have been developing for six to eighteen months" lands differently with that context.  
  
_No formal attribution has been made by law enforcement or any analytics firm as of February 23._  
  

**Outside experts are skeptical that the real losses - the TokenSafe assets already converted and BTC-bridged - are coming back.**  
  
**[Nick Motz, CEO of ORQO Group, told CoinDesk](https://www.coindesk.com/business/2026/02/23/iotex-bridge-exploit-sparks-debate-over-losses-and-recovery-prospects):** "Containment is not the same as recovery. The assets with actual market value were swapped and bridged. Those are, in my assessment, unlikely to be recovered."  
  
**[Nanak Nihal Khalsa, co-founder of human.tech, offered a matching verdict](https://www.coindesk.com/business/2026/02/23/iotex-bridge-exploit-sparks-debate-over-losses-and-recovery-prospects):** "It's hard to predict how much, if any, can be recovered."  
  

[The promises on the table as of this writing:](https://x.com/iotex_io/status/2025824807120412842) A detailed compensation plan for affected bridge users, a community AMA with the founding team, a full post-mortem report, expedited implementation of IIP-55 to decentralize bridge validation through a multi-party validator set, new mandatory multisig and 24-hour timelock controls for all validator keys, and an expanded bug bounty program.  
  
_IIP-55 is the exact architectural fix that would have made this attack significantly harder to execute - [a proposal drafted in December 2025](https://community.iotex.io/t/iip-55-dynamic-witness-committee-for-iotube/16545), two months before the hack, now being rushed because the vault is empty._  
  

**What's been promised and what's been delivered are still two different lists. The token market didn't wait to find out which one would be longer.**

  

The L1 at least has a resolution. [On February 24 at 06:06 AM UTC, IoTeX confirmed the chain was back online with v2.3.4 deployed](https://x.com/iotex_io/status/2026406140683461051) - permanently blacklisting all 29 attacker wallets at the network level.  
  
[The same update named the FBI explicitly for the first time,](https://x.com/iotex_io/status/2026406140683461051) confirmed a formal response to DAXA (the Korean Digital Asset Exchange Association), and committed the IoTeX Foundation Treasury to 100% compensation for all affected bridge users.  
  
**The bridge remains paused pending an independent security audit with no timeline given.**

  
_When the compensation plan, the AMA, the post-mortem, and the governance reform are all still pending, what exactly has been resolved?_



![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

_Another bridge. Another private key. Another vault that was one key away from being someone else's._  
  

**The method that took down IoTeX's ioTube is the same method that [took down Infini](https://rekt.news/infini-rekt), [Step Finance](https://rekt.news/step-finance-rekt), and a growing list of protocols that did everything right on paper - audited contracts, public security reviews, years of operational history - and still found themselves watching their vaults empty out because one key ended up somewhere it shouldn't have.**  
  
How that key moved from IoTeX's infrastructure to an attacker's wallet remains publicly unanswered, and if the pattern holds, it may stay that way.  
  
Private key compromises rarely get the clean post-mortem that code exploits do, because admitting your humans failed doesn't come with a patch.  
  

_IoTeX's response was fast - the [February 22 comprehensive statement](https://x.com/iotex_io/status/2025824807120412842), the [v2.3.4 chain patch](https://x.com/iotex_io/status/2026257009054527835), the Binance coordination. At least they moved._  
  
**But 66.77 BTC (~$4.29M) is sitting on Bitcoin untouched, the compensation plan is still a promise, and IIP-55 - the governance reform that would have made this attack architecturally harder - existed before the vault emptied and wasn't prioritized until after it did.**

  
[According to Chainalysis,](https://www.chainalysis.com/blog/crypto-hacking-stolen-funds-2026/) private key compromises drove 88% of all crypto stolen in Q1 2025.  
  
The industry has known this for a while now.  
  
**The attack surface isn't just the code anymore - it's whoever is holding the keys, on whatever device, checking whatever email, on whatever Saturday morning the attacker has been patiently waiting for.**

  

_When the most dangerous vulnerability in DeFi isn't in the contract - it's in the calendar invite - what exactly are we auditing?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
