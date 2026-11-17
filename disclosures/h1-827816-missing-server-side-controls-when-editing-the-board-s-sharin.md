---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-access-control-generic
  - env/web
substate: "resolved"
weakness: "Improper Access Control - Generic"
enriched: true
date: 2020-09-28
submitted: 2020-03-24T11:17:34.706Z
bounty_usd: null
votes: 16
cve: "CVE-2020-8182"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "warsocks"
source: "https://hackerone.com/reports/827816"
title: "Missing server side controls when editing the board’s sharing permissions per user"
---
# Missing server side controls when editing the board’s sharing permissions per user

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 16 | **Program:** Nextcloud | **Disclosed:** 2020-09-28

- Report: [https://hackerone.com/reports/827816](https://hackerone.com/reports/827816)
- CWE: Improper Access Control - Generic | CVE: CVE-2020-8182
- Submitted: 2020-03-24T11:17:34.706Z

## Timeline

- **Report Filed**
- **2020-03-24** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. We will reply to your report within 72 hours, usually much faster. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **2020-03-24** @nickvergessen: Thanks for the report, I will forward this to the Deck Developers
- **2020-03-24** @warsocks: Thank you for a quick response. Will look forward to receiving some feedback from the Deck Developers then.
- **Report Severity Updated**
- **Report Triaged**
- **2020-04-01** @warsocks: Glad you managed to reproduce it well. If there is anyway I could help you, or any further questions, fire away.
- **2020-04-06** @juliushaertl: Hi,

just a quick update. We have a fix for the issue prepared at https://github.com/nextcloud/deck/pull/1653/files#diff-e448525c1380ca5a2202113c6f85e094 and will prepare new releases of the deck app once that has been reviewed.
- **2020-04-08** @warsocks: Thank you for the update, will review.
- **2020-04-08** @warsocks: Just to make sure we both understand how the functionality is intended to behave now after the fix, could you please clarify this part of your sentence "...updating permissions will always be limited to the own permission level" with an example please.
- **2020-04-09** @warsocks: In v0.8.2 I was not able to replicate the same vulnerability anymore and when trying to elevate my permissions always received the response HTTP/1.1 403 Forbidden. So from my side, it can be counted as fixed.
- **Report Resolved**
- **2020-04-09** @warsocks: Below you can find my information. I would also like to know if a CVE be requested for the vulnerability and is my finding eligible for a bounty? :)

Name: Silvia Väli
E-mail: silvia@clarifiedsecurity.com
Website: https://www.clarifiedsecurity.com/silvia-vali/
Company: Clarified Security
- **Bounty Awarded**
- **2020-04-09** @nickvergessen: All our security issues will be published as a Security Advisory on our website and then be requested a CVE after ~4 weeks
- **2020-04-14** @warsocks: Thank you so much for assigning a bounty @Nextcloud, @nickvergessen and the Deck developers and a Happy Easter!
- **2020-05-18** @warsocks: Hello, you mentioned I would be credited in your official advisory. I have not managed to find a reference to it, could you kindly direct me to it please?
- **Report Severity Updated**
- **Changed Scope**
- **2020-06-08** @nickvergessen: Sorry for the long delay.

The advisory will be published at https://nextcloud.com/security/advisory/?id=NC-SA-2020-025 soon.
We got CVE-2020-8182 assigned for the issue which will be published soon too.
- **2020-06-15** @nickvergessen: Published
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
