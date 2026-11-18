---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
  - os/macos
  - vuln/command-injection
  - vuln/code-injection
  - impact/rce
  - trigger/one-click
  - trigger/victim-interaction
substate: "resolved"
weakness: null
enriched: true
body: true
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

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

## Summary

### **GateKeeper/Quarantine bypass for downloaded files**

Lack of `com.apple.quarantine` meta-attribute for downloaded files allows a remote attacker to send an executable file that won't be checked by Gatekeeper .

### File opening **doesn't trigger native alerts** from GateKeeper/Quarantine

> Downloaded executable files lack `com.apple.quarantine` meta-attribute => no alerts about launching an executable from the web will appear.

### Code execution after opening

Opening a downloaded `.terminal` file in Slack via "Shift + Click"  (or in Finder) immediately leads to running attacker's code on a target device.

### `.terminal` file

1. Opening leads to command execution.
2. Looks safe - XML file.
3. Downloaded `.terminal` file **couldn't be opened** if application sets quarantine meta-attribute properly. However, Slack (Direct Download) doesn't do that.

## Attack scenario

1. Attacker sends `exploit.terminal` to the victim. File looks like a plaintext file in preview.
2. Victim opens `exploit.terminal` file via "Shift + Click" (or via Finder)
3. No alert from Gatekeeper about unsigned executable
4. No alert about running executable file downloaded from the web
5. Shell commands from `exploit.terminal` get executed with user-level privileges.

## Version

Decribed scenario is reproducible in Slack 3.3.3 Direct Download.
Slack from AppStore has correct quarantine rules and isn't vulnerable.

## Additional details

`exploit.terminal` attached + Screencast attached.

### Quarantine
macOS is build in such way that OS will ask user before opening any downloaded and potentially launchable (in default setup) files. This rule applies to `.terminal` files too.

### TL;DR: 
- no quarantine -> `exploit.terminal` is launchable in 1 click without warning a user with popups
- quarantine -> no immediate launch for all files (2 popups) +  no RCE is possible if GateKeeper level set to "AppStore only"

## Impact

## Impact

Attacker could send a crafted `.terminal` file to the victim, which will be executed immediately after opening this file via "Open" button or in Finder. 

The attack scenario requires a certain level of user interaction. 
But the file looks safe and the victim doesn't expect that it'll be launched immediately

### Additional Impact

GateKeeper bypass allows running arbitrary apps in environments hardened with Gatekeeper settings set to "AppStore only".

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
