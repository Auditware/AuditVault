---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-reflected
  - env/web
  - vuln/xss-reflected
  - vuln/xss
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Reflected"
enriched: true
body: true
date: 2017-09-24
submitted: 2017-08-09T09:03:33.645Z
bounty_usd: null
votes: 56
cve: []
program: "[[programs/slack|Slack]]"
reporter: "co3k"
source: "https://hackerone.com/reports/258198"
title: "The Custom Emoji Page has a Reflected XSS"
---
# The Custom Emoji Page has a Reflected XSS

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 56 | **Program:** Slack | **Disclosed:** 2017-09-24

- Report: [https://hackerone.com/reports/258198](https://hackerone.com/reports/258198)
- CWE: Cross-site Scripting (XSS) - Reflected
- Submitted: 2017-08-09T09:03:33.645Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

The Custom Emoji Page has a Reflected XSS in building flash message.

The following is the PoC.
https://{team}.slack.com/customize/emoji?added=1&name=vuln"><script>alert(0);<%2Fscript>

## Timeline

- **Report Filed**
- **2017-08-09** @co3k: Of course it is a cross-team exploitation because the team name of URL is easy to guess.
- **2017-08-09** @co3k: And, of course, it could be able to steal a username and password information by creating a fake login form.
- **Report Needs More Info**
- **Report New**
- **2017-08-09** @maxfeldman: @co3k do you have a screenshot of the alert box occurring in Firefox? I tested this in Firefox and see the same results as @bugtriage-josh. Thanks!
- **2017-08-10** @co3k: Oh, it might need some conditions.

I tested with voyagegroup team (My company team) first, and I got a result as the F211095 screenshot.
{F211095}

But I can't reproduce it in my personal team (as like F211070 result).

My company team has many of emojis, but my personal team does not.
- **2017-08-10** @co3k: My company team result has an output like `Here's what it looks like :vuln">: in a sentence. `. But my personal team and F211070 just say `Your new emoji has been saved!` only. The vulnerability point might be this output.
- **Report Needs More Info**
- **Report New**
- **2017-08-14** @maxfeldman: Hey @co3k,

We believe we've fixed this issue - would you mind verifying that the patch has made it to your environment?

Thanks!
Max
- **2017-08-15** @co3k: Hi, @maxfeldman 

Thanks for your work, but I cannot confirm the vulnerability is fixed in my team. Isn't the patch applied yet?
{F212813}
- **Report Triaged**
- **2017-08-18** @co3k: @maxfeldman
Hi, this vulnerability might be fixed now in our environment . Thanks for your great work!!
- **Report Resolved**
- **Bounty Awarded**
- **2017-08-20** @co3k: @slack, @maxfeldman
Thanks for your great work again!

a $500 bounty is for "Tier 2: Medium Severity Bugs" (XSS that affects other teammates within a team).
But this XSS is a reflected XSS, so you can attack other team without any stored data on the victim team. I think that it should be "Tier 1: High Severity Bugs" (XSS that affects more than one team (cross-team exploitation)).

Is there needed some complex conditions to fire this vulnerability?

Thanks,
Kousuke
- **2017-08-22** @maxfeldman: Hi @co3k,

We actually miscategorized this as a self-XSS (we thought it was reflected XSS but only for the original uploader of the emoji). After further inspection this could indeed have been leveraged against other teammates. However, the malicious payload needed to be stored by the attacker first, so this could only exist within a team. This is why when we tried to use your original reproduction link it did not execute for us when we tested it - that payload did not exist in our teams. However, as this was a stored XSS with a worse impact than just reflected, we're adding an additional bounty.

Thanks!
Max
- **Bounty Awarded**
- **2017-08-22** @co3k: Hi, @maxfeldman, thanks for your reply.

> malicious payload needed to be stored by the attacker first

I've searched custom emoji page of our voyagegroup team by the following keyword.

* vuln ... not matched
* "> ... not matched
* script ...  not matched
* alert ... matched with ":alert:" emoji

So I've changed my payload to `?added=1&name=this_emoji_does_not_exist` and I've get the following result.

> Your new emoji has been saved!
> Here's what it looks like :this_emoji_does_not_exist: in a sentence. 

**Of course this emoji does not exist in our team.** IN OUR TEAM, the "Here's what it looks like ... in a sentence" message appears by any "name" parameter value (EVEN IF IT IS NOT STORED).

I think the attacker didn't need store a malicious data with some conditions. I'm sorry to trouble you, but could I ask you to do inspect or explain to solve my question?

FYI, our team has 1601 emojis.
- **2017-08-23** @maxfeldman: @co3k no trouble at all, we're happy to dig deeper into this and reward you fairly!
- **Bounty Awarded**
- **2017-08-24** @co3k: @maxfeldman, @slack
Thanks for your great and fair job! All my questions were resolved.
I've come to love Slack more and more.

Kind regards,
Kousuke
- **2017-08-24** @co3k: Can we disclose this report?

Thanks,
- **Agreed On Going Public**
- **Report Became Public**
