---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2017-07-01
submitted: 2017-01-15T02:39:58.133Z
bounty_usd: null
votes: 18
cve: []
program: "[[programs/starbucks|Starbucks]]"
reporter: "kylecolson"
source: "https://hackerone.com/reports/198494"
title: "Lack of Controls Allowing for Card and PIN Enumeration Leading to Fraud"
---
# Lack of Controls Allowing for Card and PIN Enumeration Leading to Fraud

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 18 | **Program:** Starbucks | **Disclosed:** 2017-07-01

- Report: [https://hackerone.com/reports/198494](https://hackerone.com/reports/198494)
- CWE: N/A
- Submitted: 2017-01-15T02:39:58.133Z

## Timeline

- **Report Filed**
- **Report Duplicate**
- **2017-01-17** @kylecolson: Hi @sharpie! I'm confused as to why this was marked as a duplicate and closed, but then you mentioned you are reviewing it. 
Please note, while similar in nature, this is a different attack vector than (#194318) and should be considered an additional security bug. 

Please let me know if you need anything in the meantime! :)
- **Report Reopened**
- **Report Needs More Info**
- **Report New**
- **2017-02-04** @kylecolson: Any update?
- **2017-02-21** @verona: @kylecolson, Thanks for patience on this one.

It took some time as we were trying to validate your claim of sequential card numbers. We found that response length can't be solely used for determining validity of card number as our tests yielded same response lengths for valid and invalid card numbers. We had also added rate limiting for add card and balance queries too, which should resolve the risk. Can you please validate?

Thanks,
@verona
- **2017-03-01** @kylecolson: Hi @verona -- thank you for the update. I'm not sure where the disconnect is occurring, as I'm seeing a pretty clear difference in response length for valid and invalid cards.

Either way, this is a moot point, as I'm no longer able to perform card enumeration :) 

Confirmed, your latest patch now prevents my previous attacks against add card and balance queries. 
Great work!
- **Report Triaged**
- **2017-03-28** @kylecolson: Hi @verona and @starbucks 

Since this ticket is still open, I wanted to reiterate the danger of these vulnerabilities. As of late, an attack called GiftGhostBot has been seen in the wild exploiting the exact vulnerabilities I've submitted:

https://www.grahamcluley.com/giftghostbot-malicious-bot-attempting-compromise-gift-cards-across-1000-websites/
And
https://www.theregister.co.uk/2017/03/24/giftghostbot_harvests_giftcard_creds/

I ask you again to consider this in scope so other vulnerable endpoints may be discovered. 
Either way, if you need anything else from me to close this ticket, please let me know. 
Thanks!
- **2017-03-31** @verona: Thanks @kylecolson for additional details. Please allow us little more time for getting back to you.

Thanks,
@verona
- **2017-05-08** @kylecolson: Hi @verona and @starbucks
There has been no additional activity on this ticket for about a month now. May we go ahead and disclose, or are you still investigating this issue?
- **Report Resolved**
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **2017-06-15** @kylecolson: Public disclosure?
- **Report Became Public**
