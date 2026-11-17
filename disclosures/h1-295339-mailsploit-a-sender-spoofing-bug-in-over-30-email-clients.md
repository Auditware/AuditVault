---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/user-interface-ui-misrepresentation-of-critical-information
  - env/web
substate: "resolved"
weakness: "User Interface (UI) Misrepresentation of Critical Information"
enriched: true
date: 2019-09-19
submitted: 2017-12-05T11:38:04.408Z
bounty_usd: null
votes: 29
cve: []
program: "[[programs/ibb|Internet Bug Bounty]]"
reporter: "pwnsdx"
source: "https://hackerone.com/reports/295339"
title: "Mailsploit: a sender spoofing bug in over 30 email clients"
---
# Mailsploit: a sender spoofing bug in over 30 email clients

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 29 | **Program:** Internet Bug Bounty | **Disclosed:** 2019-09-19

- Report: [https://hackerone.com/reports/295339](https://hackerone.com/reports/295339)
- CWE: User Interface (UI) Misrepresentation of Critical Information
- Submitted: 2017-12-05T11:38:04.408Z

## Timeline

- **Report Filed**
- **Report Not Applicable**
- **2018-04-09** @pwnsdx: Hello,

> This bounty program is intended for vulnerabilities that exist in core internet infrastructure and protocols.

It does, we're here talking of the Mail protocol and more specifically of the RFC-1342 (and its successors). A lot of email clients and MTAs were not protected against Mailsploit before it was released.

> Potential issues that only impact a single vendor should be disclosed directly to the appropriate vendor.

Over [40 vendors](https://docs.google.com/spreadsheets/d/1jkb_ZybbAoUA43K902lL-sB7c1HMQ78-fhQ8nowJCQk) were affected by this issue. The RFC-1342 caused a lot of confusions on how to deal properly with the representation of non-ASCII text which is why so many vendors are affected.

I don't understand why this issue has been set to "Not applicable" to be honest.

Regards,
Sabri
- **Agreed On Going Public**
- **2018-04-19** @pwnsdx: I would also like to underline the reason why I created this report in the first place:

From your [Hackerone homepage](https://hackerone.com/internet) you say:

To qualify, vulnerabilities must meet the following criteria:

- Be implementation agnostic: vulnerability is present in implementations from multiple vendors or a vendor with dominant market share. Do not send us vulnerabilities that only impact a single website, product, or project. -> **Positive**
- Be open source: finding manifests itself in at least one popular open source project. -> **Positive**

In addition, vulnerabilities should meet most of the following criteria:

- Be widespread: vulnerability manifests itself across a wide range of products, or impacts a large number of end users. -> **Positive**
- Have critical impact: vulnerability has extreme negative consequences for the general public. -> **More or less positive**
- Be novel: vulnerability is new or unusual in an interesting way. -> **Positive**

It also got [media coverage](https://www.wired.com/story/mailsploit-lets-hackers-forge-perfect-email-spoofs/) and has even been [highlighted on your blog](https://www.hackerone.com/zerodaily/2017-12-06).

So please explain clearer why you set this report on "Not applicable" because I still can't figure out why.

Regards,
Sabri
- **Report Reopened**
- **2018-05-10** @pwnsdx: Hello @reed,

Thank you. Of all the companies known to be vulnerable to Mailsploit: Hushmail, Yahoo (mobile only), Mail.ru, Protonmail and Intercom decided to offer monetary rewards.

Regards,
Sabri
- **2018-05-10** @reed: Thanks, @pwnsdx.

Part of the IBB's charter (https://internetbugbounty.org/charter.html) includes "Mind the Gap":

> In order to most efficiently allocate funds, the Panel should be cognizant of what software is already covered by other efforts, and how. For example, if another organization rewards for providing patches to open source projects or funds secure development, the IBB should not duplicate this effort, but instead serve in a complementary fashion by rewarding researchers that identify and disclose vulnerabilities to the maintainers. The IBB should proactively identify software that has a gap in rewards for vulnerability research; in conjunction with other criteria, this is a good indicator that the software should be moved into scope.

As this bug was bountied via various companies, our Mind the Gap stipulation may cause this to not be awarded.

We'll be back in touch once we discuss this among the panel.
- **2018-05-10** @pwnsdx: Understood. It was obvious that at least one company would give a monetary reward since the creation of Bug Bounty programs are increasing these days.. However, they did not rewarded the bug itself but rather the fact that their code was vulnerable to it. Anyway, not rewarded is still better than not accepted :)
- **Report Vulnerability Types Updated**
- **Report Severity Updated**
- **Report Resolved**
- **2018-07-01** @pwnsdx: Hello, no problem and thank you! Sabri
- **Not Eligible For Bounty**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
