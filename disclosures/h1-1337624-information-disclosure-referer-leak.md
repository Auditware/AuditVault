---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
  - vuln/info-disclosure
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
body: true
date: 2022-02-01
submitted: 2021-09-12T19:40:55.938Z
bounty_usd: null
votes: 42
cve: []
program: "[[programs/brave|Brave Software]]"
reporter: "kkarfalcon"
source: "https://hackerone.com/reports/1337624"
title: "Information disclosure-Referer leak"
---
# Information disclosure-Referer leak

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 42 | **Program:** Brave Software | **Disclosed:** 2022-02-01

- Report: [https://hackerone.com/reports/1337624](https://hackerone.com/reports/1337624)
- CWE: Information Disclosure
- Submitted: 2021-09-12T19:40:55.938Z

## Report body

Public report body - fetched from `https://hackerone.com/reports/<id>.json` (the site's own disclosed-report data route).

Assigned to: Brave
Assigned by: Kirtikumar Anandrao Ramchandani
Assigned on: 13/09/2021
Browser information used to test (Up to date):
```
Brave	1.29.79 Chromium: 93.0.4577.63 (Official Build) (64-bit)
Revision	ff5c0da2ec0adeaed5550e6c7e98417dac77d98a-refs/branch-heads/4577@{#1135}
OS	Windows 10 OS Version 2009 (Build 19043.1165)
```

Vulnerability name: Information Disclosure
Vulnerability description: Brave browser has a function of    `New Private Window with Tor`. The browser when used with Tor shouldn't leak the referer.
Steps to reproduce:
1. Visit [exploit].
2. Click on `https://www.whatismybrowser.com/`.

Expected behavior: It should have shown a blank `referrer`
Actual behavior: It shows the referrer as: `kirtikumarar.com` which was the host from where we navigated

To know expected behavior, please refer to the below screenshot:
{F1445735}

Video POC showing the expected behavior can be found below:

{F1445736}

[exploit]: https://kirtikumarar.com/referrer/top-page.html

## Impact

1. This will leak users information
2. In the Tor network, we don't have common URLs as we have in the browsers. They usually are something like `dhxnafkaxlxdnackeudxdca.onion`, those can be leaked.

## Timeline

- **Report Filed**
- **2021-09-13** @diracdeltas: thanks, we are investigating
- **Report Triaged**
- **2021-09-16** @kkarfalcon: Respected sir/ma'am,

Thank you very much quick updates. Can we please add @HomeSen into the report as a collaborator of this vulnerability? Thanks in advance. 

Regards,
Kirtikumar A. R.
- **2021-09-16** @diracdeltas: invited
- **External User Joined**
- **2021-09-17** @kkarfalcon: Thank you very much for the quick update. How can we acknowledge @homesen as the issue was triaged before he was added? Are we allowed to add another issue of Tor in this case itself?
- **2021-09-17** @diracdeltas: i'm not sure if that is possible. you can open a new issue though.
- **2021-09-17** @kkarfalcon: Ok, thank you for swift response, again. Making a report of Tor for a new case with poc.
- **Report Severity Updated**
- **Bounty Awarded**
- **2021-10-01** @kkarfalcon: Hello @diracdeltas,

Thank you very much for the swift update!

> we consider this a high privacy issue since it affects Tor

Reasonable. The idea of leaking `.onion` URLs of @homesen was a nice one. Due to the reason that I wasn't allowed to add him after completion of my report, he hasn't received an acknowledgment, anyway, we can acknowledge him? 

As per rules, we won't disclose the case until the case is patched. Thank you very much for your swift response and a really great co-operation with reporters. It was great working with the Brave team as always. Cheers!

Regards,
Kirtikumar A. R.
- **2021-10-01** @diracdeltas: Sorry I'm not sure how to acknowledge @homesen on this report. You might need to contact HackerOne support to ask them how to do this.
- **2021-11-08** @kkarfalcon: Friendly ping. As we're are planning to write a blog on this case, can you please provide consent? 

**Note: We will disclose the case if we have proper consent and also after a sufficient number of days- stable build. Once the stable channel is released, we'll wait until all the users receive the patch, and then, when the team is ready to make it public, we'll write about it. Unless we have proper consent, we won't make anything public.**

By that time, Happy Diwali. Thanks for your co-operation. :-)
- **2021-11-08** @diracdeltas: @fmarier is wrapping up the fix now and we're happy to review a blog post in the meantime.
- **2021-11-08** @kkarfalcon: Beginning to work on the blogspot today, we'll share it by tomorrow. Thanks for quick update. :)
- **2021-11-09** @fmarier: In addition to working on [finishing the Brave fix](https://github.com/brave/brave-core/pull/10760), I am also trying to see if this behavior can be specified in the relevant standards for the [Referer](https://github.com/w3c/webappsec-referrer-policy/pull/156) and the [Origin](https://github.com/whatwg/fetch/pull/1351) headers.
- **2021-11-09** @kkarfalcon: Hello,

Good morning. That's neat! The remaining all seems to be ok too, there doesn't seem to be any Omibox leakage too (From the available test cases). Once Nightly build with a patch is released, let us know. So, we can add the patch PoC to the blog. Thanks for a quick update, triage, and patch. 

Have a nice day!
- **2021-11-19** @fmarier: My fix has just been merged: https://github.com/brave/brave-core/pull/10760

It should be available in the next Nightly build tomorrow so if you'd like to re-test, that would be great.
- **2021-11-19** @fmarier: > next Nightly build tomorrow

That will be going out in approximately 12-16 hours. So if you re-test in 24 hours, you should have the fix.
- **2021-11-19** @kkarfalcon: Hi,
Ok yes. I will re-test and revert back to this report. By that time, can PTAL on the mail I have sent related to blog? Thanks!
- **2021-11-19** @kkarfalcon: Hi,

Neat. The issue has been patched in the:
```
Brave	1.34.23 Chromium: 96.0.4664.45 (Official Build) nightly (64-bit)
Revision	76e4c1bb2ab4671b8beba3444e61c0f17584b2fc-refs/branch-heads/4664@{#947}
OS	Windows 10 Version 21H1 (Build 19043.1348)
```
The stable release is after a week or two? Great work!
- **Report Resolved**
- **2021-11-19** @fmarier: Right now it's available in Brave 1.34, which is scheduled for general release in early January: https://github.com/brave/brave-browser/wiki/Brave-Release-Schedule#release-channel-dates

However, I have requested an uplift to 1.33: https://github.com/brave/brave-core/pull/11186. If that's approved by the release team, then it will go out to users in early December.
- **2021-11-20** @kkarfalcon: > Right now it's available in Brave 1.34, which is scheduled for general release in early [January](https://github.com/brave/brave-browser/wiki/Brave-Release-Schedule#release-channel-dates)

In my current Brave build, it isn't reproducible (before December itself?). 

> However, I have requested an uplift to [1.33](https://github.com/brave/brave-core/pull/11186). If that's approved by the release team, then it will go out to users in early December.

The issue isn't reproducible in 1.32 too. Was it backported? Tested on:
```
Brave	1.32.106 Chromium: 96.0.4664.45 (Official Build) (64-bit)
Revision	76e4c1bb2ab4671b8beba3444e61c0f17584b2fc-refs/branch-heads/4664@{#947}
```
- **2021-11-20** @fmarier: No, it wasn't backported. It's only fixed in 1.34.

I just re-tested myself in 1.33 and it's leaking Referer & Origin there. Are you sure you're running the same test as before?
- **2021-11-20** @kkarfalcon: Yes on =<1.33 it is leaking. Sorry was running another referrer test case.
- **2021-11-26** @fmarier: My fix was uplifted into 1.33 and so it will be part of the December release of Brave.
- **2021-11-26** @kkarfalcon: 3weeks from the date of release we will be making case/blog public or what is the time frame reporters need to follow as per the rules of Brave Program?
- **2021-11-26** @fmarier: > 3weeks from the date of release we will be making case/blog public

That sounds good. It will give people a good amount of time to upgrade to the latest version.
- **2021-11-27** @kkarfalcon: Fine sir.  Thank you!
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
