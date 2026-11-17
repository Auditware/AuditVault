---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - os/macos
substate: "resolved"
weakness: null
enriched: true
date: 2019-09-14
submitted: 2018-12-21T16:40:13.889Z
bounty_usd: null
votes: 97
cve: []
program: "[[programs/slack|Slack]]"
reporter: "metnew"
source: "https://hackerone.com/reports/470637"
title: "User-assisted RCE in Slack for macOS (from official site) due to improper quarantine meta-attribute handling for downloaded files"
---
# User-assisted RCE in Slack for macOS (from official site) due to improper quarantine meta-attribute handling for downloaded files

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 97 | **Program:** Slack | **Disclosed:** 2019-09-14

- Report: [https://hackerone.com/reports/470637](https://hackerone.com/reports/470637)
- CWE: N/A
- Submitted: 2018-12-21T16:40:13.889Z

## Timeline

- **Report Filed**
- **2018-12-27** @bugtriage-alex: Thank you for your report @metnew.
 
We are looking into the behavior you described and will get back to you when we have more information.
- **2019-01-11** @metnew: WhatsApp triaged a similar vulnerability as valid
- **2019-01-20** @metnew: Hi Slack!

I want to report this issue to IBB soon.
Could you update about the status of this vulnerability?
- **2019-01-21** @metnew: Telegram confirmed this issue.
WhatsApp fixed this issue in the latest release.
- **Report Triaged**
- **2019-01-28** @metnew: Great!

Thanks for the update, I thought you've declined to fix it.
- **2019-01-31** @metnew: @maxfeldman 
I recommend testing auto-update functionality before releasing a version with a fix for this. It might be possible that GateKeeper will apply `com.apple.quarantine` to a new version of  Slack.app.
- **2019-02-15** @metnew: Hi @maxfeldman, it's almost 2 months passed since the original date of reporting.
Any progress on this?
- **2019-02-22** @maxfeldman: Hey @metnew,

Thanks for your patience! We're going through QA now and are hoping to have this out with the next release.

Thanks!
Max
- **2019-04-02** @metnew: Hi @maxfeldman, any updates?
- **2019-04-03** @maxfeldman: Hey @metnew! We're hoping to wrap QA up on this shortly!
- **2019-05-03** @metnew: @maxfeldman, it's almost five months since the report date now :(
- **2019-05-07** @maxfeldman: Hi @metnew - thank you for your patience while we work on this!
- **2019-06-12** @metnew: So, @maxfeldman and @slack, it's more than six months since the reporting date.

I don't want to wait until the macOS 15 will resolve the issue by itself, and your program will say "Ooops, it's not valid now, closing as Informative". 

I'm pausing 5 reports from been disclosed because of Slack, and I'm sure that at the end I'll receive a shi**y bounty and disallowance of public disclosure on the next few months from your program.

1. Could we disclose this report before the fix? 
2. Could you say when the fix will be deployed?
- **2019-06-13** @maxfeldman: Hey @metnew - sorry for the delay!

We're transitioning our program over to reward-on-triage (instead of reward-on-resolution), so I'll be rewarding this now. FYI - our policy is to reward valid issues which we resolve. So in this case, we will be rewarding. We do allow public disclosure on resolved reports. So please feel free to submit any other issues you have found, and we will work to reward them as soon as possible, though the fixes will be done with respect to their severity. To answer:

1. Unfortunately not, but we can disclose after confirmation of resolution!
2. We actually believe our most recent version of the app has fixed this issue, would you mind confirming?

Thanks!
Max
- **Bounty Awarded**
- **2019-06-13** @metnew: OMG, cool, thanks, Slack!

> Sorry me, I was a bit angry about these messages that "the fix is soon/it's already on QA/please be patient" and similar.

It's great if the resolution is soon! Impatiently waiting for it!

Also, I was able to repro the vuln on the last version.
- **2019-06-13** @maxfeldman: Thanks for the update! circling back with the team to figure out why the patch isn't fixed - will update you ASAP!
- **2019-07-15** @maxfeldman: @metnew quick update - still looking into this!
- **2019-08-08** @metnew: The vulnerability is fixed @maxfeldman (tested on 4.0.1)
- **2019-08-13** @metnew: The vulnerability is fixed, @maxfeldman (tested on 4.0.1)
- **2019-08-15** @metnew: @maxfeldman let's resolve this ticket maybe?
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
