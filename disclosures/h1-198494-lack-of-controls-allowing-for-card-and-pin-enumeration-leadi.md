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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

**Summary:**
The pages https://www.starbucks.com/account/card/addcard and https://www.starbucks.com/account/card/Balance do not properly enforce security controls to limit POST requests. This bug allows attackers to successfully hijack a loaded Starbucks card and transfer all the funds into their own account. Cards linked with auto-reload features could exponentially increase fraud. 
*NOTE: You will need to pass primary authentication before testing these pages. I have set up a temporary account for this purpose.*

**Card Enumeration:**
In a POST request to the above https://www.starbucks.com/account/card/addcard URL, if an attacker sets the Register.MyCard attribute to “FALSE” they can enumerate the 16-digit Card Number without limits. 
Another important note is all Starbucks locations have unactivated cards at their registers. It is highly possible for a threat actor to obtain a 16-digit card number from the next card in line, and sit on the account until it has been loaded up. Furthermore, in my research I've discovered each card only increments a singular digit in their 16-digit number. Because of this, a threat actor can easily discern which cards are about to be purchased, as well as which cards have been recently purchased.
{F152532}

**PIN Enumeration:**
In a POST request to the second https://www.starbucks.com/account/card/Balance URL, an attacker can check the PIN of a card they’ve already added via the previous /addcard Card Enumeration method. 
If an attacker already knows the 16-digit card number (via Starbucks stores), with the original POST request to the https://www.starbucks.com/account/card/addcard URL, if an attacker sets the Register.MyCard attribute to “TRUE” they can enumerate the 8-digit PIN number without limits.
Due to this, an attacker is able to successfully test every PIN number against 16-digit card data.
{F152533}
{F152534}

**Fraud/Risk:**
If an attacker is able to successfully validate PIN and Card information, they now have full access to all funds in the account. At this point they are able to commit fraudulent purchases and even migrate funds off the account onto their own card. Cards linked with auto-reload features could exponentially increase fraud damages. 
{F152535}

**Documentation:**
My test card was used in this demonstration. On the attached image, you can see the card number ending in 4769 was successfully processed. In the second image, you can see the PIN correctly enumerating once the PIN ending in 89 was processed.

**Remediation:**
My recommendation is to add velocity checks to both the /addcard and /Balance pages when attempting to add a Starbucks gift card. Additionally, CAPTCHA can be used as another authorization process. 

Please let me know if you need additional information to help triage this bug.
Thanks!

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
