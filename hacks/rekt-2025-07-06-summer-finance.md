---
tags:
  - blockchain/arbitrum
  - blockchain/ethereum
  - web3-sector/dex
  - web3-sector/governance
  - web3-sector/lending
  - web3-sector/multisig
  - web3-sector/oracle
  - web3-sector/privacy
  - web3-sector/stable
  - web3-sector/staking
  - vuln/reentrancy/single-function
  - impact/data-corruption/price-manipulation
  - trigger/price-manipulation
  - precondition/insider
  - novelty/known-pattern
  - type/hack
  - vector/access-control
  - vector/flash-loan
  - vector/price-manipulation
  - vector/private-key
  - vector/reentrancy
title: "Summer Finance - Rekt"
protocol: "Summer Finance"
date: 2025-07-06
loss_usd: 6040000
audit: "N/A"
source: "https://rekt.news/summer-finance-rekt"
excerpt: "$6.04 million stolen from Summer Finance's Lazy Summer depositors when a capped-for-removal Ark was still counted in the vault’s value, letting a donated stale asset inflate the share price and drain "---
# Summer Finance - Rekt

> **Loss:** $6,040,000 | **Date:** 2025-07-06 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/summer-finance-rekt.png)




_Eight months earlier, [someone at Summer.fi zeroed an Ark's deposit cap](https://x.com/summerfinance_/status/2074522409869115468), and the offboarding stopped there._

**On July 6, 2026, [an attacker turned that unfinished process into $6.04 million](https://x.com/summerfinance_/status/2074522409869115468), draining two Lazy Summer Protocol vaults inside a single atomic transaction.**

**The mechanics were almost boring by DeFi standards:** No reentrancy, no oracle manipulation, [no stolen admin key](https://x.com/summerfinance_/status/2074522409869115468).  
  
[A Silo market capped for removal that October stayed inside the fleet’s NAV calculation](https://x.com/summerfinance_/status/2074522409869115468), still pricing itself off a valuation that [never adjusted after November’s Stream Finance collapse](https://x.com/summerfinance_/status/2074522409869115468).  
  
**[Donate a token the Ark could never actually withdraw](https://x.com/summerfinance_/status/2074522409869115468). Watch the share price rise anyway. Redeem against everyone else's real liquidity.**

[Three months of quiet wallet funding preceded the transaction](https://x.com/summerfinance_/status/2074522409869115468) that cashed it out in minutes.  
  
[The Guardian Module got its first live test since April](https://x.com/summerfinance_/status/2074522409869115468), froze what it could reach, [and discovered it had no authority at all on one chain](https://x.com/summerfinance_/status/2074522409869115468).

**[Summer.fi framed it as an offboarding gap rather than a code bug](https://x.com/summerfinance_/status/2074522409869115468). The contracts behaved as designed.**

_When the remedy for a known problem is "set the cap to zero," what was step two supposed to be, and who forgot to schedule it?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Summer.fi](https://x.com/summerfinance_/status/2074522409869115468), [Blockaid](https://x.com/blockaid_/status/2074004564060045459), [Vladimir S](https://x.com/officer_secret/status/2074005645683003514), [CertiK](https://x.com/CertiKAlert/status/2074005902362132625), [Cyvers](https://x.com/CyversAlerts/status/2074024662619562049), [QuillAudits](https://x.com/QuillAudits_AI/status/2074083762577805588), [Odysseus](https://x.com/odysseas_eth/status/2074014953632067688), [PeckShield](https://x.com/PeckShieldAlert/status/2074021414609600523), [ChainSecurity](https://1988724135-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FGiBcoId8OqxDuUU92hwi%2Fuploads%2F9kz0ytR9bg9ulIBbgObc%2FChainSecurity_Summer_fi_Summer_Earn_Protocol_audit.pdf?alt=media&token=05bf3eff-fd4b-455d-828a-a0cdad03aa9d), [Sherlock](https://1988724135-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FGiBcoId8OqxDuUU92hwi%2Fuploads%2FuPuVQ9P3QeuusBGYVzEV%2F2025.11.10%20-%20Final%20-%20Summer.fi%20Public%20Best%20Efforts%20Audit%20Contest%20Report%201762739170.pdf?alt=media&token=5d99db35-8b5f-43a5-a44b-6a9a91ea4eef)_

**[Blockaid saw it first on July 6th](https://x.com/blockaid_/status/2074004564060045459), while the transaction was still running.**

["Blockaid's exploit detection system has identified an ongoing exploit on Summer Finance](https://x.com/blockaid_/status/2074004564060045459). ~$6M drained so far."

No hedging, no "developing story" disclaimer, just a number and a link. [A follow-up thread landed a minute later with the exploit transaction, the attacker's address, the exploit contract, and the list of affected Lazy Summer contracts](https://x.com/blockaid_/status/2074004740191424915), everything a competing security firm would need to start its own trace before Summer.fi had said a word.

[Independent researcher Vladimir S. relayed the alert](https://x.com/officer_secret/status/2074005645683003514) within minutes.  
  
**[CertiK's own detection system fired shortly after, framing the mechanism in blunt terms](https://x.com/CertiKAlert/status/2074005902362132625):** A $65.4 million flash loan, used for liquidity manipulation, netting the attacker roughly $6 million.  
  
[Cyvers noted that the attacker's wallet had been funded through FixedFloat on Base](https://x.com/CyversAlerts/status/2074024662619562049) before the Ethereum transaction ran.  
  
[QuillAudits published next](https://x.com/QuillAudits_AI/status/2074083762577805588), pointing to a same-transaction share pricing and sequencing issue rather than an oracle manipulation, careful to distinguish the two before most outlets had bothered to ask which one it was.

**[Phylax Systems founder Odysseus went further](https://x.com/odysseas_eth/status/2074014953632067688), framing the root cause as same-transaction vault/Ark accounting plus liquidity manipulation rather than key compromise or admin-role abuse. He also noted that the exploit contract was unverified, while the Lazy Summer contracts it called were verified and behaved exactly as written.**

**[Summer.fi took roughly three hours to say anything at all](https://x.com/summerfinance_/status/2074051277332373942):** "We are aware of the reported exploit a little earlier today and are investigating the root cause. The protocol guardians are currently pausing all Vaults across the Lazy Summer Protocol."

**By the time that statement was posted, [PeckShield had already named the primary target, LVUSDC, risk-managed by Block Analitica](https://x.com/PeckShieldAlert/status/2074021414609600523), and [flagged something almost comic sitting inside the wreckage](https://x.com/PeckShieldAlert/status/2074021414609600523):** The vault's displayed APY had briefly spiked to roughly 2.08 million percent.

[PeckShield also pointed to the vault's largest post-exploit holder, an address reportedly tied to Torben Jorgensen of UDHC, sitting on close to 8.6 million USDC](https://x.com/PeckShieldAlert/status/2074021414609600523) in a vault that could no longer honor a normal withdrawal.

**[Summer.fi's second statement, roughly 11 hours after the first alert, finally used the word most people had been waiting for](https://x.com/summerfinance_/status/2074214443261509721):** "We identified an active exploit affecting the Lazy Summer Protocol earlier today. As a precaution, Guardians have paused all vaults and set deposit caps to zero across networks. The situation is being actively assessed. Please do not interact with the protocol until further notice."

**Three hours of silence, then a security notice telling depositors not to touch a protocol that had already been drained.**

_Several security teams and independent researchers had already reached the same broad conclusion before Summer.fi confirmed it themselves, so what exactly was being investigated for those three hours, the cause or the wording of the statement?_

  
### The Ark That Never Left

  

_**[Lazy Summer vaults price themselves the same way](https://x.com/summerfinance_/status/2074522409869115468):** The vault sums totalAssets() across active Arks, then divides by shares outstanding._  
  
**[In plain terms the vault treated a stale, illiquid position like cash](https://x.com/summerfinance_/status/2074522409869115468), even after the Ark stopped accepting deposits, it still counted in NAV, so adding more of it inflated paper value without adding real liquidity.**  
  
That becomes more consequential when one of those Arks can no longer accept deposits but still remains part of NAV.  
  

[Summer.fi's official September 2025 governance recap confirms that the on-chain vote](https://blog.summer.fi/september-2025-governance-recap/) stemming from [SIP2.24, "Update ARKs from core protocols on mainnet fleets (USDC/WETH/USDT)"](https://forum.summer.fi/t/sip2-24-update-arks-from-core-protocols-on-mainnet-fleets-usdc-weth-usdt/330), specifically the proposal to add 2 Arks to LazyVault_LowerRisk_USDC Fleet on mainnet, [was published on September 4 and later passed and executed](https://blog.summer.fi/september-2025-governance-recap/).  
  
[Its deposit cap was zeroed on October 30, 2025](https://x.com/summerfinance_/status/2074522409869115468), in [response to November's Stream Finance collapse](https://x.com/summerfinance_/status/2074522409869115468) and [the xUSD depeg that followed](https://rekt.news/loop-contagion), roughly eleven weeks after onboarding, zeroing a cap blocks new deposits.

_[It does not remove the Ark from the active set, and removeArk itself requires the Ark to already hold zero assets](https://x.com/summerfinance_/status/2074522409869115468), a condition the offboarding never reached._  
  

**The timing is worth sitting with. Days after that cap hit zero, [a Balancer V2 exploit set off its own chain reaction into the Arbitrum USDC vault](https://blog.summer.fi/arbitrum-usdc-vault-post-mortem-what-happened-and-what-comes-next/), one backing Summer.fi’s Arbitrum USDC vault.**  
  
The affected market inside that vault was [the sUSDx ARK](https://forum.summer.fi/t/sip2-39-offboard-the-silo-susdx-usdc-127-market-from-the-arbitrum-usdc-vault-using-sweep-via-timelock/465), whose [caps Block Analitica later zeroed on November 4](https://forum.summer.fi/t/arbitrum-usdc-fleet-susdx-ark-retrospective-ba-labs/529) before [the DAO removed it via SIP2.39](https://forum.summer.fi/t/sip2-39-offboard-the-silo-susdx-usdc-127-market-from-the-arbitrum-usdc-vault-using-sweep-via-timelock/465), executed [on November 21st](https://arbiscan.io/tx/0x4baad6c46de49ee2b89a4f8e61f446a713c72c9ffe45bb92f21c301a0577e5cd).

  
Seventeen days, start to finish. No equivalent sweep for the Varlamore Ark turned up in the available public record; it appears to have remained active and priced into NAV throughout.  
  

From that October 30, 2025 cap date to [the exploit on July 6, 2026](https://x.com/summerfinance_/status/2074522409869115468), roughly eight months passed with the stale valuation left in place, [priced near par, never marked down for the bad debt underneath it](https://x.com/summerfinance_/status/2074522409869115468).  
  

**[Summer.fi's post-mortem goes out of its way to correct the record](https://x.com/summerfinance_/status/2074522409869115468):** This was never a totalAssets() versus withdrawableTotalAssets() bug. Redemptions drain Arks in ascending order of size, so the large, manipulated Ark was sorted last and was not the one that got redeemed first.  
  
**The result is less a broken function than a vulnerable sequence of events.**  
  

_If the accounting worked exactly as designed, was the exploit really in the code, or in the calendar?_

  

### Two Vaults, One Withdrawal

  

_The attacker opened with the smaller vault. [A near costless deposit and withdraw round trip through the HigherRisk USDC vault moved roughly $398k into its buffer](https://x.com/summerfinance_/status/2074522409869115468), so the later inflated redemption could be paid from liquid assets._  
  

**Then came the real move. [The attacker flash borrowed more than $65 million in USDC, plus a smaller USDT leg](https://x.com/odysseas_eth/status/2074014953632067688), and [deposited roughly $64.8 million into the LowerRisk USDC vault at a true share price near 1.0665](https://x.com/summerfinance_/status/2074522409869115468).**  
  
The stale Silo Varlamore position was then donated directly into its Ark, no shares minted, [just a transfer that pushed the vault's reported NAV up roughly 9.5 percent and the share price to 1.1678](https://x.com/summerfinance_/status/2074522409869115468).  
  

[Redeeming that position paid out close to $71 million against a $64.8 million deposit](https://x.com/summerfinance_/status/2074522409869115468), funded not by the donated Ark but by [the vault's genuinely liquid Morpho, Spark, and Sky positions](https://x.com/summerfinance_/status/2074522409869115468), other depositors' capital.  
  
The loans were repaid, the profit was swapped to DAI on Curve, [and the attacker walked with 6,016,754.998 DAI](https://etherscan.io/tx/0x0db528c44f23fc7fa4544684a2fab81096450a14aae8bc89f42cd0592d43da12), split [roughly $5.64 million from LowerRisk and $0.40 million from HigherRisk](https://x.com/summerfinance_/status/2074522409869115468).  
  

_None of it required meaningful capital up front. [Three months of quiet wallet funding did the real setup](https://x.com/summerfinance_/status/2074522409869115468), the transaction itself only took minutes._  
  

**The on-chain trail, for anyone who wants to verify it themselves:**  
  

**Exploit Transaction:** [0x0db528c44f23fc7fa4544684a2fab81096450a14aae8bc89f42cd0592d43da12](https://etherscan.io/tx/0x0db528c44f23fc7fa4544684a2fab81096450a14aae8bc89f42cd0592d43da12)

  
**Attacker EOA:**
[0x7BF716167B48CF527725722C6d79494b45B3BDCa](https://etherscan.io/address/0x7BF716167B48CF527725722C6d79494b45B3BDCa)

  
**Exploit Contract, unverified:**
[0x0514F827C129C16418a0933E03C99A6AF982FC61](https://etherscan.io/address/0x0514F827C129C16418a0933E03C99A6AF982FC61)

**Attacker’s Intermediary Wallet (used to cash out through Tornado Cash):**  
[0x46E09c4D4d20C0474598b4d2fFDd08bdf416eBa7](https://etherscan.io/address/0x46e09c4d4d20c0474598b4d2ffdd08bdf416eba7)

  
**LazyVault_LowerRisk_USDC, the primary vault hit:** [0x98C49e13bf99D7CAd8069faa2A370933EC9EcF17](https://etherscan.io/address/0x98C49e13bf99D7CAd8069faa2A370933EC9EcF17)

  
**LazyVault_HigherRisk_USDC, hit first to prime the buffer:** [0xE9cDA459bED6dcfb8AC61CD8cE08E2D52370cB06](https://etherscan.io/address/0xE9cDA459bED6dcfb8AC61CD8ce08E2D52370cB06)

  
**[Flash loan source](https://x.com/odysseas_eth/status/2074014953632067688):**  
Morpho, roughly 65.419M USDC plus 1M USDT

  
**[Final payout to the attacker](https://x.com/odysseas_eth/status/2074014953632067688):** 
6,016,754.998 DAI, swapped from USDC.  
  
[The attacker later routed part of the stolen proceeds through an intermediary wallet](https://x.com/summerfinance_/status/2074522409869115468) and into Tornado Cash, [depositing repeated 10 ETH and 100 ETH batches](https://etherscan.io/address/0x46e09c4d4d20c0474598b4d2ffdd08bdf416eba7), which continued the cash-out trail after the exploit.

  
**[The exploit contract has never been verified](https://x.com/odysseas_eth/status/2074014953632067688). Everything known about its internal logic comes from trace and log behavior against the verified contracts it called.**

  
_If the exploit could extract value without ever moving the underlying asset, what does that say about the system that priced it?_

  
### The Guardians Learned Their Limits

  

_The Guardian Module, [a 6-of-8 multisig spanning Ethereum, Base, Arbitrum, and Sonic](https://x.com/summerfinance_/status/2074522409869115468), got its first live test during the exploit, having previously been used only once, [in April, to cancel a malicious governance proposal](https://x.com/summerfinance_/status/2074522409869115468)._  
  
**[It zeroed deposit caps on both DAO managed vaults](https://x.com/summerfinance_/status/2074522409869115468), paused Ethereum first since that's where the exploited vaults lived, then Base, Arbitrum and Sonic out of caution.**  
  

Then it hit a wall. [On HyperEVM, the pause reverted, the module simply didn't hold the guardian role there](https://x.com/summerfinance_/status/2074522409869115468). [Deposit caps were already zero on that chain, so the vector was blocked regardless](https://x.com/summerfinance_/status/2074522409869115468), but the gap was real, discovered live rather than in a tabletop exercise.  
  

The Guardian Module itself traces back to a different incident entirely.

[](https://blog.summer.fi/arbitrum-usdc-vault-post-mortem-what-happened-and-what-comes-next/)[Block Analitica’s retrospective on the Arbitrum USDC fleet said that](https://forum.summer.fi/t/arbitrum-usdc-fleet-susdx-ark-retrospective-ba-labs/529), as a risk-curation response to the USDX event, it had already set the sUSDx Silo ARK’s caps to zero on November 4 and was working to limit exposure more broadly.  
  
_[SIP0.2 passed three months later](https://forum.summer.fi/t/sip0-2-establish-guardian-module-emergency-risk-controls/675/20), built to close the very gap that had just cost the Arbitrum vault its Silo exposure. [It still had no authority on HyperEVM in July](https://x.com/summerfinance_/status/2074522409869115468)._  
  

**The exploit did not emerge from unaudited code.**

[ChainSecurity's audit of the Summer Earn Protocol, delivered January 14, 2025](https://1988724135-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FGiBcoId8OqxDuUU92hwi%2Fuploads%2F9kz0ytR9bg9ulIBbgObc%2FChainSecurity_Summer_fi_Summer_Earn_Protocol_audit.pdf?alt=media&token=05bf3eff-fd4b-455d-828a-a0cdad03aa9d), reviewed FleetCommander and the Ark contracts directly, including the Ark removal flow.  
  
[In finding 8.3, “Removal of Arks Can Be DOSed,”](https://1988724135-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FGiBcoId8OqxDuUU92hwi%2Fuploads%2F9kz0ytR9bg9ulIBbgObc%2FChainSecurity_Summer_fi_Summer_Earn_Protocol_audit.pdf?alt=media&token=05bf3eff-fd4b-455d-828a-a0cdad03aa9d) the auditors noted that removeArk depends on ark.totalAssets == 0, which can fail if residual dust remains after disembarking or if tokens are sent to the Ark before removal.  
  
[Summer.fi responded that future Arks should have a way to be fully emptied before removal](https://1988724135-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FGiBcoId8OqxDuUU92hwi%2Fuploads%2F9kz0ytR9bg9ulIBbgObc%2FChainSecurity_Summer_fi_Summer_Earn_Protocol_audit.pdf?alt=media&token=05bf3eff-fd4b-455d-828a-a0cdad03aa9d); the finding was rated Informational and marked Acknowledged.  
  

_[Roughly eighteen months later](https://x.com/summerfinance_/status/2074522409869115468), an Ark got stuck inside that same unresolved gap, though not by the exact mechanism the auditors described._  
  
**This was not a dusting attack; the asset was never fully removed in the first place.**  
  
**[The Ark simply never reached the removal step at all](https://x.com/summerfinance_/status/2074522409869115468):** Capped for offboarding, never fully emptied, still active, still priced into NAV.  
  
Later audits, by [Prototech Labs](https://1988724135-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FGiBcoId8OqxDuUU92hwi%2Fuploads%2FtMmQn3VKKA5KAjnV9kSV%2FFinal%20SummerFi%20Security%20Report.pdf?alt=media&token=e75e1578-4b3f-4b75-b956-dd1c31562d5f) and [Sherlock](https://1988724135-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FGiBcoId8OqxDuUU92hwi%2Fuploads%2FuPuVQ9P3QeuusBGYVzEV%2F2025.11.10%20-%20Final%20-%20Summer.fi%20Public%20Best%20Efforts%20Audit%20Contest%20Report%201762739170.pdf?alt=media&token=5d99db35-8b5f-43a5-a44b-6a9a91ea4eef), were both scoped to the governance package, staking, vesting, the governor, the staked token.  
  
Their published scope descriptions do not mention FleetCommander or the Arks, so there is no indication in those reports that Ark lifecycle risk was revisited.  
  

_[The Foundation multisig swept the donated Silo shares out of the LowerRisk vault hours later](https://x.com/summerfinance_/status/2074522409869115468), cutting the distorted NAV out of public view and socializing the loss._  
  
**[The attacker then routed part of the stolen proceeds through an intermediary wallet and into Tornado Cash](https://x.com/summerfinance_/status/2074522409869115468); Summer.fi said this signaled limited intent to return the funds voluntarily.** 
  
Not sure if that groundbreaking insight was written by Captain Obvious or meant to be ironic.  
  
**[The funding trail Cyvers flagged in the first hour](https://x.com/CyversAlerts/status/2074024662619562049) turned out to be worth chasing:** [Summer.fi reached out to FixedFloat directly with the addresses and transactions](https://x.com/summerfinance_/status/2074522409869115468) initially funded through the exchange.  
  

[Governance now has to decide what to do with roughly $4 million in illiquid capital still tied up in the drained vaults](https://x.com/summerfinance_/status/2074522409869115468), and whether the exploiter's shares get excluded from reimbursement.  
  

**[An audit named the exact door roughly eighteen months in advance and Summer.fi acknowledged it](https://1988724135-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FGiBcoId8OqxDuUU92hwi%2Fuploads%2F9kz0ytR9bg9ulIBbgObc%2FChainSecurity_Summer_fi_Summer_Earn_Protocol_audit.pdf?alt=media&token=05bf3eff-fd4b-455d-828a-a0cdad03aa9d); the excerpt does not show whether it was later remediated before the incident.**

  

_How long can an acknowledged finding remain open before it becomes a failure of process?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)





_$6.04 million moved through [a gap that had been visible since October 2025](https://x.com/summerfinance_/status/2074522409869115468)._  
  
**[Three months of patient wallet funding did the real work here](https://x.com/summerfinance_/status/2074522409869115468), not the flash-loaned theater that made the headlines.**  
  
[Donate an asset nobody could withdraw](https://x.com/summerfinance_/status/2074522409869115468), watch a number go up, redeem against everyone else's money, [the mechanism was almost insultingly simple](https://x.com/summerfinance_/status/2074522409869115468).

[ChainSecurity wrote the warning down in January 2025](https://1988724135-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FGiBcoId8OqxDuUU92hwi%2Fuploads%2F9kz0ytR9bg9ulIBbgObc%2FChainSecurity_Summer_fi_Summer_Earn_Protocol_audit.pdf?alt=media&token=05bf3eff-fd4b-455d-828a-a0cdad03aa9d), and Summer.fi replied that future Arks would need a way to be fully emptied before removal, then moved on.

**[Later that year, on a different vault](https://forum.summer.fi/t/sip2-39-offboard-the-silo-susdx-usdc-127-market-from-the-arbitrum-usdc-vault-using-sweep-via-timelock/465), the DAO proved it could execute exactly that kind of removal in seventeen days when it chose to.**  
  
**[Everything downstream of the exploit worked as advertised](https://x.com/summerfinance_/status/2074522409869115468):** The Guardian Module paused four chains and found it had no authority on a fifth, the Foundation multisig swept the donated Silo shares out of the vault, and the post-mortem arrived with technical honesty.  
  
[An acknowledged finding is not a closed one](https://1988724135-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FGiBcoId8OqxDuUU92hwi%2Fuploads%2F9kz0ytR9bg9ulIBbgObc%2FChainSecurity_Summer_fi_Summer_Earn_Protocol_audit.pdf?alt=media&token=05bf3eff-fd4b-455d-828a-a0cdad03aa9d). A capped market is not a removed one.  
  

**[ChainSecurity rated this finding Informational](https://1988724135-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FGiBcoId8OqxDuUU92hwi%2Fuploads%2F9kz0ytR9bg9ulIBbgObc%2FChainSecurity_Summer_fi_Summer_Earn_Protocol_audit.pdf?alt=media&token=05bf3eff-fd4b-455d-828a-a0cdad03aa9d), the lowest severity on the scale.**

  
_How many other "Informational" findings are still sitting in production, quietly carrying load?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
