---
tags:
  - type/disclosure
  - platform/hackerone
  - severity/high
  - cwe/improper-restriction-of-authentication-attempts
  - env/web
substate: "resolved"
weakness: "Improper Restriction of Authentication Attempts"
enriched: true
date: 2023-06-02
submitted: 2023-02-20T11:47:15.351Z
bounty_usd: null
votes: 53
cve: "CVE-2023-32319"
program: "[[programs/nextcloud|Nextcloud]]"
reporter: "hackit_bharat"
source: "https://hackerone.com/reports/1879549"
title: "Basic auth header on WebDAV requests is not bruteforce protected"
---
# Basic auth header on WebDAV requests is not bruteforce protected

> **Severity:** High | **Bounty:** undisclosed | **Votes:** 53 | **Program:** Nextcloud | **Disclosed:** 2023-06-02

- Report: [https://hackerone.com/reports/1879549](https://hackerone.com/reports/1879549)
- CWE: Improper Restriction of Authentication Attempts | CVE: CVE-2023-32319
- Submitted: 2023-02-20T11:47:15.351Z

## Report summary

Security advisory at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-mr7q-xf62-fw54

## Timeline

- **Report Filed**
- **2023-02-20** @Nextcloud: Thanks a lot for reporting this potential issue back to us!

Our security team will take a look at this issue as soon as possible. For obvious reasons we'd like to ask you to not disclose this issue to any other party.
- **Report Triaged**
- **2023-03-03** @hackit_bharat: Hi @nickvergessen ,

I hope you are doing well.

Any updates on this?

Thanks and Regards,
BhaRat
- **2023-03-03** @nickvergessen: We worked on a patch an plan to include it in our upcoming maintenance release.
Want to give it a try?
{F2206690}
- **2023-03-03** @hackit_bharat: Thanks @nickvergessen ,

I hope you are doing well.

Thanks for sharing the information. Till now I will go through the code once.

Thanks and Regards,
BhaRat
- **2023-03-14** @hackit_bharat: Hi @nickvergessen ,

I hope you are doing well,

Any updates on this?

Thanks and Regards,
BhaRat
- **2023-03-15** @nickvergessen: It should be part of our upcoming maintenance releases (final version is planned for next week thursday)
- **2023-03-15** @hackit_bharat: Hi @nickvergessen ,

Sure. Thanks for the update.
- **2023-03-23** @hackit_bharat: Hi @nickvergessen ,

I hope you are doing well.

Any updates on this?

Thanks and Regards,
BhaRat
- **2023-03-24** @nickvergessen: It was fixed with https://github.com/nextcloud/server/pull/37227 for yesterdays update as far as I can see
- **Report Resolved**
- **2023-03-24** @hackit_bharat: Hi @nickvergessen ,

Thanks for the update.

Here's my GitHub account :- https://github.com/Hackitbharat

Any updates on Bounty?

Thanks and Regards,
BhaRat
- **2023-04-09** @hackit_bharat: Hi @nickvergessen ,

I hope you are doing well.

Any updates on bounty?

Thanks and Regards,
BhaRat
- **2023-04-12** @nickvergessen: I was not. I was sick and am now recovering, but the sickness skipped the scheduled calls, so might take another week for the bounties, sorry about that.
- **2023-04-12** @hackit_bharat: Hi @nickvergessen ,

No worries of bounties and updates. Please take Care of your health it's more important than Everything.

I hope you will be good as soon as possible.

Take Care.

Thanks and Regards,
BhaRat
- **Bounty Awarded**
- **2023-04-14** @hackit_bharat: Hi @nickvergessen ,

I hope you are doing well.

Thanks for the Bounty.

Thanks and Regards,
BhaRat
- **Report Severity Updated**
- **Report Title Updated**
- **2023-05-16** @nickvergessen: Security advisory at https://github.com/nextcloud/security-advisories/security/advisories/GHSA-mr7q-xf62-fw54
- **Cve Id Added**
- **Agreed On Going Public**
- **Agreed On Going Public**
- **Report Became Public**
- **2023-06-02** @hackit_bharat: Hi @nickvergessen ,

Please also provide update on other Reports as well.

Thanks and Regards,
BhaRat
- **2023-06-02** @hackit_bharat: .
