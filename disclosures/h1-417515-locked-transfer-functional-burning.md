---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
body: true
date: 2019-07-09
submitted: 2018-10-02T10:43:45.526Z
bounty_usd: null
votes: 5
cve: []
program: "[[programs/monero|Monero]]"
reporter: "keejef"
source: "https://hackerone.com/reports/417515"
title: "Locked_Transfer functional burning"
---
# Locked_Transfer functional burning

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 5 | **Program:** Monero | **Disclosed:** 2019-07-09

- Report: [https://hackerone.com/reports/417515](https://hackerone.com/reports/417515)
- CWE: N/A
- Submitted: 2018-10-02T10:43:45.526Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:** Using the `locked_transfer` command in the monero-wallet-cli users can send outputs with high lock times like 1,000,000 blocks. A vendor will accept these transactions with no warnings and credit a user balance. The user can now withdrawal or sell this balance and the vendor is left with outputs that will not unlock for 1000s of years.

**Description:** 

This bug essentially exploits the use of the `show_transfers` command by vendors that credit balances, functionally the result is the same as the double output bug found a week [ago](https://github.com/monero-project/monero/pull/4438). It is presumed at this point that anything in the Cryptonote/ Monero protocol that can show a valid transfer in `show_transfers` will be accepted by vendors, even if it creates un-spendable or functionality un-spendable outputs.

## Releases Affected:

  *  0.12.3.0 Lithium Luna - All Operating Systems 
  *  Current Monero master 

This will also affect all Cryptonote coins with `locked_transfer` and exchanges that use `show_transfers`

## Steps To Reproduce:

  1. Transfer Monero or other Cryptonote coin to wallet-cli 
  2. Use `locked_transfer` set a high amount lockblocks, send to exchange or other vendor that will credit your balance.
  3. Sell, or withdrawal your currency on the exchange, leaving them with locked coins, the attacker only loses the minimal fee that the exchange charges, while the exchange is left with un-spendable coins. 

This bug has been tested against two separate exchanges with very small amounts of Monero, that will unlock after 4 months. This method will likely be effective against all exchanges that use `show_transfers` as a method of auditing incoming transactions (which i think is nearly all of them).  

P.S. Discovery of bugs like these would not be possible without the help of my coworkers at Loki, so i want to thank them for their help brainstorming on this one.

## Impact

This bug cannot be used to create new Monero but it can be used to attack Monero vendors with coins they can functionally never spend.

## Timeline

- **Report Filed**
- **Report Informative**
- **Agreed On Going Public**
- **2018-10-03** @keejef: Although correct with what you have said above, the result in this case is that nearly all exchanges/vendors still do not check whether transfers are locked or not. Which means the result is much the same as any actual bug which is executed to perform the same type of un-spendable output attack. This exploit could be seen as much more harmful to vendors because of the ease at which it can be executed, requiring no modification of client software.
- **2018-10-03** @anonimal: >Which means the result is much the same as any actual bug which is executed to perform the same type of un-spendable output attack.

You can abuse any software. Abusing a feature is not a bug. For example, `sudo rm -fr /` is not a bug in `rm` but rather an "exploit" of `sudo` to commit abuse. If one wrote the `sudo` authors telling them to protect against `rm` and `/` usage, ...well, you can imagine their response.

>all exchanges/vendors

Can you prove this? You've tested against all exchanges? Have you notified them of your testing?

Regardless, this issue is literally out of our hands as we are not responsible for Alice or Bob's transaction policy. If you're suggesting there be a redesign of the protocol/implementation, then you're welcome to join `#monero-dev` on Freenode or visit the monero repo on github to contribute development.

If you want a 2nd or 3rd or 4th opinion, we can have @moneromooo @fluffypony or @luigi1111w chime in. They'll be notified of this report.
- **2018-10-03** @keejef: The reason i disclosed this is so that the Monero team can contact exchanges and vendors that list Monero and tell them that this can potentially be used to replace their spendable coins with un-spendable ones, and that vendors that are affected should add checks to scrutinize incoming transactions locktimes. I don't have the contacts with all of the exchanges you guys are listed on so i don't know how to reach out to some of these guys. It is likely that a high proportion of Monero vendors are not checking locktime and are susceptible to this kind of exploit.

I'm not suggesting that there be a change in the protocol spec, I'm suggesting that this issue be disclosed to vendors who use Monero.
- **2018-10-03** @moneromooo: I guess we can ping exchanges to let them know to double check they do, can't hurt - I assume you've already told the two you've looked at.
- **2018-10-03** @keejef: I havent yet but i will do so now
- **2018-10-03** @fluffypony: Hi - I'll type something up and send it to the mailing list; the locktime stuff is pretty well-known as it affects Bitcoin-based cryptocurrencies as well. A key difference is that with Bitcoin the locktime doesn't let it enter a block until that height, whereas with Monero it goes into a block but can't be redeemed to that height. In both instances they are valid transactions that can be used to socially engineer someone if they're not paying attention.
- **Report Reopened**
- **Report Triaged**
- **Report Resolved**
- **Agreed On Going Public**
- **Manually Disclosed**
