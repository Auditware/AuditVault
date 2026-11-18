---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
body: true
date: 2021-09-12
submitted: 2020-04-21T00:58:53.116Z
bounty_usd: null
votes: 20
cve: []
program: "[[programs/monero|Monero]]"
reporter: "thecharlatan"
source: "https://hackerone.com/reports/854726"
title: "Unix time unlock_time values have dangerous validation rules enabling a number of exploits"
---
# Unix time unlock_time values have dangerous validation rules enabling a number of exploits

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 20 | **Program:** Monero | **Disclosed:** 2021-09-12

- Report: [https://hackerone.com/reports/854726](https://hackerone.com/reports/854726)
- CWE: Business Logic Errors
- Submitted: 2020-04-21T00:58:53.116Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

*Initially found by TheCharlatan, discussed with and expanded on by Isthmus, impacts all releases of monero and monero wallets*

## Description

The unlock_time field in monero transaction dictates when a transaction's outputs can be spent again. This rule is enforced by the consensus code in https://github.com/monero-project/monero/blob/master/src/cryptonote_core/blockchain.cpp#L3478 . The rule has two parts. If the unlock_time is below 500000000, it is interpreted as a block height and compared with the current block height. If the unlock_time in a used transaction input's previous output is below the current block height, a transaction using that output is valid. Otherwise it is invalid and not relayed.

If the unlock time is above 500000000, then it is interpreted as unix time in seconds. However, the unlock_time is not compared to the network or rather block time, but to the local time of the machine running the monero node. Using this local time is potentially problematic for the following reasons.

## Exploits

Through consuming outputs locked by carefully chosen unlock_time values, it is possible to poll the local time of other nodes. The attacker can generate any number of transactions encumbered with a spread of unlock_time values, for example with an unlock_time 20 blocks per the expected block time into the future and then spread out over intervals of seconds. The attacker then creates transactions consuming these locked outputs and connects two nodes to the node she wants to spy on. She sends the transaction from one of the nodes to the node she wants to spy on and then checks if the other node receives the transaction. If the consumed unlock_time is invalid by the consensus rules for the attacker and the greater network, but valid for the surveiled node, the attacker will get the transaction relayed to her other node as well. This then indicates that the local time on the surveiled node matches the time on the attacker's transaction. Using a binary search methodology, the attacker can then pinpoint the node's time within a precision of seconds.

If such a node is found with a different clock (running late or early), or if the attacker can manipulate a node's local time through another channel, we identified two additional ways to exploit the current unlock_time validation.

Assume that a node has a clock running forward (showing a higher unix time). The attacker then creates a transaction consuming at least one output with a high enough unlock_time that it is invalid by the clocks of most node's on the netowrk, but valid for the node where the clock runs forward. If the attacker relays this transaction to the victim's node, the node will validate it as a valid transaction. This is especially useful for the attacker in the context of mining. For Example if the victim's node is a large mining pool, this can be used to make the pool expend work on a block that is not valid with the locked transaction included by the consensus rules of the rest of the network. If the attacker is a mining pool herself, she can use this to increase her profit.

If a node has a clock running behind (showing a lower unix time), the attacker can trick it into thinking that a chain that is valid by the rest of the network's consensus rules, is invalid to the attacked node. By continuously submitting transactions consuming an unlock_time encumbered output with a value just later than the victim node's clock, the node will never accept the network's best chain as valid. This would be a very effective way for an eclipse attack, even allowing the attacker enough time to feed it a "slower" malicious chain without expending too much proof of work.

## Recommendations

We believe that these scenarios are serious enough to warrant a change away from the current consensus rules for interpreting unix time unlock_time values. Consensus rules must react to consensus variables (e.g. miner-reported block time). The local time should not be taken into account any more. Instead, an aggregation of previous block time values should be used.

A similar problem existed in bitcoin's nlocktime field. However this problem was less serious at the time, since the nlocktime semantics are different compared to monero's unlock_time (nlocktime's influence is on the finality of the transaction itself, not a later transaction), and since the last block's timestamp was used instead.  It was fixed through BIP113: https://github.com/bitcoin/bips/blob/master/bip-0113.mediawiki , by using the median timestamp of the past 11 blocks to determine if an unlock time is valid. The fix was also a required step for the deployment of the CSV and CLTV opcodes, which adopt a similar output locking mechanism to the one of monero's unlock_time.

We therefore propose to also use the median timestamp over the past 60 blocks as calculated in https://github.com/monero-project/monero/blob/master/src/cryptonote_core/blockchain.cpp#L3592 , to verify the unlock_time. In fact, it looks like the cryptonote developers intended to implement something along these lines by reading both the function signatures and the comments around this line. Currently this median is used to check that a new block's timestamp is strictly increasing compared to the median. A proof of concept patch was written to use this median timestamp calculation in the unlock time.

Since the exploits do not require changes to the monero software, but rather some minor scripting work to generate the locked transactions, no proof of concept is provided.

## Patch:

We provide a proof of concept patch to the validation code and the wallet code in monero. This should be tested extensively before deploying, since it touches key functionality of monero. We also provide a patch to the wallet code, however this needs some additional discussion, since it touches quite a few unrelated components in its current form.

## Impact

Without any additional assumptions, the attacker can get the local time of another node.
Under the assumption that a node's local time is off, the attacker is able to launch an eclipse attack.
Additionally, if the node is mining, the attack can diminish its profit.

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-04-23** @thecharlatan: Sorry about the whitespaces. I attached them in a nicer format now. NB that they are mainly a POC to convey the idea and will probably require some overhaul, since previously included and validated transactions might not be validated anymore under the new rule. I am also touching a bunch of superfluous lines in my wallet patch, since the costness of some functions has changed.
- **2020-04-28** @moneromooo: I might have misunderstood your report then, since what I knew about was a transient issue only. I'll re-read soon. Thanks for the patch.
- **2020-04-28** @moneromooo: I read again. I don't see why you say "since previously included and validated transactions might not be validated anymore under the new rule". AFAICT, this can't happen beyond some seconds if a clock is off (I guess up to a couple hours if the clock is really borked). I think your "By continuously submitting transactions consuming an unlock_time encumbered output with a value just later than the victim node's clock, the node will never accept the network's best chain as valid." claim is wrong. Did you try it ? I do not see why the older blocks would not be seen as valid after the clock offset has passed. All you should be able to do is keep the target node away from the tip of the chain by as much as its clock offset. Am I missing something ?
- **2020-04-28** @moneromooo: The patches look good at first glance. The daemon should just use the median of whatever it's got available at chain start, rather than the local time though (unless you have a reason for this ?). The wallet should default to local time if a daemon is not available.
- **2020-04-28** @thecharlatan: Thanks for the replies. 
> I don't see why you say "since previously included and validated transactions might not be validated anymore under the new rule". AFAICT, this can't happen beyond some seconds if a clock is off (I guess up to a couple hours if the clock is really borked). 

If a previously unix time locked transaction is spent immediately after its expiry under the old rules, the new rules will not accept that spend, since the median time lags the clock time by about half of what the median time timestamp inclusion window is. So I think in the case of the current CRYPTONOTE_BLOCK_FUTURE_TIME_LIMIT, this would be about 30 minutes.

> I do not see why the older blocks would not be seen as valid after the clock offset has passed. All you should be able to do is keep the target node away from the tip of the chain by as much as its clock offset. Am I missing something ?

I don't think you were missing anything, I was just not being precise enough with my description. What I meant with the sentence you are quoting is that with a big enough time discrepancy and continuously submitted timelocked transactions, the node will never catch up with the main tip. It will always lag behind whatever its time delta is. If the time delta is large enough the attacker can launch an eclipse attack within it. However, as you correctly say, if enough time passes, the node will accept blocks from the best chain again. Its success is very much dependent on how much time delta wiggle room the attacker has.

> The daemon should just use the median of whatever it's got available at chain start, rather than the local time though (unless you have a reason for this ?). The wallet should default to local time if a daemon is not available.

I tried to keep true to the check_block_timestamp logic, where when not enough blocks are available yet, no guarantees on the time are made - I don't think this a good idea though and actually just a redundant check over what is already checked in check_block_timestamp. Dynamic median calculation if not enough timestamps are available makes more sense to me as well. So in get_adjusted_time , if the are not enough blocks yet, the offset should just be 0. However, due to the potential issues between the old and new rules I mentioned before, we probably need an activation height anyway.

> The wallet should default to local time if a daemon is not available.

Agreed.
- **2020-08-03** @moneromooo: https://github.com/moneromooo-monero/bitmonero/tree/dul (at last).
I've left the current time for the first 60 blocks, it's just the first 60 blocks anyway.
The patch is a bit simpler than yours, not sure if you  had something subtle here that I missed.
- **2020-09-18** @thecharlatan: The patch made it in to the newest release! 
I hope we can publish the information here soon after activation at block height 2210000.
- **2020-09-24** @moneromooo: Sure, you can publish it when you want, since there's nothing exploitable really.
- **2020-09-24** @thecharlatan: I agree that the eclipse attack and time polling is not serious enough to wait, but I don't feel quite comfortable with the miner attack. Instead of creating a stressful situation for them (checking their clocks and NTP configuration) I would rather wait.
- **2020-09-24** @moneromooo: Sure, waiting's fine too.
- **2020-10-17** @thecharlatan: Seems like everything activated fine, so I think this can be disclosed now.
- **Report Resolved**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
