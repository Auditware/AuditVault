---
tags:
  - blockchain/bitcoin
  - sector/dex
  - sector/stable
  - impact/loss-of-funds/direct-drain
  - precondition/insider
title: "AlexLab - Rekt II"
protocol: "[[Alexlab]]"
date: 2025-06-06
loss_usd: 16180000
auditors:
source: "https://rekt.news/alexlab-rekt2"
excerpt: "Over $16 million drained by a fake that tricked their vaults using their own permissions. AlexLab got rekt - again. Last year it was a leaked key, this time it’s bad logic. Two exploits, two attack ve"
genome:
  - "[[direct-drain]]"
  - "[[insider]]"
  - "[[access-roles]]"
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# AlexLab - Rekt II

> **Loss:** $16,180,000 | **Date:** 2025-06-06 | **Audited by:** N/A

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/alexlab-header.png)



_Lightning struck twice at AlexLab, and this time it brought friends._

  

**Just over a year after [losing $4.3 million to a compromised private key](https://rekt.news/alexlab-rekt), Bitcoin's self-proclaimed "finance layer" got stripped down to the studs again.**

  

This time, a cunning attacker exploited AlexLab's self-listing verification logic, turning their permissionless token listing feature into a $16+ million liquidity siphon on June 6th.

  

While [AlexLab scrambled to blame Stacks blockchain's](https://x.com/ALEXLabBTC/status/1930971817738449002) "inability to detect failed transactions," someone was busy proving that the real failure was much closer to home.

  

**Armed with nothing but fake tokens and a deep understanding of AlexLab's architectural blind spots, the exploiter drained multiple asset pools in a single transaction, walking away with millions in STX, aBTC, sBTC, ALEX tokens, and stablecoins.**

  

_When your protocol gets exploited twice in 13 months using completely different attack vectors, are you building DeFi infrastructure or just expensive honeypots?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)
_Credit: [Reubs BTC](https://x.com/reubs_btc/status/1930932034689532092), [Crusader](https://x.com/Crusader__btc/status/1930934844785053892), [AlexLab](https://x.com/ALEXLabBTC/status/1930939119913542029), [Nolan-Exvul](https://x.com/ma1fan/status/1931615831072313647)_

  

**Friday morning, June 6th, while some of the world was still in shock about Trump and Musk’s alleged public break up, [Twitter user Reubs BTC was sounding alarms](https://x.com/reubs_btc/status/1930932034689532092) that would wake up more than just early traders.**

  

"Hold on tight friends. Looks like ALEXLabBTC has been hacked."

  

Within minutes, [Crusader on Twitter announced the carnage](https://x.com/Crusader__btc/status/1930934844785053892): "62 $BTC, 8M $STX, 119m $Alex, $1.7M USDT. Not again."

  

[AlexLab's damage control kicked in shortly after](https://x.com/ALEXLabBTC/status/1930939119913542029) with their trademark understatement: "We are aware of the malicious activities at ALEX."

  

**Platform activities were suspended faster than you could say "exit liquidity," while the team promised a full post-mortem "as soon as possible."**

  

_Two hours of radio silence later, [AlexLab finally admitted the obvious](https://x.com/ALEXLabBTC/status/1930971817738449002): they'd been exploited._

  

[Their explanation read like a polished exercise](https://x.com/ALEXLabBTC/status/1930971817738449002) in strategic blame assignment: "The attacker exploited a flaw in verification logic in the self-listing function by referencing a failed transaction, allowing a malicious token to bypass checks and transfer funds from liquidity pools."

  

But here's where it gets spicy. [AlexLab immediately pointed fingers at Stacks itself](https://x.com/ALEXLabBTC/status/1930971817738449002), claiming "the core issue stems from a current on-chain limitation, specifically the inability to reliably detect failed transactions on Stacks."

  

**Translation: "It's not our fault, it's the blockchain's fault."**

  

A couple of hours later, [AlexLab had tallied their official damage report](https://x.com/ALEXLabBTC/status/1931005560083628081): $8,373,227 across STX, sBTC, USDC/USDT, and WBTC.

  

[They promised](https://x.com/ALEXLabBTC/status/1931005560083628081) "full reimbursement in USDC" using their foundation treasury, complete with a slick compensation timeline and claim process.

  

**One small problem: the actual transaction data tells a very different story.** 
  
_What does the blockchain tell us?_

  

### The Chain Doesn’t Lie

  

_The blockchain reveals what really happened - and it's uglier than AlexLab's sanitized press release._
  
**Vault Stolen From:**  
[SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.amm-vault-v2-01](https://explorer.hiro.so/txid/SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.amm-vault-v2-01?chain=mainnet)

  

**Attacker’s Address:**
[SP2VCNXGRZCBTP8E9MQ6DJPFVXRBPWBN63FE06A1M](https://explorer.hiro.so/address/SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM?chain=mainnet)

  
**Stolen funds transaction:**
[0xe8b2ac705dcbb35d487a4efd7a0fe384bbad1d1d97ea970410ad82a3cd0d9daf](https://explorer.hiro.so/txid/0xe8b2ac705dcbb35d487a4efd7a0fe384bbad1d1d97ea970410ad82a3cd0d9daf?chain=mainnet)

  

**Here's what the attacker actually walked away with:**

  

8,403,867 STX ($5.54M)

50.74 aBTC ($5.43M)

12.76 sBTC ($1.35M)

119,419,656 ALEX tokens ($2.12M)

1,748,327 sUSDT ($1.74M)

  

**Total real damage: Over $16.18 million.**

  

That's nearly double what AlexLab officially reported.

  

**Either their accounting department needs new calculators, or someone's been playing fast and loose with the truth.**

  

_But how do you turn fake tokens into $16 million of real money?_

  

### How the Magic Trick Worked

  

_AlexLab built a vault system with permission controls. Someone figured out how to become the vault._

  

**Step one:** Deploy a malicious token called "ssl-labubu-672d3" - because naming your scam token after a cartoon character is peak 2025 energy.

  

**But this wasn't just any token - it contained a fake transfer function designed to drain AlexLab's vault.**
  
The exploit had nothing to do with AlexLab's claimed ["inability to reliably detect failed transactions on Stacks"](https://x.com/ALEXLabBTC/status/1930971817738449002) - it was a systematic vault heist using AlexLab's own permission system against them.

  

While [AlexLab pointed fingers at blockchain limitations](https://x.com/ALEXLabBTC/status/1930971817738449002), the real vulnerability was their lax vault access controls and misuse of smart contract functions.

  

_[Security researcher Nolan from Exvul broke down the real attack vector](https://x.com/ma1fan/status/1931615831072313647), revealing how the attacker weaponized AlexLab's vault permissions rather than exploiting any Stacks blockchain limitation._

  

**Step two:** Create a legitimate Labubu/STX pool, which automatically triggers AlexLab's set-approved-token function and grants vault permissions.

  

**Step three:** Enable farming by flipping the set-enable-farming flag to 9, unlocking the malicious token's transfer abilities.

  

**Step four:** Execute a single swap-x-for-y call. The real magic happens in the vault contract.

  

**When AlexLab's system calls the malicious token's transfer function using as-contract, it changes the transaction context - making the vault itself appear as the sender rather than the attacker.**

  

With vault-level permissions, the fake token's transfer function systematically drained every asset: STX, aBTC, sBTC, ALEX tokens, and sUSDT - all transferred directly to the attacker's address.

  

One transaction and the entire vault was drained. Mission accomplished.

  

**Someone either spent serious time studying AlexLab's code, or they had a front-row seat to its development.**

  

_But wait - didn't AlexLab  just get audited?_

  

[AlexLab had recently invested in comprehensive security reviews](https://x.com/ALEXLabBTC/status/1925389232584970512) from two firms - [Clarity Alliance](https://cdn.alexgo.io/pdf/ALEX_Clarity_Alliance_2025-05-16.pdf) and [CoinFabrik](https://cdn.alexgo.io/pdf/ALEX_DAMM_Audit_2025-05.pdf) - both delivering audits in May.

Here's the catch: they were auditing AlexLab's upcoming DAMM (Discrete Automated Market Maker) system, scheduled for July launch.

The live vault infrastructure that actually got exploited? Outside the audit scope.

  

**The security firms did exactly what they were contracted to do - audit the code they were given.**

  

_When your future product gets bulletproof security while your live system gets drained, who's really setting the priorities?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)





_Two exploits, thirteen months, same protocol - different playbook entirely._

  

**First time around, [AlexLab lost $4.3 million](https://rekt.news/alexlab-rekt) to a compromised private key.**

  

This time, they lost almost 4 times that amount to someone who simply understood their code better than they did.

  

While AlexLab scrambles to blame Stacks blockchain limitations, the attacker already cashed out with cartoon-named tokens and a masterclass in vault exploitation.

  

Their compensation promises sound generous until you realize they're offering to cover $8 million when the real damage hits $16 million.

  

Meanwhile, users who trusted a protocol fresh from two security audits are learning that smart contract reviews apparently don't cover the smart contracts that actually matter.

  

**AlexLab survived their first rekt story, but lightning striking twice suggests this isn't bad luck - it's bad architecture.**

  

_If your DeFi protocol gets exploited twice using completely different attack vectors, are you really building financial infrastructure, or just running an expensive bug bounty program for hackers?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
