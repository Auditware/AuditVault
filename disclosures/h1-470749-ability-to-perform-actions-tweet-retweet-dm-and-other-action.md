---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/business-logic-errors
  - env/web
substate: "resolved"
weakness: "Business Logic Errors"
enriched: true
date: 2019-09-26
submitted: 2018-12-21T20:48:10.158Z
bounty_usd: null
votes: 106
cve: []
program: "[[programs/x|X / xAI]]"
reporter: "antisocial_eng"
source: "https://hackerone.com/reports/470749"
title: "Ability to perform actions (Tweet, Retweet, DM) and other actions, unauthenticated, on any account with SMS enabled."
---
# Ability to perform actions (Tweet, Retweet, DM) and other actions, unauthenticated, on any account with SMS enabled.

> **Severity:** Critical | **Bounty:** undisclosed | **Votes:** 106 | **Program:** X / xAI | **Disclosed:** 2019-09-26

- Report: [https://hackerone.com/reports/470749](https://hackerone.com/reports/470749)
- CWE: Business Logic Errors
- Submitted: 2018-12-21T20:48:10.158Z

## Timeline

- **Report Filed**
- **2018-12-21** @antisocial_eng: This has massive potential to weaponise too. If you had a list of mobile phone numbers you could send thousands of SMS to attack a large subset of people at once. Say thousands of accounts all tweeting Elon Musk bitcoin scams.
- **2018-12-22** @antisocial_eng: In further research, I really do think this warrants discontinuing support of Twitter by SMS and SMS 2FA. This requires action? Why the wait?
- **2018-12-22** @antisocial_eng: Screenshot of a second PoC, I sent this tweet after chatting to the editor. He gave permission.
- **2018-12-22** @antisocial_eng: I know you covered this up.

I know you know what it is.

I know it can’t be fixed.

I’m going to write a blog covering this issue.
- **2018-12-25** @antisocial_eng: https://theantisocialengineer.com/2018/12/24/twitter-is-broken/

My next blog will show how HackerOne is complicit with this issue and others and should not be trusted. Merry Christmas.
- **2018-12-26** @asayler: @antisocial_eng, thank you for your report.

As you note, we have a blog post from 2012 discussing these sorts of known SMS weaknesses in non-shortcode countries: https://blog.twitter.com/engineering/en_us/a/2012/twitter-and-sms-spoofing.html. Are you able to demonstrate this issue on an account/phone number registered via a shortcode (such as a US number), or is this limited to numbers registered via longcode such as the UK 3 network?

Also, please note that we have an average HackerOne response time of 1 to 2 business days, and since you reported this issue on a Friday before a long holiday weekend, it's typical for us to not respond until the next business day (e.g. today). While this issue is fairly widely known (and thus your blog post doesn't really disclose anything new), we'd normally consider such disclosure to fall outside of HackerOne's published responsible disclosure practices (https://www.hackerone.com/disclosure-guidelines), thus making this report ineligible for a bounty. In the future, we'd appreciate it if you'd stick to the published HackerOne disclosure process.

Please let us know if you are able to demonstrate this issue on numbers from shortcode based accounts or otherwise bypass the protections mentioned in https://blog.twitter.com/engineering/en_us/a/2012/twitter-and-sms-spoofing.html. Otherwise, we'll close this out as a duplicate/known-issue.
- **Report Needs More Info**
- **Report New**
- **2018-12-26** @asayler: Thanks, @antisocial_eng. As noted in the 2012 blog post, we do offer users who have registered via longcodes the ability to set a PIN for SMS interactions: https://help.twitter.com/en/using-twitter/sms-pin (note, the PIN option is only available for accounts whose phone number is associated with a longcode-only network). If you believe this PIN option is not working for longcode network users or that PINs for long code users can otherwise be bypassed, please let us know. Otherwise, this is a known issue and limitation inherent to the global SMS ecosystem.
- **Report Needs More Info**
- **Report New**
- **Report Triaged**
- **2018-12-26** @antisocial_eng: Cringe. 

I am done, do what you want and I’ll work on adding pressure around this issue and your cover up so innocent users are safer from scams.
- **2019-01-02** @asayler: @antisocial_eng, we have fixed a bug that allowed spoofing of certain shortcode-associated accounts via the UK longcode. As of now, only longcode users should continue to be able to be spoofed (as was the case in 2012).

We also confirmed that you are correct that the current UI does not expose an option to set a PIN for longcode users. Legacy longcode users who previously set a PIN will continue to be protected by it, but current longcode users are unable to add a new PIN via the current UI.

The bulk of our users have shortcode-based accounts, and these accounts are protected against this type of spoofing. We're continuing to explore potential long term fixes to the SMS spoofing risk for our remaining longcode users. But since longcode users have been susceptible to this kind of spoofing for as long as Twitter has existed, we're not yet sure if or when we'll be able to fully resolve that risk.
- **2019-01-02** @antisocial_eng: Amazing! Can you confirm the bug fixed was due to assessing mobile numbers that had previously been ported vs HLR checks to current network provider? Eg what you did to deduce it was on a certain network...

When can we expect to see a UI change that supports PINs for longcodes?

I run a business doing stuff like  this, I don’t want money but can I get a shout out? Something to show this process has been logged and overseen by the official Twitter big bounty process... a tweet anything! My reason is this has bought a lot of media attention and would help me in business... vs say hacking a load of celebs and pointing them to my blog...
- **2019-01-02** @asayler: @antisocial_eng, we're still in the process of deicing if/how to address the PIN/longcode issue. We'll update here once we've reached a decision.

We're open to publicly disclosing this report once we decide on what, if any, further steps we plan to take. That's generally the extent to which we publicly recognize reporters for their efforts.

Thanks for helping to keep twitter secure.
- **2019-01-03** @asayler: @antisocial_eng we did some more checking and the PIN option is still available, but only to accounts associated with one of the Twitter longcodes. This is likely why you don't see it. That said, coupled with our previous fix, you should not be able to find an account that is both spoofable and for which setting a PIN is NOT an option. I.e. all remaining longcode accounts should be able to set a PIN. If you believe you can still spoof any account that is NOT capable of setting a PIN via the web interface as described at https://help.twitter.com/en/using-twitter/sms-pin, please let us know.

We're still evaluating potential long term mitigations related to SMS spoofing in general, but we plan to close this report soon as we believe we are back to the point where the mitigations published in the 2012 blog post are working again. The vast majority of Twitter users are on shortcode networks and should not be spoofable. The small minority of users on longcode networks should have the option of setting a PIN to prevent spoofing. If you believe this is not correct, please let us know.
- **2019-01-03** @antisocial_eng: In addition I feel an SMS should be sent to vulnerable users and default changes to account configurations should be made which enable a PIN. 

As for further testing I am unlikely to verify this or do further work because you’ve already opted out of paying for my time as it is.
- **Report Resolved**
- **Not Eligible For Bounty**
- **2019-01-03** @antisocial_eng: That’s cool, thanks.
- **External User Joined**
- **External User Removed**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
