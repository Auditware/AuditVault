---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - env/web
substate: "resolved"
weakness: null
enriched: true
date: 2021-07-31
submitted: 2020-12-04T01:07:56.574Z
bounty_usd: 750
votes: 64
cve: []
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "abdullah-a"
source: "https://hackerone.com/reports/1050244"
title: "Two-factor authentication enforcement bypass"
---
# Two-factor authentication enforcement bypass

> **Severity:** High | **Bounty:** 750 USD | **Votes:** 64 | **Program:** Nextcloud | **Disclosed:** 2021-07-31

- Report: [https://hackerone.com/reports/1050244](https://hackerone.com/reports/1050244)
- CWE: N/A
- Submitted: 2020-12-04T01:07:56.574Z

## Timeline

- **Report Filed**
- **2020-12-04** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2020-12-04** @rullzer: Hi,

Thanks for your report.
I could verify your report.
We'll get back after analysis what is going on.

Cheers,
--Roeland
- **Report Triaged**
- **2020-12-04** @rullzer: Hi,

I think I found the root cause.
Can you try the patch in https://github.com/nextcloud/server/pull/24550 to see if that fixes the issue for you as well?

Thanks,
--Roeland
- **2020-12-05** @abdullah-a: Hi,

I confirm that the patch is working and the issue has been solved. 

Yours truly
- **Report Resolved**
- **2020-12-08** @abdullah-a: yes I would like that 

- name = Abdullah Alharbi @Eng_Abdullahx0
- name = Rayan Althobaiti @Diefunction

Thanks .
- **Bounty Awarded**
- **2020-12-10** @abdullah-a: thanks a lot , cheers
- **2021-03-15** @abdullah-a: hi @nickvergessen

By the way, can you request a CVE ID for it, please?

Thanks
- **Agreed On Going Public**
- **Report Became Public**
