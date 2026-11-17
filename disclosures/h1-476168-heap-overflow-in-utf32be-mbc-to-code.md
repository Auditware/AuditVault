---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/critical
  - cwe/heap-overflow
  - env/web
substate: "resolved"
weakness: "Heap Overflow"
enriched: true
date: 2020-11-09
submitted: 2019-01-07T20:15:56.831Z
bounty_usd: 1500
votes: 3
cve: "CVE-2019-9023"
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "haquaman"
source: "https://hackerone.com/reports/476168"
title: "Heap overflow in utf32be_mbc_to_code"
---
# Heap overflow in utf32be_mbc_to_code

> **Severity:** Critical | **Bounty:** 1,500 USD | **Votes:** 3 | **Program:** Internet Bug Bounty | **Disclosed:** 2020-11-09

- Report: [https://hackerone.com/reports/476168](https://hackerone.com/reports/476168)
- CWE: Heap Overflow | CVE: CVE-2019-9023
- Submitted: 2019-01-07T20:15:56.831Z

## Timeline

- **Report Filed**
- **2019-01-07** @haquaman: Affects all currently supported versions of PHP
- **2019-01-18** @h1_analyst_leon: Hey @haquaman - Thanks for the submission. Your report is currently being reviewed and the HackerOne triage team will get back to you once there is additional information to share. Thank you for your patience!
- **2019-02-12** @haquaman: Hi,

Just checking up on this.

Cheers,

Hugh
- **2019-03-12** @haquaman: Hi,

Just checking how the triaging is going.

Cheers,

Hugh
- **2019-03-26** @haquaman: Hi,

Just checking on what the status on this and my other PHP bugs are?

Cheers,

Hugh
- **2019-04-08** @haquaman: Hi,

Just checking in on this. Haven't heard anything on any of my PHP bugs since mid January. Would be good if I could get any sort of update.

Cheers,

Hugh
- **2019-05-16** @haquaman: Hi @tuxedo,

It would be great it there was at least some update on my 9 PHP tickets. It has been quite a few months now. I'm just wondering whether I should be expecting something soon, or it might be another 5 months?

Cheers,

Hugh
- **Report Severity Updated**
- **Report Triaged**
- **Cve Id Added**
- **2019-07-05** @haquaman: Hi @tuxedo,

I would appreciate another update please. It's now been 2 months since triage, and 6 months since reporting these issues.

Cheers,

Hugh
- **Hacker Requested Mediation**
- **2019-10-10** @haquaman: Hi,

I'm yet to have an update from the mediation team. I was promised an update 7 days from Sept 12, and I reminded you that I hadn't had an update as of Sept 24. I still have not had an update from your team for this bug, and #476179 and #476178.

These bugs were all resolved upstream 9 months ago, and the last I have heard from the team on any of the tickets was 5 months ago. The mediation staff did not resolve this.

Can I enquire how much longer I need to wait to get an update, and a bounty decision? This delay and lack of response from your team makes me not want to work with Hackerone in the future.

Cheers,

Hugh
- **2020-01-06** @haquaman: Hi,

As I'm yet to have any update from the IBB team, and the mediation team, I've now made the lack of transparency from Hackerone public on twitter. You can see this at https://twitter.com/haquaman/status/1213987366337015809. Note that the details of the report aren't shared (even though the issues have long since been published upstream).

Ideally, Hackerone will investigate why the IBB team are so unresponsive, why the mediation team give unrealistic timeframes, and why the mediation team are also so unresponsive.

This whole process, spanning an entire year, makes me not want to continue using the Hackerone platform, as it is clear that the staff there do not care for the researchers at all.

Really all I have requested is a realistic expectation of a timeframe on when these issues will be resolved. In previous years this process has taken around 6 months, and I never felt like I was out of communication with the team. This time however I feel extremely disconnected with no responses from either IBB or hackerone themselves.

What has changed?

Cheers,

Hugh
- **Bounty Awarded**
- **Report Resolved**
- **Agreed On Going Public**
- **Report Became Public**
