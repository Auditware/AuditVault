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
