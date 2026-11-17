---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/use-of-hard-coded-cryptographic-key
  - env/web
substate: "resolved"
weakness: "Use of Hard-coded Cryptographic Key"
enriched: true
date: 2020-03-12
submitted: 2019-04-08T09:20:55.916Z
bounty_usd: 2000
votes: 170
cve: []
program: "[[programs/slack|Slack]]"
reporter: "sandrogauci"
source: "https://hackerone.com/reports/531032"
title: "Slack DTLS uses a private key that is in the public domain, which may lead to SRTP stream hijack"
---
# Slack DTLS uses a private key that is in the public domain, which may lead to SRTP stream hijack

> **Severity:** High | **Bounty:** 2,000 USD | **Votes:** 170 | **Program:** Slack | **Disclosed:** 2020-03-12

- Report: [https://hackerone.com/reports/531032](https://hackerone.com/reports/531032)
- CWE: Use of Hard-coded Cryptographic Key
- Submitted: 2019-04-08T09:20:55.916Z

## Report summary

DTLS certificate used for Slack WebRTC calls was previously included in the Janus (WebRTC server) together with the private key, thus considered public domain.

## Timeline

- **Report Filed**
- **2019-04-08** @maxfeldman: Thanks @sandrogauci! We're looking into this and will update shortly!
- **Report Triaged**
- **2019-04-09** @sandrogauci: thanks!
- **2019-04-28** @maxfeldman: Still working on this - thanks for your patience @sandrogauci!
- **2019-04-28** @sandrogauci: thanks for the update @maxfeldman
- **2019-05-23** @sandrogauci: Hi Max, It's been a while. Are you still working on this?
- **2019-05-23** @maxfeldman: Hi @sandrogauci,

Apologies for the delay - we've concluded the investigation and are updated - thank you very much for the report!

Max
- **Report Resolved**
- **Bounty Awarded**
- **2019-05-23** @sandrogauci: Glad to hear it. Thanks @maxfeldman
- **2020-01-21** @sandrogauci: Hi @maxfeldman can you make this report public please?
- **Agreed On Going Public**
- **Cancelled Disclosure Request**
- **2020-02-28** @sandrogauci: Hi @bugtriage-josh - that comes unexpectedly as we were under the impression that you successfully resolved this issue almost a year ago. We have an educational presentation to give at Kamailio World and were hoping to use this report as an example of our contribution to the WebRTC security space. We're not interested in making Slack look bad of course; only to have practical and real examples to the VoIP/WebRTC developers in the audience.

Could you let me know when your review is planned to be complete so that we can prepare accordingly?
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
