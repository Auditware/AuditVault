---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/information-disclosure
  - env/web
substate: "resolved"
weakness: "Information Disclosure"
enriched: true
date: 2020-06-20
submitted: 2020-06-19T02:03:18.493Z
bounty_usd: null
votes: 12
cve: []
program: "[[programs/ratelimited|RATELIMITED]]"
reporter: "0xd0ff9"
source: "https://hackerone.com/reports/902322"
title: "Source code disclosure at ███"
---
# Source code disclosure at ███

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 12 | **Program:** RATELIMITED | **Disclosed:** 2020-06-20

- Report: [https://hackerone.com/reports/902322](https://hackerone.com/reports/902322)
- CWE: Information Disclosure
- Submitted: 2020-06-19T02:03:18.493Z

## Timeline

- **Report Filed**
- **Report Triaged**
- **2020-06-19** @gtsatsis: Hey there @0xd0ff,

Ouch, this is *very* awkward; apparently while transferring some stuff over I threw it in the public bucket and didn't pay attention to it.. Please hold while I go in and remove the file, as well as monitor everything that was possibly leaked.

I'll get back to you in a bit.

Thanks,
George
- **2020-06-19** @gtsatsis: I've gone ahead and removed the file from the data store, as well as purged the caches.

I'll be going through the files to get a general idea of when this could have happened and see what requires re-rolling.
- **2020-06-19** @0xd0ff9: :D
- **2020-06-19** @gtsatsis: Heya,

So, a bit of a longer description while the rerolling process is ongoing.

This data dump appears to be from a VM-to-VM migration during 2019, specifically with the RLAPI credentials being from a development environment of v3 ███

I can also see in the dump that our Matomo instance was there, it was a testing instance, which was retired long ago (thankfully).

I would request that you delete your locally stored copy of the data prior to the resolution of this report in a few minutes to an hour.

Anyhow, I'll go continue the re-rolling of the leftover API keys, and I'd like to once again thank you for your cooperation, and reporting this to us (well, me, since this is basically a two-man-show, and I'm the development part, haha!)

Cheers,
George
- **2020-06-19** @0xd0ff9: Okay, I will delete this source in my computer local storage after you resolve this report. Because I need to keep POC until this report resolve. Thanks.
- **Report Resolved**
- **2020-06-19** @0xd0ff9: Okay, I've already deleted this file from my local computer. Thanks for quickly resolve :D
- **Agreed On Going Public**
- **2020-06-19** @gtsatsis: Hey there,

I've begun the redaction process.

Thanks,
George
- **2020-06-19** @0xd0ff9: I see all sensitive are hide correctly. We can disclosure now (:D)
- **Agreed On Going Public**
- **Report Became Public**
