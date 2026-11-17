---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/cross-site-scripting-xss-generic
  - env/web
substate: "resolved"
weakness: "Cross-site Scripting (XSS) - Generic"
enriched: true
date: 2019-08-28
submitted: 2018-12-17T14:00:58.680Z
bounty_usd: null
votes: 65
cve: []
program: "[[programs/kaspersky|Kaspersky]]"
reporter: "palant"
source: "https://hackerone.com/reports/463915"
title: "URL Advisor component in KIS products family is vulnerable to Universal XSS"
---
# URL Advisor component in KIS products family is vulnerable to Universal XSS

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 65 | **Program:** Kaspersky | **Disclosed:** 2019-08-28

- Report: [https://hackerone.com/reports/463915](https://hackerone.com/reports/463915)
- CWE: Cross-site Scripting (XSS) - Generic
- Submitted: 2018-12-17T14:00:58.680Z

## Timeline

- **Report Filed**
- **2018-12-19** @artem_baranov: Hi Wladimir.

Thx for your new report. A preliminary timeline for the fix is about 90 days. I'll get back to you later with our decision about payout.
- **Report Triaged**
- **Bounty Awarded**
- **Report Severity Updated**
- **Report Resolved**
- **2019-04-29** @palant: I can confirm that the URL from the message is being ignored now. Otherwise no relevant changes.
- **Agreed On Going Public**
- **2019-08-12** @palant: Just making sure you know: as discussed in #470547, I plan to publish a blog article on this issue next Monday (2019-08-19).
- **2019-08-16** @shmol: Hello, Palant,
Could you share with us a draft of your a blog article (its probably ready now) in the form, that is now?
You can use vulnerability@kaspersky.com mailbox for it.
Thank you in advance.
- **2019-08-16** @palant: You can see the draft under https://palant.de:5000/s3UpiDLH4h46H1q/.
- **2019-08-18** @shmol: Thank you.
- **2019-08-19** @palant: FYI: https://palant.de/2019/08/19/kaspersky-in-the-middle-what-could-possibly-go-wrong/
- **Report Became Public**
- **2019-10-04** @artem_baranov: @palant Could you please remove PoC from this report and from other reports already were disclosed or will have been disclosed in the future.
- **2019-10-05** @palant: I don't think that I can edit anything here, no way to remove attachments on my end.
- **Report Title Updated**
