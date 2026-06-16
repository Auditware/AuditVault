---
tags:
  - blockchain/bitcoin
  - blockchain/solana
  - sector/dex
  - sector/privacy
  - sector/stable
  - sector/token
title: "Atomic Wallet - REKT"
protocol: "[[Atomic Wallet]]"
date: 2023-06-02
loss_usd: 100000000
auditors:
source: "https://rekt.news/atomic-wallet-rekt"
excerpt: "Atomic Wallet blew up earlier this month. Even after two weeks, no official root cause has been announced, and the team's past attitude to security raises concerns. Will they ever admit what went wron"
genome:
  - "[[fot-slippage]]"
  - "[[oracle-freshness]]"
---
# Atomic Wallet - REKT

> **Loss:** $100,000,000 | **Date:** 2023-06-02 | **Audited by:** Unaudited

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2023/01/atomic-header.png)

>[Now I am become rekt…](https://www.youtube.com/watch?v=lb13ynu3Iac)

**Atomic Wallet [blew up](https://twitter.com/atomicwallet/status/1664946301815910400) earlier this month.**

While the news cycle became overrun by the regulatory [grudgematch](https://rekt.news/grudgematch-sec/), North Korea’s [Lazarus Group](https://rekt.news/big-phish/) have [remained busy](https://twitter.com/tayvano_/status/1668935273047261185)…

_…and the losses have continued to mount._

**Elliptic puts the [total](https://hub.elliptic.co/analysis/north-korea-linked-atomic-wallet-heist-tops-100-million/) at over $100M gone so far, with the worst-hit victim [losing](https://twitter.com/zachxbt/status/1665267820836319233) $8M USDT.**

_But the true total may be [far higher](https://twitter.com/tayvano_/status/1669009217053949952)._

Last August, when a [similar attack](https://rekt.news/unsolved-mystery/) ran rampant on Solana, we wrote:

>Panic, chaos, suspicion.
>
>All are inevitable reactions to an indiscriminate attack, where nobody knows who’s safe, and who’s next.

**With still no clarification from Atomic Wallet, this time is no different.**

Many have blamed the team’s past attitude to security concerns.

**In 2021, Atomic Wallet were informed of vulnerabilities in their product, but didn’t engage with the auditors, Least Authority, who were left with no option but to [publish a warning](https://web.archive.org/web/20220210153123/https://leastauthority.com/blog/disclosure-of-security-vulnerabilities-in-atomic-wallet/) to users.**

_Why didn’t Atomic fix this ticking time bomb?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/09/rekt-investigates-linebreak.png)

**Atomic Wallet addresses began to be [drained](https://dune.com/tayvano/atomic-wallet-hack) just before 10pm UTC on Friday 2nd June (with the [theft](https://etherscan.io/tx/0x9d6903b106a948d20f6b967a6fa1c2472b73868e00ca2496fc7c1f37d4cc1d86) of 304 ETH, worth over $500k).**

The following day, Atomic Wallet [acknowledged](https://twitter.com/atomicwallet/status/1664946301815910400) there was an issue, encouraging users to reach out via email. Since then, aside from downplaying the incident (“_less than 1% of our monthly active users have been affected/reported_”), the team have not stated what caused the hack.

_Do they even know [themselves](https://twitter.com/tayvano_/status/1668778037083791361)?_

The hack reportedly affected both desktop and mobile users, whose addresses were targeted on [13 chains](https://twitter.com/zachxbt/status/1665151915355676674).

The addresses were drained via a three step [system](https://twitter.com/tayvano_/status/1665069321255788544). Firstly, a direct transfer into a new address, where tokens were then swapped for the chain’s native asset and consolidated in a third wallet.

Tracing the funds (spearheaded by [ZachXBT](https://twitter.com/zachxbt/) and [Tayvano](https://twitter.com/tayvano_)) looks to have been a painstaking task, relying on individual user reports, and [linking](https://twitter.com/MistTrack_io/status/1665746407834124290) the above process to addresses which provided gas to the accounts in question.

Some funds ($1M) have apparently been [recovered](https://twitter.com/zachxbt/status/1665226056570118146), but the method is being kept quiet for now. And while some spend time helping victims, others look to [capitalise](https://twitter.com/zachxbt/status/1665121672918179840) on their desperation with a fake ‘refund’ airdrop.

_The [laundering](https://twitter.com/tayvano_/status/1668935289614790656) of funds has shown patterns [attributed](https://hub.elliptic.co/analysis/35-million-atomic-wallet-hacker-funnels-crypto-to-north-korea-s-favored-mixer/) to the Lazarus Group, being sent to the Sinbad BTC mixer (formerly Blender), a DPRK favourite._

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/03/rekt-linebreak.png)

**While the root cause is still to be identified, the hack may be [linked](https://twitter.com/IM_23pds/status/1668886220435509249) to a [BGP hijacking](https://www.techtarget.com/searchsecurity/tip/How-does-BGP-hijacking-work-and-what-are-the-risks) of Atomic Wallet traffic.**

BGP has [played a part](https://twitter.com/tayvano_/status/1668936939704307712) in a number of crypto incidents in the past. While this technique is [not enough](https://twitter.com/TalBeerySec/status/1668948073026928640) on its own to carry out the heist, it may have been combined with the vulnerabilities alluded to (though never specifically disclosed) by Least Authority, who faced [legal pressure](https://twitter.com/zooko/status/1668714413220851713) to take down their blog post.

A [leak of logged](https://twitter.com/tayvano_/status/1665192130539823106) sensitive data, such as was the case with the [Slope wallet](https://rekt.news/unsolved-mystery/) incident on Solana, is another possiblity. Hacken CEO Dyma Budorin has also listed some [potential scenarios](https://twitter.com/buda_kyiv/status/1666204090131439619).

---

Whatever the cause, the attitude of the Atomic Wallet team was [summed up](https://twitter.com/tayvano_/status/1665072163311820806) by Tayvano:

>Your security posture sucks, you refuse to listen to people, you aggressively silence people, and your products and services facilitate theft on a daily basis and have for years.

Without knowing a root cause, other wallet providers will be having a hard time checking if they might be susceptible to the same attack vector.

_With [plenty](https://twitter.com/cer_live/status/1666491318892126218) of shady looking options out there, it’s better to be safe than sorry._

**When it comes to securing your assets, any hint of a red flag should be reason enough look elsewhere.**

**And Atomic Wallet is covered in them.**

_Will they ever admit what went wrong?_

![](https://raw.githubusercontent.com/RektHQ/Assets/main/images/2021/08/rekt-outline-conc.png)
